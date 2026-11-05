"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ORIGINS, SITE, waLink } from "@/lib/site";

type ModeId = "fcl" | "lcl" | "courier";

type Mode = {
  id: ModeId;
  code: string;
  name: string;
  tagline: string;
  text: string;
  incluye: string[];
  ideal: string[];
  noIdeal: string[];
  docs: string[];
  steps: string[];
  bars: { volumen: number; economia: number; velocidad: number };
};

const MODES: Mode[] = [
  {
    id: "fcl",
    code: "FCL",
    name: "Contenedor completo",
    tagline: "Un contenedor para vos solo.",
    text: "Reservás un contenedor de 20' o 40' para tu mercadería. Nadie más viaja con tu carga: vos definís el momento de carga y el orden, dentro de los plazos del proveedor y de la naviera.",
    incluye: [
      "Contenedor de 20' o 40', según tu volumen",
      "Coordinación de la carga en origen con tu proveedor",
      "Flete marítimo hasta Argentina",
      "Despacho aduanero a cargo de nuestro despachante",
      "Entrega en tu depósito o en tu puerta",
    ],
    ideal: ["Volúmenes grandes o cargas pesadas", "Importaciones periódicas y planificadas", "Mercadería que no conviene mezclar con otra"],
    noIdeal: ["Pedidos chicos o de pocos kilos", "Cuando necesitás la mercadería con urgencia"],
    docs: ["Factura comercial del proveedor", "Lista de empaque (packing list)", "Conocimiento de embarque (BL)", "Certificados que requiera tu producto"],
    steps: [
      "Nos pasás producto, volumen y proveedor",
      "Te enviamos cotización del contenedor y del flete",
      "Coordinamos la carga en origen con tu proveedor",
      "El contenedor embarca hacia Argentina",
      "Nuestro despachante gestiona la aduana",
      "Entregamos en tu depósito",
    ],
    bars: { volumen: 95, economia: 90, velocidad: 50 },
  },
  {
    id: "lcl",
    code: "LCL",
    name: "Carga consolidada",
    tagline: "Pagás solo por los kilos que traés.",
    text: "Tu mercadería viaja compartiendo contenedor con la de otros importadores. Pagás por el peso y el volumen que ocupa tu carga, sin tener que comprar un contenedor entero.",
    incluye: [
      "Cobro por kilo o por m³, según el tipo de carga",
      "Consolidación en origen en nuestro depósito",
      "Despacho aduanero incluido",
      "Entrega hasta tu comercio o depósito",
    ],
    ideal: ["Cargas medianas o chicas", "Reposición regular de mercadería", "Primer paso para importar sin gran inversión"],
    noIdeal: ["Cargas que ya ocupan un contenedor entero", "Mercadería que necesita viajar aislada"],
    docs: ["Factura comercial de cada proveedor", "Lista de empaque (packing list)", "Documentación de consolidación", "Certificados según el producto"],
    steps: [
      "Nos contás qué querés importar",
      "Recibís presupuesto calculado por kilo",
      "Coordinamos la recepción en China o Brasil",
      "Consolidamos tu carga y embarcamos",
      "Nuestro despachante gestiona la aduana",
      "Te la llevamos a tu puerta",
    ],
    bars: { volumen: 45, economia: 70, velocidad: 50 },
  },
  {
    id: "courier",
    code: "COURIER",
    name: "Courier aéreo",
    tagline: "Cuando el tiempo importa.",
    text: "Enviamos cargas livianas por vía aérea. Es la opción más rápida para reponer stock o resolver una urgencia, y la mercadería llega directo a la dirección que indiques.",
    incluye: ["Envío aéreo desde el origen", "Coordinación del retiro con tu proveedor", "Gestión de aduana para envíos livianos", "Entrega puerta a puerta"],
    ideal: ["Cargas livianas", "Reposición urgente de stock", "Muestras y productos de alto valor"],
    noIdeal: ["Cargas pesadas o voluminosas", "Cuando el costo por kilo es la prioridad"],
    docs: ["Factura comercial", "Datos del proveedor y del destinatario"],
    steps: [
      "Nos pasás el producto y el peso aproximado",
      "Cotizamos el envío aéreo",
      "Coordinamos el retiro en origen",
      "La carga vuela hacia Argentina",
      "Despacho aduanero",
      "Entrega puerta a puerta",
    ],
    bars: { volumen: 15, economia: 25, velocidad: 95 },
  },
];

