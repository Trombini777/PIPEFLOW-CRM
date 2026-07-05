"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  activitySchema,
  type ActivityInput,
} from "@/lib/validations/activity";
import { activityTypeLabels, type ActivityType } from "@/lib/domain";

const emptyValues: ActivityInput = {
  type: "nota",
  description: "",
};

type ActivityFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ActivityInput) => Promise<{ error: string | null }>;
};

export function ActivityFormDialog({
  open,
  onOpenChange,
  onSubmit,
}: ActivityFormDialogProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ActivityInput>({
    resolver: zodResolver(activitySchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (open) {
      setServerError(null);
      reset(emptyValues);
    }
  }, [open, reset]);

  async function handleFormSubmit(values: ActivityInput) {
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
          <DialogTitle>Registrar atividade</DialogTitle>
          <DialogDescription>
            Adicione uma ligação, e-mail, reunião ou nota à timeline deste
            lead.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="activity-type">Tipo</Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="activity-type" className="w-full">
                    <SelectValue>
                      {(value: ActivityType) => activityTypeLabels[value]}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(activityTypeLabels).map(
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
            <FormFieldError message={errors.type?.message} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="activity-description">Descrição</Label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="activity-description"
                  placeholder="Descreva o que aconteceu..."
                  aria-invalid={!!errors.description}
                  disabled={isSubmitting}
                  rows={4}
                />
              )}
            />
            <FormFieldError message={errors.description?.message} />
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
              {isSubmitting ? "Salvando..." : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
