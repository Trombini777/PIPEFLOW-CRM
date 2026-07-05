import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";

export type WorkspaceRef = {
  id: string;
  slug: string;
  name: string;
  ownerId: string;
};

// RLS (workspaces_select_members) já limita o retorno aos workspaces dos
// quais o usuário autenticado é membro — um slug de outro workspace
// simplesmente não retorna linha, sem vazar existência.
export async function getWorkspaceBySlug(
  supabase: SupabaseClient<Database>,
  slug: string,
): Promise<WorkspaceRef | null> {
  const { data } = await supabase
    .from("workspaces")
    .select("id, slug, name, owner_id")
    .eq("slug", slug)
    .maybeSingle();

  if (!data) return null;

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    ownerId: data.owner_id,
  };
}
