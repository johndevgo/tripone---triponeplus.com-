# TripOne+ multi-service upgrade specification

## Product boundary

TripOne+ is a deterministic website builder for tourism operators. A business may operate several service lines on one website, such as tours, rentals, packages, and guided activities. It is not a marketplace and it does not use an AI or LLM API.

The existing authenticated dashboard, Supabase ownership model, shared site renderer, immutable publish snapshots, and draft workflow remain the foundation. Part 4 extends those systems without making draft records publicly readable.

## Delivery milestones

1. Repair and baseline: transactional generation, correlated errors, double-submit protection, and production verification.
2. Multi-service content: business capabilities, experience subtypes, rental products and rates, site taxonomies, nested terms, and assignments.
3. Website structure: optional recommended pages, deterministic capability merge rules, editable page tree, typed detail templates, and record overrides.
4. Presentation: section catalogue, saved sections, eight distinct themes, and editable global header/footer.
5. Production: current public URL resolver, prefix-safe fallback publishing, redirects, per-resource SEO, typed tracking, consent, and publish-graph validation.
6. Acceptance: database/RLS integration tests, unit tests, important Playwright flows, responsive screenshots, lint, typecheck, build, and live smoke checks.

## Architectural decisions

- `businesses.business_type` remains as the legacy primary category. `business_capabilities` is the normalized multi-select source for new UI, with a backfill from the legacy value.
- Experiences retain their own `experience_type`; a business capability never silently rewrites existing experience records.
- Rental inventory is stored in `rental_products` and `rental_rates`, not overloaded into experiences. Cross-sells use stable record identifiers.
- Every site owns five controlled taxonomies: activities, destinations, travel styles, package categories, and product categories. Terms may be nested only inside the same site and taxonomy; cycles are rejected in PostgreSQL.
- Assignments carry `site_id` and use composite foreign keys so records cannot be related across tenants, even if an application bug bypasses UI validation.
- Public rendering reads immutable published snapshots. Part 4 records are added to the snapshot graph only when published or otherwise eligible.
- The public URL order is: verified customer primary domain, verified platform hostname, then `https://tools.neurerohan.com.np/s/{siteSlug}`. An unowned `*.triponeplus.com` hostname is never presented as live.
- Page sections remain typed JSON. No arbitrary HTML, arbitrary CSS, or server-side evaluation of tenant code is allowed.
- Templates are shared typed section recipes with versioned inheritance; record overrides are explicit and reversible.
- Tracking integrations are typed IDs. Advanced code is restricted to isolated verified tenant origins and is never evaluated on the app, preview, or `/s` fallback.

## Deterministic merge rules

Capability order does not affect the result. The generator normalizes and sorts selected capabilities, starts with Home, merges recommended page keys, de-duplicates shared pages, then applies stable priority and label rules. A page selected by the operator wins over a recommendation; an explicit deselection wins for every optional page. Home cannot be removed.

## Compatibility and rollback

All Part 4 migrations are additive. Existing `business_type`, experience, location, page, and snapshot shapes remain readable. New snapshot fields are optional in the decoder until every site has republished. Rolling back application code therefore leaves legacy records usable; database objects can be retired later only after a data-retention review.
