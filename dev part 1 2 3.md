You are the senior founding engineer, SaaS architect, product designer and UI/UX lead for a production-grade vertical SaaS called:

TripOne+
Domain: triponeplus.com

I want you to BUILD the application, not merely provide recommendations, mockups, pseudocode or a plan.

This is PART 1 OF 3.

The final product is a specialized website builder for:

- tour operators
- travel agencies
- jet ski rental businesses
- boat rental businesses
- safari companies
- trekking operators
- day tour companies
- adventure activity businesses
- local guides
- excursion operators
- multi-day tour operators
- diving/snorkelling companies
- rafting companies
- ATV/buggy businesses
- outdoor activity companies
- travel package businesses
- other tourism/activity businesses

IMPORTANT PRODUCT PHILOSOPHY:

TripOne+ IS NOT a general-purpose Wix/Webflow clone.

TripOne+ should understand tourism businesses structurally.

A user should be able to:

1. Sign up.
2. Select what type of tourism/activity business they operate.
3. Enter basic business information.
4. Add their tours, activities or packages.
5. Upload images/logo.
6. Select a professionally designed theme.
7. Click "Build My Website".
8. TripOne+ automatically creates a complete recommended website using deterministic presets and rules.
9. The user will later customize the generated website using the visual builder implemented in Part 2.
10. They publish the website.
11. TripOne+ automatically handles technical SEO and conversion-oriented structure.

NO AI API IS ALLOWED.

Do not integrate:
- OpenAI
- Anthropic
- Gemini
- any paid AI API
- any LLM provider

The website generation system must be deterministic and implemented through:
- structured business data
- business-category presets
- reusable page recipes
- reusable component variants
- templated copy
- SEO rules
- CRO rules
- theme tokens

==================================================
TECH STACK
==================================================

Use:

- Current stable Next.js with App Router
- TypeScript
- strict TypeScript configuration
- React
- Tailwind CSS
- shadcn/ui / Radix primitives where useful
- Lucide icons
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- @supabase/ssr
- React Hook Form
- Zod
- dnd-kit can be installed now but builder functionality comes in Part 2
- Zustand only where local complex editor state genuinely benefits from it
- modern motion/animation library only for tasteful micro-interactions
- pnpm
- ESLint
- Prettier
- Vitest where appropriate
- Playwright for important user flows

Hosting target:
- Vercel

DNS:
- Cloudflare

Main domain:
triponeplus.com

Customer free websites eventually:
businessslug.triponeplus.com

Custom domains come in Part 3.

Do not introduce unnecessary infrastructure.

==================================================
ENGINEERING QUALITY REQUIREMENTS
==================================================

Treat this as a real production SaaS.

Do not:
- create fake buttons
- create non-functional UI
- leave major TODOs
- use hard-coded user IDs
- bypass authentication
- bypass RLS
- store secrets client-side
- expose Supabase service role keys
- create giant unmaintainable files
- duplicate rendering logic
- use "any" everywhere
- create an over-engineered microservice architecture

Do:
- use reusable modules
- separate data/access/domain/UI logic
- use server components where appropriate
- use client components only when interaction requires them
- use proper loading/error/empty states
- validate all mutations
- use typed DTOs
- use safe server actions or route handlers
- implement proper Supabase RLS
- make all forms usable and validated
- make the app responsive
- make it accessible
- maintain excellent performance

Before modifying anything:
1. Inspect the entire repository.
2. Understand what currently exists.
3. Preserve useful existing code.
4. Do not rewrite working systems unnecessarily.
5. Create a concise implementation checklist.
6. Then implement it.

After implementation:
- run lint
- run TypeScript type checking
- run tests
- run production build
- fix all errors
- do not stop at the first compile error

==================================================
BRANDING
==================================================

Brand:

TripOne+

Style:
premium travel-tech / growth-tech SaaS

Primary visual direction:
GLASSMORPHISM

