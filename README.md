# PipeFlow CRM

SaaS multi-empresa de gestão de clientes e vendas, com pipeline visual Kanban, gestão de leads, registro de atividades e dashboard de métricas.

Visão geral do produto e stack técnica: [CLAUDE.md](./CLAUDE.md). Escopo completo de produto: [docs/PRD.md](docs/PRD.md). Plano de execução por milestones: [docs/PLAN.md](docs/PLAN.md).

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

Copie `.env.example` para `.env.local` e preencha as variáveis (Supabase, Stripe, Resend) conforme forem necessárias em cada milestone.

## Scripts

- `npm run dev` — inicia o servidor de desenvolvimento
- `npm run build` — build de produção
- `npm run start` — inicia o build de produção
- `npm run lint` — checa lint (ESLint)
- `npm run format` — formata o código (Prettier)
- `npm run format:check` — checa formatação sem alterar arquivos
