import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

// Confirmation page (E11.3.2) — reached only after a signup, kept out of the
// primary nav and out of search results.
export const metadata: Metadata = {
  title: "You're on the list",
  robots: { index: false, follow: false },
};

export default function WaitlistThankYouPage() {
  return (
    <main id="main-content" className="flex flex-1 items-center">
      <Container
        size="readable"
        className="flex flex-col items-center gap-6 py-24 text-center"
      >
        <Heading level={1} size="display-lg" balance>
          You&rsquo;re on the list.
        </Heading>
        <Text tone="muted" balance>
          We&rsquo;ll be in touch before anyone else hears about this.
        </Text>
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </Container>
    </main>
  );
}
