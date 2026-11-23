// Delivers appointment / call-back requests to the clinic staff. This is the ONLY place a lead is stored,
// so the model can never "forget" one. Leads contain a name + phone only (no health details).
import { validateLead } from './validate.js';
import { readConfig } from './config.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function leadToText(l) {
  return `${l.kind === 'callback' ? 'CALL-BACK REQUEST' : 'APPOINTMENT REQUEST'} (${l.channel})\nName: ${l.name}\nPhone: ${l.phone}\nService: ${l.service}\nPreferred time: ${l.preferredTime || '-'}\nNote: ${l.note || '-'}\nLanguage: ${l.lang}`;
}

async function sendEmail(lead) {
  const to = process.env.STAFF_NOTIFY_EMAIL || process.env.MYABABEEL;
  if (!to || !process.env.EMAIL_HOST) return { sent: false, reason: 'email not configured' };
  const { sendEmailNotification } = await import('../../app/server/submitform/email.js');
  const html = `<h3>${lead.kind === 'callback' ? 'Call-back request' : 'Appointment request'} via ${esc(lead.channel)}</h3>
<p><b>Name:</b> ${esc(lead.name)}<br><b>Phone:</b> ${esc(lead.phone)}<br><b>Service:</b> ${esc(lead.service)}<br>
<b>Preferred time:</b> ${esc(lead.preferredTime || '-')}<br><b>Note:</b> ${esc(lead.note || '-')}<br><b>Language:</b> ${esc(lead.lang)}</p>
<p>Sent by the AI front desk assistant. Please call the patient to confirm.</p>`;
  await sendEmailNotification(to, readConfig('clinic.json').name, `New ${lead.kind} request: ${lead.name}`, html);
  return { sent: true };
}

async function sendStaffSms(lead) {
  const { TWILIO_ACCOUNT_SID: sid, TWILIO_AUTH_TOKEN: token, TWILIO_PHONE_NUMBER: from, STAFF_NOTIFY_PHONE: to } = process.env;
  if (!sid || !token || !from || !to) return { sent: false, reason: 'sms not configured' };
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: { Authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ To: to, From: from, Body: leadToText(lead).slice(0, 600) }),
  });
  return { sent: res.ok };
}

// Used where SMTP/Twilio secrets live (the Vercel site).
export async function deliverLocal(input) {
  const v = validateLead(input);
  if (!v.ok) return { ok: false, error: v.error };
  const results = await Promise.allSettled([sendEmail(v.lead), sendStaffSms(v.lead)]);
  const delivered = results.some((r) => r.status === 'fulfilled' && r.value.sent);
  if (!delivered) console.error('[lead] NOT DELIVERED', results.map((r) => (r.status === 'rejected' ? r.reason?.message : r.value)));
  return { ok: delivered, error: delivered ? undefined : 'delivery_failed' };
}

// Used from anywhere: posts to the site's /api/lead if LEAD_ENDPOINT is set (voice bridge), else delivers locally.
export async function deliverLead(input) {
  const endpoint = process.env.LEAD_ENDPOINT;
  if (!endpoint) return deliverLocal(input);
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-bot-secret': process.env.BOT_API_SECRET || '' },
    body: JSON.stringify(input),
    signal: AbortSignal.timeout(15_000),
  });
  return res.ok ? { ok: true } : { ok: false, error: `endpoint ${res.status}` };
}
