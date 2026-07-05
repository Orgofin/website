import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

// Placeholder home — the real Home page (docs/product/copy.md,
// information-architecture.md) is intentionally NOT built in the infrastructure
// phase. This only confirms the shared foundation renders.
export default function Home() {
  return (
    <main id="main-content" className="flex flex-1 items-center">
      <Container
        size="readable"
        className="flex flex-col gap-4 py-24 text-center"
      >
        <Heading level={1} size="display-lg" balance>
          Orgofin
        </Heading>
        <Text tone="muted" balance>
          Core frontend infrastructure is in place. Pages are built in later
          phases on top of this shared foundation.
        </Text>
      </Container>
    </main>
  );
}
