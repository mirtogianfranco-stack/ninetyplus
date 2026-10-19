"""Bundle listing kit: collage cover, what's-inside list, value card, sample thumb, preview PDF.
Usage from Python: make_bundle(slug, title, subtitle, items=[(pdf_slug, label, price)], bundle_price, colours)."""
import glob, os, subprocess, tempfile
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import Color
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

HERE = os.path.dirname(os.path.abspath(__file__)); F = os.path.join(HERE, "kit", "fonts"); OUT = os.path.join(HERE, "out")
S = 1600
anton = lambda n: ImageFont.truetype(f"{F}/anton-400.ttf", n)
bold = lambda n: ImageFont.truetype(f"{F}/Andika-Bold.ttf", n)


def make_bundle(slug, title, subtitle, items, bundle_price, dark, primary, stripe, accent, sample_thumb,
                bullets=("No prep: print & go", "Answer keys included", "Canadian spelling & content")):
    d_out = os.path.join(OUT, slug); os.makedirs(d_out, exist_ok=True); tmp = tempfile.mkdtemp()
    covers = []
    for s, _, _ in items:
        subprocess.run(["pdftoppm", "-r", "80", "-png", "-f", "1", "-l", "1", f"{OUT}/{s}.pdf", f"{tmp}/{s}"], check=True)
        covers.append(Image.open(glob.glob(f"{tmp}/{s}*.png")[0]).convert("RGB"))

    def card(img, h):
        im = img.resize((int(img.width * h / img.height), h)); sh = Image.new("RGBA", (im.width + 30, im.height + 30), (0, 0, 0, 0))
        ImageDraw.Draw(sh).rectangle([15, 20, im.width + 15, im.height + 20], fill=(0, 0, 0, 120))
        sh = sh.filter(ImageFilter.GaussianBlur(8)); sh.paste(im, (15, 15)); return sh

    def base(t1, t2):
        im = Image.new("RGB", (S, S), primary); d = ImageDraw.Draw(im)
        for y in range(0, S, 120): d.rectangle([0, y, S, y + 60], fill=stripe)
        d.rectangle([0, 0, S, 300], fill=dark); d.rectangle([0, 300, S, 312], fill=accent)
        f = anton(130)
        while d.textlength(t1, font=f) > S - 80: f = anton(f.size - 6)
        d.text((S // 2, 120), t1, font=f, fill="white", anchor="mm"); d.text((S // 2, 235), t2, font=bold(52), fill=accent, anchor="mm")
        return im, d

    total = sum(p for _, _, p in items); save = round(100 * (1 - bundle_price / total))
    n = len(items); cols = 2 if n <= 4 else 3 if n <= 6 else 4; rows = -(-n // cols)
    im, d = base(title.upper(), f"{subtitle}  •  {n} RESOURCES  •  SAVE {save}%")
    h = 460 if cols == 4 else 480
    cw = card(covers[0], h).width
    while cols * cw > S - 40: h -= 20; cw = card(covers[0], h).width
    gap = (S - cols * cw) // (cols + 1); top = 345
    for i, cv in enumerate(covers):
        r, k = divmod(i, cols); c = card(cv, h); im.paste(c, (gap + k * (cw + gap), top + r * (h + 45)), c)
    d.rectangle([0, S - 165, S, S], fill=dark)
    d.text((S // 2, S - 82), "Ontario Curriculum  •  No Prep  •  Answer Keys", font=bold(64), fill="white", anchor="mm")
    im.save(f"{d_out}/thumb1-bundle-cover.png")
    im, d = base("WHAT'S INSIDE", "ONE RESOURCE FOR EACH GRADE BAND")
    step = min(230, 1150 // n); fs = 54 if n > 4 else 62
    for i, (_, label, _) in enumerate(items):
        y = 380 + i * step; d.rounded_rectangle([80, y, S - 80, y + step - 25], radius=30, fill="white")
        cy = y + (step - 25) / 2; d.ellipse([105, cy - 40, 185, cy + 40], fill=dark)
        d.text((145, cy), str(i + 1), font=bold(46), fill="white", anchor="mm"); d.text((215, cy), label, font=bold(fs), fill=dark, anchor="lm")
    im.save(f"{d_out}/thumb2-whats-inside.png")
    im, d = base("BEST VALUE", "ALIGNED TO THE ONTARIO CURRICULUM")
    d.rounded_rectangle([200, 420, S - 200, 1000], radius=50, fill="white")
    t = f"${total:.2f} value"; f = bold(90); w = d.textlength(t, font=f)
    d.text((S // 2, 540), t, font=f, fill=(120, 120, 120), anchor="mm"); d.line([S // 2 - w / 2, 545, S // 2 + w / 2, 545], fill=(214, 40, 40), width=10)
    d.text((S // 2, 720), f"${bundle_price:.2f}", font=anton(240), fill=dark, anchor="mm")
    d.text((S // 2, 900), f"Save {save}%", font=bold(80), fill=primary, anchor="mm")
    for i, t in enumerate(bullets):
        y = 1130 + i * 120; tw = d.textlength(t, font=bold(70)); x0 = S // 2 - tw / 2 + 40
        d.line([(x0 - 95, y), (x0 - 75, y + 25), (x0 - 35, y - 25)], fill=accent, width=14)
        d.text((x0, y), t, font=bold(70), fill="white", anchor="lm")
    im.save(f"{d_out}/thumb3-value.png")
    subprocess.run(["cp", sample_thumb, f"{d_out}/thumb4-sample.png"], check=True)
    pdfmetrics.registerFont(TTFont("Anton", f"{F}/anton-400.ttf"))
    wm = f"{tmp}/wm.pdf"; c = canvas.Canvas(wm, pagesize=letter); c.setFont("Anton", 90); c.setFillColor(Color(.8, .15, .15, alpha=.2))
    c.translate(306, 396); c.rotate(40); c.drawCentredString(0, -30, "PREVIEW"); c.save()
    W_ = PdfReader(wm).pages[0]; out = PdfWriter()
    for s, _, _ in items:
        rd = PdfReader(f"{OUT}/{s}.pdf"); out.add_page(rd.pages[0]); p = rd.pages[2]; p.merge_page(W_); out.add_page(p)
    out.write(f"{d_out}/Bundle-PREVIEW.pdf")
    return d_out, total, save
