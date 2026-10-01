import { namaBilangan as nm, rand, pick, shuffle, pengecoh } from "./numbers";

export interface Question {
  key: string;
  story: boolean;
  emoji: string;
  text: string;
  /** teks besar yang ditampilkan (angka / nama bilangan / perbandingan) */
  big?: string;
  /** gambar benda untuk dihitung */
  visual?: { emoji: string; count: number };
  options: string[];
  answer: number;
  explain: string;
  speak: string;
}

export interface LevelInfo {
  no: number;
  title: string;
  goal: string;
  icon: string;
}

export const LEVELS: LevelInfo[] = [
  { no: 1, title: "Kenali Lambang", goal: "Mengenal lambang bilangan 1–50", icon: "🔢" },
  { no: 2, title: "Nama Bilangan", goal: "Membaca lambang jadi nama bilangan", icon: "🗣️" },
  { no: 3, title: "Tulis Lambang", goal: "Mengubah nama jadi lambang bilangan", icon: "✍️" },
  { no: 4, title: "Bandingkan!", goal: "Lebih besar, lebih kecil, sama dengan", icon: "⚖️" },
  { no: 5, title: "Misi Juara", goal: "Campuran semua materi 1–100", icon: "🏆" },
];

/* ------------------------------------------------------------------ */
/* Pembantu                                                            */
/* ------------------------------------------------------------------ */

const NAMES = [
  "Ahmad",
  "Umar",
  "Zaid",
  "Bilal",
  "Ali",
  "Yusuf",
  "Hasan",
  "Ibrahim",
  "Aisyah",
  "Fatimah",
  "Khadijah",
  "Salma",
  "Maryam",
  "Zainab",
  "Hafsah",
];

function two(): [string, string] {
  const s = shuffle(NAMES);
  return [s[0], s[1]];
}

type Draft = Omit<Question, "options" | "answer" | "story" | "speak" | "emoji"> & {
  story?: boolean;
  emoji?: string;
  speak?: string;
  correct: string;
  wrong: string[];
};

function make(d: Draft): Question {
  const { correct, wrong, story, emoji, speak, ...rest } = d;
  const options = shuffle([correct, ...wrong]);
  return {
    ...rest,
    story: !!story,
    emoji: emoji ?? "🤖",
    speak: speak ?? `${rest.text} ${rest.big ?? ""}`,
    options,
    answer: options.indexOf(correct),
  };
}

type Gen = (lo: number, hi: number) => Question;

function numWrong(n: number, lo: number, hi: number): string[] {
  return pengecoh(n, 2, lo, hi).map(String);
}
function nameWrong(n: number, lo: number, hi: number): string[] {
  return pengecoh(n, 2, lo, hi).map(nm);
}

function compo(n: number) {
  const t = Math.floor(n / 10);
  const s = n % 10;
  const correct = `${t} puluhan dan ${s} satuan`;
  const cands: string[] = [`${s} puluhan dan ${t} satuan`];
  if (t < 9) cands.push(`${t + 1} puluhan dan ${s} satuan`);
  if (t > 1) cands.push(`${t - 1} puluhan dan ${s} satuan`);
  if (s < 9) cands.push(`${t} puluhan dan ${s + 1} satuan`);
  if (s > 0) cands.push(`${t} puluhan dan ${s - 1} satuan`);
  const wrong = shuffle([...new Set(cands)].filter((c) => c !== correct)).slice(0, 2);
  return { t, s, correct, wrong };
}

function nonRound(lo: number, hi: number, minV = 11) {
  let n = 0;
  let g = 0;
  do {
    n = rand(Math.max(lo, minV), hi);
  } while (n % 10 === 0 && g++ < 50);
  return n;
}

/* ------------------------------------------------------------------ */
/* Soal biasa                                                          */
/* ------------------------------------------------------------------ */

const count: Gen = (lo, hi) => {
  const n = rand(Math.max(lo, 6), Math.min(hi, 40));
  const emoji = pick(["⭐", "🌙", "📖", "🕌", "🌴"]);
  return make({
    key: `count-${n}`,
    text: "Ada berapa banyak benda di bawah ini?",
    visual: { emoji, count: n },
    correct: String(n),
    wrong: numWrong(n, 1, hi),
    explain: `Jumlah bendanya ada ${n}. Dibaca "${nm(n)}".`,
    speak: "Ada berapa banyak benda di bawah ini?",
  });
};

