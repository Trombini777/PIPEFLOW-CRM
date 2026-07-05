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
import { dealSchema, type DealInput } from "@/lib/validations/deal";
import {
  dealStageOptions,
  type Deal,
  type DealStage,
  type Lead,
  type WorkspaceMember,
} from "@/lib/domain";

function emptyValues(defaultStage: DealStage, members: WorkspaceMember[]): DealInput {
  return {
    title: "",
    leadId: "",
    value: 0,
    stage: defaultStage,
    ownerId: members[0]?.userId ?? "",
    dueDate: new Date().toISOString().slice(0, 10),
  };
}

type DealFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal?: Deal;
  defaultStage: DealStage;
  leads: Lead[];
  members: WorkspaceMember[];
  onSubmit: (values: DealInput) => Promise<{ error: string | null }>;
};

export function DealFormDialog({
  open,
  onOpenChange,
  deal,
  defaultStage,
  leads,
  members,
  onSubmit,
}: DealFormDialogProps) {
  const isEditing = !!deal;
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DealInput>({
    resolver: zodResolver(dealSchema),
    defaultValues: emptyValues(defaultStage, members),
  });

  useEffect(() => {
    if (open) {
      setServerError(null);
      reset(
        deal
          ? {
              title: deal.title,
              leadId: deal.leadId,
              value: deal.value,
              stage: deal.stage,
              ownerId: deal.ownerId ?? "",
              dueDate: deal.dueDate,
            }
          : emptyValues(defaultStage, members),
      );
    }
  }, [open, deal, defaultStage, members, reset]);

  async function handleFormSubmit(values: DealInput) {
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
          <DialogTitle>{isEditing ? "Editar negócio" : "Novo negócio"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações do negócio."
              : "Cadastre um novo negócio no pipeline."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="deal-title">Título</Label>
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <Input
                  {...field}
                  id="deal-title"
                  placeholder="Ex: Fornecimento de materiais"
                  aria-invalid={!!errors.title}
                  disabled={isSubmitting}
                />
              )}
            />
            <FormFieldError message={errors.title?.message} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="deal-lead">Lead vinculado</Label>
            <Controller
              control={control}
              name="leadId"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="deal-lead" className="w-full">
                    <SelectValue placeholder="Selecione um lead">
                      {(value: string) => {
                        const lead = leads.find((item) => item.id === value);
                        return lead ? `${lead.name} — ${lead.company}` : "Selecione um lead";
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {leads.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id}>
                        {lead.name} — {lead.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FormFieldError message={errors.leadId?.message} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="deal-value">Valor (R$)</Label>
              <Controller
                control={control}
                name="value"
                render={({ field }) => (
                  <Input
                    id="deal-value"
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    value={field.value}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value === "" ? 0 : Number(event.target.value),
                      )
                    }
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    aria-invalid={!!errors.value}
                    disabled={isSubmitting}
                  />
                )}
              />
              <FormFieldError message={errors.value?.message} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="deal-due-date">Prazo</Label>
              <Controller
                control={control}
                name="dueDate"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="deal-due-date"
                    type="date"
                    aria-invalid={!!errors.dueDate}
                    disabled={isSubmitting}
                  />
                )}
              />
              <FormFieldError message={errors.dueDate?.message} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="deal-owner">Responsável</Label>
              <Controller
                control={control}
                name="ownerId"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="deal-owner" className="w-full">
                      <SelectValue placeholder="Selecione um responsável">
                        {(value: string) =>
                          members.find((member) => member.userId === value)?.name
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member.userId} value={member.userId}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FormFieldError message={errors.ownerId?.message} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="deal-stage">Etapa</Label>
              <Controller
                control={control}
                name="stage"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="deal-stage" className="w-full">
                      <SelectValue>
                        {(value: DealStage) =>
                          dealStageOptions.find((option) => option.value === value)
                            ?.label
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {dealStageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FormFieldError message={errors.stage?.message} />
            </div>
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
              {isSubmitting
                ? "Salvando..."
                : isEditing
                  ? "Salvar alterações"
                  : "Criar negócio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
