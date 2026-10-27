import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { BUYER_GUIDES } from '../src/content/buyerGuides.js';
import { SIZE_CHART } from '../src/content/sizeChart.js';
import { storeOrganization } from '../src/content/commercePolicies.js';
import { storeDocument, esc } from './storefront-document.mjs';
import {SIZE_CATEGORIES,SIZE_SOURCES,SIZE_STUDIO} from '../src/content/sizeStudio.js';

const template=await readFile('dist/index.html','utf8'), site='https://kainorakids.com';
const links=BUYER_GUIDES.map(guide=>`<a href="${guide.path}">${esc(guide.heading)}</a>`).join('');
const header='<header class="site-header"><nav class="site-nav"><a href="/" class="nav-brand"><span class="nav-logo"><img src="/website-logo.png" alt="Kainora Kids" width="400" height="120"></span><span>LITTLE FITS. BIG DAYS.</span></a></nav></header>';
const footer=`<footer class="ks-section ks-catalog-signoff"><nav class="ks-buyer-guides" aria-label="Panduan pembeli">${links}</nav><a href="/products/">JELAJAHI KOLEKSI ↗</a></footer>`;
for(const guide of BUYER_GUIDES){
  const sections=guide.sections.map(section=>`<section><h2>${esc(section.heading)}</h2>${(section.paragraphs||[]).map(text=>`<p>${esc(text)}</p>`).join('')}${section.steps?`<ol>${section.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol>`:''}${section.chart?`<div class="ks-guide-chart"><table class="ks-size-table"><caption>Lebar × panjang saat kaos dibentangkan, dalam cm</caption><thead><tr><th>Ukuran</th><th>Lebar</th><th>Panjang</th></tr></thead><tbody>${SIZE_CHART.map(([label,width,length])=>`<tr><th scope="row">${label}</th><td>${width} cm</td><td>${length} cm</td></tr>`).join('')}</tbody></table></div>`:''}${(section.links||[]).map(link=>`<a class="ks-guide-link" href="${esc(link.href)}">${esc(link.label)} ↗</a>`).join('')}</section>`).join('');
  const body=`<main class="ks-shop ks-guide ks-section"><nav class="ks-breadcrumb"><a href="/">Beranda</a><span>/</span><span>Panduan pembeli</span></nav><header class="ks-guide-heading"><span class="ks-eyebrow">KAINORA KIDS / ${esc(guide.eyebrow)}</span><h1>${esc(guide.heading)}</h1><p>${esc(guide.description)}</p></header><div class="ks-guide-layout"><article>${sections}</article><aside><h2>Lebih jelas.<br>Lebih nyaman.</h2><nav class="ks-buyer-guides">${links}</nav><a href="/products/" class="ks-button ks-button-acid">JELAJAHI KOLEKSI ↗</a></aside></div></main>`;
  const schema=[storeOrganization(),{'@context':'https://schema.org','@type':'WebPage',name:guide.title,description:guide.description,url:site+guide.path,inLanguage:'id-ID'},{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Beranda',item:site+'/'},{'@type':'ListItem',position:2,name:guide.heading,item:site+guide.path}]}];
  const directory='dist'+guide.path;await mkdir(directory,{recursive:true});
  await writeFile(directory+'index.html',storeDocument(template,{title:guide.title,description:guide.description,path:guide.path,image:'/images/kainora-owned/hero-camp.webp',schema,header,footer,body}));
}
let sitemap=await readFile('dist/sitemap.xml','utf8');
const studioBody=`<main class="size-studio"><div class="ss-container"><header class="ss-heading"><p class="ss-overline">STUDIO UKURAN</p><h1>Ukuran pas. Bergerak bebas.</h1><p>${esc(SIZE_STUDIO.description)}</p></header>${SIZE_CATEGORIES.map(category=>`<section><h2>${esc(category.label)}</h2><p>${esc(category.description)}</p>${category.types.map(type=>`<h3>${esc(type.label)}</h3><ol>${type.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol>`).join('')}</section>`).join('')}<section><h2>Panduan yang bisa ditelusuri.</h2><p>Ukuran berbeda menurut merek, model, bahan dan potongan; selisihnya tidak selalu 1–2 cm. Ini panduan pengukuran, bukan satu label ukuran universal.</p>${SIZE_SOURCES.map(source=>`<a href="${esc(source.href)}">${esc(source.name)} — ${esc(source.label)}</a>`).join('')}</section></div></main>`;
const studioSchema=[{'@context':'https://schema.org','@type':'WebPage',name:SIZE_STUDIO.title,description:SIZE_STUDIO.description,url:site+SIZE_STUDIO.path,inLanguage:'id-ID'},{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Beranda',item:site+'/'},{'@type':'ListItem',position:2,name:'Panduan ukuran anak',item:site+SIZE_STUDIO.path}]}];
await mkdir('dist'+SIZE_STUDIO.path,{recursive:true});
await writeFile('dist'+SIZE_STUDIO.path+'index.html',storeDocument(template,{title:SIZE_STUDIO.title,description:SIZE_STUDIO.description,path:SIZE_STUDIO.path,image:'/images/size-guide/tee-regular.webp',schema:studioSchema,header,footer,body:studioBody}));
const entries=[...BUYER_GUIDES,SIZE_STUDIO].map(guide=>`<url><loc>${site}${guide.path}</loc></url>`).join('\n');
await writeFile('dist/sitemap.xml',sitemap.replace('</urlset>',entries+'\n</urlset>'));
console.log(`Buyer guides: ${BUYER_GUIDES.length} static pages with matching policies, size guidance and sitemap entries.`);
