#!/usr/bin/env python3
"""Original synthesized music bed (no samples, nothing to Content-ID): 140 BPM minor hype beat.

usage: python3 tools/make-beat.py <out.wav> <seconds> [--drop SEC] [--bpm 140] [--seed N]
Before --drop: dark pad + riser only. From --drop: kick, clap, hats, 808 bass, pad. Last 1.5s fades out.
"""
import argparse
import wave

import numpy as np

SR = 48000
p = argparse.ArgumentParser()
p.add_argument('out')
p.add_argument('seconds', type=float)
p.add_argument('--drop', type=float, default=0.0)
p.add_argument('--bpm', type=float, default=140)
p.add_argument('--seed', type=int, default=9)
a = p.parse_args()
rng = np.random.default_rng(a.seed)

n = int(a.seconds * SR)
mix = np.zeros(n)
beat = 60.0 / a.bpm
t_of = lambda s: int(s * SR)


def add(sig, at, gain=1.0):
    i = t_of(at)
    if i >= n:
        return
    seg = sig[: n - i]
    mix[i : i + len(seg)] += seg * gain


def env(length, attack=0.002, decay=0.2):
    t = np.arange(int(length * SR)) / SR
    return np.minimum(1, t / attack) * np.exp(-t / decay)


def kick():
    L = 0.45
    t = np.arange(int(L * SR)) / SR
    f = 45 + 110 * np.exp(-t / 0.04)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(L, 0.001, 0.16)


def clap():
    L = 0.25
    x = rng.standard_normal(int(L * SR))
    x = np.convolve(x, [1, -0.6], 'same')  # brighten
    e = env(L, 0.001, 0.06)
    for off in (0.01, 0.02):  # three-slap clap
        k = t_of(off)
        e[k:] += 0.6 * env(L - off, 0.001, 0.05)
    return x * e * 0.5


def hat(open_=False):
    L = 0.18 if open_ else 0.05
    x = rng.standard_normal(int(L * SR))
    x = x - np.convolve(x, np.ones(8) / 8, 'same')  # crude high-pass
    return x * env(L, 0.0005, 0.06 if open_ else 0.012) * 0.35


def bass(freq, L):
    t = np.arange(int(L * SR)) / SR
    f = freq * (1 + 0.5 * np.exp(-t / 0.02))  # 808 pitch drop
    s = np.tanh(1.8 * np.sin(2 * np.pi * np.cumsum(f) / SR))
    return s * env(L, 0.003, L * 0.7)


def pad(freqs, L):
    t = np.arange(int(L * SR)) / SR
    s = sum(np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2.003 * f * t) for f in freqs)
    fade = np.minimum(1, t / 0.3) * np.minimum(1, (L - t) / 0.3)
    return s / len(freqs) * fade * 0.18


# A minor: Am - F - C - G, one bar (4 beats) each
prog = [(110.0, [220.0, 261.6, 329.6]), (87.31, [174.6, 220.0, 261.6]), (65.41, [196.0, 261.6, 329.6]), (98.0, [196.0, 246.9, 293.7])]
bar = 4 * beat
nbars = int(a.seconds / bar) + 2
for b in range(nbars):
    root, chord = prog[b % 4]
    add(pad(chord, bar), b * bar)

# Riser into the drop
if a.drop > 0.6:
    L = min(a.drop, 2.4)
    t = np.arange(int(L * SR)) / SR
    noise = rng.standard_normal(len(t))
    noise = noise - np.convolve(noise, np.ones(4) / 4, 'same')
    add(noise * (t / L) ** 2 * 0.25, a.drop - L)
    add(kick() * 1.4, a.drop)  # impact on the drop

steps = int((a.seconds - a.drop) / (beat / 4)) + 1
for k in range(steps):
    at = a.drop + k * beat / 4
    s16 = k % 16
    b = int((at - 0) / bar)
    root = prog[b % 4][0]
    if s16 in (0, 6, 10) or (s16 == 14 and (k // 16) % 2):
        add(kick(), at)
    if s16 in (4, 12):
        add(clap(), at)
    add(hat(open_=(s16 == 14)), at, 0.9 if s16 % 4 == 2 else 0.6)
    if s16 in (0, 6, 10):
        add(bass(root / 2, beat * (1.4 if s16 == 0 else 1.0)), at, 0.55)

# master: fade out, soft-clip, normalise to -3 dBFS peak
fo = int(1.5 * SR)
mix[-fo:] *= np.linspace(1, 0, fo)
mix = np.tanh(mix * 1.2)
mix *= 10 ** (-3 / 20) / max(1e-9, np.abs(mix).max())
pcm = (mix * 32767).astype('<i2')
with wave.open(a.out, 'wb') as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(a.out, f'{a.seconds:.2f}s', f'drop@{a.drop:.2f}s', f'{a.bpm:.0f} BPM')
