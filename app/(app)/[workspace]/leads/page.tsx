import { PageHeader } from "@/components/ui/page-header";
import { LeadsTable } from "@/components/leads/leads-table";
import { mockLeads } from "@/lib/mock-data";

export default function LeadsPage({
  params,
}: {
  params: { workspace: string };
}) {
  return (
    <>
      <PageHeader
        title="Leads"
        description="Gerencie os contatos e oportunidades do seu workspace."
      />
      <LeadsTable workspace={params.workspace} initialLeads={mockLeads} />
    </>
  );
}
