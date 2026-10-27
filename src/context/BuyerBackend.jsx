import {useEffect} from 'react';
import {doc,getDoc,onSnapshot} from 'firebase/firestore';
import {auth,db,appId,isFirebaseConfigured} from '../firebase';
import {useStore} from './StoreContext';
import {buyerIdentity} from '../services/buyerCommerce';
import {useBuyerBaskets} from '../services/useBuyerBaskets';

export default function BuyerBackend(){
  const store=useStore();
  const {user,setUser,setAiSizeChart,setBasketOwner}=store;
  const {basketReady}=useBuyerBaskets(store);
  useEffect(()=>{setBasketOwner(basketReady&&user?.uid?user.uid:null);},[basketReady,user?.uid,setBasketOwner]);
  useEffect(()=>{
    if(!isFirebaseConfigured)return;
    let current=true;
    const unsubscribe=auth.onAuthStateChanged(async buyer=>{
      try{if(buyer?.email)localStorage.setItem('kainora-buyer-session','present');else localStorage.removeItem('kainora-buyer-session');}catch{/* Persistence is optional. */}
      if(!buyer){setUser(null);return;}
      if(buyer.isAnonymous){setUser({email:null,isAnonymous:true});return;}
      try{
        const profile=await getDoc(doc(db,'artifacts',appId,'users',buyer.uid,'profile','data'));
        if(current&&auth.currentUser?.uid===buyer.uid)setUser(buyerIdentity(buyer,profile.exists()?profile.data():{}));
      }catch{if(current&&auth.currentUser?.uid===buyer.uid)setUser(buyerIdentity(buyer));}
    });
    return()=>{current=false;unsubscribe();};
  },[setUser]);
  useEffect(()=>{
    if(!isFirebaseConfigured||!user?.email)return;
    return onSnapshot(doc(db,'artifacts',appId,'public','data','config','aiSettings'),snapshot=>{
      if(snapshot.exists()&&snapshot.data().sizeChart)setAiSizeChart(snapshot.data().sizeChart);
    },()=>{});
  },[setAiSizeChart,user?.email]);
  return null;
}
