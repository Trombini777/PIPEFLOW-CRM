"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MoreHorizontal, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { LeadStatusBadge } from "@/components/leads/lead-status-badge";
import { LeadFormDialog } from "@/components/leads/lead-form-dialog";
import { DeleteLeadDialog } from "@/components/leads/delete-lead-dialog";
import { leadStatusOptions, type Lead } from "@/lib/domain";
import { createLead, deleteLead, updateLead } from "@/lib/actions/leads";
import type { LeadInput } from "@/lib/validations/lead";

type LeadsTableProps = {
  workspace: string;
  leads: Lead[];
  initialSearch: string;
  initialStatus: Lead["status"] | "all";
};

type StatusFilter = "all" | Lead["status"];

const statusFilterLabels: Record<StatusFilter, string> = {
  all: "Todos os status",
  ...Object.fromEntries(
    leadStatusOptions.map((option) => [option.value, option.label]),
  ),
} as Record<StatusFilter, string>;

export function LeadsTable({
  workspace,
  leads,
  initialSearch,
  initialStatus,
}: LeadsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [search, setSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialStatus);

  const [formOpen, setFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | undefined>();
  const [deletingLead, setDeletingLead] = useState<Lead | undefined>();

  function updateQuery(next: { q?: string; status?: StatusFilter }) {
    const params = new URLSearchParams(searchParams.toString());
    const q = next.q ?? search;
    const status = next.status ?? statusFilter;

    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }

    if (status && status !== "all") {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  // Busca no banco é debounced para não disparar uma navegação por tecla.
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search !== initialSearch) {
        updateQuery({ q: search });
      }
    }, 400);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function handleStatusChange(value: StatusFilter) {
    setStatusFilter(value);
    updateQuery({ status: value });
  }

  function handleCreate() {
    setEditingLead(undefined);
    setFormOpen(true);
  }

  function handleEdit(lead: Lead) {
    setEditingLead(lead);
    setFormOpen(true);
  }

  async function handleFormSubmit(values: LeadInput) {
    const result = editingLead
      ? await updateLead(workspace, editingLead.id, values)
      : await createLead(workspace, values);

    if (!result.error) {
      router.refresh();
    }

    return result;
  }

  async function handleDeleteConfirm() {
    if (!deletingLead) return { error: null };
    const result = await deleteLead(workspace, deletingLead.id);
    if (!result.error) {
      router.refresh();
    }
    return result;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nome ou empresa..."
              className="pl-8"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value) => value && handleStatusChange(value)}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue>
                {(value: StatusFilter) => statusFilterLabels[value]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              {leadStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleCreate} className="shrink-0">
          Novo lead
        </Button>
      </div>

      {leads.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Nenhum lead encontrado"
          description="Ajuste a busca ou os filtros para encontrar o que procura."
        />
      ) : (
        <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Nome</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead className="hidden md:table-cell">Cargo</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Responsável
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <Link
                      href={`/${workspace}/leads/${lead.id}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {lead.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {lead.email}
                    </p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {lead.company}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {lead.role}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">
                    {lead.ownerName}
                  </TableCell>
                  <TableCell>
                    <LeadStatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Ações para ${lead.name}`}
                          />
                        }
                      >
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/${workspace}/leads/${lead.id}`)
                          }
                        >
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(lead)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setDeletingLead(lead)}
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <LeadFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        lead={editingLead}
        onSubmit={handleFormSubmit}
      />

      <DeleteLeadDialog
        open={!!deletingLead}
        onOpenChange={(open) => !open && setDeletingLead(undefined)}
        lead={deletingLead}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
