"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { dealStageStyles } from "@/components/kanban/deal-stage-style";
import {
  DealCardContent,
  dealCardBaseClassName,
} from "@/components/kanban/deal-card-content";
import { KanbanColumn } from "@/components/kanban/kanban-column";
import { DealFormDialog } from "@/components/kanban/deal-form-dialog";
import {
  dealStageOptions,
  type Deal,
  type DealStage,
  type Lead,
  type WorkspaceMember,
} from "@/lib/domain";
import { createDeal, updateDeal, updateDealStage } from "@/lib/actions/deals";
import type { DealInput } from "@/lib/validations/deal";

type KanbanBoardProps = {
  workspace: string;
  initialDeals: Deal[];
  leads: Lead[];
  members: WorkspaceMember[];
};

export function KanbanBoard({
  workspace,
  initialDeals,
  leads,
  members,
}: KanbanBoardProps) {
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Re-sincroniza com os dados do servidor após router.refresh() (ex.: uma
  // criação/edição bem-sucedida), sem perder a atualização otimista do
  // drag-and-drop, que já resolveu antes desse efeito rodar de novo.
  useEffect(() => {
    setDeals(initialDeals);
  }, [initialDeals]);

  const [formOpen, setFormOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | undefined>();
  const [defaultStage, setDefaultStage] = useState<DealStage>(
    dealStageOptions[0].value,
  );

  const leadById = useMemo(
    () => new Map(leads.map((lead) => [lead.id, lead])),
    [leads],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const activeDeal = activeId ? deals.find((deal) => deal.id === activeId) : undefined;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const dealId = String(active.id);
    const targetStage = over.id as DealStage;
    const previousDeal = deals.find((deal) => deal.id === dealId);
    if (!previousDeal || previousDeal.stage === targetStage) return;

    setDeals((current) =>
      current.map((deal) =>
        deal.id === dealId ? { ...deal, stage: targetStage } : deal,
      ),
    );

    const result = await updateDealStage(workspace, dealId, targetStage);

    if (result.error) {
      setDeals((current) =>
        current.map((deal) => (deal.id === dealId ? previousDeal : deal)),
      );
    }
  }

  function handleAddDeal(stage: DealStage) {
    setEditingDeal(undefined);
    setDefaultStage(stage);
    setFormOpen(true);
  }

  function handleCardClick(deal: Deal) {
    setEditingDeal(deal);
    setDefaultStage(deal.stage);
    setFormOpen(true);
  }

  async function handleFormSubmit(values: DealInput) {
    const result = editingDeal
      ? await updateDeal(workspace, editingDeal.id, values)
      : await createDeal(workspace, values);

    if (!result.error) {
      router.refresh();
    }

    return result;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => handleAddDeal(dealStageOptions[0].value)}>
          Novo negócio
        </Button>
      </div>

      <DndContext
        id="pipeline-board"
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {dealStageOptions.map((option) => (
            <KanbanColumn
              key={option.value}
              stage={option.value}
              label={option.label}
              deals={deals.filter((deal) => deal.stage === option.value)}
              leadById={leadById}
              onCardClick={handleCardClick}
              onAddDeal={handleAddDeal}
            />
          ))}
        </div>

        <DragOverlay>
          {activeDeal ? (
            <div
              className={cn(
                dealCardBaseClassName,
                dealStageStyles[activeDeal.stage].cardBorder,
                "rotate-2 shadow-xl",
              )}
            >
              <DealCardContent
                deal={activeDeal}
                lead={leadById.get(activeDeal.leadId)}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <DealFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        deal={editingDeal}
        defaultStage={defaultStage}
        leads={leads}
        members={members}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
