# IMW Front Desk Assistant ("Mia") — Developer & Operator Guide

One bot "brain", many channels:

```
Website widget (React) ──┐
Partner sites (embed.js) ─┼─► /api/chat ─┐
SMS (Twilio) ─────────────┴─► /api/twilio/sms ─┤
                                               ├─► bot/src/respond.js ─► Grok chat (xAI)
Phone call ─► Twilio ─► /api/twilio/voice       │      ▲ prompt.md + config/*.json + retrieval
                          │ (TwiML: Connect Stream)     │
                          ▼                              │
                   voice-bridge (Railway) ─► Grok Voice Agent (xAI realtime, same prompt + tools)
                          │
Requests (name + phone) ──┴─► /api/lead ─► email (+ optional SMS) to staff
```

| Part | Where it runs | Folder |
|---|---|---|
| Website, chat API, SMS + voice webhooks, lead API | **Vercel** | `app/`, `elements/`, `bot/` |
| Live phone audio bridge (WebSocket) | **Railway** (always-on; Vercel cannot hold this socket) | `voice-bridge/` |
| Persona, facts, services, FAQs, safety, prompt | plain files, no code | `bot/config/` |
| Shared logic (prompt builder, tools, safety, leads) | imported by both | `bot/src/` |

## 1. What a developer can change without touching code

All in `bot/config/` (edit, commit, redeploy):

| File | Change this to… |
|---|---|
| `persona.json` | name, personality, Grok voice id, speaking speed, greetings (chat/voice/SMS, EN/ES) |
| `clinic.json` | address, phone, hours, timezone, transfer number, related sites |
| `services.json` | approved service descriptions (also searched by the `lookup_service_info` tool) |
| `faqs.json` | Q&A the bot may answer; keep answers short and speakable |
| `safety.json` | emergency phrases (regex), the exact emergency reply text, SMS stop words |
| `prompt.md` | the full instruction text (identity, rules, channel behavior) |
| `training/examples.jsonl` | regression tests (see §5) |

Website articles in `json/en/blogs/*.json` are automatically searchable by the bot (keyword retrieval in `bot/src/retrieve.js`). Add a JSON file there and the bot can use it. No retraining.

Other developers: they need repo access, their own `.env.local` (copy `.env.example`), and `npm test`. Secrets live only in Vercel/Railway, never in git.

## 2. Environment variables (full list in `.env.example`)

Add in Vercel: **Project → Settings → Environment Variables → Add → pick Production/Preview/Development → Save → redeploy.**
Add the Railway set in **Railway → service → Variables**.

| Variable | Vercel | Railway | Notes |
|---|:-:|:-:|---|
| `XAI_API_KEY` | ✔ | ✔ | you said Vercel already has it; Railway needs it too |
| `BOT_API_SECRET` | ✔ | ✔ | **same value both places**; `openssl rand -hex 32` |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` | ✔ | ✔ | Railway needs them for call transfer |
| `TWILIO_PHONE_NUMBER` | ✔ | | |
| `PUBLIC_BASE_URL` | ✔ | | the exact public domain Twilio calls, e.g. `https://innovativemedicalwellness.com` |
| `VOICE_BRIDGE_URL` | ✔ | | `wss://<railway-domain>/twilio-stream` |
| `LEAD_ENDPOINT` | | ✔ | `https://innovativemedicalwellness.com/api/lead` |
| `STAFF_NOTIFY_EMAIL`, `EMAIL_*`, `SENDER` | ✔ | | where requests are emailed |
| `STAFF_NOTIFY_PHONE` | ✔ | | optional text per request |
| `ALLOWED_ORIGINS` | ✔ | | partner sites that embed the widget |
| `XAI_VOICE_MODEL`, `XAI_VOICE_REASONING`, `HANDOFF_PHONE`, `MAX_*` | | ✔ | optional |
| `UPSTASH_REDIS_REST_URL/TOKEN` | ✔ | | optional; shared rate limit + SMS conversation memory |

## 3. Phone number: step by step

1. **Twilio account.** Create/upgrade a paid account. For a clinic, enable HIPAA eligibility and **sign Twilio's BAA** (Twilio Console → Account → HIPAA). Do not go live with real patients before the BAAs in §6 are done.
2. **Buy a number** (Phone Numbers → Buy) with *Voice* and *SMS* capability. Or port the clinic's existing number later (porting takes days; test on a new number first).
3. **Deploy the bridge on Railway.**
   - New Project → Deploy from GitHub → this repo (root directory = repo root; `railway.json` sets the start command).
   - Variables: `XAI_API_KEY`, `BOT_API_SECRET`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `LEAD_ENDPOINT`.
   - Settings → Networking → **Generate Domain**. Open `https://<domain>/health` — it should return `{"ok":true,"hasKey":true,"hasSecret":true}`.
