import { PageHeader } from "@/components/ui/page-header";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { SalesFunnelChart } from "@/components/dashboard/sales-funnel-chart";
import { UpcomingDealsTable } from "@/components/dashboard/upcoming-deals-table";
import {
  getDashboardMetrics,
  getFunnelData,
  getUpcomingDeals,
} from "@/lib/dashboard-metrics";

export default function DashboardPage() {
  const metrics = getDashboardMetrics();
  const funnelData = getFunnelData();
  const upcomingDeals = getUpcomingDeals();

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
