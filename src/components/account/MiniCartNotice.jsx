import {useEffect,useState} from 'react';
import {createPortal} from 'react-dom';
import {AnimatePresence,motion} from 'motion/react';
import {Check,X,ArrowUpRight} from 'lucide-react';
import {useStore} from '../../context/StoreContext';
import {formatPrice} from '../../utils/pricing';
import {useMotionPreference} from '../fashion/useMotionPreference';
import {AccountButton} from './AccountUI';
export function MiniCartDrawer() {
  const [mounted,setMounted]=useState(false);
  useEffect(()=>setMounted(true),[]);
  const { isMiniCartOpen, setIsMiniCartOpen, cart, setView } = useStore();
  const reduce = useMotionPreference();
  useEffect(() => {if (!isMiniCartOpen) return;const timer=setTimeout(()=>setIsMiniCartOpen(false),6000);return()=>clearTimeout(timer);},[isMiniCartOpen,setIsMiniCartOpen]);
  const item=cart.at(-1);
  if(!mounted)return null;
  return createPortal(<div className="ka-root"><AnimatePresence>{isMiniCartOpen && item && <motion.aside className="ka-mini" aria-label="Produk ditambahkan ke keranjang" initial={reduce ? false : {opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:15}}><div className="ka-mini-top"><Check size={18}/><span>Sudah masuk keranjang</span><button type="button" aria-label="Tutup notifikasi keranjang" onClick={()=>setIsMiniCartOpen(false)}><X size={18}/></button></div><div className="ka-mini-item"><img src={item.img || item.images?.[0]} alt="" width="68" height="68"/><div><strong>{item.name}</strong><p>Ukuran {item.size} · {item.qty > 1 ? `${item.qty} × ${formatPrice(item.price)} = ${formatPrice(item.price * item.qty)}` : formatPrice(item.price)}</p></div></div><AccountButton onClick={()=>{setIsMiniCartOpen(false);setView('cart');}}>Lihat keranjang<ArrowUpRight size={18}/></AccountButton></motion.aside>}</AnimatePresence></div>,document.body);
}
