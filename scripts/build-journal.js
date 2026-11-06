import { readFile, writeFile, mkdir, stat, readdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { BLOG_POSTS, topicName } from '../src/constants/blogPosts.js';
import { articleHref, journalRelated, journalSchema, journalIndexSchema, journalTitle, JOURNAL_SITE_URL as SITE } from '../src/utils/journalRoutes.js';
import { journalTopics } from '../src/utils/journalNavigation.js';
import { journalFeed } from '../src/utils/journalFeed.js';
import { journalShopLinks } from '../src/utils/journalShop.js';

const { products } = JSON.parse(await readFile('src/content/store.json', 'utf8'));

const output = resolve('dist');
const template = await readFile(join(output, 'index.html'), 'utf8');
const journalStyles = (await readdir(join(output, 'assets'))).filter(name => /^BlogView-.*\.css$/.test(name));
if (journalStyles.length !== 1) throw new Error('Journal stylesheet missing or ambiguous.');
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
const date = post => new Date(post.dateModified).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' });
const topicData = journalTopics(BLOG_POSTS);
const topics = topicData.map(topic => `<a href="/blog/?category=${encodeURIComponent(topic.id)}#j-archive"><span>${esc(topic.label)}</span><span class="j-topic-count" aria-label="${topic.count} artikel">${topic.count}</span></a>`).join('');
const navbar = active => `<header class="j-blog-header j-nav-modern"><div class="j-blog-header-inner"><a class="j-blog-brand" href="/blog/"><img src="/website-logo.png" alt="Kainora Kids"><span>ARTIKEL KAINORA</span></a><nav class="j-blog-desktop" aria-label="Menu utama blog"><a class="j-nav-item" href="/blog/"${active ? ' aria-current="page"' : ''}><span>Beranda blog</span></a><a class="j-nav-item" href="/blog/#j-archive"><span>Semua artikel</span></a><details class="j-topics-root"><summary class="j-nav-item j-topics-toggle">Topik ▾</summary><div class="j-topic-dropdown"><div class="j-topic-dropdown-heading"><span>KATEGORI ARTIKEL</span><small>${BLOG_POSTS.length} artikel</small></div>${topics}</div></details><a class="j-nav-item" href="/blog/#newsletter"><span>Newsletter</span></a></nav><div class="j-blog-actions"><a class="j-blog-store" href="/" aria-label="Toko Kainora"><span>Toko Kainora</span><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg></a></div></div></header>`;
const categoryPanel = `<aside class="j-category-panel" aria-labelledby="j-category-panel-title"><div class="j-category-panel-heading"><div><span>KAINORA KIDS</span><h2 id="j-category-panel-title">Kategori artikel</h2></div></div><nav aria-label="Kategori artikel"><a href="/blog/#j-archive"><span>Semua artikel</span><span class="j-topic-count">${BLOG_POSTS.length}</span></a>${topics}</nav></aside>`;
const newsletter = `<section class="j-newsletter" id="newsletter" aria-labelledby="j-newsletter-title"><div class="j-newsletter-intro"><span class="j-newsletter-eyebrow">NEWSLETTER KAINORA</span><h2 id="j-newsletter-title">Artikel terbaru,<br><span>langsung ke email.</span></h2><p>Terima artikel tentang fashion anak, panduan ukuran, dan perawatan pakaian dari Kainora Kids.</p></div><div class="j-newsletter-content"><p>Formulir pendaftaran memerlukan JavaScript dan layanan email yang aktif.</p><a href="/blog/feed.xml">Baca feed artikel (RSS) ↗</a></div></section>`;
const footer = `<footer class="j-blog-footer"><div class="j-blog-footer-top"><div class="j-blog-footer-intro"><a href="/blog/"><img src="/website-logo.png" alt="Kainora Kids"></a><h2>Panduan fashion<br>anak</h2><p>Tips memilih ukuran, merawat kaos grafis, dan memadukan pakaian anak.</p></div><nav class="j-blog-footer-topics" aria-label="Topik artikel blog"><p>TOPIK ARTIKEL</p>${topics}</nav><nav class="j-blog-footer-recent" aria-label="Artikel dari journal">${BLOG_POSTS.slice(0, 3).map(post => `<a href="${articleHref(post.id)}">${esc(post.title)}</a>`).join('')}</nav></div><div class="j-blog-footer-bottom"><span>© 2026 KAINORA KIDS / JOURNAL</span><a href="/">KEMBALI KE TOKO ↗</a></div></footer>`;
const photo = (post, eager = false) => `<figure class="j-photo"><img src="${esc(post.img)}" alt="${esc(post.imageAlt)}" width="1536" height="1024" style="object-position:50% 50%" loading="${eager ? 'eager' : 'lazy'}" decoding="async"><figcaption>${esc(post.imageCaption)}</figcaption></figure>`;
const meta = post => `<p class="j-meta"><span>${esc(topicName(post.category))}</span><time datetime="${esc(post.dateModified)}">Diperbarui ${date(post)}</time></p>`;
const shopBlock = post => { const links = journalShopLinks(post, products); return `<section class="j-shop" aria-labelledby="j-shop-title"><h2 id="j-shop-title">Dari koleksi Kainora</h2><ul class="j-shop-products">${links.products.map(item => `<li><a href="${esc(item.href)}"><img src="${esc(item.image)}" alt="${esc(item.alt)}" width="64" height="64" loading="lazy" decoding="async"><span>${esc(item.name)}</span></a></li>`).join('')}</ul><p class="j-shop-guides">${links.guides.map(guide => `<a href="${esc(guide.href)}">${esc(guide.label)} →</a>`).join('')}<a href="/products/">Semua motif kaos anak →</a></p></section>`; };
const card = post => `<article class="j-story"><a class="j-story-link" href="${articleHref(post.id)}"><div class="j-story-visual">${photo(post)}</div><div class="j-story-copy">${meta(post)}<h2>${esc(post.title)}</h2><p class="j-excerpt">${esc(post.excerpt)}</p><span class="j-story-end">Baca artikel →</span></div></a></article>`;

function documentHTML({ title, description, path, image, imageAlt, body, schema, keywords, modified }) {
  const canonical = `${SITE}${path}`;
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<link\b[^>]*rel="canonical"[^>]*>/gi, '')
    .replace(/<link\b[^>]*hreflang="[^"]*"[^>]*>/gi, '')
    .replace(/<meta\b[^>]*(?:name|property)="(?:description|keywords|author|robots|googlebot|bingbot|yandex|og:[^"]*|twitter:[^"]*|article:[^"]*)"[^>]*>/gi, '')
    .replace(/<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, '');
  const tags = `<link rel="stylesheet" href="/assets/${journalStyles[0]}">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="keywords" content="${esc(keywords || 'Kainora Journal, parenting, pakaian anak')}">
<meta name="author" content="Kainora Journal">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${canonical}">
<link rel="alternate" type="application/rss+xml" title="Artikel Kainora Kids" href="${SITE}/blog/feed.xml">
<meta property="og:type" content="${modified ? 'article' : 'website'}">
<meta property="og:locale" content="id_ID"><meta property="og:site_name" content="Kainora Journal">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}"><meta property="og:image" content="${SITE}${image}">
<meta property="og:image:secure_url" content="${SITE}${image}"><meta property="og:image:width" content="1536"><meta property="og:image:height" content="1024">
<meta property="og:image:type" content="image/webp"><meta property="og:image:alt" content="${esc(imageAlt)}">
${modified ? `<meta property="article:modified_time" content="${esc(modified)}">` : ''}
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${SITE}${image}"><meta name="twitter:image:alt" content="${esc(imageAlt)}">
<script type="application/ld+json" id="${modified ? 'blog-article-jsonld' : 'blog-index-jsonld'}">${json(schema)}</script>`;
  html = html.replace('</head>', `${tags}\n</head>`);
  if (!html.includes('<div id="root"></div>')) throw new Error('Vite root template changed; cannot safely prerender journal.');
  return html.replace('<div id="root"></div>', `<div id="root">${navbar(!modified)}<main class="j-journal">${body}${newsletter}</main>${footer}</div>`);
}

