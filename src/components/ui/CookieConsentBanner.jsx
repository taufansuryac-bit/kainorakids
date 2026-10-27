import React, { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import { CONSENT_KEY, updateAnalyticsConsent } from '../../utils/analytics';

export const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mengecek apakah user sudah pernah menyetujui cookie/cache sebelumnya
    let consent = 'unavailable';
    try { consent = localStorage.getItem(CONSENT_KEY); } catch { /* Storage blocked: do not nag on every view. */ }
    if (!consent) {
      // Menunda kemunculan banner agar tidak mengganggu loading awal (muncul setelah 2 detik)
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    try { localStorage.setItem(CONSENT_KEY, 'accepted'); } catch { /* Storage is optional. */ }
    updateAnalyticsConsent(true);
    setIsVisible(false);
  };

  const handleDecline = () => {
    // Meskipun menolak, kita simpan agar tidak terus-terusan muncul,
    // tapi tandai sebagai declined
    try { localStorage.setItem(CONSENT_KEY, 'declined'); } catch { /* Storage is optional. */ }
    updateAnalyticsConsent(false);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed bottom-0 left-0 z-[9999] flex w-full items-end justify-center p-3 sm:p-4" role="dialog" aria-label="Izin cache dan cookie">
      <style>{`
        @keyframes popBanner {
          0% { transform: translateY(120%) rotate(-2deg); opacity: 0; }
          70% { transform: translateY(-6px) rotate(0.5deg); opacity: 1; }
          100% { transform: translateY(0) rotate(0); opacity: 1; }
        }
        .animate-pop-banner { animation: popBanner 0.7s var(--ease-out) forwards; }
      `}</style>

      <div className="cookie-notice neo-panel animate-pop-banner pointer-events-auto relative flex w-full max-w-4xl flex-col items-start justify-between gap-5 bg-brand-yellow p-5 pr-12 shadow-solid-lg md:flex-row md:items-center md:p-6 md:pr-14">
        <div className="flex flex-1 items-start gap-4">
          <div className="hidden shrink-0 place-items-center rounded-full border-[3px] border-ink bg-paper p-3 sm:grid">
            <Cookie size={26} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="display mb-2 text-xl md:text-2xl">Izinkan Cache & Cookie?</h3>
            <p className="text-sm font-semibold leading-relaxed">
              Kami menggunakan <em>cache</em> dan teknologi serupa untuk memastikan Anda mendapatkan pengalaman berbelanja yang super cepat, personal, dan aman di website Kainora Kids.
              <a href="/kebijakan-privasi/" className="ml-1 underline decoration-[3px] underline-offset-2 hover:text-brand-red">Pelajari lebih lanjut.</a>
            </p>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col items-center gap-3 sm:flex-row md:w-auto">
          <button onClick={handleDecline} className="neo-btn w-full !bg-paper sm:w-auto">Tolak</button>
          <button onClick={handleAccept} className="neo-btn neo-btn--ink w-full sm:w-auto">Izinkan Semua</button>
        </div>

        <button
          onClick={handleDecline}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border-[3px] border-ink bg-paper transition-transform hover:rotate-90"
          aria-label="Tutup"
        >
          <X size={18} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};
