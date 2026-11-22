# AI Developer Upgrade Handoff — Innovative Medical Wellness (IMW / ExoMind)

## What Was Changed (Branch: `master`, Commit `9814f1c`)
- **Updated `app/robots.js`**: Removed `Disallow: /_next/` so Googlebot and AI bots can render Next.js assets properly.
- **Updated `app/[lang]/layout.js`**: Removed 16 non-standard/invented AI meta tags (`claude:instructions`, `openai:*`, etc.); kept standard Schema.org JSON-LD, canonicals, and `/llms.txt`.
- **Updated `app/components/MarketingAndAnalyticsScripts.jsx`**: Hardened Meta Pixel with `fbq('set', 'autoConfig', false, ...)` + Limited Data Use (`LDU`) for healthcare privacy, and added optional Umami analytics hook.

## Live Test Verification
- `https://innovativemedicalwellness.com`: HTTP `200`, `robots.txt` `200` (`/_next/` unblocked), `llms.txt` `200`.

## Developer Actions Needed
- To activate privacy-first HIPAA-safe analytics, create a website in Railway Umami (`https://umami-production-92f6d421.up.railway.app`) and set `NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://umami-production-92f6d421.up.railway.app/script.js` and `NEXT_PUBLIC_UMAMI_WEBSITE_ID=<id>` in Vercel.
