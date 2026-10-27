import test from 'node:test';
import assert from 'node:assert/strict';
import {publishedUploads} from '../src/services/adminUploadState.js';
test('accepted publish keeps local previews while excluding already committed bytes from subsequent uploads',()=>{
  const uploads={'/one.png':{path:'/one.png',preview:'blob:local-one',base64:'bytes',pending:true},'/two.png':{path:'/two.png',preview:'blob:local-two',base64:'other',pending:true}};
  const result=publishedUploads(uploads,[{path:'/one.png'}]);assert.equal(result['/one.png'].preview,'blob:local-one');assert.equal(result['/one.png'].pending,false);assert.equal(result['/two.png'].pending,true);assert.equal(uploads['/one.png'].pending,true);
});
