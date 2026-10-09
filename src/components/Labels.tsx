import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, F, SAFE, clamp, easeOut } from "../theme";

const useFadeIn = (at: number, dur = 14) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: easeOut });
};

/** Pill used for honesty labels: scenario source, illustration, draft, processing. */
export const Tag: React.FC<{
  readonly children: React.ReactNode;
  readonly tone?: "amber" | "ink" | "teal" | "red" | "muted";
  readonly style?: React.CSSProperties;
  readonly appearAt?: number;
  readonly size?: number;
}> = ({ children, tone = "ink", style, appearAt = 0, size = 22 }) => {
  const o = useFadeIn(appearAt);
  const fg = { amber: C.amber, ink: C.ink, teal: C.teal, red: C.red, muted: C.muted }[tone];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 16px",
        borderRadius: 999,
        border: `2px solid ${fg}`,
        background: "rgba(255,255,255,0.92)",
        color: fg,
        fontFamily: F.sans,
        fontWeight: 600,
        fontSize: size,
        letterSpacing: 0.2,
        whiteSpace: "nowrap",
        opacity: o,
        ...style,
      }}
    >
      <span style={{ width: 10, height: 10, borderRadius: 5, background: fg }} />
      {children}
    </div>
  );
};

/** Persistent scenario badge; mirrors the app's SourceBadge copy. */
export const ScenarioBadge: React.FC<{ readonly appearAt?: number; readonly style?: React.CSSProperties }> = ({
  appearAt = 0,
  style,
}) => (
  <Tag tone="amber" appearAt={appearAt} style={style}>
    Synthetic weather scenario · Jun 1, 2026 · Asia/Kolkata
  </Tag>
);

/** Top-left chapter marker: "04 — The turning point". */
export const Chapter: React.FC<{ readonly index: string; readonly title: string; readonly appearAt?: number }> = ({
  index,
  title,
  appearAt = 0,
}) => {
  const o = useFadeIn(appearAt, 16);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE,
        top: 40,
        display: "flex",
        alignItems: "baseline",
        gap: 18,
        fontFamily: F.sans,
        opacity: o,
        translate: `${interpolate(o, [0, 1], [-12, 0])}px 0px`,
      }}
    >
      <span style={{ fontFamily: F.mono, fontSize: 24, color: C.amber, fontWeight: 600 }}>{index}</span>
      <span style={{ fontSize: 30, fontWeight: 600, color: C.ink }}>{title}</span>
    </div>
  );
};

/** Callout card for the right-hand column next to footage. */
export const Callout: React.FC<{
  readonly appearAt: number;
  readonly kicker?: string;
  readonly children: React.ReactNode;
  readonly tone?: "ink" | "amber" | "teal" | "red";
  readonly style?: React.CSSProperties;
  readonly dimAt?: number;
}> = ({ appearAt, kicker, children, tone = "ink", style, dimAt }) => {
  const frame = useCurrentFrame();
  const o = useFadeIn(appearAt, 12);
  const dim = dimAt === undefined ? 1 : interpolate(frame, [dimAt, dimAt + 12], [1, 0.42], clamp);
  const bar = { ink: C.ink, amber: C.amber, teal: C.teal, red: C.red }[tone];
  return (
    <div
      style={{
        position: "relative",
        background: C.panel,
        borderRadius: 12,
        padding: "20px 24px 22px 30px",
        boxShadow: "0 2px 0 rgba(23,43,53,0.06), 0 10px 30px rgba(23,43,53,0.08)",
        border: `1px solid ${C.border}`,
        opacity: o * dim,
        translate: `0px ${interpolate(o, [0, 1], [16, 0])}px`,
        fontFamily: F.sans,
        ...style,
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 14, bottom: 14, width: 6, borderRadius: 3, background: bar }} />
      {kicker ? (
        <div style={{ fontSize: 20, fontWeight: 600, color: bar, textTransform: "uppercase", letterSpacing: 1.4, marginBottom: 6 }}>
          {kicker}
        </div>
      ) : null}
      <div style={{ fontSize: 34, fontWeight: 600, color: C.ink, lineHeight: 1.18 }}>{children}</div>
    </div>
  );
};
