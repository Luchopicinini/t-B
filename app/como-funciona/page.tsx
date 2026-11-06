import ComoFunciona from "@/components/ComoFunciona";

export default function ComoFuncionaPage() {
  return (
    <div className="como-light">
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-16 lg:px-8 lg:pt-28">
        <header className="max-w-3xl">
          <p className="como-kicker mb-4 text-[11px] font-medium uppercase tracking-[0.3em] text-gold">Cómo funciona</p>
          <h1 className="como-title font-serif text-4xl leading-tight text-cream sm:text-6xl">
            Así traemos tu mercadería <span className="italic text-gold">desde el origen</span>
          </h1>
          <p className="como-sub mt-6 text-base leading-relaxed text-cream/90">
            Seis pasos, con responsabilidades claras. Tocá cada etapa para ver qué hace cada parte.
          </p>
        </header>

        <div className="mt-20">
          <ComoFunciona />
        </div>
      </main>

      <style>{`
        .como-kicker, .como-title, .como-sub { animation: hero-in .9s cubic-bezier(.2,.8,.2,1) both; }
        .como-title { animation-delay: .12s; }
        .como-sub { animation-delay: .25s; }
        @keyframes hero-in { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .como-kicker, .como-title, .como-sub { animation: none; } }
      `}</style>
    </div>
  );
}