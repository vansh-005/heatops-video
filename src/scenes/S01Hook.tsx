import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { HeatTimeline } from "../components/HeatTimeline";
import { Tag } from "../components/Labels";
import { SCENES } from "../data/timeline";
import { C, F, SAFE, clamp, easeInOut, easeOut } from "../theme";

const HOOK = ["A", "heat", "warning", "doesn't", "rearrange", "a", "workday."];

export const S01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const durationInFrames = SCENES.S01.frames;

  const lift = interpolate(frame, [6.6 * fps, 7.4 * fps], [0, 1], { ...clamp, easing: easeInOut });
  const outro = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ background: C.canvas, fontFamily: F.sans, opacity: outro }}>
      {/* Kicker */}
      <div
        style={{
          position: "absolute",
          left: SAFE,
          top: 56,
          opacity: interpolate(frame, [4, 20], [0, 1], { ...clamp, easing: easeOut }),
        }}
      >
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: 2, color: C.amber, textTransform: "uppercase" }}>
          Tomorrow · 1 June
        </div>
        <div style={{ fontFamily: F.serif, fontSize: 56, color: C.ink, marginTop: 6 }}>
          Yamuna Works, Delhi
          <span style={{ fontFamily: F.sans, fontSize: 24, color: C.muted, marginLeft: 18 }}>fictional site</span>
        </div>
      </div>
      <Tag tone="amber" appearAt={10} style={{ position: "absolute", right: SAFE, top: 64 }}>
        Illustrative scenario · synthetic weather
      </Tag>

      {/* Workforce count */}
      <div
        style={{
          position: "absolute",
          right: SAFE,
          top: 150,
          textAlign: "right",
          opacity: interpolate(frame, [2 * fps, 2.6 * fps], [0, 1], { ...clamp, easing: easeOut }) * (1 - lift),
        }}
      >
        <span style={{ fontSize: 72, fontWeight: 700, color: C.ink, fontVariantNumeric: "tabular-nums" }}>
          {Math.round(interpolate(frame, [2 * fps, 3 * fps], [0, 45], { ...clamp, easing: easeOut }))}
        </span>
        <span style={{ fontSize: 32, color: C.muted, marginLeft: 14 }}>workers scheduled outdoors</span>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          translate: `0px ${interpolate(lift, [0, 1], [0, -40])}px`,
          scale: interpolate(lift, [0, 1], [1, 0.94]),
          transformOrigin: "50% 0%",
        }}
      >
        <HeatTimeline
          x={SAFE}
          y={330}
          width={1920 - SAFE * 2}
          axisAt={14}
          rowHeight={118}
          rows={[
            {
              label: "Crew A",
              sub: "30 workers · movable",
              tone: "ink",
              appearAt: 1.1 * fps,
              blocks: [
                { start: 9, end: 12 },
                { start: 13, end: 16 },
              ],
            },
            {
              label: "Crew B",
              sub: "15 workers",
              tone: "ink",
              locked: true,
              appearAt: 1.5 * fps,
              blocks: [
                { start: 9, end: 12 },
                { start: 13, end: 16 },
              ],
            },
          ]}
          band={{ start: 13, end: 16, appearAt: 3.3 * fps, label: "Forecast ≥ 40 °C feels-like" }}
          overlapAt={4.6 * fps}
        />
      </div>

      {/* Overlap annotation */}
      <div
        style={{
          position: "absolute",
          left: 1110,
          top: 660,
          fontSize: 34,
          fontWeight: 600,
          color: C.red,
          opacity:
            interpolate(frame, [5 * fps, 5.5 * fps], [0, 1], { ...clamp, easing: easeOut }) *
            interpolate(lift, [0, 1], [1, 0]),
        }}
      >
        Every afternoon block sits in the hot window
      </div>

      {/* Hook headline */}
      <div
        style={{
          position: "absolute",
          left: SAFE,
          right: SAFE,
          top: 700,
          fontFamily: F.serif,
          fontSize: 84,
          lineHeight: 1.08,
          color: C.ink,
          display: "flex",
          flexWrap: "wrap",
          columnGap: 22,
        }}
      >
        {HOOK.map((w, i) => {
          const at = 7.2 * fps + i * 3;
          const o = interpolate(frame, [at, at + 10], [0, 1], { ...clamp, easing: easeOut });
          return (
            <span key={i} style={{ opacity: o, translate: `0px ${interpolate(o, [0, 1], [18, 0])}px` }}>
              {w}
            </span>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: SAFE,
          top: 820,
          fontSize: 38,
          color: C.muted,
          opacity: interpolate(frame, [9.2 * fps, 9.8 * fps], [0, 1], { ...clamp, easing: easeOut }),
        }}
      >
        Someone still has to change the plan — <span style={{ color: C.ink, fontWeight: 600 }}>and make sure it happens.</span>
      </div>
    </AbsoluteFill>
  );
};
