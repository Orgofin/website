import { THEME_STORAGE_KEY } from "@/lib/theme/config";

/**
 * Blocking, pre-hydration script that applies the correct theme class to
 * <html> before the first paint — the FOUC/"flash of incorrect theme" fix.
 *
 * It must run synchronously in <head>, before the body renders, which is why
 * it's a raw inlined string rather than a React effect (effects run after
 * paint, which is exactly when the flash would be visible). System preference
 * can only be read on the client, so this is the correct layer for it — a
 * server-read cookie alone cannot know the user's OS setting.
 */
export function ThemeScript() {
  const script = `(function(){try{var k=${JSON.stringify(
    THEME_STORAGE_KEY,
  )};var s=localStorage.getItem(k);var m=window.matchMedia("(prefers-color-scheme: dark)").matches;var dark=s==="dark"||((s===null||s==="system")&&m);var e=document.documentElement;e.classList.toggle("dark",dark);e.style.colorScheme=dark?"dark":"light";}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
