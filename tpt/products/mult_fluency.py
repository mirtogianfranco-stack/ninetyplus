"""Multiplication Fact Fluency 0-12 (Grades 3-4). Drill pages per factor + mixed review, tracker, certificate,
and full red-answer keys redrawn from the same problem sets."""
import os, random, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from kit import Book, run, style, star, W, H, M, INK, GREY, KEYRED
from reportlab.lib.colors import white, HexColor

R = random.Random(312)
SINGLE = {}
for n in range(13):
    probs = [(n, k) for k in range(13)] + [(k, n) for k in range(13)]
    probs += [(n, R.randint(2, 12)) for _ in range(30 - len(probs))]
    R.shuffle(probs); SINGLE[n] = probs[:30]
MIXED = [[(R.randint(0, 12), R.randint(0, 12)) for _ in range(40)] for _ in range(6)]


def art(b, x, y, w, h):
    c, t = b.c, b.t
    cell = 30; gx, gy = x + 40, y + 30
    for i in range(6):
        for j in range(6):
            fill = t.dark if i == 0 or j == 0 else (t.light if (i + j) % 2 else white)
            c.setFillColor(fill); c.setStrokeColor(t.dark); c.rect(gx + j * cell, gy + (5 - i) * cell, cell, cell, fill=1)
            v = "×" if i == j == 0 else str(j + 1 if i == 0 else i + 1 if j == 0 else (i + 1) * (j + 1))
            c.setFillColor(white if i == 0 or j == 0 else INK); c.setFont("BodyB", 12)
            c.drawCentredString(gx + j * cell + cell / 2, gy + (5 - i) * cell + 10, v)
    c.setFillColor(t.primary); c.setFont("Anton", 120); c.drawCentredString(x + w - 120, y + 70, "7×8")
    c.setFillColor(t.accent); c.setFont("Anton", 40); c.drawCentredString(x + w - 120, y + 12, "= 56")


def drill(b, title, kicker, probs, cols, key):
    c, t = b.c, b.t
    y = b.header(title, kicker)
    if key:
        b.key_stamp()
    c.setFont("Body", 11); c.setFillColor(INK)
    c.drawString(M, y, "Time: ____________"); c.drawRightString(W - M, y, f"Score: ______ / {len(probs)}")
    y -= 30
    rows = len(probs) // cols; cw = (W - 2 * M) / cols; rh = (y - 60) / rows
    for i, (a, bb) in enumerate(probs):
        r, k = divmod(i, cols); cx = M + k * cw + cw / 2 + 8; top = y - r * rh
        c.setFillColor(GREY); c.setFont("Body", 8); c.drawString(M + k * cw + 4, top - 12, f"{i + 1}.")
        c.setFillColor(INK); c.setFont("BodyB", 22)
        c.drawRightString(cx + 14, top - 26, str(a)); c.drawRightString(cx + 14, top - 52, str(bb))
        c.setFont("BodyB", 18); c.drawString(cx - 34, top - 51, "×")
        c.setStrokeColor(INK); c.setLineWidth(1.6); c.line(cx - 36, top - 60, cx + 18, top - 60)
        if key:
            c.setFillColor(KEYRED); c.setFont("BodyB", 20); c.drawRightString(cx + 14, top - 84, str(a * bb))


def tracker(b):
    c, t = b.c, b.t
    y = b.header("My Fact Fluency Tracker", "Color a box when you score 30/30") - 6
    cols = ["Facts", "Try 1", "Try 2", "Try 3", "Try 4", "Mastered!"]
    widths = [96, 84, 84, 84, 84, 84]
    b.table(cols, [(f"× {n}", "", "", "", "", "") for n in range(13)], M, y, widths, rh=34, fs=12, first_left=True)
    b.para("Write your score in each box. When you get all 30 correct, color the star box!", M, 70 + 34, W - 2 * M, style(11))


