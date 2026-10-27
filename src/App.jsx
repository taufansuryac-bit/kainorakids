/**
 * KAINORA KIDS - MAIN APP
 * Router berbasis state (?view=...) + wiring toko: sinkronisasi Firestore/Auth,
 * modal global dan produk aktif.
 */

import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { productFromLocation, productHref } from './utils/productRoutes';
import { ShopNotFound } from './components/shop/ShopNotFound';
import { useStore } from './context/StoreContext';
import { BuyerBackendGate } from './components/account/BuyerBackendGate';
import { AccountDialog } from './components/account/AccountUI';
import { Navbar } from './components/layout/Navbar';
import { HalftoneFooter as Footer } from './components/fashion/HalftoneFooter';
import { TypeRemixPreloader } from './components/fashion/motion';
import { ChatLauncher } from './components/ai/ChatLauncher';
import { CookieConsentBanner } from './components/ui/CookieConsentBanner';
import { ToastNotification } from './components/ui/ToastNotification';
import { MiniCartDrawer } from './components/account/MiniCartNotice';
const AuthModal = lazy(() => import('./components/account/AccountDialogs').then(module => ({default:module.AuthModal})));
const FooterPopupModal = lazy(() => import('./components/ui/Modals').then(module => ({default:module.FooterPopupModal})));
const HomeQuickViewModal = lazy(() => import('./components/ui/Modals').then(module => ({default:module.HomeQuickViewModal})));

import { HomeView } from './pages/HomeView';
import { ProductsPageView } from './pages/ProductsPageView';
import { ProductDetailView } from './pages/ProductDetailView';
const CartView = lazy(() => import('./pages/CartView').then(module => ({ default: module.CartView })));
const CheckoutView = lazy(() => import('./pages/CheckoutView').then(module => ({ default: module.CheckoutView })));
const WishlistView = lazy(() => import('./pages/WishlistView').then(module => ({ default: module.WishlistView })));
const ProfileView = lazy(() => import('./pages/ProfileView').then(module => ({ default: module.ProfileView })));
const OrdersView = lazy(() => import('./pages/OrdersView').then(module => ({ default: module.OrdersView })));
const BlogView = lazy(() => import('./pages/BlogView').then(module => ({ default: module.BlogView })));
const AllReviewsView = lazy(() => import('./pages/AllReviewsView').then(module => ({ default: module.AllReviewsView })));
const AffiliateView = lazy(() => import('./pages/AffiliateView').then(module => ({ default: module.AffiliateView })));
const ContentAdminView = lazy(() => import('./pages/ContentAdminView'));
const BuyerGuideView = lazy(() => import('./pages/BuyerGuideView').then(module => ({default:module.BuyerGuideView})));
const LazySizeStudioView = lazy(() => import('./pages/SizeStudioView').then(module => ({default:module.SizeStudioView})));

