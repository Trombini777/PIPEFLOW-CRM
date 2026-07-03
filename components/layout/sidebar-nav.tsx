"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { navItems } from "@/components/layout/nav-items";

type SidebarNavProps = {
  workspace: string;
  onNavigate?: () => void;
  className?: string;
};

export function SidebarNav({
  workspace,
  onNavigate,
  className,
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-1", className)} data-slot="sidebar-nav">
      {navItems.map((item) => {
        const href = `/${workspace}/${item.segment}`;
        const isActive = pathname?.startsWith(href) ?? false;
        const Icon = item.icon;

        return (
          <Link
            key={item.segment}
            href={href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
              isActive && "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
