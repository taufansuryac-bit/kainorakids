import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SEO } from '../constants/data';
import { useStore } from '../context/StoreContext';
import { BUYER_GUIDES, guideFromLocation } from '../content/buyerGuides';
import { SIZE_CHART, SIZE_CHART_IMAGE } from '../content/sizeChart';
import { storeOrganization } from '../content/commercePolicies';
import { plainClick } from '../utils/productRoutes';
import { openGuide } from '../utils/guideLinks';
import { useShopSchema } from '../components/shop/ShopShared';
import { BuyerGuideLinks } from '../components/shop/BuyerGuideLinks';
import './shop.css';

export function BuyerGuideView() {
  const {setView}=useStore(),[path,setPath]=useState(location.pathname);
  useEffect(()=>{const update=()=>setPath(location.pathname);window.addEventListener('popstate',update);return()=>window.removeEventListener('popstate',update);},[]);
  const guide=guideFromLocation({pathname:path}) || BUYER_GUIDES[0];
  useShopSchema([storeOrganization(),{'@context':'https://schema.org','@type':'WebPage',name:guide.title,description:guide.description,url:`https://kainorakids.com${guide.path}`,inLanguage:'id-ID'},{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Beranda',item:'https://kainorakids.com/'},{'@type':'ListItem',position:2,name:guide.heading,item:`https://kainorakids.com${guide.path}`}]}]);
  const follow=(event,href)=>{if(href==='/products/'&&plainClick(event)){event.preventDefault();setView('products');}else openGuide(event,href);};
  return <main className="ks-shop ks-guide ks-section"><SEO title={guide.title} description={guide.description} canonicalPath={guide.path} robots="index, follow"/><nav className="ks-breadcrumb" aria-label="Breadcrumb"><a href="/" onClick={e=>{if(plainClick(e)){e.preventDefault();setView('home');}}}>Beranda</a><span>/</span><span>Panduan pembeli</span></nav><header className="ks-guide-heading"><span className="ks-eyebrow">KAINORA KIDS / {guide.eyebrow}</span><h1>{guide.heading}</h1><p>{guide.description}</p></header><div className="ks-guide-layout"><article>{guide.sections.map(section=><section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs?.map(text=><p key={text}>{text}</p>)}{section.steps&&<ol>{section.steps.map(step=><li key={step}>{step}</li>)}</ol>}{section.chart&&<div className="ks-guide-chart"><table className="ks-size-table"><caption>Lebar × panjang saat kaos dibentangkan, dalam cm</caption><thead><tr><th scope="col">Ukuran</th><th scope="col">Lebar</th><th scope="col">Panjang</th><th scope="col">Bahu*</th></tr></thead><tbody>{SIZE_CHART.map(([size,width,length,shoulder])=><tr key={size}><th scope="row">{size}</th><td>{width} cm</td><td>{length} cm</td><td>{shoulder} cm</td></tr>)}</tbody></table><p>*Bahu diukur dari leher ke sambungan jahitan tangan.</p><figure className="ks-size-chart-image"><a href={SIZE_CHART_IMAGE} target="_blank" rel="noopener noreferrer"><img src={SIZE_CHART_IMAGE} alt="Size chart Kainora Kids S sampai XXL" width="1800" height="1800" loading="lazy"/></a></figure></div>}{section.links?.map(link=><a className="ks-guide-link" key={link.href} href={link.href} onClick={event=>follow(event,link.href)} {...(!link.href.startsWith('/')?{target:'_blank',rel:'noopener noreferrer'}:{})}>{link.label}<ArrowUpRight size={16}/></a>)}</section>)}</article><aside><span className="ks-eyebrow">SEBELUM MEMILIH</span><h2>Informasi<br/>belanja</h2><BuyerGuideLinks/><a className="ks-button ks-button-acid" href="/products/" onClick={e=>{if(plainClick(e)){e.preventDefault();setView('products');}}}>JELAJAHI KOLEKSI<ArrowUpRight size={17}/></a></aside></div></main>;
}
