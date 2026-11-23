// Simple in-memory sliding-window limiter. Good enough for one process (voice bridge, local dev).
// On Vercel each serverless instance has its own memory, so for real protection plug in a shared store:
// replace `hit` with Upstash Redis / Vercel KV (see docs/BOT_GUIDE.md).
const buckets = new Map();

export function hit(key, { limit = 20, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const arr = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) {
    buckets.set(key, arr);
    return { allowed: false, retryAfterSec: Math.ceil((windowMs - (now - arr[0])) / 1000) };
  }
  arr.push(now);
  buckets.set(key, arr);
  if (buckets.size > 5000) for (const [k, v] of buckets) if (!v.length || now - v[v.length - 1] > windowMs) buckets.delete(k);
  return { allowed: true };
}

export function clientKey(headers) {
  const get = (n) => (typeof headers?.get === 'function' ? headers.get(n) : headers?.[n]);
  return (get('x-forwarded-for') || get('x-real-ip') || 'unknown').split(',')[0].trim();
}

// Shared (multi-instance) limiter: fixed window counter in the store. Falls back to memory automatically.
import { incr } from './store.js';
export async function hitShared(key, { limit = 20, windowSec = 60 } = {}) {
  try {
    const bucket = Math.floor(Date.now() / (windowSec * 1000));
    const n = await incr(`rl:${key}:${bucket}`, windowSec + 5);
    return n > limit ? { allowed: false, retryAfterSec: windowSec } : { allowed: true };
  } catch {
    return hit(key, { limit, windowMs: windowSec * 1000 }); // never block users because the store is down
  }
}
