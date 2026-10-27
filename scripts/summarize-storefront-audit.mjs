import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';

const folder='docs/performance-2026-10-23';
const rows=[];
for(const [page,label] of [['home','Beranda'],['catalog','Katalog'],['detail','Detail Sunshine']]){
  const load=async when=>JSON.parse(await readFile(`${folder}/${when}-${page}.json`,'utf8'));
  const before=await load('before'),after=await load('after');
  assert.equal(before.lighthouseVersion,after.lighthouseVersion);
  assert.deepEqual(before.configSettings.throttling,after.configSettings.throttling);
  assert.deepEqual(before.configSettings.screenEmulation,after.configSettings.screenEmulation);
  const extract=report=>({LCPms:report.audits['largest-contentful-paint'].numericValue,CLS:report.audits['cumulative-layout-shift'].numericValue,TBTms:report.audits['total-blocking-time'].numericValue,performanceScore:Math.round(report.categories.performance.score*100),seoScore:Math.round(report.categories.seo.score*100),measuredAt:report.fetchTime});
  rows.push({page,label,url:after.requestedUrl,before:extract(before),after:extract(after)});
}
const note='Single-sample Lighthouse mobile production-preview lab measurements, not field CWV. TBT is not INP; target LCP <=2500ms and CLS <=0.1.';
await writeFile(`${folder}/metrics.json`,JSON.stringify({note,rows},null,2)+'\n');
const lines=['# Hasil Lighthouse mobile','',note,'','| Halaman | LCP sebelum → sesudah | CLS sesudah | TBT sesudah | Performance sebelum → sesudah | SEO sesudah |','| --- | ---: | ---: | ---: | ---: | ---: |',...rows.map(r=>`| ${r.label} | ${(r.before.LCPms/1000).toFixed(2)} → ${(r.after.LCPms/1000).toFixed(2)} detik | ${r.after.CLS.toFixed(4)} | ${Math.round(r.after.TBTms)} ms | ${r.before.performanceScore} → ${r.after.performanceScore} | ${r.after.seoScore} |`),'','Lihat README.md untuk batas pengukuran dan validasi schema.'];
await writeFile(`${folder}/METRICS.md`,lines.join('\n')+'\n');
console.log(lines.join('\n'));
