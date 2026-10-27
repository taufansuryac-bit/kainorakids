const encoder = new TextEncoder();
export const randomToken = () => base64url(crypto.getRandomValues(new Uint8Array(32)));
export function base64url(bytes) { return btoa(String.fromCharCode(...bytes)).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,''); }
const decode = value => Uint8Array.from(atob(value.replaceAll('-','+').replaceAll('_','/')), char => char.charCodeAt(0));
async function keyFor(secret) {
  if (typeof secret !== 'string' || secret.length < 32) throw new Error('Kunci sesi belum dikonfigurasi.');
  return crypto.subtle.importKey('raw',await crypto.subtle.digest('SHA-256',encoder.encode(secret)),{name:'AES-GCM'},false,['encrypt','decrypt']);
}
export async function seal(value, secret) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({name:'AES-GCM',iv},await keyFor(secret),encoder.encode(JSON.stringify(value)));
  return `${base64url(iv)}.${base64url(new Uint8Array(encrypted))}`;
}
export async function unseal(value, secret) {
  try {
    if (!value || value.length > 3500) return null;
    const [iv,data] = value.split('.');
    const plain = await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(iv)},await keyFor(secret),decode(data));
    const result = JSON.parse(new TextDecoder().decode(plain));
    return result.expires > Date.now() ? result : null;
  } catch { return null; }
}
export function cookieValue(request, name) {
  return (request.headers.get('cookie') || '').split(';').map(part=>part.trim()).find(part=>part.startsWith(`${name}=`))?.slice(name.length+1) || '';
}
export function sessionCookie(name, value, seconds = 28800) {
  return `${name}=${value}; Path=/api/admin; HttpOnly; Secure; SameSite=Lax; Max-Age=${seconds}`;
}
export function checkMutation(request, session, origin) {
  if (request.headers.get('origin') !== origin || !session?.csrf || request.headers.get('x-csrf-token') !== session.csrf) throw Object.assign(new Error('Permintaan tidak diizinkan. Muat ulang panel admin.'),{status:403});
}
export const json = (data, status = 200, headers = {}) => Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer',...headers}});
