import { cn } from "@/lib/utils";

export type CodeProps = React.HTMLAttributes<HTMLElement>;

/** Inline monospace code token. */
export function Code({ className, ...rest }: CodeProps) {
  return (
    <code
      className={cn(
        "bg-surface text-fg border-border rounded-xs border px-1.5 py-0.5 font-mono text-[0.9em]",
        className,
      )}
      {...rest}
    />
  );
}
