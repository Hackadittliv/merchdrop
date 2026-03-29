/*
  DesignCreator.tsx
  AI-powered design creator for MerchDrop.
  Flow: Brief form → Loading → Mockup carousel (5 products) → CTA
*/

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Shirt,
  Package,
  Smartphone,
  ShoppingBag,
  HardHat,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Download,
  Lock,
  ArrowRight,
  Loader2,
} from "lucide-react";

// ─── Product definitions ──────────────────────────────────────────────────────

const PRODUCTS = [
  {
    id: "tshirt",
    label: "T-shirt",
    icon: <Shirt className="w-5 h-5" />,
    // Design placement: centered on chest area
    placement: { top: "22%", left: "50%", width: "46%", transform: "translateX(-50%)" },
    bg: "#1a1a2e",
    mockupStyle: "tshirt",
  },
  {
    id: "hoodie",
    label: "Hoodie",
    icon: <Package className="w-5 h-5" />,
    placement: { top: "24%", left: "50%", width: "44%", transform: "translateX(-50%)" },
    bg: "#2d1b4e",
    mockupStyle: "hoodie",
  },
  {
    id: "cap",
    label: "Keps",
    icon: <HardHat className="w-5 h-5" />,
    placement: { top: "38%", left: "50%", width: "32%", transform: "translateX(-50%)" },
    bg: "#1a2e1a",
    mockupStyle: "cap",
  },
  {
    id: "totebag",
    label: "Tygkasse",
    icon: <ShoppingBag className="w-5 h-5" />,
    placement: { top: "28%", left: "50%", width: "48%", transform: "translateX(-50%)" },
    bg: "#2e2a1a",
    mockupStyle: "totebag",
  },
  {
    id: "phonecase",
    label: "Mobilskal",
    icon: <Smartphone className="w-5 h-5" />,
    placement: { top: "20%", left: "50%", width: "36%", transform: "translateX(-50%)" },
    bg: "#1a2a2e",
    mockupStyle: "phonecase",
  },
];

// ─── SVG Mockup shapes ────────────────────────────────────────────────────────

function TshirtSVG({ color = "#2a2a2a" }: { color?: string }) {
  return (
    <svg viewBox="0 0 300 320" className="w-full h-full" fill="none">
      <path
        d="M75 20 L30 70 L70 85 L60 280 L240 280 L230 85 L270 70 L225 20 L190 40 C185 55 175 65 150 65 C125 65 115 55 110 40 Z"
        fill={color}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
      />
    </svg>
  );
}

function HoodieSVG({ color = "#3a2a5e" }: { color?: string }) {
  return (
    <svg viewBox="0 0 300 340" className="w-full h-full" fill="none">
      <path
        d="M75 25 L25 80 L65 95 L55 295 L245 295 L235 95 L275 80 L225 25 C210 50 190 70 150 75 C110 70 90 50 75 25 Z"
        fill={color}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
      />
      {/* Hood */}
      <path
        d="M110 25 C110 5 135 0 150 0 C165 0 190 5 190 25 C185 45 175 60 150 65 C125 60 115 45 110 25 Z"
        fill={color}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
      />
      {/* Pocket */}
      <rect x="110" y="200" width="80" height="50" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
    </svg>
  );
}

function CapSVG({ color = "#1a3a1a" }: { color?: string }) {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-full" fill="none">
      {/* Brim */}
      <ellipse cx="150" cy="165" rx="130" ry="20" fill={color} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      {/* Crown */}
      <path
        d="M50 160 C50 80 80 30 150 25 C220 30 250 80 250 160 Z"
        fill={color}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
      />
      {/* Front panel seam */}
      <line x1="150" y1="25" x2="150" y2="160" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
    </svg>
  );
}

