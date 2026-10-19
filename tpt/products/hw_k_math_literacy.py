"""Halloween Math & Literacy - Kindergarten (Ontario Kindergarten Program, 2016). Count, pattern, compare,
beginning sounds and word tracing, with keys."""
import os, random, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from kit import Book, run, style, W, H, M, INK, GREY, KEYRED
from kit.halloween import pumpkin, ghost, bat, candy_corn, spider, witch_hat, night_scene, count_art, MOON, BLACK
from reportlab.lib.colors import HexColor, white

R = random.Random(31)
ONT = ("The Kindergarten Program (2016), Ontario: <b>Demonstrating Literacy and Mathematics Behaviours</b> frame "
       "(counting and quantity to 10, comparing quantities, recognizing and extending patterns, phonological awareness "
       "of beginning sounds, early printing) and <b>Problem Solving and Innovating</b> (noticing and explaining patterns).")


def moon(c, x, y, s):
    c.setFillColor(MOON); c.circle(x, y + s / 2, s / 2, stroke=0, fill=1)


ICONS = {"pumpkin": lambda c, x, y, s: pumpkin(c, x, y + s * 0.45, s * 0.45),
         "ghost": lambda c, x, y, s: ghost(c, x, y, s * 0.9),
         "bat": lambda c, x, y, s: bat(c, x, y + s * 0.45, s * 1.1),
         "candy": lambda c, x, y, s: candy_corn(c, x, y, s * 0.9),
         "spider": lambda c, x, y, s: spider(c, x, y + s * 0.4, s * 0.9),
         "hat": lambda c, x, y, s: witch_hat(c, x, y + s * 0.1, s * 0.95),
         "moon": moon}


def count_circle(b, rows, key):
    y = b.header("Count and Circle", "Numbers to 10")
    y = b.para("Count the pictures. Circle the number.", M, y, W - 2 * M, style(16, 20)) - 12
    if key: b.key_stamp()
    c = b.c; rh = (y - 50) / len(rows)
    for i, (icon, n, choices) in enumerate(rows):
        top = y - i * rh
        c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); c.roundRect(M, top - rh + 8, W - 2 * M, rh - 8, 12)
        for j in range(n):
            r, k = divmod(j, 5); ICONS[icon](c, M + 30 + k * 50, top - 52 - r * 50, 40)
        for j, ch in enumerate(choices):
            cx = M + 330 + j * 70; cy = top - rh / 2
            c.setFillColor(INK); c.setFont("Fredoka", 34); c.drawCentredString(cx, cy - 12, str(ch))
            if key and ch == n:
                c.setStrokeColor(KEYRED); c.setLineWidth(3); c.circle(cx, cy, 26)


def count_write(b, items, key):
    y = b.header("Count and Write", "Numbers to 10")
    y = b.para("Count the pictures. Write the number in the box.", M, y, W - 2 * M, style(16, 20)) - 12
    if key: b.key_stamp()
    c = b.c; cw, ch = (W - 2 * M) / 2, (y - 50) / 3
    for i, (icon, n) in enumerate(items):
        r, k = divmod(i, 2); x, top = M + k * cw, y - r * ch
        c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); c.roundRect(x + 4, top - ch + 8, cw - 8, ch - 8, 12)
        for j in range(n):
            rr, kk = divmod(j, 4); ICONS[icon](c, x + 30 + kk * 42, top - 50 - rr * 44, 34)
        c.setStrokeColor(INK); c.setLineWidth(2); c.roundRect(x + cw - 84, top - ch / 2 - 30, 64, 60, 10)
        if key:
            c.setFillColor(KEYRED); c.setFont("Fredoka", 34); c.drawCentredString(x + cw - 52, top - ch / 2 - 12, str(n))


def patterns(b, rows, key):
    y = b.header("What Comes Next?", "Patterns")
    y = b.para("Say the pattern. Draw what comes next in the box.", M, y, W - 2 * M, style(16, 20)) - 12
    if key: b.key_stamp()
    c = b.c; rh = (y - 50) / len(rows)
    for i, (name, seq, nxt) in enumerate(rows):
        top = y - i * rh
        c.setFillColor(b.t.primary); c.setFont("BodyB", 12); c.drawString(M, top - 14, name)
        for j, icon in enumerate(seq):
            ICONS[icon](c, M + 30 + j * 62, top - rh + 30, 48)
        bx = M + 30 + len(seq) * 62 - 26
        c.setStrokeColor(INK); c.setLineWidth(2); c.setDash(5, 3); c.roundRect(bx, top - rh + 18, 64, 70, 8); c.setDash()
        if key: ICONS[nxt](c, bx + 32, top - rh + 30, 48)


