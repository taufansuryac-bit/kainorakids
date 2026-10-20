/**
 * PRELOADER "TYPE REMIX"
 * Satu kata (KAINORA) disusun ulang lewat tujuh perlakuan huruf — stiker die-cut, felt berjahit,
 * balon mengilap, script, ransom-note, piksel-glitch, lalu cetak final — dan tiap perlakuan
 * menyapu menutupi yang sebelumnya selagi penghitung naik ke 100. Setelah itu tirai papan catur
 * membuka situs. Tampil sekali per sesi; dilewati saat pengguna memilih reduced-motion.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CheckerWipe } from '../motion/CheckerWipe';
import { CheckerStrip } from './Checker';

const KEY = 'kk_preloader_seen';
const TOTAL_MS = 3600;
const MAX_WAIT = 5500;

const INK = '#14110F';
const PAPER = '#FFF9EA';
const C = { red: '#E0322B', yellow: '#FFE11A', pink: '#F59DC2', teal: '#62C6B3', blue: '#6B8FDA', sky: '#3B8FD9', orange: '#F28A2E', green: '#1FA86B' };
const WORD = 'KAINORA';
const LETTERS = Array.from(WORD);
const SLOT = 1000 / LETTERS.length; // 142.8
const cx = (i) => SLOT * (i + 0.5);

/* ---------- 1. STICKERS: huruf die-cut dengan border putih + bayangan ---------- */
const Stickers = () => {
  const rot = [-7, 5, -4, 7, -6, 4, -5];
  const fills = [C.red, C.blue, C.orange, C.green, C.pink, C.sky, C.red];
  return (
    <svg viewBox="0 0 1000 300" className="w-full" aria-hidden="true">
      <g fontFamily="Bungee" fontSize="150" textAnchor="middle" strokeLinejoin="round">
        {LETTERS.map((ch, i) => (
          <g key={i} transform={`rotate(${rot[i]} ${cx(i)} 150)`}>
            <text x={cx(i) + 7} y={218} fill={INK} stroke={INK} strokeWidth="26">{ch}</text>
            <text x={cx(i)} y={210} fill="#fff" stroke="#fff" strokeWidth="26">{ch}</text>
            <text x={cx(i)} y={210} fill={fills[i]} stroke={INK} strokeWidth="5">{ch}</text>
            <text x={cx(i) - 14} y={168} fill="#fff" opacity="0.35" fontSize="30">★</text>
          </g>
        ))}
      </g>
    </svg>
  );
};

/* ---------- 2. FELT: potongan kain berbulu dengan jahitan putus-putus ---------- */
const Felt = () => {
  const fills = [C.red, C.blue, C.yellow, C.green, C.pink, C.orange, C.teal];
  return (
    <svg viewBox="0 0 1000 300" className="w-full" aria-hidden="true">
      <defs>
        <filter id="felt" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feBlend in="d" in2="n" mode="multiply" result="b" />
          <feComposite in="b" in2="d" operator="in" />
        </filter>
      </defs>
      <g fontFamily="Archivo" fontWeight="900" fontSize="170" textAnchor="middle" style={{ fontStretch: '125%' }}>
        {LETTERS.map((ch, i) => (
          <g key={i} transform={`rotate(${[-2, 3, -3, 2, -2, 3, -2][i]} ${cx(i)} 150)`}>
            <text x={cx(i) + 5} y={232} fill={INK} opacity="0.25" stroke={INK} strokeWidth="14" strokeLinejoin="round">{ch}</text>
            <text x={cx(i)} y={226} fill={fills[i]} stroke={fills[i]} strokeWidth="12" strokeLinejoin="round" filter="url(#felt)">{ch}</text>
            <text x={cx(i)} y={226} fill="none" stroke={PAPER} strokeWidth="3.5" strokeDasharray="7 9" strokeLinecap="round">{ch}</text>
          </g>
        ))}
      </g>
    </svg>
  );
};

/* ---------- 3. BUBBLE: huruf balon gembung dengan kilau spekular ---------- */
const Bubble = () => {
  const fills = [C.pink, C.yellow, C.teal, C.orange, C.pink, C.yellow, C.teal];
  return (
    <svg viewBox="0 0 1000 300" className="w-full" aria-hidden="true">
      <defs>
        <filter id="bubble" x="-12%" y="-12%" width="124%" height="130%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur" />
          <feSpecularLighting in="blur" surfaceScale="10" specularConstant="1.2" specularExponent="26" lightingColor="#ffffff" result="spec">
            <fePointLight x="-80" y="-140" z="240" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="shine" />
          <feComposite in="SourceGraphic" in2="shine" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
        </filter>
      </defs>
      <g fontFamily="Archivo" fontWeight="900" fontSize="150" textAnchor="middle" style={{ fontStretch: '125%' }}>
        {LETTERS.map((ch, i) => (
          <g key={i}>
            <text x={cx(i) + 4} y={236} fill={INK} opacity="0.22" stroke={INK} strokeWidth="26" strokeLinejoin="round">{ch}</text>
            <text x={cx(i)} y={222} fill={fills[i]} stroke={fills[i]} strokeWidth="26" strokeLinejoin="round" filter="url(#bubble)">{ch}</text>
          </g>
        ))}
      </g>
    </svg>
  );
};

