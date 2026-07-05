import {
  BarChart3,
  Building2,
  KanbanSquare,
  ListChecks,
  SearchCheck,
  UsersRound,
} from "lucide-react";

const features = [
  {
    icon: KanbanSquare,
    title: "Pipeline Kanban visual",
    description:
      "Arraste negócios entre etapas e visualize todo o funil de vendas em um board intuitivo.",
  },
  {
    icon: UsersRound,
    title: "Gestão de Leads",
    description:
      "Cadastre leads completos e acompanhe cada interação na timeline do contato.",
  },
  {
    icon: ListChecks,
    title: "Registro de Atividades",
    description:
      "Ligações, e-mails, reuniões e notas — tudo documentado e organizado por lead.",
  },
  {
    icon: BarChart3,
    title: "Dashboard de Métricas",
    description:
      "Acompanhe conversão, funil de vendas e desempenho da equipe em tempo real.",
  },
  {
    icon: Building2,
    title: "Multi-empresa",
    description:
      "Gerencie múltiplos workspaces e convide colaboradores com papéis definidos.",
  },
  {
    icon: SearchCheck,
    title: "Busca e Filtros",
    description:
      "Encontre qualquer lead ou negócio em segundos, filtrando por status, responsável ou data.",
  },
];

export function Features() {
  return (
    <section id="funcionalidades" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Tudo que seu time de vendas precisa, em um só lugar
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Sem planilha espalhada, sem ferramenta genérica. O PipeFlow reúne o
          essencial para organizar o processo comercial da sua empresa.
        </p>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <feature.icon className="size-5" />
            </div>
            <h3 className="mt-4 font-medium">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
