-- PipeFlow CRM — schema inicial
-- Tabelas: workspaces, workspace_members, leads, deals, activities, subscriptions

create extension if not exists "pgcrypto";

-- ============================================================================
-- workspaces
-- ============================================================================
create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  owner_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- workspace_members
-- ============================================================================
create table public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'member' check (role in ('admin', 'member')),
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create index workspace_members_workspace_id_idx on public.workspace_members (workspace_id);
create index workspace_members_user_id_idx on public.workspace_members (user_id);

-- ============================================================================
-- leads
-- ============================================================================
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  name text not null,
  email text,
  phone text,
  company text,
  role text,
  status text not null default 'novo'
    check (status in ('novo', 'contatado', 'qualificado', 'convertido', 'perdido')),
  owner_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_workspace_id_idx on public.leads (workspace_id);
create index leads_owner_id_idx on public.leads (owner_id);
create index leads_status_idx on public.leads (workspace_id, status);

-- ============================================================================
-- deals
-- ============================================================================
create table public.deals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  lead_id uuid references public.leads (id) on delete set null,
  title text not null,
  value numeric(12, 2) not null default 0,
  stage text not null default 'novo_lead'
    check (stage in (
      'novo_lead', 'contato_realizado', 'proposta_enviada',
      'negociacao', 'fechado_ganho', 'fechado_perdido'
    )),
  owner_id uuid references auth.users (id) on delete set null,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index deals_workspace_id_idx on public.deals (workspace_id);
create index deals_lead_id_idx on public.deals (lead_id);
create index deals_owner_id_idx on public.deals (owner_id);
create index deals_stage_idx on public.deals (workspace_id, stage);

-- ============================================================================
-- activities
-- ============================================================================
create table public.activities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  lead_id uuid not null references public.leads (id) on delete cascade,
  type text not null check (type in ('ligacao', 'email', 'reuniao', 'nota')),
  author_id uuid references auth.users (id) on delete set null,
  description text not null,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index activities_workspace_id_idx on public.activities (workspace_id);
create index activities_lead_id_idx on public.activities (lead_id);

-- ============================================================================
-- subscriptions (1:1 com workspace — base para M13/Stripe)
-- ============================================================================
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null unique references public.workspaces (id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  status text not null default 'active'
    check (status in ('active', 'trialing', 'past_due', 'canceled', 'incomplete')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index subscriptions_workspace_id_idx on public.subscriptions (workspace_id);

-- ============================================================================
-- updated_at automático
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.workspaces
  for each row execute function public.set_updated_at();

create trigger set_updated_at before update on public.leads
  for each row execute function public.set_updated_at();

create trigger set_updated_at before update on public.deals
  for each row execute function public.set_updated_at();

create trigger set_updated_at before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Bootstrap: ao criar um workspace, o owner vira admin (workspace_members)
-- e ganha uma subscription 'free' automaticamente.
-- SECURITY DEFINER é necessário aqui: no insert do workspace ainda não existe
-- nenhuma linha em workspace_members, então as policies de RLS de
-- workspace_members (que exigem ser admin do workspace) bloqueariam o
-- próprio insert que cria o primeiro admin.
-- ============================================================================
create or replace function public.handle_new_workspace()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.workspace_members (workspace_id, user_id, role)
  values (new.id, new.owner_id, 'admin');

  insert into public.subscriptions (workspace_id, plan, status)
  values (new.id, 'free', 'active');

  return new;
end;
$$;

create trigger on_workspace_created
  after insert on public.workspaces
  for each row execute function public.handle_new_workspace();
