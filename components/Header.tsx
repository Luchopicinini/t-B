"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE, waLink } from "@/lib/site";

const NAV_ITEMS = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/como-funciona", label: "Cómo funciona" },
  { href: "/simulacion", label: "Simulación" },
  { href: "/quienes-somos", label: "Quiénes somos" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const syncScroll = () => setIsScrolled(window.scrollY > 20);
    syncScroll();
    window.addEventListener("scroll", syncScroll, { passive: true });
    return () => window.removeEventListener("scroll", syncScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const isCurrentRoute = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          isScrolled || menuOpen
            ? "border-b border-gold-faint bg-ink/95 backdrop-blur-sm"
            : "border-b border-transparent bg-ink/75"
        }`}
      >
        {!isScrolled && (
          <div className="hidden border-b border-gold-faint/60 lg:block">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-1.5 text-[11px] tracking-[0.14em] text-soft">
              <span>Córdoba, Argentina · Cobertura nacional</span>
              <div className="flex items-center gap-6">
                <a href={`mailto:${SITE.email}`} className="transition hover:text-gold">
                  {SITE.email}
                </a>
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/85 transition hover:text-gold"
                >
                  {SITE.whatsappDisplay}
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-5">
          <Link href="/" className="flex items-center gap-3" aria-label="Inicio">
            <span className="grid h-9 w-9 place-items-center border border-gold font-serif text-xs font-semibold text-gold sm:h-10 sm:w-10 sm:text-sm">
              T&amp;B
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-serif text-sm tracking-[0.2em] text-cream sm:text-[15px]">
                GLOBAL
              </span>
              <span className="mt-1 hidden text-[9px] uppercase tracking-[0.32em] text-soft sm:block">
                Logística internacional
              </span>
            </span>
          </Link>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {NAV_ITEMS.map((item) => {
                const active = isCurrentRoute(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`py-1.5 text-xs uppercase tracking-[0.16em] transition ${
                        active
                          ? "border-b border-gold text-gold"
                          : "text-cream/80 hover:text-gold"
                      }`}
                    >
                      {item.label}
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
              rel="noopener noreferrer"
              className="hidden border border-gold px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-gold transition hover:bg-gold hover:text-ink lg:inline-block"
            >
              Cotizar
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-controls="menu-movil"
              className="border border-gold/50 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-gold transition hover:border-gold lg:hidden"
            >
              {menuOpen ? "Cerrar" : "Menú"}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div
          id="menu-movil"
          className="fixed inset-0 z-40 overflow-y-auto bg-ink px-5 pb-8 pt-24 sm:px-8 lg:hidden"
        >
          <nav aria-label="Menú móvil" className="mx-auto flex h-full max-w-lg flex-col justify-between">
            <ul className="divide-y divide-gold-faint border-y border-gold-faint">
              {NAV_ITEMS.map((item, idx) => {
                const active = isCurrentRoute(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-baseline justify-between py-4 font-serif text-2xl transition ${
                        active ? "text-gold" : "text-cream hover:text-gold"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="font-sans text-[11px] tracking-[0.2em] text-soft">
                        0{idx + 1}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 space-y-4">
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-gold bg-gold py-3.5 text-center text-xs font-medium uppercase tracking-[0.18em] text-ink"
              >
                Cotizar por WhatsApp
              </a>
              <div className="flex items-center justify-between text-xs text-soft">
                <a href={`mailto:${SITE.email}`} className="truncate pr-4">
                  {SITE.email}
                </a>
                <span className="shrink-0">Córdoba, AR</span>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}