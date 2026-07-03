import { LayoutDashboard } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Métricas e funil de vendas do seu workspace."
      />
      <EmptyState
        icon={LayoutDashboard}
        title="Nenhum dado ainda"
        description="Assim que você tiver leads e negócios, as métricas e o funil de vendas aparecem aqui."
      />
    </>
  );
}
