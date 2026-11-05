import { SITE, waLink } from "@/lib/site";

function TruckRear() {
  const ribs = Array.from({ length: 11 }, (_, i) => 36 + i * 9.5);

  return (
    <svg viewBox="0 0 260 186" className="h-auto w-56 overflow-visible sm:w-64" aria-hidden="true">
      <defs>
        <linearGradient id="tr-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2da9a" />
          <stop offset=".5" stopColor="#c9a25a" />
          <stop offset="1" stopColor="#7d5f2e" />
        </linearGradient>
        <linearGradient id="tr-door" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8a6c36" />
          <stop offset=".5" stopColor="#d9b56e" />
          <stop offset="1" stopColor="#8a6c36" />
        </linearGradient>
        <radialGradient id="tr-glow-red" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#ff6b4a" stopOpacity=".7" />
          <stop offset="1" stopColor="#ff6b4a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tr-glow-amber" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#ffc247" stopOpacity=".8" />
          <stop offset="1" stopColor="#ffc247" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tr-shadow" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#000" stopOpacity=".9" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sombra en el piso */}
      <ellipse cx="130" cy="176" rx="124" ry="9" fill="url(#tr-shadow)" />

      {/* Cuerpo del contenedor */}
      <rect x="28" y="12" width="204" height="138" rx="4" fill="url(#tr-body)" />

      {/* Postes de las esquinas */}
      <rect x="28" y="12" width="9" height="138" fill="#5e4724" fillOpacity=".55" />
      <rect x="223" y="12" width="9" height="138" fill="#5e4724" fillOpacity=".55" />

      {/* Bandas horizontales de refuerzo */}
      <rect x="37" y="34" width="186" height="2" fill="#0a0907" fillOpacity=".25" />
      <rect x="37" y="128" width="186" height="2" fill="#0a0907" fillOpacity=".25" />

      {/* Nervaduras de las puertas */}
      {ribs.map((x) => (
        <line key={x} x1={x} y1="40" x2={x} y2="124" stroke="#0a0907" strokeOpacity=".22" strokeWidth="1.6" />
      ))}
      {ribs.map((x) => (
        <line key={`r${x}`} x1={x + 2} y1="40" x2={x + 2} y2="124" stroke="#fff4d0" strokeOpacity=".18" strokeWidth=".8" />
      ))}

      {/* Junta central de las dos puertas */}
      <rect x="128" y="12" width="4" height="138" fill="#0a0907" fillOpacity=".55" />
      <rect x="132" y="12" width="1.2" height="138" fill="#fff4d0" fillOpacity=".25" />

      {/* Bisagras */}
      <rect x="34" y="60" width="6" height="14" rx="1" fill="#2a2216" />
      <rect x="34" y="96" width="6" height="14" rx="1" fill="#2a2216" />
      <rect x="220" y="60" width="6" height="14" rx="1" fill="#2a2216" />
      <rect x="220" y="96" width="6" height="14" rx="1" fill="#2a2216" />

      {/* Panel de marca */}
      <rect x="86" y="60" width="88" height="50" rx="2" fill="#0a0907" fillOpacity=".85" />
      <rect x="90" y="64" width="80" height="42" rx="1" fill="none" stroke="#d4b26e" strokeOpacity=".7" strokeWidth=".8" />
      <text x="130" y="89" textAnchor="middle" fontFamily="Lora, Georgia, serif" fontSize="22" fontWeight="600" fill="#f5ead2">
        T&amp;B
      </text>
    

      {/* Parachoques */}
      <rect x="22" y="150" width="216" height="9" rx="2" fill="#030200" stroke="#ffa600" strokeWidth="1" />

      {/* Luces traseras: glow */}
      <circle cx="47" cy="128" r="22" fill="url(#tr-glow-amber)" className="blink-glow" />
      <circle cx="213" cy="128" r="22" fill="url(#tr-glow-red)" />

      {/* Luz izquierda: guiño ámbar que parpadea */}
      <rect x="34" y="118" width="26" height="18" rx="3" fill="#2a1a0c" />
      <rect x="36" y="120" width="22" height="14" rx="2" fill="#ffb13b" className="blink" />
      <rect x="40" y="123" width="6" height="8" rx="1" fill="#fff3c4" fillOpacity=".7" className="blink" />

      {/* Luz derecha: roja fija */}
      <rect x="200" y="118" width="26" height="18" rx="3" fill="#2a0c0c" />
      <rect x="202" y="120" width="22" height="14" rx="2" fill="#e0463a" />
      <rect x="206" y="123" width="6" height="8" rx="1" fill="#ffd1c4" fillOpacity=".7" />

      {/* Ruedas */}
      {[62, 88, 172, 198].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="166" r="12" fill="#0a0907" stroke="#c9a25a" strokeWidth="2" />
          <g className="spin" style={{ transformOrigin: `${cx}px 166px` }}>
            <circle cx={cx} cy="166" r="4.5" fill="#d4b26e" />
            <line x1={cx} y1="159" x2={cx} y2="173" stroke="#0a0907" strokeOpacity=".5" strokeWidth="1.5" />
          </g>
        </g>
      ))}

      {/* Línea de ruta */}
      <line x1="0" y1="182" x2="260" y2="182" stroke="#c9a25a" strokeOpacity=".4" strokeWidth="1.5" strokeDasharray="14 12" className="road-line" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-gold-faint bg-ink-2">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-3">
        {/* Marca */}
        <div>
          <p className="font-serif text-4xl leading-none tracking-wide text-gold">T&amp;B</p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.4em] text-soft">Global Logística Internacional</p>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-soft">
            Importación desde China y Brasil, con carga consolidada, contenedor completo y courier aéreo.
            Trabajamos con despachante de aduana y entregamos en todo el país.
          </p>
        </div>

        {/* Camión */}
        <div className="flex justify-center">
          <TruckRear />
        </div>

        {/* Contacto */}
        <ul className="space-y-5 text-sm md:justify-self-end">
          <li>
            <p className="mb-1 text-[11px] tracking-[0.15em] text-soft">WhatsApp</p>
            <a href={waLink()} target="_blank" rel="noopener" className="text-cream/85 transition hover:text-gold">
              {SITE.whatsappDisplay}
            </a>
            <li>
              <a
              href={`https://wa.me/${SITE.whatsapp2}`}
              target="_blank"
              rel="noopener"
              className="text-cream/85 transition hover:text-gold"
            >
              {SITE.whatsappDisplay2}
            </a>
          </li>
          </li>
          <li>
            <p className="mb-1 text-[11px] tracking-[0.15em] text-soft">Correo</p>
            <a href={`mailto:${SITE.email}`} className="break-all text-cream/85 transition hover:text-gold">
              {SITE.email}
            </a>
          </li>
        </ul>
      </div>

      {/* Legal */}
      <div className="border-t border-gold-faint">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-6 text-xs text-soft">
          <span>© 2026 {SITE.fullName}. Todos los derechos reservados.</span>
        </div>
      </div>

      <style>{`
        .blink { animation: blink 1.2s steps(1, end) infinite; }
        @keyframes blink {
          0%, 55% { opacity: 1; }
          56%, 100% { opacity: .18; }
        }
        .blink-glow { animation: blink-glow 1.2s steps(1, end) infinite; }
        @keyframes blink-glow {
          0%, 55% { opacity: 1; }
          56%, 100% { opacity: 0; }
        }
        .spin { transform-box: view-box; animation: spin 1.4s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .road-line { animation: road 1.4s linear infinite; }
        @keyframes road { to { stroke-dashoffset: -26; } }
        @media (prefers-reduced-motion: reduce) {
          .blink, .blink-glow, .spin, .road-line { animation: none; }
        }
      `}</style>
    </footer>
  );
}