However, I DO NOT want tacky Dribbble-style glassmorphism.

The design should feel like:
- premium
- serious
- modern
- clean
- elegant
- calm
- high-end SaaS
- travel technology
- visually sophisticated

Suggested core palette:

Deep emerald:
#063D2E

Dark emerald:
#022C22

Emerald:
#087A5A

Warm amber/gold accent:
#F5A623

Soft gold:
#FFC857

Near-white:
#F7FAF9

Muted text:
#93A69F

Dark app background:
#041C16

Use these as starting points, but implement them as reusable design tokens rather than scattering hex codes throughout components.

Glass panels should use:
- subtle transparency
- backdrop blur
- thin hairline borders
- low-opacity highlights
- soft layered shadows
- depth without making text hard to read

Avoid:
- massive glowing neon borders
- oversaturated gradients
- cartoon graphics
- giant rounded blobs everywhere
- excessive animations
- fake 3D effects
- ugly default admin dashboard styling

Use:
- excellent spacing
- strong typography hierarchy
- tasteful 16–24px radius
- consistent spacing scale
- subtle transitions around 150–250ms
- hover/focus/pressed states
- keyboard-visible focus states

Typography:
Use a high-quality modern sans serif such as Geist or equivalent.

==================================================
APPLICATION INFORMATION ARCHITECTURE
==================================================

The SaaS should eventually contain:

Public TripOne+ marketing:
/
pricing can exist as a placeholder page but no payment integration is required yet
/features
/templates
/login
/signup

Authenticated app:
/dashboard
/dashboard/sites
/dashboard/sites/[siteId]
/dashboard/sites/[siteId]/builder   --> Part 2
/dashboard/sites/[siteId]/experiences
/dashboard/sites/[siteId]/pages
/dashboard/sites/[siteId]/design
/dashboard/sites/[siteId]/seo
/dashboard/sites/[siteId]/leads
/dashboard/sites/[siteId]/analytics --> Part 3
/dashboard/sites/[siteId]/domains   --> Part 3
/dashboard/sites/[siteId]/settings
/onboarding

Public generated customer websites must use the SAME component renderer as the builder.

Never maintain separate "preview components" and "production components".

==================================================
DATABASE ARCHITECTURE
==================================================

Create clean Supabase migrations in:

supabase/migrations/

Use UUID primary keys unless another type is clearly more appropriate.

Implement at least these concepts.

1. profiles

- id references auth.users.id
- full_name
- avatar_url
- created_at
- updated_at

2. businesses

Represents the user's real tourism business.

Fields should include:

- id
- owner_id
- name
- slug
- business_type
- short_description
- full_description
- country
- city
- region
- address
- latitude nullable
- longitude nullable
- timezone
- currency
- phone
- whatsapp
- email
- website_url nullable
- instagram_url nullable
- facebook_url nullable
- youtube_url nullable
- tripadvisor_url nullable
- google_maps_url nullable
- logo_url nullable
- created_at
- updated_at

Business type should support:

jetski
boat_rental
day_tour
tour_operator
travel_agency
safari
trekking
hiking
diving
snorkelling
rafting
atv_buggy
adventure_activity
local_guide
multi_day_tour
excursion
water_sports
other

Use an enum or equivalent strongly controlled values.

3. sites

A business can eventually have more than one site, although UI can assume one initially.

Fields:

- id
- business_id
- owner_id
- name
- slug
- status
- theme_id
- theme_settings jsonb
- global_settings jsonb
- navigation jsonb
- footer_settings jsonb
- favicon_url nullable
- default_og_image_url nullable
- published_at nullable
- created_at
- updated_at

Status:
draft
published
archived

4. pages

Fields:

- id
- site_id
- title
- slug
- page_type
- status
- sections jsonb
- seo_settings jsonb
- sort_order
- show_in_navigation
- navigation_label nullable
- parent_page_id nullable
- created_at
- updated_at

Page types:

