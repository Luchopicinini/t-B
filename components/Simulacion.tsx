"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ORIGINS, SITE, waLink } from "@/lib/site";

type ModeId = "fcl" | "lcl" | "courier";

const MODES: { id: ModeId; code: string; name: string; hint: string }[] = [
  { id: "lcl", code: "LCL", name: "Carga consolidada", hint: "Pagás por kilo. Ideal para cargas medianas o chicas." },
  { id: "fcl", code: "FCL", name: "Contenedor completo", hint: "Un contenedor exclusivo. Para volúmenes grandes." },
  { id: "courier", code: "COURIER", name: "Courier aéreo", hint: "Envíos livianos y urgentes, puerta a puerta." },
];

const EXAMPLES = [
  { label: "Pedido chico", kg: 80, mode: "lcl" as ModeId },
  { label: "Reposición mensual", kg: 350, mode: "lcl" as ModeId },
  { label: "Importación grande", kg: 900, mode: "lcl" as ModeId },
];

const CONTAINERS = [
  { id: "20", label: "Contenedor 20'" },
  { id: "40", label: "Contenedor 40'" },
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

export default function Simulacion() {
  const [mode, setMode] = useState<ModeId>("lcl");
  const [kg, setKg] = useState(200);
  const [origin, setOrigin] = useState<string>("China");
  const [container, setContainer] = useState("20");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const current = MODES.find((m) => m.id === mode)!;
  const flete = mode === "lcl" ? kg * SITE.pricePerKg : null;

  const summary = [
    `Simulación T&B Global`,
    `Modalidad: ${current.code} (${current.name})`,
    `Origen: ${origin}`,
    mode === "lcl" ? `Peso estimado: ${kg} kg` : mode === "fcl" ? `Contenedor: ${container}'` : `Peso estimado: ${kg} kg`,
    flete !== null ? `Flete de referencia: USD ${flete.toLocaleString("es-AR")} (sin impuestos ni aduana)` : "Flete: a cotizar",
  ].join("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const waText = `Hola! Hice una simulación en la web: ${current.code}, ${origin}${
    mode === "fcl" ? `, contenedor ${container}'` : `, ${kg} kg`
  }. ¿Me pasan cotización?`;

  return (
    <>
      {/* Cargas de ejemplo */}
      <section data-reveal className="reveal mt-20">
        <p className="mb-5 text-[11px] uppercase tracking-[0.3em] text-gold">Ejemplos rápidos</p>
        <div className="grid gap-px bg-gold-faint sm:grid-cols-3">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => {
                setMode(ex.mode);
                setKg(ex.kg);
              }}
              className="group bg-ink p-6 text-left transition-colors duration-300 hover:bg-ink-2"
            >
              <p className="text-[11px] uppercase tracking-[0.2em] text-soft">{ex.label}</p>
              <p className="mt-3 font-serif text-2xl text-cream">{ex.kg} kg</p>
              <p className="mt-2 text-xs text-gold/0 transition-colors duration-300 group-hover:text-gold">Cargar este ejemplo →</p>
            </button>
          ))}
        </div>
      </section>

      {/* Calculadora */}
      <section data-reveal className="reveal mt-20 grid gap-14 md:grid-cols-12">
        {/* Controles */}
        <div className="space-y-10 md:col-span-7">
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.25em] text-gold">1. Modalidad</p>
            <div role="tablist" className="grid grid-cols-3 border-b border-gold-faint">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  role="tab"
                  aria-selected={mode === m.id}
                  onClick={() => setMode(m.id)}
                  className={`relative py-4 text-center font-serif text-xl transition-colors duration-300 ${
                    mode === m.id ? "text-gold" : "text-cream/45 hover:text-cream/80"
                  }`}
                >
                  {m.code}
                  <span
                    className={`absolute inset-x-0 -bottom-px h-px bg-gold transition-transform duration-500 ${
                      mode === m.id ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm text-soft">{current.hint}</p>
          </div>

          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.25em] text-gold">2. Origen</p>
            <div className="flex flex-wrap gap-2">
              {ORIGINS.map((o) => (
                <button
                  key={o}
                  onClick={() => setOrigin(o)}
                  aria-pressed={origin === o}
                  className={`border px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors duration-300 ${
                    origin === o ? "border-gold bg-gold text-ink" : "border-gold-dim text-cream/70 hover:border-gold hover:text-cream"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          {mode === "fcl" ? (
            <div>
              <p className="mb-4 text-[11px] uppercase tracking-[0.25em] text-gold">3. Tamaño del contenedor</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {CONTAINERS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setContainer(c.id)}
                    aria-pressed={container === c.id}
                    className={`border px-5 py-4 text-left text-sm transition-colors duration-300 ${
                      container === c.id ? "border-gold bg-gold/10 text-gold" : "border-gold-dim text-cream/80 hover:border-gold"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4 flex items-baseline justify-between">
                <p className="text-[11px] uppercase tracking-[0.25em] text-gold">3. Peso estimado</p>
                <p className="font-serif text-2xl text-cream">
                  {kg.toLocaleString("es-AR")} <span className="font-sans text-sm text-soft">kg</span>
                </p>
              </div>
              <input
                type="range"
                min={10}
                max={2000}
                step={10}
                value={kg}
                onChange={(e) => setKg(Number(e.target.value))}
                aria-label="Peso estimado en kilos"
                className="w-full accent-[#d4b26e]"
              />
              <div className="mt-2 flex justify-between text-[10px] tracking-[0.15em] text-soft">
                <span>10 kg</span>
                <span>2.000 kg</span>
              </div>
            </div>
          )}
        </div>

        {/* Resultado */}
        <aside className="md:col-span-5">
          <div className="sticky top-28 border border-gold-dim bg-ink-2 p-8">
            <p className="text-[11px] uppercase tracking-[0.25em] text-gold">Resultado estimado</p>

            <div className="mt-6">
              {flete !== null ? (
                <>
                  <p className="font-serif text-5xl text-cream tabular-nums">
                    USD {flete.toLocaleString("es-AR")}
                  </p>
                  <p className="mt-2 text-xs text-soft">
                    Flete de referencia · {SITE.pricePerKg} USD por kilo
                  </p>
                </>
              ) : (
                <>
                  <p className="font-serif text-3xl text-cream">A cotizar</p>
                  <p className="mt-2 text-xs text-soft">Depende de la ruta, la temporada y el contenedor.</p>
                </>
              )}
            </div>

            <ul className="mt-8 divide-y divide-gold-faint border-y border-gold-faint text-sm">
              <li className="flex justify-between py-3">
                <span className="text-cream/80">Flete</span>
                <span className="text-cream/60">{flete !== null ? "Incluido en la referencia" : "A cotizar"}</span>
              </li>
              <li className="flex justify-between py-3">
                <span className="text-cream/80">Despacho aduanero</span>
                <span className="text-cream/60">Según la cotización</span>
              </li>
              <li className="flex justify-between py-3">
                <span className="text-cream/80">Impuestos y tasas</span>
                <span className="text-cream/60">Según aduana</span>
              </li>
              <li className="flex justify-between py-3">
                <span className="text-cream/80">Entrega en tu puerta</span>
                <span className="text-cream/60">Según la cotización</span>
              </li>
            </ul>

            <p className="mt-6 text-xs leading-relaxed text-soft">
              Valores orientativos. No incluyen impuestos ni gastos de aduana. La cotización formal se confirma con
              tu carga concreta.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <a
                href={waLink(waText)}
                target="_blank"
                rel="noopener"
                className="block border border-gold bg-gold py-3.5 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition hover:bg-transparent hover:text-gold"
              >
                Pedir cotización formal
              </a>
              <button
                onClick={copy}
                className="text-center text-[11px] uppercase tracking-[0.2em] text-soft transition hover:text-gold"
              >
                {copied ? "Resumen copiado" : "Copiar resumen"}
              </button>
            </div>
          </div>
        </aside>
      </section>

      {/* Preguntas */}
      <section data-reveal className="reveal mt-32 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Dudas frecuentes</p>
          <h2 className="mt-3 font-serif text-2xl text-cream sm:text-3xl">Sobre los costos</h2>
        </div>
        <ul className="divide-y divide-gold-faint border-y border-gold-faint md:col-span-8">
          {FAQS.map((f, i) => {
            const open = openFaq === i;
            return (
              <li key={f.q}>
                <button
                  onClick={() => setOpenFaq(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left transition hover:text-gold"
                >
                  <span className="text-base text-cream">{f.q}</span>
                  <span className={`text-xl text-gold transition-transform duration-300 ${open ? "rotate-45" : ""}`}>+</span>
                </button>
                <div className={`grid transition-all duration-500 ${open ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="max-w-2xl text-sm leading-relaxed text-soft">{f.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Cierre */}
      <section data-reveal className="reveal mt-32 border-t border-gold-faint pt-14">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="font-serif text-2xl text-cream sm:text-3xl">¿Querés el número exacto?</p>
            <p className="mt-2 text-sm text-soft">Contanos tu carga y te respondemos con una cotización formal.</p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <a href={waLink(waText)} target="_blank" rel="noopener" className="text-gold underline-offset-4 hover:underline">
              Cotizar por WhatsApp
            </a>
            <Link href="/como-funciona" className="text-cream/80 underline-offset-4 hover:text-gold hover:underline">
              Cómo funciona
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity .9s ease, transform .9s cubic-bezier(.2,.8,.2,1); }
        .reveal.is-in { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1; transform: none; transition: none; }
        }
      `}</style>
    </>
  );
}