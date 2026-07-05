"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InviteFormDialog } from "@/components/settings/invite-form-dialog";
import { RemoveMemberDialog } from "@/components/settings/remove-member-dialog";
import {
  workspaceMemberRoleLabels,
  type Collaborator,
  type WorkspaceInvite,
} from "@/lib/domain";
import {
  inviteCollaborator,
  removeMember,
  revokeInvite,
} from "@/lib/actions/invites";
import type { InviteInput } from "@/lib/validations/invite";

const inviteStatusBadge: Record<
  WorkspaceInvite["status"],
  { label: string; variant: "secondary" | "success" | "destructive" }
> = {
  pending: { label: "Pendente", variant: "secondary" },
  accepted: { label: "Aceito", variant: "success" },
  revoked: { label: "Revogado", variant: "destructive" },
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

type CollaboratorsCardProps = {
  workspace: string;
  collaborators: Collaborator[];
  invites: WorkspaceInvite[];
  isAdmin: boolean;
};

export function CollaboratorsCard({
  workspace,
  collaborators,
  invites,
  isAdmin,
}: CollaboratorsCardProps) {
  const router = useRouter();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [removingCollaborator, setRemovingCollaborator] = useState<
    Collaborator | undefined
  >();
  const [revokingId, setRevokingId] = useState<string | null>(null);

  async function handleInviteSubmit(values: InviteInput) {
    const result = await inviteCollaborator(workspace, values);
    if (!result.error) {
      router.refresh();
    }
    return result;
  }

  async function handleRemoveConfirm() {
    if (!removingCollaborator) return { error: null };
    const result = await removeMember(workspace, removingCollaborator.userId);
    if (!result.error) {
      router.refresh();
    }
    return result;
  }

  async function handleRevoke(inviteId: string) {
    setRevokingId(inviteId);
    const result = await revokeInvite(workspace, inviteId);
    setRevokingId(null);
    if (!result.error) {
      router.refresh();
    }
  }

  const pendingInvites = invites.filter((invite) => invite.status !== "accepted");

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Colaboradores</CardTitle>
              <CardDescription>
                Pessoas com acesso a este workspace.
              </CardDescription>
            </div>
            {isAdmin && (
              <Button onClick={() => setInviteOpen(true)}>
                <UserPlus className="size-4" />
                Convidar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Nome</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {collaborators.map((collaborator) => (
                  <TableRow key={collaborator.userId}>
                    <TableCell>
                      <p className="font-medium text-foreground">
                        {collaborator.name}
                        {collaborator.isCurrentUser && " (você)"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {collaborator.email}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          collaborator.role === "admin" ? "default" : "secondary"
                        }
                      >
                        {collaborator.isOwner
                          ? "Proprietário"
                          : workspaceMemberRoleLabels[collaborator.role]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {isAdmin &&
                        !collaborator.isOwner &&
                        !collaborator.isCurrentUser && (
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  aria-label={`Ações para ${collaborator.name}`}
                                />
                              }
                            >
                              <MoreHorizontal className="size-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() =>
                                  setRemovingCollaborator(collaborator)
                                }
                              >
                                Remover
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {isAdmin && pendingInvites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Convites pendentes</CardTitle>
            <CardDescription>
              Convites enviados que ainda não foram aceitos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>E-mail</TableHead>
                    <TableHead>Papel</TableHead>
                    <TableHead>Enviado em</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingInvites.map((invite) => (
                    <TableRow key={invite.id}>
                      <TableCell className="text-muted-foreground">
                        {invite.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {workspaceMemberRoleLabels[invite.role]}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {dateFormatter.format(new Date(invite.createdAt))}
                      </TableCell>
                      <TableCell>
                        <Badge variant={inviteStatusBadge[invite.status].variant}>
                          {inviteStatusBadge[invite.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {invite.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={revokingId === invite.id}
                            onClick={() => handleRevoke(invite.id)}
                          >
                            Revogar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <InviteFormDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onSubmit={handleInviteSubmit}
      />
      <RemoveMemberDialog
        open={!!removingCollaborator}
        onOpenChange={(open) => !open && setRemovingCollaborator(undefined)}
        collaborator={removingCollaborator}
        onConfirm={handleRemoveConfirm}
      />
    </div>
  );
}
