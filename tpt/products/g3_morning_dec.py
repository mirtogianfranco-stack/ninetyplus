"""Grade 3 Ontario Math Morning Work: December (15 days of spiral review). Each day has five boxes, every box tagged with
its exact Grade 3 expectation code. Answers are computed, and the key is generated from the same data.
First month of a monthly series (change MONTH/SEED/DAYS for the next month)."""
import math, os, random, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
from kit import Book, Theme, run, style, W, H, M, INK, GREY, KEYRED
from kit.winter import snowflake
from reportlab.lib.colors import white, HexColor

MONTH, SEED, DAYS = "December", 1203, 15
T = Theme("#0F766E", "#134E4A", "#FACC15", "#F0FDFA", "Fredoka")
ONT = ("Ontario Mathematics, Grade 3. Daily boxes rotate through <b>B1.1, B1.3, B1.5</b> (number sense), <b>B2.2</b> (facts of 2, 5 "
       "and 10), <b>B2.5</b> (addition and subtraction problems to 1000), <b>B2.8</b> (unit fractions), <b>C1.3</b> (pattern "
       "rules), <b>D1.4</b> (mean and mode), <b>E2.1</b> (perimeter), <b>E2.6</b> (time) and <b>F1.1</b> (making change).")
R = random.Random(SEED)
NAMES = ["Ava", "Liam", "Noor", "Mateo", "Priya", "Owen", "Zara", "Kai", "Amara", "Leo", "Maya", "Ethan", "Sofia", "Jayden", "Aiyana"]
THINGS = [("pine cones", "collected"), ("snowflakes", "cut out"), ("hockey cards", "traded"), ("beads", "used"), ("stickers", "sorted"),
          ("books", "read pages of"), ("paper chains", "made links for"), ("cookies", "baked")]


def day_data(d):
    n = R.randint(105, 989)
    facts = []
    for _ in range(3):
        a = R.choice([2, 5, 10]); b_ = R.randint(2, 10)
        facts.append((f"{a} × {b_}", a * b_) if R.random() < .6 else (f"{a * b_} ÷ {a}", b_))
    nm = NAMES[d % len(NAMES)]; thing, _ = THINGS[d % len(THINGS)]
    if d % 2 == 0:
        x, y = R.randint(120, 520), R.randint(110, 430)
        wp = (f"{nm} has {x} {thing}. A friend gives {nm} {y} more. How many {thing} does {nm} have now?", x + y, f"{x} + {y} = {x + y}")
    else:
        x = R.randint(400, 900); y = R.randint(105, x - 60)
        wp = (f"{nm} had {x} {thing}. {nm} gave away {y}. How many {thing} are left?", x - y, f"{x} − {y} = {x - y}")
    den = R.choice([2, 3, 4, 5, 6, 8, 10]); k = R.randint(2, den)
    frac = (f"Write as a fraction:  " + " + ".join([f"1/{den}"] * k) + " = ____", f"{k}/{den}")
    rot = d % 5
    if rot == 0:
        s, st = R.randint(2, 30), R.choice([3, 4, 5, 6, 10, 25])
        seq = [s + st * i for i in range(6)]; miss = R.randint(2, 4)
        shown = ", ".join("____" if i == miss else str(v) for i, v in enumerate(seq))
        spin = ("C1.3", f"Find the rule and the missing number.<br/>{shown}", f"Rule: add {st}. Missing: {seq[miss]}")
    elif rot == 1:
        hh, mm = R.randint(1, 12), R.choice([0, 15, 30, 45, 5, 20, 40, 50])
        spin = ("E2.6", "What time does the clock show?", f"{hh}:{mm:02d}", (hh, mm))
    elif rot == 2:
        price = R.choice([15, 25, 35, 40, 55, 60, 70, 85, 95]); paid = 100
        if R.random() < .4: price, paid = R.choice([3, 4, 6, 7, 8]), 10
        unit = "¢" if paid == 100 else ""
        txt = (f"A snack costs {price}¢. You pay with a loonie ($1). How much change?" if paid == 100 else
               f"A hot chocolate costs ${price}. You pay with a $10 bill. How much change?")
        spin = ("F1.1", txt, f"{100 - price}¢" if paid == 100 else f"${10 - price}")
    elif rot == 3:
        m_ = R.randint(4, 9); data = [m_ - 2, m_, m_, m_ + 2] if R.random() < .5 else [m_ - 1, m_, m_, m_ + 1]
        R.shuffle(data)
        spin = ("D1.4", f"Data: {', '.join(map(str, data))}.<br/>Mode = ____  Mean = ____", f"Mode {m_}; mean {sum(data) // len(data)}")
        assert sum(data) % len(data) == 0
    else:
        a_, b2 = R.randint(3, 12), R.randint(2, 9)
        spin = ("E2.1", f"A rectangle is {a_} cm long and {b2} cm wide. What is its perimeter?", f"{2 * (a_ + b2)} cm")
    return dict(n=n, facts=facts, wp=wp, frac=frac, spin=spin)


