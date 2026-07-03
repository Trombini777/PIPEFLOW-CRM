import {
  KanbanSquare,
  LayoutDashboard,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  segment: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { title: "Dashboard", segment: "dashboard", icon: LayoutDashboard },
  { title: "Leads", segment: "leads", icon: Users },
  { title: "Pipeline", segment: "pipeline", icon: KanbanSquare },
  { title: "Configurações", segment: "settings", icon: Settings },
];
