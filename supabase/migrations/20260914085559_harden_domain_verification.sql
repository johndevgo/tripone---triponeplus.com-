-- Earlier Vercel integration code treated project-access verification as DNS
-- verification. Require those legacy rows to pass the corrected DNS check
-- before they may be selected for public routing or canonical URLs again.
update public.domains
set
  verification_status = 'pending',
  is_primary = false,
  verified_at = null,
  last_error = 'DNS configuration must be checked again before this domain can serve traffic.'
where domain_type = 'custom'
  and verification_status = 'verified'
  and provider_data ->> 'dnsConfigured' is distinct from 'true';
