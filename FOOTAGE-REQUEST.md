# Footage + evidence request — HeatOps demo video

Owner of the request: video agent (`heatops-video`). Supplier: app agent / Vansh.
All slots are currently **draft placeholders**. Final render is blocked until each item below arrives and is verified.

## Capture settings (all clips)

- 1920×1080, 30 fps, MP4 (H.264). Browser zoom ~110–125% so app text is ≥16 px at capture size.
- System audio off. Steady cursor, no rapid scrolling. 2–3 s of still handles before and after every action.
- Synthetic-weather source badge and site timezone visible in every scenario shot.
- One continuous run per scene where possible. If you stitch runs, tell me which shots came from which run ID.
- Don't show account IDs, emails, access tokens or API keys anywhere. A sanitized run ID is enough.
- Don't speed up or cut a capture yourself. Send it raw and I'll mark any shortened processing on screen.

## Shots

| Slot | File (`public/footage/`) | Used length | Must show | Evidence to send |
|---|---|---|---|---|
| S02 | `02-overview.mp4` | 13 s | Ops view for Yamuna Works: source badge, Jun 1 2026 / Asia/Kolkata, 45 workers, 13:00–16:00 flagged band, baseline flagged worker-hours | site/session ID, scenario date |
| S03 | `03-agent-plan.mp4` | 19 s | Click **Run assessment** → queued/running → real tool receipts (name, short result, timing, run ID) → first proposal (Crew A 06:00–09:00 / 09:30–12:30) | run ID, selected model, initial result |
| S04 | `04-gate-replan.mp4` | 31 s (the key scene) | **Edit constraints** → gate 06:00 → 07:00 → save → old proposal shows *Outdated — site constraints changed* (approve disabled) → **Replan with new constraints** → new run → revision 2 (Crew A 07:00–10:00 / 10:30–13:30) | old/new site versions, new run ID |
| S05 | `05-comparison.mp4` | 17 s | Plan comparison: flagged worker-hours before → after (from the API), 270 task-hours retained, remaining flagged blocks *Still requires a decision* | values matching `facts.json` |
| S06 | `06-approve-ack.mp4` | 21 s | Approval drawer (checkbox + **Approve coordination plan**), created tasks, then the 390 px supervisor view: **I've read this schedule**, then **Report ready** as a separate action, then the refreshed ops view | proposal ID, task IDs, actual states |
| S07 | `07-overdue.mp4` | 15 s | Readiness check still pending → **Advance demo clock 15 minutes** (toast + badge visible) → check becomes Overdue with responsible role and escalation | clock mode, dueAt, escalation event |
| S09 | `09-aws-proof.mp4` | 8 s | CloudWatch log event showing the **same run ID** as S03/S04, plus a Lambda or Amplify deployment view | matching run ID (sanitized) |

Instead of separate clips, you can send one continuous raw capture plus a cue sheet with in/out times per slot. I'll cut it and keep the provenance.

## Data files (put them in `evidence/`)

- `facts.json` holds the verified values from a captured deployed run: `workers`, `baselineFlaggedWorkerHours`, `revisedFlaggedWorkerHours`, `taskWorkerHours`, `sourceMode`, AWS services actually used (`awsServices`), and optionally a verified `appUrl`.
- `evidence.json` lists one entry per capture: `shotId`, `file`, `runId`, `sessionId`, `capturedAt`, original in/out times, and known limitations. Hashes are optional.
- Two clean 1920×1080 screenshots of the ops view (baseline and revision 2) so I can align crops and callouts.

"Used length" is what appears on screen, including a 0.7 s crossfade lead-in. Longer raw captures are fine because I trim them.

Each action should land roughly when the narration mentions it (word timings are in `src/data/voice-timing.json`). Don't rush: the edit can shorten idle waits, but it can't invent a missing step.

## Narration (Vansh)

- The draft now uses a natural local AI voice (Kokoro, stock `af_heart` voice). You choose the final voice:
  - **Keep the AI voice:** say so, and I'll mark it approved. It regenerates from the script with `npm run voice`.
  - **Use your own voice:** record `public/audio/narration.wav` at 48 kHz from `src/data/narration.json`, about 335 words in 170 s, after the real footage is placed.

## How a delivery gets placed

1. Copy the file to `public/footage/…`. In `asset-manifest.json`, set `status: "ready"`, `runId`, `capturedAt`, `sourceInSeconds`/`sourceOutSeconds` (or `segments`), and optionally `focus` crop keyframes.
2. Once the clip has been checked against the evidence, set `verified: true`.
3. The scenes themselves don't change.
