import Link from "next/link";
import { FileQuestion } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-6 text-foreground">
      <EmptyState
        icon={FileQuestion}
        title="Página não encontrada"
        description="A página que você está procurando não existe ou foi movida."
        action={<Button render={<Link href="/" />}>Voltar ao início</Button>}
      />
    </div>
  );
}
