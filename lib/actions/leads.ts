"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getWorkspaceBySlug } from "@/lib/workspace";
import { leadSchema, type LeadInput } from "@/lib/validations/lead";

export type LeadActionResult = { error: string | null };

export async function createLead(
  workspaceSlug: string,
  input: LeadInput,
): Promise<LeadActionResult> {
  const parsed = leadSchema.safeParse(input);
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

  const { error } = await supabase.from("leads").insert({
    workspace_id: workspace.id,
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    company: parsed.data.company,
    role: parsed.data.role,
    status: parsed.data.status,
    owner_id: user.id,
  });

  if (error) return { error: "Não foi possível criar o lead. Tente novamente." };

  revalidatePath(`/${workspaceSlug}/leads`);
  revalidatePath(`/${workspaceSlug}/dashboard`);
  return { error: null };
}

export async function updateLead(
  workspaceSlug: string,
  leadId: string,
  input: LeadInput,
): Promise<LeadActionResult> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Dados inválidos. Confira os campos e tente novamente." };
  }

  const supabase = await createClient();
  const workspace = await getWorkspaceBySlug(supabase, workspaceSlug);
  if (!workspace) return { error: "Workspace não encontrado." };

  const { error } = await supabase
    .from("leads")
    .update({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company,
      role: parsed.data.role,
      status: parsed.data.status,
    })
    .eq("id", leadId)
    .eq("workspace_id", workspace.id);

  if (error) return { error: "Não foi possível salvar as alterações." };

  revalidatePath(`/${workspaceSlug}/leads`);
  revalidatePath(`/${workspaceSlug}/leads/${leadId}`);
  revalidatePath(`/${workspaceSlug}/dashboard`);
  return { error: null };
}

export async function deleteLead(
  workspaceSlug: string,
  leadId: string,
): Promise<LeadActionResult> {
  const supabase = await createClient();
  const workspace = await getWorkspaceBySlug(supabase, workspaceSlug);
  if (!workspace) return { error: "Workspace não encontrado." };

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", leadId)
    .eq("workspace_id", workspace.id);

  if (error) return { error: "Não foi possível excluir o lead." };

  revalidatePath(`/${workspaceSlug}/leads`);
  revalidatePath(`/${workspaceSlug}/dashboard`);
  return { error: null };
}
