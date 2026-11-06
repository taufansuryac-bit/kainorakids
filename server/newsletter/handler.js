const json = (body, status = 200) => Response.json(body, {status, headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const positiveId = value => /^\d+$/.test(String(value || '')) && Number.isSafeInteger(Number(value)) && Number(value) > 0;
const configured = env => Boolean(env.BREVO_API_KEY && positiveId(env.BREVO_NEWSLETTER_LIST_ID) && positiveId(env.BREVO_NEWSLETTER_DOI_TEMPLATE_ID) && env.NEWSLETTER_TURNSTILE_SITE_KEY && env.NEWSLETTER_TURNSTILE_SECRET_KEY);

async function readBody(request) {
  const reader = request.body?.getReader();
  if (!reader) throw Object.assign(new Error('Data formulir belum lengkap.'),{status:400});
  const chunks=[]; let size=0;
  while (true) {
    const {done,value}=await reader.read();
    if (done) break;
    size+=value.byteLength;
    if (size>4096) {await reader.cancel();throw Object.assign(new Error('Data formulir terlalu panjang.'),{status:413});}
    chunks.push(value);
  }
  const bytes=new Uint8Array(size);let offset=0;
  for (const chunk of chunks) {bytes.set(chunk,offset);offset+=chunk.byteLength;}
  try {return JSON.parse(new TextDecoder().decode(bytes));}
  catch {throw Object.assign(new Error('Data formulir tidak valid.'),{status:400});}
}

export async function handleNewsletter(request, env = {}, network = fetch) {
  const url=new URL(request.url);
  if (request.method==='GET') return json({configured:configured(env),...(configured(env)?{siteKey:env.NEWSLETTER_TURNSTILE_SITE_KEY}:{})});
  if (request.method!=='POST') return json({error:'Metode tidak tersedia.'},405);
  if (request.headers.get('Origin')!==url.origin) return json({error:'Permintaan tidak diizinkan.'},403);
  if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) return json({error:'Format formulir tidak valid.'},415);
  try {
    const body=await readBody(request);
    if (!body || typeof body!=='object' || Array.isArray(body)) return json({error:'Data formulir tidak valid.'},400);
    const email=typeof body.email==='string'?body.email.trim().toLowerCase():'';
    if (email.length>254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) || body.consent!==true || body.website || typeof body.token!=='string' || !body.token || body.token.length>2048) return json({error:'Periksa alamat email, persetujuan, dan verifikasi formulir.'},400);
    if (!configured(env)) return json({error:'Pendaftaran newsletter belum dibuka. Silakan kembali nanti.'},503);
    const challenge=await network('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:env.NEWSLETTER_TURNSTILE_SECRET_KEY,response:body.token}),signal:AbortSignal.timeout(10000)});
    const verified=await challenge.json();
    if (!challenge.ok || !verified.success || verified.action!=='newsletter' || verified.hostname!==url.hostname) return json({error:'Verifikasi belum berhasil. Silakan coba kembali.'},400);
    const result=await network('https://api.brevo.com/v3/contacts/doubleOptinConfirmation',{method:'POST',headers:{'api-key':env.BREVO_API_KEY,'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({email,includeListIds:[Number(env.BREVO_NEWSLETTER_LIST_ID)],templateId:Number(env.BREVO_NEWSLETTER_DOI_TEMPLATE_ID),redirectionUrl:new URL('/blog/#newsletter',url.origin).href}),signal:AbortSignal.timeout(10000)});
    if (!result.ok) return json({error:'Permintaan belum dapat diproses. Silakan coba kembali nanti.'},502);
    // A DOI request is not an active subscription: the visitor must confirm in email.
    return json({status:'confirmation_required'},202);
  } catch (error) {
    return json({error:error.status?error.message:'Layanan newsletter belum dapat dihubungi. Silakan coba kembali.'},error.status||502);
  }
}
