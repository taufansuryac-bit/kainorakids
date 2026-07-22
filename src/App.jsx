/**
 * KAINORA KIDS - MAIN APP
 * Router utama untuk Kainora Kids website
 */

import React, { useEffect } from 'react';
import { useStore } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { FooterComponent as Footer } from './components/layout/Footer';
import KainoraAI from './components/KainoraAI';
import { CookieConsentBanner } from './components/ui/CookieConsentBanner';
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
  const { view } = useStore();

  useEffect(() => {
    initAuth();
  }, []);

  const renderView = () => {
    switch (view) {
      case 'home': return <HomeView />;
      case 'products': return <ProductsPageView />;
      case 'productDetail': return <ProductDetailView />;
      case 'cart': return <CartView />;
      case 'checkout': return <CheckoutView />;
      case 'wishlist': return <WishlistView />;
      case 'profile': return <ProfileView />;
      case 'orders': return <OrdersView />;
      case 'blog': return <BlogView />;
      case 'allReviews': return <AllReviewsView />;
      case 'affiliate': return <AffiliateView />;
      case 'admin': return <AdminDashboardView />;
      default: return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
      <Navbar />
      <main className="min-h-[80vh]">
        {renderView()}
      </main>
      <Footer />
      <KainoraAI />
      <CookieConsentBanner />
    </div>
  );
}

export default App;
