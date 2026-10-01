let ctx: AudioContext | null = null;
export let soundOn = true;

export function setSound(v: boolean) {
  soundOn = v;
  if (!v && "speechSynthesis" in window) window.speechSynthesis.cancel();
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = "square", vol = 0.06) {
  if (!soundOn) return;
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
    }
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, ctx.currentTime + start);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
    o.connect(g).connect(ctx.destination);
    o.start(ctx.currentTime + start);
    o.stop(ctx.currentTime + start + dur + 0.02);
  } catch {
    /* abaikan */
  }
}

export const sfx = {
  correct() {
    tone(660, 0, 0.12);
    tone(880, 0.1, 0.18);
    tone(1175, 0.2, 0.22);
  },
  wrong() {
    tone(220, 0, 0.2, "sawtooth");
    tone(160, 0.18, 0.3, "sawtooth");
  },
  click() {
    tone(520, 0, 0.06, "triangle");
  },
  win() {
    [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.12, 0.22));
  },
};

export function speak(text: string) {
  if (!soundOn || !("speechSynthesis" in window)) return;
  const clean = text.replace(/\.\.\./g, " titik titik ").replace(/⬜/g, "");
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = "id-ID";
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}