def compare(b, rows, key):
    y = b.header("Which Has More?", "Compare")
    y = b.para("Count each group. Circle the group that has <b>more</b>.", M, y, W - 2 * M, style(16, 20)) - 12
    if key: b.key_stamp()
    c = b.c; rh = (y - 50) / len(rows)
    for i, (icon, p, q) in enumerate(rows):
        top = y - i * rh
        for side, n in enumerate((p, q)):
            x = M + side * 270
            c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); c.roundRect(x, top - rh + 12, 246, rh - 18, 14)
            for j in range(n):
                r, k = divmod(j, 5); ICONS[icon](c, x + 28 + k * 46, top - 50 - r * 46, 36)
            if key and n == max(p, q):
                c.setStrokeColor(KEYRED); c.setLineWidth(3); c.ellipse(x - 6, top - rh + 6, x + 252, top)


def sounds(b, rows, key):
    y = b.header("Beginning Sounds", "Phonological awareness")
    y = b.para("Say the name of the picture. Circle the letter you hear at the beginning.", M, y, W - 2 * M, style(16, 20)) - 12
    if key: b.key_stamp()
    c = b.c; rh = (y - 50) / len(rows)
    for i, (icon, word, choices) in enumerate(rows):
        top = y - i * rh
        c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); c.roundRect(M, top - rh + 8, W - 2 * M, rh - 8, 12)
        ICONS[icon](c, M + 70, top - rh + 26, 70)
        for j, ch in enumerate(choices):
            cx = M + 220 + j * 100; cy = top - rh / 2
            c.setFillColor(INK); c.setFont("Body", 40); c.drawCentredString(cx, cy - 14, ch)
            if key and ch == word[0]:
                c.setStrokeColor(KEYRED); c.setLineWidth(3); c.circle(cx, cy, 30)


def trace(b, words, title="Trace Halloween Words"):
    y = b.header(title, "Early printing")
    c = b.c
    for word, icon in words:
        ICONS[icon](c, M + 40, y - 74, 56)
        h = 48; base = b.primary_lines(M + 90, y - 12, W - 2 * M - 90, h)
        size = h / 0.86; gap = (W - 2 * M - 90) / 2
        for i in range(2):
            c.saveState(); t = c.beginText(); t.setTextOrigin(M + 100 + i * gap, base); t.setFont("Body", size)
            t.setTextRenderMode(1); c.setStrokeColor(HexColor("#6B7280")); c.setLineWidth(1.5); c.setDash(3, 2.5)
            t.textOut(word); t.setTextRenderMode(0); c.drawText(t); c.restoreState()
        y = base - 46


ICON_NAMES = ["pumpkin", "ghost", "bat", "candy", "spider"]
CC = [[(ic, n, sorted(R.sample([v for v in range(1, 11) if v != n], 2) + [n]))
       for ic, n in zip(R.sample(ICON_NAMES, 4), R.sample(range(1, 11), 4))] for _ in range(2)]
for page in CC:
    for ic, n, ch in page:
        assert n in ch and len(ch) == 3, (n, ch)
CW = [[(R.choice(ICON_NAMES), n) for n in R.sample(range(1, 11), 6)] for _ in range(2)]
PAT = [[("AB", ["pumpkin", "ghost"] * 3, "pumpkin"), ("AB", ["bat", "candy"] * 3, "bat"),
        ("AAB", ["ghost", "ghost", "pumpkin"] * 2, "ghost"), ("ABB", ["spider", "candy", "candy"] * 2, "spider")],
       [("ABC", ["pumpkin", "bat", "ghost"] * 2, "pumpkin"), ("AB", ["hat", "moon"] * 3, "hat"),
        ("AABB", ["candy", "candy", "bat", "bat", "candy"], "candy"), ("ABB", ["ghost", "spider", "spider"] * 2, "ghost")]]
