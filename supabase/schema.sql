-- Initial schema draft only. Review with the club and test RLS before using real inventory.
create extension if not exists pgcrypto;

create table if not exists public.components (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  part_number text,
  quantity integer not null default 0 check (quantity >= 0),
  minimum_stock integer not null default 0 check (minimum_stock >= 0),
  location text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.filament_spools (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  material text not null,
  color text not null,
  initial_weight_grams numeric(9,2) not null check (initial_weight_grams > 0),
  remaining_weight_grams numeric(9,2) not null check (remaining_weight_grams >= 0 and remaining_weight_grams <= initial_weight_grams),
  location text not null,
  status text not null default 'available' check (status in ('available','in_use','empty')),
  created_at timestamptz not null default now()
);

create table if not exists public.borrow_records (
  id uuid primary key default gen_random_uuid(),
  component_id uuid not null references public.components(id),
  borrower_id uuid not null references auth.users(id),
  quantity integer not null check (quantity > 0),
  borrowed_at timestamptz not null default now(),
  due_at timestamptz,
  returned_at timestamptz,
  status text not null default 'borrowed' check (status in ('borrowed','returned','overdue'))
);

create table if not exists public.filament_usage (
  id uuid primary key default gen_random_uuid(),
  spool_id uuid not null references public.filament_spools(id),
  grams_used numeric(9,2) not null check (grams_used > 0),
  project text,
  recorded_by uuid not null references auth.users(id),
  recorded_at timestamptz not null default now()
);

-- RLS is intentionally not enabled in this starter migration until role and
-- membership policy decisions are finalized. Enable and test it before exposing
-- these tables through the Supabase API or storing real club inventory.