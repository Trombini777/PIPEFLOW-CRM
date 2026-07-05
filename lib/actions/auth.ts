"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  signupSchema,
  type LoginInput,
  type SignupInput,
} from "@/lib/validations/auth";

export type AuthActionResult = {
  error: string | null;
  needsEmailConfirmation?: boolean;
};

export async function signIn(
  input: LoginInput,
  redirectTo?: string,
): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return { error: "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "E-mail ou senha inválidos." };
  }

  // Sessão criada — se veio de um link com destino específico (ex.: aceitar
  // um convite), volta pra lá; senão o middleware decide (workspace
  // existente ou onboarding) a partir da raiz.
  redirect(redirectTo || "/");
}

export async function signUp(
  input: SignupInput,
  redirectTo?: string,
): Promise<AuthActionResult> {
  const parsed = signupSchema.safeParse(input);

  if (!parsed.success) {
    return { error: "Dados inválidos." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { name: parsed.data.name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback${
        redirectTo ? `?next=${encodeURIComponent(redirectTo)}` : ""
      }`,
    },
  });

  if (error) {
    return {
      error:
        error.code === "user_already_exists"
          ? "Já existe uma conta com este e-mail."
          : "Não foi possível criar sua conta. Tente novamente.",
    };
  }

  // Se o projeto Supabase exige confirmação de e-mail, nenhuma sessão volta
  // aqui — o usuário só é autenticado ao clicar no link (app/auth/callback),
  // que já recebe o redirectTo via "next".
  if (!data.session) {
    return { error: null, needsEmailConfirmation: true };
  }

  redirect(redirectTo || "/onboarding");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
