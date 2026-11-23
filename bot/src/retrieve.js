// Small keyword retriever over the website's blog JSON (json/en/blogs) plus approved services.
// This is how the bot "learns" website content without stuffing 130 KB into every prompt.
// To upgrade later, swap search() for a vector store (e.g. xAI collections / file_search) without touching callers.
import fs from 'node:fs';
import path from 'node:path';
import { readConfig } from './config.js';

let docs = null;

function flatten(node, out) {
  if (typeof node === 'string') out.push(node);
  else if (Array.isArray(node)) node.forEach((n) => flatten(n, out));
  else if (node && typeof node === 'object') Object.values(node).forEach((n) => flatten(n, out));
}

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) walk(full, files);
    else if (full.endsWith('.json')) files.push(full);
  }
  return files;
}

const tokenize = (s) =>
  String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').match(/[a-z0-9+]{3,}/g) || [];

function load() {
  if (docs) return docs;
  docs = [];
  for (const s of readConfig('services.json').services) {
    const text = [s.name, s.summary, s.details].filter(Boolean).join('. ');
    docs.push({ title: s.name, source: 'services', text, boost: 3, tokens: new Set(tokenize(text + ' ' + (s.keywords || []).join(' '))) });
  }
  const root = process.env.WEBSITE_JSON_DIR || path.join(process.cwd(), 'json', 'en', 'blogs');
  for (const file of walk(root)) {
    try {
      const parts = [];
      flatten(JSON.parse(fs.readFileSync(file, 'utf8')), parts);
      const text = parts.join(' ').replace(/\s+/g, ' ').trim();
      if (text.length < 80) continue;
      docs.push({ title: path.basename(file, '.json').replace(/[-_]/g, ' '), source: 'website', text, boost: 1, tokens: new Set(tokenize(text)) });
    } catch {
      /* skip unreadable file */
    }
  }
  return docs;
}

export function search(query, { limit = 3, maxChars = 1800 } = {}) {
  const q = tokenize(query);
  if (!q.length) return [];
  return load()
    .map((d) => {
      const hits = q.filter((t) => d.tokens.has(t)).length;
      const titleHits = q.filter((t) => d.title.toLowerCase().includes(t)).length;
      return { d, score: (hits + titleHits * 3) * d.boost };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ d }) => ({ title: d.title, source: d.source, text: d.text.slice(0, maxChars) }));
}

export function resetRetriever() {
  docs = null;
}
