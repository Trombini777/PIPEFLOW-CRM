import { Users } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default function LeadsPage() {
  return (
    <>
      <PageHeader
        title="Leads"
        description="Gerencie os contatos e oportunidades do seu workspace."
        action={<Button>Novo lead</Button>}
      />
      <EmptyState
        icon={Users}
        title="Nenhum lead cadastrado"
        description="Cadastre seu primeiro lead para começar a acompanhar oportunidades."
        action={<Button>Novo lead</Button>}
      />
    </>
  );
}
