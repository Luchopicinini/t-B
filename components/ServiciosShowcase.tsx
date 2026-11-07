"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

const EASE = "ease-[cubic-bezier(.22,1,.36,1)]";
const LABEL = "text-[11px] font-medium uppercase tracking-[0.28em] text-gold";
const H2 = "mt-4 font-serif text-2xl leading-tight text-cream sm:text-4xl";
const RULE = "border-t border-gold-faint";
const SECTION = "mt-20 sm:mt-28";
const SURFACE = "bg-white rounded-sm shadow-[0_12px_30px_-18px_rgba(70,50,20,.3)] ring-1 ring-gold-faint";

function Illustration({ id }: { id: ModeId }) {
  if (id === "fcl") {
    return (
      <svg viewBox="0 0 400 240" className="block h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <rect x="40" y="80" width="320" height="110" rx="3" fill="none" stroke="#8c6428" strokeWidth="2" className="draw" />
        {Array.from({ length: 15 }).map((_, i) => (
          <line key={i} x1={60 + i * 20} y1="86" x2={60 + i * 20} y2="184" stroke="#8c6428" strokeOpacity=".2" />
        ))}
        <rect x="150" y="112" width="100" height="44" fill="#8c6428" fillOpacity=".1" stroke="#8c6428" strokeOpacity=".7" />
        <text x="200" y="139" textAnchor="middle" fill="#1c1812" fontFamily="Lora, serif" fontSize="14">
          40&apos; · FCL
        </text>
        <line x1="20" y1="206" x2="380" y2="206" stroke="#e4d9c1" strokeWidth="2" />
        <line x1="20" y1="206" x2="380" y2="206" stroke="#8c6428" strokeWidth="2" strokeDasharray="14 18" className="road" />
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
      <svg viewBox="0 0 400 240" className="block h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <rect x="40" y="30" width="320" height="180" rx="3" fill="none" stroke="#8c6428" strokeWidth="2" className="draw" />
        {boxes.map(([x, y], i) => (
          <rect
            key={i}
            x={x}
            y={y}
            width="38"
            height="38"
            fill="#8c6428"
            fillOpacity={i % 3 === 0 ? 0.45 : 0.22}
            stroke="#8c6428"
            strokeOpacity=".7"
            className="drop"
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}
        <text x="200" y="230" textAnchor="middle" fill="#5e5444" fontFamily="Poppins, sans-serif" fontSize="11" letterSpacing="3">
          VARIOS IMPORTADORES
        </text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 240" className="block h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <path id="arc" d="M50 170 Q200 20 350 170" fill="none" stroke="#8c6428" strokeOpacity=".4" strokeWidth="1.5" strokeDasharray="5 7" />
      <circle cx="50" cy="170" r="5" fill="#8c6428" />
      <circle cx="350" cy="170" r="5" fill="#8c6428" />
      <text x="50" y="200" textAnchor="middle" fill="#5e5444" fontFamily="Poppins, sans-serif" fontSize="10" letterSpacing="2">ORIGEN</text>
      <text x="350" y="200" textAnchor="middle" fill="#5e5444" fontFamily="Poppins, sans-serif" fontSize="10" letterSpacing="2">TU PUERTA</text>
      <g>
        <path d="M-12 0 L4 -7 L14 0 L4 7 Z M-4 0 L-14 -9 L-10 0 L-14 9 Z" fill="#8c6428" />
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
      <div className="mb-2 flex justify-between text-[11px] uppercase tracking-[0.22em] text-soft">
        <span>{label}</span>
        <span className="tabular-nums text-cream">{value}%</span>
      </div>
      <div className="h-px w-full bg-gold-faint">
        <div className="bar-fill h-px origin-left bg-gold" style={{ width: `${value}%`, animationDelay: `${delay}ms` }} />
      </div>
    </div>
  );
}

function Estimator({ mode }: { mode: Mode }) {
  const [kg, setKg] = useState(200);

  if (mode.id !== "lcl") {
    return (
      <p className="text-sm leading-relaxed text-cream/85">
        {mode.id === "fcl"
          ? "El costo depende del tamaño del contenedor, el origen y la ruta. Te lo cotizamos según tu caso."
          : "El costo depende del peso, las dimensiones y el origen. Te lo cotizamos según tu caso."}
      </p>
    );
  }

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className={LABEL}>Estimación rápida</p>
        <p className="font-serif text-2xl tabular-nums text-cream">
          {kg.toLocaleString("es-AR")} <span className="font-sans text-sm text-soft">kg</span>
        </p>
      </div>
      <input
        type="range"
        min={10}
        max={1000}
        step={10}
        value={kg}
        onChange={(e) => setKg(Number(e.target.value))}
        aria-label="Peso estimado en kilos"
        className="mt-5 w-full accent-[#8c6428]"
      />
      <p className="mt-5 font-serif text-3xl text-gold">USD {(kg * SITE.pricePerKg).toLocaleString("es-AR")}</p>
      <p className="mt-2 text-xs leading-relaxed text-soft">
        Referencia de {SITE.pricePerKg} USD por kilo, sin impuestos ni gastos de aduana.
      </p>
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

  const option = (selected: boolean) =>
    `flex min-h-[46px] w-full items-center justify-center border px-5 py-2.5 text-center text-sm transition-colors duration-300 sm:w-auto ${
      selected
        ? "border-gold bg-gold text-white"
        : "border-gold-dim bg-transparent text-cream hover:border-gold hover:text-gold"
    }`;

  return (
    <div className="grid gap-10 md:grid-cols-12">
      <div className="md:col-span-4">
        <p className={LABEL}>Asistente</p>
        <h2 className={H2}>¿Cuál te conviene?</h2>
        <p className="mt-4 text-sm leading-relaxed text-cream/80">
          Respondé dos preguntas y te sugerimos la modalidad que mejor encaja con tu importación.
        </p>
      </div>

      <div className="min-w-0 space-y-10 md:col-span-8">
        <div>
          <p className="mb-4 text-sm text-cream">1. ¿Cuánta mercadería traés?</p>
          <div className="grid gap-3 sm:flex sm:flex-wrap sm:gap-3">
            {[
              { v: "poca", l: "Menos de 100 kg" },
              { v: "media", l: "Entre 100 y 1.000 kg" },
              { v: "mucha", l: "Un contenedor o más" },
            ].map((o) => (
              <button
                key={o.v}
                onClick={() => { setQ1(o.v); setQ2(null); }}
                aria-pressed={q1 === o.v}
                className={option(q1 === o.v)}
              >
                {o.l}
              </button>
            ))}
          </div>
        </div>

        {q1 === "poca" && (
          <div className="rise">
            <p className="mb-4 text-sm text-cream">2. ¿Qué tan urgente es?</p>
            <div className="grid gap-3 sm:flex sm:flex-wrap sm:gap-3">
              {[
                { v: "urgente", l: "La necesito en pocos días" },
                { v: "normal", l: "Puedo esperar" },
              ].map((o) => (
                <button
                  key={o.v}
                  onClick={() => setQ2(o.v)}
                  aria-pressed={q2 === o.v}
                  className={option(q2 === o.v)}
                >
                  {o.l}
                </button>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div className={`rise ${RULE} pt-6`}>
            <p className={LABEL}>Te recomendamos</p>
            <p className="mt-3 font-serif text-3xl text-cream">{MODES.find((m) => m.id === result)?.name}</p>
            <p className="mt-2 text-sm text-cream/75">{MODES.find((m) => m.id === result)?.tagline}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <button
                onClick={() => {
                  onPick(result);
                  document.getElementById("panel-modo")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="border border-gold bg-gold px-6 py-3 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-transparent hover:text-gold"
              >
                Ver esta modalidad
              </button>
              <button
                onClick={() => { setQ1(null); setQ2(null); }}
                className="border border-gold-dim px-6 py-3 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-cream transition hover:border-gold hover:text-gold"
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

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [ind, setInd] = useState({ x: 0, w: 0 });

  useEffect(() => {
    const measure = () => {
      const el = tabRefs.current[active];
      if (el) setInd({ x: el.offsetLeft, w: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [active]);

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
      <section data-reveal className="reveal mt-14 sm:mt-24">
        <Quiz onPick={(id) => setActive(id)} />
      </section>

      {/* Selector de modalidad */}
      <section data-reveal className="reveal mt-16 sm:mt-24">
        <p className={LABEL}>Elegí una modalidad</p>
        <div className="relative mt-6 flex gap-8 overflow-x-auto pb-4 sm:gap-14" role="tablist" aria-label="Modalidades">
          {MODES.map((m) => {
            const selected = m.id === active;
            return (
              <button
                key={m.id}
                ref={(el) => {
                  tabRefs.current[m.id] = el;
                }}
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(m.id)}
                className={`shrink-0 pb-3 text-left transition-colors duration-500 ${EASE} ${
                  selected ? "text-gold" : "text-cream/50 hover:text-cream"
                }`}
              >
                <span className="block font-serif text-3xl leading-none sm:text-5xl">{m.code}</span>
                <span className="mt-2 block text-[11px] uppercase tracking-[0.2em] sm:text-xs">{m.name}</span>
              </button>
            );
          })}
          <span
            className={`absolute bottom-0 h-[2px] bg-gold transition-all duration-700 ${EASE}`}
            style={{ transform: `translateX(${ind.x}px)`, width: ind.w }}
          />
        </div>
      </section>

      {/* Panel principal: columnas de ancho fijo, nada se superpone */}
      <section id="panel-modo" role="tabpanel" className="mt-12 w-full min-w-0 sm:mt-16">
        <div
          key={mode.id}
          className="rise grid w-full min-w-0 grid-cols-1 gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-16"
        >
          <div className="min-w-0">
            <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[5/3]">
              <Illustration id={mode.id} />
            </div>
            <div className="mt-8 space-y-5">
              <Bar label="Volumen ideal" value={mode.bars.volumen} delay={100} />
              <Bar label="Economía por kilo" value={mode.bars.economia} delay={200} />
              <Bar label="Velocidad" value={mode.bars.velocidad} delay={300} />
            </div>
          </div>

          <div className="min-w-0">
            <p className="font-serif text-6xl leading-none text-gold sm:text-7xl">{mode.code}</p>
            <h2 className="mt-4 font-serif text-2xl text-cream sm:text-3xl">{mode.name}</h2>
            <p className="mt-2 text-sm italic text-gold">{mode.tagline}</p>
            <p className="mt-6 text-base leading-relaxed text-cream/85">{mode.text}</p>

            <div className={`${RULE} mt-10 pt-8`}>
              <Estimator mode={mode} />
            </div>
          </div>
        </div>

        {/* Qué incluye / para quién */}
        <div key={mode.id + "-info"} className={`rise ${SECTION} grid gap-12 md:grid-cols-3 md:gap-0`}>
          <div className="md:pr-10">
            <p className={LABEL}>Qué incluye</p>
            <ul className="mt-6 space-y-4">
              {mode.incluye.map((p, i) => (
                <li key={p} className="point-in flex gap-4 text-sm text-cream" style={{ animationDelay: `${120 + i * 80}ms` }}>
                  <span className="mt-[9px] h-px w-4 shrink-0 bg-gold" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:border-l md:border-gold-faint md:px-10">
            <p className={LABEL}>Conviene si</p>
            <ul className="mt-6 space-y-4 text-sm text-cream">
              {mode.ideal.map((p) => (
                <li key={p} className="flex gap-4">
                  <span className="mt-[9px] h-px w-4 shrink-0 bg-gold" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:border-l md:border-gold-faint md:pl-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-soft">Mejor evitarla si</p>
            <ul className="mt-6 space-y-4 text-sm text-cream/75">
              {mode.noIdeal.map((p) => (
                <li key={p} className="flex gap-4">
                  <span className="mt-[9px] h-px w-4 shrink-0 bg-soft" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Proceso */}
        <div key={mode.id + "-steps"} className={`rise ${SECTION}`}>
          <p className={LABEL}>Cómo funciona</p>
          <h3 className={H2}>El proceso, paso a paso</h3>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {mode.steps.map((s, i) => (
              <li
                key={s}
                data-reveal
                className={`reveal ${SURFACE} relative p-6 pt-8`}
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <span className="absolute -top-[5px] left-6 h-2.5 w-2.5 rounded-full bg-gold" />
                <p className="font-serif text-lg text-gold">0{i + 1}</p>
                <p className="mt-2 text-sm leading-relaxed text-cream">{s}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Documentación */}
        <div key={mode.id + "-docs"} className={`rise ${SECTION} grid gap-10 md:grid-cols-12`}>
          <div className="md:col-span-4">
            <p className={LABEL}>Documentación</p>
            <h3 className="mt-4 font-serif text-xl text-cream sm:text-2xl">Lo que suele pedirse</h3>
            <p className="mt-3 text-sm leading-relaxed text-cream/75">
              La lista exacta depende de tu producto y de tu proveedor. Te la confirmamos al cotizar.
            </p>
          </div>
          <ul className="space-y-3 md:col-span-8">
            {mode.docs.map((d, i) => (
              <li
                key={d}
                data-reveal
                className={`reveal ${SURFACE} flex items-center justify-between gap-6 px-6 py-5`}
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <span className="text-sm text-cream">{d}</span>
                <span className="font-serif text-sm text-gold/80">0{i + 1}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Comparativa */}
      <section data-reveal className={`reveal ${SECTION}`}>
        <p className={LABEL}>Comparativa</p>
        <h2 className={H2}>Las tres modalidades, lado a lado</h2>
        <p className="mt-2 text-[11px] text-soft sm:hidden">Deslizá la tabla para ver todo →</p>
        <div className={`${SURFACE} mt-10 overflow-x-auto p-4 sm:p-8`}>
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gold text-[11px] uppercase tracking-[0.22em] text-gold">
                <th className="py-4 pr-4 font-normal text-soft">&nbsp;</th>
                <th className="py-4 pr-4 font-serif text-base font-normal normal-case tracking-normal text-cream">FCL</th>
                <th className="py-4 pr-4 font-serif text-base font-normal normal-case tracking-normal text-cream">LCL</th>
                <th className="py-4 font-serif text-base font-normal normal-case tracking-normal text-cream">Courier</th>
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
                <tr key={row[0]} className="border-b border-gold-faint">
                  <td className="py-5 pr-4 text-soft">{row[0]}</td>
                  <td className="py-5 pr-4">{row[1]}</td>
                  <td className="py-5 pr-4">{row[2]}</td>
                  <td className="py-5">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Orígenes y preguntas */}
      <section data-reveal className={`reveal ${SECTION} grid gap-16 md:grid-cols-2 md:gap-20`}>
        <div className="min-w-0">
          <p className={LABEL}>Orígenes</p>
          <h2 className={H2}>Desde dónde importamos</h2>
          <ul className="mt-10">
            {ORIGINS.map((o) => {
              const open = openOrigin === o;
              const info = ORIGIN_INFO[o];
              return (
                <li key={o} className={RULE}>
                  <button
                    onClick={() => setOpenOrigin(open ? null : o)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between py-5 text-left transition-colors duration-500 hover:text-gold"
                  >
                    <span className="font-serif text-xl text-cream">{o}</span>
                    <span className={`text-lg text-gold transition-transform duration-700 ${EASE} ${open ? "rotate-45" : ""}`}>+</span>
                  </button>
                  <div className={`grid transition-[grid-template-rows,opacity] duration-700 ${EASE} ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <p className={`${LABEL} pb-2`}>{info?.modes}</p>
                      <p className="pb-6 text-sm leading-relaxed text-cream/80">{info?.note}</p>
                    </div>
                  </div>
                </li>
              );
            })}
            <li className={RULE} />
          </ul>
        </div>

        <div className="min-w-0">
          <p className={LABEL}>Preguntas frecuentes</p>
          <h2 className={H2}>Lo que más nos preguntan</h2>
          <ul className="mt-10">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <li key={f.q} className={RULE}>
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors duration-500 hover:text-gold"
                  >
                    <span className="text-sm text-cream sm:text-base">{f.q}</span>
                    <span className={`shrink-0 text-lg text-gold transition-transform duration-700 ${EASE} ${open ? "rotate-45" : ""}`}>+</span>
                  </button>
                  <div className={`grid transition-[grid-template-rows,opacity] duration-700 ${EASE} ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <p className="pb-6 text-sm leading-relaxed text-cream/80">{f.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
            <li className={RULE} />
          </ul>
        </div>
      </section>

      {/* Cierre */}
      <section data-reveal className={`reveal ${SECTION} pb-4`}>
        <div className={`${RULE} flex flex-col gap-8 pt-14 md:flex-row md:items-end md:justify-between`}>
          <div>
            <p className="font-serif text-2xl text-cream sm:text-4xl">¿Tenés una importación en mente?</p>
            <p className="mt-3 text-sm text-cream/75">Contanos qué querés traer y te pasamos una cotización sin compromiso.</p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
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
        .reveal {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1);
        }
        .reveal.is-in { opacity: 1; transform: none; }

        .rise { animation: rise .8s cubic-bezier(.22,1,.36,1) both; }
        @keyframes rise {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: none; }
        }

        .point-in { animation: point-in .7s cubic-bezier(.22,1,.36,1) both; }
        @keyframes point-in { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: none; } }

        .draw { stroke-dasharray: 800; stroke-dashoffset: 800; animation: draw 2s cubic-bezier(.22,1,.36,1) forwards; }
        @keyframes draw { to { stroke-dashoffset: 0; } }

        .drop { opacity: 0; transform: translateY(-30px); animation: drop .9s cubic-bezier(.22,1,.36,1) forwards; transform-box: fill-box; }
        @keyframes drop { to { opacity: 1; transform: translateY(0); } }

        .road { animation: road-move 1.4s linear infinite; }
        @keyframes road-move { to { stroke-dashoffset: -32; } }

        .bar-fill { transform: scaleX(0); animation: bar-in 1.4s cubic-bezier(.22,1,.36,1) forwards; }
        @keyframes bar-in { to { transform: scaleX(1); } }

        @media (prefers-reduced-motion: reduce) {
          .reveal, .rise, .point-in, .draw, .drop, .road, .bar-fill {
            animation: none !important;
            transition: none !important;
            opacity: 1;
            transform: none;
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </>
  );
}