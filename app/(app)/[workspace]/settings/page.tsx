import { Settings } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Configurações"
        description="Colaboradores, papéis e plano do seu workspace."
      />
      <EmptyState
        icon={Settings}
        title="Configurações do workspace"
        description="As opções de colaboradores, papéis e plano vão aparecer aqui."
      />
    </>
  );
}
