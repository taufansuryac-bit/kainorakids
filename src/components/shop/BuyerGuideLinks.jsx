import { ArrowUpRight } from 'lucide-react';
import { openGuide } from '../../utils/guideLinks';

export const GUIDE_LINKS = [
  ['/panduan-ukuran-anak/','Studio ukuran fashion anak'],
  ['/panduan/ukuran-kaos-anak/','Pilih ukuran & cara mengukur'],
  ['/panduan/perawatan-sablon/','Rawat kain & sablon'],
  ['/pengiriman/','Pengiriman dari Bandung'],
  ['/retur/','Retur & penukaran ukuran'],
];
export function BuyerGuideLinks() {
  return <nav className="ks-buyer-guides" aria-label="Panduan belanja Kainora">{GUIDE_LINKS.map(([path,label])=><a key={path} href={path} onClick={event=>openGuide(event,path)}>{label}<ArrowUpRight size={16}/></a>)}</nav>;
}
