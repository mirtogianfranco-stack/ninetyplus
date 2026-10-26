#!/usr/bin/env python3
"""Original synthesized music bed (no samples, nothing to Content-ID). A different beat every video.

usage: python3 tools/make-beat.py <out.wav> <seconds> [--drop SEC] [--drops S1,S2,...] [--style NAME] [--seed N] [--bpm N]
  --drop   first drop (the hook word); --drops adds more (e.g. each pick's scene start). Before every drop the drums cut
           out for a short breakdown with a riser, then an impact + the full beat returns.
  --style  trap | drill | house | phonk | edm (default: picked from the seed, so each video sounds different)
  --seed   also picks the key, tempo and the melody. Use the video number (np-017 -> 17).
Last 1.5 s fades out. Output 48 kHz mono, -3 dBFS peak.
"""
import argparse
import wave

import numpy as np

SR = 48000
STYLES = {
    #        bpm range   kick pattern (16 steps)                        clap steps   hat mode   bass      lead
    'trap':  ((136, 146), [0, 6, 10],                                   [8],          'roll',   '808',    'pluck'),
    'drill': ((140, 146), [0, 3, 10, 13],                               [4, 12],      'triplet', 'slide', 'bell'),
    'house': ((122, 126), [0, 4, 8, 12],                                [4, 12],      'offbeat', 'sub',   'stab'),
    'phonk': ((128, 136), [0, 6, 8, 11],                                [4, 12],      'straight', '808',  'cowbell'),
    'edm':   ((126, 130), [0, 4, 8, 12],                                [4, 12],      'offbeat', 'saw',   'supersaw'),
}
KEYS = {'A': 110.0, 'C': 130.81, 'D': 146.83, 'E': 164.81, 'F': 87.31, 'G': 98.0, 'B': 123.47}
# minor progressions as semitone offsets from the root (i - VI - III - VII and friends)
PROGS = [[0, 8, 3, 10], [0, 5, 8, 7], [0, 10, 8, 7], [0, 3, 10, 8]]

