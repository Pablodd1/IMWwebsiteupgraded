// Voice bridge: Twilio Media Streams  <->  Grok Voice Agent (xAI realtime).
// Runs as a small always-on Node server (Railway/Fly/Render). Vercel serverless cannot hold this WebSocket.
//   start:  node voice-bridge/server.js         (run from the repo root so ./bot/config is found)
// Audio is G.711 mu-law 8 kHz both ways, so NO transcoding is needed.
import http from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';
import { buildInstructions } from '../bot/src/prompt.js';
import { readConfig } from '../bot/src/config.js';
import { realtimeTools, runTool } from '../bot/src/tools.js';
import { verifyStreamToken } from '../bot/src/twilio.js';

const PORT = Number(process.env.PORT || 8080);
const XAI_URL = process.env.XAI_REALTIME_URL || 'wss://api.x.ai/v1/realtime';
const MODEL = process.env.XAI_VOICE_MODEL || 'grok-voice-latest';
const MAX_CALLS = Number(process.env.MAX_CONCURRENT_CALLS || 10);
const MAX_CALL_MS = Number(process.env.MAX_CALL_MINUTES || 15) * 60_000;
const TOOLS = ['submit_lead', 'lookup_service_info', 'transfer_to_human'];

let activeCalls = 0;
const log = (...a) => console.log(new Date().toISOString(), ...a); // never log transcripts/PII

function withinHours(clinic, now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: clinic.timezone, weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(now);
  const get = (t) => parts.find((p) => p.type === t)?.value;
  const day = get('weekday');
  const mins = Number(get('hour')) % 24 * 60 + Number(get('minute'));
  const range = day === 'Sun' ? clinic.hours.sun : day === 'Sat' ? clinic.hours.sat : clinic.hours.mon_fri;
  const m = /(\d+):(\d+)\s*(AM|PM)\s*-\s*(\d+):(\d+)\s*(AM|PM)/i.exec(range || '');
  if (!m) return false;
  const toMin = (h, mi, ap) => (Number(h) % 12 + (/pm/i.test(ap) ? 12 : 0)) * 60 + Number(mi);
  return mins >= toMin(m[1], m[2], m[3]) && mins < toMin(m[4], m[5], m[6]);
}

