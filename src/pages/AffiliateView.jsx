import { useEffect, useMemo, useRef, useState } from 'react';
import { animate, AnimatePresence, motion, MotionConfig, useMotionValue, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy, Instagram, Minus, Pause, Play, Plus } from 'lucide-react';
import { SEO } from '../constants/data';
import { useStore } from '../context/StoreContext';
import { useMotionPreference } from '../components/fashion/useMotionPreference';
import { affiliateEstimate, affiliateProducts } from '../utils/affiliate';
import { formatPrice } from '../utils/pricing';
import './affiliate.css';

const EASE = [.22, 1, .36, 1];
const INSTAGRAM = 'https://www.instagram.com/kainorakids/';
const STEPS = [
  { title: 'Kenalan dulu.', label: 'CONNECT', text: 'Ceritakan akun, platform, dan gaya kontenmu kepada tim Kainora. Diskusikan ketentuan kerja sama sebelum mulai.', detail: 'AKUNMU + IDEMU', Icon: ArrowUpRight },
  { title: 'Temukan ceritamu.', label: 'CREATE', text: 'Pilih koleksi yang cocok dengan audiensmu. Eksplorasi detail sablon, padu padan, atau cerita di balik gaya si kecil.', detail: 'KOLEKSI + SUDUT PANDANGMU', Icon: Plus },
  { title: 'Bagikan rekomendasimu.', label: 'SHARE', text: 'Publikasikan konten dan gunakan tautan atau mekanisme rekomendasi yang disepakati. Jelaskan kerja sama secara terbuka.', detail: 'KONTEN + REKOMENDASI', Icon: ArrowRight },
  { title: 'Ikuti hasilnya.', label: 'GROW', text: 'Komisi mengikuti transaksi yang memenuhi ketentuan program. Konfirmasikan tarif, validasi pesanan, dan jadwal pencairan bersama tim.', detail: 'TRANSAKSI VALID + KOMISI', Icon: Check },
];
const FAQS = [
  ['Siapa yang bisa mengajukan kerja sama?', 'Kreator konten, orang tua yang suka berbagi inspirasi gaya, atau kamu yang memiliki audiens yang relevan dengan Kainora. Kirimkan profil akun dan ide kontenmu agar tim dapat mengenalmu lebih dulu.'],
  ['Berapa komisi yang bisa saya dapatkan?', 'Persentase simulasi dapat berbeda untuk setiap produk. Pilih produk pada simulator untuk melihat tarifnya. Hasil perhitungan adalah estimasi, bukan jaminan penghasilan. Tarif akhir dan transaksi yang dihitung perlu mengikuti kesepakatan program.'],
  ['Apakah sampel produk diberikan?', 'Ketersediaan sampel dan ketentuannya perlu dibicarakan dengan tim Kainora. Konfirmasikan kebutuhan sampel sebelum menyiapkan konten atau melakukan pembelian.'],
  ['Kontennya harus seperti apa?', 'Mulai dari sudut pandangmu sendiri: detail motif, ide padu padan, unboxing, atau aktivitas sehari-hari. Gunakan informasi produk yang akurat dan ungkapkan hubungan affiliate.'],
  ['Kapan komisi dicairkan?', 'Jadwal, metode pencairan, serta perlakuan terhadap pembatalan atau retur ditentukan dalam ketentuan kerja sama. Konfirmasikan terlebih dahulu melalui tim Kainora; simulator ini tidak membuat saldo atau melakukan pencairan.'],
];

function Reveal({ children, className = '', delay = 0 }) {
  const reduce = useMotionPreference();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .7, delay, ease: EASE }}>{children}</motion.div>;
}

function CommissionNumber({ value, still }) {
  const amount = useMotionValue(value);
  const display = useTransform(() => formatPrice(Math.round(amount.get())));
  useEffect(() => {
    const animation = animate(amount, value, { duration: still ? 0 : .45, ease: EASE });
    return () => animation.stop();
  }, [amount, value, still]);
  return <motion.span aria-hidden="true">{display}</motion.span>;
}

