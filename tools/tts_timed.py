#!/usr/bin/env python3
"""Script -> voiceover.wav + word timings, with no transcription step (the Kokoro export has no duration output).

  tools/kokoro-env/bin/python tools/tts_timed.py <script.txt> <out.wav> <words.json> [--voice bm_george] [--gap 0.10]

script.txt: one line per sentence, 'caption text || spoken text' when the spelling must change for pronunciation
(both sides must have the same word count). Every clause (split at , . ? !) is synthesized on its own, so clause
edges are exact; words inside a clause are spread by phoneme length over the clause's voiced span.
"""
import argparse, json, os, re
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
M = os.path.join(ROOT, '.cache', 'kokoro')

def voiced_span(a, sr):
    win = int(sr * 0.01); n = len(a) // win
    rms = np.array([np.sqrt(np.mean(a[i*win:(i+1)*win] ** 2)) for i in range(n)]) if n else np.zeros(1)
    thr = max(rms.max() * 0.06, 1e-4); on = np.where(rms > thr)[0]
    return (0, len(a)) if len(on) == 0 else (on[0] * win, min(len(a), (on[-1] + 1) * win))

def main():
    p = argparse.ArgumentParser()
    p.add_argument('script'); p.add_argument('out'); p.add_argument('words')
    p.add_argument('--voice', default='bm_george'); p.add_argument('--speed', type=float, default=1.05)
    p.add_argument('--gap', type=float, default=0.10, help='pause after a comma clause')
    p.add_argument('--sentence-gap', type=float, default=0.22)
    a = p.parse_args()
    lang = 'en-gb' if a.voice.startswith('b') else 'en-us'
    k = Kokoro(os.path.join(M, 'kokoro-v1.0.onnx'), os.path.join(M, 'voices-v1.0.bin'))
    sr = 24000; out = []; words = []; t = 0.0
    lines = [l.strip() for l in open(a.script, encoding='utf-8') if l.strip()]
    for li, line in enumerate(lines):
        cap, spk = (line.split('||') + [None])[:2]
        cap = cap.strip(); spk = (spk or cap).strip()
        cc = re.findall(r'[^,.?!]+[,.?!]*', cap); sc = re.findall(r'[^,.?!]+[,.?!]*', spk)
        assert len(cc) == len(sc), f'clause mismatch: {line}'
        for ci, (c, s) in enumerate(zip(cc, sc)):
            cw, sw = c.split(), s.split()
            assert len(cw) == len(sw), f'word mismatch: {c} / {s}'
            audio, _ = k.create(s.strip(), voice=a.voice, speed=a.speed, lang=lang)
            b, e = voiced_span(audio, sr); audio = audio[max(0, b - int(0.03*sr)):e + int(0.05*sr)]
            b, e = voiced_span(audio, sr)
            lens = [max(1, len(k.tokenizer.phonemize(w.strip(',.?!'), lang))) for w in sw]
            tot = sum(lens); span = (e - b) / sr; x = t + b / sr
            for w, L in zip(cw, lens):
                d = span * L / tot; words.append({'word': w, 'start': round(x, 3), 'end': round(x + d - 0.02, 3)}); x += d
            out.append(audio); t += len(audio) / sr
            last = ci == len(cc) - 1
            g = (a.sentence_gap if li < len(lines) - 1 else 0.15) if last else a.gap
            out.append(np.zeros(int(g * sr), dtype=np.float32)); t += g
    sf.write(a.out, np.concatenate(out), sr)
    json.dump({'words': words, 'duration': round(t, 3)}, open(a.words, 'w'), indent=1)
    print(f'{a.out}: {t:.2f}s, {len(words)} words')

if __name__ == '__main__':
    main()
