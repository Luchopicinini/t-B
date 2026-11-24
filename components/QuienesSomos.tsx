"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ORIGINS, waLink } from "@/lib/site";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

const STATS = [
  { value: "5", label: "Orígenes de importación" },
  { value: "3", label: "Modalidades de envío" },
  { value: "100%", label: "Cobertura en Argentina" },
  { value: "2026", label: "Año de inicio de operaciones" },
];

const TEAM: TeamMember[] = [
  {
    name: "Patricio Cormick",
    role: "Gerente Comercial y de Logística",
    bio: "Conecta a los clientes con la operación. Coordina la carga consolidada desde China, la relación con despachantes y transportistas y el seguimiento de cada envío puerta a puerta, para que el cliente sepa en todo momento dónde está su mercadería.",
    image: "/media/1.png",
  },
  {
    name: "Silvina Gill",
    role: "Socia Fundadora y Gerente General",
    bio: "Lidera T&B Global Logística y define el rumbo de la empresa. Su objetivo es construir una compañía sólida y confiable que acompañe a los comercios argentinos en cada importación con transparencia y compromiso a largo plazo.",
    image: "/media/2.png",
  },
  {
    name: "Analia Villamea",
    role: "Directora de Logística Internacional Chile-Argentina",
    bio: "Aliada estratégica de T&B Global y responsable de unir dos mercados con una sola operación. Desde Chile dirige la logística entre ambos países y abre nuevas oportunidades comerciales a los dos lados de la cordillera. Planifica cada traslado y conoce de cerca a cada cliente.",
    image: "/media/3.png",
  },
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

const WORKFLOW_STAGES = [
  {
    step: "01",
    title: "Escuchamos",
    text: "Entendemos qué traés, cuánto, cada cuánto y con qué urgencia.",
  },
  {
    step: "02",
    title: "Planificamos",
    text: "Elegimos la modalidad y la ruta que mejor encajan con tu caso.",
  },
  {
    step: "03",
    title: "Ejecutamos",
    text: "Coordinamos el origen, el viaje, la aduana y la entrega.",
  },
  {
    step: "04",
    title: "Acompañamos",
    text: "Te informamos cada etapa hasta que la mercadería está en tu puerta.",
  },
];

const ORIGIN_NOTES: Record<string, string> = {
  China:
    "Nuestro origen principal. Coordinamos la recepción de tu mercadería directamente con el proveedor, y trabajamos con carga consolidada, contenedor completo y courier aéreo.",
  Brasil:
    "Importamos desde Brasil con carga consolidada por kilo o contenedor completo, según el volumen de tu pedido.",
  India:
    "Cotizamos envíos desde India bajo pedido, por vía marítima o aérea, según el peso y el plazo que necesites.",
  "EE.UU.":
    "Cotizamos envíos desde Estados Unidos bajo pedido, según el peso, el volumen y la urgencia.",
  Europa:
    "Cotizamos envíos desde Europa bajo pedido, con la modalidad que mejor se adapte a tu carga.",
};

const EYEBROW = "text-[11px] font-medium uppercase tracking-[0.22em] text-gold";

export default function QuienesSomos() {
  const [selectedOrigin, setSelectedOrigin] = useState<string>(ORIGINS[0]);

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

  const originDescription =
    ORIGIN_NOTES[selectedOrigin] ??
    "Cotizamos según peso, volumen, origen y urgencia de la operación.";

  return (
    <div className="mt-14 space-y-20 sm:mt-16 sm:space-y-24">
      <section data-reveal className="reveal grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <p className={EYEBROW}>Nuestra historia</p>
          <h2 className="mt-2 font-serif text-2xl leading-snug text-cream sm:text-4xl">
            Una empresa argentina de logística e importación
          </h2>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-cream/85 sm:text-base lg:col-span-7">
          <p>
            Nacimos para resolver algo que muchos comercios viven a diario: querer importar sin tener el volumen para
            un contenedor entero, y sin saber cómo manejar fletes, aduana y documentación.
          </p>
          <p>
            Por eso armamos una operación que se ocupa de todo el recorrido. Desde el proveedor en China o Brasil hasta
            la puerta de tu negocio, con despachante propio y con una forma de cotizar que se entiende.
          </p>
          <p>
            Hoy trabajamos con carga consolidada, contenedor completo y courier aéreo, y llegamos a todo el país desde
            Córdoba.
          </p>
        </div>
      </section>

      <section data-reveal className="reveal border-t border-gold-faint pt-14">
        <div className="max-w-xl">
          <p className={EYEBROW}>Equipo</p>
          <h2 className="mt-2 font-serif text-2xl text-cream sm:text-3xl">Las personas detrás de cada envío</h2>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
          {TEAM.map((member) => (
            <article key={`${member.name}-${member.role}`} className="flex flex-col">
              <div className="aspect-[4/5] overflow-hidden border border-gold-faint bg-[#faf7f2]">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-4 font-serif text-xl text-cream">{member.name}</h3>
              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-gold">{member.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-cream/80">{member.bio}</p>
            </article>
          ))}
        </div>
      </section>

      <section data-reveal className="reveal border-y border-gold-faint py-8">
        <dl className="grid grid-cols-2 gap-8 md:grid-cols-4 md:divide-x md:divide-gold-faint">
          {STATS.map((stat, idx) => (
            <div key={stat.label} className={idx > 0 ? "md:pl-8" : ""}>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-soft">{stat.label}</dt>
              <dd className="mt-2 font-serif text-3xl tabular-nums text-cream sm:text-4xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section data-reveal className="reveal">
        <div className="max-w-xl">
          <p className={EYEBROW}>Lo que nos guía</p>
          <h2 className="mt-2 font-serif text-2xl text-cream sm:text-3xl">Cuatro principios que no negociamos</h2>
        </div>

        <div className="mt-8 grid divide-y divide-gold-faint border-y border-gold-faint sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {VALUES.map((item, idx) => (
            <div
              key={item.title}
              className={`py-6 ${idx % 2 === 1 ? "sm:pl-8" : "sm:pr-8"} ${idx >= 2 ? "sm:border-t sm:border-gold-faint" : ""}`}
            >
              <span className="font-serif text-xs text-gold">0{idx + 1}</span>
              <h3 className="mt-2 font-serif text-xl text-cream">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/80">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section data-reveal className="reveal border-t border-gold-faint pt-14">
        <div className="max-w-xl">
          <p className={EYEBROW}>Cómo trabajamos</p>
          <h2 className="mt-2 font-serif text-2xl text-cream sm:text-3xl">Cuatro etapas, un mismo criterio</h2>
        </div>

        <ol className="mt-8 grid divide-y divide-gold-faint border-y border-gold-faint sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
          {WORKFLOW_STAGES.map((stage, idx) => (
            <li key={stage.step} className={`py-6 ${idx > 0 ? "lg:px-6 lg:first:pl-0 lg:last:pr-0" : "lg:pr-6"}`}>
              <span className="font-serif text-xs text-gold">{stage.step}</span>
              <h3 className="mt-2 font-serif text-lg text-cream">{stage.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/80">{stage.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section data-reveal className="reveal grid gap-8 border-t border-gold-faint pt-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <p className={EYEBROW}>Dónde trabajamos</p>
          <h2 className="mt-2 font-serif text-2xl text-cream sm:text-3xl">Orígenes y cobertura</h2>
          <p className="mt-3 text-sm leading-relaxed text-cream/80">
            Elegí un origen para ver cómo operamos cada ruta.
          </p>
        </div>

        <div className="lg:col-span-8">
          <div className="flex flex-wrap gap-2">
            {ORIGINS.map((place) => {
              const active = selectedOrigin === place;
              return (
                <button
                  key={place}
                  type="button"
                  onClick={() => setSelectedOrigin(place)}
                  aria-pressed={active}
                  className={`border px-3.5 py-2 text-xs uppercase tracking-[0.16em] transition ${
                    active
                      ? "border-gold bg-gold text-white"
                      : "border-gold-faint bg-white text-cream hover:border-gold"
                  }`}
                >
                  {place}
                </button>
              );
            })}
          </div>

          <div className="mt-6 border-t-2 border-gold bg-[#faf7f2] p-6">
            <p className={EYEBROW}>Origen · {selectedOrigin}</p>
            <p className="mt-3 text-sm leading-relaxed text-cream sm:text-base">{originDescription}</p>
            <p className="mt-4 border-t border-gold-faint pt-4 text-xs text-soft">
              Entregamos en todo el país desde nuestra base en Córdoba Capital.
            </p>
          </div>
        </div>
      </section>

      <section data-reveal className="reveal flex flex-col justify-between gap-6 border-t border-gold-faint pt-10 sm:flex-row sm:items-center">
        <div>
          <p className="font-serif text-xl text-cream">¿Querés conocernos en persona?</p>
          <p className="mt-1 text-sm text-soft">Pasá por nuestra oficina o escribinos y coordinamos.</p>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <a
            href={waLink()}
            target="_blank"
            rel="noopener"
            className="font-medium text-gold underline decoration-gold/50 underline-offset-4 hover:decoration-gold"
          >
            Escribinos por WhatsApp
          </a>
          <Link href="/contacto" className="text-cream underline decoration-cream/30 underline-offset-4 hover:text-gold">
            Ver contacto
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