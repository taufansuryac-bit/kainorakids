import { handleNewsletter } from '../server/newsletter/handler.js';
import { BLOG_POSTS } from '../src/constants/blogPosts.js';
import { journalFeed } from '../src/utils/journalFeed.js';

export function localNewsletterPlugin(env) {
  return {name:'kainora-newsletter-local',apply:'serve',configureServer(server){
    server.middlewares.use('/blog/feed.xml',(_req,res)=>{res.setHeader('Content-Type','application/rss+xml; charset=utf-8');res.end(journalFeed(BLOG_POSTS));});
    server.middlewares.use('/api/newsletter',async(req,res)=>{
      try {
        const chunks=[];let size=0;
        for await (const chunk of req) {
          size+=chunk.length;
          if(size>4096){res.statusCode=413;res.setHeader('Content-Type','application/json');res.end(JSON.stringify({error:'Data formulir terlalu panjang.'}));return;}
          chunks.push(chunk);
        }
        const request=new Request(`http://${req.headers.host}/api/newsletter`,{method:req.method,headers:req.headers,...(chunks.length?{body:Buffer.concat(chunks)}:{})});
        const response=await handleNewsletter(request,env);
        res.statusCode=response.status;response.headers.forEach((value,key)=>res.setHeader(key,value));res.end(Buffer.from(await response.arrayBuffer()));
      } catch {res.statusCode=500;res.setHeader('Content-Type','application/json');res.end(JSON.stringify({error:'Layanan newsletter belum tersedia.'}));}
    });
  }};
}
