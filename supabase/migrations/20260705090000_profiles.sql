-- PipeFlow CRM — profiles
-- auth.users não é exposto via PostgREST/RLS, mas leads/deals/activities
-- guardam owner_id/author_id apontando para lá. profiles espelha nome/e-mail
-- para permitir exibir "responsável"/"autor" nas telas de leads e pipeline.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- ============================================================================
-- Um usuário enxerga o próprio perfil e o de qualquer pessoa com quem
-- compartilhe ao menos um workspace (mesmo padrão de isolamento das outras
-- tabelas, só que via workspace_members em vez de workspace_id direto).
-- ============================================================================
create policy "profiles_select_self_or_workspace_peers"
  on public.profiles for select
  using (
    id = (select auth.uid())
    or exists (
      select 1
      from public.workspace_members mine
      join public.workspace_members peers
        on peers.workspace_id = mine.workspace_id
      where mine.user_id = (select auth.uid())
        and peers.user_id = public.profiles.id
    )
  );

-- ============================================================================
-- Bootstrap: cria o profile no signup. SECURITY DEFINER porque o insert
-- acontece a partir de um trigger em auth.users, fora do contexto de uma
-- sessão autenticada normal.
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'name');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: usuários criados antes desta migration ainda não têm profile.
insert into public.profiles (id, email, full_name)
select id, email, raw_user_meta_data ->> 'name'
from auth.users
on conflict (id) do nothing;
