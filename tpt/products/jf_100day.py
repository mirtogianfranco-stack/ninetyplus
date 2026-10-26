"""100th Day of School (K-3, Ontario). Hundreds-chart fill-ins, a cut-apart 100-chart puzzle, skip-counting trains,
10 groups of 10 sorting mat, 100-second challenge, 'When I am 100' writing, 100 Days Smarter crown, keys."""
import os, random, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from kit import Book, run, style, W, H, M, INK, GREY, KEYRED
from kit.janfeb import badge100, confetti, heart, GOLD, PURPLE, TEAL, PINK
from reportlab.lib.colors import white, HexColor

R = random.Random(100)
ONT = ("The Kindergarten Program (2016): <b>Demonstrating Literacy and Mathematics Behaviours</b> (counting, quantity and "
       "number relationships). Ontario Mathematics Curriculum (2020), Grades 1-3, <b>Strand B Number, B1 Number Sense</b> "
       "(reading, representing, counting and skip counting whole numbers; place value with tens and ones) and <b>Strand A</b> "
       "(mathematical processes). Writing tasks connect to Ontario Language (2023) Strand D.")


def chart(b, x, y, size, blanks=frozenset(), key=False, shade=None, fs=None):
    c = b.c; cs = size / 10; fs = fs or cs * .38
    for i in range(100):
        r, k = divmod(i, 10); n = i + 1; cx, cy = x + k * cs, y - (r + 1) * cs
        c.setFillColor(shade(n) if shade else white); c.setStrokeColor(INK); c.setLineWidth(.8); c.rect(cx, cy, cs, cs, fill=1)
        if n not in blanks:
            c.setFillColor(INK); c.setFont("BodyB", fs); c.drawCentredString(cx + cs / 2, cy + cs / 2 - fs * .35, str(n))
        elif key:
            c.setFillColor(KEYRED); c.setFont("BodyB", fs); c.drawCentredString(cx + cs / 2, cy + cs / 2 - fs * .35, str(n))


EASY = frozenset(R.sample([n for n in range(1, 101) if n % 10 != 0], 30))
HARD = frozenset(R.sample(range(1, 101), 60))


def fill_page(b, blanks, level, key):
    y = b.header("Fill the Hundreds Chart", f"Missing numbers  •  {level}")
    if key: b.key_stamp()
    b.para("Write the missing numbers. Look for patterns down the columns and across the rows!", M, y, W - 2 * M, style(13, 17))
    chart(b, M + 8, y - 30, W - 2 * M - 16, blanks, key)


# puzzle regions: staircase cuts so the pieces interlock
def region(n):
    r, k = divmod(n - 1, 10)
    band = 0 if r < 3 else 1 if r < 6 else 2 if r < 8 else 3
    cut = [4, 6, 3, 5][band] + (1 if r % 2 else 0)
    return band * 2 + (0 if k < cut else 1)


def puzzle(b):
    y = b.header("100 Chart Puzzle", "Cut along the thick dashed lines", name=False)
    c = b.c; size = W - 2 * M - 16; x0 = M + 8; cs = size / 10
    cols = [HexColor(h) for h in ("#EDE9FE", "#FEF9C3", "#CCFBF1", "#FCE7F3", "#E0F2FE", "#FFEDD5", "#DCFCE7", "#F3E8FF")]
    chart(b, x0, y - 10, size, shade=lambda n: cols[region(n)])
    c.setStrokeColor(INK); c.setLineWidth(3); c.setDash(7, 4)
    for n in range(1, 101):
        r, k = divmod(n - 1, 10); cx, cy = x0 + k * cs, y - 10 - (r + 1) * cs
        if k < 9 and region(n) != region(n + 1): c.line(cx + cs, cy, cx + cs, cy + cs)
        if r < 9 and region(n) != region(n + 10): c.line(cx, cy, cx + cs, cy)
    c.setDash()
    b.para("Mix up the pieces, then put the hundreds chart back together on the puzzle mat.", M, y - 30 - size, W - 2 * M, style(12, 16, GREY))


def puzzle_mat(b):
    y = b.header("100 Chart Puzzle Mat", "Build it here")
    chart(b, M + 8, y - 10, W - 2 * M - 16, frozenset(range(2, 100)))


TRAINS = [("Count by 10s", 10, 10, {0, 3, 6}), ("Count by 5s", 5, 20, {0, 1, 4, 9, 13, 18}), ("Count by 2s", 2, 20, {0, 2, 5, 9, 12, 17})]


