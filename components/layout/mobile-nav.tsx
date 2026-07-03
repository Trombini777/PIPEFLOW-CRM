"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";

type MobileNavProps = {
  workspace: string;
};

export function MobileNav({ workspace }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Abrir menu de navegação"
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b border-border">
          <SheetTitle
            render={
              <Link
                href={`/${workspace}/dashboard`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 font-semibold"
              />
            }
          >
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
              P
            </span>
            PipeFlow
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-3">
          <SidebarNav workspace={workspace} onNavigate={() => setOpen(false)} />
        </div>

        <div className="border-t border-border p-3">
          <WorkspaceSwitcher
            workspace={workspace}
            onNavigate={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
