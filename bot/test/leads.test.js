import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { deliverLocal, intakeMessage } from '../src/leads.js';
import { checkClaims } from '../src/claims.js';

function fakeTwilio() {
  const sent = [];
  const srv = http.createServer(async (req, res) => {
    let b = ''; for await (const c of req) b += c;
    sent.push(Object.fromEntries(new URLSearchParams(b)));
    res.writeHead(201, { 'Content-Type': 'application/json' }); res.end('{"sid":"SM1"}');
  });
  return new Promise((r) => srv.listen(0, () => r({ srv, sent, base: `http://127.0.0.1:${srv.address().port}` })));
}
const LEAD = { kind: 'appointment', name: 'Ana Ruiz', phone: '305-864-1373', service: 'Exomind', channel: 'chat', lang: 'en' };

test('request: staff are texted first, then the patient gets the intake link', async () => {
  const { srv, sent, base } = await fakeTwilio();
  Object.assign(process.env, { TWILIO_API_BASE: base, TWILIO_ACCOUNT_SID: 'AC1', TWILIO_AUTH_TOKEN: 't', TWILIO_PHONE_NUMBER: '+15550001111',
    STAFF_NOTIFY_PHONE: '+15559998888', INTAKE_URL: 'https://www.aimedicalscriber.com/intake/abc123' });
  delete process.env.EMAIL_HOST;
  const r = await deliverLocal(LEAD);
  assert.equal(r.ok, true); assert.equal(r.intakeLinkSent, true);
  assert.equal(sent.length, 2);
  assert.equal(sent[0].To, '+15559998888');                 // staff first
  assert.match(sent[0].Body, /APPOINTMENT REQUEST/);
  assert.equal(sent[1].To, '+13058641373');                 // then patient, E.164
  assert.match(sent[1].Body, /aimedicalscriber\.com\/intake\/abc123/); assert.match(sent[1].Body, /STOP/);
  assert.doesNotMatch(sent[1].Body, /Exomind/);             // no service/condition in the patient text
  srv.close();
});

test('call-back requests do not send the intake link', async () => {
  const { srv, sent, base } = await fakeTwilio();
  process.env.TWILIO_API_BASE = base;
  const r = await deliverLocal({ ...LEAD, kind: 'callback' });
  assert.equal(r.ok, true); assert.equal(r.intakeLinkSent, false); assert.equal(sent.length, 1);
  srv.close();
});

test('no INTAKE_URL or non-https URL -> no patient text, request still delivered', async () => {
  for (const url of ['', 'http://insecure.example/intake']) {
    const { srv, sent, base } = await fakeTwilio();
    process.env.TWILIO_API_BASE = base; process.env.INTAKE_URL = url;
    const r = await deliverLocal(LEAD);
    assert.equal(r.ok, true); assert.equal(r.intakeLinkSent, false); assert.equal(sent.length, 1);
    srv.close();
  }
});

test('if staff cannot be notified, the patient is NOT texted and delivery is reported as failed', async () => {
  const { srv, sent, base } = await fakeTwilio();
  Object.assign(process.env, { TWILIO_API_BASE: base, INTAKE_URL: 'https://www.aimedicalscriber.com/intake/abc123' });
  delete process.env.STAFF_NOTIFY_PHONE; delete process.env.EMAIL_HOST;
  const r = await deliverLocal(LEAD);
  assert.equal(r.ok, false); assert.equal(r.error, 'delivery_failed'); assert.equal(sent.length, 0);
  srv.close();
});

test('intake text is bilingual and passes the claims guard', () => {
  process.env.INTAKE_URL = 'https://www.aimedicalscriber.com/intake/abc123';
  for (const lang of ['en', 'es']) { const m = intakeMessage({ ...LEAD, lang }); assert.ok(checkClaims(m).ok, m); }
  assert.match(intakeMessage({ ...LEAD, lang: 'es' }), /Hola Ana/);
});

test('invalid leads are rejected before anything is sent', async () => {
  const r = await deliverLocal({ name: 'A', phone: '1' });
  assert.equal(r.ok, false);
});
