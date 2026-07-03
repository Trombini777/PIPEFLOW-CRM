"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormFieldError } from "@/components/auth/form-field-error";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";

export default function SignupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  async function onSubmit() {
    setIsSubmitting(true);
    // Sem backend ainda (M2 é só UI) — o cadastro é simulado e sempre segue
    // para o onboarding, onde o primeiro workspace é criado.
    await new Promise((resolve) => setTimeout(resolve, 900));
    router.push("/onboarding");
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Criar conta</CardTitle>
          <CardDescription>
            Comece a usar o PipeFlow gratuitamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nome completo</Label>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="name"
                    autoComplete="name"
                    placeholder="Seu nome"
                    aria-invalid={!!errors.name}
                    disabled={isSubmitting}
                  />
                )}
              />
              <FormFieldError message={errors.name?.message} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="voce@empresa.com"
                    aria-invalid={!!errors.email}
                    disabled={isSubmitting}
                  />
                )}
              />
              <FormFieldError message={errors.email?.message} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Senha</Label>
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    aria-invalid={!!errors.password}
                    disabled={isSubmitting}
                  />
                )}
              />
              <FormFieldError message={errors.password?.message} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    aria-invalid={!!errors.confirmPassword}
                    disabled={isSubmitting}
                  />
                )}
              />
              <FormFieldError message={errors.confirmPassword?.message} />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Controller
                  control={control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <Checkbox
                      id="acceptTerms"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                      aria-invalid={!!errors.acceptTerms}
                    />
                  )}
                />
                <Label htmlFor="acceptTerms" className="font-normal">
                  Aceito os termos de uso e a política de privacidade.
                </Label>
              </div>
              <FormFieldError message={errors.acceptTerms?.message} />
            </div>

            <Button type="submit" className="mt-2 w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {isSubmitting ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        Já tem uma conta?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
