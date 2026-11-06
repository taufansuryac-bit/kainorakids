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
  { title: 'Ajukan kerja sama', label: 'HUBUNGI TIM', text: 'Kirim profil akun dan platform Anda kepada tim Kainora. Pelajari ketentuan kerja sama sebelum mulai.', detail: 'PROFIL AKUN & IDE KONTEN', Icon: ArrowUpRight },
  { title: 'Siapkan konten produk', label: 'BUAT KONTEN', text: 'Pilih produk yang sesuai dengan audiens Anda. Buat konten tentang detail motif, potongan, ukuran, atau padu padan pakaian anak.', detail: 'PRODUK & INFORMASI AKURAT', Icon: Plus },
  { title: 'Bagikan rekomendasi', label: 'PUBLIKASIKAN', text: 'Publikasikan konten dan gunakan tautan atau mekanisme rekomendasi yang disepakati. Jelaskan kerja sama secara terbuka.', detail: 'KONTEN + REKOMENDASI', Icon: ArrowRight },
  { title: 'Periksa hasil penjualan', label: 'PERIKSA KOMISI', text: 'Komisi mengikuti transaksi yang memenuhi ketentuan program. Konfirmasikan tarif, validasi pesanan, dan jadwal pencairan bersama tim.', detail: 'TRANSAKSI VALID + KOMISI', Icon: Check },
];
const FAQS = [
  ['Siapa yang bisa mengajukan kerja sama?', 'Kreator konten, orang tua yang suka berbagi inspirasi gaya, atau pemilik akun dengan audiens yang relevan dengan fashion anak. Kirim profil akun dan ide konten Anda untuk ditinjau tim Kainora.'],
  ['Berapa komisi yang bisa saya dapatkan?', 'Persentase simulasi dapat berbeda untuk setiap produk. Pilih produk pada simulator untuk melihat tarifnya. Hasil perhitungan adalah estimasi, bukan jaminan penghasilan. Tarif akhir dan transaksi yang dihitung perlu mengikuti kesepakatan program.'],
  ['Apakah sampel produk diberikan?', 'Ketersediaan sampel dan ketentuannya perlu dibicarakan dengan tim Kainora. Konfirmasikan kebutuhan sampel sebelum menyiapkan konten atau melakukan pembelian.'],
  ['Kontennya harus seperti apa?', 'Contoh konten: detail motif, ide padu padan, unboxing, atau aktivitas sehari-hari. Gunakan informasi produk yang akurat dan ungkapkan hubungan affiliate.'],
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
    <div className="ka-section-meta"><span>SIMULASI KOMISI</span><span>ESTIMASI BERDASARKAN PRODUK</span></div>
    <div className="ka-simulator-heading"><Reveal><h2 id="ka-sim-title">HITUNG<br/><span>ESTIMASI KOMISI.</span></h2></Reveal><p>Pilih produk dan jumlah penjualan<br/>untuk melihat estimasi komisi.</p></div>
    {product && estimate ? <div className="ka-calculator">
      <Reveal className="ka-calculator-controls">
        <label className="ka-input-label" htmlFor="ka-product">PILIH PRODUK</label>
        <select id="ka-product" value={String(product.id)} onChange={event => setProductId(event.target.value)}>{available.map(item => <option value={String(item.id)} key={item.id}>{item.name}</option>)}</select>
        <div className="ka-selected-product"><AnimatePresence mode="wait" initial={false}><motion.img key={product.img} src={product.img} alt={product.name} initial={still ? false : { opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2 }}/></AnimatePresence><div><span className="ka-micro">GRAPHIC TEE / KAINORA KIDS</span><strong>{product.name}</strong><p>{formatPrice(product.price)} <span>/ produk</span></p><span className="ka-rate">{estimate.rate.toLocaleString('id-ID')}% KOMISI SIMULASI</span>{product.catalogPreview && <small>Harga katalog masih pratinjau.</small>}</div></div>
        <div className="ka-quantity-label"><label className="ka-input-label" htmlFor="ka-quantity">JUMLAH PENJUALAN</label><span><b>{quantity}</b> produk</span></div>
        <input id="ka-quantity" type="range" min="1" max="100" value={quantity} style={{ '--range': `${(quantity - 1) / 99 * 100}%` }} onChange={event => setQuantity(Number(event.target.value))} aria-valuetext={`${quantity} produk`}/>
        <div className="ka-quantity-presets">{[1, 10, 25, 50, 100].map(number => <button type="button" key={number} onClick={() => setQuantity(number)} aria-pressed={quantity === number}>{number}<span> produk</span></button>)}</div>
      </Reveal>
      <Reveal className="ka-estimate" delay={.1}><div className="ka-estimate-top"><span className="ka-micro">HASIL SIMULASI</span><ArrowUpRight size={30}/></div><span className="ka-estimate-label">Estimasi total komisi</span><div className="ka-estimate-value"><CommissionNumber value={estimate.total} still={still}/><output className="sr-only" aria-live="polite">{formatPrice(estimate.total)} estimasi komisi untuk {quantity} produk {product.name}</output></div><div className="ka-estimate-rule"/><dl><div><dt>Komisi per penjualan</dt><dd>{formatPrice(estimate.perSale)}</dd></div><div><dt>Jumlah penjualan</dt><dd>{quantity} produk</dd></div><div><dt>Tarif produk</dt><dd>{estimate.rate.toLocaleString('id-ID')}%</dd></div></dl><div className="ka-estimate-note"><span>i</span><p>Simulasi, bukan jaminan penghasilan. Komisi aktual mengikuti transaksi valid dan ketentuan kerja sama. Pembulatan dihitung per produk.</p></div></Reveal>
    </div> : <div className="ka-simulator-empty"><Plus size={30}/><h3>Simulasi sedang disiapkan.</h3><p>Produk akan tampil di sini setelah harga dan tarif komisinya tersedia. Sementara itu, kenali koleksi dan diskusikan kerja sama dengan tim Kainora.</p><a className="ka-link" href="#affiliate-connect">Hubungi tim Kainora <ArrowUpRight size={18}/></a></div>}
  </section>;
}

