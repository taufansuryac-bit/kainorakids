import test from 'node:test';
import assert from 'node:assert/strict';
import { BLOG_POSTS } from '../src/constants/blogPosts.js';
import { journalFeed } from '../src/utils/journalFeed.js';
test('RSS includes the complete collection with stable canonical article identifiers', () => {
  const feed=journalFeed(BLOG_POSTS);
  assert.equal((feed.match(/<item>/g)||[]).length,BLOG_POSTS.length);
  assert.equal(new Set([...feed.matchAll(/<guid[^>]*>(.*?)<\/guid>/g)].map(match=>match[1])).size,BLOG_POSTS.length);
  assert.match(feed,/application\/rss\+xml/);
  assert.doesNotMatch(feed,/Invalid Date|undefined/);
});
test('RSS escapes editorial text, preserves publication dates and omits undated posts', () => {
  const first=BLOG_POSTS[0];
  const feed=journalFeed([{...first,title:'Ukuran <anak> & "kaos"',excerpt:'A & B',datePublished:'2026-10-01',dateModified:'2026-10-30'},{...BLOG_POSTS[1],datePublished:null,dateModified:null}]);
  assert.match(feed,/Ukuran &lt;anak&gt; &amp; &quot;kaos&quot;/);
  assert.match(feed,/<description>A &amp; B<\/description>/);
  assert.match(feed,/<pubDate>Thu, 01 Oct 2026 00:00:00 GMT<\/pubDate>/);
  assert.equal((feed.match(/<item>/g)||[]).length,1);
});
