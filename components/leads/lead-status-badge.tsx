import { Badge, type badgeVariants } from "@/components/ui/badge";
import { leadStatusOptions, type LeadStatus } from "@/lib/domain";
import type { VariantProps } from "class-variance-authority";

const statusVariant: Record<
  LeadStatus,
  NonNullable<VariantProps<typeof badgeVariants>["variant"]>
> = {
  novo: "secondary",
  contatado: "default",
  qualificado: "warning",
  convertido: "success",
  perdido: "destructive",
};

type LeadStatusBadgeProps = {
  status: LeadStatus;
};

export function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  const label = leadStatusOptions.find((option) => option.value === status)?.label;

  return <Badge variant={statusVariant[status]}>{label}</Badge>;
}
