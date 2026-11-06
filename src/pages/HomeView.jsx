import { SEO } from '../constants/data';
import { useStore } from '../context/StoreContext';
import { HeroScene } from '../components/fashion/Scenes';
import { KineticManifesto } from '../components/fashion/ScrollStories';
import { SocialWorld, AffiliateInvitation } from '../components/fashion/SocialAndAffiliate';
import { CategoryPortals } from '../components/fashion/CategoryPortals';
import { GarmentCollection } from '../components/fashion/GarmentCollection';
import { ProductRailSection } from '../components/fashion/ProductRailSection';
import { ProductMarquee } from '../components/fashion/ProductMarquee';
import { PromotionBanners } from '../components/fashion/PromotionBanners';
import { useShopSchema } from '../components/shop/ShopShared';
import { storeOrganization } from '../content/commercePolicies';
import { HOME_SEO } from '../content/storefrontSeo';

export const HomeView = () => {
  useShopSchema([storeOrganization(), {'@context':'https://schema.org','@type':'WebSite',name:'Kainora Kids',url:'https://kainorakids.com/',inLanguage:'id-ID'}]);
  const { setGlobalGenderFilter, setGlobalSearchState, setView } = useStore();
  const goCategory = gender => { setGlobalGenderFilter(gender); setGlobalSearchState({ query: '', gender, age: 'Semua' }); setView('products'); };
  const goShop = () => goCategory('Semua');
  return <main className="f-home">
    <SEO title={HOME_SEO.title} description={HOME_SEO.description} image="/images/og/kainora-kids-share.jpg" imageAlt="Dua anak memakai kaos grafis Kainora Kids di depan tenda piknik" canonicalPath="" />
    <HeroScene /><ProductRailSection /><ProductMarquee />
    <GarmentCollection onShop={goShop} /><PromotionBanners /><CategoryPortals onSelect={goCategory} /><KineticManifesto onShop={goShop} />
    <SocialWorld /><AffiliateInvitation onOpen={() => setView('affiliate')} />
  </main>;
};
