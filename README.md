# Portfolio

Next.js 15 portfolio with a built-in CMS (single-admin, password + 2FA) backed by Upstash Redis.

## Scripts

```bash
npm run dev    # start dev server on :3000
npm run build  # production build
npm start      # run production build
npm test       # jest unit tests (lib/* only)
npm run lint   # next lint
```

## CMS architecture

- **Source of truth**: Upstash Redis (provisioned via Vercel Marketplace) — three keys (`projects`, `experiences`, `music`), each holding one JSON document. Free tier handles a portfolio's data trivially (256 MB, 500K commands/month, no per-key size limit that matters at this scale).
- **Reads**: `src/lib/cms.js` reads via `@upstash/redis` SDK (REST-based, ~5–15ms), wrapped in `unstable_cache` with tag-based revalidation. Writes invalidate cached pages automatically.
- **Writes**: `setCollection()` calls `redis.set(key, value)`. Authed admins only.
- **Asset URLs**: stored as relative paths (e.g. `/projects/foo/cover.webp`); resolved at render time via `ASSETS_BASE_URL` env var. Cleanly swappable if assets move.
- **Local fallback**: bundled snapshots at `src/data/{projects,experiences,music}.json` are used when Redis isn't configured (e.g. local dev without env, or initial deploy before seeding). Snapshots are read-only — they're seed data, not the source of truth in prod.

## Required env vars

Add via Vercel dashboard → Settings → Environment Variables. Tick **Sensitive** for everything in the "secrets" group below — that makes the value write-only after creation.

### Public site

| Var | Purpose |
|---|---|
| `ASSETS_BASE_URL` | Base URL for image/audio assets, e.g. `https://vudoan1708-cyber.github.io/logos/portfolio` |

### CMS reads + writes

Auto-injected when you connect Upstash Redis to your project via Vercel Marketplace. You don't typically set these by hand on Vercel.

| Var | Purpose | Sensitive |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST endpoint URL | |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST API token (read + write) | ✅ |

The adapter also accepts the legacy Vercel KV names (`KV_REST_API_URL` / `KV_REST_API_TOKEN`) as fallbacks if your project was created with the older Vercel KV integration.

### Admin auth

| Var | Purpose | Sensitive |
|---|---|---|
| `SESSION_SECRET` | 32+ char random string for iron-session cookie encryption | ✅ |
| `ADMIN_USERNAME` | Login username | |
| `ADMIN_PASSWORD_HASH` | bcrypt hash (cost 12) — generate with `node scripts/hash-password.mjs`. **In `.env.local`, backslash-escape every `$`** (`ADMIN_PASSWORD_HASH=\$2b\$12\$...`) — dotenv-expand mangles `$X` references regardless of quoting. The script prints the correctly-escaped line for you. Vercel env vars don't need escaping (paste raw). | ✅ |
| `ADMIN_TOTP_SECRET` | TOTP secret (base32) — generate with `node scripts/setup-2fa.mjs` | ✅ |

## First-time setup

1. **Provision Upstash Redis** in Vercel: Storage tab → Browse Marketplace → **Upstash for Redis** → connect to project. This auto-injects `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` across all environments.

2. **Set `ASSETS_BASE_URL`** to wherever your assets live (e.g. the GitHub Pages URL).

3. **Generate admin credentials locally**:

   ```bash
   node scripts/hash-password.mjs   # outputs ADMIN_PASSWORD_HASH=… (escaped for .env.local + raw for Vercel)
   node scripts/setup-2fa.mjs       # prints QR code + ADMIN_TOTP_SECRET=…
   ```

   Choose a username, hash a password (12+ chars), scan the QR with your authenticator app. Paste the raw hash into Vercel (mark Sensitive); paste the escaped hash into `.env.local`.

4. **Generate a session secret**:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   Paste into both Vercel (`SESSION_SECRET`, Sensitive) and `.env.local`.

5. **Seed Redis with the existing data**. Add the Upstash credentials to your local `.env.local` (Vercel-managed values can't be pulled if Sensitive — copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from the Vercel Storage page or paste them in by hand), then:

   ```bash
   node --env-file=.env.local scripts/seed-cms.mjs
   ```

   You should see `Seeding 3 key(s) into Upstash Redis…` followed by three `✓` lines.

6. **Deploy** (push a commit, or redeploy from the dashboard). Visit `/admin/login`. Enter username + password → 6-digit code → you're in.

## Security model

- Two-step auth: bcrypt-verified password (cost 12, ~250ms per attempt) + TOTP 2FA. Constant-time username compare. Uniform login latency on success/failure (250ms minimum).
- iron-session cookie: HttpOnly + Secure (in prod) + SameSite=Strict, encrypted by `SESSION_SECRET`, 7-day rolling expiry.
- Server actions are same-origin enforced by Next.js + `SameSite=Strict` cookies (CSRF).
- All form input goes through zod validators (`src/lib/validators.js`). Description fields allow a subset of HTML and reject `<script>`, event handlers, and `javascript:` URLs.
- `/admin/*` is excluded from `robots.txt` and `sitemap.xml`. No inbound nav.
- Rate limiting: bcrypt cost 12 + Vercel function concurrency provide the throttle. For stricter limits, add a Vercel WAF rule on `/admin/login`.

### Rotating secrets

Change any secret env var in Vercel → trigger a redeploy → old sessions are invalidated when `SESSION_SECRET` changes. Lost your TOTP device? Re-run `setup-2fa.mjs`, replace `ADMIN_TOTP_SECRET`, redeploy. Compromised Upstash token? Rotate it in the Upstash console and Vercel will pick up the new value on next deploy.

## Adding a new collection field

1. Update `src/lib/validators.js` (the relevant schema).
2. Update the form component (`ProjectForm.jsx` / `ExperienceForm.jsx` / `TrackForm.jsx`).
3. Update the consumer pages that render the new field.
4. Existing data in Redis will pass validation as long as the field is optional, otherwise re-seed or migrate manually via `setCollection()`.

## Tests

`npm test` runs jest against pure functions in `src/lib/*` — URL resolution, CMS read/write, validators (XSS rejection), auth (bcrypt + TOTP). UI is verified manually.

## Deployment notes

- The Vercel GitHub integration auto-rebuilds on push.
- Redis writes are strongly consistent — after a CMS save, the next public-page request that misses the `unstable_cache` window will see the new data. The admin UI reads from Redis directly (bypassing the cache) so the editor always sees fresh data.
- `next.config.js` has a `/` → `/portfolio` redirect (`permanent: false`).