// Fail the build when editorial links or assets drift. Only trusted, authored
// source is rendered here; Firestore rich text stays behind the browser sanitizer.
for (const key of ['id', 'title', 'slug', 'focusKeyword']) {
  if (new Set(BLOG_POSTS.map(post => post[key])).size !== BLOG_POSTS.length) throw new Error(`Duplicate journal ${key}`);
}
const paths = new Set(BLOG_POSTS.map(post => articleHref(post.id)));
const review = JSON.parse(await readFile('docs/journal-assets/manifest.json', 'utf8'));
for (const post of BLOG_POSTS) {
  await stat(resolve('public', `.${post.img}`));
  if (!post.imageAlt || !post.metaDescription || !post.content) throw new Error(`Incomplete article ${post.id}`);
  for (const match of post.content.matchAll(/href="(\/blog\/[^"?#]+)"/g)) if (!paths.has(match[1])) throw new Error(`Broken article link ${post.id}: ${match[1]}`);
  for (const id of post.related) if (!BLOG_POSTS.some(item => item.id === id)) throw new Error(`Missing related article ${id}`);
  const asset = review.find(item => String(item.articleId ?? item.id) === String(post.id));
  if (!asset || asset.facesVisible !== false || asset.review !== 'ACCEPTED: visually inspected; no human face visible') throw new Error(`Cover not approved ${post.id}`);
  let index = 0;
  const headings = [];
  const content = post.content.replace(/<(h2|h3)>([\s\S]*?)<\/\1>/g, (_, tag, text) => {
    const id = `journal-heading-${index++}`;
    if (tag === 'h2') headings.push({ id, text });
    return `<${tag} id="${id}">${text}</${tag}>`;
  });
  const references = post.sources.length ? `<section class="j-sources"><h2>Rujukan bacaan</h2><ul>${post.sources.map(source => `<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)}</a></li>`).join('')}</ul><p>Rujukan mendukung bagian faktual yang relevan. Contoh kegiatan dan padupadan merupakan panduan editorial Kainora Journal.</p></section>` : '';
  const related = journalRelated(post, BLOG_POSTS);
  const minutes = Math.max(1, Math.ceil(post.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length / 200));
  const body = `<article class="j-article"><nav class="j-article-nav" aria-label="Navigasi artikel"><a href="/blog/#j-archive">← Kembali ke journal</a><span>KAINORA / JOURNAL</span></nav><header class="j-article-header">${meta(post)}<h1>${esc(post.title)}</h1><p class="j-article-deck">${esc(post.excerpt)}</p><div class="j-article-byline"><span>KAINORA JOURNAL</span><span>± ${minutes} menit baca</span></div></header><div class="j-article-cover">${photo(post, true)}</div><div class="j-reading-layout"><div class="j-reading-aside"><p>DAFTAR ISI ARTIKEL</p><nav aria-label="Daftar isi artikel">${headings.map(heading => `<a href="#${heading.id}">${heading.text}</a>`).join('')}</nav></div><div class="j-reading-body"><div class="j-prose">${content}</div>${references}${shopBlock(post)}<div class="j-article-signoff"><span>ARTIKEL KAINORA KIDS</span><a href="/blog/#j-archive">← Semua artikel</a></div></div></div></article><section class="j-related"><div class="j-section-label"><h2>Artikel lainnya</h2></div><div class="j-grid">${related.map(card).join('')}</div></section>`;
  const html = documentHTML({ title: journalTitle(post), description: post.metaDescription, path: articleHref(post.id), image: post.img, imageAlt: post.imageAlt, keywords: post.focusKeyword, modified: post.dateModified, body, schema: journalSchema(post) });
  const folder = join(output, 'blog', post.slug);
  await mkdir(folder, { recursive: true });
  await writeFile(join(folder, 'index.html'), html);
}

