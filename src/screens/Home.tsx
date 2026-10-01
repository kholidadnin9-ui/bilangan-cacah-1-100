import { useState } from "react";
import { ArenaShell, GeoBackground, RobotImg, TitleBar } from "../components/Arena";
import { RobotEffects } from "../components/Effects";
import { robotName, robotSrc, robotTint } from "../lib/robots";
import { Gauge, Stars } from "../components/Gauge";
import { LEVELS } from "../lib/questions";
import { ROBOTS } from "../lib/robots";
import type { Progress } from "../lib/storage";
import { sfx } from "../lib/sfx";

interface Props {
  progress: Progress;
  robot: string;
  onPickRobot: (id: string) => void;
  sound: boolean;
  onToggleSound: () => void;
  onStart: (level: number) => void;
  initial?: number;
}

export function Home({
  progress,
  robot,
  onPickRobot,
  sound,
  onToggleSound,
  onStart,
  initial,
}: Props) {
  const [sel, setSel] = useState(initial ?? Math.min(progress.unlocked, 5));
  const lv = LEVELS[sel - 1];
  const best = progress.best[sel];
  const totalStars = Object.values(progress.best).reduce((a, b) => a + b.stars, 0);

  return (
    <ArenaShell>
      <TitleBar
        right={
          <>
            <div className="slant-both flex items-center gap-1 bg-[#0f1013] px-4 py-1.5 text-sm font-bold text-[#ffd21f] sm:text-base">
              ★ {totalStars}/15
            </div>
            <button
              onClick={onToggleSound}
              className="slant-both bg-[#0f1013] px-3 py-1.5 text-lg"
              aria-label="Suara"
            >
              {sound ? "🔊" : "🔇"}
            </button>
          </>
        }
      >
        Pilih Robot Misi
      </TitleBar>

      <div className="mt-3 grid flex-1 grid-cols-1 items-center gap-3 md:grid-cols-[1fr_1.3fr_1fr]">
        {/* Kiri: info level */}
        <div className="order-2 space-y-3 md:order-1">
          <div className="border-l-4 border-[#ffd21f] bg-[#0f1013]/80 px-3 py-2">
            <div className="font-display text-xs font-extrabold tracking-widest text-[#ffd21f]">
              LEVEL {lv.no} / 5
            </div>
            <div className="text-2xl font-bold leading-tight text-white sm:text-3xl">
              {lv.icon} {lv.title}
            </div>
            <div className="text-sm text-slate-300 sm:text-base">{lv.goal}</div>
          </div>
          <div className="flex items-center gap-4">
            <Gauge percent={best?.acc ?? 0} size={104} label="AKURASI TERBAIK" />
            <div>
              <div className="text-xs uppercase tracking-widest text-slate-400">Bintang</div>
              <Stars count={best?.stars ?? 0} size={28} />
              <div className="mt-1 text-xs text-slate-400">10 soal • 3 pilihan jawaban</div>
            </div>
          </div>
          <div className="panel rounded-md p-3 text-sm leading-snug text-slate-200">
            🎯 <b className="text-[#2ee6ff]">Misi:</b> jawab benar minimal <b>6 dari 10</b> soal
            untuk membuka level berikutnya. Ada <b className="text-[#ffd21f]">soal cerita Islami</b> di
            setiap level!
          </div>
        </div>

        {/* Tengah: robot */}
        <div className="relative order-1 mx-auto flex aspect-square w-full max-w-[420px] items-center justify-center md:order-2">
          <GeoBackground />
          <div className="absolute left-1/2 top-[6%] z-10 -translate-x-1/2 text-center">
            <div className="font-display text-[11px] font-extrabold tracking-[0.3em] text-[#2ee6ff] glow-cyan">
              BILANGAN CACAH
            </div>
            <div className="font-display text-3xl font-black text-white drop-shadow-[0_0_12px_rgba(46,230,255,0.7)] sm:text-4xl">
              1 – 100
            </div>
            <div
              className="font-display mx-auto mt-1 w-fit rounded-full px-3 py-0.5 text-[10px] font-black tracking-widest"
              style={{
                background: robotTint(robot),
                color: "#0b0c0f",
                boxShadow: `0 0 14px ${robotTint(robot)}`,
              }}
            >
              {robotName(robot).toUpperCase()}
            </div>
          </div>
          <RobotEffects color={robotTint(robot)} variant="fire" intensity="normal" />
          <RobotImg key={robot} src={robotSrc(robot)} className="relative z-10 mt-10 h-[84%] w-[84%]" />
          <div className="absolute bottom-[8%] left-1/2 z-0 h-5 w-1/2 -translate-x-1/2 rounded-[50%] bg-black/60 blur-md" />
        </div>

        {/* Pemilihan robot */}
        <div className="order-4 mx-auto w-full max-w-md rounded-md border border-white/10 bg-[#0f1013]/85 p-3 md:col-span-2 md:order-2">
          <div className="font-display mb-2 flex items-center justify-between text-[11px] font-extrabold tracking-[0.25em] text-slate-400">
            <span>PILIH ROBOT</span>
            <span className="text-[#ffd21f]">★ {ROBOTS.length} KARAKTER</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {ROBOTS.map((r) => {
              const active = r.id === robot;
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    sfx.click();
                    onPickRobot(r.id);
                  }}
                  aria-pressed={active}
                  className={`group relative flex flex-col items-center gap-1 rounded-sm border-2 px-1 pb-2 pt-1 transition ${
                    active
                      ? "bg-[#161a22]"
                      : "border-white/10 bg-[#131620] hover:border-white/30"
                  }`}
                  style={
                    active
                      ? {
                          borderColor: r.tint,
                          boxShadow: `0 0 16px ${r.tint}66`,
                        }
                      : undefined
                  }
                >
                  <img
                    src={r.src}
                    alt={r.name}
                    draggable={false}
                    className="h-14 w-full select-none object-contain"
                    style={{
                      WebkitMaskImage:
                        "radial-gradient(ellipse at center, #000 52%, transparent 78%)",
                      maskImage: "radial-gradient(ellipse at center, #000 52%, transparent 78%)",
                      opacity: active ? 1 : 0.75,
                    }}
                  />
                  <span
                    className="text-[10px] font-bold leading-tight sm:text-xs"
                    style={{ color: active ? r.tint : "#c7ccd8" }}
                  >
                    {r.name}
                  </span>
                  <span className="hidden text-[9px] leading-none text-slate-500 sm:block">
                    {r.desc}
                  </span>
                  {active && (
                    <span
                      className="font-display absolute -top-2 right-1 rounded-full px-1.5 text-[8px] font-black text-[#0b0c0f]"
                      style={{ background: r.tint }}
                    >
                      AKTIF
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Kanan: pilih level */}
        <div className="order-3 space-y-2">
          <div className="font-display text-xs font-extrabold tracking-widest text-slate-400">
            PILIH LEVEL
          </div>
          {LEVELS.map((l) => {
            const locked = l.no > progress.unlocked;
            const b = progress.best[l.no];
            const active = sel === l.no;
            return (
              <button
                key={l.no}
                disabled={locked}
                onClick={() => {
                  sfx.click();
                  setSel(l.no);
                }}
                className={`slant flex w-full items-center gap-3 px-3 py-2 pr-8 text-left transition ${
                  active
                    ? "bg-gradient-to-r from-[#1a4c5a] to-[#17262d] shadow-[inset_4px_0_0_#2ee6ff]"
                    : "bg-[#0f1013]/85 hover:bg-[#1a1d24]"
                } ${locked ? "opacity-50" : ""}`}
              >
                <span className="font-display flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#2ee6ff]/60 text-sm font-black text-[#2ee6ff]">
                  {locked ? "🔒" : l.no}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-lg font-bold leading-tight text-white">
                    {l.title}
                  </span>
                  <span className="block truncate text-xs text-slate-400">{l.goal}</span>
                </span>
                {b && b.stars > 0 && <Stars count={b.stars} size={14} />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex justify-center pb-2 md:justify-end">
        <button
          onClick={() => {
            sfx.click();
            onStart(sel);
          }}
          className="btn-select slant-both font-display pulse-glow w-full max-w-sm px-10 py-3 text-xl font-black tracking-[0.25em] text-white sm:w-auto sm:text-2xl"
        >
          MULAI ▶
        </button>
      </div>
    </ArenaShell>
  );
}
