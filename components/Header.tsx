"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE, waLink } from "@/lib/site";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/quienes-somos", label: "Quiénes somos" },
  { href: "/servicios", label: "Servicios" },
  { href: "/como-funciona", label: "Cómo funciona" },
  { href: "/simulacion", label: "Simulación" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled || open
            ? "border-b border-gold-faint bg-ink/95 backdrop-blur-md"
            : "border-b border-transparent bg-gradient-to-b from-ink/70 to-transparent"
        }`}
      >
        {/* Barra superior (solo desktop) */}
        <div
          className={`hidden overflow-hidden transition-all duration-500 lg:block ${
            scrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
          }`}
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2 text-[11px] tracking-[0.15em] text-soft">
            <span>Córdoba, Argentina · Cubrimos todo el país</span>
            <div className="flex items-center gap-6">
              <a href={`mailto:${SITE.email}`} className="transition hover:text-gold">
                {SITE.email}
              </a>
              <a href={waLink()} target="_blank" rel="noopener" className="text-cream/80 transition hover:text-gold">
                {SITE.whatsappDisplay}
              </a>
            </div>
          </div>
        </div>

        <div
          className={`mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 transition-all duration-500 sm:px-5 ${
            scrolled ? "py-2.5" : "py-3 sm:py-4 lg:py-5"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5 sm:gap-3" aria-label="Inicio">
            <span className="grid h-8 w-8 place-items-center border border-gold text-gold transition group-hover:bg-gold group-hover:text-ink sm:h-10 sm:w-10">
              <span className="font-serif text-[11px] font-semibold leading-none sm:text-sm">T&amp;B</span>
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-serif text-[13px] tracking-[0.2em] text-cream transition group-hover:text-gold sm:text-[15px]">
                GLOBAL
              </span>
              <span className="mt-1 hidden text-[8px] uppercase tracking-[0.4em] text-soft sm:block">
                Logística internacional
              </span>
            </span>
          </Link>

          {/* Navegación desktop */}
          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {LINKS.map((l) => {
                const active = isActive(l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={`group relative py-2 text-[12px] uppercase tracking-[0.18em] transition ${
                        active ? "text-gold" : "text-cream/80 hover:text-gold"
                      }`}
                    >
                      {l.label}
                      <span
                        className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-gold transition-transform duration-500 ${
                          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={waLink()}
              target="_blank"
              rel="noopener"
              className="hidden border border-gold bg-gold px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition hover:bg-transparent hover:text-gold md:inline-block"
            >
              Cotizar
            </a>

            {/* Hamburguesa */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-movil"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              className="relative grid h-9 w-9 place-items-center border border-gold/40 transition active:scale-95 lg:hidden"
            >
              <span
                className={`absolute h-px w-4 bg-gold transition-all duration-300 ${
                  open ? "rotate-45" : "-translate-y-[4px]"
                }`}
              />
              <span
                className={`absolute h-px w-4 bg-gold transition-all duration-300 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute h-px w-4 bg-gold transition-all duration-300 ${
                  open ? "-rotate-45" : "translate-y-[4px]"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Menú móvil */}
      <div
        id="menu-movil"
        className={`fixed inset-0 z-40 bg-ink transition-opacity duration-500 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_0%,rgba(212,178,110,0.12),transparent_50%)]" />

        <nav aria-label="Menú móvil" className="relative flex h-full flex-col px-5 pb-8 pt-24 sm:px-8">
          <ul className="flex-1 border-t border-gold-faint">
            {LINKS.map((l, i) => {
              const active = isActive(l.href);
              return (
                <li
                  key={l.href}
                  className={`border-b border-gold-faint transition-all duration-500 ${
                    open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                  style={{ transitionDelay: open ? `${100 + i * 50}ms` : "0ms" }}
                >
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-baseline justify-between py-3.5 font-serif text-xl transition sm:py-4 sm:text-2xl ${
                      active ? "text-gold" : "text-cream active:text-gold"
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="font-sans text-[10px] tracking-[0.2em] text-gold/50">0{i + 1}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 space-y-4">
            <a
              href={waLink()}
              target="_blank"
              rel="noopener"
              className="block border border-gold bg-gold py-3.5 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-ink"
            >
              Cotizar por WhatsApp
            </a>
            <div className="flex items-center justify-between text-[10px] tracking-[0.15em] text-soft">
              <a href={`mailto:${SITE.email}`} className="truncate pr-4">
                {SITE.email}
              </a>
              <span className="shrink-0">Córdoba, AR</span>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}