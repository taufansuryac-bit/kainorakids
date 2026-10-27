import {useId,useState} from 'react';
import {AnimatePresence,motion,useReducedMotion} from 'motion/react';
import {Info,ArrowUpRight} from 'lucide-react';
import {formatMeasurement,stageMeasurements} from '../../utils/sizeStudio';
import {visualProfile} from '../../content/sizeVisuals';

export function MeasurementStage({category,type,fit,focused,values,mode,onSelectDimension}){
  const reduce=useReducedMotion(),arrowId=`ss-arrow-${useId().replace(/:/g,'')}`;
  const profile=visualProfile(category,type,fit),{asset,marks,foot}=profile;
  const [selected,setSelected]=useState({});
  const key=`${category.id}-${type.id}`;
  const focusDimension=mode==='compare'?marks.find(mark=>focused===`ref_${mark.id}`||focused===`chart_${mark.id}`)?.id:null;
  const active=marks.find(mark=>mark.id===(focusDimension||selected[key]))||marks[0];
  const {footValue,garmentValues,side}=stageMeasurements(category.id,type.id,mode,values,focused);
  const amount=foot?footValue:garmentValues[active.id];
  const context=mode==='compare'?(side==='ref'?'Pembanding':'Size chart pilihan'):foot?'Kaki yang lebih panjang':'Cara mengukur pakaian';
  return <div className="ss-stage-column">
    <div className={`ss-stage ss-stage--${type.diagram||category.diagram}`}>
      <div className="ss-stage-top"><span className="ss-stage-tag">Contoh pengukuran</span>{foot&&<img className="ss-product-example" src={`/images/size-guide/${profile.productAsset}.webp`} width="48" height="48" alt={`Contoh ${type.label.toLowerCase()}; bukan acuan panjang kaki`}/>}</div>
      <div className="ss-art-space">
        <AnimatePresence initial={false}>
          <motion.div className="ss-art-plane" key={asset} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reduce?0:.24}}>
            <img src={`/images/size-guide/${asset}.webp`} width="1254" height="1254" alt={profile.alt} loading={asset==='tee-regular'?'eager':'lazy'} fetchpriority={asset==='tee-regular'?'high':'auto'} draggable="false"/>
            <svg className="ss-measure-lines" viewBox="0 0 100 100" aria-hidden="true">
              <defs><marker id={arrowId} markerWidth="3" markerHeight="3" refX=".5" refY="1.5" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M2.5 .3 L.5 1.5 L2.5 2.7"/></marker></defs>
              <g key={`${asset}-${active.id}`} className={amount?'is-highlighted':''}>
                {active.extensions?.map(([start,end],index)=><line className="ss-extension" key={index} x1={start[0]} y1={start[1]} x2={end[0]} y2={end[1]}/>)}
                {active.path?<motion.path className="ss-dimension" d={active.path} initial={{opacity:reduce?1:0}} animate={{opacity:1}} transition={{duration:reduce?0:.35}}/>:<motion.line className="ss-dimension" data-dimension={active.id} x1={active.start[0]} y1={active.start[1]} initial={{x2:reduce?active.end[0]:active.start[0],y2:reduce?active.end[1]:active.start[1]}} animate={{x2:active.end[0],y2:active.end[1]}} markerStart={`url(#${arrowId})`} markerEnd={`url(#${arrowId})`} transition={{duration:reduce?0:.45,ease:[.16,1,.3,1]}}/>}
              </g>
            </svg>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="ss-visual-readout"><span>{context}</span><strong>{active.label}{amount?` · ${formatMeasurement(amount)} cm`:''}</strong><p>{foot?'Dari batas tumit ke jari terpanjang, bukan panjang sol.':mode==='body'?'Garis pada pakaian berbeda dari lingkar tubuh anak.':'Angka mengikuti kolom terakhir yang Anda pilih.'}</p></div>
    </div>
    <div className="ss-dimension-controls" role="group" aria-label="Bagian ukuran pada ilustrasi">{marks.map(mark=><button type="button" key={mark.id} aria-pressed={active.id===mark.id} onClick={()=>{setSelected(current=>({...current,[key]:mark.id}));onSelectDimension?.(mark.id);}}>{mark.label}</button>)}</div>
    <div className="ss-stage-foot"><Info size={19} aria-hidden="true"/><p>Ukuran produk tetap menjadi acuan akhir.</p><a href="#cara-mengukur">Cara mengukur <ArrowUpRight size={16}/></a></div>
  </div>;
}
