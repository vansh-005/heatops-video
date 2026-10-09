# HeatOps video workspace — start independently

Use this as a separate sibling workspace named `heatops-video`, not inside the live application repository. The video starter ZIP extracts with that layout. Choose your preferred available Opus model in this Claude Code session. Model selection does not change the application's Bedrock runtime configuration.

This pack supplies production instructions, not a rendered video or a working Remotion project. The video agent scaffolds that project here. Source briefs in `brief/` are read-only snapshots from the app plan.

## Start now

1. Extract `HeatOps-Video-Starter.zip` and open the `heatops-video` folder in a new Claude Code session.
2. Install the official Remotion Claude Code plugin from your terminal:

```powershell
claude plugin marketplace add remotion-dev/claude-code-plugin
claude plugin install remotion@remotion
```

3. Restart Claude Code, open this folder, and select the Opus model you have access to.
4. Use this kickoff instruction:

> /remotion:remotion-create Read CLAUDE.md, video.md, handoff.md, and the read-only brief files. Build the HeatOps demo video project in this workspace. Start with V00 and render a 12-second opening proof before building the full edit. Use the fixed 170-second storyboard and replaceable, visibly labeled footage placeholders. I want precise, polished motion design, readable product footage, and restrained transitions. Do not implement the HeatOps app or fabricate successful product interactions. Follow the asset handoff contract and keep production progress in video-tasks.md. The app is being built independently; begin everything that does not need its footage now.

If the plugin is unavailable, official Remotion agent skills are an alternative: `npx skills add remotion-dev/skills`. Choose the project-local Claude Code installation offered by that command and use the installed instructions; do not install unrelated third-party video plugins as a substitute.

## What each workspace owns

| Workspace/person | Owns | Handoff |
|---|---|---|
| App agent, `heatops` | App, AWS, correct metrics, stable demo session, evidence exports | Versioned facts + raw screen captures/screenshots |
| Video agent, `heatops-video` | Remotion project, motion design, edit, captions, audio integration, MP4 render | Preview, final MP4, captions, edit source |
| Vansh | Narration, screen recording if automation unavailable, style choice, final review/upload | Voice files + approval of final cut |

The app agent does not render the submission video. The video agent does not change application code, AWS resources, metrics, or claims. A footage request is a handoff, not permission for either agent to edit the other's workspace.

## Parallel milestones

While the app is scaffolding: build title treatment, heat-band animation, the full edit skeleton, caption styles, and a small render smoke test. Use the verified synthetic fixture values only as an explicitly illustrative graphic.

When the first real agent run works: insert the first recorded clip and validate crop/readability. Keep later slots labeled as pending.

When gate correction works: replace the turning-point slot, verify the on-screen numbers, and lock that scene.

When approval/follow-up works: replace the final interaction slots and record the voice track to the near-final edit.

When the app is frozen: validate every claim against evidence, render the final 1080p MP4, and watch it in full. Video layout and transitions should already be complete at this point.

See video.md for the creative plan, handoff.md for exact assets, and video-tasks.md for production gates.

## Primary references checked 9 October 2026

- Official plugin and installation: https://www.remotion.dev/docs/ai/claude-code-plugin
- Agent skills: https://www.remotion.dev/docs/ai/skills
- Project creation: https://www.remotion.dev/docs
- Rendering CLI: https://www.remotion.dev/docs/cli/render

Use matching documentation for the installed Remotion version. Render locally first; no cloud renderer or new AWS services are needed for this video.
