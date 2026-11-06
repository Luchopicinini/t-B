import ServiciosShowcase from "@/components/ServiciosShowcase";

export default function ServiciosPage() {
  return (
    <div className="svc-light">
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-16 lg:px-8 lg:pt-28">
        <header className="max-w-3xl">
          <p className="servicios-kicker mb-4 text-[11px] font-medium uppercase tracking-[0.3em] text-gold">Servicios</p>
          <h1 className="servicios-title font-serif text-4xl leading-tight text-cream sm:text-6xl">
            Elegí la modalidad que <span className="italic text-gold">necesitás</span>
          </h1>
          <p className="servicios-sub mt-6 text-base leading-relaxed text-cream/90">
            Trabajamos con tres formas de importar. La que conviene depende del volumen, el peso y el tiempo que
            tengas. Tocá cada una para ver cómo funciona.
          </p>
        </header>

        <ServiciosShowcase />
      </main>

      <style>{`
        .servicios-kicker, .servicios-title, .servicios-sub { animation: hero-in .9s cubic-bezier(.2,.8,.2,1) both; }
        .servicios-title { animation-delay: .12s; }
        .servicios-sub { animation-delay: .25s; }
        @keyframes hero-in { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .servicios-kicker, .servicios-title, .servicios-sub { animation: none; } }
      `}</style>
    </div>
  );
}