function Simulator({ products, still }) {
  const available = useMemo(() => affiliateProducts(products), [products]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(10);
  const product = available.find(item => String(item.id) === productId) || available[0];
  const estimate = affiliateEstimate(product, quantity);
  return <section id="affiliate-simulator" className="ka-simulator ka-section" aria-labelledby="ka-sim-title">
    <div className="ka-section-meta"><span>02 / THE POSSIBILITIES</span><span>HITUNG. EKSPLORASI. RENCANAKAN.</span></div>
    <div className="ka-simulator-heading"><Reveal><h2 id="ka-sim-title">KONTENMU.<br/><span>PELUANGMU.</span></h2></Reveal><p>Mulai dari satu rekomendasi.<br/>Lihat simulasi komisi dari koleksi pilihanmu.</p></div>
    {product && estimate ? <div className="ka-calculator">
      <Reveal className="ka-calculator-controls">
        <label className="ka-input-label" htmlFor="ka-product">01 — PILIH PRODUK</label>
        <select id="ka-product" value={String(product.id)} onChange={event => setProductId(event.target.value)}>{available.map(item => <option value={String(item.id)} key={item.id}>{item.name}</option>)}</select>
        <div className="ka-selected-product"><AnimatePresence mode="wait" initial={false}><motion.img key={product.img} src={product.img} alt={product.name} initial={still ? false : { opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2 }}/></AnimatePresence><div><span className="ka-micro">GRAPHIC TEE / KAINORA KIDS</span><strong>{product.name}</strong><p>{formatPrice(product.price)} <span>/ produk</span></p><span className="ka-rate">{estimate.rate.toLocaleString('id-ID')}% KOMISI SIMULASI</span>{product.catalogPreview && <small>Harga katalog masih pratinjau.</small>}</div></div>
        <div className="ka-quantity-label"><label className="ka-input-label" htmlFor="ka-quantity">02 — JUMLAH PENJUALAN</label><span><b>{quantity}</b> produk</span></div>
        <input id="ka-quantity" type="range" min="1" max="100" value={quantity} style={{ '--range': `${(quantity - 1) / 99 * 100}%` }} onChange={event => setQuantity(Number(event.target.value))} aria-valuetext={`${quantity} produk`}/>
        <div className="ka-quantity-presets">{[1, 10, 25, 50, 100].map(number => <button type="button" key={number} onClick={() => setQuantity(number)} aria-pressed={quantity === number}>{number}<span> produk</span></button>)}</div>
      </Reveal>
      <Reveal className="ka-estimate" delay={.1}><div className="ka-estimate-top"><span className="ka-micro">YOUR NEXT POSSIBILITY</span><ArrowUpRight size={30}/></div><span className="ka-estimate-label">Estimasi total komisi</span><div className="ka-estimate-value"><CommissionNumber value={estimate.total} still={still}/><output className="sr-only" aria-live="polite">{formatPrice(estimate.total)} estimasi komisi untuk {quantity} produk {product.name}</output></div><div className="ka-estimate-rule"/><dl><div><dt>Komisi per penjualan</dt><dd>{formatPrice(estimate.perSale)}</dd></div><div><dt>Jumlah penjualan</dt><dd>{quantity} produk</dd></div><div><dt>Tarif produk</dt><dd>{estimate.rate.toLocaleString('id-ID')}%</dd></div></dl><div className="ka-estimate-note"><span>i</span><p>Simulasi, bukan jaminan penghasilan. Komisi aktual mengikuti transaksi valid dan ketentuan kerja sama. Pembulatan dihitung per produk.</p></div></Reveal>
    </div> : <div className="ka-simulator-empty"><Plus size={30}/><h3>Simulasi sedang disiapkan.</h3><p>Produk akan tampil di sini setelah harga dan tarif komisinya tersedia. Sementara itu, kenali koleksi dan diskusikan kerja sama dengan tim Kainora.</p><a className="ka-link" href="#affiliate-connect">Kenalan dengan tim <ArrowUpRight size={18}/></a></div>}
  </section>;
}

function Questions({ still }) {
  const [open, setOpen] = useState(0);
  return <section className="ka-faq ka-section" aria-labelledby="ka-faq-title"><Reveal><span className="ka-micro">04 / GOOD TO KNOW</span><h2 id="ka-faq-title">SEBELUM<br/>MULAI<span>?</span></h2><p>Hal kecil yang sebaiknya jelas<br/>sebelum cerita besar dimulai.</p></Reveal><div className="ka-faq-list">{FAQS.map(([question, answer], index) => <div className={`ka-faq-item ${open === index ? 'is-open' : ''}`} key={question}><h3><button type="button" id={`ka-question-${index}`} aria-expanded={open === index} aria-controls={`ka-answer-${index}`} onClick={() => setOpen(open === index ? null : index)}><span><small>0{index + 1}</small>{question}</span>{open === index ? <Minus size={18}/> : <Plus size={18}/>}</button></h3><AnimatePresence initial={false}>{open === index && <motion.div id={`ka-answer-${index}`} role="region" aria-labelledby={`ka-question-${index}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: still ? 0 : .25, ease: EASE }}><p>{answer}</p></motion.div>}</AnimatePresence></div>)}</div></section>;
}

function Connect() {
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [prepared, setPrepared] = useState('');
  const [status, setStatus] = useState('');
  const prepare = async event => {
    event.preventDefault();
    const message = `Halo tim Kainora! Saya ${name.trim()}, ingin mengenal program affiliate Kainora Kids. Akun ${platform} saya: ${handle.trim()}. Boleh dibagikan informasi syarat kerja sama, tarif komisi, mekanisme penjualan, serta pencairannya? Terima kasih.`;
    setPrepared(message);
    try { await navigator.clipboard.writeText(message); setStatus('Pesan disalin. Buka Instagram Kainora, lalu tempel dan kirim melalui DM.'); }
    catch { setStatus('Pesan siap. Salin teks di bawah, lalu kirim melalui DM Instagram Kainora.'); }
  };
  return <section id="affiliate-connect" className="ka-connect ka-section" aria-labelledby="ka-connect-title"><div className="ka-section-meta"><span>05 / YOUR NEXT CHAPTER</span><span>LET’S MAKE SOMETHING GOOD.</span></div><div className="ka-connect-grid"><Reveal><span className="ka-open-note"><span/>MULAI DARI SEBUAH PERKENALAN</span><h2 id="ka-connect-title">CERITA<br/>BERIKUTNYA<span>.<br/>BERSAMAMU.</span></h2><p>Kami ingin tahu siapa kamu dan apa yang suka kamu buat. Kenalkan akunmu, lalu diskusikan peluang kolaborasi dengan tim Kainora.</p><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="ka-social-handle"><Instagram size={18}/>@kainorakids <ArrowUpRight size={18}/></a></Reveal><Reveal className="ka-connect-form" delay={.1}><form onSubmit={prepare}><div className="ka-form-top"><span className="ka-micro">A LITTLE INTRODUCTION</span><ArrowDownRight size={26}/></div><label htmlFor="ka-name">Nama kamu<input id="ka-name" required maxLength={80} autoComplete="given-name" value={name} placeholder="Panggil aku…" onChange={event => {setName(event.target.value);setPrepared('');setStatus('');}} pattern=".*\S.*"/></label><div className="ka-form-row"><label htmlFor="ka-platform">Platform<select id="ka-platform" value={platform} onChange={event => {setPlatform(event.target.value);setPrepared('');setStatus('');}}><option>Instagram</option><option>TikTok</option><option>YouTube</option><option>Lainnya</option></select></label><label htmlFor="ka-handle">Akun sosialmu<input id="ka-handle" required maxLength={120} autoCapitalize="none" autoCorrect="off" spellCheck="false" placeholder="@username" value={handle} onChange={event => {setHandle(event.target.value);setPrepared('');setStatus('');}} pattern=".*\S.*"/></label></div><button type="submit" className="ka-button ka-button-lime"><span>{prepared ? 'SALIN ULANG PERKENALAN' : 'SIAPKAN PERKENALAN'}<small>untuk dikirim lewat DM</small></span>{prepared ? <Check size={20}/> : <Copy size={20}/>}</button><p className="ka-form-note">Form ini menyiapkan pesan perkenalan. Kirim pesan tersebut lewat DM untuk membicarakan pendaftaran; belum ada pendaftaran otomatis.</p>{status && <p className="ka-copy-status" role="status">{status}</p>}{prepared && <textarea className="ka-prepared-message" aria-label="Pesan perkenalan siap disalin" readOnly value={prepared} rows={5} onFocus={event => event.target.select()}/>}<a className="ka-instagram-link" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">BUKA INSTAGRAM KAINORA <ArrowUpRight size={18}/></a></form></Reveal></div></section>;
}

export const AffiliateView = () => {
  const { products, setView } = useStore();
  const reduce = useMotionPreference();
  const [paused, setPaused] = useState(false);
  const still = reduce || paused;
  const hero = useRef(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 65]);
  const photoRotate = useTransform(scrollYProgress, [0, 1], [3, -3]);
  return <MotionConfig reducedMotion={still ? 'always' : 'user'}><main className={`ka-affiliate ${still ? 'ka-motion-paused' : ''}`}>
    <SEO title="Kainora Creator Club — Program Affiliate & Simulasi Komisi" description="Kenali program affiliate Kainora Kids. Eksplorasi koleksi, simulasikan komisi per produk, dan mulai perkenalan dengan tim Kainora." keywords="affiliate Kainora Kids, creator club, affiliate baju anak, simulasi komisi"canonicalPath="/?view=affiliate" robots="index, follow" />
    <section className="ka-hero ka-section" ref={hero} aria-labelledby="ka-hero-title">
      <div className="ka-hero-meta"><button type="button" onClick={() => setView('home')}><ArrowLeft size={14}/>KAINORA / CREATOR CLUB</button><button type="button" className="ka-motion-toggle" aria-pressed={!still} disabled={reduce} onClick={() => setPaused(value => !value)}>{still ? <Play size={12}/> : <Pause size={12}/>}<span>{reduce ? 'GERAKAN DIKURANGI' : paused ? 'ANIMASI DIJEDA' : 'ANIMASI AKTIF'}</span></button></div>
      <div className="ka-hero-grid"><div className="ka-hero-copy"><span className="ka-micro ka-program-label"><span/>THE KAINORA AFFILIATE PROGRAM</span><h1 id="ka-hero-title" aria-label="Create. Share. Inspire.">{['CREATE.', 'SHARE.', 'INSPIRE.'].map((line, index) => <span className="ka-title-mask" key={line} aria-hidden="true"><motion.span initial={still ? false : { y: '110%', rotate: 3 }} animate={{ y: '0%', rotate: 0 }} transition={{ duration: .9, delay: .1 + index * .12, ease: EASE }}>{line}</motion.span></span>)}</h1><Reveal delay={.3}><p className="ka-hero-description">Cerita kecilmu bisa jadi inspirasi besar.<br/>Bagikan gaya si kecil, temukan peluang bersama Kainora.</p><div className="ka-hero-actions"><a className="ka-button" href="#affiliate-connect">MULAI KOLABORASI <ArrowUpRight size={20}/></a><a href="#affiliate-simulator" className="ka-link">Simulasikan komisi <ArrowDown size={16}/></a></div></Reveal></div>
        <div className="ka-hero-art"><div className="ka-orbit ka-orbit-outer" aria-hidden="true"/><div className="ka-orbit ka-orbit-inner" aria-hidden="true"/><span className="ka-art-cross ka-cross-one" aria-hidden="true">+</span><span className="ka-art-cross ka-cross-two" aria-hidden="true">+</span><motion.div className="ka-main-photo" initial={still ? false : { opacity: 0, y: 55, rotate: -4 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 1.1, delay: .15, ease: EASE }}><motion.figure style={still ? undefined : { y: photoY, rotate: photoRotate }}><img src="/images/kainora-categories/boys.webp" width="1280" height="1280" alt="Inspirasi gaya anak dengan kaos grafis Breakfast Morning Club Kainora" fetchpriority="high"/><figcaption><span>SMALL FITS. BIG STORIES.</span><ArrowUpRight size={18}/></figcaption></motion.figure></motion.div><motion.div className="ka-mini-photo" initial={still ? false : { opacity: 0, y: 60, rotate: 0 }} animate={{ opacity: 1, y: 0, rotate: -9 }} transition={{ duration: 1, delay: .4, ease: EASE }}><img src="/images/kainora-categories/girls.webp" width="1280" height="1280" alt="Inspirasi gaya Kainora Girls"/><span>MADE TO BE YOU. <Plus size={12}/></span></motion.div><div className="ka-creator-stamp"><ArrowUpRight size={28}/><span>YOUR IDEAS.<br/>OUR NEXT<br/><b>STORY.</b></span></div><span className="ka-art-coordinate ka-micro">01 — IN YOUR OWN WAY</span></div>
      </div><div className="ka-hero-foot"><span>IDE YANG PERSONAL. REKOMENDASI YANG BERARTI.</span><a href="#affiliate-about">SCROLL TO EXPLORE <ArrowDown size={15}/></a></div>
    </section>
    <section id="affiliate-about" className="ka-about ka-section" aria-labelledby="ka-about-title"><div className="ka-section-meta"><span>01 / YOUR VOICE MATTERS</span><span>KAINORA KIDS × YOU</span></div><Reveal className="ka-about-heading"><h2 id="ka-about-title">BUKAN SEKADAR<br/>BAGIKAN <span>TAUTAN.</span></h2><p>Tunjukkan apa yang membuat sebuah koleksi terasa dekat. Lewat gaya, detail, dan cerita yang hanya bisa kamu bawakan.</p></Reveal><div className="ka-values">{[{ n: '01', title: 'Motif punya cerita.', text: 'Detail sablon yang bisa jadi awal kontenmu. Ceritakan apa yang menarik perhatianmu.' }, { n: '02', title: 'Gayamu punya ruang.', text: 'Eksplorasi padu padan dan momen sehari-hari. Bawakan rekomendasi dengan suaramu sendiri.' }, { n: '03', title: 'Peluang yang terukur.', text: 'Kenali tarif per produk lewat simulator, lalu konfirmasikan ketentuannya sebelum berkolaborasi.' }].map((item, index) => <Reveal className="ka-value" key={item.n} delay={index * .08}><div><span className="ka-micro">{item.n} /</span><ArrowUpRight size={20}/></div><h3>{item.title}</h3><p>{item.text}</p></Reveal>)}</div></section>
    <Simulator products={products} still={still}/>
    <section className="ka-process ka-section" aria-labelledby="ka-process-title"><div className="ka-section-meta"><span>03 / THE CREATOR LOOP</span><span>DARI IDE KE REKOMENDASI</span></div><div className="ka-process-grid"><Reveal className="ka-process-intro"><h2 id="ka-process-title">GOOD THINGS<br/>START <span>HERE.</span></h2><p>Empat langkah untuk mengenal<br/>perjalanan kolaborasimu.</p><div className="ka-loop-symbol" aria-hidden="true"><span>K</span><ArrowUpRight size={30}/></div><span className="ka-micro">CREATE → SHARE → REPEAT</span></Reveal><div className="ka-steps">{STEPS.map(({ title, label, text, detail, Icon }, index) => <Reveal className="ka-step" key={label} delay={index * .04}><div className="ka-step-number">0{index + 1}</div><div className="ka-step-copy"><span className="ka-micro">{label}</span><h3>{title}</h3><p>{text}</p><small>{detail}</small></div><Icon className="ka-step-icon" size={24}/></Reveal>)}</div></div></section>
    <Questions still={still}/><Connect/>
  </main></MotionConfig>;
};
