import { SEO } from '../constants/data';
import React, { useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CustomVideoPlayer, Parallax } from '../components/ui/Modals';
import InstagramFeed from '../components/layout/InstagramFeed';
import { Hero } from '../components/home/Hero';
import { QualityStory } from '../components/home/QualityStory';
import { NewDropRail } from '../components/home/NewDropRail';
import { Lookbook } from '../components/home/Lookbook';
import { CheckerFrame, CheckerStrip } from '../components/neo/Checker';
import { Bubble, Cloud, Flower } from '../components/neo/Stickers';
import { SplitReveal, TextRoll } from '../components/motion/KineticText';
import { ScrambleText } from '../components/motion/ScrambleText';
import { ScrollMarquee } from '../components/motion/ScrollMarquee';
import { MaskReveal } from '../components/motion/MaskReveal';
import { DragSticker } from '../components/motion/DragSticker';

const TICKER = ['New Drop', 'Katun Adem', 'Anti Alergi', 'Boxy Oversize', 'Gratis Ongkir Jawa', 'Kulit Sensitif Aman'];

const SectionHead = ({ kicker, title, accent, action, onAction }) => (
  <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end md:mb-10">
    <div>
      {kicker && <ScrambleText as="p" text={kicker} className="neo-pill mb-4 bg-paper" />}
      <h2 className="display text-[clamp(2.1rem,6vw,5.2rem)]">
        <SplitReveal text={title} className="block" />
        {accent && <SplitReveal text={accent} className="block text-brand-red" delay={0.2} />}
      </h2>
    </div>
    {action && (
      <button onClick={onAction} className="neo-btn roll-host hidden shrink-0 md:inline-flex">
        <TextRoll>{action}</TextRoll> <ChevronRight size={16} strokeWidth={3} />
      </button>
    )}
  </div>
);

