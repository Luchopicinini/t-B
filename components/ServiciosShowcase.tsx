"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ORIGINS, SITE, waLink } from "@/lib/site";

type ModeId = "fcl" | "lcl" | "courier";

interface ModeSpec {
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
  metrics: { volumen: number; economia: number; velocidad: number };
}

const MODES: ModeSpec[] = [
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
    ideal: [
      "Volúmenes grandes o cargas pesadas",
      "Importaciones periódicas y planificadas",
      "Mercadería que no conviene mezclar con otra",
    ],
    noIdeal: [
      "Pedidos chicos o de pocos kilos",
      "Cuando necesitás la mercadería con urgencia",
    ],
    docs: [
      "Factura comercial del proveedor",
      "Lista de empaque (packing list)",
      "Conocimiento de embarque (BL)",
      "Certificados que requiera tu producto",
    ],
    steps: [
      "Nos pasás producto, volumen y proveedor",
      "Te enviamos cotización del contenedor y del flete",
      "Coordinamos la carga en origen con tu proveedor",
      "El contenedor embarca hacia Argentina",
      "Nuestro despachante gestiona la aduana",
      "Entregamos en tu depósito",
    ],
    metrics: { volumen: 95, economia: 90, velocidad: 50 },
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
    ideal: [
      "Cargas medianas o chicas",
      "Reposición regular de mercadería",
      "Primer paso para importar sin gran inversión",
    ],
    noIdeal: [
      "Cargas que ya ocupan un contenedor entero",
      "Mercadería que necesita viajar aislada",
    ],
    docs: [
      "Factura comercial de cada proveedor",
      "Lista de empaque (packing list)",
      "Documentación de consolidación",
      "Certificados según el producto",
    ],
    steps: [
      "Nos contás qué querés importar",
      "Recibís presupuesto calculado por kilo",
      "Coordinamos la recepción en China o Brasil",
      "Consolidamos tu carga y embarcamos",
      "Nuestro despachante gestiona la aduana",
      "Te la llevamos a tu puerta",
    ],
    metrics: { volumen: 45, economia: 70, velocidad: 50 },
  },
  {
    id: "courier",
    code: "COURIER",
    name: "Courier aéreo",
    tagline: "Cuando el tiempo importa.",
    text: "Enviamos cargas livianas por vía aérea. Es la opción más rápida para reponer stock o resolver una urgencia, y la mercadería llega directo a la dirección que indiques.",
    incluye: [
      "Envío aéreo desde el origen",
      "Coordinación del retiro con tu proveedor",
      "Gestión de aduana para envíos livianos",
      "Entrega puerta a puerta",
    ],
    ideal: [
      "Cargas livianas",
      "Reposición urgente de stock",
      "Muestras y productos de alto valor",
    ],
    noIdeal: [
      "Cargas pesadas o voluminosas",
      "Cuando el costo por kilo es la prioridad",
    ],
    docs: [
      "Factura comercial",
      "Datos del proveedor y del destinatario",
    ],
    steps: [
      "Nos pasás el producto y el peso aproximado",
      "Cotizamos el envío aéreo",
      "Coordinamos el retiro en origen",
      "La carga vuela hacia Argentina",
      "Despacho aduanero",
      "Entrega puerta a puerta",
    ],
    metrics: { volumen: 15, economia: 25, velocidad: 95 },
  },
];

const ORIGIN_INFO: Record<string, { modes: string; note: string }> = {
  China: {
    modes: "FCL · LCL · Courier",
    note: "Nuestro origen principal. Coordinamos la recepción de tu mercadería directamente con tu proveedor en China.",
  },
  Brasil: {
    modes: "FCL · LCL",
    note: "Importamos desde Brasil con consolidación por kilo o contenedor completo, según el volumen.",
  },
  India: {
    modes: "Marítimo · Aéreo",
    note: "Cotizamos envíos bajo pedido. Nos decís la modalidad y el plazo que necesitás.",
  },
  "EE.UU.": {
    modes: "Marítimo · Aéreo",
    note: "Cotizamos envíos bajo pedido, según peso, volumen y urgencia.",
  },
  Europa: {
    modes: "Marítimo · Aéreo",
    note: "Cotizamos envíos bajo pedido, con la modalidad que mejor se adapte a tu carga.",
  },
};

