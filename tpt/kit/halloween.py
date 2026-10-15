"""Halloween vector art + mystery-picture (colour-by-answer) engine shared by the Halloween products."""
import math
import re
from reportlab.lib.colors import HexColor, white
from . import INK, GREY, KEYRED, W, H, M, style

ORANGE, PUMPKIN_D, STEM = HexColor("#F97316"), HexColor("#C2410C"), HexColor("#4D7C0F")
PURPLE, NIGHT, MOON = HexColor("#7C3AED"), HexColor("#2E1065"), HexColor("#FDE68A")
GHOST, BLACK, LIME, CANDY_Y = HexColor("#F8FAFC"), HexColor("#111827"), HexColor("#84CC16"), HexColor("#FACC15")


def pumpkin(c, x, y, r, face=True):
    """Centre (x, y), half-width r."""
    c.saveState()
    c.setFillColor(STEM); c.roundRect(x - r * 0.12, y + r * 0.6, r * 0.24, r * 0.42, r * 0.08, stroke=0, fill=1)
    c.setStrokeColor(PUMPKIN_D); c.setLineWidth(max(1, r * 0.05))
    for dx, w in [(-0.45, 0.62), (0.45, 0.62), (0, 0.6)]:
        c.setFillColor(ORANGE); c.ellipse(x + dx * r - w * r, y - r * 0.78, x + dx * r + w * r, y + r * 0.72, stroke=1, fill=1)
    if face:
        c.setFillColor(BLACK)
        for sx in (-1, 1):
            p = c.beginPath(); p.moveTo(x + sx * r * 0.42, y + r * 0.08); p.lineTo(x + sx * r * 0.22, y + r * 0.08)
            p.lineTo(x + sx * r * 0.32, y + r * 0.32); p.close(); c.drawPath(p, stroke=0, fill=1)
        p = c.beginPath(); p.moveTo(x - r * 0.5, y - r * 0.18)
        p.curveTo(x - r * 0.25, y - r * 0.6, x + r * 0.25, y - r * 0.6, x + r * 0.5, y - r * 0.18)
        p.lineTo(x + r * 0.2, y - r * 0.3); p.lineTo(x, y - r * 0.2); p.lineTo(x - r * 0.2, y - r * 0.3); p.close()
        c.drawPath(p, stroke=0, fill=1)
    c.restoreState()


def ghost(c, x, y, s):
    """Centre-bottom (x, y), height s."""
    c.saveState(); c.setFillColor(GHOST); c.setStrokeColor(INK); c.setLineWidth(max(1, s * 0.025))
    w = s * 0.38; p = c.beginPath(); p.moveTo(x - w, y)
    p.lineTo(x - w, y + s - w); p.curveTo(x - w, y + s + w * 0.35, x + w, y + s + w * 0.35, x + w, y + s - w); p.lineTo(x + w, y)
    for k in range(4):
        x1 = x + w - (k + 0.5) * w / 2; x2 = x + w - (k + 1) * w / 2
        p.curveTo(x1 + w * 0.1, y + s * 0.12, x1 - w * 0.1, y + s * 0.12, x2, y)
    p.close(); c.drawPath(p, stroke=1, fill=1)
    c.setFillColor(BLACK)
    for sx in (-1, 1): c.ellipse(x + sx * w * 0.38 - s * 0.06, y + s * 0.58, x + sx * w * 0.38 + s * 0.06, y + s * 0.74, stroke=0, fill=1)
    c.ellipse(x - s * 0.07, y + s * 0.36, x + s * 0.07, y + s * 0.5, stroke=0, fill=1)
    c.restoreState()