export const HomeView = ({ setSelectedProduct }) => {
  const { setView, toggleWishlist, wishlist, setGlobalGenderFilter, products } = useStore();

  // --- LOGIKA: Filter Produk 7 Hari Terakhir ---
  const recentProducts = useMemo(() => {
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const timeOf = (p) => {
      if (p.createdAt && typeof p.createdAt.toMillis === 'function') return p.createdAt.toMillis();
      if (p.createdAt) return p.createdAt;
      // Fallback untuk dummy awal yang id-nya < 1000 agar masuk status "Baru"
      return p.id < 1000 ? Date.now() : p.id;
    };
    return products
      .filter((p) => timeOf(p) >= sevenDaysAgo)
      .sort((a, b) => timeOf(b) - timeOf(a))
      .slice(0, 8); // Maksimal tampil 8 produk
  }, [products]);

  const goProducts = () => setView('products');
  const pickGender = (g) => { setGlobalGenderFilter(g); setView('products'); };

  return (
    <div className="relative z-0 text-left">
      <SEO title="Kainora Kids — Toko Baju Anak Premium Katun Adem | Gratis Ongkir Jawa" description="Kainora Kids — Toko baju anak premium #1 Indonesia. Koleksi kaos, dress & setelan anak bahan 100% katun tebal, super adem, ramah kulit sensitif. Korean style oversize boxy. Gratis ongkir se-Jawa!" keywords="baju anak premium, toko baju anak online terpercaya, baju anak katun adem, kaos anak oversize boxy, baju anak korean style, toko baju anak terdekat jakarta bandung surabaya semarang yogyakarta, racun tiktok baju anak, ootd anak pinterest, baju anak kekinian 2026, kainora kids" />
      <h1 className="sr-only">Toko Baju Anak Premium Indonesia - Kainora Kids</h1>

      <Hero onShop={goProducts} />

      {/* Ticker kinetik: kecepatan & kemiringan mengikuti scroll */}
      <CheckerStrip size={16} />
      <div className="border-y-[3px] border-ink bg-brand-pink py-3 sm:py-4" aria-label="Keunggulan Kainora Kids">
        <ScrollMarquee speed={-3.4}>
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="flex items-center gap-5 pr-5 sm:gap-8 sm:pr-8">
              <span className="display text-[clamp(2rem,5.6vw,4.8rem)]">{t}</span>
              <Flower size={44} petals={i % 2 ? 'var(--yellow)' : 'var(--paper)'} className="shrink-0 max-sm:h-8 max-sm:w-8" />
            </span>
          ))}
        </ScrollMarquee>
      </div>

      <QualityStory />

      <NewDropRail
        products={recentProducts}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
        onOpen={setSelectedProduct}
        onAll={goProducts}
      />

      <Lookbook onPick={pickGender} />

      {/* BEHIND THE SCENES — jendela video */}
      <section className="mx-auto max-w-[1300px] px-3 py-16 sm:px-6" aria-labelledby="journey">
        <div id="journey">
          <SectionHead kicker={'Proses "Behind The Scene" Baju Anak Kainora'} title="Perjalanan" accent="Pesanan Bunda" />
        </div>
        <div className="relative">
          <DragSticker className="absolute -left-3 -top-16 z-20 hidden md:block" tilt={-12}><Cloud width={130} className="animate-bob" /></DragSticker>
          <Bubble className="absolute -right-2 -top-10 z-20 h-16 w-36 rotate-6 sm:-right-6 sm:h-20 sm:w-44" textClass="text-sm sm:text-lg">BEHIND THE SCENES</Bubble>
          <MaskReveal shape="blinds" stripes={10} amount={0.12} className="rounded-[18px] shadow-solid-lg">
            <div className="neo-panel overflow-hidden bg-paper">
              <div className="flex items-center gap-2 border-b-[3px] border-ink bg-brand-teal px-3 py-2">
                <span className="h-3.5 w-3.5 rounded-full border-[2.5px] border-ink bg-brand-red" />
                <span className="h-3.5 w-3.5 rounded-full border-[2.5px] border-ink bg-brand-yellow" />
                <span className="h-3.5 w-3.5 rounded-full border-[2.5px] border-ink bg-brand-green" />
                <span className="font-arcade ml-2 truncate text-[0.6rem] uppercase tracking-wider">perjalanan-pesanan.mp4</span>
              </div>
              <video className="print aspect-video w-full object-cover" muted autoPlay playsInline loop controlsList="nodownload" disablePictureInPicture onContextMenu={(e) => e.preventDefault()} poster={products[0]?.img}>
                <source src="/video/VIDEO-WEB-PERJALANAN.mp4" type="video/mp4" />
              </video>
            </div>
          </MaskReveal>
        </div>
      </section>

      {/* AFFILIATE */}
      <section className="mx-auto max-w-[1300px] px-3 py-10 sm:px-6">
        <CheckerFrame size={11} className="shadow-solid">
          <div className="relative flex flex-col items-center justify-between gap-5 bg-brand-yellow p-6 text-center sm:p-10 md:flex-row md:text-left">
            <div className="flex-1">
              <h2 className="display text-[clamp(1.9rem,4.4vw,3.6rem)]">Program Affiliate<br />Baju Anak</h2>
              <p className="mt-3 max-w-xl text-xs font-extrabold uppercase leading-relaxed tracking-wider sm:text-sm">Bagikan rekomendasi produk premium kami dan dapatkan komisi menarik setiap penjualan.</p>
            </div>
            <button onClick={() => setView('affiliate')} className="neo-btn neo-btn--ink roll-host shrink-0">
              <TextRoll>Pelajari Affiliate</TextRoll> <ChevronRight size={16} strokeWidth={3} />
            </button>
          </div>
        </CheckerFrame>
      </section>

      {/* TIKTOK */}
      <section className="mx-auto max-w-[1500px] px-3 py-16 sm:px-6 lg:px-10" aria-labelledby="tiktok">
        <div id="tiktok">
          <SectionHead kicker="Racun TikTok Kainora Kids" title="Featured On" accent="TikTok" action="Follow TikTok Kami" onAction={() => window.open('https://www.tiktok.com/@taufansurc', '_blank')} />
        </div>
        <div className="hide-scrollbar -mx-3 flex snap-x snap-mandatory gap-4 overflow-x-auto px-3 pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:px-0">
          {/* Ganti "PLACEHOLDER_1" dengan nama file MP4 yang sudah diunduh (misal: "video-promo-1.mp4") */}
          <CustomVideoPlayer src="PLACEHOLDER_1" className="min-w-[75vw] shrink-0 snap-center md:min-w-0" />
          <CustomVideoPlayer src="PLACEHOLDER_2" className="min-w-[75vw] shrink-0 snap-center md:min-w-0" />
          <CustomVideoPlayer src="PLACEHOLDER_3" className="min-w-[75vw] shrink-0 snap-center md:min-w-0" />
        </div>
        <div className="mt-6 md:hidden">
          <button onClick={() => window.open('https://www.tiktok.com/@taufansurc', '_blank')} className="neo-btn neo-btn--ink w-full">Follow TikTok Kami <ChevronRight size={16} strokeWidth={3} /></button>
        </div>
      </section>

      <Parallax speed={0.2} className="relative my-10 block aspect-[21/9] w-full border-y-[3px] border-ink md:my-12 md:aspect-[21/4]">
        <img src="/images/banners/banner-hero-slider-1.jpg" alt="Promo Banner Kainora Kids" className="print block h-full w-full object-cover" />
      </Parallax>

      <InstagramFeed />
    </div>
  );
};
