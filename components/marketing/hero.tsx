import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { KanbanPreview } from "@/components/marketing/kanban-preview";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.15] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]"
      />

      <div className="relative mx-auto grid max-w-6xl gap-16 px-4 pt-20 pb-24 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:pt-28 lg:pb-32">
        <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            Feito para quem vende, não para quem programa
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
            Seu funil de vendas, finalmente fora da planilha.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Pipeline visual, gestão de leads e dashboard de métricas em um só
            lugar — a organização do HubSpot ou Pipedrive, sem a complexidade
            (nem o preço) deles.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" className="h-11 px-6 text-base" render={<Link href="/signup" />}>
              Começar grátis
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 px-6 text-base"
              render={<a href="#funcionalidades" />}
            >
              Ver funcionalidades
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Grátis para até 2 pessoas · Sem cartão de crédito
          </p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700 delay-150">
          <KanbanPreview />
        </div>
      </div>
    </section>
  );
}
