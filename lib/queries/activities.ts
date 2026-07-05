import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";
import type { Activity } from "@/lib/domain";
import { displayName, getProfilesByIds } from "@/lib/queries/profiles";

type ActivityRow = Database["public"]["Tables"]["activities"]["Row"];

function mapActivity(row: ActivityRow, authorName: string): Activity {
  return {
    id: row.id,
    leadId: row.lead_id,
    type: row.type,
    authorId: row.author_id,
    authorName,
    description: row.description,
    date: row.occurred_at,
  };
}

export async function listActivitiesByLead(
  supabase: SupabaseClient<Database>,
  workspaceId: string,
  leadId: string,
): Promise<Activity[]> {
  const { data } = await supabase
    .from("activities")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("lead_id", leadId)
    .order("occurred_at", { ascending: false });

  const rows = data ?? [];
  const profiles = await getProfilesByIds(
    supabase,
    rows.map((row) => row.author_id),
  );

  return rows.map((row) =>
    mapActivity(row, displayName(row.author_id ? profiles.get(row.author_id) : null)),
  );
}