function TotebagSVG({ color = "#3a3010" }: { color?: string }) {
  return (
    <svg viewBox="0 0 280 320" className="w-full h-full" fill="none">
      {/* Bag body */}
      <rect x="30" y="80" width="220" height="220" rx="8" fill={color} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      {/* Handles */}
      <path d="M90 80 C90 30 120 15 140 15 C160 15 190 30 190 80" stroke="rgba(255,255,255,0.3)" strokeWidth="8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function PhonecaseSVG({ color = "#103a3a" }: { color?: string }) {
  return (
    <svg viewBox="0 0 180 320" className="w-full h-full" fill="none">
      <rect x="10" y="10" width="160" height="300" rx="24" fill={color} stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
      {/* Camera bump */}
      <rect x="30" y="25" width="50" height="35" rx="10" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <circle cx="45" cy="42" r="10" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <circle cx="68" cy="42" r="8" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
    </svg>
  );
}

// ─── Watermark overlay ────────────────────────────────────────────────────────

function WatermarkOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
      {/* Diagonal watermark text */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="absolute text-white/20 font-bold text-xs tracking-widest select-none"
          style={{
            top: `${10 + i * 18}%`,
            left: "-10%",
            transform: "rotate(-35deg)",
            whiteSpace: "nowrap",
            fontSize: "11px",
            letterSpacing: "0.15em",
          }}
        >
          MERCHDROP PREVIEW • MERCHDROP PREVIEW • MERCHDROP PREVIEW
        </div>
      ))}
    </div>
  );
}

// ─── Product Mockup Card ──────────────────────────────────────────────────────

function MockupCard({
  product,
  designUrl,
}: {
  product: (typeof PRODUCTS)[0];
  designUrl: string;
}) {
  const renderMockup = () => {
    switch (product.mockupStyle) {
      case "tshirt": return <TshirtSVG />;
      case "hoodie": return <HoodieSVG />;
      case "cap": return <CapSVG />;
      case "totebag": return <TotebagSVG />;
      case "phonecase": return <PhonecaseSVG />;
      default: return <TshirtSVG />;
    }
  };

  return (
    <div
      className="relative rounded-3xl overflow-hidden flex items-center justify-center"
      style={{
        background: `radial-gradient(ellipse at 50% 30%, ${product.bg}ee, #0a0a1a)`,
        minHeight: "380px",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, #7c3aed40, transparent 70%)`,
        }}
      />

      {/* Product mockup */}
      <div className="relative w-56 h-64">
        {renderMockup()}

        {/* Design overlay on product */}
        <div
          className="absolute"
          style={{
            top: product.placement.top,
            left: product.placement.left,
            width: product.placement.width,
            transform: product.placement.transform,
          }}
        >
          <img
            src={designUrl}
            alt="Din design"
            className="w-full h-auto object-contain"
            style={{
              mixBlendMode: "screen",
              opacity: 0.9,
              borderRadius: "4px",
            }}
          />
        </div>
      </div>

      {/* Watermark */}
      <WatermarkOverlay />

      {/* Product label */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full text-white/70 text-sm font-['Plus_Jakarta_Sans']"
        style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}
      >
        {product.icon}
        {product.label}
      </div>
    </div>
  );
}

// ─── Brief Form ───────────────────────────────────────────────────────────────

const INDUSTRIES = [
  "Fitness & Träning",
  "Gaming",
  "Musik & Artist",
  "Mode & Livsstil",
  "Mat & Dryck",
  "Sport",
  "Comedy & Humor",
  "Resor & Äventyr",
  "Business & Entrepreneurship",
  "Annat",
];

const VIBES = [
  "Bold streetwear",
  "Minimalistisk & clean",
  "Retro / vintage",
  "Dark & edgy",
  "Colorful & playful",
  "Surf / outdoor",
  "Luxury & premium",
  "Gothic / metal",
];

const COLORS = [
  "Svart & vitt",
  "Svart & guld",
  "Navy & vit",
  "Pastell",
  "Neon & färgglad",
  "Monokrom",
  "Varm (röd/orange/gul)",
  "Kall (blå/lila/grön)",
];

interface BriefFormProps {
  email: string;
  onGenerate: (brief: {
    industry: string;
    vibe: string;
    slogan: string;
    colorPreference: string;
  }) => void;
  isLoading: boolean;
}