await mkdir(join(output, 'blog'), { recursive: true });
await writeFile(join(output, 'blog', 'feed.xml'), journalFeed(BLOG_POSTS));
await writeFile(join(output, 'blog', 'index.html'), documentHTML({
  title: 'Kainora Journal — Parenting, Pakaian Anak & Ide Kegiatan',
  description: 'Baca panduan parenting, fashion anak, kesehatan, perawatan pakaian, belanja, karakter, dan kegiatan DIY di Kainora Journal.',
  path: '/blog/', image: BLOG_POSTS[0].img, imageAlt: BLOG_POSTS[0].imageAlt,
  body: `<header class="j-masthead"><h1 class="j-masthead-title">ARTIKEL KAINORA.</h1><p>Panduan pakaian, ukuran, perawatan, dan gaya anak.</p></header><section class="j-feature" aria-label="Sorotan journal">${card(BLOG_POSTS[0])}<div class="j-feature-side">${categoryPanel}<p class="f-cap">ARTIKEL PILIHAN</p>${card(BLOG_POSTS[1])}</div></section><section class="j-archive" id="j-archive"><div class="j-section-label"><h2>Semua artikel</h2><span>${BLOG_POSTS.length} ARTIKEL</span></div><nav class="j-static-topics" aria-label="Topik blog">${topics}</nav><div class="j-grid">${BLOG_POSTS.map(card).join('')}</div></section>`,
  schema: journalIndexSchema(),
}));

const day = iso => String(iso).slice(0, 10);
const latest = BLOG_POSTS.map(post => day(post.dateModified)).sort().at(-1);
const entries = [`<url><loc>${SITE}/blog/</loc><lastmod>${latest}</lastmod></url>`, ...BLOG_POSTS.map(post => `<url><loc>${SITE}${articleHref(post.id)}</loc><lastmod>${day(post.dateModified)}</lastmod></url>`)].join('\n');
await writeFile(join(output, 'sitemap-journal.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`);
// Retain existing store URLs while replacing the old blog query alias.
const sitemapPath = join(output, 'sitemap.xml');
let sitemap = await readFile(sitemapPath, 'utf8');
sitemap = sitemap.replace(/<url>\s*<loc>https:\/\/kainorakids\.com\/\?view=blog<\/loc>[\s\S]*?<\/url>/g, '').replace('</urlset>', `${entries}\n</urlset>`);
await writeFile(sitemapPath, sitemap);
console.log(`Journal: ${BLOG_POSTS.length} article HTML pages + index; 72 canonical URLs in sitemap-journal.xml.`);
