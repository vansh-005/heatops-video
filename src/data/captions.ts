// Pure caption builder shared by the composition and scripts/export-srt.ts (Node type-stripping).
// Keep this file free of imports and non-erasable TypeScript syntax.

export type Cue = { start: number; end: number; text: string; scene: string };

type SceneWindow = { from: number; frames: number };

type NarrationDoc = {
  scenes: Record<string, string>;
  cues: Cue[] | null;
};

type FactTokens = {
  workers: number;
  baselineFlaggedWorkerHours: number;
  revisedFlaggedWorkerHours: number;
  taskWorkerHours: number;
};

const MAX_CHARS = 64;

export const fillTokens = (text: string, f: FactTokens): string =>
  text
    .replace(/\{workers\}/g, String(f.workers))
    .replace(/\{baseline\}/g, String(f.baselineFlaggedWorkerHours))
    .replace(/\{revised\}/g, String(f.revisedFlaggedWorkerHours))
    .replace(/\{taskHours\}/g, String(f.taskWorkerHours));

const chunk = (sentence: string): string[] => {
  if (sentence.length <= MAX_CHARS) return [sentence];
  // Balanced split: n roughly equal chunks, preferring breaks after punctuation.
  const words = sentence.split(" ");
  const n = Math.ceil(sentence.length / MAX_CHARS);
  const target = sentence.length / n;
  const out: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    const canBreak = out.length < n - 1 && cur.length > 0;
    const punct = /[,:;]$/.test(cur) && cur.length > target * 0.7;
    if (canBreak && (next.length > target + 8 || punct)) {
      out.push(cur);
      cur = w;
    } else {
      cur = next;
    }
  }
  if (cur) out.push(cur);
  return out;
};

export const splitText = (text: string): string[] =>
  text
    .split(/(?<=[.!?])\s+/)
    .flatMap((s) => chunk(s.trim()))
    .filter(Boolean);

export const buildCues = (
  doc: NarrationDoc,
  scenes: Record<string, SceneWindow>,
  facts: FactTokens,
  fps: number,
): Cue[] => {
  if (doc.cues && doc.cues.length > 0) {
    return doc.cues.map((c) => ({ ...c, text: fillTokens(c.text, facts) }));
  }
  const cues: Cue[] = [];
  for (const [scene, win] of Object.entries(scenes)) {
    const text = doc.scenes[scene];
    if (!text) continue;
    const parts = splitText(fillTokens(text, facts));
    const start = win.from / fps + 0.4;
    const end = (win.from + win.frames) / fps - 0.6;
    const gap = 0.2;
    const total = parts.reduce((a, p) => a + p.length, 0);
    const avail = end - start - gap * (parts.length - 1);
    let t = start;
    for (const p of parts) {
      const d = (p.length / total) * avail;
      cues.push({ start: round(t), end: round(t + d), text: p, scene });
      t += d + gap;
    }
  }
  return cues;
};

const round = (n: number) => Math.round(n * 1000) / 1000;

const ts = (s: number) => {
  const ms = Math.round(s * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  const r = ms % 1000;
  const p = (n: number, l = 2) => String(n).padStart(l, "0");
  return `${p(h)}:${p(m)}:${p(sec)},${p(r, 3)}`;
};

export const toSrt = (cues: Cue[]): string =>
  cues.map((c, i) => `${i + 1}\n${ts(c.start)} --> ${ts(c.end)}\n${c.text}\n`).join("\n");
