import { productPriceLabel, catalogPriceLabel } from '../src/utils/pricing.js';
import { readFile, writeFile } from 'node:fs/promises';
import { storeDocument, esc } from './storefront-document.mjs';
import { productHref } from '../src/utils/productRoutes.js';
import { storeOrganization } from '../src/content/commercePolicies.js';
import { HOME_SEO } from '../src/content/storefrontSeo.js';

const template=await readFile('dist/index.html','utf8');
const content=JSON.parse(await readFile('src/content/store.json','utf8'));
const { title, description } = HOME_SEO;
const header='<header class="site-header"><nav class="site-nav" aria-label="Menu toko"><a class="nav-brand" href="/"><span class="nav-logo"><img src="/website-logo-hd.svg" alt="Kainora Kids" width="400" height="120"></span><span class="nav-brand-tagline">GRAPHIC TEE & FASHION ANAK</span></a><a href="/products/">KOLEKSI KAOS ↗</a></nav></header>';
const hero=`<section class="f-hero" aria-labelledby="fashion-hero-title"><div class="f-hero-image"><div class="f-hero-photo-motion"><div class="f-hero-photo-reveal"><div class="f-hero-slideshow"><img src="/images/kainora-owned/hero-camp-portrait-800.webp" srcset="/images/kainora-owned/hero-camp-portrait-480.webp 480w, /images/kainora-owned/hero-camp-portrait-800.webp 800w" sizes="(max-width:767px) 100vw, 54vw" alt="Dua anak memakai kaos grafis Kainora Kids di area piknik" width="800" height="1000" fetchpriority="high"></div></div></div><span class="f-photo-credit">KAINORA KIDS / GRAPHIC TEE ANAK</span></div><p class="f-cap f-hero-overline">KAINORA KIDS / FASHION ANAK</p><h1 class="f-title f-hero-title" id="fashion-hero-title"><span class="sr-only">${esc(HOME_SEO.headingLabel)}</span><span aria-hidden="true"><span class="f-line-mask"><span>GRAPHIC TEE.</span></span><span class="f-line-mask"><span>OVERSIZE.</span></span></span></h1><div class="f-hero-bottom"><div><p class="f-cap">KAOS ANAK / POTONGAN BOXY</p><p>${esc(HOME_SEO.introduction)}<br>Pilih motif dan ukuran yang sesuai untuk anak Anda.</p><a class="f-button" href="/products/">LIHAT KOLEKSI ↗</a></div></div></section>`;
const featured=content.highlights.map(id=>content.products.find(product=>String(product.id)===String(id))).filter(Boolean);
const products=`<section class="f-inset ks-guide" id="products"><h2>Koleksi kaos anak katun Kainora.</h2><p>${featured.length} motif pilihan, ukuran S–XXL. ${esc(catalogPriceLabel(featured))}.</p><ul>${featured.map(product=>`<li><a href="${productHref(product)}">${esc(product.name)}</a> — ${esc(productPriceLabel(product))}</li>`).join('')}</ul><a href="/products/">Lihat semua motif kaos anak</a><nav class="ks-buyer-guides"><a href="/panduan/ukuran-kaos-anak/">Panduan ukuran</a><a href="/panduan/perawatan-sablon/">Perawatan sablon</a><a href="/pengiriman/">Pengiriman J&T</a><a href="/retur/">Retur & penukaran</a></nav></section>`;
const schema=[storeOrganization(),{'@context':'https://schema.org','@type':'WebSite',name:'Kainora Kids',url:'https://kainorakids.com/',inLanguage:'id-ID'}];
const html=storeDocument(template,{title,description,path:'/',image:'/images/og/kainora-kids-share.jpg',imageSize:[1200,630],imageAlt:'Dua anak memakai kaos grafis Kainora Kids di depan tenda piknik',header,body:`<div id="main"><main class="f-home">${hero}${products}</main></div>`,schema});
await writeFile('dist/index.html',html.replace('<div id="root">','<div id="root" data-prerender="home">'));
console.log('Homepage: first hero, product links and buyer guides available in initial HTML.');