const after: Gen = (lo, hi) => {
  const n = rand(lo, hi - 1);
  return make({
    key: `after-${n}`,
    text: "Bilangan yang ada SETELAH bilangan ini adalah ...",
    big: `${n}`,
    correct: String(n + 1),
    wrong: numWrong(n + 1, lo, hi),
    explain: `Setelah ${n} adalah ${n + 1}.`,
    speak: `Bilangan setelah ${n} adalah?`,
  });
};

const before: Gen = (lo, hi) => {
  const n = rand(lo + 1, hi);
  return make({
    key: `before-${n}`,
    text: "Bilangan yang ada SEBELUM bilangan ini adalah ...",
    big: `${n}`,
    correct: String(n - 1),
    wrong: numWrong(n - 1, lo, hi),
    explain: `Sebelum ${n} adalah ${n - 1}.`,
    speak: `Bilangan sebelum ${n} adalah?`,
  });
};

const between: Gen = (lo, hi) => {
  const a = rand(lo, hi - 2);
  return make({
    key: `between-${a}`,
    text: "Bilangan yang ada di antara dua bilangan ini adalah ...",
    big: `${a}  ·  ?  ·  ${a + 2}`,
    correct: String(a + 1),
    wrong: numWrong(a + 1, lo, hi),
    explain: `${a}, ${a + 1}, ${a + 2}. Jadi yang di tengah adalah ${a + 1}.`,
    speak: `Bilangan di antara ${a} dan ${a + 2} adalah?`,
  });
};

const placeDigit: Gen = (lo, hi) => {
  let n = 0;
  let g = 0;
  do {
    n = rand(Math.max(lo, 11), hi);
  } while ((Math.floor(n / 10) === n % 10 || n % 10 === 0) && g++ < 80);
  const t = Math.floor(n / 10);
  const s = n % 10;
  const askTens = Math.random() < 0.5;
  const digit = askTens ? t : s;
  return make({
    key: `place-${n}-${digit}`,
    text: `Pada bilangan ${n}, angka ${digit} menempati tempat ...`,
    big: `${n}`,
    correct: askTens ? "puluhan" : "satuan",
    wrong: askTens ? ["satuan", "ratusan"] : ["puluhan", "ratusan"],
    explain: `${n} = ${t} puluhan dan ${s} satuan. Angka ${digit} ada di tempat ${askTens ? "puluhan" : "satuan"}.`,
  });
};

const compositionTerbaca: Gen = (lo, hi) => {
  const n = nonRound(lo, hi);
  const c = compo(n);
  return make({
    key: `comp-${n}`,
    text: `Bilangan ${n} terdiri dari ...`,
    big: `${n}`,
    correct: c.correct,
    wrong: c.wrong,
    explain: `${n} = ${c.t} puluhan dan ${c.s} satuan.`,
    speak: `Bilangan ${n} terdiri dari?`,
  });
};

const numToName: Gen = (lo, hi) => {
  const n = rand(lo, hi);
  return make({
    key: `n2name-${n}`,
    text: "Bagaimana cara membaca bilangan ini?",
    big: `${n}`,
    correct: nm(n),
    wrong: nameWrong(n, lo, hi),
    explain: `${n} dibaca "${nm(n)}".`,
    speak: `Bagaimana cara membaca bilangan ${n}?`,
  });
};

const nameAfter: Gen = (lo, hi) => {
  const n = rand(lo, hi - 1);
  return make({
    key: `nameafter-${n}`,
    text: `Nama bilangan setelah ${n} adalah ...`,
    big: `${n} → ?`,
    correct: nm(n + 1),
    wrong: nameWrong(n + 1, lo, hi),
    explain: `Setelah ${n} adalah ${n + 1}, dibaca "${nm(n + 1)}".`,
  });
};

