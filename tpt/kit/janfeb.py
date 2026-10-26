"""January-February art: hearts, 100 badge, confetti, Canadian coins (simple labelled discs), red envelope, lantern."""
import math
from reportlab.lib.colors import HexColor, white
from . import INK

PINK, RED, GOLD, PURPLE, TEAL, NAVY = HexColor("#EC4899"), HexColor("#DC2626"), HexColor("#FACC15"), HexColor("#7C3AED"), HexColor("#14B8A6"), HexColor("#1E1B4B")


def heart(c, x, y, s, fill=PINK, stroke=None):
    """Centre (x, y), width s."""
    r = s * .27; p = c.beginPath()
    p.moveTo(x, y - s * .45)
    p.curveTo(x - s * .1, y - s * .3, x - s * .5, y - s * .1, x - s * .5, y + s * .12)
    p.curveTo(x - s * .5, y + s * .4, x - s * .1, y + s * .45, x, y + s * .2)
    p.curveTo(x + s * .1, y + s * .45, x + s * .5, y + s * .4, x + s * .5, y + s * .12)
    p.curveTo(x + s * .5, y - s * .1, x + s * .1, y - s * .3, x, y - s * .45); p.close()
    c.saveState()
    if stroke is not None: c.setStrokeColor(stroke); c.setLineWidth(max(1, s * .03))
    if fill is not None: c.setFillColor(fill)
    c.drawPath(p, stroke=1 if stroke is not None else 0, fill=1 if fill is not None else 0); c.restoreState()


def confetti(c, x, y, w, h, n=40, seed=3):
    import random
    R = random.Random(seed); cols = [PINK, GOLD, TEAL, PURPLE, HexColor("#F97316")]
    c.saveState()
    for _ in range(n):
        c.setFillColor(R.choice(cols)); cx, cy = x + R.random() * w, y + R.random() * h
        c.saveState(); c.translate(cx, cy); c.rotate(R.random() * 180); c.rect(-4, -2, 8, 4, stroke=0, fill=1); c.restoreState()
    c.restoreState()


def badge100(c, x, y, r, fill=PURPLE):
    c.saveState(); c.setFillColor(GOLD)
    p = c.beginPath()
    for i in range(24):
        a = math.radians(i * 15); rr = r if i % 2 == 0 else r * .86
        (p.moveTo if i == 0 else p.lineTo)(x + rr * math.cos(a), y + rr * math.sin(a))
    p.close(); c.drawPath(p, stroke=0, fill=1)
    c.setFillColor(fill); c.circle(x, y, r * .78, stroke=0, fill=1)
    c.setFillColor(white); c.setFont("Fredoka", r * .7); c.drawCentredString(x, y - r * .25, "100")
    c.restoreState()


COINS = {5: ("5¢", HexColor("#CBD5E1"), .75), 10: ("10¢", HexColor("#CBD5E1"), .62), 25: ("25¢", HexColor("#CBD5E1"), .85),
         100: ("$1", HexColor("#D4A017"), .95), 200: ("$2", HexColor("#CBD5E1"), 1.0)}


def coin(c, x, y, cents, r=16):
    label, col, scale = COINS[cents]; rr = r * scale
    c.saveState(); c.setStrokeColor(HexColor("#64748B")); c.setLineWidth(1)
    if cents == 200:  # two-tone: silver ring, gold centre
        c.setFillColor(col); c.circle(x, y, rr, fill=1); c.setFillColor(HexColor("#D4A017")); c.circle(x, y, rr * .62, stroke=0, fill=1)
    elif cents == 100:  # 11-sided loonie
        c.setFillColor(col); p = c.beginPath()
        for i in range(11):
            a = math.radians(90 + i * 360 / 11); (p.moveTo if i == 0 else p.lineTo)(x + rr * math.cos(a), y + rr * math.sin(a))
        p.close(); c.drawPath(p, stroke=1, fill=1)
    else:
        c.setFillColor(col); c.circle(x, y, rr, fill=1)
    c.setFillColor(INK); c.setFont("BodyB", rr * .62); c.drawCentredString(x, y - rr * .22, label); c.restoreState()


def envelope(c, x, y, w, h, fill=RED):
    c.saveState(); c.setFillColor(fill); c.roundRect(x, y, w, h, w * .06, stroke=0, fill=1)
    c.setFillColor(HexColor("#991B1B")); p = c.beginPath(); p.moveTo(x, y + h); p.lineTo(x + w / 2, y + h * .7); p.lineTo(x + w, y + h); p.close(); c.drawPath(p, stroke=0, fill=1)
    c.setFillColor(GOLD); c.circle(x + w / 2, y + h * .62, w * .14, stroke=0, fill=1); c.restoreState()


def lantern(c, x, y, s, fill=RED):
    """Centre-bottom (x, y), height s."""
    c.saveState(); c.setStrokeColor(GOLD); c.setLineWidth(max(1, s * .02)); c.line(x, y + s * .95, x, y + s * 1.05)
    c.setFillColor(GOLD); c.rect(x - s * .18, y + s * .82, s * .36, s * .08, stroke=0, fill=1); c.rect(x - s * .18, y + s * .14, s * .36, s * .08, stroke=0, fill=1)
    c.setFillColor(fill); c.ellipse(x - s * .32, y + s * .2, x + s * .32, y + s * .84, stroke=0, fill=1)
    c.setStrokeColor(HexColor("#7F1D1D")); c.setLineWidth(max(.8, s * .012))
    for dx in (-.15, 0, .15):
        p = c.beginPath(); p.moveTo(x + dx * s * .3, y + s * .22); p.curveTo(x + dx * s * 2.2, y + s * .4, x + dx * s * 2.2, y + s * .66, x + dx * s * .3, y + s * .82); c.drawPath(p)
    c.setStrokeColor(GOLD); c.setLineWidth(max(1, s * .02))
    for dx in (-.06, 0, .06): c.line(x + dx * s, y + s * .14, x + dx * s, y)
    c.restoreState()