home
experiences
experience_detail_system
about
contact
gallery
faq
locations
location_detail_system
custom

Home slug should internally support "/" correctly.

5. experiences

This is one of the most important tables.

Use "experience" as the generic internal entity covering:
- tour
- activity
- rental
- safari
- trek
- package
- excursion
- experience

Fields:

- id
- site_id
- business_id
- name
- slug
- experience_type
- short_description
- description
- price_from nullable
- currency
- pricing_label nullable
- duration_value nullable
- duration_unit nullable
- location_name nullable
- meeting_point nullable
- latitude nullable
- longitude nullable
- max_guests nullable
- min_guests nullable
- minimum_age nullable
- difficulty nullable
- cancellation_policy nullable
- booking_url nullable
- booking_button_label
- featured_image_url nullable
- gallery jsonb
- highlights jsonb
- inclusions jsonb
- exclusions jsonb
- itinerary jsonb
- faqs jsonb
- extra_details jsonb
- featured boolean
- status
- sort_order
- created_at
- updated_at

6. locations

- id
- site_id
- business_id
- name
- slug
- description
- city
- region
- country
- latitude
- longitude
- image_url
- seo_settings jsonb
- created_at
- updated_at

7. testimonials

- id
- site_id
- author_name
- author_location nullable
- rating nullable
- quote
- source nullable
- source_url nullable
- avatar_url nullable
- status
- sort_order
- created_at
- updated_at

8. media

- id
- owner_id
- site_id
- storage_path
- public_url
- mime_type
- file_size
- width nullable
- height nullable
- alt_text nullable
- created_at

9. leads

Create schema now although UI can remain basic until Part 2.

- id
- site_id
- experience_id nullable
- name
- email
- phone nullable
- desired_date nullable
- guests nullable
- message nullable
- source_page nullable
- status
- created_at

10. site_versions

Needed for draft/publish history.

- id
- site_id
- version_number
- snapshot jsonb
- created_by
- created_at
- label nullable

11. domains

Create schema now.

- id
- site_id
- hostname
- domain_type
- verification_status
- is_primary
- created_at
- verified_at nullable

Domain types:
subdomain
custom

Custom domain management will be implemented in Part 3.

12. redirects

- id
- site_id
- source_path
- destination_path
- status_code
- created_at

==================================================
RLS / SECURITY
==================================================

Implement correct Row Level Security.

Requirements:

Authenticated users:
- can read/update their own profile
- can CRUD only businesses they own
- can CRUD only sites they own
- can CRUD child records belonging to their sites
- cannot access another user's private data

Anonymous visitors:
- should only be able to read published public site information necessary for public website rendering
- should never see unpublished drafts
- should never read leads
- should never read private management data

Design RLS carefully.

Do not simply enable public SELECT on everything.

Use policies that check:
- ownership
- site publication status
- related parent ownership/publication

If a public RPC or safe server-side public accessor makes the architecture cleaner, implement it.

Service role key:
- server only
- never NEXT_PUBLIC
- use only where genuinely necessary

==================================================
SUPABASE STORAGE
==================================================

Create/document buckets for:

- site-media
- avatars

Use appropriate storage policies.

For site-media:
- authenticated users can upload/manage media only within their own folder/site
- public reads should work for media used on published websites

Implement:
- image validation
- image type restrictions
- reasonable size limits
- useful error messages

==================================================
AUTHENTICATION
==================================================

Implement:

- signup
- login
- logout
- forgot password
- reset password
- auth callback
- protected dashboard routes
- authenticated redirect handling

Use Supabase SSR correctly.

Create polished glassmorphic auth pages.

Signup should request:
- email
- password
- name

Do not require business setup during account creation.

After first login, if user has no business/site:
redirect to:
/onboarding

If already onboarded:
redirect:
/dashboard

==================================================
ONBOARDING EXPERIENCE
==================================================

This is critical.

Create a premium multi-step onboarding wizard.