const nameBefore: Gen = (lo, hi) => {
  const n = rand(lo + 1, hi);
  return make({
    key: `namebefore-${n}`,
    text: `Nama bilangan sebelum ${n} adalah ...`,
    big: `? ← ${n}`,
    correct: nm(n - 1),
    wrong: nameWrong(n - 1, lo, hi),
    explain: `Sebelum ${n} adalah ${n - 1}, dibaca "${nm(n - 1)}".`,
  });
};

const compositionToName: Gen = (lo, hi) => {
  const n = nonRound(lo, hi);
  const t = Math.floor(n / 10);
  const s = n % 10;
  return make({
    key: `comp2name-${n}`,
    text: "Bilangan ini dibaca ...",
    big: `${t} puluhan + ${s} satuan`,
    correct: nm(n),
    wrong: nameWrong(n, lo, hi),
    explain: `${t} puluhan dan ${s} satuan = ${n}, dibaca "${nm(n)}".`,
  });
};

const nameToNum: Gen = (lo, hi) => {
  const n = rand(lo, hi);
  return make({
    key: `name2n-${n}`,
    text: "Lambang bilangan dari nama ini adalah ...",
    big: nm(n),
    correct: String(n),
    wrong: numWrong(n, lo, hi),
    explain: `"${nm(n)}" ditulis ${n}.`,
    speak: `Lambang bilangan dari ${nm(n)} adalah?`,
  });
};

const compositionToNum: Gen = (lo, hi) => {
  const n = nonRound(lo, hi);
  const t = Math.floor(n / 10);
  const s = n % 10;
  return make({
    key: `comp2num-${n}`,
    text: "Lambang bilangannya adalah ...",
    big: `${t} puluhan + ${s} satuan`,
    correct: String(n),
    wrong: numWrong(n, lo, hi),
    explain: `${t} puluhan = ${t * 10}, ditambah ${s} satuan = ${n}.`,
    speak: `${t} puluhan dan ${s} satuan. Lambang bilangannya adalah?`,
  });
};

const nameAfterToNum: Gen = (lo, hi) => {
  const n = rand(lo, hi - 1);
  return make({
    key: `nameafter2n-${n}`,
    text: "Lambang bilangan setelah nama bilangan ini adalah ...",
    big: nm(n),
    correct: String(n + 1),
    wrong: numWrong(n + 1, lo, hi),
    explain: `"${nm(n)}" = ${n}. Setelahnya adalah ${n + 1}.`,
  });
};

const compareSign: Gen = (lo, hi) => {
  const a = rand(lo, hi);
  const r = Math.random();
  let b = a;
  if (r >= 0.25) {
    let g = 0;
    do {
      b = Math.random() < 0.5 ? a + rand(-12, 12) : rand(lo, hi);
      g++;
    } while ((b === a || b < lo || b > hi) && g < 100);
    if (b === a) b = a === hi ? a - 1 : a + 1;
  }
  const useName = Math.random() < 0.3;
  const right = useName ? nm(b) : String(b);
  const sym = a > b ? ">" : a < b ? "<" : "=";
  const word = a > b ? "lebih besar dari" : a < b ? "lebih kecil dari" : "sama dengan";
  return make({
    key: `cmp-${a}-${b}`,
    text: "Bandingkan kedua bilangan ini. Pilih kalimat yang benar!",
    big: `${a}  ⬜  ${right}`,
    correct: `${a} ${word} ${b}`,
    wrong: ["lebih besar dari", "lebih kecil dari", "sama dengan"]
      .filter((w) => w !== word)
      .map((w) => `${a} ${w} ${b}`),
    explain: `${a} ${word} ${b}, ditulis ${a} ${sym} ${b}.`,
    speak: `Bandingkan bilangan ${a} dan ${b}`,
  });
};

function three(lo: number, hi: number): number[] {
  const set = new Set<number>();
  const near = Math.random() < 0.5;
  const base = rand(lo, hi);
  set.add(base);
  let g = 0;
  while (set.size < 3 && g++ < 200) {
    const c = near ? base + rand(-15, 15) : rand(lo, hi);
    if (c >= lo && c <= hi) set.add(c);
  }
  while (set.size < 3) set.add(rand(lo, hi));
  return [...set];
}

