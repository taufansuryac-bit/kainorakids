import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, Heart, Loader2 } from 'lucide-react';
import { SEO } from '../constants/data';
import { useStore } from '../context/StoreContext';
import { AccountButton, AccountEmpty, AccountHeading } from '../components/account/AccountUI';
import { ShopProductCard } from '../components/shop/ShopShared';
import { useMotionPreference } from '../components/fashion/useMotionPreference';
import './shop.css';

export function WishlistView({setActiveProduct}) {
  const store=useStore();
  return <WishlistContent {...store} onOpen={product=>{setActiveProduct(product);store.setView('productDetail');}}/>;
}
export function WishlistContent({wishlist,products,user,setView,toggleWishlist,setIsAuthModalOpen,basketReady=true,onOpen}) {
  const ids=new Set(wishlist.map(String)), items=products.filter(product=>ids.has(String(product.id))), reduce=useMotionPreference();
  return <main className="ks-shop ka-page ka-wishlist"><SEO title="Favorit Anda | Kainora Kids" description="Simpan motif favorit dan temukan kembali pilihan Anda." canonicalPath="/?view=wishlist" robots="noindex, follow"/><AccountHeading eyebrow="PRODUK TERSIMPAN" title="Produk favorit" description="Lihat kembali produk yang Anda simpan."><button type="button" className="ka-back" onClick={()=>setView('products')}><ArrowLeft size={17}/>Jelajahi koleksi</button></AccountHeading>
    {!basketReady ? <div className="ka-empty" role="status"><Loader2 size={28} className="animate-spin" style={{margin:'auto'}}/><p>Menyiapkan favorit akun Anda…</p></div> : !items.length ? <AccountEmpty icon={Heart} title={user?.email?'Belum ada produk favorit':'Simpan produk favorit Anda'} description={user?.email?'Ketuk ikon hati di koleksi untuk menyimpan motif yang disukai. Anda bisa memilih ukuran saat membuka detailnya.':'Masuk untuk menyimpan motif pilihan dan membukanya kembali melalui akun Anda.'} action={user?.email?'Temukan motif favorit':'Masuk ke akun'} onAction={()=>user?.email?setView('products'):setIsAuthModalOpen(true)} secondary={user?.email?undefined:'Jelajahi koleksi'} onSecondary={()=>setView('products')}/> : <><div className="ka-inline-banner"><p><strong>{items.length} motif tersimpan.</strong> Pilih motif untuk melihat detail dan menentukan ukuran sebelum memasukkannya ke keranjang.</p><AccountButton secondary onClick={()=>setView('cart')}>Lihat keranjang</AccountButton></div><div className="ka-wishlist-grid"><AnimatePresence initial={false}>{items.map((product,index)=><motion.div key={product.id} layout={reduce?false:'position'} initial={reduce?false:{opacity:0,y:15}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:.95}} transition={{duration:reduce?0:.25}}><ShopProductCard product={product} index={index} onOpen={onOpen} wishlisted onToggleWishlist={toggleWishlist}/></motion.div>)}</AnimatePresence></div><p className="ka-wishlist-note">Daftar favorit tersimpan pada akun. Harga dan detail mengikuti informasi produk terbaru.</p></>}
  </main>;
}
