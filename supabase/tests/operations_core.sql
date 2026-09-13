-- Operations, concurrency invariants and tenant isolation assertions.
-- Run only after 20260910122440_operations_core.sql. All fixtures are rolled back.
begin;

insert into auth.users(id, raw_user_meta_data) values
  ('55f1e50d-54aa-4558-a307-6d8d7fe0a101', '{}'::jsonb),
  ('55f1e50d-54aa-4558-a307-6d8d7fe0a202', '{}'::jsonb);

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"55f1e50d-54aa-4558-a307-6d8d7fe0a101","role":"authenticated"}',
  true
);

do $test$
declare
  owner_a constant uuid := '55f1e50d-54aa-4558-a307-6d8d7fe0a101';
  owner_b constant uuid := '55f1e50d-54aa-4558-a307-6d8d7fe0a202';
  business_a uuid;
  site_a uuid;
  experience_a uuid;
  package_a uuid;
  package_copy uuid;
  departure_a uuid;
  resource_a uuid;
  booking_a uuid;
  booking_retry uuid;
  booking_b uuid;
  lead_a uuid;
  customer_a uuid;
  rejected boolean;
begin
  insert into public.businesses(
    owner_id,name,slug,business_type,country,city,timezone,currency,email
  ) values (
    owner_a,'Operations Test Operator','operations-test-operator','tour_operator',
    'Nepal','Kathmandu','Asia/Kathmandu','NPR','owner@example.invalid'
  ) returning id into business_a;
  insert into public.sites(business_id,owner_id,name,slug,theme_id)
  values(
    business_a,owner_a,'Operations Test Operator','operations-test-operator','atlas'
  ) returning id into site_a;
  insert into public.experiences(
    site_id,business_id,name,slug,experience_type,short_description,currency,status
  ) values (
    site_a,business_a,'Valley Day Tour','valley-day-tour','day_tour',
    'A disposable database integration fixture.','NPR','published'
  ) returning id into experience_a;

  package_a := public.save_package(jsonb_build_object(
    'siteId',site_a,'id','','name','Valley Essentials','slug','valley-essentials',
    'shortDescription','A disposable package used only for integration validation.',
    'description','','durationDays','1','priceFrom','5000','currency','NPR',
    'pricingLabel','From','bookingMode','request','bookingUrl','',
    'bookingButtonLabel','Request this package','featuredImageUrl','',
    'gallery',jsonb_build_array('https://example.invalid/package.jpg'),
    'details',jsonb_build_object('startPoint','Kathmandu','endPoint','Pokhara'),
    'featured',true,'status','published','highlights','[]'::jsonb,
    'inclusions','[]'::jsonb,'exclusions','[]'::jsonb,'itinerary','[]'::jsonb,
    'faqs','[]'::jsonb,'policies','[]'::jsonb,'seoSettings','{}'::jsonb,
    'items',jsonb_build_array(jsonb_build_object(
      'experienceId',experience_a,'rentalProductId','','dayNumber','1',
      'title','Valley Day Tour','description','','optional',false,'sortOrder',0
    ))
  ));
  if (select count(*) from public.package_items where package_id = package_a) <> 1 then
    raise exception 'Package composition was not saved as a reference';
  end if;
  package_copy := public.duplicate_package(package_a);
  if (select status from public.packages where id = package_copy) <> 'draft'
    or (select count(*) from public.package_items where package_id = package_copy) <> 1 then
    raise exception 'Package duplication did not preserve items as a draft';
  end if;

  insert into public.departures(
    site_id,experience_id,starts_at,ends_at,capacity,status
  ) values (
    site_a,experience_a,'2099-10-01T09:00:00Z','2099-10-01T12:00:00Z',2,'open'
  ) returning id into departure_a;
  insert into public.resources(site_id,name,resource_type,identifier,capacity)
  values(site_a,'Guide One','guide','guide-one',1)
  returning id into resource_a;

  booking_a := public.create_booking(jsonb_build_object(
    'siteId',site_a,'customerName','Maya Rai','email','maya@example.invalid',
    'phone','','experienceId',experience_a,'rentalProductId','','packageId','',
    'departureId',departure_a,'leadId','','status','pending','source','manual',
    'startsAt','2099-10-01T09:00:00Z','endsAt','2099-10-01T12:00:00Z',
    'adults',2,'children',0,'quantity',1,'quotedTotal','','currency','NPR',
    'customerNotes','','internalNotes','','idempotencyKey','operations-test-booking-a'
  ));
  booking_retry := public.create_booking(jsonb_build_object(
    'siteId',site_a,'customerName','Maya Rai','email','maya@example.invalid',
    'phone','','experienceId',experience_a,'rentalProductId','','packageId','',
    'departureId',departure_a,'leadId','','status','pending','source','manual',
    'startsAt','2099-10-01T09:00:00Z','endsAt','2099-10-01T12:00:00Z',
    'adults',2,'children',0,'quantity',1,'quotedTotal','','currency','NPR',
    'customerNotes','','internalNotes','','idempotencyKey','operations-test-booking-a'
  ));
  if booking_retry <> booking_a
    or (select count(*) from public.bookings where idempotency_key = 'operations-test-booking-a') <> 1 then
    raise exception 'Booking idempotency failed';
  end if;

  rejected := false;
  begin
    perform public.create_booking(jsonb_build_object(
      'siteId',site_a,'customerName','Capacity Guest','email','capacity@example.invalid',
      'phone','','experienceId',experience_a,'rentalProductId','','packageId','',
      'departureId',departure_a,'leadId','','status','pending','source','manual',
      'startsAt','2099-10-01T09:00:00Z','endsAt','2099-10-01T12:00:00Z',
      'adults',1,'children',0,'quantity',1,'quotedTotal','','currency','NPR',
      'customerNotes','','internalNotes','','idempotencyKey','operations-capacity-reject'
    ));
  exception when others then
    rejected := sqlerrm = 'Not enough capacity remains for this departure';
  end;
  if not rejected then raise exception 'Departure overbooking was not rejected'; end if;

  perform public.assign_booking_resource(booking_a,resource_a,1);
  booking_b := public.create_booking(jsonb_build_object(
    'siteId',site_a,'customerName','Second Guest','email','second@example.invalid',
    'phone','','experienceId',experience_a,'rentalProductId','','packageId','',
    'departureId','','leadId','','status','pending','source','manual',
    'startsAt','2099-10-01T10:00:00Z','endsAt','2099-10-01T11:00:00Z',
    'adults',1,'children',0,'quantity',1,'quotedTotal','','currency','NPR',
    'customerNotes','','internalNotes','','idempotencyKey','operations-test-booking-b'
  ));
  rejected := false;
  begin
    perform public.assign_booking_resource(booking_b,resource_a,1);
  exception when others then
    rejected := sqlerrm = 'Resource is already allocated for that time';
  end;
  if not rejected then raise exception 'Overlapping resource allocation was not rejected'; end if;

  perform public.transition_booking(booking_a,'confirmed','Confirmed for test');
  rejected := false;
  begin
    update public.bookings set status = 'pending' where id = booking_a;
  exception when others then
    rejected := sqlerrm = 'That booking status change is not allowed';
  end;
  if not rejected then raise exception 'Invalid booking transition was not rejected'; end if;
  perform public.transition_booking(booking_a,'cancelled','Cancelled for test');
  if exists(select 1 from public.booking_resources where booking_id = booking_a) then
    raise exception 'Cancellation did not release resource assignments';
  end if;
  perform public.assign_booking_resource(booking_b,resource_a,1);
  perform public.update_booking(jsonb_build_object(
    'siteId',site_a,'bookingId',booking_b,
    'startsAt','2099-10-01T13:00:00Z','endsAt','2099-10-01T14:00:00Z',
    'adults',1,'children',0,'quantity',1,'quotedTotal','7500','currency','NPR',
    'customerNotes','Window seat requested.','internalNote','Schedule confirmed.',
    'requirements','Vegetarian lunch','addOns',jsonb_build_array('Lunch')
  ));
  if (select starts_at from public.bookings where id = booking_b) <> '2099-10-01T13:00:00Z'
    or not exists(select 1 from public.booking_activities
      where booking_id = booking_b and action = 'details_updated') then
    raise exception 'Booking detail update was not persisted or audited';
  end if;

  insert into public.leads(
    site_id,experience_id,name,email,status,source,message
  ) values (
    site_a,experience_a,'Lead Guest','lead@example.invalid','qualified','manual',
    'Disposable integration lead.'
  ) returning id into lead_a;
  customer_a := public.convert_lead_to_customer(lead_a);
  if customer_a is null
    or (select customer_id from public.leads where id = lead_a) <> customer_a then
    raise exception 'Lead to customer conversion failed';
  end if;
  perform public.create_booking(jsonb_build_object(
    'siteId',site_a,'customerName','Lead Guest','email','lead@example.invalid',
    'phone','','experienceId',experience_a,'rentalProductId','','packageId','',
    'departureId','','leadId',lead_a,'status','pending','source','manual',
    'startsAt','2099-10-02T09:00:00Z','endsAt','','adults',1,'children',0,
    'quantity',1,'quotedTotal','','currency','NPR','customerNotes','',
    'internalNotes','','idempotencyKey','operations-lead-booking'
  ));
  if (select status from public.leads where id = lead_a) <> 'won'
    or not exists(
      select 1 from public.lead_activities
      where lead_id = lead_a and activity_type = 'converted_to_booking'
    ) then raise exception 'Lead to booking conversion was not audited';
  end if;

  update public.sites set status = 'published', published_snapshot = jsonb_build_object(
    'experiences',jsonb_build_array(jsonb_build_object(
      'id',experience_a,'currency','NPR'
    )),
    'rentals','[]'::jsonb,
    'packages','[]'::jsonb
  ) where id = site_a;
  perform set_config('tripone.test_site',site_a::text,true);
  perform set_config('tripone.test_experience',experience_a::text,true);

  perform set_config(
    'request.jwt.claims',
    jsonb_build_object('sub',owner_b,'role','authenticated')::text,
    true
  );
  if exists(select 1 from public.bookings where site_id = site_a)
    or exists(select 1 from public.customers where site_id = site_a)
    or exists(select 1 from public.resources where site_id = site_a)
    or exists(select 1 from public.packages where site_id = site_a) then
    raise exception 'A second tenant can read private operational records';
  end if;
  rejected := false;
  begin
    insert into public.resources(site_id,name,resource_type,capacity)
    values(site_a,'Cross tenant resource','guide',1);
  exception when others then rejected := true;
  end;
  if not rejected then raise exception 'Cross-tenant operational write was not rejected'; end if;
