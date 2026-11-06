import { topicName } from '../constants/blogPosts.js';
import { articleHref, JOURNAL_SITE_URL } from './journalRoutes.js';

const xml = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[character]));
// Prefer publication dates so an edit does not announce an old article as new.
const published = post => post.datePublished || post.dateModified;
export function journalFeed(posts) {
  const dated = posts.filter(post => published(post) && Number.isFinite(Date.parse(published(post))))
    .sort((a,b) => Date.parse(published(b)) - Date.parse(published(a)));
  const items = dated.map(post => {
    const link = new URL(articleHref(post.id), JOURNAL_SITE_URL).href;
    return `<item><title>${xml(post.title)}</title><link>${xml(link)}</link><guid isPermaLink="true">${xml(link)}</guid><description>${xml(post.excerpt || post.metaDescription)}</description><category>${xml(topicName(post.category))}</category><pubDate>${new Date(published(post)).toUTCString()}</pubDate>${post.img ? `<media:content url="${xml(new URL(post.img,JOURNAL_SITE_URL).href)}" medium="image"/>` : ''}</item>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/"><channel><title>Artikel Kainora Kids</title><link>${JOURNAL_SITE_URL}/blog/</link><description>Panduan fashion anak, ukuran, dan perawatan pakaian dari Kainora Kids.</description><language>id-ID</language><atom:link href="${JOURNAL_SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
}
