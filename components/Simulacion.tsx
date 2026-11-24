"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ORIGINS, SITE, waLink } from "@/lib/site";

type Mode = "fcl" | "lcl" | "courier";

interface ModeOption {
  id: Mode;
  code: string;
  name: string;
  hint: string;
}

const MODES: ModeOption[] = [
  { id: "lcl", code: "LCL", name: "Carga consolidada", hint: "Pagás por kilo. Ideal para cargas medianas o chicas." },
  { id: "fcl", code: "FCL", name: "Contenedor completo", hint: "Un contenedor exclusivo. Para volúmenes grandes." },
  { id: "courier", code: "COURIER", name: "Courier aéreo", hint: "Envíos livianos y urgentes, puerta a puerta." },
];

const QUICK_PRESETS = [
  { label: "Pedido chico", kg: 80, mode: "lcl" as Mode },
  { label: "Reposición mensual", kg: 350, mode: "lcl" as Mode },
  { label: "Importación grande", kg: 900, mode: "lcl" as Mode },
];

const CONTAINERS = [
  { id: "20", label: "20 pies", note: "Carga general estándar" },
  { id: "40", label: "40 pies", note: "Mayor volumen cúbico" },
];

const COST_ITEMS = [
  { label: "Despacho aduanero", detail: "Según la cotización" },
  { label: "Impuestos y tasas", detail: "Según aduana" },
  { label: "Entrega en tu puerta", detail: "Según la cotización" },
];

const FAQS = [
  {
    q: "¿El precio por kilo incluye impuestos?",
    a: "No. La referencia de flete no incluye impuestos ni tasas de aduana. Esos se calculan según el valor de tu mercadería, su clasificación arancelaria y el régimen que corresponda.",
  },
  {
    q: "¿Por qué FCL y courier no tienen precio fijo?",
    a: "Porque dependen de la ruta, la temporada, el tamaño del contenedor o el peso real del envío. Te lo cotizamos con datos concretos, sin estimaciones genéricas.",
  },
  {
    q: "¿Cómo se calcula la carga consolidada?",
    a: "Por peso o por volumen, según cuál sea mayor. Si tu carga es liviana pero voluminosa, se factura el volumen.",
  },
  {
    q: "¿Qué pasa si el peso real es distinto al que estimé?",
    a: "Se ajusta en la cotización final al momento del embarque. Te avisamos antes de cualquier cambio.",
  },
];

const EYEBROW = "text-[11px] font-medium uppercase tracking-[0.22em] text-gold";

