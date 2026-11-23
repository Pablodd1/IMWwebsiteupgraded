import { validateTwilioSignature, signStreamToken, twiml, xmlEscape } from '../../../../bot/src/twilio.js';
import { readConfig } from '../../../../bot/src/config.js';

export const runtime = 'nodejs';

const xml = (inner, status = 200) => new Response(twiml(inner), { status, headers: { 'Content-Type': 'text/xml' } });

// Twilio "A call comes in" webhook (HTTP POST). Hands the call audio to the voice bridge (a separate always-on server).
export async function POST(req) {
  const params = Object.fromEntries(new URLSearchParams(await req.text()));
  const ok = validateTwilioSignature({
    authToken: process.env.TWILIO_AUTH_TOKEN,
    signature: req.headers.get('x-twilio-signature'),
    url: `${process.env.PUBLIC_BASE_URL}/api/twilio/voice`,
    params,
  });
  if (!ok) return new Response('Forbidden', { status: 403 });

  const clinic = readConfig('clinic.json');
  const bridge = process.env.VOICE_BRIDGE_URL; // wss://your-bridge.up.railway.app/twilio-stream
  const secret = process.env.BOT_API_SECRET;
  if (!bridge || !secret) {
    return xml(`<Say voice="Polly.Joanna">Thank you for calling ${xmlEscape(clinic.name)}. Our assistant is unavailable right now. Please call back during office hours, or visit our website. Goodbye.</Say><Hangup/>`);
  }
  const callSid = params.CallSid || '';
  const token = signStreamToken(callSid, secret);
  return xml(
    `<Connect><Stream url="${xmlEscape(bridge)}"><Parameter name="token" value="${token}"/><Parameter name="from" value="${xmlEscape(params.From || '')}"/></Stream></Connect>`
  );
}
