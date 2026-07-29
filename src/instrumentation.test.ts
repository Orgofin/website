import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * These tests defend one thing: that server-side `console` output never
 * becomes a Sentry breadcrumb.
 *
 * `beforeSend` scrubs `request` and `user`, but it cannot meaningfully scrub
 * breadcrumbs — a console breadcrumb's payload is arbitrary formatted text.
 * So the console is a second channel into Sentry with none of the guarantees
 * /privacy describes, and `lib/api/*` do log raw Supabase errors, which carry
 * submitted values in `details`.
 *
 * Dropping the integration is a one-line option that is equally easy to
 * delete by accident while tidying the init call. Hence a test.
 */

const init = vi.fn();

vi.mock("@sentry/nextjs", () => ({
  init: (...args: unknown[]) => init(...args),
  captureRequestError: vi.fn(),
}));

const mockEnv: { SENTRY_DSN: string | undefined } = { SENTRY_DSN: undefined };
vi.mock("@/env", () => ({
  get env() {
    return mockEnv;
  },
}));

async function register() {
  const instrumentation = await import("./instrumentation");
  await instrumentation.register();
}

type SentryOptions = {
  integrations: (defaults: { name: string }[]) => { name: string }[];
  sendDefaultPii: boolean;
  tracesSampleRate: number;
  beforeSend: unknown;
};

/** The options `register()` passed to `Sentry.init`, asserted to exist. */
function initOptions(): SentryOptions {
  const [firstCall] = init.mock.calls;
  expect(firstCall).toBeDefined();
  return firstCall![0] as SentryOptions;
}

/** Integration names surviving the filter, given a realistic default set. */
function keptIntegrations(): string[] {
  return initOptions()
    .integrations([
      { name: "Console" },
      { name: "Http" },
      { name: "OnUncaughtException" },
    ])
    .map((integration) => integration.name);
}

describe("Sentry registration", () => {
  beforeEach(() => {
    init.mockClear();
    vi.resetModules();
    mockEnv.SENTRY_DSN = "https://publickey@o0.ingest.sentry.io/1";
  });

  it("does not initialise without a DSN", async () => {
    mockEnv.SENTRY_DSN = undefined;
    await register();
    expect(init).not.toHaveBeenCalled();
  });

  it("drops the Console integration so console output never becomes a breadcrumb", async () => {
    await register();

    expect(keptIntegrations()).not.toContain("Console");
  });

  it("keeps every other default integration", async () => {
    await register();

    // Deny the console channel specifically — not a blanket opt-out that would
    // silently discard error handling we do want.
    expect(keptIntegrations()).toEqual(["Http", "OnUncaughtException"]);
  });

  it("never attaches PII and never samples traces", async () => {
    await register();

    const options = initOptions();
    expect(options.sendDefaultPii).toBe(false);
    expect(options.tracesSampleRate).toBe(0);
    expect(options.beforeSend).toBeTypeOf("function");
  });
});
