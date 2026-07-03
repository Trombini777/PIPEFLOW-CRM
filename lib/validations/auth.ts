import { z } from "zod";

const emailSchema = z.email("Digite um e-mail válido.");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Informe sua senha."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z.string().min(2, "Informe seu nome completo."),
    email: emailSchema,
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres."),
    confirmPassword: z.string().min(1, "Confirme sua senha."),
    acceptTerms: z.boolean().refine((value) => value === true, {
      message: "Você precisa aceitar os termos de uso.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type SignupInput = z.infer<typeof signupSchema>;

export const onboardingSchema = z.object({
  workspaceName: z.string().min(2, "Informe o nome da empresa ou time."),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
