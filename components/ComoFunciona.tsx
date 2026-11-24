"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { waLink } from "@/lib/site";

type Owner = "vos" | "nosotros" | "proveedor";

interface ProcessStep {
  title: string;
  short: string;
  owner: Owner;
  text: string;
  detail: string[];
}

const OWNER_LABEL: Record<Owner, string> = {
  vos: "Vos",
  nosotros: "Nosotros",
  proveedor: "Proveedor",
};

const STEPS: ProcessStep[] = [
  {
    title: "Contanos qué querés importar",
    short: "Pedido",
    owner: "vos",
    text: "Nos pasás el producto, la cantidad aproximada, el peso y los datos de tu proveedor. Con eso ya podemos empezar.",
    detail: [
      "Descripción del producto y cantidad",
      "Peso y medidas aproximadas, si las tenés",
      "Nombre y contacto del proveedor",
    ],
  },
  {
    title: "Recibí tu presupuesto",
    short: "Cotización",
    owner: "nosotros",
    text: "Te enviamos una cotización clara: flete, despacho y gastos. Sin letra chica. Si algo cambia, te avisamos antes de seguir.",
    detail: [
      "Cálculo según peso, volumen o contenedor",
      "Detalle de flete y gastos de aduana",
      "Plazo estimado para tu caso",
    ],
  },
  {
    title: "Coordinamos con tu proveedor",
    short: "Origen",
    owner: "proveedor",
    text: "Una vez que confirmás, organizamos con tu proveedor la fecha de retiro o recepción de la mercadería en origen.",
    detail: [
      "Confirmación de la orden de compra",
      "Fecha de retiro o entrega en nuestro depósito",
      "Embalaje y documentación del proveedor",
    ],
  },
  {
    title: "Consolidamos y embarcamos",
    short: "Embarque",
    owner: "nosotros",
    text: "Tu carga se consolida con la de otros importadores, o se carga en tu contenedor, y sale hacia Argentina por la vía que corresponda.",
    detail: [
      "Consolidación y control de la carga",
      "Emisión del conocimiento de embarque",
      "Seguimiento del envío durante el viaje",
    ],
  },
  {
    title: "Gestionamos la aduana",
    short: "Aduana",
    owner: "nosotros",
    text: "Nuestro despachante presenta la documentación ante aduana y resuelve el ingreso. Vos no tenés que hacer ningún trámite.",
    detail: [
      "Presentación de documentación ante aduana",
      "Liquidación de impuestos y tasas",
      "Coordinación de inspecciones si corresponden",
    ],
  },
  {
    title: "Te la llevamos a tu puerta",
    short: "Entrega",
    owner: "nosotros",
    text: "Entregamos la mercadería en tu comercio o depósito y te confirmamos cuando llegó.",
    detail: [
      "Transporte desde el puerto o aeropuerto",
      "Entrega en la dirección que indiques",
      "Confirmación al recibir la mercadería",
    ],
  },
];

const TIMING_FACTORS = [
  { stage: "Pedido y cotización", factor: "Según tu consulta" },
  { stage: "Tránsito internacional", factor: "Según modalidad y origen" },
  { stage: "Aduana y entrega", factor: "Según documentación" },
];

const DOCS = [
  "Factura comercial del proveedor",
  "Lista de empaque (packing list)",
  "Datos fiscales de tu empresa o CUIT",
  "Datos del proveedor (nombre, país, contacto)",
  "Certificados que requiera tu producto",
];

const EYEBROW = "text-[11px] font-medium uppercase tracking-[0.22em] text-gold";

