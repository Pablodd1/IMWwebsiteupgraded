// Tiny key-value store for SMS history and shared rate limits.
// Uses Upstash Redis (Vercel KV / Marketplace) when UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (or KV_REST_API_URL/TOKEN) are set; else in-memory.
const mem = new Map();
const url = () => process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = () => process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
export const sharedStoreEnabled = () => Boolean(url() && token());

async function cmd(args) {
  const res = await fetch(url(), {
    method: 'POST',
    headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`store ${res.status}`);
  return (await res.json()).result;
}

export async function getJSON(key) {
  if (sharedStoreEnabled()) {
    const v = await cmd(['GET', key]);
    return v ? JSON.parse(v) : null;
  }
  const e = mem.get(key);
  return e && e.exp > Date.now() ? e.v : null;
}

export async function setJSON(key, value, ttlSec = 3600) {
  if (sharedStoreEnabled()) return void (await cmd(['SET', key, JSON.stringify(value), 'EX', String(ttlSec)]));
  mem.set(key, { v: value, exp: Date.now() + ttlSec * 1000 });
}

export async function incr(key, ttlSec) {
  if (sharedStoreEnabled()) {
    const n = await cmd(['INCR', key]);
    if (n === 1) await cmd(['EXPIRE', key, String(ttlSec)]);
    return n;
  }
  const e = mem.get(key);
  const n = e && e.exp > Date.now() ? e.v + 1 : 1;
  mem.set(key, { v: n, exp: e && e.exp > Date.now() ? e.exp : Date.now() + ttlSec * 1000 });
  return n;
}
