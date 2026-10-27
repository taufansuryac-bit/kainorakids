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
    <div className="f-social-meta f-cap"><span>07 / KEEP IN THE LOOP</span><span>INSTAGRAM + TIKTOK</span></div>
    <div className="f-social-layout">
      <div className="f-social-art" aria-label="Gaya dan koleksi Kainora">
        {[
          { src: '/images/kainora-categories/boys.webp', alt: 'Gaya Kainora Boys, model membelakangi kamera', tag: 'SMALL FITS.', rotate: -9 },
          { src: '/images/kainora-categories/girls.webp', alt: 'Gaya Kainora Girls, model membelakangi kamera', tag: 'BIG ENERGY.', rotate: 8 },
        ].map((photo, i) => <motion.figure key={photo.src} className={`f-social-shot f-social-shot-${i}`} initial={reduce ? false : { opacity: 0, y: 65, rotate: 0 }} whileInView={{ opacity: 1, y: 0, rotate: reduce ? 0 : photo.rotate }} viewport={{ once: true, amount: .25 }} transition={{ duration: .8, delay: i * .15, ease: [.22, 1, .36, 1] }} whileHover={reduce ? {} : { y: -12, rotate: 0 }}><img src={photo.src} alt={photo.alt} loading="lazy" width="1280" height="1280" /><figcaption>{photo.tag}<ArrowUpRight size={16} aria-hidden="true" /></figcaption></motion.figure>)}
        <span className="f-social-stamp" aria-hidden="true">SEE YOU<br />ON YOUR<br />FEED. <Plus size={22} /></span>
      </div>
      <div className="f-social-copy"><h2 id="social-title">LET’S<br />STAY <span>CLOSE.</span></h2><p>Ide gaya, detail koleksi, dan cerita kecil Kainora.<br />Temui kami di tempat kamu suka mencari inspirasi.</p><div className="f-social-links">{SOCIALS.map(({ name, handle, href, Icon }) => <a href={href} key={name} target="_blank" rel="noopener noreferrer"><Icon size={23} aria-hidden="true" /><span><strong>{name}</strong><small>{handle}</small></span><ArrowUpRight size={23} aria-hidden="true" /></a>)}</div></div>
    </div>
  </section>;
}

export function AffiliateInvitation({ onOpen }) {
  const reduce = useMotionPreference();
  return <section id="affiliate" className="f-affiliate-invite" aria-labelledby="affiliate-title">
    <div className="f-affiliate-meta f-cap"><span>08 / KAINORA CREATOR CLUB</span><span>YOUR IDEAS. OUR NEXT STORY.</span></div>
    <div className="f-affiliate-layout"><div className="f-affiliate-copy"><span className="f-affiliate-label">FOR THE STORYTELLERS</span><h2 id="affiliate-title">CERITA KECIL.<br /><span>PELUANG BESAR.</span></h2><p>Suka membuat konten dan berbagi rekomendasi? Kenali program affiliate Kainora, alur pendaftaran, dan informasi kerja samanya.</p><motion.button type="button" onClick={onOpen} whileHover={reduce ? {} : { y: -3 }} whileTap={reduce ? {} : { scale: .98 }}>JELAJAHI PROGRAM AFFILIATE <ArrowUpRight size={22} aria-hidden="true" /></motion.button></div><motion.div className="f-affiliate-poster" initial={reduce ? false : { y: 60, opacity: 0, rotate: 0 }} whileInView={{ y: 0, opacity: 1, rotate: reduce ? 0 : 5 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .9, ease: [.22, 1, .36, 1] }}><div className="f-affiliate-poster-head"><span>KAINORA KIDS</span><Plus size={20} aria-hidden="true" /></div><img src="/PRODUCT/beyou-1.jpg" alt="Kaos grafis Be You dari koleksi Kainora Kids" loading="lazy" width="1254" height="1254" /><span className="f-affiliate-poster-foot">MAKE IT YOUR OWN. <ArrowUpRight size={20} aria-hidden="true" /></span></motion.div></div>
    <div className="f-affiliate-signoff"><span>01 / KENALI KOLEKSINYA</span><span>02 / TEMUKAN IDE KONTENMU</span><span>03 / BAGIKAN CERITAMU</span></div>
  </section>;
}
