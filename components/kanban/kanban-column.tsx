"use client";

import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";

import { cn, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { dealStageStyles } from "@/components/kanban/deal-stage-style";
import { DealCard } from "@/components/kanban/deal-card";
import type { Deal, DealStage, Lead } from "@/lib/mock-data";

type KanbanColumnProps = {
  stage: DealStage;
  label: string;
  deals: Deal[];
  leadById: Map<string, Lead>;
  onCardClick: (deal: Deal) => void;
  onAddDeal: (stage: DealStage) => void;
};

export function KanbanColumn({
  stage,
  label,
  deals,
  leadById,
  onCardClick,
  onAddDeal,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  const total = deals.reduce((sum, deal) => sum + deal.value, 0);

  return (
    <div
      data-slot="kanban-column"
      data-stage={stage}
      className="flex w-72 shrink-0 flex-col overflow-hidden rounded-xl bg-muted/40"
    >
      <div className={cn("h-1", dealStageStyles[stage].rail)} />

      <div className="flex items-center justify-between gap-2 px-3 py-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span
              className={cn("size-1.5 shrink-0 rounded-full", dealStageStyles[stage].dot)}
            />
            <h2 className="truncate text-sm font-semibold text-foreground">
              {label}
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            {deals.length} {deals.length === 1 ? "negócio" : "negócios"} ·{" "}
            <span className="font-mono tabular-nums">{formatCurrency(total)}</span>
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onAddDeal(stage)}
          aria-label={`Novo negócio em ${label}`}
        >
          <Plus className="size-4" />
        </Button>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-24 flex-1 flex-col gap-2 px-3 pb-3 transition-colors",
          isOver && "bg-primary/5",
        )}
      >
        {deals.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            lead={leadById.get(deal.leadId)}
            onClick={() => onCardClick(deal)}
          />
        ))}
        {deals.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
            Arraste um negócio para cá
          </div>
        )}
      </div>
    </div>
  );
}
