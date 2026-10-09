import React from "react";
import { AbsoluteFill, Freeze, interpolate, useCurrentFrame } from "remotion";
import { FootageSlot } from "../components/FootageSlot";
import { PANEL } from "../components/layout";
import { getClip, manifest } from "../data/manifest";
import { useMode } from "../data/mode";
import { SCENES, SLOT_PREROLL } from "../data/timeline";
import { at } from "../data/voice";
import { C, F, SAFE, clamp, easeInOut, easeOut } from "../theme";

// S08 + S09 as one continuous move. Local frame 0 = SCENES.S08.from.
const START = SCENES.S08.from;
export const AWS_ACT_FRAMES = SCENES.S08.frames + SCENES.S09.frames;

type Rect = { x: number; y: number; w: number; h: number };
const COLS = [SAFE, 432, 800, 1168, 1536];
const ROWS = [180, 430, 680];
const NW = 318;
const NH = 150;
const cell = (c: number, r: number): Rect => ({ x: COLS[c], y: ROWS[r], w: NW, h: NH });

const N = {
  web: cell(0, 0),
  apigw: cell(1, 0),
  api: cell(2, 0),
  sqs: cell(3, 0),
  db: cell(2, 1),
  agent: cell(3, 1),
  bedrock: cell(4, 1),
  timer: cell(0, 2),
  maint: cell(1, 2),
  logs: cell(4, 2),
};
const PROOF: Rect = { x: 240, y: 96, w: 1440, h: 810 };

const lerpRect = (a: Rect, b: Rect, p: number): Rect => ({
  x: a.x + (b.x - a.x) * p,
  y: a.y + (b.y - a.y) * p,
  w: a.w + (b.w - a.w) * p,
  h: a.h + (b.h - a.h) * p,
});

const ramp = (f: number, a: number, d = 12) => interpolate(f, [a, a + d], [0, 1], { ...clamp, easing: easeOut });
const L = (globalFrame: number) => globalFrame - START;

