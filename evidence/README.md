# evidence/

Verified handoff data from the app workspace goes here. Nothing in this folder is invented by the video agent.

- `facts.json` — verified metrics from a captured deployed run (see `facts.template.json`).
- `evidence.json` — per-capture provenance (see `evidence.template.json`).

`npm run render:final` compares `asset-manifest.json` facts and run IDs against these files and refuses to render if they disagree or are missing.
