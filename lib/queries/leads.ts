import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";
import type { Lead, LeadStatus } from "@/lib/domain";
import { displayName, getProfilesByIds } from "@/lib/queries/profiles";

type LeadRow = Database["public"]["Tables"]["leads"]["Row"];

function mapLead(row: LeadRow, ownerName: string): Lead {
  return {
    id: row.id,
    name: row.name,
    email: row.email ?? "",
    phone: row.phone ?? "",
    company: row.company ?? "",
    role: row.role ?? "",
    status: row.status,
    ownerId: row.owner_id,
    ownerName,
    createdAt: row.created_at.slice(0, 10),
  };
}

export type LeadFilters = {
  q?: string;
  status?: LeadStatus | "all";
};

export async function listLeads(
  supabase: SupabaseClient<Database>,
  workspaceId: string,
  filters: LeadFilters = {},
): Promise<Lead[]> {
  let query = supabase
    .from("leads")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  const q = filters.q?.trim();
  if (q) {
    const escaped = q.replace(/[%_]/g, (match) => `\\${match}`);
    query = query.or(`name.ilike.%${escaped}%,company.ilike.%${escaped}%`);
  }

  const { data } = await query;
  const rows = data ?? [];

  const profiles = await getProfilesByIds(
    supabase,
    rows.map((row) => row.owner_id),
  );

  return rows.map((row) =>
    mapLead(row, displayName(row.owner_id ? profiles.get(row.owner_id) : null)),
  );
}

export async function getLeadById(
  supabase: SupabaseClient<Database>,
  workspaceId: string,
  leadId: string,
): Promise<Lead | null> {
  const { data: row } = await supabase
    .from("leads")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("id", leadId)
    .maybeSingle();

  if (!row) return null;

  const profiles = await getProfilesByIds(supabase, [row.owner_id]);
  return mapLead(row, displayName(row.owner_id ? profiles.get(row.owner_id) : null));
}
