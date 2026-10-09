// What each real-capture slot must show. Rendered on draft slates and mirrored in FOOTAGE-REQUEST.md.
export const SHOT_REQUESTS: Record<string, { title: string; mustShow: string[]; evidence: string }> = {
  S02: {
    title: "Site overview + baseline",
    mustShow: [
      "Ops view for Yamuna Works with source badge + timezone",
      "Baseline timeline with 13:00–16:00 flagged band",
      "Workers 45 · baseline flagged worker-hours",
    ],
    evidence: "site/session ID · scenario date",
  },
  S03: {
    title: "Agent tool receipts + first proposal",
    mustShow: [
      "Run assessment clicked; queued → running states",
      "Tool receipts with names, timing and run ID",
      "First proposal: Crew A 06:00–09:00 / 09:30–12:30",
    ],
    evidence: "run ID · selected model · initial result",
  },
  S04: {
    title: "Gate 06:00 → 07:00, invalidate, replan",
    mustShow: [
      "Edit constraints → gate field 06:00 → 07:00 → save",
      "Old proposal: Outdated — site constraints changed",
      "Replan with new constraints → new run → revision 2",
    ],
    evidence: "old/new site versions · new run ID",
  },
  S05: {
    title: "Comparison + remaining exposure",
    mustShow: [
      "Before/after flagged worker-hours from the API",
      "270 task-hours still scheduled",
      "Remaining flagged blocks marked 'Still requires a decision'",
    ],
    evidence: "facts.json values · source mode",
  },
  S06: {
    title: "Approval + mobile acknowledgment",
    mustShow: [
      "Approval drawer: checkbox + Approve coordination plan",
      "Created tasks on the board",
      "390px supervisor view: I've read this schedule, then Report ready",
    ],
    evidence: "proposal/task IDs · actual states",
  },
  S07: {
    title: "Pending check → overdue",
    mustShow: [
      "Readiness check still pending on ops board",
      "Advance demo clock 15 minutes (toast + badge visible)",
      "Check becomes Overdue with responsible role + escalation",
    ],
    evidence: "clock mode · dueAt · escalation event",
  },
  S09: {
    title: "AWS deployment / log evidence",
    mustShow: [
      "CloudWatch log event with the same run ID as S03/S04",
      "Lambda or Amplify deployment view",
      "No account IDs, emails, keys or tokens on screen",
    ],
    evidence: "matching run ID · sanitized capture",
  },
};
