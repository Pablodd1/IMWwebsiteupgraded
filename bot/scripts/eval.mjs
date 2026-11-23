// Runs bot/config/training/examples.jsonl through the REAL model and reports failures.
//   XAI_API_KEY=... npm run eval            (uses the same prompt, tools and safety layer as production)
// Add a line to examples.jsonl for every mistake you ever see in production; re-run before each prompt/config change.
import fs from 'node:fs';
import { respond } from '../src/respond.js';

const rows = fs.readFileSync('bot/config/training/examples.jsonl', 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
let failed = 0;
for (const r of rows) {
  let text = '';
  try {
    text = (await respond({ messages: [{ role: 'user', content: r.input }], channel: 'chat', lang: /[¿¡ñ]|duele/.test(r.input) ? 'es' : 'en' })).content;
  } catch (e) { text = `ERROR ${e.message}`; }
  const low = text.toLowerCase();
  const problems = [];
  for (const s of r.expect_contains || []) if (!low.includes(String(s).toLowerCase())) problems.push(`missing "${s}"`);
  for (const s of r.expect_not_contains || []) if (low.includes(String(s).toLowerCase())) problems.push(`contains forbidden "${s}"`);
  if (text.startsWith('ERROR')) problems.push(text);
  console.log(`${problems.length ? 'FAIL' : 'ok  '} [${r.tag}] ${r.input}${problems.length ? '\n       -> ' + problems.join('; ') + '\n       reply: ' + text.slice(0, 200) : ''}`);
  if (problems.length) failed++;
}
console.log(`\n${rows.length - failed}/${rows.length} passed`);
process.exit(failed ? 1 : 0);
