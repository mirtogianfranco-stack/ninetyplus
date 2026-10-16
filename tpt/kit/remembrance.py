"""Remembrance Day art: dove, maple leaf, wreath of leaves, candle. No poppy imagery: the poppy as a symbol of
remembrance is a registered trademark of the Royal Canadian Legion and needs its written permission for commercial use."""
import math
from reportlab.lib.colors import HexColor, white
from . import INK

RED, GOLD, LEAFG, NAVY = HexColor("#B91C1C"), HexColor("#D4AF37"), HexColor("#4D7C0F"), HexColor("#1E293B")
LEAF = [(0, 1), (.12, .72), (.3, .8), (.25, .45), (.55, .6), (.5, .45), (.8, .5), (.7, .3), (.85, .2), (.45, -.05), (.5, -.25),
        (.08, -.15), (.06, -.6), (-.06, -.6), (-.08, -.15), (-.5, -.25), (-.45, -.05), (-.85, .2), (-.7, .3), (-.8, .5),
        (-.5, .45), (-.55, .6), (-.25, .45), (-.3, .8), (-.12, .72)]


def maple_leaf(c, x, y, r, fill=RED, outline=None):
    p = c.beginPath()
    for i, (px, py) in enumerate(LEAF):
        (p.moveTo if i == 0 else p.lineTo)(x + px * r, y + py * r)
    p.close()
    c.saveState()
    if outline is not None:
        c.setStrokeColor(outline); c.setLineWidth(max(1.2, r * 0.03))
    if fill is not None:
        c.setFillColor(fill)
    c.drawPath(p, stroke=1 if outline is not None else 0, fill=1 if fill is not None else 0); c.restoreState()


def dove(c, x, y, s, fill=white, outline=INK, branch=True):
    """Centre (x, y), width about s."""
    c.saveState(); c.setStrokeColor(outline); c.setLineWidth(max(1.2, s * 0.02))
    if fill is not None: c.setFillColor(fill)
    f = 1 if fill is not None else 0
    p = c.beginPath()  # body
    p.moveTo(x - s * .45, y + s * .02)
    p.curveTo(x - s * .2, y - s * .22, x + s * .2, y - s * .2, x + s * .32, y + s * .08)
    p.curveTo(x + s * .36, y + s * .18, x + s * .3, y + s * .26, x + s * .2, y + s * .22)
    p.curveTo(x + s * .05, y + s * .08, x - s * .2, y + s * .1, x - s * .45, y + s * .02)
    p.close(); c.drawPath(p, stroke=1, fill=f)
    p = c.beginPath()  # tail
    p.moveTo(x - s * .38, y + s * .03); p.lineTo(x - s * .58, y + s * .14); p.lineTo(x - s * .52, y - s * .02); p.lineTo(x - s * .6, y - s * .1)
    p.lineTo(x - s * .36, y - s * .04); p.close(); c.drawPath(p, stroke=1, fill=f)
    p = c.beginPath()  # wing
    p.moveTo(x - s * .14, y + s * .09)
    p.curveTo(x - s * .26, y + s * .28, x - s * .2, y + s * .46, x - s * .06, y + s * .5)
    p.curveTo(x - s * .02, y + s * .43, x + s * .03, y + s * .43, x + s * .05, y + s * .38)
    p.curveTo(x + s * .1, y + s * .36, x + s * .13, y + s * .3, x + s * .12, y + s * .24)
    p.curveTo(x + s * .15, y + s * .2, x + s * .15, y + s * .14, x + s * .12, y + s * .1)
    p.close(); c.drawPath(p, stroke=1, fill=f)
    c.setFillColor(INK); c.circle(x + s * .25, y + s * .17, s * .018, stroke=0, fill=1)
    c.setFillColor(GOLD); p = c.beginPath(); p.moveTo(x + s * .33, y + s * .16); p.lineTo(x + s * .42, y + s * .13); p.lineTo(x + s * .33, y + s * .11); p.close()
    c.drawPath(p, stroke=0, fill=1)
    if branch:
        c.setStrokeColor(LEAFG); c.setLineWidth(max(1.2, s * .015)); c.line(x + s * .38, y + s * .12, x + s * .55, y + s * .02)
        for t in (.44, .5):
            c.saveState(); c.translate(x + s * t, y + s * (.12 - (t - .38) * .6)); c.setFillColor(LEAFG)
            c.ellipse(-s * .025, 0, s * .025, s * .06, stroke=0, fill=1); c.restoreState()
    c.restoreState()


def wreath(c, x, y, r, n=22):
    c.saveState()
    for i in range(n):
        a = 2 * math.pi * i / n
        c.saveState(); c.translate(x + r * math.cos(a), y + r * math.sin(a)); c.rotate(math.degrees(a) + 60)
        c.setFillColor(LEAFG if i % 2 else HexColor("#65A30D")); c.ellipse(-r * .09, -r * .2, r * .09, r * .2, stroke=0, fill=1)
        c.restoreState()
    c.setFillColor(RED)  # ribbon bow at the bottom
    for sx in (-1, 1):
        p = c.beginPath(); p.moveTo(x, y - r); p.lineTo(x + sx * r * .35, y - r + r * .18); p.lineTo(x + sx * r * .35, y - r - r * .18); p.close()
        c.drawPath(p, stroke=0, fill=1)
        p = c.beginPath(); p.moveTo(x, y - r); p.lineTo(x + sx * r * .22, y - r - r * .55); p.lineTo(x + sx * r * .08, y - r - r * .5); p.close()
        c.drawPath(p, stroke=0, fill=1)
    c.circle(x, y - r, r * .08, stroke=0, fill=1)
    c.restoreState()


def candle(c, x, y, h):
    c.saveState(); w = h * .22
    c.setFillColor(HexColor("#F8FAFC")); c.setStrokeColor(INK); c.setLineWidth(1.2); c.rect(x - w / 2, y, w, h, fill=1)
    c.setFillColor(GOLD); p = c.beginPath(); p.moveTo(x, y + h + h * .32)
    p.curveTo(x + w * .45, y + h + h * .12, x + w * .25, y + h + h * .02, x, y + h + h * .02)
    p.curveTo(x - w * .25, y + h + h * .02, x - w * .45, y + h + h * .12, x, y + h + h * .32); c.drawPath(p, stroke=0, fill=1)
    c.restoreState()


def cover_art(b, x, y, w, h):
    c = b.c
    c.setFillColor(NAVY); c.roundRect(x, y, w, h, 22, stroke=0, fill=1)
    wreath(c, x + 120, y + h / 2 + 22, 58)
    dove(c, x + w / 2 + 10, y + h / 2 + 10, 180, white, INK)
    maple_leaf(c, x + w - 110, y + h / 2 + 10, 70)
    c.setFillColor(GOLD); c.setFont("Anton", 26); c.drawCentredString(x + w / 2, y + 26, "LEST WE FORGET")
