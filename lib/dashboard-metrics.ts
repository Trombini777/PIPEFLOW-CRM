import {
  closedDealStages,
  dealStageOptions,
  mockDeals,
  mockLeads,
  type Deal,
  type DealStage,
  type Lead,
} from "@/lib/mock-data";

export type DashboardMetrics = {
  totalLeads: number;
  openDeals: number;
  pipelineValue: number;
  conversionRate: number;
};

export function getDashboardMetrics(): DashboardMetrics {
  const openDeals = mockDeals.filter(
    (deal) => !closedDealStages.includes(deal.stage),
  );
  const wonDeals = mockDeals.filter((deal) => deal.stage === "fechado_ganho");
  const lostDeals = mockDeals.filter(
    (deal) => deal.stage === "fechado_perdido",
  );
  const closedCount = wonDeals.length + lostDeals.length;

  return {
    totalLeads: mockLeads.length,
    openDeals: openDeals.length,
    pipelineValue: openDeals.reduce((sum, deal) => sum + deal.value, 0),
    conversionRate:
      closedCount === 0 ? 0 : Math.round((wonDeals.length / closedCount) * 100),
  };
}

export type FunnelStageData = {
  stage: DealStage;
  label: string;
  displayLabel: string;
  count: number;
  value: number;
  color: string;
};

const funnelStageColors: Record<DealStage, string> = {
  novo_lead: "#60a5fa",
  contato_realizado: "#3b82f6",
  proposta_enviada: "#2563eb",
  negociacao: "#1e40af",
  fechado_ganho: "var(--success)",
  fechado_perdido: "var(--destructive)",
};

export function getFunnelData(): FunnelStageData[] {
  return dealStageOptions.map(({ value: stage, label }) => {
    const dealsInStage = mockDeals.filter((deal) => deal.stage === stage);
    const count = dealsInStage.length;
    return {
      stage,
      label,
      displayLabel: `${label} · ${count}`,
      count,
      value: dealsInStage.reduce((sum, deal) => sum + deal.value, 0),
      color: funnelStageColors[stage],
    };
  });
}

export type UpcomingDeal = Deal & { lead?: Lead };

export function getUpcomingDeals(limit = 6): UpcomingDeal[] {
  return mockDeals
    .filter((deal) => !closedDealStages.includes(deal.stage))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, limit)
    .map((deal) => ({
      ...deal,
      lead: mockLeads.find((lead) => lead.id === deal.leadId),
    }));
}
