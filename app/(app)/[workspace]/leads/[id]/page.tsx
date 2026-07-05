import { notFound } from "next/navigation";

import { LeadDetailView } from "@/components/leads/lead-detail-view";
import { createClient } from "@/lib/supabase/server";
import { getWorkspaceBySlug } from "@/lib/workspace";
import { getLeadById } from "@/lib/queries/leads";
import { listActivitiesByLead } from "@/lib/queries/activities";

export default async function LeadDetailPage({
  params,
}: {
  params: { workspace: string; id: string };
}) {
  const supabase = await createClient();
  const workspace = await getWorkspaceBySlug(supabase, params.workspace);

  if (!workspace) {
    notFound();
  }

  const lead = await getLeadById(supabase, workspace.id, params.id);

  if (!lead) {
    notFound();
  }

  const activities = await listActivitiesByLead(supabase, workspace.id, lead.id);

  return (
    <LeadDetailView
      workspace={params.workspace}
      lead={lead}
      activities={activities}
    />
  );
}
