'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.resolve(process.env.SITE_DIR||'site');
const html=fs.readFileSync(path.join(root,'classroom.html'),'utf8');
const css=fs.readFileSync(path.join(root,'classroom.css'),'utf8');
const src=fs.readFileSync(path.join(root,'classroom.js'),'utf8');
const entry=fs.readFileSync(path.join(root,'classroom-entry.js'),'utf8');
const main=fs.readFileSync(path.join(root,'index.html'),'utf8');
new vm.Script(src,{filename:'classroom.js'});
new vm.Script(entry,{filename:'classroom-entry.js'});
assert(html.includes('classroom.js')&&html.includes('classroom.css'),'standalone classroom is linked');
assert(main.includes('classroom-entry.js'),'main site exposes classroom link');
for(const word of ['classroom_lessons','classroom_live','classroom_responses','begin','present','newSlide','renderStudent','publish','submit','imageFile','renderScreen','math']){
 assert(src.includes(word),'missing classroom action '+word);
}
assert(src.includes("d12f28d3-a8d3-4fc3-a2e0-0aeab43e9920"),'46 test editor explicitly scoped');
assert(src.includes('student=1'),'student view needs to be present');
assert(src.includes('JSON.stringify'),'lesson export required');
assert(css.includes('.projector')&&css.includes('.screen'),'presentation layout missing');
assert(!src.includes('service_role'),'service role keys must not be in client');
console.log('Classroom module and navigation syntax/integration tests passed.');