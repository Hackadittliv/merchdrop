/*
  MerchDrop Thank You / Confirmation Page
  Route: /tack
  Shown after successful lead form submission
  Includes AI DesignCreator as the main "wow moment"
*/

import { useEffect, useState } from "react";
import { Link, useSearch } from "wouter";
import { CheckCircle2, Mail, Clock, Zap, Star, ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DesignCreator } from "@/components/DesignCreator";

const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663450584758/XErJVV8ZFJdEBccSE4fBzi/merchdrop_logo_final_f25cafe4.png";

// Confetti particle
function ConfettiDot({ style }: { style: React.CSSProperties }) {
  return <div className="absolute rounded-full pointer-events-none" style={style} />;
}

function Confetti() {
  const dots = [
    { top: "10%", left: "5%", width: 10, height: 10, background: "#7c3aed", animationDelay: "0s" },
    { top: "20%", left: "15%", width: 6, height: 6, background: "#ec4899", animationDelay: "0.3s" },
    { top: "8%", left: "80%", width: 8, height: 8, background: "#f97316", animationDelay: "0.6s" },
    { top: "15%", left: "90%", width: 5, height: 5, background: "#a855f7", animationDelay: "0.2s" },
    { top: "30%", left: "92%", width: 9, height: 9, background: "#ec4899", animationDelay: "0.8s" },
    { top: "5%", left: "50%", width: 7, height: 7, background: "#7c3aed", animationDelay: "0.4s" },
    { top: "25%", left: "3%", width: 5, height: 5, background: "#f97316", animationDelay: "1s" },
    { top: "12%", left: "65%", width: 11, height: 11, background: "#a855f7", animationDelay: "0.1s" },
    { top: "35%", left: "75%", width: 6, height: 6, background: "#ec4899", animationDelay: "0.7s" },
    { top: "18%", left: "35%", width: 8, height: 8, background: "#7c3aed", animationDelay: "0.5s" },
  ];

  return (
    <>
      {dots.map((d, i) => (
        <ConfettiDot
          key={i}
          style={{
            top: d.top,
            left: d.left,
            width: d.width,
            height: d.height,
            background: d.background,
            opacity: 0.6,
            animation: `float 4s ease-in-out infinite`,
            animationDelay: d.animationDelay,
          }}
        />
      ))}
    </>
  );
}

