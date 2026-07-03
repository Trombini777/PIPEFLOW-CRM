import type { DealStage } from "@/lib/mock-data";

type StageStyle = {
  rail: string;
  dot: string;
  cardBorder: string;
};

export const dealStageStyles: Record<DealStage, StageStyle> = {
  novo_lead: {
    rail: "bg-blue-500",
    dot: "bg-blue-500",
    cardBorder: "border-l-blue-500",
  },
  contato_realizado: {
    rail: "bg-sky-500",
    dot: "bg-sky-500",
    cardBorder: "border-l-sky-500",
  },
  proposta_enviada: {
    rail: "bg-violet-500",
    dot: "bg-violet-500",
    cardBorder: "border-l-violet-500",
  },
  negociacao: {
    rail: "bg-amber-500",
    dot: "bg-amber-500",
    cardBorder: "border-l-amber-500",
  },
  fechado_ganho: {
    rail: "bg-success",
    dot: "bg-success",
    cardBorder: "border-l-success",
  },
  fechado_perdido: {
    rail: "bg-destructive",
    dot: "bg-destructive",
    cardBorder: "border-l-destructive",
  },
};
