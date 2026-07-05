import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";
import type { Collaborator, InvitePreview, WorkspaceInvite } from "@/lib/domain";
import { displayName, getProfilesByIds } from "@/lib/queries/profiles";

export async function listCollaborators(
  supabase: SupabaseClient<Database>,
  workspaceId: string,
  ownerId: string,
  currentUserId: string,
): Promise<Collaborator[]> {
  const { data: memberRows } = await supabase
    .from("workspace_members")
    .select("user_id, role")
    .eq("workspace_id", workspaceId);

  const rows = memberRows ?? [];
  const profiles = await getProfilesByIds(
    supabase,
    rows.map((row) => row.user_id),
  );

  return rows
    .map((row) => {
      const profile = profiles.get(row.user_id);
      return {
        userId: row.user_id,
        name: displayName(profile),
        email: profile?.email ?? "",
        role: row.role,
        isOwner: row.user_id === ownerId,
        isCurrentUser: row.user_id === currentUserId,
      };
    })
    .sort((a, b) => {
      if (a.isOwner !== b.isOwner) return a.isOwner ? -1 : 1;
      if (a.role !== b.role) return a.role === "admin" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
}

export async function listWorkspaceInvites(
  supabase: SupabaseClient<Database>,
  workspaceId: string,
): Promise<WorkspaceInvite[]> {
  const { data } = await supabase
    .from("workspace_invites")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) => ({
    id: row.id,
    email: row.email,
    role: row.role,
    status: row.status,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
  }));
}

export async function getInvitePreview(
  supabase: SupabaseClient<Database>,
  token: string,
): Promise<InvitePreview | null> {
  const { data } = await supabase.rpc("get_invite_preview", { _token: token });
  const row = data?.[0];
  if (!row) return null;

  return {
    workspaceName: row.workspace_name,
    email: row.email,
    role: row.role,
    status: row.status,
  };
}