def bat(c, x, y, s, col=BLACK):
    """Centre (x, y), wingspan s."""
    c.saveState(); c.setFillColor(col); h = s / 2
    p = c.beginPath(); p.moveTo(x, y + h * 0.15)
    p.curveTo(x - h * 0.3, y + h * 0.35, x - h * 0.7, y + h * 0.45, x - h, y + h * 0.25)
    for k in range(3):
        xa = x - h + k * h * 0.28
        p.curveTo(xa + h * 0.05, y, xa + h * 0.2, y - h * 0.05, xa + h * 0.28, y - h * 0.08)
    p.lineTo(x, y - h * 0.25)
    p.lineTo(x + h * 0.16, y - h * 0.08)
    for k in range(3):
        xa = x + h * 0.16 + k * h * 0.28
        p.curveTo(xa + h * 0.08, y - h * 0.05, xa + h * 0.23, y, xa + h * 0.28 + (h * 0.02 if k == 2 else 0), y + (h * 0.25 if k == 2 else 0))
    p.curveTo(x + h * 0.7, y + h * 0.45, x + h * 0.3, y + h * 0.35, x, y + h * 0.15); p.close()
    c.drawPath(p, stroke=0, fill=1)
    c.ellipse(x - h * 0.13, y - h * 0.15, x + h * 0.13, y + h * 0.3, stroke=0, fill=1)
    for sx in (-1, 1):
        q = c.beginPath(); q.moveTo(x + sx * h * 0.03, y + h * 0.28); q.lineTo(x + sx * h * 0.12, y + h * 0.42); q.lineTo(x + sx * h * 0.13, y + h * 0.2); q.close()
        c.drawPath(q, stroke=0, fill=1)
    c.restoreState()


def candy_corn(c, x, y, s):
    """Centre-bottom (x, y), height s."""
    c.saveState(); c.setStrokeColor(INK); c.setLineWidth(max(1, s * 0.03)); w = s * 0.42
    bands = [(0.0, 0.38, CANDY_Y), (0.38, 0.75, ORANGE), (0.75, 1.0, GHOST)]
    for a, b, col in bands:
        wa, wb = w * (1 - a), w * (1 - b)
        p = c.beginPath(); p.moveTo(x - wa, y + a * s); p.lineTo(x + wa, y + a * s); p.lineTo(x + wb, y + b * s); p.lineTo(x - wb, y + b * s); p.close()
        c.setFillColor(col); c.drawPath(p, stroke=1, fill=1)
    c.restoreState()


def spider(c, x, y, s):
    c.saveState(); c.setStrokeColor(BLACK); c.setLineWidth(max(1, s * 0.05))
    for sx in (-1, 1):
        for k in range(4):
            a = math.radians(25 - k * 22); x1, y1 = x + sx * s * 0.35 * math.cos(a), y + s * 0.35 * math.sin(a) + s * 0.1
            c.line(x, y, x1, y1); c.line(x1, y1, x1 + sx * s * 0.12, y1 - s * 0.25)
    c.line(x, y + s * 0.2, x, y + s * 0.65)
    c.setFillColor(BLACK); c.circle(x, y, s * 0.18, stroke=0, fill=1); c.circle(x, y + s * 0.2, s * 0.11, stroke=0, fill=1)
    c.setFillColor(white); c.circle(x - s * 0.04, y + s * 0.22, s * 0.03, stroke=0, fill=1); c.circle(x + s * 0.04, y + s * 0.22, s * 0.03, stroke=0, fill=1)
    c.restoreState()


def witch_hat(c, x, y, s):
    c.saveState(); c.setFillColor(BLACK)
    c.ellipse(x - s * 0.5, y - s * 0.08, x + s * 0.5, y + s * 0.08, stroke=0, fill=1)
    p = c.beginPath(); p.moveTo(x - s * 0.28, y); p.lineTo(x + s * 0.05, y + s * 0.85); p.lineTo(x + s * 0.28, y); p.close(); c.drawPath(p, stroke=0, fill=1)
    c.setFillColor(PURPLE); c.rect(x - s * 0.26, y + s * 0.03, s * 0.52, s * 0.1, stroke=0, fill=1)
    c.restoreState()


def night_scene(b, x, y, w, h):
    """Generic cover art: moon, bats, pumpkins, ghost."""
    c = b.c
    c.setFillColor(NIGHT); c.roundRect(x, y, w, h, 22, stroke=0, fill=1)
    c.setFillColor(MOON); c.circle(x + w - 90, y + h - 80, 48, stroke=0, fill=1)
    for bx, by, bs in [(x + 90, y + h - 60, 70), (x + 190, y + h - 40, 44), (x + w - 200, y + h - 50, 50)]:
        bat(c, bx, by, bs, BLACK if False else HexColor("#0B0B12"))
    pumpkin(c, x + 110, y + 70, 56); pumpkin(c, x + 210, y + 52, 36)
    ghost(c, x + w - 110, y + 22, 120); candy_corn(c, x + w / 2 + 20, y + 26, 60)


