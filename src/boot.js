// Paint the static storefront before importing the interactive app and account SDKs.
// The same styles serve both HTML and React, so enhancement does not move the layout.
import './index.css';
import './fashion.css';
import './mobile-refinements.css';
import './pages/shop.css';
import './pages/size-studio.css';
import './components/fashion/hero-slideshow.css';

const start = () => import('./main.jsx');
if (document.getElementById('root')?.hasChildNodes()) {
  requestAnimationFrame(() => requestAnimationFrame(start));
} else start();
