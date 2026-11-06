import test from 'node:test';
import assert from 'node:assert/strict';
import { journalTopics, journalNavSection } from '../src/utils/journalNavigation.js';
import { BLOG_POSTS } from '../src/constants/blogPosts.js';

test('topic counts use the entire article collection, including remote-only and uncategorised articles', () => {
  const topics = journalTopics([{category:'FASHION'},{category:'FASHION'},{category:'PARENTING'},{category:'CUSTOM'},{}]);
  assert.equal(topics.find(item=>item.id==='FASHION').count,2);
  assert.equal(topics.find(item=>item.id==='CUSTOM').count,1);
  assert.equal(topics.find(item=>item.id==='Journal').count,1);
  assert.equal(topics.reduce((sum,item)=>sum+item.count,0),5);
  assert.equal(journalTopics(BLOG_POSTS).reduce((sum,item)=>sum+item.count,0),BLOG_POSTS.length);
});

test('home, archive and selected topic have distinct active navigation states, including direct links', () => {
  const section = path => journalNavSection(new URL(path,'https://kainorakids.com'));
  assert.equal(section('/blog/'),'home');
  assert.equal(section('/blog/#j-archive'),'archive');
  assert.equal(section('/blog/?q=katun'),'archive');
  assert.equal(section('/blog/?page=2'),'archive');
  assert.equal(section('/blog/#newsletter'),'newsletter');
  assert.equal(section('/blog/?category=FASHION#j-archive'),'topics');
  assert.equal(section('/blog/baju-oversize-anak/'),'article');
});
