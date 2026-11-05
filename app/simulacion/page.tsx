import Simulacion from "@/components/Simulacion";

export default function SimulacionPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-16 lg:px-8 lg:pt-28">
      <header className="max-w-3xl">
        <p className="sim-kicker mb-4 text-[11px] uppercase tracking-[0.3em] text-gold">Simulación de costos</p>
        <h1 className="sim-title font-serif text-4xl leading-tight text-cream sm:text-6xl">
          Calculá una <span className="italic text-gold">referencia</span> antes de cotizar
        </h1>
        <p className="sim-sub mt-6 text-base leading-relaxed text-soft">
          Elegí modalidad, origen y peso. Te mostramos qué está incluido y qué se cotiza aparte, sin sorpresas.
        </p>
      </header>

      <div className="mt-4">
        <Simulacion />
      </div>

      <style>{`
        .sim-kicker, .sim-title, .sim-sub { animation: hero-in .9s cubic-bezier(.2,.8,.2,1) both; }
        .sim-title { animation-delay: .12s; }
        .sim-sub { animation-delay: .25s; }
        @keyframes hero-in { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .sim-kicker, .sim-title, .sim-sub { animation: none; } }
      `}</style>
    </main>
  );
}