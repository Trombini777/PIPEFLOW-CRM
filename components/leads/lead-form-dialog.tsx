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
import { leadSchema, type LeadInput } from "@/lib/validations/lead";
import { leadStatusOptions, type Lead } from "@/lib/domain";

const emptyValues: LeadInput = {
  name: "",
  email: "",
  phone: "",
  company: "",
  role: "",
  status: "novo",
};

type LeadFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead;
  onSubmit: (values: LeadInput) => Promise<{ error: string | null }>;
};

export function LeadFormDialog({
  open,
  onOpenChange,
  lead,
  onSubmit,
}: LeadFormDialogProps) {
  const isEditing = !!lead;
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (open) {
      setServerError(null);
      reset(lead ? { ...lead } : emptyValues);
    }
  }, [open, lead, reset]);

  async function handleFormSubmit(values: LeadInput) {
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
          <DialogTitle>{isEditing ? "Editar lead" : "Novo lead"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações de contato e o status do lead."
              : "Cadastre um novo lead no seu workspace."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lead-name">Nome</Label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  id="lead-name"
                  placeholder="Nome completo"
                  aria-invalid={!!errors.name}
                  disabled={isSubmitting}
                />
              )}
            />
            <FormFieldError message={errors.name?.message} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lead-email">E-mail</Label>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="lead-email"
                    type="email"
                    placeholder="nome@empresa.com"
                    aria-invalid={!!errors.email}
                    disabled={isSubmitting}
                  />
                )}
              />
              <FormFieldError message={errors.email?.message} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lead-phone">Telefone</Label>
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="lead-phone"
                    placeholder="(11) 90000-0000"
                    aria-invalid={!!errors.phone}
                    disabled={isSubmitting}
                  />
                )}
              />
              <FormFieldError message={errors.phone?.message} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lead-company">Empresa</Label>
              <Controller
                control={control}
                name="company"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="lead-company"
                    placeholder="Nome da empresa"
                    aria-invalid={!!errors.company}
                    disabled={isSubmitting}
                  />
                )}
              />
              <FormFieldError message={errors.company?.message} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lead-role">Cargo</Label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="lead-role"
                    placeholder="Cargo na empresa"
                    aria-invalid={!!errors.role}
                    disabled={isSubmitting}
                  />
                )}
              />
              <FormFieldError message={errors.role?.message} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lead-status">Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="lead-status" className="w-full">
                    <SelectValue>
                      {(value: LeadInput["status"]) =>
                        leadStatusOptions.find(
                          (option) => option.value === value,
                        )?.label
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {leadStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FormFieldError message={errors.status?.message} />
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
                  : "Criar lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
