interface Props {
  percent: number;
  size?: number;
  label?: string;
}

/** Pengukur akurasi bergaya game: cincin bersegmen berwarna hijau. */
export function Gauge({ percent, size = 110, label = "AKURASI" }: Props) {
  const segs = 30;
  const active = Math.round((Math.max(0, Math.min(100, percent)) / 100) * segs);
  return (
    <div className="inline-flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          <circle cx="50" cy="50" r="49" fill="#15171c" stroke="#0b0c0f" strokeWidth="1" />
          {Array.from({ length: segs }).map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="6"
              x2="50"
              y2="19"
              strokeWidth="4.2"
              strokeLinecap="butt"
              stroke={i < active ? "#22d36b" : "#3a3e47"}
              style={{
                transform: `rotate(${(i * 360) / segs}deg)`,
                transformOrigin: "50px 50px",
                filter: i < active ? "drop-shadow(0 0 2px #22d36b)" : undefined,
              }}
            />
          ))}
          <circle cx="50" cy="50" r="26" fill="#101216" />
        </svg>
        <div
          className="font-display absolute inset-0 flex items-center justify-center font-extrabold text-white"
          style={{ fontSize: size * 0.22 }}
        >
          {Math.round(percent)}%
        </div>
      </div>
      {label && (
        <div
          className="font-display -mt-3 rounded-sm bg-[#1fb85e] px-3 py-0.5 text-[10px] font-extrabold tracking-wider text-white shadow-[0_0_10px_rgba(34,211,107,0.6)]"
          style={{ position: "relative" }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

export function Stars({ count, size = 22 }: { count: number; size?: number }) {
  return (
    <div className="inline-flex gap-1">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          style={{
            fontSize: size,
            color: i <= count ? "#ffd21f" : "#454a55",
            textShadow: i <= count ? "0 0 10px rgba(255,210,31,0.8)" : undefined,
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
