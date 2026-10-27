export { AuthModal, EditProfileModal } from '../account/AccountDialogs';
export { MiniCartDrawer } from '../account/MiniCartNotice';
import { useDialog } from '../fashion/hooks';
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { auth, db, appId } from '../../firebase';
import { 
  X, Star, Loader2, Ruler, Check, Heart, ShoppingCart, Send, ChevronDown, ChevronRight, Bot, Video as VideoIcon
} from 'lucide-react';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { formatPrice, FOOTER_INFO } from '../../constants/data';
import { cloudAIService } from '../../services/cloudAIService';

// ============================================================================
// 4. SHARED UI & MODALS
// ============================================================================

export const CustomCursor = () => {
  const cursorRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    const cursor = cursorRef.current;
    const textEl = textRef.current;
    if (!cursor || !textEl) return;

    let isHovering = false;

    const onMouseMove = (e) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      
      const target = e.target;
      const revealParent = target.closest('[data-cursor]');
      
      if (revealParent) {
        if (!isHovering) {
          isHovering = true;
          cursor.classList.add('w-24', 'h-24', 'bg-amber-500', 'text-gray-900', 'shadow-solid', 'scale-100', 'opacity-100');
          cursor.classList.remove('w-4', 'h-4', 'bg-gray-900', 'opacity-0', 'scale-0');
          textEl.style.opacity = '1';
          
          // Disable default cursor on parent
          revealParent.style.cursor = 'none';
        }
        textEl.innerText = revealParent.getAttribute('data-cursor') || "LIHAT";
      } else {
        if (isHovering) {
          isHovering = false;
          cursor.classList.remove('w-24', 'h-24', 'bg-amber-500', 'text-gray-900', 'shadow-solid', 'scale-100', 'opacity-100');
          cursor.classList.add('w-4', 'h-4', 'bg-gray-900', 'opacity-0', 'scale-0');
          textEl.style.opacity = '0';
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <div 
      ref={cursorRef}
      className="hidden md:flex fixed top-0 left-0 pointer-events-none z-[9999] transition-[width,height,background-color,transform,opacity] duration-300 ease-out items-center justify-center rounded-full font-black text-[10px] uppercase tracking-widest w-4 h-4 bg-gray-900 opacity-0 scale-0 origin-center"
    >
      <span ref={textRef} className="opacity-0 transition-opacity duration-300 pointer-events-none select-none text-center leading-tight"></span>
    </div>
  );
};

export const Parallax = ({ children, speed = 0.15, className = '' }) => {
  const ref = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const parent = ref.current.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (rect.top <= windowHeight && rect.bottom >= 0) {
         const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
         const offset = (progress - 0.5) * 30; // -15% to +15%
         ref.current.style.transform = `translateY(${offset}%)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div ref={ref} className="absolute inset-0 w-full h-[130%] -top-[15%] will-change-transform">
        {children}
      </div>
    </div>
  );
};

export const FadeIn = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setIsVisible(true); });
    }, { threshold: 0.1 }); 
    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);
  return (
    <div ref={domRef} className={`transform transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isVisible ? 'opacity-100 translate-y-0 rotate-0 scale-100' : 'opacity-0 translate-y-8 -rotate-1 scale-[0.96]'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

export const TopBanner = () => {
  const [msgIdx, setMsgIdx] = useState(0);
  const messages = [
    "✨ Finest Kids Local Brand In Indonesia ✨",
    "🔥 Kualitas Premium, Nyaman & Tahan Lama 🔥",
    "⭐ 100% Katun Combed Anti Alergi ⭐"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gray-900 text-brand-red py-2.5 z-[1001] relative w-full overflow-hidden flex items-center justify-center border-b border-gray-800 min-h-[36px]">
      <div className="relative w-full text-center h-4">
        {messages.map((msg, idx) => (
          <p key={idx} className={`absolute left-0 right-0 top-0 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-opacity duration-1000 ${idx === msgIdx ? 'opacity-100' : 'opacity-0'}`}>
            {msg}
          </p>
        ))}
      </div>
    </div>
  );
};

export const CustomVideoPlayer = ({ src, poster, className = '' }) => {
  if (src.startsWith('PLACEHOLDER')) {
     return (
       <div className={`w-full max-w-[300px] mx-auto md:max-w-none aspect-[9/16] bg-gray-100 border-4 border-gray-900 shadow-solid flex flex-col items-center justify-center p-6 text-center group cursor-pointer hover:bg-amber-100 transition-colors ${className}`}>
          <VideoIcon size={48} className="mb-4 text-gray-400 group-hover:text-brand-red transition-colors" />
          <p className="font-black text-gray-900 uppercase tracking-widest text-sm mb-2">Slot Video MP4</p>
          <p className="text-[10px] text-gray-500 font-bold uppercase">Ganti atribut src dengan nama file video Anda.</p>
       </div>
     )
  }

  return (
    <div className={`w-full max-w-[300px] mx-auto md:max-w-none aspect-[9/16] bg-black border-4 border-gray-900 shadow-solid overflow-hidden flex justify-center items-center relative ${className}`}>
      <video 
        className="w-full h-full object-cover pointer-events-auto" 
        autoPlay 
        muted
        playsInline 
        loop 
        controlsList="nodownload" 
        disablePictureInPicture 
        onContextMenu={(e) => e.preventDefault()} 
        poster={poster}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
};

export const ToastNotification = () => {
  const { toastMessage, showToast } = useStore();
  if (!toastMessage) return null;
  return (
    <div className="fixed top-6 left-0 right-0 z-[5000] flex justify-center pointer-events-none">
      <div className="bg-white text-gray-900 px-6 py-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border-4 border-gray-900 font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-4 animate-toast pointer-events-auto">
        <div className="bg-amber-500 p-2 rounded-full text-white"><Star size={16} fill="currentColor"/></div>
        <span>{toastMessage}</span>
        <button onClick={() => showToast(null)} className="ml-2 hover:text-brand-red transition-colors p-1"><X size={16} strokeWidth={3}/></button>
      </div>
    </div>
  );
};

// --- 4.4 EDIT PROFILE MODAL ---
export const SmartSizePredictor = ({ onSelectSize, availableSizes }) => {
  const { showToast, aiSizeChart } = useStore();
  const [tinggi, setTinggi] = useState('');
  const [berat, setBerat] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);

  const calculateSizeWithAI = async () => {
    const tb = parseInt(tinggi);
    const bb = parseInt(berat);
    if (!tb || !bb) {
      showToast("Tinggi dan berat anak wajib diisi.");
      return;
    }
    
    setIsPredicting(true);
    setPrediction(null);
    try {
      const prompt = `Sebagai AI Assistant Toko Baju Anak Kainora Kids, tugasmu adalah menebak ukuran baju (Size) yang paling cocok untuk anak berdasarkan tinggi dan berat badannya.
Tinggi Anak: ${tb} cm
Berat Anak: ${bb} kg
Pilihan Ukuran yang Tersedia di Produk Ini: ${availableSizes ? availableSizes.join(', ') : '1-2Y, 3-4Y, 5-6Y, 7-8Y, 9-10Y'}

Gunakan PANDUAN UKURAN KAINORA berikut ini sebagai acuan utamamu:
"""
${aiSizeChart || "Jika tinggi 90-100cm pilih 1-2Y/Size S. Jika tinggi 100-110cm pilih 3-4Y/Size M. Jika tinggi 110-120cm pilih 5-6Y/Size L. Jika anak sangat gemuk, naikkan 1 ukuran dari standar."}
"""

Balas HANYA dengan nama ukuran yang direkomendasikan secara tepat (contoh: "3-4Y" atau "Size M"). JANGAN membalas dengan kalimat atau penjelasan lain.`;

      const text = await cloudAIService.chat([
        { role: 'system', content: 'Anda adalah AI yang hanya membalas dengan nama ukuran saja, tanpa penjelasan.' },
        { role: 'user', content: prompt }
      ], { temperature: 0.3, maxTokens: 30, stream: false });

      let suggestedSize = text.trim();

      if (suggestedSize.length > 20) {
         suggestedSize = suggestedSize.substring(0, 20);
      }

      setPrediction(suggestedSize);
    } catch (err) {
      console.error(err);
      showToast("Gagal memprediksi ukuran. Cek koneksi internet.");
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="bg-amber-50 border-4 border-amber-500 p-6 my-8 shadow-solid-sm relative overflow-hidden">
      <div className="absolute -top-4 -right-4 text-amber-200 opacity-50"><Ruler size={120} strokeWidth={1} /></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4 border-b-2 border-amber-200 pb-3">
          <Star className="text-brand-red w-6 h-6" fill="currentColor" />
          <div>
            <h3 className="font-black uppercase text-amber-900 tracking-wider text-sm md:text-base">Kalkulator Ukuran Cerdas</h3>
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mt-1">Cari ukuran pas pola Boxy Kainora Kids</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-black uppercase text-amber-800 mb-2">Tinggi Anak (cm)</label>
            <input type="number" value={tinggi} onChange={(e) => setTinggi(e.target.value)} className="w-full border-2 border-gray-900 p-3 font-bold text-sm outline-none focus:border-amber-500 bg-white" placeholder="Contoh: 120" />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-black uppercase text-amber-800 mb-2">Berat Anak (kg)</label>
            <input type="number" value={berat} onChange={(e) => setBerat(e.target.value)} className="w-full border-2 border-gray-900 p-3 font-bold text-sm outline-none focus:border-amber-500 bg-white" placeholder="Contoh: 25" />
          </div>
          <button onClick={calculateSizeWithAI} disabled={isPredicting} className="w-full md:w-auto bg-gray-900 text-white font-black px-8 py-3 border-2 border-gray-900 uppercase tracking-widest text-xs hover:bg-amber-500 hover:text-gray-900 transition-colors shadow-solid-sm active:translate-y-1 flex items-center justify-center gap-2">
            {isPredicting ? <Loader2 size={16} className="animate-spin" /> : <Bot size={16} />}
            {isPredicting ? 'Menghitung...' : 'Cek Size dengan AI ✨'}
          </button>
        </div>
        {prediction && (
          <div className="mt-6 bg-white p-4 border-2 border-gray-900 flex justify-between items-center animate-toast shadow-sm">
            <div>
              <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Rekomendasi Kainora Kids:</p>
              <p className="font-black text-xl md:text-2xl text-gray-900 leading-none">Size {prediction}</p>
            </div>
            <button onClick={() => onSelectSize(prediction)} className="bg-amber-500 text-gray-900 font-black px-4 py-3 uppercase tracking-widest text-[10px] border-2 border-gray-900 shadow-sm hover:bg-gray-900 hover:text-white transition-colors flex items-center gap-2"><Check size={14} strokeWidth={3} /> Gunakan & Tutup</button>
          </div>
        )}
      </div>
    </div>
  );
};

export const SizeGuideModal = ({ isOpen, onClose, availableSizes, onSelectSize }) => {
  const dialogRef = useDialog(isOpen, onClose);
  if (!isOpen) return null;
  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Panduan ukuran baju anak" className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto hide-scrollbar" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6 border-b-4 border-gray-900 pb-4">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter">Panduan Ukuran Baju Anak</h2>
          <button onClick={onClose} aria-label="Tutup Panduan ukuran baju anak" className="p-1 hover:bg-amber-100 transition-colors"><X strokeWidth={3}/></button>
        </div>

        <SmartSizePredictor availableSizes={availableSizes || ['1-2Y', '3-4Y', '5-6Y', '7-8Y', '9-10Y']} onSelectSize={onSelectSize} />

        <div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-4 border-b-2 border-gray-100 pb-2">Tabel Ukuran Manual</p>
          <table className="w-full border-collapse">
            <thead><tr className="bg-gray-100 border-2 border-gray-900"><th className="p-3 text-[10px] font-black uppercase border-r-2 border-gray-900">Size</th><th className="p-3 text-[10px] font-black uppercase border-r-2 border-gray-900">Lebar (cm)</th><th className="p-3 text-[10px] font-black uppercase">Tinggi (cm)</th></tr></thead>
            <tbody>
              {[['1-2Y', '33', '33'], ['3-4Y', '36', '36'], ['5-6Y', '39', '39'], ['7-8Y', '42', '42'], ['9-10Y', '45', '45']].map((r, i) => (
                <tr key={i} className="border-2 border-gray-900 font-bold"><td className="p-3 text-xs text-center border-r-2 border-gray-900">{r[0]}</td><td className="p-3 text-xs text-center border-r-2 border-gray-900">{r[1]}</td><td className="p-3 text-xs text-center">{r[2]}</td></tr>
              ))}
            </tbody>
          </table>
          <p className="text-[10px] font-bold text-gray-500 mt-4 leading-relaxed bg-amber-50 p-3 border-l-4 border-amber-500">
            *Pola cuttingan Boxy Oversize dengan rasio 1:1. Toleransi ukuran 1-2 cm karena proses jahit.
          </p>
        </div>
      </div>
    </div>
  );
};

export const FooterPopupModal = ({ footerPopup, setFooterPopup }) => {
  const dialogRef = useDialog(!!footerPopup, () => setFooterPopup(null));
  if (!footerPopup) return null;
  const content = FOOTER_INFO[footerPopup];
  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Informasi toko" className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm" onClick={() => setFooterPopup(null)}>
      <div className="bg-white border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl p-8 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6 border-b-2 border-gray-900 pb-4 flex-shrink-0">
          <h2 className="text-2xl font-black uppercase tracking-tighter">{content?.title}</h2>
          <button onClick={() => setFooterPopup(null)} aria-label="Tutup informasi toko" className="p-1 hover:bg-amber-100 transition-colors"><X strokeWidth={3}/></button>
        </div>
        <div className="text-sm font-semibold leading-loose whitespace-pre-wrap text-gray-700 overflow-y-auto pr-2 custom-scrollbar">{content?.content}</div>
      </div>
    </div>
  );
};

export const ReviewModal = ({ isOpen, onClose, activeProduct, editData }) => {
  const { user, showToast, products } = useStore();
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editData) { setRating(editData.rating); setText(editData.text.replace(/^"|"$/g, '')); setSelectedProductId(editData.productId); } 
    else { setRating(5); setText(''); if (activeProduct) setSelectedProductId(activeProduct.id); else setSelectedProductId(''); }
  }, [editData, isOpen, activeProduct]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!user?.email) return;
    if(!selectedProductId) { showToast("Pilih produk yang ingin diulas terlebih dahulu ya Bunda."); return; }
    setIsLoading(true);
    const selectedProd = products.find(p => p.id === parseInt(selectedProductId) || p.id === selectedProductId);
    try {
      if (editData) {
         await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'reviews', editData.id), { rating, text: `"${text}"`, productId: selectedProd.id, productName: selectedProd.name, isEdited: true });
         showToast('Ulasan berhasil diperbarui! 🥰');
      } else {
         await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'reviews'), { productId: selectedProd.id, productName: selectedProd.name, name: user.nickname || user.name, email: user.email, rating, text: `"${text}"`, createdAt: serverTimestamp() });
         showToast('Terima kasih! Ulasan jujurmu sudah tersimpan. 🥰');
      }
      onClose();
    } catch (error) { showToast('Gagal menyimpan ulasan. Pastikan rules Firestore sudah diizinkan.'); } finally { setIsLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md p-8 relative overflow-hidden" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-red-100 hover:text-red-500 transition-colors"><X size={20} strokeWidth={3}/></button>
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">{editData ? 'Edit Ulasan' : 'Berikan Ulasan'}</h2>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 border-b-2 border-gray-100 pb-4">Bagikan pengalaman Bunda ke ibu-ibu lainnya</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase mb-3 text-gray-500 tracking-widest">Pilih Baju Yang Diulas</label>
            <select required value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} className="w-full border-2 border-gray-900 p-3 font-bold text-sm outline-none focus:border-amber-500 bg-white cursor-pointer"><option value="" disabled>-- Pilih Model Baju --</option>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          </div>
          <div>
             <label className="block text-[10px] font-black uppercase mb-3 text-gray-500 tracking-widest">Penilaian</label>
             <div className="flex gap-2">{[1,2,3,4,5].map(star => <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none hover:scale-110 transition-transform"><Star size={32} className={`${rating >= star ? 'text-brand-red fill-amber-500' : 'text-gray-300'}`} /></button>)}</div>
          </div>
          <div>
             <label className="block text-[10px] font-black uppercase mb-2 text-gray-500 tracking-widest">Komentar</label>
             <textarea required value={text} onChange={e => setText(e.target.value)} className="w-full border-2 border-gray-900 p-4 font-semibold text-sm outline-none focus:border-amber-500 resize-none h-28" placeholder="Bagaimana kualitas bahan dan jahitannya?" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-gray-900 text-white font-black py-4 uppercase text-sm border-2 border-gray-900 shadow-solid-sm hover:translate-y-1 transition-all tracking-widest flex items-center justify-center gap-2">{isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />} {editData ? 'Simpan Perubahan' : 'Kirim Ulasan'}</button>
        </form>
      </div>
    </div>
  );
};

