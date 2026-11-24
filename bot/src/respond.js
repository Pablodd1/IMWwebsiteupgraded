// One shared "brain" used by the website chat, SMS and any future text channel.
import { buildInstructions } from './prompt.js';
import { isEmergency, emergencyReply } from './safety.js';
import { chatCompletion } from './xai.js';
import { chatTools, runTool } from './tools.js';
import { checkClaims, claimFallback } from './claims.js';

const TEXT_TOOLS = ['submit_lead', 'lookup_service_info'];

// Every reply passes the claims guard. Only rule ids are logged, never message text.
function guard(content, lang, leadSubmitted) {
  const { ok, hits } = checkClaims(content);
  if (ok) return { content, leadSubmitted };
  console.warn('[claims-guard] blocked reply; rules:', hits.join(','));
  return { content: claimFallback(lang), leadSubmitted, claimBlocked: true };
}

export async function respond({ messages, channel = 'chat', lang = 'en' }) {
  const last = messages[messages.length - 1]?.content || '';
  if (isEmergency(last)) return { content: emergencyReply(lang), emergency: true };

  const convo = [{ role: 'system', content: buildInstructions({ channel, lang }) }, ...messages];
  const tools = chatTools(TEXT_TOOLS);
  let leadSubmitted = false;

  for (let i = 0; i < 4; i++) {
    const msg = await chatCompletion({ messages: convo, tools });
    if (!msg.tool_calls?.length) return guard((msg.content || '').trim(), lang, leadSubmitted);
    convo.push({ role: 'assistant', content: msg.content || '', tool_calls: msg.tool_calls });
    for (const call of msg.tool_calls) {
      let args = {};
      try { args = JSON.parse(call.function.arguments || '{}'); } catch { /* bad JSON from model */ }
      const result = await runTool(call.function.name, args, { channel, lang });
      if (call.function.name === 'submit_lead' && result.ok) leadSubmitted = true;
      convo.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(result) });
    }
  }
  return { content: lang === 'es' ? 'Disculpe, ¿puede repetir? También puede llamarnos al (305) 864-1373.' : "Sorry, could you say that again? You can also call us at (305) 864-1373.", leadSubmitted };
}
