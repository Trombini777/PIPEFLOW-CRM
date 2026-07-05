import { notFound, redirect } from "next/navigation";

import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { createClient } from "@/lib/supabase/server";
import type { WorkspaceSummary } from "@/components/layout/workspace-switcher";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspace: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // RLS (workspaces_select_members) já limita o retorno aos workspaces dos
  // quais o usuário é membro — não há necessidade de filtro extra aqui.
  const { data: workspaceRows } = await supabase
    .from("workspaces")
    .select("id, name, slug")
    .order("created_at", { ascending: true });

  const workspaces = workspaceRows ?? [];
  const activeWorkspace = workspaces.find(
    (item) => item.slug === params.workspace,
  );

  // Slug inexistente ou de um workspace do qual o usuário não é membro:
  // 404 em vez de vazar se o workspace existe.
  if (!activeWorkspace) {
    notFound();
  }

  const workspaceIds = workspaces.map((item) => item.id);
  const { data: subscriptionRows } = workspaceIds.length
    ? await supabase
        .from("subscriptions")
        .select("workspace_id, plan")
        .in("workspace_id", workspaceIds)
    : { data: [] };

  const workspacesWithPlan: WorkspaceSummary[] = workspaces.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    plan:
      subscriptionRows?.find((sub) => sub.workspace_id === item.id)?.plan ??
      "free",
  }));

  const currentUser = {
    name:
      (user.user_metadata?.name as string | undefined) ??
      user.email ??
      "Usuário",
    email: user.email ?? "",
  };

  return (
    <div className="flex min-h-svh bg-background text-foreground">
      <Sidebar workspace={params.workspace} workspaces={workspacesWithPlan} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          workspace={params.workspace}
          workspaces={workspacesWithPlan}
          user={currentUser}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