function Questions({ still }) {
  const [open, setOpen] = useState(0);
  return <section className="ka-faq ka-section" aria-labelledby="ka-faq-title"><Reveal><span className="ka-micro">PERTANYAAN UMUM</span><h2 id="ka-faq-title">TENTANG<br/>AFFILIATE<span></span></h2><p>Informasi komisi, konten,<br/>dan ketentuan kerja sama.</p></Reveal><div className="ka-faq-list">{FAQS.map(([question, answer], index) => <div className={`ka-faq-item ${open === index ? 'is-open' : ''}`} key={question}><h3><button type="button" id={`ka-question-${index}`} aria-expanded={open === index} aria-controls={`ka-answer-${index}`} onClick={() => setOpen(open === index ? null : index)}><span>{question}</span>{open === index ? <Minus size={18}/> : <Plus size={18}/>}</button></h3><AnimatePresence initial={false}>{open === index && <motion.div id={`ka-answer-${index}`} role="region" aria-labelledby={`ka-question-${index}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: still ? 0 : .25, ease: EASE }}><p>{answer}</p></motion.div>}</AnimatePresence></div>)}</div></section>;
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
  return <section id="affiliate-connect" className="ka-connect ka-section" aria-labelledby="ka-connect-title"><div className="ka-section-meta"><span>PENGAJUAN KERJA SAMA</span><span>HUBUNGI KAINORA KIDS</span></div><div className="ka-connect-grid"><Reveal><span className="ka-open-note"><span/>KIRIM PROFIL AKUN ANDA</span><h2 id="ka-connect-title">AJUKAN<br/><span>KERJA SAMA.</span></h2><p>Isi nama dan akun media sosial Anda untuk menyiapkan pesan. Kirim pesan melalui DM Instagram Kainora untuk membahas ketentuan affiliate.</p><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="ka-social-handle"><Instagram size={18}/>@kainorakids <ArrowUpRight size={18}/></a></Reveal><Reveal className="ka-connect-form" delay={.1}><form onSubmit={prepare}><div className="ka-form-top"><span className="ka-micro">DATA PENGAJUAN</span><ArrowDownRight size={26}/></div><label htmlFor="ka-name">Nama lengkap<input id="ka-name" required maxLength={80} autoComplete="given-name" value={name} placeholder="Nama Anda" onChange={event => {setName(event.target.value);setPrepared('');setStatus('');}} pattern=".*\S.*"/></label><div className="ka-form-row"><label htmlFor="ka-platform">Platform<select id="ka-platform" value={platform} onChange={event => {setPlatform(event.target.value);setPrepared('');setStatus('');}}><option>Instagram</option><option>TikTok</option><option>YouTube</option><option>Lainnya</option></select></label><label htmlFor="ka-handle">Akun media sosial<input id="ka-handle" required maxLength={120} autoCapitalize="none" autoCorrect="off" spellCheck="false" placeholder="@username" value={handle} onChange={event => {setHandle(event.target.value);setPrepared('');setStatus('');}} pattern=".*\S.*"/></label></div><button type="submit" className="ka-button ka-button-lime"><span>{prepared ? 'SALIN ULANG PESAN' : 'SIAPKAN PESAN'}<small>untuk dikirim lewat DM</small></span>{prepared ? <Check size={20}/> : <Copy size={20}/>}</button><p className="ka-form-note">Form ini menyiapkan pesan perkenalan. Kirim pesan tersebut lewat DM untuk membicarakan pendaftaran; belum ada pendaftaran otomatis.</p>{status && <p className="ka-copy-status" role="status">{status}</p>}{prepared && <textarea className="ka-prepared-message" aria-label="Pesan perkenalan siap disalin" readOnly value={prepared} rows={5} onFocus={event => event.target.select()}/>}<a className="ka-instagram-link" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">BUKA INSTAGRAM KAINORA <ArrowUpRight size={18}/></a></form></Reveal></div></section>;
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
    <SEO title="Affiliate Fashion Anak & Simulasi Komisi | Kainora Kids" description="Pelajari program affiliate fashion anak Kainora Kids. Lihat simulasi komisi graphic tee per produk dan hubungi tim untuk ketentuan kerja sama." keywords="affiliate Kainora Kids, creator club, affiliate baju anak, simulasi komisi"canonicalPath="/?view=affiliate" robots="index, follow" />
    <section className="ka-hero ka-section" ref={hero} aria-labelledby="ka-hero-title">
      <div className="ka-hero-meta"><button type="button" onClick={() => setView('home')}><ArrowLeft size={14}/>KAINORA / AFFILIATE</button><button type="button" className="ka-motion-toggle" aria-pressed={!still} disabled={reduce} onClick={() => setPaused(value => !value)}>{still ? <Play size={12}/> : <Pause size={12}/>}<span>{reduce ? 'GERAKAN DIKURANGI' : paused ? 'ANIMASI DIJEDA' : 'ANIMASI AKTIF'}</span></button></div>
      <div className="ka-hero-grid"><div className="ka-hero-copy"><span className="ka-micro ka-program-label"><span/>PROGRAM AFFILIATE FASHION ANAK</span><h1 id="ka-hero-title" aria-label="Affiliate Kainora Kids">{['AFFILIATE', 'KAINORA', 'KIDS.'].map((line, index) => <span className="ka-title-mask" key={line} aria-hidden="true"><motion.span initial={still ? false : { y: '110%', rotate: 3 }} animate={{ y: '0%', rotate: 0 }} transition={{ duration: .9, delay: .1 + index * .12, ease: EASE }}>{line}</motion.span></span>)}</h1><Reveal delay={.3}><p className="ka-hero-description">Rekomendasikan graphic tee oversize dan fashion anak.<br/>Pelajari produk, simulasi komisi, dan alur kerja sama Kainora Kids.</p><div className="ka-hero-actions"><a className="ka-button" href="#affiliate-connect">MULAI KOLABORASI <ArrowUpRight size={20}/></a><a href="#affiliate-simulator" className="ka-link">Simulasikan komisi <ArrowDown size={16}/></a></div></Reveal></div>
        <div className="ka-hero-art"><div className="ka-orbit ka-orbit-outer" aria-hidden="true"/><div className="ka-orbit ka-orbit-inner" aria-hidden="true"/><span className="ka-art-cross ka-cross-one" aria-hidden="true">+</span><span className="ka-art-cross ka-cross-two" aria-hidden="true">+</span><motion.div className="ka-main-photo" initial={still ? false : { opacity: 0, y: 55, rotate: -4 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 1.1, delay: .15, ease: EASE }}><motion.figure style={still ? undefined : { y: photoY, rotate: photoRotate }}><img src="/images/kainora-categories/boys.webp" width="1280" height="1280" alt="Inspirasi gaya anak dengan kaos grafis Breakfast Morning Club Kainora" fetchpriority="high"/><figcaption><span>GRAPHIC TEE OVERSIZE ANAK</span><ArrowUpRight size={18}/></figcaption></motion.figure></motion.div><motion.div className="ka-mini-photo" initial={still ? false : { opacity: 0, y: 60, rotate: 0 }} animate={{ opacity: 1, y: 0, rotate: -9 }} transition={{ duration: 1, delay: .4, ease: EASE }}><img src="/images/kainora-categories/girls.webp" width="1280" height="1280" alt="Inspirasi gaya Kainora Girls"/><span>KOLEKSI FASHION ANAK <Plus size={12}/></span></motion.div><div className="ka-creator-stamp"><ArrowUpRight size={28}/><span>PROGRAM<br/><b>AFFILIATE</b></span></div><span className="ka-art-coordinate ka-micro">KAINORA KIDS</span></div>
      </div><div className="ka-hero-foot"><span>REKOMENDASI PRODUK FASHION ANAK</span><a href="#affiliate-about">PELAJARI PROGRAM <ArrowDown size={15}/></a></div>
    </section>
    <section id="affiliate-about" className="ka-about ka-section" aria-labelledby="ka-about-title"><div className="ka-section-meta"><span>TENTANG PROGRAM</span><span>AFFILIATE KAINORA KIDS</span></div><Reveal className="ka-about-heading"><h2 id="ka-about-title">REKOMENDASI<br/><span>FASHION ANAK.</span></h2><p>Buat rekomendasi produk berdasarkan detail motif, bahan, potongan, dan ukuran. Gunakan informasi katalog serta jelaskan hubungan affiliate kepada audiens Anda.</p></Reveal><div className="ka-values">{[{ n: '01', title: 'Pilihan motif grafis', text: 'Tampilkan motif dan detail sablon sesuai produk yang direkomendasikan.' }, { n: '02', title: 'Ide padu padan anak', text: 'Berikan contoh padu padan kaos dengan celana atau bawahan yang sesuai.' }, { n: '03', title: 'Simulasi komisi produk', text: 'Kenali tarif per produk lewat simulator, lalu konfirmasikan ketentuannya sebelum berkolaborasi.' }].map((item, index) => <Reveal className="ka-value" key={item.n} delay={index * .08}><div><ArrowUpRight size={20}/></div><h3>{item.title}</h3><p>{item.text}</p></Reveal>)}</div></section>
    <Simulator products={products} still={still}/>
    <section className="ka-process ka-section" aria-labelledby="ka-process-title"><div className="ka-section-meta"><span>ALUR KERJA SAMA</span><span>DARI IDE KE REKOMENDASI</span></div><div className="ka-process-grid"><Reveal className="ka-process-intro"><h2 id="ka-process-title">CARA<br/><span>BERGABUNG.</span></h2><p>Pelajari langkah pengajuan,<br/>pembuatan konten, dan komisi.</p><div className="ka-loop-symbol" aria-hidden="true"><span>K</span><ArrowUpRight size={30}/></div><span className="ka-micro">AJUKAN → BUAT KONTEN → EVALUASI</span></Reveal><div className="ka-steps">{STEPS.map(({ title, label, text, detail, Icon }, index) => <Reveal className="ka-step" key={label} delay={index * .04}><div className="ka-step-number">{index + 1}</div><div className="ka-step-copy"><span className="ka-micro">{label}</span><h3>{title}</h3><p>{text}</p><small>{detail}</small></div><Icon className="ka-step-icon" size={24}/></Reveal>)}</div></div></section>
    <Questions still={still}/><Connect/>
  </main></MotionConfig>;
};
