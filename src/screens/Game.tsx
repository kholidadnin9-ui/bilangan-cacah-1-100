import { useEffect, useMemo, useRef, useState } from "react";
import { ArenaShell, RobotImg } from "../components/Arena";
import { RobotEffects } from "../components/Effects";
import { buatSoalLevel, LEVELS } from "../lib/questions";
import { sfx, speak } from "../lib/sfx";

interface Props {
  robot: string;
  level: number;
  onFinish: (result: { correct: number; score: number }) => void;
  onExit: () => void;
}

const CHEERS = ["Hebat! 🎉", "Pintar sekali! ⭐", "Masya Allah, benar! 🌟", "Keren! 🚀", "Mantap! 💪"];
const OOPS = ["Tidak apa-apa, ayo coba lagi! 💙", "Hampir benar! Perhatikan ya 🧐", "Semangat terus! 🤖"];
const LETTERS = ["A", "B", "C"];

export function Game({ robot, level, onFinish, onExit }: Props) {
  const questions = useMemo(() => buatSoalLevel(level), [level]);
  const info = LEVELS[level - 1];
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState<boolean[]>([]);
  const [msg, setMsg] = useState("Ayo, kita mulai!");
  const topRef = useRef<HTMLDivElement>(null);

  const q = questions[idx];
  const answered = chosen !== null;
  const isRight = answered && chosen === q.answer;

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, [idx]);

  function choose(i: number) {
    if (answered) return;
    setChosen(i);
    const ok = i === q.answer;
    setHistory((h) => [...h, ok]);
    if (ok) {
      sfx.correct();
      const bonus = Math.min(streak, 4) * 2;
      setScore((s) => s + 10 + bonus);
      setCorrect((c) => c + 1);
      setStreak((s) => s + 1);
      setMsg(CHEERS[Math.floor(Math.random() * CHEERS.length)]);
    } else {
      sfx.wrong();
      setStreak(0);
      setMsg(OOPS[Math.floor(Math.random() * OOPS.length)]);
    }
  }

  function next() {
    sfx.click();
    if (idx >= questions.length - 1) {
      onFinish({ correct, score });
      return;
    }
    setIdx(idx + 1);
    setChosen(null);
    setMsg(`Soal ${idx + 2}, kamu pasti bisa!`);
  }

  const visual = q.visual;

  return (
    <ArenaShell>
      <div ref={topRef} />
      {/* Bar atas */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => {
            if (confirm("Keluar dari misi? Kemajuan level ini tidak disimpan.")) onExit();
          }}
          className="slant-both bg-[#0f1013] px-4 py-2 text-sm font-bold text-slate-200 hover:text-white"
        >
          ◀ Keluar
        </button>
        <div className="slant-both bg-[#0f1013] px-4 py-2">
          <span className="font-display text-xs font-extrabold tracking-widest text-[#ffd21f] sm:text-sm">
            LEVEL {level}
          </span>
          <span className="ml-2 hidden text-sm text-slate-300 sm:inline">{info.title}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {streak >= 2 && (
            <div className="pop slant-both bg-[#3a2200] px-3 py-1.5 text-sm font-bold text-[#ffb347]">
              🔥 x{streak}
            </div>
          )}
          <div className="slant-both bg-[#0f1013] px-4 py-1.5 font-display text-sm font-extrabold text-[#2ee6ff]">
            {score} <span className="text-[10px] text-slate-400">POIN</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {questions.map((_, i) => {
            const done = i < history.length;
            const ok = history[i];
            return (
              <div
                key={i}
                className={`h-3 flex-1 skew-x-[-20deg] border ${
                  done
                    ? ok
                      ? "border-[#7dffb2] bg-[#22d36b] shadow-[0_0_8px_#22d36b]"
                      : "border-[#ff8a93] bg-[#d9414d]"
                    : i === idx
                      ? "border-[#2ee6ff] bg-[#2ee6ff]/30 animate-pulse"
                      : "border-white/15 bg-white/5"
                }`}
              />
            );
          })}
        </div>
        <div className="font-display text-xs font-extrabold text-slate-300">
          {idx + 1}/{questions.length}
        </div>
      </div>

      <div className="mt-3 grid flex-1 grid-cols-1 gap-3 lg:grid-cols-[220px_1fr]">
        {/* Robot + pesan */}
        <div className="flex items-center gap-3 lg:flex-col lg:justify-center">
          <div className="relative h-24 w-24 shrink-0 lg:h-52 lg:w-52">
            <RobotEffects
              color={answered ? (isRight ? "#22d36b" : "#ff5252") : streak >= 3 ? "#ffd21f" : "#2ee6ff"}
              variant={answered && isRight ? "lightning" : "fire"}
              intensity={streak >= 3 ? "wild" : "soft"}
            />
            <RobotImg src={robot} className="relative z-10 h-full w-full" />
          </div>
          <div
            key={msg}
            className="pop relative rounded-lg border border-[#2ee6ff]/50 bg-[#0f1013]/90 px-3 py-2 text-base font-bold text-white lg:text-center"
          >
            {msg}
          </div>
        </div>

        {/* Soal */}
        <div className="flex flex-col gap-3">
          <div
            key={idx}
            className={`panel pop relative rounded-md p-4 sm:p-6 ${
              q.story ? "border-[#ffd21f]/70 shadow-[0_0_28px_rgba(255,210,31,0.18)]" : ""
            }`}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              {q.story ? (
                <span className="slant bg-gradient-to-r from-[#ffd96b] to-[#ff9a1f] py-1 pl-3 pr-8 font-display text-[11px] font-black tracking-widest text-[#3b2400]">
                  {q.emoji} CERITA ISLAMI
                </span>
              ) : (
                <span className="slant bg-[#1a4c5a] py-1 pl-3 pr-8 font-display text-[11px] font-black tracking-widest text-[#2ee6ff]">
                  SOAL {idx + 1}
                </span>
              )}
              <button
                onClick={() => speak(q.speak)}
                className="rounded-full border border-[#2ee6ff]/60 bg-[#12303a] px-3 py-1 text-sm font-bold text-[#2ee6ff] hover:bg-[#1a4c5a]"
              >
                🔊 Dengarkan
              </button>
            </div>

            <p className="text-xl font-bold leading-snug text-white sm:text-3xl">{q.text}</p>

            {q.big && (
              <div className="font-display mt-3 rounded-md bg-black/40 px-3 py-4 text-center text-4xl font-black text-[#ffd21f] drop-shadow-[0_0_12px_rgba(255,210,31,0.5)] sm:text-6xl">
                <span className={q.big.length > 14 ? "!text-2xl sm:!text-4xl" : ""}>{q.big}</span>
              </div>
            )}

            {visual && (
              <div className="mt-3 rounded-md bg-black/40 p-3">
                <div className="grid grid-cols-10 gap-1 text-lg sm:text-3xl">
                  {Array.from({ length: visual.count }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-center ${i > 0 && i % 10 === 0 ? "" : ""}`}
                    >
                      {visual.emoji}
                    </span>
                  ))}
                </div>
                <div className="mt-1 text-center text-xs text-slate-400">
                  Satu baris berisi 10 benda
                </div>
              </div>
            )}
          </div>

          {/* Pilihan */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {q.options.map((o, i) => {
              let cls = "";
              if (answered) {
                if (i === q.answer) cls = "correct";
                else if (i === chosen) cls = "wrong";
                else cls = "dim";
              }
              const long = o.length > 14;
              return (
                <button
                  key={`${idx}-${i}`}
                  disabled={answered}
                  onClick={() => choose(i)}
                  className={`opt slant-both flex min-h-[72px] items-center gap-3 rounded-sm px-4 py-3 text-left ${cls}`}
                >
                  <span className="font-display flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2ee6ff]/20 text-base font-black text-[#2ee6ff]">
                    {LETTERS[i]}
                  </span>
                  <span
                    className={`font-bold leading-tight text-white ${
                      long ? "text-lg sm:text-xl" : "font-display text-2xl sm:text-3xl"
                    }`}
                  >
                    {o}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Umpan balik */}
          {answered && (
            <div
              className={`pop flex flex-col gap-3 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between ${
                isRight
                  ? "border-[#7dffb2]/60 bg-[#10351f]/90"
                  : "border-[#ff8a93]/60 bg-[#3a1217]/90"
              }`}
            >
              <div>
                <div className="text-lg font-extrabold">
                  {isRight ? "✅ Benar!" : "❌ Belum tepat"}
                </div>
                <div className="text-base text-slate-100">{q.explain}</div>
              </div>
              <button
                onClick={next}
                className="btn-gold slant-both font-display shrink-0 px-8 py-2.5 text-base font-black tracking-widest"
              >
                {idx >= questions.length - 1 ? "SELESAI ▶" : "LANJUT ▶"}
              </button>
            </div>
          )}
        </div>
      </div>
    </ArenaShell>
  );
}
