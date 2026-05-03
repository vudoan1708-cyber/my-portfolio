# Portfolio

Next.js 15 portfolio with a built-in CMS (single-admin, password + 2FA) backed by Vercel Edge Config.

## Scripts

```bash
npm run dev    # start dev server on :3000
npm run build  # production build
npm start      # run production build
npm test       # jest unit tests (lib/* only)
npm run lint   # next lint
```

## CMS architecture

- **Source of truth**: Vercel Edge Config — three keys (`projects`, `experiences`, `music`), each holding one JSON document.
- **Reads**: `src/lib/cms.js` reads via `@vercel/edge-config` SDK (sub-ms at the edge), wrapped in `unstable_cache` with tag-based revalidation. Writes invalidate cached pages automatically.
- **Writes**: `setCollection()` PATCHes the Vercel REST API. Authed admins only.
- **Asset URLs**: stored as relative paths (e.g. `/projects/foo/cover.webp`); resolved at render time via `ASSETS_BASE_URL` env var. Cleanly swappable if assets move.
- **Local fallback**: bundled snapshots at `src/data/{projects,experiences,music}.json` are used when Edge Config isn't configured (e.g. local dev without env, or initial deploy before seeding). Snapshots are read-only — they're seed data, not the source of truth in prod.

## Required env vars

Add via Vercel dashboard → Settings → Environment Variables. Tick **Sensitive** for everything in the "secrets" group below — that makes the value write-only after creation.

### Public site

| Var | Purpose |
|---|---|
| `ASSETS_BASE_URL` | Base URL for image/audio assets, e.g. `https://vudoan1708-cyber.github.io/logos/portfolio` |

### CMS reads

| Var | Purpose |
|---|---|
| `EDGE_CONFIG` | Connection string for the Edge Config (auto-populated when you connect the store to the project in Vercel) |

### CMS writes (server-only, never bundled)

| Var | Purpose | Sensitive |
|---|---|---|
| `VERCEL_API_TOKEN` | Token for writing to Edge Config via REST API | ✅ |
| `VERCEL_EDGE_CONFIG_ID` | The `ecfg_…` ID of your Edge Config | |
| `VERCEL_TEAM_ID` | Only if your Vercel account is on a team | |

### Admin auth

| Var | Purpose | Sensitive |
|---|---|---|
| `SESSION_SECRET` | 32+ char random string for iron-session cookie encryption | ✅ |
| `ADMIN_USERNAME` | Login username | |
| `ADMIN_PASSWORD_HASH` | bcrypt hash (cost 12) — generate with `node scripts/hash-password.mjs`. **In `.env.local`, backslash-escape every `$`** (`ADMIN_PASSWORD_HASH=\$2b\$12\$...`) — dotenv-expand mangles `$X` references regardless of quoting. The script prints the correctly-escaped line for you. Vercel env vars don't need escaping (paste raw). | ✅ |
| `ADMIN_TOTP_SECRET` | TOTP secret (base32) — generate with `node scripts/setup-2fa.mjs` | ✅ |

## First-time setup

1. **Create the Edge Config** in Vercel: Storage → Create → Edge Config → connect to project. This populates `EDGE_CONFIG` automatically. Note the `ecfg_…` ID.

2. **Generate a Vercel API token** (Account → Tokens). Copy it into `VERCEL_API_TOKEN`.

3. **Set asset base URL** — `ASSETS_BASE_URL` to wherever your assets live.

4. **Generate admin credentials locally**:

   ```bash
   node scripts/hash-password.mjs   # outputs ADMIN_PASSWORD_HASH=…
   node scripts/setup-2fa.mjs       # prints QR code + ADMIN_TOTP_SECRET=…
   ```

   Choose a username, hash a password (12+ chars), scan the QR with your authenticator app. Paste the resulting env vars into Vercel (mark Sensitive).

5. **Generate a session secret**:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   Paste into `SESSION_SECRET` (Sensitive).

6. **Seed Edge Config with the existing data**:

   ```bash
   vercel env pull .env.local       # pulls EDGE_CONFIG, VERCEL_API_TOKEN, VERCEL_EDGE_CONFIG_ID
   node --env-file=.env.local scripts/seed-edge-config.mjs
   ```

7. **Deploy**. Visit `/admin/login`. Enter username + password → 6-digit code → you're in.

## Security model

- Two-step auth: bcrypt-verified password (cost 12, ~250ms per attempt) + TOTP 2FA. Constant-time username compare. Uniform login latency on success/failure (250ms minimum).
- iron-session cookie: HttpOnly + Secure (in prod) + SameSite=Strict, encrypted by `SESSION_SECRET`, 7-day rolling expiry.
- Server actions are same-origin enforced by Next.js + `SameSite=Strict` cookies (CSRF).
- All form input goes through zod validators (`src/lib/validators.js`). Description fields allow a subset of HTML and reject `<script>`, event handlers, and `javascript:` URLs.
- `/admin/*` is excluded from `robots.txt` and `sitemap.xml`. No inbound nav.
- Rate limiting: bcrypt cost 12 + Vercel function concurrency provide the throttle. For stricter limits, add a Vercel WAF rule on `/admin/login`.

### Rotating secrets

Change any secret env var in Vercel → trigger a redeploy → old sessions are invalidated when `SESSION_SECRET` changes. Lost your TOTP device? Re-run `setup-2fa.mjs`, replace `ADMIN_TOTP_SECRET`, redeploy.

## Adding a new collection field

1. Update `src/lib/validators.js` (the relevant schema).
2. Update the form component (`ProjectForm.jsx` / `ExperienceForm.jsx` / `TrackForm.jsx`).
3. Update the consumer pages that render the new field.
4. Existing data in Edge Config will pass validation as long as the field is optional, otherwise re-seed or migrate manually via `setCollection()`.

## Tests

`npm test` runs jest against pure functions in `src/lib/*` — URL resolution, CMS read/write, validators (XSS rejection), auth (bcrypt + TOTP). UI is verified manually.

## Deployment notes

- The Vercel GitHub integration auto-rebuilds on push.
- After a CMS save, Edge Config write propagation is ~30s globally. The admin UI reads through the Vercel REST API (bypassing edge cache) so the editor always sees fresh data.
- `next.config.js` has a `/` → `/portfolio` redirect (`permanent: false`).
