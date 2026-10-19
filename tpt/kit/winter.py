"""Winter art (snowflake, snowman, toque, mitten, evergreen, mug) and winter pixel pictures for the mystery engine.
Everything is secular winter imagery so it suits every classroom."""
import math
from reportlab.lib.colors import HexColor, white
from . import INK
from .halloween import PICS, COLOURS

SKY, ICE, NAVY, RED, PINE, BARK, CARROT = HexColor("#7DD3FC"), HexColor("#E0F2FE"), HexColor("#0C1E3A"), HexColor("#E11D48"), HexColor("#15803D"), HexColor("#92400E"), HexColor("#F97316")
COLOURS.update({"b": (SKY, "light blue"), "d": (HexColor("#1E40AF"), "dark blue"), "r": (RED, "red"), "n": (BARK, "brown")})

PICS.update({
    "Snowman8": ["..kkkk..", "..kkkk..", ".kkkkkk.", "..kwwk..", "..wwow..", ".wwkkww.", "wwwwwwww", ".wwkkww."],
    "Tree8": ["...yy...", "...gg...", "..gggg..", "..gggg..", ".gggggg.", ".gggggg.", "gggggggg", "...nn..."],
    "Mitten8": ["..rrr...", ".rrrrr..", ".rrrrr.r", ".rrrrrrr", ".rrrrrr.", ".rrrrr..", ".wwwww..", ".wwwww.."],
    "Toque8": ["...ww...", "...ww...", "..rrrr..", ".rrrrrr.", ".wwwwww.", "rrrrrrrr", "wwwwwwww", "........"],
    "Snowman": ["....kkkk....", "....kkkk....", "...kkkkkk...", "....wwww....", "...wkwwkw...", "...wwwoww...", "....wwww....",
                "..rrrrrrrr..", ".wwwwkwwwww.", "wwwwwkwwwwww", "wwwwwkwwwwww", ".wwwwwwwwww."],
    "Tree": [".....yy.....", ".....yy.....", ".....gg.....", "....gggg....", "...gggggg...", "....gggg....", "...ggrggg...",
             "..gggggggg..", ".gggyggrggg.", "gggggggggggg", ".....nn.....", ".....nn....."],
    "Mitten": ["...rrrr.....", "..rrrrrr....", "..rrrrrr....", "..rrrrrr.rr.", "..rrrrrrrrr.", "..rrrrrrrr..", "..rrrrrrr...",
               "..rrrrrr....", "..rrrrrr....", "..wwwwww....", "..wwwwww....", "............"],
    "Snowflake": ["w....ww....w", ".w...ww...w.", "..w..ww..w..", "...w.ww.w...", "....wwww....", "wwwwwwwwwwww", "wwwwwwwwwwww",
                  "....wwww....", "...w.ww.w...", "..w..ww..w..", ".w...ww...w.", "w....ww....w"],
    "Toque": [".....ww.....", "....wwww....", ".....ww.....", "...rrrrrr...", "..rrrrrrrr..", ".rrrrrrrrrr.", ".wwwwwwwwww.",
              ".rrrrrrrrrr.", "rrrrrrrrrrrr", "wwwwwwwwwwww", "wwwwwwwwwwww", "............"],
})
for _n, _rows in PICS.items():
    assert len({len(r) for r in _rows}) == 1 and len(_rows) == len(_rows[0]), _n


def snowflake(c, x, y, r, col=white, w=None):
    c.saveState(); c.setStrokeColor(col); c.setLineWidth(w or max(1, r * 0.09)); c.setLineCap(1)
    for k in range(6):
        a = math.radians(90 + 60 * k); ex, ey = x + r * math.cos(a), y + r * math.sin(a); c.line(x, y, ex, ey)
        for t in (0.5, 0.75):
            bx, by = x + r * t * math.cos(a), y + r * t * math.sin(a); L = r * 0.25 * (1.2 - t)
            for s in (-1, 1):
                b2 = a + s * math.radians(45); c.line(bx, by, bx + L * math.cos(b2), by + L * math.sin(b2))
    c.restoreState()


