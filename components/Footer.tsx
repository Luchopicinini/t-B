import Link from "next/link";
import { SITE, waLink } from "@/lib/site";

const LINKS = [
  { href: "/servicios", label: "Modalidades" },
  { href: "/como-funciona", label: "Cómo funciona" },
  { href: "/simulacion", label: "Simulación" },
  { href: "/quienes-somos", label: "Quiénes somos" },
  { href: "/contacto", label: "Contacto" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gold-faint bg-ink-2">
      <div className="mx-auto max-w-5xl px-5 py-16 text-center sm:py-20">
        <Link href="/" className="inline-block">
          <span className="block font-serif text-4xl tracking-wider text-gold sm:text-5xl">T&amp;B</span>
          <span className="mt-2 block text-[10px] uppercase tracking-[0.38em] text-soft">
            Global Logística Internacional
          </span>
        </Link>

        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-cream/75">
          Importación integral hacia Argentina. Carga consolidada, contenedor completo y courier aéreo con despacho y entrega puerta a puerta.
        </p>

        <nav
          aria-label="Navegación del pie de página"
          className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-y border-gold-faint py-5 text-xs uppercase tracking-[0.18em] text-cream/85"
        >
          {LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-gold">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-9 grid gap-6 text-sm sm:grid-cols-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-gold">WhatsApp</p>
            <div className="mt-2 flex flex-col items-center gap-1">
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/85 transition hover:text-gold"
              >
                {SITE.whatsappDisplay}
              </a>
              <a
                href={`https://wa.me/${SITE.whatsapp2}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/85 transition hover:text-gold"
              >
                {SITE.whatsappDisplay2}
              </a>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-gold">Correo</p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-2 inline-block break-all text-cream/85 transition hover:text-gold"
            >
              {SITE.email}
            </a>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-gold">Oficina</p>
            <p className="mt-2 text-cream/85">Hilarion Plaza 4157</p>
            <p className="text-xs text-soft">Cerro de las Rosas, Córdoba</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gold-faint">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-soft sm:flex-row">
          <span>© 2026 {SITE.fullName}. Todos los derechos reservados.</span>
          <span>Córdoba · Cobertura en todo el país</span>
        </div>
      </div>
    </footer>
  );
}