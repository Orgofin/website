import {
  Heading,
  type HeadingLevel,
  type HeadingSize,
} from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/utils";

export type SectionHeadingAlign = "start" | "center";

export type SectionHeadingProps = {
  /** Optional uppercase kicker above the headline (e.g. a chapter label). */
  eyebrow?: React.ReactNode;
  /** The headline. Copy comes from the caller — never imported here. */
  title: React.ReactNode;
  /** Optional sub-headline beneath the title. */
  subtitle?: React.ReactNode;
  /** Semantic heading level — reflects document order, not visual size. */
  level?: HeadingLevel;
  /** Visual size token for the title; defaults to a sensible size for `level`. */
  size?: HeadingSize;
  /** Horizontal alignment of the block. */
  align?: SectionHeadingAlign;
  className?: string;
  /** Extra classes for the title element (e.g. a `gradient` accent per page). */
  titleClassName?: string;
};

const alignClass: Record<SectionHeadingAlign, string> = {
  start: "items-start text-left",
  center: "items-center text-center",
};

/**
 * The headline + sub-headline pattern used at the top of every section
 * (`frontend.md` §3). Content-agnostic: it accepts copy as props and never
 * imports the copy deck. Heading level is decoupled from visual size, so a
 * visually large section title can still sit at the correct place in the
 * document outline.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  level = 2,
  size,
  align = "start",
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-3", alignClass[align], className)}>
      {eyebrow ? (
        <p className="text-micro text-accent uppercase">{eyebrow}</p>
      ) : null}
      <Heading level={level} size={size} balance className={titleClassName}>
        {title}
      </Heading>
      {subtitle ? (
        <Text size="body-lg" tone="muted" balance className="max-w-prose">
          {subtitle}
        </Text>
      ) : null}
    </div>
  );
}
