// Input validation for chat requests. Plain JS (no deps) so it also runs in the voice bridge.
export const LIMITS = { maxMessages: 20, maxChars: 1000, maxTotalChars: 8000 };

export function validateChatBody(body) {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Invalid request.' };
  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) return { ok: false, error: 'messages must be a non-empty array.' };
  if (messages.length > LIMITS.maxMessages) return { ok: false, error: 'Conversation too long. Please start a new chat.' };

  let total = 0;
  const clean = [];
  for (const m of messages) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string') {
      return { ok: false, error: 'Invalid message.' };
    }
    const content = m.content.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim();
    if (!content) continue;
    if (content.length > LIMITS.maxChars) return { ok: false, error: 'Message too long.' };
    total += content.length;
    clean.push({ role: m.role, content });
  }
  if (total > LIMITS.maxTotalChars) return { ok: false, error: 'Conversation too long. Please start a new chat.' };
  if (!clean.length || clean[clean.length - 1].role !== 'user') return { ok: false, error: 'Last message must be from the user.' };
  const lang = body.lang === 'es' ? 'es' : 'en';
  return { ok: true, messages: clean, lang };
}

export function normalizePhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  if (digits.length >= 11 && digits.length <= 15) return `+${digits}`;
  return null;
}

export function validateLead(input) {
  const str = (v, max) => String(v ?? '').replace(/[\u0000-\u001F]/g, ' ').trim().slice(0, max);
  const name = str(input?.name, 80);
  const phone = normalizePhone(input?.phone);
  if (name.length < 2) return { ok: false, error: 'Name is required.' };
  if (!phone) return { ok: false, error: 'A valid phone number is required.' };
  const kind = input?.kind === 'callback' ? 'callback' : 'appointment';
  return {
    ok: true,
    lead: {
      kind,
      name,
      phone,
      service: str(input?.service, 80) || 'Not specified',
      preferredTime: str(input?.preferred_time ?? input?.preferredTime, 120),
      note: str(input?.note, 200),
      lang: input?.lang === 'es' ? 'es' : 'en',
      channel: ['chat', 'voice', 'sms', 'form'].includes(input?.channel) ? input.channel : 'chat',
    },
  };
}
