"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormFieldError } from "@/components/auth/form-field-error";
import type { Collaborator } from "@/lib/domain";

type RemoveMemberDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collaborator?: Collaborator;
  onConfirm: () => Promise<{ error: string | null }>;
};

export function RemoveMemberDialog({
  open,
  onOpenChange,
  collaborator,
  onConfirm,
}: RemoveMemberDialogProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setIsRemoving(true);
    setError(null);

    const result = await onConfirm();

    setIsRemoving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setError(null);
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Remover colaborador</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover{" "}
            <span className="font-medium text-foreground">
              {collaborator?.name}
            </span>{" "}
            deste workspace? A pessoa perde acesso imediatamente.
          </DialogDescription>
        </DialogHeader>
        <FormFieldError message={error ?? undefined} />
        <DialogFooter className="-mx-0 -mb-0 mt-2 rounded-none border-t-0 bg-transparent p-0 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isRemoving}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isRemoving}
          >
            {isRemoving && <Loader2 className="size-4 animate-spin" />}
            {isRemoving ? "Removendo..." : "Remover"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
