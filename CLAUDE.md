# Claude Code — HeatOps video producer

You are the video-production agent, separate from the application-building agent. Your deliverable is an editable Remotion project plus a polished 170-second demo MP4. Do not build or alter the HeatOps application.

## Scope and source of truth

Read README.md, video.md, handoff.md, video-tasks.md, and the read-only brief/ snapshots. Use the installed official Remotion instructions for APIs and rendering. This CLAUDE.md applies to the video workspace; do not load the application's CLAUDE.md as your own task list.

Only write inside this video workspace. Do not modify the sibling app folder, deploy AWS resources, invoke its model for video rendering, or change its authentication. Ask for missing footage through a concrete shot request and continue independent scenes while it is pending.

The user chooses the available Opus model for this coding session. Remotion renders the result. The app's runtime agent/model is a separate concern. Do not assume a provider-specific model alias is an official model name or change it without the user's instruction.

## Build workflow

1. Inspect the folder and preserve user files. Verify Node/tool availability and scaffold a compatible Remotion React + TypeScript project without overwriting these briefs. Use a temporary scaffold directory if the generator expects an empty destination.
2. Pin compatible Remotion packages/lockfile. Build a 12-second intro and render it locally before constructing the full edit.
3. Register one main composition, `HeatOpsDemo`: 1920×1080, 30 fps, 5100 frames. Scene lengths come from video.md.
4. Build independent reusable scenes and a `FootageSlot` component. Missing recordings are explicit draft slates; do not imitate functioning product screens and call them footage.
5. Use frame-driven deterministic animation, local fonts/assets, and no network calls during a final render. Fetching input assets is a setup activity, not per-frame work.
6. Implement manifest validation, draft preview, and final render scripts. Final rendering fails when required clips, narration, evidence metadata, or placeholder checks fail. Never remove the gate to get an export.
7. Replace clips through the manifest without rewriting scenes. Integrate real narration, align captions, inspect representative frames, and watch the full render.

## Visual standards

Editorial typography, crisp schedule blocks, small controlled zooms, warm off-white/navy palette with amber/teal accents. The central dramatic moment is the supervisor correcting the gate time; give it 30 seconds and a clear visual change. Avoid particle storms, generic neon AI imagery, spinning logos, excessive 3D, long logo reveals, tiny UI in oversized device frames, and unreadable rapid cuts.

Use the supplied script as a draft, adapting pace to the real footage. Preview narration with scratch audio if needed, but disclose it. Default final voice is Vansh's recording. Synthetic narration is optional if he chooses it; never clone another person's voice.

## Evidence and claims

Keep the synthetic-weather badge readable in all scenario footage. Preserve visible residual exposure and the distinct acknowledgment/readiness states. Crop for focus without removing a qualification required to understand a claim.

Motion-graphic explanations may illustrate the forecast/schedule relationship and architecture. Label them as illustrations where ambiguity is possible. They do not prove that an app interaction happened. Final app scenes must use real captures of verified behavior.

Metrics 135 → 60, 55.6%, and 270 are fixture expectations until verified against a captured deployed run. In final mode, use the app handoff's verified values and preserve the relevant context. Keep the remaining 60 flagged worker-hours visible. No claims of injuries prevented, certified safety, measured productivity, or actual customer adoption.

Shorten idle processing only with a visible `Processing time shortened` label. Mark accelerated demo time. If editing across runs, record which shots came from each run and avoid suggesting an inconsistent sequence is one continuous execution. Do not invent logs, notifications, approvals, or acknowledgments.

## Output and checks

Target outputs: `out/heatops-final.mp4`, `out/heatops-captions.srt`, `out/heatops-poster.png`, and the editable project. Final video uses H.264, yuv420p, AAC audio, 1080p, 30 fps, under 180 seconds. Check the actual rendered duration and file playback, not just composition metadata.

Review with sound, then muted with captions; verify no black gaps, missing fonts, clipped UI, stale placeholders, missing audio, or exposed credentials. Keep music optional and low enough for speech to remain clear. Use only owned or licensed assets with credits.

Track V-task status and evidence in video-tasks.md. Report draft assets separately from final exports. Do not claim a video exists after writing only a storyboard. The user handles external upload/submission unless explicitly requested otherwise.

## Direction update from Vansh (2026-10-09)

The video sells the product: problem → how HeatOps fixes it → AWS architecture.
- Narration and overlays don't explain synthetic versus real data. The app's own source badge stays visible in real captures, and the opening calls the site a "sample site". The no-fabrication and evidence rules above still apply in full.
- Natural local AI narration (Kokoro, stock voice) is the current draft voice. Vansh decides between it and his own recording for the final.
- See video.md for the revised 22/12/18/30/16/20/14/22/8/8-second skeleton.
