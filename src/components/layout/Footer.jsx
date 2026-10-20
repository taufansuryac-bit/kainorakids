import React from 'react';
import { VideoIcon, Instagram, ShoppingCart, MessageCircle, Mail, ArrowUp, ArrowUpRight } from 'lucide-react';
import { LOGO_URL, WA_NUMBER } from '../../firebase';
import { useStore } from '../../context/StoreContext';
import { CheckerEdge, CheckerStrip } from '../neo/Checker';
import { HalftoneWordmark } from '../neo/HalftoneWordmark';
import { TextRoll } from '../motion/KineticText';
import { Burst } from '../neo/Stickers';

const SOCIALS = [
  { label: 'TikTok', Icon: VideoIcon, action: () => window.open('https://www.tiktok.com/@taufansurc', '_blank') },
  { label: 'Instagram', Icon: Instagram, action: () => window.open('https://www.instagram.com/taufansurc/', '_blank') },
  { label: 'Shopee', Icon: ShoppingCart, action: () => window.open('https://shopee.co.id', '_blank') },
  { label: 'WhatsApp', Icon: MessageCircle, action: (n) => window.open(`https://wa.me/${n}`, '_blank') },
  { label: 'Mail', Icon: Mail, action: () => window.open('mailto:admin@kainorakids.com', '_blank') },
];

const Title = ({ children }) => (
  <h3 className="font-arcade mb-4 text-[0.78rem] uppercase tracking-[0.14em]">{children}</h3>
);

export const FooterComponent = ({ openPopup }) => {
  const { setView, setGlobalGenderFilter } = useStore();
  const go = (v) => { if (v === 'products') setGlobalGenderFilter('Semua'); setView(v); };

  return (
    <footer className="relative z-10 mt-16 w-full">
      {/* Tepi checkerboard bergerigi, persis pola referensi */}
      <CheckerEdge size={18} color="var(--red)" className="max-sm:![--cs:12px]">
        <div className="bg-brand-red px-3 pb-10 pt-8 sm:px-6 lg:px-10">
          <div className="relative mx-auto max-w-[1500px]">
            <Burst fill="var(--yellow)" className="absolute -top-14 right-2 hidden h-28 w-28 rotate-12 sm:grid" textClass="text-[0.62rem]">
              SAMPAI<br />JUMPA!
            </Burst>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <section className="neo-panel bg-paper p-6 shadow-solid-sm">
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-full border-[3px] border-ink bg-brand-yellow">
                    <img src={LOGO_URL} alt="Kainora Kids" className="h-7 w-7 object-contain" />
                  </span>
                  <span className="display text-2xl">Kainora</span>
                </div>
                <p className="text-sm font-semibold leading-relaxed">
                  Menghadirkan revolusi pakaian anak modern dengan perpaduan desain kekinian dan material premium.
                </p>
                <nav className="mt-5 flex flex-wrap gap-2" aria-label="Pintasan">
                  {[['Beranda', 'home'], ['Produk', 'products'], ['Blog', 'blog'], ['Affiliate', 'affiliate']].map(([l, v]) => (
                    <button key={v} onClick={() => go(v)} className="neo-pill roll-host transition-colors hover:bg-brand-yellow">
                      <TextRoll>{l}</TextRoll>
                    </button>
                  ))}
                </nav>
              </section>

              <section className="neo-panel bg-brand-yellow p-6 shadow-solid-sm">
                <Title>Our Partner</Title>
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-lg border-[3px] border-ink bg-paper px-4 py-2 text-lg font-black italic tracking-wider text-blue-800">BCA</span>
                  <span className="rounded-lg border-[3px] border-ink bg-paper px-4 py-2 text-lg font-black italic tracking-wider text-brand-sky">BRI</span>
                  <span className="rounded-lg border-[3px] border-ink bg-brand-red px-4 py-2 text-lg font-black italic tracking-wider text-paper">QRIS</span>
                </div>
                <p className="mt-6 border-t-[3px] border-ink pt-4 text-[0.65rem] font-black uppercase tracking-[0.18em]">CV Marbella Utama Mandiri</p>
              </section>

              <section className="neo-panel bg-brand-pink p-6 shadow-solid-sm">
                <Title>Pusat Bantuan</Title>
                <ul className="space-y-1">
                  {[['Cara Belanja', 'cara'], ['Retur & Refund', 'retur'], ['FAQ', 'faq']].map(([l, k]) => (
                    <li key={k}>
                      <button onClick={() => openPopup?.(k)} className="roll-host display flex w-full items-center justify-between border-b-[3px] border-ink py-2.5 text-left text-2xl">
                        <TextRoll>{l}</TextRoll> <ArrowUpRight size={22} strokeWidth={3} />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="neo-panel bg-brand-teal p-6 shadow-solid-sm">
                <Title>Our Social Media</Title>
                <div className="flex flex-wrap gap-2.5">
                  {SOCIALS.map(({ label, Icon, action }) => (
                    <button key={label} onClick={() => action(WA_NUMBER)} className="neo-pill roll-host bg-paper py-2.5 transition-transform hover:-translate-y-1 hover:bg-brand-yellow">
                      <Icon size={15} strokeWidth={2.75} /> <TextRoll>{label}</TextRoll>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </CheckerEdge>

      {/* Wordmark halftone raksasa yang terpotong tepi bawah */}
      <div className="relative overflow-hidden bg-ink px-2 pt-16 sm:px-4 sm:pt-12">
        <div className="mx-auto max-w-[1800px]">
          <div className="-mb-[1.2%]">
            <HalftoneWordmark text="KAINORA" />
          </div>
        </div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="neo-btn absolute right-4 top-4 !px-4 !py-3 !text-[0.65rem] sm:right-8 sm:top-8"
          aria-label="Kembali ke atas"
        >
          <ArrowUp size={14} strokeWidth={3} /> Atas
        </button>
      </div>
      <CheckerStrip size={12} tone="ink" />
      <div className="bg-ink px-4 py-4 text-center text-[0.62rem] font-black uppercase tracking-[0.2em] text-paper sm:text-[0.7rem]">
        © 2026 KAINORA KIDS. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
};
