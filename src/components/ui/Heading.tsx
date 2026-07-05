import { cn } from "@/lib/utils";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize =
  | "display-2xl"
  | "display-xl"
  | "display-lg"
  | "heading-lg"
  | "heading-md"
  | "heading-sm";

const elementForLevel: Record<
  HeadingLevel,
  "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
};

/** Default visual size per semantic level — override with the `size` prop. */
const defaultSizeForLevel: Record<HeadingLevel, HeadingSize> = {
  1: "display-xl",
  2: "display-lg",
  3: "heading-lg",
  4: "heading-md",
  5: "heading-sm",
  6: "heading-sm",
};

const sizeClass: Record<HeadingSize, string> = {
  "display-2xl": "text-display-2xl",
  "display-xl": "text-display-xl",
  "display-lg": "text-display-lg",
  "heading-lg": "text-heading-lg",
  "heading-md": "text-heading-md",
  "heading-sm": "text-heading-sm",
};

export type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  /** Semantic heading level — reflects document structure, not visual size. */
  level?: HeadingLevel;
  /** Visual size token; defaults to a sensible size for the level. */
  size?: HeadingSize;
  /** Apply the brand gradient to the text (use sparingly — hero accents only). */
  gradient?: boolean;
  /** Prevent orphan/widow line breaks in headlines. */
  balance?: boolean;
};

/**
 * Semantic heading whose level (h1–h6) is decoupled from its visual size —
 * satisfying design-system.md §8 "headings in document order, size from tokens
 * not heading level". One `<h1>` per page is the caller's responsibility.
 */
export function Heading({
  level = 2,
  size,
  gradient = false,
  balance = false,
  className,
  ...rest
}: HeadingProps) {
  const Tag = elementForLevel[level];
  const resolvedSize = size ?? defaultSizeForLevel[level];
  return (
    <Tag
      className={cn(
        "text-fg font-semibold",
        sizeClass[resolvedSize],
        gradient && "text-gradient-brand",
        balance && "text-balance",
        className,
      )}
      {...rest}
    />
  );
}
