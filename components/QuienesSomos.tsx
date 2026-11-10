"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ORIGINS, waLink } from "@/lib/site";

// PLACEHOLDER: reemplazar por cifras reales de la empresa
const STATS = [
  { value: 5, suffix: "", label: "Orígenes de importación" },
  { value: 3, suffix: "", label: "Modalidades de envío" },
  { value: 100, suffix: "%", label: "Cobertura en Argentina" },
  { value: 2026, suffix: "", label: "Año de inicio de operaciones" },
];

// PLACEHOLDER: completar con el equipo real (nombre, cargo y una frase breve)
const TEAM = [
  {
    name: "Patricio Cormick",
    role: "Gerente Comercial y de Logística",
    bio: "Conecta a los clientes con la operación. Coordina la carga consolidada desde China, la relación con despachantes y transportistas y el seguimiento de cada envío puerta a puerta, para que el cliente sepa en todo momento dónde está su mercadería.",
    image: "/media/1.jpg",
  },
  {
    name: "Silvina Gil",
    role: "Socia Fundadora y Gerente General",
    bio: "Lidera T&B Global Logística y define el rumbo de la empresa. Su objetivo es construir una compañía sólida y confiable que acompañe a los comercios argentinos en cada importación con transparencia y compromiso a largo plazo.",
    image: "/media/2.jpeg",
  },
  {
    name: "Analia Villamea",
    role: "Directora de Logística Internacional Chile-Argentina",
    bio: "Aliada estratégica de T&B Global y responsable de unir dos mercados con una sola operación. Desde Chile dirige la logística entre ambos países y abre nuevas oportunidades comerciales a los dos lados de la cordillera. Planifica cada traslado y conoce de cerca a cada cliente.",
    image: "/media/3.jpg",
  },
];

const VALUES = [
  { title: "Claridad en cada cotización", text: "Te mostramos flete, despacho y gastos por separado. Si algo cambia, lo sabés antes de seguir." },
  { title: "Un solo interlocutor", text: "Coordinamos con tu proveedor, la naviera, el despachante y el transporte. Vos hablás con nosotros." },
  { title: "Cuidado de la mercadería", text: "Controlamos la consolidación y el embalaje para que tu carga llegue en las mismas condiciones en que salió." },
  { title: "Pensado para comercios reales", text: "No hace falta importar un contenedor entero. Adaptamos la modalidad a lo que tu negocio necesita." },
];

const HOW = [
  { n: "I", title: "Escuchamos", text: "Entendemos qué traés, cuánto, cada cuánto y con qué urgencia." },
  { n: "II", title: "Planificamos", text: "Elegimos la modalidad y la ruta que mejor encajan con tu caso." },
  { n: "III", title: "Ejecutamos", text: "Coordinamos el origen, el viaje, la aduana y la entrega." },
  { n: "IV", title: "Acompañamos", text: "Te informamos cada etapa hasta que la mercadería está en tu puerta." },
];

// Superficie blanca con sombra suave (igual que Servicios, Cómo funciona y Simulación)
const SURFACE = "bg-white rounded-sm shadow-[0_12px_30px_-18px_rgba(70,50,20,.3)] ring-1 ring-gold-faint";
const LABEL = "text-[11px] font-medium uppercase tracking-[0.25em] text-gold";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const duration = 1400;
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - t0) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(Math.round(eased * value));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toLocaleString("es-AR")}
      {suffix}
    </span>
  );
}

