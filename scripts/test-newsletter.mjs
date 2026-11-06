import test from 'node:test';
import assert from 'node:assert/strict';
import { handleNewsletter } from '../server/newsletter/handler.js';

const env={BREVO_API_KEY:'private-test-key',BREVO_NEWSLETTER_LIST_ID:'12',BREVO_NEWSLETTER_DOI_TEMPLATE_ID:'34',NEWSLETTER_TURNSTILE_SITE_KEY:'public-site-key',NEWSLETTER_TURNSTILE_SECRET_KEY:'private-challenge-key'};
const request=(body={},origin='https://kainorakids.com')=>new Request('https://kainorakids.com/api/newsletter',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({email:'buyer@example.com',consent:true,token:'challenge-token',website:'',...body})});
test('unconfigured service is explicit and does not accept an email or expose keys',async()=>{
  const config=await handleNewsletter(new Request('https://kainorakids.com/api/newsletter'),env);
  const publicConfig=await config.json();
  assert.deepEqual(publicConfig,{configured:true,siteKey:'public-site-key'});
  assert.equal(JSON.stringify(publicConfig).includes('private-'),false);
  assert.equal((await handleNewsletter(request(),{})).status,503);
});
test('invalid, non-consenting, cross-origin, oversized and bot submissions never reach the email provider',async()=>{
  let calls=0;const network=async()=>{calls++;throw new Error('unexpected network');};
  for(const body of [{email:'invalid'},{consent:false},{token:''},{website:'spam'},{email:'x'.repeat(300)+'@example.com'}])assert.ok((await handleNewsletter(request(body),env,network)).status>=400);
  assert.equal((await handleNewsletter(request({},'https://other.example'),env,network)).status,403);
  assert.equal((await handleNewsletter(request({extra:'x'.repeat(5000)}),env,network)).status,413);
  assert.equal(calls,0);
});
test('only a validated challenge can request double opt-in and the response does not claim subscription is complete',async()=>{
  const calls=[];
  const network=async(url,options)=>{
    calls.push({url,options});
    return url.includes('siteverify') ? Response.json({success:true,action:'newsletter',hostname:'kainorakids.com'}) : new Response(null,{status:201});
  };
  const response=await handleNewsletter(request({email:' BUYER@EXAMPLE.COM '}),env,network);
  assert.equal(response.status,202);
  assert.deepEqual(await response.json(),{status:'confirmation_required'});
  const body=JSON.parse(calls[1].options.body);
  assert.equal(calls[1].url,'https://api.brevo.com/v3/contacts/doubleOptinConfirmation');
  assert.equal(body.email,'buyer@example.com');
  assert.deepEqual(body.includeListIds,[12]);
  assert.equal(body.templateId,34);
  assert.equal(calls[1].options.headers['api-key'],'private-test-key');
});
test('failed challenges and email provider failures do not become fake success',async()=>{
  const rejected=async()=>Response.json({success:false});
  assert.equal((await handleNewsletter(request(),env,rejected)).status,400);
  const wrongHost=async()=>Response.json({success:true,action:'newsletter',hostname:'other.example'});
  assert.equal((await handleNewsletter(request(),env,wrongHost)).status,400);
  const failed=async(url)=>url.includes('siteverify')?Response.json({success:true,action:'newsletter',hostname:'kainorakids.com'}):new Response('private provider error',{status:500});
  const response=await handleNewsletter(request(),env,failed);
  assert.equal(response.status,502);
  assert.equal((await response.text()).includes('private provider error'),false);
});
