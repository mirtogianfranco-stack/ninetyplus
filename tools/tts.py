"""Kokoro TTS (free, local, CPU). Writes a raw 24 kHz mono wav; tts.sh loudnorms it.
Usage: python tts.py <text-file|-> <out.wav> [voice] [speed]
Voice/speed default to tools/voice.conf (VOICE=..., SPEED=...). Blend voices with 'am_adam:60,bm_george:40'."""
import os, sys
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

HERE = os.path.dirname(os.path.abspath(__file__))
M = os.path.join(HERE, "kokoro-models")

def conf():
    c = {}
    p = os.path.join(HERE, "voice.conf")
    if os.path.exists(p):
        for line in open(p):
            if "=" in line and not line.lstrip().startswith("#"):
                k, v = line.split("=", 1); c[k.strip()] = v.strip()
    return c

def voice_arg(k, v):
    if ":" not in v: return v
    parts = [p.split(":") for p in v.split(",")]
    tot = sum(float(w) for _, w in parts)
    return sum(k.get_voice_style(n) * (float(w) / tot) for n, w in parts)

def main():
    c = conf()
    src, out = sys.argv[1], sys.argv[2]
    voice = sys.argv[3] if len(sys.argv) > 3 else c.get("VOICE", "bm_george")
    speed = float(sys.argv[4]) if len(sys.argv) > 4 else float(c.get("SPEED", "1.0"))
    text = sys.stdin.read() if src == "-" else open(src, encoding="utf-8").read()
    text = " ".join(text.split())
    k = Kokoro(os.path.join(M, "kokoro-v1.0.onnx"), os.path.join(M, "voices-v1.0.bin"))
    lang = "en-gb" if voice.split(":")[0].startswith("b") else "en-us"
    audio, sr = k.create(text, voice=voice_arg(k, voice), speed=speed, lang=lang)
    sf.write(out, np.asarray(audio, dtype=np.float32), sr)
    print(f"{out}: {len(audio)/sr:.1f}s voice={voice} speed={speed}")

if __name__ == "__main__":
    main()
