"""Kindergarten (Ontario 2026 curriculum): Coding, Coins and Living Things. Built on the revised Kindergarten curriculum
(in effect September 2026): B11 Coding Skills (B11.1-B11.3), A6.13 Canadian coins to 25¢ and coins and bills to $10,
B13.2 living and non-living things. Codes and wording from the Ministry's Curriculum and Resources site."""
import math, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
from kit import Book, Theme, run, style, W, H, M, INK, GREY, KEYRED
from kit.janfeb import coin
from kit.winter import tree, mitten, mug, snowman
from kit.christmas import star, gift, ornament
from reportlab.lib.colors import white, HexColor

T = Theme("#7C3AED", "#4C1D95", "#FACC15", "#F5F3FF", "Fredoka")
GREEN, BLUE, ORANGE, BROWN, PINK = HexColor("#16A34A"), HexColor("#2563EB"), HexColor("#F97316"), HexColor("#92400E"), HexColor("#EC4899")
ONT = ("The Ontario Curriculum: Kindergarten (2026), in effect September 2026. <b>B11 Coding Skills</b>: B11.1 use directional and "
       "positional language to create and follow instructions involving movement; B11.2 test and refine instructions; B11.3 "
       "communicate and record step-by-step instructions using symbols, words, or pictures. <b>A6.13</b> identify and explore "
       "the value of Canadian coins to 25¢ and coins and bills to $10. <b>B13.2</b> sort and classify groups of living and "
       "non-living things. Also supports A6.6 (more than, the same, less than) and A8.1 (sort using one attribute).")
DIRS = {"R": (1, 0), "L": (-1, 0), "U": (0, 1), "D": (0, -1)}


def arrow(c, x, y, s, d, col=INK, fill=True):
    """Centre (x, y), size s, direction R/L/U/D."""
    ang = {"R": 0, "U": 90, "L": 180, "D": 270}[d]
    c.saveState(); c.translate(x, y); c.rotate(ang); c.setFillColor(col); c.setStrokeColor(col); c.setLineWidth(1.4)
    p = c.beginPath(); h = s / 2
    p.moveTo(-h, -h * .28); p.lineTo(h * .1, -h * .28); p.lineTo(h * .1, -h * .65); p.lineTo(h, 0); p.lineTo(h * .1, h * .65)
    p.lineTo(h * .1, h * .28); p.lineTo(-h, h * .28); p.close(); c.drawPath(p, stroke=1, fill=1 if fill else 0); c.restoreState()


def flower(c, x, y, s):
    c.saveState(); c.setStrokeColor(GREEN); c.setLineWidth(s * .05); c.line(x, y, x, y + s * .55)
    c.setFillColor(PINK)
    for k in range(6):
        a = math.radians(k * 60); c.circle(x + s * .15 * math.cos(a), y + s * .7 + s * .15 * math.sin(a), s * .12, stroke=0, fill=1)
    c.setFillColor(HexColor("#FACC15")); c.circle(x, y + s * .7, s * .1, stroke=0, fill=1); c.restoreState()


def fish(c, x, y, s):
    c.saveState(); c.setFillColor(ORANGE); c.ellipse(x - s * .35, y + s * .25, x + s * .2, y + s * .65, stroke=0, fill=1)
    p = c.beginPath(); p.moveTo(x + s * .15, y + s * .45); p.lineTo(x + s * .42, y + s * .62); p.lineTo(x + s * .42, y + s * .28); p.close()
    c.drawPath(p, stroke=0, fill=1); c.setFillColor(INK); c.circle(x - s * .2, y + s * .5, s * .04, stroke=0, fill=1); c.restoreState()


