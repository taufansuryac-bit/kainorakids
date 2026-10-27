export { articleHref } from './journalRoutes.js';

export function articleDate(post) {
  const value = post.dateModified || post.datePublished || post.date || post.createdAt;
  if (!value) return '';
  const date = value.toDate ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' });
}

export function articleISODate(post) {
  const value = post.dateModified || post.datePublished || post.createdAt || post.date;
  if (!value) return undefined;
  const date = value.toDate ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

const allowedTags = new Set(['P', 'BR', 'STRONG', 'B', 'EM', 'I', 'U', 'S', 'H2', 'H3', 'H4', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'A', 'IMG', 'FIGURE', 'FIGCAPTION', 'HR', 'PRE', 'CODE', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD', 'DIV', 'SPAN']);
const unsafeTags = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'SVG', 'MATH', 'FORM', 'INPUT', 'BUTTON', 'TEXTAREA', 'SELECT', 'TEMPLATE']);
const safeURL = value => /^(https?:\/\/|mailto:|tel:|\/(?!\/)|\?|#)/i.test(value || '');

// Preserve editorial rich text, stripping embedded scripts, styles and handlers.
export function prepareArticle(content = '') {
  const root = new DOMParser().parseFromString(String(content), 'text/html').body;
  for (const node of [...root.querySelectorAll('*')]) {
    if (unsafeTags.has(node.tagName)) { node.remove(); continue; }
    if (!allowedTags.has(node.tagName)) { node.replaceWith(...node.childNodes); continue; }
    const href = node.getAttribute('href');
    const src = node.getAttribute('src');
    const alt = node.getAttribute('alt') || '';
    for (const attribute of [...node.attributes]) node.removeAttribute(attribute.name);
    if (node.tagName === 'A' && safeURL(href)) { node.setAttribute('href', href); node.setAttribute('rel', 'noopener noreferrer'); }
    if (node.tagName === 'IMG') {
      if (!safeURL(src) || !/^(https?:\/\/|\/(?!\/))/i.test(src)) { node.remove(); continue; }
      node.setAttribute('src', src); node.setAttribute('alt', alt);
      node.setAttribute('loading', 'lazy'); node.setAttribute('decoding', 'async');
    }
  }
  const headings = [...root.querySelectorAll('h2,h3')].map((node, index) => {
    const id = `journal-heading-${index}`;
    node.id = id;
    return { id, text: node.textContent, level: node.tagName };
  }).filter(heading => heading.level === 'H2');
  const text = root.textContent.trim();
  return { html: root.innerHTML, headings, text, minutes: text ? Math.max(1, Math.ceil(text.split(/\s+/).length / 200)) : null };
}
