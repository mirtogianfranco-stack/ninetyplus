#!/usr/bin/env python3
"""Royalty-free percussive bed for promo videos: kick / clap / hats / sub at 116 bpm. Usage: promo-bed.py out.wav seconds"""
import sys, numpy as np, soundfile as sf
sr = 44100; bpm = 116; beat = 60 / bpm
out, secs = sys.argv[1], float(sys.argv[2])
n = int(sr * secs); mix = np.zeros(n, dtype=np.float32); rng = np.random.default_rng(7)
def put(sig, t):
    i = int(t * sr); j = min(n, i + len(sig))
    if i < n: mix[i:j] += sig[:j - i]
tt = lambda d: np.arange(int(d * sr)) / sr
kt = tt(0.35); kick = np.sin(2 * np.pi * (45 * kt + 90 * (1 - np.exp(-kt * 30)) / 30)) * np.exp(-kt * 9)
ct = tt(0.25); clap = rng.standard_normal(len(ct)) * np.exp(-ct * 22) * 0.35
ht = tt(0.05); hat = np.diff(rng.standard_normal(len(ht) + 1)) * np.exp(-ht * 90) * 0.08
roots = [41.2, 41.2, 49.0, 36.7]  # E1 E1 G1 D1 per bar
b = 0
while b * beat < secs:
    t = b * beat; bar = b // 4
    put(kick * 0.9, t)
    if b % 4 in (1, 3): put(clap, t)
    put(hat, t + beat / 2); put(hat * 0.6, t)
    if b % 2 == 0:
        st = tt(beat * 1.8); f = roots[bar % 4]
        put((np.tanh(2.5 * np.sin(2 * np.pi * f * 2 * st)) * np.exp(-st * 1.5) * 0.25).astype(np.float32), t)
    b += 1
mix /= np.abs(mix).max() / 0.8
fade = int(sr * 1.5); mix[-fade:] *= np.linspace(1, 0, fade)
sf.write(out, np.stack([mix, mix], 1), sr)
print(out, secs)
