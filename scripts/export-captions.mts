// Builds caption cues from src/data/narration.json + manifest facts.
// Writes the SRT (draft path until aligned to final audio) and out/draft/cues.json (input for scratch voice).
// Run: node scripts/export-captions.mts
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { buildCues, toSrt } from "../src/data/captions.ts";
import { FPS, SCENES } from "../src/data/timeline.ts";

const manifest = JSON.parse(readFileSync("asset-manifest.json", "utf8"));
const narration = JSON.parse(readFileSync("src/data/narration.json", "utf8"));
const voice = JSON.parse(readFileSync("src/data/voice-timing.json", "utf8"));

const cues = buildCues(narration, SCENES, manifest.facts, FPS, manifest.narration.kind === "recorded" ? null : voice.scenes);
mkdirSync("out/draft", { recursive: true });
// Only captions aligned to the final recorded voice go to the final output path.
// AI-voice captions come from the voice's own word timings, so they're final once that narration is approved.
const n = manifest.narration;
const finalCaptions =
  n.kind === "recorded" ? narration.status === "aligned_to_final_audio" : n.status === "ready" && n.finalApproved;
const srtPath = finalCaptions ? "out/heatops-captions.srt" : "out/draft/heatops-captions-draft.srt";
writeFileSync(srtPath, toSrt(cues), "utf8");
writeFileSync("out/draft/cues.json", JSON.stringify(cues, null, 2), "utf8");

const words = cues.reduce((n, c) => n + c.text.split(/\s+/).length, 0);
console.log(`Captions: ${cues.length} cues, ${words} words -> ${srtPath}`);
const short = cues.filter((c) => c.end - c.start < 0.8);
if (short.length) console.warn(`Note: ${short.length} cues shorter than 0.8s:`, short.map((c) => c.text));
