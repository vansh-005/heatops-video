import React from "react";
import { AbsoluteFill, Series, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FootageStage } from "../components/FootageStage";
import { HeatTimeline } from "../components/HeatTimeline";
import { Callout, Chapter, Tag } from "../components/Labels";
import { C, F, SAFE, clamp, easeInOut, easeOut } from "../theme";

// 900 frames: statement (135) → real capture (525) → schedule-diff illustration (240).
const A = 135;
const B = 525;
const D = 240;

export const S04TurningPoint: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <Series>
      <Series.Sequence name="Constraint statement" durationInFrames={A} premountFor={fps}>
        <Statement />
      </Series.Sequence>
      <Series.Sequence name="Real gate correction" durationInFrames={B} premountFor={fps}>
        <FootageStage shotId="S04" length={B} index="03" title="The supervisor corrects the plan">
          <Step n={1} appearAt={0.5 * fps} dimAt={5 * fps} tone="teal">
            Edit constraint: gate opens 07:00
          </Step>
          <Step n={2} appearAt={5 * fps} dimAt={9.5 * fps} tone="amber">
            Old proposal marked Outdated
          </Step>
          <Step n={3} appearAt={9.5 * fps} dimAt={13.5 * fps} tone="ink">
            Replan with new constraints
          </Step>
          <Step n={4} appearAt={13.5 * fps} tone="teal">
            New revision, new run
          </Step>
        </FootageStage>
      </Series.Sequence>
      <Series.Sequence name="Revision illustration" durationInFrames={D} premountFor={fps}>
        <RevisionDiff />
      </Series.Sequence>
    </Series>
  );
};

const Step: React.FC<{
  n: number;
  appearAt: number;
  dimAt?: number;
  tone: "teal" | "amber" | "ink";
  children: React.ReactNode;
}> = ({ n, appearAt, dimAt, tone, children }) => (
  <Callout appearAt={appearAt} dimAt={dimAt} tone={tone} kicker={`Step ${n}`}>
    {children}
  </Callout>
);

const Statement: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const strike = interpolate(frame, [1.9 * fps, 2.3 * fps], [0, 1], { ...clamp, easing: easeOut });
  const next = interpolate(frame, [2.3 * fps, 2.8 * fps], [0, 1], { ...clamp, easing: easeOut });
  const exit = interpolate(frame, [A - 8, A], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: C.canvas, opacity: exit, fontFamily: F.sans }}>
      <Chapter index="03" title="The turning point" />
      <div
        style={{
          position: "absolute",
          left: SAFE,
          right: SAFE,
          top: 250,
          fontFamily: F.serif,
          fontSize: 80,
          lineHeight: 1.1,
          color: C.ink,
          opacity: interpolate(frame, [6, 22], [0, 1], { ...clamp, easing: easeOut }),
          translate: `0px ${interpolate(frame, [6, 22], [16, 0], { ...clamp, easing: easeOut })}px`,
        }}
      >
        The supervisor knows something
        <br />
        the forecast doesn't.
      </div>
      <div
        style={{
          position: "absolute",
          left: SAFE,
          top: 560,
          display: "flex",
          alignItems: "center",
          gap: 36,
          opacity: interpolate(frame, [1.2 * fps, 1.6 * fps], [0, 1], { ...clamp, easing: easeOut }),
        }}
      >
        <span style={{ fontSize: 44, fontWeight: 600, color: C.muted }}>Gate opens</span>
        <span style={{ position: "relative", fontFamily: F.mono, fontSize: 96, fontWeight: 600, color: C.muted }}>
          06:00
          <span
            style={{
              position: "absolute",
              left: -6,
              top: "52%",
              height: 8,
              width: `${strike * 108}%`,
              background: C.red,
              borderRadius: 4,
            }}
          />
        </span>
        <span style={{ fontSize: 64, color: C.muted, opacity: next }}>→</span>
        <span
          style={{
            fontFamily: F.mono,
            fontSize: 112,
            fontWeight: 600,
            color: C.teal,
            opacity: next,
            translate: `${interpolate(next, [0, 1], [-24, 0])}px 0px`,
          }}
        >
          07:00
        </span>
      </div>
    </AbsoluteFill>
  );
};

const RevisionDiff: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exit = interpolate(frame, [D - 8, D], [1, 0], clamp);
  const residual = interpolate(frame, [4.2 * fps, 4.8 * fps], [0, 1], { ...clamp, easing: easeOut });
  return (
    <AbsoluteFill style={{ background: C.canvas, opacity: exit, fontFamily: F.sans }}>
      <Chapter index="03" title="Revision 1 → Revision 2" />
      <Tag tone="muted" style={{ position: "absolute", right: SAFE, top: 36 }}>
        Illustration of the revised schedule · scenario values
      </Tag>
      <HeatTimeline
        x={SAFE}
        y={250}
        width={1920 - SAFE * 2}
        axisAt={-30}
        rowHeight={124}
        rows={[
          {
            label: "Crew A",
            sub: "30 workers · proposed",
            tone: "teal",
            appearAt: -30,
            moveAt: 1.2 * fps,
            blocks: [
              { start: 6, end: 9, toStart: 7, toEnd: 10 },
              { start: 9.5, end: 12.5, toStart: 10.5, toEnd: 13.5 },
            ],
          },
          {
            label: "Crew B",
            sub: "15 workers",
            tone: "ink",
            locked: true,
            appearAt: -30,
            blocks: [
              { start: 9, end: 12 },
              { start: 13, end: 16 },
            ],
          },
        ]}
        band={{ start: 13, end: 16, appearAt: -30, label: "Flagged window" }}
        overlapAt={-30}
        gateLine={{ hour: 6, toHour: 7, appearAt: -30, moveAt: 0.4 * fps }}
      />
      <div
        style={{
          position: "absolute",
          left: SAFE,
          top: 640,
          display: "flex",
          gap: 28,
          opacity: residual,
          translate: `0px ${interpolate(residual, [0, 1], [14, 0])}px`,
        }}
      >
        <Legend color={C.red} hatch>
          Still flagged: Crew A 13:00–13:30, Crew B 13:00–16:00
        </Legend>
      </div>
      <div
        style={{
          position: "absolute",
          left: SAFE,
          top: 720,
          fontSize: 34,
          color: C.muted,
          opacity: interpolate(frame, [5.4 * fps, 6 * fps], [0, 1], { ...clamp, easing: easeInOut }),
        }}
      >
        The plan follows the constraint. <span style={{ color: C.ink, fontWeight: 600 }}>Remaining exposure stays visible.</span>
      </div>
    </AbsoluteFill>
  );
};

const Legend: React.FC<{ color: string; hatch?: boolean; children: React.ReactNode }> = ({ color, hatch, children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 32, fontWeight: 600, color: C.ink }}>
    <span
      style={{
        width: 40,
        height: 28,
        borderRadius: 5,
        background: hatch ? `repeating-linear-gradient(135deg, ${color} 0 8px, #9E2626 8px 16px)` : color,
      }}
    />
    {children}
  </div>
);