export const AwsAct: React.FC = () => {
  const frame = useCurrentFrame();
  const mode = useMode();

  // Word-synced beats (local frames).
  const tTitle = Math.min(L(at("S08", "AWS")) - 6, 22);
  const tApi = L(at("S08", "API"));
  const tLambda = L(at("S08", "Lambda"));
  const tSqs = L(at("S08", "SQS"));
  const tAgent = L(at("S08", "Strands"));
  const tBedrock = L(at("S08", "Bedrock"));
  const tTools = L(at("S08", "tools"));
  const tDb = L(at("S08", "DynamoDB"));
  const tTimer = L(at("S08", "EventBridge"));
  const tMaint = L(at("S08", "checks"));
  const tSlipped = L(at("S08", "slipped"));
  const tLogs = SCENES.S08.frames - 24;
  const tProof = L(at("S09", "here's")) - 4;
  const tRun = L(at("S09", "run", 2)) - 6;

  // 1) App frame shrinks into the web-app node.
  const morph = interpolate(frame, [0, 30], [0, 1], { ...clamp, easing: easeInOut });
  const appRect = lerpRect({ x: PANEL.x, y: PANEL.y, w: PANEL.w, h: PANEL.h }, N.web, morph);

  // 2) Proof capture grows out of the CloudWatch node.
  const grow = interpolate(frame, [tProof, tProof + 26], [0, 1], { ...clamp, easing: easeInOut });
  const proofRect = lerpRect(N.logs, PROOF, grow);
  const diagramDim = interpolate(grow, [0, 1], [1, 0.12]);
  const exit = interpolate(frame, [AWS_ACT_FRAMES - 4, AWS_ACT_FRAMES + 12], [1, 0], clamp);

  const push = interpolate(frame, [30, SCENES.S08.frames], [1, 1.025], clamp);

  return (
    <AbsoluteFill style={{ background: C.canvas, fontFamily: F.sans, opacity: exit }}>
      <div style={{ position: "absolute", inset: 0, opacity: diagramDim, scale: String(push), transformOrigin: "50% 45%" }}>
        <div
          style={{
            position: "absolute",
            left: SAFE,
            top: 44,
            display: "flex",
            alignItems: "baseline",
            gap: 18,
            opacity: ramp(frame, tTitle, 14),
          }}
        >
          <span style={{ fontFamily: F.serif, fontSize: 64, color: C.ink }}>Built on AWS</span>
          {mode === "draft" && !(manifest.facts.verified && manifest.facts.awsServices?.length) ? (
            <span style={{ fontFamily: F.mono, fontSize: 18, color: C.amber }}>draft · services pending verification</span>
          ) : null}
        </div>

        {/* Empty slots of the architecture, filled in as each service is named */}
        {Object.entries(N)
          .filter(([k]) => k !== "web")
          .map(([k, r]) => (
            <div
              key={k}
              style={{
                position: "absolute",
                left: r.x,
                top: r.y,
                width: r.w,
                height: r.h,
                borderRadius: 12,
                border: `2px dashed ${C.border}`,
                opacity: ramp(frame, 18, 24),
              }}
            />
          ))}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {/* request path */}
          <Edge pts={[[382, 255], [432, 255]]} at={tApi} />
          <Edge pts={[[750, 255], [800, 255]]} at={tLambda} />
          <Edge pts={[[1118, 255], [1168, 255]]} at={tSqs} />
          <Edge pts={[[1327, 330], [1327, 430]]} at={tAgent} />
          <Edge pts={[[1486, 505], [1536, 505]]} at={tBedrock} back={tTools} />
          <Edge pts={[[1168, 505], [1118, 505]]} at={tDb} />
          <Edge pts={[[959, 330], [959, 430]]} at={tDb + 8} />
          {/* follow-up path */}
          <Edge pts={[[382, 755], [432, 755]]} at={tMaint} amber />
          <Edge pts={[[750, 755], [959, 755], [959, 580]]} at={tSlipped} amber />
          {/* logs */}
          <Edge pts={[[1327, 580], [1327, 755], [1536, 755]]} at={tLogs} dashed />
        </svg>

        <Node r={N.apigw} at={tApi} name="API Gateway" role="HTTP API · sign-in checks" />
        <Node r={N.api} at={tLambda} name="AWS Lambda" role="Commands & reads" />
        <Node r={N.sqs} at={tSqs} name="Amazon SQS" role="Background jobs" />
        <Node r={N.agent} at={tAgent} name="Strands agent" role="on AWS Lambda" accent="teal">
          <ToolChip at={tTools} />
        </Node>
        <Node r={N.bedrock} at={tBedrock} name="Amazon Bedrock" role="Planning model" accent="amber" />
        <Node r={N.db} at={tDb} name="DynamoDB" role="Plans · revisions · audit" />
        <Node r={N.timer} at={tTimer} name="EventBridge" role="Every minute" accent="amber" />
        <Node r={N.maint} at={tMaint} name="AWS Lambda" role="Overdue follow-up" accent="amber" />
        <Node r={N.logs} at={tLogs} name="CloudWatch" role="Logs by run ID" />
      {/* The app frame from the journey, landing as the web-app node */}
        <div
          style={{
            position: "absolute",
            left: appRect.x,
            top: appRect.y,
            width: appRect.w,
            height: appRect.h,
            borderRadius: interpolate(morph, [0, 1], [18, 12]),
            overflow: "hidden",
            background: C.panel,
            border: `2px solid ${morph > 0.6 ? C.border : "transparent"}`,
            boxShadow: "0 10px 30px rgba(23,43,53,0.10)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: PANEL.w,
              height: PANEL.h,
              transformOrigin: "0 0",
              scale: String(Math.max(appRect.w / PANEL.w, appRect.h / PANEL.h)),
              opacity: interpolate(morph, [0.4, 0.9], [1, 0], clamp),
            }}
          >
            <Freeze frame={SCENES.S07.frames + SLOT_PREROLL - 1}>
              <FootageSlot shotId="S07" width={PANEL.w} height={PANEL.h} />
            </Freeze>
          </div>
          <NodeLabel name="Web app" role="AWS Amplify · Cognito" o={interpolate(morph, [0.75, 1], [0, 1], clamp)} />
        </div>
      </div>


      {/* CloudWatch proof */}
      {grow > 0 ? (
        <div
          style={{
            position: "absolute",
            left: proofRect.x,
            top: proofRect.y,
            width: proofRect.w,
            height: proofRect.h,
            borderRadius: 16,
            overflow: "hidden",
            background: C.navyDeep,
            boxShadow: "0 20px 50px rgba(23,43,53,0.22)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: PROOF.w,
              height: PROOF.h,
              transformOrigin: "0 0",
              scale: String(proofRect.w / PROOF.w),
            }}
          >
            <FootageSlot shotId="S09" width={PROOF.w} height={PROOF.h} />
          </div>
        </div>
      ) : null}
      <RunIdChip at={tRun} />
    </AbsoluteFill>
  );
};

const NodeLabel: React.FC<{ name: string; role: string; o: number }> = ({ name, role, o }) => (
  <div style={{ position: "absolute", left: 24, top: 22, right: 18, opacity: o }}>
    <div style={{ width: 36, height: 6, borderRadius: 3, background: C.ink, marginBottom: 14 }} />
    <div style={{ fontSize: 31, fontWeight: 700, color: C.ink }}>{name}</div>
    <div style={{ fontSize: 22, color: C.muted, marginTop: 4 }}>{role}</div>
  </div>
);

