"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/feedback/ErrorState";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Operational logging (allowed by coding-standards.md — not a debug log).
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" className="flex flex-1 items-center">
      <Container>
        <ErrorState action={<Button onClick={reset}>Try again</Button>} />
      </Container>
    </main>
  );
}
