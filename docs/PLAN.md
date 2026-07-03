# Plano de Execução — PipeFlow CRM

Baseado em [CLAUDE.md](../CLAUDE.md) e [PRD.md](PRD.md).

## Metodologia

O projeto é construído em milestones sequenciais, cada um em sua própria branch a partir de `main`, com um commit final ao concluir as entregas do milestone.

Estratégia **UI-first**: todas as telas da aplicação são construídas primeiro com dados mock/estáticos (M1–M7), validando fluxo, layout e componentes antes de existir qualquer backend. Só depois entra o Supabase, a lógica de negócio, autenticação real, Stripe e Resend (M8–M13), plugando dados reais nas telas já prontas. Isso evita retrabalho de UI enquanto o schema de dados ainda está sendo definido.

Convenção de branch: `feat/NN-nome-do-milestone`. Convenção de commit: Conventional Commits (`feat:`, `chore:`, `fix:`), conforme [CLAUDE.md](../CLAUDE.md).

---

## M0 — Setup do Projeto e Fundação

**Branch:** `feat/00-setup-fundacao`

**Objetivo:** Ter o projeto Next.js rodando localmente com toda a base técnica configurada, sem nenhuma feature de produto ainda.

**Entregas:**
- [x] Criar projeto Next.js 14 (App Router) + TypeScript 5
- [x] Configurar Tailwind CSS + inicializar shadcn/ui
- [x] Configurar ESLint + Prettier
- [x] Criar estrutura de pastas conforme [CLAUDE.md](../CLAUDE.md) (`app/`, `components/`, `lib/`, `supabase/`)
- [x] Configurar fontes (Inter/Geist) e tokens de tema (cores primária/neutros/semânticas)
- [x] Criar repositório Git + primeiro push para GitHub
- [x] Configurar `.env.example` com variáveis previstas (Supabase, Stripe, Resend)
- [x] Conectar projeto à Vercel (deploy inicial de "hello world")

**Commit final:** `chore: setup inicial do projeto Next.js com Tailwind, shadcn/ui e estrutura de pastas`

---

## M1 — Landing Page (UI)

**Branch:** `feat/01-landing-page`

**Objetivo:** Página pública de apresentação do produto, completa e responsiva.

**Entregas:**
- [ ] Seção Hero (proposta de valor, CTA principal)
- [ ] Seção Funcionalidades (destaques: Kanban, Leads, Dashboard, Multi-empresa)
- [ ] Seção Planos e Preços (Free vs. Pro)
- [ ] Seção CTA final
- [ ] Header e footer públicos
- [ ] Responsividade mobile/desktop

**Commit final:** `feat: landing page com hero, funcionalidades, pricing e CTA`

---

## M2 — UI de Autenticação e Onboarding

**Branch:** `feat/02-auth-ui`

**Objetivo:** Telas de login, cadastro e onboarding inicial, sem lógica de autenticação real (formulários funcionais visualmente, submissão mockada).

**Entregas:**
- [x] Tela de Login
- [x] Tela de Cadastro (Signup)
- [ ] Tela de aceite de convite de colaborador
- [x] Fluxo de onboarding (criação do primeiro workspace, passos iniciais)
- [x] Validação de formulário no client (Zod + react-hook-form)
- [x] Estados de erro/loading nos formulários

**Commit final:** `feat: telas de autenticação e onboarding (UI)`

---

## M3 — Shell da Aplicação (Layout Autenticado)

**Branch:** `feat/03-app-shell`

**Objetivo:** Casca da área logada — sidebar, navegação e seletor de workspace, com dados mock.

**Entregas:**
- [x] Layout autenticado (`(app)/[workspace]/layout.tsx`)
- [x] Sidebar com navegação (Dashboard, Leads, Pipeline, Settings)
- [x] Dropdown de troca de workspace (dados mock)
- [x] Header com avatar/menu do usuário
- [x] Estado vazio e responsividade (colapso da sidebar em mobile)

