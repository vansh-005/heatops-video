# App ↔ video handoff

## Separate workspaces

Use sibling directories `heatops` and `heatops-video`, each with its own Claude Code session. App agent owns the first; video agent owns the second. The starter ZIP puts copied planning briefs under `heatops-video/brief/`. Treat these as reference snapshots. The user transfers updated facts/footage between workspaces; no shared source-file editing is required.

The app session's kickoff/update message:

> You own the HeatOps application, deployment, correctness, and demo readiness. A separate Opus session owns video production in heatops-video. Do not build Remotion scenes or render the submission video. Continue T00–T13, and T15's repository/writeup work. Prepare the reliable seed/reset flow, readable 1080p screens, verified metric JSON, and sanitized run evidence described in handoff.md. When a scene works, report its shot ID and capture steps; export evidence where supported. T14 and the editing/rendering parts of T15 belong to the video session and me. Keep actual app behavior as the source of truth.

## Required evidence handoff

The app agent prepares an export folder or a precise capture guide as capabilities permit. Screen recording can be manual by Vansh. Provide 2–3 seconds of handles before and after each action for editing. Capture native 1920×1080 at 30 fps when possible; ensure browser zoom makes labels legible.

| Asset | Covers | Evidence to retain |
|---|---|---|
| `02-overview.mp4` | Site overview and source badge | Site/session ID, scenario date |
| `03-agent-plan.mp4` | Real tool calls and first proposal | Run ID, selected model, initial result |
| `04-gate-replan.mp4` | Constraint change and resulting revision | Old/new site versions, new run ID |
| `05-comparison.mp4` | Verified metrics and residual hours | 135 → 60, 270 task-hours, source |
| `06-approve-ack.mp4` | Approval and supervisor acknowledgment | Proposal/task IDs and actual states |
| `07-overdue.mp4` | Pending check and overdue evaluation | Clock mode, dueAt, escalation event |
| `09-aws-proof.mp4` | Actual deployed AWS/log proof | Matching run ID, no credentials |

Alternate: one continuous raw capture with a cue sheet giving in/out times for each asset. Video agent creates the clips from that source, preserving provenance. Do not require the app agent to become an editor.

Also provide:

- `facts.json`: verified metric values, worker count, task-hours, source mode, actual AWS services used, optional verified app URL.
- `evidence.json`: capture IDs, run/session IDs, capturedAt, source file, original in/out times, and known limitations. Hash raw files if convenient.
- Two clean UI screenshots after the layout stabilizes, for crop/callout alignment.
- Copy of any changed product fact or claim. App agent owns truth; video agent owns presentation.

Do not export real user health data, access tokens, account secrets, or full cloud account details. A sanitized run ID is enough to correlate evidence.

## Manifest implementation contract

`asset-manifest.json` starts with missing assets and `verified: false`. Paths are relative to `public/`. Copy raw footage under `public/footage/`, narration under `public/audio/`, and use the manifest to map slots. Keep original captures outside rendered output unchanged.

The video agent implements validation for: required file exists; source is real capture for app/AWS scenes; duration covers selected trim range; metadata and run IDs present; metrics match facts.json; source-mode labels correct; narration present; no placeholder in final mode. Missing data is allowed only in draft preview and must be visibly labeled.

For final mode, populate `facts` from a verified app export. The supplied expected fixture values are not themselves deployment evidence. Both agents can work now, but final evidence cannot be completed before the app runs.

## Synchronization checkpoints

- A: agree on colors, headline, scenario, and shot IDs now.
- B: hand over first real proposal footage as soon as T05/T06 work.
- C: hand over gate-change sequence after T07; this locks the key scene.
- D: hand over approval/overdue/AWS evidence after T09/T10/T13.
- E: freeze product claims; update narration once, then final render.

If a feature is cut, update the facts, storyboard, and narration together. Remove unsupported claims rather than making synthetic video stand in for a missing feature.
