"""12-Day Christmas Countdown to Winter Break (Grades 1-3, Ontario): poster, one activity page per day, certificate, keys."""
import math, os, random, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
from kit import Book, run, style, W, H, M, INK, GREY, KEYRED
from kit.christmas import ornament, gift, candy_cane, stocking, bell, star, gingerbread, christmas_scene, RED, GREEN, GOLD
from kit.janfeb import coin
from kit.puzzles import wordsearch, draw_wordsearch, maze, draw_maze
from reportlab.lib.colors import white, HexColor

ONT = ("Ontario Mathematics (2020), Grades 1-3: <b>B1 Number Sense</b> (skip counting), <b>B2 Operations</b> "
       "(addition and subtraction facts, mental strategies, number lines) and <b>D1 Data Literacy</b> (tally charts, bar graphs, "
       "answering questions about data) and <b>F1 Money</b> (Canadian coins and their values). Ontario Language (2023): <b>Strand B Foundations of Language</b> (phonological awareness: "
       "syllables; word study; alphabetical order) and <b>Strand D Composition</b> (writing about a personal idea).")


def day(b, n, title, key=False):
    b.page("keys" if key else f"d{n}")
    y = b.header(f"Day {n}: {title}", "12-Day Christmas Countdown", name=not key)
    if key: b.key_stamp()
    return y


def direction(b, text, y):
    return b.para(text, M, y, W - 2 * M, style(13, 17)) - 12


def ans(c, x, y, text, size=16):
    c.setFillColor(KEYRED); c.setFont("BodyB", size); c.drawCentredString(x, y, str(text))


# ---------- poster ----------
def gift_outline(c, x, y, w, h, n):
    c.saveState(); c.setStrokeColor(INK); c.setLineWidth(2); c.setFillColor(white)
    c.rect(x - w / 2, y, w, h * .78, fill=1); c.rect(x - w / 2 - 6, y + h * .62, w + 12, h * .18, fill=1)
    c.line(x - w * .09, y, x - w * .09, y + h * .62); c.line(x + w * .09, y, x + w * .09, y + h * .62)
    for sx in (-1, 1):
        p = c.beginPath(); p.moveTo(x, y + h * .8); p.curveTo(x + sx * w * .45, y + h * 1.1, x + sx * w * .05, y + h * 1.12, x, y + h * .8)
        c.drawPath(p, fill=1)
    c.setFillColor(white); c.circle(x, y + h * .33, h * .2, fill=1)
    c.setFillColor(INK); c.setFont("Fredoka", h * .26); c.drawCentredString(x, y + h * .33 - h * .09, str(n))
    c.restoreState()


