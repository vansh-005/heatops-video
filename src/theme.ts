import { Easing } from "remotion";

// Palette mirrors brief/frontend.md tokens.
export const C = {
  canvas: "#F7F5EF",
  panel: "#FFFFFF",
  ink: "#172B35",
  muted: "#56656D",
  border: "#D9DFDD",
  teal: "#147D78",
  amber: "#965600",
  amberSoft: "#F3D9A8",
  amberBand: "rgba(214, 140, 30, 0.20)",
  red: "#B83232",
  redSoft: "rgba(184, 50, 50, 0.14)",
  tealSoft: "rgba(20, 125, 120, 0.12)",
  navyDeep: "#0F1F27",
} as const;

export const F = {
  sans: "Inter, system-ui, sans-serif",
  serif: "'Source Serif 4', Georgia, serif",
  mono: "'JetBrains Mono', Consolas, monospace",
} as const;

// Responsive but restrained.
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

export const SAFE = 64;

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
