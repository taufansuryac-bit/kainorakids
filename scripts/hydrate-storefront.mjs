import {createServer} from 'vite';
import {readFile,writeFile} from 'node:fs/promises';
import {CATALOG_PAGE_SIZE,productHref,catalogHref} from '../src/utils/productRoutes.js';

const {products}=JSON.parse(await readFile('src/content/store.json','utf8'));
const paths=['/','/panduan-ukuran-anak/',...Array.from({length:Math.ceil(products.length/CATALOG_PAGE_SIZE)},(_,i)=>catalogHref(i+1)),...products.map(productHref)];
const server=await createServer({server:{middlewareMode:true},appType:'custom',logLevel:'error'});
try{
  const {render}=await server.ssrLoadModule('/src/ssr-storefront.jsx');
  for(const path of paths){
    const file='dist'+path+'index.html';
    const html=await readFile(file,'utf8');
    const view=path==='/'?'home':path==='/panduan-ukuran-anak/'?'sizeGuide':path.includes('--')?'productDetail':'products';
    const result=render(path);
    if(!result.includes('<main'))throw new Error('SSR did not produce storefront content: '+path);
    await writeFile(file,html.replace(/<div id="root"[^>]*>[\s\S]*(?=<\/body>)/,`<div id="root" data-ssr="true" data-prerender="${view}">${result}</div>\n`));
  }
  console.log(`React static rendering: ${paths.length} storefront pages reuse the first HTML on startup.`);
}finally{await server.close();}