DATA = [day_data(d) for d in range(DAYS)]


def rnd(n, to): return int(math.floor(n / to + .5) * to)


def box(b, x, y, w, h, title, code):
    c = b.c
    c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); c.setFillColor(white); c.roundRect(x, y - h, w, h, 10, fill=1)
    c.setFillColor(b.t.primary); c.roundRect(x, y - 22, w, 22, 10, stroke=0, fill=1); c.rect(x, y - 22, w, 10, stroke=0, fill=1)
    c.setFillColor(white); c.setFont("BodyB", 10.5); c.drawString(x + 10, y - 15, title); c.setFont("Body", 8.5); c.drawRightString(x + w - 10, y - 15, code)


def clock(c, cx, cy, r, hh, mm):
    c.setStrokeColor(INK); c.setLineWidth(1.5); c.setFillColor(white); c.circle(cx, cy, r, fill=1)
    c.setFillColor(INK); c.setFont("BodyB", 7)
    for k in range(1, 13):
        a = math.radians(90 - k * 30); c.drawCentredString(cx + (r - 8) * math.cos(a), cy + (r - 8) * math.sin(a) - 2.5, str(k))
    ha = math.radians(90 - (hh % 12 + mm / 60) * 30); ma = math.radians(90 - mm * 6)
    c.setLineWidth(2.6); c.line(cx, cy, cx + r * .5 * math.cos(ha), cy + r * .5 * math.sin(ha))
    c.setLineWidth(1.6); c.line(cx, cy, cx + r * .78 * math.cos(ma), cy + r * .78 * math.sin(ma))


def day_page(b, d, key=False):
    D_ = DATA[d]; b.page("keys" if key else "days")
    y = b.header(f"{MONTH} Morning Work: Day {d + 1}", "Grade 3 Ontario Math  •  Spiral review", name=not key)
    if key: b.key_stamp()
    c = b.c; gap = 12; w2 = (W - 2 * M - gap) / 2
    red = lambda x, yy, t, s=13: (c.setFillColor(KEYRED), c.setFont("BodyB", s), c.drawString(x, yy, str(t))) if key else None
    # 1 number of the day
    n = D_["n"]; h1 = 180; box(b, M, y, w2, h1, "Number of the Day", "B1.1  B1.3  B1.5")
    c.setFillColor(b.t.dark); c.setFont("Fredoka", 30); c.drawString(M + 14, y - 58, str(n))
    rows = [("Expanded form:", f"{n // 100 * 100} + {n // 10 % 10 * 10} + {n % 10}"), ("Round to nearest 10:", rnd(n, 10)),
            ("Round to nearest 100:", rnd(n, 100)), ("10 more / 10 less:", f"{n + 10} / {n - 10}")]
    for i, (lab, a) in enumerate(rows):
        yy = y - 84 - i * 21; c.setFillColor(INK); c.setFont("Body", 10.5); c.drawString(M + 14, yy, lab + " ______________")
        red(M + 130, yy + 2, a, 11)
    # 2 facts
    box(b, M + w2 + gap, y, w2, h1, "Fact Power", "B2.2")
    for i, (f, a) in enumerate(D_["facts"]):
        yy = y - 58 - i * 34; c.setFillColor(INK); c.setFont("Fredoka", 20); c.drawString(M + w2 + gap + 22, yy, f"{f} =")
        c.setStrokeColor(GREY); c.setLineWidth(1); c.line(M + w2 + gap + 140, yy - 2, M + w2 + gap + 200, yy - 2)
        red(M + w2 + gap + 152, yy + 2, a, 18)
    y -= h1 + gap
    # 3 word problem
    h3 = 165; box(b, M, y, W - 2 * M, h3, "Problem Solving", "B2.5")
    q, a, work = D_["wp"]
    b.para(q, M + 14, y - 30, W - 2 * M - 28, style(12.5, 17))
    c.setFillColor(INK); c.setFont("Body", 11); c.drawRightString(W - M - 14, y - h3 + 12, "Answer: ____________")
    if key: red(M + 14, y - h3 + 40, work, 14)
    y -= h3 + gap
    # 4 fraction, 5 rotating
    h4 = 178; box(b, M, y, w2, h4, "Fraction Fun", "B2.8")
    fq, fa = D_["frac"]
    b.para(fq, M + 14, y - 32, w2 - 28, style(12, 17))
    if key: red(M + 14, y - h4 + 20, fa, 16)
    code, txt, ans = D_["spin"][:3]
    titles = {"C1.3": "Pattern Detective", "E2.6": "Time Check", "F1.1": "Money Math", "D1.4": "Data Talk", "E2.1": "Measure Up"}
    box(b, M + w2 + gap, y, w2, h4, titles[code], code)
    b.para(txt, M + w2 + gap + 14, y - 32, w2 - 28, style(12, 17))
    if code == "E2.6":
        hh, mm = D_["spin"][3]; clock(c, M + w2 + gap + w2 / 2, y - 100, 38, hh, mm)
    if key: red(M + w2 + gap + 14, y - h4 + 14, ans, 13)
    y -= h4 + gap
    # reflection
    c.setFillColor(INK); c.setFont("Body", 11)
    c.drawString(M, y - 14, "Today's math felt:   easy   •   just right   •   tricky        One thing I want to practise: ______________")


