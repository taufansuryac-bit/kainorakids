import React, { useState, useEffect, useCallback, createContext, useContext, useMemo, useRef } from 'react';
import storeContent from '../content/store.json';
import { canOrder } from '../utils/pricing';
import { storefrontView, viewHref } from '../utils/productRoutes';
import { INITIAL_PRODUCTS } from '../constants/data';
import { analyticsItem, track } from '../utils/analytics';

// ============================================================================
// 3. STORE CONTEXT (GLOBAL STATE)
// ============================================================================
const StoreContext = createContext();
export const useStore = () => useContext(StoreContext);
const viewFromURL = (location = window.location) => storefrontView(location);
const GUEST_CART_KEY = 'kainora-guest-cart';
// Only id/size/qty are stored; price and photos are refreshed from the current
// catalogue so a returning guest never checks out a stale price or a removed motif.
function readGuestCart(products) {
  try {
    const saved = JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]');
    if (!Array.isArray(saved)) return [];
    return saved.flatMap(item => {
      const product = products.find(p => String(p.id) === String(item?.id));
      const qty = Number(item?.qty);
      if (!product || !canOrder(product, item.size) || !Number.isInteger(qty) || qty < 1) return [];
      return [{ ...product, catalogPreview: product.catalogPreview === true, size: item.size, qty: Math.min(99, qty), cartId: item.cartId || Date.now() + Math.random() }];
    });
  } catch { return []; }
}

export const StoreProvider = ({ children, initialLocation = globalThis.location }) => {
  const [view, setViewState] = useState(() => {
    try {
      return viewFromURL(initialLocation);
    } catch(e) { return 'home'; }
  });
  const viewRef = useRef(view);
  viewRef.current = view;

  useEffect(() => {
    try {
      // Preserve article deep links (and other route parameters) on initial load.
      window.history.replaceState({ ...window.history.state, view }, '', window.location.href);
      const handlePopState = (event) => {
        if (event.state && event.state.view) {
          viewRef.current = event.state.view;setViewState(event.state.view);
        } else {
          const next = viewFromURL();viewRef.current = next;setViewState(next);
        }
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    } catch(e) {}
  }, []);

  const setView = useCallback((newView) => {
    if (viewRef.current !== newView) {
      try { window.history.pushState({ view: newView }, '', viewHref(newView)); } catch(e) {}
    }
    viewRef.current = newView;setViewState(newView);
  }, []);

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState(storeContent.products);
  const [isProductsLoaded, setIsProductsLoaded] = useState(true);
  const [content, setContent] = useState(storeContent);
  const applyContent = useCallback(next => { setContent(next); setProducts(next.products); }, []);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [globalGenderFilter, setGlobalGenderFilter] = useState('Semua');
  const [globalSearchState, setGlobalSearchState] = useState({ query: '', gender: 'Semua', age: 'Semua' });
  const [aiSizeChart, setAiSizeChart] = useState(null);

  const toastTimer = useRef(null);
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(null), 4000);
  }, []);

  // Guests keep their basket across reloads; signed-in buyers use the account
  // basket (useBuyerBaskets), so the local copy is dropped once they log in.
  // Restored after mount rather than in useState so hydration matches the prerender.
  const guestCartRestored = useRef(false);
  useEffect(() => {
    const saved = readGuestCart(storeContent.products);
    if (saved.length) setCart(current => current.length ? current : saved);
  }, []);
  useEffect(() => {
    if (!guestCartRestored.current) { guestCartRestored.current = true; return; }
    try {
      if (user?.email) localStorage.removeItem(GUEST_CART_KEY);
      else localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart.map(({ id, size, qty, cartId }) => ({ id, size, qty, cartId }))));
    } catch { /* Storage is optional. */ }
  }, [cart, user?.email]);
  const [basketOwner,setBasketOwner]=useState(null);
  const basketReady=!user?.uid||basketOwner===user.uid;

  const addToCart = useCallback((p, s, q) => {
    if (!canOrder(p, s) || !Number.isInteger(q) || q < 1) { showToast('Harga, ukuran atau stok produk belum tersedia.'); return; }
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id && i.size === s);
      if(ex) return prev.map(i => i === ex ? {...i, qty: i.qty + q} : i);
      return [...prev, {...p, catalogPreview: p.catalogPreview === true || INITIAL_PRODUCTS.includes(p), size: s, qty: q, cartId: Date.now()}];
    });
    setIsMiniCartOpen(true);
    track('add_to_cart', { currency: 'IDR', value: Number(p.price) * q, items: [analyticsItem(p, s, q)] });
    showToast('Baju lucu berhasil masuk keranjang! 🛍️');
  }, [showToast]);

  const updateCartQty = useCallback((id, d) => setCart(p => p.map(it => it.cartId === id ? {...it, qty: Math.max(1, it.qty + d)} : it)), []);
  const removeFromCart = useCallback((id) => setCart(p => p.filter(it => it.cartId !== id)), []);

  // A motif chosen while logged out is saved once the account basket is ready.
  const pendingWishlist = useRef(null);
  useEffect(() => {
    const id = pendingWishlist.current;
    if (id === null || !user?.email || !basketReady) return;
    pendingWishlist.current = null;
    setWishlist(p => p.some(value => String(value) === String(id)) ? p : [...p, id]);
    showToast('Motif pilihanmu sudah disimpan ke Favorit. ❤️');
  }, [user?.email, basketReady, showToast]);

  const toggleWishlist = useCallback((e, id) => { 
    e.stopPropagation();
    if (!user || !user.email) {
      pendingWishlist.current = id;
      showToast('Login dulu ya untuk menyimpan baju favorit! 🥰');
      setIsAuthModalOpen(true);
      return;
    }
    setWishlist(p => {
      const isLoved = p.some(value => String(value) === String(id));
      if(!isLoved) showToast('Yeay! Berhasil ditambahkan ke Favorit. ❤️');
      return isLoved ? p.filter(i => String(i) !== String(id)) : [...p, id];
    }); 
  }, [user, showToast, setIsAuthModalOpen]);

  const value = { 
    view, setView, cart, setCart, wishlist, setWishlist, user, setUser, basketReady, setBasketOwner,
    products, setProducts, isProductsLoaded, setIsProductsLoaded, content, applyContent,
    isMiniCartOpen, setIsMiniCartOpen, toastMessage, setToastMessage, showToast, 
    addToCart, updateCartQty, removeFromCart, toggleWishlist, isAuthModalOpen, setIsAuthModalOpen,
    globalGenderFilter, setGlobalGenderFilter,
    globalSearchState, setGlobalSearchState,
    aiSizeChart, setAiSizeChart, initialLocation
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

