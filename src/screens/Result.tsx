import { useEffect, useMemo } from "react";
import { ArenaShell, GeoBackground, RobotImg } from "../components/Arena";
import { RobotEffects } from "../components/Effects";
import { Gauge, Stars } from "../components/Gauge";
import { LEVELS } from "../lib/questions";
import { starsFor } from "../lib/storage";
import { sfx } from "../lib/sfx";

interface Props {
  robot: string;
  level: number;
  correct: number;
  score: number;
  onRetry: () => void;
  onNext: () => void;
  onMenu: () => void;
}

export function Result({ robot, level, correct, score, onRetry, onNext, onMenu }: Props) {
  const acc = correct * 10;
  const stars = starsFor(acc);
  const passed = acc >= 60;
  const info = LEVELS[level - 1];

  useEffect(() => {
    if (passed) sfx.win();
    else sfx.wrong();
  }, [passed]);

  const confetti = useMemo(
    () =>
      Array.from({ length: 36 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 2.5,
        dur: 3 + Math.random() * 3,
        color: ["#ffd21f", "#2ee6ff", "#22d36b", "#ff9a1f", "#8d98ee"][i % 5],
        size: 6 + Math.random() * 8,
      })),
    [],
  );

  const title =
    stars === 3 ? "Sempurna! Masya Allah!" : stars === 2 ? "Hebat sekali!" : passed ? "Bagus, kamu lulus!" : "Ayo coba lagi!";

  return (
    <ArenaShell>
      {passed &&
        confetti.map((c, i) => (
          <span
            key={i}
            className="pointer-events-none fixed top-0 z-20 rounded-sm"
            style={{
              left: `${c.left}%`,
              width: c.size,
              height: c.size * 1.6,
              background: c.color,
              animation: `confetti ${c.dur}s linear ${c.delay}s infinite`,
            }}
          />
        ))}

      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-4 text-center">
        <div>
          <div className="font-display text-xs font-extrabold tracking-[0.3em] text-[#ffd21f]">
            LEVEL {level} • {info.title.toUpperCase()}
          </div>
          <h2 className="font-display mt-1 text-2xl font-black text-white drop-shadow-[0_0_12px_rgba(46,230,255,0.6)] sm:text-4xl">
            {title}
          </h2>
        </div>

        <div className="relative flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">
          <GeoBackground />
          <RobotEffects
            color={passed ? (stars >= 2 ? "#ffd21f" : "#2ee6ff") : "#ff5252"}
            variant={passed ? "lightning" : "fire"}
            intensity={stars === 3 ? "wild" : "normal"}
          />
          <RobotImg src={robot} className="relative z-10 h-full w-full" />
        </div>

        <Stars count={stars} size={44} />

        <div className="flex flex-wrap items-center justify-center gap-6">
          <Gauge percent={acc} size={120} />
          <div className="panel rounded-md px-5 py-3 text-left">
            <div className="text-lg">
              Benar: <b className="text-[#22d36b]">{correct}</b> / 10
            </div>
            <div className="text-lg">
              Poin: <b className="text-[#2ee6ff]">{score}</b>
            </div>
            <div className="mt-1 max-w-[260px] text-sm text-slate-300">
              {passed
                ? level < 5
                  ? "Level berikutnya terbuka! 🔓"
                  : "Kamu menyelesaikan semua level! 🏆"
                : "Butuh minimal 6 benar untuk lanjut. Kamu pasti bisa!"}
            </div>
          </div>
        </div>

        <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={onMenu}
            className="slant-both bg-[#0f1013] px-6 py-3 font-display text-sm font-black tracking-widest text-slate-200 ring-1 ring-white/10 hover:text-white"
          >
            ◀ MENU
          </button>
          <button
            onClick={onRetry}
            className="btn-select slant-both font-display px-6 py-3 text-sm font-black tracking-widest text-white"
          >
            ULANGI ↻
          </button>
          {passed && level < 5 && (
            <button
              onClick={onNext}
              className="btn-gold slant-both font-display px-6 py-3 text-sm font-black tracking-widest"
            >
              LEVEL {level + 1} ▶
            </button>
          )}
        </div>
      </div>
    </ArenaShell>
  );
}
