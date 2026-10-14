#!/usr/bin/env python3
"""Local Kokoro TTS (kokoro-onnx, model v1.0). Runs in tools/kokoro-env.

  tools/kokoro-env/bin/python tools/tts.py --voice am_michael --text "..." --out public/np-001/voiceover.wav
  tools/kokoro-env/bin/python tools/tts.py --voice am_michael --file video-projects/np-001/script.txt --out ...

Model files live in .cache/kokoro (gitignored); tools/setup-kokoro.sh fetches them.
"""
import argparse
import os
import sys

import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(ROOT, '.cache', 'kokoro')


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--voice', required=True)
    p.add_argument('--text')
    p.add_argument('--file')
    p.add_argument('--speed', type=float, default=1.0)
    p.add_argument('--lang', default=None, help='en-us or en-gb; default follows the voice prefix')
    p.add_argument('--out', required=True)
    a = p.parse_args()
    text = a.text if a.text else open(a.file, encoding='utf-8').read()
    if not text.strip():
        sys.exit('no text')
    lang = a.lang or ('en-gb' if a.voice.startswith('b') else 'en-us')
    k = Kokoro(os.path.join(MODEL_DIR, 'kokoro-v1.0.onnx'), os.path.join(MODEL_DIR, 'voices-v1.0.bin'))
    samples, rate = k.create(text, voice=a.voice, speed=a.speed, lang=lang)
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    sf.write(a.out, samples, rate)
    print(f'{a.out}: {len(samples) / rate:.1f}s @ {rate}Hz, voice {a.voice}')


if __name__ == '__main__':
    main()