def bird(c, x, y, s):
    c.saveState(); c.setFillColor(BLUE); c.ellipse(x - s * .3, y + s * .2, x + s * .25, y + s * .55, stroke=0, fill=1)
    c.circle(x + s * .22, y + s * .6, s * .15, stroke=0, fill=1); c.setFillColor(HexColor("#FACC15"))
    p = c.beginPath(); p.moveTo(x + s * .35, y + s * .63); p.lineTo(x + s * .48, y + s * .58); p.lineTo(x + s * .35, y + s * .54); p.close(); c.drawPath(p, stroke=0, fill=1)
    c.setFillColor(white); c.circle(x + s * .25, y + s * .64, s * .035, stroke=0, fill=1)
    c.setStrokeColor(HexColor("#F59E0B")); c.setLineWidth(s * .03); c.line(x - s * .05, y + s * .2, x - s * .05, y + s * .05); c.line(x + s * .08, y + s * .2, x + s * .08, y + s * .05)
    c.restoreState()


def caterpillar(c, x, y, s):
    c.saveState()
    for k in range(5):
        c.setFillColor(GREEN if k < 4 else HexColor("#15803D")); c.circle(x - s * .34 + k * s * .17, y + s * .2 + (s * .05 if k % 2 else 0), s * .11, stroke=0, fill=1)
    c.setFillColor(INK); c.circle(x + s * .36, y + s * .27, s * .025, stroke=0, fill=1); c.restoreState()


def rock(c, x, y, s):
    c.saveState(); c.setFillColor(HexColor("#94A3B8")); p = c.beginPath()
    p.moveTo(x - s * .4, y + s * .05); p.curveTo(x - s * .45, y + s * .4, x - s * .1, y + s * .55, x + s * .15, y + s * .45)
    p.curveTo(x + s * .45, y + s * .4, x + s * .45, y + s * .1, x + s * .3, y + s * .05); p.close(); c.drawPath(p, stroke=0, fill=1); c.restoreState()


def ball(c, x, y, s):
    c.saveState(); c.setFillColor(HexColor("#EF4444")); c.circle(x, y + s * .35, s * .3, stroke=0, fill=1)
    c.setStrokeColor(white); c.setLineWidth(s * .05); c.line(x - s * .3, y + s * .35, x + s * .3, y + s * .35); c.restoreState()


PICS = {"tree": (lambda c, x, y, s: tree(c, x, y, s), True), "flower": (flower, True), "fish": (fish, True), "bird": (bird, True),
        "caterpillar": (caterpillar, True), "rock": (rock, False), "ball": (ball, False), "mug": (lambda c, x, y, s: mug(c, x, y, s * .9), False),
        "mitten": (lambda c, x, y, s: mitten(c, x, y, s * .9), False), "snowman": (lambda c, x, y, s: snowman(c, x, y, s * 1.1), False)}

# coding puzzles: grid size, start, goal, walls, code (follow) / solution (write)
FOLLOW = [dict(n=5, start=(0, 0), code="RRUU", goal=(2, 2)), dict(n=5, start=(0, 4), code="DDRRR", goal=(4, 2)),
          dict(n=5, start=(4, 0), code="UULLL", goal=(1, 2)), dict(n=5, start=(2, 4), code="DLLDD", goal=(0, 1))]
WRITE = [dict(n=5, start=(0, 0), goal=(3, 0), walls=[], sol="RRR"), dict(n=5, start=(0, 0), goal=(2, 2), walls=[(1, 0), (1, 1)], sol="UURR"),
         dict(n=5, start=(4, 4), goal=(1, 3), walls=[(3, 4), (2, 4)], sol="DLLL"), dict(n=5, start=(0, 2), goal=(4, 2), walls=[(2, 2)], sol="UURRRRDD")]
BUGS = [dict(n=5, start=(0, 0), goal=(3, 0), code="RRU", fixed="RRR"), dict(n=5, start=(0, 0), goal=(0, 3), code="UUR", fixed="UUU"),
        dict(n=5, start=(1, 1), goal=(3, 1), code="RL", fixed="RR")]


def run_code(start, code):
    x, y = start
    for ch in code: dx, dy = DIRS[ch]; x += dx; y += dy
    return x, y


