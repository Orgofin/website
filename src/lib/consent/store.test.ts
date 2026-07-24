import { beforeEach, describe, expect, it, vi } from "vitest";

import { CONSENT_STORAGE_KEY } from "@/lib/consent/config";
import {
  getConsent,
  resetConsentCache,
  setConsent,
  subscribeConsent,
} from "@/lib/consent/store";

beforeEach(() => {
  localStorage.clear();
  resetConsentCache();
});

describe("consent store", () => {
  it("reports `unset` when nothing has been decided", () => {
    expect(getConsent()).toBe("unset");
  });

  it("persists a granted decision", () => {
    setConsent("granted");

    expect(getConsent()).toBe("granted");
    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("granted");
  });

  it("persists a declined decision distinguishably from undecided", () => {
    setConsent("denied");

    // The distinction is the whole point: a visitor who declined must not be
    // asked again, so `denied` can never collapse into `unset`.
    expect(getConsent()).toBe("denied");
    expect(getConsent()).not.toBe("unset");
  });

  it("reads a decision persisted by a previous visit", () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
    resetConsentCache();

    expect(getConsent()).toBe("granted");
  });

  it("treats a corrupted stored value as undecided", () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, "yes-please");
    resetConsentCache();

    expect(getConsent()).toBe("unset");
  });

  it("notifies subscribers when a decision is made", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeConsent(listener);

    setConsent("granted");

    expect(listener).toHaveBeenCalledOnce();
    unsubscribe();
  });

  it("stops notifying after unsubscribe", () => {
    const listener = vi.fn();
    subscribeConsent(listener)();

    setConsent("denied");

    expect(listener).not.toHaveBeenCalled();
  });

  it("adopts a decision made in another tab", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeConsent(listener);

    // Another tab writes the decision; this tab only sees the storage event.
    localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
    window.dispatchEvent(
      new StorageEvent("storage", { key: CONSENT_STORAGE_KEY }),
    );

    expect(getConsent()).toBe("granted");
    expect(listener).toHaveBeenCalled();
    unsubscribe();
  });

  it("ignores storage events for unrelated keys", () => {
    setConsent("granted");
    const listener = vi.fn();
    const unsubscribe = subscribeConsent(listener);

    localStorage.setItem("orgofin-theme", "dark");
    window.dispatchEvent(new StorageEvent("storage", { key: "orgofin-theme" }));

    expect(getConsent()).toBe("granted");
    expect(listener).not.toHaveBeenCalled();
    unsubscribe();
  });
});
