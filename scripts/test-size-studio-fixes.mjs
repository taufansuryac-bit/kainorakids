import test from 'node:test';
import assert from 'node:assert/strict';
import {SIZE_CATEGORIES,measurementFields} from '../src/content/sizeStudio.js';
import {visualProfile} from '../src/content/sizeVisuals.js';
import {stageMeasurements,editMeasurementErrors,analyseMeasurements} from '../src/utils/sizeStudio.js';

test('every selectable dimension has a calibrated visual on its actual asset',()=>{
  for(const category of SIZE_CATEGORIES)for(const type of category.types){
    const profile=visualProfile(category,type,'regular');
    assert.deepEqual(profile.marks.map(m=>m.id).sort(),[...type.dimensions].sort(),type.id);
    for(const mark of profile.marks)for(const point of [mark.start,mark.end])assert.ok(point.every(n=>n>=0&&n<=100),type.id);
    assert.ok(profile.alt.length>15);
  }
  const tops=SIZE_CATEGORIES[0];
  assert.notDeepEqual(visualProfile(tops,tops.types[0],'regular').marks,visualProfile(tops,tops.types[0],'oversize').marks);
});
test('reference focus shows the reference value and side, never a mislabeled chart number',()=>{
  const values={ref_width:'30',chart_width:'32'};
  assert.equal(stageMeasurements('tops','tee','compare',values,'ref_width').garmentValues.width,30);
  assert.equal(stageMeasurements('tops','tee','compare',values,'ref_width').side,'ref');
  assert.equal(stageMeasurements('tops','tee','compare',values,'chart_width').garmentValues.width,32);
  assert.equal(stageMeasurements('shoes','sneaker','compare',{ref_footLength:'17',chart_footLength:'18'},'ref_footLength').footValue,17);
});
test('editing one invalid field preserves errors on other fields and revalidates only that field',()=>{
  const fields=measurementFields('tops','tee');
  const errors={height:'required height',chest:'required chest'};
  assert.deepEqual(editMeasurementErrors(errors,'height','110',fields),{chest:'required chest'});
  assert.ok(editMeasurementErrors(errors,'height','999',fields).height);
  assert.deepEqual(editMeasurementErrors({},'height','',fields),{});
});
test('guidance distinguishes underwear, face coverage and foot chart comparisons',()=>{
  const result=(categoryId,typeId,values,mode='body')=>analyseMeasurements({categoryId,typeId,values,mode});
  assert.doesNotMatch(result('home','underwear',{waist:'54',hip:'60'}).notes.join(' '),/Lingkar dada/);
  assert.doesNotMatch(result('muslim','hijab',{face:'48',frontLength:'40'}).notes.join(' '),/Lingkar dada/);
  const foot=result('shoes','sneaker',{ref_footLength:'17',chart_footLength:'18'},'compare');
  assert.doesNotMatch(foot.notes.join(' '),/pakaian|stretch|Angka negatif/);
  assert.match(measurementFields('tops','shirt','compare').find(f=>f.dimension==='sleeve').help,/bahu/);
});
