import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

export type LoadingScreenProps = {
  label?: string;
  className?: string;
};

/** Centered loading indicator for route-level `loading.tsx` boundaries. */
export function LoadingScreen({
  label = "Loading",
  className,
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "flex min-h-[50vh] w-full items-center justify-center",
        className,
      )}
    >
      <Spinner size={28} label={label} className="text-accent" />
    </div>
  );
}
