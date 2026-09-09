# TripOne+ upgrade progress

Last updated: 2026-09-09

## Branch and deployment

- Production branch: `main`
- Part 4 branch: `feature/part4-multi-service`
- Production release: `d0ae6e4` (pushed to `origin/main`)
- Production host currently configured by the repository: `tools.neurerohan.com.np`
- `triponeplus.com` is not treated as an available tenant domain until ownership and DNS verification exist.

## Status

| Milestone                        | Status   | Evidence                                                                                                                                                                                           |
| -------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Generation repair             | Complete | Advisory-lock transaction, URL validation, safe error correlation, duplicate-submit guard, rollback database coverage and clean Supabase lint.                                                     |
| 2. Multi-service model           | Complete | Capabilities, rentals/rates, five taxonomies, tenant-safe assignments, management routes, onboarding, preview and schema-v3 immutable publishing pass their gates.                                 |
| 3. Page selection/templates      | Complete | Deterministic multi-capability recipes, optional pages, revision-safe templates, typed bindings, record-level experience/rental/taxonomy/location overrides and inheritance reset.                 |
| 4. Sections/themes/global chrome | Complete | Eight tokenized themes, 27 typed sections, meaningful layout variants, saved sections and visual header/footer controls render through one shared production renderer.                             |
| 5. SEO/tracking/public resolver  | Complete | Prefix-aware metadata/sitemaps, resource SEO, truthful JSON-LD, nested taxonomy redirects, fallback forms, product analytics, consent-aware typed integrations and origin isolation.               |
| 6. Full acceptance               | Complete | Strict TypeScript, ESLint, 43 unit tests, six rollback database suites, production build, authenticated flows, isolated-script proof and five-width browser matrix pass locally and in production. |

## Decision log

- 2026-09-07: Fast-forwarded the verified generation repair to `main` and pushed it, allowing the existing Vercel Git integration to deploy it.
- 2026-09-07: Created `feature/part4-multi-service` for the larger upgrade. Part 4 will not be merged into production until its acceptance gates pass.
- 2026-09-07: Chose additive normalized tables for capabilities, rentals, taxonomies, assignments, and templates to preserve legacy records and snapshots.
- 2026-09-07: Applied `20260907003000_part4_multi_service_core.sql` and `20260907010000_part4_atomic_capabilities.sql` through the official Supabase migration CLI.
- 2026-09-07: Replaced unverified `slug.triponeplus.com` presentation with the real `/s/{siteSlug}` fallback. Verified domains still take priority.
- 2026-09-08: Kept shared-origin fallback sites free of tenant-controlled scripts; their discoverability uses `/s/{siteSlug}/sitemap` and server-rendered published snapshots.
- 2026-09-08: Applied the template-publishing, record-layout, fallback-delivery, rental-analytics and taxonomy-redirect migrations after rollback validation.
- 2026-09-09: Made `https://tools.neurerohan.com.np/s/{siteSlug}` the authoritative platform-hosted customer address. Reserved `*.triponeplus.com` rows are pending and cannot become public or canonical without real ownership and verification.
- 2026-09-09: Completed real browser acceptance against published site `dipson-tours` at 375, 430, 768, 1024 and 1440 px. A disposable authenticated QA user also passed onboarding and builder autosave, then was deleted with its owned fixtures.
- 2026-09-09: Proved advanced code executes on a disposable verified tenant origin under a nonce-bound CSP, cannot access private app API routes, and remains absent from the shared `/s/` origin. The fixture was deleted afterward.
- 2026-09-09: Fast-forwarded the fully accepted Part 4 branch to `main`. GitHub CI passed and Vercel deployed the release at `https://tools.neurerohan.com.np`; the customer example is live at `/s/dipson-tours`.

## Latest verification

- TypeScript: passed (`tsc --noEmit`).
- ESLint: passed.
- Unit tests: 43 passed; one opt-in live-snapshot contract test skipped when its environment fixture is absent.
- Database integration: six suites passed against the authorized Supabase project and rolled back every fixture.
- Production build: passed with Next.js 16.3.4 and all application/customer routes generated successfully.
- Browser acceptance: 11 desktop/responsive checks plus two mobile checks passed; authenticated onboarding, builder, and isolated tenant-script checks passed independently.
- Production smoke: the same 13 applicable browser checks passed against `tools.neurerohan.com.np`; home, login, customer site and customer sitemap return 200, unknown site/page routes return 404, and root robots advertises the customer sitemap.
- Dependency audit: no known vulnerabilities.
- Remote database: all migrations through `20260908203000` are applied; `public`, `private` and `extensions` pass Supabase database lint with no schema errors.

## External dependencies

- Vercel environment management, future custom-domain attachment and GitHub branch protection remain account-controlled. No credential is stored in this repository.
- Making `triponeplus.com` live requires the domain owner to add and verify it in Vercel and configure DNS at the authoritative provider.
