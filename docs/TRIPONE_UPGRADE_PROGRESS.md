# TripOne+ upgrade progress

Last updated: 2026-09-07

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
| 2. Multi-service model           | In progress | Schema and UI implementation on the Part 4 branch.                                                                                                   |
| 3. Page selection/templates      | Pending     | Starts after milestone 2 gates pass.                                                                                                                 |
| 4. Sections/themes/global chrome | Pending     | Existing registry and four themes are retained as the base.                                                                                          |
| 5. SEO/tracking/public resolver  | Pending     | Existing immutable snapshots and tenant resolver are retained as the base.                                                                           |
| 6. Full acceptance               | Pending     | Final gate includes responsive browser inspection and production smoke tests.                                                                        |

## Decision log

- 2026-09-07: Fast-forwarded the verified generation repair to `main` and pushed it, allowing the existing Vercel Git integration to deploy it.
- 2026-09-07: Created `feature/part4-multi-service` for the larger upgrade. Part 4 will not be merged into production until its acceptance gates pass.
- 2026-09-07: Chose additive normalized tables for capabilities, rentals, taxonomies, assignments, and templates to preserve legacy records and snapshots.

## External dependencies

- Supabase migrations require access to project `jwjxiobasakkkunyyohk`.
- Vercel production settings and GitHub branch protection remain account-controlled. No credential is stored in this repository.
- Making `triponeplus.com` live requires the domain owner to add and verify it in Vercel and configure DNS at the authoritative provider.
