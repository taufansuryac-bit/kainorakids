import { motion } from 'motion/react';
import { ArrowUpRight, Instagram, Play, Plus } from 'lucide-react';
import { useMotionPreference } from './useMotionPreference';
import './social-affiliate.css';

const SOCIALS = [
  { name: 'Instagram', handle: '@kainorakids', href: 'https://www.instagram.com/kainorakids/', Icon: Instagram },
  { name: 'TikTok', handle: '@kainorastore.id', href: 'https://www.tiktok.com/@kainorastore.id', Icon: Play },
];

export function SocialWorld() {
  const reduce = useMotionPreference();
  return <section id="social" className="f-social-world" aria-labelledby="social-title">
    <div className="f-social-meta f-cap"><span>IKUTI KAINORA KIDS</span><span>INSTAGRAM + TIKTOK</span></div>
    <div className="f-social-layout">
      <div className="f-social-art" aria-label="Gaya dan koleksi Kainora">
        {[
          { src: '/images/kainora-categories/boys.webp', alt: 'Gaya Kainora Boys, model membelakangi kamera', tag: 'KOLEKSI BOYS', rotate: -9 },
          { src: '/images/kainora-categories/girls.webp', alt: 'Gaya Kainora Girls, model membelakangi kamera', tag: 'KOLEKSI GIRLS', rotate: 8 },
        ].map((photo, i) => <motion.figure key={photo.src} className={`f-social-shot f-social-shot-${i}`} initial={reduce ? false : { opacity: 0, y: 65, rotate: 0 }} whileInView={{ opacity: 1, y: 0, rotate: reduce ? 0 : photo.rotate }} viewport={{ once: true, amount: .25 }} transition={{ duration: .8, delay: i * .15, ease: [.22, 1, .36, 1] }} whileHover={reduce ? {} : { y: -12, rotate: 0 }}><img src={photo.src} alt={photo.alt} loading="lazy" width="1280" height="1280" /><figcaption>{photo.tag}<ArrowUpRight size={16} aria-hidden="true" /></figcaption></motion.figure>)}
        <span className="f-social-stamp" aria-hidden="true">KAINORA<br />KIDS <Plus size={22} /></span>
      </div>
      <div className="f-social-copy"><h2 id="social-title">GAYA<br />ANAK <span>KAINORA.</span></h2><p>Lihat koleksi terbaru, detail motif, dan ide padu padan<br />di Instagram dan TikTok Kainora Kids.</p><div className="f-social-links">{SOCIALS.map(({ name, handle, href, Icon }) => <a href={href} key={name} target="_blank" rel="noopener noreferrer"><Icon size={23} aria-hidden="true" /><span><strong>{name}</strong><small>{handle}</small></span><ArrowUpRight size={23} aria-hidden="true" /></a>)}</div></div>
    </div>
  </section>;
}

export function AffiliateInvitation({ onOpen }) {
  const reduce = useMotionPreference();
  return <section id="affiliate" className="f-affiliate-invite" aria-labelledby="affiliate-title">
    <div className="f-affiliate-meta f-cap"><span>PROGRAM AFFILIATE</span><span>KAINORA KIDS</span></div>
    <div className="f-affiliate-layout"><div className="f-affiliate-copy"><span className="f-affiliate-label">UNTUK KREATOR KONTEN</span><h2 id="affiliate-title">AFFILIATE<br /><span>KAINORA KIDS.</span></h2><p>Bagikan rekomendasi fashion anak dari Kainora Kids. Pelajari alur kerja sama, simulasi komisi, dan ketentuan program affiliate.</p><motion.button type="button" onClick={onOpen} whileHover={reduce ? {} : { y: -3 }} whileTap={reduce ? {} : { scale: .98 }}>LIHAT PROGRAM AFFILIATE <ArrowUpRight size={22} aria-hidden="true" /></motion.button></div><motion.div className="f-affiliate-poster" initial={reduce ? false : { y: 60, opacity: 0, rotate: 0 }} whileInView={{ y: 0, opacity: 1, rotate: reduce ? 0 : 5 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .9, ease: [.22, 1, .36, 1] }}><div className="f-affiliate-poster-head"><span>KAINORA KIDS</span><Plus size={20} aria-hidden="true" /></div><img src="/PRODUCT/beyou-1.jpg" alt="Kaos grafis Be You dari koleksi Kainora Kids" loading="lazy" width="1254" height="1254" /><span className="f-affiliate-poster-foot">GRAPHIC TEE OVERSIZE ANAK <ArrowUpRight size={20} aria-hidden="true" /></span></motion.div></div>
    <div className="f-affiliate-signoff"><span>PELAJARI PRODUK</span><span>BUAT KONTEN</span><span>BAGIKAN REKOMENDASI</span></div>
  </section>;
}
