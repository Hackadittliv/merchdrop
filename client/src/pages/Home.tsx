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

  const creators = useCountUp(500, 2000, visible);
  const products = useCountUp(30, 1500, visible);
  const commission = useCountUp(30, 1000, visible);

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
      {[
        { value: creators, suffix: "+", label: "Aktiva creators", icon: <Star className="w-6 h-6" /> },
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
function LeadForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    channel: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.channel) {
      toast.error("Fyll i alla obligatoriska fält");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    toast.success("Tack! Vi hör av oss inom 24 timmar 🎉");
  };

  if (submitted) {
    return (
      <div className="text-center py-16 reveal">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 animate-pulse-glow"
          style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}>
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h3 className="font-['Syne'] text-3xl font-bold text-white mb-4">Du är med på listan! 🚀</h3>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Vi har tagit emot din ansökan och hör av oss inom 24 timmar för att sätta upp din butik.
        </p>
      </div>
    );
  }

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
          Din kanal / länk (Instagram, YouTube, TikTok, etc.) <span className="text-pink-400">*</span>
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
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-14 text-lg font-bold font-['Syne'] btn-gradient rounded-xl"
      >
        {loading ? (
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
    { icon: <ShoppingBag className="w-8 h-8" />, name: "Mer på väg", desc: "Vi utökar sortimentet hela tiden", color: "from-teal-500 to-purple-500" },
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
          <img src={LOGO_URL} alt="MerchDrop" className="h-10 md:h-12 w-auto" />
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

      {/* Stats Section */}
      <section className="container">
        <StatsSection />
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative overflow-hidden">
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
      <section id="products" className="py-24">
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
                  alt="Creator med merch"
                  className="w-full h-auto object-cover"
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
              alt="MerchDrop produkter"
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section id="calculator" className="py-24 relative">
        <div
          className="absolute inset-0 opacity-5"
          style={{ background: "radial-gradient(ellipse at 50% 50%, #ec4899, transparent 70%)" }}
        />
        <div className="container relative z-10">
          <EarningsCalculator />
        </div>
      </section>

      {/* Lead Form / Sign Up */}
      <section id="signup" className="py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12 reveal">
              <p className="text-orange-400 font-semibold uppercase tracking-widest text-sm mb-4 font-['Plus_Jakarta_Sans']">
                Redo att sätta igång?
              </p>
              <h2 className="font-['Syne'] text-4xl md:text-5xl font-bold text-white mb-4">
                Starta din butik{" "}
                <span className="gradient-text">idag</span>
              </h2>
              <p className="text-muted-foreground text-lg font-['Plus_Jakarta_Sans']">
                Fyll i formuläret så hör vi av oss inom 24 timmar för att sätta upp din personliga merch-butik.
              </p>
            </div>
            <div className="glass-card rounded-3xl p-8 md:p-10 reveal">
              <LeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src={LOGO_URL} alt="MerchDrop" className="h-8 w-auto" />
              <span className="text-muted-foreground text-sm font-['Plus_Jakarta_Sans']">
                Din merch. Dina regler. Vårt jobb.
              </span>
            </div>
            <div className="text-muted-foreground text-sm font-['Plus_Jakarta_Sans'] text-center md:text-right">
              <p>© {new Date().getFullYear()} MerchDrop. Alla rättigheter förbehållna.</p>
              <p className="mt-1">
                Drivet av ett{" "}
                <span className="text-purple-400">svenskt tryckeri</span>{" "}
                med lång erfarenhet.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
