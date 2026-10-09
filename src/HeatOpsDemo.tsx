import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, Series, staticFile, useVideoConfig } from "remotion";
import { z } from "zod";
import { CaptionTrack } from "./components/CaptionTrack";
import { buildCues } from "./data/captions";
import { manifest } from "./data/manifest";
import { ModeProvider, RenderMode } from "./data/mode";
import narration from "./data/narration.json";
import scratchVoice from "./data/scratch-voice.json";
import { SCENES } from "./data/timeline";
import { S01Hook } from "./scenes/S01Hook";
import { S04TurningPoint } from "./scenes/S04TurningPoint";
import { S08Architecture } from "./scenes/S08Architecture";
import { S10Close } from "./scenes/S10Close";
import {
  S02Overview,
  S03AgentPlan,
  S05Comparison,
  S06ApproveAck,
  S07Overdue,
  S09AwsProof,
} from "./scenes/FootageScenes";
import { C, F } from "./theme";

export const heatOpsSchema = z.object({
  mode: z.enum(["draft", "final"]),
});

type Props = z.infer<typeof heatOpsSchema>;

type ScratchCue = { file: string; start: number; duration: number };

/** In-composition gate; scripts/validate-manifest.ts runs the full checks before rendering. */
const assertFinalReady = (mode: RenderMode) => {
  if (mode !== "final") return;
  const problems: string[] = [];
  if (!manifest.finalRenderAllowed) problems.push("manifest.finalRenderAllowed is false");
  if (manifest.mode !== "final") problems.push("manifest.mode is not final");
  if (!manifest.facts.verified) problems.push("facts are not verified");
  if (manifest.narration.status !== "ready" || !manifest.narration.finalApproved) problems.push("final narration missing");
  for (const c of manifest.clips) {
    if (c.status !== "ready" || !c.verified) problems.push(`${c.shotId} not ready+verified`);
  }
  if (problems.length > 0) throw new Error(`Final render blocked:\n- ${problems.join("\n- ")}`);
};

export const HeatOpsDemo: React.FC<Props> = ({ mode }) => {
  const { fps } = useVideoConfig();
  assertFinalReady(mode);
  const cues = buildCues(narration as never, SCENES, manifest.facts, fps);
  const realVoice = manifest.narration.status === "ready";

  return (
    <ModeProvider mode={mode}>
      <AbsoluteFill style={{ background: C.canvas }}>
        <Series>
          <Series.Sequence name="S01 Hook" durationInFrames={360} premountFor={fps}>
            <S01Hook />
          </Series.Sequence>
          <Series.Sequence name="S02 Site overview" durationInFrames={480} premountFor={fps}>
            <S02Overview />
          </Series.Sequence>
          <Series.Sequence name="S03 Agent plan" durationInFrames={600} premountFor={fps}>
            <S03AgentPlan />
          </Series.Sequence>
          <Series.Sequence name="S04 Turning point" durationInFrames={900} premountFor={fps}>
            <S04TurningPoint />
          </Series.Sequence>
          <Series.Sequence name="S05 Comparison" durationInFrames={600} premountFor={fps}>
            <S05Comparison />
          </Series.Sequence>
          <Series.Sequence name="S06 Approve + acknowledge" durationInFrames={720} premountFor={fps}>
            <S06ApproveAck />
          </Series.Sequence>
          <Series.Sequence name="S07 Overdue" durationInFrames={480} premountFor={fps}>
            <S07Overdue />
          </Series.Sequence>
          <Series.Sequence name="S08 Architecture" durationInFrames={420} premountFor={fps}>
            <S08Architecture />
          </Series.Sequence>
          <Series.Sequence name="S09 AWS proof" durationInFrames={240} premountFor={fps}>
            <S09AwsProof />
          </Series.Sequence>
          <Series.Sequence name="S10 Close" durationInFrames={300} premountFor={fps}>
            <S10Close />
          </Series.Sequence>
        </Series>

        {realVoice ? (
          <Sequence name="Narration" from={Math.round((manifest.narration.offsetSeconds ?? 0) * fps)} premountFor={fps}>
            <Audio src={staticFile(manifest.narration.path)} />
          </Sequence>
        ) : mode === "draft" ? (
          (scratchVoice as ScratchCue[]).map((c) => (
            <Sequence key={c.file} name="Scratch voice" from={Math.round(c.start * fps)} premountFor={fps}>
              <Audio src={staticFile(c.file)} />
            </Sequence>
          ))
        ) : null}

        <CaptionTrack cues={cues} />

        {mode === "draft" ? (
          <div
            style={{
              position: "absolute",
              right: 22,
              bottom: 14,
              fontFamily: F.mono,
              fontSize: 17,
              color: C.amber,
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            {realVoice || scratchVoice.length === 0 ? "DRAFT PREVIEW" : "DRAFT · SCRATCH TTS VOICE (TEMPORARY)"}
          </div>
        ) : null}
      </AbsoluteFill>
    </ModeProvider>
  );
};
