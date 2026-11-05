"use client";

import { useEffect, useState } from "react";
import { ORIGINS, SITE, waLink } from "@/lib/site";

// PLACEHOLDER: completar con los horarios reales
const HOURS = [
  { day: "Lunes a viernes", time: "00:00 – 00:00" },
  { day: "Sábados", time: "00:00 – 00:00" },
  { day: "Domingos", time: "Cerrado" },
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

export default function Contacto() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [touched, setTouched] = useState(false);

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

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const valid = form.nombre.trim().length > 1 && form.contacto.trim().length > 4;

  const modeLabel = MODES.find((m) => m.id === form.modo)?.label ?? "";

  const message = [
    "Hola! Quiero hacer una consulta desde la web.",
    "",
    `Nombre: ${form.nombre}`,
    form.empresa && `Empresa: ${form.empresa}`,
    `Contacto: ${form.contacto}`,
    `Modalidad: ${modeLabel}`,
    `Origen: ${form.origen}`,
    form.mensaje && `Mensaje: ${form.mensaje}`,
  ]
    .filter(Boolean)
    .join("\n");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    window.open(waLink(message), "_blank", "noopener");
  };

  const field =
    "w-full border-b border-gold-dim bg-transparent py-3 text-sm text-cream placeholder:text-soft/60 outline-none transition-colors focus:border-gold";
  const label = "mb-1 block text-[10px] uppercase tracking-[0.25em] text-soft";

  return (
    <>
      {/* Canales directos */}
      <section data-reveal className="reveal mt-20 grid gap-px bg-gold-faint sm:grid-cols-3">
        <a href={waLink()} target="_blank" rel="noopener" className="group bg-ink p-8 transition-colors duration-300 hover:bg-ink-2">
          <p className="text-[10px] uppercase tracking-[0.25em] text-soft">WhatsApp</p>
          <p className="mt-3 font-serif text-xl text-cream group-hover:text-gold">{SITE.whatsappDisplay}</p>
          <p className="mt-2 text-xs text-gold/0 transition-colors group-hover:text-gold">Abrir chat →</p>
        </a>
        <a href={`mailto:${SITE.email}`} className="group bg-ink p-8 transition-colors duration-300 hover:bg-ink-2">
          <p className="text-[10px] uppercase tracking-[0.25em] text-soft">Correo</p>
          <p className="mt-3 break-all font-serif text-lg text-cream group-hover:text-gold">{SITE.email}</p>
          <p className="mt-2 text-xs text-gold/0 transition-colors group-hover:text-gold">Escribir →</p>
        </a>
        <div className="bg-ink p-8">
          <p className="text-[10px] uppercase tracking-[0.25em] text-soft">Oficina</p>
          <p className="mt-3 font-serif text-lg leading-snug text-cream">Hilarion Plaza 4157</p>
          <p className="mt-1 text-sm text-soft">Cerro de las Rosas, Córdoba</p>
        </div>
      </section>

      {/* Formulario + horarios */}
      <section data-reveal className="reveal mt-24 grid gap-16 md:grid-cols-12">
        <form onSubmit={submit} noValidate className="space-y-10 md:col-span-7">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Escribinos</p>
            <h2 className="mt-3 font-serif text-3xl text-cream sm:text-4xl">Contanos qué querés importar</h2>
            <p className="mt-3 text-sm text-soft">
              Al enviar se abre WhatsApp con tu consulta ya escrita. Solo tenés que tocar enviar.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <label htmlFor="nombre" className={label}>Nombre *</label>
              <input id="nombre" value={form.nombre} onChange={set("nombre")} className={field} placeholder="Tu nombre" autoComplete="name" />
              {touched && form.nombre.trim().length <= 1 && <p className="mt-2 text-xs text-gold">Necesitamos tu nombre.</p>}
            </div>
            <div>
              <label htmlFor="empresa" className={label}>Empresa</label>
              <input id="empresa" value={form.empresa} onChange={set("empresa")} className={field} placeholder="Opcional" autoComplete="organization" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="contacto" className={label}>WhatsApp o correo *</label>
              <input id="contacto" value={form.contacto} onChange={set("contacto")} className={field} placeholder="Para responderte" autoComplete="email" />
              {touched && form.contacto.trim().length <= 4 && <p className="mt-2 text-xs text-gold">Dejanos un medio para responderte.</p>}
            </div>
            <div>
              <label htmlFor="modo" className={label}>Modalidad</label>
              <select id="modo" value={form.modo} onChange={set("modo")} className={`${field} appearance-none`}>
                {MODES.map((m) => (
                  <option key={m.id} value={m.id} className="bg-ink">{m.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="origen" className={label}>Origen</label>
              <select id="origen" value={form.origen} onChange={set("origen")} className={`${field} appearance-none`}>
                {ORIGINS.map((o) => (
                  <option key={o} value={o} className="bg-ink">{o}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="mensaje" className={label}>Mensaje</label>
              <textarea
                id="mensaje"
                value={form.mensaje}
                onChange={set("mensaje")}
                rows={4}
                className={`${field} resize-none`}
                placeholder="Producto, cantidad aproximada, peso, fecha en la que lo necesitás…"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button
              type="submit"
              className="border border-gold bg-gold px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition hover:bg-transparent hover:text-gold"
            >
              Enviar por WhatsApp
            </button>
            <p className="text-xs text-soft">Campos con * son obligatorios.</p>
          </div>
        </form>

        <aside className="md:col-span-5">
          <div className="border border-gold-faint p-8">
            <p className="text-[11px] uppercase tracking-[0.25em] text-gold">Horarios</p>
            <ul className="mt-6 divide-y divide-gold-faint text-sm">
              {HOURS.map((h) => (
                <li key={h.day} className="flex justify-between py-3">
                  <span className="text-cream/80">{h.day}</span>
                  <span className="text-cream/60">{h.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-soft">
              Las consultas que llegan fuera de horario se responden en el próximo día hábil.
            </p>
          </div>

          <div className="mt-6 border border-gold-faint p-8">
            <p className="text-[11px] uppercase tracking-[0.25em] text-gold">Tiempo de respuesta</p>
            <p className="mt-4 text-sm leading-relaxed text-cream/80">
              Respondemos cada consulta con una cotización o con las preguntas que necesitamos para armarla.
            </p>
          </div>
        </aside>
      </section>

      {/* Dónde estamos */}
      <section data-reveal className="reveal mt-32">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Dónde estamos</p>
            <h2 className="mt-3 font-serif text-3xl text-cream sm:text-4xl">Hilarion Plaza 4157</h2>
            <p className="mt-2 text-sm text-soft">Cerro de las Rosas, Córdoba Capital · CP X5009</p>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.address)}`}
            target="_blank"
            rel="noopener"
            className="text-sm text-gold underline-offset-4 hover:underline"
          >
            Cómo llegar →
          </a>
        </div>
        <div className="relative h-[360px] overflow-hidden border border-gold-faint">
          <iframe
            title="Ubicación de T&B Global Logística"
            src={`https://www.google.com/maps?q=${encodeURIComponent(SITE.address)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="map-dark h-full w-full"
          />
        </div>
      </section>

      <style>{`
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity .9s ease, transform .9s cubic-bezier(.2,.8,.2,1); }
        .reveal.is-in { opacity: 1; transform: none; }
        .map-dark { filter: invert(.92) hue-rotate(180deg) grayscale(.6) brightness(.8) sepia(.35); }
        select option { background: #0a0907; color: #f0e6d0; }
        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1; transform: none; transition: none; }
        }
      `}</style>
    </>
  );
}