import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Cta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-primary/10 px-8 py-16 text-center sm:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/30 blur-[100px]"
        />
        <h2 className="relative text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Pronto para organizar seu funil de vendas?
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Crie sua conta grátis agora e veja seus resultados já no primeiro
          mês. Sem cartão de crédito.
        </p>
        <Button
          size="lg"
          className="relative mt-8 h-11 px-6 text-base"
          render={<Link href="/signup" />}
        >
          Criar minha conta grátis
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}
