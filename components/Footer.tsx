import Link from "next/link";
import { SITE, waLink } from "@/lib/site";

const NAV = [
  {
    title: "Empresa",
    links: [
      { href: "/quienes-somos", label: "Quiénes somos" },
      { href: "/como-funciona", label: "Cómo funciona" },
      { href: "/contacto", label: "Contacto" },
    ],
  },
  {
    title: "Servicios",
    links: [
      { href: "/servicios", label: "Contenedor completo (FCL)" },
      { href: "/servicios", label: "Carga consolidada (LCL)" },
      { href: "/servicios", label: "Courier aéreo" },
      { href: "/simulacion", label: "Simulación de costos" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gold-faint bg-ink-2">
      <div className="mx-auto max-w-6xl px-5 pb-10 pt-20">
        <div className="grid gap-16 lg:grid-cols-12">
          {/* Marca */}
          <div className="lg:col-span-5">
            <p className="font-serif text-4xl leading-none tracking-wide text-gold">T&amp;B</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.4em] text-soft">Global Logística Internacional</p>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-soft">
              Importación desde China y Brasil, con carga consolidada, contenedor completo y courier aéreo.
              Trabajamos con despachante de aduana y entregamos en todo el país.
            </p>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener"
              className="mt-8 inline-flex items-center gap-3 border border-gold px-6 py-3 text-xs uppercase tracking-[0.18em] text-gold transition hover:bg-gold hover:text-ink"
            >
              Solicitar cotización
              <span aria-hidden="true">→</span>
            </a>
          </div>

          {/* Navegación */}
          <nav className="grid grid-cols-2 gap-10 lg:col-span-5">
            {NAV.map((col) => (
              <div key={col.title}>
                <p className="mb-6 text-[11px] uppercase tracking-[0.3em] text-gold">{col.title}</p>
                <ul className="space-y-3 text-sm">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-cream/75 transition hover:text-gold">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Contacto */}
          <div className="lg:col-span-2">
            <p className="mb-6 text-[11px] uppercase tracking-[0.3em] text-gold">Contacto</p>
            <ul className="space-y-5 text-sm">
              <li>
                <p className="mb-1 text-[11px] tracking-[0.15em] text-soft">WhatsApp</p>
                <a href={waLink()} target="_blank" rel="noopener" className="text-cream/85 transition hover:text-gold">
                  {SITE.whatsappDisplay}
                </a>
              </li>
              <li>
                <p className="mb-1 text-[11px] tracking-[0.15em] text-soft">Correo</p>
                <a href={`mailto:${SITE.email}`} className="break-all text-cream/85 transition hover:text-gold">
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Dirección */}
        <div className="mt-16 grid gap-6 border-t border-gold-faint pt-8 text-sm text-soft md:grid-cols-2">
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-[0.3em] text-gold">Oficina</p>
            <p>{SITE.address}</p>
          </div>
          <div className="md:text-right">
            <p className="mb-2 text-[11px] uppercase tracking-[0.3em] text-gold">Cobertura</p>
            <p>Todo el país · Importación desde China, Brasil, India, EE.UU. y Europa</p>
          </div>
        </div>
      </div>

      {/* Legal */}
      <div className="border-t border-gold-faint">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-6 text-xs text-soft">
          <span>© 2026 {SITE.fullName}. Todos los derechos reservados.</span>
          <span>Córdoba, Argentina</span>
        </div>
      </div>
    </footer>
  );
}