for p in FOLLOW: p["yes"] = run_code(p["start"], p["code"]) == p["goal"]
assert [p["yes"] for p in FOLLOW] == [True, False, True, True]
for p in WRITE:
    pos = p["start"]; path = [pos]
    for ch in p["sol"]: dx, dy = DIRS[ch]; pos = (pos[0] + dx, pos[1] + dy); path.append(pos); assert pos not in p["walls"], p
    assert pos == p["goal"], p
for p in BUGS: assert run_code(p["start"], p["fixed"]) == p["goal"] and run_code(p["start"], p["code"]) != p["goal"], p


def grid(b, x, y, n, cell, start, goal, walls=(), path=None):
    """Top-left (x, y). Coordinates (col, row) with row 0 at the bottom."""
    c = b.c
    for i in range(n):
        for j in range(n):
            cx, cy = x + i * cell, y - (n - j) * cell
            c.setFillColor(b.t.light if (i + j) % 2 else white); c.setStrokeColor(b.t.primary); c.setLineWidth(1.2); c.rect(cx, cy, cell, cell, fill=1)
    for (i, j) in walls:
        rock(c, x + (i + .5) * cell, y - (n - j) * cell + cell * .15, cell * .8)
    if path:
        c.setStrokeColor(KEYRED); c.setLineWidth(3); c.setLineCap(1); p = c.beginPath()
        for k, (i, j) in enumerate(path):
            px, py = x + (i + .5) * cell, y - (n - j - .5) * cell; (p.moveTo if k == 0 else p.lineTo)(px, py)
        c.drawPath(p)
    i, j = start; star(c, x + (i + .5) * cell, y - (n - j - .5) * cell, cell * .32)
    i, j = goal; gift(c, x + (i + .5) * cell, y - (n - j) * cell + cell * .12, cell * .7)


def path_of(start, code):
    pos = start; out = [pos]
    for ch in code: dx, dy = DIRS[ch]; pos = (pos[0] + dx, pos[1] + dy); out.append(pos)
    return out


def follow_page(b, items, start_no, key=False):
    b.page("keys" if key else "fcode")
    y = b.header("Follow the Code", "B11.1  •  Coding", name=not key)
    if key: b.key_stamp()
    y = b.para("Start at the <b>star</b>. Follow the arrows, one square for each arrow. Draw your path. Does it reach the gift? "
               "Circle <b>yes</b> or <b>no</b>.", M, y, W - 2 * M, style(13, 18)) - 10
    c = b.c; cell = 34
    for k, p in enumerate(items):
        top = y - k * 270; gx = M + 10
        b.badge(M + 6, top - 4, start_no + k, r=12)
        grid(b, gx + 20, top - 14, p["n"], cell, p["start"], p["goal"], path=path_of(p["start"], p["code"]) if key else None)
        cx = gx + 20 + p["n"] * cell + 40
        c.setFillColor(INK); c.setFont("Fredoka", 16); c.drawString(cx, top - 30, "Code:")
        for i, ch in enumerate(p["code"]):
            c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); c.roundRect(cx + i * 46, top - 90, 40, 40, 8)
            arrow(c, cx + i * 46 + 20, top - 70, 26, ch, b.t.dark)
        c.setFillColor(INK); c.setFont("Fredoka", 18); c.drawString(cx, top - 140, "Gift?   yes     no")
        if key:
            pre = "Gift?   " if p["yes"] else "Gift?   yes     "; wd = "yes" if p["yes"] else "no"
            x0 = cx + c.stringWidth(pre, "Fredoka", 18); x1 = x0 + c.stringWidth(wd, "Fredoka", 18)
            c.setStrokeColor(KEYRED); c.setLineWidth(2.5); c.ellipse(x0 - 6, top - 148, x1 + 6, top - 124)


