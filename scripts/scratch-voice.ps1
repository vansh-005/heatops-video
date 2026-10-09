# TEMPORARY scratch narration for pacing only, using the local Windows SAPI voice.
# Not the final voice. Final narration is Vansh's recording (asset-manifest narration).
# Input: out/draft/cues.json (from `npm run captions`). Output: public/audio/scratch/*.wav + src/data/scratch-voice.json
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Speech
$root = Split-Path -Parent $PSScriptRoot
$cues = Get-Content -Raw -Path (Join-Path $root "out/draft/cues.json") | ConvertFrom-Json
$outDir = Join-Path $root "public/audio/scratch"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
Get-ChildItem $outDir -Filter "cue-*.wav" | Remove-Item -Confirm:$false

$fmt = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(48000, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice("Microsoft David Desktop")

$index = @()
$i = 0
foreach ($c in $cues) {
  $i++
  $name = "cue-{0:D3}.wav" -f $i
  $path = Join-Path $outDir $name
  $window = [double]$c.end - [double]$c.start + 0.15
  $rate = 0
  do {
    $synth.Rate = $rate
    $synth.SetOutputToWaveFile($path, $fmt)
    $synth.Speak([string]$c.text)
    $synth.SetOutputToNull()
    $dur = ((Get-Item $path).Length - 44) / (48000 * 2)
    $rate++
  } while ($dur -gt $window -and $rate -le 4)
  if ($dur -gt $window) { Write-Warning ("Cue {0} runs long ({1:N2}s > {2:N2}s): {3}" -f $i, $dur, $window, $c.text) }
  $index += [pscustomobject]@{ file = "audio/scratch/$name"; start = [double]$c.start; duration = [math]::Round($dur, 3) }
}
$synth.Dispose()
$json = $index | ConvertTo-Json -Depth 3
[System.IO.File]::WriteAllText((Join-Path $root "src/data/scratch-voice.json"), $json, (New-Object System.Text.UTF8Encoding($false)))
Write-Output ("Scratch voice: {0} cues written (temporary TTS, disclose as scratch)." -f $index.Count)
