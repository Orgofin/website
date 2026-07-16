"use client";

import { useEffect, useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

type BrandId = "cobalt" | "aurum" | "indigo";

const BRANDS: ReadonlyArray<{ id: BrandId | null; label: string }> = [
  { id: null, label: "Current" },
  { id: "cobalt", label: "Cobalt Prime" },
  { id: "aurum", label: "Aurum Ledger" },
  { id: "indigo", label: "Indigo Meridian" },
];

const STORAGE_KEY = "orgofin-brand-preview";
const CHANGE_EVENT = "orgofin-brand-preview-change";

function readStored(): BrandId | null {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return BRANDS.some((b) => b.id === stored) ? (stored as BrandId) : null;
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * Dev/preview-only switcher for the experimental brand palettes in
 * `brands.css` (the co-founder theme review). Renders nothing unless the
 * build was made with NEXT_PUBLIC_BRAND_SWITCHER=1 — set in `.env.development`
 * for local dev and in Vercel's Preview environment only, so production
 * builds never include the UI. Selection persists per browser via
 * localStorage (server snapshot is null; useSyncExternalStore reconciles
 * after hydration). Deleted along with brands.css once a direction is chosen.
 */
export function BrandSwitcher() {
  const brand = useSyncExternalStore(subscribe, readStored, () => null);

  useEffect(() => {
    if (brand) document.documentElement.dataset.brand = brand;
    else delete document.documentElement.dataset.brand;
  }, [brand]);

  if (process.env.NEXT_PUBLIC_BRAND_SWITCHER !== "1") return null;

  const select = (next: BrandId | null) => {
    if (next) window.localStorage.setItem(STORAGE_KEY, next);
    else window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  return (
    <div
      role="group"
      aria-label="Brand palette preview (dev only)"
      className="glass-surface fixed bottom-4 left-4 z-50 flex items-center gap-1 rounded-full p-1"
    >
      {BRANDS.map((option) => (
        <button
          key={option.label}
          type="button"
          aria-pressed={brand === option.id}
          onClick={() => select(option.id)}
          className={cn(
            "text-micro ease-standard rounded-full px-3 py-1.5 font-medium transition-colors duration-[var(--motion-fast)]",
            brand === option.id
              ? "bg-accent text-on-accent"
              : "text-fg-muted hover:text-fg hover:bg-surface",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
