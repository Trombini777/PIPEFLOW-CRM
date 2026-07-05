"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getWorkspaceBySlug } from "@/lib/workspace";
import { activitySchema, type ActivityInput } from "@/lib/validations/activity";

export type ActivityActionResult = { error: string | null };

export async function createActivity(
  workspaceSlug: string,
  leadId: string,
  input: ActivityInput,
): Promise<ActivityActionResult> {
  const parsed = activitySchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Dados inválidos. Confira os campos e tente novamente." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão expirada. Faça login novamente." };

  const workspace = await getWorkspaceBySlug(supabase, workspaceSlug);
  if (!workspace) return { error: "Workspace não encontrado." };

  const { error } = await supabase.from("activities").insert({
    workspace_id: workspace.id,
    lead_id: leadId,
    type: parsed.data.type,
    description: parsed.data.description,
    author_id: user.id,
  });

  if (error) return { error: "Não foi possível registrar a atividade." };

  revalidatePath(`/${workspaceSlug}/leads/${leadId}`);
  return { error: null };
}
