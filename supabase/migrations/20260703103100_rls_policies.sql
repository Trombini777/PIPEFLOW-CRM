-- PipeFlow CRM — Row Level Security
-- Isolamento por workspace: um usuário só enxerga/edita dados de workspaces
-- dos quais é membro (workspace_members).

-- ============================================================================
-- Funções auxiliares (SECURITY DEFINER para não recursar nas policies de
-- workspace_members ao serem chamadas de dentro de outras policies).
-- ============================================================================
create or replace function public.is_workspace_member(_workspace_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.workspace_members
    where workspace_id = _workspace_id
      and user_id = auth.uid()
  );
$$;

create or replace function public.is_workspace_admin(_workspace_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.workspace_members
    where workspace_id = _workspace_id
      and user_id = auth.uid()
      and role = 'admin'
  );
$$;

-- ============================================================================
-- Enable RLS
-- ============================================================================
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.leads enable row level security;
alter table public.deals enable row level security;
alter table public.activities enable row level security;
alter table public.subscriptions enable row level security;

-- ============================================================================
-- workspaces
-- ============================================================================
create policy "workspaces_select_members"
  on public.workspaces for select
  using (public.is_workspace_member(id));

create policy "workspaces_insert_owner"
  on public.workspaces for insert
  with check (owner_id = auth.uid());

create policy "workspaces_update_admins"
  on public.workspaces for update
  using (public.is_workspace_admin(id))
  with check (public.is_workspace_admin(id));

create policy "workspaces_delete_owner"
  on public.workspaces for delete
  using (owner_id = auth.uid());

-- ============================================================================
-- workspace_members
-- ============================================================================
create policy "workspace_members_select_members"
  on public.workspace_members for select
  using (public.is_workspace_member(workspace_id));

create policy "workspace_members_insert_admins"
  on public.workspace_members for insert
  with check (public.is_workspace_admin(workspace_id));

create policy "workspace_members_update_admins"
  on public.workspace_members for update
  using (public.is_workspace_admin(workspace_id))
  with check (public.is_workspace_admin(workspace_id));

create policy "workspace_members_delete_admins_or_self"
  on public.workspace_members for delete
  using (public.is_workspace_admin(workspace_id) or user_id = auth.uid());

-- ============================================================================
-- leads (admin e member têm CRUD completo dentro do próprio workspace)
-- ============================================================================
create policy "leads_select_members"
  on public.leads for select
  using (public.is_workspace_member(workspace_id));

create policy "leads_insert_members"
  on public.leads for insert
  with check (public.is_workspace_member(workspace_id));

create policy "leads_update_members"
  on public.leads for update
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "leads_delete_members"
  on public.leads for delete
  using (public.is_workspace_member(workspace_id));

-- ============================================================================
-- deals
-- ============================================================================
create policy "deals_select_members"
  on public.deals for select
  using (public.is_workspace_member(workspace_id));

create policy "deals_insert_members"
  on public.deals for insert
  with check (public.is_workspace_member(workspace_id));

create policy "deals_update_members"
  on public.deals for update
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "deals_delete_members"
  on public.deals for delete
  using (public.is_workspace_member(workspace_id));

-- ============================================================================
-- activities
-- ============================================================================
create policy "activities_select_members"
  on public.activities for select
  using (public.is_workspace_member(workspace_id));

create policy "activities_insert_members"
  on public.activities for insert
  with check (public.is_workspace_member(workspace_id));

create policy "activities_update_members"
  on public.activities for update
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "activities_delete_members"
  on public.activities for delete
  using (public.is_workspace_member(workspace_id));

-- ============================================================================
-- subscriptions
-- Somente leitura para membros. Escrita fica reservada ao service_role
-- (webhook do Stripe em M13), que ignora RLS por padrão no Supabase —
-- por isso não há policies de insert/update/delete para authenticated.
-- ============================================================================
create policy "subscriptions_select_members"
  on public.subscriptions for select
  using (public.is_workspace_member(workspace_id));
