import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { checkClaims, claimFallback } from '../src/claims.js';
import { respond } from '../src/respond.js';
import http from 'node:http';

const MUST_BLOCK = [
  'Exomind cures anxiety.', 'V-Tone treats incontinence', 'It will heal your back', 'This helps prevent migraines',
  'It can reverse aging', 'Guaranteed results!', 'It is FDA approved', 'Exomind is FDA-cleared', 'Clinically proven to work',
  'It is completely safe', 'There are no side effects', 'You will feel better in 2 weeks', 'Most patients improve by 80%',
  'Results within 4 weeks', 'You probably have a pinched nerve', 'This will relieve your pain', 'It eliminates pain',
  'Take 500 mg daily', 'You should stop taking your medication', 'It is effective for depression', 'It will fix your posture',
  'C U R E', 'c.u.r.e your pain', 'cu​re', 'HEALING for your joints',
  'Exomind cura la ansiedad', 'Trata el dolor', 'Es seguro y efectivo', 'Garantizamos resultados', 'Está comprobado científicamente',
  'Alivia el dolor', 'Sin efectos secundarios', 'Usted probablemente tiene una hernia', 'Elimina el dolor',
];
const MUST_PASS = [
  "I'm not able to speak to medical results. A provider can go over that at a consultation.",
  'We are open Monday to Friday, nine to five thirty.',
  'Exomind is a non-invasive brain stimulation treatment that uses magnetic pulses.',
  'Would you like me to request an appointment? I just need your name and phone number.',
  "I don't know that. I can have the office call you back.",
  'Estamos abiertos de lunes a viernes. ¿Desea solicitar una cita?',
  'Thank you, Ana! The office will call you to confirm.',
];

test('claims guard blocks claim-like replies (EN + ES + obfuscation)', () => {
  for (const s of MUST_BLOCK) assert.equal(checkClaims(s).ok, false, `should block: ${s}`);
});
test('claims guard allows safe replies', () => {
  for (const s of MUST_PASS) assert.equal(checkClaims(s).ok, true, `should pass: ${s} -> ${checkClaims(s).hits}`);
});
test('ALL approved clinic text (services, FAQs, greetings, fallbacks, emergency) passes the guard', () => {
  const read = (f) => JSON.parse(fs.readFileSync(`bot/config/${f}`, 'utf8'));
  const texts = [];
  for (const s of read('services.json').services) texts.push(s.name, s.summary, s.details || '');
  for (const f of read('faqs.json').faqs) texts.push(f.a);
  const g = read('persona.json').greeting;
  for (const ch of Object.values(g)) for (const t of Object.values(ch)) texts.push(t);
  for (const l of ['en', 'es']) texts.push(claimFallback(l));
  for (const t of texts.filter(Boolean)) { const r = checkClaims(t); assert.equal(r.ok, true, `approved text trips guard (${r.hits}): ${t}`); }
});
test('prompt contains the absolute claims rule and the booking goal', async () => {
  const { buildInstructions } = await import('../src/prompt.js');
  const p = buildInstructions({ channel: 'chat' });
  assert.match(p, /Medical claims: absolute rule/); assert.match(p, /NEVER make a medical claim/); assert.match(p, /request an appointment/);
});

test('respond(): a model reply with a medical claim is replaced by the safe fallback', async () => {
  const srv = http.createServer(async (req, res) => { for await (const _ of req); res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ choices: [{ message: { role: 'assistant', content: 'Yes! Exomind cures anxiety and is FDA approved.' } }] })); });
  await new Promise((r) => srv.listen(0, r));
  process.env.XAI_API_KEY = 'x'; process.env.XAI_BASE_URL = `http://127.0.0.1:${srv.address().port}/v1`;
  const en = await respond({ messages: [{ role: 'user', content: 'Does Exomind cure anxiety?' }], lang: 'en' });
  assert.equal(en.claimBlocked, true); assert.equal(en.content, claimFallback('en')); assert.doesNotMatch(en.content, /cures|FDA/i);
  const es = await respond({ messages: [{ role: 'user', content: '¿Exomind cura?' }], lang: 'es' });
  assert.equal(es.content, claimFallback('es'));
  srv.close();
});