def snowman(c, x, y, s):
    """Base centre (x, y), height about s."""
    c.saveState(); c.setStrokeColor(INK); c.setLineWidth(max(1, s * 0.012)); c.setFillColor(white)
    r1, r2, r3 = s * .22, s * .16, s * .12
    c.circle(x, y + r1, r1, fill=1); c.circle(x, y + 2 * r1 + r2 - s * .03, r2, fill=1); hy = y + 2 * r1 + 2 * r2 + r3 - s * .06
    c.circle(x, hy, r3, fill=1)
    c.setFillColor(RED); c.rect(x - r2 * .95, y + 2 * r1 + 2 * r2 - s * .08, r2 * 1.9, s * .05, stroke=0, fill=1)
    c.setFillColor(INK)
    for dx in (-.4, .4): c.circle(x + dx * r3, hy + r3 * .25, s * .012, stroke=0, fill=1)
    for k in range(3): c.circle(x, y + 2 * r1 + r2 * 1.2 - k * r2 * .45, s * .013, stroke=0, fill=1)
    c.setFillColor(CARROT); p = c.beginPath(); p.moveTo(x, hy + r3 * .05); p.lineTo(x + r3 * .9, hy - r3 * .1); p.lineTo(x, hy - r3 * .2); p.close(); c.drawPath(p, stroke=0, fill=1)
    c.setFillColor(INK); c.rect(x - r3 * .9, hy + r3 * .7, r3 * 1.8, s * .02, stroke=0, fill=1); c.rect(x - r3 * .6, hy + r3 * .7, r3 * 1.2, s * .1, stroke=0, fill=1)
    c.restoreState()


def tree(c, x, y, s):
    c.saveState(); c.setFillColor(BARK); c.rect(x - s * .05, y, s * .1, s * .12, stroke=0, fill=1); c.setFillColor(PINE)
    for i, (w, h0) in enumerate([(.42, .1), (.34, .35), (.24, .58)]):
        p = c.beginPath(); p.moveTo(x - s * w, y + s * h0); p.lineTo(x + s * w, y + s * h0); p.lineTo(x, y + s * (h0 + .38)); p.close(); c.drawPath(p, stroke=0, fill=1)
    c.restoreState()


def toque(c, x, y, s):
    c.saveState(); c.setFillColor(RED)
    p = c.beginPath(); p.moveTo(x - s * .4, y + s * .15); p.curveTo(x - s * .4, y + s * .7, x + s * .4, y + s * .7, x + s * .4, y + s * .15); p.close(); c.drawPath(p, stroke=0, fill=1)
    c.setFillColor(white); c.setStrokeColor(HexColor("#94A3B8")); c.setLineWidth(max(.8, s * .015))
    c.roundRect(x - s * .45, y, s * .9, s * .18, s * .05, stroke=1, fill=1); c.circle(x, y + s * .66, s * .1, stroke=1, fill=1)
    c.restoreState()


def mitten(c, x, y, s, col=RED):
    c.saveState(); c.setFillColor(col)
    c.roundRect(x - s * .22, y + s * .15, s * .4, s * .6, s * .18, stroke=0, fill=1)
    c.saveState(); c.translate(x + s * .16, y + s * .45); c.rotate(-30); c.roundRect(-s * .07, -s * .05, s * .14, s * .28, s * .07, stroke=0, fill=1); c.restoreState()
    c.setFillColor(white); c.setStrokeColor(HexColor("#94A3B8")); c.setLineWidth(max(.8, s * .015))
    c.rect(x - s * .24, y, s * .44, s * .18, stroke=1, fill=1); c.restoreState()


def mug(c, x, y, s):
    c.saveState(); c.setFillColor(RED); c.roundRect(x - s * .25, y, s * .5, s * .5, s * .06, stroke=0, fill=1)
    c.setStrokeColor(RED); c.setLineWidth(s * .06); c.circle(x + s * .3, y + s * .25, s * .12, stroke=1, fill=0)
    c.setStrokeColor(HexColor("#CBD5E1")); c.setLineWidth(s * .03); c.setLineCap(1)
    for dx in (-.1, .05):
        p = c.beginPath(); p.moveTo(x + dx * s, y + s * .58); p.curveTo(x + (dx + .08) * s, y + s * .68, x + (dx - .08) * s, y + s * .76, x + dx * s, y + s * .86); c.drawPath(p)
    c.restoreState()


def winter_scene(b, x, y, w, h):
    c = b.c
    c.setFillColor(NAVY); c.roundRect(x, y, w, h, 22, stroke=0, fill=1)
    c.setFillColor(white); c.roundRect(x, y, w, 50, 22, stroke=0, fill=1); c.rect(x, y + 25, w, 25, stroke=0, fill=1)
    for fx, fy, fr in [(x + 60, y + h - 50, 22), (x + 160, y + h - 90, 14), (x + w - 150, y + h - 45, 18), (x + w / 2 + 40, y + h - 40, 12), (x + w - 60, y + h - 110, 10)]:
        snowflake(c, fx, fy, fr, ICE)
    tree(c, x + 90, y + 40, 150); tree(c, x + 170, y + 40, 110)
    snowman(c, x + w / 2 + 20, y + 30, 190)
    toque(c, x + w - 130, y + 60, 80); mitten(c, x + w - 60, y + 50, 70)
