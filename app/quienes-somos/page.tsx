import QuienesSomos from "@/components/QuienesSomos";

export default function QuienesSomosPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-16 lg:px-8 lg:pt-28">
      <header className="max-w-3xl">
        <p className="qs-kicker mb-4 text-[11px] font-medium uppercase tracking-[0.3em] text-gold">Quiénes somos</p>
        <h1 className="qs-title font-serif text-4xl leading-tight text-cream sm:text-6xl">
          Importamos con <span className="italic text-gold">criterio</span>, de punta a punta
        </h1>
        <p className="qs-sub mt-6 text-base leading-relaxed text-cream/90">
          Un equipo que se ocupa del recorrido completo de tu mercadería, para que vos te ocupes de vender.
        </p>
      </header>

      <div className="mt-6">
        <QuienesSomos />
      </div>

      <style>{`
        .qs-kicker, .qs-title, .qs-sub { animation: hero-in .9s cubic-bezier(.2,.8,.2,1) both; }
        .qs-title { animation-delay: .12s; }
        .qs-sub { animation-delay: .25s; }
        @keyframes hero-in { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .qs-kicker, .qs-title, .qs-sub { animation: none; } }
      `}</style>
    </main>
  );
}