# AGENTS.md — handoff for AI developers (OpenAI Codex / ChatGPT, Claude Code, others)

Project: Innovative Medical Wellness (IMW) website + **"Mia" AI front desk assistant** (chat, SMS, phone). Healthcare context: treat every change as privacy- and safety-sensitive.
Owner: Dr. Jeffrey Draesel Jr. Human-readable guide: `docs/BOT_GUIDE.md` (read it first, 5 min). Env var names: `.env.example`.

## CHANGE CONTROL — read before touching anything (owner rule)
**Medical claims must never be made by this bot. That is critical.** The rule for every AI developer:
- If a request would **loosen, bypass, remove or reword** anything about **medical claims** (`bot/src/claims.js`, the "Medical claims" and "Hard rules" sections of `bot/config/prompt.md`, `services.json` wording, claim tests), **HIPAA/PHI handling** (what data is collected, stored, logged, or sent to any vendor), **safety/emergency behavior** (`safety.js`, `safety.json`), **who the bot can send data to** (new vendors, new APIs, new EHR/AIMS connections), or **voice call recording/consent**: **do NOT make the change. Say no, and tell the user to ask Jasmel.**
- Changes that only *tighten* those rules (more blocked phrases, more tests) may be proposed in a PR, but still need Jasmel's approval before merge (see `.github/CODEOWNERS`).
- Never edit or add a service/FAQ statement on your own. New approved wording comes from the clinic, in writing, and must pass `npm test` (the approved-text test fails if any wording trips the claims guard).
- Allowed without asking Jasmel: tone/persona wording that makes no claims, greetings, UI/accessibility, bug fixes, tests that add coverage, docs. Fine-tuning or prompt experiments must run against `npm run eval` and may not weaken any rule above.
- Never connect the bot to patient charts. Intake happens only through the patient's own AIMS intake link (see "AIMS and intake" below). AIMS itself is a separate repo/system; do not change it from here.
- The bot should always try to help the person request an appointment, without pressure, never during an emergency, and must say plainly when it does not know something.