async function twilioTransfer(callSid, toNumber) {
  const { TWILIO_ACCOUNT_SID: sid, TWILIO_AUTH_TOKEN: token } = process.env;
  if (!sid || !token) throw new Error('Twilio REST credentials missing');
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Calls/${callSid}.json`, {
    method: 'POST',
    headers: { Authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ Twiml: `<Response><Dial>${toNumber}</Dial></Response>` }),
  });
  if (!res.ok) throw new Error(`Twilio transfer failed ${res.status}`);
}

function handleCall(twilioWs) {
  let streamSid = null;
  let callSid = null;
  let xai = null;
  let ready = false;
  let greeted = false;
  const pendingCalls = [];
  const queuedAudio = [];
  let transferTimer = null;
  let ended = false;
  const lang = 'en';

  const persona = readConfig('persona.json');
  const clinic = readConfig('clinic.json');
  const sendX = (obj) => xai?.readyState === WebSocket.OPEN && xai.send(JSON.stringify(obj));
  const sendT = (obj) => twilioWs.readyState === WebSocket.OPEN && twilioWs.send(JSON.stringify(obj));

  const end = (why) => {
    if (ended) return;
    ended = true;
    clearTimeout(maxTimer);
    clearTimeout(transferTimer);
    activeCalls = Math.max(0, activeCalls - 1);
    try { xai?.close(); } catch {}
    try { twilioWs.close(); } catch {}
    log('call ended', callSid || '-', why);
  };
  const maxTimer = setTimeout(() => end('max duration'), MAX_CALL_MS);

  function openXai() {
    xai = new WebSocket(`${XAI_URL}?model=${encodeURIComponent(MODEL)}`, { headers: { Authorization: `Bearer ${process.env.XAI_API_KEY}` } });

    xai.on('open', () => {
      sendX({
        type: 'session.update',
        session: {
          instructions: buildInstructions({ channel: 'voice', lang }),
          voice: persona.voice.grokVoice,
          reasoning: { effort: process.env.XAI_VOICE_REASONING || 'none' },
          tools: realtimeTools(TOOLS),
          turn_detection: { type: 'server_vad', idle_timeout_ms: Number(process.env.VOICE_IDLE_MS || 15000) },
          audio: {
            input: { format: { type: 'audio/pcmu' } },
            output: { format: { type: 'audio/pcmu' }, speed: persona.voice.speed || 1.0 },
          },
        },
      });
    });

    xai.on('message', async (raw) => {
      let ev;
      try { ev = JSON.parse(raw.toString()); } catch { return; }
      switch (ev.type) {
        case 'session.updated':
          ready = true;
          while (queuedAudio.length) sendX({ type: 'input_audio_buffer.append', audio: queuedAudio.shift() });
          if (!greeted) {
            greeted = true;
            // Scripted greeting includes the "AI + may be recorded" disclosure. interruptible:false so it is always heard.
            sendX({
              type: 'conversation.item.create',
              item: { type: 'force_message', role: 'assistant', interruptible: false, content: [{ type: 'output_text', text: persona.greeting.voice[lang] }] },
            });
          }
          break;
        case 'response.output_audio.delta':
        case 'response.audio.delta': {
          const payload = ev.delta || ev.audio;
          if (payload && streamSid) sendT({ event: 'media', streamSid, media: { payload } });
          break;
        }
        case 'input_audio_buffer.speech_started': // caller interrupts: flush audio already queued at Twilio
          if (streamSid) sendT({ event: 'clear', streamSid });
          break;
        case 'response.function_call_arguments.done':
          pendingCalls.push({ id: ev.call_id, name: ev.name, args: ev.arguments });
          break;
        case 'response.done':
          if (pendingCalls.length) {
            const batch = pendingCalls.splice(0);
            for (const c of batch) {
              let args = {};
              try { args = JSON.parse(c.args || '{}'); } catch {}
              const ctx = { channel: 'voice', lang, transfer: (reason) => doTransfer(reason) };
              const result = await runTool(c.name, args, ctx);
              log('tool', c.name, result.ok === false ? 'failed' : 'ok');
              sendX({ type: 'conversation.item.create', item: { type: 'function_call_output', call_id: c.id, output: JSON.stringify(result) } });
            }
            sendX({ type: 'response.create' }); // exactly one, after ALL outputs
          }
          break;
        case 'error':
          log('xai error', JSON.stringify(ev.error || ev).slice(0, 300));
          break;
        default:
      }
    });

    xai.on('close', () => end('xai closed'));
    xai.on('error', (e) => { log('xai socket error', e.message); end('xai error'); });
  }

  async function doTransfer() {
    if (clinic.humanHandoff?.onlyDuringHours && !withinHours(clinic)) {
      return { ok: false, message: 'The office is closed right now. Offer to take a call-back request instead.' };
    }
    const to = process.env.HANDOFF_PHONE || clinic.humanHandoff?.phoneE164;
    if (!to) return { ok: false, message: 'No transfer number configured. Offer a call back.' };
    transferTimer = setTimeout(() => twilioTransfer(callSid, to).catch((e) => log('transfer error', e.message)), 4000);
    return { ok: true, message: 'Transferring now. Say one short sentence such as "One moment while I connect you." and nothing else.' };
  }

  twilioWs.on('message', (raw) => {
    let m;
    try { m = JSON.parse(raw.toString()); } catch { return; }
    if (m.event === 'start') {
      streamSid = m.start.streamSid;
      callSid = m.start.callSid;
      const token = m.start.customParameters?.token;
      if (!verifyStreamToken(callSid, token, process.env.BOT_API_SECRET)) {
        log('rejected stream: bad token');
        return end('bad token');
      }
      log('call started', callSid);
      openXai();
    } else if (m.event === 'media') {
      if (!xai) return;
      if (ready) sendX({ type: 'input_audio_buffer.append', audio: m.media.payload });
      else if (queuedAudio.length < 200) queuedAudio.push(m.media.payload);
    } else if (m.event === 'stop') {
      end('twilio stop');
    }
  });
  twilioWs.on('close', () => end('twilio closed'));
  twilioWs.on('error', () => end('twilio error'));
}

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ ok: true, activeCalls, hasKey: Boolean(process.env.XAI_API_KEY), hasSecret: Boolean(process.env.BOT_API_SECRET) }));
  }
  res.writeHead(404).end();
});

const wss = new WebSocketServer({ noServer: true });
server.on('upgrade', (req, socket, head) => {
  if (req.url?.split('?')[0] !== '/twilio-stream') return socket.destroy();
  if (!process.env.XAI_API_KEY || !process.env.BOT_API_SECRET) {
    log('refusing call: XAI_API_KEY or BOT_API_SECRET missing');
    return socket.destroy();
  }
  if (activeCalls >= MAX_CALLS) return socket.destroy();
  wss.handleUpgrade(req, socket, head, (ws) => {
    activeCalls++;
    handleCall(ws);
  });
});

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  server.listen(PORT, () => log(`voice bridge listening on :${PORT}`));
}
export { server, withinHours };
