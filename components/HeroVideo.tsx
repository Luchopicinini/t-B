"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    // React no siempre aplica "muted" como atributo: lo forzamos por JS
    v.muted = true;
    v.defaultMuted = true;

    const tryPlay = () =>
      v
        .play()
        .then(() => setBlocked(false))
        .catch(() => setBlocked(true));

    tryPlay();

    // Si la persona vuelve a la pestaña, reintenta
    const onVisible = () => {
      if (document.visibilityState === "visible") tryPlay();
    };

    // Primer toque en la pantalla: en iOS suele destrabar la reproducción
    const onTouch = () => {
      tryPlay();
      window.removeEventListener("touchstart", onTouch);
    };

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("touchstart", onTouch, { passive: true });

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("touchstart", onTouch);
    };
  }, []);

  return (
    <>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        src="/media/hero.mp4"
        poster="/media/hero.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {blocked && (
        <button
          type="button"
          onClick={() => ref.current?.play().then(() => setBlocked(false)).catch(() => {})}
          className="absolute bottom-24 right-5 z-10 flex items-center gap-2 border border-gold/60 bg-ink/70 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-gold backdrop-blur transition hover:bg-gold hover:text-ink"
        >
          <span aria-hidden="true">▶</span> Reproducir
        </button>
      )}
    </>
  );
}