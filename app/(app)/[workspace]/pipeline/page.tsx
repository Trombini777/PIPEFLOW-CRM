import { PageHeader } from "@/components/ui/page-header";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { mockDeals, mockLeads } from "@/lib/mock-data";

export default function PipelinePage() {
  return (
    <>
      <PageHeader
        title="Pipeline"
        description="Acompanhe seus negócios em cada etapa do funil de vendas."
      />
      <KanbanBoard initialDeals={mockDeals} leads={mockLeads} />
    </>
  );
}