Do not make it feel like a boring enterprise form.

Use:
- progress indicator
- autosave where appropriate
- excellent input labels
- helper text
- responsive layout
- animated transitions that remain restrained
- back/next controls
- validation

Steps:

STEP 1 — BUSINESS TYPE

Ask:

"What kind of business are you building a website for?"

Cards for:

Jet Ski Rental
Boat Rental
Day Tours
Tour Operator
Travel Agency
Safari
Trekking & Hiking
Diving & Snorkelling
Rafting
ATV / Buggy
Adventure Activities
Local Guide
Multi-Day Tours
Excursions
Water Sports
Other

Each card:
- icon
- short one-line explanation
- selected state

STEP 2 — BUSINESS DETAILS

Fields:

Business name
Short description
Country
City
Region optional
Timezone
Currency
Phone
WhatsApp
Email
Address optional
Google Maps URL optional

Generate a URL-safe candidate slug from business name but let user edit it.

Validate slug uniqueness.

Example:
Dubai Wave Jetski
->
dubai-wave-jetski.triponeplus.com

STEP 3 — BRAND

Allow:
- logo upload
- primary brand colour
- secondary brand colour
- accent colour

Generate sensible defaults if skipped.

STEP 4 — ADD EXPERIENCES

Allow user to add at least one experience but permit skipping.

Create an excellent compact experience form with:

Name
Experience type
Price from
Currency
Duration
Location
Short description
Featured image
Booking URL

More advanced fields can be edited later.

The exact labels should adapt to business category.

For example:

Jet Ski:
"Maximum riders"
"Minimum driver age"
"Safety equipment"

Trekking:
"Difficulty"
"Maximum altitude"
"Duration"
"Accommodation"

Safari:
"Safari duration"
"Pickup"
"Wildlife highlights"

Travel Agency:
"Package duration"
"Destinations"
"Starting price"

Store category-specific data in extra_details.

STEP 5 — CHOOSE THEME

Create FOUR high-quality starter themes.

Theme 1:
HORIZON
Modern, immersive, image-led travel experience.

Theme 2:
LUXE VOYAGE
Luxury tourism, elegant editorial typography, refined spacing.

Theme 3:
WILD CURRENT
Bold adventure operator aesthetic.

Theme 4:
ATLAS
Clean modern minimalist tour operator style.

Do NOT create four completely separate codebases.

Use a common design-token/theme system.

Theme controls include:

- typography
- primary
- secondary
- accent
- background
- surface
- text colours
- button style
- radius scale
- spacing character
- image treatment
- header style
- section styling

Show visually attractive theme preview cards.

STEP 6 — REVIEW

Show:
- business information
- selected theme
- experiences
- proposed subdomain
- website structure TripOne+ intends to create

CTA:

"Build My Website"

==================================================
DETERMINISTIC WEBSITE GENERATION ENGINE
==================================================

THIS IS ONE OF THE MOST IMPORTANT PARTS.

Implement a preset-driven generator.

Suggested directory:

src/lib/site-generator/

Possible modules:

types.ts
presets.ts
business-presets/
theme-presets/
copy-templates/
generate-site.ts
generate-pages.ts
generate-navigation.ts
generate-seo.ts

Create a typed BusinessPreset interface.

Each business preset should define:

- default pages
- default homepage section order
- recommended components
- experience terminology
- required experience fields
- optional experience fields
- default CTAs
- SEO phrase templates
- CRO recommendations
- default navigation

Example:

JETSKI:

pages:
Home
Experiences
About
Gallery
FAQ
Contact

homepage sections:
hero
trustBar
featuredExperiences
whyChooseUs
safety
gallery
testimonials
location
faq
finalCta

Primary CTA:
Book Now

Secondary:
WhatsApp Us

SAFARI:

home
safaris
about
guides
gallery
faq
contact

homepage:
hero
featuredExperiences
wildlifeHighlights
whyChooseUs
guides
testimonials
gallery
faq
finalCta

