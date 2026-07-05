import { notFound } from "next/navigation";

import { PageHeader } from "@/components/ui/page-header";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { createClient } from "@/lib/supabase/server";
import { getWorkspaceBySlug } from "@/lib/workspace";
import { listDeals } from "@/lib/queries/deals";
import { listLeads } from "@/lib/queries/leads";
import { listWorkspaceMembers } from "@/lib/queries/profiles";

export default async function PipelinePage({
  params,
}: {
  params: { workspace: string };
}) {
  const supabase = await createClient();
  const workspace = await getWorkspaceBySlug(supabase, params.workspace);

  if (!workspace) {
    notFound();
  }

  const [deals, leads, members] = await Promise.all([
    listDeals(supabase, workspace.id),
    listLeads(supabase, workspace.id),
    listWorkspaceMembers(supabase, workspace.id),
  ]);

  return (
    <>
      <PageHeader
        title="Pipeline"
        description="Acompanhe seus negócios em cada etapa do funil de vendas."
      />
      <KanbanBoard
        workspace={params.workspace}
        initialDeals={deals}
        leads={leads}
        members={members}
      />
    </>
  );
}
