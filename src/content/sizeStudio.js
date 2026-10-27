export const SIZE_STUDIO = {
  path: '/panduan-ukuran-anak/',
  title: 'Panduan Ukuran Baju, Celana & Sepatu Anak | Kainora Kids',
  description: 'Panduan interaktif mengukur baju, celana, sepatu, pakaian bayi dan fashion anak. Lihat cara mengukur, pahami cutting, dan bandingkan size chart dalam cm.',
  checkedOn: '23 Oktober 2026',
};

export const MEASUREMENTS = {
  height: {label:'Tinggi badan',min:35,max:190,placeholder:'Contoh: 110',help:'Ukur dari kepala sampai telapak kaki, tanpa alas kaki.'},
  chest: {label:'Lingkar dada',min:25,max:130,placeholder:'Contoh: 56',help:'Lingkarkan pita pada bagian dada terlebar. Jangan ditarik terlalu ketat.'},
  weight: {label:'Berat badan',unit:'kg',min:1,max:100,placeholder:'Contoh: 18',optional:true,help:'Sebagai catatan saja. Berat badan tidak menentukan ukuran pakaian.'},
  arm: {label:'Panjang lengan',min:10,max:90,placeholder:'Contoh: 35',help:'Ukur dari titik bahu ke pergelangan, dengan siku sedikit ditekuk.'},
  waist: {label:'Lingkar pinggang',min:20,max:120,placeholder:'Contoh: 54',help:'Ukur mengelilingi pinggang pada posisi pakaian akan dikenakan.'},
  hip: {label:'Lingkar pinggul',min:25,max:140,placeholder:'Contoh: 60',help:'Ukur bagian pinggul terlebar, pita tetap mendatar.'},
  inseam: {label:'Panjang kaki bagian dalam',min:8,max:100,placeholder:'Contoh: 43',help:'Ukur dari pangkal paha ke batas bawah celana yang diinginkan.'},
  length: {label:'Panjang yang diinginkan',min:10,max:160,placeholder:'Contoh: 55',help:'Ukur dari titik awal pakaian ke batas bawah yang diinginkan; lihat petunjuk jenis pakaian.'},
  torso: {label:'Bahu ke selangkangan',min:15,max:100,placeholder:'Contoh: 38',help:'Ukur dari bahu dekat leher ke selangkangan. Sangat penting untuk pakaian terusan.'},
  leftFoot: {label:'Panjang kaki kiri',min:7,max:32,placeholder:'Contoh: 14,2',help:'Ukur tanpa alas kaki, dari tumit ke ujung jari terpanjang.'},
  rightFoot: {label:'Panjang kaki kanan',min:7,max:32,placeholder:'Contoh: 14,8',help:'Ukur kedua kaki. Gunakan kaki yang lebih panjang saat memeriksa chart.'},
  face: {label:'Lingkar wajah',min:25,max:80,placeholder:'Contoh: 48',help:'Ukur keliling bukaan hijab di sekitar wajah, tanpa menekan kulit.'},
  frontLength: {label:'Panjang penutup depan',min:10,max:120,placeholder:'Contoh: 40',help:'Ukur dari atas kepala mengikuti arah depan sampai batas cakupan yang diinginkan.'},
  upperLength: {label:'Panjang atasan mukena',min:20,max:180,placeholder:'Contoh: 85',help:'Dari atas kepala ke batas bawah atasan, perhatikan cakupan saat rukuk.'},
  lowerLength: {label:'Panjang bawahan mukena',min:20,max:180,placeholder:'Contoh: 70',help:'Dari pinggang ke batas bawah, pastikan tidak mengganggu langkah.'},
};

