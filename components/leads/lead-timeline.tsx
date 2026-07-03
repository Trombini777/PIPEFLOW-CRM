import { Phone, Mail, Users, StickyNote, type LucideIcon } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import {
  activityTypeLabels,
  type Activity,
  type ActivityType,
} from "@/lib/mock-data";

const activityIcons: Record<ActivityType, LucideIcon> = {
  ligacao: Phone,
  email: Mail,
  reuniao: Users,
  nota: StickyNote,
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

type LeadTimelineProps = {
  activities: Activity[];
};

export function LeadTimeline({ activities }: LeadTimelineProps) {
  if (activities.length === 0) {
    return (
      <EmptyState
        icon={StickyNote}
        title="Nenhuma atividade registrada"
        description="As ligações, e-mails, reuniões e notas deste lead aparecerão aqui."
      />
    );
  }

  const sorted = [...activities].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <ol className="flex flex-col gap-6">
      {sorted.map((activity, index) => {
        const Icon = activityIcons[activity.type];
        const isLast = index === sorted.length - 1;

        return (
          <li key={activity.id} className="relative flex gap-3">
            <div className="flex flex-col items-center">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-4" />
              </span>
              {!isLast && <span className="mt-1 w-px flex-1 bg-border" />}
            </div>
            <div className="flex flex-col gap-0.5 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {activityTypeLabels[activity.type]}
                </span>
                <span className="text-xs text-muted-foreground">
                  {dateFormatter.format(new Date(activity.date))}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {activity.description}
              </p>
              <p className="text-xs text-muted-foreground">
                por {activity.author}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
