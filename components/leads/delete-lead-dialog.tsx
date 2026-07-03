"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Lead } from "@/lib/mock-data";

type DeleteLeadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead;
  onConfirm: () => void;
};

export function DeleteLeadDialog({
  open,
  onOpenChange,
  lead,
  onConfirm,
}: DeleteLeadDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Excluir lead</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir{" "}
            <span className="font-medium text-foreground">{lead?.name}</span>?
            Essa ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="-mx-0 -mb-0 mt-2 rounded-none border-t-0 bg-transparent p-0 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