const Node: React.FC<{
  r: Rect;
  at: number;
  name: string;
  role: string;
  accent?: "teal" | "amber";
  children?: React.ReactNode;
}> = ({ r, at: a, name, role, accent, children }) => {
  const frame = useCurrentFrame();
  const o = ramp(frame, a - 6, 12);
  const bar = accent === "teal" ? C.teal : accent === "amber" ? C.amber : C.ink;
  // A brief highlight as the node is named.
  const glow = interpolate(frame, [a - 6, a + 4, a + 30], [0, 1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: r.x,
        top: r.y,
        width: r.w,
        height: r.h,
        borderRadius: 12,
        background: C.panel,
        border: `2px solid ${accent === "teal" ? C.teal : C.border}`,
        boxShadow: `0 10px 30px rgba(23,43,53,0.08), 0 0 0 ${6 * glow}px ${accent === "amber" ? "rgba(150,86,0,0.16)" : "rgba(20,125,120,0.16)"}`,
        opacity: o,
        translate: `0px ${interpolate(o, [0, 1], [12, 0])}px`,
      }}
    >
      <div style={{ position: "absolute", left: 24, top: 22, right: 18 }}>
        <div style={{ width: 36, height: 6, borderRadius: 3, background: bar, marginBottom: 14 }} />
        <div style={{ fontSize: 31, fontWeight: 700, color: C.ink }}>{name}</div>
        <div style={{ fontSize: 22, color: C.muted, marginTop: 4 }}>{role}</div>
      </div>
      {children}
    </div>
  );
};

const ToolChip: React.FC<{ at: number }> = ({ at: a }) => {
  const frame = useCurrentFrame();
  const o = ramp(frame, a - 6, 10);
  return (
    <div
      style={{
        position: "absolute",
        left: 24,
        bottom: -22,
        padding: "6px 14px",
        borderRadius: 999,
        background: C.teal,
        color: "#fff",
        fontSize: 20,
        fontWeight: 600,
        opacity: o,
        scale: String(interpolate(o, [0, 1], [0.8, 1])),
      }}
    >
      + scheduling tools
    </div>
  );
};

/** Connector that draws itself while a pulse travels along it; optional return pulse. */
const Edge: React.FC<{ pts: number[][]; at: number; back?: number; amber?: boolean; dashed?: boolean }> = ({
  pts,
  at: a,
  back,
  amber,
  dashed,
}) => {
  const frame = useCurrentFrame();
  const DUR = 16;
  const p = interpolate(frame, [a - 8, a - 8 + DUR], [0, 1], { ...clamp, easing: easeInOut });
  if (p <= 0) return null;
  const color = amber ? C.amber : C.ink;
  const d = pts.map((pt, i) => `${i ? "L" : "M"} ${pt[0]} ${pt[1]}`).join(" ");
  const pulseColor = amber ? C.amber : C.teal;
  const pulse = (t: number) => {
    // point along polyline at fraction t
    const segs = pts.slice(1).map((pt, i) => Math.hypot(pt[0] - pts[i][0], pt[1] - pts[i][1]));
    let dist = t * segs.reduce((s, x) => s + x, 0);
    for (let i = 0; i < segs.length; i++) {
      if (dist <= segs[i] || i === segs.length - 1) {
        const k = segs[i] ? Math.min(1, dist / segs[i]) : 0;
        return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
      }
      dist -= segs[i];
    }
    return pts[pts.length - 1];
  };
  const fwd = p < 1 ? pulse(p) : null;
  const bp = back === undefined ? 0 : interpolate(frame, [back - 8, back - 8 + DUR], [0, 1], { ...clamp, easing: easeInOut });
  const ret = bp > 0 && bp < 1 ? pulse(1 - bp) : null;
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={3}
        opacity={dashed ? p : 1}
        pathLength={dashed ? undefined : 1}
        strokeDasharray={dashed ? "8 8" : 1}
        strokeDashoffset={dashed ? 0 : 1 - p}
      />
      {fwd ? <circle cx={fwd[0]} cy={fwd[1]} r={9} fill={pulseColor} /> : null}
      {ret ? <circle cx={ret[0]} cy={ret[1]} r={9} fill={C.amber} /> : null}
    </g>
  );
};

const RunIdChip: React.FC<{ at: number }> = ({ at: a }) => {
  const frame = useCurrentFrame();
  const o = ramp(frame, a, 10);
  const runId = getClip("S09")?.runId;
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: PROOF.x + 28,
        top: PROOF.y + PROOF.h - 86,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 22px",
        borderRadius: 12,
        background: C.panel,
        boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
        opacity: o,
        translate: `0px ${interpolate(o, [0, 1], [14, 0])}px`,
        fontFamily: F.sans,
      }}
    >
      <span style={{ fontSize: 22, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 1.2 }}>Run ID</span>
      <span style={{ fontFamily: F.mono, fontSize: 28, fontWeight: 600, color: C.teal }}>{runId ?? "pending capture"}</span>
    </div>
  );
};