const FAQS = [
  {
    q: "¿Cuánto tarda un envío?",
    a: "Depende del origen, la modalidad y los trámites de aduana. Te damos un plazo estimado en cada cotización, según tu caso.",
  },
  {
    q: "¿Qué hace el despachante de aduana?",
    a: "Se encarga de la documentación de ingreso y de la presentación ante aduana. Te informamos cada paso para que sepas en qué etapa está tu carga.",
  },
  {
    q: "¿Cuál es la diferencia entre FCL y LCL?",
    a: "FCL es un contenedor exclusivo para vos. LCL comparte contenedor con otros importadores y pagás por tu peso o volumen.",
  },
  {
    q: "¿Puedo importar desde varios proveedores en un mismo envío?",
    a: "En carga consolidada sí, siempre que cada proveedor tenga su documentación lista. Lo coordinamos al momento de cotizar.",
  },
  {
    q: "¿Cubren todo el país?",
    a: "Sí. Entregamos en todo el país desde Córdoba, hasta tu comercio o depósito.",
  },
];

const COMPARISON_ROWS = [
  ["Cobro", "Por contenedor", "Por kilo o m³", "Por peso"],
  ["Ideal para", "Cargas grandes", "Cargas medianas", "Cargas livianas"],
  ["Compartís contenedor", "No", "Sí", "No aplica"],
  ["Velocidad", "Media", "Media", "Alta"],
  ["Cotización", "Según contenedor", "Según kilos", "Según peso"],
];

const EYEBROW = "text-[11px] font-medium uppercase tracking-[0.22em] text-gold";
const HEADING = "mt-2 font-serif text-2xl text-cream sm:text-3xl";

