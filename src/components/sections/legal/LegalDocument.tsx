import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Caption } from "@/components/ui/Caption";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { LEGAL_EFFECTIVE_DATE_DISPLAY } from "@/lib/legal/constants";
import { cn } from "@/lib/utils";

export type LegalDocumentSection = {
  /** Stable anchor target — also the contents-link href. Never renumber. */
  id: string;
  title: string;
  body: React.ReactNode;
};

export type LegalDocumentProps = {
  /** The single `<h1>` for the page. */
  title: string;
  /** The plain-language line above the legal text (`copy.md` §14). */
  intro: string;
  sections: LegalDocumentSection[];
  className?: string;
};

/**
 * The shared shell for `/privacy` and `/terms` — the only two long-form legal
 * documents on the site. Owning the contents list, numbering, anchors and
 * effective date here means the two pages cannot drift apart in structure, and
 * a third document would cost one data array rather than a page rebuild.
 *
 * Sections are passed as data rather than children so the contents list and the
 * body are generated from the same array: a section can never appear in one and
 * not the other. Numbering is positional and rendered, never hand-typed.
 *
 * Width is `readable` (720px) rather than the marketing `narrow`/`content`
 * widths — legal text is read, not scanned, and long measures hurt it
 * (design-system.md §8).
 */
export function LegalDocument({
  title,
  intro,
  sections,
  className,
}: LegalDocumentProps) {
  return (
    <Section spacing="lg" className={className}>
      <Container size="readable" className="flex flex-col gap-12">
        <header className="flex flex-col gap-4">
          <Heading level={1} size="display-lg" balance>
            {title}
          </Heading>
          <Text size="body-lg" tone="muted" balance>
            {intro}
          </Text>
          <Caption as="p">Effective {LEGAL_EFFECTIVE_DATE_DISPLAY}</Caption>
        </header>

        {/* Named by `aria-label` rather than a heading on purpose: the contents
            list is navigation, not a section of the document, and an <h2> here
            would sit in the outline as a peer of the real clauses. */}
        <nav aria-label="Contents" className="flex flex-col gap-3">
          <Caption as="p" aria-hidden="true" className="uppercase">
            Contents
          </Caption>
          <ol className="flex flex-col gap-2">
            {sections.map((section, index) => (
              <li key={section.id} className="flex gap-3">
                {/* Fixed-width number column so the labels stay aligned when
                    the list crosses into two digits at clause 10. */}
                <span
                  aria-hidden="true"
                  className="text-fg-subtle text-body-sm w-5 shrink-0 text-right tabular-nums"
                >
                  {index + 1}.
                </span>
                <a
                  href={`#${section.id}`}
                  className="text-fg-muted hover:text-accent text-body-sm underline-offset-4 transition-colors hover:underline"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex flex-col gap-12">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-title`}
              className="flex scroll-mt-24 flex-col gap-4"
            >
              <Heading
                level={2}
                size="heading-md"
                id={`${section.id}-title`}
                className="flex gap-3"
              >
                <span
                  aria-hidden="true"
                  className="text-fg-subtle tabular-nums"
                >
                  {index + 1}.
                </span>
                <span>{section.title}</span>
              </Heading>
              {section.body}
            </section>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/**
 * A paragraph inside a legal section. Thin wrapper over `Text` so every legal
 * paragraph shares one size and tone — used often enough across two long
 * documents that the alternative is ~80 hand-repeated prop pairs.
 */
export function LegalParagraph({
  className,
  ...rest
}: React.ComponentProps<"p">) {
  return (
    <Text
      size="body-md"
      tone="muted"
      className={cn("text-pretty", className)}
      {...rest}
    />
  );
}

/** A bulleted list inside a legal section, styled to match `LegalParagraph`. */
export function LegalList({ className, ...rest }: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        "text-fg-muted text-body-md marker:text-fg-subtle flex list-disc flex-col gap-2 pl-5",
        className,
      )}
      {...rest}
    />
  );
}
