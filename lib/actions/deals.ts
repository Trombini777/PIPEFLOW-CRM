"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getWorkspaceBySlug } from "@/lib/workspace";
import { dealSchema, type DealInput } from "@/lib/validations/deal";
import type { DealStage } from "@/lib/domain";

export type DealActionResult = { error: string | null };

export async function createDeal(
  workspaceSlug: string,
  input: DealInput,
): Promise<DealActionResult> {
  const parsed = dealSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Dados inválidos. Confira os campos e tente novamente." };
  }

  const supabase = await createClient();
  const workspace = await getWorkspaceBySlug(supabase, workspaceSlug);
  if (!workspace) return { error: "Workspace não encontrado." };

  const { error } = await supabase.from("deals").insert({
    workspace_id: workspace.id,
    title: parsed.data.title,
    lead_id: parsed.data.leadId,
    value: parsed.data.value,
    stage: parsed.data.stage,
    owner_id: parsed.data.ownerId,
    due_date: parsed.data.dueDate,
  });

  if (error) return { error: "Não foi possível criar o negócio." };

  revalidatePath(`/${workspaceSlug}/pipeline`);
  revalidatePath(`/${workspaceSlug}/dashboard`);
  return { error: null };
}

export async function updateDeal(
  workspaceSlug: string,
  dealId: string,
  input: DealInput,
): Promise<DealActionResult> {
  const parsed = dealSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Dados inválidos. Confira os campos e tente novamente." };
  }

  const supabase = await createClient();
  const workspace = await getWorkspaceBySlug(supabase, workspaceSlug);
  if (!workspace) return { error: "Workspace não encontrado." };

  const { error } = await supabase
    .from("deals")
    .update({
      title: parsed.data.title,
      lead_id: parsed.data.leadId,
      value: parsed.data.value,
      stage: parsed.data.stage,
      owner_id: parsed.data.ownerId,
      due_date: parsed.data.dueDate,
    })
    .eq("id", dealId)
    .eq("workspace_id", workspace.id);

  if (error) return { error: "Não foi possível salvar as alterações." };

  revalidatePath(`/${workspaceSlug}/pipeline`);
  revalidatePath(`/${workspaceSlug}/dashboard`);
  return { error: null };
}

// Usado pelo drag-and-drop do Kanban — o client já aplica a mudança de
// forma otimista, então aqui só persiste e revalida em caso de sucesso.
export async function updateDealStage(
  workspaceSlug: string,
  dealId: string,
  stage: DealStage,
): Promise<DealActionResult> {
  const supabase = await createClient();
  const workspace = await getWorkspaceBySlug(supabase, workspaceSlug);
  if (!workspace) return { error: "Workspace não encontrado." };

  const { error } = await supabase
    .from("deals")
    .update({ stage })
    .eq("id", dealId)
    .eq("workspace_id", workspace.id);

  if (error) return { error: "Não foi possível mover o negócio." };

  revalidatePath(`/${workspaceSlug}/pipeline`);
  revalidatePath(`/${workspaceSlug}/dashboard`);
  return { error: null };
}
