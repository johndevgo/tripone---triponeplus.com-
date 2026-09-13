# TripOne+ test evidence

Updated: 2026-09-13

## Automated local evidence

| Command          | Result                                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `pnpm lint`      | Passed with zero errors and zero warnings after operations fixes.                                                        |
| `pnpm typecheck` | Passed under strict TypeScript.                                                                                          |
| `pnpm test`      | Passed: 13 files, 60 tests; one credential-dependent suite skipped.                                                      |
| `pnpm build`     | Passed with Next.js 16.3.4; all 36 static pages and operational routes compiled.                                         |
| `pnpm test:e2e`  | Passed: production build plus 16 public desktop/mobile browser tests; 22 credential or published-fixture cases skipped.  |
| visual review    | Passed: full-page 375px and 1440px captures inspected for hierarchy, image loading, overflow and responsive composition. |

The unit suite covers slug generation, deterministic presets and page recipes,
theme completeness, section registry/schema validation, SEO/structured-data
constraints, safe public URLs, operation forms and state transitions, package
references, timezone boundary conversion, calendar-date arithmetic, and five
mixed-industry fixtures.

## Database integration specification

`supabase/tests/operations_core.sql` is a rollback-only fixture suite covering:

- package save and duplicate-as-draft reference integrity;
- booking idempotency, including retry after a departure reaches capacity;
- fixed-departure overbooking rejection;
- overlapping resource-allocation rejection;
- invalid direct booking-state transition rejection;
- cancellation resource release;
- lead-to-customer and lead-to-booking conversion audit;
- cross-tenant read/write denial;
- anonymous booking-table denial;
- public request creation and public idempotent retry.

Run it after the migration with:

```powershell
$env:TRIPONE_DATABASE_URL = "YOUR_ROTATED_AUTHORIZED_DATABASE_URL"
corepack pnpm test:db:operations
```

It was not executed in this workspace because no database URL, Supabase access
token or local Docker runtime is available. This is an external validation
blocker, not a recorded pass.

## Browser acceptance still required

Public Playwright smoke tests can run without credentials. The complete
onboarding/builder and operations acceptance requires a disposable confirmed
user, a migrated Supabase project and these server-local variables:

- `TRIPONE_E2E_EMAIL`
- `TRIPONE_E2E_PASSWORD`
- `TRIPONE_E2E_SITE_ID`

Production acceptance must verify one real public booking request, its matching
customer and booking record, a valid confirmation transition, a resource
assignment, cancellation release, mobile dashboard navigation, canonical URL,
sitemap and robots behavior. No production test should create fake reviews,
analytics or sales claims.
