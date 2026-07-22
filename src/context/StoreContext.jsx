import React, { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react';
import { db, auth, appId, ADMIN_EMAIL } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, setDoc, getDoc, where, deleteDoc, updateDoc } from "firebase/firestore";
import { INITIAL_PRODUCTS } from '../constants/data';
import { signOut, signInAnonymously } from "firebase/auth";

// ============================================================================
// 3. STORE CONTEXT (GLOBAL STATE)
// ============================================================================
const StoreContext = createContext();
export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
  const [view, setViewState] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('view') || 'home';
    } catch(e) { return 'home'; }
  });

  useEffect(() => {
    try {
      window.history.replaceState({ view }, '', `?view=${view}`);
      const handlePopState = (event) => {
        if (event.state && event.state.view) {
          setViewState(event.state.view);
        } else {
          setViewState('home');
        }
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    } catch(e) {}
  }, []);

  const setView = useCallback((newView) => {
    setViewState(prev => {
      if (prev !== newView) {
        try { window.history.pushState({ view: newView }, '', `?view=${newView}`); } catch(e) {}
      }
      return newView;
    });
  }, []);

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [isProductsLoaded, setIsProductsLoaded] = useState(false);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [globalGenderFilter, setGlobalGenderFilter] = useState('Semua');
  const [globalSearchState, setGlobalSearchState] = useState({ query: '', gender: 'Semua', age: 'Semua' });
  const [aiSizeChart, setAiSizeChart] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  const addToCart = useCallback((p, s, q) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id && i.size === s);
      if(ex) return prev.map(i => i === ex ? {...i, qty: i.qty + q} : i);
      return [...prev, {...p, size: s, qty: q, cartId: Date.now()}];
    });
    setIsMiniCartOpen(true);
    showToast('Baju lucu berhasil masuk keranjang! 🛍️');
  }, [showToast]);

  const updateCartQty = useCallback((id, d) => setCart(p => p.map(it => it.cartId === id ? {...it, qty: Math.max(1, it.qty + d)} : it)), []);
  const removeFromCart = useCallback((id) => setCart(p => p.filter(it => it.cartId !== id)), []);

  const toggleWishlist = useCallback((e, id) => { 
    e.stopPropagation();
    if (!user || !user.email) {
      showToast('Login dulu ya untuk menyimpan baju favorit! 🥰');
      setIsAuthModalOpen(true);
      return;
    }
    setWishlist(p => {
      const isLoved = p.includes(id);
      if(!isLoved) showToast('Yeay! Berhasil ditambahkan ke Favorit. ❤️');
      return isLoved ? p.filter(i => i !== id) : [...p, id];
    }); 
  }, [user, showToast, setIsAuthModalOpen]);

  const value = { 
    view, setView, cart, setCart, wishlist, setWishlist, user, setUser, 
    products, setProducts, isProductsLoaded, setIsProductsLoaded,
    isMiniCartOpen, setIsMiniCartOpen, toastMessage, setToastMessage, showToast, 
    addToCart, updateCartQty, removeFromCart, toggleWishlist, isAuthModalOpen, setIsAuthModalOpen,
    globalGenderFilter, setGlobalGenderFilter,
    globalSearchState, setGlobalSearchState,
    aiSizeChart, setAiSizeChart
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const DatabaseSync = () => {
  const { setProducts, setIsProductsLoaded, setWishlist, setCart, user, setAiSizeChart } = useStore();

  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'products'), (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const firestoreIds = prods.map(p => String(p.id));
      const merged = [
        ...INITIAL_PRODUCTS.filter(p => !firestoreIds.includes(String(p.id))),
        ...prods
      ];
      setProducts(merged);
      setIsProductsLoaded(true);
    });

    const unsubAiSettings = onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'config', 'aiSettings'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().sizeChart) {
        setAiSizeChart(docSnap.data().sizeChart);
      } else {
        setAiSizeChart("Tinggi 90-100cm (Size S), Tinggi 100-110cm (Size M), Tinggi 110-120cm (Size L), Tinggi 120-130cm (Size XL)"); // Default fallback
      }
    });

    return () => { unsubProducts(); unsubAiSettings(); };
  }, [setProducts, setIsProductsLoaded, setAiSizeChart]);

  useEffect(() => {
    if (!user || !user.email) {
      setWishlist([]); setCart([]);
      return;
    }
    const unsubWishlist = onSnapshot(doc(db, 'artifacts', appId, 'users', user.uid, 'private', 'wishlist'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().items) setWishlist(docSnap.data().items);
      else setWishlist([]);
    });
    const unsubCart = onSnapshot(doc(db, 'artifacts', appId, 'users', user.uid, 'private', 'cart'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().items) setCart(docSnap.data().items);
      else setCart([]);
    });
    return () => { unsubWishlist(); unsubCart(); };
  }, [user, setWishlist, setCart]);

  return null;
};

export const AuthListenerSync = () => {
  const { setUser } = useStore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        if (currentUser.isAnonymous) {
          setUser({ email: null, isAnonymous: true });
        } else {
          try {
            const profileSnap = await getDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'profile', 'data'));
            if (profileSnap.exists()) {
              setUser({ ...currentUser, ...profileSnap.data() });
            } else {
              setUser({ ...currentUser, email: currentUser.email });
            }
          } catch(e) {
            setUser({ ...currentUser, email: currentUser.email });
          }
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [setUser]);

  return null;
};
