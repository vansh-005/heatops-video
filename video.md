# Creative and edit blueprint

## Format

170 seconds, 1920×1080, 30 fps, 5100 frames. Approximately 80% real app/AWS footage, 20% dedicated motion graphics. Overlays can enhance the real footage throughout. These proportions are a design choice, not an event requirement.

Hook: **“A heat warning doesn't rearrange a workday.”** Follow quickly with a supervisor's concrete constraint. Close: **“Tomorrow's heat forecast. Tonight's action plan.”**

Use motion to explain what changes: hot hours appear; a work block shifts; a constraint blocks the first plan; the revised block retains a red overlap; assignments become acknowledged or overdue. This is more useful than decorative animation.

## Locked edit skeleton

| Shot | Seconds | Frames [start,end) | Content | Can start before app? |
|---|---|---|---|---|
| S01 | 0–12 | 0–360 | Animated day timeline, afternoon heat band, 45-worker label, hook | Yes, label illustrative scenario |
| S02 | 12–28 | 360–840 | Actual site overview, source badge, baseline | Layout and placeholder only |
| S03 | 28–48 | 840–1440 | Actual agent tool receipts and first proposal | Overlay shell only |
| S04 | 48–78 | 1440–2340 | Gate 06:00 → 07:00, invalidate, rerun, revised schedule | Transition/callout design only |
| S05 | 78–98 | 2340–2940 | Actual comparison; subtle numeric callout, remaining exposure | Draft graphic with fixture label |
| S06 | 98–122 | 2940–3660 | Approval drawer, task creation, mobile acknowledgment | Layout only |
| S07 | 122–138 | 3660–4140 | Pending readiness check, labeled clock advance, overdue event | Layout only |
| S08 | 138–152 | 4140–4560 | Animated architecture explanation | Yes, mark provisional until verified |
| S09 | 152–160 | 4560–4800 | Actual AWS deployment/log evidence with matching run ID | Placeholder only |
| S10 | 160–170 | 4800–5100 | Final takeaway, logo/title, optional real URL | Yes; URL remains pending |

S04 is the turning point. Keep enough actual interaction visible to prove the plan responds to a changed constraint. A transformed drawing alone does not demonstrate this capability.

## Motion direction

Palette mirrors frontend.md: warm canvas #F7F5EF, ink #172B35, teal #147D78, amber #965600, red #B83232. Use filled rectangles and precise typography. Motion curves should feel responsive and restrained; large transitions about 0.3–0.6 seconds, with long enough holds to read the information.

Title size 64–84px at 1080p, callouts 36–48px, captions at least 32px. Keep about 64px safe margins. Hold metrics for 4–6 seconds. Avoid full dashboard scaled down beside long paragraphs. Crop into the relevant UI region, retain context/source labels, and show an occasional full-screen view to orient the viewer.

Architecture scene: show web/API → queued agent → Bedrock/tools/state, then the timer's follow-up path. Use a few readable groups instead of every service icon. Actual AWS evidence follows immediately; diagrams alone are not proof of deployment.

## Narration and sound

Use brief/demo.md's narration as source material; revise transitions to match this timing. Aim roughly 330–360 spoken words, leaving room for pauses. The user should record a scratch reading early on a phone or microphone in a quiet room, then record final audio after the actual app footage is placed. Split by scene or record a clean continuous track plus pickups; use 48 kHz WAV if available.

The video agent can use temporary clearly labeled scratch narration to time scenes. Paid TTS and voice cloning are not required. Avoid generating finished voice audio before the script is aligned to real footage; it creates avoidable rework.

Captions follow the actual audio, including late script edits. Keep them away from buttons/metrics. Music is optional; speech and product evidence matter more. Do not accelerate narration to squeeze in more service names.

## Rendering strategy

Local rendering first. Implement a fast low-resolution preview for review and a final 1080p render. The target invocation after scaffolding is:

```powershell
npx remotion render src/index.ts HeatOpsDemo out/heatops-final.mp4 --codec h264 --pixel-format yuv420p --props video-props.json
```

The scaffold may choose a different entry path; document the actual path. Implement `render:final` to run manifest/evidence validation before this command. A properties file avoids Windows inline-JSON quoting issues. This example is not an already-working command in this starter pack.

Render a short sample first to uncover browser/font/codec issues. Final render must not fetch live weather, call Bedrock, or depend on app availability. It consumes local captures and verified handoff data.

## Review ladder

1. Opening proof: does the first 12 seconds communicate a work-planning problem?
2. Complete rough edit: does the turning point make sense with placeholder slots?
3. First real-footage pass: is every UI detail readable and each claim supported?
4. Final narration pass: are captions/pauses aligned?
5. Full rendered MP4: playback, actual duration, evidence labels, and audio checked.
