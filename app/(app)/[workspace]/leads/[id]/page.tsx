import { notFound } from "next/navigation";

import { LeadDetailView } from "@/components/leads/lead-detail-view";
import { mockActivities, mockLeads } from "@/lib/mock-data";

export default function LeadDetailPage({
  params,
}: {
  params: { workspace: string; id: string };
}) {
  const lead = mockLeads.find((item) => item.id === params.id);

  if (!lead) {
    notFound();
  }

  const activities = mockActivities.filter(
    (activity) => activity.leadId === lead.id,
  );

  return (
    <LeadDetailView
      workspace={params.workspace}
      initialLead={lead}
      activities={activities}
    />
  );
}
