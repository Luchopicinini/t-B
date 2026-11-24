"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ORIGINS, SITE, waLink } from "@/lib/site";

// Completar con los horarios reales (formato "HH:MM – HH:MM")
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

interface InquiryForm {
  nombre: string;
  empresa: string;
  contacto: string;
  modo: string;
  origen: string;
  mensaje: string;
}

const INITIAL_FORM: InquiryForm = {
  nombre: "",
  empresa: "",
  contacto: "",
  modo: "no-se",
  origen: "China",
  mensaje: "",
};

const MAX_MESSAGE_LENGTH = 500;
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.address)}`;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const EYEBROW = "text-[11px] font-medium uppercase tracking-[0.22em] text-gold";
const INPUT_CLASS =
  "w-full border border-gold-dim bg-white px-3.5 py-2.5 text-sm text-cream placeholder:text-soft outline-none transition focus:border-gold";

function getCordobaTime() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Argentina/Cordoba",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const read = (partType: string) => parts.find((p) => p.type === partType)?.value ?? "";
  return {
    day: WEEKDAYS.indexOf(read("weekday")),
    minutes: Number(read("hour")) * 60 + Number(read("minute")),
  };
}

function parseScheduleRange(range: string): [number, number] | null {
  const match = range.match(/(\d{1,2}):(\d{2})\s*–\s*(\d{1,2}):(\d{2})/);
  if (!match) return null;
  const start = Number(match[1]) * 60 + Number(match[2]);
  const end = Number(match[3]) * 60 + Number(match[4]);
  if (start === end) return null;
  return [start, end];
}

function getOpenStatus(): "abierto" | "cerrado" | null {
  const { day, minutes } = getCordobaTime();
  const entry = HOURS.find((item) => item.days.includes(day));
  if (!entry) return null;
  if (entry.time === "Cerrado") return "cerrado";
  const parsed = parseScheduleRange(entry.time);
  if (!parsed) return null;
  return minutes >= parsed[0] && minutes < parsed[1] ? "abierto" : "cerrado";
}

function CopyTextButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className="text-[11px] uppercase tracking-[0.18em] text-gold underline decoration-gold/40 underline-offset-4 transition hover:decoration-gold"
    >
      {copied ? "Copiado" : label}
    </button>
  );
}

function CorridorsDiagram() {
  const hubs = [
    { x: 140, y: 92, code: "CHINA" },
    { x: 660, y: 112, code: "BRASIL" },
    { x: 520, y: 252, code: "CÓRDOBA" },
  ];

  return (
    <div className="border border-gold-faint bg-[#faf7f2]">
      <svg viewBox="0 0 800 340" className="block h-auto w-full" aria-hidden="true">
        <g stroke="#8c6428" strokeOpacity=".09">
          {Array.from({ length: 8 }).map((_, idx) => (
            <line key={`col-${idx}`} x1={(idx + 1) * 100} y1="0" x2={(idx + 1) * 100} y2="340" />
          ))}
          {Array.from({ length: 4 }).map((_, idx) => (
            <line key={`row-${idx}`} x1="0" y1={(idx + 1) * 85} x2="800" y2={(idx + 1) * 85} />
          ))}
        </g>

        <path
          d="M140 92 Q330 -6 520 252"
          fill="none"
          stroke="#8c6428"
          strokeWidth="1.5"
          strokeDasharray="5 6"
        />
        <path
          d="M660 112 Q610 228 520 252"
          fill="none"
          stroke="#8c6428"
          strokeWidth="1.5"
          strokeDasharray="5 6"
        />

        {hubs.map((hub) => (
          <g key={hub.code}>
            <circle cx={hub.x} cy={hub.y} r="4.5" fill="#8c6428" />
            <text
              x={hub.x}
              y={hub.y - 14}
              textAnchor="middle"
              fill="#1c1812"
              fontSize="11"
              letterSpacing="2.5"
            >
              {hub.code}
            </text>
          </g>
        ))}
      </svg>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gold-faint px-4 py-3 text-xs text-soft">
        <span>Corredores habituales hacia Córdoba</span>
        <span>China · Brasil</span>
      </div>
    </div>
  );
}

export default function Contacto() {
  const [form, setForm] = useState<InquiryForm>(INITIAL_FORM);
  const [submittedAttempt, setSubmittedAttempt] = useState(false);
  const [scheduleState, setScheduleState] = useState<{
    status: "abierto" | "cerrado" | null;
    today: number;
  }>({ status: null, today: -1 });

  useEffect(() => {
    const syncSchedule = () => {
      setScheduleState({ status: getOpenStatus(), today: getCordobaTime().day });
    };
    syncSchedule();
    const intervalId = window.setInterval(syncSchedule, 60000);
    return () => window.clearInterval(intervalId);
  }, []);

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

  const updateField =
    (field: keyof InquiryForm) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const isNameValid = form.nombre.trim().length > 1;
  const isContactValid = form.contacto.trim().length > 4;
  const isFormValid = isNameValid && isContactValid;
  const selectedModeLabel = MODES.find((m) => m.id === form.modo)?.label ?? "";

  const previewText = [
    "Hola! Quiero hacer una consulta desde la web.",
    "",
    `Nombre: ${form.nombre || "—"}`,
    form.empresa && `Empresa: ${form.empresa}`,
    `Contacto: ${form.contacto || "—"}`,
    `Modalidad: ${selectedModeLabel}`,
    `Origen: ${form.origen}`,
    form.mensaje && `Mensaje: ${form.mensaje}`,
  ]
    .filter(Boolean)
    .join("\n");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmittedAttempt(true);
    if (!isFormValid) return;
    window.open(waLink(previewText), "_blank", "noopener");
  };

  return (
    <div className="mt-14 space-y-20 sm:mt-16 sm:space-y-24">
      <section data-reveal className="reveal border-y border-gold-faint">
        <div className="grid divide-y divide-gold-faint md:grid-cols-3 md:divide-x md:divide-y-0">
          <div className="flex flex-col justify-between gap-6 py-6 md:pr-8">
            <div>
              <p className={EYEBROW}>WhatsApp</p>
              <p className="mt-3 break-all font-serif text-xl text-cream">{SITE.whatsappDisplay}</p>
            </div>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener"
              className="text-xs font-medium uppercase tracking-[0.16em] text-gold hover:underline"
            >
              Abrir chat →
            </a>
          </div>

          <div className="flex flex-col justify-between gap-6 py-6 md:px-8">
            <div>
              <p className={EYEBROW}>Correo</p>
              <a
                href={`mailto:${SITE.email}`}
                className="mt-3 block break-all font-serif text-lg text-cream transition hover:text-gold"
              >
                {SITE.email}
              </a>
            </div>
            <div>
              <CopyTextButton text={SITE.email} label="Copiar correo" />
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 py-6 md:pl-8">
            <div>
              <p className={EYEBROW}>Oficina</p>
              <p className="mt-3 font-serif text-lg text-cream">Hilarion Plaza 4157</p>
              <p className="mt-1 text-xs text-soft">Cerro de las Rosas, Córdoba · CP X5009</p>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              <CopyTextButton text={SITE.address} label="Copiar dirección" />
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener"
                className="text-[11px] uppercase tracking-[0.18em] text-cream underline decoration-cream/30 underline-offset-4 hover:text-gold"
              >
                Cómo llegar
              </a>
            </div>
          </div>
        </div>
      </section>

      <section data-reveal className="reveal grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className="lg:col-span-5">
          <p className={EYEBROW}>Rutas de importación</p>
          <h2 className="mt-2 font-serif text-2xl text-cream sm:text-3xl">Operación semanal desde origen</h2>
          <p className="mt-4 text-sm leading-relaxed text-cream/85">
            Coordinamos embarques consolidados, contenedores y envíos aéreos con despacho y entrega en destino.
          </p>
        </div>

        <div className="space-y-4 lg:col-span-7">
          <div className="overflow-hidden border border-gold-faint">
            <div className="relative aspect-[16/7]">
              <img
                src="/img/barco-hapag-lloyd.jpeg"
                alt="Barco portacontenedores en tránsito"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="border-t border-gold-faint bg-white px-4 py-2.5 text-xs text-soft">
              Transporte marítimo y aéreo según volumen y urgencia
            </p>
          </div>
          <CorridorsDiagram />
        </div>
      </section>

      <section data-reveal className="reveal grid gap-10 border-t border-gold-faint pt-14 lg:grid-cols-12 lg:items-start lg:gap-12">
        <form onSubmit={handleSubmit} noValidate className="space-y-7 lg:col-span-7">
          <div className="border-b border-gold-faint pb-5">
            <p className={EYEBROW}>Consulta directa</p>
            <h2 className="mt-2 font-serif text-2xl text-cream sm:text-3xl">Contanos qué querés importar</h2>
            <p className="mt-2 text-sm text-soft">
              Completá los datos y armamos el mensaje listo para enviar por WhatsApp.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="nombre" className="mb-1.5 block text-xs text-cream/85">
                Nombre *
              </label>
              <input
                id="nombre"
                value={form.nombre}
                onChange={updateField("nombre")}
                className={INPUT_CLASS}
                placeholder="Tu nombre"
                autoComplete="name"
              />
              {submittedAttempt && !isNameValid && (
                <p className="mt-1.5 text-xs text-gold">Ingresá tu nombre para continuar.</p>
              )}
            </div>

            <div>
              <label htmlFor="empresa" className="mb-1.5 block text-xs text-cream/85">
                Empresa
              </label>
              <input
                id="empresa"
                value={form.empresa}
                onChange={updateField("empresa")}
                className={INPUT_CLASS}
                placeholder="Opcional"
                autoComplete="organization"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="contacto" className="mb-1.5 block text-xs text-cream/85">
                WhatsApp o correo *
              </label>
              <input
                id="contacto"
                value={form.contacto}
                onChange={updateField("contacto")}
                className={INPUT_CLASS}
                placeholder="Teléfono o mail de respuesta"
                autoComplete="email"
              />
              {submittedAttempt && !isContactValid && (
                <p className="mt-1.5 text-xs text-gold">Dejanos un medio de contacto.</p>
              )}
            </div>
          </div>

          <div>
            <p className="mb-2.5 text-xs text-cream/85">Modalidad</p>
            <div className="flex flex-wrap gap-2">
              {MODES.map((option) => {
                const selected = form.modo === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setForm((prev) => ({ ...prev, modo: option.id }))}
                    className={`border px-3.5 py-2 text-xs transition ${
                      selected
                        ? "border-gold bg-gold text-white"
                        : "border-gold-dim bg-white text-cream hover:border-gold"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2.5 text-xs text-cream/85">Origen</p>
            <div className="flex flex-wrap gap-2">
              {ORIGINS.map((place) => {
                const selected = form.origen === place;
                return (
                  <button
                    key={place}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setForm((prev) => ({ ...prev, origen: place }))}
                    className={`border px-3.5 py-2 text-xs transition ${
                      selected
                        ? "border-cream bg-cream text-white"
                        : "border-gold-dim bg-white text-cream hover:border-gold"
                    }`}
                  >
                    {place}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-baseline justify-between">
              <label htmlFor="mensaje" className="text-xs text-cream/85">
                Detalle de la carga
              </label>
              <span className="text-[11px] tabular-nums text-soft">
                {form.mensaje.length} / {MAX_MESSAGE_LENGTH}
              </span>
            </div>
            <textarea
              id="mensaje"
              value={form.mensaje}
              onChange={updateField("mensaje")}
              rows={4}
              maxLength={MAX_MESSAGE_LENGTH}
              className={`${INPUT_CLASS} resize-none`}
              placeholder="Producto, unidades o peso estimado, urgencia…"
            />
          </div>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              className="bg-cream px-6 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-white transition hover:bg-gold"
            >
              Enviar por WhatsApp
            </button>
            <span className="text-xs text-soft">* Campos obligatorios</span>
          </div>
        </form>

        <aside className="space-y-8 lg:col-span-5 lg:sticky lg:top-28">
          <div className="border-t-2 border-gold bg-[#faf7f2] p-6">
            <p className={EYEBROW}>Vista previa del mensaje</p>
            <pre className="mt-4 whitespace-pre-wrap break-words border border-gold-faint bg-white p-4 font-mono text-xs leading-relaxed text-cream">
              {previewText}
            </pre>
          </div>

          <div className="border-t border-gold-faint pt-6">
            <div className="flex items-center justify-between gap-3">
              <p className={EYEBROW}>Atención · Córdoba</p>
              {scheduleState.status && (
                <span className="text-[11px] uppercase tracking-[0.16em] text-gold">
                  {scheduleState.status === "abierto" ? "Abierto ahora" : "Cerrado ahora"}
                </span>
              )}
            </div>

            <dl className="mt-4 divide-y divide-gold-faint border-y border-gold-faint text-sm">
              {HOURS.map((slot) => {
                const isToday = slot.days.includes(scheduleState.today);
                return (
                  <div
                    key={slot.day}
                    className={`flex items-center justify-between gap-4 py-2.5 ${
                      isToday ? "font-medium text-cream" : "text-cream/80"
                    }`}
                  >
                    <dt>{slot.day}</dt>
                    <dd className={isToday ? "text-gold" : "text-soft"}>{slot.time}</dd>
                  </div>
                );
              })}
            </dl>
            <p className="mt-3 text-xs text-soft">
              Las consultas fuera de horario se responden el siguiente día hábil.
            </p>
          </div>
        </aside>
      </section>

      <section data-reveal className="reveal border-t border-gold-faint pt-14">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
          <div className="border-t-2 border-gold bg-[#faf7f2] p-6 lg:col-span-4">
            <p className={EYEBROW}>Ubicación</p>
            <h2 className="mt-2 font-serif text-2xl text-cream">Hilarion Plaza 4157</h2>
            <p className="mt-1 text-sm text-soft">Cerro de las Rosas, Córdoba Capital</p>
            <p className="mt-4 text-xs leading-relaxed text-cream/80">{SITE.address}</p>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener"
              className="mt-6 inline-block text-xs font-medium uppercase tracking-[0.16em] text-gold hover:underline"
            >
              Abrir en Google Maps →
            </a>
          </div>

          <div className="min-h-[300px] overflow-hidden border border-gold-faint lg:col-span-8 sm:min-h-[380px]">
            <iframe
              title="Ubicación de T&B Global Logística"
              src={`https://www.google.com/maps?q=${encodeURIComponent(SITE.address)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[300px] w-full sm:min-h-[380px]"
            />
          </div>
        </div>
      </section>

      <section data-reveal className="reveal flex flex-col justify-between gap-6 border-t border-gold-faint pt-10 sm:flex-row sm:items-center">
        <div>
          <p className="font-serif text-xl text-cream">¿Preferís estimar antes de escribir?</p>
          <p className="mt-1 text-sm text-soft">Probá con pesos de referencia o revisá cómo se organiza cada etapa.</p>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/simulacion" className="font-medium text-gold underline decoration-gold/50 underline-offset-4 hover:decoration-gold">
            Ir a simulación
          </Link>
          <Link href="/servicios" className="text-cream underline decoration-cream/30 underline-offset-4 hover:text-gold">
            Ver modalidades
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