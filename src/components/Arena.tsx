import type { ReactNode } from "react";

/** Latar belakang "arena" dengan lingkaran, segitiga, dan titik cyan bergaya sci-fi. */
export function GeoBackground() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-80"
      fill="none"
    >
      <g className="spin-slow" style={{ transformOrigin: "200px 200px" }}>
        <circle cx="200" cy="200" r="170" stroke="#8fe9ff" strokeOpacity="0.55" strokeWidth="1.2" />
        <circle cx="200" cy="200" r="150" stroke="#8fe9ff" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="4 8" />
        <polygon points="200,30 347,285 53,285" stroke="#8fe9ff" strokeOpacity="0.45" strokeWidth="1.2" />
        <circle cx="200" cy="30" r="5" fill="#2ee6ff" />
        <circle cx="347" cy="285" r="5" fill="#2ee6ff" />
        <circle cx="53" cy="285" r="5" fill="#2ee6ff" />
      </g>
      <g className="spin-rev" style={{ transformOrigin: "200px 200px" }}>
        <circle cx="200" cy="200" r="120" stroke="#8fe9ff" strokeOpacity="0.3" strokeWidth="1" />
        <polygon points="200,370 53,115 347,115" stroke="#8fe9ff" strokeOpacity="0.25" strokeWidth="1" />
      </g>
      <circle cx="200" cy="200" r="190" stroke="#2ee6ff" strokeOpacity="0.15" strokeWidth="1" />
    </svg>
  );
}

export function ArenaShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-arena relative min-h-screen w-full overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-3 py-3 sm:px-6 sm:py-5">
        {children}
      </div>
    </div>
  );
}

export function RobotImg({
  className = "",
  floaty = true,
  src = "images/robot.png",
}: {
  className?: string;
  floaty?: boolean;
  src?: string;
}) {
  return (
    <img
      src={src}
      alt="Robot pembantu belajar"
      draggable={false}
      className={`${floaty ? "floaty" : ""} select-none object-contain ${className}`}
      style={{
        mixBlendMode: "lighten",
        WebkitMaskImage: "radial-gradient(ellipse at center, #000 52%, transparent 78%)",
        maskImage: "radial-gradient(ellipse at center, #000 52%, transparent 78%)",
      }}
    />
  );
}

export function TitleBar({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="slant bg-[#0f1013] py-2 pl-4 pr-10 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
          <h1 className="font-display text-lg font-black uppercase tracking-wide text-white sm:text-2xl">
            {children}
          </h1>
        </div>
        <div className="h-[3px] w-full bg-gradient-to-r from-[#ffd21f] via-[#ffd21f]/40 to-transparent" />
      <div className="font-display mt-1 text-[10px] font-bold tracking-[0.18em] text-slate-400 sm:text-[11px]">
        Created by: <span className="text-[#2ee6ff]">widodo guru sd</span>
      </div>
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  );
}