const biggest: Gen = (lo, hi) => {
  const t = three(lo, hi);
  const max = Math.max(...t);
  return make({
    key: `big-${[...t].sort().join("-")}`,
    text: "Manakah bilangan yang PALING BESAR?",
    correct: String(max),
    wrong: t.filter((x) => x !== max).map(String),
    explain: `Dari ${t.join(", ")}, yang paling besar adalah ${max}.`,
  });
};

const smallest: Gen = (lo, hi) => {
  const t = three(lo, hi);
  const min = Math.min(...t);
  return make({
    key: `small-${[...t].sort().join("-")}`,
    text: "Manakah bilangan yang PALING KECIL?",
    correct: String(min),
    wrong: t.filter((x) => x !== min).map(String),
    explain: `Dari ${t.join(", ")}, yang paling kecil adalah ${min}.`,
  });
};

const greaterThan: Gen = (lo, hi) => {
  const n = rand(lo + 3, hi - 1);
  const c = rand(n + 1, Math.min(hi, n + 25));
  const pool: number[] = [];
  for (let i = Math.max(lo, n - 25); i <= n; i++) pool.push(i);
  const w = shuffle(pool).slice(0, 2);
  return make({
    key: `gt-${n}`,
    text: `Bilangan yang LEBIH BESAR dari ${n} adalah ...`,
    big: `? > ${n}`,
    correct: String(c),
    wrong: w.map(String),
    explain: `${c} lebih besar dari ${n}, ditulis ${c} > ${n}.`,
  });
};

const lessThan: Gen = (lo, hi) => {
  const n = rand(lo + 1, hi - 2);
  const c = rand(Math.max(lo, n - 25), n - 1);
  const pool: number[] = [];
  for (let i = n; i <= Math.min(hi, n + 25); i++) pool.push(i);
  const w = shuffle(pool).slice(0, 2);
  return make({
    key: `lt-${n}`,
    text: `Bilangan yang LEBIH KECIL dari ${n} adalah ...`,
    big: `? < ${n}`,
    correct: String(c),
    wrong: w.map(String),
    explain: `${c} lebih kecil dari ${n}, ditulis ${c} < ${n}.`,
  });
};

/* ------------------------------------------------------------------ */
/* Soal cerita Islami                                                  */
/* ------------------------------------------------------------------ */

const storyAfter: Gen = (lo, hi) => {
  const n = rand(lo, hi - 1);
  const [x, y] = two();
  const t = pick([
    { e: "📖", s: `${x} sedang membaca Iqra di TPQ. Ia berhenti di halaman ${n}. Besok ia membaca halaman berikutnya, yaitu halaman ...` },
    { e: "🕌", s: `Ustaz ${y} membuka Al-Qur'an terjemahan pada halaman ${n}. Halaman setelahnya adalah halaman ...` },
    { e: "🌙", s: `Ini hari ke-${n} ${x} membaca doa sebelum tidur. Besok adalah hari ke ...` },
  ]);
  return make({
    key: `s-after-${n}`,
    story: true,
    emoji: t.e,
    text: t.s,
    correct: String(n + 1),
    wrong: numWrong(n + 1, lo, hi),
    explain: `Setelah ${n} adalah ${n + 1}.`,
  });
};

const storyBefore: Gen = (lo, hi) => {
  const n = rand(lo + 1, hi);
  const [x, y] = two();
  const t = pick([
    { e: "📖", s: `${x} sedang membaca buku kisah Nabi di halaman ${n}. Halaman yang sudah dibaca sebelumnya adalah halaman ...` },
    { e: "🕋", s: `Nomor kursi ${y} di masjid adalah ${n}. Kursi sebelumnya bernomor ...` },
    { e: "🤲", s: `Pak Ustaz memanggil santri nomor urut ${n}. Santri sebelumnya bernomor urut ...` },
  ]);
  return make({
    key: `s-before-${n}`,
    story: true,
    emoji: t.e,
    text: t.s,
    correct: String(n - 1),
    wrong: numWrong(n - 1, lo, hi),
    explain: `Sebelum ${n} adalah ${n - 1}.`,
  });
};

