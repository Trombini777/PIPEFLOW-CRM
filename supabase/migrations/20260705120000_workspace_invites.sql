-- PipeFlow CRM — workspace_invites
-- Convites de colaborador por e-mail (M12). O envio do e-mail em si fica a
-- cargo do Server Action (Resend); aqui só o registro e as regras de
-- aceite/revogação.

create table public.workspace_invites (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  email text not null,
  role text not null default 'member' check (role in ('admin', 'member')),
  token uuid not null default gen_random_uuid(),
  invited_by uuid references auth.users (id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  expires_at timestamptz not null default (now() + interval '7 days'),
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create index workspace_invites_workspace_id_idx on public.workspace_invites (workspace_id);
create unique index workspace_invites_token_idx on public.workspace_invites (token);

-- Evita convites pendentes duplicados para o mesmo e-mail no mesmo workspace.
create unique index workspace_invites_pending_email_idx
  on public.workspace_invites (workspace_id, lower(email))
  where status = 'pending';

alter table public.workspace_invites enable row level security;

-- Somente admins do workspace enxergam/gerenciam os convites (lista de
-- pendentes/aceitos/revogados na tela de configurações).
create policy "workspace_invites_select_admins"
  on public.workspace_invites for select
  using ((select public.is_workspace_admin(workspace_id)));

create policy "workspace_invites_insert_admins"
  on public.workspace_invites for insert
  with check ((select public.is_workspace_admin(workspace_id)));

create policy "workspace_invites_update_admins"
  on public.workspace_invites for update
  using ((select public.is_workspace_admin(workspace_id)))
  with check ((select public.is_workspace_admin(workspace_id)));

-- ============================================================================
-- get_invite_preview: leitura pública por token. O token é um segredo de
-- 128 bits (não há como enumerar), então uma função SECURITY DEFINER que só
-- devolve a linha de um token específico é segura mesmo sem policy de
-- select para anon/authenticated na tabela.
-- ============================================================================
create or replace function public.get_invite_preview(_token uuid)
returns table (workspace_name text, email text, role text, status text)
language sql
security definer
set search_path = ''
stable
as $$
  select w.name, i.email, i.role, i.status
  from public.workspace_invites i
  join public.workspaces w on w.id = i.workspace_id
  where i.token = _token;
$$;

grant execute on function public.get_invite_preview(uuid) to anon, authenticated;

-- ============================================================================
-- accept_workspace_invite: valida o token, confere que o e-mail do convite
-- bate com o do usuário autenticado, cria o membership e marca o convite
-- como aceito — tudo atomicamente. SECURITY DEFINER porque o convidado
-- ainda não é membro do workspace, então não passaria pelas policies normais
-- de insert em workspace_members (is_workspace_member/is_workspace_admin).
-- ============================================================================
create or replace function public.accept_workspace_invite(_token uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_invite public.workspace_invites%rowtype;
  v_user_email text;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  select * into v_invite
  from public.workspace_invites
  where token = _token
  for update;

  if not found then
    raise exception 'invite_not_found';
  end if;

  if v_invite.status <> 'pending' then
    raise exception 'invite_not_pending';
  end if;

  if v_invite.expires_at <= now() then
    raise exception 'invite_expired';
  end if;

  select email into v_user_email from auth.users where id = auth.uid();

  if v_user_email is null or lower(v_user_email) <> lower(v_invite.email) then
    raise exception 'invite_email_mismatch';
  end if;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (v_invite.workspace_id, auth.uid(), v_invite.role)
  on conflict (workspace_id, user_id) do nothing;

  update public.workspace_invites
  set status = 'accepted', accepted_at = now()
  where id = v_invite.id;

  return v_invite.workspace_id;
end;
$$;

grant execute on function public.accept_workspace_invite(uuid) to authenticated;