**Commit final:** `feat: shell da aplicação com sidebar e seletor de workspace (UI)`

---

## M4 — UI de Gestão de Leads

**Branch:** `feat/04-leads-ui`

**Objetivo:** Listagem e detalhe de leads completos visualmente, com dados mock.

**Entregas:**
- [x] Listagem de leads (tabela) com dados mock
- [ ] Busca e filtros (por status, responsável, data) — client-side sobre mock (feito: busca por nome/empresa e filtro por status; faltam filtros por responsável e data)
- [x] Formulário de cadastro/edição de lead (nome, e-mail, telefone, empresa, cargo, status)
- [x] Página de detalhe do lead (perfil completo)
- [x] Timeline de atividades no detalhe do lead (mock)
- [ ] Formulário de registro de atividade (ligação, e-mail, reunião, nota)

**Commit final:** `feat: listagem, detalhe e timeline de leads (UI)`

---

## M5 — UI do Pipeline Kanban

**Branch:** `feat/05-pipeline-kanban-ui`

**Objetivo:** Board Kanban completo e interativo no client, com dados mock (sem persistência ainda).

**Entregas:**
- [x] Board com as 6 colunas (Novo Lead → Fechado Perdido)
- [x] Cards de negócio (título, valor, lead vinculado, responsável, prazo)
- [x] Drag-and-drop entre colunas via @dnd-kit (estado local apenas)
- [x] Modal/formulário de criação e edição de negócio
- [x] Indicadores visuais de prazo próximo/vencido no card

**Commit final:** `feat: pipeline Kanban com drag-and-drop client-side (UI)`

---

## M6 — UI do Dashboard de Métricas

**Branch:** `feat/06-dashboard-ui`

**Objetivo:** Dashboard visual completo, com dados mock.

**Entregas:**
- [ ] Cards de métricas (total de leads, negócios abertos, valor total do pipeline, taxa de conversão)
- [ ] Gráfico de funil de vendas (Recharts, dados mock)
- [ ] Lista de negócios do usuário com prazo próximo
- [ ] Responsividade do grid de widgets

**Commit final:** `feat: dashboard de métricas com gráfico de funil (UI)`

---

## M7 — UI de Configurações (Workspace, Colaboradores e Plano)

**Branch:** `feat/07-settings-ui`

**Objetivo:** Telas de administração do workspace, com dados mock.

**Entregas:**
- [ ] Listagem de colaboradores do workspace + papel (Admin/Membro)
- [ ] Formulário de convite de colaborador por e-mail
- [ ] Tela de gestão de plano (Free vs. Pro, uso atual vs. limites)
- [ ] Configurações gerais do workspace (nome, etc.)

**Commit final:** `feat: telas de configurações, colaboradores e plano (UI)`

---

## M8 — Backend: Supabase (Schema, RLS) e Autenticação Real

**Branch:** `feat/08-supabase-auth`

**Objetivo:** Banco de dados modelado e autenticação real conectada às telas de M2.

**Entregas:**
- [x] Modelagem do schema (workspaces, workspace_members, leads, deals, activities — mais subscriptions, base do M13)
- [x] Migrations no Supabase (`supabase/migrations/20260703103000_schema_workspaces_leads_deals.sql`)
- [x] Políticas de Row Level Security por workspace em todas as tabelas (`supabase/migrations/20260703103100_rls_policies.sql`, aplicadas e conferidas no projeto)
- [ ] Supabase Auth conectado (login, signup, sessão)
- [ ] Criação automática de workspace no primeiro signup (onboarding real)
- [ ] Middleware de proteção de rotas autenticadas
- [x] Types gerados do Supabase integrados ao projeto (nota: `lib/supabase/types.ts` escrito manualmente a partir das migrations; substituir por `supabase gen types typescript` quando a CLI do Supabase estiver linkada ao projeto)

**Commit final:** `feat: schema Supabase, RLS por workspace e autenticação real`

