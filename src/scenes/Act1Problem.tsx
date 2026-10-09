import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { HeatTimeline } from "../components/HeatTimeline";
import { PANEL } from "../components/layout";
import { SCENES } from "../data/timeline";
import { at } from "../data/voice";
import { C, F, SAFE, clamp, easeInOut, easeOut } from "../theme";

// Forecast feels-like temperature (°C) for the demo site, 06:00–18:00 (brief/delhi-heat-demo.json).
const FEELS = [29, 31, 33, 35, 37, 38, 39, 41, 43, 42, 39, 37, 35];
const THRESHOLD = 40;

// Timeline geometry shared by the chart, curve and worker dots.
const TL = { x: SAFE, y: 496, w: 1920 - SAFE * 2, label: 300, row: 100 };
const plotW = TL.w - TL.label;
const hx = (h: number) => TL.x + TL.label + ((h - 6) / 12) * plotW;
const CURVE = { top: 250, bottom: 470, min: 26, max: 46 };
const ty = (t: number) => CURVE.bottom - ((t - CURVE.min) / (CURVE.max - CURVE.min)) * (CURVE.bottom - CURVE.top);

const fade = (frame: number, a: number, d = 14) => interpolate(frame, [a, a + d], [0, 1], { ...clamp, easing: easeOut });

