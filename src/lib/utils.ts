import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's default font sizes (text-xs…text-9xl);
 * it classified this repo's custom type-scale utilities (design-system.md §1,
 * defined in globals.css `@theme`) as text-COLOR classes, so a call like
 * `cn("text-caption", "text-fg-muted")` silently dropped the size. Teaching it
 * the custom scale keeps sizes and colors in separate conflict groups.
 *
 * Keep this list in lockstep with the `--text-*` tokens in globals.css — a
 * new type-scale token that isn't added here will be dropped whenever it
 * shares a `cn()` call with a text color.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-2xl",
            "display-xl",
            "display-lg",
            "heading-lg",
            "heading-md",
            "heading-sm",
            "body-lg",
            "body-md",
            "body-sm",
            "caption",
            "micro",
            "mono-md",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
