// Coordinates use the original square image, never the cropped viewport.
// Each silhouette is calibrated separately; these are teaching marks, not a size scale.
const mark=(id,label,start,end,extra={})=>({id,label,start,end,...extra});
const width=(a,b,y)=>mark('width','Lebar dada',[a,y],[b,y]);
const length=(x,a,b)=>mark('length','Panjang pakaian',[x,a],[x,b]);
const waist=(a,b,y)=>mark('waistWidth','Lebar pinggang',[a,y],[b,y]);
const hip=(a,b,y)=>mark('hipWidth','Lebar pinggul',[a,y],[b,y]);
const inseam=(start,end)=>mark('inseam','Panjang kaki dalam',start,end);
const torso=(start,end)=>mark('torsoLength','Bahu ke selangkangan',start,end);
const sleeve=(start,end)=>mark('sleeve','Panjang lengan',start,end);
const profiles={
  'tee-regular':{alt:'Kaos lengan pendek ivory dibentangkan, tampak depan',marks:[width(24,77,48),length(63,14,84)]},
  'tee-relaxed':{alt:'Kaos relaxed ivory dengan badan lebih leluasa, tampak depan',marks:[width(21,79,46),length(62,13,84)]},
  'tee-oversize':{alt:'Kaos oversize ivory dengan bahu jatuh, tampak depan',marks:[width(18,81,51),length(63,15,81)]},
  koko:{alt:'Kemeja koko ivory berlengan panjang dibentangkan, tampak depan',marks:[width(29,70,55),length(62,21,81),sleeve([66,23],[87,69])]},
  hoodie:{alt:'Hoodie ivory dengan tudung dan lengan panjang, tampak depan',marks:[width(25,76,56),length(64,32,86),sleeve([70,35],[88,75])]},
  trousers:{alt:'Celana panjang ivory dengan pinggang elastis, tampak depan',marks:[waist(32,66,13),hip(31,68,28),inseam([50,38],[58,86])]},
  legging:{alt:'Legging ivory dengan kaki ramping dan pinggang elastis, tampak depan',marks:[waist(35,65,9),hip(34,66,23),inseam([50,35],[60,91])]},
  shorts:{alt:'Celana pendek ivory dibentangkan dengan pinggang tidak ditarik',marks:[waist(29,70,24),hip(25,74,40),length(69,24,76)]},
  skirt:{alt:'Rok ivory dibentangkan dengan pinggang elastis tidak ditarik',marks:[waist(34,68,24),hip(28,74,44),length(64,24,75)]},
  bodysuit:{alt:'Bodysuit bayi ivory dengan kancing bawah tertutup, tampak depan',marks:[width(30,71,39),torso([60,13],[50,81])]},
  sleepsuit:{alt:'Sleepsuit bayi ivory dengan kaki tertutup, tampak depan',marks:[width(31,70,39),torso([61,13],[50,59]),inseam([50,59],[57,84])]},
  dress:{alt:'Dress tanpa lengan ivory dengan rok melebar, tampak depan',marks:[width(34,67,33),waist(32,69,44),length(62,11,85)]},
  gamis:{alt:'Gamis ivory berlengan panjang dengan rok panjang, tampak depan',marks:[width(31,67,35),waist(29,69,47),length(61,11,91)]},
  jumpsuit:{alt:'Jumpsuit ivory dengan sambungan pinggang dan dua kaki, tampak depan',marks:[width(34,65,25),torso([60,9],[50,56]),inseam([50,56],[56,91])]},
  pyjamas:{alt:'Set piyama ivory, atasan di kiri dan celana panjang di kanan',marks:[width(13,46,43),length(35,24,66),waist(64,87,17)]},
  singlet:{alt:'Singlet tanpa lengan ivory dengan tali bahu, tampak depan',marks:[width(35,65,35),length(59,13,85)]},
  underwear:{alt:'Celana dalam anak ivory dibentangkan, tampak depan',marks:[waist(24,77,26),mark('rise','Tinggi pesak',[50,27],[50,75])]},
  hijab:{alt:'Hijab instan ivory dengan bukaan wajah oval, tampak depan',marks:[mark('faceOpening','Lingkar bukaan wajah',[49,12],[49,12],{path:'M49 12 C30 12 25 42 49 43 C73 42 69 12 49 12 Z',closed:true}),mark('coverage','Panjang penutup depan',[48,9],[48,88])]},
  mukena:{alt:'Mukena anak ivory, atasan di kiri dan rok bawahan di kanan',marks:[mark('upperLength','Panjang atasan',[25,10],[25,77]),mark('lowerLength','Panjang bawahan',[72,27],[72,90])]},
};
const footMark=mark('footLength','Panjang kaki',[68,19],[68,80],{extensions:[[[56,19],[72,19]],[[58,80],[72,80]]]});
export function visualProfile(category,type,fit='regular'){
  const productAsset=category.id==='tops'&&type.id==='tee'?`tee-${fit}`:type.asset||category.asset;
  if(type.dimensions.includes('footLength'))return {asset:'foot-measure',productAsset,alt:'Kaki telanjang di atas kertas, jari terpanjang di atas dan tumit di batas balok',marks:[footMark],foot:true};
  return {asset:productAsset,...profiles[productAsset]};
}
