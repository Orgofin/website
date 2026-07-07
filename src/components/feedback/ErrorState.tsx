import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/utils";

export type ErrorStateProps = {
  title?: string;
  description?: string;
  /** Optional action(s) — typically a retry Button. */
  action?: React.ReactNode;
  className?: string;
};

/**
 * Reusable error presentation. Purely presentational (server-safe) so it can be
 * used from both server and client error boundaries; the interactive retry
 * action is passed in.
 */
export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-16 text-center",
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        <Heading level={1} size="heading-lg" balance>
          {title}
        </Heading>
        <Text tone="muted" balance className="max-w-md">
          {description}
        </Text>
      </div>
      {action && <div className="mt-2 flex items-center gap-3">{action}</div>}
    </div>
  );
}
