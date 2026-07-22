import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle, ArrowRight, Sparkles, Star, LockOpen } from 'lucide-react';
import { SEO } from '../constants/data';

export const ThankYouView = () => {
  const { setView } = useStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center py-24 px-4 relative overflow-hidden selection:bg-amber-500 selection:text-black">
      <SEO title="Pesanan Berhasil | Kainora Kids Exclusive" description="Pesanan eksklusif Bunda sedang diproses." />
      
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-3xl w-full relative z-10">
        
        {/* Main Success Card */}
        <div className="bg-gray-900/60 backdrop-blur-2xl border border-gray-800 rounded-3xl p-10 md:p-16 text-center shadow-[0_0_50px_rgba(245,158,11,0.05)] transform transition-all duration-700 hover:shadow-[0_0_80px_rgba(245,158,11,0.1)]">
          
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-amber-400 blur-2xl opacity-20 animate-pulse"></div>
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
              <CheckCircle size={48} className="text-gray-900" strokeWidth={2} />
            </div>
            <Sparkles size={24} className="text-amber-300 absolute -top-2 -right-2 animate-bounce" />
            <Star size={16} className="text-amber-200 absolute bottom-0 -left-4 animate-pulse" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 mb-6 tracking-tighter">
            Pesanan Diamankan!
          </h1>
          
          <p className="text-gray-400 font-medium mb-12 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
            Data pesanan Bunda telah masuk ke sistem VIP kami. 
            <span className="block mt-2 text-white font-bold">Silakan periksa WhatsApp Bunda untuk menyelesaikan pembayaran bersama Admin.</span>
          </p>

          {/* Psychological Hook: Hidden Collection / Exclusive Access */}
          <div className="relative group cursor-pointer mb-12" onClick={() => setView('products')}>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 justify-between overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl"></div>
              
              <div className="flex items-center gap-5 text-left z-10">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0 relative">
                  <div className="absolute inset-0 bg-amber-400 rounded-full blur opacity-20 animate-pulse"></div>
                  <LockOpen size={32} className="text-amber-400 relative z-10" />
                </div>
                <div>
                  <h3 className="text-amber-400 font-black uppercase tracking-widest text-sm mb-1 flex items-center gap-2">
                    Akses Rahasia Terbuka <Sparkles size={14} className="text-amber-300"/>
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Sebagai pelanggan <strong className="text-white">VIP</strong>, Bunda kini mendapat akses eksklusif untuk melihat 
                    <strong className="text-amber-400"> "Katalog Tersembunyi"</strong> sebelum dirilis ke publik. Stok sangat terbatas!
                  </p>
                </div>
              </div>
              
              <button className="z-10 bg-white text-gray-900 font-black px-6 py-3 rounded-full uppercase tracking-widest text-[10px] sm:text-xs flex items-center justify-center gap-2 hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all whitespace-nowrap">
                Lihat Katalog <ArrowRight size={16} />
              </button>
            </div>
          </div>
          
          <button 
            onClick={() => setView('home')}
            className="text-gray-500 hover:text-white font-black uppercase tracking-widest text-xs transition-colors border-b border-transparent hover:border-white pb-1"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </main>
  );
};