const storyPlace: Gen = (lo, hi) => {
  const n = nonRound(lo, hi);
  const c = compo(n);
  const [x] = two();
  const t = pick([
    { e: "📖", s: `${x} menghafal ${n} ayat Al-Qur'an. Bilangan ${n} terdiri dari ...` },
    { e: "🌴", s: `${x} membeli ${n} butir kurma untuk berbuka puasa. Bilangan ${n} terdiri dari ...` },
    { e: "🕌", s: `Ada ${n} jamaah salat Magrib di masjid. Bilangan ${n} terdiri dari ...` },
  ]);
  return make({
    key: `s-place-${n}`,
    story: true,
    emoji: t.e,
    text: t.s,
    correct: c.correct,
    wrong: c.wrong,
    explain: `${n} = ${c.t} puluhan dan ${c.s} satuan.`,
  });
};

const STORY_NUM = (n: string, x: string, y: string) => [
  { e: "📖", s: `${x} menghafal ${n} ayat Al-Qur'an.` },
  { e: "🕌", s: `Di masjid ada ${n} orang yang salat berjamaah.` },
  { e: "🌴", s: `${x} membeli ${n} butir kurma untuk berbuka puasa.` },
  { e: "📚", s: `Bu Guru membagikan ${n} buku Iqra kepada santri.` },
  { e: "📿", s: `${y} membaca tasbih sebanyak ${n} kali.` },
  { e: "🌙", s: `Ustaz ${y} mengajar ${n} santri di TPQ.` },
];

const storyNumToName: Gen = (lo, hi) => {
  const n = rand(lo, hi);
  const [x, y] = two();
  const t = pick(STORY_NUM(String(n), x, y));
  return make({
    key: `s-n2name-${n}`,
    story: true,
    emoji: t.e,
    text: `${t.s} Bilangan ${n} dibaca ...`,
    correct: nm(n),
    wrong: nameWrong(n, lo, hi),
    explain: `${n} dibaca "${nm(n)}".`,
  });
};

const storyNameToNum: Gen = (lo, hi) => {
  const n = rand(lo, hi);
  const [x, y] = two();
  const t = pick(STORY_NUM(nm(n), x, y));
  return make({
    key: `s-name2n-${n}`,
    story: true,
    emoji: t.e,
    text: `${t.s} Lambang bilangannya adalah ...`,
    correct: String(n),
    wrong: numWrong(n, lo, hi),
    explain: `"${nm(n)}" ditulis ${n}.`,
  });
};

const storyCompare: Gen = (lo, hi) => {
  const [x, y] = two();
  const a = rand(lo, hi);
  let b = a;
  if (Math.random() >= 0.15) {
    let g = 0;
    do {
      b = Math.random() < 0.6 ? a + rand(-15, 15) : rand(lo, hi);
      g++;
    } while ((b === a || b < lo || b > hi) && g < 100);
    if (b === a) b = a === hi ? a - 1 : a + 1;
  }
  const more = Math.random() < 0.5;
  const t = pick([
    { e: "📖", s: `${x} menghafal ${a} ayat Al-Qur'an. ${y} menghafal ${b} ayat.`, m: "hafalannya", u: "ayat" },
    { e: "📚", s: `${x} membaca Iqra ${a} halaman. ${y} membaca ${b} halaman.`, m: "bacaannya", u: "halaman" },
    { e: "🌴", s: `Di bulan Ramadan, ${x} bersedekah ${a} butir kurma dan ${y} bersedekah ${b} butir kurma.`, m: "sedekahnya", u: "kurma" },
    { e: "🕌", s: `Di masjid, ${x} menata ${a} sajadah dan ${y} menata ${b} sajadah.`, m: "sajadahnya", u: "sajadah" },
    { e: "📿", s: `${x} berzikir ${a} kali. ${y} berzikir ${b} kali.`, m: "zikirnya", u: "kali" },
    { e: "💰", s: `${x} menabung ${a} koin untuk infak. ${y} menabung ${b} koin.`, m: "tabungannya", u: "koin" },
  ]);
  const equal = a === b;
  const winner = equal ? "Sama banyak" : (more ? a > b : a < b) ? x : y;
  return make({
    key: `s-cmp-${a}-${b}-${x}-${more}`,
    story: true,
    emoji: t.e,
    text: `${t.s} Siapa yang ${t.m} ${more ? "lebih banyak" : "lebih sedikit"}?`,
    correct: winner,
    wrong: [x, y, "Sama banyak"].filter((o) => o !== winner),
    explain: equal
      ? `${a} sama dengan ${b}, jadi sama banyak.`
      : `${a} ${a > b ? "lebih besar" : "lebih kecil"} dari ${b}, jadi ${winner} ${more ? "lebih banyak" : "lebih sedikit"}.`,
  });
};

