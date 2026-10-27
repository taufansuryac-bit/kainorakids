import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, Search, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { articleHref } from '../../utils/journal';
import { topicName } from '../../constants/blogPosts';



export function JournalNavbar({ categories, category, isArticle, navigate }) {
  const { setView } = useStore();
  const [menu, setMenu] = useState(false);
  const [topics, setTopics] = useState(false);
  const root = useRef(null);
  const menuButton = useRef(null);
  const topicButton = useRef(null);
  useEffect(() => {
    if (!menu && !topics) return undefined;
    const pointer = event => { if (!root.current?.contains(event.target)) { setMenu(false); setTopics(false); } };
    const key = event => { if (event.key === 'Escape') { (menu ? menuButton : topicButton).current?.focus(); setMenu(false); setTopics(false); } };
    document.addEventListener('pointerdown', pointer); document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', pointer); document.removeEventListener('keydown', key); };
  }, [menu, topics]);
  const go = (event, target, topic) => { setMenu(false); setTopics(false); navigate(event, target, topic); };
  const store = event => { if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); setView('home'); };
  return <header className="j-blog-header" ref={root}>
    <div className="j-blog-header-inner">
      <a className="j-blog-brand" href="/blog/" onClick={event => go(event, 'home')} aria-label="Beranda Kainora Journal"><img src="/website-logo.png" alt="Kainora Kids" /><span>THE JOURNAL</span></a>
      <nav className="j-blog-desktop" aria-label="Menu utama blog">
        <a href="/blog/" onClick={event => go(event, 'home')} aria-current={!isArticle && category === 'ALL' ? 'page' : undefined}>Beranda blog</a>
        <a href="/blog/#j-archive" onClick={event => go(event, 'archive')}>Semua artikel</a>
        <div className="j-topics-root"><button ref={topicButton} aria-expanded={topics} aria-controls="j-desktop-topics" onClick={() => setTopics(!topics)}>Topik <ChevronDown size={13} /></button>{topics && <div id="j-desktop-topics" className="j-topic-dropdown">{categories.map(topic => <a key={topic} href={`/blog/?category=${encodeURIComponent(topic)}#j-archive`} onClick={event => go(event, 'archive', topic)}>{topicName(topic)} <ArrowUpRight size={14} /></a>)}</div>}</div>
      </nav>
      <div className="j-blog-actions"><button className="j-blog-search-button" aria-label="Cari artikel di blog" onClick={event => go(event, 'search')}><Search size={20} /></button><a href="/" className="j-blog-store" onClick={store}>TOKO KAINORA <ArrowUpRight size={16} /></a><button className="j-blog-menu-button" ref={menuButton} aria-label={menu ? 'Tutup menu blog' : 'Buka menu blog'} aria-expanded={menu} aria-controls="j-mobile-menu" onClick={() => setMenu(!menu)}>{menu ? <X size={22} /> : <Menu size={22} />}</button></div>
    </div>
    {menu && <nav id="j-mobile-menu" className="j-blog-mobile" aria-label="Menu blog mobile"><a href="/blog/" onClick={event => go(event, 'home')}>Beranda blog <ArrowUpRight size={19} /></a><a href="/blog/#j-archive" onClick={event => go(event, 'archive')}>Semua artikel <ArrowUpRight size={19} /></a><p>JELAJAHI TOPIK</p>{categories.map(topic => <a key={topic} href={`/blog/?category=${encodeURIComponent(topic)}#j-archive`} onClick={event => go(event, 'archive', topic)}>{topicName(topic)} <ArrowRight size={16} /></a>)}<a href="/" className="j-blog-mobile-store" onClick={store}>Kembali ke toko <ArrowUpRight size={19} /></a></nav>}
  </header>;
}

export function JournalFooter({ posts, categories, navigate, open }) {
  const { setView } = useStore();
  return <footer className="j-blog-footer" aria-label="Footer Kainora Journal"><div className="j-blog-footer-top"><div className="j-blog-footer-intro"><a href="/blog/" onClick={event => navigate(event, 'home')} aria-label="Beranda Kainora Journal"><img src="/website-logo.png" alt="Kainora Kids" /></a><p className="f-cap">THE JOURNAL / KAINORA KIDS</p><h2>Cerita kecil.<br />Banyak artinya.</h2><p>Catatan tentang pakaian, keseharian, dan pilihan kecil bersama anak.</p></div><nav className="j-blog-footer-topics" aria-label="Topik artikel blog"><p className="f-cap">RUANG BACA</p><a href="/blog/#j-archive" onClick={event => navigate(event, 'archive')}>Semua artikel <ArrowUpRight size={14} /></a>{categories.map(topic => <a key={topic} href={`/blog/?category=${encodeURIComponent(topic)}#j-archive`} onClick={event => navigate(event, 'archive', topic)}>{topicName(topic)} <ArrowUpRight size={14} /></a>)}</nav><nav className="j-blog-footer-recent" aria-label="Artikel dari journal"><p className="f-cap">DARI JOURNAL</p>{posts.slice(0, 3).map((post, index) => <a href={articleHref(post.id)} key={post.id} onClick={event => open(event, post.id)}><span>{String(index + 1).padStart(2, '0')}</span><span>{post.title}</span><ArrowUpRight size={17} /></a>)}</nav></div><div className="j-blog-footer-bottom"><span>© {new Date().getFullYear()} KAINORA KIDS / JOURNAL</span><a href="/" onClick={event => { if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); setView('home'); }}>KEMBALI KE TOKO <ArrowUpRight size={15} /></a><button onClick={() => { window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); document.querySelector('.j-blog-brand')?.focus({ preventScroll: true }); }}>KE ATAS ↑</button></div></footer>;
}
