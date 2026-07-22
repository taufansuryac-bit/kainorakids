import React from 'react';
import { VideoIcon, Instagram, ShoppingCart, MessageCircle, Mail } from 'lucide-react';
import { LOGO_URL, WA_NUMBER } from '../../firebase';

export const FooterComponent = ({ openPopup }) => {
  return (
  <footer className="bg-gray-900 text-white pt-12 md:pt-20 pb-8 md:pb-10 border-t-4 border-amber-500 relative z-10 w-full">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:grid md:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16 text-center md:text-left">
        <div className="md:col-span-1 mb-2 md:mb-0">
          <div className="flex justify-center md:justify-start mb-4 md:mb-6"><img src={LOGO_URL} alt="Kainora Kids Logo" className="h-10 md:h-12 w-auto object-contain" /></div>
          <p className="text-gray-400 text-xs md:text-sm leading-relaxed font-medium px-4 md:px-0">Menghadirkan revolusi pakaian anak modern dengan perpaduan desain kekinian dan material premium.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full md:contents">
          <nav className="flex flex-col items-center md:items-start">
            <h3 className="text-[10px] md:text-xs font-bold mb-4 uppercase tracking-widest text-gray-500">Our Partner</h3>
            <div className="flex flex-col items-center md:items-start space-y-3">
               <div className="bg-white text-blue-800 font-black italic px-3 py-1 md:py-2 w-fit rounded shadow-sm border border-gray-200 text-[10px] md:text-sm tracking-wider">BCA</div>
               <div className="bg-white text-blue-600 font-black italic px-3 py-1 md:py-2 w-fit rounded shadow-sm border border-gray-200 text-[10px] md:text-sm tracking-wider">BRI</div>
               <div className="bg-red-600 text-white font-black italic px-3 py-1 md:py-2 w-fit rounded shadow-sm border border-red-700 flex items-center gap-1 text-[10px] md:text-sm tracking-wider">QRIS</div>
            </div>
          </nav>
          <nav className="flex flex-col items-center md:items-start">
            <h3 className="text-[10px] md:text-xs font-bold mb-4 uppercase tracking-widest text-gray-500">Pusat Bantuan</h3>
            <ul className="space-y-3 text-[10px] md:text-sm font-semibold text-gray-300">
              <li><button onClick={() => openPopup('cara')} className="hover:text-amber-400 uppercase tracking-wider">Cara Belanja</button></li>
              <li><button onClick={() => openPopup('retur')} className="hover:text-amber-400 uppercase tracking-wider">Retur & Refund</button></li>
              <li><button onClick={() => openPopup('faq')} className="hover:text-amber-400 uppercase tracking-wider">FAQ</button></li>
            </ul>
          </nav>
        </div>
        <div className="mt-4 md:mt-0">
          <h3 className="text-[10px] md:text-xs font-bold mb-4 uppercase tracking-widest text-gray-500">Our Social Media</h3>
          <div className="flex flex-wrap md:flex-col gap-2 md:gap-3 justify-center md:justify-start items-center md:items-start">
            <button onClick={() => window.open('https://www.tiktok.com/@taufansurc', '_blank')} className="flex items-center gap-2 text-gray-300 hover:text-amber-500 transition-colors text-[10px] md:text-sm font-semibold bg-gray-800 md:bg-transparent px-3 py-2 md:p-0 rounded-full md:rounded-none"><VideoIcon size={14} className="md:w-[18px] md:h-[18px]"/> TikTok</button>
            <button onClick={() => window.open('https://www.instagram.com/taufansurc/', '_blank')} className="flex items-center gap-2 text-gray-300 hover:text-amber-500 transition-colors text-[10px] md:text-sm font-semibold bg-gray-800 md:bg-transparent px-3 py-2 md:p-0 rounded-full md:rounded-none"><Instagram size={14} className="md:w-[18px] md:h-[18px]"/> Instagram</button>
            <button onClick={() => window.open('https://shopee.co.id', '_blank')} className="flex items-center gap-2 text-gray-300 hover:text-amber-500 transition-colors text-[10px] md:text-sm font-semibold bg-gray-800 md:bg-transparent px-3 py-2 md:p-0 rounded-full md:rounded-none"><ShoppingCart size={14} className="md:w-[18px] md:h-[18px]"/> Shopee</button>
            <button onClick={() => window.open(`https://wa.me/${WA_NUMBER}`, '_blank')} className="flex items-center gap-2 text-gray-300 hover:text-amber-500 transition-colors text-[10px] md:text-sm font-semibold bg-gray-800 md:bg-transparent px-3 py-2 md:p-0 rounded-full md:rounded-none"><MessageCircle size={14} className="md:w-[18px] md:h-[18px]"/> WhatsApp</button>
            <button onClick={() => window.open('mailto:admin@kainorakids.com', '_blank')} className="flex items-center gap-2 text-gray-300 hover:text-amber-500 transition-colors text-[10px] md:text-sm font-semibold bg-gray-800 md:bg-transparent px-3 py-2 md:p-0 rounded-full md:rounded-none"><Mail size={14} className="md:w-[18px] md:h-[18px]"/> Mail</button>
          </div>
          <p className="mt-6 md:mt-4 text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest border-t border-gray-800 pt-4 text-center md:text-left w-full">CV Marbella Utama Mandiri</p>
        </div>
      </div>
      <p className="text-[9px] md:text-xs font-bold uppercase text-gray-500 text-center border-t border-gray-800 pt-6 md:pt-8 tracking-widest">© 2026 KAINORA KIDS. ALL RIGHTS RESERVED.</p>
    </div>
  </footer>
  );
};
