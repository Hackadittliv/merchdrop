/*
  useMetaPixel.ts
  ───────────────
  Consent-gated Meta Pixel integration for MerchDrop.

  Flow:
  1. On mount, check localStorage for "merchdrop_cookie_consent".
  2. If "accepted" → grant consent, init pixel, fire PageView.
  3. If not yet decided → listen for storage events (user accepts in CookieBanner).
  4. Exports `trackLead(email?)` for use in the lead form after submission.

  The fbq stub is already loaded in index.html with fbq('consent','revoke').
  This hook only calls fbq('consent','grant') + fbq('init') + fbq('track') after
  the user explicitly accepts cookies.
*/

import { useEffect } from "react";

const PIXEL_ID = "926945980052624";
const STORAGE_KEY = "merchdrop_cookie_consent";

// Type declaration for fbq on window
declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

function initPixel() {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("consent", "grant");
  window.fbq("init", PIXEL_ID);
  window.fbq("track", "PageView");
}

/** Call this after a successful lead form submission */
export function trackLead(email?: string) {
  if (typeof window === "undefined" || !window.fbq) return;
  const consent = localStorage.getItem(STORAGE_KEY);
  if (consent !== "accepted") return;
  window.fbq("track", "Lead", email ? { em: email } : {});
}

/** Mount once at app root — handles init + consent change listening */
export function useMetaPixel() {
  useEffect(() => {
    // Check current consent
    const current = localStorage.getItem(STORAGE_KEY);
    if (current === "accepted") {
      initPixel();
      return;
    }

    // Listen for consent being granted later (CookieBanner sets localStorage)
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue === "accepted") {
        initPixel();
      }
    };

    // Also poll for same-tab changes (localStorage events don't fire in same tab)
    let initialized = false;
    const interval = setInterval(() => {
      if (initialized) return;
      const val = localStorage.getItem(STORAGE_KEY);
      if (val === "accepted") {
        initialized = true;
        clearInterval(interval);
        initPixel();
      }
    }, 500);

    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
    };
  }, []);
}
