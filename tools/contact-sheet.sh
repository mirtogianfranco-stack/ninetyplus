#!/usr/bin/env bash
# Contact sheet of a video every N seconds (default 2) so the build is reviewed frame by frame BEFORE it goes for review.
# Usage: bash tools/contact-sheet.sh 001 [step_seconds]   -> .tmp/cs001/sheet.png
# Needs out/edit.cjs from the same video (run tools/gate.sh first).
set -u
cd "$(dirname "$0")/.."
n="$1"; step="${2:-2}"; out=".tmp/cs$n"; mkdir -p "$out"; rm -f "$out"/f*.png
dur=$(node -e "const e=require('./out/edit.cjs')['np$n'];console.log(Math.floor(e.endSec))")
fps=$(node -e "const e=require('./out/edit.cjs')['np$n'];console.log(e.fps||30)")
npx remotion bundle src/index.ts --out-dir build --log=error >/dev/null || exit 1
for t in $(seq 1 "$step" "$dur"); do f=$((t*fps)); bash tools/d-env.sh npx remotion still build "NP$n" "$out/f$(printf %05d $f).png" --frame=$f --log=error --timeout=120000 2>&1 | grep -iE "error|fail"; done
python3 - "$out" "$fps" <<'PY'
import sys,glob,os
from PIL import Image, ImageDraw
out=sys.argv[1]; fps=int(sys.argv[2]); fs=sorted(glob.glob(out+"/f*.png")); W,H=180,320; cols=10; rows=(len(fs)+cols-1)//cols
im=Image.new("RGB",(cols*W,max(1,rows)*H),"black"); d=ImageDraw.Draw(im)
for i,f in enumerate(fs):
    im.paste(Image.open(f).resize((W,H)),((i%cols)*W,(i//cols)*H)); d.text(((i%cols)*W+4,(i//cols)*H+4),str(int(os.path.basename(f)[1:6])//fps)+"s",fill="yellow")
im.save(out+"/sheet.png"); print(out+"/sheet.png", len(fs), "frames")
PY
