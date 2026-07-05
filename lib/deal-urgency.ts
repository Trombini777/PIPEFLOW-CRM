import { closedDealStages, type Deal } from "@/lib/domain";

export type DueUrgency = "overdue" | "soon" | "normal" | "closed";

export function getDueUrgency(deal: Deal): DueUrgency {
  if (closedDealStages.includes(deal.stage)) return "closed";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${deal.dueDate}T00:00:00`);
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86_400_000);

  if (diffDays < 0) return "overdue";
  if (diffDays <= 3) return "soon";
  return "normal";
}

export const dueDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
});

export const dueUrgencyBadgeClassName: Record<DueUrgency, string> = {
  overdue: "bg-destructive/10 text-destructive",
  soon: "bg-warning/15 text-warning",
  normal: "bg-muted text-muted-foreground",
  closed: "bg-muted text-muted-foreground",
};
