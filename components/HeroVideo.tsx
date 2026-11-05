"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    v.muted = true;
    v.defaultMuted = true;

    const onPlaying = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    v.addEventListener("playing", onPlaying);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onPause);

    const tryPlay = () => v.play().catch(() => setPlaying(false));
    tryPlay();

    const onVisible = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    const onTouch = () => {
      tryPlay();
      window.removeEventListener("touchstart", onTouch);
    };

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("touchstart", onTouch, { passive: true });

    return () => {
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onPause);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("touchstart", onTouch);
    };
  }, []);

  const handlePlay = () => {
    ref.current?.play().catch(() => setPlaying(false));
  };

  return (
    <>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        poster="/media/hero.jpg"
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        aria-hidden="true"
      >
        <source src="/media/hero.mp4" type="video/mp4" />
      </video>

      {!playing && (
        <button
          type="button"
          onClick={handlePlay}
          className="absolute bottom-24 right-5 z-10 flex items-center gap-2 border border-gold/60 bg-ink/70 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-gold backdrop-blur transition hover:bg-gold hover:text-ink"
        >
          <span aria-hidden="true">▶</span> Reproducir
        </button>
      )}
    </>
  );
}