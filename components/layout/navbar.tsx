"use client";

import { usePathname } from "next/navigation";

import { navItems } from "@/components/layout/nav-items";
import { MobileNav } from "@/components/layout/mobile-nav";
import { UserMenu } from "@/components/layout/user-menu";
import type { WorkspaceSummary } from "@/components/layout/workspace-switcher";

type NavbarProps = {
  workspace: string;
  workspaces: WorkspaceSummary[];
  user: {
    name: string;
    email: string;
  };
};

export function Navbar({ workspace, workspaces, user }: NavbarProps) {
  const pathname = usePathname();
  const activeItem = navItems.find((item) =>
    pathname?.startsWith(`/${workspace}/${item.segment}`),
  );

  return (
    <header
      data-slot="navbar"
      className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4"
    >
      <MobileNav workspace={workspace} workspaces={workspaces} />
      <h1 className="text-sm font-semibold text-foreground">
        {activeItem?.title ?? "PipeFlow"}
      </h1>
      <div className="ml-auto flex items-center gap-3">
        <UserMenu user={user} />
      </div>
    </header>
  );
}
