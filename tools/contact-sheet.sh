#!/usr/bin/env bash
# Contact sheet of a composition every N seconds (default 2) so the build is reviewed frame by frame BEFORE the owner sees it.
# Usage: bash tools/contact-sheet.sh 027 [step_seconds]   -> D:/ItzRockett/tmp/csNNN/sheet.png
set -u
cd "$(dirname "$0")/.."
n="$1"; step="${2:-2}"; out="D:/ItzRockett/tmp/cs$n"; mkdir -p "$out"; rm -f "$out"/f*.png
dur=$(node -e "const e=require('./out/edit.cjs')['video$n'];console.log(Math.floor(e.endSec))")
for t in $(seq 1 "$step" "$dur"); do f=$((t*30)); bash D:/ItzRockett/tools/d-env.sh npx remotion still D:/ItzRockett/projects/build "Video$n" "$out/f$(printf %04d $f).png" --frame=$f --log=error --timeout=120000 2>&1 | grep -iE "error|fail"; done
python - "$out" <<'EOF'
import sys,glob,os
from PIL import Image, ImageDraw
out=sys.argv[1]; fs=sorted(glob.glob(out+"/f*.png")); W,H=180,320; cols=10; rows=(len(fs)+cols-1)//cols
im=Image.new("RGB",(cols*W,rows*H),"black"); d=ImageDraw.Draw(im)
for i,f in enumerate(fs):
    im.paste(Image.open(f).resize((W,H)),((i%cols)*W,(i//cols)*H)); d.text(((i%cols)*W+4,(i//cols)*H+4),str(int(os.path.basename(f)[1:5])//30)+"s",fill="yellow")
im.save(out+"/sheet.png"); print(out+"/sheet.png", len(fs), "frames")
EOF