export default function Simulacion() {
  const [mode, setMode] = useState<Mode>("lcl");
  const [kg, setKg] = useState(200);
  const [origin, setOrigin] = useState("China");
  const [container, setContainer] = useState("20");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const activeMode = MODES.find((item) => item.id === mode) ?? MODES[0];
  const estimatedFreight = mode === "lcl" ? kg * SITE.pricePerKg : null;

  const handleKgChange = (value: number) => {
    if (Number.isNaN(value)) return;
    const clamped = Math.min(2000, Math.max(10, value));
    setKg(clamped);
  };

  const cargoSummary = mode === "fcl" ? `Contenedor: ${container}'` : `Peso estimado: ${kg} kg`;
  const freightSummary =
    estimatedFreight !== null
      ? `Flete de referencia: USD ${estimatedFreight.toLocaleString("es-AR")} (sin impuestos ni aduana)`
      : "Flete: a cotizar";

  const clipboardText = [
    "Simulación T&B Global",
    `Modalidad: ${activeMode.code} (${activeMode.name})`,
    `Origen: ${origin}`,
    cargoSummary,
    freightSummary,
  ].join("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(clipboardText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const whatsappMessage = `Hola! Hice una simulación en la web: ${activeMode.code}, ${origin}${
    mode === "fcl" ? `, contenedor ${container}'` : `, ${kg} kg`
  }. ¿Me pasan cotización?`;

  return (
    <div className="mt-14 space-y-20 sm:mt-16 sm:space-y-24">
      <section data-reveal className="reveal border-y border-gold-faint py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className={EYEBROW}>Cargas habituales</span>
          <div className="flex flex-wrap gap-2">
            {QUICK_PRESETS.map((preset) => {
              const isCurrentPreset = mode === preset.mode && kg === preset.kg;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setMode(preset.mode);
                    setKg(preset.kg);
                  }}
                  className={`rounded-sm border px-3 py-1.5 text-xs transition ${
                    isCurrentPreset
                      ? "border-gold bg-gold/10 font-medium text-gold"
                      : "border-gold-faint bg-white/70 text-cream hover:border-gold"
                  }`}
                >
                  {preset.label} · {preset.kg} kg
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section data-reveal className="reveal grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
        <div className="space-y-10 lg:col-span-7">
          <div className="border-b border-gold-faint pb-8">
            <div className="flex items-baseline justify-between gap-4">
              <p className={EYEBROW}>01 / Modalidad</p>
              <span className="text-xs text-soft">{activeMode.name}</span>
            </div>

            <div role="tablist" className="mt-4 grid grid-cols-3 border border-gold-faint bg-white">
              {MODES.map((item, index) => {
                const isSelected = mode === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setMode(item.id)}
                    className={`px-3 py-4 text-left transition sm:px-5 ${
                      index > 0 ? "border-l border-gold-faint" : ""
                    } ${isSelected ? "bg-gold text-white" : "text-cream hover:bg-gold/5"}`}
                  >
                    <span className="block font-serif text-base sm:text-lg">{item.code}</span>
                    <span className={`mt-0.5 block text-[11px] ${isSelected ? "text-white/85" : "text-soft"}`}>
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-sm text-cream/85">{activeMode.hint}</p>
          </div>

          <div className="border-b border-gold-faint pb-8">
            <p className={EYEBROW}>02 / Origen del embarque</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {ORIGINS.map((place) => {
                const active = origin === place;
                return (
                  <button
                    key={place}
                    type="button"
                    onClick={() => setOrigin(place)}
                    aria-pressed={active}
                    className={`rounded-sm border px-3.5 py-2 text-xs tracking-wide transition ${
                      active
                        ? "border-cream bg-cream text-white"
                        : "border-gold-faint bg-white text-cream hover:border-gold"
                    }`}
                  >
                    {place}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            {mode === "fcl" ? (
              <>
                <p className={EYEBROW}>03 / Equipo</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {CONTAINERS.map((box) => {
                    const active = container === box.id;
                    return (
                      <button
                        key={box.id}
                        type="button"
                        onClick={() => setContainer(box.id)}
                        aria-pressed={active}
                        className={`flex items-center justify-between border px-4 py-3.5 text-left transition ${
                          active
                            ? "border-gold bg-gold/10 text-cream"
                            : "border-gold-faint bg-white text-cream/80 hover:border-gold"
                        }`}
                      >
                        <span className="font-serif text-base">{box.label}</span>
                        <span className="text-xs text-soft">{box.note}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-end justify-between gap-4">
                  <label htmlFor="peso-estimado-input" className={EYEBROW}>
                    03 / Peso estimado
                  </label>
                  <div className="flex items-baseline gap-1.5 border-b border-gold pb-1">
                    <input
                      id="peso-estimado-input"
                      type="number"
                      min={10}
                      max={2000}
                      step={10}
                      value={kg}
                      onChange={(e) => handleKgChange(Number(e.target.value))}
                      className="w-24 bg-transparent text-right font-serif text-2xl tabular-nums text-cream focus:outline-none"
                    />
                    <span className="text-xs uppercase tracking-widest text-soft">kg</span>
                  </div>
                </div>

                <input
                  type="range"
                  min={10}
                  max={2000}
                  step={10}
                  value={kg}
                  onChange={(e) => setKg(Number(e.target.value))}
                  aria-label="Ajustar peso estimado en kilos"
                  className="mt-5 w-full accent-[#8c6428]"
                />
                <div className="mt-1.5 flex justify-between text-[11px] text-soft">
                  <span>Mínimo 10 kg</span>
                  <span>Máximo 2.000 kg</span>
                </div>
              </>
            )}
          </div>
        </div>

        <aside className="border-t-2 border-gold bg-[#faf7f2] p-6 sm:p-8 lg:col-span-5 lg:sticky lg:top-28">
          <div className="flex items-center justify-between border-b border-gold-faint pb-4">
            <span className={EYEBROW}>Estimación de flete</span>
            <span className="text-xs text-soft">
              {activeMode.code} · {origin}
            </span>
          </div>

          <div className="py-6">
            {estimatedFreight !== null ? (
              <>
                <p className="font-serif text-4xl tabular-nums text-cream sm:text-5xl">
                  USD {estimatedFreight.toLocaleString("es-AR")}
                </p>
                <p className="mt-2 text-xs text-soft">
                  Base de {SITE.pricePerKg} USD/kg sobre {kg.toLocaleString("es-AR")} kg estimados.
                </p>
              </>
            ) : (
              <>
                <p className="font-serif text-3xl text-cream">Cotización a medida</p>
                <p className="mt-2 text-xs leading-relaxed text-soft">
                  {mode === "fcl"
                    ? `Contenedor de ${container} pies desde ${origin}. Sujeto a disponibilidad naviera y temporada.`
                    : `Envío courier desde ${origin} por ${kg.toLocaleString("es-AR")} kg. Se calcula según peso o volumen final.`}
                </p>
              </>
            )}
          </div>

          <dl className="divide-y divide-gold-faint border-t border-gold-faint text-sm">
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="text-cream/80">Flete internacional</dt>
              <dd className="font-medium text-cream">
                {estimatedFreight !== null ? `USD ${estimatedFreight.toLocaleString("es-AR")}` : "A cotizar"}
              </dd>
            </div>
            {COST_ITEMS.map((item) => (
              <div key={item.label} className="flex justify-between gap-4 py-2.5">
                <dt className="text-cream/80">{item.label}</dt>
                <dd className="text-soft">{item.detail}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-5 text-xs leading-relaxed text-soft">
            Referencia orientativa sin impuestos ni gastos locales. Se confirma al revisar la mercadería.
          </p>

          <div className="mt-6 space-y-2.5">
            <a
              href={waLink(whatsappMessage)}
              target="_blank"
              rel="noopener"
              className="block w-full bg-cream px-4 py-3.5 text-center text-xs font-medium uppercase tracking-[0.18em] text-white transition hover:bg-gold"
            >
              Consultar por WhatsApp
            </a>
            <button
              type="button"
              onClick={handleCopy}
              className="w-full border border-gold-faint bg-white px-4 py-2.5 text-center text-xs uppercase tracking-[0.16em] text-cream transition hover:border-gold"
            >
              {copied ? "Resumen copiado" : "Copiar detalle"}
            </button>
          </div>
        </aside>
      </section>

      <section data-reveal className="reveal border-t border-gold-faint pt-14">
        <div className="max-w-xl">
          <p className={EYEBROW}>Preguntas frecuentes</p>
          <h2 className="mt-2 font-serif text-2xl text-cream sm:text-3xl">Cómo se arma el número</h2>
        </div>

        <div className="mt-8 divide-y divide-gold-faint border-b border-gold-faint">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={faq.q} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 text-left"
                >
                  <span className="text-sm font-medium text-cream sm:text-base">{faq.q}</span>
                  <span className="shrink-0 text-xs uppercase tracking-widest text-gold">
                    {isOpen ? "Cerrar" : "Ver"}
                  </span>
                </button>
                {isOpen && (
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream/85">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section data-reveal className="reveal flex flex-col justify-between gap-6 border-t border-gold-faint pt-10 sm:flex-row sm:items-center">
        <div>
          <p className="font-serif text-xl text-cream">¿Tenés lista de empaque o factura proforma?</p>
          <p className="mt-1 text-sm text-soft">Pasala y revisamos la operación completa sin compromiso.</p>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <a
            href={waLink(whatsappMessage)}
            target="_blank"
            rel="noopener"
            className="font-medium text-gold underline decoration-gold/50 underline-offset-4 hover:decoration-gold"
          >
            Escribir por WhatsApp
          </a>
          <Link href="/como-funciona" className="text-cream underline decoration-cream/30 underline-offset-4 hover:text-gold">
            Ver proceso
          </Link>
        </div>
      </section>

      <style>{`
        .reveal { opacity: 0; transform: translateY(18px); transition: opacity .75s ease, transform .75s ease; }
        .reveal.is-in { opacity: 1; transform: none; }
        select option { background: #ffffff; color: #1c1812; }
        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1; transform: none; transition: none; }
        }
      `}</style>
    </div>
  );
}