// Loads the editable files in /bot/config. Works inside Next.js (Vercel) and plain Node (voice bridge).
import fs from 'node:fs';
import path from 'node:path';

function configDir() {
  if (process.env.BOT_CONFIG_DIR) return process.env.BOT_CONFIG_DIR;
  return path.join(process.cwd(), 'bot', 'config');
}

const cache = new Map();

export function readConfig(file) {
  const full = path.join(configDir(), file);
  if (cache.has(full)) return cache.get(full);
  const raw = fs.readFileSync(full, 'utf8');
  const value = file.endsWith('.json') ? JSON.parse(raw) : raw;
  cache.set(full, value);
  return value;
}

export function loadAll() {
  return {
    persona: readConfig('persona.json'),
    clinic: readConfig('clinic.json'),
    services: readConfig('services.json').services,
    faqs: readConfig('faqs.json').faqs,
    safety: readConfig('safety.json'),
    promptTemplate: readConfig('prompt.md'),
  };
}

export function clearConfigCache() {
  cache.clear();
}
