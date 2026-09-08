# TripOne+ upgrade progress

Last updated: 2026-09-08

## Branch and deployment

- Production branch: `main`
- Part 4 branch: `feature/part4-multi-service`
- Baseline repair commit: `3b5161f` (pushed to `origin/main`)
- Production host currently configured by the repository: `tools.neurerohan.com.np`
- `triponeplus.com` is not treated as an available tenant domain until ownership and DNS verification exist.

## Status

| Milestone                        | Status      | Evidence                                                                                                                                             |
| -------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Generation repair             | Complete    | Advisory-lock transaction, URL validation, safe error correlation, duplicate-submit guard, 25 unit tests, rollback DB test, clean Supabase advisors. |
| 2. Multi-service model           | Complete    | Capabilities, rentals/rates, five taxonomies, same-tenant assignments, management routes, preview, and schema-v2 publishing passed their gates.      |
| 3. Page selection/templates      | In progress | Deterministic multi-capability page selection, optional-page controls, rental onboarding, revision-safe visual template editing, typed bindings and v3 snapshot migration are implemented. Record-specific override controls remain. |
| 4. Sections/themes/global chrome | In progress | Eight themes, the typed section registry, linked/copy saved sections, and visual global header/footer controls render through the shared renderer. Broader per-section specialized render treatments remain. |
| 5. SEO/tracking/public resolver  | In progress | Working `/s/{siteSlug}` publishing, prefix-aware canonicals/navigation/sitemaps, rentals and nested taxonomy landing pages are implemented. Typed third-party integration loaders and the final audit remain. |
| 6. Full acceptance               | Pending     | Final gate includes responsive browser inspection and production smoke tests.                                                                        |

## Decision log

- 2026-09-07: Fast-forwarded the verified generation repair to `main` and pushed it, allowing the existing Vercel Git integration to deploy it.
- 2026-09-07: Created `feature/part4-multi-service` for the larger upgrade. Part 4 will not be merged into production until its acceptance gates pass.
- 2026-09-07: Chose additive normalized tables for capabilities, rentals, taxonomies, assignments, and templates to preserve legacy records and snapshots.
- 2026-09-07: Applied `20260907003000_part4_multi_service_core.sql` and `20260907010000_part4_atomic_capabilities.sql` through the official Supabase migration CLI.
- 2026-09-07: Replaced unverified `slug.triponeplus.com` presentation with the real `/s/{siteSlug}` fallback. Verified domains still take priority.
- 2026-09-08: Kept shared-origin fallback sites free of tenant-controlled scripts; their discoverability uses `/s/{siteSlug}/sitemap` and server-rendered published snapshots.
- 2026-09-08: Added additive migration `20260908152000_part4_template_publishing.sql` for atomic rental onboarding, optimistic template versions, record override columns, and schema-v3 immutable publish graphs. It is locally authored but not remotely applied because official Supabase CLI authentication is not available in this checkout.

## Latest verification

- TypeScript: passed (`tsc --noEmit`).
- ESLint: passed.
- Unit tests: 37 passed across 7 files.
- Database integration: generation repair and Part 4 multi-service suites passed; both roll back fixtures.
- Production build: passed with Next.js 16.3.4; the path fallback now exposes dynamic `/s/[siteSlug]/sitemap` and published-only customer routes.
- Remote database gate: pending for the 2026-09-08 migration. Password recovery from old session logs was deliberately blocked; use an official Supabase access token/link or an explicitly configured `TRIPONE_DATABASE_URL`.

## External dependencies

- Supabase migrations require access to project `jwjxiobasakkkunyyohk`.
- Vercel production settings and GitHub branch protection remain account-controlled. No credential is stored in this repository.
- Making `triponeplus.com` live requires the domain owner to add and verify it in Vercel and configure DNS at the authoritative provider.
