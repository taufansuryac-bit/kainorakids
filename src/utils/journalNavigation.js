import { JOURNAL_CATEGORIES } from '../constants/blogPosts.js';
import { selectedArticle } from './journalRoutes.js';

export function journalTopics(posts) {
  const counts = new Map(Object.keys(JOURNAL_CATEGORIES).map(id => [id, 0]));
  for (const post of posts) {
    const id = post.category || 'Journal';
    counts.set(id, (counts.get(id) || 0) + 1);
  }
  return [...counts].map(([id, count]) => ({id, label: JOURNAL_CATEGORIES[id] || id, count}));
}

export function journalNavSection(location) {
  if (selectedArticle(location)) return 'article';
  if (location.hash === '#newsletter') return 'newsletter';
  const params = new URLSearchParams(location.search);
  if (params.get('category') && params.get('category') !== 'ALL') return 'topics';
  return location.hash === '#j-archive' || params.has('q') || params.has('page') ? 'archive' : 'home';
}
