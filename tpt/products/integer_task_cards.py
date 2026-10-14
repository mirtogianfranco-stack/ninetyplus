"""Integer Operations Task Cards (Grades 6-7). 32 cards (add, subtract, multiply/divide, word problems),
rules reference page, recording sheet and answer key."""
import os, random, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from kit import Book, run, style, W, H, M, INK, GREY, KEYRED
from reportlab.lib.colors import white, HexColor

R = random.Random(67)


def n(v):
    return f"({v})" if v < 0 else str(v)


def nz(lo, hi):
    while True:
        v = R.randint(lo, hi)
        if v: return v


CARDS = []
for _ in range(8):
    a, b = nz(-25, 25), nz(-25, -1) if R.random() < .7 else nz(1, 25)
    CARDS.append(("Add", f"{a} + {n(b)}", a + b))
for _ in range(8):
    a, b = nz(-30, 30), nz(-30, 30)
    CARDS.append(("Subtract", f"{a} − {n(b)}", a - b))
for i in range(8):
    a, b = nz(-12, 12), nz(-12, 12)
    if i % 2:
        CARDS.append(("Multiply", f"{a} × {n(b)}", a * b))
    else:
        CARDS.append(("Divide", f"{a * b} ÷ {n(b)}", a))
WORD = [
    ("The temperature at 6 a.m. was −8°F. By noon it rose 15 degrees. What was the temperature at noon?", 7, "°F"),
    ("A submarine is at −120 feet. It dives 45 feet deeper. What is its new depth?", -165, "feet"),
    ("A hiker starts at 230 feet above sea level and walks down to −40 feet. How many feet did she descend?", 270, "feet"),
    ("A football team loses 4 yards on each of 3 plays in a row. What integer shows the total change in yards?", -12, "yards"),
    ("Jaylen's account balance is −15 points in a class game. He earns 22 points. What is his new balance?", 7, "points"),
    ("The temperature dropped 3 degrees every hour for 6 hours. What integer shows the total change?", -18, "degrees"),
    ("A diver descends 60 feet in 4 equal stages. What integer shows the change in each stage?", -15, "feet"),
    ("The high was 12°C and the low was −7°C. What is the difference between the high and the low?", 19, "°C"),
]
assert 7 == -8 + 15 and -165 == -120 - 45 and 270 == 230 - (-40) and -12 == 3 * -4 and 7 == -15 + 22
assert -18 == 6 * -3 and -15 == -60 // 4 and 19 == 12 - (-7)
CARDS += [("Word problem", q, a, u) for q, a, u in WORD]
assert len(CARDS) == 32


def card(b, i, x, y, w, h):
    c, t = b.c, b.t
    kind, q, a = CARDS[i][:3]
    c.setDash(5, 4); c.setStrokeColor(GREY); c.setLineWidth(1); c.rect(x, y - h, w, h); c.setDash()
    c.setFillColor(t.light); c.roundRect(x + 12, y - h + 12, w - 24, h - 24, 14, stroke=0, fill=1)
    c.setFillColor(t.primary); c.roundRect(x + 12, y - 52, w - 24, 40, 14, stroke=0, fill=1); c.rect(x + 12, y - 52, w - 24, 20, stroke=0, fill=1)
    c.setFillColor(white); c.setFont("Anton", 22); c.drawString(x + 26, y - 42, f"#{i + 1}")
    c.setFont("BodyB", 11); c.drawRightString(x + w - 26, y - 38, kind.upper())
    if kind == "Word problem":
        b.para(q, x + 28, y - 74, w - 56, style(17, 25))
    else:
        c.setFillColor(INK); c.setFont("BodyB", 34); c.drawCentredString(x + w / 2, y - h / 2 - 16, q.replace("-", "\u2212"))


def cards_page(b, start):
    w, h = (W - 2 * 30) / 2, (H - 60) / 2
    for k in range(4):
        r, col = divmod(k, 2); card(b, start + k, 30 + col * w, H - 30 - r * h, w, h)


def rules(b):
    y = b.header("Integer Rules", "Reference page", name=False)
    c, t = b.c, b.t
    # number line
    x0, x1, yl = M + 10, W - M - 10, y - 40
    c.setStrokeColor(INK); c.setLineWidth(2); c.line(x0, yl, x1, yl)
    for v in range(-10, 11):
        xx = x0 + (v + 10) * (x1 - x0) / 20; c.line(xx, yl - 6, xx, yl + 6)
        c.setFont("BodyB" if v == 0 else "Body", 10); c.setFillColor(t.primary if v < 0 else INK); c.drawCentredString(xx, yl - 22, str(v).replace("-", "\u2212"))
    y = yl - 50
    boxes = [("ADDING", ["Same signs: add and keep the sign.  −4 + (−6) = −10",
                         "Different signs: subtract, keep the sign of the number farther from 0.  −9 + 4 = −5"]),
             ("SUBTRACTING", ["Add the opposite (keep, change, change).  3 − (−5) = 3 + 5 = 8",
                              "−6 − 4 = −6 + (−4) = −10"]),
             ("MULTIPLYING & DIVIDING", ["Same signs: positive.  (−3)(−5) = 15   −20 ÷ (−4) = 5",
                                          "Different signs: negative.  (−3)(5) = −15   20 ÷ (−4) = −5"])]
    for head, lines in boxes:
        c.setFillColor(t.light); c.setStrokeColor(t.primary); c.setLineWidth(2); c.roundRect(M, y - 150, W - 2 * M, 150, 14, fill=1)
        c.setFillColor(t.primary); c.setFont("Anton", 20); c.drawString(M + 16, y - 32, head)
        yy = y - 48
        for ln in lines:
            yy = b.para(ln.replace("   ", "&nbsp;&nbsp;\u2022&nbsp;&nbsp;").replace("  ", "&nbsp;&nbsp;&nbsp;"), M + 16, yy, W - 2 * M - 32, style(15, 21)) - 12
        y -= 172


