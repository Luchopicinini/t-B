import Contacto from "@/components/Contacto";

export default function ContactoPage() {
  return (
    <div className="svc-light">
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-16 lg:px-8 lg:pt-28">
        <header className="max-w-3xl">
          <p className="ct-kicker mb-4 text-[11px] font-medium uppercase tracking-[0.3em] text-gold">Contacto</p>
          <h1 className="ct-title font-serif text-4xl leading-tight text-cream sm:text-6xl">
            Hablemos de <span className="italic text-gold">tu importación</span>
          </h1>
          <p className="ct-sub mt-6 text-base leading-relaxed text-cream/90">
            Escribinos por WhatsApp, por correo o con el formulario. Te respondemos con una cotización o con las
            preguntas que necesitamos para armarla.
          </p>
        </header>

        <Contacto />
      </main>

      <style>{`
        .ct-kicker, .ct-title, .ct-sub { animation: hero-in .9s cubic-bezier(.2,.8,.2,1) both; }
        .ct-title { animation-delay: .12s; }
        .ct-sub { animation-delay: .25s; }
        @keyframes hero-in { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .ct-kicker, .ct-title, .ct-sub { animation: none; } }
      `}</style>
    </div>
  );
}