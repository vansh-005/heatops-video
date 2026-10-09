// Edit skeleton (frames at 30 fps, total 5100). Story: problem -> HeatOps fixes it -> AWS -> close.
// Keep in sync with video.md and scripts/tts.py.
export const FPS = 30;
export const SCENES = {
  S01: { from: 0, frames: 660 }, // Problem: the heat day at the site (motion graphic)
  S02: { from: 660, frames: 360 }, // App: site plan vs forecast
  S03: { from: 1020, frames: 540 }, // App: agent assesses, first proposal
  S04: { from: 1560, frames: 900 }, // App: supervisor corrects gate time, replan (turning point)
  S05: { from: 2460, frames: 480 }, // App: result + remaining exposure
  S06: { from: 2940, frames: 600 }, // App: approve, assign, acknowledge
  S07: { from: 3540, frames: 420 }, // App: missed check becomes overdue
  S08: { from: 3960, frames: 660 }, // AWS architecture (motion graphic)
  S09: { from: 4620, frames: 240 }, // AWS proof: CloudWatch run
  S10: { from: 4860, frames: 240 }, // Close
} as const;
export type SceneId = keyof typeof SCENES;
export const TOTAL_FRAMES = 5100;

// App footage slots start this many frames before their scene for a crossfade.
export const SLOT_PREROLL = 20;
export const FOOTAGE_SHOTS = ["S02", "S03", "S04", "S05", "S06", "S07"] as const;