def write_page(b, items, start_no, key=False):
    b.page("keys" if key else "write")
    y = b.header("Write the Code", "B11.3  •  Coding", name=not key)
    if key: b.key_stamp()
    y = b.para("Help the <b>star</b> get to the <b>gift</b>. Go around the rocks! Draw one arrow in each box. "
               "Then test your code with your finger.", M, y, W - 2 * M, style(13, 18)) - 10
    c = b.c; cell = 34
    for k, p in enumerate(items):
        top = y - k * 270
        b.badge(M + 6, top - 4, start_no + k, r=12)
        grid(b, M + 30, top - 14, p["n"], cell, p["start"], p["goal"], p["walls"], path=path_of(p["start"], p["sol"]) if key else None)
        cx = M + 30 + p["n"] * cell + 30; nb = len(p["sol"])
        for i in range(max(nb, 4)):
            bx = cx + (i % 4) * 46; by = top - 40 - (i // 4) * 50
            c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); c.roundRect(bx, by - 40, 40, 40, 8)
            if key and i < nb: arrow(c, bx + 20, by - 20, 26, p["sol"][i], KEYRED)


def bug_page(b, key=False):
    b.page("keys" if key else "bug")
    y = b.header("Fix the Bug!", "B11.2  •  Test and refine", name=not key)
    if key: b.key_stamp()
    y = b.para("Each code has <b>one</b> mistake (a bug). Test it with your finger. Cross out the wrong arrow and draw the "
               "right one under it.", M, y, W - 2 * M, style(13, 18)) - 10
    c = b.c; cell = 30
    for k, p in enumerate(BUGS):
        top = y - k * 190
        b.badge(M + 6, top - 4, k + 1, r=12)
        grid(b, M + 30, top - 10, p["n"], cell, p["start"], p["goal"])
        cx = M + 30 + p["n"] * cell + 30
        for i, ch in enumerate(p["code"]):
            c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); c.roundRect(cx + i * 50, top - 60, 44, 44, 8)
            arrow(c, cx + i * 50 + 22, top - 38, 28, ch, b.t.dark)
            c.roundRect(cx + i * 50, top - 120, 44, 44, 8)
            if key and ch != p["fixed"][i]:
                c.setStrokeColor(KEYRED); c.setLineWidth(3); c.line(cx + i * 50 + 4, top - 56, cx + i * 50 + 40, top - 20)
                arrow(c, cx + i * 50 + 22, top - 98, 28, p["fixed"][i], KEYRED)


