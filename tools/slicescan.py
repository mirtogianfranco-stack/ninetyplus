"""Blind transcript in short non-overlapping slices. Whisper collapses a repeated phrase whenever both
copies land in the same decode; in a 2.5s slice there is nothing to collapse against, so stutters survive.
Usage: slicescan.py <wav> [slice_s]"""
import subprocess, sys, json, os, wave
src = sys.argv[1]; SL = float(sys.argv[2]) if len(sys.argv) > 2 else 2.5
base = os.path.dirname(os.path.abspath(src)) + "/"
out = base + "slice/"; os.makedirs(out, exist_ok=True)
for f in os.listdir(out): os.remove(out + f)
w = wave.open(src); dur = w.getnframes() / w.getframerate(); w.close()
files, starts = [], []
t = 0.0
while t < dur:
    f = out + "s_%07.2f.wav" % t
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", src, "-ss", "%.3f" % t, "-to", "%.3f" % min(dur, t + SL), f], check=True)
    files.append(f); starts.append(t); t += SL
subprocess.run(["D:/ItzRockett/tools/whisper-env/Scripts/whisper.exe", *files, "--model", "medium", "--device", "cuda",
                "--word_timestamps", "True", "--condition_on_previous_text", "False", "--output_format", "json",
                "--output_dir", out, "--language", "en"], check=True, capture_output=True)
line = []
for a, f in zip(starts, files):
    d = json.load(open(f[:-4] + ".json", encoding="utf-8"))
    for s in d["segments"]:
        for x in s.get("words", []):
            line.append("%s@%.2f" % (x["word"].strip(), x["start"] + a))
for i in range(0, len(line), 9):
    print(" ".join(line[i:i + 9]))
