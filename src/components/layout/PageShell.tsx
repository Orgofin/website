import { cn } from "@/lib/utils";

export type PageShellProps = React.ComponentProps<"div">;

/**
 * The outermost page frame. Enforces the ultrawide content cap (`max-w-wide`,
 * ~1600px per design-system.md §9) and centers the layout so the cinematic
 * design never stretches edge-to-edge on large displays — excess space becomes
 * ambient background, not stretched content. Sections inside supply their own
 * gutters via `<Container>`.
 */
export function PageShell({ className, children, ...rest }: PageShellProps) {
  return (
    <div className={cn("max-w-wide mx-auto w-full", className)} {...rest}>
      {children}
    </div>
  );
}
