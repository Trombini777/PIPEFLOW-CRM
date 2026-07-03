import { CalendarClock } from "lucide-react";

import { cn, formatCurrency, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { closedDealStages, type Deal, type Lead } from "@/lib/mock-data";

export const dealCardBaseClassName =
  "flex w-full flex-col gap-2 rounded-lg border-l-4 bg-card p-3 text-left text-sm shadow-sm ring-1 ring-foreground/10 transition-all";

type DueUrgency = "overdue" | "soon" | "normal" | "closed";

function getDueUrgency(deal: Deal): DueUrgency {
  if (closedDealStages.includes(deal.stage)) return "closed";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${deal.dueDate}T00:00:00`);
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86_400_000);

  if (diffDays < 0) return "overdue";
  if (diffDays <= 3) return "soon";
  return "normal";
}

const dueDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
});

const urgencyStyles: Record<DueUrgency, string> = {
  overdue: "bg-destructive/10 text-destructive",
  soon: "bg-warning/15 text-warning",
  normal: "bg-muted text-muted-foreground",
  closed: "bg-muted text-muted-foreground",
};

type DealCardContentProps = {
  deal: Deal;
  lead?: Lead;
};

export function DealCardContent({ deal, lead }: DealCardContentProps) {
  const urgency = getDueUrgency(deal);
  const isClosed = closedDealStages.includes(deal.stage);

  return (
    <>
      <p className="leading-snug font-medium text-foreground">{deal.title}</p>
      {lead && (
        <p className="truncate text-xs text-muted-foreground">{lead.company}</p>
      )}
      <p className="font-mono text-sm font-semibold tabular-nums text-foreground">
        {formatCurrency(deal.value)}
      </p>
      <div className="mt-1 flex items-center justify-between">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            urgencyStyles[urgency],
          )}
        >
          <CalendarClock className="size-3" />
          {isClosed
            ? "Fechado"
            : dueDateFormatter.format(new Date(`${deal.dueDate}T00:00:00`))}
        </span>
        <Avatar size="sm">
          <AvatarFallback>{getInitials(deal.owner)}</AvatarFallback>
        </Avatar>
      </div>
    </>
  );
}
