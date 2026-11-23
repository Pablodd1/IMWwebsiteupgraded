// End-to-end test of the voice bridge with a FAKE Twilio and a FAKE Grok realtime server.
import test from 'node:test';
import assert from 'node:assert/strict';
import { WebSocketServer, WebSocket } from 'ws';
import { signStreamToken } from '../src/twilio.js';

process.env.BOT_API_SECRET = 'sekret';
process.env.XAI_API_KEY = 'test-key';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const until = async (fn, ms = 3000) => { const t = Date.now(); while (Date.now() - t < ms) { if (fn()) return true; await wait(20); } return false; };

test('voice bridge: Twilio <-> Grok realtime', async () => {
  // Fake Grok
  const grokEvents = [];
  let grokAuth = null, grokUrl = null, grokSock = null;
  const grok = new WebSocketServer({ port: 0 });
  grok.on('connection', (ws, req) => {
    grokAuth = req.headers.authorization; grokUrl = req.url; grokSock = ws;
    ws.on('message', (m) => grokEvents.push(JSON.parse(m.toString())));
  });
  await new Promise((r) => grok.on('listening', r));
  process.env.XAI_REALTIME_URL = `ws://127.0.0.1:${grok.address().port}/v1/realtime`;
  process.env.PORT = '0';

  const { server } = await import('../../voice-bridge/server.js');
  await new Promise((r) => server.listen(0, r));
  const port = server.address().port;

  // health
  const health = await (await fetch(`http://127.0.0.1:${port}/health`)).json();
  assert.equal(health.ok, true); assert.equal(health.hasKey, true);

  // 1) bad token is rejected, and Grok is never contacted
  const bad = new WebSocket(`ws://127.0.0.1:${port}/twilio-stream`);
  await new Promise((r) => bad.on('open', r));
  bad.send(JSON.stringify({ event: 'start', start: { streamSid: 'MZbad', callSid: 'CAbad', customParameters: { token: 'nope' } } }));
  const closed = await new Promise((r) => { bad.on('close', () => r(true)); setTimeout(() => r(false), 2000); });
  assert.equal(closed, true, 'bad token closes the stream');
  assert.equal(grokEvents.length, 0);

  // 2) good call
  const tw = new WebSocket(`ws://127.0.0.1:${port}/twilio-stream`);
  const toTwilio = [];
  tw.on('message', (m) => toTwilio.push(JSON.parse(m.toString())));
  await new Promise((r) => tw.on('open', r));
  tw.send(JSON.stringify({ event: 'connected' }));
  tw.send(JSON.stringify({ event: 'start', start: { streamSid: 'MZ1', callSid: 'CA1', customParameters: { token: signStreamToken('CA1', 'sekret'), from: '+15550001111' } } }));

  assert.ok(await until(() => grokEvents.some((e) => e.type === 'session.update')), 'session.update sent');
  assert.equal(grokAuth, 'Bearer test-key');
  assert.match(grokUrl, /model=grok-voice-latest/);
  const su = grokEvents.find((e) => e.type === 'session.update').session;
  assert.equal(su.audio.input.format.type, 'audio/pcmu');
  assert.equal(su.audio.output.format.type, 'audio/pcmu');
  assert.equal(su.voice, 'eve');
  assert.equal(su.turn_detection.type, 'server_vad');
  assert.match(su.instructions, /LIVE PHONE CALL/);
  assert.deepEqual(su.tools.map((t) => t.name).sort(), ['lookup_service_info', 'submit_lead', 'transfer_to_human']);
  assert.ok(su.tools.every((t) => t.type === 'function' && t.parameters));

  // audio from the caller before the session is ready is buffered, then flushed
  tw.send(JSON.stringify({ event: 'media', media: { payload: 'QUJD' } }));
  grokSock.send(JSON.stringify({ type: 'session.updated' }));
  assert.ok(await until(() => grokEvents.some((e) => e.type === 'conversation.item.create' && e.item.type === 'force_message')), 'greeting sent');
  const greet = grokEvents.find((e) => e.item?.type === 'force_message').item;
  assert.equal(greet.interruptible, false);
  assert.match(greet.content[0].text, /AI/); assert.match(greet.content[0].text, /recorded/);
  assert.ok(await until(() => grokEvents.some((e) => e.type === 'input_audio_buffer.append' && e.audio === 'QUJD')), 'buffered audio flushed');

  // caller audio streams through
  tw.send(JSON.stringify({ event: 'media', media: { payload: 'REVG' } }));
  assert.ok(await until(() => grokEvents.some((e) => e.audio === 'REVG')));

  // Grok audio -> Twilio, with the right streamSid
  grokSock.send(JSON.stringify({ type: 'response.output_audio.delta', delta: 'R0hJ' }));
  assert.ok(await until(() => toTwilio.some((m) => m.event === 'media' && m.media.payload === 'R0hJ' && m.streamSid === 'MZ1')));

  // barge-in clears Twilio's buffer
  grokSock.send(JSON.stringify({ type: 'input_audio_buffer.speech_started' }));
  assert.ok(await until(() => toTwilio.some((m) => m.event === 'clear' && m.streamSid === 'MZ1')));

  // tool call: runs after response.done; ONE response.create after all outputs
  grokSock.send(JSON.stringify({ type: 'response.function_call_arguments.done', call_id: 'c1', name: 'lookup_service_info', arguments: '{"query":"Exomind"}' }));
  grokSock.send(JSON.stringify({ type: 'response.function_call_arguments.done', call_id: 'c2', name: 'lookup_service_info', arguments: '{"query":"V-Tone"}' }));
  const before = grokEvents.length;
  grokSock.send(JSON.stringify({ type: 'response.done' }));
  assert.ok(await until(() => grokEvents.filter((e) => e.type === 'response.create').length === 1));
  const after = grokEvents.slice(before);
  const outs = after.filter((e) => e.item?.type === 'function_call_output');
  assert.deepEqual(outs.map((e) => e.item.call_id), ['c1', 'c2']);
  assert.equal(after.at(-1).type, 'response.create', 'response.create comes last');
  assert.match(outs[0].item.output, /Exomind/i);

  // call ends -> Grok socket closes
  const grokClosed = new Promise((r) => grokSock.on('close', () => r(true)));
  tw.send(JSON.stringify({ event: 'stop' }));
  assert.equal(await Promise.race([grokClosed, wait(2000).then(() => false)]), true);

  server.close(); grok.close();
});

test('withinHours() respects clinic timezone and hours', async () => {
  const { withinHours } = await import('../../voice-bridge/server.js');
  const clinic = { timezone: 'America/New_York', hours: { mon_fri: '9:00 AM - 5:30 PM', sat: '9:00 AM - 1:00 PM', sun: 'Closed' } };
  assert.equal(withinHours(clinic, new Date('2026-11-23T15:00:00Z')), true);  // Mon 10:00 ET
  assert.equal(withinHours(clinic, new Date('2026-11-23T23:00:00Z')), false); // Mon 18:00 ET
  assert.equal(withinHours(clinic, new Date('2026-11-28T15:00:00Z')), true);  // Sat 10:00 ET
  assert.equal(withinHours(clinic, new Date('2026-11-28T19:00:00Z')), false); // Sat 14:00 ET
  assert.equal(withinHours(clinic, new Date('2026-11-29T15:00:00Z')), false); // Sun
});
