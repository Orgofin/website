import { cn } from "@/lib/utils";

export type QuoteProps = React.HTMLAttributes<HTMLQuoteElement> & {
  /** Optional attribution rendered under the quote. */
  cite?: string;
};

/** Blockquote primitive — an accent rule, larger body copy, optional citation. */
export function Quote({ cite, className, children, ...rest }: QuoteProps) {
  return (
    <blockquote
      className={cn(
        "border-accent text-fg text-body-lg border-l-2 pl-6",
        className,
      )}
      {...rest}
    >
      {children}
      {cite && (
        <footer className="text-caption text-fg-muted mt-3 not-italic">
          — {cite}
        </footer>
      )}
    </blockquote>
  );
}