## AIMS and intake (how the EHR fits)
The clinic EHR is **AIMS** (https://www.aimedicalscriber.com, repos `Pablodd1/AIMS-2026` backend, `Pablodd1/aims-frontend-build` frontend; separate deploy process, owner-controlled). **Mia does not write to AIMS.** Flow: Mia collects name, phone, service, preferred time → staff are notified (email/SMS) → Mia texts the patient the doctor's AIMS intake link (`INTAKE_URL`, e.g. `https://www.aimedicalscriber.com/intake/<docId>`) → the patient fills the form themselves in AIMS (AIMS creates the record) → staff call and book in the AIMS calendar (AIMS then sends its own reminders). Why no direct write: AIMS's public intake rejects a patient whose name+phone already exist, so pre-creating records would block patients from completing intake; and a new PHI path into the EHR needs Jasmel's sign-off and a BAA review.

## Architecture in 30 seconds
- Next.js 15 (App Router, JS, no TypeScript) on **Vercel**. Pages in `app/[lang]` (en/es), site components in `segments/` and `elements/`.
- **One bot brain**: `bot/src/respond.js` (text) used by `app/api/chat`, `app/api/twilio/sms`. Prompt = `bot/config/prompt.md` + `bot/config/*.json` built by `bot/src/prompt.js`.
- **Phone**: Twilio → `app/api/twilio/voice` (TwiML `<Connect><Stream>`) → `voice-bridge/server.js` (Node + `ws`, deployed on **Railway**, NOT Vercel) → xAI Grok Voice Agent realtime API (`wss://api.x.ai/v1/realtime`, μ-law 8 kHz both ways, no transcoding).
- **Requests** (appointment/call-back): `submit_lead` tool or widget form → `app/api/lead` → `bot/src/leads.js` → email via `app/server/submitform/email.js` (+ optional SMS). The model is never the only record of a lead.
- **Other sites**: `public/embed.js` (shadow-DOM widget) → CORS-allow-listed `/api/chat` and `/api/lead` (`ALLOWED_ORIGINS`).
- LLM provider is **xAI (Grok)**: chat via OpenAI-compatible `https://api.x.ai/v1/chat/completions` (`bot/src/xai.js`), voice via realtime WebSocket. Env: `XAI_API_KEY`.

## Commands (run from repo root)
```bash
npm ci
npm test            # 13 tests, no network/keys needed (fake Twilio + fake Grok). MUST pass before any commit.
npx next build      # includes lint + types; MUST pass
npm run dev         # local site
XAI_API_KEY=… npm run eval   # behavior regressions vs the REAL model (bot/config/training/examples.jsonl)
npm run voice-bridge         # needs XAI_API_KEY + BOT_API_SECRET
```
Plain-Node code (`bot/`, `voice-bridge/`) is ESM (`"type":"module"` in their package.json). Keep it dependency-free except `ws` and Node built-ins; it is imported by both Next and the bridge.

## Hard rules (do not violate)
1. **Never commit secrets.** No keys, SMTP passwords, tokens. `.env*` is gitignored; use `.env.example` names only. The old `.env.production/.development` were committed historically → credentials must be rotated (see Open items).
2. **No PHI in the bot.** The bot may collect only: name, phone, service, preferred time. Do not add fields for symptoms, DOB, insurance, SSN, medications. Do not log transcripts or message bodies. Do not send patient data to any vendor without a signed BAA.
3. **No medical advice/claims.** Wording in `bot/config/services.json` and `prompt.md` must not say a treatment cures/treats/prevents anything or promise results; no invented prices. FDA wording needs clinic sign-off.
4. **Safety layer stays in front of the model**: `bot/src/safety.js` + `bot/config/safety.json` run BEFORE the LLM for chat/SMS. Don't remove or move after the model. Add patterns, never loosen without a test.
5. **Webhook security stays on**: Twilio signature check on `/api/twilio/*`, signed stream token checked by the bridge, `x-bot-secret` or allow-listed origin on `/api/lead`, rate limits and input validation on `/api/chat`.
6. Every behavior change → add/adjust a test in `bot/test/` and, for model behavior, a line in `bot/config/training/examples.jsonl`.
7. Don't push to `master` directly; open a PR. Keep commits small. Don't edit unrelated site pages in the same PR.

## Where to change things
| Goal | Edit |
|---|---|
| Persona, voice id/speed, greetings | `bot/config/persona.json` |
| Hours, address, phone, transfer number | `bot/config/clinic.json` |
| Services / FAQs | `bot/config/services.json`, `faqs.json` (+ articles in `json/en/blogs/*.json` are auto-searchable) |
| Rules / tone / channel behavior | `bot/config/prompt.md`, `CHANNEL_RULES` in `bot/src/prompt.js` |
| New tool the bot can call | `TOOL_DEFS` + `runTool` in `bot/src/tools.js`; list it in `TEXT_TOOLS` (`respond.js`) and/or `TOOLS` (`voice-bridge/server.js`); update prompt; add test |
| New text channel | copy `app/api/twilio/sms/route.js`; call `respond()` |
| Website widget UI | `elements/FrontDeskChatbot.jsx` + `frontDeskChatbot.module.scss` (keep greeting text in sync with `persona.json`) |
| Partner-site widget | `public/embed.js` (vanilla JS; use `textContent`, never `innerHTML` for message text) |

## Status
**Done and verified locally (fakes, no real keys):** bot core, chat/SMS/voice/lead routes, voice bridge protocol against a fake Grok+Twilio, widget fixes, embed script, docs, 13 unit/integration tests, 19 route checks against `next start`, production build.

**NOT verified with real services — do these first:**
1. Real call test: Twilio number → Vercel webhook → Railway bridge → Grok. Confirm event names (`response.output_audio.delta`, `input_audio_buffer.speech_started` barge-in, `response.function_call_arguments.done`) against xAI docs `https://docs.x.ai/developers/model-capabilities/audio/voice-agent`; the bridge logs `xai error …` on mismatch.
2. Confirm chat model id (`XAI_CHAT_MODEL`, default `grok-4.7`) exists on the account; confirm `GET https://api.x.ai/v1/tts/voices` and choose the final female voice for `persona.json` (`eve` is a placeholder).
3. Real email delivery through `/api/lead` (Brevo) and optional staff SMS.
4. Run `npm run eval` with a real key and fix failures (prompt/config), not the tests.
5. Browser check of the widget (open/close, Esc, mic permissions, ES/EN, forms, mobile ≤ 480 px).

## Open items / backlog (priority order)
1. **Rotate credentials** that were in git history: Brevo SMTP password (`EMAIL_PASS`), `ENCRYPTION_KEY`. Then consider purging history (`git filter-repo`) if the repo is/was public.
2. **BAAs / compliance** with Twilio, xAI, Vercel, Railway, Brevo; legal review of recording + AI disclosure (Florida all-party consent). Owner to confirm; code cannot fix this.
3. **Voice emergency interception in code**: currently voice relies on the prompt. Enable input transcription (`audio.input.transcription`, model `grok-transcribe`), run `isEmergency()` on `conversation.item.input_audio_transcription.updated`, and force an emergency `response.create` with the safety text.
4. Shared rate limit + SMS memory: add Upstash Redis (env vars in `.env.example`); code already uses it when present (`bot/src/store.js`).
5. Grok voice in the website widget (browser mic → xAI realtime via ephemeral token `xai-client-secret.<token>` WebSocket subprotocol; needs a server route that mints the token — check xAI docs for the endpoint).
6. Real availability/booking tool (scheduling-system integration) and a call-back confirmation SMS.
7. Pronunciation/keyterms for brand words (Exomind, V-Tone, NAD+) via xAI session `replace` / `transcription.keyterms`.
8. Consolidate the two widget UIs (React + `embed.js`) or generate one from the other.
9. Twilio A2P 10DLC registration for SMS; STOP/HELP are handled by Twilio.

## Gotchas
- Vercel serverless can't host the Twilio↔Grok WebSocket → bridge lives in `voice-bridge/` on Railway (`railway.json`).
- `outputFileTracingIncludes` in `next.config.mjs` bundles `bot/config` and `json/en` into API functions; if you move those folders, update it.
- Next.js loads `.env.production` automatically; never put real values in committed env files.
- `PUBLIC_BASE_URL` must equal the exact URL Twilio calls or signature validation returns 403 (also on Preview URLs, so test with a tunnel + a second number).
- The middleware locale-redirects every non-`/api` path; static files with extensions are exempt (`embed.js` works because of that).
