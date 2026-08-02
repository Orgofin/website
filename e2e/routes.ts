import sitemap from "@/app/sitemap";

/**
 * The route list every E2E spec iterates, derived from `app/sitemap.ts` rather
 * than typed out here.
 *
 * That indirection is the point. A hardcoded list can only ever confirm what
 * its author already believed: it silently skips a route added last week and
 * keeps passing for a route that was deleted. Deriving from the sitemap means
 * shipping a page automatically enrols it in the smoke, accessibility and
 * responsive sweeps, and the coverage cannot quietly drift from what search
 * engines are told exists.
 *
 * Routes deliberately absent from the sitemap are absent here too and need
 * their own explicit tests if they need any:
 *   /waitlist/thank-you   noindex confirmation page
 *   /investors/data-room  noindex, gated
 */
export const ROUTES: string[] = sitemap().map(
  (entry) => new URL(entry.url).pathname || "/",
);

/** Named for readability in `test.describe` titles. */
export const routeLabel = (path: string) => (path === "/" ? "/ (home)" : path);
