"""Contact sheet of a PDF for review: python3 tpt/sheet.py out/X.pdf [cols] -> .tmp/sheet.png"""
import subprocess, sys, tempfile, os, glob
from PIL import Image
pdf, cols = sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 8
d = tempfile.mkdtemp(); subprocess.run(["pdftoppm", "-r", "36", "-png", pdf, d + "/p"], check=True)
ims = [Image.open(f) for f in sorted(glob.glob(d + "/p-*.png"))]
w, h = ims[0].size; rows = -(-len(ims) // cols)
s = Image.new("RGB", (w * cols, h * rows), "white")
for i, im in enumerate(ims): s.paste(im, ((i % cols) * w, (i // cols) * h))
out = sys.argv[3] if len(sys.argv) > 3 else os.path.join(os.path.dirname(os.path.abspath(__file__)), ".tmp", "sheet.png")
os.makedirs(os.path.dirname(out), exist_ok=True); s.save(out); print(out, len(ims), "pages")
