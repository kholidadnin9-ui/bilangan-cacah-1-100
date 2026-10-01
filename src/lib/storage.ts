export interface Progress {
  unlocked: number;
  best: Record<number, { acc: number; stars: number; score: number }>;
  /** id robot yang dipilih siswa (lihat src/lib/robots.ts) */
  robot: string;
}

const KEY = "robot-bilangan-progress-v1";

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        unlocked: p.unlocked ?? 1,
        best: p.best ?? {},
        robot: typeof p.robot === "string" && p.robot ? p.robot : "biru",
      };
    }
  } catch {
    /* abaikan */
  }
  return { unlocked: 1, best: {}, robot: "biru" };
}

export function saveProgress(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* abaikan */
  }
}

export function starsFor(acc: number): number {
  if (acc >= 100) return 3;
  if (acc >= 80) return 2;
  if (acc >= 60) return 1;
  return 0;
}
