import Link from "next/link";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main id="main-content" className="flex flex-1 items-center">
      <Container>
        <EmptyState
          title="Page not found"
          description="The page you're looking for doesn't exist or has moved."
          icon={<span className="text-display-lg font-semibold">404</span>}
          action={
            <Button asChild>
              <Link href="/">Back to home</Link>
            </Button>
          }
        />
      </Container>
    </main>
  );
}
