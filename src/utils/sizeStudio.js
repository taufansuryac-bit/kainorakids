import {measurementFields, sizeSelection} from '../content/sizeStudio.js';

export function parseMeasurement(value){
  if(value===null||value===undefined)return null;
  const text=String(value).trim();
  if(!/^\d+(?:[.,]\d{1,2})?$/.test(text))return null;
  const number=Number(text.replace(',','.'));
  return Number.isFinite(number)&&number>0?number:null;
}
export const formatMeasurement=value=>new Intl.NumberFormat('id-ID',{maximumFractionDigits:2}).format(value);
export const valuesForNewGarment=values=>Object.fromEntries(Object.entries(values).filter(([key])=>key!=='length'&&!key.startsWith('ref_')&&!key.startsWith('chart_')));

export function editMeasurementErrors(errors,id,value,fields){
  if(!errors[id])return errors;
  const next={...errors},field=fields.find(item=>item.id===id),number=parseMeasurement(value);
  if(field&&((field.optional&&String(value).trim()==='')||(number!==null&&number>=field.min&&number<=field.max)))delete next[id];
  return next;
}

export function stageMeasurements(categoryId,typeId,mode,values,focused=null){
  const valid={};
  for(const field of measurementFields(categoryId,typeId,mode)){
    const number=parseMeasurement(values[field.id]);
    if(number!==null&&number>=field.min&&number<=field.max)valid[field.id]=number;
  }
  const side=focused?.startsWith('ref_')?'ref':'chart',prefix=`${side}_`;
  const garmentValues=mode==='compare'?Object.fromEntries(Object.entries(valid).filter(([id])=>id.startsWith(prefix)).map(([id,value])=>[id.slice(prefix.length),value])):{};
  return {side,garmentValues,footValue:mode==='compare'?valid[`${prefix}footLength`]??null:(valid.leftFoot&&valid.rightFoot?Math.max(valid.leftFoot,valid.rightFoot):null)};
}

export function analyseMeasurements({categoryId,typeId,mode='body',values={},fit='regular'}={}){
  const selection=sizeSelection(categoryId,typeId);
  if(!selection||!['body','compare'].includes(mode))return {ok:false,errors:{form:'Pilih kategori dan jenis pakaian terlebih dahulu.'}};
  const fields=measurementFields(categoryId,typeId,mode),numbers={},errors={};
  for(const field of fields){
    const raw=values[field.id];
    if(field.optional&&(raw===undefined||String(raw).trim()===''))continue;
    const number=parseMeasurement(raw);
    if(number===null||number<field.min||number>field.max)errors[field.id]=`Isi ${field.label.toLowerCase()} antara ${field.min}–${field.max} ${field.unit}.`;
    else numbers[field.id]=number;
  }
  if(Object.keys(errors).length)return {ok:false,errors};
  const cm=value=>`${formatMeasurement(value)} cm`;
  const feet=selection.type.dimensions.includes('footLength');
  if(mode==='compare'){
    const items=selection.type.dimensions.map(dimension=>{
      const field=fields.find(f=>f.dimension===dimension),reference=numbers[`ref_${dimension}`],candidate=numbers[`chart_${dimension}`];
      const delta=Math.round((candidate-reference)*100)/100;
      return {id:dimension,label:field.label,delta,value:delta===0?'Sama':`${cm(Math.abs(delta))} lebih ${delta>0?'besar':'kecil'}`,detail:`Pembanding ${cm(reference)} → chart ${cm(candidate)}`};
    });
    return {ok:true,errors:{},heading:'Lihat bedanya. Pilih lebih yakin.',items,notes:feet?['Bandingkan panjang kaki dengan panjang kaki pada chart; jangan mencampur ukuran kaki, insole dan sol luar.','Selisih ini membandingkan angka masukan. Ruang jari, lebar kaki dan kecocokan tetap mengikuti panduan model produk.']:['Perbandingan angka pada metode ukur yang sama, bukan jaminan produk akan pas.','Periksa juga bahan, kelenturan, potongan dan panjang. “Lebih kecil” berarti ukuran chart di bawah pembanding.']};
  }
  const items=feet?[{id:'footLength',label:'Panjang kaki acuan',value:cm(Math.max(numbers.leftFoot,numbers.rightFoot)),detail:'Dari kaki yang lebih panjang. Cari chart berdasarkan panjang kaki.'}]:fields.filter(field=>!field.optional).map(field=>({id:field.id,label:field.label,value:cm(numbers[field.id]),detail:'Ukuran tubuh / kebutuhan panjang yang Anda masukkan.'}));
  const fitNotes={regular:'Regular: periksa kenyamanan dada, bahu dan panjang pada chart produk.',relaxed:'Relaxed: cari keterangan potongan lebih rileks; tambahan kelonggaran berbeda setiap produk.',oversize:'Oversize: periksa lebar, bahu jatuh dan panjang. Naik satu ukuran belum tentu menghasilkan pola oversize.'};
  const bodyNote=feet?'Bandingkan dengan kolom panjang kaki pada chart. Panjang insole dan sol luar tidak sama; ruang depan mengikuti panduan model.':typeId==='hijab'?'Cocokkan lingkar bukaan wajah serta panjang cakupan depan. Lingkar bukaan berbeda dari lebar bukaan.':typeId==='mukena'?'Cocokkan panjang dari atas kepala untuk atasan, serta dari pinggang untuk bawahan. Periksa cakupan saat bergerak.':typeId==='underwear'?'Cocokkan lingkar pinggang dan pinggul dengan chart tubuh produk. Lebar pinggang pakaian diukur tanpa menarik karet.':selection.type.fields.includes('chest')?'Cari size chart yang mencakup ukuran tubuh ini. Lingkar dada tubuh bukan lebar dada pakaian.':'Cocokkan pinggang, pinggul dan panjang dengan metode ukur pada chart. Lingkar tubuh berbeda dari lebar pakaian.';
  return {ok:true,errors:{},heading:feet?'Mulai dari kaki yang lebih panjang.':'Ini catatan ukuran si kecil.',items,notes:[bodyNote,selection.category.fit?fitNotes[fit]||fitNotes.regular:'Periksa metode ukur, bahan dan cakupan pada produk yang dipilih.','Panduan ini belum menentukan satu label ukuran universal. Gunakan mode banding dengan ukuran pembanding dan metode yang sama.']};
}
