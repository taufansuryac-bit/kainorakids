import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { StoreProvider } from './context/StoreContext'
import { MotionConfig } from 'motion/react'
import { storefrontView } from './utils/productRoutes'
import { initAnalytics } from './utils/analytics'

initAnalytics();

const root=document.getElementById('root');
const app=(
  <React.StrictMode>
    <MotionConfig reducedMotion="user"><StoreProvider>
      <App />
    </StoreProvider></MotionConfig>
  </React.StrictMode>
);
if(root.dataset.ssr==='true' && root.dataset.prerender===storefrontView(window.location))ReactDOM.hydrateRoot(root,app);
else ReactDOM.createRoot(root).render(app);
