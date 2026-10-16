#!/usr/bin/env bash
# Promo voiceovers: src/promo/ilcampo-scripts.json -> public/promo/ilcampo/<id>.wav + src/promo/vo/<id>.json (word timings).
set -euo pipefail
cd "$(dirname "$0")/.."
VOICE=${VOICE:-bm_george}
mkdir -p .tmp/promo src/promo/vo public/promo/ilcampo
for id in $(python3 -c "import json;print(' '.join(v['id'] for v in json.load(open('src/promo/ilcampo-scripts.json'))['videos']))"); do
  python3 -c "import json,sys;v=[v for v in json.load(open('src/promo/ilcampo-scripts.json'))['videos'] if v['id']=='$id'][0];print('\n'.join(l for s in v['scenes'] for l in s['lines']))" > .tmp/promo/$id.txt
  tools/kokoro-env/bin/python tools/tts_timed.py .tmp/promo/$id.txt public/promo/ilcampo/$id.wav src/promo/vo/$id.json --voice "$VOICE" --sentence-gap 0.3
done
