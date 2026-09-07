# TripOne+

TripOne+ is a production-oriented vertical website platform for tour, activity, rental, guide and travel-package businesses. It turns structured business data into a deterministic website, then provides a guarded visual builder, tourism CMS, media library, SEO/CRO readiness tools, publishing, leads, first-party analytics and custom domains.

No AI or LLM API is used. Pages and copy come from typed category presets, page recipes, theme tokens and safe templates.

## Architecture

- Next.js 16 App Router and React 19; server components load private management data.
- Supabase Auth, PostgreSQL, Storage, RLS and narrow RPCs enforce tenant ownership.
- Draft rows power the editor. `publish_site` atomically creates an immutable snapshot and version; public websites read only that snapshot.
- `src/proxy.ts` identifies tenant hosts and rewrites them into `/tenant-sites/[hostname]` without duplicating the application or renderer.
- `SiteRenderer` powers builder canvas, authenticated preview and live customer sites.
- Verified `domains` rows resolve hostnames and select one primary canonical hostname.
- Public enquiries and analytics are accepted only through validated, fingerprint-rate-limited database functions. Analytics stores no full IP address or lead contents.
- Custom domain provider logic is isolated in `src/lib/domains/provider.ts`; missing Vercel credentials produce manual setup guidance, not fake verification.

## Route map

Marketing: `/`, `/features`, `/templates`, `/pricing`, `/privacy`, `/terms`, `/login`, `/signup`, `/forgot-password`, `/reset-password`.

Product: `/onboarding`, `/dashboard`, `/dashboard/account`, `/dashboard/sites/[siteId]`, plus `builder`, `experiences`, `rentals`, `taxonomies`, `services`, `pages`, `media`, `locations`, `testimonials`, `design`, `seo`, `seo/redirects`, `leads`, `analytics`, `domains` and `settings`.

Delivery: `/preview/[siteSlug]/[[...path]]` is authenticated and noindex. Live hostnames are internally rewritten to `/tenant-sites/[hostname]/[[...path]]`; tenant `/sitemap.xml` and `/robots.txt` use the same host-aware snapshot.

Published fallback: `/s/[siteSlug]/[[...path]]` renders the immutable published snapshot on the application origin until a customer or platform hostname is actually verified.

## Local setup

Requirements: Node.js 22+, Corepack and a Supabase project.

```powershell
corepack enable
corepack pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
corepack pnpm dev
```

Open `http://localhost:3000`. For tenant routing, add a local hosts-file entry such as `127.0.0.1 dubai-wave-jetski.localhost`, then open `http://dubai-wave-jetski.localhost:3000` after publishing the demo site. The authenticated `/preview` route works without a hosts-file entry.

## Environment variables

Required:

- `NEXT_PUBLIC_SITE_URL`: one absolute application origin. Use `https://tools.neurerohan.com.np` in the current production deployment; do not put comma-separated hosts here.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: public publishable key. A legacy anon key can use `NEXT_PUBLIC_SUPABASE_ANON_KEY` instead.
- `APP_HOSTS`: comma-separated non-tenant application aliases. Current production should include `tools.neurerohan.com.np,tripone-triponeplus-com.vercel.app`.

Optional server-only:

- `SUPABASE_SECRET_KEY` or legacy `SUPABASE_SERVICE_ROLE_KEY`: used only for the explicit account deletion flow. Never prefix it with `NEXT_PUBLIC_`.
- `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_TEAM_ID`: domain provisioning and verification. Team ID is optional for a personal project.
- `TRIPONE_DEMO_EMAIL`, `TRIPONE_DEMO_PASSWORD`: confirmed disposable seed user.
- `TRIPONE_E2E_EMAIL`, `TRIPONE_E2E_PASSWORD`, `TRIPONE_E2E_SITE_ID`: disposable Playwright user/site.

## Supabase setup

1. Install/login to the CLI and link the project:

   ```powershell
   npx supabase@latest login
   npx supabase@latest link --project-ref YOUR_PROJECT_REF
   npx supabase@latest db push
   npx supabase@latest migration list
   npx supabase@latest db advisors --linked --type security
   npx supabase@latest db advisors --linked --type performance
   ```

2. In Authentication → URL Configuration, set Site URL to `https://tools.neurerohan.com.np`. Add exact redirects:
   - `https://tools.neurerohan.com.np/auth/callback`
   - `https://tools.neurerohan.com.np/reset-password`
   - `https://tripone-triponeplus-com.vercel.app/auth/callback`
   - `https://tripone-triponeplus-com.vercel.app/reset-password`
   - `http://localhost:3000/**` for local development
   - the Vercel preview wildcard only for preview environments
3. Confirm email/password Auth is enabled. Supabase Auth handles confirmation and password-reset email; custom SMTP is optional.
4. Migrations create the `site-media` and `avatars` public buckets with authenticated owner-write policies and constrained MIME/size settings.
5. Rotate any database password or secret key that has ever been pasted into chat, logs or a public location. Store replacements only in Supabase/Vercel secret settings and `.env.local`.

### Migration order

