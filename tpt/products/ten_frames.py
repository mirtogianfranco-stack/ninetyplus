"""Ten Frames Number Sense 0-20 (K-1). Count & write, show the number, teen numbers, make 10, compare.
Keys are the same pages redrawn with answers in red."""
import os, random, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from kit import Book, run, style, W, H, M, INK, GREY, KEYRED
from reportlab.lib.colors import white, HexColor

R = random.Random(1020)
COUNTER = HexColor("#E63946")


def frame(c, x, y, n, cell=34, color=COUNTER, outline=INK):
    """Ten frame with top-left at (x, y); n counters fill the top row first."""
    c.setStrokeColor(outline); c.setLineWidth(2)
    for i in range(10):
        r, k = divmod(i, 5)
        c.setFillColor(white); c.rect(x + k * cell, y - (r + 1) * cell, cell, cell, fill=1)
        if i < n:
            c.setFillColor(color); c.circle(x + k * cell + cell / 2, y - r * cell - cell / 2, cell * 0.36, stroke=0, fill=1)
    return 5 * cell


def box(c, x, y, w=54, h=50, ans=None):
    c.setStrokeColor(INK); c.setLineWidth(1.5); c.roundRect(x, y - h, w, h, 8)
    if ans is not None:
        fs = min(28, w * 0.5, h * 0.6); c.setFillColor(KEYRED); c.setFont("BodyB", fs); c.drawCentredString(x + w / 2, y - h / 2 - fs * 0.35, str(ans))


def art(b, x, y, w, h):
    c = b.c
    frame(c, x + 40, y + h - 50, 7, 36)
    frame(c, x + 40, y + h - 140, 10, 36, HexColor("#2A9D8F"))
    c.setFillColor(b.t.primary); c.setFont("Fredoka", 110); c.drawCentredString(x + w - 110, y + 70, "17")


def instr(b, y, text):
    return b.para(text, M, y, W - 2 * M, style(14, 18)) - 16


def count_write(b, nums, key):
    y = instr(b, b.header("Count and Write", "Ten frames 0-10"), "Count the dots. Write the number in the box.")
    if key: b.key_stamp()
    for i, n in enumerate(nums):
        r, k = divmod(i, 2); x = M + 10 + k * 270; yy = y - r * 140
        frame(b.c, x, yy, n); box(b.c, x + 185, yy - 8, ans=n if key else None)


def show_number(b, nums, key):
    y = instr(b, b.header("Show the Number", "Ten frames 0-10"), "Draw dots in the ten frame to show the number.")
    if key: b.key_stamp()
    for i, n in enumerate(nums):
        r, k = divmod(i, 2); x = M + 10 + k * 270; yy = y - r * 140
        b.c.setFillColor(b.t.primary); b.c.setFont("Fredoka", 40); b.c.drawCentredString(x + 20, yy - 50, str(n))
        frame(b.c, x + 50, yy, n if key else 0, color=KEYRED)


def teens(b, nums, key):
    y = instr(b, b.header("Teen Numbers", "Numbers 11-20"), "Count the dots. Fill in the boxes.")
    if key: b.key_stamp()
    c = b.c
    for i, n in enumerate(nums):
        yy = y - i * 140
        frame(c, M, yy, 10, 29); frame(c, M + 157, yy, n - 10, 29)
        c.setFillColor(INK); c.setFont("BodyB", 18)
        c.drawString(M + 322, yy - 36, "10 and"); box(c, M + 386, yy - 6, 50, 46, n - 10 if key else None)
        c.setFillColor(INK); c.drawString(M + 446, yy - 36, "is"); box(c, M + 466, yy - 6, 56, 46, n if key else None)


def make_ten(b, nums, key):
    y = instr(b, b.header("Make 10", "How many more?"), "How many more dots make 10? Write the number.")
    if key: b.key_stamp()
    for i, n in enumerate(nums):
        r, k = divmod(i, 2); x = M + 10 + k * 270; yy = y - r * 140
        frame(b.c, x, yy, n)
        b.c.setFillColor(INK); b.c.setFont("BodyB", 14); b.c.drawString(x, yy - 88, f"{n} and")
        box(b.c, x + 54, yy - 72, 40, 34, 10 - n if key else None)
        b.c.setFillColor(INK); b.c.setFont("BodyB", 14); b.c.drawString(x + 102, yy - 88, "make 10")


