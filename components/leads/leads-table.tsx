"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { leadStatusOptions, type Lead } from "@/lib/mock-data";
import type { LeadInput } from "@/lib/validations/lead";

type LeadsTableProps = {
  workspace: string;
  initialLeads: Lead[];
};

type StatusFilter = "all" | Lead["status"];

const statusFilterLabels: Record<StatusFilter, string> = {
  all: "Todos os status",
  ...Object.fromEntries(
    leadStatusOptions.map((option) => [option.value, option.label]),
  ),
} as Record<StatusFilter, string>;

export function LeadsTable({ workspace, initialLeads }: LeadsTableProps) {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | undefined>();
  const [deletingLead, setDeletingLead] = useState<Lead | undefined>();

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesQuery =
        !query ||
        lead.name.toLowerCase().includes(query) ||
        lead.company.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "all" || lead.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  function handleCreate() {
    setEditingLead(undefined);
    setFormOpen(true);
  }

  function handleEdit(lead: Lead) {
    setEditingLead(lead);
    setFormOpen(true);
  }

  function handleFormSubmit(values: LeadInput) {
    if (editingLead) {
      setLeads((current) =>
        current.map((lead) =>
          lead.id === editingLead.id ? { ...lead, ...values } : lead,
        ),
      );
      return;
    }

    const newLead: Lead = {
      ...values,
      id: crypto.randomUUID(),
      owner: "Eliezer Trombini",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setLeads((current) => [newLead, ...current]);
  }

  function handleDeleteConfirm() {
    if (!deletingLead) return;
    setLeads((current) => current.filter((lead) => lead.id !== deletingLead.id));
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
            onValueChange={(value) => setStatusFilter(value as StatusFilter)}
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

      {filteredLeads.length === 0 ? (
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
              {filteredLeads.map((lead) => (
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
                    {lead.owner}
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
