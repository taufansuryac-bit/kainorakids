import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { arrivalViews } from '../../../shared/contentSchema';

const views = [['front', 'Depan'], ['back', 'Belakang'], ['side', 'Samping']];

export function ArrivalEditor({ item, products, onSave, onClose, onUpload, resolveMedia }) {
  const [form, setForm] = useState(item), [busy, setBusy] = useState(''), [error, setError] = useState('');
  const presentation = arrivalViews(form);
  const set = (key, value) => setForm(previous => ({ ...previous, [key]: value }));
  const upload = async (view, file) => {
    if (!file) return;
    setBusy(view); setError('');
    try { set(view, await onUpload(file, 'arrival')); } catch (error) { setError(error.message); } finally { setBusy(''); }
  };
  return <section className="ca-editor" aria-labelledby="arrival-editor-title">
    <div className="ca-editor-heading"><div><small>EDITOR NEW ARRIVAL</small><h2 id="arrival-editor-title">{item.name ? 'Edit New Arrival' : 'New Arrival baru'}</h2></div><button type="button" aria-label="Tutup editor New Arrival" onClick={onClose}><X /></button></div>
    <form onSubmit={event => { event.preventDefault(); if (!presentation.views.length) { setError('Upload minimal satu gambar depan atau belakang.'); return; } onSave({ ...form, initialView: presentation.initialView }); }}>
      <div className="ca-form-grid"><label>Nama New Arrival<input required maxLength={120} value={form.name} onChange={event => set('name', event.target.value)} /></label><label>Warna template<select value={form.color} onChange={event => set('color', event.target.value)}><option value="black">Hitam</option><option value="white">Putih</option></select></label></div>
      <label>Keterangan singkat<textarea maxLength={500} rows={2} value={form.description} onChange={event => set('description', event.target.value)} /></label>
      <label>Tampak awal<select value={presentation.initialView || 'front'} onChange={event => set('initialView', event.target.value)} disabled={!presentation.views.length}><option value="front" disabled={!form.front}>Depan</option><option value="back" disabled={!form.back}>Belakang</option></select><small>Sisi yang pertama ditampilkan di beranda dan saat diperbesar. Tombol Depan / Belakang muncul jika kedua gambarnya tersedia.</small></label>
      <label>Produk katalog untuk tombol detail (opsional)<select value={form.productId || ''} onChange={event => set('productId', event.target.value)}><option value="">Belum terhubung ke katalog</option>{products.map(product => <option key={product.id} value={String(product.id)}>{product.name}</option>)}</select><small>Harga, ukuran, dan tombol detail mengikuti produk ini. Sesuaikan tautan setelah mengganti desain kaos.</small></label>
      <div className="ca-editor-actions">{['black','white'].map(color => <button type="button" key={color} onClick={() => setForm(previous => ({ ...previous, color, ...Object.fromEntries(views.map(([view]) => [view, `/images/new-arrival/templates/${color}-${view}.png`])) }))}>Gunakan template polos {color === 'black' ? 'hitam' : 'putih'}</button>)}</div>
      <p className="ca-note">Upload gambar depan, belakang, atau keduanya. Gambar samping opsional. Pertahankan kanvas 1024 × 1536 px, posisi hook dan ukuran kaos agar transisinya konsisten. PNG harus transparan dan sudah menyertakan hanger kayu; jangan sertakan batang rail.</p>
      <div className="ca-arrival-views">{views.map(([key, label]) => <div key={key}><strong>Tampak {label.toLowerCase()}{key === 'side' ? ' (opsional)' : ''}</strong><div className="ca-arrival-image">{form[key] ? <img src={resolveMedia(form[key])} alt={`${form.name || 'Kaos'}, tampak ${label.toLowerCase()}`} /> : <span>PNG belum dipilih</span>}</div><label className="ca-upload"><Upload size={15} />{busy === key ? 'Memproses…' : `Ganti PNG ${label.toLowerCase()}`}<input type="file" accept="image/png" disabled={!!busy} onChange={event => { upload(key, event.target.files[0]); event.target.value = ''; }} /></label>{form[key] && <><a className="ca-text-button" href={resolveMedia(form[key])} download={`${form.id}-${key}.png`}>Unduh PNG {label.toLowerCase()}</a><button className="ca-text-button" type="button" disabled={!!busy} onClick={() => set(key, '')}>Hapus gambar {label.toLowerCase()}</button></>}</div>)}</div>
      {error && <p className="ca-error" role="alert">{error}</p>}<div className="ca-editor-actions"><button type="button" onClick={onClose}>Batal</button><button className="ca-primary" type="submit" disabled={!!busy}>Simpan ke draft</button></div>
    </form>
  </section>;
}
