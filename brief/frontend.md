# Frontend implementation and visual direction

## Design intent

Build a field-operations product that reads clearly in a video. The first screen should explain the issue without narration. Use a warm off-white canvas, dark navy text, amber for screening alerts, red for overdue/remaining flagged work, and teal for acknowledged actions. Avoid a generic dark AI chat dashboard.

Suggested tokens: canvas `#F7F5EF`, panel `#FFFFFF`, ink `#172B35`, muted `#56656D`, border `#D9DFDD`, accent `#147D78`, warning `#965600`, danger `#B83232`. Verify actual contrast of final combinations. Use locally available system sans-serif; optional Inter only if bundled. Body 16px, section title 22px, hero metrics 36–44px. Space in 8px increments; cards 12px radius, restrained shadows.

## Routes

- `/`: reviewer landing with one-sentence promise, public saved-run replay, source label, sign-in.
- `/ops/sites/:siteId`: authenticated desktop operations view.
- `/ops/runs/:runId`: stable shareable-within-account run detail; survives refresh.
- `/supervisor/tasks`: mobile action list and detail, authenticated supervisor role.
- `/demo/replay/:id`: immutable public capture; visible replay banner and captured time.

## Main screen: desktop 1440–1920px

Top bar: HeatOps wordmark, site selector/name, scenario date and timezone, source-mode pill, signed-in role. A persistent slim badge reads `Synthetic weather scenario • Jun 1, 2026 • Asia/Kolkata` for the fixture.

Row 1: concise title “Tomorrow's work needs a heat plan.” Four values: workers 45, flagged window 13:00–16:00, baseline flagged worker-hours 135, open preparation checks. Clarify that threshold and totals describe the selected scenario.

Main grid: roughly 65% schedule workspace and 35% agent/action panel. The timeline is the hero, not a map.

Timeline: 06:00–18:00 time axis; rows for Crew A baseline, Crew A proposed, Crew B locked. Heat band above and within the chart; task segments with start/end labels, crew count, and lock icon where applicable. Only actual task segments contribute to metrics; rest gaps remain visually separate. Provide a table view for accessibility and exact times.

Agent panel: “Checked weather”, “Loaded site constraints”, “Compared candidate schedules”, “Proposal ready”. Each event uses actual backend tool receipts and timestamps; no timer-driven fake status. Expand reveals structured inputs/outputs and run ID.

Below: before/after metric comparison, scheduled task-hours, remaining flagged blocks, and preparation tasks. Dominant primary action: `Review revision`. Secondary: `Edit constraints`.

## Constraint change interaction

Click Edit constraints → gate opening field from 06:00 to 07:00 → save. Backend PATCH increments site version. Old proposal shows `Outdated — site constraints changed`; disable its approval button immediately and after server refresh. Primary action becomes `Replan with new constraints`.

While replanning, keep the previous schedule visible but marked outdated. When new data arrives, animate changed segments once over 250ms; respect reduced motion. The numbers come from the API, not frontend calculations.

## Approval drawer

Show revision number, input versions, weather source, schedule diff, 135 → 60 worker-hours, 270 task-hours retained, and three unresolved conditions. Phrase the latter as “Still requires a decision” with a prominent color/icon.

Mandatory checkbox: “I have reviewed the remaining flagged work and preparation checks.” Button: `Approve coordination plan`. Adjacent helper: “Publishes assignments; does not clear remaining flagged work.” Reject/return for revision remains available. On 409, close no data silently; show stale reason, refresh, and require a new review.

No “100% safe”, “Workers protected”, “Lives saved”, or “AI-certified” badge.

## Supervisor mobile view, 390px

Large site name, scenario/live badge, revision, relevant schedule, and task due times. One task per card; 44px minimum touch targets. Receipt action is `I've read this schedule`. Readiness check actions are `Report ready` and `Report blocked`, with a short optional note. Label readiness as “Reported by supervisor” and record time.

Include an English/Hindi label toggle only after P0 works. Use reviewed static UI translations; translated model prose is optional. Initial proposed button translations: “मैंने यह समय-सारणी पढ़ ली है”, “तैयार है”, “तैयारी में बाधा है”. Have a fluent speaker review final phrasing before recording.

## Demo controls

Presenter-only, collapsed panel: `New synthetic session`, `Advance demo clock 15 minutes`, `Copy run ID`. Never place clock controls on live sessions or public replay. An unmistakable toast and badge show clock advancement. Fixture reset creates a new session; it does not erase audit history.

Replay can play saved events in sequence, but label it continuously as a saved recording of execution. Replay animations must not pretend to call Bedrock.

## Required states

| State | Display and available action |
|---|---|
| Idle | source, constraints, Run assessment |
| Queued | persisted run ID; waiting for worker; dispatch repair if pending |
| Running | tool events + elapsed execution time; no fake percentage |
| Waiting too long | provider delay; retain run; refresh status |
| Insufficient data | missing hours/source freshness; fetch again |
| No feasible plan | specific failed constraints; edit or escalate |
| Proposed | verified metrics, remaining issues, review |
| Superseded | old revision, reason, replan link |
| Approved | task board; actual statuses |
| Partial preparation | count of reported-ready versus unresolved checks |
| Overdue | responsible role, due time, escalation receipt |
| Failed | readable error, retry creates a traceable new attempt/run |
| Empty replay | honest unavailable message, not synthetic success |

## Components and implementation

`AppShell`, `SourceBadge`, `SiteSummary`, `HeatScheduleTimeline`, `ScheduleTable`, `ConstraintEditor`, `AgentRunPanel`, `ToolReceipt`, `PlanComparison`, `ApprovalDrawer`, `TaskBoard`, `SupervisorTaskCard`, `DemoControls`, `ErrorNotice`.

Use React Router and a query client with bounded polling. Keep API DTOs distinct from view models. Backend is authoritative for statuses, metrics, versioning, and permissions. Render model text as plain text or sanitized limited markdown; no raw HTML. Preserve form input on API errors. Add keyboard focus handling for drawers, text labels alongside colors, and correct local-time display.

## Screen acceptance

At recording resolution, the viewer can read the source badge, both metric values, changed gate time, residual exposure, and task acknowledgment without zoom cuts. At 390px there is no horizontal scrolling outside the intentionally scrollable schedule, and task actions remain reachable.
