import { respond } from '../../../bot/src/respond.js';
import { validateChatBody } from '../../../bot/src/validate.js';
import { hitShared } from '../../../bot/src/ratelimit.js';
import { corsHeaders, originAllowed } from '../../../bot/src/cors.js';
import { readConfig } from '../../../bot/src/config.js';

export const runtime = 'nodejs';
export const maxDuration = 30;

const json = (body, status, origin, extra = {}) =>
  Response.json(body, { status, headers: { ...corsHeaders(origin), ...extra } });

export async function OPTIONS(req) {
  return new Response(null, { status: 204, headers: corsHeaders(req.headers.get('origin')) });
}

export async function POST(req) {
  const origin = req.headers.get('origin');
  // Browsers from other sites must be on the allowlist. Same-origin requests have no Origin header on some browsers.
  if (origin && !originAllowed(origin)) return json({ content: 'Not allowed.' }, 403, origin);

  const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  const rl = await hitShared(`chat:${ip}`, { limit: 20, windowSec: 60 });
  if (!rl.allowed) return json({ content: 'Too many messages. Please wait a moment.' }, 429, origin, { 'Retry-After': String(rl.retryAfterSec) });

  let body;
  try { body = await req.json(); } catch { return json({ content: 'Invalid request.' }, 400, origin); }
  const v = validateChatBody(body);
  if (!v.ok) return json({ content: v.error }, 400, origin);

  try {
    const out = await respond({ messages: v.messages, channel: 'chat', lang: v.lang });
    return json({ content: out.content, emergency: Boolean(out.emergency), leadSubmitted: Boolean(out.leadSubmitted) }, 200, origin);
  } catch (e) {
    console.error('[chat] error:', e.message);
    const phone = readConfig('clinic.json').phone;
    const msg = v.lang === 'es'
      ? `Lo siento, tengo problemas para conectar. Por favor llame al ${phone}.`
      : `I'm sorry, I'm having trouble connecting. Please call us at ${phone}.`;
    return json({ content: msg, error: true }, 502, origin);
  }
}
