import { lazy, Suspense, useEffect, useState } from 'react';
import { hasSavedBuyerSession } from '../../services/buyerSessionHint';
const Backend = lazy(() => import('../../context/BuyerBackend'));
export function BuyerBackendGate({ immediate = false }) {
  const [needed,setNeeded]=useState(immediate);
  useEffect(()=>{
    if(immediate){setNeeded(true);return;}
    let cancelled=false;
    // Firebase normally persists Auth in IndexedDB. Restore existing sessions without
    // downloading account SDKs for a first-time guest browsing the public catalogue.
    hasSavedBuyerSession().then(saved=>{if(!cancelled&&saved)setNeeded(true);});
    return()=>{cancelled=true;};
  },[immediate]);
  return needed?<Suspense fallback={null}><Backend/></Suspense>:null;
}
