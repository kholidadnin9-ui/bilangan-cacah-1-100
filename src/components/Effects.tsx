interface Props {
  /** Warna utama efek, biasanya mengikuti warna robot. */
  color: string;
  /** Varian efek: percikan api atau kilatan petir. */
  variant?: "fire" | "lightning";
  /** Intensitas efek: level permainan atau hasil bisa lebih ramai. */
  intensity?: "soft" | "normal" | "wild";
}

/**
 * Membuat halo cahaya, cincin pulsa, api berkedip, orb mengorbit, dan
 * kilatan petir SVG di sekitar robot. Semua elemen `pointer-events-none`
 * sehingga tidak mengganggu tombol di belakangnya.
 */
export function RobotEffects({ color, variant = "fire", intensity = "normal" }: Props) {
  const sparkCount = intensity === "wild" ? 10 : intensity === "soft" ? 4 : 7;
  const sparks = Array.from({ length: sparkCount });
  const boltCount = variant === "lightning" ? (intensity === "wild" ? 5 : 3) : 2;
  const bolts = Array.from({ length: boltCount });
  const orbCount = intensity === "wild" ? 3 : 2;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[5]"
      style={{ color }}
      aria-hidden
    >
      {/* Halo cahaya di belakang robot */}
      <span
        className="aura"
        style={{
          background: `radial-gradient(circle, ${color}cc 0%, ${color}55 40%, transparent 70%)`,
        }}
      />
      <span className="ring" />
      <span className="ring" style={{ animationDelay: "1.4s" }} />

      {/* Nyala api di bawah robot */}
      {variant === "fire" && (
        <>
          <span
            className="flame"
            style={{
              background: `radial-gradient(ellipse at 50% 100%, #fff 0%, #ffe28a 20%, ${color} 55%, transparent 80%)`,
            }}
          />
          <span
            className="flame"
            style={{
              width: "35%",
              height: "16%",
              bottom: "7%",
              animationDuration: "0.5s",
              background: `radial-gradient(ellipse at 50% 100%, #fff 0%, #ffd36b 30%, ${color} 70%, transparent 90%)`,
            }}
          />
        </>
      )}

      {/* Percikan yang terbang ke atas */}
      {sparks.map((_, i) => {
        const left = 15 + ((i * 71) % 70);
        const delay = (i * 0.27) % 2;
        const dur = 1.4 + ((i * 0.3) % 1.2);
        return (
          <span
            key={`s-${i}`}
            className="spark"
            style={{
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${dur}s`,
              background: `radial-gradient(circle, #fff 0%, ${color} 55%, transparent 80%)`,
              boxShadow: `0 0 10px ${color}, 0 0 18px ${color}`,
            }}
          />
        );
      })}

      {/* Kilatan petir SVG */}
      {bolts.map((_, i) => {
        const positions = [
          { left: "6%", top: "18%", rot: -18, scale: 1 },
          { right: "6%", top: "22%", rot: 20, scale: 1.1 },
          { left: "12%", bottom: "22%", rot: 160, scale: 0.9 },
          { right: "10%", bottom: "28%", rot: -160, scale: 0.95 },
          { left: "45%", top: "4%", rot: -4, scale: 1.2 },
        ];
        const p = positions[i % positions.length];
        return (
          <svg
            key={`b-${i}`}
            viewBox="0 0 24 48"
            className="bolt"
            style={{
              width: 44,
              height: 88,
              ...p,
              transform: `rotate(${p.rot}deg) scale(${p.scale})`,
              animationDelay: `${(i * 0.6) % 2.2}s`,
              animationDuration: `${2 + (i % 3) * 0.4}s`,
            }}
          >
            <path
              d="M14 2 L4 26 L11 26 L8 46 L22 20 L14 20 Z"
              fill="#ffffff"
              stroke={color}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        );
      })}

      {/* Orb kecil yang mengorbit robot */}
      {Array.from({ length: orbCount }).map((_, i) => (
        <span
          key={`o-${i}`}
          className="orbit-dot"
          style={
            {
              "--r": `${44 + i * 4}%`,
              color,
              background: `radial-gradient(circle, #fff 0%, ${color} 60%, transparent 100%)`,
              animationDuration: `${5 + i * 1.4}s`,
              animationDirection: i % 2 ? "reverse" : "normal",
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
