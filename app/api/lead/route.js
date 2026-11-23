import { deliverLocal } from '../../../bot/src/leads.js';
import { hitShared } from '../../../bot/src/ratelimit.js';
import { corsHeaders, originAllowed } from '../../../bot/src/cors.js';
import { timingSafeEqual } from 'node:crypto';

export const runtime = 'nodejs';

const json = (b, s, o) => Response.json(b, { status: s, headers: corsHeaders(o) });

export async function OPTIONS(req) {
  return new Response(null, { status: 204, headers: corsHeaders(req.headers.get('origin')) });
}

function secretOk(req) {
  const want = process.env.BOT_API_SECRET;
  const got = req.headers.get('x-bot-secret') || '';
  if (!want || !got || want.length !== got.length) return false;
  return timingSafeEqual(Buffer.from(want), Buffer.from(got));
}

export async function POST(req) {
  const origin = req.headers.get('origin');
  const trusted = secretOk(req); // voice bridge / other servers
  if (!trusted && !originAllowed(origin)) return json({ ok: false, error: 'forbidden' }, 403, origin);

  const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  const rl = await hitShared(`lead:${trusted ? 'srv' : ip}`, { limit: trusted ? 120 : 5, windowSec: 600 });
  if (!rl.allowed) return json({ ok: false, error: 'rate_limited' }, 429, origin);

  let body;
  try { body = await req.json(); } catch { return json({ ok: false, error: 'bad_json' }, 400, origin); }
  const result = await deliverLocal({ ...body, channel: trusted ? body.channel : 'form' });
  return json(result, result.ok ? 200 : result.error === 'delivery_failed' ? 502 : 400, origin);
}
