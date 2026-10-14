"""Blind transcript in short non-overlapping slices. Whisper collapses a repeated phrase whenever both
copies land in the same decode; in a 2.5s slice there is nothing to collapse against, so stutters survive.
Usage: slicescan.py <wav> [slice_s]"""
import subprocess, sys, json, os, wave, shutil
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
# Whisper from tools/whisper-env (tools/setup.sh makes it), else PATH. GPU when nvidia-smi exists, else CPU (slower).
here = os.path.dirname(os.path.abspath(__file__))
cands = [os.environ.get("WHISPER_BIN", ""), here + "/whisper-env/bin/whisper", here + "/whisper-env/Scripts/whisper.exe", shutil.which("whisper") or ""]
whisper = next((c for c in cands if c and os.path.exists(c)), None)
if not whisper: sys.exit("whisper not found: run bash tools/setup.sh")
device = os.environ.get("WHISPER_DEVICE") or ("cuda" if shutil.which("nvidia-smi") else "cpu")
subprocess.run([whisper, *files, "--model", os.environ.get("WHISPER_MODEL", "medium"), "--device", device,
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