function BriefForm({ email, onGenerate, isLoading }: BriefFormProps) {
  const [industry, setIndustry] = useState("");
  const [vibe, setVibe] = useState("");
  const [slogan, setSlogan] = useState("");
  const [color, setColor] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!industry || !vibe) {
      toast.error("Välj bransch och känsla för att fortsätta");
      return;
    }
    onGenerate({ industry, vibe, slogan, colorPreference: color });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Industry */}
      <div>
        <Label className="text-white font-semibold mb-3 block font-['Plus_Jakarta_Sans']">
          Din bransch / nisch <span className="text-pink-400">*</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind}
              type="button"
              onClick={() => setIndustry(ind)}
              className="px-4 py-2 rounded-full text-sm font-['Plus_Jakarta_Sans'] transition-all duration-200"
              style={{
                background: industry === ind
                  ? "linear-gradient(135deg, #7c3aed, #ec4899)"
                  : "rgba(255,255,255,0.06)",
                border: industry === ind
                  ? "1px solid transparent"
                  : "1px solid rgba(255,255,255,0.1)",
                color: industry === ind ? "white" : "rgba(255,255,255,0.6)",
              }}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Vibe */}
      <div>
        <Label className="text-white font-semibold mb-3 block font-['Plus_Jakarta_Sans']">
          Känsla / stil <span className="text-pink-400">*</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {VIBES.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVibe(v)}
              className="px-4 py-2 rounded-full text-sm font-['Plus_Jakarta_Sans'] transition-all duration-200"
              style={{
                background: vibe === v
                  ? "linear-gradient(135deg, #7c3aed, #ec4899)"
                  : "rgba(255,255,255,0.06)",
                border: vibe === v
                  ? "1px solid transparent"
                  : "1px solid rgba(255,255,255,0.1)",
                color: vibe === v ? "white" : "rgba(255,255,255,0.6)",
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Slogan */}
      <div>
        <Label className="text-white font-semibold mb-2 block font-['Plus_Jakarta_Sans']">
          Text / slogan på designen{" "}
          <span className="text-white/40 font-normal text-xs">(valfritt)</span>
        </Label>
        <Input
          value={slogan}
          onChange={(e) => setSlogan(e.target.value)}
          placeholder="T.ex. 'No Pain, No Story' eller ditt namn"
          maxLength={60}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500 h-12"
        />
      </div>

      {/* Color */}
      <div>
        <Label className="text-white font-semibold mb-3 block font-['Plus_Jakarta_Sans']">
          Färgpalett{" "}
          <span className="text-white/40 font-normal text-xs">(valfritt)</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c === color ? "" : c)}
              className="px-4 py-2 rounded-full text-sm font-['Plus_Jakarta_Sans'] transition-all duration-200"
              style={{
                background: color === c
                  ? "linear-gradient(135deg, #7c3aed, #ec4899)"
                  : "rgba(255,255,255,0.06)",
                border: color === c
                  ? "1px solid transparent"
                  : "1px solid rgba(255,255,255,0.1)",
                color: color === c ? "white" : "rgba(255,255,255,0.6)",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !industry || !vibe}
        className="w-full h-14 text-lg font-bold font-['Syne'] rounded-full"
        style={{
          background: "linear-gradient(135deg, #7c3aed, #ec4899)",
          border: "none",
          opacity: (!industry || !vibe) ? 0.5 : 1,
        }}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Skapar din design...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Skapa min design
          </>
        )}
      </Button>

      <p className="text-center text-white/30 text-xs font-['Plus_Jakarta_Sans']">
        1 gratis design per anmälan • Tryckfil levereras när din butik är godkänd
      </p>
    </form>
  );
}

// ─── Main DesignCreator component ─────────────────────────────────────────────

interface DesignCreatorProps {
  email: string;
}

