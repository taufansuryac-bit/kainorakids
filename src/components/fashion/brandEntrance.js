export const BRAND_INTRO_KEY = 'kainora-brand-intro-v1';
export const BRAND_INTRO_DURATION = 2900;

export function shouldPlayBrandIntro({ url, seen, reduced, scrollY }) {
  const view = url.searchParams.get('view');
  return url.pathname === '/' && (!view || view === 'home') && !url.hash && !seen && !reduced && scrollY < 10;
}

export function brandLogoFlight(from, to) {
  if (!from.width || !to.width) return null;
  return {
    x: to.left + to.width / 2 - from.left - from.width / 2,
    y: to.top + to.height / 2 - from.top - from.height / 2,
    scale: to.width / from.width,
  };
}

let activeIntro;

export function startBrandIntro() {
  if (activeIntro) return activeIntro;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const url = new URL(location.href);
  const preview = url.searchParams.get('intro') === 'preview';
  let seen = false;
  try { seen = !!sessionStorage.getItem(BRAND_INTRO_KEY); } catch { /* Storage is optional. */ }
  if (!shouldPlayBrandIntro({ url, seen: seen && !preview, reduced: media.matches, scrollY: window.scrollY }) || document.hidden) return () => {};

  const html = document.documentElement, root = document.getElementById('root');
  const previousInert = root?.inert, overflow = html.style.overflow;
  const timers = [], animations = [];
  const overlay = document.createElement('div');
  overlay.className = 'brand-intro-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  const curtain = document.createElement('div');
  curtain.className = 'brand-intro-curtain';
  const logo = document.createElement('div');
  logo.className = 'brand-intro-wordmark';
  for (const part of ['kainora', 'kids']) {
    const slice = document.createElement('div');
    slice.className = `brand-intro-part brand-intro-part--${part}`;
    const image = document.createElement('img');
    image.src = '/website-logo-hd.svg'; image.alt = ''; image.draggable = false;
    image.addEventListener('error', () => finish(), { once: true });
    slice.append(image); logo.append(slice);
  }
  overlay.append(curtain, logo);
  document.body.append(overlay);
  html.dataset.brandIntro = 'branding';
  html.dataset.brandIntroLogo = 'flying';
  html.style.overflow = 'hidden';
  if (root) root.inert = true;
  performance.mark('kainora-intro-start');
  try { sessionStorage.setItem(BRAND_INTRO_KEY, 'seen'); } catch { /* Once per document when unavailable. */ }

  const notify = () => document.dispatchEvent(new Event('kainora:intro-change'));
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    animations.forEach(animation => animation.cancel());
    overlay.remove();
    delete html.dataset.brandIntro;
    delete html.dataset.brandIntroLogo;
    html.style.overflow = overflow;
    if (root) root.inert = previousInert;
    window.removeEventListener('resize', finish);
    window.removeEventListener('pagehide', finish);
    window.removeEventListener('keydown', onKey);
    document.removeEventListener('visibilitychange', onVisibility);
    media.removeEventListener('change', onReduced);
    performance.mark('kainora-intro-end');
    performance.measure('kainora-intro', 'kainora-intro-start', 'kainora-intro-end');
    activeIntro = undefined;
    notify();
  };
  const onKey = event => { if (event.key === 'Escape') finish(); };
  const onVisibility = () => { if (document.hidden) finish(); };
  const onReduced = () => { if (media.matches) finish(); };
  const later = (callback, delay) => timers.push(setTimeout(() => {
    if (finished) return;
    try { callback(); } catch { finish(); }
  }, delay));
  const animate = (node, frames, options) => {
    const animation = node.animate(frames, { fill: 'both', ...options });
    animations.push(animation);
    return animation;
  };
  activeIntro = finish;
  window.addEventListener('resize', finish);
  window.addEventListener('pagehide', finish);
  window.addEventListener('keydown', onKey);
  document.addEventListener('visibilitychange', onVisibility);
  media.addEventListener('change', onReduced);
  notify();
  later(finish, BRAND_INTRO_DURATION);

  try {
    [...logo.children].forEach((part, index) => animate(part, [
      { opacity: 0, transform: 'translateY(18px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 650, delay: index ? 450 : 80, easing: 'cubic-bezier(.16,1,.3,1)' }));

    later(() => {
      const target = document.querySelector('.site-nav [data-intro-logo], .site-nav .nav-logo');
      const from = logo.getBoundingClientRect(), to = target?.getBoundingClientRect();
      const flight = to && brandLogoFlight(from, to);
      if (!flight) { animate(logo, [{ opacity: 1 }, { opacity: 0 }], { delay: 350, duration: 550 }); return; }
      animate(logo, [
        { transform: 'translate(0,0) scale(1)' },
        { transform: `translate(${flight.x}px,${flight.y}px) scale(${flight.scale})` },
      ], { duration: 900, easing: 'cubic-bezier(.76,0,.24,1)' });
    }, 1200);

    later(() => {
      html.dataset.brandIntro = 'reveal';
      animate(curtain, [{ opacity: 1 }, { opacity: 0 }], { duration: 650, easing: 'cubic-bezier(.22,1,.36,1)' });
    }, 1550);

    later(() => {
      delete html.dataset.brandIntroLogo;
      logo.style.visibility = 'hidden';
    }, 2120);
  } catch { finish(); }
  return finish;
}