---

## M9 — Backend: Leads e Atividades

**Branch:** `feat/09-leads-backend`

**Objetivo:** CRUD real de leads e atividades, substituindo os dados mock de M4.

**Entregas:**
- [ ] Server Actions de CRUD de leads (create, update, delete, list)
- [ ] Busca e filtros server-side (status, responsável, data)
- [ ] Server Actions de registro de atividades
- [ ] Timeline do lead consumindo dados reais
- [ ] Validação Zod em todas as mutações

**Commit final:** `feat: CRUD real de leads e atividades via Server Actions`

---

## M10 — Backend: Pipeline Kanban

**Branch:** `feat/10-pipeline-backend`

**Objetivo:** Persistência real do board Kanban de M5.

**Entregas:**
- [ ] Server Actions de CRUD de negócios (deals)
- [ ] Persistência de mudança de etapa no drag-and-drop
- [ ] Otimistic UI no drag-and-drop com rollback em caso de erro
- [ ] Vínculo negócio ↔ lead ↔ responsável consumindo dados reais

**Commit final:** `feat: persistência real do pipeline Kanban`

---

## M11 — Backend: Dashboard de Métricas

**Branch:** `feat/11-dashboard-backend`

**Objetivo:** Métricas e gráfico de funil de M6 consumindo dados reais do workspace.

**Entregas:**
- [ ] Queries agregadas (total de leads, negócios abertos, valor total do pipeline, taxa de conversão)
- [ ] Query do funil de vendas por etapa para o Recharts
- [ ] Query de negócios do usuário logado com prazo próximo
- [ ] Cache/revalidação adequada (Next.js)

**Commit final:** `feat: dashboard consumindo métricas reais do workspace`

---

## M12 — Multi-empresa: Workspaces e Convites por E-mail

**Branch:** `feat/12-workspaces-invites`

**Objetivo:** Colaboração multi-empresa completa, conectando M7 ao backend.

**Entregas:**
- [ ] Criação de múltiplos workspaces por usuário
- [ ] Troca de workspace ativo (sidebar) consumindo dados reais
- [ ] Envio de convite por e-mail via Resend
- [ ] Aceite de convite (vínculo do usuário convidado ao workspace com papel definido)
- [ ] Gestão de papéis (Admin/Membro) e remoção de colaborador
- [ ] Enforce de permissões por papel nas Server Actions

**Commit final:** `feat: workspaces, convite de colaboradores via Resend e papéis`

---

## M13 — Monetização: Stripe

**Branch:** `feat/13-stripe-billing`

**Objetivo:** Cobrança de assinatura completa e enforcement dos limites de plano.

**Entregas:**
- [ ] Integração Stripe Checkout (upgrade para plano Pro)
- [ ] Webhook do Stripe (ativação/cancelamento/atualização de plano)
- [ ] Customer Portal do Stripe (gerenciamento de assinatura pelo usuário)
- [ ] Enforcement dos limites do plano Free (2 colaboradores, 50 leads) nas Server Actions
- [ ] Tela de plano (M7) refletindo status real da assinatura

**Commit final:** `feat: cobrança via Stripe com enforcement de limites de plano`

---

## M14 — Deploy e Lançamento

**Branch:** `feat/14-deploy-producao`

**Objetivo:** Aplicação em produção, estável e monitorável.

**Entregas:**
- [ ] Variáveis de ambiente de produção configuradas na Vercel (Supabase, Stripe, Resend)
- [ ] Projeto Supabase de produção com migrations aplicadas
- [ ] Domínio customizado configurado
- [ ] Webhooks do Stripe apontando para produção
- [ ] Teste end-to-end do fluxo completo em produção (signup → convite → lead → pipeline → dashboard → upgrade de plano)
- [ ] Checklist de segurança revisado (RLS, chaves de API, CORS)

**Commit final:** `chore: deploy de produção do PipeFlow CRM`
