create table public.pointages (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  type text not null check (type in ('ARRIVEE', 'DEPART')),
  timestamp timestamptz not null,
  location jsonb not null,
  commentaire text,
  status text not null default 'EN_ATTENTE' check (status in ('EN_ATTENTE', 'VALIDE', 'REJETE')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Ajouter les politiques RLS
alter table public.pointages enable row level security;

create policy "Les utilisateurs peuvent voir leurs propres pointages"
  on public.pointages for select
  using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent créer leurs propres pointages"
  on public.pointages for insert
  with check (auth.uid() = user_id);

create policy "Les utilisateurs peuvent modifier leurs propres pointages"
  on public.pointages for update
  using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent supprimer leurs propres pointages"
  on public.pointages for delete
  using (auth.uid() = user_id);

-- Trigger pour mettre à jour updated_at
create function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on public.pointages
  for each row
  execute function public.handle_updated_at(); 