-- 003: eenmanszaak Fikri in Vlissingen
-- Behoud bestaande afspraken, maar maak alleen Fikri boekbaar.

insert into public.barbers (name, slug, active, specialty, experience_years)
values ('Fikri', 'fikri', true, 'Eigenaar & barber', 12)
on conflict (slug) do update set
  name = excluded.name,
  active = true,
  specialty = excluded.specialty,
  experience_years = excluded.experience_years;

update public.barbers
set active = false
where slug <> 'fikri';

-- Oude diensten blijven bewaard voor historische afspraken, maar zijn niet meer boekbaar.
update public.services
set active = false
where name not in ('Contouren', 'Haar knippen', 'Haar + baard');

insert into public.services (name, description, duration_min, price_cents, active)
select 'Contouren', 'Haarlijn strak zetten: nek, slapen en bovenlip bijgewerkt.', 20, 500, true
where not exists (select 1 from public.services where name = 'Contouren');

insert into public.services (name, description, duration_min, price_cents, active)
select 'Haar knippen', 'Complete knipbeurt, gewassen en gestyled naar wens.', 30, 1500, true
where not exists (select 1 from public.services where name = 'Haar knippen');

insert into public.services (name, description, duration_min, price_cents, active)
select 'Haar + baard', 'Knipbeurt plus baard trimmen en vormgeven.', 45, 1800, true
where not exists (select 1 from public.services where name = 'Haar + baard');

update public.services set
  description = 'Haarlijn strak zetten: nek, slapen en bovenlip bijgewerkt.',
  duration_min = 20,
  price_cents = 500,
  active = true
where name = 'Contouren';

update public.services set
  description = 'Complete knipbeurt, gewassen en gestyled naar wens.',
  duration_min = 30,
  price_cents = 1500,
  active = true
where name = 'Haar knippen';

update public.services set
  description = 'Knipbeurt plus baard trimmen en vormgeven.',
  duration_min = 45,
  price_cents = 1800,
  active = true
where name = 'Haar + baard';

insert into public.barber_services (barber_id, service_id)
select b.id, s.id
from public.barbers b
cross join public.services s
where b.slug = 'fikri'
  and s.name in ('Contouren', 'Haar knippen', 'Haar + baard')
on conflict do nothing;
