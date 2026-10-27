import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Search, X } from 'lucide-react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
import { useStore } from '../context/StoreContext';
import { SEO } from '../constants/data';
import { BLOG_POSTS, JOURNAL_CATEGORIES, topicName } from '../constants/blogPosts';
import { journalIndexSchema, journalRelated, journalTitle, selectedArticle } from '../utils/journalRoutes';
import { journalShopLinks } from '../utils/journalShop';
import { plainClick } from '../utils/productRoutes';
import { openGuide } from '../utils/guideLinks';
import { blogPostSchema } from '../utils/seoHelpers';
import { articleDate, articleHref, articleISODate, prepareArticle } from '../utils/journal';
import { Overline, RevealLines } from '../components/fashion/motion';
import { JournalNavbar, JournalFooter } from '../components/fashion/JournalChrome';
import '../journal.css';

const PAGE_SIZE = 9;
const selectedFromURL = () => selectedArticle(window.location);
const finishNavigation = target => {
  if (target === 'home') { window.scrollTo({ top: 0, behavior: 'instant' }); document.querySelector('.j-journal')?.focus({ preventScroll: true }); return; }
  document.getElementById('j-archive')?.scrollIntoView({ behavior: 'instant' });
  document.getElementById(target === 'search' ? 'j-search' : 'j-archive-title')?.focus({ preventScroll: true });
};

function JournalImage({ post, priority = false }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [post.img]);
  return <figure className="j-photo">
    {post.img && !failed
      ? <img src={post.img} alt={post.imageAlt || post.title} style={post.imagePosition ? { objectPosition: post.imagePosition } : undefined} loading={priority ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />
      : <div className="j-photo-fallback"><img src="/website-logo.png" alt="Kainora Kids" /><span>JOURNAL / {post.category || 'CATATAN'}</span></div>}
    {post.imageCaption && <figcaption>{post.imageCaption}</figcaption>}
  </figure>;
}

function PostMeta({ post }) {
  return <p className="j-meta"><span>{topicName(post.category) || 'Journal'}</span>{articleDate(post) && <time dateTime={articleISODate(post)}>{post.dateModified ? 'Diperbarui ' : ''}{articleDate(post)}</time>}{post.preview && <span>Contoh</span>}</p>;
}

function StoryCard({ post, open, feature = false, number }) {
  return <article className={`j-story ${feature ? 'j-story-feature' : ''}`}>
    <a href={articleHref(post.id)} onClick={event => open(event, post.id)} className="j-story-link">
      <div className="j-story-visual"><JournalImage post={post} priority={feature} /><span className="j-story-arrow" aria-hidden="true"><ArrowUpRight size={23} /></span></div>
      <div className="j-story-copy"><PostMeta post={post} />
        <h2>{post.title}</h2>
        {post.excerpt && <p className="j-excerpt">{post.excerpt}</p>}
        <span className="j-story-end"><span>{feature ? 'Baca ceritanya' : 'Baca artikel'}</span><span aria-hidden="true">{String(number).padStart(2, '0')} <ArrowRight size={16} /></span></span>
      </div>
    </a>
  </article>;
}

// Same links as the static article page (scripts/build-journal.js), opened in-app.
function JournalShop({ post }) {
  const { products, setView } = useStore();
  const links = useMemo(() => journalShopLinks(post, products), [post, products]);
  const openProduct = (event, product) => { if (!plainClick(event)) return; event.preventDefault(); window.dispatchEvent(new CustomEvent('OPEN_PRODUCT', { detail: product })); };
  return <section className="j-shop" aria-labelledby="j-shop-title"><h2 id="j-shop-title">Dari koleksi Kainora</h2>
    <ul className="j-shop-products">{links.products.map(item => <li key={item.href}><a href={item.href} onClick={event => openProduct(event, item.product)}><img src={item.image} alt={item.alt} width="64" height="64" loading="lazy" decoding="async" /><span>{item.name}</span></a></li>)}</ul>
    <p className="j-shop-guides">{links.guides.map(guide => <a key={guide.href} href={guide.href} onClick={event => openGuide(event, guide.href)}>{guide.label} →</a>)}<a href="/products/" onClick={event => { if (!plainClick(event)) return; event.preventDefault(); setView('products'); }}>Semua motif kaos anak →</a></p>
  </section>;
}