p = argparse.ArgumentParser()
p.add_argument('out')
p.add_argument('seconds', type=float)
p.add_argument('--drop', type=float, default=0.0)
p.add_argument('--drops', default='')
p.add_argument('--style', default='')
p.add_argument('--bpm', type=float, default=0)
p.add_argument('--seed', type=int, default=9)
a = p.parse_args()
rng = np.random.default_rng(a.seed)
style = a.style or list(STYLES)[a.seed % len(STYLES)]
(blo, bhi), KICK, CLAP, HATS, BASS, LEAD = STYLES[style]
bpm = a.bpm or float(rng.integers(blo, bhi + 1))
key = list(KEYS)[a.seed % len(KEYS)]
root = KEYS[key]
prog = PROGS[(a.seed // len(STYLES)) % len(PROGS)]
drops = sorted({round(x, 3) for x in ([a.drop] if a.drop > 0 else []) + [float(x) for x in a.drops.split(',') if x.strip()]})

n = int(a.seconds * SR)
mix = np.zeros(n)
beat = 60.0 / bpm
step = beat / 4
bar = 4 * beat
semi = lambda f, s: f * 2 ** (s / 12)
T = lambda L: np.arange(int(L * SR)) / SR


def add(sig, at, gain=1.0):
    i = int(at * SR)
    if i >= n or i + len(sig) <= 0:
        return
    if i < 0:
        sig, i = sig[-i:], 0
    seg = sig[: n - i]
    mix[i:i + len(seg)] += seg * gain


def env(L, att=0.002, dec=0.2):
    t = T(L)
    return np.minimum(1, t / att) * np.exp(-t / dec)


def hp(x, k=8):
    return x - np.convolve(x, np.ones(k) / k, 'same')


def kick(punch=1.0):
    L = 0.45; t = T(L)
    f = 45 + 120 * punch * np.exp(-t / 0.035)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(L, 0.001, 0.17)


def clap():
    L = 0.25; x = hp(rng.standard_normal(int(L * SR)), 4)
    e = env(L, 0.001, 0.06)
    for off in (0.01, 0.022):
        k = int(off * SR); e[k:] += 0.6 * env(L - off, 0.001, 0.05)
    return x * e * 0.5


def hat(open_=False):
    L = 0.2 if open_ else 0.05
    return hp(rng.standard_normal(int(L * SR))) * env(L, 0.0005, 0.07 if open_ else 0.012) * 0.33


def bass_note(freq, L, slide_to=None):
    t = T(L)
    if BASS in ('808', 'slide'):
        f = freq * (1 + 0.5 * np.exp(-t / 0.02))
        if slide_to:
            f = f * (1 + (slide_to / freq - 1) * np.clip((t - L * 0.6) / (L * 0.3), 0, 1))
        return np.tanh(1.8 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * env(L, 0.003, L * 0.7)
    if BASS == 'saw':
        ph = (np.cumsum(np.full(len(t), freq)) / SR) % 1
        s = 2 * ph - 1
        return np.convolve(s, np.ones(24) / 24, 'same') * env(L, 0.005, L * 0.6) * 0.8
    return np.sin(2 * np.pi * freq * t) * env(L, 0.005, L * 0.5)  # sub


def lead_note(freq, L):
    t = T(L)
    if LEAD == 'pluck':
        return (np.sin(2 * np.pi * freq * t) + 0.4 * np.sin(4 * np.pi * freq * t)) * env(L, 0.002, 0.12) * 0.22
    if LEAD == 'bell':
        return (np.sin(2 * np.pi * freq * t + 2 * np.sin(2 * np.pi * freq * 3.5 * t) * np.exp(-t / 0.2))) * env(L, 0.002, 0.35) * 0.18
    if LEAD == 'cowbell':
        return (np.sign(np.sin(2 * np.pi * freq * t)) + np.sign(np.sin(2 * np.pi * freq * 1.48 * t))) * env(L, 0.001, 0.09) * 0.07
    if LEAD == 'stab':
        s = sum(np.sin(2 * np.pi * semi(freq, k) * t) for k in (0, 3, 7))
        return s * env(L, 0.003, 0.09) * 0.12
    # supersaw
    s = sum(((np.cumsum(np.full(len(t), freq * d)) / SR) % 1) * 2 - 1 for d in (0.99, 1.0, 1.01))
    return np.convolve(s, np.ones(6) / 6, 'same') * env(L, 0.01, 0.25) * 0.09


def pad(freqs, L):
    t = T(L)
    s = sum(np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2.003 * f * t) for f in freqs)
    return s / len(freqs) * np.minimum(1, t / 0.3) * np.minimum(1, (L - t) / 0.3) * 0.15


def riser(L):
    t = T(L)
    noise = hp(rng.standard_normal(len(t)), 3) * (t / L) ** 2 * 0.22
    sweep = np.sin(2 * np.pi * np.cumsum(200 + 1800 * (t / L) ** 2) / SR) * (t / L) ** 3 * 0.08
    return noise + sweep


def impact():
    L = 1.2; t = T(L)
    boom = np.sin(2 * np.pi * np.cumsum(40 + 60 * np.exp(-t / 0.08)) / SR) * env(L, 0.001, 0.45)
    crash = hp(rng.standard_normal(len(t)), 2) * env(L, 0.001, 0.35) * 0.25
    return boom * 1.2 + crash


# Sections: full beat everywhere except a breakdown before each drop (and before the first drop: intro).
BREAK = min(1.0, 2 * beat)
quiet = []  # (start, end) with no drums
if drops:
    quiet.append((0.0, drops[0]))
    for d in drops[1:]:
        quiet.append((max(0.0, d - BREAK), d))
in_quiet = lambda x: any(s <= x < e for s, e in quiet)

# harmony + melody (always on), drums + bass (off in breakdowns)
mel = [int(x) for x in rng.choice([0, 3, 5, 7, 10, 12], size=8)]
for b in range(int(a.seconds / bar) + 2):
    deg = prog[b % len(prog)]
    ch = semi(root * 2, deg)
    add(pad([ch, semi(ch, 3), semi(ch, 7)], bar), b * bar)
k = 0
while k * step < a.seconds:
    at = k * step
    s16 = k % 16
    b = int(at / bar)
    deg = prog[b % len(prog)]
    quietnow = in_quiet(at)
    # lead: 8th-note riff, quieter in breakdowns
    if s16 % 2 == 0 and (s16 // 2) % 8 in (0, 2, 3, 5, 7):
        add(lead_note(semi(root * 4, deg + mel[(s16 // 2) % 8]), step * 1.8), at, 0.5 if quietnow else 1.0)
    if not quietnow:
        if s16 in KICK:
            add(kick(), at)
        if s16 in CLAP:
            add(clap(), at)
        if HATS == 'roll':
            add(hat(), at, 0.8 if s16 % 4 == 2 else 0.5)
            if s16 in (14, 15) and b % 2:
                add(hat(), at + step / 2, 0.5)
        elif HATS == 'triplet':
            for j in range(3) if s16 % 4 == 0 else []:
                add(hat(), at + j * beat / 3, 0.55)
        elif HATS == 'offbeat':
            if s16 % 4 == 2:
                add(hat(open_=True), at, 0.7)
            add(hat(), at, 0.3)
        else:
            add(hat(), at, 0.55)
        if s16 in KICK:
            nxt = semi(root / 2, prog[(b + 1) % len(prog)]) if (BASS == 'slide' and s16 == KICK[-1]) else None
            add(bass_note(semi(root / 2, deg), step * (6 if s16 == 0 else 3), nxt), at, 0.5)
    k += 1

for d in drops:
    L = min(d, 2.4) if d == drops[0] else BREAK
    add(riser(L), d - L)
    add(impact(), d, 0.9)

fo = int(1.5 * SR)
mix[-fo:] *= np.linspace(1, 0, fo)
mix = np.tanh(mix * 1.15)
mix *= 10 ** (-3 / 20) / max(1e-9, np.abs(mix).max())
with wave.open(a.out, 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print(a.out, f'{a.seconds:.2f}s', f'style={style}', f'{bpm:.0f} BPM', f'key={key} minor', 'drops@' + ','.join(f'{d:.2f}' for d in drops))
