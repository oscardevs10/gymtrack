-- GymTrack — esquema de base de datos
-- Ejecuta este archivo completo en el SQL Editor de tu proyecto Supabase.

create extension if not exists "pgcrypto";

-- Perfil del usuario + datos del cuestionario inicial
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default 'Usuario',
  avatar text not null default 'US',
  weight_kg numeric,
  goal text, -- 'hipertrofia' | 'fuerza' | 'perdida_grasa' | 'resistencia'
  level text, -- 'Principiante' | 'Intermedio' | 'Avanzado'
  days_per_week int check (days_per_week between 1 and 7),
  units text not null default 'kg',
  theme text not null default 'dark',
  notifications_enabled boolean not null default true,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.routines (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  muscle_groups text[] not null default '{}',
  exercises jsonb not null default '[]', -- RoutineExercise[]
  last_performed date,
  is_template boolean not null default false,
  day_label text, -- e.g. "Día 1"
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  exercise_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, exercise_id)
);

create table if not exists public.workout_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  routine_id text,
  routine_name text not null,
  date date not null,
  duration_minutes int not null,
  total_volume numeric not null,
  exercises jsonb not null default '[]', -- WorkoutExerciseLog[]
  new_prs int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.personal_records (
  user_id uuid not null references auth.users (id) on delete cascade,
  exercise_id text not null,
  exercise_name text not null,
  weight numeric not null,
  reps int not null,
  date date not null,
  previous_weight numeric,
  primary key (user_id, exercise_id)
);

-- Row Level Security: cada usuario solo ve y modifica sus propios datos
alter table public.profiles enable row level security;
alter table public.routines enable row level security;
alter table public.favorites enable row level security;
alter table public.workout_history enable row level security;
alter table public.personal_records enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

drop policy if exists "routines_all_own" on public.routines;
create policy "routines_all_own" on public.routines for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "favorites_all_own" on public.favorites;
create policy "favorites_all_own" on public.favorites for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "history_all_own" on public.workout_history;
create policy "history_all_own" on public.workout_history for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "prs_all_own" on public.personal_records;
create policy "prs_all_own" on public.personal_records for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Nota: el perfil se crea desde el cliente (ver ensureProfile en supabaseData.ts)
-- justo después del primer login, en vez de un trigger sobre auth.users.
-- Esto evita bloquear el signup si el trigger falla por permisos u otra causa.