const type=(id,label,fields,dimensions,steps,asset,diagram)=>({id,label,fields,dimensions,steps,asset,diagram});
const topSteps=['Ukur dada dengan pita mendatar, lalu catat tinggi badan anak.','Untuk pakaian pembanding, bentangkan tanpa menarik kain. Ukur ketiak ke ketiak dan bahu dekat kerah ke ujung bawah.','Bandingkan lebar, panjang, bahan dan potongan dengan size chart produk.'];
const bottomSteps=['Ukur lingkar pinggang dan bagian pinggul terlebar.','Catat panjang kaki dalam untuk celana panjang, atau panjang dari pinggang untuk celana pendek/rok.','Untuk bahan elastis, periksa keterangan rentang pinggang dan stretch dari produk.'];
const footSteps=['Letakkan kaki tanpa alas di atas kertas pada lantai yang datar, tumit dekat dinding.','Tandai tumit dan ujung jari terpanjang, lalu ukur jaraknya. Ulangi untuk kaki satunya.','Gunakan kaki yang lebih panjang untuk memeriksa chart panjang kaki. Panjang insole dan sol luar adalah ukuran berbeda.'];
const babySteps=['Catat panjang tubuh dan lingkar dada bayi dengan lembut.','Untuk terusan, ukur bahu ke selangkangan pada pakaian yang sudah nyaman; jangan ditarik.','Periksa ruang popok, bukaan leher, dan panjang kaki bila modelnya menutup kaki.'];
const dressSteps=['Ukur lingkar dada anak. Periksa juga pinggang bila modelnya berpotongan di pinggang.','Ukur dari bahu dekat leher hingga batas bawah dress/gamis yang diinginkan.','Jumpsuit memerlukan panjang torso dan kaki dalam; tidak cukup memakai panjang dress.'];
const homeSteps=['Ukur bagian atasan dan bawahan secara terpisah.','Untuk pembanding, ukur lebar atasan dari ketiak ke ketiak, panjang dari bahu dekat kerah ke ujung bawah, serta lebar pinggang celana tanpa menarik karet.','Ikuti label perawatan, sifat bahan dan chart setelan; satu label belum tentu cocok pada kedua bagian.'];

