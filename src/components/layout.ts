import { SAFE } from "../theme";

// Persistent app frame used across the product journey and the scene morphs into/out of it.
export const PANEL = { x: SAFE, y: 100, w: 1280, h: 720 } as const;
export const COLUMN = { x: PANEL.x + PANEL.w + 40, y: PANEL.y, w: 1920 - SAFE - (PANEL.x + PANEL.w + 40) } as const;