export const Act1Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const end = SCENES.S01.frames;

  // Word-synced beats (frames from scene start; S01 starts at 0).
  const tSite = at("S01", "Yamuna") - 6;
  const tWorkers = at("S01", "45") - 4;
  const tFlow = at("S01", "outdoors");
  const tCurve = at("S01", "By");
  const tPeak = at("S01", "forty-one");
  const tRed = at("S01", "half");
  const tWarn = at("S01", "warning") - 4;
  const q1 = at("S01", "change") - 4;
  const q2 = at("S01", "know") - 6;
  const q3 = at("S01", "did") - 6;

  // Hand-off: the whole scene shrinks into the app panel position.
  const morph = interpolate(frame, [end - 26, end], [0, 1], { ...clamp, easing: easeInOut });
  const s = interpolate(morph, [0, 1], [1, PANEL.w / 1920]);
  const push = interpolate(frame, [0, end - 26], [1, 1.035], clamp);

  const curveDraw = interpolate(frame, [tCurve, tCurve + 50], [0, 1], { ...clamp, easing: easeInOut });
  const path = FEELS.map((t, i) => `${i === 0 ? "M" : "L"} ${hx(6 + i).toFixed(1)} ${ty(t).toFixed(1)}`).join(" ");

  return (
    <AbsoluteFill style={{ background: C.canvas }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1920,
          height: 1080,
          transformOrigin: "0 0",
          translate: `${interpolate(morph, [0, 1], [0, PANEL.x])}px ${interpolate(morph, [0, 1], [0, PANEL.y])}px`,
          scale: String(s),
          borderRadius: interpolate(morph, [0, 1], [0, 18 / s]),
          overflow: "hidden",
          background: C.canvas,
          boxShadow: morph > 0 ? `0 18px 48px rgba(23,43,53,${0.16 * morph})` : undefined,
          opacity: interpolate(frame, [end - 8, end], [1, 0], clamp),
          fontFamily: F.sans,
        }}
      >
        <div style={{ position: "absolute", inset: 0, scale: String(push), transformOrigin: "60% 55%" }}>
          {/* Site title */}
          <div style={{ position: "absolute", left: SAFE, top: 64, opacity: fade(frame, tSite - 20, 18) }}>
            <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: 2.4, color: C.amber, textTransform: "uppercase" }}>
              Tomorrow · Sample site
            </div>
            <div
              style={{
                fontFamily: F.serif,
                fontSize: 72,
                color: C.ink,
                marginTop: 6,
                opacity: fade(frame, tSite, 16),
                translate: `0px ${interpolate(fade(frame, tSite, 16), [0, 1], [14, 0])}px`,
              }}
            >
              Yamuna Works, Delhi
            </div>
          </div>

          <HeatWarning appearAt={tWarn} />

          {/* Feels-like curve + threshold */}
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <rect
              x={hx(13)}
              y={CURVE.top - 20}
              width={hx(16) - hx(13)}
              height={TL.y + 50 - (CURVE.top - 20)}
              fill={C.amberBand}
              opacity={fade(frame, tPeak - 6, 20)}
            />
            <line
              x1={hx(6)}
              x2={hx(18)}
              y1={ty(THRESHOLD)}
              y2={ty(THRESHOLD)}
              stroke={C.amber}
              strokeWidth={2}
              strokeDasharray="8 8"
              opacity={fade(frame, tCurve, 16) * 0.9}
            />
            <path
              d={path}
              fill="none"
              stroke={C.ink}
              strokeWidth={4}
              strokeLinejoin="round"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - curveDraw}
            />
            <text
              x={hx(6)}
              y={ty(THRESHOLD) - 14}
              fontFamily="Inter"
              fontSize={24}
              fontWeight={600}
              fill={C.amber}
              opacity={fade(frame, tCurve + 8, 16)}
            >
              Feels like 40 °C
            </text>
          </svg>
          <PeakMarker appearAt={tPeak} />

          <HeatTimeline
            x={TL.x}
            y={TL.y}
            width={TL.w}
            labelWidth={TL.label}
            rowHeight={TL.row}
            axisAt={tFlow - 20}
            rows={[
              {
                label: "Crew A",
                sub: "30 workers",
                tone: "ink",
                appearAt: tFlow + 14,
                blocks: [
                  { start: 9, end: 12 },
                  { start: 13, end: 16 },
                ],
              },
              {
                label: "Crew B",
                sub: "15 workers",
                tone: "ink",
                appearAt: tFlow + 20,
                blocks: [
                  { start: 9, end: 12 },
                  { start: 13, end: 16 },
                ],
              },
            ]}
            band={{ start: 13, end: 16, appearAt: tPeak - 6, label: "" }}
            overlapAt={tRed}
          />

          <WorkerDots appearAt={tWorkers} flowAt={tFlow} />

          {/* The three questions a forecast doesn't answer */}
          <div
            style={{
              position: "absolute",
              left: SAFE,
              top: 790,
              display: "flex",
              gap: 64,
              fontFamily: F.serif,
              fontSize: 54,
              color: C.ink,
            }}
          >
            {[
              ["What changes", q1],
              ["Who needs to know", q2],
              ["Did it happen", q3],
            ].map(([t, a]) => {
              const o = fade(frame, a as number, 12);
              return (
                <span key={t as string} style={{ opacity: o, translate: `0px ${interpolate(o, [0, 1], [16, 0])}px` }}>
                  {t}
                  <span style={{ color: C.amber }}>?</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PeakMarker: React.FC<{ appearAt: number }> = ({ appearAt }) => {
  const frame = useCurrentFrame();
  const o = fade(frame, appearAt, 12);
  const x = hx(13);
  const y = ty(41);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - 11,
          top: y - 11,
          width: 22,
          height: 22,
          borderRadius: 11,
          background: C.red,
          boxShadow: `0 0 0 ${8 * o}px rgba(184,50,50,0.18)`,
          opacity: o,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - 150,
          top: y - 108,
          width: 300,
          textAlign: "center",
          opacity: o,
          translate: `0px ${interpolate(o, [0, 1], [10, 0])}px`,
          fontFamily: F.sans,
        }}
      >
        <span style={{ fontSize: 64, fontWeight: 700, color: C.red }}>41°</span>
        <span style={{ fontSize: 26, color: C.muted, marginLeft: 8 }}>at 1 p.m.</span>
      </div>
    </>
  );
};

const HeatWarning: React.FC<{ appearAt: number }> = ({ appearAt }) => {
  const frame = useCurrentFrame();
  const o = fade(frame, appearAt, 12);
  return (
    <div
      style={{
        position: "absolute",
        right: SAFE,
        top: 78,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "18px 26px",
        borderRadius: 14,
        background: C.panel,
        border: `2px solid ${C.amber}`,
        boxShadow: "0 12px 30px rgba(23,43,53,0.12)",
        opacity: o,
        translate: `${interpolate(o, [0, 1], [40, 0])}px 0px`,
        fontFamily: F.sans,
      }}
    >
      <svg width={40} height={40} viewBox="0 0 40 40">
        <path d="M20 4 L37 34 H3 Z" fill={C.amber} />
        <rect x={18.5} y={14} width={3} height={11} rx={1.5} fill="#fff" />
        <circle cx={20} cy={29} r={2} fill="#fff" />
      </svg>
      <div>
        <div style={{ fontSize: 28, fontWeight: 700, color: C.ink }}>Heat warning for tomorrow</div>
        <div style={{ fontSize: 22, color: C.muted, marginTop: 2 }}>Delhi · peak feels-like 43 °C</div>
      </div>
    </div>
  );
};

/** 45 workers appear as dots, then flow into their crew rows on the timeline. */
const WorkerDots: React.FC<{ appearAt: number; flowAt: number }> = ({ appearAt, flowAt }) => {
  const frame = useCurrentFrame();
  const dots = [];
  for (let i = 0; i < 45; i++) {
    const col = i % 15;
    const row = Math.floor(i / 15);
    const sx = 980 + col * 44;
    const sy = 300 + row * 44;
    // Crew A = first 30 dots, Crew B = last 15; they gather at the row labels.
    const crewB = i >= 30;
    const tx = TL.x + 150 + ((i % 15) - 7) * 4;
    const ty2 = TL.y + 56 + (crewB ? TL.row : 0) + 40;
    const appear = fade(frame, appearAt + i * 0.5, 8);
    const go = interpolate(frame, [flowAt + (i % 15) * 0.6, flowAt + 18 + (i % 15) * 0.6], [0, 1], {
      ...clamp,
      easing: easeInOut,
    });
    dots.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: interpolate(go, [0, 1], [sx, tx]),
          top: interpolate(go, [0, 1], [sy, ty2]),
          width: 24,
          height: 24,
          borderRadius: 12,
          background: crewB ? C.muted : C.ink,
          opacity: appear * interpolate(go, [0.75, 1], [1, 0], clamp),
          scale: String(interpolate(appear, [0, 1], [0.4, 1]) * interpolate(go, [0, 1], [1, 0.5])),
        }}
      />,
    );
  }
  const label = fade(frame, appearAt + 10, 12) * interpolate(frame, [flowAt, flowAt + 10], [1, 0], clamp);
  return (
    <>
      {dots}
      <div style={{ position: "absolute", left: 980, top: 440, fontFamily: F.sans, opacity: label }}>
        <span style={{ fontSize: 64, fontWeight: 700, color: C.ink }}>45</span>
        <span style={{ fontSize: 30, color: C.muted, marginLeft: 14 }}>workers outdoors</span>
      </div>
    </>
  );
};
