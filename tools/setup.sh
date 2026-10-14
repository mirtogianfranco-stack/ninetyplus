#!/usr/bin/env bash
# One-time machine setup: node packages, the Whisper env used by slicescan.py, and a check for ffmpeg/ffprobe.
# Usage: bash tools/setup.sh        (safe to re-run)
set -u
cd "$(dirname "$0")/.."
npm install --no-audit --no-fund || exit 1
command -v ffmpeg >/dev/null && command -v ffprobe >/dev/null || echo "MISSING: ffmpeg/ffprobe must be on PATH"
if [ ! -x tools/whisper-env/bin/whisper ] && [ ! -x tools/whisper-env/Scripts/whisper.exe ]; then
  py=$(command -v python3.11 || command -v python3)
  "$py" -m venv tools/whisper-env && { tools/whisper-env/bin/pip install -q openai-whisper || tools/whisper-env/Scripts/pip install -q openai-whisper; }
fi
python3 -c "import PIL, numpy" 2>/dev/null || pip install -q pillow numpy
echo "setup done"