4. **Set Vercel variables** `VOICE_BRIDGE_URL=wss://<domain>/twilio-stream`, `PUBLIC_BASE_URL`, `BOT_API_SECRET`, `TWILIO_AUTH_TOKEN`; redeploy.
5. **Point the number at the site.** Twilio Console → Phone Numbers → your number:
   - *A call comes in* → **Webhook**, `https://innovativemedicalwellness.com/api/twilio/voice`, **HTTP POST**.
   - *A message comes in* → **Webhook**, `https://innovativemedicalwellness.com/api/twilio/sms`, **HTTP POST**.
   - Save.
6. **Test.** Call the number. Expected: greeting with "I'm an AI / call may be recorded" → conversation → ask to book (name, phone, service) → staff email arrives → ask for a person (office hours only) → transfers.
7. **Webhooks in Preview deployments** won't validate (the URL differs). Test with `ngrok http 3000`, set `PUBLIC_BASE_URL` to the ngrok URL locally, and point a *second* Twilio number at it.

How a call flows: Twilio → `/api/twilio/voice` (verifies Twilio's signature, returns TwiML `<Connect><Stream>` with a short-lived signed token) → Twilio opens a WebSocket to the bridge → the bridge verifies the token, opens Grok's realtime socket, and forwards **μ-law 8 kHz audio both ways with no conversion**. Grok runs the same prompt and tools. If the bridge or key is missing, callers hear a short fallback message instead of silence.

## 4. Voice: "professional, excited female"

- `persona.json → voice.grokVoice` picks the voice (currently `luna`; xAI default is `eve`). List voices with `curl -H "Authorization: Bearer $XAI_API_KEY" https://api.x.ai/v1/tts/voices`, audition a few, and set the one you like. Speed: `voice.speed` (0.7–1.5).
- Energy is controlled by `prompt.md → Personality and voice` and the channel rules in `bot/src/prompt.js`. Make it more/less upbeat by editing those sentences, then call and listen.
- **Custom voice (closest thing to "training" the voice):** xAI supports custom voices; see the "Custom Voices" guide in xAI's voice docs. Once created, put its `voice_id` in `grokVoice`. Only use a voice you have the rights/consent to clone.
- Low latency vs. quality: `XAI_VOICE_REASONING=none` (fast, default here) or `high` (smarter, slower).
- Not wired yet (possible next steps): browser microphone → Grok (needs an ephemeral-token endpoint), automatic Spanish/English switching hints, pronunciation overrides for brand words.

## 5. Giving the bot information, "training" it, and fine-tuning

Recommended order (cheapest and safest first). Facts about a clinic change (hours, offers, FDA language), so **do not bake them into model weights**.

1. **Facts and tone → config files (instant).** Edit `clinic.json`, `services.json`, `faqs.json`, `prompt.md`. Anything the bot may say as fact must be in these files or the website JSON. The prompt tells it to say "I don't know, I'll have the office call you" otherwise.
2. **Long content → retrieval.** Drop approved articles, price sheets (if the clinic wants prices stated), provider bios, policies into `json/en/blogs/` (any JSON with strings works). The bot searches them with `lookup_service_info`. Later, move to an xAI collection / vector store (`file_search` tool in the voice session; swap `search()` in `retrieve.js`) when content outgrows keyword search.
3. **Behavior → evals.** Every time the bot gets something wrong, add a line to `bot/config/training/examples.jsonl`:
   ```json
   {"input":"Does NAD+ cure aging?","expect_not_contains":["cures","guaranteed"],"tag":"no-claims"}
   ```
   Run `XAI_API_KEY=… npm run eval` before each prompt/config change (uses the real model, real prompt, real safety layer). `npm test` covers the deterministic parts (safety, validation, signatures, call bridge).
4. **Review real conversations.** Add logging you are allowed to keep (de-identified, see §6), review weekly, turn each miss into an eval line and a prompt/config fix.
5. **Fine-tuning (last resort).** I have not verified whether xAI currently offers fine-tuning for Grok chat or voice models — check console.x.ai / xAI docs before planning around it. If you do fine-tune: use only de-identified, clinic-approved example dialogues (hundreds, reviewed by a clinician), never raw calls; keep facts in retrieval, not in the tuned model; re-run all evals on the tuned model and keep the prompt/safety layer in front of it. For most front-desk bots, steps 1–4 get you further than fine-tuning.

## 6. Compliance checklist (do before real patients use it)

- [ ] **BAAs** (signed, in writing) with every vendor that can hear or read patient info: **Twilio**, **xAI**, **Vercel**, **Railway**, Brevo (email). If a vendor won't sign one, don't send patient-identifiable data through it. Ask xAI directly about HIPAA/BAA availability for the Voice and Chat APIs.
- [ ] **Counsel/compliance review** of call recording and AI disclosure. Florida generally requires consent of all parties to record. The scripted greeting says it is an AI and the call may be recorded; the bridge does **not** record audio itself (Twilio call recording is off by default; don't enable it without a policy).
- [ ] **Medical claims**: have the clinic confirm FDA wording for Exomind/V-Tone in `services.json`.
- [ ] **No PHI by design**: the bot collects only name, phone, service, preferred time, and is told to stop people from sharing medical details. Callers may still volunteer them; the bridge logs no transcripts. Decide on retention before adding logging.
- [ ] **Emergencies**: chat and SMS use a deterministic check *before* the model (`safety.json`). **Voice relies on the model following the prompt** (there is no code-level interception of speech yet) — test this by phone with scripted emergencies, and consider adding transcript scanning.
- [ ] Rotate credentials that were committed to git (Brevo password, `ENCRYPTION_KEY`) and purge them from history if the repo is or was public.
- [ ] SMS: Twilio handles STOP/HELP automatically. US A2P 10DLC registration is required for business texting; register the brand/campaign.

## 6b. Medical-claims guard, booking and AIMS intake

- **Claims guard** (`bot/src/claims.js`): every chat/SMS reply is checked in code before it is shown. Any claim-like phrase (cure, treat, heal, prevent, relief, safe, FDA, proven, percentages, timelines, dosages, "you have…", and Spanish equivalents, plus spaced-out/obfuscated spellings) replaces the reply with a safe fallback that offers an appointment. It is intentionally strict. `npm test` also checks that all approved clinic text passes the guard.
- **What it cannot do:** the live **phone** voice speaks directly from Grok, so there is no code point to screen a sentence before it is spoken. Phone safety rests on the prompt, approved-text-only knowledge, tests, and review of calls. The stricter design (transcribe the caller → text model → claims guard → speak) removes that gap at the cost of extra delay. **Decision for the owner.**
- No AI can be mathematically guaranteed never to say something wrong; the layers (approved wording, prompt, guard, tests, review) make it very unlikely and make any miss detectable.
- **Change control:** `.github/CODEOWNERS` + `AGENTS.md` say any change touching claims, HIPAA/PHI, safety or vendor data flows is refused and escalated to Jasmel. Turn on "Require review from Code Owners" in GitHub branch protection for this to be enforced.
- **Booking:** the prompt makes Mia offer an appointment after every answer (never during emergencies, never pressuring).
- **Intake:** after an appointment request reaches staff, the patient is texted `INTAKE_URL` (their doctor's AIMS intake link). Not sent for call-back requests, if the link is missing/not https, or if staff could not be notified. Staff call and book in the AIMS calendar.

## 7. Adding a channel or a tool

- **New text channel** (WhatsApp, Instagram, GoHighLevel): create a route that verifies the sender, maps the incoming text to `respond({ messages, channel: 'chat'|'sms', lang })`, and returns the reply. About 30 lines; copy `app/api/twilio/sms/route.js`.
- **New tool** (e.g., check real availability in a scheduling system): add its schema to `TOOL_DEFS` and a branch in `runTool` in `bot/src/tools.js`, list it in `TEXT_TOOLS` (`respond.js`) and/or `TOOLS` (`voice-bridge/server.js`), add a sentence to `prompt.md`, add a test.
- **Partner site install:** add the site to `ALLOWED_ORIGINS` (Vercel), then paste on that site:
  `<script src="https://innovativemedicalwellness.com/embed.js" data-lang="en" async></script>`
  (`data-color="#005d93"` changes the accent). The embedded widget is text + tap-to-call + a call-back form; it lives in a shadow DOM so partner CSS can't break it.

## 8. Commands

```bash
npm run dev            # site + API on :3000
npm test               # 13 tests: safety, prompt, validation, Twilio signatures, tool loop, full call bridge (fake Twilio + fake Grok)
npm run eval           # behavior regression against the real model (needs XAI_API_KEY)
npm run voice-bridge   # run the bridge locally (needs XAI_API_KEY, BOT_API_SECRET)
```

## 9. Known limits

- In-memory rate limiting is per serverless instance; add Upstash (see `.env.example`) for a shared limit and SMS memory.
- The website widget's voice uses the browser's built-in speech (Chrome/Edge/Safari), not Grok. Grok voice is the phone line.
- Real xAI/Twilio/SMTP connections were **not** exercised in automated tests (no keys in CI); tests use fakes that follow xAI's documented event names. Do the phone test in §3.6 before launch. If a Grok event name differs (e.g., barge-in), the bridge logs `xai error` lines; adjust the `switch` in `voice-bridge/server.js`.
