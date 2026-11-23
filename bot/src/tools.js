// Tools the assistant can call. Definitions are shared by chat (OpenAI format) and voice (Grok realtime format).
import { search } from './retrieve.js';
import { deliverLead } from './leads.js';

export const TOOL_DEFS = [
  {
    name: 'submit_lead',
    description:
      'Send an appointment request or call-back request to the clinic staff. Only call AFTER the person confirmed their name, phone number and service out loud/in writing. Never include medical details.',
    parameters: {
      type: 'object',
      properties: {
        kind: { type: 'string', enum: ['appointment', 'callback'] },
        name: { type: 'string', description: 'First and last name' },
        phone: { type: 'string', description: 'Callback phone number' },
        service: { type: 'string', description: 'Service they are interested in, e.g. Exomind, IV Therapy, Chiropractic' },
        preferred_time: { type: 'string', description: 'Preferred day/time, free text' },
        note: { type: 'string', description: 'Short non-medical note' },
      },
      required: ['kind', 'name', 'phone'],
    },
  },
  {
    name: 'lookup_service_info',
    description: 'Look up approved information about a clinic service or topic. Use before answering detailed service questions.',
    parameters: {
      type: 'object',
      properties: { query: { type: 'string', description: 'Service or topic, e.g. "Exomind sessions" or "NAD+ IV"' } },
      required: ['query'],
    },
  },
  {
    name: 'transfer_to_human',
    description: 'VOICE ONLY. Transfer the live call to a staff member. Use when asked for a person or when you cannot help.',
    parameters: { type: 'object', properties: { reason: { type: 'string' } }, required: [] },
  },
];

export const chatTools = (names) =>
  TOOL_DEFS.filter((t) => names.includes(t.name)).map((t) => ({ type: 'function', function: t }));

export const realtimeTools = (names) =>
  TOOL_DEFS.filter((t) => names.includes(t.name)).map((t) => ({ type: 'function', ...t }));

// ctx: { channel, lang, transfer?: () => Promise<{ok:boolean,reason?:string}> }
export async function runTool(name, args, ctx = {}) {
  try {
    if (name === 'lookup_service_info') {
      const hits = search(String(args?.query || ''));
      return hits.length ? { results: hits } : { results: [], note: 'No approved information found. Offer a call back from the office.' };
    }
    if (name === 'submit_lead') {
      const r = await deliverLead({ ...args, lang: ctx.lang, channel: ctx.channel });
      return r.ok
        ? { ok: true, message: 'Request sent to the office. They will call to confirm.' }
        : { ok: false, message: 'Could not send. Ask them to call (305) 864-1373 directly.' };
    }
    if (name === 'transfer_to_human') {
      if (!ctx.transfer) return { ok: false, message: 'Transfer is not available on this channel. Offer a call back instead.' };
      return await ctx.transfer(args?.reason);
    }
    return { ok: false, message: `Unknown tool ${name}` };
  } catch (e) {
    console.error('[tool error]', name, e.message);
    return { ok: false, message: 'Tool failed. Offer a call back.' };
  }
}
