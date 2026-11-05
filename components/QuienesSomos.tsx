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

// PLACEHOLDER: completar con el equipo real (nombre, cargo, foto)
const TEAM = [
  { name: "Nombre Apellido", role: "Fundador / Dirección", bio: "Breve descripción de la experiencia y el rol." },
  { name: "Nombre Apellido", role: "Operaciones y logística", bio: "Breve descripción de la experiencia y el rol." },
  { name: "Nombre Apellido", role: "Comercial y atención", bio: "Breve descripción de la experiencia y el rol." },
];

const VALUES = [
  {
    title: "Claridad en cada cotización",
    text: "Te mostramos flete, despacho y gastos por separado. Si algo cambia, lo sabés antes de seguir.",
  },
  {
    title: "Un solo interlocutor",
    text: "Coordinamos con tu proveedor, la naviera, el despachante y el transporte. Vos hablás con nosotros.",
  },
  {
    title: "Cuidado de la mercadería",
    text: "Controlamos la consolidación y el embalaje para que tu carga llegue en las mismas condiciones en que salió.",
  },
  {
    title: "Pensado para comercios reales",
    text: "No hace falta importar un contenedor entero. Adaptamos la modalidad a lo que tu negocio necesita.",
  },
];

const HOW = [
  { n: "I", title: "Escuchamos", text: "Entendemos qué traés, cuánto, cada cuánto y con qué urgencia." },
  { n: "II", title: "Planificamos", text: "Elegimos la modalidad y la ruta que mejor encajan con tu caso." },
  { n: "III", title: "Ejecutamos", text: "Coordinamos el origen, el viaje, la aduana y la entrega." },
  { n: "IV", title: "Acompañamos", text: "Te informamos cada etapa hasta que la mercadería está en tu puerta." },
];

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

  return (
    <>
      {/* Historia */}
      <section data-reveal className="reveal mt-20 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Nuestra historia</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-cream sm:text-4xl">
            Una empresa argentina de logística e importación
          </h2>
        </div>
        <div className="space-y-5 text-base leading-relaxed text-cream/80 md:col-span-7">
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
      <section data-reveal className="reveal mt-24 grid grid-cols-2 gap-px bg-gold-faint md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-ink px-6 py-10">
            <p className="font-serif text-4xl text-gold sm:text-5xl">
              <Counter value={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-soft">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Valores */}
      <section className="mt-32">
        <div data-reveal className="reveal mb-14 max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Lo que nos guía</p>
          <h2 className="mt-3 font-serif text-3xl text-cream sm:text-4xl">Cuatro principios que no negociamos</h2>
        </div>
        <div className="grid gap-px bg-gold-faint sm:grid-cols-2">
          {VALUES.map((v, i) => (
            <article
              key={v.title}
              data-reveal
              className="reveal group relative bg-ink p-8 transition-colors duration-500 hover:bg-ink-2 sm:p-10"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="font-serif text-sm text-gold/60">0{i + 1}</span>
              <h3 className="mt-4 text-xl text-cream">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-soft">{v.text}</p>
              <span className="absolute bottom-0 left-0 h-px w-0 bg-gold transition-all duration-700 group-hover:w-full" />
            </article>
          ))}
        </div>
      </section>

      {/* Cómo trabajamos */}
      <section className="mt-32">
        <div data-reveal className="reveal mb-14 max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Cómo trabajamos</p>
          <h2 className="mt-3 font-serif text-3xl text-cream sm:text-4xl">Cuatro etapas, un mismo criterio</h2>
        </div>
        <ol className="relative grid gap-10 md:grid-cols-4 md:gap-6">
          <div className="absolute left-0 right-0 top-3 hidden h-px bg-gold-faint md:block" />
          {HOW.map((h, i) => (
            <li key={h.n} data-reveal className="reveal relative pt-10 md:pt-12" style={{ transitionDelay: `${i * 120}ms` }}>
              <span className="absolute left-0 top-0 grid h-6 w-6 place-items-center rounded-full border border-gold bg-ink text-[10px] text-gold">
                {i + 1}
              </span>
              <p className="font-serif text-sm text-gold/70">{h.n}</p>
              <h3 className="mt-2 text-lg text-cream">{h.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-soft">{h.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Cobertura interactiva */}
      <section data-reveal className="reveal mt-32 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Dónde trabajamos</p>
          <h2 className="mt-3 font-serif text-3xl text-cream">Orígenes y cobertura</h2>
          <p className="mt-4 text-sm text-soft">Elegí un origen para ver cómo lo trabajamos.</p>
        </div>
        <div className="md:col-span-8">
          <div className="flex flex-wrap gap-2">
            {ORIGINS.map((o) => (
              <button
                key={o}
                onClick={() => setActiveOrigin(o)}
                aria-pressed={activeOrigin === o}
                className={`border px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors duration-300 ${
                  activeOrigin === o ? "border-gold bg-gold text-ink" : "border-gold-dim text-cream/70 hover:border-gold hover:text-cream"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
          <div className="mt-8 border border-gold-faint p-6 sm:p-8">
            <p className="text-[11px] uppercase tracking-[0.25em] text-gold">Origen: {activeOrigin}</p>
            <p className="mt-3 text-base leading-relaxed text-cream/85">
              {activeOrigin === "China" && "Nuestro origen principal. Coordinamos la recepción de tu mercadería directamente con el proveedor, y trabajamos con carga consolidada, contenedor completo y courier aéreo."}
              {activeOrigin === "Brasil" && "Importamos desde Brasil con carga consolidada por kilo o contenedor completo, según el volumen de tu pedido."}
              {activeOrigin === "India" && "Cotizamos envíos desde India bajo pedido, por vía marítima o aérea, según el peso y el plazo que necesites."}
              {activeOrigin === "EE.UU." && "Cotizamos envíos desde Estados Unidos bajo pedido, según el peso, el volumen y la urgencia."}
              {activeOrigin === "Europa" && "Cotizamos envíos desde Europa bajo pedido, con la modalidad que mejor se adapte a tu carga."}
            </p>
            <p className="mt-6 text-sm text-soft">
              Entregamos en todo el país desde nuestra base en Córdoba Capital.
            </p>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section data-reveal className="reveal mt-32">
        <div className="mb-14 max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Equipo</p>
          <h2 className="mt-3 font-serif text-3xl text-cream sm:text-4xl">Las personas detrás de cada envío</h2>
        </div>
        <div className="grid gap-10 sm:grid-cols-3">
          {TEAM.map((t) => (
            <div key={t.name + t.role} className="group">
              <div className="relative mb-6 aspect-[4/5] overflow-hidden border border-gold-faint bg-ink-2">
                <div className="absolute inset-0 grid place-items-center">
                  <span className="font-serif text-5xl text-gold/30 transition group-hover:text-gold/60">
                    {t.name.split(" ").map((w) => w[0]).join("")}
                  </span>
                </div>
              </div>
              <h3 className="text-lg text-cream">{t.name}</h3>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-gold">{t.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-soft">{t.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cierre */}
      <section data-reveal className="reveal mt-32 border-t border-gold-faint pt-14">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="font-serif text-2xl text-cream sm:text-3xl">¿Querés conocernos en persona?</p>
            <p className="mt-2 text-sm text-soft">Pasá por nuestra oficina o escribinos y coordinamos.</p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <a href={waLink()} target="_blank" rel="noopener" className="text-gold underline-offset-4 hover:underline">
              Escribinos por WhatsApp
            </a>
            <Link href="/contacto" className="text-cream/80 underline-offset-4 hover:text-gold hover:underline">
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