function CollectionLink() {
  const { setView, setGlobalGenderFilter, setGlobalSearchState } = useStore();
  const visit = () => { setGlobalGenderFilter('Semua'); setGlobalSearchState({ query: '', gender: 'Semua', age: 'Semua' }); setView('products'); };
  return <section className="j-collection" aria-labelledby="j-collection-title"><div><Overline>FROM THE JOURNAL TO THE WARDROBE</Overline><h2 id="j-collection-title">Cerita baru.<br />Favorit baru.</h2><p>Jelajahi koleksi Kainora untuk keseharian si kecil.</p><button className="f-button" onClick={visit}>LIHAT KOLEKSI <ArrowUpRight size={18} /></button></div><button className="j-collection-image" onClick={visit} aria-label="Jelajahi koleksi pakaian Kainora"><img src="/images/journal/992.webp" alt="Ilustrasi padupadan pakaian anak; dibuat dengan AI" loading="lazy" decoding="async" /><span>ILUSTRASI PADUPADAN / AI</span></button><span className="j-collection-index" aria-hidden="true">K / K</span></section>;
}

function ArticleReader({ post, posts, open, back }) {
  const content = useMemo(() => prepareArticle(post.content), [post.content]);
  const [shareStatus, setShareStatus] = useState('');
  const related = journalRelated(post, posts);

  useEffect(() => {
    if (post.preview) return undefined;
    document.getElementById('blog-article-jsonld')?.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json'; script.id = 'blog-article-jsonld';
    script.textContent = JSON.stringify(blogPostSchema(post));
    document.head.appendChild(script);
    return () => script.remove();
  }, [post]);

  const copyLink = async () => {
    setShareStatus('Menyalin tautan…');
    try { await navigator.clipboard.writeText(window.location.href); setShareStatus('Tautan artikel disalin.'); }
    catch { setShareStatus('Salin tautan dari bilah alamat browser.'); }
  };

  return <>
    <SEO title={journalTitle(post)} description={post.metaDescription || post.excerpt || 'Catatan dari Kainora Kids.'} image={post.img} imageAlt={post.imageAlt} canonicalPath={articleHref(post.id)} ogType="article" publishedTime={post.datePublished} modifiedTime={post.dateModified} author={post.author || 'Kainora Journal'} section={topicName(post.category)} articleTags={post.tags} keywords={post.focusKeyword} />
    <article className="j-article">
      <nav className="j-article-nav" aria-label="Navigasi artikel"><a href="/blog/#j-archive" onClick={back}><ArrowLeft size={17} /> Kembali ke journal</a><span className="f-cap">KAINORA / JOURNAL</span></nav>
      <header className="j-article-header"><PostMeta post={post} /><h1 className="j-page-focus" tabIndex={-1}>{post.title}</h1>{post.excerpt && <p className="j-article-deck">{post.excerpt}</p>}<div className="j-article-byline"><span>{post.preview ? 'PRATINJAU ARTIKEL' : post.author || 'KAINORA KIDS'}</span>{content.minutes && <span>± {content.minutes} menit baca</span>}</div></header>
      <div className="j-article-cover"><JournalImage post={post} priority /></div>
      <div className="j-reading-layout"><div className="j-reading-aside"><Overline>DALAM CERITA INI</Overline>{content.headings.length > 0 ? <nav aria-label="Daftar isi artikel">{content.headings.map(heading => <a href={`#${heading.id}`} key={heading.id}>{heading.text}</a>)}</nav> : <p>{post.category || 'Journal'}<br />Kainora Kids</p>}<button onClick={copyLink} className="j-copy-link">Salin tautan <ArrowUpRight size={16} /></button><p className="j-share-status" role="status">{shareStatus}</p></div>
        <div className="j-reading-body">{post.preview && <p className="j-preview-note">Artikel contoh untuk pratinjau desain. Isi belum diterbitkan sebagai panduan resmi Kainora.</p>}
          {content.text ? <div className="j-prose" onClick={event => { const link = event.target.closest('a'); if (!link) return; const url = new URL(link.href); const id = url.origin === window.location.origin ? selectedArticle(url) : null; if (id) open(event, id, link); }} dangerouslySetInnerHTML={{ __html: content.html }} /> : <div className="j-prose"><p className="j-empty-copy">Naskah lengkap belum tersedia.</p><p>Ringkasan artikel ditampilkan di atas. Jelajahi catatan lainnya atau lihat koleksi Kainora.</p></div>}
          {post.sources?.length > 0 && <section className="j-sources" aria-labelledby="j-sources-title"><h2 id="j-sources-title">Rujukan bacaan</h2><ul>{post.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title} <ArrowUpRight size={13} /></a></li>)}</ul><p>Rujukan mendukung bagian faktual yang relevan. Contoh kegiatan dan padupadan merupakan panduan editorial Kainora Journal.</p></section>}
          <JournalShop post={post} />
          <div className="j-article-signoff"><span className="f-cap">END OF STORY / KAINORA JOURNAL</span><a href="/blog/#j-archive" onClick={back}><ArrowLeft size={17} /> Semua artikel</a></div>
        </div>
      </div>
    </article>
    {related.length > 0 && <section className="j-related" aria-labelledby="j-related-title"><div className="j-section-label"><h2 id="j-related-title">Cerita berikutnya.</h2><span className="f-cap">KEEP EXPLORING <ArrowRight size={17} /></span></div><div className="j-grid">{related.map((item, index) => <StoryCard key={item.id} post={item} open={open} number={index + 1} />)}</div></section>}
    <CollectionLink />
  </>;
}

