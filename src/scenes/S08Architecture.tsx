import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Chapter, Tag } from "../components/Labels";
import { manifest } from "../data/manifest";
import { SCENES } from "../data/timeline";
import { C, F, SAFE, clamp, easeInOut, easeOut } from "../theme";

type Box = { x: number; y: number; w: number; h: number };

const W = 380;
const H = 176;
const NODES: Record<string, Box> = {
  web: { x: SAFE, y: 190, w: W, h: H },
  api: { x: 510, y: 190, w: W, h: H },
  queue: { x: 956, y: 190, w: W, h: H },
  agent: { x: 1402, y: 190, w: 454, h: H },
  db: { x: 956, y: 470, w: W, h: H },
  timer: { x: SAFE, y: 730, w: W, h: H },
  maint: { x: 510, y: 730, w: W, h: H },
};

export const S08Architecture: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = SCENES.S08.frames;
  const exit = interpolate(frame, [len - 8, len], [1, 0], clamp);
  const verified = manifest.facts.verified && (manifest.facts.awsServices?.length ?? 0) > 0;

  return (
    <AbsoluteFill style={{ background: C.canvas, opacity: exit, fontFamily: F.sans }}>
      <Chapter index="07" title="How it runs on AWS" />
      <Tag tone={verified ? "teal" : "amber"} style={{ position: "absolute", right: SAFE, top: 36 }}>
        {verified ? "Illustration · services confirmed in deployment" : "Illustration · planned architecture, provisional"}
      </Tag>

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill={C.ink} />
          </marker>
          <marker id="arrowAmber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill={C.amber} />
          </marker>
        </defs>
        <Edge d={`M ${SAFE + W} 278 H 510`} at={1.3 * fps} />
        <Edge d={`M ${510 + W} 278 H 956`} at={2.4 * fps} />
        <Edge d={`M ${956 + W} 278 H 1402`} at={3.5 * fps} />
        <Edge d={`M 700 366 V 558 H 956`} at={5 * fps} label="read / write" lx={716} ly={470} anchor="start" />
        <Edge d={`M 1629 366 V 558 H ${956 + W}`} at={5.4 * fps} label="revisions · audit" lx={1645} ly={470} anchor="start" />
        <Edge d={`M ${SAFE + W} 818 H 510`} at={7.6 * fps} amber />
        <Edge d={`M ${510 + W} 818 H 1146 V 646`} at={8.4 * fps} amber label="find overdue checks" lx={1166} ly={770} anchor="start" />
      </svg>

      <Node box={NODES.web} at={0.6 * fps} title="Web app" detail="React · Amplify Hosting · Cognito sign-in" />
      <Node box={NODES.api} at={1.6 * fps} title="API" detail="API Gateway HTTP API · Lambda" />
      <Node box={NODES.queue} at={2.7 * fps} title="Job queue" detail="SQS + dead-letter queue" />
      <Node box={NODES.agent} at={3.8 * fps} title="Planning agent" detail="Lambda · Strands · Amazon Bedrock · typed scheduling tools" accent />
      <Node box={NODES.db} at={4.8 * fps} title="State" detail="DynamoDB · runs, revisions, tasks, audit" />
      <Node box={NODES.timer} at={7 * fps} title="Timer" detail="EventBridge rule · every minute" amber />
      <Node box={NODES.maint} at={7.8 * fps} title="Follow-up" detail="Maintenance Lambda · overdue + dispatch repair" amber />

      <div
        style={{
          position: "absolute",
          left: 1402,
          top: 740,
          width: 454,
          fontSize: 32,
          lineHeight: 1.3,
          color: C.ink,
          opacity: interpolate(frame, [9.6 * fps, 10.2 * fps], [0, 1], { ...clamp, easing: easeOut }),
        }}
      >
        <div style={{ fontWeight: 600 }}>No Lambda waits for a human.</div>
        <div style={{ color: C.muted, fontSize: 28, marginTop: 6 }}>
          Approval, acknowledgment and follow-up are separate requests or timer runs.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Node: React.FC<{ box: Box; at: number; title: string; detail: string; accent?: boolean; amber?: boolean }> = ({
  box,
  at,
  title,
  detail,
  accent,
  amber,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 12], [0, 1], { ...clamp, easing: easeOut });
  const bar = amber ? C.amber : accent ? C.teal : C.ink;
  return (
    <div
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        background: C.panel,
        border: `2px solid ${accent ? C.teal : C.border}`,
        borderRadius: 12,
        padding: "22px 26px",
        boxSizing: "border-box",
        opacity: o,
        translate: `0px ${interpolate(o, [0, 1], [14, 0])}px`,
        boxShadow: "0 8px 24px rgba(23,43,53,0.07)",
      }}
    >
      <div style={{ width: 40, height: 6, borderRadius: 3, background: bar, marginBottom: 14 }} />
      <div style={{ fontSize: 36, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 24, color: C.muted, marginTop: 6, lineHeight: 1.3 }}>{detail}</div>
    </div>
  );
};

const Edge: React.FC<{
  d: string;
  at: number;
  amber?: boolean;
  label?: string;
  lx?: number;
  ly?: number;
  anchor?: "start" | "end";
}> = ({ d, at, amber, label, lx, ly, anchor = "end" }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 14], [0, 1], { ...clamp, easing: easeInOut });
  const color = amber ? C.amber : C.ink;
  return (
    <g opacity={p > 0 ? 1 : 0}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={3}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
        markerEnd={p > 0.98 ? `url(#${amber ? "arrowAmber" : "arrow"})` : undefined}
      />
      {label ? (
        <text
          x={lx}
          y={ly}
          textAnchor={anchor}
          fontFamily="Inter"
          fontSize={22}
          fontWeight={500}
          fill={C.muted}
          opacity={p}
        >
          {label}
        </text>
      ) : null}
    </g>
  );
};
