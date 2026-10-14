#!/usr/bin/env bash
# One-time Kokoro TTS setup (free, local, CPU): venv in tools/kokoro-env + model files in tools/kokoro-models (~350 MB).
set -u
cd "$(dirname "$0")/.."
if [ ! -x tools/kokoro-env/bin/python ] && [ ! -x tools/kokoro-env/Scripts/python.exe ]; then
  py=$(command -v python3.11 || command -v python3)
  "$py" -m venv tools/kokoro-env
  { tools/kokoro-env/bin/pip install -q kokoro-onnx soundfile || tools/kokoro-env/Scripts/pip install -q kokoro-onnx soundfile; } || exit 1
fi
mkdir -p tools/kokoro-models
for f in kokoro-v1.0.onnx voices-v1.0.bin; do
  [ -s "tools/kokoro-models/$f" ] || curl -sSLf -o "tools/kokoro-models/$f" \
    "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/$f" || { echo "download failed: $f"; exit 1; }
done
echo "kokoro ready"
