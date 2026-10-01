const SATUAN = [
  "nol",
  "satu",
  "dua",
  "tiga",
  "empat",
  "lima",
  "enam",
  "tujuh",
  "delapan",
  "sembilan",
];

/** Mengubah bilangan cacah 0–100 menjadi nama bilangan dalam bahasa Indonesia. */
export function namaBilangan(n: number): string {
  if (n < 10) return SATUAN[n];
  if (n === 10) return "sepuluh";
  if (n === 11) return "sebelas";
  if (n < 20) return `${SATUAN[n - 10]} belas`;
  if (n < 100) {
    const p = Math.floor(n / 10);
    const s = n % 10;
    return s === 0
      ? `${SATUAN[p]} puluh`
      : `${SATUAN[p]} puluh ${SATUAN[s]}`;
  }
  return "seratus";
}

export function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Menghasilkan `count` bilangan pengecoh yang mirip dengan jawaban benar. */
export function pengecoh(answer: number, count: number, min = 1, max = 100): number[] {
  const set = new Set<number>();
  const tens = Math.floor(answer / 10);
  const ones = answer % 10;
  const swapped = ones * 10 + tens;
  const candidates = [
    swapped,
    answer + 1,
    answer - 1,
    answer + 10,
    answer - 10,
    answer + 2,
    answer - 2,
    answer + 9,
    answer - 9,
  ];
  for (const c of shuffle(candidates)) {
    if (c >= min && c <= max && c !== answer && set.size < count) set.add(c);
  }
  let guard = 0;
  while (set.size < count && guard++ < 200) {
    const c = rand(min, max);
    if (c !== answer) set.add(c);
  }
  return [...set];
}
