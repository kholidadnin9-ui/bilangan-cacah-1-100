import { useState } from "react";
import { Home } from "./screens/Home";
import { Game } from "./screens/Game";
import { Result } from "./screens/Result";
import { loadProgress, saveProgress, starsFor, type Progress } from "./lib/storage";
import { robotSrc } from "./lib/robots";
import { setSound, soundOn } from "./lib/sfx";

type Screen =
  | { name: "home"; level?: number }
  | { name: "game"; level: number; run: number }
  | { name: "result"; level: number; correct: number; score: number };

export default function App() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [screen, setScreen] = useState<Screen>({ name: "home" });
  const [sound, setSoundState] = useState(soundOn);

  function toggleSound() {
    setSound(!sound);
    setSoundState(!sound);
  }

  function pickRobot(id: string) {
    const next = { ...progress, robot: id };
    setProgress(next);
    saveProgress(next);
  }

  function finish(level: number, correct: number, score: number) {
    const acc = correct * 10;
    const stars = starsFor(acc);
    const prev = progress.best[level];
    const better = !prev || acc > prev.acc || (acc === prev.acc && score > prev.score);
    const next: Progress = {
      unlocked: acc >= 60 ? Math.max(progress.unlocked, Math.min(5, level + 1)) : progress.unlocked,
      best: better ? { ...progress.best, [level]: { acc, stars, score } } : progress.best,
      robot: progress.robot,
    };
    setProgress(next);
    saveProgress(next);
    setScreen({ name: "result", level, correct, score });
  }

  if (screen.name === "game") {
    return (
      <Game
        key={`${screen.level}-${screen.run}`}
        robot={robotSrc(progress.robot)}
        level={screen.level}
        onFinish={(r) => finish(screen.level, r.correct, r.score)}
        onExit={() => setScreen({ name: "home", level: screen.level })}
      />
    );
  }

  if (screen.name === "result") {
    return (
      <Result
        robot={robotSrc(progress.robot)}
        level={screen.level}
        correct={screen.correct}
        score={screen.score}
        onRetry={() => setScreen({ name: "game", level: screen.level, run: Date.now() })}
        onNext={() => setScreen({ name: "game", level: screen.level + 1, run: Date.now() })}
        onMenu={() => setScreen({ name: "home", level: Math.min(5, screen.level) })}
      />
    );
  }

  return (
    <Home
      key={screen.level ?? "x"}
      progress={progress}
      robot={progress.robot}
      onPickRobot={pickRobot}
      sound={sound}
      onToggleSound={toggleSound}
      initial={screen.level}
      onStart={(level) => setScreen({ name: "game", level, run: Date.now() })}
    />
  );
}
