import Link from "next/link";

import {
  LegalDocument,
  LegalList,
  LegalParagraph,
  type LegalDocumentSection,
} from "@/components/sections/legal";
import {
  DATA_RETENTION_MONTHS,
  LEGAL_CONTACT_EMAIL,
  LEGAL_ENTITY_NAME,
  LEGAL_REGISTERED_ADDRESS,
} from "@/lib/legal/constants";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description:
    "Exactly what this website collects, where it is stored, who processes it, and how long we keep it — in plain language, then in full.",
  path: "/privacy",
});

const mailto = `mailto:${LEGAL_CONTACT_EMAIL}`;

/**
 * Privacy Policy (`copy.md` §14 framing line + full text). Every factual claim
 * on this page is derived from `docs/legal/data-processing-inventory.md`, which
 * cites the collecting code `file:line` for each field — the inventory is the
 * source of truth and this page is its public statement. **Change one, change
 * both in the same PR.**
 *
 * Deliberate omissions, so nothing here is a fabrication (CLAUDE.md
 * non-negotiable #1): no registered address until the founders settle one; no
 * named grievance officer until one is appointed; no claim of DPDP compliance,
 * no certification claims, and no naming of a specific hosting region for the
 * database. What *is* asserted about cross-border processing is verified —
 * Vercel executes this site's functions in `iad1` (US East), confirmed from the
 * `X-Vercel-Id` response header on 2026-07-24.
 *
 * Status: drafted by engineering from verified facts, **pending review by
 * counsel** (docs/legal/README.md). It is text a lawyer edits, not text a
 * lawyer wrote.
 */
