# TripOne+ architecture

## Runtime shape

TripOne+ is one Next.js 16 App Router application deployed to Vercel. Server
components load tenant-scoped management data, client components are reserved
for interactive editors/forms, and server actions validate mutations before
calling Supabase. There is no application microservice layer.

Supabase provides PostgreSQL, Auth and Storage. The browser receives only the
publishable key. Tenant authorization is enforced by RLS and repeated inside
the narrow RPCs that coordinate multi-row or concurrency-sensitive changes.

## Domain layers

- `src/lib/site-generator/`: deterministic presets, page recipes, theme tokens,
  navigation, copy and SEO generation.
- `src/lib/sections/`: the typed section registry and editor defaults.
- `src/components/site/`: the shared draft/preview/production renderer, cards,
  public analytics, enquiry form and native booking-request form.
- `src/components/builder/`: revision-aware visual editing over the same section
  graph.
- `src/lib/operations/`: booking, availability, package and resource schemas,
  relation normalization and mixed-industry fixtures.
- `src/app/dashboard/sites/[siteId]/`: owner-facing CMS and operations routes.
- `src/lib/tenancy/`: immutable snapshot decoding, hostname/path resolution and
  canonical public URLs.
- `supabase/migrations/`: additive schema, RLS, grants, triggers and RPC history.

## Operational data graph

`sites` is the tenant boundary for operational data. Existing `experiences` and
`rental_products` remain canonical offerings. `packages` owns ordered
`package_items`, each optionally referencing one existing experience or rental.

`availability_rules` store recurring, fixed-departure, date-range or on-request
intent. `departures` store concrete inventory windows and optional capacity.
`resources` represent vehicles, equipment and people. `booking_resources`
assigns a quantity of a resource to a booking.

`customers` are deduplicated by normalized email within a site. `leads` retain
their sales source and pipeline stage and may link to a customer, rental,
package and later booking. `bookings` reference exactly one experience, rental
or package and optionally a fixed departure and originating lead.

`booking_activities` and `lead_activities` retain state and conversion history.
They are private management records and never appear in published snapshots.

## Booking consistency

Manual creation and public submission use separate RPCs, both with idempotency
keys. Manual creation locks a selected departure before summing active guests,
preventing two concurrent requests from exceeding fixed capacity. Resource
assignment locks the booking and resource in a consistent order, then checks
overlapping active bookings with half-open timestamp ranges.

The booking status trigger rejects invalid direct transitions and records valid
changes. The public request function derives currency and target validity from
the published snapshot, not browser input, and rate-limits a short-lived hashed
fingerprint. Cancelling a booking removes its resource assignments.

## Security model

New management tables revoke anonymous access and grant authenticated CRUD only
behind site-ownership RLS. Child-table policies call the stable `owns_site`
helper using scalar subqueries. Composite foreign keys keep every relationship
inside one site. Public booking writes use a tightly scoped security-definer
function with an empty `search_path`, fully qualified objects and explicit
execute grants; public users cannot select bookings, customers, leads, activity
logs or rate-limit rows.

## Publishing and delivery

Draft tables power the dashboard. `publish_site` creates the immutable public
snapshot and version; an operations trigger enriches that snapshot with
published packages, referenced items and future open departures. Older snapshot
decoders ignore additive keys, while the current decoder validates schema-v4
operations data.

The shared renderer serves:

- authenticated draft preview at `/preview/{site}`;
- path-based published sites at `/s/{siteSlug}`;
- verified hostnames through `/tenant-sites/{hostname}` rewrites.

The path-based address is the honest fallback until a custom or platform domain
has actually been attached and verified.

## Known architectural boundary

Recurring availability rules are persisted and manageable, but this release
does not automatically materialize them into concrete departure rows. Fixed
departures are the capacity-enforced inventory primitive. Public date requests
without a departure remain pending requests for operator confirmation.
