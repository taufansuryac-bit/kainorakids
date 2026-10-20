/**
 * Wordmark halftone interaktif (kanvas 2D). Kata raksasa dicetak sebagai titik-titik;
 * titik menyingkir dari kursor/jari lalu kembali dengan pegas, warnanya menghangat
 * (krem → kuning → oranye → pink → merah) sesuai energinya, dan klik/tap mengirim
 * cincin kejut menembus huruf. Loop animasi hanya berjalan saat ada gerak & terlihat.
 */
import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

const RAMP = ['#FFF9EA', '#FFE11A', '#F28A2E', '#F59DC2', '#E0322B'];

export const HalftoneWordmark = ({ text = 'KAINORA', className = '' }) => {
  const reduce = useReducedMotion();
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const cv = canvasRef.current;
    if (!wrap || !cv) return undefined;
    const ctx = cv.getContext('2d');

    let dots = [];
    let W = 0;
    let H = 0;
    let gap = 8;
    let raf = 0;
    let running = false;
    let visible = true;
    let dead = false;
    const ptr = { x: -9999, y: -9999, on: false };
    let rings = [];

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const buckets = RAMP.map(() => []);
      for (const d of dots) {
        const b = Math.min(RAMP.length - 1, Math.floor(d.heat * RAMP.length));
        buckets[b].push(d);
      }
      buckets.forEach((list, i) => {
        if (!list.length) return;
        ctx.fillStyle = RAMP[i];
        ctx.beginPath();
        for (const d of list) {
          const r = d.r * (1 + d.heat * 0.4);
          if (r < 0.35) continue;
          ctx.moveTo(d.x + r, d.y);
          ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        }
        ctx.fill();
      });
    };

    const radius = () => Math.max(70, Math.min(150, W * 0.11));

    const step = () => {
      raf = 0;
      if (dead) return;
      let energy = 0;
      const R = radius();
      for (const d of dots) {
        if (ptr.on) {
          const dx = d.x - ptr.x;
          const dy = d.y - ptr.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R * R) {
            const dist = Math.sqrt(d2) || 1;
            const f = 1 - dist / R;
            d.vx += (dx / dist) * f * 4.2;
            d.vy += (dy / dist) * f * 4.2;
            d.heat = Math.min(1, d.heat + f * 0.55);
          }
        }
        for (const rg of rings) {
          const dx = d.x - rg.x;
          const dy = d.y - rg.y;
          const dist = Math.hypot(dx, dy) || 1;
          const diff = Math.abs(dist - rg.r);
          if (diff < rg.w) {
            const f = (1 - diff / rg.w) * rg.a;
            d.vx += (dx / dist) * f * 7;
            d.vy += (dy / dist) * f * 7;
            d.heat = Math.min(1, d.heat + f);
          }
        }
        d.vx += (d.hx - d.x) * 0.09;
        d.vy += (d.hy - d.y) * 0.09;
        d.vx *= 0.82;
        d.vy *= 0.82;
        d.x += d.vx;
        d.y += d.vy;
        d.heat *= 0.94;
        energy += Math.abs(d.vx) + Math.abs(d.vy) + d.heat;
      }
      rings = rings.filter((rg) => { rg.r += Math.max(14, W * 0.014); rg.a *= 0.955; return rg.a > 0.03; });
      draw();
      if (visible && (ptr.on || rings.length || energy > dots.length * 0.004)) {
        raf = requestAnimationFrame(step);
      } else {
        running = false;
      }
    };
    const kick = () => {
      if (reduce || running || !visible) return;
      running = true;
      raf = requestAnimationFrame(step);
    };

    const build = async () => {
      try { await document.fonts.load('900 120px Archivo'); } catch { /* font fallback */ }
      if (dead) return;
      W = Math.max(280, wrap.clientWidth);
      gap = W < 520 ? 5 : Math.max(7, Math.round(W / 150));

      const m = document.createElement('canvas').getContext('2d');
      m.font = '900 200px Archivo';
      if ('fontStretch' in m) m.fontStretch = 'expanded';
      const tw = m.measureText(text).width || 1;
      const fs = (200 * W * 0.985) / tw;
      H = Math.ceil(fs * 0.74);

      const cols = Math.max(1, Math.floor(W / gap));
      const rows = Math.max(1, Math.floor(H / gap));
      const off = document.createElement('canvas');
      off.width = cols;
      off.height = rows;
      const o = off.getContext('2d', { willReadFrequently: true });
      o.setTransform(cols / W, 0, 0, rows / H, 0, 0);
      o.font = `900 ${fs}px Archivo`;
      if ('fontStretch' in o) o.fontStretch = 'expanded';
      o.textAlign = 'center';
      o.textBaseline = 'alphabetic';
      o.fillStyle = '#000';
      o.fillText(text, W / 2, fs * 0.725);
      const data = o.getImageData(0, 0, cols, rows).data;

      dots = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const a = data[(y * cols + x) * 4 + 3] / 255;
          if (a < 0.08) continue;
          const hx = (x + 0.5) * gap;
          const hy = (y + 0.5) * gap;
          dots.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0, heat: 0, r: gap * 0.58 * Math.sqrt(a) });
        }
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cv.style.width = `${W}px`;
      cv.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const local = (e) => { const r = wrap.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const onMove = (e) => { const p = local(e); ptr.x = p.x; ptr.y = p.y; ptr.on = true; kick(); };
    const onLeave = () => { ptr.on = false; kick(); };
    const onDown = (e) => {
      const p = local(e);
      rings.push({ x: p.x, y: p.y, r: 0, w: Math.max(36, W * 0.035), a: 1 });
      ptr.x = p.x; ptr.y = p.y; ptr.on = e.pointerType !== 'touch';
      kick();
    };

    build();
    if (!reduce) {
      wrap.addEventListener('pointermove', onMove);
      wrap.addEventListener('pointerleave', onLeave);
      wrap.addEventListener('pointerdown', onDown);
    }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); }, { threshold: 0.05 });
    io.observe(wrap);
    let t = 0;
    const ro = new ResizeObserver(() => { clearTimeout(t); t = setTimeout(build, 140); });
    ro.observe(wrap);

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      clearTimeout(t);
      io.disconnect();
      ro.disconnect();
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
      wrap.removeEventListener('pointerdown', onDown);
    };
  }, [text, reduce]);

  return (
    <div ref={wrapRef} className={`relative w-full select-none ${className}`} style={{ touchAction: 'pan-y' }}>
      <canvas ref={canvasRef} role="img" aria-label={`${text} — wordmark halftone interaktif`} className="block" />
    </div>
  );
};
