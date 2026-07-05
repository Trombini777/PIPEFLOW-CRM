"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import {
  onboardingSchema,
  type OnboardingInput,
} from "@/lib/validations/auth";
import { slugify } from "@/lib/utils";

export type CreateWorkspaceResult = { error: string };

const UNIQUE_VIOLATION = "23505";
const MAX_SLUG_ATTEMPTS = 5;

export async function createWorkspace(
  input: OnboardingInput,
): Promise<CreateWorkspaceResult> {
  const parsed = onboardingSchema.safeParse(input);

  if (!parsed.success) {
    return { error: "Informe um nome de empresa ou time válido." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const baseSlug = slugify(parsed.data.workspaceName) || "workspace";
  let slug = baseSlug;

  for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt++) {
    const { error } = await supabase.from("workspaces").insert({
      name: parsed.data.workspaceName,
      slug,
      owner_id: user.id,
    });

    if (!error) {
      redirect(`/${slug}/dashboard`);
    }

    if (error.code !== UNIQUE_VIOLATION) {
      return { error: "Não foi possível criar o workspace. Tente novamente." };
    }

    slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
  }

  return {
    error: "Não foi possível gerar um identificador único para o workspace.",
  };
}
