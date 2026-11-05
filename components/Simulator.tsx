import Link from "next/link";
import { waLink } from "@/lib/site";

export default function Home() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/media/hero.mp4"
        poster="/media/hero.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/30" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      <div className="relative mx-auto w-full max-w-6xl px-5 pt-28">
        <p className="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-gold">
          Carga consolidada · China y Brasil
        </p>
        <h1 className="mb-7 max-w-3xl font-serif text-5xl leading-[1.05] text-cream sm:text-6xl lg:text-7xl">
          Tu mercadería, <span className="italic text-gold">hasta tu puerta.</span>
        </h1>
        <p className="mb-10 max-w-xl text-base text-cream/80 sm:text-lg">
          Sin comprar un contenedor completo. Compartís espacio con otros importadores y pagás solo por
          los kilos que traés. Nosotros nos ocupamos del flete, la aduana y la entrega.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href={waLink()}
            target="_blank"
            rel="noopener"
            className="border border-gold bg-gold px-7 py-4 text-sm uppercase tracking-[0.1em] text-ink transition hover:-translate-y-0.5 hover:bg-transparent hover:text-gold"
          >
            Cotizar por WhatsApp
          </a>
          <Link
            href="/como-funciona"
            className="border border-gold px-7 py-4 text-sm uppercase tracking-[0.1em] text-gold transition hover:-translate-y-0.5 hover:bg-gold hover:text-ink"
          >
            Cómo funciona
          </Link>
        </div>
      </div>
    </section>
  );
}