def recording(b, key=False):
    y = b.header("Recording Sheet", "Integer task cards")
    if key: b.key_stamp()
    c = b.c; cw, ch = (W - 2 * M) / 4, 66
    for i in range(32):
        r, k = divmod(i, 4); x, yy = M + k * cw, y - r * ch
        c.setStrokeColor(b.t.primary); c.setLineWidth(1.2); c.roundRect(x + 3, yy - ch + 3, cw - 6, ch - 6, 8)
        b.badge(x + 18, yy - 18, i + 1, r=10, fill=b.t.primary)
        if key:
            a = CARDS[i][2]; u = CARDS[i][3] if len(CARDS[i]) > 3 else ""
            txt = f"{a}".replace("-", "−") + ((u if u.startswith("\u00b0") else f" {u}") if u else "")
            c.setFillColor(KEYRED); c.setFont("BodyB", 15 if len(txt) < 9 else 12); c.drawCentredString(x + cw / 2, yy - ch / 2 - 12, txt)


def art(b, x, y, w, h):
    c, t = b.c, b.t
    for i, (txt, col) in enumerate([("−7 + 12", t.primary), ("(−3)(−4)", t.dark), ("−18 ÷ 6", t.primary)]):
        cx, cy = x + 30 + i * 150, y + 40 + (i % 2) * 40
        c.setFillColor(col); c.roundRect(cx, cy, 140, 110, 14, stroke=0, fill=1)
        c.setFillColor(t.accent); c.setFont("Anton", 16); c.drawString(cx + 12, cy + 86, f"#{i + 1}")
        c.setFillColor(white); c.setFont("BodyB", 22); c.drawCentredString(cx + 70, cy + 40, txt)


def build(b):
    b.cover(["32 task cards", "rules page", "recording sheet"])
    b.guide("32 task cards that build integer fluency in four sets: adding, subtracting, multiplying and dividing, and "
            "real-world word problems (temperature, elevation, sea level and more). Cards print 4 per page.",
            [("rules", "Integer Rules reference page"), ("cards", "Task cards 1-32 (4 per page)"),
             ("rec", "Student recording sheet"), ("keys", "Answer key"), ("terms", "Terms of use")],
            [("Ways to use", "Scoot or around-the-room, math centers, small groups, partner quiz-quiz-trade, review "
              "before a test, or project one card as a warm-up."),
             ("Sets", "Cards 1-8 adding, 9-16 subtracting, 17-24 multiplying and dividing, 25-32 word problems. Use one "
              "set at a time or mix them."),
             ("Printing tip", "Print on card stock and laminate to reuse every year.")],
            "CCSS 7.NS.A.1, 7.NS.A.2, 7.NS.A.3, 6.NS.C.5.")
    b.page("rules"); rules(b)
    for s in range(0, 32, 4):
        b.page("cards", footer=False); cards_page(b, s)
    b.page("rec"); recording(b)
    b.page("keys"); recording(b, key=True)
    b.terms()


LISTING = dict(
    tpt_title="Integer Operations Task Cards | Add, Subtract, Multiply, Divide Integers | 6th 7th Grade",
    price="$3.50. Range $3 to $4.", grades="6th, 7th", subjects="Math, Numbers", type="Task Cards, Activities",
    description="""
Build **integer fluency** with 32 no-prep task cards! Students practice adding, subtracting, multiplying and dividing
integers, then apply their skills to real-world word problems about temperature, elevation and more.

**What's included:**
- 32 task cards in 4 sets of 8 (add, subtract, multiply/divide, word problems), 4 per page
- Integer Rules reference page with number line
- Student recording sheet
- Answer key
- Teacher guide

**Perfect for:** scoot, math centers, small groups, test review, warm-ups.

**Standards:** 7.NS.A.1, 7.NS.A.2, 7.NS.A.3
""",
    keywords=["integers", "integer operations", "task cards", "adding integers", "subtracting integers",
              "7th grade math", "6th grade math", "scoot", "math centers", "negative numbers"])

if __name__ == "__main__":
    b = Book("Integer-Operations-Task-Cards", "Integer Task Cards", "Add, Subtract, Multiply & Divide Integers", "Grades 6-7", "slate", art)
    run(build, b, inside=[3, 4, 6, 8, 10, 12], feature=10, feature_line=("Real-world word problems", "TEMPERATURE • ELEVATION • SEA LEVEL"),
        key_page=13, preview=[1, 2, 3, 4, 10, 12], listing=LISTING)
