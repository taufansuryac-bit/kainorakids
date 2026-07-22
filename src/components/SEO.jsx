/**
 * KAINORA KIDS - SEO COMPONENT
 * Update document head per-page untuk dynamic SEO
 * Supports: title, description, keywords, OG, Twitter, JSON-LD
 */

import { useEffect } from 'react';

const SITE_URL = 'https://kainorakids.com';
const SITE_NAME = 'Kainora Kids';
const DEFAULT_IMAGE = `${SITE_URL}/link-logo.jpg`;
const TWITTER_HANDLE = '@kainorakids';

export const SEO = ({
  title,
  description,
  keywords,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  schema,
  noindex = false,
  canonical
}) => {
  useEffect(() => {
    // Set document title
    const fullTitle = title
      ? `${title} | ${SITE_NAME}`
      : 'Kainora Kids — Toko Baju Anak Premium Katun Adem | Gratis Ongkir Jawa';

    if (title) {
      document.title = fullTitle;
    }

    // Helper to set or update meta tag
    const setMeta = (name, content, attr = 'name') => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper to set or update link tag
    const setLink = (rel, href) => {
      if (!href) return;
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // Core meta
    if (description) setMeta('description', description);
    if (keywords) setMeta('keywords', keywords);
    if (author) setMeta('author', author);

    // Robots
    if (noindex) {
      setMeta('robots', 'noindex, nofollow');
    }

    // Canonical
    const finalUrl = url || (typeof window !== 'undefined' ? window.location.href : SITE_URL);
    if (canonical || finalUrl) {
      setLink('canonical', canonical || finalUrl);
    }

    // Open Graph
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:image', image, 'property');
    setMeta('og:url', finalUrl, 'property');
    setMeta('og:type', type, 'property');
    setMeta('og:site_name', SITE_NAME, 'property');
    if (publishedTime) setMeta('article:published_time', publishedTime, 'property');
    if (modifiedTime) setMeta('article:modified_time', modifiedTime, 'property');
    if (section) setMeta('article:section', section, 'property');
    if (tags && tags.length > 0) {
      tags.forEach((tag, i) => {
        setMeta(`article:tag:${i}`, tag, 'property');
      });
    }

    // Twitter
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);
    setMeta('twitter:site', TWITTER_HANDLE);
    setMeta('twitter:creator', TWITTER_HANDLE);

    // JSON-LD Schema
    if (schema) {
      let scriptEl = document.getElementById('dynamic-schema');
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.type = 'application/ld+json';
        scriptEl.id = 'dynamic-schema';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(schema);
    }

    // Cleanup on unmount
    return () => {
      const scriptEl = document.getElementById('dynamic-schema');
      if (scriptEl && schema) scriptEl.remove();
    };
  }, [title, description, keywords, image, url, type, author, publishedTime, modifiedTime, section, tags, schema, noindex, canonical]);

  return null;
};

export default SEO;
