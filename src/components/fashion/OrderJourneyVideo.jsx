import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

export function OrderJourneyVideo({ enabled = true, prepare = false }) {
  const host = useRef(null), video = useRef(null);
  const near = useInView(host, { margin: '300px', once: true });
  const visible = useInView(host, { amount: .15 });
  const [failed, setFailed] = useState(false);
  const load = near || prepare;
  useEffect(() => {
    const element = video.current;
    if (!element || !load) return;
    let cancelled = false;
    const sync = () => {
      if (enabled && visible && !document.hidden) {
        element.muted = true;
        element.play().then(() => {if (cancelled) element.pause();}).catch(() => {});
      } else element.pause();
    };
    sync();element.addEventListener('canplay',sync);document.addEventListener('visibilitychange',sync);
    return () => {cancelled=true;element.pause();element.removeEventListener('canplay',sync);document.removeEventListener('visibilitychange',sync);};
  }, [load,visible,enabled]);
  return <div ref={host} className="f-order-journey"><video ref={video} src={load ? '/video/order-journey-web.mp4' : undefined} poster={load ? '/video/order-journey-poster.jpg' : undefined} width="1280" height="720" muted loop playsInline autoPlay={enabled && visible} preload={prepare ? 'auto' : 'none'} disablePictureInPicture controls={false} aria-label="Film animasi perjalanan pesanan Kainora: memilih, membeli, dikirim, lalu diterima di rumah. Video tanpa suara." onError={() => setFailed(true)}/>{failed && <p className="f-order-video-error" role="status">Video belum dapat dimuat. Silakan muat ulang halaman.</p>}</div>;
}
