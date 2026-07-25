import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { mailtoUrl } from "@/lib/site/contact";

type Channel = {
  title: string;
  body: string;
  action: { label: string; href: string };
};

/**
 * Routes an enquiry to the right place instead of collecting it.
 *
 * Deliberately not a form (decision 2026-07-25): a form would mean a third PII
 * collection point — new table, migration, API route, rate limiting, and a
 * `/privacy` + inventory update — and it would sit broken in production until
 * someone applied that migration. Pre-filled `mailto:` subjects do the routing
 * a form's "enquiry type" dropdown would have done, work the moment the page
 * deploys, and add nothing to what we store. Revisit when inbound volume makes
 * a real inbox unmanageable.
 *
 * Where an answer already exists on the site, the card links there first —
 * sending someone to email for something a page already answers wastes their
 * time and ours. Partnerships is the one card with no page to link (`/partners`
 * is unbuilt, and the CA/CS commission structure is a founder fact we don't
 * have), so it takes the email route rather than linking a 404 (IA §4).
 */
const CHANNELS: readonly Channel[] = [
  {
    title: "Product & general enquiries",
    body: "Questions about what we're building, whether it fits your stack, or when you could realistically use it. This reaches the people writing the code.",
    action: {
      label: "Email us about the product",
      href: mailtoUrl("Product enquiry"),
    },
  },
  {
    title: "Investors",
    body: "The investor page carries the thesis, the market and the model. Read that first — then write to us and we'll open the data room.",
    action: { label: "Visit the investor page", href: "/investors" },
  },
  {
    title: "Partnerships",
    body: "Chartered Accountants, Company Secretaries and consultants who advise Indian businesses on compliance. Tell us about your practice and we'll take it from there.",
    action: {
      label: "Email us about a partnership",
      href: mailtoUrl("Partnership enquiry"),
    },
  },
  {
    title: "Careers",
    body: "We're not hiring today, and we'd rather say so than run a pipeline we can't fill. The careers page explains what we'll come looking for.",
    action: { label: "See the careers page", href: "/careers" },
  },
  {
    title: "Press & media",
    body: "We're pre-launch, so there's more roadmap than track record — but we'll talk candidly about what we're building and why.",
    action: {
      label: "Email us a press enquiry",
      href: mailtoUrl("Press enquiry"),
    },
  },
  {
    title: "Privacy & your data",
    body: "Access, correction or erasure of anything we hold about you. Our privacy policy sets out the rights you have and what we store.",
    action: { label: "Read the privacy policy", href: "/privacy" },
  },
];

function isInternal(href: string): boolean {
  return href.startsWith("/");
}

export function ContactChannels() {
  return (
    <Section spacing="lg" aria-labelledby="contact-channels-title">
      <Container size="content" className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Where to start"
          title={
            <span id="contact-channels-title">
              Six doors, one inbox behind them.
            </span>
          }
          subtitle="We're small enough that everything lands with the same people — but telling us why you're writing gets you a faster, better answer."
        />
        <Stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CHANNELS.map((channel) => (
            <StaggerItem key={channel.title}>
              <Card
                variant="standard"
                padding="lg"
                className="flex h-full flex-col"
              >
                <CardHeader className="flex-1 gap-3">
                  <CardTitle>{channel.title}</CardTitle>
                  <Text size="body-md" tone="muted">
                    {channel.body}
                  </Text>
                </CardHeader>
                <div className="pt-5">
                  {isInternal(channel.action.href) ? (
                    <Link
                      href={channel.action.href}
                      className="text-accent hover:text-accent-hover text-body-sm inline-flex items-center gap-1.5 font-medium transition-colors"
                    >
                      {channel.action.label}
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  ) : (
                    <a
                      href={channel.action.href}
                      className="text-accent hover:text-accent-hover text-body-sm inline-flex items-center gap-1.5 font-medium transition-colors"
                    >
                      {channel.action.label}
                      <ArrowRight size={15} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
