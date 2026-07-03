import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspace: string };
}) {
  return (
    <div className="flex min-h-svh bg-background text-foreground">
      <Sidebar workspace={params.workspace} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar workspace={params.workspace} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
