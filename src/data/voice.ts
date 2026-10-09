import timing from "./voice-timing.json";
import { FPS, SCENES, SceneId } from "./timeline";

type Word = { w: string; start: number; end: number };
type SceneVoice = { file: string; lead: number; duration: number; words: Word[] };

export const voiceTiming = timing as unknown as { engine: string; voice: string; scenes: Record<string, SceneVoice> };

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Global frame at which `word` (nth occurrence) is spoken in a scene's narration.
 * Visuals keyed to words stay in sync when the script or voice changes.
 */
export const at = (scene: SceneId, word: string, nth = 1, offsetSeconds = 0): number => {
  const sv = voiceTiming.scenes[scene];
  const base = SCENES[scene].from;
  if (sv) {
    const target = norm(word);
    let seen = 0;
    for (const w of sv.words) {
      if (norm(w.w) === target && ++seen === nth) {
        return base + Math.round((sv.lead + w.start + offsetSeconds) * FPS);
      }
    }
  }
  // Word not found (script edited without re-running `npm run voice`): fall back to scene start.
  return base + Math.round((0.5 + offsetSeconds) * FPS);
};

/** Global frame when a scene's narration ends. */
export const voiceEnd = (scene: SceneId): number => {
  const sv = voiceTiming.scenes[scene];
  const base = SCENES[scene].from;
  return sv ? base + Math.round((sv.lead + sv.duration) * FPS) : base + SCENES[scene].frames;
};