def cover_art(b, x, y, w, h):
    c = b.c
    c.setFillColor(b.t.dark); c.roundRect(x, y, w, h, 22, stroke=0, fill=1)
    for fx, fy, fr in [(x + 40, y + h - 40, 14), (x + w - 50, y + h - 34, 12), (x + 60, y + 40, 10), (x + w - 60, y + 50, 14)]:
        snowflake(c, fx, fy, fr, HexColor("#CCFBF1"))
    labels = ["Number of the Day", "Fact Power", "Problem Solving", "Fraction Fun", "Spiral Review"]
    for i, t in enumerate(labels):
        bx = x + 100 + (i % 2) * 150 if i < 4 else x + w / 2 - 70; by = y + h - 70 - (i // 2) * 56
        c.setFillColor(white); c.roundRect(bx, by - 30, 140, 40, 10, stroke=0, fill=1)
        c.setFillColor(b.t.dark); c.setFont("BodyB", 12); c.drawCentredString(bx + 70, by - 14, t)


def build(b):
    b.cover([f"{DAYS} days", "spiral review", "every box coded", "answer keys"])
    b.guide(f"Fifteen days of Grade 3 math morning work for {MONTH}, perfect for the weeks before winter break. Every page has "
            "the same five boxes, so routines stay calm and students work independently: Number of the Day, Fact Power, Problem "
            "Solving, Fraction Fun and a rotating Spiral Review box (patterns, time, money, data or perimeter). Each box shows its "
            "Grade 3 expectation code.",
            [("days", f"Days 1-{DAYS} student pages"), ("keys", "Answer keys"), ("terms", "Terms of use")],
            [("Routine", "10 to 15 minutes at the start of the day. Take up one or two boxes together, and let students explain "
              "their strategies."),
             ("Assessment", "The codes on each box make it easy to note who needs another look at a skill. The bottom line lets "
              "students reflect on how the math felt."),
             ("Series", "This is the December set of a monthly Grade 3 series that follows the same layout.")], ONT)
    for d in range(DAYS): day_page(b, d)
    for d in range(DAYS): day_page(b, d, key=True)
    b.terms()


LISTING = dict(
    tpt_title=f"Grade 3 Math Morning Work {MONTH} | Ontario Curriculum Spiral Review | Expectation Codes",
    price="$4.00. Range $3.50 to $4.50.", grades="3rd", subjects="Math, Morning Work", type="Printables, Homework, Math Centres",
    description=f"""
**{DAYS} days of Grade 3 math morning work for {MONTH}**, written to the Ontario Mathematics curriculum. The same five boxes
every day keep the routine calm, while the skills spiral. **Every box is tagged with its Grade 3 expectation code.**

**Each day includes:**
- Number of the Day: expanded form, rounding, 10 more and 10 less (B1.1, B1.3, B1.5)
- Fact Power: multiplication and division facts of 2, 5 and 10 (B2.2)
- Problem Solving: addition and subtraction to 1000 (B2.5)
- Fraction Fun: adding unit fractions (B2.8)
- Spiral Review, rotating: patterns (C1.3), time (E2.6), money and change (F1.1), mean and mode (D1.4), perimeter (E2.1)
- A quick self-reflection line

Full answer keys included. Part of a monthly Grade 3 morning work series.
""",
    keywords=["grade 3 morning work", "Ontario math grade 3", "spiral review", "math warm up", "December math", "bell work",
              "Ontario curriculum", "grade 3 math", "daily math review", "no prep"])

if __name__ == "__main__":
    b = Book(f"Grade-3-Math-Morning-Work-{MONTH}-Ontario", "Grade 3 Math Morning Work", f"{MONTH}: {DAYS} Days of Spiral Review",
             "Grade 3", T, cover_art, ribbon="ONTARIO CURRICULUM")
    run(build, b, inside=[3, 4, 5, 6, 7, 8], feature=3, feature_line=("Five boxes, every day", "EVERY BOX HAS ITS CODE"),
        key_page=3 + DAYS, preview=[1, 3, 4, 5], listing=LISTING)
