import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { manifest } from "../data/manifest";
import { useMode } from "../data/mode";
import { C, F, SAFE, clamp, easeOut } from "../theme";

const STEPS = ["Forecast", "Feasible plan", "Responsible person", "Follow-up"];

export const S10Close: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mode = useMode();
  const url = manifest.facts.appUrl;
  const fade = (a: number, d = 0.5) => interpolate(frame, [a * fps, (a + d) * fps], [0, 1], { ...clamp, easing: easeOut });

  return (
    <AbsoluteFill style={{ background: C.canvas, fontFamily: F.sans }}>
      {/* Chain of what HeatOps connects */}
      <div style={{ position: "absolute", left: SAFE, top: 150, display: "flex", alignItems: "center", gap: 22 }}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            {i > 0 ? <span style={{ fontSize: 34, color: C.muted, opacity: fade(0.3 + i * 0.45) }}>→</span> : null}
            <span
              style={{
                fontSize: 36,
                fontWeight: 600,
                color: i === 0 ? C.amber : C.ink,
                padding: "10px 20px",
                border: `2px solid ${i === 0 ? C.amber : C.border}`,
                borderRadius: 10,
                background: C.panel,
                opacity: fade(0.3 + i * 0.45),
              }}
            >
              {s}
            </span>
          </React.Fragment>
        ))}
      </div>

      <div style={{ position: "absolute", left: SAFE, top: 330, fontFamily: F.serif, fontSize: 96, lineHeight: 1.06, color: C.ink }}>
        <div style={{ opacity: fade(2.4, 0.6), translate: `0px ${interpolate(fade(2.4, 0.6), [0, 1], [18, 0])}px` }}>
          Tomorrow's heat forecast.
        </div>
        <div
          style={{
            color: C.teal,
            opacity: fade(3.2, 0.6),
            translate: `0px ${interpolate(fade(3.2, 0.6), [0, 1], [18, 0])}px`,
          }}
        >
          Tonight's action plan.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: SAFE,
          top: 640,
          display: "flex",
          alignItems: "center",
          gap: 22,
          opacity: fade(4.6),
        }}
      >
        <Wordmark />
        <span style={{ fontSize: 30, color: C.muted }}>Heat-adaptation planning prototype</span>
      </div>
      <div style={{ position: "absolute", left: SAFE, top: 740, fontSize: 28, color: C.muted, opacity: fade(5.4) }}>
        {url ? (
          <span style={{ fontFamily: F.mono, color: C.ink }}>{url}</span>
        ) : mode === "draft" ? (
          <span style={{ fontFamily: F.mono, color: C.amber }}>[app URL pending verification]</span>
        ) : null}
        <span style={{ marginLeft: url || mode === "draft" ? 28 : 0 }}>Next: validate the workflow with site supervisors.</span>
      </div>
    </AbsoluteFill>
  );
};

const Wordmark: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
    <svg width={52} height={52} viewBox="0 0 52 52">
      <rect x={2} y={2} width={48} height={48} rx={10} fill={C.ink} />
      <rect x={10} y={30} width={14} height={10} rx={2} fill={C.teal} />
      <rect x={28} y={30} width={14} height={10} rx={2} fill="#fff" />
      <rect x={10} y={12} width={32} height={10} rx={2} fill={C.amber} />
    </svg>
    <span style={{ fontSize: 52, fontWeight: 700, color: C.ink, letterSpacing: -0.5 }}>HeatOps</span>
  </div>
);
