import {useEffect,useRef,useState} from 'react';
import {doc,getDoc,setDoc} from 'firebase/firestore';
import {db,appId,isFirebaseConfigured} from '../firebase';
import {mergeBuyerCart} from './buyerCommerce';

// Hydrate once per UID. A profile edit must not reload or clear a basket, and
// a buyer's first login must preserve the items added while browsing as a guest.
export function useBuyerBaskets({user,cart,wishlist,setCart,setWishlist,showToast}) {
  const uid=user?.email?user.uid:null;
  const current=useRef({cart,wishlist}),previousUid=useRef(null),persisted=useRef('');
  current.current={cart,wishlist};
  const [readyUid,setReadyUid]=useState(null);
  useEffect(()=>{
    let cancelled=false;setReadyUid(null);
    const oldUid=previousUid.current;previousUid.current=uid;
    if(!uid||!isFirebaseConfigured){if(oldUid){setCart([]);setWishlist([]);}return;}
    const changingBuyer=oldUid&&oldUid!==uid;
    Promise.all(['cart','wishlist'].map(kind=>getDoc(doc(db,'artifacts',appId,'users',uid,'private',kind)))).then(([basket,favorites])=>{
      if(cancelled)return;
      const remoteCart=basket.exists()?basket.data().items||[]:[],remoteWishlist=favorites.exists()?favorites.data().items||[]:[];
      const nextCart=mergeBuyerCart(changingBuyer?[]:current.current.cart,remoteCart);
      persisted.current=JSON.stringify({cart:remoteCart,wishlist:remoteWishlist});
      setCart(nextCart);setWishlist(remoteWishlist);setReadyUid(uid);
    }).catch(()=>{if(!cancelled)showToast('Keranjang di perangkat ini tetap ada. Sinkronisasi akun belum berhasil.');});
    return()=>{cancelled=true;};
  },[uid,setCart,setWishlist,showToast]);
  useEffect(()=>{
    if(!uid||readyUid!==uid)return;
    const payload=JSON.parse(JSON.stringify({cart,wishlist})),key=JSON.stringify(payload);
    if(key===persisted.current)return;
    const timer=setTimeout(()=>{
      Promise.all([setDoc(doc(db,'artifacts',appId,'users',uid,'private','cart'),{items:payload.cart}),setDoc(doc(db,'artifacts',appId,'users',uid,'private','wishlist'),{items:payload.wishlist})]).then(()=>{persisted.current=key;}).catch(()=>showToast('Perubahan masih ada di perangkat ini, tetapi belum tersinkron ke akun.'));
    },350);
    return()=>clearTimeout(timer);
  },[uid,readyUid,cart,wishlist,showToast]);
  return {basketReady:!uid||readyUid===uid};
}
