/*
  CookieBanner.tsx — GDPR-compliant cookie consent banner
  - Shows on first visit, hidden after choice
  - Stores consent in localStorage ("merchdrop_cookie_consent": "accepted" | "rejected")
  - Exposes a useCookieConsent hook for other components to check consent state
  - Design matches MerchDrop dark theme (glass-card style)
*/

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie, X, ShieldCheck } from "lucide-react";

const STORAGE_KEY = "merchdrop_cookie_consent";

export type ConsentStatus = "accepted" | "rejected" | null;

export function useCookieConsent(): ConsentStatus {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "accepted" || stored === "rejected") return stored;
  return null;
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Small delay so the page renders first
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = (status: "accepted" | "rejected") => {
    localStorage.setItem(STORAGE_KEY, status);
    setAnimateOut(true);
    setTimeout(() => setVisible(false), 400);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 transition-all duration-400 ${
        animateOut
          ? "opacity-0 translate-y-4"
          : "opacity-100 translate-y-0"
      }`}
      role="dialog"
      aria-label="Cookie-samtycke"
      aria-modal="false"
    >
      <div
        className="max-w-4xl mx-auto rounded-2xl border border-white/10 p-5 md:p-6 shadow-2xl"
        style={{
          background: "rgba(15, 10, 30, 0.95)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 -4px 40px rgba(124, 58, 237, 0.15), 0 4px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header row */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
          >
            <Cookie className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-['Syne'] text-white font-bold text-base md:text-lg leading-tight mb-1">
              Vi använder cookies
            </h2>
            <p className="text-white/60 text-sm font-['Plus_Jakarta_Sans'] leading-relaxed">
              Vi använder cookies för att förbättra din upplevelse och analysera hur sidan används.
              Du väljer själv om du vill tillåta detta.{" "}
              <a
                href="/integritetspolicy"
                className="text-purple-400 hover:text-pink-400 underline underline-offset-2 transition-colors"
              >
                Läs vår integritetspolicy
              </a>
              .
            </p>
          </div>
          {/* Close / reject shortcut */}
          <button
            onClick={() => dismiss("rejected")}
            aria-label="Avvisa cookies och stäng"
            className="flex-shrink-0 text-white/30 hover:text-white/70 transition-colors mt-0.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Expandable details */}
        {showDetails && (
          <div className="mb-4 rounded-xl border border-white/10 p-4 text-sm font-['Plus_Jakarta_Sans'] text-white/60 space-y-3">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-semibold block mb-0.5">Nödvändiga cookies</span>
                Krävs för att sidan ska fungera korrekt (session, säkerhet). Kan inte avaktiveras.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Cookie className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-semibold block mb-0.5">Analytiska cookies</span>
                Hjälper oss förstå hur besökare använder sidan (sidvisningar, klick, trafikkälla).
                Ingen personlig data sparas utan ditt samtycke.
              </div>
            </div>
          </div>
        )}

        {/* Action row */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-white/40 hover:text-white/70 text-xs font-['Plus_Jakarta_Sans'] underline underline-offset-2 transition-colors order-last sm:order-first"
          >
            {showDetails ? "Dölj detaljer" : "Visa detaljer"}
          </button>

          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => dismiss("rejected")}
              className="flex-1 sm:flex-none border-white/15 text-white/70 hover:text-white hover:border-white/30 bg-transparent font-['Plus_Jakarta_Sans'] text-sm"
            >
              Avvisa
            </Button>
            <Button
              size="sm"
              onClick={() => dismiss("accepted")}
              className="flex-1 sm:flex-none font-['Plus_Jakarta_Sans'] text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
            >
              Acceptera alla
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
