-- UdhariClub database schema
-- Run this in the Supabase SQL editor against a fresh project.
-- All tables are simple and safe for an MVP without auth — soft identity
-- comes from a phone number stored in localStorage on the client.

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────────────
-- users  (soft identity — no auth)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.users (
  id           uuid primary key default gen_random_uuid(),
  phone        text unique not null,
  name         text not null,
  created_at   timestamptz not null default now()
);

create index if not exists users_phone_idx on public.users(phone);

-- ─────────────────────────────────────────────────────────────────────────────
-- trips
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.trips (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  emoji        text not null default '🌴',
  invite_code  text unique not null,
  created_by   uuid references public.users(id) on delete set null,
  created_at   timestamptz not null default now()
);

create index if not exists trips_invite_code_idx on public.trips(invite_code);

-- ─────────────────────────────────────────────────────────────────────────────
-- trip_members
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.trip_members (
  id           uuid primary key default gen_random_uuid(),
  trip_id      uuid not null references public.trips(id) on delete cascade,
  user_id      uuid references public.users(id) on delete set null,
  display_name text not null,
  phone        text,
  joined_at    timestamptz not null default now(),
  unique (trip_id, display_name)
);

create index if not exists trip_members_trip_idx on public.trip_members(trip_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- expenses
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.expenses (
  id           uuid primary key default gen_random_uuid(),
  trip_id      uuid not null references public.trips(id) on delete cascade,
  payer_id     uuid not null references public.trip_members(id) on delete cascade,
  description  text not null,
  amount       numeric(12,2) not null check (amount > 0),
  split_type   text not null default 'equal' check (split_type in ('equal','unequal')),
  created_at   timestamptz not null default now()
);

create index if not exists expenses_trip_idx on public.expenses(trip_id, created_at desc);

-- ─────────────────────────────────────────────────────────────────────────────
-- expense_splits
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.expense_splits (
  id           uuid primary key default gen_random_uuid(),
  expense_id   uuid not null references public.expenses(id) on delete cascade,
  member_id    uuid not null references public.trip_members(id) on delete cascade,
  amount       numeric(12,2) not null check (amount >= 0),
  unique (expense_id, member_id)
);

create index if not exists expense_splits_expense_idx on public.expense_splits(expense_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- settlements  (only the user-confirmed transfers; recomputed each session)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.settlements (
  id           uuid primary key default gen_random_uuid(),
  trip_id      uuid not null references public.trips(id) on delete cascade,
  from_member  uuid not null references public.trip_members(id) on delete cascade,
  to_member    uuid not null references public.trip_members(id) on delete cascade,
  amount       numeric(12,2) not null check (amount > 0),
  status       text not null default 'pending' check (status in ('pending','settled')),
  created_at   timestamptz not null default now(),
  settled_at   timestamptz
);

create index if not exists settlements_trip_idx on public.settlements(trip_id, status);

-- ─────────────────────────────────────────────────────────────────────────────
-- Permissive RLS for MVP — trips are guessable only via invite_code,
-- so we keep things open. Tighten before a real launch.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.users           enable row level security;
alter table public.trips           enable row level security;
alter table public.trip_members    enable row level security;
alter table public.expenses        enable row level security;
alter table public.expense_splits  enable row level security;
alter table public.settlements     enable row level security;

do $$
declare
  t text;
begin
  for t in
    select unnest(array[
      'users','trips','trip_members','expenses','expense_splits','settlements'
    ])
  loop
    execute format(
      'drop policy if exists %I on public.%I; create policy %I on public.%I for all using (true) with check (true);',
      t || '_all', t, t || '_all', t
    );
  end loop;
end $$;
