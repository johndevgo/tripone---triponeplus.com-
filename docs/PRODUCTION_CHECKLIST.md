# TripOne+ production checklist

## Supabase

- [ ] Production project is owned by the correct organization
- [ ] All migrations are applied with `supabase db push`
- [ ] Database and performance advisors report no unresolved warnings
- [ ] RLS and explicit grants are reviewed after the final migration
- [ ] `site-media` and `avatars` buckets and policies exist
- [ ] Auth Site URL is `https://tools.neurerohan.com.np`
- [ ] Exact production redirect URLs and local development redirect are allowed
- [ ] Leaked or previously shared database and secret keys are rotated
- [ ] Point-in-time recovery or the project backup strategy is understood

## GitHub and Vercel

- [ ] Repository default branch is `main` and GitHub Actions passes
- [ ] Vercel project is connected to the GitHub repository
- [ ] Production environment variables are configured
- [ ] `tools.neurerohan.com.np` and the existing Vercel production alias are attached
- [ ] Wildcard Cloudflare DNS or per-subdomain DNS strategy is configured
- [ ] `VERCEL_TOKEN`, project ID and optional team ID enable domain provisioning
- [ ] Production deployment protection does not block customer websites

## Product acceptance

- [ ] Sign-up confirmation, login, reset and logout are smoke-tested
- [ ] Onboarding creates one business, site, fallback domain and initial version
- [ ] Builder autosave, preview and publish are smoke-tested
- [ ] Published site, unknown host and unpublished host responses are tested
- [ ] Canonical hostname, metadata, sitemap and robots output are inspected
- [ ] Custom domain add, DNS instructions, verification and primary switching are tested
- [ ] Lead submission appears in the owner dashboard
- [ ] Analytics events and 7/30/90-day dashboard ranges are verified
- [ ] Tracking scripts load only when configured and consent permits
- [ ] Redirect manager returns exact 301/302 responses without loops
- [ ] Error pages expose no stack traces
- [ ] 390, 430, 768, 1024, 1440 and 1920 px layouts are smoke-tested
- [ ] Keyboard focus, dialogs, forms, navigation and reduced motion are checked
- [ ] Production site is checked for accidental preview indexing
