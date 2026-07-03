import { Percent, TrendingUp, Users, Wallet } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { DashboardMetrics } from "@/lib/dashboard-metrics";

type MetricCardsProps = {
  metrics: DashboardMetrics;
};

export function MetricCards({ metrics }: MetricCardsProps) {
  const items = [
    {
      label: "Total de Leads",
      value: metrics.totalLeads.toString(),
      icon: Users,
    },
    {
      label: "Negócios Abertos",
      value: metrics.openDeals.toString(),
      icon: TrendingUp,
    },
    {
      label: "Valor do Pipeline",
      value: formatCurrency(metrics.pipelineValue),
      icon: Wallet,
    },
    {
      label: "Taxa de Conversão",
      value: `${metrics.conversionRate}%`,
      icon: Percent,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between font-normal text-muted-foreground">
              {item.label}
              <item.icon className="size-4" aria-hidden="true" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums text-foreground">
              {item.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
