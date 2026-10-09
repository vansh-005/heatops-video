# Video tasks — separate from application tasks

All production tasks start pending. Owner: video agent unless stated otherwise. The application can develop in parallel with V00–V04.

- [x] **V00 — Setup and tiny render.** Verify local Node/Remotion/plugin; scaffold without overwriting brief files; pin versions. Render a 12-second opening proof. Done: actual playable MP4, no missing font/browser dependencies.
- [x] **V01 — Visual system.** Build typography, palette, title, heat bands, schedule-block animation, captions, and callout primitives. Done: opening conveys the problem immediately and is readable at 1080p.
- [x] **V02 — Complete edit skeleton.** Register HeatOpsDemo with the ten scenes/5100 frames from video.md. Use clearly visible draft slates for absent footage. Done: full-duration preview renders without requiring the app.
- [x] **V03 — Footage and data interface.** Implement asset-manifest loader, deterministic FootageSlot, source badges, trimming, and final-mode validation. Done: missing evidence passes draft mode visibly and blocks final mode.
- [~] **V04 — Architecture/end card and scratch audio.** Build provisional architecture explanation, closing treatment, and narration/caption layout. Vansh supplies scratch narration when convenient. Done: independent visuals are ready while app integration continues.
- [ ] **V05 — First real footage pass (app milestone B).** Import first real run and check crops/text size. Request specific retakes if necessary. Done: actual app replaces at least one placeholder without redesigning scenes.
- [ ] **V06 — Turning point (app milestone C).** Insert actual gate correction and replan; preserve source labels and residual exposure. Done: viewer sees cause and effect, metrics match verified data.
- [ ] **V07 — Complete proof (app milestone D).** Insert approval, receipt/readiness distinction, overdue task, and AWS evidence. Done: no final app/AWS shot uses a placeholder or fabricated interaction.
- [ ] **V08 — Final narration and captions (V06,V07).** Vansh records voice; video agent integrates, edits pauses, updates captions, and balances audio. Done: script matches actual footage and finishes comfortably in 170 seconds.
- [ ] **V09 — Final render and QA.** Validate evidence, render MP4, check actual duration, watch from start to finish with sound and muted. Done: 1080p playable H.264/AAC under 180 seconds, no black frames or placeholders; export SRT and poster.
- [ ] **V10 — Final user review/upload.** Vansh reviews narrative/claims and uploads/submits or explicitly delegates. Done only after actual link and playback check, not just a local render.

Budget: use the first 60–90 minutes for setup + opening + skeleton. Make a rough complete draft today, replacing its footage as the app becomes available. If rendering is slow, lower preview scale or concurrency; do not add cloud rendering to the hackathon critical path.

Progress log: no production tasks completed in this planning pack. Append actual commands, output files, evidence and blockers here.

### 2026-10-09 — video agent session 1

Environment: Node 24.19.0, npm 12.0.2, ffmpeg 7.1.1, Remotion 4.0.534 (exact pins in package.json and package-lock.json). The scaffold came from `create-video --blank` in a scratch directory and was copied in. No brief files were overwritten.

**V00 done.** `npm run render:opening` produced `out/draft/opening-proof.mp4`: H.264, yuv420p, bt709, 1920×1080, 30 fps, 12.000 s. It decodes cleanly with no black frames. Fonts are local OFL woff2 files loaded via @remotion/fonts, so there are no network fetches.

**V01 done.** The visual system lives in `src/theme.ts`, `components/HeatTimeline.tsx` (axis, heat band, crew blocks, red overlap hatching, shift animation, gate line), `components/Labels.tsx` (Tag, ScenarioBadge, Chapter, Callout) and `components/CaptionTrack.tsx`.

**V02 done.** `HeatOpsDemo` is 1920×1080, 30 fps, 5100 frames, with ten `Series.Sequence` scenes at the video.md lengths (also in `src/data/timeline.ts`). `npm run render:draft` produced `out/draft/heatops-draft.mp4`. The QA script measured the real file at 170.005 s, H.264 yuv420p plus AAC, no black segments, full decode OK. One silence over 4 s at 155.4 s is expected, because S09 has a single short line. Missing footage appears as hatched navy slates labeled "DRAFT · FOOTAGE PENDING" that list the required shot contents.

