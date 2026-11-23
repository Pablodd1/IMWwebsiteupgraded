import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import { isEmergency, emergencyReply } from '../src/safety.js';
import { buildInstructions } from '../src/prompt.js';
import { validateChatBody, validateLead, normalizePhone } from '../src/validate.js';
import { validateTwilioSignature, signStreamToken, verifyStreamToken } from '../src/twilio.js';
import { search } from '../src/retrieve.js';
import { respond } from '../src/respond.js';
import { hit } from '../src/ratelimit.js';

// ---- safety (deterministic, runs before the model) ----
test('emergency detection: examples from training/examples.jsonl', () => {
  const rows = fs.readFileSync('bot/config/training/examples.jsonl', 'utf8').trim().split('\n').map((l) => JSON.parse(l));
  for (const r of rows.filter((r) => r.deterministic)) assert.ok(isEmergency(r.input), r.input);
});
test('emergency detection: normal questions do not trigger', () => {
  for (const s of ['What time do you close on Saturday?', 'Tell me about Exomind', 'Do you have parking?', 'Quiero una cita']) assert.equal(isEmergency(s), false, s);
});
test('emergency reply mentions 911 and 988 in both languages', () => {
  for (const l of ['en', 'es']) { const r = emergencyReply(l); assert.match(r, /911/); assert.match(r, /988/); }
});