export function BlogView() {
  const [posts, setPosts] = useState(BLOG_POSTS);
  const [loading, setLoading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [syncPending, setSyncPending] = useState(isFirebaseConfigured);
  const [selectedId, setSelectedId] = useState(selectedFromURL);
  const [category, setCategory] = useState(() => new URLSearchParams(window.location.search).get('category') || 'ALL');
  const [search, setSearch] = useState(() => new URLSearchParams(window.location.search).get('q') || '');
  const [page, setPage] = useState(() => Math.max(1, Number(new URLSearchParams(window.location.search).get('page')) || 1));
  const listPosition = useRef(0);
  const originLink = useRef(null);
  const archive = useRef(null);
  const hasNavigated = useRef(false);
  const navigationIntent = useRef(null);
  const preview = posts.length > 0 && posts.every(post => post.preview);
  const selected = posts.find(post => String(post.id) === selectedId);

  useEffect(() => {
    document.getElementById('blog-index-jsonld')?.remove();
    if (selectedId) return undefined;
    const script = document.createElement('script');
    script.id = 'blog-index-jsonld'; script.type = 'application/ld+json'; script.textContent = JSON.stringify(journalIndexSchema());
    document.head.appendChild(script);
    return () => script.remove();
  }, [selectedId]);

  useEffect(() => {
    if (!preview) return undefined;
    const existing = document.querySelector('meta[name="robots"]');
    const previous = existing?.getAttribute('content');
    const meta = existing || document.createElement('meta');
    meta.name = 'robots'; meta.content = 'noindex, follow';
    if (!existing) document.head.appendChild(meta);
    return () => { if (existing) meta.setAttribute('content', previous || ''); else meta.remove(); };
  }, [preview]);

  useEffect(() => {
    if (!isFirebaseConfigured || !import.meta.env.VITE_ENABLE_REMOTE_JOURNAL) return undefined;
    let active = true;
    // The authored edition is immediately available. Existing remote-only
    // articles remain readable; no database writes happen from this page.
    getDocs(query(collection(db, 'articles'), orderBy('createdAt', 'desc'))).then(snapshot => {
      if (!active) return;
      const fetched = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      const localIds = new Set(BLOG_POSTS.map(post => String(post.id)));
      setPosts([...BLOG_POSTS, ...fetched.filter(post => !localIds.has(String(post.id)))]);
      setLoadFailed(false);
    }).catch(() => { if (active) setLoadFailed(true); })
      .finally(() => { if (active) { setLoading(false); setSyncPending(false); } });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const sync = () => { const params = new URLSearchParams(window.location.search); hasNavigated.current = true; setSelectedId(selectedFromURL()); setCategory(params.get('category') || 'ALL'); setSearch(params.get('q') || ''); setPage(Math.max(1, Number(params.get('page')) || 1)); };
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  useEffect(() => {
    if (loading) return undefined;
    const frame = requestAnimationFrame(() => {
      if (!selectedId && navigationIntent.current) { finishNavigation(navigationIntent.current); navigationIntent.current = null; return; }
      if (selectedId) { const target = /^#journal-heading-\d+$/.test(window.location.hash) && document.getElementById(window.location.hash.slice(1)); if (target) target.scrollIntoView({ behavior: 'instant' }); else window.scrollTo({ top: 0, behavior: 'instant' }); document.querySelector('.j-page-focus')?.focus({ preventScroll: true }); }
      else if (hasNavigated.current) {
        window.scrollTo({ top: listPosition.current, behavior: 'instant' });
        const scope = originLink.current?.footer ? document.querySelector('.j-blog-footer') : originLink.current?.archive ? document.querySelector('.j-archive') : document.querySelector('.j-feature');
        const original = [...(scope?.querySelectorAll('a') || [])].find(link => link.getAttribute('href') === originLink.current?.href);
        (original || document.getElementById('j-archive-title'))?.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [selectedId, selected?.id, loading]);

  const open = (event, id, anchor = event.currentTarget) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (!selectedId) { listPosition.current = window.scrollY; originLink.current = { href: anchor.getAttribute('href'), archive: Boolean(anchor.closest('.j-archive')), footer: Boolean(anchor.closest('.j-blog-footer')) }; }
    hasNavigated.current = true;
    window.history.pushState({ ...window.history.state, view: 'blog' }, '', articleHref(id));
    setSelectedId(String(id));
  };
  const back = event => {
    if (event?.metaKey || event?.ctrlKey || event?.shiftKey || event?.altKey) return;
    event?.preventDefault();
    hasNavigated.current = true;
    window.history.pushState({ ...window.history.state, view: 'blog' }, '', '/blog/#j-archive');
    setSelectedId(null);
  };
  const categories = [...new Set([...Object.keys(JOURNAL_CATEGORIES), ...posts.map(post => post.category || 'Journal')])];
  const filtered = posts.filter(post => (category === 'ALL' || (post.category || 'Journal') === category) && `${post.title || ''} ${post.excerpt || ''}`.toLocaleLowerCase('id').includes(search.trim().toLocaleLowerCase('id')));
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(1, pageCount));
  const pagePosts = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    if (selectedId) return;
    const url = new URL(window.location.href);
    for (const key of ['view', 'category', 'q', 'page', 'article', 'id']) url.searchParams.delete(key);
    url.pathname = '/blog/';
    if (category !== 'ALL') url.searchParams.set('category', category);
    if (search) url.searchParams.set('q', search);
    if (currentPage > 1) url.searchParams.set('page', currentPage);
    window.history.replaceState({ ...window.history.state, view: 'blog' }, '', url);
  }, [selectedId, category, search, currentPage]);
  const navigate = (event, target = 'home', topic = 'ALL') => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setCategory(topic); setSearch(''); setPage(1);
    window.history.pushState({ ...window.history.state, view: 'blog' }, '', `/blog/${topic !== 'ALL' ? `?category=${encodeURIComponent(topic)}` : ''}${target !== 'home' ? '#j-archive' : ''}`);
    if (selectedId) { navigationIntent.current = target; setSelectedId(null); }
    else requestAnimationFrame(() => finishNavigation(target));
  };

  return <><JournalNavbar categories={categories} category={category} isArticle={Boolean(selectedId)} navigate={navigate} /><main className="j-journal" aria-label="Kainora Journal" tabIndex={-1}>
    {selectedId ? loading ? <div className="j-state" role="status">Memuat artikel…</div> : selected ? <ArticleReader key={selected.id} post={selected} posts={posts} open={open} back={back} /> : <div className="j-state"><Overline>KAINORA JOURNAL</Overline><h1 className="j-page-focus" tabIndex={-1}>{syncPending ? 'Menghubungkan ke artikel…' : 'Artikel belum tersedia.'}</h1><p>{syncPending ? 'Sumber artikel masih dimuat. Anda dapat kembali menjelajahi journal.' : 'Tautan ini belum memiliki artikel yang bisa dibaca.'}</p><a className="f-button" href="/blog/" onClick={back}>KEMBALI KE JOURNAL <ArrowLeft size={18} /></a></div> : <>
      <SEO title="Kainora Journal — Parenting, Pakaian Anak & Ide Kegiatan" description="Baca panduan parenting, fashion anak, kesehatan, perawatan pakaian, belanja, karakter, dan kegiatan DIY di Kainora Journal." canonicalPath="/blog/" ogType="website" image="/images/journal/991.webp" imageAlt={BLOG_POSTS[0].imageAlt} />
      <header className="j-masthead"><div className="j-masthead-meta"><Overline>KAINORA KIDS / NOTES ON LITTLE LIFE</Overline><span className="f-cap">CERITA. GAYA. KESEHARIAN.</span></div><RevealLines lines={['THE JOURNAL.']} as="h1" className="j-masthead-title" /><div className="j-masthead-bottom"><p>Untuk hari-hari kecil<br />yang penuh cerita.</p><p>Ruang untuk inspirasi berpakaian, keseharian bersama anak, dan catatan dari dunia Kainora.</p><a href="#j-archive" className="j-browse">JELAJAHI ARTIKEL <ArrowDown size={19} /></a></div></header>
      {preview && <p className="j-demo-note">PRATINJAU EDITORIAL <span>{loadFailed ? 'Artikel belum dapat dimuat. Menampilkan konten contoh.' : 'Menampilkan artikel contoh. Konten resmi belum tersedia.'} Foto konsep sebagai ilustrasi.</span></p>}
      {loading ? <div className="j-state" role="status">Memuat journal…</div> : posts.length > 0 && <section className={`j-feature ${posts.length === 1 ? 'j-feature-single' : ''}`} aria-label="Sorotan journal"><StoryCard post={posts[0]} open={open} feature number={1} />{posts.length > 1 && <div className="j-feature-side"><Overline>MORE FROM THE JOURNAL</Overline><StoryCard post={posts[1]} open={open} number={2} />{posts[2] && <a className="j-numbered-story" href={articleHref(posts[2].id)} onClick={event => open(event, posts[2].id)}><span aria-hidden="true">03</span><div><PostMeta post={posts[2]} /><h2>{posts[2].title}</h2></div><ArrowUpRight size={22} /></a>}</div>}</section>}
      <section className="j-archive" id="j-archive" ref={archive} aria-labelledby="j-archive-title"><div className="j-section-label"><div><Overline>THE READING ROOM</Overline><h2 id="j-archive-title" tabIndex={-1}>Semua cerita.</h2></div><span className="f-cap">{String(posts.length).padStart(2, '0')} CATATAN / KAINORA</span></div>
        <div className="j-tools"><div className="j-search"><Search size={19} aria-hidden="true" /><label htmlFor="j-search" className="sr-only">Cari artikel</label><input id="j-search" type="search" placeholder="Cari cerita, topik, atau inspirasi" value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} />{search && <button aria-label="Hapus pencarian artikel" onClick={() => { setSearch(''); setPage(1); document.getElementById('j-search')?.focus(); }}><X size={17} /></button>}</div><div className="j-category-select"><label htmlFor="j-category">TOPIK</label><select id="j-category" value={category} onChange={event => { setCategory(event.target.value); setPage(1); }}><option value="ALL">Semua topik</option>{categories.map(item => <option key={item} value={item}>{topicName(item)}</option>)}</select></div></div>
        <div className="j-filter-summary"><p role="status">{loading ? 'Memuat artikel…' : `${filtered.length} artikel${search ? ` untuk “${search}”` : ''}${category !== 'ALL' ? ` / ${topicName(category)}` : ''}`}</p>{(search || category !== 'ALL') && <button onClick={() => { setSearch(''); setCategory('ALL'); setPage(1); }}>Reset filter <X size={13} /></button>}</div>
        {pagePosts.length > 0 ? <div className="j-grid">{pagePosts.map((post, index) => <StoryCard key={post.id} post={post} open={open} number={(currentPage - 1) * PAGE_SIZE + index + 1} />)}</div> : !loading && <div className="j-empty"><span aria-hidden="true">( 0 )</span><h3>Belum menemukan ceritanya.</h3><p>Coba kata kunci lain atau pilih semua topik.</p><button className="f-text-link" onClick={() => { setSearch(''); setCategory('ALL'); setPage(1); }}>LIHAT SEMUA ARTIKEL <ArrowRight size={17} /></button></div>}
        {pageCount > 1 && <nav className="j-pagination" aria-label="Halaman artikel"><button aria-label="Halaman artikel sebelumnya" disabled={currentPage === 1} onClick={() => { setPage(currentPage - 1); archive.current?.scrollIntoView({ behavior: 'instant' }); }}><ArrowLeft size={19} /></button><span>HALAMAN {currentPage} / {pageCount}</span><button aria-label="Halaman artikel berikutnya" disabled={currentPage === pageCount} onClick={() => { setPage(currentPage + 1); archive.current?.scrollIntoView({ behavior: 'instant' }); }}><ArrowRight size={19} /></button></nav>}
      </section><CollectionLink />
    </>}
  </main><JournalFooter categories={categories} posts={posts} navigate={navigate} open={open} /></>;
}
