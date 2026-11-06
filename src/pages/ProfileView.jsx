import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { ArrowLeft, ArrowUpRight, Check, Heart, LogOut, MapPin, Package, Pencil, ShoppingBag, UserRound } from 'lucide-react';
import { auth } from '../firebase';
import { SEO } from '../constants/data';
import { useStore } from '../context/StoreContext';
import { AccountEmpty, AccountHeading } from '../components/account/AccountUI';
import { EditProfileModal } from '../components/account/AccountDialogs';

export function ProfileView() {
  const store=useStore(),[edit,setEdit]=useState(false),[busy,setBusy]=useState(false);
  const logout=async()=>{setBusy(true);try{await signOut(auth);store.setUser(null);store.setView('home');store.showToast('Anda sudah keluar dari akun.');}catch{store.showToast('Belum berhasil keluar. Silakan coba kembali.');}finally{setBusy(false);}};
  return <><ProfileDashboard {...store} onEdit={()=>setEdit(true)} onLogout={logout} logoutBusy={busy}/><EditProfileModal isOpen={edit} onClose={()=>setEdit(false)}/></>;
}
export function ProfileDashboard({user,setView,setIsAuthModalOpen,wishlist=[],cart=[],onEdit,onLogout,logoutBusy=false}) {
  const [avatarFailed,setAvatarFailed]=useState(false);
  const initials=(user?.name || user?.email || 'K').trim().split(/\s+/).slice(0,2).map(word=>word[0]).join('').toUpperCase();
  const info=[['Nama lengkap',user?.name],['Email akun',user?.email],['Nomor WhatsApp',user?.phone],['Kode pos',user?.kodepos],['Alamat pengiriman utama',user?.address]];
  return <main className="ka-page ka-profile"><SEO title="Akun Saya | Kainora Kids" description="Kelola informasi akun, alamat pengiriman, favorit, dan pesanan Anda." canonicalPath="/?view=profile" robots="noindex, follow"/><AccountHeading eyebrow="AKUN PELANGGAN" title={user?.email?'Akun saya':'Akun Kainora Kids'} description={user?.email?'Kelola profil, alamat pengiriman, produk favorit, dan pesanan Anda.':'Favorit, detail pengiriman, dan pesanan dalam satu tempat.'}><button className="ka-back" type="button" onClick={()=>setView('products')}><ArrowLeft size={17}/>Kembali ke koleksi</button></AccountHeading>
    {!user?.email?<AccountEmpty icon={UserRound} title="Mulai dari akun Anda." description="Masuk atau buat akun untuk menyimpan pilihan dan mengelola informasi pengiriman Anda." action="Masuk / buat akun" onAction={()=>setIsAuthModalOpen(true)} secondary="Lihat koleksi" onSecondary={()=>setView('products')}/>:
    <div className="ka-profile-layout"><aside className="ka-profile-sidebar"><div className="ka-member-card"><div className="ka-avatar">{user.photoURL&&!avatarFailed?<img src={user.photoURL} alt="" width="70" height="70" onError={()=>setAvatarFailed(true)}/>:initials}</div><span className="ka-kicker">PROFIL PELANGGAN</span><h2>{user.name || 'Pelanggan Kainora'}</h2><p>{user.email}</p><span><Check size={14}/>Akun pembeli terhubung</span></div><nav className="ka-account-nav" aria-label="Menu akun"><button type="button" className="is-selected" aria-current="page"><UserRound size={17}/><span>Profil saya</span></button><button type="button" onClick={()=>setView('orders')}><Package size={17}/><span>Pesanan saya</span><ArrowUpRight size={15}/></button><button type="button" onClick={()=>setView('wishlist')}><Heart size={17}/><span>Favorit ({wishlist.length})</span><ArrowUpRight size={15}/></button><button type="button" onClick={()=>setView('cart')}><ShoppingBag size={17}/><span>Keranjang ({cart.reduce((n,item)=>n+item.qty,0)})</span><ArrowUpRight size={15}/></button><button type="button" disabled={logoutBusy} onClick={onLogout}><LogOut size={17}/><span>{logoutBusy?'Sedang keluar…':'Keluar dari akun'}</span></button></nav></aside>
    <div><section className="ka-profile-panel" aria-labelledby="profile-data-title"><div className="ka-panel-heading"><div><span>DATA AKUN</span><h2 id="profile-data-title">Informasi pribadi.</h2></div><button type="button" className="ka-text-link" onClick={onEdit}><Pencil size={15}/>Edit profil</button></div><dl className="ka-profile-data">{info.map(([label,value])=><div key={label}><dt>{label}</dt><dd className={!value?'is-empty':undefined}>{value || 'Belum diisi'}</dd></div>)}</dl></section>
    {(!user.phone||!user.address||!user.kodepos)&&<div className="ka-inline-banner"><p><MapPin size={17} style={{display:'inline',marginRight:7}}/>Lengkapi nomor WhatsApp dan alamat agar informasi pengiriman lebih mudah digunakan saat checkout.</p><button type="button" className="ka-text-link" onClick={onEdit}>Lengkapi<ArrowUpRight size={16}/></button></div>}
    <div className="ka-profile-shortcuts"><button type="button" className="ka-shortcut" onClick={()=>setView('orders')}><Package size={24}/><strong>Riwayat pesanan</strong><p>Lihat status dan riwayat pesanan Anda.</p><ArrowUpRight size={18}/></button><button type="button" className="ka-shortcut" onClick={()=>setView('wishlist')}><Heart size={24}/><strong>Produk favorit</strong><p>{wishlist.length?`${wishlist.length} motif tersimpan untuk dilihat kembali.`:'Simpan produk dari katalog untuk melihatnya kembali di sini.'}</p><ArrowUpRight size={18}/></button></div></div></div>}
  </main>;
}
