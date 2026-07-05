"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/feedback/ErrorState";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

import "./globals.css";

/**
 * Catches errors thrown in the root layout itself. It replaces the entire
 * document, so it must render its own <html>/<body> and re-import global styles.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center antialiased">
        <Container>
          <ErrorState
            title="Application error"
            description="A critical error occurred. Reloading usually fixes it."
            action={<Button onClick={reset}>Reload</Button>}
          />
        </Container>
      </body>
    </html>
  );
}
