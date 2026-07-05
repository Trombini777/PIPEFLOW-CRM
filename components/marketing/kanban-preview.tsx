import { cn } from "@/lib/utils";

type PreviewCard = {
  title: string;
  company: string;
  value: string;
};

type PreviewColumn = {
  label: string;
  accent: string;
  cards: PreviewCard[];
};

const columns: PreviewColumn[] = [
  {
    label: "Novo Lead",
    accent: "bg-muted-foreground/40",
    cards: [{ title: "Implantação ERP", company: "Grupo Alfa", value: "R$ 8.400" }],
  },
  {
    label: "Proposta Enviada",
    accent: "bg-primary",
    cards: [
      { title: "Licenças anuais", company: "Nimbus Tech", value: "R$ 22.000" },
      { title: "Consultoria Q3", company: "Vetor Corp", value: "R$ 5.900" },
    ],
  },
  {
    label: "Fechado Ganho",
    accent: "bg-success",
    cards: [{ title: "Upgrade Pro", company: "Loomi", value: "R$ 14.300" }],
  },
];

export function KanbanPreview() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-3xl bg-primary/10 blur-2xl"
      />
      <div className="rounded-2xl border border-border bg-card p-4 shadow-2xl shadow-black/40 sm:p-5">
        <div className="mb-4 flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-destructive/60" />
          <span className="size-2.5 rounded-full bg-warning/60" />
          <span className="size-2.5 rounded-full bg-success/60" />
          <span className="ml-2 text-xs text-muted-foreground">
            Pipeline · Workspace Acme
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {columns.map((column, index) => (
            <div
              key={column.label}
              className={cn(
                "flex flex-col gap-2 rounded-xl bg-muted/40 p-2",
                index === 1 && "lg:-translate-y-3",
              )}
            >
              <div className="flex items-center gap-1.5 px-1 pt-1">
                <span className={cn("size-1.5 rounded-full", column.accent)} />
                <span className="truncate text-[0.65rem] font-medium text-muted-foreground">
                  {column.label}
                </span>
              </div>

              {column.cards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-lg border border-border/60 bg-card p-2.5 shadow-sm"
                >
                  <p className="text-[0.7rem] font-medium leading-tight">
                    {card.title}
                  </p>
                  <p className="mt-1 text-[0.65rem] text-muted-foreground">
                    {card.company}
                  </p>
                  <p className="mt-1.5 text-[0.7rem] font-semibold text-primary">
                    {card.value}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
