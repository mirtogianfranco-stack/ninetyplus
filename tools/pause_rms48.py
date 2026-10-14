"""RMS-based pause pass. Usage: pause_rms.py in16k.wav out_edl.txt [scan]
A pause = run of 20ms windows with RMS < -38 dB lasting >= 0.32s. Keep s+0.10 and e-0.16 (pause becomes 0.26s).
'scan' only lists pauses >= 0.45s (verification of a final file)."""
import sys, wave, numpy as np
src, out = sys.argv[1], sys.argv[2]
scan = len(sys.argv) > 3 and sys.argv[3] == "scan"
w = wave.open(src); sr = w.getframerate()
x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
dur = len(x) / sr
hop = int(0.02 * sr); n = len(x) // hop
rms = 20 * np.log10(np.sqrt(np.mean(x[:n*hop].reshape(n, hop) ** 2, axis=1)) + 1e-9)
quiet = rms < -48
pauses, i = [], 0
while i < n:
    if quiet[i]:
        j = i
        while j < n and quiet[j]: j += 1
        s, e = i * 0.02, j * 0.02
        if e - s >= (0.45 if scan else 0.32): pauses.append((s, e))
        i = j
    else: i += 1
if scan:
    print(f"{len(pauses)} pauses >= 0.45s:", [(round(s,2), round(e-s,2)) for s, e in pauses]); sys.exit()
segs, cur = [], 0.0
for s, e in pauses:
    if s <= 0.05: cur = max(0.0, e - 0.15); continue
    a, b = s + 0.10, e - 0.16
    if b - a <= 0.02: continue
    segs.append((cur, a)); cur = b
segs.append((cur, dur))
open(out, "w").write("\n".join(f"{a:.3f} {b:.3f}" for a, b in segs))
print(f"{len(segs)-1} pauses shortened, {dur:.2f}s -> {sum(b-a for a,b in segs):.2f}s")