end
$test$;

reset role;
set local role anon;
do $anon$
declare
  rejected boolean := false;
  public_booking uuid;
  public_retry uuid;
  payload jsonb;
begin
  begin
    perform 1 from public.bookings limit 1;
  exception when insufficient_privilege then rejected := true;
  end;
  if not rejected then raise exception 'Anonymous role can read booking management data'; end if;

  payload := jsonb_build_object(
    'siteId',current_setting('tripone.test_site')::uuid,
    'targetType','experience',
    'targetId',current_setting('tripone.test_experience')::uuid,
    'name','Public Guest','email','public@example.invalid','phone','',
    'requestedDate','2099-11-01','adults',2,'children',0,'quantity',1,
    'startTime','09:30','endTime','12:00',
    'currency','USD','message','Disposable public request.','sourcePage','/',
    'website','','idempotencyKey','operations-public-booking',
    'deliveryMode','fallback','siteSlug','operations-test-operator'
  );
  public_booking := public.submit_public_booking(payload,repeat('a',32));
  public_retry := public.submit_public_booking(payload,repeat('a',32));
  if public_booking is null or public_retry <> public_booking then
    raise exception 'Public booking request idempotency failed';
  end if;
end
$anon$;

reset role;
do $verify_public_time$
begin
  if not exists(
    select 1 from public.bookings
    where idempotency_key = 'operations-public-booking'
      and starts_at = '2099-11-01T03:45:00Z'
      and ends_at = '2099-11-01T06:15:00Z'
  ) then raise exception 'Public booking time was not stored in the business timezone';
  end if;
end
$verify_public_time$;
rollback;