export const AdminProductModal = ({ isOpen, onClose, editData }) => {
  const { showToast } = useStore();
  const [form, setForm] = useState({ 
    name: '', price: '', type: 'Kaos', gender: 'Unisex', 
    desc: '', bahan: '', jahitan: '', warna: '', model: '', 
    sizes: '1-2Y, 3-4Y, 5-6Y', order: 99, label: '' 
  });
  const [imagesUrl, setImagesUrl] = useState(['', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

  const generateDescriptionWithAI = async () => {
    if (!form.name || !form.type) {
      showToast("Isi Nama Produk dan Kategori terlebih dahulu!");
      return;
    }
    setIsGeneratingDesc(true);
    try {
      const prompt = `Buatkan deskripsi produk marketing (jualan) yang sangat menarik, estetik, dan persuasif untuk toko pakaian anak premium "Kainora Kids".
Nama Baju: ${form.name}
Kategori: ${form.type}
Bahan: ${form.bahan || 'Katun premium'}
Model: ${form.model || 'Nyaman dipakai anak'}
Harga: Rp ${form.price || 'Terjangkau'}
Tulis dalam 1 atau 2 paragraf singkat saja tanpa tanda bintang (*). Jangan terlalu panjang.`;

      const text = await cloudAIService.chat([
        { role: 'system', content: 'Anda adalah copywriter handal untuk toko baju anak premium.' },
        { role: 'user', content: prompt }
      ], { temperature: 0.7, maxTokens: 200, stream: false });

      setForm(prev => ({ ...prev, desc: text.trim() }));
      showToast("Deskripsi berhasil dibuat dengan AI! ✨");
    } catch (err) {
      console.error(err);
      showToast("Gagal membuat deskripsi dengan AI.");
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || '', price: editData.price || '', type: editData.type || 'Kaos', gender: editData.gender || 'Unisex',
        desc: editData.desc || '', bahan: editData.bahan || '', jahitan: editData.jahitan || '', warna: editData.warna || '', model: editData.model || '', 
        sizes: (editData.sizes || []).join(', '), order: editData.order || 99, label: editData.label || ''
      });
      const existing = editData.images || [];
      setImagesUrl([
        existing[0] || '', existing[1] || '', existing[2] || '', existing[3] || '', existing[4] || ''
      ]);
    } else {
      setForm({ name: '', price: '', type: 'Kaos', gender: 'Unisex', desc: '', bahan: '', jahitan: '', warna: '', model: '', sizes: '1-2Y, 3-4Y, 5-6Y', order: 99, label: '' });
      setImagesUrl(['', '', '', '', '']);
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (index, value) => {
    const newUrls = [...imagesUrl];
    newUrls[index] = value;
    setImagesUrl(newUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalImages = imagesUrl.filter(url => url.trim() !== '');
    
    if (finalImages.length === 0) {
      showToast("Wajib mengisi minimal 1 Foto Produk di kolom pertama!");
      return;
    }
    
    setIsLoading(true);
    try {
      const productData = {
        name: form.name,
        price: Number(form.price),
        type: form.type,
        gender: form.gender,
        desc: form.desc,
        bahan: form.bahan,
        jahitan: form.jahitan,
        warna: form.warna,
        model: form.model,
        sizes: form.sizes.split(',').map(s => s.trim()).filter(s => s),
        img: finalImages[0], 
        images: finalImages,
        order: Number(form.order) || 99,
        label: form.label || '',
        updatedAt: serverTimestamp()
      };

      if (editData) {
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'products', String(editData.id)), productData);
        showToast("Produk berhasil diperbarui!");
      } else {
        const newId = Date.now();
        productData.id = newId;
        productData.sold = 0;
        productData.ages = [1,2,3,4,5,6,7,8,9,10];
        productData.createdAt = serverTimestamp();
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'products', String(newId)), productData);
        showToast("Produk baru ditambahkan!");
      }
      onClose();
    } catch (err) {
      console.error(err);
      showToast("Gagal menyimpan produk. Pastikan Rules Firestore sudah diizinkan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white border-4 border-gray-900 shadow-solid w-full max-w-3xl p-6 md:p-8 relative max-h-[95vh] overflow-y-auto text-left hide-scrollbar" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-red-100 transition-colors"><X size={20}/></button>
        <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-gray-900 pb-2">{editData ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-[10px] font-black uppercase mb-1">Nama Produk</label><input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full border-2 border-gray-900 p-2 text-sm focus:border-amber-500" /></div>
            <div><label className="block text-[10px] font-black uppercase mb-1">Harga (Angka)</label><input required type="number" value={form.price} onChange={e=>setForm({...form, price: e.target.value})} className="w-full border-2 border-gray-900 p-2 text-sm focus:border-amber-500" /></div>
            <div>
              <label className="block text-[10px] font-black uppercase mb-1">Kategori</label>
              <select value={form.type} onChange={e=>setForm({...form, type: e.target.value})} className="w-full border-2 border-gray-900 p-2 text-sm focus:border-amber-500">
                {['Kaos', 'Dress', 'Setelan', 'Jaket', 'Celana', 'Kemeja'].map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase mb-1">Gender</label>
              <select value={form.gender} onChange={e=>setForm({...form, gender: e.target.value})} className="w-full border-2 border-gray-900 p-2 text-sm focus:border-amber-500">
                {['Unisex', 'Laki-laki', 'Perempuan'].map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="md:col-span-2"><label className="block text-[10px] font-black uppercase mb-1">Pilihan Size (pisahkan dengan koma)</label><input required value={form.sizes} onChange={e=>setForm({...form, sizes: e.target.value})} placeholder="1-2Y, 3-4Y" className="w-full border-2 border-gray-900 p-2 text-sm focus:border-amber-500" /></div>
            
            <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-2 p-4 bg-gray-50 border-2 border-gray-100">
                <div><label className="block text-[10px] font-black uppercase mb-1 text-gray-500">Urutan Tampil (Angka)</label><input type="number" value={form.order} onChange={e=>setForm({...form, order: e.target.value})} className="w-full border-2 border-gray-900 p-2 text-sm bg-white focus:border-amber-500" placeholder="1 = Paling Atas" /></div>
                <div>
                   <label className="block text-[10px] font-black uppercase mb-1 text-gray-500">Label Promosi Khusus</label>
                   <select value={form.label} onChange={e=>setForm({...form, label: e.target.value})} className="w-full border-2 border-gray-900 p-2 text-sm bg-white focus:border-amber-500">
                      <option value="">Tidak Ada Label</option>
                      <option value="Terbaru">Terbaru</option>
                      <option value="Terlaris">Terlaris</option>
                      <option value="Paling Disukai">Paling Disukai</option>
                   </select>
                </div>
            </div>

            <div><label className="block text-[10px] font-black uppercase mb-1">Material Utama</label><input required value={form.bahan} onChange={e=>setForm({...form, bahan: e.target.value})} placeholder="Contoh: 100% Cotton" className="w-full border-2 border-gray-900 p-2 text-sm focus:border-amber-500" /></div>
            <div><label className="block text-[10px] font-black uppercase mb-1">Konstruksi Jahitan</label><input required value={form.jahitan} onChange={e=>setForm({...form, jahitan: e.target.value})} placeholder="Contoh: Rantai 3 Jarum" className="w-full border-2 border-gray-900 p-2 text-sm focus:border-amber-500" /></div>
            <div><label className="block text-[10px] font-black uppercase mb-1">Warna Tersedia</label><input required value={form.warna} onChange={e=>setForm({...form, warna: e.target.value})} placeholder="Contoh: Sage Green" className="w-full border-2 border-gray-900 p-2 text-sm focus:border-amber-500" /></div>
            <div><label className="block text-[10px] font-black uppercase mb-1">Model / Karakteristik</label><input required value={form.model} onChange={e=>setForm({...form, model: e.target.value})} placeholder="Contoh: Oversize Boxy" className="w-full border-2 border-gray-900 p-2 text-sm focus:border-amber-500" /></div>

            <div className="md:col-span-2">
               <div className="flex justify-between items-center mb-1">
                 <label className="block text-[10px] font-black uppercase">Deskripsi Lengkap</label>
                 <button type="button" onClick={generateDescriptionWithAI} disabled={isGeneratingDesc} className="text-[10px] bg-amber-100 text-amber-700 px-3 py-1 font-black uppercase hover:bg-amber-500 hover:text-gray-900 transition-colors flex items-center gap-1 border border-gray-900">
                    {isGeneratingDesc ? <Loader2 size={12} className="animate-spin"/> : <Bot size={12}/>}
                    {isGeneratingDesc ? 'Sedang Mengetik...' : '✨ Tulis dengan AI'}
                 </button>
               </div>
               <textarea required value={form.desc} onChange={e=>setForm({...form, desc: e.target.value})} className="w-full border-2 border-gray-900 p-2 text-sm focus:border-amber-500 h-24 resize-none" />
            </div>
          </div>
          
          <div className="border-t-4 border-gray-900 pt-4 mt-6 bg-gray-50 p-4">
             <label className="block text-sm font-black uppercase mb-2">Foto Produk (Maksimal 5)</label>
             <p className="text-[10px] text-gray-600 font-bold mb-4">Ketik nama gambar (contoh: <strong>kaos-pisang-1.jpg</strong>) jika file ada di folder public Anda, ATAU tempel link URL dari internet.</p>
             
             <div className="space-y-3">
                {[0, 1, 2, 3, 4].map((index) => (
                   <div key={index} className="flex items-center gap-3">
                      <span className="font-black text-xs w-6 bg-gray-900 text-white text-center py-1 rounded">{index + 1}</span>
                      <input 
                        type="text" 
                        value={imagesUrl[index]} 
                        onChange={e => handleImageChange(index, e.target.value)} 
                        placeholder={index === 0 ? "Wajib (Contoh: kaos-merah.jpg)..." : "Opsional (Contoh: kaos-merah-2.jpg)..."} 
                        className={`flex-1 border-2 border-gray-900 p-2 text-xs focus:border-amber-500 ${index === 0 ? 'bg-amber-50' : 'bg-white'}`} 
                        required={index === 0}
                      />
                      {imagesUrl[index] && (
                        <div className="w-10 h-10 border-2 border-gray-900 shrink-0 bg-white relative">
                          <img src={imagesUrl[index]} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/40?text=File+Lokal'; }} />
                        </div>
                      )}
                   </div>
                ))}
             </div>
          </div>
          
          <button type="submit" disabled={isLoading} className="w-full bg-gray-900 text-white font-black py-4 uppercase text-sm border-4 border-gray-900 shadow-solid-sm hover:-translate-y-1 flex justify-center items-center gap-2 mt-4">{isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Simpan Produk'}</button>
        </form>
      </div>
    </div>
  );
};

export const HomeQuickViewModal = ({ selectedProduct, setSelectedProduct, setActiveProduct }) => {
  const { addToCart, setView, toggleWishlist, wishlist } = useStore();
  const [size, setSize] = useState('1-2Y');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  
  useEffect(() => { if (selectedProduct && selectedProduct.sizes) setSize(selectedProduct.sizes[0]); }, [selectedProduct]);
  if (!selectedProduct) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
      <div className="bg-white border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-4xl flex flex-col md:flex-row relative overflow-y-auto max-h-[95vh] hide-scrollbar" onClick={e => e.stopPropagation()}>
        <button className="absolute top-2 right-2 md:top-4 md:right-4 z-[30] p-2 bg-white border-2 border-gray-900 hover:bg-amber-500 hover:text-gray-900 transition-colors shadow-sm" onClick={() => setSelectedProduct(null)}><X size={20} strokeWidth={3}/></button>
        <div className="md:w-1/2 p-4 bg-gray-50 border-r-0 md:border-r-4 border-b-4 md:border-b-0 border-gray-900 relative">
          <img src={selectedProduct.img || (selectedProduct.images && selectedProduct.images[0])} className="w-full aspect-square object-cover border-2 border-gray-900" alt={selectedProduct.alt} />
          <button className="absolute bottom-6 right-6 md:top-6 md:right-6 md:bottom-auto z-20 bg-white/90 p-3 border-2 border-gray-900 hover:border-amber-500 transition-colors shadow-sm" onClick={(e) => toggleWishlist(e, selectedProduct.id)}><Heart size={20} fill={wishlist.includes(selectedProduct.id) ? 'currentColor' : 'none'} className={wishlist.includes(selectedProduct.id) ? 'text-brand-red' : 'text-gray-900'} /></button>
        </div>
        <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center text-left bg-white">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{selectedProduct.type} / {selectedProduct.gender}</p>
          <h2 className="text-2xl md:text-3xl font-black uppercase mb-4 tracking-tighter leading-tight">{selectedProduct.name}</h2>
          <p className="text-2xl md:text-3xl font-black text-brand-red mb-6 md:mb-8 border-b-2 border-gray-100 pb-4 md:pb-6">{formatPrice(selectedProduct.price)}</p>
          <div className="mb-6 md:mb-8">
            <div className="flex justify-between items-center mb-4"><span className="text-xs font-black uppercase text-gray-900 tracking-widest">Pilih Ukuran Anak</span><button onClick={() => setIsSizeGuideOpen(true)} className="text-[10px] underline uppercase font-black text-gray-500 hover:text-brand-red">Size Guide</button></div>
            <div className="flex gap-2 md:gap-3 flex-wrap">{selectedProduct.sizes?.map(s => <button key={s} onClick={() => setSize(s)} className={`px-3 py-1.5 md:px-5 md:py-3 border-2 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${size === s ? 'border-gray-900 bg-gray-900 text-white shadow-solid-sm -translate-y-1' : 'border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900'}`}>{s}</button>)}</div>
          </div>
          <button onClick={() => { addToCart(selectedProduct, size, 1); setSelectedProduct(null); }} className="w-full bg-amber-500 text-gray-900 h-14 md:h-16 font-black uppercase text-xs md:text-sm border-4 border-gray-900 shadow-solid-sm hover:shadow-solid hover:-translate-y-1 transition-all active:shadow-none flex items-center justify-center gap-3 mb-4 md:mb-6"><ShoppingCart size={18} strokeWidth={2.5}/> Tambah Ke Keranjang</button>
          <button onClick={() => { setActiveProduct(selectedProduct); setView('productDetail'); setSelectedProduct(null); }} className="text-[10px] md:text-xs font-bold text-center underline uppercase text-gray-500 hover:text-brand-red tracking-widest transition-colors">Lihat Spesifikasi Lengkap</button>
        </div>
      </div>
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} onSelectSize={(sz) => { setSize(sz); setIsSizeGuideOpen(false); }} availableSizes={selectedProduct.sizes} />
    </div>
  );
};


// ============================================================================
// 5. CUSTOM UI ELEMENTS (DROPDOWNS)
// ============================================================================
export const ModernDropdown = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left shrink-0" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 md:py-2 text-[11px] md:text-sm font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
      >
        {label}: <span className="text-gray-900">{value}</span>
        <ChevronDown size={14} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-44 md:w-48 origin-top-left bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="py-1 max-h-60 overflow-y-auto hide-scrollbar">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`block w-full text-left px-4 py-2.5 text-[11px] md:text-sm font-bold transition-colors ${value === opt ? 'bg-amber-50 text-brand-red' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                {opt === 'Semua' ? `Semua ${label}` : opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const ColorDropdown = ({ value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeColor = options.find(c => c.name === value);

  return (
    <div className="relative inline-block text-left shrink-0" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 md:py-2 text-[11px] md:text-sm font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
      >
        Warna: 
        <div className="flex items-center gap-1.5">
           {value !== 'Semua' && activeColor && (
             <span className="w-3.5 h-3.5 rounded-full border border-gray-300" style={{ background: activeColor.hex }}></span>
           )}
           <span className="text-gray-900">{value}</span>
        </div>
        <ChevronDown size={14} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-48 md:w-52 origin-top-left bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="py-1 max-h-64 overflow-y-auto hide-scrollbar">
            {options.map((opt) => (
              <button
                key={opt.name}
                onClick={() => { onChange(opt.name); setIsOpen(false); }}
                className={`flex items-center gap-3 w-full text-left px-4 py-2.5 text-[11px] md:text-sm font-bold transition-colors ${value === opt.name ? 'bg-amber-50 text-brand-red' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <span className="w-4 h-4 rounded-full border border-gray-300 shrink-0 shadow-sm" style={{ background: opt.hex }}></span>
                <span className="truncate">{opt.name === 'Semua' ? 'Semua Warna' : opt.name}</span>
                {value === opt.name && <Check size={14} className="ml-auto text-brand-red shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};



export const WriteReviewModal = ({ isOpen, onClose, product }) => {
  const { user, showToast } = useStore();
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) { showToast("Komentar tidak boleh kosong."); return; }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'reviews'), {
        productId: product.id,
        productName: product.name,
        userId: user?.uid || 'guest',
        name: user?.name || 'Customer',
        rating,
        text,
        createdAt: serverTimestamp()
      });
      showToast("Ulasan berhasil dikirim! Terima kasih.");
      onClose();
    } catch(err) {
      showToast("Gagal mengirim ulasan.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white border-4 border-gray-900 p-6 md:p-8 w-full max-w-md relative shadow-solid" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors"><X size={24} strokeWidth={3}/></button>
        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-2">Tulis Ulasan</h3>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 border-b-2 border-gray-100 pb-4">{product?.name}</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase mb-3 tracking-widest text-gray-500">Penilaian Anda</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(star => (
                <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none hover:scale-110 transition-transform">
                  <Star size={32} fill={star <= rating ? "#f59e0b" : "none"} className={star <= rating ? "text-brand-red" : "text-gray-300"} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase mb-3 tracking-widest text-gray-500">Komentar & Pengalaman</label>
            <textarea 
              required 
              rows={4} 
              className="w-full border-4 border-gray-900 p-4 font-bold outline-none focus:border-amber-500 transition-colors text-sm resize-none" 
              placeholder="Ceritakan pengalaman si kecil pakai baju ini..."
              value={text}
              onChange={e => setText(e.target.value)}
            ></textarea>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-amber-500 text-gray-900 py-4 font-black uppercase text-sm border-4 border-gray-900 shadow-solid hover:translate-y-1 transition-all tracking-widest flex justify-center items-center gap-2">
            {isSubmitting ? <Loader2 className="animate-spin" size={18}/> : 'Kirim Ulasan'}
          </button>
        </form>
      </div>
    </div>
  );
};
