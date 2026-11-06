import { useEffect, useRef, useState } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, ChevronDown, Menu, Search, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import './journal-navigation.css';

export function JournalNavbar({ topics, total, category, activeSection, navigate }) {
  const { setView } = useStore();
  const [menu, setMenu] = useState(false);
  const [topicsOpen, setTopicsOpen] = useState(false);
  const root = useRef(null), menuButton = useRef(null), topicButton = useRef(null);
  useEffect(() => {
    if (!menu && !topicsOpen) return undefined;
    const pointer = event => { if (!root.current?.contains(event.target)) {setMenu(false); setTopicsOpen(false);} };
    const key = event => {
      if (event.key === 'Escape') {
        // Close after moving focus: focusing the topic button can open its panel.
        (menu ? menuButton : topicButton).current?.focus();
        setMenu(false); setTopicsOpen(false);
      }
    };
    document.addEventListener('pointerdown', pointer);
    document.addEventListener('keydown', key);
    return () => {document.removeEventListener('pointerdown', pointer); document.removeEventListener('keydown', key);};
  }, [menu, topicsOpen]);
  const go = (event, target, topic) => {setMenu(false); setTopicsOpen(false); navigate(event, target, topic);};
  const current = section => activeSection === section ? 'page' : undefined;
  return <header className="j-blog-header j-nav-modern" ref={root}>
    <div className="j-blog-header-inner">
      <a className="j-blog-brand" href="/blog/" onClick={event => go(event, 'home')} aria-label="Beranda artikel Kainora Kids"><img src="/website-logo.png" alt="Kainora Kids"/><span>ARTIKEL KAINORA</span></a>
      <nav className="j-blog-desktop" aria-label="Menu utama blog">
        <a className="j-nav-item" href="/blog/" onClick={event => go(event, 'home')} aria-current={current('home')}><span>Beranda blog</span></a>
        <a className="j-nav-item" href="/blog/#j-archive" onClick={event => go(event, 'archive')} aria-current={current('archive')}><span>Semua artikel</span></a>
        <div className="j-topics-root" onPointerEnter={event => {if (event.pointerType === 'mouse') setTopicsOpen(true);}} onPointerLeave={event => {if (event.pointerType === 'mouse') setTopicsOpen(false);}} onBlur={event => {if (!event.currentTarget.contains(event.relatedTarget)) setTopicsOpen(false);}}>
          <button type="button" className="j-nav-item j-topics-toggle" ref={topicButton} aria-current={current('topics')} aria-expanded={topicsOpen} aria-controls="j-desktop-topics" onFocus={() => setTopicsOpen(true)} onClick={() => setTopicsOpen(true)} onKeyDown={event => {if (event.key === 'ArrowDown') {event.preventDefault(); setTopicsOpen(true); requestAnimationFrame(() => root.current?.querySelector('#j-desktop-topics a')?.focus());}}}><span>Topik</span><ChevronDown size={13}/></button>
          {topicsOpen && <div id="j-desktop-topics" className="j-topic-dropdown"><div className="j-topic-dropdown-heading"><span>KATEGORI ARTIKEL</span><small>{total} artikel</small></div>{topics.map(topic => <a key={topic.id} href={`/blog/?category=${encodeURIComponent(topic.id)}#j-archive`} aria-current={category === topic.id ? 'page' : undefined} onClick={event => go(event, 'archive', topic.id)}><span>{topic.label}</span><span className="j-topic-count" aria-label={`${topic.count} artikel`}>{topic.count}</span></a>)}</div>}
        </div>
        <a className="j-nav-item" href="/blog/#newsletter" onClick={event => go(event, 'newsletter')} aria-current={current('newsletter')}><span>Newsletter</span></a>
      </nav>
      <div className="j-blog-actions"><button type="button" className="j-blog-search-button" aria-label="Cari artikel di blog" onClick={event => go(event, 'search')}><Search size={19}/></button><a href="/" className="j-blog-store" aria-label="Toko Kainora" onClick={event => {if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); setView('home');}}><span>Toko Kainora</span><ArrowUpRight size={17}/></a><button type="button" className="j-blog-menu-button" ref={menuButton} aria-label={menu ? 'Tutup menu blog' : 'Buka menu blog'} aria-expanded={menu} aria-controls="j-mobile-menu" onClick={() => setMenu(value => !value)}>{menu ? <X size={21}/> : <Menu size={21}/>}</button></div>
    </div>
    {menu && <nav id="j-mobile-menu" className="j-blog-mobile" aria-label="Menu blog mobile"><a href="/blog/" aria-current={current('home')} onClick={event => go(event, 'home')}>Beranda blog <ArrowUpRight size={18}/></a><a href="/blog/#j-archive" aria-current={current('archive')} onClick={event => go(event, 'archive')}>Semua artikel <span className="j-topic-count">{total}</span></a><p>KATEGORI ARTIKEL</p>{topics.map(topic => <a key={topic.id} href={`/blog/?category=${encodeURIComponent(topic.id)}#j-archive`} aria-current={category === topic.id ? 'page' : undefined} onClick={event => go(event, 'archive', topic.id)}><span>{topic.label}</span><span className="j-topic-count" aria-label={`${topic.count} artikel`}>{topic.count}</span></a>)}<a href="/blog/#newsletter" aria-current={current('newsletter')} onClick={event => go(event, 'newsletter')}>Berlangganan artikel <ArrowRight size={18}/></a><a href="/" className="j-blog-mobile-store" onClick={event => {if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); setView('home');}}>Kembali ke toko <ArrowUpRight size={18}/></a></nav>}
  </header>;
}

export function JournalCategories({ topics, total, category, navigate }) {
  return <aside className="j-category-panel" aria-labelledby="j-category-panel-title">
    <div className="j-category-panel-heading"><div><span>KAINORA KIDS</span><h2 id="j-category-panel-title">Kategori artikel</h2></div><ArrowDownRight size={26} aria-hidden="true"/></div>
    <nav aria-label="Kategori artikel"><a href="/blog/#j-archive" aria-current={category === 'ALL' ? 'page' : undefined} onClick={event => navigate(event, 'archive')}><span>Semua artikel</span><span className="j-topic-count" aria-label={`${total} artikel`}>{total}</span><ArrowUpRight size={16} aria-hidden="true"/></a>{topics.map(topic => <a key={topic.id} href={`/blog/?category=${encodeURIComponent(topic.id)}#j-archive`} aria-current={category === topic.id ? 'page' : undefined} onClick={event => navigate(event, 'archive', topic.id)}><span>{topic.label}</span><span className="j-topic-count" aria-label={`${topic.count} artikel`}>{topic.count}</span><ArrowUpRight size={16} aria-hidden="true"/></a>)}</nav>
  </aside>;
}
