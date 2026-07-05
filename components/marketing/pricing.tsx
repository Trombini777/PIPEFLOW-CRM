import Link from "next/link";
import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "R$ 0",
    period: "/mês",
    description: "Para quem está começando a organizar o processo comercial.",
    features: [
      "Até 2 colaboradores",
      "Até 50 leads",
      "Pipeline Kanban ilimitado",
      "Dashboard de métricas",
    ],
    cta: "Começar grátis",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "R$ 49",
    period: "/mês",
    description: "Para times que já venderam e querem escalar sem limite.",
    features: [
      "Colaboradores ilimitados",
      "Leads ilimitados",
      "Tudo do plano Free",
      "Convite de equipe por e-mail",
      "Suporte prioritário",
    ],
    cta: "Assinar Pro",
    highlighted: true,
  },
];

export function Pricing() {
  return (
    <section id="precos" className="border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Planos para cada fase do seu negócio
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Comece grátis. Migre para o Pro quando o time crescer.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={
                plan.highlighted
                  ? "relative rounded-2xl border border-primary/50 bg-card p-8 shadow-xl shadow-primary/10 ring-1 ring-primary/20 sm:scale-105"
                  : "relative rounded-2xl border border-border bg-card p-8"
              }
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-8">Mais popular</Badge>
              )}

              <h3 className="font-medium">{plan.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>

              <p className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight">
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {plan.period}
                </span>
              </p>

              <Button
                className="mt-6 w-full"
                variant={plan.highlighted ? "default" : "outline"}
                render={<Link href="/signup" />}
              >
                {plan.cta}
              </Button>

              <ul className="mt-8 flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
