# TripOne+ execution progress

Updated: 2026-09-13

Status meanings: **Verified** passed local automated validation; **Implemented**
is complete in source but still needs the new migration on the connected
project; **Partial** has a truthful bounded implementation; **Blocked** requires
external credentials or provider state; **Out of scope** is intentionally not
represented as available.

| Area                             | Status       | Evidence / boundary                                                                                                             |
| -------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Multi-capability onboarding      | Verified     | Multi-select, any capability can be primary, autosaved progress, editable page recipe, brand, offerings, ten themes and review. |
| Deterministic site generation    | Verified     | Typed presets and safe copy create page/navigation/theme/SEO data; no AI API.                                                   |
| Unified Products & Services      | Verified     | Experiences, rentals and packages are combined with search/type/status filters and working edit links.                          |
| Experiences and rentals          | Verified     | Existing subtype-aware CMS and rental-rate workflows preserved.                                                                 |
| Packages                         | Implemented  | Atomic save, referenced items, SEO/content fields, publish state and duplicate-as-draft action.                                 |
| Native booking requests          | Implemented  | Public and manual forms validate one target, guests, dates and idempotency; no payment UI.                                      |
| Booking operations               | Implemented  | List/filter/detail, guarded status changes, notes, customer/offering context and activity timeline.                             |
| Availability rules               | Implemented  | Recurring, fixed, date-range and on-request rules are persisted and can be enabled or paused.                                   |
| Fixed departures and capacity    | Implemented  | Concrete departures and row-lock capacity checks exist in PostgreSQL.                                                           |
| Calendar                         | Implemented  | Week/two-week/month views group and display booking instants in the business timezone.                                          |
| Resources                        | Implemented  | Create/edit/status UI, capacity-aware overlapping assignment, unassignment and cancellation release.                            |
| Leads CRM                        | Implemented  | Search, manual create, seven-stage pipeline, source fields, customer conversion and booking conversion.                         |
| Customers                        | Implemented  | Search, create, edit, lead/booking history and deduplication by site/email.                                                     |
| Public renderer                  | Verified     | Experiences, rentals and packages use one renderer across builder, preview and published delivery.                              |
| Section system                   | Verified     | 33 typed section types; registry completeness and default-schema tests pass.                                                    |
| Themes                           | Verified     | Ten complete token presets including Urban and Escape; visual behavior uses shared composition tokens.                          |
| SEO and structured data          | Verified     | Existing metadata, canonical, sitemap, robots and tourism JSON-LD architecture retained.                                        |
| Marketing resources              | Verified     | 63 original guides and comparisons, six indexable collections, searchable discovery and image-rich presentation.                |
| Analytics                        | Partial      | Existing first-party website events plus booking/package event types; no invented revenue reporting.                            |
| Custom domains                   | Partial      | Provider adapter and verified-host routing exist; provisioning requires Vercel credentials/DNS.                                 |
| Recurrence expansion             | Partial      | Rules persist and display; automatic rule-to-departure materialization is not included.                                         |
| Live Supabase migration          | Blocked      | No Supabase CLI access token or database URL is configured in this workspace.                                                   |
| Live deployment                  | Blocked      | Must follow a successful database migration; current source can be pushed after release review.                                 |
| Payments / OTA sync / accounting | Out of scope | Intentionally absent from this payment-free operations phase.                                                                   |

## Remaining release sequence

1. Put a rotated database connection string or Supabase CLI access token into a
   secure local environment (never chat or Git).
2. Confirm remote migration history, apply
   `20260910122440_operations_core.sql`, and run
   `pnpm test:db:operations` against an explicitly authorized database.
3. Run the linked Supabase database linter and inspect security/performance
   advisors.
4. Run authenticated Playwright flows with a disposable user/site.
5. Deploy the already-pushed feature branch to Vercel production after the
   database gate, then verify the
   public booking request and owner dashboard on the real origin.
