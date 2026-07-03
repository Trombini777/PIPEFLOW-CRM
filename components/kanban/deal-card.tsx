"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "@/lib/utils";
import { dealStageStyles } from "@/components/kanban/deal-stage-style";
import {
  DealCardContent,
  dealCardBaseClassName,
} from "@/components/kanban/deal-card-content";
import type { Deal, Lead } from "@/lib/mock-data";

type DealCardProps = {
  deal: Deal;
  lead?: Lead;
  onClick: () => void;
};

export function DealCard({ deal, lead, onClick }: DealCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: deal.id,
      data: { stage: deal.stage },
    });

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...listeners}
      {...attributes}
      className={cn(
        dealCardBaseClassName,
        dealStageStyles[deal.stage].cardBorder,
        "cursor-grab outline-none hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 active:cursor-grabbing",
        isDragging && "opacity-40",
      )}
    >
      <DealCardContent deal={deal} lead={lead} />
    </div>
  );
}
