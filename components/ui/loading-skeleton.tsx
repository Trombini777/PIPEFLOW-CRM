import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type LoadingSkeletonProps = {
  variant?: "list" | "card" | "table";
  count?: number;
  className?: string;
};

function LoadingSkeleton({
  variant = "list",
  count = 3,
  className,
}: LoadingSkeletonProps) {
  const items = Array.from({ length: count });

  if (variant === "card") {
    return (
      <div
        data-slot="loading-skeleton"
        className={cn(
          "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
          className,
        )}
      >
        {items.map((_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div data-slot="loading-skeleton" className={cn("space-y-2", className)}>
        {items.map((_, index) => (
          <Skeleton key={index} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div data-slot="loading-skeleton" className={cn("space-y-3", className)}>
      {items.map((_, index) => (
        <Skeleton key={index} className="h-14 w-full rounded-lg" />
      ))}
    </div>
  );
}

export { LoadingSkeleton };
