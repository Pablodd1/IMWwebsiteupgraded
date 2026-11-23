import { respond } from '../../../../bot/src/respond.js';
import { isStopWord } from '../../../../bot/src/safety.js';
import { validateTwilioSignature, twiml, xmlEscape } from '../../../../bot/src/twilio.js';
import { getJSON, setJSON } from '../../../../bot/src/store.js';
import { hitShared } from '../../../../bot/src/ratelimit.js';
import { readConfig } from '../../../../bot/src/config.js';

export const runtime = 'nodejs';
export const maxDuration = 30;

const xml = (inner, status = 200) => new Response(twiml(inner), { status, headers: { 'Content-Type': 'text/xml' } });

export async function POST(req) {
  const params = Object.fromEntries(new URLSearchParams(await req.text()));
  const base = process.env.PUBLIC_BASE_URL; // e.g. https://innovativemedicalwellness.com
  const ok = validateTwilioSignature({
    authToken: process.env.TWILIO_AUTH_TOKEN,
    signature: req.headers.get('x-twilio-signature'),
    url: `${base}/api/twilio/sms`,
    params,
  });
  if (!ok) return new Response('Forbidden', { status: 403 });

  const from = params.From || '';
  const text = (params.Body || '').trim().slice(0, 1000);
  if (!text || isStopWord(text)) return xml(''); // Twilio handles STOP/opt-out itself; send nothing

  const rl = await hitShared(`sms:${from}`, { limit: 15, windowSec: 600 });
  if (!rl.allowed) return xml('');

  const key = `sms:${from}`;
  const history = (await getJSON(key)) || [];
  history.push({ role: 'user', content: text });
  const recent = history.slice(-12);

  try {
    const out = await respond({ messages: recent, channel: 'sms', lang: /[¿¡ñáéíóú]|\b(hola|cita|gracias)\b/i.test(text) ? 'es' : 'en' });
    recent.push({ role: 'assistant', content: out.content });
    await setJSON(key, recent, 6 * 3600);
    return xml(`<Message>${xmlEscape(out.content.slice(0, 1500))}</Message>`);
  } catch (e) {
    console.error('[sms] error:', e.message);
    return xml(`<Message>${xmlEscape(`Sorry, we're having trouble. Please call ${readConfig('clinic.json').phone}.`)}</Message>`);
  }
}
