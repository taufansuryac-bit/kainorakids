import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createLocalAdmin} from '../tools/admin-local.js';
test('local editor rejects LAN, spoofed origin and stale saves; writes survive a new adapter',async()=>{
  const root=await mkdtemp(path.join(tmpdir(),'kainora-admin-test-'));
  const content={version:1,products:[],highlights:[],garments:[]};
  try {
    await mkdir(path.join(root,'src/content'),{recursive:true});await writeFile(path.join(root,'src/content/store.json'),JSON.stringify(content));
    const admin=createLocalAdmin(root);
    const req=(route,options={})=>new Request(`http://127.0.0.1:5174/api/admin/${route}`,options);
    assert.equal((await admin(req('session'),'192.168.0.5')).status,403);
    assert.equal((await admin(new Request('http://evil.test:5174/api/admin/session'),'127.0.0.1')).status,403);
    const session=await (await admin(req('session'),'127.0.0.1')).json();assert.equal(session.mode,'local');
    const snapshot=await (await admin(req('content'),'127.0.0.1')).json();
    const body=JSON.stringify({content,uploads:[],revision:snapshot.revision});
    const headers={'content-type':'application/json',origin:'http://127.0.0.1:5174','x-csrf-token':session.csrf};
    assert.equal((await admin(req('content',{method:'POST',headers:{...headers,origin:'https://evil.test'},body}),'127.0.0.1')).status,403);
    const result=await admin(req('content',{method:'POST',headers,body}),'127.0.0.1');assert.equal(result.status,200);
    const saved=JSON.parse(await readFile(path.join(root,'src/content/store.json'),'utf8'));assert.deepEqual(saved,content);
    const reopened=createLocalAdmin(root);assert.deepEqual((await (await reopened(req('content'),'127.0.0.1')).json()).content,content);
    const stale=await admin(req('content',{method:'POST',headers,body:JSON.stringify({content,uploads:[],revision:'stale'})}),'127.0.0.1');assert.equal(stale.status,409);
  } finally {await rm(root,{recursive:true,force:true});}
});
