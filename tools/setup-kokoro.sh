#!/usr/bin/env bash
# Local AI voice: kokoro-onnx venv in tools/kokoro-env + Kokoro v1.0 model in .cache/kokoro.
# Model comes from the kokoro-onnx GitHub release (works where huggingface.co is blocked).
set -euo pipefail
cd "$(dirname "$0")/.."
PY=$(command -v python3.11 || command -v python3)
[ -x tools/kokoro-env/bin/python ] || "$PY" -m venv tools/kokoro-env
tools/kokoro-env/bin/pip install -q kokoro-onnx soundfile
mkdir -p .cache/kokoro
REL=https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0
for f in kokoro-v1.0.onnx voices-v1.0.bin; do
  [ -s ".cache/kokoro/$f" ] || curl -fSL -o ".cache/kokoro/$f" "$REL/$f"
done
echo "kokoro ready: tools/kokoro-env/bin/python tools/tts.py --voice <id> --text '...' --out x.wav"
