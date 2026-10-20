/**
 * Sticker bergaya komik retro (SVG, tanpa aset eksternal): starburst, bunga senyum,
 * awan bermata, balon ucapan, dan lencana teks berputar.
 */
import { useId } from 'react';

const STROKE = 'var(--ink)';
// Hanya beri `relative` bila pemanggil tidak menentukan posisi sendiri (absolute/fixed/sticky)
const pos = (c = '') => (/(^|\s)(absolute|fixed|sticky|relative)(\s|$)/.test(c) ? '' : 'relative');

const starPoints = (n, outer, inner, cx = 50, cy = 50) =>
  Array.from({ length: n * 2 }, (_, i) => {
    const r = i % 2 ? inner : outer;
    const a = (Math.PI * i) / n - Math.PI / 2;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(' ');

export const Burst = ({ children, fill = 'var(--pink)', points = 14, className = '', textClass = '' }) => (
  <div className={`${pos(className)} inline-grid place-items-center ${className}`}>
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      <polygon points={starPoints(points, 49, 38)} fill={STROKE} transform="translate(3 3)" />
      <polygon points={starPoints(points, 49, 38)} fill={fill} stroke={STROKE} strokeWidth="3" strokeLinejoin="round" />
    </svg>
    <span className={`relative z-10 px-3 text-center font-arcade leading-[0.95] text-ink ${textClass}`}>{children}</span>
  </div>
);

export const Smiley = ({ size = 40, fill = 'var(--yellow)', className = '' }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
    <circle cx="50" cy="50" r="44" fill={fill} stroke={STROKE} strokeWidth="5" />
    <ellipse cx="36" cy="42" rx="5" ry="8" fill={STROKE} />
    <ellipse cx="64" cy="42" rx="5" ry="8" fill={STROKE} />
    <path d="M28 60 Q50 84 72 60" fill="none" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
  </svg>
);

export const Flower = ({ size = 90, petals = 'var(--pink)', className = '' }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
    {Array.from({ length: 8 }, (_, i) => {
      const a = (Math.PI * 2 * i) / 8;
      return <circle key={i} cx={50 + 30 * Math.cos(a)} cy={50 + 30 * Math.sin(a)} r="17" fill={petals} stroke={STROKE} strokeWidth="3.5" />;
    })}
    <circle cx="50" cy="50" r="26" fill="var(--yellow)" stroke={STROKE} strokeWidth="3.5" />
    <ellipse cx="42" cy="46" rx="3" ry="5" fill={STROKE} />
    <ellipse cx="58" cy="46" rx="3" ry="5" fill={STROKE} />
    <path d="M38 56 Q50 68 62 56" fill="none" stroke={STROKE} strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

export const Cloud = ({ width = 140, fill = 'var(--paper)', className = '' }) => (
  <svg viewBox="0 0 120 80" width={width} className={className} aria-hidden="true">
    <path d="M28 66 A16 16 0 0 1 22 36 A20 20 0 0 1 58 22 A22 22 0 0 1 98 34 A17 17 0 0 1 94 66 Z" fill={STROKE} transform="translate(4 5)" />
    <path d="M28 66 A16 16 0 0 1 22 36 A20 20 0 0 1 58 22 A22 22 0 0 1 98 34 A17 17 0 0 1 94 66 Z" fill={fill} stroke={STROKE} strokeWidth="3.5" strokeLinejoin="round" />
    <g className="eye-blink">
      <circle cx="47" cy="45" r="7.5" fill="#fff" stroke={STROKE} strokeWidth="2.5" />
      <circle cx="49" cy="46" r="3.4" fill={STROKE} />
    </g>
    <g className="eye-blink">
      <circle cx="71" cy="45" r="7.5" fill="#fff" stroke={STROKE} strokeWidth="2.5" />
      <circle cx="73" cy="46" r="3.4" fill={STROKE} />
    </g>
  </svg>
);

export const Bubble = ({ children, fill = 'var(--paper)', className = '', textClass = '' }) => (
  <div className={`${pos(className)} inline-grid place-items-center ${className}`}>
    <svg viewBox="0 0 140 100" className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" aria-hidden="true">
      <path d="M70 6 C112 6 134 24 134 44 C134 64 112 80 76 82 L52 98 L56 80 C24 76 6 62 6 44 C6 24 28 6 70 6 Z" fill={STROKE} transform="translate(4 4)" />
      <path d="M70 6 C112 6 134 24 134 44 C134 64 112 80 76 82 L52 98 L56 80 C24 76 6 62 6 44 C6 24 28 6 70 6 Z" fill={fill} stroke={STROKE} strokeWidth="3.5" strokeLinejoin="round" />
    </svg>
    <span className={`relative z-10 -mt-2 px-4 text-center font-arcade italic leading-none text-ink ${textClass}`}>{children}</span>
  </div>
);

/** Lencana bulat dengan teks mengitari tepi dan bunga senyum di tengah. */
export const RotatingBadge = ({ text, size = 140, fill = 'var(--teal)', className = '' }) => {
  const id = useId().replace(/:/g, '');
  return (
    <div className={`${pos(className)} ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-spin-slow" aria-hidden="true">
        <defs>
          <path id={`c-${id}`} d="M100 100 m-68 0 a68 68 0 1 1 136 0 a68 68 0 1 1 -136 0" />
        </defs>
        <circle cx="103" cy="103" r="96" fill={STROKE} />
        <circle cx="100" cy="100" r="96" fill={fill} stroke={STROKE} strokeWidth="5" />
        <text fontFamily="Bungee, Archivo, sans-serif" fontSize="23" letterSpacing="2" fill={STROKE}>
          <textPath href={`#c-${id}`} startOffset="0">{`${text} • ${text} • `}</textPath>
        </text>
      </svg>
      <Flower size={size * 0.46} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
};
