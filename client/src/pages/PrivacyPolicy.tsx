/*
  MerchDrop - Integritetspolicy
  GDPR-kompatibel sida som informerar om personuppgiftshantering
*/

import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663450584758/XErJVV8ZFJdEBccSE4fBzi/merchdrop_logo_final_f25cafe4.png";

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Integritetspolicy — MerchDrop";
    // Noindex: privacy policy should not appear in search results
    let noindex = document.querySelector('meta[name="robots"][data-route]');
    if (!noindex) {
      noindex = document.createElement("meta");
      noindex.setAttribute("name", "robots");
      noindex.setAttribute("data-route", "privacy");
      document.head.appendChild(noindex);
    }
    noindex.setAttribute("content", "noindex, follow");
    return () => {
      document.title = "MerchDrop — Din egna merch-butik | Gratis att starta";
      noindex?.setAttribute("content", "index, follow, max-snippet:-1, max-image-preview:large");
    };
  }, []);

  return (
    <div
      className="min-h-screen text-foreground overflow-x-hidden"
      style={{ background: "#0F0A1E" }}
    >
      {/* Navigation */}
      <nav
        className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl"
        style={{ background: "rgba(15,10,30,0.9)" }}
      >
        <div className="container flex items-center justify-between h-16 md:h-20">
          <Link href="/">
            <img src={LOGO_URL} alt="MerchDrop" className="h-10 md:h-12 w-auto cursor-pointer" />
          </Link>
          <Link href="/">
            <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-['Plus_Jakarta_Sans'] text-sm font-medium">
              <ArrowLeft className="w-4 h-4" />
              Tillbaka till startsidan
            </button>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="container py-16 md:py-24 max-w-3xl mx-auto">
        <div className="mb-12">
          <p
            className="text-purple-400 font-semibold uppercase tracking-widest text-sm mb-4 font-['Plus_Jakarta_Sans']"
          >
            Juridisk information
          </p>
          <h1 className="font-['Syne'] text-4xl md:text-5xl font-bold text-white mb-4">
            Integritetspolicy
          </h1>
          <p className="text-white/50 font-['Plus_Jakarta_Sans'] text-sm">
            Senast uppdaterad: {new Date().toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <div className="space-y-10 font-['Plus_Jakarta_Sans'] text-white/75 leading-relaxed">

          {/* Section 1 */}
          <section>
            <h2 className="font-['Syne'] text-2xl font-bold text-white mb-4">
              1. Personuppgiftsansvarig
            </h2>
            <p>
              MerchDrop är en tjänst som drivs av Conversify.io. Vi är personuppgiftsansvariga för de uppgifter du lämnar via vår webbplats <strong className="text-white">merchdrop.se</strong>.
            </p>
            <div
              className="mt-4 p-4 rounded-xl text-sm"
              style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}
            >
              <p className="text-white font-semibold mb-1">Kontaktuppgifter</p>
              <p>E-post: <a href="mailto:info@conversify.io" className="text-purple-400 hover:text-pink-400 transition-colors">info@conversify.io</a></p>
              <p>Webbplats: <a href="https://conversify.io" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-pink-400 transition-colors">conversify.io</a></p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-['Syne'] text-2xl font-bold text-white mb-4">
              2. Vilka uppgifter samlar vi in?
            </h2>
            <p className="mb-4">
              När du fyller i intresseanmälningsformuläret på merchdrop.se samlar vi in följande personuppgifter:
            </p>
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "rgba(124,58,237,0.15)" }}>
                    <th className="text-left p-4 text-white font-semibold">Uppgift</th>
                    <th className="text-left p-4 text-white font-semibold">Obligatorisk</th>
                    <th className="text-left p-4 text-white font-semibold">Syfte</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { field: "Namn", required: "Ja", purpose: "Identifiering och personlig kommunikation" },
                    { field: "E-postadress", required: "Ja", purpose: "Kontakt och välkomstserie via e-post" },
                    { field: "Kanal / länk", required: "Ja", purpose: "Bedömning av din profil och butiksinriktning" },
                    { field: "Beskrivning", required: "Nej", purpose: "Bättre förståelse för dina behov" },
                  ].map((row, i) => (
                    <tr
                      key={i}
                      style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}
                    >
                      <td className="p-4 text-white">{row.field}</td>
                      <td className="p-4">{row.required === "Ja" ? <span className="text-pink-400">{row.required}</span> : row.required}</td>
                      <td className="p-4">{row.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-['Syne'] text-2xl font-bold text-white mb-4">
              3. Hur använder vi dina uppgifter?
            </h2>
            <p className="mb-3">
              Vi använder dina personuppgifter för att:
            </p>
            <ul className="space-y-2 list-none">
              {[
                "Kontakta dig angående din intresseanmälan och sätta upp din merch-butik.",
                "Skicka en välkomstserie med information om hur tjänsten fungerar.",
                "Kommunicera med dig om din butik, beställningar och utbetalningar.",
                "Förbättra vår tjänst baserat på feedback och användarbeteende.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="mt-1 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
                  >
                    {i + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-['Syne'] text-2xl font-bold text-white mb-4">
              4. Rättslig grund
            </h2>
            <p>
              Behandlingen av dina personuppgifter sker med stöd av <strong className="text-white">berättigat intresse</strong> (GDPR art. 6.1 f) - vi har ett berättigat intresse av att behandla uppgifterna för att kunna leverera den tjänst du har anmält intresse för. I de fall vi skickar marknadsföringskommunikation sker detta med stöd av ditt <strong className="text-white">samtycke</strong> (GDPR art. 6.1 a), vilket du kan återkalla när som helst.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-['Syne'] text-2xl font-bold text-white mb-4">
              5. Hur länge sparar vi dina uppgifter?
            </h2>
            <p>
              Vi sparar dina personuppgifter så länge du är en aktiv kontakt i vårt system, eller tills du begär att vi raderar dem. Om du inte startar en butik och inte hör av dig inom <strong className="text-white">12 månader</strong> från din anmälan raderas dina uppgifter automatiskt.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-['Syne'] text-2xl font-bold text-white mb-4">
              6. Tredjeparter och underleverantörer
            </h2>
            <p className="mb-4">
              Vi delar dina uppgifter med följande kategorier av tredjeparter:
            </p>
            <div className="space-y-3">
              {[
                { name: "CRM och e-postsystem", desc: "Dina uppgifter lagras i Hackadittliv (Conversify.io:s CRM-plattform) för hantering av kontakter och e-postkommunikation.", country: "Sverige" },
                { name: "Tryckeri och produktion", desc: "När din butik är aktiv delas relevanta orderuppgifter med vårt svenska tryckeri för produktion och leverans.", country: "Sverige" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-semibold">{item.name}</span>
                    <span className="text-xs text-green-400 font-medium">{item.country}</span>
                  </div>
                  <p className="text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm">
              Vi säljer aldrig dina personuppgifter till tredje part och överför inte uppgifter utanför EU/EES.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="font-['Syne'] text-2xl font-bold text-white mb-4">
              7. Dina rättigheter
            </h2>
            <p className="mb-4">
              Enligt GDPR har du följande rättigheter gällande dina personuppgifter:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { right: "Rätt till tillgång", desc: "Du kan begära en kopia av de uppgifter vi har om dig." },
                { right: "Rätt till rättelse", desc: "Du kan begära att felaktiga uppgifter rättas." },
                { right: "Rätt till radering", desc: "Du kan begära att dina uppgifter raderas (\"rätten att bli glömd\")." },
                { right: "Rätt till begränsning", desc: "Du kan begära att behandlingen av dina uppgifter begränsas." },
                { right: "Rätt till dataportabilitet", desc: "Du kan begära att få dina uppgifter i ett maskinläsbart format." },
                { right: "Rätt att invända", desc: "Du kan invända mot behandling som baseras på berättigat intresse." },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <p className="text-white font-semibold text-sm mb-1">{item.right}</p>
                  <p className="text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4">
              För att utöva dina rättigheter, kontakta oss på <a href="mailto:info@conversify.io" className="text-purple-400 hover:text-pink-400 transition-colors">info@conversify.io</a>. Vi svarar inom 30 dagar. Du har även rätt att lämna klagomål till <a href="https://www.imy.se" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-pink-400 transition-colors">Integritetsskyddsmyndigheten (IMY)</a>.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="font-['Syne'] text-2xl font-bold text-white mb-4">
              8. Cookies och spårning
            </h2>
            <p>
              Merchdrop.se använder <strong className="text-white">inga spårningscookies</strong> och ingen tredjepartsanalys som Google Analytics eller Meta Pixel. Vi använder anonymiserad statistik för att förstå hur sidan används, utan att identifiera enskilda besökare. Inga cookie-samtycken krävs.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="font-['Syne'] text-2xl font-bold text-white mb-4">
              9. Ändringar i denna policy
            </h2>
            <p>
              Vi kan komma att uppdatera denna integritetspolicy. Vid väsentliga ändringar informerar vi dig via e-post om du finns i vårt system. Den senaste versionen finns alltid tillgänglig på denna sida.
            </p>
          </section>

          {/* Contact CTA */}
          <div
            className="p-8 rounded-2xl text-center"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(236,72,153,0.15))", border: "1px solid rgba(168,85,247,0.2)" }}
          >
            <h3 className="font-['Syne'] text-xl font-bold text-white mb-2">Frågor om din integritet?</h3>
            <p className="text-white/70 mb-4 font-['Plus_Jakarta_Sans']">
              Kontakta oss så svarar vi inom 24 timmar.
            </p>
            <a
              href="mailto:info@conversify.io"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold font-['Syne'] transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
            >
              info@conversify.io
            </a>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-8">
        <div className="container text-center text-white/40 text-sm font-['Plus_Jakarta_Sans']">
          <p>© {new Date().getFullYear()} MerchDrop. Alla rättigheter förbehållna.</p>
          <p className="mt-1">
            Byggt av{" "}
            <a href="https://conversify.io" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-pink-400 transition-colors">
              Conversify.io
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
