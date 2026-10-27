import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, Check, Eye, EyeOff, Loader2, LockKeyhole, X } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, appId, googleProvider } from '../../firebase';
import { AVATARS_BUNDA, AVATARS_AYAH } from '../../constants/data';
import { useStore } from '../../context/StoreContext';
import { buyerIdentity } from '../../services/buyerCommerce';
import { buyerAuthError, buyerProfileFields } from '../../utils/buyerUi';
import { formatPrice } from '../../utils/pricing';
import { useMotionPreference } from '../fashion/useMotionPreference';
import { AccountButton, AccountDialog, AccountField } from './AccountUI';

function GoogleMark() {
  return <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.05-3.71 1.05-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 21.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.23 1 12s.43 3.45 1.18 4.93z"/><path fill="#EA4335" d="M12 5.38c1.61 0 3.06.56 4.2 1.64l3.15-3.15C17.45 2.43 14.97 1 12 1 7.7 1 3.99 2.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>;
}
export function AuthModal({ isOpen, onClose }) {
  const { setUser, showToast } = useStore();
  const reduce = useMotionPreference();
  const [mode, setMode] = useState('login'), [email, setEmail] = useState(''), [password, setPassword] = useState('');
  const [name, setName] = useState(''), [gender, setGender] = useState('bunda'), [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [success, setSuccess] = useState('');
  useEffect(() => { if (isOpen) {setError('');setSuccess('');setShowPassword(false);} }, [isOpen]);
  const changeMode = next => {setMode(next);setError('');setSuccess('');setShowPassword(false);};
  const hydrate = async buyer => {
    try {
      const ref = doc(db, 'artifacts', appId, 'users', buyer.uid, 'profile', 'data');
      const result = await getDoc(ref);
      const profile = result.exists() ? result.data() : {name: buyer.displayName || '', phone: '', address: '', kodepos: '', photoURL: buyer.photoURL || '', gender: 'bunda', email: buyer.email, createdAt: serverTimestamp()};
      if (!result.exists()) await setDoc(ref, profile);
      return buyerIdentity(buyer, profile);
    } catch {
      // Authentication already succeeded; a profile read failure must not report a failed login.
      return buyerIdentity(buyer);
    }
  };
  const submit = async event => {
    event.preventDefault(); if (busy) return;
    setBusy(true);setError('');setSuccess('');
    try {
      if (mode === 'reset') {await sendPasswordResetEmail(auth, email.trim());setSuccess('Jika email terdaftar, tautan untuk mengatur ulang kata sandi akan dikirim. Periksa kotak masuk dan folder spam.');}
      else if (mode === 'login') {const result = await signInWithEmailAndPassword(auth, email.trim(), password);setUser(await hydrate(result.user));showToast('Selamat datang kembali.');onClose();}
      else {
        const avatars = gender === 'bunda' ? AVATARS_BUNDA : AVATARS_AYAH;
        const photoURL = avatars[Math.floor(Math.random() * avatars.length)];
        const { user: buyer } = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(buyer, {displayName: name.trim(), photoURL});
        const profile = {name: name.trim(), phone: '', address: '', kodepos: '', photoURL, gender, nickname: '', email: buyer.email, createdAt: serverTimestamp()};
        await setDoc(doc(db, 'artifacts', appId, 'users', buyer.uid, 'profile', 'data'), profile);
        setUser(buyerIdentity(buyer, profile));showToast('Akun berhasil dibuat. Selamat menjelajah.');onClose();
      }
    } catch (e) {setError(buyerAuthError(e.code));} finally {setBusy(false);}
  };
  const google = async () => {
    if (busy) return;setBusy(true);setError('');setSuccess('');
    try {const result = await signInWithPopup(auth, googleProvider);setUser(await hydrate(result.user));showToast('Berhasil masuk dengan Google.');onClose();}
    catch (e) {setError(buyerAuthError(e.code));} finally {setBusy(false);}
  };
  const title = mode === 'reset' ? 'Kembali ke akunmu.' : mode === 'login' ? 'Senang bertemu lagi.' : 'Cerita baru dimulai.';
  return <AccountDialog open={isOpen} close={onClose} label="Akun Kainora Kids" className="ka-auth-dialog">
    <div className="ka-auth-visual" aria-hidden="true"><img src="/images/kainora-owned/hero-camp.webp" alt=""/><span>KAINORA KIDS / YOUR EVERYDAY CLUB</span><div><span className="ka-brand-dot"><ArrowUpRight size={21}/></span><strong>Little fits.<br/>Big possibilities.</strong><p>Simpan favorit. Temukan gaya. Ikuti setiap cerita pesananmu.</p></div></div>
    <div className="ka-auth-form"><img src="/website-logo.png" alt="Kainora Kids" width="145" height="35"/><span className="ka-kicker">YOUR LITTLE WORLD, ALL IN ONE PLACE.</span>
      <h2>{title}</h2><p className="ka-auth-intro">{mode === 'reset' ? 'Masukkan email akun Anda. Kami akan mengirim tautan untuk membuat kata sandi baru.' : mode === 'login' ? 'Masuk untuk membuka favorit, data pengiriman, dan pesanan Anda.' : 'Buat akun untuk menyimpan pilihan kecil yang berarti.'}</p>
      {mode !== 'reset' && <div className="ka-auth-tabs" role="group" aria-label="Pilihan akun"><button type="button" disabled={busy} aria-pressed={mode === 'login'} onClick={() => changeMode('login')}>Masuk</button><button type="button" disabled={busy} aria-pressed={mode === 'register'} onClick={() => changeMode('register')}>Buat akun</button></div>}
      <AnimatePresence mode="wait" initial={false}><motion.form key={mode} onSubmit={submit} initial={reduce ? false : {opacity: 0, y: 8}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -5}} transition={{duration: reduce ? 0 : .16}}>
        {mode === 'register' && <><AccountField label="Nama lengkap" name="name" autoComplete="name" required minLength={2} maxLength={200} placeholder="Nama Anda" value={name} onChange={e => setName(e.target.value)} disabled={busy}/><fieldset className="ka-gender"><legend>Panggilan Anda</legend>{[['bunda','Bunda'],['ayah','Ayah']].map(([value,label]) => <label key={value}><input type="radio" name="account-gender" value={value} checked={gender === value} onChange={() => setGender(value)} disabled={busy}/>{label}</label>)}</fieldset></>}
        <AccountField label="Alamat email" name="email" type="email" inputMode="email" autoComplete="email" required placeholder="nama@email.com" maxLength={254} value={email} onChange={e => setEmail(e.target.value)} disabled={busy}/>
        {mode !== 'reset' && <><AccountField label="Kata sandi" name="password" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} required minLength={mode === 'register' ? 6 : undefined} placeholder={mode === 'register' ? 'Minimal 6 karakter' : 'Masukkan kata sandi'} value={password} onChange={e => setPassword(e.target.value)} disabled={busy} suffix={<button type="button" aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'} aria-pressed={showPassword} onClick={() => setShowPassword(s => !s)}>{showPassword ? <EyeOff size={19}/> : <Eye size={19}/>}</button>}/>{mode === 'login' && <div className="ka-password-tools"><button type="button" onClick={() => changeMode('reset')} disabled={busy}>Lupa kata sandi?</button></div>}</>}
        {error && <p className="ka-message" role="alert">{error}</p>}{success && <p className="ka-message is-success" role="status">{success}</p>}
        <AccountButton type="submit" disabled={busy}>{busy ? <><Loader2 size={18} className="animate-spin"/>Sedang memproses…</> : <>{mode === 'reset' ? 'Kirim tautan reset' : mode === 'login' ? 'Masuk ke akun' : 'Buat akun saya'}<ArrowUpRight size={18}/></>}</AccountButton>
        {mode === 'reset' && <button type="button" className="ka-text-link" onClick={() => changeMode('login')}><ArrowLeft size={15}/>Kembali ke masuk</button>}
      </motion.form></AnimatePresence>
      {mode !== 'reset' && <><div className="ka-divider">atau lanjut dengan</div><AccountButton secondary className="ka-google" disabled={busy} onClick={google}><GoogleMark/>Google</AccountButton></>}
      <p className="ka-form-note"><LockKeyhole size={12} style={{display:'inline',marginRight:5}}/>Akun pribadi Anda untuk pengalaman Kainora.</p>
    </div>
  </AccountDialog>;
}

export function EditProfileModal({ isOpen, onClose }) {
  const { user, setUser, showToast } = useStore();
  const [form, setForm] = useState({name:'',phone:'',address:'',kodepos:'',gender:'bunda'}), [busy, setBusy] = useState(false), [error, setError] = useState('');
  useEffect(() => {if (isOpen && user) {setForm({name:user.name || '',phone:user.phone || '',address:user.address || '',kodepos:user.kodepos || '',gender:user.gender || 'bunda'});setError('');}}, [isOpen,user]);
  const set = (key,value) => setForm(p => ({...p,[key]:value}));
  const submit = async event => {
    event.preventDefault();setError('');
    try {
      const fields = buyerProfileFields(form);
      if (!user?.uid || auth.currentUser?.uid !== user.uid) throw new Error('Sesi akun perlu diperbarui. Silakan masuk kembali.');
      setBusy(true);
      await setDoc(doc(db,'artifacts',appId,'users',user.uid,'profile','data'),fields,{merge:true});
      setUser(previous => ({...previous,...fields}));showToast('Data profil berhasil disimpan.');onClose();
    } catch (e) {setError(e.code ? 'Data belum berhasil disimpan. Periksa koneksi dan coba kembali.' : e.message);} finally {setBusy(false);}
  };
  return <AccountDialog open={isOpen && !!user} close={onClose} title="Detail akun Anda."><p className="ka-auth-intro">Lengkapi informasi agar pengisian pesanan berikutnya lebih mudah.</p><form onSubmit={submit} style={{marginTop:25}}><AccountField label="Nama lengkap" required minLength={2} maxLength={200} autoComplete="name" value={form.name} onChange={e=>set('name',e.target.value)} disabled={busy}/><div className="ka-form-grid"><AccountField label="Nomor WhatsApp" type="tel" inputMode="tel" autoComplete="tel" maxLength={20} placeholder="081234567890" value={form.phone} onChange={e=>set('phone',e.target.value)} disabled={busy}/><AccountField label="Kode pos" inputMode="numeric" autoComplete="postal-code" maxLength={5} placeholder="5 digit kode pos" value={form.kodepos} onChange={e=>set('kodepos',e.target.value)} disabled={busy}/></div><AccountField multiline label="Alamat pengiriman" rows={3} autoComplete="street-address" maxLength={2000} placeholder="Jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota" value={form.address} onChange={e=>set('address',e.target.value)} disabled={busy}/><fieldset className="ka-gender"><legend>Panggilan Anda</legend>{[['bunda','Bunda'],['ayah','Ayah']].map(([value,label])=><label key={value}><input type="radio" name="profile-gender" value={value} checked={form.gender===value} onChange={()=>set('gender',value)} disabled={busy}/>{label}</label>)}</fieldset>{error && <p role="alert" className="ka-message">{error}</p>}<div className="ka-form-actions"><AccountButton secondary onClick={onClose} disabled={busy}>Batal</AccountButton><AccountButton type="submit" disabled={busy}>{busy ? <Loader2 size={18} className="animate-spin"/> : <Check size={18}/>}Simpan perubahan</AccountButton></div></form></AccountDialog>;
}
