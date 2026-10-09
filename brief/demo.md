# Video-first demo and recording script

Target duration: 2:50, including end card. Record a working deployed app. Capture by 11 October 11:00 IST as an internal target; exact official cutoff remains to be checked in the event submission form.

## Production ownership

The application coding agent provides functioning screens, seeded runs, capture guidance, and verified evidence. A separate Opus session creates the video with Remotion, using actual app recordings for the workflow and animation for explanatory scenes. Vansh supplies narration and any manual recordings. See `video-production/README.md`; the detailed frame timings in `video-production/video.md` match this table.

## Story and screen plan

| Time | Screen and action | Owner |
|---|---|---|
| 0:00–0:12 | Animated heat/workday hook, illustrative label | Video agent |
| 0:12–0:28 | Real site overview and baseline | App evidence + video edit |
| 0:28–0:48 | Real agent receipts and first proposal | App evidence + video edit |
| 0:48–1:18 | Gate 06:00 → 07:00, invalidate and replan | App evidence + video edit |
| 1:18–1:38 | Comparison with remaining exposure | App evidence + video callouts |
| 1:38–2:02 | Approval, assignments, mobile acknowledgment | App evidence + video edit |
| 2:02–2:18 | Incomplete check, demo-clock advance, overdue event | App evidence + video edit |
| 2:18–2:32 | Animated architecture explanation | Video agent, verified app facts |
| 2:32–2:40 | Actual matching AWS deployment/log evidence | App evidence + video edit |
| 2:40–2:50 | Closing message | Video agent |


## Narration draft

“Tomorrow, 45 people are scheduled to work outdoors at this construction site. A forecast tells the supervisor it will be hot. The harder question is what to change—and whether those changes actually happen.

This is HeatOps: tomorrow's heat forecast, tonight's action plan. We're using a clearly labeled synthetic heat scenario to demonstrate the workflow reliably.

HeatOps checks the weather, reads crew and task constraints, and compares feasible schedules. The calculation tools measure overlap with our demo heat-screening threshold. The agent turns those results into an explanation and a proposed response.

Its first proposal moves one crew earlier. But the supervisor knows something the forecast doesn't: the gate cannot open until seven. We change that constraint. HeatOps invalidates the old proposal, calls the planner again, and produces a new revision.

In this scenario, scheduled exposure above the screening threshold falls from 135 to 60 worker-hours. All 270 outdoor task-hours remain scheduled. The unresolved hours stay visible; this is not a declaration that the site is safe.

The supervisor approves this revision for coordination. HeatOps creates a schedule notice, readiness checks, and a task to resolve the remaining exposure. On the mobile view, receipt acknowledgment and reported readiness are separate actions.

Now we advance the labeled demo clock. An unfinished check becomes overdue and appears for the operations lead. A notification is not treated as completed preparation.

This run uses Strands with Amazon Bedrock on Lambda. API Gateway handles requests, DynamoDB stores revisions and audit events, SQS runs background jobs, and EventBridge checks for missed actions. Here is the matching run ID in the deployed service.

HeatOps connects a forecast to a feasible plan, a responsible person, and a follow-up. Our next step is to validate this workflow with site supervisors.”

Read aloud and trim to fit the actual recording; target approximately 330–370 words. Never speed up speech to rescue an overlong edit.

## Build the shots before adding features

- 16:9 at 1920×1080, browser zoom around 110–125%; critical text at least 16px in the app.
- Use the actual schedule timeline as the opening visual. Stock disaster footage is unnecessary.
- Keep the source badge and site timezone visible in every scenario shot.
- The constraint correction is the turning point. Reserve at least 20 seconds for it.
- Agent panel shows tool name, short result, timing, and run ID. Do not show invented thoughts or hidden chain-of-thought.
- Show one actual Bedrock-backed execution. Shorten idle waits in editing with `Processing time shortened`; don't splice a mocked result into the run.
- Show an actual acknowledgment event from the supervisor view, then refresh the operations view.
- Show AWS via a matching sanitized CloudWatch run event and a Lambda or Amplify deployment view. Hide credentials, user emails, and account identifiers.
- Capture system audio off, clean microphone, captions, steady cursor. Avoid a terminal wall or reading a service list over a tiny diagram.

## Honest demonstration labels

`Synthetic weather scenario` means invented input values and a real application/agent execution.

`Saved run replay` means a previously executed run, no current model call. Display capturedAt and original runId.

`Demo clock advanced` means the same overdue evaluator runs against an injected clock in an isolated synthetic session. It does not prove a real hour elapsed.

Live forecasts may be shown briefly if they load; don't claim the synthetic dates came from Open-Meteo. No fabricated worker testimony or claims of injuries prevented.

## Backup and cut list

Record a successful real run immediately after the vertical slice works. If Bedrock is unavailable later, use that recording and identify saved-run replay honestly. If no Bedrock run ever works, state that the integration remains incomplete and narrow the submitted claims.

Cut in order: decorative map, extra sites, animations, email, Hindi generation, history browser, live forecast cameo. Preserve: constraint change, recomputed metrics, approval, acknowledgment, overdue action, and AWS proof.
