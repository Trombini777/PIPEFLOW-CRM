"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormFieldError } from "@/components/auth/form-field-error";
import { acceptInvite } from "@/lib/actions/invites";

type AcceptInviteCardProps = {
  token: string;
};

export function AcceptInviteCard({ token }: AcceptInviteCardProps) {
  const router = useRouter();
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAccept() {
    setIsAccepting(true);
    setError(null);

    const result = await acceptInvite(token);

    if (result.error) {
      setError(result.error);
      setIsAccepting(false);
      return;
    }

    router.push(
      result.workspaceSlug ? `/${result.workspaceSlug}/dashboard` : "/",
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Button onClick={handleAccept} disabled={isAccepting}>
        {isAccepting && <Loader2 className="size-4 animate-spin" />}
        {isAccepting ? "Aceitando..." : "Aceitar convite"}
      </Button>
      <FormFieldError message={error ?? undefined} />
    </div>
  );
}
