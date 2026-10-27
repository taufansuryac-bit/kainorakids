import { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useCompact } from './hooks';
import { useMotionPreference } from './useMotionPreference';
import { OrderJourneyVideo } from './OrderJourneyVideo';
import './scroll-stories.css';

const PHRASES = [['BORN TO', 'PLAY.'], ['MADE TO', 'EXPLORE.'], ['BUILT TO', 'EXPRESS.']];
const PHASES = [[0, 0, .29, .39], [.29, .39, .63, .73], [.63, .73, 1, 1]];
const SCROLL_SPRING = { stiffness: 170, damping: 36, mass: .3, restDelta: .0001 };

// Holds page scrolling while a short reveal plays by cancelling scroll input (touch,
// wheel, scroll keys). It never toggles overflow: hiding the root scrollbar shifted the
// layout sideways at the start and end of the hold. Returns the release function.
function holdScroll() {
  const stop = event => event.preventDefault();
  const keys = event => { if ([' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) event.preventDefault(); };
  window.addEventListener('wheel', stop, { passive: false });
  window.addEventListener('touchmove', stop, { passive: false });
  window.addEventListener('keydown', keys);
  return () => { window.removeEventListener('wheel', stop); window.removeEventListener('touchmove', stop); window.removeEventListener('keydown', keys); };
}
// Instant page scroll, bypassing the site-wide `scroll-behavior: smooth`.
const jumpTo = top => window.scrollTo({ top, behavior: 'instant' });

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

export function KineticManifesto() {
  const ref = useRef(null), stepRef = useRef(0);
  const [index, setIndex] = useState(0);
  const compact = useCompact(), reduce = useMotionPreference();
  const top = compact ? 66 : 78;
  const { scrollYProgress } = useScroll({ target: ref, offset: [`start ${top}px`, 'end end'] });
  const progress = useSpring(scrollYProgress, SCROLL_SPRING);
  useMotionValueEvent(progress, 'change', value => {
    const next = value < .34 ? 0 : value < .68 ? 1 : 2;
    if (next !== stepRef.current) { stepRef.current = next; setIndex(next); }
  });
  const jump = selected => {
    const section = ref.current;
    const start = section.getBoundingClientRect().top + window.scrollY - top;
    const distance = section.offsetHeight - (innerHeight - top);
    window.scrollTo({ top: start + distance * [.06, .49, .9][selected], behavior: reduce ? 'instant' : 'smooth' });
  };
  return <section id="manifesto" ref={ref} className={`f-scroll-manifesto ${reduce ? 'is-static' : ''}`} data-step={index + 1} aria-labelledby="manifesto-title">
    <div className="f-scroll-manifesto-stage">
      <div className="f-scroll-manifesto-top"><span>02 / A LITTLE MANIFESTO</span><span>FREEDOM LOOKS GOOD ON THEM.</span></div>
      {!reduce && <h2 id="manifesto-title" className="sr-only">Born to play. Made to explore. Built to express.</h2>}
      {reduce && <h2 id="manifesto-title" className="sr-only">The Kainora manifesto</h2>}
      <div className="f-scroll-type">{PHRASES.map((words, position) => <Phrase key={words[0]} words={words} index={position} progress={progress} reduce={reduce} />)}</div>
      <div className="f-scroll-manifesto-bottom"><p>Ruang untuk bergerak.<br />Kebebasan untuk jadi diri sendiri.</p>{!reduce && <nav className="f-manifesto-steps" aria-label="Pernyataan manifesto">{PHRASES.map((words, position) => <button type="button" key={words[0]} onClick={() => jump(position)} aria-current={index === position ? 'step' : undefined} aria-label={`Tampilkan ${words.join(' ')}`}><span>0{position + 1}</span><i aria-hidden="true" /></button>)}</nav>}</div>
      {!reduce && <motion.div className="f-manifesto-progress" style={{ scaleX: progress }} aria-hidden="true" />}
    </div>
  </section>;
}

export function MovementReveal({ onShop }) {
  const ref = useRef(null);
  const visibleRef = useRef(false);
  const [finalVisible, setFinalVisible] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const compact = useCompact(), reduce = useMotionPreference();
  const still = reduce;
  // Phones: the slim stage (film + caption, see scroll-stories.css) is not pinned, so the
  // neighbouring sections stay in view. The title reads while the section enters; once it
  // is centred, scrolling pauses while the reveal plays on a timer (playback), then resumes.
  // Desktop keeps the pinned stage scrubbed by scroll.
  const { scrollY, scrollYProgress } = useScroll({ target: ref, offset: compact ? ['start 64%', 'start 23%'] : ['start 78px', 'end end'] });
  const scrubbed = useSpring(scrollYProgress, SCROLL_SPRING);
  const playback = useMotionValue(0);
  const progress = compact ? playback : scrubbed;
  const play = useRef({ state: 'idle', release: null, controls: null, settle: null, fallback: null });
  const finishPlay = () => { const p = play.current; clearTimeout(p.fallback); p.settle?.stop(); p.release?.(); p.release = null; p.state = 'done'; };
  useMotionValueEvent(scrollYProgress, 'change', value => {
    if (!compact || reduce) return;
    const p = play.current;
    if (value <= .02 && p.state === 'done') { p.state = 'idle'; playback.jump(0); return; }
    if (p.state !== 'idle') return;
    if ((scrollYProgress.getPrevious() ?? 0) > value) { if (value >= .96) { playback.jump(1); p.state = 'done'; } return; }
    const box = ref.current.getBoundingClientRect(), header = 66;
    const ahead = box.top - (header + (window.innerHeight - header - box.height) / 2);
    const speed = Math.max(0, scrollY.getVelocity());
    // Faster scrolling starts the glide further out, so it can slow down gradually.
    if (ahead > Math.min(360, Math.max(60, speed * .14))) return;
    p.state = 'playing';
    p.release = holdScroll();
    // Glide forward into the centre at the current scroll speed, easing out. Never
    // scroll back: correcting an overshoot upward read as a bounce. A fling that is
    // already past the centre simply stops where it is.
    const from = window.scrollY, to = from + Math.max(0, ahead);
    const duration = Math.min(.7, Math.max(.25, speed > 0 ? 2 * (to - from) / speed : .45));
    jumpTo(from);
    p.settle = animate(from, to, { duration, ease: [.5, 1, .89, 1], onUpdate: jumpTo });
    p.fallback = setTimeout(finishPlay, 3200);
    p.controls = animate(playback, 1, { duration: 2.2, ease: [.4, 0, .2, 1], onComplete: finishPlay });
  });
  useEffect(() => () => { const p = play.current; p.controls?.stop(); p.settle?.stop(); clearTimeout(p.fallback); p.release?.(); Object.assign(p, { state: 'idle', release: null, controls: null, settle: null }); }, []);
  const t = compact ? { open: [0, .08, .35, .72, 1], scale: [.08, .72], fade: [.12, .38], lift: [.08, .42], final: [.68, .88], video: .08 }
    : { open: [0, .1, .3, .68, 1], scale: [.1, .68], fade: [.18, .40], lift: [.12, .42], final: [.65, .8], video: .17 };
  const clipPath = useTransform(progress, t.open, ['inset(50% 49.8% 50% 49.8%)', 'inset(50% 49.8% 50% 49.8%)', 'inset(20% 29% 20% 29%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)']);
  const mediaOpacity = useTransform(progress, [0, t.video * .47, t.video], [0, 0, 1]);
  const imageScale = useTransform(progress, t.scale, [1.18, 1]);
  const introOpacity = useTransform(progress, t.fade, [1, 0]);
  const introY = useTransform(progress, t.lift, [0, -75]);
  const finalOpacity = useTransform(progress, t.final, [0, 1]);
  const finalY = useTransform(progress, t.final, [50, 0]);
  useMotionValueEvent(progress, 'change', value => {
    setVideoVisible(previous => previous === (value >= t.video) ? previous : value >= t.video);
    const visible = value >= t.final[0];
    if (visible !== visibleRef.current) { visibleRef.current = visible; setFinalVisible(visible); }
  });
  const showFinal = still || finalVisible;
  return <section id="lookbook" ref={ref} className={`f-movement-story f-movement-with-film ${still ? 'is-static' : ''}`} aria-labelledby="movement-title">
    <div className="f-movement-stage">
      <motion.div className="f-movement-intro" style={{ opacity: still ? 1 : introOpacity, y: still ? 0 : introY }}><p className="f-cap">06 / IN THEIR ELEMENT</p><h2 id="movement-title">NOT MADE<br />TO SIT STILL.</h2><div className="f-movement-intro-bottom"><p>Dari satu pilihan kecil.<br />Hingga senyum saat paket tiba.</p>{!still && <span>SCROLL TO FEEL THE MOVEMENT <ArrowDown size={18} aria-hidden="true" /></span>}</div></motion.div>
      <motion.div className="f-movement-photo f-movement-film" style={{ clipPath: still ? 'inset(0%)' : clipPath, opacity: still ? 1 : mediaOpacity }}><motion.div className="f-movement-film-inner" style={{ scale: still ? 1 : imageScale }}><OrderJourneyVideo enabled={still || videoVisible}/></motion.div></motion.div>
      <motion.div className="f-movement-final" aria-hidden={!showFinal} style={{ opacity: still ? 1 : finalOpacity, y: still ? 0 : finalY, visibility: showFinal ? 'visible' : 'hidden' }}><p className="f-cap">THE KAINORA JOURNEY / FILM</p><p className="f-movement-final-title">Dari pilihanmu.<br />Ke hari mereka.</p><div className="f-journey-chapters"><span>01 / PILIH</span><span>02 / PESAN</span><span>03 / KIRIM</span><span>04 / SAMPAI</span></div><button type="button" tabIndex={showFinal ? 0 : -1} onClick={onShop}>TEMUKAN GAYANYA <ArrowUpRight size={20} aria-hidden="true" /></button></motion.div>
    </div>
  </section>;
}
