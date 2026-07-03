"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormFieldError } from "@/components/auth/form-field-error";
import {
  onboardingSchema,
  type OnboardingInput,
} from "@/lib/validations/auth";
import { slugify } from "@/lib/utils";

export default function OnboardingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { workspaceName: "" },
  });

  async function onSubmit(data: OnboardingInput) {
    setIsSubmitting(true);
    // Sem backend ainda (M2 é só UI) — a criação do workspace é simulada e
    // sempre redireciona para o dashboard do workspace recém-criado.
    await new Promise((resolve) => setTimeout(resolve, 900));
    const slug = slugify(data.workspaceName) || "meu-workspace";
    router.push(`/${slug}/dashboard`);
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Crie seu workspace</CardTitle>
          <CardDescription>
            Dê um nome à sua empresa ou time. Você poderá convidar
            colaboradores depois.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="workspaceName">Nome da empresa ou time</Label>
              <Controller
                control={control}
                name="workspaceName"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="workspaceName"
                    autoComplete="organization"
                    placeholder="Ex.: Acme Inc."
                    aria-invalid={!!errors.workspaceName}
                    disabled={isSubmitting}
                  />
                )}
              />
              <FormFieldError message={errors.workspaceName?.message} />
            </div>

            <Button type="submit" className="mt-2 w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {isSubmitting ? "Criando workspace..." : "Continuar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
