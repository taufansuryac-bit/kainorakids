/**
 * KAINORA KIDS - MAIN APP
 * Router berbasis state (?view=...) + wiring toko: sinkronisasi Firestore/Auth,
 * modal global, produk aktif, preloader, dan transisi halaman papan catur.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { useStore, DatabaseSync, AuthListenerSync } from './context/StoreContext';
import { TopBar } from './components/layout/TopBar';
import { Navbar } from './components/layout/Navbar';
import { FooterComponent as Footer } from './components/layout/Footer';
import KainoraAI from './components/ai/KainoraAI';
import { CookieConsentBanner } from './components/ui/CookieConsentBanner';
import { ToastNotification, MiniCartDrawer, AuthModal, FooterPopupModal, HomeQuickViewModal } from './components/ui/Modals';
import { Preloader, shouldShowPreloader } from './components/neo/Preloader';
import { CheckerWipe } from './components/motion/CheckerWipe';
import { initAuth } from './firebase';

import { HomeView } from './pages/HomeView';
import { ProductsPageView } from './pages/ProductsPageView';
import { ProductDetailView } from './pages/ProductDetailView';
import { CartView } from './pages/CartView';
import { CheckoutView } from './pages/CheckoutView';
import { WishlistView } from './pages/WishlistView';
import { ProfileView } from './pages/ProfileView';
import { OrdersView } from './pages/OrdersView';
import { BlogView } from './pages/BlogView';
import { AllReviewsView } from './pages/AllReviewsView';
import { AffiliateView } from './pages/AffiliateView';
import { AdminDashboardView } from './pages/AdminDashboardView';

function App() {
  const { view, isAuthModalOpen, setIsAuthModalOpen } = useStore();
  const reduce = useReducedMotion();

  // Produk aktif (halaman detail) & quick-view beranda
  const [activeProduct, setActiveProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [footerPopup, setFooterPopup] = useState(null);

  // Preloader sekali per sesi
  const [preloading, setPreloading] = useState(() => shouldShowPreloader());
  const endPreload = useCallback(() => setPreloading(false), []);

  // Transisi halaman: tirai papan catur menutup → ganti view → membuka
  const [shownView, setShownView] = useState(view);
  const [covering, setCovering] = useState(false);

  useEffect(() => { initAuth(); }, []);

  useEffect(() => {
    if (view === shownView) return;
    if (reduce) { setShownView(view); window.scrollTo(0, 0); return; }
    setCovering(true);
  }, [view, shownView, reduce]);

  const onCovered = useCallback(() => {
    setShownView(view);
    window.scrollTo(0, 0);
    requestAnimationFrame(() => setCovering(false));
  }, [view]);

  // Perilaku asli: gambar tidak bisa di-drag / klik kanan
  useEffect(() => {
    const block = (e) => { if (e.target.tagName === 'IMG') e.preventDefault(); };
    document.addEventListener('contextmenu', block);
    document.addEventListener('dragstart', block);
    return () => { document.removeEventListener('contextmenu', block); document.removeEventListener('dragstart', block); };
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [activeProduct]);

  // Kartu produk/artikel dari chat AI mengirim event ini
  const { setView } = useStore();
  useEffect(() => {
    const openProduct = (e) => { if (e.detail) { setActiveProduct(e.detail); setView('productDetail'); } };
    const openBlog = () => setView('blog');
    window.addEventListener('OPEN_PRODUCT', openProduct);
    window.addEventListener('OPEN_BLOG', openBlog);
    return () => { window.removeEventListener('OPEN_PRODUCT', openProduct); window.removeEventListener('OPEN_BLOG', openBlog); };
  }, [setView]);

  const renderView = () => {
    switch (shownView) {
      case 'home': return <HomeView setSelectedProduct={setSelectedProduct} />;
      case 'products': return <ProductsPageView setActiveProduct={setActiveProduct} />;
      case 'productDetail':
        return activeProduct
          ? <ProductDetailView activeProduct={activeProduct} setActiveProduct={setActiveProduct} />
          : <ProductsPageView setActiveProduct={setActiveProduct} />;
      case 'cart': return <CartView />;
      case 'checkout': return <CheckoutView />;
      case 'wishlist': return <WishlistView setActiveProduct={setActiveProduct} />;
      case 'profile': return <ProfileView />;
      case 'orders': return <OrdersView />;
      case 'blog': return <BlogView />;
      case 'allReviews': return <AllReviewsView />;
      case 'affiliate': return <AffiliateView />;
      case 'admin': return <AdminDashboardView />;
      default: return <HomeView setSelectedProduct={setSelectedProduct} />;
    }
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-cream font-sans text-ink antialiased">
      <DatabaseSync />
      <AuthListenerSync />

      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[9000] focus:rounded-full focus:border-[3px] focus:border-ink focus:bg-brand-yellow focus:px-4 focus:py-2 focus:font-black">
        Lompat ke konten
      </a>

      <TopBar />
      <Navbar />
      <main id="main" className="min-h-[80vh]">
        {renderView()}
      </main>
      <Footer openPopup={setFooterPopup} />

      <KainoraAI />
      <CookieConsentBanner />

      <HomeQuickViewModal selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} setActiveProduct={setActiveProduct} />
      <FooterPopupModal footerPopup={footerPopup} setFooterPopup={setFooterPopup} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <MiniCartDrawer />
      <ToastNotification />

      {!reduce && <CheckerWipe covering={covering} onCovered={onCovered} cols={8} rows={5} duration={0.18} stagger={0.016} />}
      {preloading && <Preloader onDone={endPreload} />}
    </div>
  );
}

export default App;
