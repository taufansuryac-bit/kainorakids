import { priceForSize } from './pricing.js';
// Google Analytics 4 with Consent Mode v2. Nothing loads until VITE_GA_MEASUREMENT_ID
// is set, and analytics_storage stays denied until the buyer accepts the cookie banner.
// Never pass names, WhatsApp numbers, addresses or emails as event parameters.
export const CONSENT_KEY = 'kainora_cookie_consent';
const MEASUREMENT_ID = import.meta.env?.VITE_GA_MEASUREMENT_ID || '';

const storedConsent = () => { try { return localStorage.getItem(CONSENT_KEY); } catch { return null; } };
const gtag = (...args) => { if (window.gtag) window.gtag(...args); };

export function initAnalytics() {
  if (!MEASUREMENT_ID || typeof window === 'undefined' || window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  const granted = storedConsent() === 'accepted' ? 'granted' : 'denied';
  window.gtag('consent', 'default', { analytics_storage: granted, ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500 });
  window.gtag('js', new Date());
  // Page views are sent by trackPageView after each view's SEO tags are applied.
  window.gtag('config', MEASUREMENT_ID, { send_page_view: false });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
  document.head.appendChild(script);
}

export function updateAnalyticsConsent(accepted) {
  gtag('consent', 'update', { analytics_storage: accepted ? 'granted' : 'denied' });
}

let lastPageView = '';
// Called from the SEO component once a view has applied its title; repeated
// effect runs for the same URL and title are not counted twice.
export function trackPageView() {
  const key = `${window.location.href}|${document.title}`;
  if (key === lastPageView) return;
  lastPageView = key;
  gtag('event', 'page_view', { page_location: window.location.href, page_title: document.title });
}

export function track(name, params = {}) {
  gtag('event', name, params);
}

// GA4 ecommerce item shape from a catalogue product (no buyer data).
export const analyticsItem = (product, size, quantity = 1) => ({
  item_id: String(product.id), item_name: product.name, item_brand: 'Kainora Kids',
  item_category: product.type || 'Kaos', ...(size ? { item_variant: size } : {}),
  price: Number(priceForSize(product,size)) || 0, quantity,
});
