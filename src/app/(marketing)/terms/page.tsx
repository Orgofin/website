import Link from "next/link";

import {
  LegalDocument,
  LegalList,
  LegalParagraph,
  type LegalDocumentSection,
} from "@/components/sections/legal";
import { LEGAL_CONTACT_EMAIL, LEGAL_ENTITY_NAME } from "@/lib/legal/constants";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Terms of Use",
  description:
    "The terms that apply to this website — what it is, what it isn't, and what you can expect from us. Plain language first, legal language second.",
  path: "/terms",
});

const mailto = `mailto:${LEGAL_CONTACT_EMAIL}`;

/**
 * Terms of Use (`copy.md` §14 framing line + full text).
 *
 * Scoped to **this website only** — deliberately not a product agreement. There
 * is no product to subscribe to yet, no account to open and nothing to pay for,
 * so terms covering subscriptions, SLAs, customer data or fees would be
 * describing a relationship that does not exist. Those arrive with the product,
 * as a separate agreement.
 *
 * Two clauses here exist because of specific things this site does: §5 (the
 * investor materials are not an offer of securities — the data room hands out
 * a pitch deck) and §4 (forward-looking statements — most of this site
 * describes software that is not built yet). Both are worth counsel's
 * particular attention.
 *
 * Status: drafted by engineering, **pending review by counsel** — see
 * docs/legal/README.md. Governing-law venue is stated only as India because the
 * registered office is not yet settled (`lib/legal/constants.ts`).
 */