# ---------------- mystery pictures ----------------
COLOURS = {  # code -> (fill, name)
    "o": (ORANGE, "orange"), "k": (BLACK, "black"), "g": (STEM, "green"), "p": (PURPLE, "purple"),
    "y": (CANDY_Y, "yellow"), "w": (white, "leave white"), "e": (HexColor("#9CA3AF"), "grey"),
}

PICS = {
    "Pumpkin": ["....ggg.....", ".....gg.....", "..oooooooo..", ".oooooooooo.", "oooooooooooo", "oookkookkooo",
                "oookkookkooo", "oooooooooooo", "ookooooookoo", "oookkkkkkooo", ".oooooooooo.", "..oooooooo.."],
    "Bat Moon": ["...yyyyyy...", "..yyyyyyyy..", ".yyyyyyyyyy.", "yyyykyykyyyy", "kyyykkkkyyyk", "kkyykkkkyykk",
                 "kkkkkkkkkkkk", "ykkkkkkkkkky", "yykkykkykkyy", ".yyyykkyyyy.", "..yyyyyyyy..", "...yyyyyy..."],
    "Ghost": ["...eeeeee...", "..eeeeeeee..", ".eeeeeeeeee.", ".eekkeekkee.", ".eekkeekkee.", ".eeeeeeeeee.",
              ".eeeekkeeee.", ".eeeekkeeee.", ".eeeeeeeeee.", ".eeeeeeeeee.", ".e.ee.ee.ee.", "............"],
    "Candy Corn": [".....ww.....", "....wwww....", "....wwww....", "...oooooo...", "...oooooo...", "..oooooooo..",
                   "..oooooooo..", ".yyyyyyyyyy.", ".yyyyyyyyyy.", "yyyyyyyyyyyy", "yyyyyyyyyyyy", ".yyyyyyyyyy."],
    "Witch Hat": ["......k.....", ".....kk.....", ".....kkk....", "....kkkk....", "....kkkkk...", "...kkkkkk...",
                  "...kkkkkkk..", "..oooooooo..", "..oooooooo..", "kkkkkkkkkkkk", "kkkkkkkkkkkk", "............"],
    # 8x8 versions for younger grades
    "Pumpkin8": ["...gg...", ".oooooo.", "oooooooo", "okkookko", "oooooooo", "ookkkkoo", "oooooooo", ".oooooo."],
    "Ghost8": ["..eeee..", ".eeeeee.", "eekeekee", "eeeeeeee", "eeekkeee", "eeeeeeee", "eeeeeeee", "e.ee.ee."],
    "CandyCorn8": ["...ww...", "..wwww..", "..oooo..", ".oooooo.", ".oooooo.", "yyyyyyyy", "yyyyyyyy", ".yyyyyy."],
    "WitchHat8": ["....k...", "...kk...", "...kkk..", "..kkkk..", "..kkkkk.", ".oooooo.", "kkkkkkkk", "........"],
}
for _n, _rows in PICS.items():
    assert len({len(r) for r in _rows}) == 1 and len(_rows) == len(_rows[0]), _n


