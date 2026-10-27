import test from 'node:test';
import assert from 'node:assert/strict';
import {initializeApp,deleteApp} from 'firebase/app';
import {getFirestore,connectFirestoreEmulator,doc,setDoc,getDoc,getDocs,collection,query,where,updateDoc,serverTimestamp} from 'firebase/firestore';
if(process.env.FIRESTORE_EMULATOR_HOST!=='127.0.0.1:8089')throw new Error('Run only through the local Firestore emulator on 127.0.0.1:8089.');
const apps=[];
const client=(uid)=>{const app=initializeApp({projectId:'demo-kainora-test'},`rules-${uid||'guest'}`);apps.push(app);const db=getFirestore(app);connectFirestoreEmulator(db,'127.0.0.1',8089,uid?{mockUserToken:{sub:uid,email:`${uid}@example.test`,email_verified:true,firebase:{sign_in_provider:'password'}}}:undefined);return db;};
test('buyer data is isolated, guest access denied, and clients cannot mark orders paid',async()=>{
  const a=client('buyer-a'),b=client('buyer-b'),guest=client();
  const prefix='artifacts/kainora-kids-store';
  try{
    const profile=doc(a,`${prefix}/users/buyer-a/profile/data`);
    await setDoc(profile,{name:'Buyer A',email:'buyer-a@example.test',phone:'',address:'',kodepos:'',gender:'bunda',nickname:'',photoURL:'',createdAt:serverTimestamp()});
    assert.equal((await getDoc(profile)).data().name,'Buyer A');
    await assert.rejects(()=>getDoc(doc(b,profile.path)));
    await assert.rejects(()=>getDoc(doc(guest,profile.path)));
    await assert.rejects(()=>updateDoc(profile,{admin:true}));
    await assert.rejects(()=>updateDoc(profile,{email:'admin@example.test'}));
    const basket=doc(a,`${prefix}/users/buyer-a/private/cart`);await setDoc(basket,{items:[{id:'park',size:'S',qty:1}]});
    assert.equal((await getDoc(basket)).data().items.length,1);
    await assert.rejects(()=>getDoc(doc(b,basket.path)));
    await assert.rejects(()=>setDoc(doc(b,basket.path),{items:[]}));
    const data={orderId:'ORD-UNIT',userId:'buyer-a',userEmail:'buyer-a@example.test',customerName:'Buyer A',whatsapp:'08123456789',address:'Alamat contoh',kodepos:'12345',notes:'',items:[{id:'park',name:'Park',size:'S',qty:1,price:120000}],subTotal:120000,discount:0,promoCode:null,totalAmount:120000,status:'pending',createdAt:serverTimestamp()};
    const order=doc(a,`${prefix}/public/data/orders/order-a`);await setDoc(order,data);
    assert.equal((await getDoc(order)).data().userId,'buyer-a');
    const own=await getDocs(query(collection(a,`${prefix}/public/data/orders`),where('userId','==','buyer-a')));assert.equal(own.size,1);
    await assert.rejects(()=>getDocs(collection(a,`${prefix}/public/data/orders`)));
    await assert.rejects(()=>getDoc(doc(b,order.path)));
    await assert.rejects(()=>setDoc(doc(b,`${prefix}/public/data/orders/forged`),data));
    await assert.rejects(()=>updateDoc(order,{status:'paid'}));
    await assert.rejects(()=>setDoc(doc(a,`${prefix}/public/data/orders/paid`),{...data,status:'paid'}));
    await assert.rejects(()=>setDoc(doc(a,`${prefix}/public/data/orders/bad-total`),{...data,totalAmount:1}));
    await assert.rejects(()=>setDoc(doc(guest,`${prefix}/public/data/orders/guest`),data));
    await assert.rejects(()=>setDoc(doc(a,`${prefix}/public/data/products/unwanted`),{name:'Not a CMS write'}));
  }finally{await Promise.all(apps.map(app=>deleteApp(app)));}
});
