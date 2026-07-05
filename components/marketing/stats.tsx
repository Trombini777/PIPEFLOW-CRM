import { Building2, Clock, Target, TrendingUp } from "lucide-react";

const stats = [
  {
    value: "+47%",
    label: "conversão de leads",
    icon: TrendingUp,
  },
  {
    value: "3.2x",
    label: "mais leads qualificados",
    icon: Target,
  },
  {
    value: "-62%",
    label: "no ciclo de vendas",
    icon: Clock,
  },
  {
    value: "1.200+",
    label: "times usando o PipeFlow",
    icon: Building2,
  },
];

export function Stats() {
  return (
    <section className="border-y border-border/60 bg-card/30">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <stat.icon className="mb-3 size-5 text-primary" />
              <p className="text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
