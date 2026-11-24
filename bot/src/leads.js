// Delivers appointment / call-back requests to the clinic staff. This is the ONLY place a lead is stored,
// so the model can never "forget" one. Leads contain a name + phone only (no health details).
import { validateLead } from './validate.js';
import { readConfig } from './config.js';

const twilioBase = () => process.env.TWILIO_API_BASE || 'https://api.twilio.com';
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
<b>Preferred time:</b> ${esc(lead.preferredTime || '-')}<br><b>Note:</b> ${esc(lead.note || '-')}<br><b>Language:</b> ${esc(lead.lang)}<br>
<b>Intake link:</b> an automatic text with the new-patient form link is sent to this number after this notice (appointment requests only).</p>
<p>Sent by the AI front desk assistant. Please call the patient to confirm.</p>`;
  await sendEmailNotification(to, readConfig('clinic.json').name, `New ${lead.kind} request: ${lead.name}`, html);
  return { sent: true };
}

async function sendStaffSms(lead) {
  const { TWILIO_ACCOUNT_SID: sid, TWILIO_AUTH_TOKEN: token, TWILIO_PHONE_NUMBER: from, STAFF_NOTIFY_PHONE: to } = process.env;
  if (!sid || !token || !from || !to) return { sent: false, reason: 'sms not configured' };
  const res = await fetch(`${twilioBase()}/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: { Authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ To: to, From: from, Body: leadToText(lead).slice(0, 600) }),
  });
  return { sent: res.ok };
}

// Text the patient their AIMS new-patient intake link. The link is generic (no patient data in the URL) and the
// patient fills the form in AIMS directly; Mia never sees the answers.
export function intakeMessage(lead) {
  const url = process.env.INTAKE_URL;
  const first = lead.name.split(' ')[0];
  const clinic = readConfig('clinic.json').name;
  return lead.lang === 'es'
    ? `Hola ${first}, gracias por contactar a ${clinic}. Complete su formulario de nuevo paciente aquí: ${url} Nuestro equipo le llamará para confirmar su visita. Responda STOP para cancelar.`
    : `Hi ${first}, thanks for contacting ${clinic}! Please complete your new patient form here: ${url} Our team will call you to confirm your visit. Reply STOP to opt out.`;
}

async function sendPatientIntakeSms(lead) {
  const { TWILIO_ACCOUNT_SID: sid, TWILIO_AUTH_TOKEN: token, TWILIO_PHONE_NUMBER: from, INTAKE_URL: url } = process.env;
  if (!sid || !token || !from || !url || lead.kind !== 'appointment') return { sent: false };
  if (!/^https:\/\//.test(url)) return { sent: false }; // only ever text an https link
  const res = await fetch(`${twilioBase()}/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: { Authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ To: lead.phone, From: from, Body: intakeMessage(lead) }),
  });
  return { sent: res.ok };
}

// Used where SMTP/Twilio secrets live (the Vercel site).
export async function deliverLocal(input) {
  const v = validateLead(input);
  if (!v.ok) return { ok: false, error: v.error };
  // Staff must receive the request FIRST. Only then do we text the patient (never promise a call nobody will make).
  const results = await Promise.allSettled([sendEmail(v.lead), sendStaffSms(v.lead)]);
  const delivered = results.some((r) => r.status === 'fulfilled' && r.value.sent);
  if (!delivered) console.error('[lead] NOT DELIVERED', results.map((r) => (r.status === 'rejected' ? r.reason?.message : r.value)));
  let intakeLinkSent = false;
  if (delivered) {
    const p = await sendPatientIntakeSms(v.lead).catch((e) => (console.error('[lead] patient sms failed', e.message), { sent: false }));
    intakeLinkSent = Boolean(p.sent);
  }
  return { ok: delivered, intakeLinkSent, error: delivered ? undefined : 'delivery_failed' };
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
  if (!res.ok) return { ok: false, error: `endpoint ${res.status}` };
  const body = await res.json().catch(() => ({}));
  return { ok: true, intakeLinkSent: Boolean(body.intakeLinkSent) };
}