const sections: LegalDocumentSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <>
        <LegalParagraph>
          This website is operated by {LEGAL_ENTITY_NAME} (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;, &ldquo;our&rdquo;). For the personal data described
          here, we decide why and how it is processed — under India&rsquo;s
          Digital Personal Data Protection Act, 2023, that makes us the data
          fiduciary.
        </LegalParagraph>
        <LegalParagraph>
          {LEGAL_REGISTERED_ADDRESS ??
            "We are early enough that our registered office is not yet settled, so we don't publish one here rather than publish one that changes next month."}{" "}
          The fastest way to reach a human about anything on this page is{" "}
          <Link
            href={mailto}
            className="text-accent hover:text-accent-hover underline underline-offset-4"
          >
            {LEGAL_CONTACT_EMAIL}
          </Link>
          .
        </LegalParagraph>
      </>
    ),
  },
  {
    id: "scope",
    title: "What this policy covers",
    body: (
      <>
        <LegalParagraph>
          This policy covers{" "}
          <strong className="text-fg">this website only</strong> — orgofin.com,
          its waitlist, and its investor data room.
        </LegalParagraph>
        <LegalParagraph>
          It does not cover the Orgofin product. The Company Brain, the HRMS and
          everything else described on this site are in development; they are
          separate systems with their own data handling, and when they launch
          they will carry their own terms and their own privacy notice. Nothing
          here should be read as describing how the product treats your
          company&rsquo;s data.
        </LegalParagraph>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "What we collect",
    body: (
      <>
        <LegalParagraph>
          There are exactly two places on this site where you can give us
          personal data, and both are forms you choose to fill in.
        </LegalParagraph>
        <LegalParagraph>
          <strong className="text-fg">The waitlist.</strong> Your email address.
          That is the whole of it. We also record which page you signed up from
          and the time you did — neither identifies you. We do not ask for your
          name, your company, or your role.
        </LegalParagraph>
        <LegalParagraph>
          <strong className="text-fg">The investor data room.</strong> Your
          name, your email address, your firm, and — only if you choose to give
          it — your typical check size, along with the time of the request.
        </LegalParagraph>
        <LegalParagraph>
          <strong className="text-fg">Your IP address, briefly.</strong> When
          you submit either form, we read your IP address to count requests and
          stop automated abuse. It is held in memory for a few minutes, never
          written to our database, and never linked to the email you submitted.
          Our hosting provider logs request data including IP addresses
          separately, under its own terms.
        </LegalParagraph>
        <LegalParagraph>
          <strong className="text-fg">Analytics, if you allow it.</strong> On
          the live site we use Google Analytics to understand which pages people
          read &mdash; and only after you accept it. See{" "}
          <a
            href="#cookies-and-analytics"
            className="text-accent hover:text-accent-hover underline underline-offset-4"
          >
            cookies and analytics
          </a>{" "}
          below.
        </LegalParagraph>
        <LegalParagraph>
          <strong className="text-fg">Your theme preference.</strong> If you
          switch between light and dark mode, that choice is stored in your own
          browser so the site remembers it. It never reaches us.
        </LegalParagraph>
      </>
    ),
  },
  {
    id: "what-we-dont-collect",
    title: "What we deliberately don't collect",
    body: (
      <>
        <LegalParagraph>
          This is a short list on most websites. On this one it is long, and we
          would rather you knew it:
        </LegalParagraph>
        <LegalList>
          <li>No accounts, no passwords, no logins of any kind.</li>
          <li>No payment or financial details.</li>
          <li>No files you upload — there is nowhere to upload one.</li>
          <li>No advertising or remarketing pixels, and no social trackers.</li>
          <li>
            No cookies of our own. The only cookies set on this site belong to
            Google Analytics.
          </li>
          <li>
            No logging of what you type into a form. If a submission fails, we
            record the technical error, never the contents.
          </li>
          <li>
            No selling, renting or sharing of your data with anyone for their
            own marketing. We have never done this and have no plans to.
          </li>
        </LegalList>
      </>
    ),
  },
  {
    id: "why-we-use-it",
    title: "Why we use it",
    body: (
      <>
        <LegalParagraph>
          We process what you give us on the basis of the consent you give by
          submitting the form, and we use it only for the purpose you submitted
          it for:
        </LegalParagraph>
        <LegalList>
          <li>
            <strong className="text-fg">Waitlist email</strong> — to tell you
            when Orgofin opens up, and to send occasional founder updates about
            the build.
          </li>
          <li>
            <strong className="text-fg">Data-room details</strong> — to know who
            has asked for our investor materials, and to follow up with you
            about them.
          </li>
          <li>
            <strong className="text-fg">IP address</strong> — to rate-limit and
            protect the forms from abuse.
          </li>
          <li>
            <strong className="text-fg">Analytics</strong> — to see which parts
            of the site are useful and which are not.
          </li>
        </LegalList>
        <LegalParagraph>
          We will not quietly repurpose it. If we ever want to use what you gave
          us for something materially different, we will ask you first.
        </LegalParagraph>
      </>
    ),
  },
  {
    id: "who-processes-it",
    title: "Who else processes it",
    body: (
      <>
        <LegalParagraph>
          We keep the list of third parties as short as we can. Today it is
          three:
        </LegalParagraph>
        <LegalList>
          <li>
            <strong className="text-fg">Supabase</strong> — hosts our database
            and the private storage holding investor documents.
          </li>
          <li>
            <strong className="text-fg">Vercel</strong> — hosts the site, runs
            its server-side code, and keeps platform request logs.
          </li>
          <li>
            <strong className="text-fg">Google</strong> — provides Analytics on
            the live site, and processes that data under its own terms.
          </li>
        </LegalList>
        <LegalParagraph>
          <strong className="text-fg">Where this happens.</strong> Although the
          site is served to you from infrastructure near you, the server-side
          code that handles your form submission currently runs in the United
          States, and our providers may store and process data outside India.
          Submitting a form means accepting that transfer. We are India-first as
          a company and expect to bring this processing into India; when we do,
          we will say so here.
        </LegalParagraph>
      </>
    ),
  },
  {
    id: "how-we-protect-it",
    title: "How we protect it",
    body: (
      <>
        <LegalParagraph>
          Some specifics, because &ldquo;we take security seriously&rdquo; means
          nothing on its own:
        </LegalParagraph>
        <LegalList>
          <li>
            The whole site is served over HTTPS, with strict transport security
            enforced.
          </li>
          <li>
            Our database tables accept new rows and nothing else. The key that
            ships to your browser physically cannot read the waitlist or the
            investor list back — so no one can pull the list out through the
            website.
          </li>
          <li>
            The waitlist endpoint treats an already-registered email as a
            success, so it cannot be used to test whether someone has signed up.
          </li>
          <li>
            Investor documents live in private storage. They are never public;
            each download is a separate link that we generate on request and
            that stops working after fifteen minutes.
          </li>
          <li>
            Both forms are rate-limited per IP address and screened for
            automated submissions.
          </li>
        </LegalList>
        <LegalParagraph>
          No system is perfectly secure, and we will not pretend otherwise. If
          we discover a breach affecting your personal data, we will notify you
          and the Data Protection Board as the law requires. You can read more
          about our approach on our{" "}
          <Link
            href="/security"
            className="text-accent hover:text-accent-hover underline underline-offset-4"
          >
            security page
          </Link>
          .
        </LegalParagraph>
      </>
    ),
  },
  {
    id: "how-long-we-keep-it",
    title: "How long we keep it",
    body: (
      <>
        <LegalParagraph>
          We keep waitlist and data-room records for{" "}
          <strong className="text-fg">
            {DATA_RETENTION_MONTHS} months from the day you submit them
          </strong>
          , after which we delete them — unless you have become a customer or an
          investor and we have a continuing reason to hold them, or the law
          requires us to keep them longer.
        </LegalParagraph>
        <LegalParagraph>
          You do not have to wait {DATA_RETENTION_MONTHS} months. Ask us to
          delete your record at any time and we will.
        </LegalParagraph>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights, and how to use them",
    body: (
      <>
        <LegalParagraph>Under the DPDP Act you can ask us to:</LegalParagraph>
        <LegalList>
          <li>
            tell you what personal data of yours we hold and what we do with it;
          </li>
          <li>correct anything inaccurate, or complete anything missing;</li>
          <li>erase it;</li>
          <li>withdraw the consent you gave — as easily as you gave it;</li>
          <li>
            nominate someone to exercise these rights on your behalf if you die
            or become incapacitated.
          </li>
        </LegalList>
        <LegalParagraph>
          One address does all of it:{" "}
          <Link
            href={mailto}
            className="text-accent hover:text-accent-hover underline underline-offset-4"
          >
            {LEGAL_CONTACT_EMAIL}
          </Link>
          . Write to us and we will act on your request, and confirm when it is
          done, within thirty days. There is no form to fill in and nothing to
          pay.
        </LegalParagraph>
        <LegalParagraph>
          If we get it wrong, tell us at that same address and we will try to
          put it right. If you are still not satisfied, you may complain to the
          Data Protection Board of India.
        </LegalParagraph>
      </>
    ),
  },
  {
    id: "cookies-and-analytics",
    title: "Cookies and analytics",
    body: (
      <>
        <LegalParagraph>
          We set no cookies of our own. The live site can load Google Analytics,
          which sets its own cookies and processes your IP address and
          device/browser information under Google&rsquo;s terms.
        </LegalParagraph>
        <LegalParagraph>
          <strong className="text-fg">We ask first.</strong> Analytics does not
          load until you accept it. On your first visit you&rsquo;ll see a
          banner with two equally easy choices &mdash; accept, or essential
          only. Choose essential only and no analytics script runs and no Google
          cookie is ever set. We remember your choice in your own browser so we
          don&rsquo;t ask again; clear your site data and we&rsquo;ll ask
          afresh.
        </LegalParagraph>
        <LegalParagraph>
          What we send to Analytics is a fixed, short list of events — a page
          view, a button click, a form submission, a theme change. It is
          enforced in code: there is no field in any of those events capable of
          carrying your email address, your name, or anything you typed. Your
          personal data does not reach Google through us.
        </LegalParagraph>
        <LegalParagraph>
          You can also block these cookies in your browser settings, or install
          Google&rsquo;s official opt-out add-on. Either way &mdash; and
          whichever way you answer the banner &mdash; the site works exactly as
          before. Nothing on it is gated behind your answer.
        </LegalParagraph>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <LegalParagraph>
        This is a website for businesses and investors. It is not directed at
        children, and we do not knowingly collect personal data from anyone
        under 18. If you believe a child has given us their data, tell us and we
        will delete it.
      </LegalParagraph>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <LegalParagraph>
        We will update this page as the site changes — and it will change,
        because we are building. The effective date at the top always reflects
        the current version. If a change materially affects what we do with data
        you have already given us, we will contact you about it rather than
        quietly editing this page.
      </LegalParagraph>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <>
        <LegalParagraph>
          Questions about this policy, requests about your data, or complaints —
          all go to the same place:
        </LegalParagraph>
        <LegalParagraph>
          <Link
            href={mailto}
            className="text-accent hover:text-accent-hover underline underline-offset-4"
          >
            {LEGAL_CONTACT_EMAIL}
          </Link>
        </LegalParagraph>
        <LegalParagraph>
          A real person reads it. We are a small team, so it may be one of the
          founders.
        </LegalParagraph>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <LegalDocument
        title="Privacy Policy"
        intro="We ask you to trust us with sensitive company data. Here's exactly what we do — and don't do — with it."
        sections={sections}
      />
    </main>
  );
}