function App({initialLocation=globalThis.location,SizeStudioComponent=LazySizeStudioView}) {
  const { view, products, isAuthModalOpen, setIsAuthModalOpen } = useStore();
  const [authRequested,setAuthRequested]=useState(false);
  useEffect(()=>{if(isAuthModalOpen)setAuthRequested(true);},[isAuthModalOpen]);

  // Produk aktif (halaman detail) & quick-view beranda
  const [activeProduct, setActiveProductState] = useState(() => productFromLocation(products, initialLocation));
  const setActiveProduct = useCallback(product => {
    if (product && view === 'productDetail' && productFromLocation(products, window.location)?.id !== product.id) {
      window.history.pushState({ view: 'productDetail' }, '', productHref(product));
    }
    setActiveProductState(product);
  }, [view, products]);
  useEffect(() => {
    const sync = () => setActiveProductState(productFromLocation(products, window.location));
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, [products]);
  useEffect(() => {
    const current = products.find(product => String(product.id) === String(activeProduct?.id));
    if (view === 'productDetail' && current) window.history.replaceState({ view: 'productDetail' }, '', productHref(current));
  }, [view, activeProduct, products]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [footerPopup, setFooterPopup] = useState(null);

  useEffect(() => { if (view !== 'blog') window.scrollTo(0, 0); }, [view]);

  useEffect(() => { if (activeProduct) window.scrollTo(0, 0); }, [activeProduct]);

  // Kartu produk/artikel dari chat AI mengirim event ini
  const { setView } = useStore();
  useEffect(() => {
    const openProduct = (e) => { if (e.detail) { setActiveProduct(e.detail); setView('productDetail'); } };
    const openBlog = () => setView('blog');
    window.addEventListener('OPEN_PRODUCT', openProduct);
    window.addEventListener('OPEN_BLOG', openBlog);
    return () => { window.removeEventListener('OPEN_PRODUCT', openProduct); window.removeEventListener('OPEN_BLOG', openBlog); };
  }, [setView, setActiveProduct]);

  const renderView = () => {
    switch (view) {
      case 'home': return <HomeView setSelectedProduct={setSelectedProduct} />;
      case 'products': return <ProductsPageView setActiveProduct={setActiveProduct} />;
      case 'productDetail':
        return products.some(product => String(product.id) === String(activeProduct?.id))
          ? <ProductDetailView activeProduct={products.find(product => String(product.id) === String(activeProduct.id))} setActiveProduct={setActiveProduct} />
          : <ShopNotFound />;
      case 'cart': return <CartView />;
      case 'checkout': return <CheckoutView />;
      case 'wishlist': return <WishlistView setActiveProduct={setActiveProduct} />;
      case 'profile': return <ProfileView />;
      case 'orders': return <OrdersView />;
      case 'guide': return <BuyerGuideView />;
      case 'sizeGuide': return <SizeStudioComponent />;
      case 'blog': return <BlogView />;
      case 'allReviews': return <AllReviewsView />;
      case 'affiliate': return <Suspense fallback={<p className="p-12" role="status">Menyiapkan Kainora Creator Club…</p>}><AffiliateView /></Suspense>;
      case 'admin': return <Suspense fallback={<p className="p-12" role="status">Menyiapkan Content Studio…</p>}><ContentAdminView /></Suspense>;
      default: return <HomeView setSelectedProduct={setSelectedProduct} />;
    }
  };

  return (
    <div className="store-shell fashion-shell min-h-screen bg-cream font-sans text-ink antialiased">
      <TypeRemixPreloader enabled={view === 'home' && typeof document !== 'undefined' && document.getElementById('root')?.dataset.prerender !== 'home'} />
      <BuyerBackendGate immediate={isAuthModalOpen || ['profile','checkout','orders','allReviews'].includes(view)} />

      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[9000] focus:rounded-full focus:border-[3px] focus:border-ink focus:bg-brand-yellow focus:px-4 focus:py-2 focus:font-black">
        Lompat ke konten
      </a>

      {view !== 'blog' && view !== 'admin' && <Navbar />}
      <div id="main" tabIndex={-1} className="min-h-[80vh]">
        <Suspense fallback={<p className="p-12" role="status">Menyiapkan halaman…</p>}>{renderView()}</Suspense>
      </div>
      {view !== 'blog' && view !== 'admin' && <Footer openPopup={setFooterPopup} />}

      {view !== 'admin' && <><ChatLauncher /><CookieConsentBanner /></>}

      <Suspense fallback={null}>{selectedProduct && <HomeQuickViewModal selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} setActiveProduct={setActiveProduct} />}{footerPopup && <FooterPopupModal footerPopup={footerPopup} setFooterPopup={setFooterPopup} />}</Suspense>
      {(authRequested || isAuthModalOpen) && <Suspense fallback={<AccountDialog open={isAuthModalOpen} close={()=>setIsAuthModalOpen(false)} title="Menyiapkan akun Anda."><p role="status">Sebentar, formulir akun sedang dimuat…</p></AccountDialog>}><AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} /></Suspense>}
      <MiniCartDrawer />
      <ToastNotification />

    </div>
  );
}

export default App;
