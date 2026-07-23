# Deploy — Tea Scan (Firebase Hosting + Cloudflare Worker AI proxy)

The site stays a **static** app on **Firebase Hosting** (no Blaze plan needed).
The AI features (Gongfu smart search + photo + quiz explanation) run on a free
**Cloudflare Worker** that holds the Anthropic key. The browser only knows the
Worker's public URL.

```
Browser ──(static)──> Firebase Hosting (mobile/dist-web)
   │
   └──(fetch /api/*)──> Cloudflare Worker (tea-scan-ai)  ──> Anthropic API
                         holds ANTHROPIC_API_KEY (secret)
```

## 1. Deploy the AI proxy (Cloudflare Worker — free, no card)

```bash
cd worker
npm install
npx wrangler login                       # one-time, opens browser
npx wrangler secret put ANTHROPIC_API_KEY # paste your sk-ant-... key
npm run deploy                            # prints https://tea-scan-ai.<sub>.workers.dev
```

(Optional) lock CORS to your domain: uncomment `ALLOWED_ORIGIN` in
`worker/wrangler.toml` and redeploy.

## 2. Point the app at the Worker and build the static site

```bash
cd mobile
npm install
echo "EXPO_PUBLIC_CHAT_API_URL=https://tea-scan-ai.<sub>.workers.dev" > .env
npm run build:web                         # outputs mobile/dist-web
```

## 3. Deploy the static site to Firebase Hosting

```bash
cd ..                                     # repo root (firebase.json lives here)
cp .firebaserc.example .firebaserc        # set YOUR_FIREBASE_PROJECT_ID
npx firebase deploy --only hosting
```

## Local development

```bash
# terminal 1 — AI proxy
cd worker && npm install && npm run dev          # http://localhost:8787

# terminal 2 — app (set EXPO_PUBLIC_CHAT_API_URL=http://localhost:8787 in mobile/.env)
cd mobile && npm install && npx expo start --web
```

Without `EXPO_PUBLIC_CHAT_API_URL` the app still runs: the local catalog and the
quiz work; only the AI search/photo and AI quiz explanation are disabled.
