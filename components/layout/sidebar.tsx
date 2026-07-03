import Link from "next/link";

import { SidebarNav } from "@/components/layout/sidebar-nav";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";

type SidebarProps = {
  workspace: string;
};

export function Sidebar({ workspace }: SidebarProps) {
  return (
    <aside
      data-slot="sidebar"
      className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground lg:flex"
    >
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <Link
          href={`/${workspace}/dashboard`}
          className="flex items-center gap-2 font-semibold text-sidebar-foreground"
        >
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            P
          </span>
          PipeFlow
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <SidebarNav workspace={workspace} />
      </div>

      <div className="border-t border-sidebar-border p-3">
        <WorkspaceSwitcher workspace={workspace} />
      </div>
    </aside>
  );
}
