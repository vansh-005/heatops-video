# Product definition

## User, problem, and position

Primary user: a construction-site supervisor responsible for tomorrow's crew schedule and preparation. Secondary user: an operations lead reviewing incomplete actions. Pilot assumption: one organization with one active site; two additional example sites may appear only as clearly labeled sample cards after the main workflow works.

The gap: a forecast does not encode gate access, locked task windows, crew availability, drinking-water readiness, or who has acknowledged the response. HeatOps joins these inputs into a reviewable plan and accountable tasks.

Pitch: **“Tomorrow's heat forecast. Tonight's action plan.”**

HeatOps is a heat-adaptation planning prototype. Its output is a forecast-screened schedule, not occupational clearance, an official heatwave declaration, a medical assessment, or a validated work/rest prescription.

## P0 user journey

1. Open one seeded Delhi worksite with crew counts, task windows, gate time, resources, and a weather source badge.
2. Run assessment. See hourly weather, flagged time windows, baseline exposure, and timestamped tool results.
3. Review a proposed schedule and outstanding resource checks. Every numeric metric is computed in code.
4. Change gate opening time through a structured constraint form; invalidate the old proposal and request replanning.
5. Review the new plan: changed blocks, exposure before/after, remaining exposed tasks, and unresolved conditions.
6. Approve a specific version for coordination. This publishes assignments; it does not authorize hazardous work or declare the whole site safe.
7. Open the mobile supervisor view. Acknowledge receipt; report water/shade readiness as separate observations.
8. See a missed check become overdue and appear in the operations lead's board.

## Exact hero scenario

Synthetic fixture date: 1 June 2026, Asia/Kolkata. Fictional site: Yamuna Works, Delhi. No actual workers or employer are represented.

| Input | Value |
|---|---|
| Crew A | 30 people, two movable 3-hour outdoor task blocks |
| Crew B | 15 people, outdoor tasks locked to 09:00–12:00 and 13:00–16:00 |
| Baseline A | 09:00–12:00 and 13:00–16:00 |
| Demo flagged interval | 13:00–16:00, apparent temperature at least 40°C |
| Initial gate | 06:00 |
| Initial A proposal | 06:00–09:00 and 09:30–12:30 |
| Supervisor correction | Gate opens at 07:00 |
| Revised A proposal | 07:00–10:00 and 10:30–13:30 |
| Shade capacity | 45 people; task gap is a fixture constraint, not a health recommendation |
| Drinking water | Availability unconfirmed; verification action required |

Baseline flagged worker-hours = 45 × 3 = 135. Initial proposal = 15 × 3 = 45. Revised proposal = (30 × 0.5) + (15 × 3) = 60. Revised reduction = 75 worker-hours, or 55.6%. Scheduled outdoor task-hours remain 270 across all three schedules. These are simulated scheduling results, not observed outcomes or retained productivity.

Crew B remains exposed and requires a supervisor decision to defer or otherwise resolve the task. Crew A's final half-hour also remains flagged. Display both. Do not hide them behind the reduction percentage. If those tasks are deferred later, separately report lost/deferred task-hours rather than comparing an incomplete schedule as if all work remained.

## Weather and risk semantics

- P0 supports `synthetic` and `live_forecast`. Historical replay is P1.
- The demo's 40°C apparent-temperature trigger is an illustrative screening policy, not a recommended safety threshold. The configured policy ID must accompany each result.
- Live mode uses a user-configured screening policy and visibly states its status as unvalidated; it must never call a below-threshold interval “safe.”
- Weather forecast, on-site WBGT, and official IMD alerts are different information sources. P0 only provides forecast screening.
- Missing hours or stale data yield `INSUFFICIENT_DATA`, not zero exposure. Live freshness budget: 3 hours from fetch time, a product assumption, not a provider guarantee.
- Resource checks cannot mathematically cancel exposure. Shade readiness does not turn outdoor tasks into indoor tasks.

## MVP scope and explicit deferrals

P0: one site, synthetic and live adapters, one bounded agent, candidate schedules, revision comparison, approval, assignment cards, receipt acknowledgment, readiness reporting, overdue escalation, audit, AWS deployment, video.

P1 only after a rough recording succeeds: historical replay with provenance, optional email to configured test recipients, two more sample sites, exports, richer constraint input.

Out of scope: city dispatch, tanker procurement, official alert issuance, wearables, injury prediction, a new forecasting model, vector search, broad document ingestion, automated shutdowns, automatic payroll adjustments, and production worker-health records.

## Acceptance and validation targets

- A new viewer understands user → issue → revised plan → acknowledgment within three minutes.
- All demo metrics match the fixture checker and server-side responses.
- The live agent visibly calls typed tools; failures are displayed honestly.
- Approval of a stale revision fails; refreshing does not lose the run.
- An overdue check appears within two scheduler ticks in live mode.
- Three consecutive complete rehearsals succeed before final recording. This is a build gate, not a claim already achieved.

After the hackathon, interview supervisors about shift authority, pay, transport, early access, resource ownership, and what evidence constitutes readiness. None of these customer assumptions have been validated yet.