const ORIGIN_INFO: Record<string, { modes: string; note: string }> = {
  China: { modes: "FCL · LCL · Courier", note: "Nuestro origen principal. Coordinamos la recepción de tu mercadería directamente con tu proveedor en China." },
  Brasil: { modes: "FCL · LCL", note: "Importamos desde Brasil con consolidación por kilo o contenedor completo, según el volumen." },
  India: { modes: "Marítimo · Aéreo", note: "Cotizamos envíos bajo pedido. Nos decís la modalidad y el plazo que necesitás." },
  "EE.UU.": { modes: "Marítimo · Aéreo", note: "Cotizamos envíos bajo pedido, según peso, volumen y urgencia." },
  Europa: { modes: "Marítimo · Aéreo", note: "Cotizamos envíos bajo pedido, con la modalidad que mejor se adapte a tu carga." },
};

const FAQS = [
  { q: "¿Cuánto tarda un envío?", a: "Depende del origen, la modalidad y los trámites de aduana. Te damos un plazo estimado en cada cotización, según tu caso." },
  { q: "¿Qué hace el despachante de aduana?", a: "Se encarga de la documentación de ingreso y de la presentación ante aduana. Te informamos cada paso para que sepas en qué etapa está tu carga." },
  { q: "¿Cuál es la diferencia entre FCL y LCL?", a: "FCL es un contenedor exclusivo para vos. LCL comparte contenedor con otros importadores y pagás por tu peso o volumen." },
  { q: "¿Puedo importar desde varios proveedores en un mismo envío?", a: "En carga consolidada sí, siempre que cada proveedor tenga su documentación lista. Lo coordinamos al momento de cotizar." },
  { q: "¿Cubren todo el país?", a: "Sí. Entregamos en todo el país desde Córdoba, hasta tu comercio o depósito." },
];

// Clases base de cada tarjeta
const CARD = "border border-gold-dim bg-ink-2 p-6 sm:p-8 shadow-[0_18px_50px_-28px_rgba(0,0,0,.9)]";
const CARD_HOVER = "transition duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_24px_60px_-28px_rgba(212,178,110,.35)]";
const LABEL = "text-[11px] font-medium uppercase tracking-[0.25em] text-gold";

