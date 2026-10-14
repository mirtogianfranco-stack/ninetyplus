#!/usr/bin/env bash
# Generate the voiceover with Kokoro (free, local). Reads video-projects/np-NNN/script/vo.txt, writes the raw take to
# video-projects/np-NNN/vo/raw_kokoro.wav and the loudnormed master (-16 LUFS, 48 kHz mono) to public/np-NNN/voiceover.wav.
# Usage: bash tools/tts.sh 001 [voice] [speed]     (defaults from tools/voice.conf - one voice, forever)
# Setup: bash tools/setup-kokoro.sh
set -u
cd "$(dirname "$0")/.."
n="$1"; shift
src="video-projects/np-$n/script/vo.txt"; raw="video-projects/np-$n/vo/raw_kokoro.wav"; out="public/np-$n/voiceover.wav"
[ -f "$src" ] || { echo "no $src (write the approved script there, plain text)"; exit 1; }
py=tools/kokoro-env/bin/python; [ -x "$py" ] || py=tools/kokoro-env/Scripts/python.exe
mkdir -p "$(dirname "$raw")" "$(dirname "$out")"
"$py" tools/tts.py "$src" "$raw" "$@" || exit 1
ffmpeg -v error -y -i "$raw" -af loudnorm=I=-16:TP=-1.5:LRA=11 -ar 48000 -ac 1 "$out" || exit 1
echo "wrote $out. NEXT: bash tools/voscan.sh $n, then send for approval."
