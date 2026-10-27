import test from 'node:test';
import assert from 'node:assert/strict';
import {analyseMeasurements, parseMeasurement, valuesForNewGarment, stageMeasurements,formatMeasurement} from '../src/utils/sizeStudio.js';
import {SIZE_CATEGORIES, measurementFields} from '../src/content/sizeStudio.js';
import {storefrontView} from '../src/utils/productRoutes.js';

test('accepts Indonesian decimal comma without parsing incomplete or nonfinite data',()=>{
  assert.equal(parseMeasurement(' 110,5 '),110.5);
  for(const value of ['', ' ',null,undefined,'1e2','Infinity','20 cm','1,2.3','-4','0','0x10'])assert.equal(parseMeasurement(value),null);
});
test('requires actual measurements and rejects category ranges and invalid optional context',()=>{
  const input={categoryId:'tops',typeId:'tee',mode:'body',fit:'regular'};
  assert.equal(analyseMeasurements({...input,values:{height:'110',weight:'18'}}).ok,false);
  assert.equal(analyseMeasurements({...input,values:{height:'110',chest:'56',weight:'999'}}).ok,false);
  assert.equal(analyseMeasurements({...input,values:{height:'999',chest:'56'}}).ok,false);
  assert.equal(analyseMeasurements({...input,values:{height:'110',chest:'56'}}).ok,true);
});
test('ignores irrelevant retained values and never derives a universal size from height and weight',()=>{
  const r=analyseMeasurements({categoryId:'tops',typeId:'tee',mode:'body',values:{height:'110',chest:'56',leftFoot:'garbage'},fit:'oversize'});
  assert.equal(r.ok,true);assert.equal(r.size,undefined);
  assert.deepEqual(r.items.map(x=>x.id),['height','chest']);
  assert.equal(analyseMeasurements({categoryId:'tops',typeId:'tee',mode:'body',values:{height:'110',weight:'18'}}).ok,false);
});
test('shoe guide uses longer foot with no invented allowance or EU size',()=>{
  const r=analyseMeasurements({categoryId:'shoes',typeId:'sneaker',mode:'body',values:{leftFoot:'14,2',rightFoot:'14,8'}});
  assert.equal(r.ok,true);assert.equal(r.items[0].value,'14,8 cm');assert.equal(r.size,undefined);
  assert.equal(analyseMeasurements({categoryId:'shoes',typeId:'sneaker',mode:'body',values:{leftFoot:'14,2'}}).ok,false);
});
test('compares flat garment widths to flat widths and reports smaller/equal/larger deltas',()=>{
  const base={categoryId:'tops',typeId:'tee',mode:'compare',values:{ref_width:'36',chart_width:'34',ref_length:'43',chart_length:'43'}};
  const r=analyseMeasurements(base);assert.equal(r.ok,true);
  assert.equal(r.items[0].delta,-2);assert.equal(r.items[1].delta,0);
  assert.equal(analyseMeasurements({...base,values:{...base.values,chart_width:'38,5'}}).items[0].delta,2.5);
  assert.equal(analyseMeasurements({...base,values:{chest:'72',chart_width:'36',ref_length:'43',chart_length:'43'}}).ok,false);
});
test('all seven categories and each subtype have measurement instructions and required fields',()=>{
  assert.equal(SIZE_CATEGORIES.length,7);
  for(const category of SIZE_CATEGORIES)for(const type of category.types){
    assert.ok(type.steps.length>=2);
    assert.ok(measurementFields(category.id,type.id,'body').filter(f=>!f.optional).length>=2);
    assert.ok(measurementFields(category.id,type.id,'compare').every(f=>f.dimension));
  }
  assert.deepEqual(measurementFields('muslim','hijab','body').map(f=>f.id),['face','frontLength']);
  assert.deepEqual(measurementFields('home','socks','body').map(f=>f.id),['leftFoot','rightFoot']);
  assert.equal(analyseMeasurements({categoryId:'wrong',typeId:'tee',mode:'body',values:{}}).ok,false);
  assert.equal(analyseMeasurements({categoryId:'tops',typeId:'wrong',mode:'body',values:{height:110,chest:56}}).ok,false);
});
test('canonical, legacy query and Kainora chart routes remain distinct',()=>{
  assert.equal(storefrontView(new URL('https://kainorakids.com/panduan-ukuran-anak/')),'sizeGuide');
  assert.equal(storefrontView(new URL('https://kainorakids.com/?view=sizeGuide')),'sizeGuide');
  assert.equal(storefrontView(new URL('https://kainorakids.com/panduan/ukuran-kaos-anak/')),'guide');
});
test('changing garment preserves body dimensions but clears previous garment-specific chart and desired length',()=>{
  assert.deepEqual(valuesForNewGarment({height:'110',chest:'56',length:'43',ref_width:'36',chart_width:'34'}),{height:'110',chest:'56'});
});
test('stage foot data follows the active mode and never presents invalid or unrelated body numbers',()=>{
  const values={leftFoot:'14,2',rightFoot:'14,8',ref_footLength:'17',chart_footLength:'18'};
  assert.equal(stageMeasurements('shoes','sneaker','body',values).footValue,14.8);
  assert.equal(stageMeasurements('shoes','sneaker','compare',values).footValue,18);
  assert.equal(stageMeasurements('shoes','sneaker','compare',{...values,chart_footLength:'999'}).footValue,null);
  assert.equal(stageMeasurements('shoes','sneaker','body',{...values,rightFoot:''}).footValue,null);
  assert.deepEqual(stageMeasurements('tops','tee','body',{chest:'56'}).garmentValues,{});
});
test('hundredths remain readable instead of zero centimetres larger',()=>{
  assert.equal(formatMeasurement(.01),'0,01');
  assert.equal(parseMeasurement('36.001'),null);
  const result=analyseMeasurements({categoryId:'tops',typeId:'tee',mode:'compare',values:{ref_width:'36',chart_width:'36.01',ref_length:'43',chart_length:'43'}});
  assert.equal(result.items[0].value,'0,01 cm lebih besar');
});
