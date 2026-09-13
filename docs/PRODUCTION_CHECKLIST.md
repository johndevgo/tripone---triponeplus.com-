# TripOne+ production checklist

## Supabase

- [ ] Production project is owned by the correct organization
- [ ] All migrations, including platform retention, are applied with `supabase db push`
- [ ] Supabase database lint reports no schema warnings or errors after the final migration
- [x] RLS and explicit grants are reviewed after the final migration
- [x] `site-media` and `avatars` buckets and policies exist in migrations
- [ ] Auth Site URL is `https://triponeplus.com`
- [ ] Exact production redirect URLs and local development redirect are allowed
- [ ] Leaked or previously shared database and secret keys are rotated
- [ ] Point-in-time recovery or the project backup strategy is understood

## GitHub and Vercel

- [x] Repository default branch is `main` and GitHub Actions passes
- [x] Vercel project is connected to the GitHub repository
- [x] Production environment variables required by the deployed application are configured
- [ ] `triponeplus.com` is primary; `www.triponeplus.com` and `tools.neurerohan.com.np` redirect to it
- [ ] Cloudflare apex and `www` records match Vercel's displayed records
- [ ] `VERCEL_TOKEN`, project ID and optional team ID enable domain provisioning
- [x] Production deployment protection does not block customer websites

## Product acceptance

- [ ] Sign-up confirmation, login, reset and logout are smoke-tested
- [x] Onboarding creates one business, site, reserved domain and initial version
- [x] Builder autosave and preview are browser-tested; immutable publish is database-tested
- [x] Published site and unknown site/page responses are tested in production
- [x] Canonical path, metadata, sitemap and robots output are inspected in production
- [x] Resource articles, comparison sources, social images and internal links are validated
- [ ] Custom domain add, DNS instructions, verification and primary switching are tested
- [ ] Lead submission appears in the owner dashboard
- [ ] Analytics events and 7/30/90-day dashboard ranges are verified
- [x] Advanced scripts are proven isolated to verified tenant origins with nonce CSP
- [ ] Consent-gated vendor scripts are smoke-tested with the owner's real provider IDs
- [ ] Redirect manager returns exact 301/302 responses without loops
- [ ] Error pages expose no stack traces
- [ ] `/super-admin` is accessible only to the bootstrapped owner account
- [ ] Vercel Cron calls the retention route with `CRON_SECRET`
- [x] 375, 430, 768, 1024 and 1440 px marketing/customer layouts are browser-tested
- [ ] Keyboard focus, dialogs, forms, navigation and reduced motion are checked
- [ ] Production site is checked for accidental preview indexing
