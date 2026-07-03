import { KanbanSquare } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default function PipelinePage() {
  return (
    <>
      <PageHeader
        title="Pipeline"
        description="Acompanhe seus negócios em cada etapa do funil de vendas."
        action={<Button>Novo negócio</Button>}
      />
      <EmptyState
        icon={KanbanSquare}
        title="Nenhum negócio no pipeline"
        description="Crie seu primeiro negócio para começar a organizar o funil de vendas."
        action={<Button>Novo negócio</Button>}
      />
    </>
  );
}