function ModeSchema({ id }: { id: ModeId }) {
  if (id === "fcl") {
    return (
      <div className="border border-gold-faint bg-[#faf7f2] p-4">
        <svg viewBox="0 0 400 200" className="block h-auto w-full" aria-hidden="true">
          <rect x="44" y="54" width="312" height="96" fill="none" stroke="#8c6428" strokeWidth="1.5" />
          {Array.from({ length: 13 }).map((_, idx) => (
            <line
              key={idx}
              x1={66 + idx * 22}
              y1="58"
              x2={66 + idx * 22}
              y2="146"
              stroke="#8c6428"
              strokeOpacity=".22"
            />
          ))}
          <rect x="145" y="82" width="110" height="40" fill="#ffffff" stroke="#8c6428" strokeWidth="1.2" />
          <text x="200" y="107" textAnchor="middle" fill="#1c1812" fontSize="13">
            40&apos; · FCL
          </text>
          <line x1="28" y1="170" x2="372" y2="170" stroke="#8c6428" strokeOpacity=".35" />
        </svg>
        <p className="mt-2 text-xs text-soft">Contenedor exclusivo asignado a un solo embarque</p>
      </div>
    );
  }

  if (id === "lcl") {
    const slots: [number, number][] = [
      [74, 46], [122, 46], [170, 46], [218, 46], [266, 46],
      [98, 92], [146, 92], [194, 92], [242, 92],
      [122, 138], [170, 138], [218, 138],
    ];
    return (
      <div className="border border-gold-faint bg-[#faf7f2] p-4">
        <svg viewBox="0 0 400 200" className="block h-auto w-full" aria-hidden="true">
          <rect x="44" y="24" width="312" height="156" fill="none" stroke="#8c6428" strokeWidth="1.5" />
          {slots.map(([x, y], idx) => (
            <rect
              key={idx}
              x={x}
              y={y}
              width="36"
              height="34"
              fill={idx % 3 === 0 ? "#8c6428" : "#ffffff"}
              fillOpacity={idx % 3 === 0 ? 0.25 : 1}
              stroke="#8c6428"
              strokeOpacity=".65"
            />
          ))}
        </svg>
        <p className="mt-2 text-xs text-soft">Consolidación compartida en el mismo contenedor</p>
      </div>
    );
  }

  return (
    <div className="border border-gold-faint bg-[#faf7f2] p-4">
      <svg viewBox="0 0 400 200" className="block h-auto w-full" aria-hidden="true">
        <path
          d="M56 142 Q200 26 344 142"
          fill="none"
          stroke="#8c6428"
          strokeWidth="1.5"
          strokeDasharray="5 5"
        />
        <circle cx="56" cy="142" r="4.5" fill="#8c6428" />
        <circle cx="344" cy="142" r="4.5" fill="#8c6428" />
        <text x="56" y="166" textAnchor="middle" fill="#5e5444" fontSize="10" letterSpacing="2">
          ORIGEN
        </text>
        <text x="344" y="166" textAnchor="middle" fill="#5e5444" fontSize="10" letterSpacing="2">
          DESTINO
        </text>
      </svg>
      <p className="mt-2 text-xs text-soft">Tránsito aéreo directo para envíos livianos o urgentes</p>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-xs">
        <span className="text-cream/85">{label}</span>
        <span className="tabular-nums text-soft">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-gold-faint">
        <div className="h-1.5 bg-gold" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function QuickEstimator({ mode }: { mode: ModeSpec }) {
  const [kg, setKg] = useState(200);

  if (mode.id !== "lcl") {
    return (
      <div className="border-t-2 border-gold bg-[#faf7f2] p-5">
        <p className={EYEBROW}>Criterio de tarifa</p>
        <p className="mt-2 text-sm leading-relaxed text-cream/85">
          {mode.id === "fcl"
            ? "El costo depende del tamaño del contenedor, el origen y la ruta. Te lo cotizamos según tu caso."
            : "El costo depende del peso, las dimensiones y el origen. Te lo cotizamos según tu caso."}
        </p>
      </div>
    );
  }

  const handleKg = (val: number) => {
    if (Number.isNaN(val)) return;
    setKg(Math.min(1000, Math.max(10, val)));
  };

  return (
    <div className="border-t-2 border-gold bg-[#faf7f2] p-5">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor="lcl-kg-input" className={EYEBROW}>
          Estimación LCL
        </label>
        <div className="flex items-baseline gap-1 border-b border-gold pb-0.5">
          <input
            id="lcl-kg-input"
            type="number"
            min={10}
            max={1000}
            step={10}
            value={kg}
            onChange={(e) => handleKg(Number(e.target.value))}
            className="w-20 bg-transparent text-right font-serif text-xl tabular-nums text-cream focus:outline-none"
          />
          <span className="text-xs text-soft">kg</span>
        </div>
      </div>

      <input
        type="range"
        min={10}
        max={1000}
        step={10}
        value={kg}
        onChange={(e) => setKg(Number(e.target.value))}
        aria-label="Peso estimado en kilos"
        className="mt-4 w-full accent-[#8c6428]"
      />

      <p className="mt-4 font-serif text-3xl tabular-nums text-cream">
        USD {(kg * SITE.pricePerKg).toLocaleString("es-AR")}
      </p>
      <p className="mt-1 text-xs text-soft">
        Referencia de {SITE.pricePerKg} USD por kilo, sin impuestos ni gastos de aduana.
      </p>
    </div>
  );
}

function ModeFinder({ onSelectMode }: { onSelectMode: (id: ModeId) => void }) {
  const [volumeChoice, setVolumeChoice] = useState<string | null>(null);
  const [urgencyChoice, setUrgencyChoice] = useState<string | null>(null);

  const recommended: ModeId | null = !volumeChoice
    ? null
    : volumeChoice === "mucha"
    ? "fcl"
    : volumeChoice === "media"
    ? "lcl"
    : urgencyChoice
    ? urgencyChoice === "urgente"
      ? "courier"
      : "lcl"
    : null;

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
      <div className="lg:col-span-4">
        <p className={EYEBROW}>Orientación rápida</p>
        <h2 className={HEADING}>¿Qué modalidad encaja mejor?</h2>
        <p className="mt-3 text-sm leading-relaxed text-cream/80">
          Elegí el tamaño aproximado de tu carga para ver una sugerencia inicial.
        </p>
      </div>

      <div className="space-y-7 border-t border-gold-faint pt-6 lg:col-span-8 lg:border-t-0 lg:pt-0">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.16em] text-soft">1. Volumen estimado</p>
          <div className="flex flex-wrap gap-2">
            {[
              { v: "poca", l: "Menos de 100 kg" },
              { v: "media", l: "Entre 100 y 1.000 kg" },
              { v: "mucha", l: "Un contenedor o más" },
            ].map((opt) => {
              const active = volumeChoice === opt.v;
              return (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => {
                    setVolumeChoice(opt.v);
                    setUrgencyChoice(null);
                  }}
                  aria-pressed={active}
                  className={`border px-4 py-2 text-xs transition ${
                    active
                      ? "border-gold bg-gold text-white"
                      : "border-gold-faint bg-white text-cream hover:border-gold"
                  }`}
                >
                  {opt.l}
                </button>
              );
            })}
          </div>
        </div>

        {volumeChoice === "poca" && (
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-soft">2. Plazo requerido</p>
            <div className="flex flex-wrap gap-2">
              {[
                { v: "urgente", l: "Urgente (pocos días)" },
                { v: "normal", l: "Sin urgencia" },
              ].map((opt) => {
                const active = urgencyChoice === opt.v;
                return (
                  <button
                    key={opt.v}
                    type="button"
                    onClick={() => setUrgencyChoice(opt.v)}
                    aria-pressed={active}
                    className={`border px-4 py-2 text-xs transition ${
                      active
                        ? "border-cream bg-cream text-white"
                        : "border-gold-faint bg-white text-cream hover:border-gold"
                    }`}
                  >
                    {opt.l}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {recommended && (
          <div className="flex flex-col justify-between gap-4 border-t-2 border-gold bg-[#faf7f2] p-5 sm:flex-row sm:items-center">
            <div>
              <p className={EYEBROW}>Sugerencia inicial</p>
              <p className="mt-1 font-serif text-2xl text-cream">
                {MODES.find((m) => m.id === recommended)?.name}
              </p>
              <p className="mt-0.5 text-xs text-soft">
                {MODES.find((m) => m.id === recommended)?.tagline}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  onSelectMode(recommended);
                  document.getElementById("panel-modo")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="bg-cream px-4 py-2.5 text-xs font-medium uppercase tracking-[0.16em] text-white transition hover:bg-gold"
              >
                Ver detalle
              </button>
              <button
                type="button"
                onClick={() => {
                  setVolumeChoice(null);
                  setUrgencyChoice(null);
                }}
                className="text-xs uppercase tracking-[0.16em] text-soft underline-offset-4 hover:text-cream hover:underline"
              >
                Reiniciar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ServiciosShowcase() {
  const [activeMode, setActiveMode] = useState<ModeId>("lcl");
  const currentMode = MODES.find((m) => m.id === activeMode) ?? MODES[1];
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [openOrigin, setOpenOrigin] = useState<string | null>(null);

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
  }, [activeMode]);

  useEffect(() => {
    const sequence: ModeId[] = ["fcl", "lcl", "courier"];
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      const idx = sequence.indexOf(activeMode);
      if (event.key === "ArrowRight") setActiveMode(sequence[(idx + 1) % sequence.length]);
      if (event.key === "ArrowLeft") setActiveMode(sequence[(idx - 1 + sequence.length) % sequence.length]);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeMode]);

  return (
    <div className="mt-14 space-y-20 sm:mt-16 sm:space-y-24">
      <section data-reveal className="reveal">
        <ModeFinder onSelectMode={(id) => setActiveMode(id)} />
      </section>

      <section id="panel-modo" data-reveal className="reveal border-t border-gold-faint pt-14">
        <div role="tablist" aria-label="Modalidades" className="grid grid-cols-3 border border-gold-faint bg-white">
          {MODES.map((item, idx) => {
            const selected = item.id === activeMode;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveMode(item.id)}
                className={`px-4 py-4 text-left transition sm:px-6 ${
                  idx > 0 ? "border-l border-gold-faint" : ""
                } ${selected ? "bg-gold text-white" : "text-cream hover:bg-gold/5"}`}
              >
                <span className="block font-serif text-lg sm:text-2xl">{item.code}</span>
                <span className={`mt-0.5 block text-xs ${selected ? "text-white/85" : "text-soft"}`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        <div role="tabpanel" className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          <div className="space-y-6 lg:col-span-5">
            {currentMode.id === "lcl" && (
              <div className="overflow-hidden border border-gold-faint">
                <img
                  src="/img/carga-especial-puerto.jpg"
                  alt="Carga lista para embarcar en el puerto"
                  className="aspect-[16/9] w-full object-cover"
                />
              </div>
            )}

            <ModeSchema id={currentMode.id} />

            <div className="space-y-4 border-t border-gold-faint pt-5">
              <MetricRow label="Volumen ideal" value={currentMode.metrics.volumen} />
              <MetricRow label="Economía por kilo" value={currentMode.metrics.economia} />
              <MetricRow label="Velocidad" value={currentMode.metrics.velocidad} />
            </div>
          </div>

          <div className="space-y-8 lg:col-span-7">
            <div>
              <p className={EYEBROW}>{currentMode.code}</p>
              <h2 className="mt-1 font-serif text-3xl text-cream sm:text-4xl">{currentMode.name}</h2>
              <p className="mt-1 text-sm text-gold">{currentMode.tagline}</p>
              <p className="mt-4 text-sm leading-relaxed text-cream/85 sm:text-base">{currentMode.text}</p>
            </div>

            <QuickEstimator mode={currentMode} />

            <div className="grid divide-y divide-gold-faint border-y border-gold-faint sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <div className="py-5 sm:pr-6">
                <p className={EYEBROW}>Qué incluye</p>
                <ul className="mt-4 space-y-2.5 text-sm text-cream">
                  {currentMode.incluye.map((line) => (
                    <li key={line} className="flex items-start gap-2.5">
                      <span className="mt-2 h-1 w-1 shrink-0 bg-gold" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="py-5 sm:px-6">
                <p className={EYEBROW}>Conviene si</p>
                <ul className="mt-4 space-y-2.5 text-sm text-cream">
                  {currentMode.ideal.map((line) => (
                    <li key={line} className="flex items-start gap-2.5">
                      <span className="mt-2 h-1 w-1 shrink-0 bg-gold" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="py-5 sm:pl-6">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-soft">Mejor evitarla si</p>
                <ul className="mt-4 space-y-2.5 text-sm text-cream/75">
                  {currentMode.noIdeal.map((line) => (
                    <li key={line} className="flex items-start gap-2.5">
                      <span className="mt-2 h-1 w-1 shrink-0 bg-soft" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <p className={EYEBROW}>Etapas de la operación</p>
                <ol className="mt-4 divide-y divide-gold-faint border-y border-gold-faint text-sm text-cream">
                  {currentMode.steps.map((stepText, idx) => (
                    <li key={stepText} className="flex gap-3 py-2.5">
                      <span className="font-serif text-xs text-gold">0{idx + 1}</span>
                      <span>{stepText}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <p className={EYEBROW}>Documentación habitual</p>
                <ul className="mt-4 divide-y divide-gold-faint border-y border-gold-faint text-sm text-cream">
                  {currentMode.docs.map((doc) => (
                    <li key={doc} className="py-2.5">
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section data-reveal className="reveal border-t border-gold-faint pt-14">
        <p className={EYEBROW}>Comparativa</p>
        <h2 className={HEADING}>Las tres modalidades, lado a lado</h2>

        <div className="mt-6 overflow-x-auto border-y border-gold-faint">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gold text-xs uppercase tracking-[0.16em] text-gold">
                <th className="py-3.5 pr-4 font-medium text-soft">Concepto</th>
                <th className="py-3.5 pr-4 font-serif text-base font-normal normal-case tracking-normal text-cream">
                  FCL
                </th>
                <th className="py-3.5 pr-4 font-serif text-base font-normal normal-case tracking-normal text-cream">
                  LCL
                </th>
                <th className="py-3.5 font-serif text-base font-normal normal-case tracking-normal text-cream">
                  Courier
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-faint text-cream">
              {COMPARISON_ROWS.map(([concept, fclVal, lclVal, courierVal]) => (
                <tr key={concept}>
                  <td className="py-3.5 pr-4 text-soft">{concept}</td>
                  <td className="py-3.5 pr-4">{fclVal}</td>
                  <td className="py-3.5 pr-4">{lclVal}</td>
                  <td className="py-3.5">{courierVal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section data-reveal className="reveal grid gap-12 border-t border-gold-faint pt-14 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className={EYEBROW}>Orígenes</p>
          <h2 className={HEADING}>Desde dónde importamos</h2>

          <div className="mt-6 divide-y divide-gold-faint border-y border-gold-faint">
            {ORIGINS.map((place) => {
              const isOpen = openOrigin === place;
              const info = ORIGIN_INFO[place];
              return (
                <div key={place} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenOrigin(isOpen ? null : place)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >
                    <span className="font-serif text-lg text-cream">{place}</span>
                    <span className="text-xs uppercase tracking-widest text-gold">
                      {isOpen ? "Cerrar" : "Ver"}
                    </span>
                  </button>
                  {isOpen && info && (
                    <div className="mt-3 space-y-1 text-sm text-cream/85">
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-gold">{info.modes}</p>
                      <p className="leading-relaxed">{info.note}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <p className={EYEBROW}>Preguntas frecuentes</p>
          <h2 className={HEADING}>Lo que más nos preguntan</h2>

          <div className="mt-6 divide-y divide-gold-faint border-y border-gold-faint">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.q} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >
                    <span className="text-sm font-medium text-cream sm:text-base">{faq.q}</span>
                    <span className="shrink-0 text-xs uppercase tracking-widest text-gold">
                      {isOpen ? "Cerrar" : "Ver"}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-sm leading-relaxed text-cream/85">{faq.a}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section data-reveal className="reveal flex flex-col justify-between gap-6 border-t border-gold-faint pt-10 sm:flex-row sm:items-center">
        <div>
          <p className="font-serif text-xl text-cream">¿Tenés una importación en mente?</p>
          <p className="mt-1 text-sm text-soft">Contanos qué querés traer y te pasamos una cotización sin compromiso.</p>
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
          <Link href="/simulacion" className="text-cream underline decoration-cream/30 underline-offset-4 hover:text-gold">
            Ver simulación de costos
          </Link>
        </div>
      </section>

      <style>{`
        .reveal { opacity: 0; transform: translateY(18px); transition: opacity .75s ease, transform .75s ease; }
        .reveal.is-in { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1; transform: none; transition: none; }
        }
      `}</style>
    </div>
  );
}