"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { waLink } from "@/lib/site";

type Who = "vos" | "nosotros" | "proveedor";

const WHO_LABEL: Record<Who, string> = {
  vos: "Vos",
  nosotros: "Nosotros",
  proveedor: "Proveedor",
};

const STEPS: { title: string; short: string; who: Who; text: string; detail: string[] }[] = [
  {
    title: "Contanos qué querés importar",
    short: "Pedido",
    who: "vos",
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
    who: "nosotros",
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
    who: "proveedor",
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
    who: "nosotros",
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
    who: "nosotros",
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
    who: "nosotros",
    text: "Entregamos la mercadería en tu comercio o depósito y te confirmamos cuando llegó.",
    detail: [
      "Transporte desde el puerto o aeropuerto",
      "Entrega en la dirección que indiques",
      "Confirmación al recibir la mercadería",
    ],
  },
];

const DOCS = [
  "Factura comercial del proveedor",
  "Lista de empaque (packing list)",
  "Datos fiscales de tu empresa o CUIT",
  "Datos del proveedor (nombre, país, contacto)",
  "Certificados que requiera tu producto",
];

export default function ComoFunciona() {
  const [active, setActive] = useState(0);
  const [checked, setChecked] = useState<boolean[]>(DOCS.map(() => false));

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight") setActive((v) => Math.min(v + 1, STEPS.length - 1));
      if (e.key === "ArrowLeft") setActive((v) => Math.max(v - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const step = STEPS[active];
  const progress = ((active + 1) / STEPS.length) * 100;
  const docsDone = checked.filter(Boolean).length;

  const toggleDoc = (i: number) =>
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  return (
    <>
      {/* Línea de progreso y selector de pasos */}
      <section data-reveal className="reveal mt-20">
        <div className="relative">
          <div className="absolute inset-x-0 top-[13px] h-px bg-gold-faint" />
          <div
            className="absolute left-0 top-[13px] h-px bg-gold transition-[width] duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
          <ol className="relative grid grid-cols-3 gap-y-8 md:grid-cols-6">
            {STEPS.map((s, i) => {
              const isActive = i === active;
              const isDone = i < active;
              return (
                <li key={s.short} className="flex justify-center">
                  <button
                    onClick={() => setActive(i)}
                    aria-current={isActive ? "step" : undefined}
                    className="group flex flex-col items-center gap-3 text-center"
                  >
                    <span
                      className={`grid h-7 w-7 place-items-center rounded-full border text-[11px] transition-all duration-500 ${
                        isActive
                          ? "scale-110 border-gold bg-gold text-ink"
                          : isDone
                          ? "border-gold bg-ink text-gold"
                          : "border-gold-dim bg-ink text-soft group-hover:border-gold group-hover:text-gold"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                        isActive ? "text-gold" : "text-soft group-hover:text-cream"
                      }`}
                    >
                      {s.short}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Detalle del paso activo */}
      <section className="mt-16 grid gap-12 md:grid-cols-12">
        <div key={active} className="panel-enter md:col-span-7">
          <div className="mb-6 flex items-center gap-4">
            <span className="font-serif text-5xl text-gold">0{active + 1}</span>
            <span className="border border-gold-dim px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-soft">
              Lo hace: <span className="text-cream">{WHO_LABEL[step.who]}</span>
            </span>
          </div>
          <h2 className="font-serif text-3xl leading-tight text-cream sm:text-4xl">{step.title}</h2>
          <p className="mt-5 text-base leading-relaxed text-cream/80">{step.text}</p>

          <ul className="mt-8 space-y-3">
            {step.detail.map((d, i) => (
              <li
                key={d}
                className="point-in flex gap-3 text-sm text-cream/75"
                style={{ animationDelay: `${150 + i * 90}ms` }}
              >
                <span className="mt-2 h-px w-3 shrink-0 bg-gold" />
                <span>{d}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex items-center gap-6">
            <button
              onClick={() => setActive((v) => Math.max(v - 1, 0))}
              disabled={active === 0}
              className="text-sm text-soft transition hover:text-gold disabled:opacity-30"
            >
              ← Anterior
            </button>
            <button
              onClick={() => setActive((v) => Math.min(v + 1, STEPS.length - 1))}
              disabled={active === STEPS.length - 1}
              className="text-sm text-gold transition hover:underline disabled:opacity-30"
            >
              Siguiente →
            </button>
          </div>
        </div>

        {/* Responsabilidades */}
        <aside className="md:col-span-5">
          <p className="mb-5 text-[11px] uppercase tracking-[0.3em] text-gold">Quién hace qué</p>
          <ul className="divide-y divide-gold-faint border-y border-gold-faint">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <button
                  onClick={() => setActive(i)}
                  className={`flex w-full items-center justify-between gap-4 py-4 text-left transition ${
                    i === active ? "text-gold" : "text-cream/70 hover:text-cream"
                  }`}
                >
                  <span className="text-sm">
                    <span className="mr-3 font-serif text-base text-gold/70">0{i + 1}</span>
                    {s.short}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-soft">{WHO_LABEL[s.who]}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {/* Tiempos */}
      <section data-reveal className="reveal mt-32 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Plazos</p>
          <h2 className="mt-3 font-serif text-2xl text-cream sm:text-3xl">Cuánto tarda</h2>
        </div>
        <div className="md:col-span-8">
          <p className="text-base leading-relaxed text-cream/80">
            El tiempo total depende de tres cosas: el origen, la modalidad que elijas y la rapidez con la que se
            junte la documentación. Por eso no damos un plazo genérico: te lo confirmamos en la cotización, con
            las fechas reales para tu caso.
          </p>
          <div className="mt-10 grid gap-px bg-gold-faint sm:grid-cols-3">
            {[
              { k: "Pedido y cotización", v: "Según tu consulta" },
              { k: "Viaje", v: "Según modalidad y origen" },
              { k: "Aduana y entrega", v: "Según documentación" },
            ].map((t) => (
              <div key={t.k} className="bg-ink p-6">
                <p className="text-[11px] uppercase tracking-[0.2em] text-soft">{t.k}</p>
                <p className="mt-3 font-serif text-lg text-cream">{t.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Checklist de documentos */}
      <section data-reveal className="reveal mt-32 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Antes de empezar</p>
          <h2 className="mt-3 font-serif text-2xl text-cream sm:text-3xl">Preparate la documentación</h2>
          <p className="mt-4 text-sm text-soft">
            Marcá lo que ya tenés. La lista exacta se confirma según tu producto.
          </p>
          <div className="mt-8">
            <div className="flex justify-between text-[11px] uppercase tracking-[0.2em] text-soft">
              <span>Listo</span>
              <span className="tabular-nums text-cream/70">
                {docsDone} / {DOCS.length}
              </span>
            </div>
            <div className="mt-3 h-px w-full bg-gold-faint">
              <div
                className="h-px bg-gold transition-[width] duration-500"
                style={{ width: `${(docsDone / DOCS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <ul className="divide-y divide-gold-faint border-y border-gold-faint md:col-span-8">
          {DOCS.map((d, i) => (
            <li key={d}>
              <button
                onClick={() => toggleDoc(i)}
                aria-pressed={checked[i]}
                className="flex w-full items-center gap-5 py-5 text-left transition hover:text-gold"
              >
                <span
                  className={`grid h-5 w-5 shrink-0 place-items-center border transition-colors duration-300 ${
                    checked[i] ? "border-gold bg-gold text-ink" : "border-gold-dim text-transparent"
                  }`}
                >
                  <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true">
                    <path d="M3 8.5 L6.5 12 L13 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className={`text-sm transition-colors ${checked[i] ? "text-cream" : "text-cream/75"}`}>{d}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Cierre */}
      <section data-reveal className="reveal mt-32 border-t border-gold-faint pt-14">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="font-serif text-2xl text-cream sm:text-3xl">¿Empezamos?</p>
            <p className="mt-2 text-sm text-soft">Mandanos el producto y el proveedor, y te respondemos con una cotización.</p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <a href={waLink()} target="_blank" rel="noopener" className="text-gold underline-offset-4 hover:underline">
              Cotizar por WhatsApp
            </a>
            <Link href="/servicios" className="text-cream/80 underline-offset-4 hover:text-gold hover:underline">
              Ver modalidades
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity .9s ease, transform .9s cubic-bezier(.2,.8,.2,1); }
        .reveal.is-in { opacity: 1; transform: none; }

        .panel-enter { animation: panel-in .6s cubic-bezier(.2,.8,.2,1) both; }
        @keyframes panel-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }

        .point-in { animation: point-in .6s ease both; }
        @keyframes point-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: none; } }

        @media (prefers-reduced-motion: reduce) {
          .reveal, .panel-enter, .point-in { animation: none !important; transition: none !important; opacity: 1; transform: none; }
        }
      `}</style>
    </>
  );
}