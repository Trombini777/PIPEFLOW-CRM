-- PipeFlow CRM — hardening pós-M8: performance de RLS e índice de FK ausente
-- Referência: .claude/skills/supabase-postgres-best-practices
--   security-rls-performance (initplan: envolver auth.uid()/funções em SELECT)
--   security-privileges (search_path vazio + nomes totalmente qualificados)
--   schema-foreign-key-indexes (toda FK usada em policy/join precisa de índice)

-- ============================================================================
-- Índice ausente: workspaces.owner_id é FK para auth.users e é usado nas
-- policies workspaces_insert_owner / workspaces_delete_owner.
-- ============================================================================
create index workspaces_owner_id_idx on public.workspaces (owner_id);

-- ============================================================================
-- Funções auxiliares: search_path vazio (em vez de "public") — os nomes já
-- são totalmente qualificados, então isso só remove a dependência implícita
-- do search_path da sessão, sem mudar comportamento.
-- ============================================================================
create or replace function public.is_workspace_member(_workspace_id uuid)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.workspace_members
    where workspace_id = _workspace_id
      and user_id = (select auth.uid())
  );
$$;

create or replace function public.is_workspace_admin(_workspace_id uuid)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.workspace_members
    where workspace_id = _workspace_id
      and user_id = (select auth.uid())
      and role = 'admin'
  );
$$;

-- ============================================================================
-- Policies: envolver auth.uid() e as funções auxiliares em (select ...) para
-- que o planner as trate como initplan (executadas uma vez por statement, não
-- uma vez por linha). Recriar apenas as que usam auth.uid()/funções direto.
-- ============================================================================
drop policy "workspaces_select_members" on public.workspaces;
create policy "workspaces_select_members"
  on public.workspaces for select
  using ((select public.is_workspace_member(id)));

drop policy "workspaces_insert_owner" on public.workspaces;
create policy "workspaces_insert_owner"
  on public.workspaces for insert
  with check (owner_id = (select auth.uid()));

drop policy "workspaces_update_admins" on public.workspaces;
create policy "workspaces_update_admins"
  on public.workspaces for update
  using ((select public.is_workspace_admin(id)))
  with check ((select public.is_workspace_admin(id)));

drop policy "workspaces_delete_owner" on public.workspaces;
create policy "workspaces_delete_owner"
  on public.workspaces for delete
  using (owner_id = (select auth.uid()));

drop policy "workspace_members_select_members" on public.workspace_members;
create policy "workspace_members_select_members"
  on public.workspace_members for select
  using ((select public.is_workspace_member(workspace_id)));

drop policy "workspace_members_insert_admins" on public.workspace_members;
create policy "workspace_members_insert_admins"
  on public.workspace_members for insert
  with check ((select public.is_workspace_admin(workspace_id)));

drop policy "workspace_members_update_admins" on public.workspace_members;
create policy "workspace_members_update_admins"
  on public.workspace_members for update
  using ((select public.is_workspace_admin(workspace_id)))
  with check ((select public.is_workspace_admin(workspace_id)));

drop policy "workspace_members_delete_admins_or_self" on public.workspace_members;
create policy "workspace_members_delete_admins_or_self"
  on public.workspace_members for delete
  using (
    (select public.is_workspace_admin(workspace_id))
    or user_id = (select auth.uid())
  );

drop policy "leads_select_members" on public.leads;
create policy "leads_select_members"
  on public.leads for select
  using ((select public.is_workspace_member(workspace_id)));

drop policy "leads_insert_members" on public.leads;
create policy "leads_insert_members"
  on public.leads for insert
  with check ((select public.is_workspace_member(workspace_id)));

drop policy "leads_update_members" on public.leads;
create policy "leads_update_members"
  on public.leads for update
  using ((select public.is_workspace_member(workspace_id)))
  with check ((select public.is_workspace_member(workspace_id)));

drop policy "leads_delete_members" on public.leads;
create policy "leads_delete_members"
  on public.leads for delete
  using ((select public.is_workspace_member(workspace_id)));

drop policy "deals_select_members" on public.deals;
create policy "deals_select_members"
  on public.deals for select
  using ((select public.is_workspace_member(workspace_id)));

drop policy "deals_insert_members" on public.deals;
create policy "deals_insert_members"
  on public.deals for insert
  with check ((select public.is_workspace_member(workspace_id)));

drop policy "deals_update_members" on public.deals;
create policy "deals_update_members"
  on public.deals for update
  using ((select public.is_workspace_member(workspace_id)))
  with check ((select public.is_workspace_member(workspace_id)));

drop policy "deals_delete_members" on public.deals;
create policy "deals_delete_members"
  on public.deals for delete
  using ((select public.is_workspace_member(workspace_id)));

drop policy "activities_select_members" on public.activities;
create policy "activities_select_members"
  on public.activities for select
  using ((select public.is_workspace_member(workspace_id)));

drop policy "activities_insert_members" on public.activities;
create policy "activities_insert_members"
  on public.activities for insert
  with check ((select public.is_workspace_member(workspace_id)));

drop policy "activities_update_members" on public.activities;
create policy "activities_update_members"
  on public.activities for update
  using ((select public.is_workspace_member(workspace_id)))
  with check ((select public.is_workspace_member(workspace_id)));

drop policy "activities_delete_members" on public.activities;
create policy "activities_delete_members"
  on public.activities for delete
  using ((select public.is_workspace_member(workspace_id)));

drop policy "subscriptions_select_members" on public.subscriptions;
create policy "subscriptions_select_members"
  on public.subscriptions for select
  using ((select public.is_workspace_member(workspace_id)));
