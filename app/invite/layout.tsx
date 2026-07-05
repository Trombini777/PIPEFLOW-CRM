import Link from "next/link";

export default function InviteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-background px-4 py-10">
      <Link href="/" className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
          P
        </span>
        <span className="text-lg font-semibold text-foreground">
          PipeFlow CRM
        </span>
      </Link>
      {children}
    </div>
  );
}
