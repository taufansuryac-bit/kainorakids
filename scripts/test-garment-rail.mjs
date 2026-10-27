import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {validateContent} from '../shared/contentSchema.js';
import {visibleGarments,railOffset,railCameraYaw,garmentYaw,garmentSeed} from '../src/components/fashion/garmentRail.js';
import { Group, Mesh, MeshStandardMaterial, PlaneGeometry, Texture } from 'three';
import {createWindGarment} from '../src/components/fashion/garmentWind.js';
import {GARMENT_PRINT_LAYOUT} from '../src/constants/garmentPrintLayout.js';
test('empty/single collection never fabricates shirts; large collection mounts at most five',()=>{
  assert.deepEqual(visibleGarments([],0),[]);
  assert.equal(visibleGarments([{id:'one'}],123).length,1);
  const entries=Array.from({length:20},(_,i)=>({id:String(i)}));
  for(const cursor of [-22,-1,0,7,40]) {const shown=visibleGarments(entries,cursor);assert.equal(shown.length,5);assert.equal(new Set(shown.map(x=>x.entry.id)).size,5);assert.ok(shown.some(x=>Math.abs(railOffset(x.index,cursor,20))<.001));}
});

test('side preview turns toward the eye consistently on either side of the carousel',()=>{
  assert.ok(Math.abs(railCameraYaw(0,0,3.65))<1e-12);
  assert.equal(railCameraYaw(-2,-.8,3.65),-railCameraYaw(2,-.8,3.65));
  for(const x of [-4,-2,2,4]) {
    const yaw=railCameraYaw(x,-.8,3.65);
    const length=Math.hypot(x,4.45);
    assert.ok(Math.abs(Math.sin(yaw)-(-x/length))<1e-12);
    assert.ok(Math.abs(Math.cos(yaw)-(4.45/length))<1e-12);
  }
});

test('ink uses the cloth material with independent front/back state and retains template geometry',()=>{
  const source=new Group(),geometry=new PlaneGeometry(1,1),base=new MeshStandardMaterial();
  source.add(new Mesh(geometry,base));
  const texture=new Texture();
  const frontOnly=createWindGarment(source,1,'black',{front:{texture,layout:GARMENT_PRINT_LAYOUT.frontLarge}});
  const twoSides=createWindGarment(source,2,'white',{back:{texture,layout:GARMENT_PRINT_LAYOUT.back}});
  assert.equal(frontOnly.object.children.length,1);
  assert.equal(frontOnly.object.children[0].geometry,geometry);
  assert.notEqual(frontOnly.object.children[0].material,base);
  const a=frontOnly.object.children[0].material.userData.kainoraPrints;
  const b=twoSides.object.children[0].material.userData.kainoraPrints;
  assert.equal(a.uKainoraFrontEnabled.value,1);assert.equal(a.uKainoraBackEnabled.value,0);
  assert.equal(b.uKainoraFrontEnabled.value,0);assert.equal(b.uKainoraBackEnabled.value,1);
  assert.equal(a.uKainoraFront.value,texture);
  assert.equal(base.userData.kainoraPrints,undefined);
  frontOnly.dispose();twoSides.dispose();base.dispose();geometry.dispose();texture.dispose();
});
test('front/back starting views are independent from print URL',()=>{
  assert.equal(garmentYaw({initialView:'front'}),0);assert.ok(garmentYaw({initialView:'back'})>2.9);
  assert.equal(garmentYaw({initialView:'back',back:'/new.png'}),garmentYaw({initialView:'back',back:'/old.png'}));
  assert.equal(railOffset(4,-1,5),0);assert.equal(railOffset(0,5,5),0);
  assert.notEqual(garmentSeed('park-1'),garmentSeed('park-2'));
});

test('seven supplied motifs retain black colours and front-only print assignments through admin validation',async()=>{
  const data=validateContent(JSON.parse(await readFile('src/content/store.json','utf8')));
  assert.equal(data.garments.length,7);
  assert.equal(data.garments.filter(g=>g.color==='black').length,6);
  for(const id of ['black-candy','black-icecream']) {
    const entry=data.garments.find(g=>g.id===id);
    assert.equal(entry.initialView,'front');assert.equal(entry.frontLayout,'large');
    assert.ok(entry.front);assert.equal(entry.back,'');assert.equal(garmentYaw(entry),0);
  }
  for(const id of ['black-dinorex','black-kainora-fresh','black-egg','black-key']) {
    const entry=data.garments.find(g=>g.id===id);
    assert.equal(entry.initialView,'back');assert.equal(entry.frontLayout,'badge');
    assert.ok(entry.front&&entry.back);
  }
  for(const entry of data.garments)for(const image of [entry.front,entry.back].filter(Boolean))await stat('public'+image);
  for(let cursor=0;cursor<7;cursor++)assert.equal(visibleGarments(data.garments,cursor).length,5);
});