TREKKING:

home
treks
destinations
about
guides
faq
contact

homepage:
hero
featuredExperiences
popularDestinations
whyChooseUs
difficultyOverview
guides
testimonials
faq
finalCta

TRAVEL AGENCY:

home
packages
destinations
about
testimonials
contact

homepage:
hero
featuredPackages
destinations
whyTravelWithUs
specialOffers
testimonials
finalCta

Create sensible presets for every business category.

Do not duplicate whole objects unnecessarily.
Allow base presets + overrides.

==================================================
SECTION DATA MODEL
==================================================

Do not store arbitrary HTML.

Page sections should be structured JSON objects.

Example conceptual shape:

{
  "id": "uuid",
  "type": "hero",
  "variant": "immersive",
  "visible": true,
  "settings": {
     ...
  }
}

Each section must have:
- id
- type
- variant
- visible
- settings

Create typed schemas and Zod validation.

Never trust arbitrary database JSON blindly.

Validate page section data before rendering.

==================================================
INITIAL COMPONENT SYSTEM
==================================================

Create the renderer architecture now.

Directory suggestion:

src/components/site/
src/components/site/sections/
src/components/site/theme/
src/components/site/layout/

Create reusable section types:

hero
trustBar
featuredExperiences
experienceGrid
destinations
whyChooseUs
features
safety
gallery
testimonials
stats
guides
richText
location
faq
contact
finalCta

Each should have at least one excellent default variant now.

More variants are added in Part 2.

Every section should receive structured props.

Public components must:
- be responsive
- have semantic HTML
- have accessible labels
- avoid CLS
- support theme tokens
- look professionally designed

==================================================
AUTOMATIC PAGE CREATION
==================================================

When "Build My Website" is clicked:

1. Validate onboarding data.
2. Create/update business.
3. Create site.
4. Apply selected theme.
5. Load business preset.
6. Generate page records.
7. Generate section JSON for each page.
8. Populate dynamic sections using business/experience data.
9. Generate navigation.
10. Generate footer information.
11. Generate initial SEO metadata.
12. Create version 1 snapshot.
13. Mark website as draft.
14. Redirect to a website-created success screen.
15. Let user preview draft.

This action must be transactionally safe where practical.

Prevent duplicate sites if the user double-clicks.

==================================================
DETERMINISTIC COPY
==================================================

Do not write fake claims.

Never automatically generate statements like:
"#1 Tour Company"
"Best in Dubai"
"5,000 happy customers"
"award-winning"
unless actual user data supports it.

Use safe templating.

Example:

Input:
Business:
Dubai Wave Jetski

Category:
Jet Ski Rental

Location:
Dubai Marina

Output:

H1:
"Jet Ski Experiences in Dubai Marina"

Subheading:
"Explore jet ski experiences from Dubai Wave Jetski."

CTA:
"View Experiences"

No AI required.

Create reusable safe copy templates.

==================================================
INITIAL SEO AUTOMATION
==================================================

Create an SEO utility layer.

Automatically create:

Page title
Meta description
Canonical path
Open Graph defaults
Heading suggestions

Example experience:

name:
60 Minute Jet Ski Tour

location:
Dubai Marina

brand:
Dubai Wave Jetski

Possible title:
60 Minute Jet Ski Tour in Dubai Marina | Dubai Wave Jetski

URL:
/experiences/60-minute-jet-ski-tour-dubai-marina

Keep SEO values editable later.

Create safe title length handling.

Do not keyword-stuff.

==================================================
PUBLIC SITE RENDERER
==================================================

Implement the architecture allowing generated sites to be rendered.

For development, support a route similar to:

/preview/[siteSlug]/[[...path]]

or another clean internal preview implementation.

The renderer should:

1. Resolve site.
2. Resolve requested page.
3. Ensure draft preview requires ownership/authentication.
4. Load theme.
5. Load page sections.
6. Validate sections.
7. Render global header.
8. Render sections.
9. Render footer.
10. Create metadata.

