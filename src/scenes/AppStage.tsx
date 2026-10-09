import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FootageSlot } from "../components/FootageSlot";
import { HeatTimeline } from "../components/HeatTimeline";
import { COLUMN, PANEL } from "../components/layout";
import { Wordmark } from "../components/Wordmark";
import { getClip, manifest } from "../data/manifest";
import { useMode } from "../data/mode";
import { FOOTAGE_SHOTS, SCENES, SLOT_PREROLL } from "../data/timeline";
import { at } from "../data/voice";
import { C, F, clamp, easeInOut, easeOut } from "../theme";

/** Global frame where the stage begins (overlaps the end of the opening's morph). */
export const STAGE_START = SCENES.S02.from - SLOT_PREROLL;
export const STAGE_END = SCENES.S08.from;

const ramp = (g: number, a: number, d = 12) => interpolate(g, [a, a + d], [0, 1], { ...clamp, easing: easeOut });

/**
 * The product journey (S02–S07) as one continuous shot: a persistent app frame whose footage
 * crossfades between captures, with a plan checklist that advances as the story does.
 */
export const AppStage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mode = useMode();
  const g = frame + STAGE_START;
  const chromeIn = ramp(g, STAGE_START + 4, 18);
  const chromeOut = interpolate(g, [STAGE_END - 22, STAGE_END - 4], [1, 0], clamp);
  const activeShot = [...FOOTAGE_SHOTS].reverse().find((s) => g >= SCENES[s].from) ?? "S02";

  return (
    <AbsoluteFill style={{ background: C.canvas, fontFamily: F.sans }}>
      {/* Product bar */}
      <div
        style={{
          position: "absolute",
          left: PANEL.x,
          top: 30,
          display: "flex",
          alignItems: "center",
          gap: 22,
          opacity: chromeIn * chromeOut,
        }}
      >
        <Wordmark size={36} />
        <span style={{ width: 2, height: 30, background: C.border }} />
        <span style={{ fontSize: 26, color: C.muted }}>Yamuna Works · plan for tomorrow</span>
      </div>

      {/* App frame */}
      <div
        style={{
          position: "absolute",
          left: PANEL.x,
          top: PANEL.y,
          width: PANEL.w,
          height: PANEL.h,
          borderRadius: 18,
          overflow: "hidden",
          background: C.navyDeep,
          boxShadow: "0 1px 0 rgba(23,43,53,0.08), 0 18px 48px rgba(23,43,53,0.16)",
        }}
      >
        {FOOTAGE_SHOTS.map((shot) => {
          const from = SCENES[shot].from - SLOT_PREROLL - STAGE_START;
          const len = SCENES[shot].frames + SLOT_PREROLL;
          return (
            <Sequence key={shot} name={`${shot} footage`} from={from} durationInFrames={len} premountFor={fps}>
              <SlotFade>
                <FootageSlot shotId={shot} width={PANEL.w} height={PANEL.h} />
              </SlotFade>
            </Sequence>
          );
        })}
        <GateOverlay g={g} />
        <RevisionOverlay g={g} />
        <ClockChip g={g} />
      </div>

      {mode === "draft" ? (
        <div
          style={{
            position: "absolute",
            left: PANEL.x,
            top: PANEL.y + PANEL.h + 12,
            fontFamily: F.mono,
            fontSize: 18,
            color: C.muted,
          }}
        >
          {getClip(activeShot)?.status === "ready"
            ? `${activeShot} · run ${getClip(activeShot)?.runId} · ${getClip(activeShot)?.verified ? "verified" : "pending verification"}`
            : `${activeShot} · draft placeholder — awaiting real capture`}
        </div>
      ) : null}

      <PlanChecklist g={g} opacity={chromeIn * chromeOut} />
    </AbsoluteFill>
  );
};

const SlotFade: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: interpolate(frame, [0, SLOT_PREROLL], [0, 1], { ...clamp, easing: easeInOut }) }}>
      {children}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- plan checklist

type Detail =
  | { kind: "text"; text: string; at: number; tone?: "ink" | "teal" | "amber" | "red" }
  | { kind: "chips"; at: number; at2: number }
  | { kind: "metric"; at: number; at2: number; at3: number };