def certificate(b):
    c, t = b.c, b.t
    c.setFillColor(t.light); c.rect(30, 30, W - 60, H - 60, fill=1, stroke=0)
    c.setStrokeColor(t.primary); c.setLineWidth(6); c.rect(42, 42, W - 84, H - 84)
    c.setStrokeColor(t.accent); c.setLineWidth(2); c.rect(54, 54, W - 108, H - 108)
    for x, y in [(110, H - 110), (W - 110, H - 110), (110, 110), (W - 110, 110)]:
        star(c, x, y, 30, t.accent)
    c.setFillColor(t.dark); c.setFont("Anton", 52); c.drawCentredString(W / 2, H - 220, "MULTIPLICATION")
    c.setFillColor(t.primary); c.setFont("Anton", 72); c.drawCentredString(W / 2, H - 300, "MASTER")
    c.setFillColor(INK); c.setFont("Body", 18); c.drawCentredString(W / 2, H - 370, "This certificate is proudly presented to")
    c.setStrokeColor(INK); c.setLineWidth(1); c.line(150, H - 440, W - 150, H - 440)
    c.drawCentredString(W / 2, H - 490, "for mastering all multiplication facts from 0 to 12!")
    c.line(110, 200, 280, 200); c.line(W - 280, 200, W - 110, 200)
    c.setFont("Body", 12); c.drawCentredString(195, 182, "Teacher"); c.drawCentredString(W - 195, 182, "Date")


def build(b):
    b.cover(["13 fact sets", "6 mixed reviews", "tracker + certificate"])
    b.guide("Build multiplication fact fluency one factor at a time, then mix it up. Every drill page has 30 facts (or 40 on "
            "mixed reviews) in vertical format, a time box and a score box, so students can track growth from try to try.",
            [("tracker", "Student fluency tracker"), ("drill", "Fact drills ×0 through ×12 (30 facts each)"),
             ("mixed", "Mixed review drills A-F (40 facts each)"), ("cert", "Multiplication Master certificate"),
             ("keys", "Answer keys for every drill"), ("terms", "Terms of use")],
            [("Suggested routine", "Give 3 to 5 minutes per drill. Students record their score on the tracker and redo the "
              "same factor on a later day until they reach 30/30. Then move to the next factor."),
             ("Why the same page twice?", "Repeating the same problem set lets students see real improvement. Each factor "
              "page includes the full fact family plus extra practice facts."),
             ("Ideas", "Morning work, homework, fluency centers, intervention, sub plans, test prep.")],
            "CCSS 3.OA.C.7 (fluently multiply within 100), 4.NBT.B.5 (multi-digit multiplication readiness).")
    b.page("tracker"); tracker(b)
    for n in range(13):
        b.page("drill"); drill(b, f"Multiply by {n}", f"Fact drill ×{n}", SINGLE[n], 6, False)
    for i, probs in enumerate(MIXED):
        b.page("mixed"); drill(b, f"Mixed Review {'ABCDEF'[i]}", "Facts 0-12", probs, 8, False)
    b.page("cert", footer=False); certificate(b)
    for n in range(13):
        b.page("keys"); drill(b, f"Multiply by {n}", f"Fact drill ×{n}", SINGLE[n], 6, True)
    for i, probs in enumerate(MIXED):
        b.page("keys"); drill(b, f"Mixed Review {'ABCDEF'[i]}", "Facts 0-12", probs, 8, True)
    b.terms()


LISTING = dict(
    tpt_title="Multiplication Facts Fluency Practice 0-12 | Timed Drills | 3rd 4th Grade",
    price="$4.50 (big page count, evergreen). Range $3.50 to $5.",
    grades="3rd, 4th (also 5th intervention)", subjects="Math, Basic Operations", type="Worksheets, Printables, Assessment",
    description="""
Help students master multiplication facts 0-12 with no-prep fact fluency drills! Students practice one factor at a time,
track their scores, then prove mastery with mixed reviews and earn a certificate.

**What's included:**
- 13 fact drill pages (×0 through ×12), 30 facts each
- 6 mixed review drills, 40 facts each
- Student fluency tracker
- Multiplication Master certificate
- Full answer keys for every drill, laid out exactly like the student page
- Teacher guide with suggested routine

**Perfect for:** morning work, fluency centers, homework, RTI and intervention, sub plans, test prep.

**Standards:** 3.OA.C.7
""",
    keywords=["multiplication facts", "fact fluency", "timed tests", "multiplication drills", "math facts 0-12",
              "3rd grade math", "4th grade math", "morning work", "math intervention", "no prep math"])

if __name__ == "__main__":
    b = Book("Multiplication-Fact-Fluency-0-12", "Multiplication Facts", "Fact Fluency Drills 0-12", "Grades 3-4", "ocean", art)
    run(build, b, inside=[3, 4, 11, 17, 23, 30], feature=11, feature_line=("Practice every fact", "30-FACT DRILLS • TIME + SCORE BOXES"),
        key_page=30, preview=[1, 2, 3, 11, 17, 23], listing=LISTING)
