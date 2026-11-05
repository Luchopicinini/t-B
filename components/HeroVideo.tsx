"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [desktop, setDesktop] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Solo carga el video en pantallas de 768px o más
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!desktop) return;
    const v = ref.current;
    if (!v) return;

    v.muted = true;
    v.defaultMuted = true;

    const onPlaying = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("playing", onPlaying);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onPause);

    v.play().catch(() => setPlaying(false));

    return () => {
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onPause);
    };
  }, [desktop]);

  const handlePlay = () => {
    ref.current?.play().catch(() => setPlaying(false));
  };

  if (!desktop) {
    return (
      <img
        src="/media/hero.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  return (
    <>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        src="/media/hero.mp4"
        poster="/media/hero.jpg"
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        aria-hidden="true"
      />
      {!playing && (
        <button
          type="button"
          onClick={handlePlay}
          className="absolute bottom-24 right-8 z-10 flex items-center gap-2 border border-gold/60 bg-ink/70 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-gold backdrop-blur transition hover:bg-gold hover:text-ink"
        >
          <span aria-hidden="true">▶</span> Reproducir
        </button>
      )}
    </>
  );
}