Published host-based routing is finalized in Part 3.

==================================================
DASHBOARD
==================================================

Create polished dashboard shell.

Navigation:

Overview
Website
Experiences
Pages
Design
SEO
Leads
Analytics
Domains
Settings

Analytics and Domains may show tasteful "Coming in final setup" states until Part 3, but routes should exist.

Dashboard overview should show useful real data:

- website status
- number of published experiences
- number of pages
- number of leads
- website preview
- website URL
- setup checklist

Do not invent analytics.

Use skeleton loading states.

==================================================
GLASSMORPHIC APP SHELL
==================================================

Create an exceptional SaaS shell.

Desktop:
- collapsible sidebar
- top bar
- contextual breadcrumbs/actions
- responsive content container

Mobile:
- proper mobile navigation drawer
- no unusable desktop sidebar squeezed onto mobile

Glass effect:
- translucent dark emerald surfaces
- subtle border
- blur
- soft ambient gradients behind layout
- minimal glow
- restrained gold accent

Buttons should look premium.

Primary button:
gold/amber or suitable brand accent

Secondary:
glass surface

Danger:
clearly distinct but not obnoxious

==================================================
MARKETING LANDING PAGE
==================================================

Create a strong initial TripOne+ homepage.

Do not spend excessive time on marketing copy yet, but make it polished.

Hero idea:

"Websites built to sell experiences."

Supporting idea:

"TripOne+ creates fast, SEO-ready, conversion-focused websites for tour and activity businesses."

Primary CTA:
"Build Your Website"

Secondary:
"See How It Works"

Sections:

Hero
Tourism categories
How it works
Website examples/theme previews
SEO/CRO benefits
Feature overview
Final CTA
Footer

Do not make unsupported claims like guaranteed rankings.

==================================================
ENVIRONMENT VARIABLES
==================================================

Create/update:

.env.example

Document all required variables such as:

NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY where genuinely necessary

Never commit secrets.

==================================================
SEED / DEVELOPMENT DATA
==================================================

Provide a development seed approach.

Create one realistic demo:

Dubai Wave Jetski
Dubai Marina
Jet Ski business

Experiences:
60 Minute Jet Ski Experience
90 Minute Jet Ski Experience
Burj Al Arab Jet Ski Tour

Use obviously demo-safe content.

==================================================
TESTING
==================================================

At minimum test:

- slug generation
- business preset selection
- page generation
- theme token generation
- SEO title generation
- section schema validation

Playwright important flow:

signup/login test architecture if auth test environment permits

at minimum:
onboarding ->
select category ->
enter business ->
select theme ->
create website ->
dashboard/preview

==================================================
FINAL ACCEPTANCE CRITERIA FOR PART 1
==================================================

Part 1 is not complete unless:

[ ] app runs locally
[ ] Supabase integration works
[ ] migrations are valid
[ ] RLS exists
[ ] auth works
[ ] onboarding works
[ ] media upload works
[ ] business types work
[ ] experience creation during onboarding works
[ ] theme selection works
[ ] deterministic preset engine exists
[ ] clicking Build My Website creates real database records
[ ] homepage/page recipes are generated
[ ] draft website can be previewed
[ ] dashboard works
[ ] public site components share one renderer
[ ] marketing homepage exists
[ ] responsive design works
[ ] glassmorphic app UI is polished
[ ] lint passes
[ ] type checking passes
[ ] tests pass
[ ] production build passes
[ ] README explains local development

DO NOT stop after scaffolding.

DO NOT only tell me what files I need.

CREATE AND MODIFY THE FILES.

When finished:
1. Give me a concise summary.
2. Show major files created.
3. Show migrations created.
4. Show commands I must run locally.
5. List environment variables I need to configure.
6. Mention anything genuinely blocked only by external credentials.
7. Do not start Part 2 yourself.


