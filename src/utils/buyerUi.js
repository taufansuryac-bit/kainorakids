import { canOrder, priceKnown } from './pricing.js';

export function buyerCartSummary(cart) {
  return { count: cart.reduce((sum, item) => sum + (Number.isInteger(item.qty) && item.qty > 0 ? item.qty : 0), 0),
    subtotal: cart.reduce((sum, item) => sum + (priceKnown(item.price) && Number.isInteger(item.qty) && item.qty > 0 ? item.price * item.qty : 0), 0),
    ready: cart.length > 0 && cart.every(item => !item.catalogPreview && canOrder(item, item.size, item.color) && Number.isInteger(item.qty) && item.qty > 0 && item.qty <= 99 && (item.stock === undefined || item.qty <= item.stock)) };
}
export function buyerProfileFields(form) {
  const fields = Object.fromEntries(['name', 'phone', 'address', 'kodepos', 'gender'].map(key => [key, String(form[key] || '').trim()]));
  if (fields.name.length < 2 || fields.name.length > 200) throw new Error('Nama harus terdiri dari 2–200 karakter.');
  if (fields.phone && !/^\+?[\d\s()-]{8,20}$/.test(fields.phone)) throw new Error('Periksa nomor WhatsApp, misalnya 081234567890.');
  if (fields.kodepos && !/^\d{5}$/.test(fields.kodepos)) throw new Error('Kode pos harus terdiri dari 5 angka.');
  if (fields.address.length > 2000) throw new Error('Alamat terlalu panjang. Maksimal 2.000 karakter.');
  if (!['bunda', 'ayah'].includes(fields.gender)) throw new Error('Pilih panggilan profil.');
  return fields;
}
export function buyerAuthError(code) {
  return ({ 'auth/email-already-in-use': 'Email ini sudah terdaftar. Silakan masuk ke akun Anda.',
    'auth/invalid-credential': 'Email atau kata sandi belum sesuai. Periksa lalu coba kembali.',
    'auth/wrong-password': 'Email atau kata sandi belum sesuai. Periksa lalu coba kembali.',
    'auth/user-not-found': 'Email atau kata sandi belum sesuai. Periksa lalu coba kembali.',
    'auth/weak-password': 'Gunakan kata sandi minimal 6 karakter.',
    'auth/invalid-email': 'Masukkan alamat email yang valid.',
    'auth/too-many-requests': 'Terlalu banyak percobaan. Tunggu sebentar sebelum mencoba lagi.',
    'auth/network-request-failed': 'Koneksi belum tersambung. Periksa internet Anda dan coba kembali.',
    'auth/popup-closed-by-user': 'Jendela Google ditutup. Anda dapat mencoba kembali.',
    'auth/popup-blocked': 'Browser memblokir jendela Google. Izinkan popup lalu coba kembali.' })[code] || 'Proses belum berhasil. Silakan coba kembali beberapa saat lagi.';
}