def compare(b, pairs, key):
    y = instr(b, b.header("Which Has More?", "Compare numbers"), "Count the dots. Circle the ten frame that has <b>more</b>.")
    if key: b.key_stamp()
    c = b.c
    for i, (p, q) in enumerate(pairs):
        yy = y - i * 145
        frame(c, M + 10, yy, p, 32); frame(c, M + 290, yy, q, 32)
        if key:
            x = M + 10 if p > q else M + 290
            c.setStrokeColor(KEYRED); c.setLineWidth(3); c.ellipse(x - 14, yy - 82, x + 174, yy + 18)


R.shuffle(L := list(range(11)))
CW = [L[0:8], L[8:11] + R.sample(range(11), 5), R.sample(range(11), 8), R.sample(range(11), 8)]
SN = [R.sample(range(1, 11), 8) for _ in range(3)]
TN = [R.sample(range(11, 21), 4) for _ in range(4)]
MT = [R.sample(range(0, 10), 8) for _ in range(3)]


def cmp_pairs():
    out = []
    while len(out) < 4:
        p, q = R.randint(0, 10), R.randint(0, 10)
        if p != q: out.append((p, q))
    return out
CP = [cmp_pairs() for _ in range(2)]

SETS = [(count_write, CW, "count"), (show_number, SN, "show"), (teens, TN, "teens"), (make_ten, MT, "make10"), (compare, CP, "compare")]


def build(b):
    b.cover(["count & write", "teen numbers", "make 10", "compare"])
    b.guide("Ten frames help young learners see numbers as groups of 5 and 10. These no-prep pages build from counting "
            "0-10 to teen numbers, making 10 and comparing. Every page has short, clear directions and big work spaces.",
            [("count", "Count and Write 0-10 (4 pages)"), ("show", "Show the Number - draw the dots (3 pages)"),
             ("teens", "Teen Numbers 11-20 with double ten frames (4 pages)"), ("make10", "Make 10 - how many more? (3 pages)"),
             ("compare", "Which Has More? (2 pages)"), ("keys", "Answer keys for every page"), ("terms", "Terms of use")],
            [("Tips", "Read the directions aloud. Students can use real counters on top of the frames before writing. "
              "Slip pages into sheet protectors for dry-erase centers."),
             ("Ideas", "Math centers, morning work, small-group intervention, homework, early finishers.")],
            "CCSS K.CC.A.3, K.CC.B.5, K.CC.C.6, K.NBT.A.1, K.OA.A.4, 1.NBT.B.2.")
    for fn, sets, mark in SETS:
        for s in sets:
            b.page(mark); fn(b, s, False)
    for fn, sets, mark in SETS:
        for s in sets:
            b.page("keys"); fn(b, s, True)
    b.terms()


LISTING = dict(
    tpt_title="Ten Frames Worksheets 0-20 | Count, Teen Numbers, Make 10 | Kindergarten 1st Grade",
    price="$4.00. Range $3 to $5.", grades="Kindergarten, 1st", subjects="Math, Numbers", type="Worksheets, Printables, Centers",
    description="""
Build strong number sense with no-prep **ten frame worksheets**! Kindergarten and first-grade students count, show,
compare and compose numbers to 20 with simple directions and big, kid-friendly work spaces.

**What's included:**
- Count and Write 0-10 (4 pages)
- Show the Number: draw the dots (3 pages)
- Teen Numbers 11-20 with double ten frames: "10 and __ is __" (4 pages)
- Make 10: how many more? (3 pages)
- Which Has More? compare ten frames (2 pages)
- Answer keys for every page, laid out exactly like the student pages
- Teacher guide

**Perfect for:** math centers, morning work, intervention, homework and sheet-protector dry-erase practice.

**Standards:** K.CC.A.3, K.CC.B.5, K.CC.C.6, K.NBT.A.1, K.OA.A.4
""",
    keywords=["ten frames", "number sense", "teen numbers", "make 10", "kindergarten math", "1st grade math",
              "counting to 20", "math centers", "no prep", "morning work"])

if __name__ == "__main__":
    b = Book("Ten-Frames-Number-Sense-0-20", "Ten Frames", "Number Sense 0-20", "K - Grade 1", "berry", art)
    run(build, b, inside=[3, 7, 10, 14, 17, 19], feature=10, feature_line=("Teen numbers made visual", "DOUBLE TEN FRAMES • BIG WORK SPACES"),
        key_page=22, preview=[1, 2, 3, 7, 10, 14], listing=LISTING)
