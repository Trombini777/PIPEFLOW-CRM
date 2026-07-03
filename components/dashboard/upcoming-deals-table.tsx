import { CalendarClock } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  dueDateFormatter,
  dueUrgencyBadgeClassName,
  getDueUrgency,
} from "@/lib/deal-urgency";
import { cn, formatCurrency, getInitials } from "@/lib/utils";
import type { UpcomingDeal } from "@/lib/dashboard-metrics";

type UpcomingDealsTableProps = {
  deals: UpcomingDeal[];
};

export function UpcomingDealsTable({ deals }: UpcomingDealsTableProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Negócios com Prazo Próximo</CardTitle>
      </CardHeader>
      <CardContent>
        {deals.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="Nenhum negócio em aberto"
            description="Assim que houver negócios com prazo definido, eles aparecem aqui."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Negócio</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Prazo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.map((deal) => {
                const urgency = getDueUrgency(deal);
                return (
                  <TableRow key={deal.id}>
                    <TableCell className="max-w-48 whitespace-normal">
                      <p className="truncate font-medium text-foreground">
                        {deal.title}
                      </p>
                      {deal.lead && (
                        <p className="truncate text-xs text-muted-foreground">
                          {deal.lead.company}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar size="sm">
                          <AvatarFallback>
                            {getInitials(deal.owner)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground">
                          {deal.owner}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono tabular-nums">
                      {formatCurrency(deal.value)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                          dueUrgencyBadgeClassName[urgency],
                        )}
                      >
                        <CalendarClock className="size-3" />
                        {dueDateFormatter.format(
                          new Date(`${deal.dueDate}T00:00:00`),
                        )}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
