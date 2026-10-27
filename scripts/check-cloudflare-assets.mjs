import {readdir,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist'),tooLarge=[];let count=0;
async function walk(directory){for(const entry of await readdir(directory,{withFileTypes:true})){const file=path.join(directory,entry.name);if(entry.isDirectory())await walk(file);else{count++;if((await stat(file)).size>25*1024*1024)tooLarge.push(path.relative(root,file));}}}
await walk(root);
if(tooLarge.length||count>20000){console.error('Cloudflare Pages Free asset limits exceeded:',{count,tooLarge});process.exitCode=1;}else console.log(`Cloudflare assets: ${count} files; all <=25 MiB.`);