const sections: LegalDocumentSection[] = [
  {
    id: "the-short-version",
    title: "The short version",
    body: (
      <>
        <LegalParagraph>
          This is a website about a product we are building. You can read it,
          join the waitlist, and — if you are an investor — ask for our
          materials. There is nothing to buy, no account to create, and nothing
          you owe us.
        </LegalParagraph>
        <LegalParagraph>
          In return, we ask you not to attack the site or misuse what you find
          on it, and we ask you to understand that a site describing unreleased
          software is a statement of intent rather than a promise. The rest of
          this page is the same thing said carefully.
        </LegalParagraph>
      </>
    ),
  },
  {
    id: "who-these-terms-are-with",
    title: "Who these terms are with",
    body: (
      <>
        <LegalParagraph>
          These terms are an agreement between you and {LEGAL_ENTITY_NAME} (
          &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), covering your
          use of orgofin.com and everything on it.
        </LegalParagraph>
        <LegalParagraph>
          By using the site you accept them. If you do not, please stop using
          the site — that is the entire consequence.
        </LegalParagraph>
        <LegalParagraph>
          They cover <strong className="text-fg">this website only</strong>.
          When the Orgofin product becomes available it will come with its own
          agreement covering the things that actually matter in a software
          contract — service levels, your company&rsquo;s data, security
          commitments, fees. Nothing on this page is that agreement, and nothing
          here commits us to any particular terms in it.
        </LegalParagraph>
      </>
    ),
  },
  {
    id: "what-you-can-do",
    title: "What you can do here",
    body: (
      <>
        <LegalParagraph>You are welcome to:</LegalParagraph>
        <LegalList>
          <li>read anything on the site, and share links to it;</li>
          <li>join the waitlist with an email address you control;</li>
          <li>request our investor materials if you are an investor;</li>
          <li>
            quote or cite the site, as long as you attribute it and do not
            present our words as your own.
          </li>
        </LegalList>
        <LegalParagraph>
          Please do not: try to break, overload or gain unauthorised access to
          the site or the systems behind it; scrape it in bulk or run automated
          submissions against its forms; submit an email address that is not
          yours; misrepresent who you are to obtain our investor materials; use
          the site to do anything unlawful; or strip our branding from our
          content and pass it off as something else.
        </LegalParagraph>
        <LegalParagraph>
          We rate-limit the forms and screen for bots. If we think an account of
          activity is abusive, we may block it without notice.
        </LegalParagraph>
      </>
    ),
  },
  {
    id: "forward-looking",
    title: "What we say about a product we're still building",
    body: (
      <>
        <LegalParagraph>
          Most of this site describes the Company Brain, our AI agents, and an
          HRMS that are <strong className="text-fg">in development</strong>.
          Descriptions of capabilities, roadmap, timing and pricing are our
          current plans and expectations. They are not commitments, and they are
          not a warranty that any particular feature will exist, work as
          described, or ship at all.
        </LegalParagraph>
        <LegalParagraph>
          Plans change as we learn. Do not make a business decision, an
          investment decision, or a purchasing commitment on the basis of a page
          on this site — talk to us instead, and we will tell you where things
          genuinely stand.
        </LegalParagraph>
      </>
    ),
  },
  {
    id: "investor-materials",
    title: "Investor materials",
    body: (
      <>
        <LegalParagraph>
          The investor data room contains materials about our business that we
          share on request. Two things about them:
        </LegalParagraph>
        <LegalParagraph>
          <strong className="text-fg">They are not an offer.</strong> Nothing in
          the data room, on the investors page, or anywhere else on this site is
          an offer or invitation to buy or subscribe for securities, or a
          recommendation or inducement to invest. Any actual investment would
          happen through separate documentation, subject to its own terms and to
          applicable securities law.
        </LegalParagraph>
        <LegalParagraph>
          <strong className="text-fg">They are confidential.</strong> We give
          you access for the purpose of evaluating Orgofin. Please do not
          republish them, post them, or pass them on to anyone outside your firm
          without asking us. Download links are personal to your request and
          expire.
        </LegalParagraph>
        <LegalParagraph>
          The materials describe an early-stage company. They may contain
          projections and estimates that turn out to be wrong, and we do not
          undertake to keep them current.
        </LegalParagraph>
      </>
    ),
  },
  {
    id: "the-waitlist",
    title: "The waitlist",
    body: (
      <>
        <LegalParagraph>
          Joining the waitlist costs nothing and guarantees nothing. It does not
          create a contract, reserve you a place, fix a price, or entitle you to
          access when we launch. We decide who we invite and when, and we may
          change or discontinue the waitlist entirely.
        </LegalParagraph>
        <LegalParagraph>
          What it does mean is that we will email you — about launch, and
          occasionally about the build. You can ask us to stop and to delete
          your record at any time, at{" "}
          <Link
            href={mailto}
            className="text-accent hover:text-accent-hover underline underline-offset-4"
          >
            {LEGAL_CONTACT_EMAIL}
          </Link>
          . How we handle that data is set out in our{" "}
          <Link
            href="/privacy"
            className="text-accent hover:text-accent-hover underline underline-offset-4"
          >
            privacy policy
          </Link>
          .
        </LegalParagraph>
      </>
    ),
  },
  {
    id: "our-content",
    title: "Our content and our brand",
    body: (
      <>
        <LegalParagraph>
          Everything on this site — the writing, the design, the code, the logo
          and the Orgofin name — belongs to us or to whoever licensed it to us,
          and is protected by copyright and trade mark law. Using the site does
          not transfer any of it to you.
        </LegalParagraph>
        <LegalParagraph>
          You may quote and link to us with attribution. You may not copy the
          site wholesale, reuse our design or copy for your own product, train a
          model on it for commercial purposes, or use our name or logo in a way
          that suggests we endorse you.
        </LegalParagraph>
        <LegalParagraph>
          If you send us feedback or an idea, we may act on it freely and
          without owing you anything for it. Please do not send us anything you
          consider confidential.
        </LegalParagraph>
      </>
    ),
  },
  {
    id: "other-sites",
    title: "Links to other sites",
    body: (
      <LegalParagraph>
        Where we link out, we do not control what is on the other end and are
        not responsible for it. A link is not an endorsement.
      </LegalParagraph>
    ),
  },
  {
    id: "availability",
    title: "Availability, and what we don't promise",
    body: (
      <>
        <LegalParagraph>
          We try to keep the site up, accurate and current, but we provide it
          &ldquo;as is&rdquo;. We do not promise it will always be available,
          uninterrupted, error-free, or free of anything harmful, and we do not
          warrant that everything on it is complete or correct at the moment you
          read it. We may change, suspend or remove any part of it at any time.
        </LegalParagraph>
        <LegalParagraph>
          To the fullest extent the law allows, we exclude the implied
          warranties that would otherwise apply.
        </LegalParagraph>
      </>
    ),
  },
  {
    id: "liability",
    title: "Liability",
    body: (
      <>
        <LegalParagraph>
          To the fullest extent permitted by law, we are not liable for indirect
          or consequential loss, lost profits, lost business, lost data or lost
          opportunity arising from your use of this site or your reliance on
          anything published on it.
        </LegalParagraph>
        <LegalParagraph>
          Nothing in these terms limits liability that cannot lawfully be
          limited — including for fraud, or for death or personal injury caused
          by negligence.
        </LegalParagraph>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "Governing law",
    body: (
      <LegalParagraph>
        These terms are governed by the laws of India, and disputes arising out
        of them or your use of this site are subject to the exclusive
        jurisdiction of the courts of India.
      </LegalParagraph>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <LegalParagraph>
        We will update this page as the site changes. The effective date at the
        top always reflects the current version, and continuing to use the site
        after a change means you accept the updated terms.
      </LegalParagraph>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <>
        <LegalParagraph>
          If anything here is unclear, ask us — that is what this address is
          for:
        </LegalParagraph>
        <LegalParagraph>
          <Link
            href={mailto}
            className="text-accent hover:text-accent-hover underline underline-offset-4"
          >
            {LEGAL_CONTACT_EMAIL}
          </Link>
        </LegalParagraph>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <LegalDocument
        title="Terms of Use"
        intro="Plain language first, legal language second. If anything here is unclear, ask us — that's what our contact address is for."
        sections={sections}
      />
    </main>
  );
}
