// Locked edit skeleton from video.md (frames at 30 fps). Total 5100.
export const FPS = 30;
export const SCENES = {
  S01: { from: 0, frames: 360 },
  S02: { from: 360, frames: 480 },
  S03: { from: 840, frames: 600 },
  S04: { from: 1440, frames: 900 },
  S05: { from: 2340, frames: 600 },
  S06: { from: 2940, frames: 720 },
  S07: { from: 3660, frames: 480 },
  S08: { from: 4140, frames: 420 },
  S09: { from: 4560, frames: 240 },
  S10: { from: 4800, frames: 300 },
} as const;
export type SceneId = keyof typeof SCENES;
export const TOTAL_FRAMES = 5100;
