"""Christmas art: ornament, gift, candy cane, stocking, bell, star, Santa hat, gingerbread person; plus a Christmas scene."""
import math
from reportlab.lib.colors import HexColor, white
from . import INK
from .winter import tree, snowflake

RED, GREEN, GOLD, DKGREEN, BROWN = HexColor("#DC2626"), HexColor("#16A34A"), HexColor("#FACC15"), HexColor("#14532D"), HexColor("#B45309")


def ornament(c, x, y, s, col=RED):
    """Bottom (x, y), height s."""
    c.saveState(); r = s * .4
    c.setFillColor(col); c.circle(x, y + r, r, stroke=0, fill=1)
    c.setFillColor(GOLD); c.rect(x - r * .3, y + 2 * r - r * .05, r * .6, r * .3, stroke=0, fill=1)
    c.setFillColor(white); c.circle(x - r * .35, y + r * 1.3, r * .14, stroke=0, fill=1)
    c.setStrokeColor(GOLD); c.setLineWidth(max(1, s * .03)); c.line(x - r, y + r, x + r, y + r)
    c.restoreState()


def gift(c, x, y, s, col=GREEN, ribbon=RED):
    c.saveState(); w = s * .8
    c.setFillColor(col); c.rect(x - w / 2, y, w, s * .62, stroke=0, fill=1)
    c.setFillColor(ribbon); c.rect(x - w * .08, y, w * .16, s * .62, stroke=0, fill=1); c.rect(x - w / 2, y + s * .27, w, s * .1, stroke=0, fill=1)
    for sx in (-1, 1):
        p = c.beginPath(); p.moveTo(x, y + s * .62); p.curveTo(x + sx * s * .35, y + s * .95, x + sx * s * .05, y + s * .95, x, y + s * .62); c.drawPath(p, stroke=0, fill=1)
    c.restoreState()


def candy_cane(c, x, y, s):
    c.saveState(); w = s * .14
    c.setStrokeColor(white); c.setLineWidth(w); c.setLineCap(1)
    p = c.beginPath(); p.moveTo(x, y); p.lineTo(x, y + s * .7); p.curveTo(x, y + s, x + s * .4, y + s, x + s * .4, y + s * .75); c.drawPath(p)
    c.setStrokeColor(RED); c.setDash(w * .9, w * .9); c.drawPath(p); c.setDash()
    c.setStrokeColor(HexColor("#94A3B8")); c.setLineWidth(.6)
    c.restoreState()


def stocking(c, x, y, s, col=RED):
    c.saveState(); c.setFillColor(col)
    p = c.beginPath(); p.moveTo(x - s * .15, y + s * .85); p.lineTo(x - s * .15, y + s * .3); p.curveTo(x - s * .15, y, x + s * .35, y, x + s * .38, y + s * .12)
    p.curveTo(x + s * .4, y + s * .25, x + s * .15, y + s * .3, x + s * .15, y + s * .4); p.lineTo(x + s * .15, y + s * .85); p.close(); c.drawPath(p, stroke=0, fill=1)
    c.setFillColor(white); c.setStrokeColor(HexColor("#94A3B8")); c.setLineWidth(max(.8, s * .015)); c.rect(x - s * .2, y + s * .78, s * .4, s * .16, stroke=1, fill=1)
    c.restoreState()


def bell(c, x, y, s, col=GOLD):
    c.saveState(); c.setFillColor(col)
    p = c.beginPath(); p.moveTo(x - s * .38, y + s * .15); p.curveTo(x - s * .3, y + s * .3, x - s * .3, y + s * .85, x, y + s * .85)
    p.curveTo(x + s * .3, y + s * .85, x + s * .3, y + s * .3, x + s * .38, y + s * .15); p.close(); c.drawPath(p, stroke=0, fill=1)
    c.setFillColor(HexColor("#B45309")); c.circle(x, y + s * .1, s * .08, stroke=0, fill=1)
    c.setFillColor(RED); c.circle(x, y + s * .9, s * .07, stroke=0, fill=1)
    c.restoreState()


