// Minimal xAI (Grok) chat client. xAI's chat API is OpenAI-compatible.
const BASE = () => process.env.XAI_BASE_URL || 'https://api.x.ai/v1';
export const chatModel = () => process.env.XAI_CHAT_MODEL || 'grok-4.7';

export async function chatCompletion({ messages, tools, temperature = 0.4, maxTokens = 450, signal }) {
  const key = process.env.XAI_API_KEY;
  if (!key) {
    const e = new Error('XAI_API_KEY is not set');
    e.code = 'NO_KEY';
    throw e;
  }
  const body = { model: chatModel(), messages, temperature, max_tokens: maxTokens };
  if (tools?.length) {
    body.tools = tools;
    body.tool_choice = 'auto';
  }
  const res = await fetch(`${BASE()}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify(body),
    signal: signal || AbortSignal.timeout(25_000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const e = new Error(`xAI error ${res.status}: ${text.slice(0, 300)}`);
    e.status = res.status;
    throw e;
  }
  const data = await res.json();
  const msg = data.choices?.[0]?.message;
  if (!msg) throw new Error('xAI returned no message');
  return msg;
}
