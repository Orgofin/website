import { cn } from "@/lib/utils";

export type CaptionProps = React.HTMLAttributes<HTMLElement> & {
  as?: "p" | "span" | "div";
};

/** Small secondary copy — microcopy, timestamps, helper text. */
export function Caption({ as = "span", className, ...rest }: CaptionProps) {
  const Tag = as;
  return (
    <Tag className={cn("text-caption text-fg-muted", className)} {...rest} />
  );
}