const storyBiggest: Gen = (lo, hi) => {
  const t = three(lo, hi);
  const days = shuffle(["Senin", "Selasa", "Rabu", "Kamis", "Jumat"]).slice(0, 3);
  const most = Math.random() < 0.5;
  const target = most ? Math.max(...t) : Math.min(...t);
  const idx = t.indexOf(target);
  return make({
    key: `s-big-${t.join("-")}-${most}`,
    story: true,
    emoji: "🕌",
    text: `Jamaah salat Subuh di masjid: hari ${days[0]} ada ${t[0]} orang, hari ${days[1]} ada ${t[1]} orang, hari ${days[2]} ada ${t[2]} orang. Pada hari apa jamaahnya paling ${most ? "banyak" : "sedikit"}?`,
    correct: days[idx],
    wrong: days.filter((_, i) => i !== idx),
    explain: `${target} adalah bilangan paling ${most ? "besar" : "kecil"}, yaitu hari ${days[idx]}.`,
  });
};

/* ------------------------------------------------------------------ */
/* Konfigurasi level                                                   */
/* ------------------------------------------------------------------ */

interface Cfg {
  lo: number;
  hi: number;
  normal: Gen[];
  stories: Gen[];
  storyCount: number;
}

const CONFIG: Record<number, Cfg> = {
  1: {
    lo: 1,
    hi: 50,
    normal: [count, count, after, before, between, placeDigit, compositionTerbaca],
    stories: [storyAfter, storyBefore, storyPlace],
    storyCount: 2,
  },
  2: {
    lo: 1,
    hi: 100,
    normal: [numToName, numToName, numToName, nameAfter, nameBefore, compositionToName],
    stories: [storyNumToName],
    storyCount: 2,
  },
  3: {
    lo: 1,
    hi: 100,
    normal: [nameToNum, nameToNum, nameToNum, nameAfterToNum, compositionToNum],
    stories: [storyNameToNum],
    storyCount: 2,
  },
  4: {
    lo: 1,
    hi: 100,
    normal: [compareSign, compareSign, compareSign, biggest, smallest, greaterThan, lessThan],
    stories: [storyCompare, storyCompare, storyBiggest],
    storyCount: 2,
  },
  5: {
    lo: 1,
    hi: 100,
    normal: [
      numToName,
      nameToNum,
      compareSign,
      compareSign,
      biggest,
      smallest,
      greaterThan,
      lessThan,
      nameAfter,
      compositionToNum,
      placeDigit,
      after,
      before,
    ],
    stories: [storyNumToName, storyNameToNum, storyCompare, storyBiggest, storyAfter, storyPlace],
    storyCount: 3,
  },
};

/** Membuat 10 soal acak untuk sebuah level (sebagian berbentuk cerita Islami). */
export function buatSoalLevel(level: number): Question[] {
  const cfg = CONFIG[level];
  const storyPos = new Set(shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, cfg.storyCount));
  const used = new Set<string>();
  const result: Question[] = [];
  for (let i = 0; i < 10; i++) {
    const pool = storyPos.has(i) ? cfg.stories : cfg.normal;
    let q: Question | null = null;
    for (let tries = 0; tries < 60; tries++) {
      const cand = pick(pool)(cfg.lo, cfg.hi);
      if (!used.has(cand.key)) {
        q = cand;
        break;
      }
    }
    if (!q) q = pick(pool)(cfg.lo, cfg.hi);
    used.add(q.key);
    result.push(q);
  }
  return result;
}