def poster(b):
    b.page("poster")
    y = b.header("Countdown to Winter Break!", "Colour one gift each day", name=False)
    c = b.c; cw, ch = (W - 2 * M) / 3, 148
    for i, n in enumerate(range(12, 0, -1)):
        cx = M + cw * (i % 3) + cw / 2; top = y - 10 - ch * (i // 3)
        gift_outline(c, cx, top - ch + 30, 104, 94, n)
        c.setFillColor(b.t.primary); c.setFont("BodyB", 11); c.drawCentredString(cx, top - ch + 12, f"Day {n}")
    c.setFillColor(INK); c.setFont("BodyB", 14); c.drawCentredString(W / 2, 50, "Only ______ more days until winter break!")


# ---------- Day 12: skip counting ----------
SKIP = [(2, "ornament", 6), (5, "star", 4), (10, "bell", 4)]
SEQ = [[2, 4, None, 8, None, 12, None], [5, 10, None, 20, None, 30, None], [10, None, 30, None, 50, None, 70]]


def icon(c, name, x, y, s):
    {"ornament": lambda: ornament(c, x, y, s), "star": lambda: star(c, x, y + s * .45, s * .5),
     "bell": lambda: bell(c, x, y, s), "gift": lambda: gift(c, x, y, s)}[name]()


def skip(b, key=False):
    y = day(b, 12, "Skip Counting", key)
    y = direction(b, "Count each group. Skip count to find the total. Write the number in the box.", y)
    c = b.c
    for by, name, groups in SKIP:
        y = b.section_title(f"Count by {by}s", y - 6) - 10
        gw = (W - 2 * M) / groups - 8; cols = min(by, 5); rows = math.ceil(by / 5)
        s = min(30, (gw - 12) / cols * .92)
        for g in range(groups):
            gx = M + g * (gw + 8)
            c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); c.roundRect(gx, y - 18 - rows * (s + 6), gw, rows * (s + 6) + 12, 8)
            for k in range(by):
                ix = gx + gw / 2 + ((k % 5) - (min(by, 5) - 1) / 2) * (gw - 12) / cols
                icon(c, name, ix, y - 10 - (k // 5 + 1) * (s + 6) + 3, s)
            bx = gx + gw / 2; byy = y - 30 - rows * (s + 6) - 34
            c.setStrokeColor(INK); c.setLineWidth(1.2); c.roundRect(bx - 26, byy, 52, 32, 6)
            if key: ans(c, bx, byy + 10, by * (g + 1), 17)
        y = y - 30 - rows * (s + 6) - 48
    y = b.section_title("Fill in the missing numbers", y - 4) - 12
    for k, seq in enumerate(SEQ):
        sw = (W - 2 * M) / len(seq)
        for i, v in enumerate(seq):
            sx = M + i * sw + sw / 2
            c.setStrokeColor(b.t.primary); c.setLineWidth(1.2); c.roundRect(sx - sw / 2 + 6, y - 34, sw - 12, 32, 8)
            step = seq[1] - seq[0] if seq[1] else seq[2] // 3
            if v is not None: c.setFillColor(INK); c.setFont("BodyB", 16); c.drawCentredString(sx, y - 24, str(v))
            elif key: ans(c, sx, y - 24, step * (i + 1), 16)
        y -= 40


# ---------- Day 11: addition tags ----------
ADD = [(8, 5), (9, 6), (7, 7), (6, 8), (9, 4), (5, 7), (10, 8), (4, 9), (8, 8), (3, 9)]


def addition(b, key=False):
    y = day(b, 11, "Gift Tag Addition", key)
    y = direction(b, "Solve each gift tag. Use a strategy you know: make 10, doubles, or count on.", y)
    c = b.c; tw, th = (W - 2 * M - 20) / 2, 54
    for i, (p, q) in enumerate(ADD):
        x = M + (i % 2) * (tw + 20); top = y - (i // 2) * (th + 12)
        c.setFillColor(b.t.light); c.setStrokeColor(b.t.primary); c.setLineWidth(1.5)
        p_ = c.beginPath(); p_.moveTo(x + 24, top); p_.lineTo(x + tw, top); p_.lineTo(x + tw, top - th); p_.lineTo(x + 24, top - th)
        p_.lineTo(x, top - th / 2); p_.close(); c.drawPath(p_, fill=1)
        c.setFillColor(white); c.circle(x + 18, top - th / 2, 5, fill=1)
        c.setFillColor(INK); c.setFont("BodyB", 22); c.drawString(x + 48, top - th / 2 - 8, f"{p} + {q} =")
        c.setStrokeColor(INK); c.setLineWidth(1); c.line(x + 150, top - th / 2 - 10, x + tw - 20, top - th / 2 - 10)
        if key: ans(c, (x + 150 + x + tw - 20) / 2, top - th / 2 - 6, p + q, 20)
    y -= 5 * (th + 12) + 10
    y = b.section_title("Word problem", y) - 8
    y = b.para("Elf Maya wrapped <b>9</b> gifts. Elf Sam wrapped <b>7</b> gifts. How many gifts did they wrap altogether? "
               "Show your thinking with pictures, numbers or words.", M, y, W - 2 * M, style(13, 17)) - 8
    c.setStrokeColor(GREY); c.setLineWidth(1); c.roundRect(M, 60, W - 2 * M, y - 60, 10)
    c.setFillColor(INK); c.setFont("BodyB", 13); c.drawRightString(W - M - 12, 74, "They wrapped ______ gifts.")
    if key: ans(c, W - M - 72, 78, "16", 15); ans(c, W / 2, (y + 60) / 2, "9 + 7 = 16  (9 + 1 = 10, then 10 + 6 = 16)", 14)


# ---------- Day 10: word search ----------
WORDS = ["TREE", "STAR", "BELL", "GIFT", "ELF", "SNOW", "SLED", "CANDY", "COOKIE", "SANTA", "JOY", "WREATH"]
GRID, PLACE = wordsearch(WORDS, 10, 10, seed=5)


def search(b, key=False):
    y = day(b, 10, "Word Search", key)
    y = direction(b, "Find each word. Words go across or down. Tick the box when you find it.", y)
    cell = 40; x = (W - 10 * cell) / 2
    draw_wordsearch(b, GRID, x, y - 6, cell, PLACE if key else None)
    y -= 10 * cell + 34; c = b.c; cw = (W - 2 * M) / 4
    for i, w in enumerate(WORDS):
        wx = M + 20 + (i % 4) * cw; wy = y - (i // 4) * 28
        c.setStrokeColor(INK); c.setLineWidth(1); c.rect(wx, wy - 3, 13, 13)
        if key:
            c.setStrokeColor(KEYRED); c.setLineWidth(2); c.line(wx + 2, wy + 4, wx + 6, wy); c.line(wx + 6, wy, wx + 12, wy + 10)
        c.setFillColor(INK); c.setFont("BodyB", 14); c.drawString(wx + 22, wy - 1, w)


# ---------- Day 9: ABC order ----------
ABC = [("Set 1", ["tree", "bell", "star", "gift", "candy"]), ("Set 2", ["sled", "elf", "wreath", "joy", "mitten"]),
       ("Challenge: same first letter! Look at the second letter.", ["snow", "star", "sled", "sock"])]


def abc(b, key=False):
    y = day(b, 9, "ABC Order", key)
    y = direction(b, "Read the words. Write them in ABC order on the lines.", y)
    c = b.c
    for title, words in ABC:
        y = b.section_title(title, y - 4, size=14) - 10
        n = len(words); cw = (W - 2 * M) / n
        for i, w in enumerate(words):
            cx = M + cw * i + cw / 2
            c.setFillColor(b.t.light); c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); c.roundRect(cx - cw / 2 + 6, y - 36, cw - 12, 36, 10, fill=1)
            c.setFillColor(INK); c.setFont("BodyB", 17); c.drawCentredString(cx, y - 24, w)
        y -= 70
        for i, w in enumerate(sorted(words)):
            cx = M + cw * i + cw / 2
            c.setFillColor(INK); c.setFont("BodyB", 13); c.drawString(cx - cw / 2 + 6, y, f"{i + 1}.")
            c.setStrokeColor(INK); c.setLineWidth(1); c.line(cx - cw / 2 + 22, y - 2, cx + cw / 2 - 8, y - 2)
            if key: ans(c, cx + 7, y + 2, w, 15)
        y -= 50
    candy_cane(c, M + 40, 60, 90); gingerbread(c, W - M - 60, 56, 110)


# ---------- Day 8: gingerbread design ----------
def design(b):
    y = day(b, 8, "Design a Gingerbread Friend")
    y = direction(b, "Decorate your gingerbread friend. Add buttons, a smile, icing, and maybe a scarf or a toque!", y)
    c = b.c; gingerbread(c, W / 2, y - 330, 320, outline=True)
    y -= 360
    c.setFillColor(INK); c.setFont("BodyB", 14)
    c.drawString(M, y, "My gingerbread friend's name is ______________________________.")
    c.drawString(M, y - 40, "Three describing words:")
    for i in range(3):
        c.line(M + 20 + i * 172, y - 76, M + 160 + i * 172, y - 76)


# ---------- Day 7: graphing ----------
DATA = [("Candy cane", 6), ("Cookie", 8), ("Hot chocolate", 5), ("Clementine", 3)]
GQ = [("Which treat got the most votes?", "Cookie (8 votes)"),
      ("How many more people chose cookies than clementines?", "5 more (8 − 3 = 5)"),
      ("How many people voted in all?", "22 people (6 + 8 + 5 + 3)"),
      ("Which treat got 1 more vote than hot chocolate?", "Candy cane (6 votes)")]


def tally(c, x, y, n):
    c.setStrokeColor(INK); c.setLineWidth(2)
    for g in range(0, n, 5):
        k = min(5, n - g); gx = x + (g // 5) * 46
        for i in range(min(k, 4)): c.line(gx + i * 8, y, gx + i * 8, y + 20)
        if k == 5: c.line(gx - 4, y + 4, gx + 28, y + 16)


def graph(b, key=False):
    y = day(b, 7, "Favourite Treat Graph", key)
    y = direction(b, "Room 12 voted for their favourite holiday treat. Use the tally chart to colour the bar graph. "
                     "Then answer the questions.", y)
    c = b.c
    y = b.table(["Treat", "Tally", "Total"], [(t, "", "") for t, _ in DATA], M, y, [170, 236, 110], rh=26, fs=12) - 20
    for i, (t, n) in enumerate(DATA):
        ry = y + 20 + (len(DATA) - 1 - i) * 26
        tally(c, M + 190, ry + 3, n)
        if key: ans(c, M + 461, ry + 8, n, 14)
    # bar graph
    gx, gy, gw, gh = M + 34, 110, 280, y - 160
    unit = gh / 10
    c.setStrokeColor(GREY); c.setLineWidth(.6)
    for k in range(11):
        c.setFillColor(INK); c.setFont("Body", 10); c.drawRightString(gx - 6, gy + k * unit - 3, str(k))
    bw = gw / 4
    for i, (t, n) in enumerate(DATA):
        if key:
            c.setFillColor(HexColor("#FCA5A5")); c.rect(gx + i * bw + 12, gy, bw - 24, n * unit, stroke=0, fill=1)
        c.setStrokeColor(GREY)
        for k in range(10): c.rect(gx + i * bw + 12, gy + k * unit, bw - 24, unit)
        c.setFillColor(INK); c.setFont("BodyB", 9.5); c.drawCentredString(gx + i * bw + bw / 2, gy - 16, t)
    c.setStrokeColor(INK); c.setLineWidth(1.5); c.line(gx, gy, gx + gw, gy); c.line(gx, gy, gx, gy + gh)
    c.saveState(); c.translate(M + 6, gy + gh / 2); c.rotate(90); c.setFont("BodyB", 10); c.setFillColor(INK)
    c.drawCentredString(0, 0, "Number of votes"); c.restoreState()
    c.setFont("BodyB", 12); c.drawCentredString(gx + gw / 2, gy + gh + 10, "Our Favourite Treats")
    qx = gx + gw + 26; qy = y
    for i, (q, a) in enumerate(GQ, 1):
        qy = b.question(i, q, qy, 2, x=qx, w=W - M - qx, answer=a if key else None, st=style(11.5, 15)) - 4


# ---------- Day 6: number line subtraction ----------
SUB = [(15, 6), (12, 5), (17, 9), (14, 8), (20, 7), (13, 10)]


def numberline(b, key=False):
    y = day(b, 6, "Hop Back on the Number Line", key)
    y = direction(b, "Start at the first number. Hop back to subtract. Where do you land? Write the answer.", y)
    c = b.c; x0, x1 = M + 20, W - M - 20; step = (x1 - x0) / 20
    for p, q in SUB:
        c.setFillColor(INK); c.setFont("BodyB", 18); c.drawString(M, y - 16, f"{p} − {q} = ______")
        if key: ans(c, M + 118, y - 14, p - q, 18)
        ly = y - 62
        c.setStrokeColor(INK); c.setLineWidth(1.5); c.line(x0 - 8, ly, x1 + 8, ly)
        for k in range(21):
            c.line(x0 + k * step, ly - 5, x0 + k * step, ly + 5)
            c.setFont("Body", 10); c.drawCentredString(x0 + k * step, ly - 18, str(k))
        if key:
            a, z = x0 + p * step, x0 + (p - q) * step
            c.saveState(); c.setStrokeColor(KEYRED); c.setLineWidth(2)
            pth = c.beginPath(); pth.moveTo(a, ly + 6); pth.curveTo(a, ly + 30, z, ly + 30, z, ly + 6); c.drawPath(pth)
            c.setFillColor(KEYRED); c.circle(z, ly, 4, stroke=0, fill=1); c.setFont("BodyB", 11); c.drawCentredString((a + z) / 2, ly + 28, f"−{q}")
            c.restoreState()
        y -= 92


# ---------- Day 5: syllables ----------
SYL = {1: ["tree", "bell", "star", "gift"], 2: ["candy", "cookie", "present", "mitten"], 3: ["ornament", "gingerbread", "celebrate", "December"]}
BANK = ["cookie", "tree", "ornament", "bell", "present", "December", "star", "candy", "gingerbread", "gift", "mitten", "celebrate"]


def syllables(b, key=False):
    y = day(b, 5, "Clap the Syllables", key)
    y = direction(b, "Say each word and clap the parts (syllables). Write the word in the right column.", y)
    c = b.c; cw = (W - 2 * M) / 4
    for i, w in enumerate(BANK):
        cx = M + cw * (i % 4) + cw / 2; cy = y - (i // 4) * 44
        c.setFillColor(b.t.light); c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); c.roundRect(cx - cw / 2 + 6, cy - 34, cw - 12, 34, 10, fill=1)
        c.setFillColor(INK); c.setFont("BodyB", 15); c.drawCentredString(cx, cy - 23, w)
    y -= 3 * 44 + 24
    colw = (W - 2 * M - 24) / 3
    for j, n in enumerate((1, 2, 3)):
        x = M + j * (colw + 12)
        c.setFillColor(b.t.dark); c.roundRect(x, y - 40, colw, 40, 8, stroke=0, fill=1)
        c.setFillColor(white); c.setFont("Fredoka", 18); c.drawCentredString(x + colw / 2, y - 27, f"{n} clap" + ("s" if n > 1 else ""))
        c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); c.roundRect(x, 70, colw, y - 44 - 70, 8)
        for k in range(4):
            ly = y - 100 - k * 60
            c.setStrokeColor(INK); c.setLineWidth(1); c.line(x + 14, ly, x + colw - 14, ly)
            if key: ans(c, x + colw / 2, ly + 6, SYL[n][k], 15)
        for k in range(n): c.setFillColor(b.t.accent); c.circle(x + colw / 2 + (k - (n - 1) / 2) * 18, 88, 6, stroke=0, fill=1)


# ---------- Day 4: coins ----------
STOCK = [[10, 10, 5], [25, 5, 5, 5], [25, 10, 5, 5], [25, 25, 10], [25, 25, 25, 10, 5], [25, 25, 10, 10, 10, 5]]


def coins(b, key=False):
    y = day(b, 4, "Coins in the Stocking", key)
    y = direction(b, "Count the coins in each stocking. Write the total. (Hint: start with the coin worth the most.)", y)
    c = b.c; bw, bh = (W - 2 * M - 16) / 2, 132
    for i, cs in enumerate(STOCK):
        x = M + (i % 2) * (bw + 16); top = y - (i // 2) * (bh + 12)
        c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); c.roundRect(x, top - bh, bw, bh, 12)
        stocking(c, x + 40, top - bh + 30, 84, [RED, GREEN][i % 2])
        b.badge(x + 16, top - 16, i + 1)
        for k, v in enumerate(cs):
            coin(c, x + 118 + (k % 3) * 46, top - 36 - (k // 3) * 46, v, 26)
        c.setFillColor(INK); c.setFont("BodyB", 13); c.drawString(x + 92, top - bh + 14, "Total: ________ ¢")
        if key: ans(c, x + 168, top - bh + 18, sum(cs), 15)
    y -= 3 * (bh + 12) + 8
    y = b.para("<b>Challenge:</b> Show <b>75¢</b> two different ways. Draw or write the coins.", M, y, W - 2 * M, style(13, 17)) - 8
    for k in range(2):
        c.setStrokeColor(GREY); c.setLineWidth(1); c.roundRect(M + k * (W / 2 - M + 8), 46, W / 2 - M - 8, y - 46, 8)
    if key:
        ans(c, M + (W / 2 - M - 8) / 2, (y + 46) / 2, "25¢ + 25¢ + 25¢", 13)
        ans(c, W / 2 + 8 + (W / 2 - M - 8) / 2, (y + 46) / 2, "25¢ + 5 dimes (50¢)", 13)


# ---------- Day 3: kindness writing ----------
def kindness(b):
    y = day(b, 3, "The Gift of Kindness")
    y = direction(b, "Some of the best gifts can't be bought. What is a kind thing you can do for someone this winter break? "
                     "Draw it. Then write about it. Tell who, what and why.", y)
    c = b.c; c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); c.roundRect(M, y - 210, W - 2 * M, 210, 12)
    y -= 222
    c.setFillColor(INK); c.setFont("BodyB", 13); c.drawString(M, y - 10, "I can be kind by ...")
    b.rule_lines(M, y - 14, W - 2 * M, 7, gap=32)


# ---------- Day 2: maze ----------
MZ = (11, 12)
MAZE = maze(*MZ, seed=12)


def mazepage(b, key=False):
    y = day(b, 2, "Gingerbread Maze", key)
    y = direction(b, "Help the gingerbread friend find the way to the gift. Draw a line. Don't cross any walls!", y)
    cell = 38; cols, rows = MZ; x = (W - cols * cell) / 2
    draw_maze(b, MAZE, cols, rows, x, y - 10, cell, solution=key)
    gingerbread(b.c, x - 30, y - 10 - cell + 2, 44)
    gift(b.c, x + cols * cell + 28, y - 10 - rows * cell + 2, 42)


# ---------- Day 1: riddle ----------
CODE = {"A": 14, "B": 8, "E": 15, "F": 11, "H": 7, "L": 9, "T": 12, "N": 13, "O": 6, "R": 16, "S": 10}
RIDDLE = [[("T", "8 + 4"), ("H", "13 − 6"), ("E", "9 + 6")],
          [("E", "20 − 5"), ("L", "4 + 5"), ("F", "18 − 7"), ("-", ""), ("A", "7 + 7"), ("B", "16 − 8"), ("E", "10 + 5"), ("T", "19 − 7")]]
for row in RIDDLE:
    for L, p in row:
        if p: assert eval(p.replace("−", "-")) == CODE[L], (L, p)


def riddle(b, key=False):
    y = day(b, 1, "Riddle Code", key)
    c = b.c
    y = b.para("<b>What do elves learn in school?</b>", M, y, W - 2 * M, style(18, 22, b.t.primary, "BodyB")) - 8
    y = direction(b, "Solve each problem. Find the answer in the code box. Write its letter in the box to solve the riddle.", y)
    items = sorted(CODE.items(), key=lambda kv: kv[1]); bw = (W - 2 * M) / len(items)
    for i, (L, v) in enumerate(items):
        x = M + i * bw
        c.setFillColor(b.t.light if i % 2 else white); c.setStrokeColor(b.t.dark); c.setLineWidth(1); c.rect(x, y - 52, bw, 52, fill=1)
        c.setFillColor(INK); c.setFont("BodyB", 16); c.drawCentredString(x + bw / 2, y - 22, str(v))
        c.setFillColor(b.t.primary); c.setFont("Fredoka", 18); c.drawCentredString(x + bw / 2, y - 45, L)
    y -= 90
    sw = 60
    for row in RIDDLE:
        total = sum(sw if L != "-" else 24 for L, _ in row); x = (W - total) / 2
        for L, p in row:
            if L == "-":
                c.setFillColor(INK); c.setFont("BodyB", 26); c.drawCentredString(x + 12, y - 120, "-"); x += 24; continue
            cx = x + sw / 2
            c.setFillColor(INK); c.setFont("BodyB", 14); c.drawCentredString(cx, y - 14, p)
            c.setStrokeColor(INK); c.setLineWidth(1); c.line(x + 12, y - 52, x + sw - 12, y - 52)
            c.setStrokeColor(b.t.primary); c.setLineWidth(2); c.roundRect(x + 6, y - 136, sw - 12, 56, 8)
            if key: ans(c, cx, y - 48, CODE[L], 15); ans(c, cx, y - 120, L, 30)
            x += sw
        y -= 180
    if key: ans(c, W / 2, y + 10, "The ELF-ABET! (the alphabet)", 18)
    else:
        star(c, M + 40, 90, 30); star(c, W - M - 40, 90, 30); bell(c, W / 2, 50, 70)


def certificate(b):
    b.page("cert", footer=False); c = b.c; t = b.t
    c.setFillColor(t.primary); c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(white); c.roundRect(36, 36, W - 72, H - 72, 24, stroke=0, fill=1)
    c.setStrokeColor(t.accent); c.setLineWidth(6); c.roundRect(52, 52, W - 104, H - 104, 18)
    star(c, W / 2, H - 150, 54)
    c.setFillColor(t.dark); c.setFont("Fredoka", 44); c.drawCentredString(W / 2, H - 260, "Countdown Champion!")
    c.setFillColor(INK); c.setFont("Body", 16); c.drawCentredString(W / 2, H - 310, "This certificate is awarded to")
    c.line(130, H - 380, W - 130, H - 380)
    c.drawCentredString(W / 2, H - 420, "for completing the 12-Day Christmas Countdown")
    c.drawCentredString(W / 2, H - 444, "with kindness, effort and holiday cheer!")
    for i, (fn, x) in enumerate([(lambda X: gift(c, X, 180, 90), 160), (lambda X: gingerbread(c, X, 170, 120), W / 2), (lambda X: ornament(c, X, 180, 90), W - 160)]):
        fn(x)
    c.setFont("Body", 12)
    c.line(110, 120, 270, 120); c.drawCentredString(190, 102, "Teacher"); c.line(W - 270, 120, W - 110, 120); c.drawCentredString(W - 190, 102, "Date")


def build(b):
    b.cover(["12 days", "math", "literacy", "Ontario aligned"])
    b.guide("Twelve no-prep activity pages to count down the last 12 school days before winter break: one page per day, "
            "mixing math and literacy so every day feels new. Display the poster and let a student colour one gift each "
            "morning. Pages work for morning work, early finishers, centres or a sub day.",
            [("poster", "Countdown poster (colour one gift each day)"), ("d12", "Day 12: Skip Counting (2s, 5s, 10s)"),
             ("d11", "Day 11: Gift Tag Addition (facts to 20)"), ("d10", "Day 10: Word Search"), ("d9", "Day 9: ABC Order"),
             ("d8", "Day 8: Design a Gingerbread Friend (describing words)"), ("d7", "Day 7: Favourite Treat Graph (tally and bar graph)"),
             ("d6", "Day 6: Hop Back on the Number Line (subtraction)"), ("d5", "Day 5: Clap the Syllables"),
             ("d4", "Day 4: Coins in the Stocking (Canadian coins)"), ("d3", "Day 3: The Gift of Kindness (writing)"),
             ("d2", "Day 2: Gingerbread Maze"), ("d1", "Day 1: Riddle Code"), ("cert", "Countdown Champion certificate"),
             ("keys", "Answer keys"), ("terms", "Terms of use")],
            [("Differentiate", "Grade 1: do the coin pages together and let students use counters for the number lines. "
              "Grade 3: add the challenge rows and ask for a second strategy on each page."),
             ("Fewer than 12 days?", "Start at any day number. Pages do not depend on each other."),
             ("Canadian coins", "Only nickels, dimes and quarters are used, and totals stay at or under one dollar.")], ONT)
    poster(b)
    skip(b); addition(b); search(b); abc(b); design(b); graph(b); numberline(b); syllables(b); coins(b); kindness(b); mazepage(b); riddle(b)
    certificate(b)
    for f in (skip, addition, search, abc, graph, numberline, syllables, coins, mazepage, riddle): f(b, key=True)
    b.terms()


LISTING = dict(
    tpt_title="12 Day Christmas Countdown to Winter Break | Math & Literacy | Grades 1-3 | Ontario",
    price="$4.50. Range $4 to $5.", grades="1st, 2nd, 3rd", subjects="Math, Literacy, Christmas", type="Activities, Worksheets, Printables",
    description="""
Count down the **last 12 school days before winter break** with a different no-prep activity every day! Display the
countdown poster, colour one gift each morning, and hand out that day's page. Math and literacy alternate, so every day feels new.

**The 12 days:**
- Day 12: Skip Counting by 2s, 5s and 10s
- Day 11: Gift Tag Addition (facts to 20) plus a word problem
- Day 10: Christmas Word Search
- Day 9: ABC Order (with a second-letter challenge)
- Day 8: Design a Gingerbread Friend (describing words)
- Day 7: Favourite Treat Tally Chart and Bar Graph
- Day 6: Hop Back on the Number Line (subtraction)
- Day 5: Clap the Syllables sort
- Day 4: Coins in the Stocking (Canadian coins: nickels, dimes, quarters)
- Day 3: The Gift of Kindness (writing)
- Day 2: Gingerbread Maze
- Day 1: Riddle Code ("What do elves learn in school?")

**Also included:** countdown poster, Countdown Champion certificate, teacher guide and answer keys.

**Ontario curriculum:** Mathematics (2020) B1 Number Sense, B2 Operations, D1 Data Literacy, F1 Money; Language (2023) Strand B
Foundations of Language and Strand D Composition.
""",
    keywords=["christmas countdown", "countdown to winter break", "december activities", "grade 1", "grade 2", "grade 3",
              "Ontario", "Canadian coins", "christmas word search", "no prep"])

if __name__ == "__main__":
    b = Book("Christmas-Countdown-Winter-Break-Grades-1-3-Ontario", "12-Day Christmas Countdown", "Math & Literacy to Winter Break",
             "Grades 1-3", "christmas_kids", christmas_scene, ribbon="ONTARIO CURRICULUM")
    run(build, b, inside=[3, 6, 9, 11, 12, 15], feature=3, feature_line=("A new activity every day", "COUNT DOWN TO WINTER BREAK"),
        key_page=19, preview=[1, 3, 4, 6, 9, 12], listing=LISTING)
