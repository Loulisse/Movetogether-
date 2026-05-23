-- ============================================================
-- COLLE CE SQL DANS SUPABASE > SQL Editor > New query
-- Puis clique sur "Run"
-- ============================================================

-- Table des tâches
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  house text not null check (house in ('current', 'future')),
  title text not null,
  room text,
  deadline date,
  urgency integer default 5 check (urgency between 1 and 10),
  description text,
  done boolean default false,
  items jsonb default '[]'::jsonb,
  photos_before jsonb default '[]'::jsonb,
  photos_inspiration jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Table des articles divers (non liés à une tâche)
create table if not exists unbound_items (
  id uuid primary key default gen_random_uuid(),
  house text not null check (house in ('current', 'future')),
  name text not null,
  price text,
  done boolean default false,
  created_at timestamptz default now()
);

-- Activer la lecture publique (Row Level Security désactivé pour usage simple)
alter table tasks enable row level security;
alter table unbound_items enable row level security;

-- Politique : accès total sans authentification (pour usage partagé simple)
create policy "Accès public tasks" on tasks for all using (true) with check (true);
create policy "Accès public unbound_items" on unbound_items for all using (true) with check (true);

-- Activer le realtime
alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table unbound_items;
