/*
  MerchDrop Landing Page - Home.tsx
  Design: "Bold Creator Economy"
  - Dark deep navy #0F0A1E background
  - Gradient purple→pink→orange accents (matching logo)
  - Syne display + Plus Jakarta Sans body
  - Sections: Nav, Hero, Stats, How It Works, Products, Earnings Calculator, Lead Form, Footer
*/

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import {
  ShoppingBag,
  Zap,
  TrendingUp,
  Star,
  ChevronDown,
  ArrowRight,
  Shirt,
  Package,
  Smartphone,
  Key,
  HardHat,
  CheckCircle2,
  Menu,
  X,
  ChevronUp,
} from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663450584758/XErJVV8ZFJdEBccSE4fBzi/merchdrop_logo_final_f25cafe4.png";
const HERO_BG_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663450584758/XErJVV8ZFJdEBccSE4fBzi/hero_bg-LrPNkhkGDtVxChzPeafo8J.webp";
const PRODUCTS_IMG_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663450584758/XErJVV8ZFJdEBccSE4fBzi/products_mockup-o5Tr3oejVRpHHmdtnhwFWE.webp";
const CREATOR_IMG_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663450584758/XErJVV8ZFJdEBccSE4fBzi/creator_hero-AexKffkpST8fiJqSJf9tor.webp";

