# TripOne+ upgrade acceptance tests

## Automated gates

Run from the repository root:

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm test:db
pnpm build
pnpm test:e2e
```

Database tests must run inside a transaction and roll back their fixtures. They cover ownership, cross-tenant rejection, nested-term cycle prevention, capability backfill, rental rates, assignments, concurrent generation, public snapshot isolation, leads, and legacy snapshot decoding.

Latest local result (2026-09-08): TypeScript, ESLint, 37 unit tests, and the Next.js 16.3.4 production build pass. The new template/rental-onboarding database test is present but cannot be executed remotely until this checkout receives official Supabase CLI authentication or `TRIPONE_DATABASE_URL`; it is not counted as passed.

## Required operator fixtures

- Dubai Wave Jetski: jet-ski experiences plus jet-ski rental inventory, activity and destination terms.
- Nepal Summit Adventures: trekking, motorcycle tours, equipment rentals, nested Nepal destinations, and travel styles.

## Browser matrix

Inspect onboarding, dashboard content editors, builder, preview, and a published fallback site at widths 375, 430, 768, 1024, and 1440 pixels. Exercise keyboard navigation, focus visibility, drag-and-drop alternatives, error recovery, empty states, and theme previews.

## Publish and routing checks

- Draft changes never appear through anonymous RPCs or public routes.
- Home is always present; optional pages respect selections and capability merge order does not alter output.
- Renaming a published path creates a 301 redirect without a collision.
- The `/s/{siteSlug}` fallback keeps navigation, forms, canonical URLs, Open Graph URLs, structured data, and `/s/{siteSlug}/sitemap` entries prefix-aware.
- Unknown sites and paths return a real 404.
- Tracking consent is honored. Tenant advanced code is absent from the app, preview, and fallback origins.

## Release evidence

Before merge, record exact results for lint, typecheck, unit tests, DB tests, production build, Playwright, viewport screenshots, Supabase migration status, security/performance advisors, live HTTP status, and rollback notes in `TRIPONE_UPGRADE_PROGRESS.md`.
