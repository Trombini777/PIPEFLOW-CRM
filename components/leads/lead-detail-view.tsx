"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Mail,
  MoreHorizontal,
  Phone,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LeadStatusBadge } from "@/components/leads/lead-status-badge";
import { LeadFormDialog } from "@/components/leads/lead-form-dialog";
import { DeleteLeadDialog } from "@/components/leads/delete-lead-dialog";
import { LeadTimeline } from "@/components/leads/lead-timeline";
import type { Activity, Lead } from "@/lib/mock-data";
import type { LeadInput } from "@/lib/validations/lead";

type LeadDetailViewProps = {
  workspace: string;
  initialLead: Lead;
  activities: Activity[];
};

export function LeadDetailView({
  workspace,
  initialLead,
  activities,
}: LeadDetailViewProps) {
  const router = useRouter();
  const [lead, setLead] = useState(initialLead);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function handleSubmit(values: LeadInput) {
    setLead((current) => ({ ...current, ...values }));
  }

  function handleDeleteConfirm() {
    router.push(`/${workspace}/leads`);
  }

  return (
    <>
      <PageHeader
        breadcrumb={
          <Link
            href={`/${workspace}/leads`}
            className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Leads
          </Link>
        }
        title={lead.name}
        description={`${lead.role} · ${lead.company}`}
        action={
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              Ações
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFormOpen(true)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setDeleteOpen(true)}
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Dados de contato</CardTitle>
              <LeadStatusBadge status={lead.status} />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="size-4 shrink-0" />
              <span className="truncate">{lead.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="size-4 shrink-0" />
              <span>{lead.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="size-4 shrink-0" />
              <span>{lead.company}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="size-4 shrink-0" />
              <span>{lead.role}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="size-4 shrink-0" />
              <span>Responsável: {lead.owner}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline de atividades</CardTitle>
            <CardDescription>
              Histórico de interações registradas com este lead.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LeadTimeline activities={activities} />
          </CardContent>
        </Card>
      </div>

      <LeadFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        lead={lead}
        onSubmit={handleSubmit}
      />
      <DeleteLeadDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        lead={lead}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