export const SIZE_CATEGORIES = [
  {id:'tops',label:'Atasan',description:'Kaos, polo, kemeja, blouse & outer ringan.',asset:'tee-regular',diagram:'tee',visualLabel:'Kaos · tampak depan',fit:true,
    types:[type('tee','Kaos / polo / blouse',['height','chest','weight'],['width','length'],topSteps),type('shirt','Kemeja / tunik',['height','chest','arm'],['width','length','sleeve'],topSteps,'koko','shirt'),type('outer','Hoodie / jaket ringan',['height','chest','arm'],['width','length','sleeve'],[...topSteps.slice(0,2),'Ukur dengan mempertimbangkan pakaian yang akan dikenakan di dalam; ikuti chart outer, bukan sekadar naik satu label.'],'hoodie','shirt')]},
  {id:'bottoms',label:'Bawahan',description:'Celana, jeans, jogger, legging & rok.',asset:'trousers',diagram:'trousers',visualLabel:'Celana · tampak depan',
    types:[type('trousers','Celana panjang / jeans / jogger',['waist','hip','inseam'],['waistWidth','hipWidth','inseam'],bottomSteps),type('shorts','Celana pendek',['waist','hip','length'],['waistWidth','hipWidth','length'],bottomSteps,'shorts','shorts'),type('legging','Legging',['waist','hip','inseam'],['waistWidth','hipWidth','inseam'],bottomSteps,'legging','trousers'),type('skirt','Rok',['waist','hip','length'],['waistWidth','hipWidth','length'],bottomSteps,'skirt','skirt')]},
  {id:'shoes',label:'Sepatu',description:'Sepatu sekolah, sneaker, olahraga, sandal & clogs.',asset:'shoe',diagram:'shoe',visualLabel:'Sepatu · ilustrasi, bukan ukuran sol',
    types:[type('sneaker','Sepatu sekolah / sneaker / olahraga',['leftFoot','rightFoot'],['footLength'],footSteps),type('sandal','Sandal / clogs',['leftFoot','rightFoot'],['footLength'],[...footSteps.slice(0,2),'Periksa panduan model sandal/clogs, lebar kaki dan penahan tumit. Jangan menyamakan chart sepatu lain.'],'sandal','shoe')]},
  {id:'baby',label:'Bayi',description:'Bodysuit, romper & sleepsuit.',asset:'bodysuit',diagram:'bodysuit',visualLabel:'Bodysuit · tampak depan',
    types:[type('bodysuit','Bodysuit / romper',['height','chest','torso'],['width','torsoLength'],babySteps),type('sleepsuit','Sleepsuit',['height','chest','torso'],['width','torsoLength','inseam'],babySteps,'sleepsuit','sleepsuit')]},
  {id:'dress',label:'Dress',description:'Dress, jumpsuit & playsuit.',asset:'dress',diagram:'dress',visualLabel:'Dress · tampak depan',fit:true,
    types:[type('dress','Dress',['height','chest','length'],['width','waistWidth','length'],dressSteps),type('jumpsuit','Jumpsuit / playsuit',['height','chest','torso'],['width','torsoLength','inseam'],dressSteps,'jumpsuit','jumpsuit')]},
  {id:'home',label:'Pakaian rumah',description:'Piyama, singlet, pakaian dalam & kaus kaki.',asset:'pyjamas',diagram:'pyjamas',visualLabel:'Piyama · atasan & bawahan',
    types:[type('pyjamas','Piyama / setelan rumah',['height','chest','waist'],['width','length','waistWidth'],homeSteps),type('singlet','Singlet',['height','chest'],['width','length'],topSteps,'singlet','tee'),type('underwear','Pakaian dalam',['waist','hip'],['waistWidth','rise'],['Ukur lingkar pinggang dan pinggul pada tubuh, pita mendatar tanpa menekan kulit.','Bentangkan celana dalam pembanding tanpa meregangkan karet. Ukur lebar pinggang dan pesak depan dari tengah pinggang ke jahitan selangkangan.','Cocokkan chart tubuh atau chart pakaian sesuai metodenya; periksa rentang karet dan bahan elastis.'],'underwear','underwear'),type('socks','Kaus kaki',['leftFoot','rightFoot'],['footLength'],[...footSteps.slice(0,2),'Cocokkan panjang kaki dengan chart kaus kaki. Periksa rentang elastisitas; panjang kaus kaki yang dibentangkan bukan panjang kaki.'],'socks','socks')]},
  {id:'muslim',label:'Muslim',description:'Koko, gamis, hijab instan & mukena anak.',asset:'koko',diagram:'shirt',visualLabel:'Koko · tampak depan',
    types:[type('koko','Koko',['height','chest','arm'],['width','length','sleeve'],topSteps),type('gamis','Gamis',['height','chest','length'],['width','waistWidth','length'],dressSteps,'gamis','dress'),type('hijab','Hijab instan',['face','frontLength'],['faceOpening','coverage'],['Lingkarkan pita pada jalur bukaan wajah, dengan kelonggaran nyaman.','Ukur dari atas kepala ke batas depan yang diinginkan. Periksa juga cakupan belakang pada produk.','Cocokkan metode ukur bukaan pada chart; sebagian penjual memakai lebar bukaan, sebagian lingkar.'],'hijab','hijab'),type('mukena','Mukena',['height','upperLength','lowerLength'],['upperLength','lowerLength'],['Ukur panjang dari atas kepala ke batas bawah atasan mukena.','Ukur bawahan dari pinggang hingga batas bawah. Coba cakupan saat berdiri dan rukuk.','Periksa panjang atasan, bawahan dan bukaan wajah pada chart. Tidak ada satu ukuran usia yang pasti.'],'mukena','mukena')]},
];

