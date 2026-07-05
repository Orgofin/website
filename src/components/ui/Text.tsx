import { cn } from "@/lib/utils";

export type TextSize = "body-lg" | "body-md" | "body-sm";
export type TextTone = "default" | "muted" | "subtle";

const sizeClass: Record<TextSize, string> = {
  "body-lg": "text-body-lg",
  "body-md": "text-body-md",
  "body-sm": "text-body-sm",
};

const toneClass: Record<TextTone, string> = {
  default: "text-fg",
  muted: "text-fg-muted",
  subtle: "text-fg-subtle",
};

export type TextProps = React.HTMLAttributes<HTMLElement> & {
  as?: "p" | "span" | "div";
  size?: TextSize;
  tone?: TextTone;
  /** Prevent orphan/widow line breaks. */
  balance?: boolean;
};

/** Body copy primitive. Renders a `<p>` by default. */
export function Text({
  as = "p",
  size = "body-md",
  tone = "default",
  balance = false,
  className,
  ...rest
}: TextProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        sizeClass[size],
        toneClass[tone],
        balance && "text-pretty",
        className,
      )}
      {...rest}
    />
  );
}