export default function QuienesSomos() {
  const [activeOrigin, setActiveOrigin] = useState<string>(ORIGINS[0]);

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
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Historia */}
      <section data-reveal className="reveal mt-16 grid gap-12 sm:mt-20 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className={LABEL}>Nuestra historia</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-cream sm:text-4xl">
            Una empresa argentina de logística e importación
          </h2>
        </div>
        <div className="space-y-5 text-base leading-relaxed text-cream/85 md:col-span-7">
          <p>
            Nacimos para resolver algo que muchos comercios viven a diario: querer importar sin tener el volumen
            para un contenedor entero, y sin saber cómo manejar fletes, aduana y documentación.
          </p>
          <p>
            Por eso armamos una operación que se ocupa de todo el recorrido. Desde el proveedor en China o Brasil
            hasta la puerta de tu negocio, con despachante propio y con una forma de cotizar que se entiende.
          </p>
          <p>
            Hoy trabajamos con carga consolidada, contenedor completo y courier aéreo, y llegamos a todo el país
            desde Córdoba.
          </p>
        </div>
      </section>

      {/* Cifras */}
      <section data-reveal className="reveal mt-20 grid grid-cols-2 gap-4 sm:mt-24 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className={`${SURFACE} p-6 sm:p-8`}>
            <p className="font-serif text-4xl text-gold sm:text-5xl">
              <Counter value={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-soft">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Valores */}
      <section className="mt-20 sm:mt-28">
        <div data-reveal className="reveal mb-12 max-w-2xl">
          <p className={LABEL}>Lo que nos guía</p>
          <h2 className="mt-3 font-serif text-3xl text-cream sm:text-4xl">Cuatro principios que no negociamos</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {VALUES.map((v, i) => (
            <article
              key={v.title}
              data-reveal
              className={`reveal ${SURFACE} relative p-8 sm:p-10`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="font-serif text-sm text-gold">0{i + 1}</span>
              <h3 className="mt-4 text-xl text-cream">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/80">{v.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Cómo trabajamos */}
      <section className="mt-20 sm:mt-28">
        <div data-reveal className="reveal mb-12 max-w-2xl">
          <p className={LABEL}>Cómo trabajamos</p>
          <h2 className="mt-3 font-serif text-3xl text-cream sm:text-4xl">Cuatro etapas, un mismo criterio</h2>
        </div>
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {HOW.map((h, i) => (
            <li
              key={h.n}
              data-reveal
              className={`reveal ${SURFACE} relative p-6 pt-9 sm:p-7 sm:pt-10`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span className="absolute -top-3 left-6 grid h-7 w-7 place-items-center bg-gold font-serif text-xs text-white">
                {i + 1}
              </span>
              <p className="font-serif text-sm text-gold">{h.n}</p>
              <h3 className="mt-2 text-lg text-cream">{h.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/80">{h.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Cobertura interactiva */}
      <section data-reveal className="reveal mt-20 grid gap-10 sm:mt-28 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className={LABEL}>Dónde trabajamos</p>
          <h2 className="mt-3 font-serif text-3xl text-cream">Orígenes y cobertura</h2>
          <p className="mt-4 text-sm text-cream/80">Elegí un origen para ver cómo lo trabajamos.</p>
        </div>
        <div className="md:col-span-8">
          <div className="flex flex-wrap gap-2">
            {ORIGINS.map((o) => (
              <button
                key={o}
                onClick={() => setActiveOrigin(o)}
                aria-pressed={activeOrigin === o}
                className={`border px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors duration-300 ${
                  activeOrigin === o
                    ? "border-gold bg-gold text-white"
                    : "border-gold-faint bg-white text-cream hover:border-gold"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
          <div className={`${SURFACE} mt-8 p-6 sm:p-8`}>
            <p className={LABEL}>Origen: {activeOrigin}</p>
            <p className="mt-3 text-base leading-relaxed text-cream">
              {activeOrigin === "China" && "Nuestro origen principal. Coordinamos la recepción de tu mercadería directamente con el proveedor, y trabajamos con carga consolidada, contenedor completo y courier aéreo."}
              {activeOrigin === "Brasil" && "Importamos desde Brasil con carga consolidada por kilo o contenedor completo, según el volumen de tu pedido."}
              {activeOrigin === "India" && "Cotizamos envíos desde India bajo pedido, por vía marítima o aérea, según el peso y el plazo que necesites."}
              {activeOrigin === "EE.UU." && "Cotizamos envíos desde Estados Unidos bajo pedido, según el peso, el volumen y la urgencia."}
              {activeOrigin === "Europa" && "Cotizamos envíos desde Europa bajo pedido, con la modalidad que mejor se adapte a tu carga."}
            </p>
            <p className="mt-6 text-sm text-cream/70">Entregamos en todo el país desde nuestra base en Córdoba Capital.</p>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section data-reveal className="reveal mt-20 sm:mt-28">
        <div className="mb-12 max-w-2xl">
          <p className={LABEL}>Equipo</p>
          <h2 className="mt-3 font-serif text-3xl text-cream sm:text-4xl">Las personas detrás de cada envío</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {TEAM.map((t) => (
            <div key={t.name + t.role} className={`${SURFACE} p-6`}>
            <div className="relative mb-6 aspect-[4/5] overflow-hidden border border-gold-faint bg-[#fbf8f1]">
              <img
                src={t.image}
                alt={t.name}
                className="h-full w-full object-cover"
              />
            </div>
              <h3 className="text-lg text-cream">{t.name}</h3>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-gold">{t.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-cream/80">{t.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cierre */}
      <section data-reveal className="reveal mt-20 sm:mt-28">
        <div className={`${SURFACE} flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center md:gap-8 sm:p-10`}>
          <div>
            <p className="font-serif text-2xl text-cream sm:text-3xl">¿Querés conocernos en persona?</p>
            <p className="mt-2 text-sm text-cream/80">Pasá por nuestra oficina o escribinos y coordinamos.</p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <a href={waLink()} target="_blank" rel="noopener" className="font-medium text-gold underline-offset-4 hover:underline">
              Escribinos por WhatsApp
            </a>
            <Link href="/contacto" className="text-cream underline-offset-4 hover:text-gold hover:underline">
              Ver contacto
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