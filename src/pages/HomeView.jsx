import { useMemo } from 'react';
import { SEO } from '../constants/data';
import { useStore } from '../context/StoreContext';
import { HeroScene } from '../components/fashion/Scenes';
import { KineticManifesto, MovementReveal } from '../components/fashion/ScrollStories';
import { SocialWorld, AffiliateInvitation } from '../components/fashion/SocialAndAffiliate';
import { CommerceScenes, ProductTheater } from '../components/fashion/Commerce';
import { CategoryPortals } from '../components/fashion/CategoryPortals';
import { FeaturedEdit } from '../components/fashion/FeaturedEdit';
import { selectHighlights } from '../../shared/contentSchema';
import { useShopSchema } from '../components/shop/ShopShared';
import { storeOrganization } from '../content/commercePolicies';

export const HomeView = () => {
  useShopSchema([storeOrganization(), {'@context':'https://schema.org','@type':'WebSite',name:'Kainora Kids',url:'https://kainorakids.com/',inLanguage:'id-ID'}]);
  const { products, content, setGlobalGenderFilter, setGlobalSearchState, setView } = useStore();
  const catalogue = useMemo(() => [...products].sort((a, b) => (a.order ?? 999) - (b.order ?? 999)), [products]);
  const featured = useMemo(() => selectHighlights(catalogue, content.highlights), [catalogue, content.highlights]);
  const goCategory = gender => { setGlobalGenderFilter(gender); setGlobalSearchState({ query: '', gender, age: 'Semua' }); setView('products'); };
  const goShop = () => goCategory('Semua');
  return <main className="f-home">
    <SEO title="Kaos Anak Oversize & Baju Anak Katun | Kainora Kids" description="Temukan kaos anak oversize boxy Kainora Kids berbahan katun, motif grafis depan dan belakang, ukuran S–XXL. Kaos putih Rp69.000, dikirim dari Bandung." image="/images/og/kainora-kids-share.jpg" imageAlt="Dua anak memakai kaos grafis Kainora Kids di depan tenda piknik" canonicalPath="" />
    <HeroScene /><KineticManifesto />
    <CommerceScenes>{(quickView) => <><ProductTheater products={catalogue} /><FeaturedEdit products={featured} onQuickView={quickView} onShop={goShop} /><CategoryPortals onSelect={goCategory} /><MovementReveal onShop={goShop} /></>}</CommerceScenes>
    <SocialWorld /><AffiliateInvitation onOpen={() => setView('affiliate')} />
  </main>;
};
