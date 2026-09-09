-- Barbers (eenmanszaak: alleen Fikri)
insert into public.barbers (name, slug, active, specialty, experience_years) values
  ('Fikri', 'fikri', true, 'Eigenaar & barber', 12);

-- Services (uitsluitend herenbehandelingen)
insert into public.services (name, description, duration_min, price_cents, active) values
  ('Contouren', 'Haarlijn strak zetten: nek, slapen en bovenlip bijgewerkt.', 20, 500, true),
  ('Haar knippen', 'Complete knipbeurt, gewassen en gestyled naar wens.', 30, 1500, true),
  ('Haar + baard', 'Knipbeurt plus baard trimmen en vormgeven.', 45, 1800, true);

-- Link de kapper aan alle services
insert into public.barber_services (barber_id, service_id)
select b.id, s.id
from public.barbers b
cross join public.services s;
