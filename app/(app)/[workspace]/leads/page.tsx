import { notFound } from "next/navigation";

import { PageHeader } from "@/components/ui/page-header";
import { LeadsTable } from "@/components/leads/leads-table";
import { createClient } from "@/lib/supabase/server";
import { getWorkspaceBySlug } from "@/lib/workspace";
import { listLeads } from "@/lib/queries/leads";
import type { LeadStatus } from "@/lib/domain";

export default async function LeadsPage({
  params,
  searchParams,
}: {
  params: { workspace: string };
  searchParams: { q?: string; status?: string };
}) {
  const supabase = await createClient();
  const workspace = await getWorkspaceBySlug(supabase, params.workspace);

  if (!workspace) {
    notFound();
  }

  const status = (searchParams.status ?? "all") as LeadStatus | "all";
  const q = searchParams.q ?? "";

  const leads = await listLeads(supabase, workspace.id, { q, status });

  return (
    <>
      <PageHeader
        title="Leads"
        description="Gerencie os contatos e oportunidades do seu workspace."
      />
      <LeadsTable
        workspace={params.workspace}
        leads={leads}
        initialSearch={q}
        initialStatus={status}
      />
    </>
  );
}
