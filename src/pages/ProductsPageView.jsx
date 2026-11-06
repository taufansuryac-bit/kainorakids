import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Search, SlidersHorizontal, X } from 'lucide-react';
import { SEO } from '../constants/data';
import { useStore } from '../context/StoreContext';
import { useMotionPreference } from '../components/fashion/useMotionPreference';
import { ShopProductCard, ShopReveal, useShopSchema } from '../components/shop/ShopShared';
import { ShopNotFound } from '../components/shop/ShopNotFound';
import { CATALOG_PAGE_SIZE as PER_PAGE, catalogHref, catalogPage, filterCatalog, plainClick } from '../utils/productRoutes';
import { catalogDescription, catalogTitle, productBreadcrumb, productListSchema } from '../utils/productSeo';
import { catalogPriceLabel } from '../utils/pricing';
import './shop.css';
import { BuyerGuideLinks } from '../components/shop/BuyerGuideLinks';

const GENDERS = [['Semua', 'Semua motif'], ['Laki-laki', 'Boys'], ['Perempuan', 'Girls'], ['Unisex', 'Unisex']];
export const ProductsPageView = ({ setActiveProduct }) => {
  const { setView, products, globalSearchState, globalGenderFilter, toggleWishlist, wishlist, initialLocation } = useStore();
  const reduce = useMotionPreference();
  const savedFilters = useRef(typeof window === 'undefined' ? undefined : window.history.state?.catalogFilters);
  const [search, setSearch] = useState(savedFilters.current?.search ?? globalSearchState?.query ?? '');
  const [gender, setGender] = useState(savedFilters.current?.gender ?? (globalSearchState?.gender !== 'Semua' ? globalSearchState?.gender || 'Semua' : globalGenderFilter || 'Semua'));
  const [size, setSize] = useState(savedFilters.current?.size ?? globalSearchState?.age ?? 'Semua');
  const [sort, setSort] = useState(savedFilters.current?.sort || 'curated');
  const [page, setPage] = useState(() => catalogPage(initialLocation));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const grid = useRef(null);
  const globalPrevious = useRef({ search: globalSearchState, gender: globalGenderFilter });
  useEffect(() => {
    const update = () => {
      setPage(catalogPage(window.location));
      const saved = window.history.state?.catalogFilters;
      if (saved) {setSearch(saved.search);setGender(saved.gender);setSize(saved.size);setSort(saved.sort);}
    };
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);
  useEffect(() => {
    const position = window.history.state?.catalogScroll;
    if (typeof position !== 'number') return;
    const frame = requestAnimationFrame(() => window.scrollTo(0, position));
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    window.history.replaceState({ ...window.history.state, catalogFilters: { search, gender, size, sort } }, '', window.location.href);
  }, [search, gender, size, sort]);
  useEffect(() => {
    if (globalPrevious.current.search === globalSearchState && globalPrevious.current.gender === globalGenderFilter) return;
    globalPrevious.current = { search: globalSearchState, gender: globalGenderFilter };
    setSearch(globalSearchState?.query || '');
    setGender(globalSearchState?.gender && globalSearchState.gender !== 'Semua' ? globalSearchState.gender : globalGenderFilter || 'Semua');
    setSize(globalSearchState?.age || 'Semua');setPage(1);
    window.history.replaceState({ view: 'products' }, '', catalogHref());
  }, [globalSearchState, globalGenderFilter]);
  const filtered = useMemo(() => filterCatalog(products, { search, gender, size, sort }), [products, search, gender, size, sort]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const sizes = [...new Set(products.flatMap(product => product.sizes || []))];
  const activeFilters = !!search.trim() || gender !== 'Semua' || size !== 'Semua';
  useShopSchema([productListSchema(visible, currentPage), productBreadcrumb(null, currentPage)]);
  const resetPage = () => {setPage(1);if (catalogPage(window.location) !== 1) window.history.replaceState({ view: 'products' }, '', catalogHref());};
  const reset = () => {setSearch('');setGender('Semua');setSize('Semua');setSort('curated');resetPage();};
  const openProduct = product => {window.history.replaceState({ ...window.history.state, catalogScroll: window.scrollY }, '', window.location.href);setActiveProduct(product);setView('productDetail');};
  const navigatePage = (event, next) => {
    if (!plainClick(event)) return;
    event.preventDefault();setPage(next);window.history.pushState({ view: 'products', catalogFilters: { search, gender, size, sort } }, '', catalogHref(next));
    grid.current?.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth', block: 'start' });
  };
  const heroProduct = products.find(p => p.images?.length > 1) || products[0];
  const canonical = catalogHref(currentPage);
  if (page > totalPages && !activeFilters) return <ShopNotFound/>;
  return <main className="ks-shop ks-catalog">
    <SEO title={catalogTitle(currentPage)} description={catalogDescription(products, currentPage, PER_PAGE)} image={heroProduct?.img || '/website-logo.png'} imageAlt="Koleksi kaos grafis Kainora Kids" canonicalPath={canonical} robots="index, follow, max-image-preview:large"/>
    <header className="ks-catalog-heading ks-section"><div><span className="ks-eyebrow">KAINORA KIDS / GRAPHIC TEE ANAK</span><h1>Graphic tee oversize anak.</h1></div><p>{products.length} pilihan motif kaos anak.<br/><strong>{catalogPriceLabel(products)}</strong></p></header>
    <div className="ks-catalog-toolbar"><div className="ks-tool-row"><label className="ks-search"><Search size={18}/><input type="search" placeholder="Cari nama atau motif kaos…" aria-label="Cari motif kaos" value={search} onChange={event => {setSearch(event.target.value);resetPage();}}/>{search && <button type="button" aria-label="Hapus pencarian" onClick={() => {setSearch('');resetPage();}}><X size={16}/></button>}</label><div className="ks-tool-options"><button type="button" aria-expanded={filtersOpen} aria-controls="ks-more-filters" onClick={() => setFiltersOpen(value => !value)}><SlidersHorizontal size={15}/>FILTER{size !== 'Semua' && <i/>}</button><label><span className="sr-only">Urutkan produk</span><select value={sort} onChange={event => {setSort(event.target.value);resetPage();}}><option value="curated">Pilihan Kainora</option><option value="name">Nama A–Z</option><option value="price-asc">Harga terendah</option><option value="price-desc">Harga tertinggi</option></select></label></div></div><div className="ks-category-row"><div className="ks-gender-tabs" aria-label="Kategori kaos">{GENDERS.map(([value, label]) => <button type="button" key={value} aria-pressed={gender === value} onClick={() => {setGender(value);resetPage();}}>{label}{gender === value && <motion.span layoutId="ks-category-line" transition={{ duration: reduce ? 0 : .25 }}/>}</button>)}</div><p role="status">{filtered.length} <span>pilihan</span>{activeFilters && <button type="button" onClick={reset} aria-label="Hapus semua filter"><X size={13}/></button>}</p></div><AnimatePresence initial={false}>{filtersOpen && <motion.div className="ks-extra-filters" id="ks-more-filters" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduce ? 0 : .23 }}><div>{sizes.length ? <label>Ukuran<select aria-label="Filter ukuran" value={size} onChange={event => {setSize(event.target.value);resetPage();}}><option>Semua</option>{sizes.map(item => <option key={item}>{item}</option>)}</select></label> : <p>Pilihan ukuran sedang dilengkapi. Lihat detail motif untuk menanyakan ukuran kepada tim Kainora.</p>}<button type="button" onClick={reset}>RESET FILTER <X size={13}/></button></div></motion.div>}</AnimatePresence></div>
    <section ref={grid} id="ks-collection" className="ks-section ks-results" aria-label="Daftar motif kaos Kainora"><div className="ks-results-meta"><span className="ks-eyebrow">{activeFilters ? 'HASIL PENCARIAN' : 'SEMUA PRODUK'}</span><span>{filtered.length ? `${(currentPage - 1) * PER_PAGE + 1}–${Math.min(currentPage * PER_PAGE, filtered.length)} DARI ${filtered.length}` : '0 HASIL'}</span></div>{visible.length ? <motion.div className="ks-product-grid" layout={!reduce}>{visible.map((product, index) => <motion.div key={product.id} layout={!reduce} initial={reduce || index < 2 ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4, delay: Math.min(index * .035, .2), layout: { duration: .3 } }}><ShopProductCard product={product} index={(currentPage - 1) * PER_PAGE + index} onOpen={openProduct} wishlisted={wishlist.includes(product.id)} onToggleWishlist={toggleWishlist}/></motion.div>)}</motion.div> : <div className="ks-empty"><Search size={35}/><h2>Produk tidak ditemukan.</h2><p>Coba kata kunci lain atau buka kembali semua motif.</p><button type="button" className="ks-button" onClick={reset}>LIHAT SEMUA MOTIF <ArrowUpRight size={18}/></button></div>}
      {totalPages > 1 && <nav className="ks-pagination" aria-label="Halaman katalog"><a href={catalogHref(Math.max(1, currentPage - 1))} aria-disabled={currentPage === 1} onClick={event => currentPage === 1 ? event.preventDefault() : navigatePage(event, currentPage - 1)}><ArrowLeft size={17}/><span>Sebelumnya</span></a><div>{Array.from({ length: totalPages }, (_, i) => i + 1).map(number => <a key={number} aria-current={currentPage === number ? 'page' : undefined} href={catalogHref(number)} onClick={event => navigatePage(event, number)}>{number}</a>)}</div><a href={catalogHref(Math.min(totalPages, currentPage + 1))} aria-disabled={currentPage === totalPages} onClick={event => currentPage === totalPages ? event.preventDefault() : navigatePage(event, currentPage + 1)}><span>Selanjutnya</span><ArrowRight size={17}/></a></nav>}
    </section><section className="ks-catalog-signoff ks-section"><ShopReveal><span className="ks-eyebrow">PANDUAN BELANJA</span><h2>PILIH MOTIF.<br/><span>CEK UKURAN.</span></h2><p>Lihat detail kaos anak katun, bandingkan foto studio dan pemakaian, lalu pilih ukuran S–XXL dengan bantuan panduan pengukuran. Dikirim dari Bandung melalui J&T Express.</p><a href="https://www.instagram.com/kainorakids/" target="_blank" rel="noopener noreferrer" className="ks-inline-link">TANYAKAN KE TIM KAINORA <ArrowUpRight size={18}/></a><BuyerGuideLinks/></ShopReveal></section>
  </main>;
};
