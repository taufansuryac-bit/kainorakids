import { useStore } from '../../context/StoreContext';
import './promotion-banners.css';

export function PromotionBanners() {
  const { content } = useStore();
  const items = content.promotions || [];
  if (!items.length) return null;
  return <section id="promotions" className="f-promotion-section" aria-label="Promosi Kainora Kids">
    <div className="f-promotion-grid">{items.map(item => <figure key={item.id} className="f-promotion-panel"><img src={item.image} alt={item.alt} width="1600" height="900" loading="lazy" decoding="async" /></figure>)}</div>
  </section>;
}
