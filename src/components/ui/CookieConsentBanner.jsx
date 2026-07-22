import React, { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';

export const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mengecek apakah user sudah pernah menyetujui cookie/cache sebelumnya
    const consent = localStorage.getItem('kainora_cookie_consent');
    if (!consent) {
      // Menunda kemunculan banner agar tidak mengganggu loading awal (muncul setelah 2 detik)
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('kainora_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    // Meskipun menolak, kita simpan agar tidak terus-terusan muncul,
    // tapi tandai sebagai declined
    localStorage.setItem('kainora_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[9999] p-4 pointer-events-none flex justify-center items-end">
      {/* Animasi muncul dari bawah */}
      <style>{`
        @keyframes slideUpBanner {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up-banner {
          animation: slideUpBanner 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      
      <div className="bg-gray-900 text-white shadow-2xl rounded-sm w-full max-w-4xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pointer-events-auto border-t-4 border-amber-500 animate-slide-up-banner">
        
        <div className="flex items-start gap-4 flex-1">
          <div className="hidden sm:flex bg-gray-800 p-3 rounded-full shrink-0">
            <Cookie size={24} className="text-amber-500" />
          </div>
          <div>
            <h3 className="font-black text-lg md:text-xl uppercase tracking-widest text-white mb-2 flex items-center gap-2">
              <span className="sm:hidden text-amber-500"><Cookie size={20} /></span>
              Izinkan Cache & Cookie?
            </h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed font-medium">
              Kami menggunakan <em>cache</em> dan teknologi serupa untuk memastikan Anda mendapatkan pengalaman berbelanja yang super cepat, personal, dan aman di website Kainora Kids. 
              <a href="#" className="text-amber-500 hover:text-amber-400 underline ml-1">Pelajari lebih lanjut.</a>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <button 
            onClick={handleDecline}
            className="w-full sm:w-auto px-6 py-3 border border-gray-700 text-gray-300 font-bold uppercase text-xs tracking-widest hover:bg-gray-800 hover:text-white transition-colors"
          >
            Tolak
          </button>
          <button 
            onClick={handleAccept}
            className="w-full sm:w-auto px-8 py-3 bg-amber-500 text-gray-900 font-black uppercase text-xs tracking-widest hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
          >
            Izinkan Semua
          </button>
        </div>

        <button 
          onClick={handleDecline} 
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-1"
          aria-label="Tutup"
        >
          <X size={20} />
        </button>

      </div>
    </div>
  );
};
