import { SCENES } from "./timeline";
import { at, voiceTiming } from "./voice";

export type SfxCue = { name: string; src: string; frame: number; volume: number };

const S = (name: string) => `audio/sfx/${name}.wav`;

/** Sound design cues (global frames). Keyed to the same word anchors as the visuals. */
export const sfxCues = (): SfxCue[] => {
  const cues: SfxCue[] = [
    // Hand-offs between acts
    { name: "whoosh: problem -> app", src: S("whoosh"), frame: SCENES.S01.frames - 30, volume: 0.32 },
    { name: "whoosh: app -> AWS", src: S("whoosh"), frame: SCENES.S08.from - 4, volume: 0.32 },
    { name: "whoosh: proof", src: S("whoosh"), frame: at("S09", "here's") - 10, volume: 0.26 },
    // Moments in the story
    { name: "pop: heat warning", src: S("pop"), frame: at("S01", "warning") - 4, volume: 0.22 },
    { name: "tick: step 1 done", src: S("tick"), frame: SCENES.S04.from - 10, volume: 0.22 },
    { name: "tick: step 2 done", src: S("tick"), frame: SCENES.S05.from - 10, volume: 0.22 },
    { name: "tick: step 3 done", src: S("tick"), frame: SCENES.S06.from - 10, volume: 0.22 },
    { name: "tick: step 4 done", src: S("tick"), frame: SCENES.S07.from - 10, volume: 0.22 },
    { name: "tick: read", src: S("tick"), frame: at("S06", "confirms") - 4, volume: 0.16 },
    { name: "tick: ready", src: S("tick"), frame: at("S06", "reports") - 4, volume: 0.16 },
    { name: "chime: brand", src: S("chime"), frame: at("S10", "HeatOps") - 8, volume: 0.3 },
  ];
  // Architecture nodes pop in as they are named.
  for (const w of ["API", "Lambda", "SQS", "Strands", "Bedrock", "DynamoDB", "EventBridge", "checks"]) {
    cues.push({ name: `pop: ${w}`, src: S("pop"), frame: at("S08", w) - 6, volume: 0.13 });
  }
  return cues;
};

/** Music level per frame: dips under narration, rises in the gaps. */
export const musicVolume = (total: number, fps: number): Float32Array => {
  const speaking = new Uint8Array(total);
  for (const [sid, v] of Object.entries(voiceTiming.scenes)) {
    const base = SCENES[sid as keyof typeof SCENES].from / fps + v.lead;
    let s = -1;
    let e = -1;
    const mark = () => {
      for (let f = Math.floor((s - 0.15) * fps); f < Math.ceil((e + 0.25) * fps); f++) if (f >= 0 && f < total) speaking[f] = 1;
    };
    for (const w of v.words) {
      const ws = base + w.start;
      const we = base + w.end;
      if (s < 0) [s, e] = [ws, we];
      else if (ws - e > 0.8) {
        mark();
        [s, e] = [ws, we];
      } else e = we;
    }
    if (s >= 0) mark();
  }
  const UNDER = 0.1;
  const OPEN = 0.3;
  const out = new Float32Array(total);
  let level = OPEN;
  const step = (OPEN - UNDER) / 12; // ~0.4 s ramps
  for (let f = 0; f < total; f++) {
    const target = speaking[Math.min(total - 1, f + 6)] ? UNDER : OPEN; // duck slightly ahead of speech
    level = target < level ? Math.max(target, level - step) : Math.min(target, level + step * 0.6);
    out[f] = level;
  }
  return out;
};
