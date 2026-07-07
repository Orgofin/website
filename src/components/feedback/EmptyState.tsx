import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/utils";

export type EmptyStateProps = {
  title: string;
  description?: string;
  /** Optional leading icon or illustration. */
  icon?: React.ReactNode;
  /** Optional action(s) — typically a Button. */
  action?: React.ReactNode;
  className?: string;
};

/** Reusable empty/zero-data state. */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-16 text-center",
        className,
      )}
    >
      {icon && (
        <div className="text-fg-subtle" aria-hidden="true">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <Heading level={2} size="heading-lg" balance>
          {title}
        </Heading>
        {description && (
          <Text tone="muted" balance className="max-w-md">
            {description}
          </Text>
        )}
      </div>
      {action && <div className="mt-2 flex items-center gap-3">{action}</div>}
    </div>
  );
}
