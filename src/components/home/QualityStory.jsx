import { motion, useReducedMotion } from 'motion/react';
import { Check, Ruler, Scissors, Shirt } from 'lucide-react';
import { SplitReveal } from '../motion/KineticText';
import { CheckerStrip } from '../neo/Checker';

const DETAILS = [
  {
    n: '01', label: 'THE CUT', title: 'Potongannya pas.', Icon: Scissors, color: 'var(--pink)',
    body: 'Dipotong searah serat kain supaya bentuk baju tetap rapi. Ruang geraknya lega, siap mengikuti si kecil ke mana saja.',
    img: '/images/craft/potong-bahan.jpg', alt: 'Proses pemotongan kain di workshop Kainora Kids',
    tags: ['Searah serat', 'Boxy fit'],
  },
  {
    n: '02', label: 'THE STITCH', title: 'Main lebih lepas.', Icon: Ruler, color: 'var(--yellow)',
    body: 'Jahit rantai dan overdeck tiga jarum menjaga sambungan tetap kuat dan lentur. Untuk lompat, lari, lalu main lagi.',
    img: '/images/craft/detail-jahitan.jpg', alt: 'Detail konstruksi jahitan kaos Kainora Kids',
    tags: ['Jahit rantai', 'Overdeck 3 jarum'],
  },
  {
    n: '03', label: 'THE FABRIC', title: 'Nyaman seharian.', Icon: Shirt, color: 'var(--teal)',
    body: 'Heavyweight cotton pilihan dengan sentuhan lembut. Bahannya berisi, tetap nyaman untuk petualangan setiap hari.',
    img: '/images/craft/penjahit-workshop.jpg', alt: 'Pengerjaan pakaian katun di workshop Kainora Kids',
    tags: ['100% cotton', 'Heavyweight'],
  },
];

export const QualityStory = () => {
  const reduce = useReducedMotion();
  return (
    <section className="quality-workshop" aria-labelledby="quality-title">
      <div className="editorial-wrap">
        <div className="workshop-heading">
          <div>
            <p className="eyebrow"><span className="status-dot" /> DI BALIK BAJU FAVORITNYA</p>
            <h2 id="quality-title"><SplitReveal text="KECIL DETAILNYA." /><br /><span><SplitReveal text="BESAR BEDANYA." delay={0.12} /></span></h2>
          </div>
          <p className="workshop-intro">Baju yang seru dimulai dari detail yang serius. Kenalan dengan tiga hal yang kami jaga di setiap potong Kainora.</p>
        </div>
        <div className="workshop-grid">
          {DETAILS.map((detail, i) => <motion.article key={detail.n} className="workshop-card" style={{ '--detail-color': detail.color }} whileHover={reduce ? undefined : { y: -5, rotate: i === 1 ? 0 : i === 0 ? -0.6 : 0.6 }} transition={{ type: 'spring', stiffness: 350, damping: 25 }}>
            <div className="workshop-card-top"><span><b>{detail.n}</b> / {detail.label}</span><detail.Icon size={19} strokeWidth={2} aria-hidden="true" /></div>
            <div className="workshop-photo"><img src={detail.img} alt={detail.alt} loading="lazy" /></div>
            <div className="workshop-card-copy"><h3>{detail.title}</h3><p>{detail.body}</p><ul>{detail.tags.map((tag) => <li key={tag}><Check size={12} strokeWidth={3} aria-hidden="true" />{tag}</li>)}</ul></div>
          </motion.article>)}
        </div>
        <div className="workshop-signoff"><span>DIBUAT TELITI. DIPAKAI SESUKA HATI.</span><CheckerStrip size={4} /><span>KAINORA KIDS®</span></div>
      </div>
    </section>
  );
};
