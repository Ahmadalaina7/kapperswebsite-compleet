-- Extensions
create extension if not exists "uuid-ossp";

-- Enums
create type appointment_status as enum ('pending', 'confirmed', 'cancelled', 'completed');

-- Tables
create table public.barbers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  active boolean default true,
  created_at timestamptz default now()
);

create table public.services (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  duration_min int not null,
  price_cents int not null,
  active boolean default true,
  created_at timestamptz default now()
);

create table public.barber_services (
  barber_id uuid references public.barbers(id) on delete cascade,
  service_id uuid references public.services(id) on delete cascade,
  primary key (barber_id, service_id)
);

create table public.appointments (
  id uuid primary key default uuid_generate_v4(),
  barber_id uuid references public.barbers(id) on delete restrict,
  service_id uuid references public.services(id) on delete restrict,
  client_name text not null,
  client_email text not null,
  client_phone text,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status appointment_status default 'pending',
  notes text,
  created_at timestamptz default now(),
  constraint unique_barber_time unique (barber_id, start_time)
);

-- RLS
alter table public.barbers enable row level security;
alter table public.services enable row level security;
alter table public.barber_services enable row level security;
alter table public.appointments enable row level security;

-- Barbers: read public, write admin
create policy "barbers_read_public" on public.barbers
  for select to authenticated, anon
  using (true);

create policy "barbers_write_admin" on public.barbers
  for all to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- Services: read public, write admin
create policy "services_read_public" on public.services
  for select to authenticated, anon
  using (true);

create policy "services_write_admin" on public.services
  for all to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- Barber_services: read public, write admin
create policy "barber_services_read_public" on public.barber_services
  for select to authenticated, anon
  using (true);

create policy "barber_services_write_admin" on public.barber_services
  for all to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- Appointments: read own + admin, write own + admin
create policy "appointments_read_own_or_admin" on public.appointments
  for select to authenticated
  using (
    client_email = (auth.jwt() ->> 'email')
    or (auth.jwt() ->> 'role' = 'admin')
  );

create policy "appointments_read_public_for_booking" on public.appointments
  for select to anon
  using (true);

create policy "appointments_insert_any_authenticated" on public.appointments
  for insert to authenticated, anon
  with check (
    start_time > now()
    and end_time > start_time
  );

create policy "appointments_update_own_or_admin" on public.appointments
  for update to authenticated
  using (
    client_email = (auth.jwt() ->> 'email')
    or (auth.jwt() ->> 'role' = 'admin')
  )
  with check (
    client_email = (auth.jwt() ->> 'email')
    or (auth.jwt() ->> 'role' = 'admin')
  );

create policy "appointments_delete_admin" on public.appointments
  for delete to authenticated
  using ((auth.jwt() ->> 'role' = 'admin'));

-- Indexes
create index idx_appointments_barber_time on public.appointments(barber_id, start_time);
create index idx_appointments_email on public.appointments(client_email);