type Item = { title: string; from: number; to: number; details: Detail[] };

const buildItems = (): Item[] => {
  const f = manifest.facts;
  return [
    {
      title: "Assess tomorrow",
      from: SCENES.S02.from,
      to: SCENES.S04.from,
      details: [
        { kind: "text", text: "Every crew, task and hot hour", at: at("S02", "every") },
        { kind: "text", text: "Checks forecast + constraints", at: at("S03", "pulls") },
        { kind: "text", text: "First idea: Crew A at 06:00", at: at("S03", "first"), tone: "amber" },
      ],
    },
    {
      title: "Supervisor correction",
      from: SCENES.S04.from,
      to: SCENES.S05.from,
      details: [
        { kind: "text", text: "Gate opens 07:00, not 06:00", at: at("S04", "gate") },
        { kind: "text", text: "Old plan marked outdated", at: at("S04", "outdated") },
        { kind: "text", text: "Replanned: Crew A at 07:00", at: at("S04", "now"), tone: "teal" },
        { kind: "text", text: "Remaining heat hours flagged", at: at("S04", "flagged"), tone: "red" },
      ],
    },
    {
      title: "A better plan",
      from: SCENES.S05.from,
      to: SCENES.S06.from,
      details: [
        {
          kind: "metric",
          at: at("S05", "drops"),
          at2: at("S05", String(f.taskWorkerHours)),
          at3: at("S05", "remaining"),
        },
      ],
    },
    {
      title: "Approve & assign",
      from: SCENES.S06.from,
      to: SCENES.S07.from,
      details: [
        { kind: "text", text: "Schedule notice", at: at("S06", "notice") },
        { kind: "text", text: "Water & shade checks", at: at("S06", "water") },
        { kind: "text", text: "Follow-up on remaining risk", at: at("S06", "follow-up") },
        { kind: "chips", at: at("S06", "confirms"), at2: at("S06", "reports") },
      ],
    },
    {
      title: "Follow through",
      from: SCENES.S07.from,
      to: SCENES.S08.from,
      details: [
        { kind: "text", text: "Missed check → overdue", at: at("S07", "overdue"), tone: "red" },
        { kind: "text", text: "Escalated to operations lead", at: at("S07", "operations") },
      ],
    },
  ];
};

const LINE_H = 40;
const toneColor = { ink: C.ink, teal: C.teal, amber: C.amber, red: C.red } as const;

const PlanChecklist: React.FC<{ g: number; opacity: number }> = ({ g, opacity }) => {
  const items = buildItems();
  return (
    <div style={{ position: "absolute", left: COLUMN.x, top: COLUMN.y + 4, width: COLUMN.w, opacity }}>
      <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: 2, color: C.muted, textTransform: "uppercase", marginBottom: 22 }}>
        Tomorrow's heat plan
      </div>
      {items.map((item, i) => (
        <ChecklistItem key={item.title} item={item} g={g} last={i === items.length - 1} />
      ))}
    </div>
  );
};

const ChecklistItem: React.FC<{ item: Item; g: number; last: boolean }> = ({ item, g, last }) => {
  const active = ramp(g, item.from - 6, 12);
  const done = ramp(g, item.to - 10, 12);
  const open = active * (1 - done);
  const detailH = item.details.reduce((h, d) => {
    const unit = d.kind === "metric" ? 200 : d.kind === "chips" ? 54 : LINE_H;
    return h + unit * ramp(g, d.at - 4, 10);
  }, 0);

  return (
    <div style={{ position: "relative", paddingLeft: 52, paddingBottom: last ? 0 : 22 }}>
      {/* rail */}
      {!last ? (
        <div style={{ position: "absolute", left: 15, top: 34, bottom: 0, width: 2, background: C.border }}>
          <div style={{ width: 2, height: `${done * 100}%`, background: C.teal }} />
        </div>
      ) : null}
      <StatusDot active={active} done={done} g={g} />
      <div
        style={{
          fontSize: 30,
          fontWeight: 600,
          lineHeight: "34px",
          color: interpolate(active, [0, 1], [0, 1]) > 0.5 && done < 0.5 ? C.ink : done > 0.5 ? "#3B5560" : "#9AA7AC",
        }}
      >
        {item.title}
      </div>
      <div style={{ height: (detailH + (detailH > 0 ? 10 : 0)) * open, overflow: "hidden" }}>
        <div style={{ paddingTop: 10 }}>
          {item.details.map((d, k) => (
            <DetailRow key={k} d={d} g={g} />
          ))}
        </div>
      </div>
    </div>
  );
};

