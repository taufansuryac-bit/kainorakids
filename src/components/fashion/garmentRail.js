import {GARMENT_VIEW} from '../../constants/garmentViewConfig.js';
export const wrapIndex=(index,count)=>((index%count)+count)%count;
export const garmentYaw=entry=>entry.initialView==='front'?0:GARMENT_VIEW.initialYaw;
// Face each preview toward the actual eye direction rather than a fixed turn.
export const railCameraYaw=(x,z,cameraZ)=>Math.atan2(-x,cameraZ-z);
export function railOffset(index,cursor,count) { const raw=index-cursor;return raw-Math.floor(raw/count+.5)*count; }
export function visibleGarments(entries,cursor) {
  if(entries.length<=5)return entries.map((entry,index)=>({entry,index}));
  return [-2,-1,0,1,2].map(offset=>{const index=wrapIndex(Math.round(cursor)+offset,entries.length);return{entry:entries[index],index};});
}
export function garmentSeed(id) {let value=0;for(const char of id)value=(Math.imul(value,31)+char.charCodeAt(0))|0;return value>>>0;}
