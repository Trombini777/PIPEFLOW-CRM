import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AcceptInviteCard } from "@/components/invite/accept-invite-card";
import { createClient } from "@/lib/supabase/server";
import { getInvitePreview } from "@/lib/queries/collaborators";
import { workspaceMemberRoleLabels } from "@/lib/domain";

export default async function InvitePage({
  params,
}: {
  params: { token: string };
}) {
  const supabase = await createClient();
  const preview = await getInvitePreview(supabase, params.token);

  if (!preview) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Convite não encontrado</CardTitle>
          <CardDescription>
            Este link de convite é inválido ou não existe mais.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (preview.status === "revoked") {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Convite revogado</CardTitle>
          <CardDescription>
            Este convite foi revogado pelo administrador do workspace.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (preview.status === "accepted") {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Convite já utilizado</CardTitle>
          <CardDescription>
            Este convite já foi aceito. Faça login para acessar o workspace{" "}
            {preview.workspaceName}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button render={<Link href="/login" />}>Ir para o login</Button>
        </CardContent>
      </Card>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const redirectPath = `/invite/${params.token}`;
  const loginHref = `/login?redirectTo=${encodeURIComponent(redirectPath)}&email=${encodeURIComponent(preview.email)}`;
  const signupHref = `/signup?redirectTo=${encodeURIComponent(redirectPath)}&email=${encodeURIComponent(preview.email)}`;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Convite para {preview.workspaceName}</CardTitle>
        <CardDescription>
          Você foi convidado para participar como{" "}
          {workspaceMemberRoleLabels[preview.role]}.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {!user ? (
          <>
            <p className="text-sm text-muted-foreground">
              Entre ou crie uma conta com o e-mail{" "}
              <strong className="text-foreground">{preview.email}</strong>{" "}
              para aceitar.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button render={<Link href={loginHref} />} className="flex-1">
                Entrar
              </Button>
              <Button
                variant="outline"
                render={<Link href={signupHref} />}
                className="flex-1"
              >
                Criar conta
              </Button>
            </div>
          </>
        ) : user.email?.toLowerCase() !== preview.email.toLowerCase() ? (
          <p className="text-sm text-destructive">
            Este convite foi enviado para {preview.email}, mas você está
            logado como {user.email}. Saia e entre com a conta correta.
          </p>
        ) : (
          <AcceptInviteCard token={params.token} />
        )}
      </CardContent>
    </Card>
  );
}
