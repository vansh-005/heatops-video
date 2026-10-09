"""Natural scratch/optional narration with Kokoro-82M (Apache-2.0, runs locally, stock voice, no cloning).

Reads src/data/narration.json + asset-manifest facts, writes one WAV per scene to public/audio/voice/
and word timings to src/data/voice-timing.json (drives caption cues and animation sync).

Run: npm run voice   (uses .venv-tts)
"""
import json
import re
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro import KPipeline

ROOT = Path(__file__).resolve().parent.parent
FPS = 30
SR = 24000
SCENES = {  # keep in sync with src/data/timeline.ts
    "S01": (0, 660), "S02": (660, 360), "S03": (1020, 540), "S04": (1560, 900), "S05": (2460, 480),
    "S06": (2940, 600), "S07": (3540, 420), "S08": (3960, 660), "S09": (4620, 240), "S10": (4860, 240),
}

doc = json.loads((ROOT / "src/data/narration.json").read_text(encoding="utf8"))
facts = json.loads((ROOT / "asset-manifest.json").read_text(encoding="utf8"))["facts"]
tokens = {
    "workers": facts["workers"], "baseline": facts["baselineFlaggedWorkerHours"],
    "revised": facts["revisedFlaggedWorkerHours"], "taskHours": facts["taskWorkerHours"],
}
voice = doc["voice"]["voice"]
base_speed = float(doc["voice"].get("speed", 1.0))
only = sys.argv[1:]  # optional scene ids

pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
out_dir = ROOT / "public/audio/voice"
out_dir.mkdir(parents=True, exist_ok=True)
timing_path = ROOT / "src/data/voice-timing.json"
timing = json.loads(timing_path.read_text(encoding="utf8")) if timing_path.exists() else {}
timing_scenes = timing.get("scenes", {}) if isinstance(timing, dict) else {}


PAUSE = 1.0  # seconds of silence for each "||" beat marker in the script


def synth(text, speed, pause=PAUSE):
    chunks, words, offset = [], [], 0.0
    for i, part in enumerate(p.strip() for p in text.split("||")):
        if i > 0:
            chunks.append(np.zeros(int(pause * SR), dtype=np.float32))
            offset += pause
        for r in pipe(part, voice=voice, speed=speed, split_pattern=r"\n+"):
            a = r.audio.numpy()
            for t in r.tokens or []:
                if t.start_ts is None or not re.search(r"\w", t.text):
                    continue
                words.append({"w": t.text, "start": round(offset + t.start_ts, 3), "end": round(offset + (t.end_ts or t.start_ts), 3)})
            chunks.append(a)
            offset += len(a) / SR
    return np.concatenate(chunks), words


for sid, (start, frames) in SCENES.items():
    if only and sid not in only:
        continue
    text = re.sub(r"\{(\w+)\}", lambda m: str(tokens[m.group(1)]), doc["scenes"][sid])
    lead = float(doc["leadSeconds"].get(sid, 0.4))
    avail = frames / FPS - lead - 0.35
    speed = base_speed
    pause = float(doc.get("pauseSeconds", {}).get(sid, PAUSE))
    audio, words = synth(text, speed, pause)
    while len(audio) / SR > avail and speed < base_speed + 0.12:
        speed = round(speed + 0.03, 2)
        audio, words = synth(text, speed, pause)
    dur = len(audio) / SR
    flag = "" if dur <= avail else f"  !! {dur - avail:.2f}s too long"
    sf.write(out_dir / f"{sid}.wav", audio, SR, subtype="PCM_16")
    timing_scenes[sid] = {"file": f"audio/voice/{sid}.wav", "lead": lead, "duration": round(dur, 3), "speed": speed, "words": words}
    print(f"{sid}: {dur:5.2f}s of {avail:5.2f}s available, speed {speed}{flag}")

timing_path.write_text(json.dumps({"engine": "kokoro-82m", "voice": voice, "scenes": timing_scenes}, indent=1), encoding="utf8")
print(f"Wrote {timing_path.relative_to(ROOT)}")
