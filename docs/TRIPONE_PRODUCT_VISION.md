# TripOne+ product vision

## Positioning

TripOne+ is a travel-native operating system for independent tour, activity,
rental, guide and travel-package businesses. It combines a structured website
builder with the daily commercial workflow behind that website: products,
availability, booking requests, customers, leads and fulfilment resources.

It is not a general-purpose page builder, a payment processor or an online
travel marketplace. Its advantage is a shared tourism model that lets one
operator publish accurate customer pages and manage the records those pages
create.

## Who it serves

The capability model supports mixed businesses instead of forcing one label.
Examples include trekking and local guiding, motorcycle tours and rentals,
vehicle rental, water sports and boat hire, diving, safaris, city tours,
multi-day operators and travel agencies. One capability is primary for initial
terminology; all selected capabilities remain first-class business data.

## Product principles

1. Structured travel data is the source of truth. Pages store validated section
   objects, never arbitrary HTML.
2. Public claims must be supported. TripOne+ does not invent ratings, booking
   totals, awards or availability.
3. A package composes existing experiences and rentals by reference. Editing a
   service does not create silently divergent copies.
4. A website booking is a request until an operator confirms it. This release
   does not take payments.
5. The operator experience must remain usable on a phone, including lead,
   calendar and booking workflows.
6. Draft editing and public delivery use the same renderer. Publishing creates
   an immutable snapshot so incomplete drafts cannot leak.
7. Tenant ownership, capacity checks, resource allocation and status history
   belong in PostgreSQL as well as in the interface.

## Core journeys

### Start a business workspace

The operator selects all services, marks a primary service, chooses the initial
site structure and theme, adds optional offerings, reviews the generated plan,
and creates the business/site/page/version graph through one idempotent database
transaction.

### Publish and receive demand

The operator manages experiences, rentals and packages in one catalogue,
publishes a snapshot, and receives validated enquiries or native booking
requests from the same customer-site renderer. Public requests create or update
a customer and create an auditable pending booking.

### Operate the request

The team filters bookings, confirms or cancels them through a guarded state
machine, assigns available resources, checks upcoming work on the calendar, and
retains customer and lead context. Cancellation releases resource allocation.

### Build a useful website

Ten tokenized themes and 33 section types cover image-led, luxury, adventure,
minimal, expedition, coastal, desert, road-trip, urban and retreat brands. The
builder, preview and published paths all render these components from validated
JSON.

## Deliberate phase boundary

Payments, accounting, OTA/channel synchronization, marketplace distribution,
advanced staff rostering, automated messaging and a full social inbox remain
out of scope. The current architecture leaves extension points for those areas
without presenting them as available product features.
