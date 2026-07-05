"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getWorkspaceBySlug } from "@/lib/workspace";
import { inviteSchema, type InviteInput } from "@/lib/validations/invite";
import { sendInviteEmail } from "@/lib/resend/send-invite-email";

export type InviteActionResult = { error: string | null };

const UNIQUE_VIOLATION = "23505";

export async function inviteCollaborator(
  workspaceSlug: string,
  input: InviteInput,
): Promise<InviteActionResult> {
  const parsed = inviteSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Dados inválidos. Confira o e-mail e o papel selecionado." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão expirada. Faça login novamente." };

  const workspace = await getWorkspaceBySlug(supabase, workspaceSlug);
  if (!workspace) return { error: "Workspace não encontrado." };

  const { data: invite, error } = await supabase
    .from("workspace_invites")
    .insert({
      workspace_id: workspace.id,
      email: parsed.data.email,
      role: parsed.data.role,
      invited_by: user.id,
    })
    .select("token")
    .single();

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      return { error: "Já existe um convite pendente para este e-mail." };
    }
    return {
      error: "Não foi possível criar o convite. Apenas admins podem convidar.",
    };
  }

  const inviterName =
    (user.user_metadata?.name as string | undefined) ?? user.email ?? "Alguém";
  const acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invite.token}`;

  const { error: emailError } = await sendInviteEmail({
    to: parsed.data.email,
    workspaceName: workspace.name,
    inviterName,
    role: parsed.data.role,
    acceptUrl,
  });

  if (emailError) {
    return { error: "Convite criado, mas o e-mail não pôde ser enviado." };
  }

  revalidatePath(`/${workspaceSlug}/settings`);
  return { error: null };
}

export async function revokeInvite(
  workspaceSlug: string,
  inviteId: string,
): Promise<InviteActionResult> {
  const supabase = await createClient();
  const workspace = await getWorkspaceBySlug(supabase, workspaceSlug);
  if (!workspace) return { error: "Workspace não encontrado." };

  const { error } = await supabase
    .from("workspace_invites")
    .update({ status: "revoked" })
    .eq("id", inviteId)
    .eq("workspace_id", workspace.id);

  if (error) return { error: "Não foi possível revogar o convite." };

  revalidatePath(`/${workspaceSlug}/settings`);
  return { error: null };
}

export async function removeMember(
  workspaceSlug: string,
  userId: string,
): Promise<InviteActionResult> {
  const supabase = await createClient();
  const workspace = await getWorkspaceBySlug(supabase, workspaceSlug);
  if (!workspace) return { error: "Workspace não encontrado." };

  if (userId === workspace.ownerId) {
    return { error: "Não é possível remover o proprietário do workspace." };
  }

  const { error } = await supabase
    .from("workspace_members")
    .delete()
    .eq("workspace_id", workspace.id)
    .eq("user_id", userId);

  if (error) return { error: "Não foi possível remover o colaborador." };

  revalidatePath(`/${workspaceSlug}/settings`);
  return { error: null };
}

export type AcceptInviteResult = { error: string | null; workspaceSlug?: string };

const ACCEPT_INVITE_ERROR_MESSAGES: Record<string, string> = {
  not_authenticated: "Faça login para aceitar o convite.",
  invite_not_found: "Convite não encontrado.",
  invite_not_pending: "Este convite já foi utilizado ou revogado.",
  invite_expired: "Este convite expirou.",
  invite_email_mismatch:
    "Este convite foi enviado para outro e-mail. Saia e entre com a conta correta.",
};

export async function acceptInvite(token: string): Promise<AcceptInviteResult> {
  const supabase = await createClient();

  const { data: workspaceId, error } = await supabase.rpc(
    "accept_workspace_invite",
    { _token: token },
  );

  if (error) {
    return {
      error:
        ACCEPT_INVITE_ERROR_MESSAGES[error.message] ??
        "Não foi possível aceitar o convite.",
    };
  }

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("slug")
    .eq("id", workspaceId)
    .maybeSingle();

  if (workspace) {
    revalidatePath(`/${workspace.slug}/settings`);
  }

  return { error: null, workspaceSlug: workspace?.slug };
}
