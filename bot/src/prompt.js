// Builds the system prompt from /bot/config/prompt.md and the other config files.
import { loadAll } from './config.js';

const CHANNEL_RULES = {
  chat: `- You are in a website chat. Keep replies to 2-4 short sentences unless asked for more.
- Plain text only: no markdown, no tables. A short list is fine only when it helps.
- You may include one relevant link from the clinic facts.`,
  sms: `- You are replying by text message. Keep replies under 320 characters when possible.
- Plain text only, no markdown, no emojis unless the person uses them.
- Do not send links except the clinic website or booking page.`,
  voice: `- You are on a LIVE PHONE CALL. Speak in short, natural sentences, one idea at a time. Never read lists longer than three items.
- Say phone numbers digit by digit in groups ("three oh five, eight six four, one three seven three"). Say times naturally ("nine to five thirty").
- Never say URLs, symbols or markdown. Say "our website" instead.
- Let the caller finish. If you did not understand, ask once, briefly.
- Warm and upbeat delivery. Brief acknowledgements like "Of course!" and "Absolutely." are good.
- When you take a request: collect name, then phone number, then service, then preferred time. Repeat the phone number back and wait for a yes before submit_lead.
- If the caller asks for a person, or you cannot help after two tries, use transfer_to_human during office hours; after hours, offer a call back instead.`,
};

function formatHours(h) {
  return `Mon-Fri ${h.mon_fri}; Sat ${h.sat}; Sun ${h.sun}`;
}

export function buildInstructions({ channel = 'chat', lang } = {}) {
  const { persona, clinic, services, faqs, promptTemplate } = loadAll();
  const values = {
    persona_name: persona.name,
    persona_role: persona.role,
    persona_personality: persona.personality,
    clinic_name: clinic.name,
    clinic_address: clinic.address,
    clinic_phone: clinic.phone,
    clinic_email: clinic.email,
    clinic_hours: formatHours(clinic.hours),
    related_sites: Object.entries(clinic.relatedSites || {}).map(([k, v]) => `${k}: ${v}`).join('; '),
    default_language: lang === 'es' ? 'Spanish' : persona.defaultLanguage === 'es' ? 'Spanish' : 'English',
    services: services
      .map((s) => `- ${s.name}: ${s.summary}${s.details ? ' ' + s.details : ''}${s.link ? ` (${s.link})` : ''}`)
      .join('\n'),
    faqs: faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join('\n\n'),
    channel_rules: CHANNEL_RULES[channel] || CHANNEL_RULES.chat,
  };
  return promptTemplate.replace(/\{\{(\w+)\}\}/g, (_, k) => (k in values ? values[k] : ''));
}
