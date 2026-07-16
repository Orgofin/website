import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

/**
 * Full-screen lockout below the 320px `mobile` breakpoint (`design-system.md`
 * §9, PRD §7 — floor lowered from 390px on 2026-07-16 so iPhone SE/Mini and
 * compact Androids get the real site; 320px is the WCAG 1.4.10 reflow width).
 * Pure CSS: visible by default and hidden at ≥320px via the `mobile:` variant
 * — no JS, so there's no hydration flash or layout shift. Mounted once at the
 * marketing layout level.
 */
export function MobileBlockScreen() {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Screen too small"
      className="bg-page mobile:hidden fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 px-6 text-center"
    >
      <Heading level={1} size="heading-lg" balance>
        A slightly wider view awaits.
      </Heading>
      <Text tone="muted" balance className="max-w-xs">
        Orgofin is crafted for screens 320px and wider. Please open it on a
        larger phone, a tablet, or a desktop.
      </Text>
    </div>
  );
}
