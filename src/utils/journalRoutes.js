import { BLOG_POSTS, topicName } from '../constants/blogPosts.js';

export const JOURNAL_SITE_URL = 'https://kainorakids.com';
// Keep the brand suffix only while the title still fits ~60 characters.
export const journalTitle = post => {
  const base = post.seoTitle || post.title;
  return [`${base} | Kainora Journal`, `${base} | Kainora`].find(title => title.length <= 60) || base;
};
// "Cerita berikutnya": the editor's first picks plus the next article in the same topic,
// so every article is linked from its predecessor (authored picks alone left 7 of 71
// articles without a single related link). Shared by BlogView and build-journal.js.
export function journalRelated(post, posts, count = 3) {
  const same = posts.filter(item => item.category === post.category);
  const position = same.findIndex(item => String(item.id) === String(post.id));
  const next = same.length > 1 ? same[(position + 1) % same.length] : null;
  const authored = (post.related || []).map(id => posts.find(item => String(item.id) === String(id))).filter(Boolean);
  const picks = [];
  for (const item of [...authored.slice(0, count - 1), next, ...authored.slice(count - 1), ...same]) {
    if (item && String(item.id) !== String(post.id) && !picks.includes(item)) picks.push(item);
  }
  return picks.slice(0, count);
}
export const articleHref = id => {
  const post = BLOG_POSTS.find(item => String(item.id) === String(id));
  return post ? `/blog/${post.slug}/` : `/?view=blog&article=${encodeURIComponent(id)}`;
};
export const selectedArticle = location => {
  const params = new URLSearchParams(location.search);
  const legacy = params.get('article') || params.get('id');
  if (legacy) return legacy;
  const slug = location.pathname.match(/^\/blog\/([^/]+)\/?$/)?.[1];
  if (!slug) return null;
  let decoded;
  try { decoded = decodeURIComponent(slug); } catch { return 'missing:invalid-url'; }
  return String(BLOG_POSTS.find(post => post.slug === decoded)?.id || `missing:${slug}`);
};
export const journalIndexSchema = () => ({
  '@context': 'https://schema.org', '@type': 'Blog', name: 'Kainora Journal',
  url: `${JOURNAL_SITE_URL}/blog/`, inLanguage: 'id-ID',
  blogPost: BLOG_POSTS.map(post => ({ '@type': 'BlogPosting', headline: post.title, url: `${JOURNAL_SITE_URL}${articleHref(post.id)}` })),
});
export const journalSchema = post => ({
  '@context': 'https://schema.org', '@type': 'BlogPosting',
  headline: post.title, description: post.metaDescription || post.excerpt,
  image: new URL(post.img || '/website-logo.png', JOURNAL_SITE_URL).href,
  author: { '@type': 'Organization', name: post.author || 'Kainora Journal', url: `${JOURNAL_SITE_URL}/blog/` },
  publisher: { '@type': 'Organization', name: 'Kainora Kids', logo: { '@type': 'ImageObject', url: `${JOURNAL_SITE_URL}/website-logo.png` } },
  inLanguage: 'id-ID', articleSection: topicName(post.category), keywords: post.tags,
  ...(post.datePublished ? { datePublished: post.datePublished } : {}),
  ...(post.dateModified ? { dateModified: post.dateModified } : {}),
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${JOURNAL_SITE_URL}${articleHref(post.id)}` },
});
