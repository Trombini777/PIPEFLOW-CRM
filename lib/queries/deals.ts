import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";
import type { Deal } from "@/lib/domain";
import { displayName, getProfilesByIds } from "@/lib/queries/profiles";

type DealRow = Database["public"]["Tables"]["deals"]["Row"];

function mapDeal(row: DealRow, ownerName: string): Deal {
  return {
    id: row.id,
    title: row.title,
    leadId: row.lead_id ?? "",
    value: row.value,
    stage: row.stage,
    ownerId: row.owner_id,
    ownerName,
    dueDate: row.due_date ?? "",
  };
}

export async function listDeals(
  supabase: SupabaseClient<Database>,
  workspaceId: string,
): Promise<Deal[]> {
  const { data } = await supabase
    .from("deals")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: true });

  const rows = data ?? [];
  const profiles = await getProfilesByIds(
    supabase,
    rows.map((row) => row.owner_id),
  );

  return rows.map((row) =>
    mapDeal(row, displayName(row.owner_id ? profiles.get(row.owner_id) : null)),
  );
}
