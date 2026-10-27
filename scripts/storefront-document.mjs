import { PRODUCT_SITE as SITE } from '../src/utils/productRoutes.js';
import { schemaJSON } from '../src/utils/productSeo.js';
import { productImageProps } from '../src/utils/productImages.js';
export const esc = value => String(value ?? '').replace(/[&<>\"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;' }[char]));

export const imageAttributes = (source, sizes) => Object.entries(productImageProps(source, sizes)).map(([key,value]) => `${key.toLowerCase()}="${esc(value)}"`).join(' ');

export function storeDocument(template, { title, description, path, image, imageSize, imageAlt, body, schema, header = '', footer = '', noindex = false, staticOnly = false }) {
  let html = template.replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<link\b[^>]*rel="canonical"[^>]*>/gi, '')
    .replace(/<link\b[^>]*hreflang="[^"]*"[^>]*>/gi, '')
    .replace(/<meta\b[^>]*(?:name|property)="(?:description|keywords|author|robots|googlebot|bingbot|yandex|og:[^"]*|twitter:[^"]*|article:[^"]*)"[^>]*>/gi, '')
    .replace(/<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, '');
  const tags = `<title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}"><link rel="canonical" href="${SITE}${path}"><meta property="og:type" content="website"><meta property="og:site_name" content="Kainora Kids"><meta property="og:locale" content="id_ID"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${SITE}${path}"><meta property="og:image" content="${SITE}${esc(image)}">${imageSize ? `<meta property="og:image:width" content="${imageSize[0]}"><meta property="og:image:height" content="${imageSize[1]}">` : ''}${imageAlt ? `<meta property="og:image:alt" content="${esc(imageAlt)}">` : ''}<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${SITE}${esc(image)}">${schema ? `<script id="commerce-jsonld" type="application/ld+json">${schemaJSON(schema)}</script>` : ''}`;
  html = html.replace('</head>', `${tags}</head>`);
  if (!html.includes('<div id="root"></div>')) throw new Error('Unexpected Vite root; refusing to write incomplete product HTML.');
  html = html.replace('<div id="root"></div>', `<div id="root"><div class="fashion-shell">${header}${body}${footer}</div></div>`);
  if (staticOnly) html = html.replace(/<script\b[^>]*type="module"[^>]*>[\s\S]*?<\/script>/gi, '');
  return html;
}
