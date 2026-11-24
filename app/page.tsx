import Link from "next/link";
import { waLink } from "@/lib/site";
import HeroVideo from "@/components/HeroVideo";

export default function Home() {
  return (
    <>
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <HeroVideo />

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
              Cotizar
            </a>
            <Link
              href="/como-funciona"
              className="border border-gold px-7 py-4 text-sm uppercase tracking-[0.1em] text-gold transition hover:-translate-y-0.5 hover:bg-gold hover:text-ink"
            >
              ¿Cómo funciona?
            </Link>
          </div>
        </div>
      </section>

      {/* Sección con texto y dos fotos chicas apiladas */}
      <section className="mx-auto mt-24 grid max-w-6xl gap-10 px-5 md:mt-32 md:grid-cols-2 md:items-center md:gap-16">
        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-gold">Desde el origen</p>
          <h2 className="font-serif text-3xl leading-snug text-cream sm:text-4xl">
            Desde el origen hasta tu depósito, con un solo interlocutor.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-cream/80">
            Coordinamos la carga con tu proveedor, la consolidación, el embarque, la aduana y la entrega.
            Vos hablás con nosotros, no con cada uno de los intermediarios.
          </p>
          <Link href="/como-funciona" className="mt-7 inline-block text-sm text-gold underline-offset-4 hover:underline">
            Ver el proceso completo →
          </Link>
        </div>

        <div className="flex flex-col gap-5">
          <div className="overflow-hidden border border-gold-faint">
            <img
              src="/img/contenedor-carga-china.jpeg"
              alt="Cajas con mercadería dentro de un contenedor"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="overflow-hidden border border-gold-faint">
            <img
              src="/img/barco-hapag-lloyd.jpeg"
              alt="Barco de carga con contenedores"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}