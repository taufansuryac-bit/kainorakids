import test from 'node:test';
import assert from 'node:assert/strict';
import { seal, unseal, checkMutation } from '../server/admin/security.js';
import { publishGitContent,readGitContent } from '../server/admin/github.js';
import { handleAdmin } from '../server/admin/handler.js';
const secret = 'test-only-session-secret-with-at-least-32-characters';
test('encrypted session rejects tamper and expiry without revealing the token', async () => {
  const cookie = await seal({ token: 'test-token', expires: Date.now() + 5000 }, secret);
  assert.ok(!cookie.includes('test-token'));
  assert.equal((await unseal(cookie, secret)).token, 'test-token');
  assert.equal(await unseal(cookie.slice(0,-8)+'aaaaaaaa',secret), null);
  assert.equal(await unseal(await seal({ expires: 1 }, secret), secret), null);
});
test('cross-origin or missing CSRF cannot mutate content', () => {
  const session = { csrf: 'expected' };
  for (const headers of [{}, { origin:'https://evil.example','x-csrf-token':'expected' }, {origin:'https://kainorakids.com','x-csrf-token':'wrong'}]) assert.throws(() => checkMutation(new Request('https://kainorakids.com/api/admin/content',{method:'POST',headers}),session,'https://kainorakids.com'));
  assert.doesNotThrow(() => checkMutation(new Request('https://kainorakids.com/api/admin/content',{method:'POST',headers:{origin:'https://kainorakids.com','x-csrf-token':'expected'}}),session,'https://kainorakids.com'));
});
test('unconfigured production stays locked and never invokes network', async () => {
  const response = await handleAdmin(new Request('https://kainorakids.com/api/admin/content'), {}, {fetcher:()=>{throw new Error('network must not run');}});
  assert.equal(response.status,503);
  const session = await handleAdmin(new Request('https://kainorakids.com/api/admin/session'), {});
  assert.equal((await session.json()).configured,false);
});
test('stale revision rejects publish before creating blobs', async () => {
  const calls=[];
  const fetcher = async (url,init={}) => { calls.push([url,init.method||'GET']); const body=url.includes('/git/ref/')?{object:{sha:'head'}}:url.includes('/git/commits/')?{tree:{sha:'tree'}}:{sha:'new-revision',content:btoa('{"version":1,"products":[],"highlights":[],"garments":[]}'),encoding:'base64'}; return Response.json(body); };
  await assert.rejects(()=>publishGitContent({ version:1,products:[],highlights:[],garments:[] },[], 'old-revision','test-token',{ADMIN_REPO:'owner/repo',ADMIN_BRANCH:'main'},fetcher),/berubah/);
  assert.ok(calls.every(([,method])=>method==='GET'));
});
test('publish commits content and images through one non-forced branch update', async () => {
  const calls=[]; let n=0;
  const fetcher = async (url,init={}) => { const body=init.body?JSON.parse(init.body):null;calls.push({url,method:init.method||'GET',body});let data;
    if(url.includes('/git/ref/')) data={object:{sha:'head'}};
    else if(url.includes('/git/commits/head')) data={tree:{sha:'tree'}};
    else if(url.includes('/contents/')) data={sha:'revision',content:btoa('{"version":1,"products":[],"highlights":[],"garments":[]}'),encoding:'base64'};
    else data={sha:`result${++n}`};
    return Response.json(data);
  };
  const result=await publishGitContent({version:1,products:[],highlights:[],garments:[]},[],'revision','test-token',{ADMIN_REPO:'owner/repo',ADMIN_BRANCH:'main'},fetcher);
  assert.ok(result.commit);
  const updates=calls.filter(call=>call.method==='PATCH');assert.equal(updates.length,1);assert.equal(updates[0].body.force,false);
  assert.deepEqual(calls.find(call=>call.method==='POST'&&call.url.endsWith('/git/commits')).body.parents,['head']);
});
const configured={ADMIN_REPO:'owner/repo',ADMIN_BRANCH:'main',ADMIN_ORIGIN:'https://kainorakids.com',ADMIN_GITHUB_USER_IDS:'123',ADMIN_SESSION_SECRET:secret,GITHUB_CLIENT_ID:'unit-client-id',GITHUB_CLIENT_SECRET:'unit-client-secret'};
test('OAuth uses PKCE, rejects changed state before exchange, and rejects unlisted users',async()=>{
  const response=await handleAdmin(new Request('https://kainorakids.com/api/admin/login'),configured);
  assert.equal(response.status,302);
  const location=new URL(response.headers.get('location')), cookie=response.headers.get('set-cookie').split(';')[0];
  assert.equal(location.searchParams.get('code_challenge_method'),'S256');assert.ok(location.searchParams.get('code_challenge'));
  const state=await unseal(cookie.split('=').slice(1).join('='),secret);assert.equal(state.state,location.searchParams.get('state'));assert.ok(state.verifier);
  const invalid=await handleAdmin(new Request('https://kainorakids.com/api/admin/callback?code=unit-code&state=wrong',{headers:{cookie}}),configured,{fetcher:()=>{throw new Error('must not exchange');}});assert.equal(invalid.status,400);
  const calls=[];
  const fetcher=async(url,init)=>{calls.push({url,body:init.body});return Response.json(url.includes('access_token')?{access_token:'unit-token',expires_in:28800}:{id:999,login:'not-allowed'});};
  const rejected=await handleAdmin(new Request(`https://kainorakids.com/api/admin/callback?code=unit-code&state=${state.state}`,{headers:{cookie}}),configured,{fetcher});
  assert.equal(rejected.status,403);assert.equal(JSON.parse(calls[0].body).code_verifier,state.verifier);assert.equal(calls.length,2);assert.ok(!rejected.headers.get('set-cookie').includes('unit-token'));
});
test('authenticated session response never returns provider token; mutation requires CSRF',async()=>{
  const value=await seal({token:'unit-token',userId:'123',login:'owner',csrf:'unit-csrf',expires:Date.now()+5000},secret),cookie=`kainora_admin=${value}`;
  const response=await handleAdmin(new Request('https://kainorakids.com/api/admin/session',{headers:{cookie}}),configured);
  const body=await response.json();assert.equal(body.authenticated,true);assert.equal(body.csrf,'unit-csrf');assert.equal(body.token,undefined);
  const denied=await handleAdmin(new Request('https://kainorakids.com/api/admin/content',{method:'POST',headers:{cookie,origin:'https://evil.example','x-csrf-token':'unit-csrf','content-type':'application/json'},body:'{}'}),configured,{fetcher:()=>{throw new Error('must not write');}});assert.equal(denied.status,403);
  const preview=await handleAdmin(new Request('https://preview.pages.dev/api/admin/session',{headers:{cookie}}),configured);assert.equal(preview.status,403);
});
test('large catalogue uses immutable Git blob when Contents API omits base64',async()=>{
  const content={version:1,products:[],highlights:[],garments:[]},calls=[];
  const fetcher=async(url)=>{calls.push(url);return Response.json(url.includes('/contents/')?{sha:'large-blob',content:'',encoding:'none'}:{sha:'large-blob',content:btoa(JSON.stringify(content)),encoding:'base64'});};
  const result=await readGitContent('unit-token',configured,fetcher);assert.deepEqual(result.content,content);assert.equal(result.revision,'large-blob');assert.ok(calls[1].endsWith('/git/blobs/large-blob'));
});
