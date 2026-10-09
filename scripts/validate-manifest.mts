// Manifest + evidence validation.
//   node scripts/validate-manifest.mts          -> draft report, exits 0
//   node scripts/validate-manifest.mts --final  -> exits 1 on any problem (blocks render:final)
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const FINAL = process.argv.includes("--final");
const FPS = 30;
// Frames each footage slot must fill (S04's slot is the 525-frame middle of its 900-frame scene).
const SLOT_FRAMES: Record<string, number> = { S02: 480, S03: 600, S04: 525, S05: 600, S06: 720, S07: 480, S09: 240 };

const m = JSON.parse(readFileSync("asset-manifest.json", "utf8"));
const narrationDoc = JSON.parse(readFileSync("src/data/narration.json", "utf8"));
const problems: string[] = [];
const notes: string[] = [];
const bad = (s: string) => problems.push(s);

const probeDuration = (file: string): number | null => {
  try {
    const out = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file], {
      encoding: "utf8",
    });
    return parseFloat(out.trim());
  } catch {
    return null;
  }
};

// Composition
const comp = m.composition;
if (comp.id !== "HeatOpsDemo" || comp.width !== 1920 || comp.height !== 1080 || comp.fps !== 30 || comp.durationInFrames !== 5100) {
  bad("composition metadata differs from 1920x1080 / 30 fps / 5100 frames");
}
if (m.mode !== "final") bad(`manifest.mode is "${m.mode}" (must be "final")`);
if (!m.finalRenderAllowed) bad("finalRenderAllowed is false");

// Facts
const f = m.facts;
if (!f.verified || f.status === "expected_fixture_only") bad(`facts not verified (status: ${f.status})`);
const factsPath = "evidence/facts.json";
if (!existsSync(factsPath)) {
  bad(`${factsPath} missing (verified export from the app handoff)`);
} else {
  const src = JSON.parse(readFileSync(factsPath, "utf8"));
  for (const k of ["workers", "baselineFlaggedWorkerHours", "revisedFlaggedWorkerHours", "taskWorkerHours", "sourceMode"]) {
    if (src[k] === undefined) bad(`facts.json lacks ${k}`);
    else if (src[k] !== f[k]) bad(`manifest facts.${k}=${f[k]} does not match facts.json ${src[k]}`);
  }
}
const pct = Math.round(((f.baselineFlaggedWorkerHours - f.revisedFlaggedWorkerHours) / f.baselineFlaggedWorkerHours) * 1000) / 10;
if (pct !== f.reductionPercentDisplay) bad(`reductionPercentDisplay ${f.reductionPercentDisplay} != computed ${pct}`);
if (f.sourceMode !== "synthetic") notes.push(`sourceMode is ${f.sourceMode}: update ScenarioBadge copy to match`);

// Evidence
const evidencePath = "evidence/evidence.json";
const evidence = existsSync(evidencePath) ? JSON.parse(readFileSync(evidencePath, "utf8")) : null;
if (!evidence) bad(`${evidencePath} missing (capture IDs, run IDs, capturedAt, source in/out)`);

// Clips
const runIds: Record<string, string | null> = {};
for (const c of m.clips) {
  const tag = `${c.shotId}`;
  runIds[c.shotId] = c.runId;
  const file = join("public", c.path);
  if (c.status !== "ready") {
    bad(`${tag}: status "${c.status}" — ${c.path} not supplied`);
    continue;
  }
  if (!existsSync(file)) {
    bad(`${tag}: file ${file} does not exist`);
    continue;
  }
  if (c.kind === "real_capture_required" && !c.verified) bad(`${tag}: real capture not marked verified`);
  if (!c.runId) bad(`${tag}: runId missing`);
  if (!c.capturedAt) bad(`${tag}: capturedAt missing`);
  const segs = c.segments?.length ? c.segments : c.sourceInSeconds != null ? [{ in: c.sourceInSeconds, out: c.sourceOutSeconds }] : [];
  if (segs.length === 0) bad(`${tag}: no trim range (sourceIn/Out or segments)`);
  const dur = probeDuration(file);
  if (dur === null) bad(`${tag}: ffprobe could not read ${file}`);
  let frames = 0;
  for (const s of segs) {
    if (s.out <= s.in) bad(`${tag}: segment out <= in`);
    if (dur !== null && s.out > dur + 0.05) bad(`${tag}: segment out ${s.out}s beyond file duration ${dur.toFixed(2)}s`);
    frames += Math.round(((s.out - s.in) * FPS) / (s.rate ?? 1));
  }
  const need = SLOT_FRAMES[c.shotId];
  if (need && frames < need) bad(`${tag}: trimmed footage ${frames} frames < slot ${need} frames`);
  if (segs.length > 1 && !segs.some((s: { shortened?: boolean }) => s.shortened)) {
    notes.push(`${tag}: multiple segments without a 'shortened' label — confirm cuts don't hide processing time`);
  }
  if (evidence && !JSON.stringify(evidence).includes(String(c.runId))) bad(`${tag}: runId ${c.runId} not found in evidence.json`);
}
if (runIds.S09 && runIds.S09 !== runIds.S03 && runIds.S09 !== runIds.S04) bad("S09 AWS evidence run ID does not match S03/S04 run");

// Narration + captions
const n = m.narration;
if (n.status !== "ready" || !n.finalApproved) bad("final narration not ready/approved");
else if (!existsSync(join("public", n.path))) bad(`narration file public/${n.path} missing`);
else {
  const d = probeDuration(join("public", n.path));
  if (d !== null && d + (n.offsetSeconds ?? 0) > 170) bad(`narration runs ${d.toFixed(1)}s past the 170s cut`);
}
if (narrationDoc.status !== "aligned_to_final_audio") bad(`captions not aligned to final audio (narration.json status: ${narrationDoc.status})`);
if (!f.appUrl) notes.push("facts.appUrl is null: closing card omits the URL in final mode");

console.log(`HeatOps manifest check (${FINAL ? "FINAL" : "draft"} mode)`);
for (const s of notes) console.log(`  note: ${s}`);
if (problems.length === 0) {
  console.log("  OK — all final-render gates pass.");
} else {
  console.log(`  ${problems.length} blocking issue(s) for final render:`);
  for (const p of problems) console.log(`  - ${p}`);
}
if (FINAL && problems.length > 0) {
  console.error("\nFinal render BLOCKED. Draft preview remains available: npm run render:draft");
  process.exit(1);
}
