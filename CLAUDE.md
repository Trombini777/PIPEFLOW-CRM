# PipeFlow CRM

## Visão geral

PipeFlow CRM é um SaaS multi-empresa de gestão de clientes e vendas, com pipeline visual Kanban, gestão de leads, registro de atividades e dashboard de métricas. Foco em PMEs, freelancers e times de vendas que hoje usam planilhas ou ferramentas genéricas — a proposta é uma experiência simples e acessível, inspirada em Pipedrive/HubSpot mas sem a complexidade e o custo dessas plataformas.

Escopo completo de produto, funcionalidades e personas: [docs/PRD.md](docs/PRD.md).

## Stack Tecnológica

- **Frontend**: Next.js 14 (App Router) + React 18 + TypeScript 5
- **UI**: Tailwind CSS + shadcn/ui
- **Backend/API**: Next.js API Routes + Server Actions
- **Banco de dados + Auth**: Supabase (PostgreSQL + Row Level Security + Auth)
- **Pagamentos**: Stripe (Checkout, webhooks, Customer Portal)
- **E-mail transacional**: Resend
- **Drag-and-drop**: @dnd-kit (pipeline Kanban)
- **Gráficos**: Recharts (funil de vendas, dashboard)
- **Deploy**: Vercel (app) + Supabase (banco/auth)
- **Versionamento**: Git + GitHub

## Convenções de código

- TypeScript estrito; evitar `any` — tipar dados vindos do Supabase com os types gerados.
- Server Components por padrão; usar `"use client"` apenas onde há interatividade real (formulários, Kanban com drag-and-drop, dropdowns de workspace).
- Mutações simples via Server Actions; API Routes reservadas para webhooks (Stripe) e endpoints chamados por serviços externos.
- Validação de dados com Zod em todos os limites do sistema: formulários, Server Actions, payloads de webhook.
- Nomenclatura: `PascalCase` para componentes React, `camelCase` para funções e variáveis, `kebab-case` para pastas e arquivos de rota.
- Estilização somente via Tailwind + tokens do shadcn/ui — sem CSS solto ou inline styles.
- Toda query ao Supabase deve respeitar o isolamento por workspace via RLS — nunca filtrar tenant só no client/query manual.
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`).

## Estrutura de pastas

```
pipeflow-crm/
├── app/
│   ├── (marketing)/          # Landing page pública (Hero, Features, Pricing, CTA)
│   │   └── page.tsx
│   ├── (auth)/                # Login, cadastro, aceite de convite
│   │   ├── login/
│   │   └── signup/
│   ├── (app)/
│   │   └── [workspace]/       # Área autenticada, escopada por workspace
│   │       ├── dashboard/     # Métricas + gráfico de funil
│   │       ├── leads/
│   │       │   └── [id]/      # Detalhe do lead + timeline de atividades
│   │       ├── pipeline/      # Kanban de negócios
│   │       ├── settings/      # Colaboradores, papéis, plano/assinatura
│   │       └── layout.tsx     # Sidebar com seletor de workspace
│   ├── api/
│   │   ├── webhooks/stripe/   # Ativação/desativação de plano
│   │   └── invite/            # Convite de colaborador por e-mail
│   └── layout.tsx
├── components/
│   ├── ui/                    # shadcn/ui
│   ├── kanban/                # Board, colunas, cards de negócio
│   ├── leads/                 # Formulários, listagem, timeline
│   ├── dashboard/             # Cards de métricas, gráficos
│   └── layout/                # Sidebar, header, workspace switcher
├── lib/
│   ├── supabase/               # Clients (server/browser) + types gerados
│   ├── stripe/
│   ├── resend/
│   └── validations/            # Schemas Zod
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── docs/
│   └── PRD.md
└── CLAUDE.md
```

## Identidade visual (proposta inicial)

Paleta sóbria e profissional, adequada a um CRM B2B denso em dados — ponto de partida, a ajustar quando houver definição de marca/logo.

- **Primária**: azul profundo (`blue-600` / `#2563EB`) — CTAs, links, estados ativos no Kanban.
- **Neutros**: escala slate (cinza-azulado) para fundo, texto e bordas — visual limpo de software de produtividade.
- **Semânticas**: verde para "Fechado Ganho" / sucesso; vermelho para "Fechado Perdido" / erro; âmbar para alertas de prazo próximo.
- **Tipografia**: Inter ou Geist — sans-serif de alta legibilidade para telas densas de dados (tabelas, cards, dashboards).
- **Tom visual**: interface densa mas arejada; cards com bordas suaves e sombras discretas; padrão shadcn/ui `new-york` ou `default`.

## Referências de produto

HubSpot CRM e Pipedrive — ver seção 6 do [PRD](docs/PRD.md) para pontos fortes/fracos e insights aplicados ao PipeFlow.
