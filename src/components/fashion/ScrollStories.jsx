import { useRef, useState } from 'react';
import { motion, useInView, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useCompact } from './hooks';
import { useMotionPreference } from './useMotionPreference';
import { OrderJourneyVideo } from './OrderJourneyVideo';
import './scroll-stories.css';
import './manifesto-film.css';

const PHRASES = [['KAOS', 'OVERSIZE.'], ['PILIHAN', 'MOTIF.'], ['FASHION', 'ANAK.']];
const PHASES = [[0, 0, .29, .39], [.29, .39, .63, .73], [.63, .73, 1, 1]];
const SCROLL_SPRING = { stiffness: 170, damping: 36, mass: .3, restDelta: .0001 };
const TEXT_END = .64;

function Phrase({ words, index, progress, reduce }) {
  const [enterStart, enterEnd, exitStart, exitEnd] = PHASES[index];
  const range = index === 0 ? [0, exitStart, exitEnd] : index === 2 ? [enterStart, enterEnd, 1] : [enterStart, enterEnd, exitStart, exitEnd];
  const positions = index === 0 ? ['0%', '0%', '-112%'] : index === 2 ? ['112%', '0%', '0%'] : ['112%', '0%', '0%', '-112%'];
  const y = useTransform(progress, range, positions);
  const opacity = useTransform(progress, range, index === 0 ? [1, 1, 0] : index === 2 ? [0, 1, 1] : [0, 1, 1, 0]);
  return <motion.div className="f-scroll-phrase" data-phrase={index + 1} aria-hidden={!reduce} style={{ opacity: reduce ? 1 : opacity }}>
    {words.map((word, line) => <span className={`f-scroll-word ${line === 1 ? 'is-outline' : ''}`} key={word}><motion.span style={{ y: reduce ? 0 : y }}>{word}</motion.span></span>)}
  </motion.div>;
}

export function KineticManifesto({ onShop }) {
  const ref = useRef(null), stepRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [scene, setScene] = useState('text');
  const compact = useCompact(), reduce = useMotionPreference();
  const near = useInView(ref, { margin: '350px', once: true });
  const top = compact ? 66 : 78;
  const { scrollYProgress } = useScroll({ target: ref, offset: [`start ${top}px`, 'end end'] });
  const progress = useSpring(scrollYProgress, SCROLL_SPRING);
  const textProgress = useTransform(progress, [0, TEXT_END], [0, 1]);
  const textOpacity = useTransform(progress, [.65, .75], [1, 0]);
  const textY = useTransform(progress, [.65, .78], [0, -75]);
  useMotionValueEvent(progress, 'change', value => {
    const textValue = value / TEXT_END;
    const next = textValue < .34 ? 0 : textValue < .68 ? 1 : 2;
    if (next !== stepRef.current) { stepRef.current = next; setIndex(next); }
    const nextScene = value < .65 ? 'text' : value < .9 ? 'reveal' : 'film';
    setScene(previous => previous === nextScene ? previous : nextScene);
  });
  const jump = selected => {
    const section = ref.current;
    const start = section.getBoundingClientRect().top + window.scrollY - top;
    const distance = section.offsetHeight - (innerHeight - top);
    window.scrollTo({ top: start + distance * TEXT_END * [.06, .49, .9][selected], behavior: reduce ? 'instant' : 'smooth' });
  };
  return <section id="manifesto" ref={ref} className={`f-scroll-manifesto f-manifesto-with-film ${reduce ? 'is-static' : ''}`} data-step={index + 1} data-scene={reduce ? 'static' : scene} aria-labelledby="manifesto-title">
    <div className="f-scroll-manifesto-stage">
      <h2 id="manifesto-title" className="sr-only">Kaos anak dengan potongan oversize dan pilihan motif grafis.</h2>
      <motion.div className="f-manifesto-copy" aria-hidden={!reduce && scene === 'film'} style={{ opacity: reduce ? 1 : textOpacity, y: reduce ? 0 : textY }}>
      <div className="f-scroll-manifesto-top"><span>GRAPHIC TEE ANAK</span><span>KAINORA KIDS</span></div>
      <div className="f-scroll-type">{PHRASES.map((words, position) => <Phrase key={words[0]} words={words} index={position} progress={textProgress} reduce={reduce} />)}</div>
      <div className="f-scroll-manifesto-bottom"><p>Potongan boxy dan motif grafis<br />untuk pakaian sehari-hari anak.</p>{!reduce && <nav className="f-manifesto-steps" aria-label="Detail koleksi">{PHRASES.map((words, position) => <button type="button" key={words[0]} tabIndex={scene === 'text' ? 0 : -1} onClick={() => jump(position)} aria-current={index === position ? 'step' : undefined} aria-label={`Tampilkan ${words.join(' ')}`}><span>{position + 1}</span><i aria-hidden="true" /></button>)}</nav>}</div>
      </motion.div>
      <ManifestoFilm progress={progress} reduce={reduce} prepare={near} onShop={onShop} />
      {!reduce && <motion.div className="f-manifesto-progress" style={{ scaleX: progress }} aria-hidden="true" />}
    </div>
  </section>;
}

function ManifestoFilm({ progress, reduce, prepare, onShop }) {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const clipPath = useTransform(progress, [.65, .7, .88, 1], ['inset(50% 49.8% 50% 49.8%)', 'inset(20% 29% 20% 29%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)']);
  const opacity = useTransform(progress, [.64, .69], [0, 1]);
  const scale = useTransform(progress, [.65, .9], [1.18, 1]);
  const captionOpacity = useTransform(progress, [.85, .94], [0, 1]);
  const captionY = useTransform(progress, [.85, .94], [45, 0]);
  useMotionValueEvent(progress, 'change', value => {
    setEnabled(previous => previous === (value >= .66) ? previous : value >= .66);
    setReady(previous => previous === (value >= .85) ? previous : value >= .85);
  });
  const showCaption = reduce || ready;
  return <motion.div id="lookbook" className="f-manifesto-film" aria-hidden={!reduce && !enabled} style={{ opacity: reduce ? 1 : opacity }}>
    <div className="f-manifesto-film-surface">
      <motion.div className="f-manifesto-film-media" style={{ clipPath: reduce ? 'inset(0%)' : clipPath }}><motion.div className="f-manifesto-film-inner" style={{ scale: reduce ? 1 : scale }}><OrderJourneyVideo enabled={reduce || enabled} prepare={prepare} /></motion.div></motion.div>
      <motion.div className="f-manifesto-film-caption" aria-hidden={!showCaption} style={{ opacity: reduce ? 1 : captionOpacity, y: reduce ? 0 : captionY, visibility: showCaption ? 'visible' : 'hidden' }}><p className="f-cap">PEMESANAN KAINORA KIDS</p><h2 className="f-manifesto-film-title">Pilih kaos.<br />Pesan dari rumah.</h2><div className="f-journey-chapters"><span>PILIH PRODUK</span><span>KONFIRMASI PESANAN</span><span>PENGIRIMAN</span><span>PAKET DITERIMA</span></div><button type="button" tabIndex={showCaption ? 0 : -1} onClick={onShop}>LIHAT KOLEKSI <ArrowUpRight size={20} aria-hidden="true" /></button></motion.div>
    </div>
  </motion.div>;
}
