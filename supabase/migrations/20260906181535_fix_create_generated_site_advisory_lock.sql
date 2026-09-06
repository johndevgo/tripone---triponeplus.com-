-- Repair only the JSON extraction precedence in the per-user/slug lock key.
-- CREATE OR REPLACE preserves the existing function owner and grants.
create or replace function public.create_generated_site(payload jsonb)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  business_id uuid;
  new_site_id uuid;
  page jsonb;
  experience jsonb;
begin
  if uid is null then raise exception 'Authentication required'; end if;
  perform pg_advisory_xact_lock(hashtext(uid::text || ':' || (payload->>'slug')));
  select id into new_site_id from public.sites where owner_id = uid and slug = payload->>'slug';
  if new_site_id is not null then return new_site_id; end if;
  insert into public.businesses(owner_id,name,slug,business_type,short_description,country,city,region,address,timezone,currency,phone,whatsapp,email,google_maps_url,logo_url)
  values(uid,payload->>'name',payload->>'slug',(payload->>'businessType')::public.business_type,payload->>'shortDescription',payload->>'country',payload->>'city',nullif(payload->>'region',''),nullif(payload->>'address',''),payload->>'timezone',payload->>'currency',nullif(payload->>'phone',''),nullif(payload->>'whatsapp',''),payload->>'email',nullif(payload->>'googleMapsUrl',''),nullif(payload->>'logoUrl','')) returning id into business_id;
  insert into public.sites(business_id,owner_id,name,slug,theme_id,theme_settings,global_settings,navigation,footer_settings)
  values(business_id,uid,payload->>'name',payload->>'slug',payload->>'themeId',payload->'generated'->'theme',payload->'generated'->'globalSettings',payload->'generated'->'navigation',payload->'generated'->'footer') returning id into new_site_id;
  for page in select * from jsonb_array_elements(payload->'generated'->'pages') loop
    insert into public.pages(site_id,title,slug,page_type,sections,seo_settings,sort_order,show_in_navigation)
    values(new_site_id,page->>'title',page->>'slug',(page->>'pageType')::public.page_type,page->'sections',page->'seoSettings',(page->>'sortOrder')::integer,(page->>'showInNavigation')::boolean);
  end loop;
  for experience in select * from jsonb_array_elements(coalesce(payload->'experiences','[]')) loop
    insert into public.experiences(site_id,business_id,name,slug,experience_type,short_description,price_from,currency,duration_value,duration_unit,location_name,booking_url,featured_image_url,extra_details,featured)
    values(new_site_id,business_id,experience->>'name',experience->>'slug',experience->>'experienceType',experience->>'shortDescription',nullif(experience->>'priceFrom','')::numeric,experience->>'currency',nullif(experience->>'durationValue','')::numeric,nullif(experience->>'durationUnit',''),nullif(experience->>'locationName',''),nullif(experience->>'bookingUrl',''),nullif(experience->>'featuredImageUrl',''),coalesce(experience->'extraDetails','{}'),true);
  end loop;
  insert into public.site_versions(site_id,version_number,snapshot,created_by,label) values(new_site_id,1,payload->'generated',uid,'Initial website');
  return new_site_id;
end $$;
