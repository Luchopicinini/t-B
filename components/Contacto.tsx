"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, MouseEvent } from "react";
import { ORIGINS, SITE, waLink } from "@/lib/site";

// PLACEHOLDER: completar con los horarios reales (formato "HH:MM – HH:MM")
const HOURS = [
  { day: "Lunes a viernes", time: "00:00 – 00:00", days: [1, 2, 3, 4, 5] },
  { day: "Sábados", time: "00:00 – 00:00", days: [6] },
  { day: "Domingos", time: "Cerrado", days: [0] },
];

const MODES = [
  { id: "lcl", label: "Carga consolidada (LCL)" },
  { id: "fcl", label: "Contenedor completo (FCL)" },
  { id: "courier", label: "Courier aéreo" },
  { id: "no-se", label: "Todavía no lo sé" },
];

type Form = {
  nombre: string;
  empresa: string;
  contacto: string;
  modo: string;
  origen: string;
  mensaje: string;
};

const EMPTY: Form = { nombre: "", empresa: "", contacto: "", modo: "no-se", origen: "China", mensaje: "" };
const MAX_MSG = 500;
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.address)}`;

// Clases compartidas: padding menor en celular
const CARD = "border border-gold-dim bg-ink-2 p-5 sm:p-8 shadow-[0_18px_50px_-28px_rgba(0,0,0,.9)]";
const LABEL = "text-[11px] font-medium uppercase tracking-[0.25em] text-gold";
const FIELD =
  "w-full border border-gold-dim bg-ink px-4 py-3 text-sm text-cream placeholder:text-cream/45 outline-none transition duration-300 focus:border-gold focus:shadow-[0_0_0_3px_rgba(242,207,126,.15)]";
const chip = (on: boolean) =>
  `border px-3 py-2 text-xs tracking-wide transition duration-300 sm:px-4 ${
    on ? "border-gold bg-gold text-ink" : "border-gold-dim bg-ink text-cream hover:border-gold"
  }`;

// ---------- Horario de Córdoba ----------
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function cordobaNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Argentina/Cordoba",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { day: WD.indexOf(get("weekday")), minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

function parseRange(time: string): [number, number] | null {
  const m = time.match(/(\d{1,2}):(\d{2})\s*–\s*(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const start = Number(m[1]) * 60 + Number(m[2]);
  const end = Number(m[3]) * 60 + Number(m[4]);
  if (start === end) return null; // horario todavía sin completar
  return [start, end];
}

function openStatus(): "abierto" | "cerrado" | null {
  const { day, minutes } = cordobaNow();
  const h = HOURS.find((x) => x.days.includes(day));
  if (!h) return null;
  if (h.time === "Cerrado") return "cerrado";
  const r = parseRange(h.time);
  if (!r) return null;
  return minutes >= r[0] && minutes < r[1] ? "abierto" : "cerrado";
}

// ---------- Tarjeta con inclinación 3D (solo con mouse, no en celular) ----------
function Tilt({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-4px)`;
    el.style.setProperty("--mx", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${((y + 0.5) * 100).toFixed(1)}%`);
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="tilt relative h-full transition-transform duration-300 ease-out">
      {children}
    </div>
  );
}

// ---------- Botón copiar ----------
function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        } catch {
          setDone(false);
        }
      }}
      className="text-[11px] uppercase tracking-[0.2em] text-gold underline-offset-4 transition hover:underline"
    >
      {done ? "Copiado ✓" : label}
    </button>
  );
}

// ---------- Mapa de rutas animado ----------
function RouteHero() {
  const points = [
    { x: 140, y: 90, l: "CHINA" },
    { x: 660, y: 110, l: "BRASIL" },
    { x: 520, y: 250, l: "CÓRDOBA" },
  ];
  return (
    <div className={`${CARD} relative overflow-hidden p-0`}>
      <svg viewBox="0 0 800 380" className="block h-auto w-full" aria-hidden="true">
        <defs>
          <radialGradient id="ct-glow" cx="50%" cy="60%" r="60%">
            <stop offset="0" stopColor="#f2cf7e" stopOpacity=".22" />
            <stop offset="1" stopColor="#0a0907" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="800" height="380" fill="url(#ct-glow)" />
        <g stroke="#f2cf7e" strokeOpacity=".07">
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="380" />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 95} x2="800" y2={i * 95} />
          ))}
        </g>

        <path id="ct-r1" d="M140 90 Q330 -10 520 250" fill="none" stroke="#f2cf7e" strokeOpacity=".4" strokeWidth="1.5" strokeDasharray="6 8" className="ct-dash" />
        <path id="ct-r2" d="M660 110 Q610 230 520 250" fill="none" stroke="#f2cf7e" strokeOpacity=".4" strokeWidth="1.5" strokeDasharray="6 8" className="ct-dash" />

        <g>
          <path d="M-9 0 L3 -5 L10 0 L3 5 Z M-3 0 L-9 -7 L-6 0 L-9 7 Z" fill="#fffaf0" />
          <animateMotion dur="6s" repeatCount="indefinite" rotate="auto">
            <mpath href="#ct-r1" />
          </animateMotion>
        </g>
        <g>
          <path d="M-9 0 L3 -5 L10 0 L3 5 Z M-3 0 L-9 -7 L-6 0 L-9 7 Z" fill="#f2cf7e" />
          <animateMotion dur="5s" begin="-2s" repeatCount="indefinite" rotate="auto">
            <mpath href="#ct-r2" />
          </animateMotion>
        </g>

        {points.map((p) => (
          <g key={p.l}>
            <circle cx={p.x} cy={p.y} r="5" fill="#f2cf7e" />
            <circle cx={p.x} cy={p.y} r="5" fill="none" stroke="#f2cf7e" className="ct-pulse" />
            <text x={p.x} y={p.y - 18} textAnchor="middle" fill="#fffaf0" fontFamily="Poppins, sans-serif" fontSize="11" letterSpacing="3">
              {p.l}
            </text>
          </g>
        ))}
      </svg>
      <p className="absolute bottom-3 left-4 text-[10px] uppercase tracking-[0.2em] text-gold sm:bottom-4 sm:left-5 sm:text-[11px] sm:tracking-[0.25em]">
        Rutas de importación
      </p>
    </div>
  );
}

export default function Contacto() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [touched, setTouched] = useState(false);
  const [info, setInfo] = useState<{ status: "abierto" | "cerrado" | null; today: number }>({ status: null, today: -1 });

  // Estado de atención y día actual, según Córdoba
  useEffect(() => {
    const tick = () => setInfo({ status: openStatus(), today: cordobaNow().day });
    tick();
    const t = setInterval(tick, 60000);
    return () => clearInterval(t);
  }, []);

  // Revelado al hacer scroll
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

  const set =
    (k: keyof Form) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const nombreOk = form.nombre.trim().length > 1;
  const contactoOk = form.contacto.trim().length > 4;
  const valid = nombreOk && contactoOk;
  const modeLabel = MODES.find((m) => m.id === form.modo)?.label ?? "";

  const message = [
    "Hola! Quiero hacer una consulta desde la web.",
    "",
    `Nombre: ${form.nombre || "—"}`,
    form.empresa && `Empresa: ${form.empresa}`,
    `Contacto: ${form.contacto || "—"}`,
    `Modalidad: ${modeLabel}`,
    `Origen: ${form.origen}`,
    form.mensaje && `Mensaje: ${form.mensaje}`,
  ]
    .filter(Boolean)
    .join("\n");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    window.open(waLink(message), "_blank", "noopener");
  };

  return (
    <>
      {/* Canales */}
      <section data-reveal className="reveal mt-16 grid gap-4 sm:mt-20 sm:gap-6 md:grid-cols-3">
        <Tilt>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener"
            className={`group ${CARD} flex h-full flex-col justify-between gap-6 transition duration-300 hover:border-gold sm:gap-10`}
          >
            <div>
              <p className={LABEL}>WhatsApp</p>
              <p className="mt-3 break-all font-serif text-xl text-cream transition group-hover:text-gold sm:mt-4 sm:text-2xl">
                {SITE.whatsappDisplay}
              </p>
            </div>
            <span className="text-xs font-medium text-gold">Abrir chat →</span>
          </a>
        </Tilt>

        <Tilt>
          <div className={`${CARD} flex h-full flex-col justify-between gap-6 transition duration-300 hover:border-gold sm:gap-10`}>
            <div>
              <p className={LABEL}>Correo</p>
              <a href={`mailto:${SITE.email}`} className="mt-3 block break-all font-serif text-base text-cream transition hover:text-gold sm:mt-4 sm:text-lg">
                {SITE.email}
              </a>
            </div>
            <CopyButton text={SITE.email} label="Copiar correo" />
          </div>
        </Tilt>

        <Tilt>
          <div className={`${CARD} flex h-full flex-col justify-between gap-6 transition duration-300 hover:border-gold sm:gap-10`}>
            <div>
              <p className={LABEL}>Oficina</p>
              <p className="mt-3 font-serif text-lg text-cream sm:mt-4 sm:text-xl">Hilarion Plaza 4157</p>
              <p className="mt-1 text-sm text-cream/80">Cerro de las Rosas, Córdoba · CP X5009</p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <CopyButton text={SITE.address} label="Copiar dirección" />
              <a href={MAPS_URL} target="_blank" rel="noopener" className="text-[11px] uppercase tracking-[0.2em] text-gold underline-offset-4 hover:underline">
                Cómo llegar
              </a>
            </div>
          </div>
        </Tilt>
      </section>

      {/* Mapa de rutas */}
      <section data-reveal className="reveal mt-20 sm:mt-24">
        <p className={LABEL}>Desde dónde llega tu carga</p>
        <h2 className="mt-3 font-serif text-2xl text-cream sm:text-4xl">Rutas que trabajamos cada semana</h2>
        <div className="mt-6 sm:mt-8">
          <RouteHero />
        </div>
      </section>

      {/* Formulario + vista previa + horarios */}
      <section data-reveal className="reveal mt-20 grid gap-6 sm:mt-24 md:grid-cols-12">
        <form onSubmit={submit} noValidate className={`${CARD} space-y-7 md:col-span-7 sm:space-y-8`}>
          <div>
            <p className={LABEL}>Escribinos</p>
            <h2 className="mt-3 font-serif text-2xl text-cream sm:text-4xl">Contanos qué querés importar</h2>
            <p className="mt-3 text-sm text-cream/85">Mientras escribís, a la derecha ves el mensaje que se va a enviar.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
            <div>
              <label htmlFor="nombre" className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-cream/80">Nombre *</label>
              <input id="nombre" value={form.nombre} onChange={set("nombre")} className={FIELD} placeholder="Tu nombre" autoComplete="name" />
              {touched && !nombreOk && <p className="mt-2 text-xs text-gold">Necesitamos tu nombre.</p>}
            </div>
            <div>
              <label htmlFor="empresa" className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-cream/80">Empresa</label>
              <input id="empresa" value={form.empresa} onChange={set("empresa")} className={FIELD} placeholder="Opcional" autoComplete="organization" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="contacto" className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-cream/80">WhatsApp o correo *</label>
              <input id="contacto" value={form.contacto} onChange={set("contacto")} className={FIELD} placeholder="Para responderte" autoComplete="email" />
              {touched && !contactoOk && <p className="mt-2 text-xs text-gold">Dejanos un medio para responderte.</p>}
            </div>
          </div>

          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-cream/80">Modalidad</p>
            <div className="flex flex-wrap gap-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={form.modo === m.id}
                  onClick={() => setForm((f) => ({ ...f, modo: m.id }))}
                  className={chip(form.modo === m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-cream/80">Origen</p>
            <div className="flex flex-wrap gap-2">
              {ORIGINS.map((o) => (
                <button
                  key={o}
                  type="button"
                  aria-pressed={form.origen === o}
                  onClick={() => setForm((f) => ({ ...f, origen: o }))}
                  className={chip(form.origen === o)}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <label htmlFor="mensaje" className="text-[11px] uppercase tracking-[0.2em] text-cream/80">Mensaje</label>
              <span className="text-[11px] tabular-nums text-soft">{form.mensaje.length} / {MAX_MSG}</span>
            </div>
            <textarea
              id="mensaje"
              value={form.mensaje}
              onChange={set("mensaje")}
              rows={4}
              maxLength={MAX_MSG}
              className={`${FIELD} resize-none`}
              placeholder="Producto, cantidad aproximada, peso, fecha en la que lo necesitás…"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
            <button
              type="submit"
              className="w-full border border-gold bg-gold px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition duration-300 hover:-translate-y-0.5 hover:bg-transparent hover:text-gold sm:w-auto"
            >
              Enviar por WhatsApp
            </button>
            <p className="text-xs text-cream/70">Campos con * son obligatorios.</p>
          </div>
        </form>

        <aside className="space-y-6 md:col-span-5 md:sticky md:top-28 md:self-start">
          {/* Vista previa */}
          <div className={CARD}>
            <p className={LABEL}>Vista previa del mensaje</p>
            <div className="mt-4 border border-gold-faint bg-ink p-4 sm:mt-5 sm:p-5">
              <p className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-cream/90 sm:text-[12px]">{message}</p>
            </div>
          </div>

          {/* Horarios */}
          <div className={CARD}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className={LABEL}>Horarios</p>
              {info.status && (
                <span
                  className={`inline-flex items-center gap-2 border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${
                    info.status === "abierto" ? "border-gold bg-gold/15 text-gold" : "border-gold-dim text-cream/80"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${info.status === "abierto" ? "animate-pulse bg-gold" : "bg-soft"}`} />
                  {info.status === "abierto" ? "Abierto ahora" : "Cerrado ahora"}
                </span>
              )}
            </div>
            <ul className="mt-5 space-y-2 sm:mt-6">
              {HOURS.map((h) => {
                const today = h.days.includes(info.today);
                return (
                  <li
                    key={h.day}
                    className={`flex items-center justify-between gap-3 border px-3 py-2.5 text-sm transition duration-300 sm:px-4 sm:py-3 ${
                      today ? "border-gold bg-gold/10 text-cream" : "border-gold-faint text-cream/80"
                    }`}
                  >
                    <span>{h.day}</span>
                    <span className={`text-right ${today ? "text-gold" : "text-cream/70"}`}>{h.time}</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-cream/75 sm:mt-6">
              Las consultas fuera de horario se responden el próximo día hábil.
            </p>
          </div>
        </aside>
      </section>

      {/* Mapa */}
      <section data-reveal className="reveal mt-20 sm:mt-24">
        <div className={`${CARD} overflow-hidden p-0`}>
          <div className="relative h-[320px] sm:h-[420px] lg:h-[460px]">
            <iframe
              title="Ubicación de T&B Global Logística"
              src={`https://www.google.com/maps?q=${encodeURIComponent(SITE.address)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="map-dark absolute inset-0 h-full w-full"
            />
            <div className="absolute inset-x-3 bottom-3 border border-gold bg-ink/90 p-4 backdrop-blur sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-xs sm:p-5">
              <p className={LABEL}>Dónde estamos</p>
              <p className="mt-2 font-serif text-lg text-cream sm:text-xl">Hilarion Plaza 4157</p>
              <p className="text-sm text-cream/80">Cerro de las Rosas, Córdoba Capital</p>
              <a href={MAPS_URL} target="_blank" rel="noopener" className="mt-3 inline-block text-xs font-medium uppercase tracking-[0.2em] text-gold underline-offset-4 hover:underline sm:mt-4">
                Cómo llegar →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Cierre */}
      <section data-reveal className="reveal mt-20 sm:mt-24">
        <div className={`${CARD} flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8`}>
          <div>
            <p className="font-serif text-xl text-cream sm:text-3xl">¿Querés el número exacto?</p>
            <p className="mt-2 text-sm text-cream/85">Mandanos tu carga y te respondemos con una cotización formal.</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <a href={waLink()} target="_blank" rel="noopener" className="font-medium text-gold underline-offset-4 hover:underline">
              Cotizar por WhatsApp
            </a>
            <Link href="/servicios" className="text-cream underline-offset-4 hover:text-gold hover:underline">
              Ver modalidades
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity .9s ease, transform .9s cubic-bezier(.2,.8,.2,1); }
        .reveal.is-in { opacity: 1; transform: none; }

        /* Luz que sigue al mouse: solo en dispositivos con puntero fino */
        .tilt::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(242,207,126,.16), transparent 60%);
          opacity: 0;
          transition: opacity .4s ease;
        }
        @media (hover: hover) and (pointer: fine) {
          .tilt:hover::before { opacity: 1; }
        }
        @media (hover: none) {
          .tilt { transform: none !important; }
        }

        .ct-dash { animation: ct-dash 1.2s linear infinite; }
        @keyframes ct-dash { to { stroke-dashoffset: -28; } }

        .ct-pulse { transform-box: fill-box; transform-origin: center; animation: ct-pulse 2.4s ease-out infinite; }
        @keyframes ct-pulse { 0% { transform: scale(1); opacity: .9; } 100% { transform: scale(4); opacity: 0; } }

        .map-dark { filter: invert(.92) hue-rotate(180deg) grayscale(.6) brightness(.8) sepia(.35); }

        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1; transform: none; transition: none; }
          .ct-dash, .ct-pulse { animation: none; }
          .tilt { transform: none !important; }
        }
      `}</style>
    </>
  );
}