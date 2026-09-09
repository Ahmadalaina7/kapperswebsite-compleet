-- 002: heren-only uitbreiding + dubbele boekingen onmogelijk maken

-- Extra kapper-profielvelden
alter table public.barbers
  add column if not exists specialty text,
  add column if not exists experience_years int;

-- Richere servicebeschrijvingen
alter table public.services
  add column if not exists description text;

-- Voorkom overlappende boekingen per kapper (postgres 9.2+)
-- Wordt alleen aangemaakt als pgcrypto/btree_gist beschikbaar is.
do $$
begin
  if exists (select 1 from pg_available_extensions where name = 'btree_gist') then
    create extension if not exists btree_gist;
    alter table public.appointments
      drop constraint if exists appointments_no_overlap;
    alter table public.appointments
      add constraint appointments_no_overlap
      exclude using gist (
        barber_id with =,
        tsrange(start_time, end_time, '[)') with &&
      )
      where (status in ('pending', 'confirmed'));
  end if;
end $$;
