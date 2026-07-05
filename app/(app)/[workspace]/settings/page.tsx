import { notFound, redirect } from "next/navigation";

import { PageHeader } from "@/components/ui/page-header";
import { CollaboratorsCard } from "@/components/settings/collaborators-card";
import { createClient } from "@/lib/supabase/server";
import { getWorkspaceBySlug } from "@/lib/workspace";
import { listCollaborators, listWorkspaceInvites } from "@/lib/queries/collaborators";

export default async function SettingsPage({
  params,
}: {
  params: { workspace: string };
}) {
  const supabase = await createClient();
  const workspace = await getWorkspaceBySlug(supabase, params.workspace);

  if (!workspace) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [collaborators, invites] = await Promise.all([
    listCollaborators(supabase, workspace.id, workspace.ownerId, user.id),
    listWorkspaceInvites(supabase, workspace.id),
  ]);

  const isAdmin =
    collaborators.find((collaborator) => collaborator.userId === user.id)
      ?.role === "admin";

  return (
    <>
      <PageHeader
        title="Configurações"
        description="Colaboradores, papéis e plano do seu workspace."
      />
      <CollaboratorsCard
        workspace={params.workspace}
        collaborators={collaborators}
        invites={invites}
        isAdmin={isAdmin}
      />
    </>
  );
}
