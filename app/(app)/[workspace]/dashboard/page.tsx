import { notFound } from "next/navigation";

import { PageHeader } from "@/components/ui/page-header";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { SalesFunnelChart } from "@/components/dashboard/sales-funnel-chart";
import { UpcomingDealsTable } from "@/components/dashboard/upcoming-deals-table";
import {
  getDashboardMetrics,
  getFunnelData,
  getUpcomingDeals,
} from "@/lib/dashboard-metrics";
import { createClient } from "@/lib/supabase/server";
import { getWorkspaceBySlug } from "@/lib/workspace";
import { listLeads } from "@/lib/queries/leads";
import { listDeals } from "@/lib/queries/deals";

export default async function DashboardPage({
  params,
}: {
  params: { workspace: string };
}) {
  const supabase = await createClient();
  const workspace = await getWorkspaceBySlug(supabase, params.workspace);

  if (!workspace) {
    notFound();
  }

  const [leads, deals] = await Promise.all([
    listLeads(supabase, workspace.id),
    listDeals(supabase, workspace.id),
  ]);

  const metrics = getDashboardMetrics(leads, deals);
  const funnelData = getFunnelData(deals);
  const upcomingDeals = getUpcomingDeals(leads, deals);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Métricas e funil de vendas do seu workspace."
      />
      <div className="flex flex-col gap-6">
        <MetricCards metrics={metrics} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SalesFunnelChart data={funnelData} />
          </div>
          <div className="lg:col-span-3">
            <UpcomingDealsTable deals={upcomingDeals} />
          </div>
        </div>
      </div>
    </>
  );
}
