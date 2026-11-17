'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const base=path.resolve(process.env.SITE_DIR||'site');
const dom=new JSDOM(fs.readFileSync(path.join(base,'index.html'),'utf8'),{runScripts:'outside-only',url:'https://test.invalid/'});
const w=dom.window,d=w.document;
const expected={studentPinInput:'localIdentityForm',accountPasswordInput:'studentCredentialForm',firstNewPassword:'studentPasswordUpdateForm',firstNewPassword2:'studentPasswordUpdateForm',teacherPassword:'teacherCredentialForm',teacherRecoveryPassword:'teacherPasswordUpdateForm',teacherRecoveryPassword2:'teacherPasswordUpdateForm'};
for(const [id,form]of Object.entries(expected))assert.equal(d.getElementById(id).form?.id,form,id+' has an isolated form owner');
for(const form of d.querySelectorAll('form[data-credential-form]')){
 assert.equal(form.getAttribute('autocomplete'),'off');
 assert.equal(form.method,'post','Native fallback must never place credentials in a URL');
 assert.equal(form.querySelectorAll('form').length,0,'No nested forms');
}
for(const id of ['answerInput','newClassName','newClassCode'])assert(!d.getElementById(id)?.form?.matches('[data-credential-form]'),id+' is not a credential control');
w.eval(fs.readFileSync(path.join(base,'credential-forms.js'),'utf8'));
for(const form of d.querySelectorAll('form[data-credential-form]')){
 const event=new w.Event('submit',{bubbles:true,cancelable:true});
 assert.equal(form.dispatchEvent(event),false,'Native submission prevented');assert(event.defaultPrevented);
 for(const input of form.querySelectorAll('input'))assert.equal(input.getAttribute('data-lpignore'),'true');
}
let clicked=0;d.getElementById('accountLoginBtn').addEventListener('click',()=>clicked++);d.getElementById('accountLoginBtn').click();assert.equal(clicked,1,'Existing login button is unaffected');
assert.equal(d.getElementById('accountPasswordInput').type,'password','Passwords remain masked');
assert.equal(d.getElementById('teacherPassword').type,'password');
assert(d.querySelector('script[src*="credential-forms.js"]'),'Entry loads the form guard');
dom.window.close();
console.log('PASS credential form separation: seven password controls in five independent forms, answer isolation, native-submit prevention and unchanged login buttons');