def mystery(b, name, problems, legend, key=False, fs=None, bg="p"):
    """problems: dict (r, k) -> (text, answer). legend: list of (code, label) where label says which answers get that
    colour. '.' cells use colour `bg`. Draws the grid filling the page below the header."""
    rows = PICS[name]; n = len(rows); c = b.c
    y = b.header(f"Mystery Picture: {'?' * 0 or 'What is it?'}" if not key else "Mystery Picture: " + re.sub(r"(?<=[a-z])([A-Z])", r" \1", name.rstrip("8")),
                 "Solve, then colour by the code")
    if key: b.key_stamp()
    # legend
    lx = M; c.setFont("BodyB", 10)
    for code, label in legend:
        col, cname = COLOURS[code]
        c.setFillColor(col); c.setStrokeColor(INK); c.setLineWidth(1); c.rect(lx, y - 14, 16, 16, fill=1)
        c.setFillColor(INK); txt = f"{label} = {cname}"; c.drawString(lx + 21, y - 10, txt)
        lx += 21 + c.stringWidth(txt, "BodyB", 10) + 16
    y -= 30
    size = min(W - 2 * M, y - 44); cs = size / n; x0 = (W - size) / 2
    fs = fs or (cs * 0.27 if n > 8 else cs * 0.24)
    for r in range(n):
        for k in range(n):
            code = rows[r][k]; code = bg if code == "." else code
            cx, cy = x0 + k * cs, y - (r + 1) * cs
            c.setFillColor(COLOURS[code][0] if key else white); c.setStrokeColor(INK); c.setLineWidth(0.8)
            c.rect(cx, cy, cs, cs, fill=1)
            text, _ = problems[(r, k)]
            dark = key and code in "kpg"
            c.setFillColor(white if dark else INK); c.setFont("BodyB", fs)
            c.drawCentredString(cx + cs / 2, cy + cs / 2 - fs * 0.35, text)
    return y - size


def assign(name, pools, bg="p", rng=None):
    """pools: code -> list of (text, answer) problems whose answers belong to that code's colour.
    Returns {(r,k): (text, answer)} drawing from each pool in turn (cycling, shuffled)."""
    rows = PICS[name]; out = {}; idx = {k: 0 for k in pools}
    for r, row in enumerate(rows):
        for k, ch in enumerate(row):
            code = bg if ch == "." else ch
            pool = pools[code]; out[(r, k)] = pool[idx[code] % len(pool)]; idx[code] += 1
    return out


def mystery_art(*names, bg="p"):
    """Cover art: the solved pixel pictures side by side."""
    def draw(b, x, y, w, h):
        c = b.c; n = len(names); gap = 30; size = min(h - 40, (w - gap * (n + 1)) / n)
        x0 = x + (w - (n * size + (n - 1) * gap)) / 2
        for i, name in enumerate(names):
            rows = PICS[name]; cs = size / len(rows); px = x0 + i * (size + gap)
            for r, row in enumerate(rows):
                for k, ch in enumerate(row):
                    code = bg if ch == "." else ch
                    c.setFillColor(COLOURS[code][0]); c.setStrokeColor(white); c.setLineWidth(0.5)
                    c.rect(px + k * cs, y + 20 + size - (r + 1) * cs, cs, cs, fill=1)
    return draw


def graph_art(b, x, y, w, h):
    c = b.c; vals = [5, 8, 3, 7]; bw = 52; gx = x + 70
    c.setStrokeColor(INK); c.setLineWidth(2); c.line(gx - 10, y + 24, gx - 10, y + h - 20); c.line(gx - 10, y + 24, gx + 4 * (bw + 26), y + 24)
    for i, v in enumerate(vals):
        for j in range(v):
            pumpkin(c, gx + i * (bw + 26) + bw / 2, y + 40 + j * 24, 11, face=False)
    ghost(c, x + w - 56, y + 30, 100)


def count_art(b, x, y, w, h):
    """Cover art: 1 pumpkin, 2 ghosts, 3 bats, 4 candy corns with big numerals."""
    c = b.c
    items = [lambda xx, yy: pumpkin(c, xx, yy + 18, 18), lambda xx, yy: ghost(c, xx, yy, 40),
             lambda xx, yy: bat(c, xx, yy + 14, 40), lambda xx, yy: candy_corn(c, xx, yy, 36)]
    for i, fn in enumerate(items):
        n = i + 1; cx = x + 70 + i * (w - 140) / 3
        c.setFillColor(b.t.primary); c.setFont("Fredoka", 64); c.drawCentredString(cx, y + h - 90, str(n))
        for j in range(n):
            r, k = divmod(j, 2); per = min(2, n - r * 2)
            fn(cx - (per - 1) * 22 + k * 44, y + 70 - r * 48)
