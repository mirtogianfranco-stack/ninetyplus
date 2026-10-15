"""North Star Resources store logos. python3 tpt/brand/make_logo.py -> tpt/brand/*.png"""
import math, os
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); F = os.path.join(os.path.dirname(HERE), "kit", "fonts")
NAVY, GOLD, GOLD_D, SKY, WHITE = "#14213D", "#F4B400", "#C98F00", "#2A4A8A", "#FFFFFF"
S = 2000  # draw big, downsample for smooth edges


def star(d, cx, cy, r, inner, points, fill, rot=-90):
    pts = []
    for i in range(points * 2):
        a = math.radians(rot + i * 180 / points); rr = r if i % 2 == 0 else inner
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    d.polygon(pts, fill=fill)


def north_star(d, cx, cy, r):
    star(d, cx, cy, r * 0.62, r * 0.12, 4, GOLD_D, rot=-45)         # diagonal rays
    star(d, cx, cy, r, r * 0.17, 4, GOLD)                            # main N/S/E/W rays
    # facet shading: darker right half of each main ray
    for a in (-90, 0, 90, 180):
        t = math.radians(a); t2 = math.radians(a + 45)
        d.polygon([(cx, cy), (cx + r * math.cos(t), cy + r * math.sin(t)), (cx + r * 0.17 * math.cos(t2), cy + r * 0.17 * math.sin(t2))], fill=GOLD_D)


def sparkles(d, pts):
    for x, y, r in pts:
        star(d, x, y, r, r * 0.25, 4, WHITE)


def text_c(d, y, s, font, fill):
    w = d.textlength(s, font=font); d.text(((S - w) / 2, y), s, font=font, fill=fill)


def logo_full(path):
    im = Image.new("RGB", (S, S), NAVY); d = ImageDraw.Draw(im)
    d.ellipse([S * 0.1, S * 0.06, S * 0.9, S * 0.86], fill=SKY)
    sparkles(d, [(S * 0.24, S * 0.22, 34), (S * 0.78, S * 0.3, 26), (S * 0.7, S * 0.14, 18), (S * 0.3, S * 0.5, 20)])
    north_star(d, S / 2, S * 0.35, S * 0.22)
    big = ImageFont.truetype(os.path.join(F, "anton-400.ttf"), 215)
    small = ImageFont.truetype(os.path.join(F, "Andika-Bold.ttf"), 108)
    text_c(d, S * 0.585, "NORTH STAR", big, WHITE)
    text_c(d, S * 0.585 + 248, "RESOURCES", small, GOLD)
    im.resize((1000, 1000), Image.LANCZOS).save(path)


def logo_icon(path):
    im = Image.new("RGB", (S, S), NAVY); d = ImageDraw.Draw(im)
    sparkles(d, [(S * 0.22, S * 0.24, 40), (S * 0.8, S * 0.74, 34), (S * 0.76, S * 0.2, 22)])
    north_star(d, S / 2, S / 2, S * 0.4)
    im.resize((1000, 1000), Image.LANCZOS).save(path)


def banner(path):
    Wb, Hb = 3000, 1000
    im = Image.new("RGB", (Wb, Hb), NAVY); d = ImageDraw.Draw(im)
    for i in range(40):
        x, y = (i * 733) % Wb, (i * 389) % Hb
        if x > 950 and 230 < y < 900: continue  # keep the text area clean
        star(d, x, y, 10 + (i % 3) * 8, 4, 4, WHITE)
    north_star(d, 520, Hb / 2, 380)
    big = ImageFont.truetype(os.path.join(F, "anton-400.ttf"), 260)
    while d.textlength("NORTH STAR RESOURCES", font=big) > Wb - 1080: big = ImageFont.truetype(big.path, big.size - 6)
    mid = ImageFont.truetype(os.path.join(F, "Andika-Bold.ttf"), 92)
    while d.textlength("No-prep K-8 resources  \u2022  Ontario curriculum aligned", font=mid) > Wb - 1080: mid = ImageFont.truetype(mid.path, mid.size - 2)
    d.text((1000, 280), "NORTH STAR RESOURCES", font=big, fill=WHITE)
    d.text((1010, 600), "No-prep K-8 resources  •  Ontario curriculum aligned", font=mid, fill=GOLD)
    im.resize((1500, 500), Image.LANCZOS).save(path)


def circle_preview(src, path):
    im = Image.open(src).resize((300, 300), Image.LANCZOS)
    mask = Image.new("L", im.size, 0); ImageDraw.Draw(mask).ellipse([0, 0, 299, 299], fill=255)
    out = Image.new("RGB", (340, 340), "#F3F4F6"); out.paste(im, (20, 20), mask); out.save(path)


if __name__ == "__main__":
    logo_full(os.path.join(HERE, "store-photo-north-star.png"))
    logo_icon(os.path.join(HERE, "store-icon-star-only.png"))
    banner(os.path.join(HERE, "store-banner-1500x500.png"))
    circle_preview(os.path.join(HERE, "store-photo-north-star.png"), os.path.join(HERE, "preview-as-circle.png"))
    print("ok")
