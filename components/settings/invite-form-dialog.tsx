"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormFieldError } from "@/components/auth/form-field-error";
import { inviteSchema, type InviteInput } from "@/lib/validations/invite";
import { workspaceMemberRoleLabels, type WorkspaceMemberRole } from "@/lib/domain";

const emptyValues: InviteInput = {
  email: "",
  role: "member",
};

type InviteFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: InviteInput) => Promise<{ error: string | null }>;
};

export function InviteFormDialog({
  open,
  onOpenChange,
  onSubmit,
}: InviteFormDialogProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteInput>({
    resolver: zodResolver(inviteSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (open) {
      setServerError(null);
      reset(emptyValues);
    }
  }, [open, reset]);

  async function handleFormSubmit(values: InviteInput) {
    setServerError(null);
    const result = await onSubmit(values);

    if (result.error) {
      setServerError(result.error);
      return;
    }

    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Convidar colaborador</DialogTitle>
          <DialogDescription>
            Enviamos um e-mail com um link para participar deste workspace.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-email">E-mail</Label>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input
                  {...field}
                  id="invite-email"
                  type="email"
                  placeholder="colega@empresa.com"
                  aria-invalid={!!errors.email}
                  disabled={isSubmitting}
                />
              )}
            />
            <FormFieldError message={errors.email?.message} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-role">Papel</Label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="invite-role" className="w-full">
                    <SelectValue>
                      {(value: WorkspaceMemberRole) =>
                        workspaceMemberRoleLabels[value]
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(workspaceMemberRoleLabels).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            <FormFieldError message={errors.role?.message} />
          </div>

          <FormFieldError message={serverError ?? undefined} />

          <DialogFooter className="-mx-0 -mb-0 mt-2 rounded-none border-t-0 bg-transparent p-0 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {isSubmitting ? "Enviando..." : "Enviar convite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