/* ---------- 4. SCRIPT: tulisan tangan mengalir + garis swash ---------- */
const Script = () => (
  <svg viewBox="0 0 1000 300" className="w-full" aria-hidden="true">
    <g transform="rotate(-5 500 150)" fontFamily="Pacifico" fontSize="215" textAnchor="middle">
      <text x="512" y="212" textLength="860" lengthAdjust="spacingAndGlyphs" fill={INK} stroke={INK} strokeWidth="22" strokeLinejoin="round">Kainora</text>
      <text x="500" y="200" textLength="860" lengthAdjust="spacingAndGlyphs" fill="#fff" stroke={INK} strokeWidth="9" strokeLinejoin="round" paintOrder="stroke">Kainora</text>
      <path d="M130 258 C 330 296, 650 214, 880 262" fill="none" stroke={INK} strokeWidth="13" strokeLinecap="round" />
      <path d="M130 258 C 330 296, 650 214, 880 262" fill="none" stroke={C.yellow} strokeWidth="6" strokeLinecap="round" />
    </g>
  </svg>
);

/* ---------- 5. RANSOM NOTE: potongan huruf dari berbagai sumber ---------- */
const Ransom = () => {
  const fonts = [
    { f: 'Archivo', w: 900, st: '125%' }, { f: 'Bungee', w: 400 }, { f: 'Georgia, serif', w: 700, it: true },
    { f: '"Pixelify Sans"', w: 700 }, { f: 'Pacifico', w: 400 }, { f: '"Courier New", monospace', w: 700 }, { f: 'Archivo', w: 200, st: '62%' },
  ];
  const papers = [PAPER, C.yellow, C.pink, INK, C.teal, C.red, C.blue];
  const inks = [INK, INK, INK, PAPER, INK, PAPER, INK];
  const rot = [-5, 4, -3, 6, -6, 3, -4];
  const dy = [4, -8, 6, -4, 8, -6, 2];
  return (
    <svg viewBox="0 0 1000 300" className="w-full" aria-hidden="true">
      {LETTERS.map((ch, i) => (
        <g key={i} transform={`translate(${cx(i)} ${150 + dy[i]}) rotate(${rot[i]})`}>
          <rect x="-58" y="-92" width="122" height="184" fill={INK} opacity="0.3" transform="translate(7 8)" />
          <rect x="-60" y="-94" width="120" height="188" fill={papers[i]} stroke={INK} strokeWidth="4" />
          <text y="44" textAnchor="middle" fontSize="136" fill={inks[i]} fontFamily={fonts[i].f} fontWeight={fonts[i].w} fontStyle={fonts[i].it ? 'italic' : 'normal'} style={fonts[i].st ? { fontStretch: fonts[i].st } : undefined}>{ch}</text>
        </g>
      ))}
    </svg>
  );
};

/* ---------- 6. PIXEL: arcade piksel dengan glitch RGB + scanline ---------- */
const Pixel = () => (
  <svg viewBox="0 0 1000 300" className="w-full" aria-hidden="true">
    <defs>
      <pattern id="scan" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="2" fill="#000" opacity="0.28" /></pattern>
    </defs>
    <g fontFamily="Pixelify Sans" fontWeight="700" fontSize="230" textAnchor="middle">
      <text x="494" y="222" textLength="880" lengthAdjust="spacingAndGlyphs" fill="#00E5FF">KAINORA</text>
      <text x="508" y="222" textLength="880" lengthAdjust="spacingAndGlyphs" fill="#FF2E93">KAINORA</text>
      <text x="500" y="222" textLength="880" lengthAdjust="spacingAndGlyphs" fill={PAPER}>KAINORA</text>
    </g>
    <rect width="1000" height="300" fill="url(#scan)" />
  </svg>
);

/* ---------- 7. FINAL: cetak tebal brand + strip papan catur ---------- */
const Final = () => (
  <svg viewBox="0 0 1000 300" className="w-full" aria-hidden="true">
    <defs>
      <pattern id="chk" width="40" height="40" patternUnits="userSpaceOnUse">
        <rect width="20" height="20" fill={C.red} /><rect x="20" y="20" width="20" height="20" fill={C.red} />
      </pattern>
    </defs>
    <text x="500" y="214" textAnchor="middle" textLength="920" lengthAdjust="spacingAndGlyphs" fontFamily="Archivo" fontWeight="900" fontSize="210" fill={INK} style={{ fontStretch: '125%' }}>KAINORA</text>
    <rect x="40" y="244" width="920" height="40" fill="url(#chk)" />
  </svg>
);