1. `202609050001_initial_schema.sql`: core tables, enums, RLS and atomic generation.
2. `202609050002_storage.sql`: storage buckets and policies.
3. `202609050003_publish.sql`: initial publish function.
4. `202609050004_slug_availability.sql`: non-disclosing slug check.
5. `202609050005_child_integrity.sql`: ownership consistency.
6. `20260906053515_part2_builder.sql`: private drafts, snapshots, versions and lead rate limits.
7. `20260906061552_rls_performance.sql`: advisor-driven RLS optimization.
8. `20260906112116_part3_production.sql`: hostname resolver, default domains, canonical switching, exact redirects, analytics and final publishing snapshot.
9. `20260906115541_part3_advisor_fix.sql`: removes the duplicate domain index identified by the live database advisor.
10. `20260906181535_fix_create_generated_site_advisory_lock.sql`: fixes JSON extraction precedence in the transactional onboarding lock without changing the function's business logic.
11. `20260907003000_part4_multi_service_core.sql`: adds multi-service capabilities, rentals and rates, taxonomies, tenant-safe assignments, RLS, and schema-v2 publishing.
12. `20260907010000_part4_atomic_capabilities.sql`: keeps multi-capability onboarding inside the idempotent generation transaction.

## Demo data

Create and confirm a disposable Auth user, set the demo variables, then run:

```powershell
corepack pnpm seed:demo
```

This uses the same authenticated RLS-protected generator as onboarding and creates the demo-safe Dubai Wave Jetski business with three experiences.

## GitHub setup

This folder must be its own repository—do not accidentally use a parent home-directory repository.

```powershell
git init -b main
git add .
git commit -m "Build TripOne+ production SaaS"
gh auth login -h github.com
gh repo create triponeplus --private --source . --remote origin --push
```

The included `.github/workflows/ci.yml` runs install, lint, typecheck, unit tests and production build for pushes and pull requests. Never commit `.env.local` or provider tokens.

## Vercel deployment

1. Import the GitHub repository in Vercel or use the CLI:

   ```powershell
   npx vercel@latest login
   npx vercel@latest link
   npx vercel@latest env add NEXT_PUBLIC_SITE_URL production
   npx vercel@latest env add NEXT_PUBLIC_SUPABASE_URL production
   npx vercel@latest env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY production
   npx vercel@latest env add APP_HOSTS production
   npx vercel@latest deploy --prod
   ```

2. Add server-only Supabase and Vercel domain variables in Project Settings → Environment Variables. Apply them to Production and only to Preview when genuinely needed.
3. In Project Settings → Domains, keep `tools.neurerohan.com.np` and the existing Vercel alias attached. `triponeplus.com` is a future domain and must not be presented as currently owned or live.
4. Create a least-privilege Vercel token for this project, set project/team IDs, and redeploy. New TripOne+ subdomains and customer custom domains will then be attached and verified through the provider adapter.

## Cloudflare DNS

If `triponeplus.com` is acquired later and Cloudflare remains authoritative DNS:

- `@` → Vercel’s displayed apex A record (often `76.76.21.21`)
- `www` → Vercel’s displayed CNAME
- `tools` in the `neurerohan.com.np` zone → Vercel’s displayed CNAME
- `*` in the `triponeplus.com` zone → the Vercel project CNAME

Use DNS-only (grey cloud) until Vercel has issued certificates and every hostname passes `vercel domains inspect`. TripOne+ also attaches each created `slug.triponeplus.com` to the Vercel project, so Cloudflare can keep authority while Vercel issues a certificate for each real tenant. This avoids depending on Vercel’s wildcard-certificate workflow, which currently requires Vercel nameservers. Do not create a conflicting wildcard domain in the Vercel dashboard unless you intentionally move nameservers.

For customer domains, the Domains screen displays provider verification TXT records when Vercel returns them, otherwise the appropriate apex A or subdomain CNAME fallback. Verification is never faked.

## Testing

```powershell
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm test:db
corepack pnpm build
corepack pnpm test:e2e
```

Playwright public desktop/mobile smoke tests need no credentials. Authenticated onboarding/builder flows skip unless disposable E2E credentials exist. Complete the manual production checks in `docs/PRODUCTION_CHECKLIST.md` after DNS and provider credentials are configured.

`test:db` requires `TRIPONE_DATABASE_URL` and runs its disposable authenticated fixtures inside a transaction that ends with `ROLLBACK`. Use only a disposable database or an explicitly authorized project.

## Security notes

- Anonymous users cannot select management tables, drafts, leads or analytics. Published delivery uses narrow security-definer accessors with explicit grants.
- Every mutation revalidates input; server actions still depend on RLS instead of trusting route parameters.
- User HTML, JavaScript and CSS are not accepted. URLs reject unsafe protocols; uploaded SVG is disabled.
- Public lead and event endpoints hash a short-lived request fingerprint for rate limiting but do not store the source IP.
- Preview is authenticated and emits noindex/noarchive metadata.
- Legal pages are conspicuously marked placeholders and require professional review before launch.