// ---- prompt ----
test('prompt has facts, rules, no leftover placeholders, per-channel rules', () => {
  const p = buildInstructions({ channel: 'voice' });
  assert.match(p, /\(305\) 864-1373/);
  assert.match(p, /Mon-Fri 9:00 AM - 5:30 PM/);
  assert.match(p, /LIVE PHONE CALL/);
  assert.match(p, /Never diagnose/);
  assert.doesNotMatch(p, /\{\{/);
  assert.match(buildInstructions({ channel: 'sms' }), /text message/);
});

// ---- validation ----
test('chat body validation', () => {
  assert.equal(validateChatBody(null).ok, false);
  assert.equal(validateChatBody({ messages: [] }).ok, false);
  assert.equal(validateChatBody({ messages: [{ role: 'system', content: 'x' }] }).ok, false);
  assert.equal(validateChatBody({ messages: [{ role: 'user', content: 'x'.repeat(1001) }] }).ok, false);
  assert.equal(validateChatBody({ messages: [{ role: 'assistant', content: 'hi' }] }).ok, false);
  assert.equal(validateChatBody({ messages: Array(25).fill({ role: 'user', content: 'a' }) }).ok, false);
  const ok = validateChatBody({ messages: [{ role: 'user', content: ' hi ' }], lang: 'es' });
  assert.ok(ok.ok); assert.equal(ok.messages[0].content, 'hi'); assert.equal(ok.lang, 'es');
});
test('lead validation + phone normalization', () => {
  assert.equal(normalizePhone('(305) 864-1373'), '+13058641373');
  assert.equal(normalizePhone('12'), null);
  assert.equal(validateLead({ name: 'A', phone: '3058641373' }).ok, false);
  assert.equal(validateLead({ name: 'Ana Ruiz', phone: 'abc' }).ok, false);
  const v = validateLead({ name: 'Ana Ruiz', phone: '305 864 1373', service: 'Exomind', kind: 'callback', channel: 'voice' });
  assert.ok(v.ok); assert.equal(v.lead.phone, '+13058641373'); assert.equal(v.lead.channel, 'voice');
});

// ---- twilio ----
test('twilio signature + stream token', async () => {
  const crypto = await import('node:crypto');
  const params = { CallSid: 'CA1', From: '+1555' };
  const url = 'https://example.com/api/twilio/voice';
  const data = url + 'CallSidCA1From+1555';
  const sig = crypto.createHmac('sha1', 'tok').update(data).digest('base64');
  assert.equal(validateTwilioSignature({ authToken: 'tok', signature: sig, url, params }), true);
  assert.equal(validateTwilioSignature({ authToken: 'tok', signature: sig + 'x', url, params }), false);
  assert.equal(validateTwilioSignature({ authToken: 'other', signature: sig, url, params }), false);
  const token = signStreamToken('CA1', 's3cret');
  assert.equal(verifyStreamToken('CA1', token, 's3cret'), true);
  assert.equal(verifyStreamToken('CA2', token, 's3cret'), false);
  assert.equal(verifyStreamToken('CA1', token, 'wrong'), false);
  assert.equal(verifyStreamToken('CA1', signStreamToken('CA1', 's3cret', Date.now() - 10 * 60_000), 's3cret'), false);
});

// ---- retrieval ----
test('retrieval finds service info', () => {
  const r = search('Exomind sessions');
  assert.ok(r.length > 0); assert.match(r[0].title, /exomind/i);
  assert.deepEqual(search('zzzqqq'), []);
});

// ---- rate limit ----
test('rate limiter blocks after limit', () => {
  const k = 'k' + Math.random();
  for (let i = 0; i < 3; i++) assert.ok(hit(k, { limit: 3 }).allowed);
  assert.equal(hit(k, { limit: 3 }).allowed, false);
});

// ---- respond() end-to-end against a mock xAI chat server ----
function mockXai(handler) {
  return new Promise((resolve) => {
    const srv = http.createServer(async (req, res) => {
      let body = ''; for await (const c of req) body += c;
      const out = await handler(JSON.parse(body), req);
      res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(out));
    });
    srv.listen(0, () => resolve(srv));
  });
}

test('respond(): emergency never reaches the model', async () => {
  process.env.XAI_API_KEY = 'test';
  process.env.XAI_BASE_URL = 'http://127.0.0.1:1'; // would fail if called
  const out = await respond({ messages: [{ role: 'user', content: 'I have chest pain' }] });
  assert.equal(out.emergency, true); assert.match(out.content, /911/);
});

test('respond(): tool loop sends system prompt + tools, runs submit_lead, returns final text', async () => {
  const leads = [];
  const leadSrv = http.createServer(async (req, res) => {
    let b = ''; for await (const c of req) b += c;
    leads.push({ body: JSON.parse(b), secret: req.headers['x-bot-secret'] });
    res.writeHead(200).end('{"ok":true}');
  });
  await new Promise((r) => leadSrv.listen(0, r));
  process.env.LEAD_ENDPOINT = `http://127.0.0.1:${leadSrv.address().port}/api/lead`;
  process.env.BOT_API_SECRET = 'sekret';

  const seen = [];
  const xai = await mockXai((body) => {
    seen.push(body);
    if (seen.length === 1) {
      return { choices: [{ message: { role: 'assistant', content: '', tool_calls: [{ id: 't1', type: 'function', function: { name: 'submit_lead', arguments: JSON.stringify({ kind: 'appointment', name: 'Ana Ruiz', phone: '3058641373', service: 'Exomind' }) } }] } }] };
    }
    return { choices: [{ message: { role: 'assistant', content: 'All set, Ana! The office will call you to confirm.' } }] };
  });
  process.env.XAI_BASE_URL = `http://127.0.0.1:${xai.address().port}/v1`;
  // mock serves any path; fetch adds /chat/completions
  const out = await respond({ messages: [{ role: 'user', content: 'Yes, please book me. Ana Ruiz 305-864-1373 Exomind' }], channel: 'chat', lang: 'en' });

  assert.match(out.content, /All set/); assert.equal(out.leadSubmitted, true);
  assert.equal(seen[0].messages[0].role, 'system');
  assert.match(seen[0].messages[0].content, /Never diagnose/);
  assert.deepEqual(seen[0].tools.map((t) => t.function.name).sort(), ['lookup_service_info', 'submit_lead']);
  assert.ok(!seen[0].tools.some((t) => t.function.name === 'transfer_to_human'), 'transfer is voice-only');
  assert.equal(seen[1].messages.at(-1).role, 'tool');
  assert.equal(leads.length, 1); assert.equal(leads[0].secret, 'sekret'); assert.equal(leads[0].body.channel, 'chat'); assert.equal(leads[0].body.name, 'Ana Ruiz');
  xai.close(); leadSrv.close(); delete process.env.LEAD_ENDPOINT;
});