// Scroll reveal hook
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// Count-up hook
function useCountUp(target: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// Stats section with count-up
function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const hours = useCountUp(48, 1500, visible);
  const products = useCountUp(100, 1500, visible);
  const commission = useCountUp(30, 1000, visible);

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
      {[
        { value: "100", suffix: "%", label: "Gratis att starta", icon: <Star className="w-6 h-6" /> },
        { value: products, suffix: "+", label: "Produkter att välja", icon: <Package className="w-6 h-6" /> },
        { value: commission, suffix: "%", label: "Provision till dig", icon: <TrendingUp className="w-6 h-6" /> },
      ].map((stat, i) => (
        <div key={i} className="text-center glass-card rounded-2xl p-8 reveal">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
            style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}>
            <span className="text-white">{stat.icon}</span>
          </div>
          <div className="font-['Syne'] text-5xl font-bold gradient-text mb-2">
            {stat.value}{stat.suffix}
          </div>
          <div className="text-muted-foreground font-['Plus_Jakarta_Sans']">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

// Earnings Calculator
function EarningsCalculator() {
  const [fans, setFans] = useState(500);
  const [price, setPrice] = useState(299);
  const conversionRate = 0.03;
  const commission = 0.30;
  const estimated = Math.round(fans * conversionRate * price * commission);

  return (
    <div className="glass-card rounded-3xl p-8 md:p-12 reveal">
      <div className="text-center mb-10">
        <h2 className="font-['Syne'] text-3xl md:text-4xl font-bold text-white mb-3">
          Hur mycket kan du tjäna?
        </h2>
        <p className="text-muted-foreground text-lg">
          Räkna ut din potentiella intäkt med vår kalkylator
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <label className="block text-sm font-semibold text-white mb-3 font-['Plus_Jakarta_Sans']">
            Antal följare / fans
          </label>
          <input
            type="range"
            min={100}
            max={100000}
            step={100}
            value={fans}
            onChange={(e) => setFans(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer mb-3"
            style={{
              background: `linear-gradient(to right, #7c3aed ${(fans / 100000) * 100}%, rgba(255,255,255,0.1) ${(fans / 100000) * 100}%)`
            }}
          />
          <div className="text-center font-['Space_Mono'] text-2xl font-bold gradient-text">
            {fans.toLocaleString("sv-SE")}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-white mb-3 font-['Plus_Jakarta_Sans']">
            Snittpris per produkt (kr)
          </label>
          <input
            type="range"
            min={99}
            max={699}
            step={10}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer mb-3"
            style={{
              background: `linear-gradient(to right, #ec4899 ${((price - 99) / 600) * 100}%, rgba(255,255,255,0.1) ${((price - 99) / 600) * 100}%)`
            }}
          />
          <div className="text-center font-['Space_Mono'] text-2xl font-bold gradient-text">
            {price} kr
          </div>
        </div>
      </div>
      <div className="text-center p-8 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(236,72,153,0.2))", border: "1px solid rgba(168,85,247,0.3)" }}>
        <p className="text-muted-foreground mb-2 font-['Plus_Jakarta_Sans']">Din uppskattade månadsintäkt</p>
        <div className="font-['Syne'] text-5xl md:text-6xl font-bold gradient-text mb-2">
          {estimated.toLocaleString("sv-SE")} kr
        </div>
        <p className="text-muted-foreground text-sm">
          Baserat på 3% konvertering och 30% provision
        </p>
      </div>
    </div>
  );
}

// Lead form
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="glass-card rounded-2xl overflow-hidden cursor-pointer reveal"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between p-6 gap-4">
        <h3 className="font-['Syne'] text-white font-semibold text-lg leading-snug">{question}</h3>
        <span
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
          style={{ background: open ? "linear-gradient(135deg, #7c3aed, #ec4899)" : "rgba(255,255,255,0.08)" }}
        >
          {open ? (
            <ChevronUp className="w-4 h-4 text-white" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/60" />
          )}
        </span>
      </div>
      {open && (
        <div className="px-6 pb-6">
          <p className="text-muted-foreground font-['Plus_Jakarta_Sans'] leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

function LeadForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    channel: "",
    description: "",
  });
  const [gdprConsent, setGdprConsent] = useState(false);
  const [, navigate] = useLocation();

  const subscribeMutation = trpc.leads.subscribe.useMutation({
    onSuccess: () => {
      navigate("/tack");
    },
    onError: (err) => {
      toast.error("Något gick fel. Försök igen eller kontakta oss direkt.");
      console.error("[Lead form error]", err);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.channel) {
      toast.error("Fyll i alla obligatoriska fält");
      return;
    }
    if (!gdprConsent) {
      toast.error("Du måste godkänna integritetspolicyn för att fortsätta");
      return;
    }
    const nameParts = form.name.trim().split(" ");
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(" ") || undefined;
    subscribeMutation.mutate({
      email: form.email,
      first_name,
      last_name,
      channel: form.channel,
      description: form.description,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-white font-semibold mb-2 block font-['Plus_Jakarta_Sans']">
            Ditt namn <span className="text-pink-400">*</span>
          </Label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Anna Svensson"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500 h-12"
          />
        </div>
        <div>
          <Label className="text-white font-semibold mb-2 block font-['Plus_Jakarta_Sans']">
            E-postadress <span className="text-pink-400">*</span>
          </Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="anna@example.com"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500 h-12"
          />
        </div>
      </div>
      <div>
        <Label className="text-white font-semibold mb-2 block font-['Plus_Jakarta_Sans']">
          Din sociala medie-länk (Instagram, TikTok, YouTube, etc.) <span className="text-pink-400">*</span>
        </Label>
        <Input
          value={form.channel}
          onChange={(e) => setForm({ ...form, channel: e.target.value })}
          placeholder="instagram.com/dittnamn eller @dittnamn"
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500 h-12"
        />
      </div>
      <div>
        <Label className="text-white font-semibold mb-2 block font-['Plus_Jakarta_Sans']">
          Berätta kort om dig själv (valfritt)
        </Label>
        <Textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Vad gör du, hur stor är din publik, vad vill du sälja?"
          rows={4}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500 resize-none"
        />
      </div>
      {/* GDPR Consent */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          role="checkbox"
          aria-checked={gdprConsent}
          onClick={() => setGdprConsent(!gdprConsent)}
          className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border transition-all ${
            gdprConsent
              ? "border-purple-500 bg-purple-500"
              : "border-white/20 bg-white/5 hover:border-purple-400"
          }`}
        >
          {gdprConsent && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
            </svg>
          )}
        </button>
        <span className="text-white/50 text-sm font-['Plus_Jakarta_Sans'] leading-relaxed">
          Jag godkänner att MerchDrop behandlar mina personuppgifter enligt{" "}
          <Link href="/integritetspolicy" className="text-purple-400 hover:text-pink-400 transition-colors underline underline-offset-2">
            integritetspolicyn
          </Link>
          . <span className="text-pink-400">*</span>
        </span>
      </div>

      <Button
        type="submit"
        disabled={subscribeMutation.isPending || !gdprConsent}
        className="w-full h-14 text-lg font-bold font-['Syne'] btn-gradient rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {subscribeMutation.isPending ? (
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Skickar...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Starta min gratis butik
            <ArrowRight className="w-5 h-5" />
          </span>
        )}
      </Button>
      <p className="text-center text-muted-foreground text-sm">
        100% gratis att komma igång. Inga dolda avgifter.
      </p>
    </form>
  );
}

export default function Home() {
  useScrollReveal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const products = [
    { icon: <Shirt className="w-8 h-8" />, name: "T-shirts", desc: "Klassiska och premium-tröjor i alla storlekar", color: "from-purple-500 to-pink-500" },
    { icon: <Package className="w-8 h-8" />, name: "Hoodies", desc: "Bekväma hoodies med ditt tryck", color: "from-pink-500 to-orange-500" },
    { icon: <HardHat className="w-8 h-8" />, name: "Kepsar", desc: "Snapbacks och dad hats med brodyr eller tryck", color: "from-orange-500 to-yellow-500" },
    { icon: <Key className="w-8 h-8" />, name: "Nyckelringar", desc: "Personliga nyckelringar som fans älskar", color: "from-yellow-500 to-green-500" },
    { icon: <Smartphone className="w-8 h-8" />, name: "Mobilskal", desc: "Skyddande skal för de populäraste modellerna", color: "from-green-500 to-teal-500" },
    { icon: <ShoppingBag className="w-8 h-8" />, name: "Muggar & Flaskor", desc: "Kaffemuggar, termosflaskor och dricksglas", color: "from-teal-500 to-blue-500" },
    { icon: <Package className="w-8 h-8" />, name: "Tygkassar", desc: "Hållbara tote bags och shoppingkassar", color: "from-blue-500 to-purple-500" },
    { icon: <Shirt className="w-8 h-8" />, name: "Affischer & Prints", desc: "Högkvalitativa prints i alla format", color: "from-purple-500 to-orange-500" },
    { icon: <ShoppingBag className="w-8 h-8" />, name: "Och mycket mer", desc: "Kan vi trycka på det - kan du sälja det", color: "from-orange-500 to-pink-500" },
  ];

  const steps = [
    {
      number: "01",
      title: "Anmäl dig",
      desc: "Fyll i formuläret nedan. Det tar 2 minuter och är helt gratis.",
      icon: <Zap className="w-6 h-6" />,
    },
    {
      number: "02",
      title: "Vi sätter upp din butik",
      desc: "Vårt team skapar din personliga merch-butik med ditt namn och din design.",
      icon: <ShoppingBag className="w-6 h-6" />,
    },
    {
      number: "03",
      title: "Dela med dina fans",
      desc: "Du får en unik länk som du delar i bio, stories eller var du vill.",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      number: "04",
      title: "Tjäna pengar",
      desc: "Vi hanterar produktion, frakt och kundservice. Du får 30% av varje order.",
      icon: <Star className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "backdrop-blur-xl border-b border-white/10" : ""
        }`}
        style={{ background: scrolled ? "rgba(15,10,30,0.85)" : "transparent" }}
      >
        <div className="container flex items-center justify-between h-16 md:h-20">
          <img src={LOGO_URL} alt="MerchDrop" className="h-10 md:h-12 w-auto" loading="eager" fetchPriority="high" width="200" height="48" />
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Hur det fungerar", id: "how-it-works" },
              { label: "Produkter", id: "products" },
              { label: "Kalkylator", id: "calculator" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-white/70 hover:text-white transition-colors font-['Plus_Jakarta_Sans'] text-sm font-medium"
              >
                {item.label}
              </button>
            ))}
            <Button
              onClick={() => scrollTo("signup")}
              className="btn-gradient rounded-full px-6 font-['Syne'] font-bold"
            >
              Kom igång gratis
            </Button>
          </div>
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 backdrop-blur-xl" style={{ background: "rgba(15,10,30,0.95)" }}>
            <div className="container py-6 flex flex-col gap-4">
              {[
                { label: "Hur det fungerar", id: "how-it-works" },
                { label: "Produkter", id: "products" },
                { label: "Kalkylator", id: "calculator" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-white/70 hover:text-white text-left font-['Plus_Jakarta_Sans'] py-2"
                >
                  {item.label}
                </button>
              ))}
              <Button
                onClick={() => scrollTo("signup")}
                className="btn-gradient rounded-full font-['Syne'] font-bold mt-2"
              >
                Kom igång gratis
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(to bottom, rgba(15,10,30,0.7) 0%, rgba(15,10,30,0.85) 100%), url(${HERO_BG_URL}) center/cover no-repeat`,
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl animate-blob"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl animate-blob"
          style={{ background: "radial-gradient(circle, #ec4899, transparent)", animationDelay: "-7s" }}
        />

        <div className="container relative z-10 text-center py-32 md:py-40">
          <h1 className="font-['Syne'] text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6">
            Din merch.
            <br />
            <span className="gradient-text">Dina regler.</span>
            <br />
            Vårt jobb.
          </h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-10 font-['Plus_Jakarta_Sans'] leading-relaxed">
            Vi sätter upp din personliga merch-butik, hanterar produktion och frakt - du delar länken och tjänar{" "}
            <span className="text-white font-bold">30% på varje försäljning</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => scrollTo("signup")}
              size="lg"
              className="btn-gradient rounded-full px-10 py-6 text-lg font-bold font-['Syne'] animate-pulse-glow"
            >
              Starta min butik gratis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => scrollTo("how-it-works")}
              variant="outline"
              size="lg"
              className="rounded-full px-10 py-6 text-lg font-['Syne'] border-white/20 text-white hover:bg-white/10"
            >
              Hur fungerar det?
              <ChevronDown className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-16 text-white/50 text-sm font-['Plus_Jakarta_Sans']">
            {["✓ Gratis att starta", "✓ Ingen lagerhållning", "✓ Vi sköter allt", "✓ 30% provision"].map((badge) => (
              <span key={badge} className="flex items-center gap-1">{badge}</span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/40" />
        </div>
      </section>

      {/* Platforms Band */}
      <section className="py-8 border-y border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="container">
          <p className="text-center text-white/30 text-xs uppercase tracking-widest font-['Plus_Jakarta_Sans'] mb-6">
            Perfekt för creators på
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
            {/* Instagram */}
            <div className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span className="font-semibold font-['Plus_Jakarta_Sans'] text-sm">Instagram</span>
            </div>
            {/* TikTok */}
            <div className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z"/>
              </svg>
              <span className="font-semibold font-['Plus_Jakarta_Sans'] text-sm">TikTok</span>
            </div>
            {/* YouTube */}
            <div className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="font-semibold font-['Plus_Jakarta_Sans'] text-sm">YouTube</span>
            </div>
            {/* Twitch */}
            <div className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
              </svg>
              <span className="font-semibold font-['Plus_Jakarta_Sans'] text-sm">Twitch</span>
            </div>
            {/* Podcast / Spotify */}
            <div className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              <span className="font-semibold font-['Plus_Jakarta_Sans'] text-sm">Spotify</span>
            </div>
            {/* Band / Artister */}
            <div className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
              <span className="font-semibold font-['Plus_Jakarta_Sans'] text-sm">Artister & Band</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container">
        <StatsSection />
      </section>

      {/* How It Works */}
      <section id="how-it-works" aria-label="Hur MerchDrop fungerar" className="py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{ background: "radial-gradient(ellipse at 50% 50%, #7c3aed, transparent 70%)" }}
        />
        <div className="container relative z-10">
          <div className="text-center mb-16 reveal">
            <p className="text-purple-400 font-semibold uppercase tracking-widest text-sm mb-4 font-['Plus_Jakarta_Sans']">
              Enkelt som 1-2-3-4
            </p>
            <h2 className="font-['Syne'] text-4xl md:text-5xl font-bold text-white mb-4">
              Hur det fungerar
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto font-['Plus_Jakarta_Sans']">
              Från anmälan till din första försäljning på under 48 timmar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className="gradient-border p-6 reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
                >
                  <span className="text-white">{step.icon}</span>
                </div>
                <div className="font-['Space_Mono'] text-4xl font-bold gradient-text mb-3 opacity-40">
                  {step.number}
                </div>
                <h3 className="font-['Syne'] text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-muted-foreground font-['Plus_Jakarta_Sans'] text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creator + Products Split Section */}
      <section id="products" aria-label="Produkter och fördelar med MerchDrop" className="py-24">
        <div className="container">
          {/* Creator image + text */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="reveal">
              <p className="text-pink-400 font-semibold uppercase tracking-widest text-sm mb-4 font-['Plus_Jakarta_Sans']">
                För creators, av creators
              </p>
              <h2 className="font-['Syne'] text-4xl md:text-5xl font-bold text-white mb-6">
                Fokusera på ditt{" "}
                <span className="gradient-text">innehåll</span>.
                <br />
                Vi fixar resten.
              </h2>
              <p className="text-muted-foreground text-lg font-['Plus_Jakarta_Sans'] leading-relaxed mb-8">
                Som influencer, artist eller band har du nog med att skapa innehåll och underhålla din publik. Merch ska inte vara ett heltidsjobb - det ska vara en passiv inkomst som bara rullar på.
              </p>
              <div className="space-y-4">
                {[
                  "Vi designar och sätter upp din butik",
                  "Vi hanterar tryck, produktion och frakt",
                  "Vi sköter kundservice och returer",
                  "Du får 30% av varje försäljning direkt",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 font-['Plus_Jakarta_Sans']">
                    <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span className="text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal">
              <div className="relative rounded-3xl overflow-hidden" style={{ boxShadow: "0 0 60px rgba(124,58,237,0.3)" }}>
                <img
                  src={CREATOR_IMG_URL}
                  alt="Creator som visar upp sin personliga merch från MerchDrop"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  width="800"
                  height="600"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,10,30,0.6) 0%, transparent 50%)" }} />
              </div>
            </div>
          </div>

          {/* Products grid */}
          <div className="text-center mb-12 reveal">
            <h2 className="font-['Syne'] text-4xl md:text-5xl font-bold text-white mb-4">
              Produkter vi erbjuder
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto font-['Plus_Jakarta_Sans']">
              Kvalitetsprodukter som dina fans faktiskt vill ha
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {products.map((product, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300 reveal cursor-default"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-gradient-to-br ${product.color}`}
                >
                  <span className="text-white">{product.icon}</span>
                </div>
                <h3 className="font-['Syne'] text-xl font-bold text-white mb-2">{product.name}</h3>
                <p className="text-muted-foreground font-['Plus_Jakarta_Sans'] text-sm">{product.desc}</p>
              </div>
            ))}
          </div>

          {/* Products image */}
          <div className="reveal rounded-3xl overflow-hidden" style={{ boxShadow: "0 0 80px rgba(236,72,153,0.2)" }}>
            <img
              src={PRODUCTS_IMG_URL}
              alt="MerchDrop produkter — t-shirts, hoodies, kepsar och mobilskal"
              className="w-full h-64 md:h-96 object-cover"
              loading="lazy"
              width="1200"
              height="400"
            />
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section id="calculator" aria-label="Intäktskalkylator" className="py-24 relative">
        <div
          className="absolute inset-0 opacity-5"
          style={{ background: "radial-gradient(ellipse at 50% 50%, #ec4899, transparent 70%)" }}
        />
        <div className="container relative z-10">
          <EarningsCalculator />
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" aria-label="Vanliga frågor om MerchDrop" className="py-24 relative">
        <div
          className="absolute inset-0 opacity-5"
          style={{ background: "radial-gradient(ellipse at 50% 50%, #7c3aed, transparent 70%)" }}
        />
        <div className="container relative z-10">
          <div className="text-center mb-12 reveal">
            <p className="text-purple-400 font-semibold uppercase tracking-widest text-sm mb-4 font-['Plus_Jakarta_Sans']">
              Vanliga frågor
            </p>
            <h2 className="font-['Syne'] text-4xl md:text-5xl font-bold text-white mb-4">
              Har du frågor?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto font-['Plus_Jakarta_Sans']">
              Här svarar vi på det du undrar
            </p>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            {[
              {
                q: "Hur lång tid tar det att sätta upp min butik?",
                a: "Vi sätter upp din personliga merch-butik inom 48 timmar efter att du skickat in din ansökan - förutsatt att vi får in alla uppgifter. Vi jobbar med ett begränsat antal creators åt gången för att säkerställa kvaliteten, så ju snabbare du anmäler dig desto snabbare får du din plats.",
              },
              {
                q: "Hur och när får jag min provision?",
                a: "Du får 30% av varje försäljning. Utbetalning sker månadsvis direkt till ditt bankkonto eller via Swish. Minsta utbetalningsbelopp är 200 kr.",
              },
              {
                q: "Kan jag välja vilka produkter jag vill sälja?",
                a: "Absolut! Vi erbjuder ett enormt sortiment - t-shirts, hoodies, kepsar, nyckelringar, mobilskal, muggar, tygkassar, affischer och mycket mer. Kan vi trycka på det, kan du sälja det. Vi hjälper dig att välja rätt mix för just din publik.",
              },
              {
                q: "Behöver jag ha en design eller logotyp?",
                a: "Det är en fördel men inget krav. Om du har en logotyp eller design laddar du upp den och vi sätter på produkterna. Har du ingen design kan vi hjälpa dig att skapa något enkelt - hör av dig så pratar vi.",
              },
              {
                q: "Vad kostar det att komma igång?",
                a: "Ingenting. Det är helt gratis att starta din butik. Vi tjänar pengar när du tjänar pengar - vi tar 70% av varje försäljning för att täcka produktion, frakt och kundservice. Inga dolda avgifter.",
              },
            ].map((item, i) => (
              <FaqItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Lead Form / Sign Up */}
      <section id="signup" aria-label="Anmäl dig till MerchDrop" className="py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12 reveal">
              {/* FOMO badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold font-['Plus_Jakarta_Sans']"
                style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(249,115,22,0.15))", border: "1px solid rgba(239,68,68,0.3)" }}>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400">Vi tar just nu emot nya creators - begränsat antal platser</span>
              </div>
              <p className="text-orange-400 font-semibold uppercase tracking-widest text-sm mb-4 font-['Plus_Jakarta_Sans']">
                Redo att sätta igång?
              </p>
              <h2 className="font-['Syne'] text-4xl md:text-5xl font-bold text-white mb-4">
                Starta din butik{" "}
                <span className="gradient-text">idag</span>
              </h2>
              <p className="text-muted-foreground text-lg font-['Plus_Jakarta_Sans']">
                Fyll i formuläret - vi hör av oss inom{" "}
                <span className="text-white font-semibold">48 timmar</span>{" "}
                och din butik är live.
              </p>
            </div>
            <div className="glass-card rounded-3xl p-8 md:p-10 reveal">
              <LeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-5">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="MerchDrop" className="h-8 w-auto" loading="lazy" width="160" height="32" />
              <span className="text-white/30 text-xs font-['Plus_Jakarta_Sans']">
                Din merch. Dina regler. Vårt jobb.
              </span>
            </div>
            <div className="flex items-center gap-4 text-white/30 text-xs font-['Plus_Jakarta_Sans']">
              <span>© {new Date().getFullYear()} MerchDrop</span>
              <Link href="/integritetspolicy" className="hover:text-purple-400 transition-colors">
                Integritetspolicy
              </Link>
              <span>
                Byggt av{" "}
                <a
                  href="https://conversify.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-pink-400 transition-colors"
                >
                  Conversify.io
                </a>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