def star(c, x, y, r, col=GOLD):
    c.saveState(); p = c.beginPath()
    for i in range(10):
        a = math.radians(90 + 36 * i); rr = r if i % 2 == 0 else r * .45
        (p.moveTo if i == 0 else p.lineTo)(x + rr * math.cos(a), y + rr * math.sin(a))
    p.close(); c.setFillColor(col); c.drawPath(p, stroke=0, fill=1); c.restoreState()


def santa_hat(c, x, y, s):
    c.saveState(); c.setFillColor(RED)
    p = c.beginPath(); p.moveTo(x - s * .4, y + s * .15); p.curveTo(x - s * .3, y + s * .7, x + s * .2, y + s * .9, x + s * .42, y + s * .55)
    p.lineTo(x + s * .4, y + s * .15); p.close(); c.drawPath(p, stroke=0, fill=1)
    c.setFillColor(white); c.setStrokeColor(HexColor("#94A3B8")); c.setLineWidth(max(.8, s * .015))
    c.roundRect(x - s * .46, y, s * .92, s * .18, s * .08, stroke=1, fill=1); c.circle(x + s * .44, y + s * .52, s * .1, stroke=1, fill=1)
    c.restoreState()


def gingerbread(c, x, y, s, outline=False):
    """Bottom (x, y), height s. outline=True draws a colouring outline only."""
    c.saveState(); c.setFillColor(BROWN); c.setStrokeColor(INK if outline else BROWN); c.setLineWidth(max(1, s * .015))
    f = 0 if outline else 1
    c.circle(x, y + s * .82, s * .17, stroke=1, fill=f)
    c.roundRect(x - s * .2, y + s * .25, s * .4, s * .45, s * .08, stroke=1, fill=f)
    c.saveState(); c.translate(x - s * .2, y + s * .6); c.rotate(25); c.roundRect(-s * .3, -s * .07, s * .32, s * .14, s * .07, stroke=1, fill=f); c.restoreState()
    c.saveState(); c.translate(x + s * .2, y + s * .6); c.rotate(-25); c.roundRect(-s * .02, -s * .07, s * .32, s * .14, s * .07, stroke=1, fill=f); c.restoreState()
    c.roundRect(x - s * .2, y, s * .16, s * .32, s * .07, stroke=1, fill=f); c.roundRect(x + s * .04, y, s * .16, s * .32, s * .07, stroke=1, fill=f)
    if not outline:
        c.setFillColor(white)
        for dy in (.35, .47, .59): c.circle(x, y + s * dy, s * .025, stroke=0, fill=1)
        for dx in (-.06, .06): c.circle(x + dx * s, y + s * .86, s * .025, stroke=0, fill=1)
    c.restoreState()


def christmas_scene(b, x, y, w, h):
    c = b.c
    c.setFillColor(DKGREEN); c.roundRect(x, y, w, h, 22, stroke=0, fill=1)
    for fx, fy, fr in [(x + 40, y + h - 40, 12), (x + w - 50, y + h - 30, 10), (x + w / 2 - 120, y + h - 30, 9)]:
        snowflake(c, fx, fy, fr, HexColor("#DCFCE7"))
    tree(c, x + w / 2, y + 26, 200); star(c, x + w / 2, y + 220, 18)
    for ox, oy, col in [(-40, 70, RED), (30, 100, GOLD), (-15, 140, HexColor("#2563EB")), (45, 55, RED)]:
        ornament(c, x + w / 2 + ox, y + oy, 18, col)
    gift(c, x + 90, y + 24, 80); gift(c, x + 160, y + 24, 56, RED, GOLD)
    gingerbread(c, x + w - 150, y + 24, 110); candy_cane(c, x + w - 80, y + 26, 100)