function Illustration({ id }: { id: ModeId }) {
  if (id === "fcl") {
    return (
      <svg viewBox="0 0 400 240" className="h-full w-full" aria-hidden="true">
        <rect x="40" y="80" width="320" height="110" rx="3" fill="none" stroke="#d4b26e" strokeWidth="2" className="draw" />
        {Array.from({ length: 15 }).map((_, i) => (
          <line key={i} x1={60 + i * 20} y1="86" x2={60 + i * 20} y2="184" stroke="#d4b26e" strokeOpacity=".22" />
        ))}
        <rect x="150" y="112" width="100" height="44" fill="#d4b26e" fillOpacity=".15" stroke="#d4b26e" strokeOpacity=".7" />
        <text x="200" y="139" textAnchor="middle" fill="#fffaf0" fontFamily="Lora, serif" fontSize="14">
          40&apos; · FCL
        </text>
        <line x1="20" y1="206" x2="380" y2="206" stroke="#3a3120" strokeWidth="2" />
        <line x1="20" y1="206" x2="380" y2="206" stroke="#d4b26e" strokeWidth="2" strokeDasharray="14 18" className="road" />
      </svg>
    );
  }
  if (id === "lcl") {
    const boxes: [number, number][] = [
      [70, 60], [120, 60], [170, 60], [220, 60], [270, 60],
      [95, 112], [145, 112], [195, 112], [245, 112],
      [120, 164], [170, 164], [220, 164],
    ];
    return (
      <svg viewBox="0 0 400 240" className="h-full w-full" aria-hidden="true">
        <rect x="40" y="30" width="320" height="180" rx="3" fill="none" stroke="#d4b26e" strokeWidth="2" className="draw" />
        {boxes.map(([x, y], i) => (
          <rect
            key={i}
            x={x}
            y={y}
            width="38"
            height="38"
            fill="#d4b26e"
            fillOpacity={i % 3 === 0 ? 0.6 : 0.32}
            stroke="#d4b26e"
            strokeOpacity=".8"
            className="drop"
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}
        <text x="200" y="230" textAnchor="middle" fill="#d6cab0" fontFamily="Poppins, sans-serif" fontSize="11" letterSpacing="3">
          VARIOS IMPORTADORES
        </text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 240" className="h-full w-full" aria-hidden="true">
      <path id="arc" d="M50 170 Q200 20 350 170" fill="none" stroke="#d4b26e" strokeOpacity=".45" strokeWidth="1.5" strokeDasharray="5 7" />
      <circle cx="50" cy="170" r="5" fill="#d4b26e" />
      <circle cx="350" cy="170" r="5" fill="#d4b26e" />
      <text x="50" y="200" textAnchor="middle" fill="#d6cab0" fontFamily="Poppins, sans-serif" fontSize="10" letterSpacing="2">ORIGEN</text>
      <text x="350" y="200" textAnchor="middle" fill="#d6cab0" fontFamily="Poppins, sans-serif" fontSize="10" letterSpacing="2">TU PUERTA</text>
      <g>
        <path d="M-12 0 L4 -7 L14 0 L4 7 Z M-4 0 L-14 -9 L-10 0 L-14 9 Z" fill="#f0d690" />
        <animateMotion dur="5s" repeatCount="indefinite" rotate="auto">
          <mpath href="#arc" />
        </animateMotion>
      </g>
    </svg>
  );
}

function Bar({ label, value, delay }: { label: string; value: number; delay: number }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-[11px] uppercase tracking-[0.2em] text-soft">
        <span>{label}</span>
        <span className="tabular-nums text-cream">{value}%</span>
      </div>
      <div className="h-[3px] w-full rounded-full bg-gold-faint">
        <div className="bar-fill h-[3px] origin-left rounded-full bg-gold" style={{ width: `${value}%`, animationDelay: `${delay}ms` }} />
      </div>
    </div>
  );
}

function Estimator({ mode }: { mode: Mode }) {
  const [kg, setKg] = useState(200);

  if (mode.id !== "lcl") {
    return (
      <div className="border border-gold-dim bg-ink p-6">
        <p className={LABEL}>Costo</p>
        <p className="mt-3 text-sm leading-relaxed text-cream/90">
          {mode.id === "fcl"
            ? "El costo depende del tamaño del contenedor, el origen y la ruta. Te lo cotizamos según tu caso."
            : "El costo depende del peso, las dimensiones y el origen. Te lo cotizamos según tu caso."}
        </p>
      </div>
    );
  }

  return (
    <div className="border border-gold-dim bg-ink p-6">
      <p className={LABEL}>Estimación rápida</p>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-serif text-3xl text-cream">{kg.toLocaleString("es-AR")}</span>
        <span className="text-sm text-soft">kg</span>
      </div>
      <input
        type="range"
        min={10}
        max={1000}
        step={10}
        value={kg}
        onChange={(e) => setKg(Number(e.target.value))}
        aria-label="Peso estimado en kilos"
        className="mt-4 w-full accent-[#d4b26e]"
      />
      <div className="mt-5 border-t border-gold-dim pt-4">
        <p className="font-serif text-2xl text-gold">USD {(kg * SITE.pricePerKg).toLocaleString("es-AR")}</p>
        <p className="mt-2 text-xs leading-relaxed text-soft">
          Referencia de {SITE.pricePerKg} USD por kilo, sin impuestos ni gastos de aduana.
        </p>
      </div>
    </div>
  );
}

function Quiz({ onPick }: { onPick: (id: ModeId) => void }) {
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);

  const result: ModeId | null = !q1
    ? null
    : q1 === "mucha"
    ? "fcl"
    : q1 === "media"
    ? "lcl"
    : q2
    ? q2 === "urgente"
      ? "courier"
      : "lcl"
    : null;

  const opt = "w-full border px-4 py-3 text-left text-sm transition-colors duration-300";
  const on = "border-gold bg-gold/15 text-gold";
  const off = "border-gold-dim bg-ink text-cream hover:border-gold";

  return (
    <div className={`${CARD} grid gap-10 md:grid-cols-12`}>
      <div className="md:col-span-5">
        <p className={LABEL}>Asistente</p>
        <h2 className="mt-3 font-serif text-2xl text-cream sm:text-3xl">¿Cuál te conviene?</h2>
        <p className="mt-4 text-sm leading-relaxed text-cream/85">
          Respondé dos preguntas y te sugerimos la modalidad que mejor encaja con tu importación.
        </p>
      </div>

      <div className="space-y-8 md:col-span-7">
        <div>
          <p className="mb-3 text-sm text-cream">1. ¿Cuánta mercadería traés?</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              { v: "poca", l: "Menos de 100 kg" },
              { v: "media", l: "Entre 100 y 1.000 kg" },
              { v: "mucha", l: "Un contenedor o más" },
            ].map((o) => (
              <button key={o.v} onClick={() => { setQ1(o.v); setQ2(null); }} className={`${opt} ${q1 === o.v ? on : off}`}>
                {o.l}
              </button>
            ))}
          </div>
        </div>

        {q1 === "poca" && (
          <div className="animate-[fadeUp_.6s_ease_both]">
            <p className="mb-3 text-sm text-cream">2. ¿Qué tan urgente es?</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                { v: "urgente", l: "La necesito en pocos días" },
                { v: "normal", l: "Puedo esperar" },
              ].map((o) => (
                <button key={o.v} onClick={() => setQ2(o.v)} className={`${opt} ${q2 === o.v ? on : off}`}>
                  {o.l}
                </button>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div className="animate-[fadeUp_.6s_ease_both] border border-gold bg-gold/10 p-6">
            <p className={LABEL}>Te recomendamos</p>
            <p className="mt-2 font-serif text-2xl text-cream">{MODES.find((m) => m.id === result)?.name}</p>
            <p className="mt-2 text-sm text-cream/85">{MODES.find((m) => m.id === result)?.tagline}</p>
            <div className="mt-6 flex flex-wrap gap-5 text-sm">
              <button
                onClick={() => {
                  onPick(result);
                  document.getElementById("panel-modo")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="font-medium text-gold underline-offset-4 hover:underline"
              >
                Ver esta modalidad
              </button>
              <button
                onClick={() => { setQ1(null); setQ2(null); }}
                className="text-cream/70 underline-offset-4 hover:text-cream hover:underline"
              >
                Empezar de nuevo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ServiciosShowcase() {
  const [active, setActive] = useState<ModeId>("lcl");
  const mode = MODES.find((m) => m.id === active) ?? MODES[1];
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [openOrigin, setOpenOrigin] = useState<string | null>(null);

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
    const order: ModeId[] = ["fcl", "lcl", "courier"];
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const i = order.indexOf(active);
      if (e.key === "ArrowRight") setActive(order[(i + 1) % order.length]);
      if (e.key === "ArrowLeft") setActive(order[(i - 1 + order.length) % order.length]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <>
      {/* Asistente */}
      <section data-reveal className="reveal mt-20">
        <Quiz onPick={(id) => setActive(id)} />
      </section>

      {/* Selector en tarjetas */}
      <section data-reveal className="reveal mt-20">
        <p className={`${LABEL} mb-6`}>Elegí una modalidad</p>
        <div role="tablist" aria-label="Modalidades" className="grid gap-4 md:grid-cols-3">
          {MODES.map((m) => {
            const selected = m.id === active;
            return (
              <button
                key={m.id}
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(m.id)}
                className={`group relative border p-6 text-left transition duration-300 ${
                  selected
                    ? "border-gold bg-gold/10 shadow-[0_20px_50px_-25px_rgba(212,178,110,.5)]"
                    : "border-gold-dim bg-ink-2 hover:-translate-y-1 hover:border-gold"
                }`}
              >
                <span className={`font-serif text-3xl ${selected ? "text-gold" : "text-cream"}`}>{m.code}</span>
                <span className="mt-2 block text-sm text-cream">{m.name}</span>
                <span className="mt-1 block text-xs text-soft">{m.tagline}</span>
                <span
                  className={`absolute inset-x-6 bottom-0 h-[2px] origin-center rounded-full bg-gold transition-transform duration-500 ${
                    selected ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* Panel principal */}
      <section id="panel-modo" role="tabpanel" className="mt-10">
        <div key={mode.id} className="panel-enter grid gap-6 md:grid-cols-2">
          <div className={`${CARD} relative flex aspect-[5/3] items-center justify-center`}>
            <Illustration id={mode.id} />
          </div>

          <div className={CARD}>
            <p className="font-serif text-4xl text-gold">{mode.code}</p>
            <h2 className="mt-2 text-xl text-cream sm:text-2xl">{mode.name}</h2>
            <p className="mt-1 text-sm italic text-gold">{mode.tagline}</p>
            <p className="mt-5 text-base leading-relaxed text-cream/90">{mode.text}</p>

            <div className="mt-8 space-y-5">
              <Bar label="Volumen ideal" value={mode.bars.volumen} delay={100} />
              <Bar label="Economía por kilo" value={mode.bars.economia} delay={200} />
              <Bar label="Velocidad" value={mode.bars.velocidad} delay={300} />
            </div>

            <div className="mt-8">
              <Estimator mode={mode} />
            </div>
          </div>
        </div>

        {/* Qué incluye / para quién */}
        <div key={mode.id + "-info"} className="panel-enter mt-6 grid gap-6 md:grid-cols-3">
          <div className={CARD}>
            <p className={`${LABEL} mb-5`}>Qué incluye</p>
            <ul className="space-y-4">
              {mode.incluye.map((p, i) => (
                <li key={p} className="point-in flex gap-3 text-sm text-cream" style={{ animationDelay: `${120 + i * 80}ms` }}>
                  <svg viewBox="0 0 16 16" className="mt-[5px] h-3 w-3 shrink-0" aria-hidden="true">
                    <path d="M2 8.5 L6 12 L14 4" fill="none" stroke="#f2cf7e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="check" style={{ animationDelay: `${120 + i * 80}ms` }} />
                  </svg>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={CARD}>
            <p className={`${LABEL} mb-5`}>Conviene si</p>
            <ul className="space-y-3 text-sm text-cream">
              {mode.ideal.map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={CARD}>
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.25em] text-soft">Mejor evitarla si</p>
            <ul className="space-y-3 text-sm text-cream/85">
              {mode.noIdeal.map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-soft" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Proceso en tarjetas */}
        <div key={mode.id + "-steps"} className="panel-enter mt-20">
          <p className={LABEL}>Cómo funciona</p>
          <h3 className="mt-3 font-serif text-2xl text-cream sm:text-3xl">El proceso, paso a paso</h3>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mode.steps.map((s, i) => (
              <li
                key={s}
                data-reveal
                className={`reveal ${CARD} ${CARD_HOVER} relative pt-8`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="absolute -top-3 left-6 grid h-7 w-7 place-items-center bg-gold font-serif text-xs text-ink">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-cream">{s}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Documentación en tarjetas */}
        <div key={mode.id + "-docs"} className="panel-enter mt-20">
          <p className={LABEL}>Documentación</p>
          <h3 className="mt-3 font-serif text-2xl text-cream">Lo que suele pedirse</h3>
          <p className="mt-3 text-sm text-cream/80">La lista exacta depende de tu producto y de tu proveedor. Te la confirmamos al cotizar.</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {mode.docs.map((d) => (
              <li key={d} className={`${CARD} ${CARD_HOVER} flex items-center gap-4 p-5`}>
                <span className="grid h-8 w-8 shrink-0 place-items-center border border-gold text-gold">
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                    <path d="M3 8.5 L6.5 12 L13 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-sm text-cream">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Comparativa en tarjeta */}
      <section data-reveal className="reveal mt-24">
        <div className={CARD}>
          <p className={LABEL}>Comparativa</p>
          <h2 className="mt-3 font-serif text-3xl text-cream sm:text-4xl">Las tres modalidades, lado a lado</h2>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-gold text-[11px] uppercase tracking-[0.2em] text-gold">
                  <th className="py-4 pr-4 font-normal text-soft">&nbsp;</th>
                  <th className="py-4 pr-4 font-serif text-base font-normal text-cream">FCL</th>
                  <th className="py-4 pr-4 font-serif text-base font-normal text-cream">LCL</th>
                  <th className="py-4 font-serif text-base font-normal text-cream">Courier</th>
                </tr>
              </thead>
              <tbody className="text-cream">
                {[
                  ["Cobro", "Por contenedor", "Por kilo o m³", "Por peso"],
                  ["Ideal para", "Cargas grandes", "Cargas medianas", "Cargas livianas"],
                  ["Compartís contenedor", "No", "Sí", "No aplica"],
                  ["Velocidad", "Media", "Media", "Alta"],
                  ["Cotización", "Según contenedor", "Según kilos", "Según peso"],
                ].map((row) => (
                  <tr key={row[0]} className="border-b border-gold-dim">
                    <td className="py-4 pr-4 text-soft">{row[0]}</td>
                    <td className="py-4 pr-4">{row[1]}</td>
                    <td className="py-4 pr-4">{row[2]}</td>
                    <td className="py-4">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Orígenes en tarjetas */}
      <section data-reveal className="reveal mt-24">
        <p className={LABEL}>Orígenes</p>
        <h2 className="mt-3 font-serif text-2xl text-cream sm:text-3xl">Desde dónde importamos</h2>
        <p className="mt-3 text-sm text-cream/80">Tocá un origen para ver qué modalidades trabajamos desde allí.</p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ORIGINS.map((o) => {
            const open = openOrigin === o;
            const info = ORIGIN_INFO[o];
            return (
              <li key={o} className={`${CARD} p-0 ${open ? "border-gold" : ""}`}>
                <button
                  onClick={() => setOpenOrigin(open ? null : o)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between p-6 text-left transition hover:text-gold"
                >
                  <span className="font-serif text-xl text-cream">{o}</span>
                  <span className={`text-xl text-gold transition-transform duration-300 ${open ? "rotate-45" : ""}`}>+</span>
                </button>
                <div className={`grid transition-all duration-500 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6">
                      <p className={LABEL}>{info?.modes}</p>
                      <p className="mt-3 text-sm leading-relaxed text-cream/90">{info?.note}</p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Preguntas en tarjetas */}
      <section data-reveal className="reveal mt-24">
        <p className={LABEL}>Preguntas frecuentes</p>
        <h2 className="mt-3 font-serif text-2xl text-cream sm:text-3xl">Lo que más nos preguntan</h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {FAQS.map((f, i) => {
            const open = openFaq === i;
            return (
              <li key={f.q} className={`${CARD} p-0 ${open ? "border-gold" : ""}`}>
                <button
                  onClick={() => setOpenFaq(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-6 p-6 text-left transition hover:text-gold"
                >
                  <span className="text-base text-cream">{f.q}</span>
                  <span className={`text-xl text-gold transition-transform duration-300 ${open ? "rotate-45" : ""}`}>+</span>
                </button>
                <div className={`grid transition-all duration-500 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-sm leading-relaxed text-cream/90">{f.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Cierre en tarjeta */}
      <section data-reveal className="reveal mt-24">
        <div className={`${CARD} flex flex-col items-start justify-between gap-8 md:flex-row md:items-center`}>
          <div>
            <p className="font-serif text-2xl text-cream sm:text-3xl">¿Tenés una importación en mente?</p>
            <p className="mt-2 text-sm text-cream/85">Contanos qué querés traer y te pasamos una cotización sin compromiso.</p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <a href={waLink()} target="_blank" rel="noopener" className="font-medium text-gold underline-offset-4 hover:underline">
              Cotizar por WhatsApp
            </a>
            <Link href="/simulacion" className="text-cream underline-offset-4 hover:text-gold hover:underline">
              Ver simulación de costos
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity .9s ease, transform .9s cubic-bezier(.2,.8,.2,1); }
        .reveal.is-in { opacity: 1; transform: none; }

        .panel-enter { animation: panel-in .7s cubic-bezier(.2,.8,.2,1) both; }
        @keyframes panel-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

        .point-in { animation: point-in .6s ease both; }
        @keyframes point-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: none; } }

        .check { stroke-dasharray: 1; stroke-dashoffset: 1; animation: draw-check .7s ease forwards; }
        @keyframes draw-check { to { stroke-dashoffset: 0; } }

        .draw { stroke-dasharray: 800; stroke-dashoffset: 800; animation: draw 1.6s ease forwards; }
        @keyframes draw { to { stroke-dashoffset: 0; } }

        .drop { opacity: 0; transform: translateY(-40px); animation: drop .6s cubic-bezier(.2,.8,.2,1) forwards; transform-box: fill-box; }
        @keyframes drop { to { opacity: 1; transform: translateY(0); } }

        .road { animation: road-move 1s linear infinite; }
        @keyframes road-move { to { stroke-dashoffset: -32; } }

        .bar-fill { transform: scaleX(0); animation: bar-in 1s cubic-bezier(.2,.8,.2,1) forwards; }
        @keyframes bar-in { to { transform: scaleX(1); } }

        @media (prefers-reduced-motion: reduce) {
          .reveal, .panel-enter, .point-in, .draw, .drop, .road, .bar-fill, .check { animation: none !important; transition: none !important; opacity: 1; transform: none; stroke-dashoffset: 0; }
        }
      `}</style>
    </>
  );
}