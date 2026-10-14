"""Multi-source cut. EDL lines: start end [file]; file defaults to the first input. Usage: cut2.py default_in.mp4 out.mp4 edl.txt"""
import subprocess, sys
src, out, edl = sys.argv[1:4]
segs = []
for l in open(edl):
    if not l.strip() or l.startswith("#"): continue
    p = l.split()
    segs.append((float(p[0]), float(p[1]), p[2] if len(p) > 2 else src))
files = []
for _, _, f in segs:
    if f not in files: files.append(f)
parts, labels = [], ""
for i, (a, b, f) in enumerate(segs):
    k = files.index(f)
    parts.append(f"[{k}:v]trim=start={a:.3f}:end={b:.3f},setpts=PTS-STARTPTS,scale=1920:1080,fps=30[v{i}];[{k}:a]atrim=start={a:.3f}:end={b:.3f},asetpts=PTS-STARTPTS,aresample=48000,afade=t=in:st=0:d=0.012,afade=t=out:st={max(0,b-a-0.012):.3f}:d=0.012[a{i}]")
    labels += f"[v{i}][a{i}]"
graph = ";".join(parts) + f";{labels}concat=n={len(segs)}:v=1:a=1[v][a]"
gpath = out + ".graph.txt"
open(gpath, "w").write(graph)
cmd = ["ffmpeg", "-y", "-v", "error"]
for f in files: cmd += ["-i", f]
cmd += ["-/filter_complex", gpath, "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-crf", "16", "-preset", "fast", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", out]
subprocess.run(cmd, check=True)
print("total kept:", round(sum(b - a for a, b, _ in segs), 2), "s from", len(segs), "segments")
