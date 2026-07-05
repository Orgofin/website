export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-16 text-center">
      <h1 className="text-2xl font-semibold">Orgofin</h1>
      <p className="text-muted-foreground max-w-md text-sm">
        The Operating System for Every Company. The real Home page (per{" "}
        <code>docs/product/copy.md</code> and{" "}
        <code>.claude/context/information-architecture.md</code>) is not built
        yet — this is a placeholder confirming the project scaffold works.
      </p>
    </main>
  );
}
