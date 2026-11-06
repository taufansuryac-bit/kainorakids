import { motion, useReducedMotion } from 'motion/react';
import { Check, Ruler, Scissors, Shirt } from 'lucide-react';
import { SplitReveal } from '../motion/KineticText';
import { CheckerStrip } from '../neo/Checker';

const DETAILS = [
  {
    n: '01', label: 'POTONGAN', title: 'Potongan boxy', Icon: Scissors, color: 'var(--pink)',
    body: 'Periksa lebar, panjang, dan bentuk bahu kaos pada foto serta tabel ukuran produk.',
    img: '/images/craft/potong-bahan.jpg', alt: 'Proses pemotongan kain di workshop Kainora Kids',
    tags: ['Searah serat', 'Boxy fit'],
  },
  {
    n: '02', label: 'JAHITAN', title: 'Detail jahitan', Icon: Ruler, color: 'var(--yellow)',
    body: 'Periksa keterangan konstruksi dan detail jahitan pada produk yang Anda pilih.',
    img: '/images/craft/detail-jahitan.jpg', alt: 'Detail konstruksi jahitan kaos Kainora Kids',
    tags: ['Jahit rantai', 'Overdeck 3 jarum'],
  },
  {
    n: '03', label: 'BAHAN', title: 'Bahan katun', Icon: Shirt, color: 'var(--teal)',
    body: 'Keterangan komposisi bahan tersedia pada detail produk. Ikuti petunjuk perawatan pada label pakaian.',
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
            <p className="eyebrow"><span className="status-dot" /> DETAIL KAOS ANAK</p>
            <h2 id="quality-title"><SplitReveal text="BAHAN &" /><br /><span><SplitReveal text="POTONGAN." delay={0.12} /></span></h2>
          </div>
          <p className="workshop-intro">Kenali potongan, bahan, dan detail jahitan sebelum memilih kaos untuk anak Anda.</p>
        </div>
        <div className="workshop-grid">
          {DETAILS.map((detail, i) => <motion.article key={detail.n} className="workshop-card" style={{ '--detail-color': detail.color }} whileHover={reduce ? undefined : { y: -5, rotate: i === 1 ? 0 : i === 0 ? -0.6 : 0.6 }} transition={{ type: 'spring', stiffness: 350, damping: 25 }}>
            <div className="workshop-card-top"><span>{detail.label}</span><detail.Icon size={19} strokeWidth={2} aria-hidden="true" /></div>
            <div className="workshop-photo"><img src={detail.img} alt={detail.alt} loading="lazy" /></div>
            <div className="workshop-card-copy"><h3>{detail.title}</h3><p>{detail.body}</p><ul>{detail.tags.map((tag) => <li key={tag}><Check size={12} strokeWidth={3} aria-hidden="true" />{tag}</li>)}</ul></div>
          </motion.article>)}
        </div>
        <div className="workshop-signoff"><span>LIHAT DETAIL PRODUK SEBELUM MEMESAN</span><CheckerStrip size={4} /><span>KAINORA KIDS</span></div>
      </div>
    </section>
  );
};
