"use client";

import { useRouter } from "next/navigation";
import { Building2, ChevronsUpDown, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { mockWorkspaces } from "@/lib/mock-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type WorkspaceSwitcherProps = {
  workspace: string;
  onNavigate?: () => void;
};

export function WorkspaceSwitcher({
  workspace,
  onNavigate,
}: WorkspaceSwitcherProps) {
  const router = useRouter();
  const activeWorkspace =
    mockWorkspaces.find((item) => item.slug === workspace) ??
    mockWorkspaces[0];

  function handleSelect(slug: string) {
    router.push(`/${slug}/dashboard`);
    onNavigate?.();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex w-full items-center gap-2.5 rounded-lg border border-border bg-background px-3 py-2 text-left text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:bg-accent"
        data-slot="workspace-switcher-trigger"
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Building2 className="size-4" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-medium text-foreground">
            {activeWorkspace.name}
          </span>
          <span className="truncate text-xs text-muted-foreground capitalize">
            Plano {activeWorkspace.plan === "pro" ? "Pro" : "Free"}
          </span>
        </span>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {mockWorkspaces.map((item) => (
            <DropdownMenuItem
              key={item.id}
              onClick={() => handleSelect(item.slug)}
              className="justify-between"
            >
              <span className="flex flex-col">
                <span>{item.name}</span>
                <span className="text-xs text-muted-foreground capitalize">
                  Plano {item.plan === "pro" ? "Pro" : "Free"}
                </span>
              </span>
              <Check
                className={cn(
                  "size-4",
                  item.slug === activeWorkspace.slug
                    ? "opacity-100"
                    : "opacity-0",
                )}
              />
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
