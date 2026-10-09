import React from "react";
import { useVideoConfig } from "remotion";
import { FootageStage } from "../components/FootageStage";
import { Callout } from "../components/Labels";
import { manifest } from "../data/manifest";
import { SCENES } from "../data/timeline";
import { C, F } from "../theme";

// Callout timings are scene-local and get tuned once the real capture is placed.

export const S02Overview: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = manifest.facts;
  return (
    <FootageStage shotId="S02" length={SCENES.S02.frames} index="01" title="Tonight's site plan">
      <Callout appearAt={1 * fps} kicker="Honest input" tone="amber">
        Synthetic weather scenario, labeled on every screen
      </Callout>
      <Callout appearAt={5 * fps} kicker="Baseline" tone="red">
        {f.workers} workers · {f.baselineFlaggedWorkerHours} flagged worker-hours
      </Callout>
      <Callout appearAt={9.5 * fps} kicker="What the forecast can't see" tone="ink">
        Gate time, locked tasks, crew limits
      </Callout>
    </FootageStage>
  );
};

export const S03AgentPlan: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <FootageStage shotId="S03" length={SCENES.S03.frames} index="02" title="The agent assesses">
      <Callout appearAt={1.5 * fps} kicker="Typed tool calls" tone="teal" dimAt={11 * fps}>
        Weather · site constraints · candidate schedules
      </Callout>
      <Callout appearAt={6 * fps} kicker="Computed in code" tone="ink" dimAt={11 * fps}>
        Overlap with the demo screening threshold
      </Callout>
      <Callout appearAt={11.5 * fps} kicker="First proposal" tone="amber">
        Crew A moves earlier — starting 06:00
      </Callout>
    </FootageStage>
  );
};

export const S05Comparison: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = manifest.facts;
  return (
    <FootageStage shotId="S05" length={SCENES.S05.frames} index="04" title="What changed — and what didn't">
      <MetricCard appearAt={1 * fps} />
      <Callout appearAt={6.5 * fps} kicker="Work retained" tone="teal">
        All {f.taskWorkerHours} task-hours still scheduled
      </Callout>
      <Callout appearAt={11 * fps} kicker="Still requires a decision" tone="red">
        {f.revisedFlaggedWorkerHours} flagged worker-hours remain
      </Callout>
    </FootageStage>
  );
};

export const S06ApproveAck: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <FootageStage shotId="S06" length={SCENES.S06.frames} index="05" title="Approve, assign, acknowledge">
      <Callout appearAt={1 * fps} kicker="Approval" tone="ink" dimAt={9 * fps}>
        Publishes assignments — doesn't clear flagged work
      </Callout>
      <Callout appearAt={9.5 * fps} kicker="Tasks created" tone="teal" dimAt={16 * fps}>
        Schedule notice · readiness checks · resolve remaining exposure
      </Callout>
      <Callout appearAt={16.5 * fps} kicker="Two separate states" tone="teal">
        Receipt ≠ readiness
      </Callout>
    </FootageStage>
  );
};

export const S07Overdue: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <FootageStage shotId="S07" length={SCENES.S07.frames} index="06" title="When a check is missed">
      <Callout appearAt={1 * fps} kicker="Still pending" tone="amber" dimAt={7 * fps}>
        Readiness not reported
      </Callout>
      <Callout appearAt={5 * fps} kicker="Demo clock advanced" tone="ink" dimAt={10 * fps}>
        Same evaluator, injected clock — no real hour elapsed
      </Callout>
      <Callout appearAt={10 * fps} kicker="Overdue" tone="red">
        Escalated to the operations lead
      </Callout>
    </FootageStage>
  );
};

export const S09AwsProof: React.FC = () => {
  const { fps } = useVideoConfig();
  const runId = manifest.clips.find((c) => c.shotId === "S09")?.runId;
  return (
    <FootageStage shotId="S09" length={SCENES.S09.frames} index="08" title="Deployed, with matching evidence" scenario={false}>
      <Callout appearAt={0.8 * fps} kicker="Matching run ID" tone="teal">
        <span style={{ fontFamily: F.mono, fontSize: 28 }}>{runId ?? "pending capture"}</span>
      </Callout>
      <Callout appearAt={3.5 * fps} kicker="Sanitized" tone="ink">
        No account IDs or credentials shown
      </Callout>
    </FootageStage>
  );
};

/** 135 → 60 count with fixture/verified labeling. Values come from manifest facts only. */
const MetricCard: React.FC<{ appearAt: number }> = ({ appearAt }) => {
  const f = manifest.facts;
  return (
    <Callout appearAt={appearAt} kicker="Flagged worker-hours" tone="amber">
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, fontVariantNumeric: "tabular-nums" }}>
        <span style={{ fontSize: 56, color: C.muted, textDecoration: "line-through", textDecorationThickness: 3 }}>
          {f.baselineFlaggedWorkerHours}
        </span>
        <span style={{ fontSize: 40, color: C.muted }}>→</span>
        <span style={{ fontSize: 76, fontWeight: 700, color: C.ink }}>{f.revisedFlaggedWorkerHours}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 500, color: C.muted, marginTop: 4 }}>
        {f.reductionPercentDisplay}% lower in this scenario
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 600,
          marginTop: 10,
          color: f.verified ? C.teal : C.amber,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {f.verified ? "Verified from app run" : "Expected fixture values · unverified"}
      </div>
    </Callout>
  );
};