**V03 done.**
- `asset-manifest.json` is loaded by `src/data/manifest.ts`. Its schema is extended with optional `segments` (in/out/rate/shortened), `focus` crop keyframes and `sourceWidth`/`sourceHeight`.
- `FootageSlot` plays the trimmed segments with controlled focus zooms. It shows "Processing time shortened" or "Accelerated ×N" when the manifest marks them.
- I tested the pipeline with an ffmpeg `testsrc2` color-bar pattern placed temporarily in S02. Two segments, the zoom and the shortened label all worked. I removed the test file and restored the manifest afterwards. That pattern is not product footage.
- The final gate works in two layers, and both were checked:
  - `npm run render:final` runs `scripts/validate-manifest.mts --final` first. It exited 1 with 14 blocking issues and produced no MP4.
  - A direct `remotion render … --props video-props.json` throws "Final render blocked" inside the composition. It exited 1 with no output file.
- The validator checks: files exist, real-capture and verified flags, runId/capturedAt, trim within the ffprobe duration, footage covering the slot length, facts matching `evidence/facts.json`, reduction % recomputed, runIds present in `evidence/evidence.json`, S09 runId matching S03 or S04, narration ready and within 170 s, and captions aligned to the final audio.

**V04 partly done.**
- The architecture scene (S08) is labeled "Illustration · planned architecture, provisional" until `facts.awsServices` is verified.
- The closing card (S10) and a poster still (`HeatOpsPoster`, the closing card without captions) are built. The draft poster is `out/draft/heatops-poster-draft.png`.
- The draft narration is in `src/data/narration.json`: 315 words adapted from brief/demo.md, with metrics filled from manifest facts.
- 45 caption cues are auto-timed per scene, and `npm run captions` writes `out/draft/heatops-captions-draft.srt`.
- Scratch narration is local Windows SAPI TTS (`npm run scratch-voice`). It is flagged on screen as "DRAFT · SCRATCH TTS VOICE (TEMPORARY)" and is never used in final mode.
- Still open: Vansh's scratch reading, if he wants to check pacing with a human voice.

**Illustrative content in the draft:**
- S01: timeline with an "Illustrative scenario" tag.
- S04 statement card and the revision-diff illustration, tagged "Illustration … scenario values".
- S05 metric card, tagged "Expected fixture values · unverified".
- S08 architecture.

None of these stand in for app interactions.

**Blocked on the app/Vansh:** every real capture S02–S07 and S09, `evidence/facts.json` and `evidence.json`, and the final narration. The detailed list is in `FOOTAGE-REQUEST.md`.

**Commands:** `npm run studio` · `npm run render:preview` (540p) · `npm run render:draft` · `npm run validate` · `npm run render:final` (gated)

### 2026-10-09 — session 2: story, flow and voice rework (Vansh's feedback)

Vansh's feedback: the animations are good, but the voice sounded mechanical, the edit felt like separate pieces, and it should sell the product without synthetic-data explanations.

**Story** is now problem → how HeatOps fixes it → AWS. The skeleton is 22/12/18/30/16/20/14/22/8/8 s and is documented in video.md. The script is rewritten in a sales tone, about 335 words.

**Continuity:**
- The opening (worker dots → crews → feels-like curve crosses 40 °C → red afternoon → three questions) shrinks into the app frame.
- S02–S07 play inside one persistent app frame with a "Tomorrow's heat plan" checklist that ticks off as the story moves. The gate-correction and "new plan" overlays play inside that same frame.
- The app frame then shrinks into the "Web app" node. The architecture builds word by word while a request pulse travels through it.
- The CloudWatch proof grows out of its node, and the close follows.
- Old scene files were removed: S01Hook, S04TurningPoint, S08Architecture, FootageScenes, FootageStage.

**Voice:**
- Kokoro-82M runs locally in `.venv-tts` (setup: `python -m venv .venv-tts` then `.venv-tts\Scripts\pip install kokoro soundfile`). Stock voice `af_heart`, Apache-2.0 weights, no cloning. Generate with `npm run voice`.
- It produces per-scene WAVs plus word timings. Captions (48 cues) and every animation beat are keyed to the spoken words via `at(scene, word)`.
- The Windows SAPI scratch voice was removed.

**Sound:**
- An original ambient bed and whoosh/tick/pop/chime effects are synthesized by `scripts/sound.py` (`npm run sound`). They're project-owned with no samples.
- The music ducks under speech by about 12 dB.
- `scripts/master-audio.mts` normalizes the mix to -16 LUFS with two-pass loudnorm and copies the video stream.

**Draft output:** `out/draft/heatops-draft.mp4`. QA on the real file: 170.1 s, 1920×1080, 30 fps, yuv420p, AAC, -16.0 LUFS, no black segments, no silences over 4 s.

**Gate:** `npm run render:final` still exits 1 and produces no `out/heatops-final.mp4`. The remaining blockers are the real captures, verified facts and evidence, and narration approval.

**Pending decisions for Vansh:** keep the AI voice or record his own. Music on or off (`asset-manifest.json` → `music.enabled`).