export default function ComoFunciona() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [checkedDocs, setCheckedDocs] = useState<boolean[]>(() => DOCS.map(() => false));

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key === "ArrowRight") setActiveIndex((prev) => Math.min(prev + 1, STEPS.length - 1));
      if (event.key === "ArrowLeft") setActiveIndex((prev) => Math.max(prev - 1, 0));
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const currentStep = STEPS[activeIndex];
  const completedDocs = checkedDocs.filter(Boolean).length;

  const toggleDoc = (idx: number) => {
    setCheckedDocs((prev) => prev.map((done, i) => (i === idx ? !done : done)));
  };

  return (
    <div className="mt-14 space-y-20 sm:mt-16 sm:space-y-24">
      <section data-reveal className="reveal">
        <nav aria-label="Etapas de la importación" className="border-y border-gold-faint">
          <ol className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {STEPS.map((item, idx) => {
              const isCurrent = idx === activeIndex;
              const isPast = idx < activeIndex;
              return (
                <li key={item.short} className="border-b border-gold-faint sm:border-b-0 lg:border-r lg:last:border-r-0">
                  <button
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-current={isCurrent ? "step" : undefined}
                    className={`flex w-full flex-col items-start gap-1.5 px-4 py-4 text-left transition ${
                      isCurrent
                        ? "bg-gold text-white"
                        : isPast
                        ? "bg-[#faf7f2] text-cream hover:bg-gold/10"
                        : "bg-white text-cream/75 hover:bg-gold/5 hover:text-cream"
                    }`}
                  >
                    <span
                      className={`font-serif text-xs ${
                        isCurrent ? "text-white/85" : isPast ? "text-gold" : "text-soft"
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-[0.14em]">{item.short}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          <article key={activeIndex} className="panel-enter lg:col-span-7">
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-gold-faint pb-4">
              <span className={EYEBROW}>
                Etapa 0{activeIndex + 1} de 0{STEPS.length}
              </span>
              <span className="text-xs text-soft">
                Responsable: <strong className="font-medium text-cream">{OWNER_LABEL[currentStep.owner]}</strong>
              </span>
            </div>

            <h2 className="mt-6 font-serif text-2xl leading-tight text-cream sm:text-4xl">{currentStep.title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-cream/90 sm:text-base">{currentStep.text}</p>

            <ul className="mt-7 divide-y divide-gold-faint border-y border-gold-faint">
              {currentStep.detail.map((line) => (
                <li key={line} className="flex items-start gap-3 py-3 text-sm text-cream">
                  <span className="mt-2 h-1 w-1 shrink-0 bg-gold" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
                disabled={activeIndex === 0}
                className="text-xs uppercase tracking-[0.18em] text-cream transition hover:text-gold disabled:opacity-30"
              >
                ← Etapa anterior
              </button>
              <button
                type="button"
                onClick={() => setActiveIndex((prev) => Math.min(prev + 1, STEPS.length - 1))}
                disabled={activeIndex === STEPS.length - 1}
                className="text-xs font-medium uppercase tracking-[0.18em] text-gold transition hover:underline disabled:opacity-30"
              >
                Siguiente etapa →
              </button>
            </div>
          </article>

          <aside className="border-t-2 border-gold bg-[#faf7f2] p-6 sm:p-7 lg:col-span-5">
            <p className={EYEBROW}>Mapa de responsabilidades</p>
            <ul className="mt-4 divide-y divide-gold-faint">
              {STEPS.map((item, idx) => {
                const isCurrent = idx === activeIndex;
                return (
                  <li key={item.title}>
                    <button
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`flex w-full items-center justify-between gap-4 py-3 text-left transition ${
                        isCurrent ? "text-gold" : "text-cream/85 hover:text-cream"
                      }`}
                    >
                      <span className="text-sm">
                        <span className="mr-2.5 font-serif text-xs text-gold">0{idx + 1}</span>
                        <span className={isCurrent ? "font-medium" : ""}>{item.short}</span>
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] ${
                          isCurrent ? "bg-gold text-white" : "text-soft"
                        }`}
                      >
                        {OWNER_LABEL[item.owner]}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </section>

      <section data-reveal className="reveal border-t border-gold-faint pt-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className={EYEBROW}>Tiempos operativos</p>
            <h2 className="mt-2 font-serif text-2xl text-cream sm:text-3xl">Cuánto tarda cada tramo</h2>
            <p className="mt-4 text-sm leading-relaxed text-cream/85">
              El tiempo total depende de tres cosas: el origen, la modalidad que elijas y la rapidez con la que se
              junte la documentación. Por eso no damos un plazo genérico: te lo confirmamos en la cotización, con las
              fechas reales para tu caso.
            </p>
          </div>

          <dl className="divide-y divide-gold-faint border-y border-gold-faint lg:col-span-7">
            {TIMING_FACTORS.map((row) => (
              <div key={row.stage} className="flex flex-col justify-between gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6">
                <dt className="text-xs uppercase tracking-[0.16em] text-soft">{row.stage}</dt>
                <dd className="font-serif text-lg text-cream">{row.factor}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section data-reveal className="reveal border-t border-gold-faint pt-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className={EYEBROW}>Documentación base</p>
            <h2 className="mt-2 font-serif text-2xl text-cream sm:text-3xl">Qué conviene tener a mano</h2>
            <p className="mt-3 text-sm leading-relaxed text-cream/85">
              Marcá lo que ya tenés listo. La lista definitiva se ajusta según el tipo de mercadería.
            </p>
            <p className="mt-6 border-l-2 border-gold pl-3 text-xs uppercase tracking-[0.16em] text-cream">
              {completedDocs} de {DOCS.length} documentos listos
            </p>
          </div>

          <ul className="divide-y divide-gold-faint border-y border-gold-faint lg:col-span-7">
            {DOCS.map((doc, idx) => {
              const isChecked = checkedDocs[idx];
              return (
                <li key={doc}>
                  <button
                    type="button"
                    onClick={() => toggleDoc(idx)}
                    aria-pressed={isChecked}
                    className="flex w-full items-center gap-4 py-3.5 text-left transition hover:text-gold"
                  >
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center border text-xs transition ${
                        isChecked ? "border-gold bg-gold text-white" : "border-gold-dim bg-white text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                    <span className={`text-sm ${isChecked ? "text-soft line-through" : "text-cream"}`}>{doc}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section data-reveal className="reveal flex flex-col justify-between gap-6 border-t border-gold-faint pt-10 sm:flex-row sm:items-center">
        <div>
          <p className="font-serif text-xl text-cream">¿Tenés producto y proveedor definidos?</p>
          <p className="mt-1 text-sm text-soft">Pasalos y armamos una cotización con los tiempos reales para tu carga.</p>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <a
            href={waLink()}
            target="_blank"
            rel="noopener"
            className="font-medium text-gold underline decoration-gold/50 underline-offset-4 hover:decoration-gold"
          >
            Cotizar por WhatsApp
          </a>
          <Link href="/servicios" className="text-cream underline decoration-cream/30 underline-offset-4 hover:text-gold">
            Ver modalidades
          </Link>
        </div>
      </section>

      <style>{`
        .reveal { opacity: 0; transform: translateY(18px); transition: opacity .75s ease, transform .75s ease; }
        .reveal.is-in { opacity: 1; transform: none; }

        .panel-enter { animation: panel-in .45s ease both; }
        @keyframes panel-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal, .panel-enter { animation: none !important; transition: none !important; opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}