export function DesignCreator({ email }: DesignCreatorProps) {
  const [step, setStep] = useState<"brief" | "loading" | "result">("brief");
  const [designUrl, setDesignUrl] = useState<string | null>(null);
  const [activeProduct, setActiveProduct] = useState(0);

  const generateMutation = trpc.designs.generate.useMutation({
    onSuccess: (data) => {
      setDesignUrl(data.designUrl);
      setStep("result");
    },
    onError: (err) => {
      console.error("[DesignCreator] Generation error:", err);
      toast.error("Något gick fel vid designgenerering. Försök igen.");
      setStep("brief");
    },
  });

  const handleGenerate = (brief: {
    industry: string;
    vibe: string;
    slogan: string;
    colorPreference: string;
  }) => {
    setStep("loading");
    generateMutation.mutate({ email, ...brief });
  };

  // ── Loading state ──
  if (step === "loading") {
    return (
      <div className="text-center py-16">
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 animate-pulse"
          style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
        >
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h3 className="font-['Syne'] text-2xl font-bold text-white mb-3">
          Skapar din unika design...
        </h3>
        <p className="text-white/50 font-['Plus_Jakarta_Sans'] mb-8">
          Vår AI arbetar hårt. Det tar ungefär 15–20 sekunder.
        </p>
        <div className="flex justify-center gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full animate-bounce"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // ── Result state ──
  if (step === "result" && designUrl) {
    return (
      <div>
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 font-['Plus_Jakarta_Sans']"
            style={{ background: "rgba(124,58,237,0.2)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.3)" }}
          >
            <Sparkles className="w-4 h-4" />
            Din design är klar!
          </div>
          <h3 className="font-['Syne'] text-2xl md:text-3xl font-bold text-white mb-2">
            Så här ser den ut på dina produkter
          </h3>
          <p className="text-white/50 font-['Plus_Jakarta_Sans'] text-sm">
            Bläddra mellan produkterna nedan
          </p>
        </div>

        {/* Product tabs */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {PRODUCTS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActiveProduct(i)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-['Plus_Jakarta_Sans'] transition-all duration-200"
              style={{
                background: activeProduct === i
                  ? "linear-gradient(135deg, #7c3aed, #ec4899)"
                  : "rgba(255,255,255,0.06)",
                border: activeProduct === i
                  ? "1px solid transparent"
                  : "1px solid rgba(255,255,255,0.1)",
                color: activeProduct === i ? "white" : "rgba(255,255,255,0.6)",
              }}
            >
              {p.icon}
              {p.label}
            </button>
          ))}
        </div>

        {/* Mockup */}
        <div className="relative mb-6">
          <MockupCard product={PRODUCTS[activeProduct]} designUrl={designUrl} />

          {/* Navigation arrows */}
          <button
            onClick={() => setActiveProduct((prev) => (prev - 1 + PRODUCTS.length) % PRODUCTS.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => setActiveProduct((prev) => (prev + 1) % PRODUCTS.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* CTA box */}
        <div
          className="rounded-3xl p-6 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(236,72,153,0.15))",
            border: "1px solid rgba(168,85,247,0.25)",
          }}
        >
          <Lock className="w-6 h-6 mx-auto mb-3" style={{ color: "#a855f7" }} />
          <h4 className="font-['Syne'] text-lg font-bold text-white mb-2">
            Vill du ha tryckfilen?
          </h4>
          <p className="text-white/50 font-['Plus_Jakarta_Sans'] text-sm mb-5 leading-relaxed">
            Din tryckklara fil (300 DPI, transparent bakgrund) levereras när din butik är godkänd av MerchDrop-teamet. Vi hör av oss inom 48 timmar!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <div
              className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold font-['Plus_Jakarta_Sans'] text-white/40 cursor-not-allowed"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <Download className="w-4 h-4" />
              Ladda ner tryckfil
              <span
                className="ml-1 px-2 py-0.5 rounded-full text-xs"
                style={{ background: "rgba(168,85,247,0.3)", color: "#c084fc" }}
              >
                Låst
              </span>
            </div>
            <a
              href="mailto:hej@merchdrop.se?subject=Min design är klar!"
              className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold font-['Plus_Jakarta_Sans'] text-white transition-all"
              style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
            >
              Kontakta oss
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── Brief form ──
  return (
    <div>
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 font-['Plus_Jakarta_Sans']"
          style={{ background: "rgba(124,58,237,0.2)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.3)" }}
        >
          <Sparkles className="w-4 h-4" />
          Exklusivt för dig som anmält dig
        </div>
        <h3 className="font-['Syne'] text-2xl md:text-3xl font-bold text-white mb-2">
          Skapa din unika merch-design
        </h3>
        <p className="text-white/50 font-['Plus_Jakarta_Sans'] text-sm leading-relaxed max-w-md mx-auto">
          Berätta lite om dig och din stil – vår AI skapar en helt unik design åt dig på sekunder.
        </p>
      </div>
      <BriefForm email={email} onGenerate={handleGenerate} isLoading={generateMutation.isPending} />
    </div>
  );
}