const TAKES = [
  { id: 'stickers', label: 'Stickers', bg: C.yellow, Render: Stickers },
  { id: 'felt', label: 'Felt', bg: C.sky, Render: Felt },
  { id: 'bubble', label: 'Bubble', bg: C.teal, Render: Bubble },
  { id: 'script', label: 'Script', bg: C.red, Render: Script },
  { id: 'ransom', label: 'Ransom Note', bg: '#EADFC4', Render: Ransom },
  { id: 'pixel', label: 'Pixel', bg: INK, Render: Pixel },
  { id: 'final', label: 'Final Cut', bg: C.yellow, Render: Final },
];
const WIPES = ['inset(0 0 0 100%)', 'inset(100% 0 0 0)', 'inset(0 100% 0 0)', 'inset(0 0 100% 0)'];
const FONTS = ['900 120px Archivo', '120px Bungee', '700 120px "Pixelify Sans"', '120px Pacifico'];

export const shouldShowPreloader = () => {
  try {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return !sessionStorage.getItem(KEY);
  } catch {
    return false;
  }
};

export const Preloader = ({ onDone }) => {
  const reduce = useReducedMotion();
  const [p, setP] = useState(0);
  const [phase, setPhase] = useState('loading'); // loading → covering → revealing
  const fontsReady = useRef(false);
  const start = useRef(performance.now());

  useEffect(() => {
    if (reduce) { onDone(); return undefined; }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const load = (document.fonts?.load ? Promise.all(FONTS.map((f) => document.fonts.load(f, WORD).catch(() => null))) : Promise.resolve());
    load.then(() => { fontsReady.current = true; });

    let raf = 0;
    const loop = (now) => {
      const t = now - start.current;
      const ramp = Math.min(t / TOTAL_MS, 1);
      const gate = fontsReady.current || t > MAX_WAIT ? 1 : 0.9;
      const target = Math.min(ramp, gate);
      setP((cur) => (target > cur ? target : cur));
      if (target >= 1) { setPhase((ph) => (ph === 'loading' ? 'covering' : ph)); return; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); document.body.style.overflow = prevOverflow; };
  }, [reduce, onDone]);

  const finish = () => {
    try { sessionStorage.setItem(KEY, '1'); } catch { /* sessionStorage bisa diblokir */ }
    document.body.style.overflow = '';
    onDone();
  };

  const idx = Math.min(TAKES.length - 1, Math.floor(p * TAKES.length));
  const pct = Math.round(p * 100);
  const visible = useMemo(() => TAKES.map((t, i) => ({ ...t, i })).filter((t) => t.i <= idx && t.i >= idx - 1), [idx]);

  return (
    <>
      {phase !== 'revealing' && (
        <div className="fixed inset-0 z-[7500] overflow-hidden bg-ink" role="status" aria-live="polite" aria-label={`Memuat Kainora Kids ${pct}%`}>
          {visible.map(({ id, bg, Render, i }) => (
            <motion.div
              key={id}
              className="absolute inset-0 grid place-items-center px-3"
              style={{ background: bg, zIndex: i }}
              initial={i === 0 ? false : { clipPath: WIPES[i % WIPES.length] }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
              transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            >
              <div className="w-[min(94vw,1120px)] -translate-y-6">
                <Render />
              </div>
            </motion.div>
          ))}

          <div className="absolute inset-x-0 top-0 z-50"><CheckerStrip size={12} /></div>

          <div className="absolute inset-x-0 bottom-0 z-50 flex flex-col items-center gap-3 px-3 pb-6 sm:pb-8">
            <div className="flex w-[min(94vw,640px)] items-center gap-3 rounded-full border-[3px] border-ink bg-paper px-3 py-2 shadow-solid-sm sm:gap-4 sm:px-4">
              <span className="neo-pill !bg-brand-yellow !py-1.5 !text-[0.6rem] sm:!text-[0.68rem]">
                Take {String(idx + 1).padStart(2, '0')}/{String(TAKES.length).padStart(2, '0')} · {TAKES[idx].label}
              </span>
              <div className="relative h-5 flex-1 overflow-hidden rounded-full border-[3px] border-ink bg-paper">
                <div
                  className="absolute inset-y-0 left-0"
                  style={{ width: `${pct}%`, background: 'repeating-conic-gradient(var(--red) 0 25%, var(--paper) 0 50%) 0 0 / 16px 16px' }}
                />
              </div>
              <span className="font-arcade w-[3.4ch] text-right text-xl tabular-nums sm:text-3xl">{pct}</span>
            </div>
          </div>
        </div>
      )}
      <CheckerWipe
        covering={phase === 'covering'}
        zIndex={7600}
        onCovered={() => { setPhase('revealing'); setTimeout(finish, 650); }}
      />
    </>
  );
};
