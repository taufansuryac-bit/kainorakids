import { CheckerStrip } from '../neo/Checker';

const MESSAGES = [
  'Finest Kids Local Brand In Indonesia',
  '100% Katun Combed Anti Alergi',
  'Gratis Ongkir Se-Jawa',
  'Kualitas Premium, Nyaman & Tahan Lama',
];

const Row = () => (
  <div className="flex shrink-0 items-center" aria-hidden="true">
    {MESSAGES.map((m) => (
      <span key={m} className="flex items-center">
        <span className="px-5">{m}</span>
        <span className="text-brand-pink">✦</span>
      </span>
    ))}
  </div>
);

export const TopBar = () => (
  <div className="relative z-[1001] bg-ink text-brand-yellow">
    <div className="overflow-hidden py-1.5 font-arcade text-[0.62rem] uppercase tracking-[0.12em] sm:text-[0.7rem]">
      <div className="animate-marquee [animation-duration:38s]" role="marquee" aria-label={MESSAGES.join('. ')}>
        <Row /><Row /><Row />
      </div>
    </div>
    <CheckerStrip size={6} />
  </div>
);
