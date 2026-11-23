// Twilio helpers with no SDK dependency.
import crypto from 'node:crypto';

// https://www.twilio.com/docs/usage/security#validating-requests
export function validateTwilioSignature({ authToken, signature, url, params }) {
  if (!authToken || !signature) return false;
  const data = url + Object.keys(params).sort().map((k) => k + params[k]).join('');
  const expected = crypto.createHmac('sha1', authToken).update(Buffer.from(data, 'utf8')).digest('base64');
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Short-lived token proving a media stream was started by OUR voice webhook (checked by the voice bridge).
export function signStreamToken(callSid, secret, ts = Date.now()) {
  const mac = crypto.createHmac('sha256', secret).update(`${callSid}.${ts}`).digest('hex');
  return `${ts}.${mac}`;
}
export function verifyStreamToken(callSid, token, secret, maxAgeMs = 5 * 60_000) {
  if (!secret || !token) return false;
  const [ts, mac] = String(token).split('.');
  if (!ts || !mac || Date.now() - Number(ts) > maxAgeMs) return false;
  const want = signStreamToken(callSid, secret, ts).split('.')[1];
  const a = Buffer.from(want), b = Buffer.from(mac);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export const xmlEscape = (s) => String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
export const twiml = (inner) => `<?xml version="1.0" encoding="UTF-8"?><Response>${inner}</Response>`;