const StatusDot: React.FC<{ active: number; done: number; g: number }> = ({ active, done, g }) => {
  const pulse = 0.5 + 0.5 * Math.sin(g / 9);
  return (
    <div style={{ position: "absolute", left: 0, top: 1, width: 32, height: 32 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 16,
          border: `3px solid ${active > 0.5 ? C.teal : "#C9D1CF"}`,
          background: C.canvas,
          boxShadow: active > 0.5 && done < 0.5 ? `0 0 0 ${4 + pulse * 4}px rgba(20,125,120,0.14)` : undefined,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 16,
          background: C.teal,
          scale: String(done),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={18} height={18} viewBox="0 0 18 18">
          <path d="M3 9.5 L7.2 13.5 L15 5" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

const DetailRow: React.FC<{ d: Detail; g: number }> = ({ d, g }) => {
  const o = ramp(g, d.at - 4, 10);
  const style: React.CSSProperties = { opacity: o, translate: `${interpolate(o, [0, 1], [10, 0])}px 0px` };
  if (d.kind === "text") {
    return (
      <div style={{ ...style, height: LINE_H, whiteSpace: "nowrap", fontSize: 25, color: toneColor[d.tone ?? "ink"], fontWeight: d.tone ? 600 : 500 }}>
        {d.text}
      </div>
    );
  }
  if (d.kind === "chips") {
    const second = ramp(g, d.at2 - 4, 10);
    return (
      <div style={{ ...style, height: 54, display: "flex", alignItems: "center", gap: 12 }}>
        <Chip on={o}>Read</Chip>
        <span style={{ color: C.muted, fontSize: 22 }}>then</span>
        <Chip on={second}>Ready</Chip>
      </div>
    );
  }
  return <MetricBlock d={d} g={g} />;
};

const Chip: React.FC<{ on: number; children: React.ReactNode }> = ({ on, children }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 14px",
      borderRadius: 999,
      fontSize: 22,
      fontWeight: 600,
      color: on > 0.5 ? "#fff" : C.muted,
      background: on > 0.5 ? C.teal : "transparent",
      border: `2px solid ${on > 0.5 ? C.teal : C.border}`,
    }}
  >
    ✓ {children}
  </span>
);

const MetricBlock: React.FC<{ d: Extract<Detail, { kind: "metric" }>; g: number }> = ({ d, g }) => {
  const mode = useMode();
  const f = manifest.facts;
  const count = interpolate(g, [d.at, d.at + 40], [f.baselineFlaggedWorkerHours, f.revisedFlaggedWorkerHours], {
    ...clamp,
    easing: easeInOut,
  });
  const o = ramp(g, d.at - 4, 10);
  return (
    <div style={{ height: 200, opacity: o }}>
      <div style={{ fontSize: 20, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.2 }}>
        Worker-hours in the heat
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, fontVariantNumeric: "tabular-nums", marginTop: 2 }}>
        <span style={{ fontSize: 40, color: C.muted, textDecoration: "line-through", textDecorationThickness: 3 }}>
          {f.baselineFlaggedWorkerHours}
        </span>
        <span style={{ fontSize: 30, color: C.muted }}>→</span>
        <span style={{ fontSize: 76, fontWeight: 700, color: C.ink, lineHeight: 1 }}>{Math.round(count)}</span>
        {mode === "draft" && !f.verified ? <span style={{ fontFamily: F.mono, fontSize: 16, color: C.amber }}>draft</span> : null}
      </div>
      <div style={{ fontSize: 25, fontWeight: 600, color: C.teal, marginTop: 10, opacity: ramp(g, d.at2 - 4, 10) }}>
        All {f.taskWorkerHours} hours of work kept
      </div>
      <div style={{ fontSize: 25, fontWeight: 600, color: C.red, marginTop: 6, opacity: ramp(g, d.at3 - 4, 10) }}>
        {f.revisedFlaggedWorkerHours} still flagged for a decision
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- overlays inside the app frame

const GateOverlay: React.FC<{ g: number }> = ({ g }) => {
  const a = at("S04", "gate") - 8;
  const b = at("S04", "change") + 24;
  const o = ramp(g, a, 12) * interpolate(g, [b, b + 12], [1, 0], clamp);
  if (o <= 0) return null;
  const strike = ramp(g, at("S04", "seven") - 6, 10);
  return (
    <>
      <AbsoluteFill style={{ background: `rgba(15,31,39,${0.42 * o})` }} />
      <div
        style={{
          position: "absolute",
          left: 40,
          bottom: 40,
          padding: "26px 36px",
          borderRadius: 16,
          background: C.panel,
          boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
          opacity: o,
          translate: `0px ${interpolate(o, [0, 1], [24, 0])}px`,
          display: "flex",
          alignItems: "center",
          gap: 30,
        }}
      >
        <span style={{ fontSize: 34, fontWeight: 600, color: C.muted }}>Gate opens</span>
        <span style={{ position: "relative", fontFamily: F.mono, fontSize: 72, fontWeight: 600, color: C.muted }}>
          06:00
          <span
            style={{
              position: "absolute",
              left: -4,
              top: "52%",
              height: 7,
              width: `${strike * 106}%`,
              background: C.red,
              borderRadius: 4,
            }}
          />
        </span>
        <span style={{ fontFamily: F.mono, fontSize: 84, fontWeight: 600, color: C.teal, opacity: strike }}>07:00</span>
      </div>
    </>
  );
};

/** The revised schedule, drawn once over the capture so the change reads at a glance. */
const RevisionOverlay: React.FC<{ g: number }> = ({ g }) => {
  const { fps } = useVideoConfig();
  const a = at("S04", "now") - 14;
  const b = SCENES.S05.from - 16;
  const o = ramp(g, a, 14) * interpolate(g, [b, b + 14], [1, 0], clamp);
  if (o <= 0) return null;
  const local = (x: number) => x - a; // HeatTimeline timings are relative to this overlay's Sequence
  return (
    <Sequence from={a - STAGE_START} name="Revision overlay" premountFor={fps}>
      <div
        style={{
          position: "absolute",
          left: 28,
          right: 28,
          bottom: 28,
          height: 350,
          borderRadius: 16,
          background: C.panel,
          boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
          opacity: o,
          translate: `0px ${interpolate(o, [0, 1], [30, 0])}px`,
        }}
      >
        <div style={{ position: "absolute", left: 28, top: 20, fontSize: 22, fontWeight: 600, color: C.muted, letterSpacing: 1.2, textTransform: "uppercase" }}>
          New plan
        </div>
        <HeatTimeline
          x={28}
          y={70}
          width={PANEL.w - 56 - 100}
          labelWidth={250}
          rowHeight={92}
          axisAt={-30}
          rows={[
            {
              label: "Crew A",
              sub: "30 workers",
              tone: "teal",
              appearAt: -30,
              moveAt: local(at("S04", "starts")),
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
          band={{ start: 13, end: 16, appearAt: -30, label: "" }}
          overlapAt={local(at("S04", "hours"))}
          gateLine={{ hour: 6, toHour: 7, appearAt: -30, moveAt: local(at("S04", "starts")) - 6 }}
        />
      </div>
    </Sequence>
  );
};

const ClockChip: React.FC<{ g: number }> = ({ g }) => {
  const a = at("S07", "HeatOps") - 10;
  const o = ramp(g, a, 10) * interpolate(g, [STAGE_END - 20, STAGE_END - 8], [1, 0], clamp);
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        right: 24,
        top: 24,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 18px",
        borderRadius: 999,
        background: "rgba(15,31,39,0.88)",
        color: "#fff",
        fontSize: 24,
        fontWeight: 600,
        opacity: o,
        fontFamily: F.sans,
      }}
    >
      <svg width={26} height={18} viewBox="0 0 26 18">
        <path d="M1 1 L12 9 L1 17 Z M13 1 L24 9 L13 17 Z" fill="#E8B04A" />
      </svg>
      Demo clock +15 min
    </div>
  );
};
