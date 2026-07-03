"use client";

import {
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  type TooltipContentProps,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { FunnelStageData } from "@/lib/dashboard-metrics";

type SalesFunnelChartProps = {
  data: FunnelStageData[];
};

function FunnelTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;

  const stage = payload[0]?.payload as FunnelStageData | undefined;
  if (!stage) return null;

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-popover-foreground">{stage.label}</p>
      <p className="text-muted-foreground">
        {stage.count} negócio{stage.count === 1 ? "" : "s"} ·{" "}
        {formatCurrency(stage.value)}
      </p>
    </div>
  );
}

export function SalesFunnelChart({ data }: SalesFunnelChartProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Funil de Vendas</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={340}>
          <FunnelChart>
            <Tooltip content={FunnelTooltip} />
            <Funnel dataKey="count" data={data} isAnimationActive={false}>
              <LabelList
                dataKey="displayLabel"
                position="center"
                fill="#fff"
                stroke="none"
                className="text-xs font-medium"
              />
              {data.map((entry) => (
                <Cell key={entry.stage} fill={entry.color} />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
