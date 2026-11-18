// Exercise the production recording boundary independently of the student-facing DOM.
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(process.env.SITE_DIR || 'site');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const bridge = html.match(/window\.RatioPracticeBridge=\{[\s\S]*?\n  \};/);
assert(bridge, 'Locate the production practice bridge');

let ready = true, writes = 0;
const profile = {games:0, questions:0, history:[], activeDates:[], xp:0, economy:{modules:{}}};
const scope = {
  window:{SpecialPracticeEngine:require(path.join(root, 'special-practice-engine.js'))},
  cloudStudentReady:() => ready, currentProfileKey:() => 'class|student',
  currentProfile:() => profile, go:() => {}, levelInfo:() => ({level:1}),
  todayKey:() => 'today', renderStats:() => {}, saveCurrentProfile:() => {writes++;},
};
vm.runInNewContext(fs.readFileSync(path.join(root, 'special-practice-data.js'), 'utf8'), scope);
vm.runInNewContext(bridge[0], scope);
const api = scope.window.RatioPracticeBridge;
const card = scope.window.SpecialPracticeCards.find(card => card.code === 'B1');
const correct = card.answers.map(row => Array.from(row));
const first = correct.map(row => Array.from(row));
first[0] = ['999999', '999999'];
const result = {runId:'sp-correction-record', cardId:card.id, values:first, correct:5, avgTime:2.5, submittedAt:'2025-11-18T03:07:09.000Z'};

// The score and correction gate both come from grading, not the caller's claims.
assert.throws(() => api.complete(result), /逐项完成/);
assert.throws(() => api.complete({...result, correctedValues:[[correct[0][0], '999999']]}), /逐项完成/);
assert.equal(writes, 0);
assert.equal(profile.games, 0);
assert.equal(profile.history.length, 0);
api.complete({...result, correctedValues:correct});
assert.equal(writes, 1);
const entry = profile.economy.modules.specialPractice.records[0];
assert.equal(entry.correct, 4);
assert.equal(entry.flags[0], false);
assert.equal(entry.corrected, true);
assert.equal(entry.submittedAt, result.submittedAt);
assert.ok(Number.isFinite(Date.parse(entry.correctedAt)));
assert.deepEqual([...entry.values[0]], first[0]);
assert.equal(profile.economy.modules.specialPractice.best[card.id], 4);
assert.equal(profile.history[0].first, 4);
assert.equal(profile.history[0].avgTime, 2.5);
assert.equal(profile.games, 1);
assert.equal(profile.questions, 5);
api.complete({...result, correctedValues:correct});
assert.equal(writes, 1, 'Restoring a finished correction does not create a second score');

ready = false;
assert.throws(() => api.complete({...result, runId:'sp-another', correctedValues:correct}), /登录/);
assert.equal(writes, 1);
console.log('PASS required repairs at recording: both fields, original score/time, duplicate submissions and signed-in guard');