export default function ThankYou() {
  const [visible, setVisible] = useState(false);
  const search = useSearch();
  const params = new URLSearchParams(search);
  const email = params.get("email") || "";

  useEffect(() => {
    document.title = "Tack för din ansökan! — MerchDrop";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Vi har tagit emot din ansökan och hör av oss inom 48 timmar för att sätta upp din personliga merch-butik.");
    window.scrollTo({ top: 0, behavior: "instant" });
    const t = setTimeout(() => setVisible(true), 50);
    return () => {
      clearTimeout(t);
      document.title = "MerchDrop — Din egna merch-butik | Gratis att starta";
      if (metaDesc) metaDesc.setAttribute("content", "Starta din personliga merch-butik gratis. MerchDrop hanterar produktion, tryck och frakt — du delar länken och tjänar 30% på varje försäljning.");
    };
  }, []);

  const steps = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Kolla din e-post",
      desc: "Vi har skickat ett bekräftelsemail till dig. Håll koll på inkorgen (och skräpposten).",
      color: "from-purple-500 to-pink-500",
      delay: "0ms",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Vi hör av oss inom 48h",
      desc: "Vårt team granskar din ansökan och kontaktar dig för att diskutera din butik.",
      color: "from-pink-500 to-orange-500",
      delay: "100ms",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Din butik sätts upp",
      desc: "Vi designar och lanserar din personliga merch-butik - helt utan att du behöver lyfta ett finger.",
      color: "from-orange-500 to-yellow-500",
      delay: "200ms",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Börja tjäna pengar",
      desc: "Dela länken med dina fans och se provisionen rulla in. 30% på varje försäljning.",
      color: "from-yellow-500 to-purple-500",
      delay: "300ms",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Minimal nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/10"
        style={{ background: "rgba(15,10,30,0.85)" }}
      >
        <div className="container flex items-center h-16 md:h-20">
          <Link href="/">
            <img src={LOGO_URL} alt="MerchDrop" className="h-10 md:h-12 w-auto cursor-pointer" />
          </Link>
        </div>
      </nav>

      {/* Hero confirmation block */}
      <section className="relative overflow-hidden pt-28 pb-16">
        {/* Background glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #7c3aed, #ec4899, transparent)" }}
        />
        <Confetti />

        <div
          className={`container relative z-10 text-center transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Success icon */}
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 mx-auto"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              boxShadow: "0 0 60px rgba(124,58,237,0.5)",
            }}
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>

          <h1 className="font-['Syne'] text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Du är med på listan! 🚀
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto mb-4 font-['Plus_Jakarta_Sans'] leading-relaxed">
            Vi har tagit emot din ansökan och hör av oss inom{" "}
            <span className="text-white font-bold">48 timmar</span>.
          </p>

          {/* Email reminder pill */}
          <div
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full mb-12 font-['Plus_Jakarta_Sans'] text-sm font-medium"
            style={{
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(168,85,247,0.3)",
              color: "#c084fc",
            }}
          >
            <Mail className="w-4 h-4" />
            Kolla din e-post — vi har skickat en bekräftelse
          </div>
        </div>
      </section>

      {/* ── AI DESIGN CREATOR SECTION ── */}
      <section className="py-8 pb-20 relative">
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: "radial-gradient(ellipse at 50% 0%, #7c3aed, transparent 60%)" }}
        />
        <div className="container relative z-10 max-w-2xl mx-auto">
          {/* Divider with label */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold font-['Syne']"
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(236,72,153,0.3))",
                border: "1px solid rgba(168,85,247,0.4)",
                color: "#e879f9",
              }}
            >
              <Sparkles className="w-4 h-4" />
              Bonus för dig
            </div>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Design creator card */}
          <div
            className="rounded-3xl p-6 md:p-10"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
            }}
          >
            {email ? (
              <DesignCreator email={email} />
            ) : (
              /* Fallback if no email in URL */
              <div className="text-center py-8">
                <Sparkles className="w-10 h-10 mx-auto mb-4" style={{ color: "#a855f7" }} />
                <h3 className="font-['Syne'] text-xl font-bold text-white mb-2">
                  Skapa din merch-design
                </h3>
                <p className="text-white/50 font-['Plus_Jakarta_Sans'] text-sm mb-6">
                  Kontakta oss på hej@merchdrop.se så hjälper vi dig skapa en unik design!
                </p>
                <a
                  href="mailto:hej@merchdrop.se"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold font-['Syne'] text-white"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
                >
                  Kontakta oss
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* What happens next */}
      <section className="py-16 relative">
        <div className="container max-w-4xl mx-auto">
          <h2 className="font-['Syne'] text-2xl md:text-3xl font-bold text-white mb-10 text-center">
            Vad händer nu?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {steps.map((step, i) => (
              <div
                key={i}
                className="text-left rounded-2xl p-6 transition-all duration-700"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  transitionDelay: step.delay,
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                }}
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-gradient-to-br ${step.color}`}
                >
                  <span className="text-white">{step.icon}</span>
                </div>
                <div
                  className="font-['Space_Mono'] text-3xl font-bold mb-2 opacity-30"
                  style={{
                    background: "linear-gradient(135deg, #a855f7, #ec4899)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  0{i + 1}
                </div>
                <h3 className="font-['Syne'] text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white/50 font-['Plus_Jakarta_Sans'] text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Social share nudge */}
          <div
            className="max-w-lg mx-auto rounded-3xl p-8 mb-12 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(236,72,153,0.15))",
              border: "1px solid rgba(168,85,247,0.25)",
            }}
          >
            <ShoppingBag className="w-8 h-8 mx-auto mb-4" style={{ color: "#a855f7" }} />
            <h3 className="font-['Syne'] text-xl font-bold text-white mb-3">
              Tipsa en vän?
            </h3>
            <p className="text-white/60 font-['Plus_Jakarta_Sans'] text-sm mb-5 leading-relaxed">
              Känner du en influencer, artist eller band som också vill ha sin egen merch-butik utan krångel? Dela MerchDrop med dem!
            </p>
            <Button
              asChild
              className="font-['Syne'] font-bold rounded-full px-8"
              style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", border: "none" }}
            >
              <a
                href="https://merchdrop.se"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Dela MerchDrop
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </div>

          {/* Back to home */}
          <div className="text-center">
            <Link href="/">
              <button className="text-white/40 hover:text-white/70 transition-colors font-['Plus_Jakarta_Sans'] text-sm underline underline-offset-4">
                Tillbaka till startsidan
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-5">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30 font-['Plus_Jakarta_Sans']">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="MerchDrop" className="h-6 w-auto opacity-60" />
              <span>© {new Date().getFullYear()} MerchDrop. Alla rättigheter förbehållna.</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/integritetspolicy" className="hover:text-white/60 transition-colors">
                Integritetspolicy
              </Link>
              <span>|</span>
              <a
                href="https://conversify.io"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-400 transition-colors"
              >
                Byggt av Conversify.io
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
