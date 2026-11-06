import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { DEFAULT_PROMOTIONS, PROMOTION_IMAGES } from '../../content/promotionImages';
import './promotion-editor.css';

async function stagePublicImage(image, onUpload) {
  const response = await fetch(image);
  if (!response.ok) throw new Error('Gambar pilihan belum dapat dimuat. Coba kembali.');
  return onUpload(new File([await response.blob()], image.split('/').at(-1), { type: 'image/webp' }), false);
}

export function PromotionList({ items, resolveMedia, onEdit, onInitialize, onUpload }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const initialize = async () => {
    setBusy(true);setError('');
    try { const entries = [];for (const item of DEFAULT_PROMOTIONS) entries.push({ ...item, image: await stagePublicImage(item.image, onUpload) });onInitialize(entries); }
    catch (error) { setError(error.message); }
    finally { setBusy(false); }
  };
  if (!items?.length) return <div className="ca-empty"><p>Banner promosi belum diaktifkan.</p><button type="button" className="ca-primary" disabled={busy} onClick={initialize}>{busy ? 'Menyiapkan banner…' : 'Tambahkan dua banner'}</button>{error && <p className="ca-error" role="alert">{error}</p>}</div>;
  return <div className="ca-promotion-grid">{items.map((item, index) => <article className="ca-promotion-card" key={item.id}><button type="button" className="ca-promotion-preview" aria-label={`Edit gambar ${index === 0 ? 'kiri' : 'kanan'}`} onClick={() => onEdit(item, index)}><img src={resolveMedia(item.image)} alt={item.alt} /></button><div className="ca-promotion-copy"><small>GAMBAR {index === 0 ? 'KIRI' : 'KANAN'} / 16:9</small><h2>{item.alt}</h2><button type="button" onClick={() => onEdit(item, index)}>Ganti gambar {index === 0 ? 'kiri' : 'kanan'}</button></div></article>)}</div>;
}

export function PromotionEditor({ item, slot, onSave, onClose, onUpload, resolveMedia }) {
  const [form, setForm] = useState(() => ({ ...item }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const choosePublic = async image => {
    const option = PROMOTION_IMAGES.find(option => option.image === image);
    if (!option) return;
    setBusy(true);setError('');
    try { const image = await stagePublicImage(option.image, onUpload);setForm(previous => ({ ...previous, image, alt: option.alt })); }
    catch (error) { setError(error.message); }
    finally { setBusy(false); }
  };
  const upload = async event => {
    const file = event.target.files?.[0];event.target.value = '';
    if (!file) return;
    setBusy(true);setError('');
    try { const image = await onUpload(file, false);setForm(previous => ({ ...previous, image })); }
    catch (error) { setError(error.message); }
    finally { setBusy(false); }
  };
  return <section className="ca-editor" aria-labelledby="promotion-editor-title"><div className="ca-editor-heading"><div><small>BANNER PROMOSI / {slot === 0 ? 'KIRI' : 'KANAN'}</small><h2 id="promotion-editor-title">Ganti gambar promosi.</h2></div><button type="button" disabled={busy} onClick={onClose} aria-label="Tutup editor promosi"><X /></button></div>
    <form onSubmit={event => { event.preventDefault();if (!busy) onSave(form); }}>
      <div className="ca-promotion-preview"><img src={resolveMedia(form.image)} alt={form.alt || 'Pratinjau banner promosi'} /></div>
      <p className="ca-note">Rasio tampilan 16:9 per gambar, tinggi maksimal 500 px. Disarankan gambar 1600 × 900 px. Gambar lain akan dipotong dari tengah agar memenuhi panel.</p>
      <label>Gambar yang tersedia<select disabled={busy} value={PROMOTION_IMAGES.some(option => option.image === form.image) ? form.image : ''} onChange={event => choosePublic(event.target.value)}><option value="" disabled>Gambar terpilih atau hasil upload</option>{PROMOTION_IMAGES.map(option => <option key={option.image} value={option.image}>{option.label}</option>)}</select></label>
      <label className="ca-upload"><Upload size={17} />{busy ? 'Menyiapkan gambar…' : 'Upload gambar promosi'}<input type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={upload} /></label>
      <label>Deskripsi gambar<input required maxLength={180} disabled={busy} value={form.alt} onChange={event => setForm(previous => ({ ...previous, alt: event.target.value }))} /><small>Jelaskan gambar untuk pembaca layar. Deskripsi ini tidak ditampilkan di atas gambar.</small></label>
      {error && <p className="ca-error" role="alert">{error}</p>}<div className="ca-editor-actions"><button type="button" disabled={busy} onClick={onClose}>Batal</button><button type="submit" className="ca-primary" disabled={busy}>Simpan ke draft</button></div>
    </form>
  </section>;
}