def skip_page(b, key):
    y = b.header("Skip Count to 100!", "Fill in the trains")
    if key: b.key_stamp()
    c = b.c
    for title, step, n, given in TRAINS:
        c.setFillColor(b.t.primary); c.setFont(b.t.display, 18); c.drawString(M, y - 14, title); y -= 30
        per = 10; d = (W - 2 * M) / per
        for i in range(n):
            r, k = divmod(i, per); cx, cy = M + k * d + d / 2, y - r * (d + 6) - d / 2
            c.setFillColor(b.t.light if i not in given else HexColor("#FEF9C3")); c.setStrokeColor(b.t.primary); c.setLineWidth(1.5)
            c.circle(cx, cy, d * .44, fill=1)
            v = (i + 1) * step
            if i in given or key:
                c.setFillColor(INK if i in given else KEYRED); c.setFont("BodyB", d * .32); c.drawCentredString(cx, cy - d * .11, str(v))
        y -= (-(-n // per)) * (d + 6) + 20


def groups_mat(b):
    y = b.header("10 Groups of 10", "Sorting mat")
    b.para("Put 10 small objects (cubes, beans, cereal...) in each box. Count the boxes by 10s to reach 100!", M, y, W - 2 * M, style(13, 17))
    c = b.c; y -= 40; cw, ch = (W - 2 * M) / 5, 110
    for i in range(10):
        r, k = divmod(i, 5); x, yy = M + k * cw, y - r * (ch + 12)
        c.setStrokeColor(b.t.primary); c.setLineWidth(2); c.setDash(5, 3); c.roundRect(x + 5, yy - ch, cw - 10, ch, 12); c.setDash()
        c.setFillColor(b.t.primary); c.setFont("Fredoka", 16); c.drawCentredString(x + cw / 2, yy - ch + 10, str((i + 1) * 10))
    y -= 2 * (ch + 12) + 20
    c.setFillColor(INK); c.setFont("Body", 15)
    c.drawString(M, y, "I collected 100 _____________________."); y -= 34
    c.drawString(M, y, "10 groups of 10 = ______"); y -= 40
    b.para("Draw your 100 objects in groups of 10:", M, y, W - 2 * M, style(13, 17))
    c.setStrokeColor(GREY); c.roundRect(M, 60, W - 2 * M, y - 80, 12)


def challenge(b):
    y = b.header("The 100-Second Challenge", "Predict, then try it!")
    b.para("How many times can you do each thing in 100 seconds? Predict first. Then a partner times you.", M, y, W - 2 * M, style(13, 17))
    rows = [("Write your name", "", ""), ("Do jumping jacks", "", ""), ("Draw stars", "", ""), ("Clap your hands", "", ""),
            ("Write numbers in order", "", ""), ("Stack blocks", "", ""), ("Hop on one foot", "", "")]
    y = b.table(["Activity", "My prediction", "My result"], rows, M, y - 50, [230, 143, 143], rh=46, fs=13) - 24
    b.question(1, "Which result was closest to your prediction? Which surprised you most?", y, 2)


def when100(b):
    y = b.header("When I Am 100 Years Old...", "Draw and write")
    c = b.c
    c.setStrokeColor(b.t.primary); c.setLineWidth(2); c.roundRect(M, y - 300, W - 2 * M, 290, 16)
    c.setFillColor(GREY); c.setFont("Body", 11); c.drawString(M + 14, y - 26, "Draw yourself at 100 years old!")
    y -= 330
    for stem in ["When I am 100, I will look like", "I will like to", "I will still"]:
        c.setFillColor(INK); c.setFont("Body", 15); c.drawString(M, y, stem)
        y = b.primary_lines(M, y - 10, W - 2 * M, 34) - 30


def crown(b):
    y = b.header("100 Days Smarter Crown", "Cut, colour and tape", name=False)
    c = b.c
    for i in range(2):
        top = y - 20 - i * 260; bw = W - 2 * M; base = top - 220
        c.setStrokeColor(INK); c.setLineWidth(1.5); c.setDash(6, 4)
        p = c.beginPath(); p.moveTo(M, base); p.lineTo(M, base + 120)
        for k in range(5):
            x1 = M + k * bw / 5
            p.lineTo(x1 + bw / 10, base + 210); p.lineTo(x1 + bw / 5, base + 120)
        p.lineTo(M + bw, base); p.close(); c.drawPath(p, fill=0); c.setDash()
        if i == 0:
            badge100(c, W / 2, base + 70, 48)
            c.setFillColor(INK); c.setFont("Fredoka", 22); c.drawString(M + 18, base + 20, "100 Days"); c.drawRightString(W - M - 18, base + 20, "Smarter!")
        else:
            for k in range(5): heart(c, M + (k + .5) * bw / 5, base + 60, 40, None, INK)
            c.setFillColor(INK); c.setFont("Body", 12); c.drawCentredString(W / 2, base + 14, "Back strip: tape to the front strip to fit your head")


def art(b, x, y, w, h):
    c = b.c
    c.setFillColor(HexColor("#1E1B4B")); c.roundRect(x, y, w, h, 22, stroke=0, fill=1)
    confetti(c, x + 10, y + 10, w - 20, h - 20, 60)
    badge100(c, x + w / 2, y + h / 2, 92)
    c.setFillColor(white); c.setFont("Fredoka", 26); c.drawCentredString(x + w / 2, y + 18, "100 Days Smarter!")


def build(b):
    b.cover(["puzzles", "skip counting", "crown", "Ontario aligned"])
    b.guide("Celebrate the 100th day with a mix of hands-on math, movement, writing and a crown to wear! Two hundreds-chart "
            "levels let you differentiate for Kindergarten to Grade 3.",
            [("fe", "Fill the Hundreds Chart: easier (30 missing)"), ("fh", "Fill the Hundreds Chart: harder (60 missing)"),
             ("puz", "100 Chart Puzzle (cut apart)"), ("mat", "100 Chart Puzzle Mat"), ("skip", "Skip Count to 100 trains (10s, 5s, 2s)"),
             ("grp", "10 Groups of 10 sorting mat"), ("chal", "The 100-Second Challenge"), ("w100", "When I Am 100 Years Old (draw & write)"),
             ("crown", "100 Days Smarter crown"), ("keys", "Answer keys"), ("terms", "Terms of use")],
            [("Stations idea", "Set up 5 stations: puzzle, skip counting, 10 groups of 10, 100-second challenge and writing. "
              "Finish by making crowns!"),
             ("Differentiation", "Kindergarten and Grade 1 can use the easier chart and the 10s train; Grades 2-3 can try "
              "the harder chart and the 2s train.")], ONT)
    b.page("fe"); fill_page(b, EASY, "easier", False)
    b.page("fh"); fill_page(b, HARD, "harder", False)
    b.page("puz"); puzzle(b)
    b.page("mat"); puzzle_mat(b)
    b.page("skip"); skip_page(b, False)
    b.page("grp"); groups_mat(b)
    b.page("chal"); challenge(b)
    b.page("w100"); when100(b)
    b.page("crown", footer=False); crown(b)
    b.page("keys"); fill_page(b, EASY, "easier", True)
    b.page("keys"); fill_page(b, HARD, "harder", True)
    b.page("keys"); skip_page(b, True)
    b.terms()


LISTING = dict(
    tpt_title="100th Day of School Activities | Hundreds Chart Puzzle, Skip Counting, Crown | K-3 | Ontario",
    price="$4.00. Range $3.50 to $4.50.", grades="Kindergarten, 1st, 2nd, 3rd", subjects="Math, Writing, Holidays", type="Activities, Centres, Printables",
    description="Celebrate the 100th day of school with no-prep, hands-on activities for K-3, aligned to the Ontario curriculum.\n\n"
                "Included: Fill the Hundreds Chart (2 levels), a cut-apart 100 Chart Puzzle with a mat, Skip Count to 100 trains "
                "(10s, 5s, 2s), a 10 Groups of 10 sorting mat, The 100-Second Challenge (predict and record), When I Am 100 "
                "Years Old (draw and write), a 100 Days Smarter crown, answer keys, and a teacher guide with a stations plan.\n\n"
                "Ontario: Kindergarten Program (2016); Math (2020) B1 Number Sense.",
    keywords=["100th day of school", "hundreds chart", "skip counting", "100 days smarter", "kindergarten", "grade 1", "grade 2",
              "Ontario math", "February", "no prep"])

if __name__ == "__main__":
    b = Book("100th-Day-of-School-K-3-Ontario", "100th Day of School", "Math, Movement, Writing & Crown", "K - Grade 3", "hundred", art,
             ribbon="ONTARIO CURRICULUM")
    run(build, b, inside=[3, 5, 7, 8, 9, 11], feature=5, feature_line=("Puzzle, count & celebrate!", "HANDS-ON 100TH DAY STATIONS"),
        key_page=13, preview=[1, 2, 3, 5, 7, 11], listing=LISTING)
