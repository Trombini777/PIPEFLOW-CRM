export type LeadStatus =
  | "novo"
  | "contatado"
  | "qualificado"
  | "convertido"
  | "perdido";

export const leadStatusOptions: { value: LeadStatus; label: string }[] = [
  { value: "novo", label: "Novo" },
  { value: "contatado", label: "Contatado" },
  { value: "qualificado", label: "Qualificado" },
  { value: "convertido", label: "Convertido" },
  { value: "perdido", label: "Perdido" },
];

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  status: LeadStatus;
  ownerId: string | null;
  ownerName: string;
  createdAt: string;
};

export type ActivityType = "ligacao" | "email" | "reuniao" | "nota";

export const activityTypeLabels: Record<ActivityType, string> = {
  ligacao: "Ligação",
  email: "E-mail",
  reuniao: "Reunião",
  nota: "Nota",
};

export type Activity = {
  id: string;
  leadId: string;
  type: ActivityType;
  authorId: string | null;
  authorName: string;
  description: string;
  date: string;
};

export type DealStage =
  | "novo_lead"
  | "contato_realizado"
  | "proposta_enviada"
  | "negociacao"
  | "fechado_ganho"
  | "fechado_perdido";

export const dealStageOptions: { value: DealStage; label: string }[] = [
  { value: "novo_lead", label: "Novo Lead" },
  { value: "contato_realizado", label: "Contato Realizado" },
  { value: "proposta_enviada", label: "Proposta Enviada" },
  { value: "negociacao", label: "Negociação" },
  { value: "fechado_ganho", label: "Fechado Ganho" },
  { value: "fechado_perdido", label: "Fechado Perdido" },
];

export const closedDealStages: DealStage[] = ["fechado_ganho", "fechado_perdido"];

export type Deal = {
  id: string;
  title: string;
  leadId: string;
  value: number;
  stage: DealStage;
  ownerId: string | null;
  ownerName: string;
  dueDate: string;
};

export type WorkspaceMember = {
  userId: string;
  name: string;
  email: string;
};

export type WorkspaceMemberRole = "admin" | "member";

export const workspaceMemberRoleLabels: Record<WorkspaceMemberRole, string> = {
  admin: "Admin",
  member: "Membro",
};

export type Collaborator = {
  userId: string;
  name: string;
  email: string;
  role: WorkspaceMemberRole;
  isOwner: boolean;
  isCurrentUser: boolean;
};

export type InviteStatus = "pending" | "accepted" | "revoked";

export type WorkspaceInvite = {
  id: string;
  email: string;
  role: WorkspaceMemberRole;
  status: InviteStatus;
  createdAt: string;
  expiresAt: string;
};

export type InvitePreview = {
  workspaceName: string;
  email: string;
  role: WorkspaceMemberRole;
  status: InviteStatus;
};
