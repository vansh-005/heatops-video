import React, { useMemo } from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { z } from "zod";
import { CaptionTrack } from "./components/CaptionTrack";
import { buildCues } from "./data/captions";
import { manifest } from "./data/manifest";
import { ModeProvider, RenderMode } from "./data/mode";
import narration from "./data/narration.json";
import { musicVolume, sfxCues } from "./data/sound";
import { SCENES, SceneId, TOTAL_FRAMES } from "./data/timeline";
import { voiceTiming } from "./data/voice";
import { Act1Problem } from "./scenes/Act1Problem";
import { AppStage, STAGE_END, STAGE_START } from "./scenes/AppStage";
import { AWS_ACT_FRAMES, AwsAct } from "./scenes/AwsAct";
import { S10Close } from "./scenes/S10Close";
import { C, F } from "./theme";

export const heatOpsSchema = z.object({
  mode: z.enum(["draft", "final"]),
});

type Props = z.infer<typeof heatOpsSchema>;

/** In-composition gate; scripts/validate-manifest.mts runs the full checks before rendering. */
const assertFinalReady = (mode: RenderMode) => {
  if (mode !== "final") return;
  const problems: string[] = [];
  if (!manifest.finalRenderAllowed) problems.push("manifest.finalRenderAllowed is false");
  if (manifest.mode !== "final") problems.push("manifest.mode is not final");
  if (!manifest.facts.verified) problems.push("facts are not verified");
  if (manifest.narration.status !== "ready" || !manifest.narration.finalApproved) problems.push("narration not approved");
  for (const c of manifest.clips) {
    if (c.status !== "ready" || !c.verified) problems.push(`${c.shotId} not ready+verified`);
  }
  if (problems.length > 0) throw new Error(`Final render blocked:\n- ${problems.join("\n- ")}`);
};

export const HeatOpsDemo: React.FC<Props> = ({ mode }) => {
  const { fps } = useVideoConfig();
  assertFinalReady(mode);
  const recorded = manifest.narration.kind === "recorded" && manifest.narration.status === "ready";
  const cues = buildCues(narration as never, SCENES, manifest.facts, fps, recorded ? null : voiceTiming.scenes);
  const music = useMemo(() => musicVolume(TOTAL_FRAMES, fps), [fps]);

  return (
    <ModeProvider mode={mode}>
      <AbsoluteFill style={{ background: C.canvas }}>
        {/* Layer order matters: each act sits above the one it hands off from. */}
        <Sequence name="Product journey (S02–S07)" from={STAGE_START} durationInFrames={STAGE_END - STAGE_START} premountFor={fps}>
          <AppStage />
        </Sequence>
        <Sequence name="Problem (S01)" from={SCENES.S01.from} durationInFrames={SCENES.S01.frames} premountFor={fps}>
          <Act1Problem />
        </Sequence>
        <Sequence name="Close (S10)" from={SCENES.S10.from} durationInFrames={SCENES.S10.frames} premountFor={fps}>
          <S10Close />
        </Sequence>
        <Sequence name="AWS (S08–S09)" from={SCENES.S08.from} durationInFrames={AWS_ACT_FRAMES + 12} premountFor={fps}>
          <AwsAct />
        </Sequence>

        {recorded ? (
          <Sequence name="Narration" from={Math.round((manifest.narration.offsetSeconds ?? 0) * fps)} premountFor={fps}>
            <Audio src={staticFile(manifest.narration.path)} />
          </Sequence>
        ) : (
          (Object.keys(voiceTiming.scenes) as SceneId[]).map((sid) => {
            const v = voiceTiming.scenes[sid];
            return (
              <Sequence
                key={sid}
                name={`Voice ${sid}`}
                from={SCENES[sid].from + Math.round(v.lead * fps)}
                durationInFrames={Math.ceil(v.duration * fps) + 6}
                premountFor={fps}
              >
                <Audio src={staticFile(v.file)} />
              </Sequence>
            );
          })
        )}

        {manifest.music?.enabled !== false ? (
          <Audio name="Music bed (original)" src={staticFile("audio/bed.mp3")} volume={(f) => music[Math.min(f, TOTAL_FRAMES - 1)]} />
        ) : null}
        {sfxCues().map((c) => (
          <Sequence key={c.name} name={c.name} from={c.frame} durationInFrames={3 * fps} premountFor={fps}>
            <Audio src={staticFile(c.src)} volume={c.volume} />
          </Sequence>
        ))}

        <CaptionTrack cues={cues} />

        {mode === "draft" ? (
          <div
            style={{
              position: "absolute",
              right: 22,
              bottom: 12,
              fontFamily: F.mono,
              fontSize: 16,
              color: C.amber,
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            DRAFT PREVIEW
          </div>
        ) : null}
      </AbsoluteFill>
    </ModeProvider>
  );
};