CMP = [(R.choice(ICON_NAMES), p, q) for p, q in [(3, 7), (8, 5), (2, 6), (9, 4)]]
SND = [[("pumpkin", "pumpkin", ["b", "p", "s"]), ("bat", "bat", ["b", "m", "g"]), ("ghost", "ghost", ["h", "s", "g"]),
        ("spider", "spider", ["s", "p", "c"])],
       [("candy", "candy", ["m", "c", "b"]), ("hat", "hat", ["h", "g", "p"]), ("moon", "moon", ["s", "m", "h"]),
        ("pumpkin", "pumpkin", ["g", "h", "p"])]]
for page in SND:
    for _, word, ch in page:
        assert word[0] in ch
TR = [("boo", "ghost"), ("bat", "bat"), ("hat", "hat"), ("moon", "moon"), ("web", "spider")]


def build(b):
    b.cover(["count", "patterns", "beginning sounds", "Ontario aligned"])
    b.guide("Playful, no-prep Halloween pages for Kindergarten. Directions are short, so they can be read aloud. "
            "Pictures are large and friendly (no scary images), which suits a wide range of classrooms.",
            [("cc", "Count and Circle (2 pages)"), ("cw", "Count and Write (2 pages)"), ("pat", "What Comes Next? patterns (2 pages)"),
             ("cmp", "Which Has More? (1 page)"), ("snd", "Beginning Sounds (2 pages)"), ("tr", "Trace Halloween Words (1 page)"),
             ("keys", "Answer keys"), ("terms", "Terms of use")],
            [("Pedagogical documentation", "These pages make quick evidence of learning for Communication of Learning "
              "reports: note how children count (one-to-one, subitizing) and how they explain a pattern."),
             ("Centres", "Slip pages into sheet protectors and use dry-erase markers, or pair with real counters "
              "or mini pumpkins.")], ONT)
    for p in CC: b.page("cc"); count_circle(b, p, False)
    for p in CW: b.page("cw"); count_write(b, p, False)
    for p in PAT: b.page("pat"); patterns(b, p, False)
    b.page("cmp"); compare(b, CMP, False)
    for p in SND: b.page("snd"); sounds(b, p, False)
    b.page("tr"); trace(b, TR)
    for p in CC: b.page("keys"); count_circle(b, p, True)
    for p in CW: b.page("keys"); count_write(b, p, True)
    for p in PAT: b.page("keys"); patterns(b, p, True)
    b.page("keys"); compare(b, CMP, True)
    for p in SND: b.page("keys"); sounds(b, p, True)
    b.terms()


LISTING = dict(
    tpt_title="Halloween Kindergarten Math & Literacy | Counting Patterns Beginning Sounds | Ontario",
    price="$3.50. Range $3 to $4.", grades="Kindergarten (JK/SK), Pre-K", subjects="Math, Literacy, Halloween",
    type="Worksheets, Centres, Printables",
    description="""
No-prep **Halloween math and literacy** pages for Ontario Kindergarten (JK/SK)! The friendly, not-scary pictures
(pumpkins, bats, smiling ghosts, candy corn) keep little learners counting, patterning and listening for sounds.

**What's included (10 activity pages):**
- Count and Circle to 10 (2)
- Count and Write to 10 (2)
- What Comes Next? AB, AAB, ABB, ABC and AABB patterns (2)
- Which Has More? (1)
- Beginning Sounds: p, b, g, s, c, h, m (2)
- Trace Halloween Words: boo, bat, hat, moon, web (1)
- Answer keys and a teacher guide

**Ontario curriculum:** The Kindergarten Program (2016), Demonstrating Literacy and Mathematics Behaviours, and
Problem Solving and Innovating

Great for centres, morning bins, sheet-protector practice and pedagogical documentation.
""",
    keywords=["Halloween kindergarten", "Ontario kindergarten", "counting to 10", "patterns", "beginning sounds",
              "JK SK", "Halloween centres", "fall math", "literacy centres", "no prep"])

if __name__ == "__main__":
    b = Book("Halloween-Math-Literacy-Kindergarten-Ontario", "Halloween Fun", "Kindergarten Math & Literacy",
             "Kindergarten", "spooky_kids", count_art, ribbon="ONTARIO CURRICULUM")
    run(build, b, inside=[3, 5, 7, 9, 10, 12], feature=7, feature_line=("Patterns, counting & sounds", "FRIENDLY, NOT-SCARY PICTURES"),
        key_page=13, preview=[1, 2, 3, 7, 10], listing=LISTING)
