import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";
import type { WorkspaceMember } from "@/lib/domain";

type ProfileRow = { id: string; email: string; full_name: string | null };

export function displayName(profile?: ProfileRow | null) {
  if (!profile) return "—";
  return profile.full_name?.trim() || profile.email;
}

// profiles.id não tem FK declarada para leads.owner_id/deals.owner_id/
// activities.author_id (ambos apontam para auth.users, fora do alcance do
// PostgREST), então a resolução de nome é feita em duas etapas: busca os
// ids únicos nas linhas já carregadas e resolve os nomes aqui.
export async function getProfilesByIds(
  supabase: SupabaseClient<Database>,
  ids: (string | null)[],
): Promise<Map<string, ProfileRow>> {
  const uniqueIds = Array.from(new Set(ids.filter((id): id is string => !!id)));
  if (uniqueIds.length === 0) return new Map();

  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .in("id", uniqueIds);

  return new Map((data ?? []).map((profile) => [profile.id, profile]));
}

export async function listWorkspaceMembers(
  supabase: SupabaseClient<Database>,
  workspaceId: string,
): Promise<WorkspaceMember[]> {
  const { data: memberRows } = await supabase
    .from("workspace_members")
    .select("user_id")
    .eq("workspace_id", workspaceId);

  const userIds = (memberRows ?? []).map((row) => row.user_id);
  const profiles = await getProfilesByIds(supabase, userIds);

  return userIds
    .map((userId) => {
      const profile = profiles.get(userId);
      return {
        userId,
        name: displayName(profile),
        email: profile?.email ?? "",
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