const dimensionDefinitions={
  width:['Lebar dada',8,100],length:['Panjang pakaian',10,180],sleeve:['Panjang lengan',8,90],waistWidth:['Lebar pinggang',8,100],hipWidth:['Lebar pinggul',8,110],inseam:['Panjang kaki dalam',8,100],torsoLength:['Bahu ke selangkangan',10,110],footLength:['Panjang kaki',7,32],rise:['Tinggi pesak',8,65],faceOpening:['Lingkar bukaan wajah',25,80],coverage:['Panjang penutup depan',10,120],upperLength:['Panjang atasan',20,180],lowerLength:['Panjang bawahan',20,180],
};

const dimensionHelp={
  width:'Bentangkan tanpa menarik kain. Ukur lurus dari ketiak ke ketiak, bukan lingkar dada tubuh.',
  length:'Ukur panjang dari bahu dekat kerah ke ujung bawah; untuk bawahan mulai dari pinggang. Pada setelan, kolom ini untuk atasan.',
  sleeve:'Ukur dari jahitan bahu ke ujung manset mengikuti arah lengan. Pastikan chart memakai titik awal yang sama.',
  waistWidth:'Ukur lurus dari tepi ke tepi pinggang tanpa menarik karet. Lebar berbeda dari lingkar pinggang.',
  hipWidth:'Ukur mendatar pada bagian pinggul terlebar dengan pakaian dibentangkan tanpa ditarik.',
  inseam:'Ikuti jahitan kaki bagian dalam dari selangkangan sampai ujung kaki celana. Untuk sleepsuit, periksa apakah chart memasukkan bagian telapak.',
  torsoLength:'Ukur dari bahu dekat leher ke selangkangan pada pakaian terusan; tutup kancing bodysuit dan jangan meregangkan kain.',
  footLength:'Gunakan panjang kaki, bukan insole atau sol luar. Kolom kiri adalah panjang kaki pembanding, kanan adalah panjang kaki yang ditulis pada chart.',
  rise:'Ukur pesak depan dari tengah pinggang ke jahitan selangkangan, tanpa menarik karet.',
  faceOpening:'Gunakan lingkar bukaan pada kedua kolom, bukan lebar bukaan. Pita mengikuti seluruh tepi bukaan wajah.',
  coverage:'Ukur dari atas kepala mengikuti bagian depan sampai ujung penutup; ikuti metode cakupan pada chart.',
  upperLength:'Ukur atasan mukena dari puncak kepala sampai ujung bawah, bukan dari tepi lubang wajah.',
  lowerLength:'Ukur bawahan mukena dari pinggang ke ujung bawah dengan karet tidak ditarik.',
};

export function sizeSelection(categoryId,typeId){
  const category=SIZE_CATEGORIES.find(c=>c.id===categoryId);
  const selectedType=category?.types.find(t=>t.id===typeId);
  return category&&selectedType?{category,type:selectedType}:null;
}
export function measurementFields(categoryId,typeId,mode='body'){
  const selection=sizeSelection(categoryId,typeId);
  if(!selection)return [];
  if(mode==='body')return selection.type.fields.map(id=>({id,unit:'cm',...MEASUREMENTS[id]}));
  if(mode!=='compare')return [];
  return selection.type.dimensions.flatMap(dimension=>{
    const [label,min,max]=dimensionDefinitions[dimension];
    return ['ref','chart'].map(side=>({id:`${side}_${dimension}`,dimension,side,label,unit:'cm',min,max,placeholder:side==='ref'?'Pembanding':'Dari size chart',help:dimensionHelp[dimension]}));
  });
}

export const SIZE_SOURCES=[
  {name:'UNIQLO Indonesia',label:'Cara mengukur tubuh dan pakaian',href:'https://www.uniqlo.com/id/id/special-feature/cp/kids-baby/size-guide'},
  {name:'H&M Indonesia',label:'Panduan pengukuran tubuh anak',href:'https://id.hm.com/id_id/customer-service/sizeguide/kids.html'},
  {name:'adidas',label:'Metode mengukur panjang kaki',href:'https://www.adidas.ae/en/size-chart-kids.html'},
  {name:'ISO 8559-2:2025',label:'Indikator ukuran berdasarkan tubuh',href:'https://www.iso.org/standard/85590.html'},
];