def arrow_cards(b):
    b.page("cards")
    y = b.header("Arrow Code Cards", "Cut out for floor or table coding", name=False)
    c = b.c; cw = (W - 2 * M) / 4; ch = 120
    for i in range(16):
        d = "RLUD"[i % 4]; x = M + (i % 4) * cw; top = y - 10 - (i // 4) * ch
        c.setDash(4, 3); c.setStrokeColor(GREY); c.setLineWidth(1); c.rect(x + 4, top - ch + 4, cw - 8, ch - 8); c.setDash()
        arrow(c, x + cw / 2, top - ch / 2 + 6, 60, d, [b.t.primary, GREEN, ORANGE, BLUE][i % 4])
        c.setFillColor(INK); c.setFont("BodyB", 11); c.drawCentredString(x + cw / 2, top - ch + 16, {"R": "right", "L": "left", "U": "up", "D": "down"}[d])


def bill(c, x, y, w, val):
    col = {5: HexColor("#60A5FA"), 10: HexColor("#A78BFA")}[val]
    c.saveState(); c.setFillColor(col); c.setStrokeColor(HexColor("#475569")); c.setLineWidth(1); c.roundRect(x, y, w, w * .46, 5, fill=1)
    c.setFillColor(white); c.circle(x + w * .72, y + w * .23, w * .14, stroke=0, fill=1)
    c.setFillColor(INK); c.setFont("Fredoka", w * .2); c.drawString(x + w * .08, y + w * .14, f"${val}"); c.restoreState()


MONEY = [("nickel", 5), ("dime", 10), ("quarter", 25), ("loonie", 100), ("toonie", 200)]


def money_names(b, key=False):
    b.page("keys" if key else "coins")
    y = b.header("Meet Canadian Money", "A6.13  •  Coins and bills", name=not key)
    if key: b.key_stamp()
    y = b.para("Say the name of each coin or bill and what it is worth. Draw a line to match each one to its value.", M, y, W - 2 * M, style(13, 18)) - 14
    c = b.c; items = MONEY + [("five-dollar bill", 500), ("ten-dollar bill", 1000)]
    vals = ["$10", "5¢", "$2", "25¢", "$5", "10¢", "$1"]
    true = {5: "5¢", 10: "10¢", 25: "25¢", 100: "$1", 200: "$2", 500: "$5", 1000: "$10"}
    for i, (nm, v) in enumerate(items):
        ry = y - 20 - i * 66
        if v >= 500: bill(c, M + 20, ry - 22, 90, v // 100)
        else: coin(c, M + 60, ry, v, 28)
        c.setFillColor(INK); c.setFont("Fredoka", 16); c.drawString(M + 130, ry - 6, nm)
        c.setFillColor(b.t.dark); c.circle(M + 300, ry, 5, stroke=0, fill=1)
        c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); c.roundRect(W - M - 110, ry - 20, 90, 40, 10)
        c.setFillColor(INK); c.setFont("Fredoka", 20); c.drawCentredString(W - M - 65, ry - 7, vals[i]); c.setFillColor(b.t.dark); c.circle(W - M - 124, ry, 5, stroke=0, fill=1)
        if key:
            j = vals.index(true[v]); c.setStrokeColor(KEYRED); c.setLineWidth(2); c.line(M + 304, ry, W - M - 128, y - 20 - j * 66)


SORT = [5, 25, 10, 10, 5, 25, 5, 10, 25, 5, 10, 5]


def coin_sort(b, key=False):
    b.page("keys" if key else "sort")
    y = b.header("Coin Sort", "A6.13  •  A8.1 sort by one attribute", name=not key)
    if key: b.key_stamp()
    y = b.para("Colour the <b>nickels</b> green, the <b>dimes</b> blue and the <b>quarters</b> yellow. Then count each kind.", M, y, W - 2 * M, style(13, 18)) - 10
    c = b.c
    for i, v in enumerate(SORT):
        cx = M + 50 + (i % 4) * 125; cy = y - 50 - (i // 4) * 100; coin(c, cx, cy, v, 36)
        if key: c.setStrokeColor({5: GREEN, 10: BLUE, 25: HexColor("#EAB308")}[v]); c.setLineWidth(4); c.circle(cx, cy, 36)
    y -= 330
    for k, (nm, v) in enumerate([("nickels", 5), ("dimes", 10), ("quarters", 25)]):
        x = M + k * 172; coin(c, x + 24, y - 20, v, 22)
        c.setFillColor(INK); c.setFont("Fredoka", 16); c.drawString(x + 52, y - 26, f"{nm}: ____")
        if key: c.setFillColor(KEYRED); c.drawString(x + 52 + c.stringWidth(f"{nm}: ", "Fredoka", 16), y - 24, str(SORT.count(v)))


MORE = [(("coin", 25), ("coin", 10)), (("coin", 5), ("coin", 10)), (("bill", 5), ("coin", 200)), (("coin", 100), ("coin", 200)), (("bill", 10), ("bill", 5))]


def worth_more(b, key=False):
    b.page("keys" if key else "more")
    y = b.header("Which Is Worth More?", "A6.13  •  A6.6", name=not key)
    if key: b.key_stamp()
    y = b.para("Circle the one that is worth <b>more</b>.", M, y, W - 2 * M, style(13, 18)) - 10
    c = b.c; val = lambda it: it[1] * (100 if it[0] == "bill" else 1)
    for i, pair in enumerate(MORE):
        ry = y - 50 - i * 104
        c.setStrokeColor(b.t.primary); c.setLineWidth(1.2); c.roundRect(M, ry - 46, W - 2 * M, 92, 14)
        for k, it in enumerate(pair):
            cx = M + 140 + k * 240
            if it[0] == "bill": bill(c, cx - 50, ry - 23, 100, it[1])
            else: coin(c, cx, ry, it[1], 34)
            if key and val(it) == max(val(p) for p in pair): c.setStrokeColor(KEYRED); c.setLineWidth(3); c.circle(cx, ry, 48)
        c.setFillColor(GREY); c.setFont("Fredoka", 18); c.drawCentredString(M + 260, ry - 6, "or")


def count_loonies(b, key=False):
    b.page("keys" if key else "count")
    y = b.header("How Many Dollars?", "A6.13  •  Count loonies", name=not key)
    if key: b.key_stamp()
    y = b.para("Count the loonies. Each loonie is worth one dollar. Write how many dollars.", M, y, W - 2 * M, style(13, 18)) - 10
    c = b.c
    for i, n in enumerate([3, 6, 4, 8, 10]):
        ry = y - 50 - i * 104
        c.setStrokeColor(b.t.primary); c.setLineWidth(1.2); c.roundRect(M, ry - 46, W - 2 * M, 92, 14)
        for k in range(n): coin(c, M + 34 + (k % 5) * 50 + (k // 5) * 0, ry + (14 if k < 5 else -26) if n > 5 else ry, 100, 22)
        c.setFillColor(INK); c.setFont("Fredoka", 22); c.drawString(W - M - 140, ry - 8, "$ ____")
        if key: c.setFillColor(KEYRED); c.drawString(W - M - 112, ry - 4, str(n))


def store(b):
    b.page("store")
    y = b.header("Class Store Price Tags", "A6.13  •  Dramatic play centre", name=False)
    y = b.para("Cut out the tags for a pretend store. Use play loonies, toonies and bills. Every price is $10 or less.", M, y, W - 2 * M, style(12.5, 17)) - 10
    c = b.c; items = [("ball", 2, ball), ("mitten", 4, lambda c_, x, y_, s: mitten(c_, x, y_, s * .9)), ("mug", 3, lambda c_, x, y_, s: mug(c_, x, y_, s * .9)),
                      ("gift", 10, lambda c_, x, y_, s: gift(c_, x, y_, s)), ("star", 1, lambda c_, x, y_, s: star(c_, x, y_ + s * .45, s * .45)),
                      ("ornament", 5, lambda c_, x, y_, s: ornament(c_, x, y_, s)), ("flower", 6, flower), ("fish toy", 8, fish), ("rock", 1, rock)]
    cw = (W - 2 * M) / 3; ch = 180
    for i, (nm, p, fn) in enumerate(items):
        x = M + (i % 3) * cw; top = y - (i // 3) * ch
        c.setDash(4, 3); c.setStrokeColor(GREY); c.rect(x + 5, top - ch + 5, cw - 10, ch - 10); c.setDash()
        fn(c, x + cw / 2, top - 110, 80)
        c.setFillColor(b.t.primary); c.roundRect(x + cw / 2 - 40, top - ch + 18, 80, 34, 10, stroke=0, fill=1)
        c.setFillColor(white); c.setFont("Fredoka", 22); c.drawCentredString(x + cw / 2, top - ch + 27, f"${p}")


LIVING = ["tree", "rock", "fish", "mug", "flower", "ball", "bird", "mitten", "caterpillar", "snowman"]


def living_sort(b, key=False):
    b.page("keys" if key else "living")
    y = b.header("Living or Non-Living?", "B13.2  •  Sort and classify", name=not key)
    if key: b.key_stamp()
    y = b.para("Living things grow, need food and water, and make more living things. Cut out the pictures and glue them in "
               "the right box, or draw a line to the right box.", M, y, W - 2 * M, style(12.5, 17)) - 10
    c = b.c; cw = (W - 2 * M) / 5
    for i, nm in enumerate(LIVING):
        x = M + (i % 5) * cw; top = y - (i // 5) * 104
        c.setDash(4, 3); c.setStrokeColor(GREY); c.rect(x + 4, top - 100, cw - 8, 96); c.setDash()
        PICS[nm][0](c, x + cw / 2, top - 88, 70)
        if key: c.setFillColor(KEYRED); c.setFont("BodyB", 10); c.drawCentredString(x + cw / 2, top - 96, "living" if PICS[nm][1] else "non-living")
    y -= 230
    bw = (W - 2 * M - 16) / 2
    for k, lab in enumerate(["LIVING", "NON-LIVING"]):
        x = M + k * (bw + 16)
        c.setFillColor([GREEN, HexColor("#64748B")][k]); c.roundRect(x, y - 36, bw, 36, 10, stroke=0, fill=1)
        c.setFillColor(white); c.setFont("Fredoka", 20); c.drawCentredString(x + bw / 2, y - 26, lab)
        c.setStrokeColor([GREEN, HexColor("#64748B")][k]); c.setLineWidth(2); c.roundRect(x, 60, bw, y - 40 - 60, 10)


def living_check(b, key=False):
    b.page("keys" if key else "check")
    y = b.header("Is It Alive?", "B13.2  •  B12.2 observe and predict", name=not key)
    if key: b.key_stamp()
    y = b.para("Look at each picture. Does it <b>grow</b>? Does it <b>eat or drink</b>? Colour yes or no.", M, y, W - 2 * M, style(13, 18)) - 10
    c = b.c
    for i, nm in enumerate(["bird", "rock", "flower", "snowman", "fish"]):
        ry = y - 10 - i * 112
        c.setStrokeColor(b.t.primary); c.setLineWidth(1.2); c.roundRect(M, ry - 100, W - 2 * M, 96, 14)
        PICS[nm][0](c, M + 70, ry - 90, 78)
        for k, q in enumerate(["Grows?", "Eats or drinks?"]):
            qx = M + 170 + k * 170
            c.setFillColor(INK); c.setFont("Fredoka", 15); c.drawString(qx, ry - 40, q)
            for j, w_ in enumerate(["yes", "no"]):
                c.setStrokeColor(INK); c.setLineWidth(1.2); c.roundRect(qx + j * 60, ry - 80, 50, 26, 12)
                c.setFont("Fredoka", 14); c.drawCentredString(qx + j * 60 + 25, ry - 72, w_)
                if key and (j == 0) == PICS[nm][1]: c.setStrokeColor(KEYRED); c.setLineWidth(3); c.roundRect(qx + j * 60, ry - 80, 50, 26, 12)


def art(b, x, y, w, h):
    c = b.c
    c.setFillColor(b.t.dark); c.roundRect(x, y, w, h, 22, stroke=0, fill=1)
    for i, d in enumerate("RRUR"):
        c.setFillColor(white); c.roundRect(x + 30 + i * 52, y + h - 80, 46, 46, 10, stroke=0, fill=1); arrow(c, x + 53 + i * 52, y + h - 57, 28, d, b.t.primary)
    for i, v in enumerate([5, 10, 25, 100, 200]): coin(c, x + 60 + i * 64, y + 70, v, 26)
    bill(c, x + w - 150, y + 120, 110, 10); bill(c, x + w - 170, y + 60, 110, 5)
    flower(c, x + w - 60, y + h - 110, 80); fish(c, x + w - 160, y + h - 100, 70)


def build(b):
    b.cover(["coding", "Canadian money", "living things", "2026 curriculum"])
    b.guide("Hands-on pages for three new areas of the revised Ontario Kindergarten curriculum (2026): unplugged coding with "
            "arrows (B11), Canadian coins and bills to $10 (A6.13), and sorting living and non-living things (B13.2). Directions "
            "are short and can be read aloud. Pages work as small-group lessons, centres or take-home practice.",
            [("fcode", "Follow the Code (4 puzzles), B11.1"), ("write", "Write the Code (4 puzzles), B11.3"), ("bug", "Fix the Bug!, B11.2"),
             ("cards", "Arrow code cards for floor coding"), ("coins", "Meet Canadian Money, A6.13"), ("sort", "Coin Sort, A6.13 and A8.1"),
             ("more", "Which Is Worth More?, A6.13 and A6.6"), ("count", "How Many Dollars? (loonies to $10)"), ("store", "Class store price tags"),
             ("living", "Living or Non-Living? sort, B13.2"), ("check", "Is It Alive?, B13.2"), ("keys", "Answer keys"), ("terms", "Terms of use")],
            [("Coding first, then paper", "Start with a floor grid (tape or a carpet) and the arrow cards: one child is the robot and "
              "others give the code. Then move to the paper puzzles."),
             ("Money", "Use real or play coins alongside the pages. The Kindergarten expectation is to identify and explore coins to "
              "25¢ and coins and bills to $10, so counting stays with loonies and simple comparisons."),
             ("Documentation", "Each page shows its expectation code, which makes noting learning for the Communication of Learning easier.")], ONT)
    follow_page(b, FOLLOW[:2], 1); follow_page(b, FOLLOW[2:], 3)
    write_page(b, WRITE[:2], 1); write_page(b, WRITE[2:], 3)
    bug_page(b); arrow_cards(b)
    money_names(b); coin_sort(b); worth_more(b); count_loonies(b); store(b)
    living_sort(b); living_check(b)
    follow_page(b, FOLLOW[:2], 1, True); follow_page(b, FOLLOW[2:], 3, True)
    write_page(b, WRITE[:2], 1, True); write_page(b, WRITE[2:], 3, True); bug_page(b, True)
    money_names(b, True); coin_sort(b, True); worth_more(b, True); count_loonies(b, True)
    living_sort(b, True); living_check(b, True)
    b.terms()


LISTING = dict(
    tpt_title="Kindergarten Coding, Canadian Money & Living Things | NEW Ontario Kindergarten Curriculum 2026",
    price="$4.50. Range $4 to $5.", grades="Kindergarten (JK/SK)", subjects="Math, Coding, Science", type="Centres, Worksheets, Printables",
    description="""
Hands-on pages for three **new areas of the revised Ontario Kindergarten curriculum (2026)**, now in effect:

**Coding (B11.1, B11.2, B11.3):**
- Follow the Code: 4 grid puzzles
- Write the Code: 4 puzzles with rocks to code around
- Fix the Bug! (test and refine)
- Arrow code cards for floor and table coding

**Canadian Money (A6.13: coins to 25¢ and coins and bills to $10):**
- Meet Canadian Money (nickel, dime, quarter, loonie, toonie, $5 and $10 bills)
- Coin Sort, Which Is Worth More?, How Many Dollars? (loonies to $10)
- Class store price tags for dramatic play

**Living Things (B13.2):**
- Living or Non-Living? cut-and-sort
- Is It Alive? (grows, eats or drinks)

Teacher guide with the exact 2026 expectation codes, plus answer keys.
""",
    keywords=["kindergarten coding", "Ontario kindergarten 2026", "new kindergarten curriculum", "Canadian money", "coins",
              "living and non-living", "unplugged coding", "JK SK", "kindergarten math", "Ontario curriculum"])

if __name__ == "__main__":
    b = Book("Kindergarten-Coding-Money-Living-Things-Ontario-2026", "Coding, Coins & Living Things", "Kindergarten (New 2026 Curriculum)",
             "Kindergarten", T, art, ribbon="NEW 2026 CURRICULUM")
    run(build, b, inside=[3, 5, 7, 9, 11, 15], feature=3, feature_line=("Unplugged coding", "B11  •  A6.13  •  B13.2"),
        key_page=17, preview=[1, 3, 5, 7, 9, 15], listing=LISTING)
