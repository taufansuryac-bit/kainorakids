import {unlink,stat} from 'node:fs/promises';
import path from 'node:path';
// Two unused legacy video copies exceed Pages' per-file limit. Exclude only
// these generated build copies; preserve both originals in public/.
const unusedLegacyVideos=['VIDEO-WEB-PERJALANAN.mp4','video/VIDEO-WEB-PERJALANAN.mp4'];
export function cloudflareStaticPlugin(enabled){
  let output;
  return{name:'kainora-cloudflare-static',apply:'build',configResolved(config){output=path.resolve(config.root,config.build.outDir);if(output===path.resolve(config.root))throw new Error('Build output must be separate from source.');},async closeBundle(){
    if(!enabled)return;
    for(const name of unusedLegacyVideos){const target=path.resolve(output,name),relative=path.relative(output,target);if(relative.startsWith('..')||path.isAbsolute(relative))throw new Error('Invalid build asset path.');try{if((await stat(target)).size>25*1024*1024)await unlink(target);}catch(error){if(error.code!=='ENOENT')throw error;}}
  }};
}
