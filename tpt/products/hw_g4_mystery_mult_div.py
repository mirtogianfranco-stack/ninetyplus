"""Halloween Multiplication & Division Mystery Pictures - Grade 4 (Ontario). Facts to 10 x 10 + word problems."""
import os, random, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from kit import Book, run, style, W, H, M, INK, KEYRED
from kit.halloween import mystery, assign, night_scene, mystery_art

R = random.Random(410)
ONT = ("Ontario Mathematics Curriculum (2020), Grade 4, Strand B Number: <b>B2 Operations</b>, including <b>B2.2</b> "
       "(recall and demonstrate multiplication facts from 1 × 1 to 10 × 10, and related division facts) and "
       "representing and solving problems involving multiplication and division (B2). Strand A mathematical processes "
       "(problem solving, reasoning, communicating) are built into the word problems.")

MUL = [(a, b) for a in range(1, 11) for b in range(1, 11)]


def mult_pool(lo, hi):
    lst = [(f"{a}×{b}", a * b) for a, b in MUL if lo <= a * b <= hi]; R.shuffle(lst); return lst


def div_pool(lo, hi):
    lst = [(f"{a * b}÷{b}", a) for a, b in MUL if lo <= a <= hi]; R.shuffle(lst); return lst


PAGES = [  # name, kind, {code: (lo, hi)}
    ("Pumpkin", "mul", {"o": (1, 24), "g": (25, 40), "k": (42, 63), "p": (64, 100)}),
    ("Bat Moon", "mul", {"y": (1, 30), "k": (32, 60), "p": (63, 100)}),
    ("Ghost", "mul", {"e": (1, 30), "k": (32, 54), "p": (56, 100)}),
    ("Candy Corn", "div", {"w": (1, 2), "o": (3, 5), "y": (6, 8), "p": (9, 10)}),
    ("Witch Hat", "div", {"k": (1, 4), "o": (5, 7), "p": (8, 10)}),
]
SETS = []
for name, kind, rng in PAGES:
    pools = {code: (mult_pool if kind == "mul" else div_pool)(lo, hi) for code, (lo, hi) in rng.items()}
    for code, (lo, hi) in rng.items():
        assert all(lo <= a <= hi for _, a in pools[code]) and len(pools[code]) >= 4, (name, code)
    legend = [(code, f"{lo}-{hi}" if lo != hi else str(lo)) for code, (lo, hi) in rng.items()]
    SETS.append((name, kind, assign(name, pools), legend))

WORD = [
    ("A class carves pumpkins in groups. There are 8 groups with 4 students in each group. How many students are carving?", "8 × 4 = 32 students"),
    ("Mr. Singh has 63 glow sticks to share equally among 9 tables. How many glow sticks does each table get?", "63 ÷ 9 = 7 glow sticks"),
    ("A bag holds 6 mini chocolate bars. Priya buys 7 bags. Then she gives 10 bars to her cousins. How many bars does she have left?", "6 × 7 = 42; 42 − 10 = 32 bars"),
    ("The school haunted hallway has 5 rooms. Each room has 3 spiders and 4 bats hanging from the ceiling. How many decorations is that altogether?", "3 + 4 = 7 per room; 7 × 5 = 35 decorations"),
    ("48 students are going trick-or-treating in safe groups of 6, with one adult per group. How many adults are needed?", "48 ÷ 6 = 8 adults"),
    ("A costume needs 9 metres of ribbon. How much ribbon is needed for 8 costumes? Is 70 metres enough? Explain.", "9 × 8 = 72 m; 70 m is not enough (2 m short)"),
]


def word_page(b, key):
    y = b.header("Halloween Word Problems", "Multiply and divide  •  show your thinking")
    if key: b.key_stamp()
    for i, (q, a) in enumerate(WORD, 1):
        y = b.question(i, q, y, 2, answer=a if key else None)


def build(b):
    b.cover(["5 mystery pictures", "word problems", "Ontario aligned"])
    b.guide("Five 12 × 12 mystery pictures (144 facts each). Students solve each multiplication or division fact and "
            "colour the square using the colour code to reveal a Halloween picture. A page of multi-step word problems "
            "applies the same facts in context.",
            [("m1", "Mystery Picture 1: multiplication facts"), ("m2", "Mystery Picture 2: multiplication facts"),
             ("m3", "Mystery Picture 3: multiplication facts"), ("m4", "Mystery Picture 4: related division facts"),
             ("m5", "Mystery Picture 5: related division facts"), ("word", "Halloween word problems (6)"),
             ("keys", "Answer keys (coloured pictures + worked answers)"), ("terms", "Terms of use")],
            [("Colour code", "Each colour covers a range of answers (for example, 25-40 = green). Remind students to "
              "solve first, then check which range the answer falls in."),
             ("Differentiation", "Students can complete half a picture per day, or use a multiplication chart as a "
              "support on the first picture.")], ONT)
    for i, (name, kind, probs, legend) in enumerate(SETS, 1):
        b.page(f"m{i}"); mystery(b, name, probs, legend)
    b.page("word"); word_page(b, False)
    for name, kind, probs, legend in SETS:
        b.page("keys"); mystery(b, name, probs, legend, key=True)
    b.page("keys"); word_page(b, True)
    b.terms()


LISTING = dict(
    tpt_title="Halloween Multiplication & Division Mystery Pictures | Grade 4 | Ontario Math",
    price="$4.00. Range $3.50 to $5.", grades="4th (also 3rd enrichment, 5th review)", subjects="Math, Halloween",
    type="Worksheets, Activities, Printables",
    description="""
Practise multiplication and division facts the spooky way! Students solve 144 facts per page and colour by the code
to reveal a **hidden Halloween picture**. The pictures are self-checking, so students know right away if a fact needs a
second look.

**What's included:**
- 5 mystery pictures (pumpkin, bat and moon, ghost, candy corn, witch hat)
  - 3 multiplication pages (facts to 10 × 10)
  - 2 related division pages
- 6 multi-step Halloween word problems (metric units)
- Coloured answer keys and worked word-problem answers
- Teacher guide with **Ontario Mathematics Curriculum (2020)** alignment

**Ontario curriculum:** Grade 4, Strand B Number, B2 Operations (B2.2 multiplication facts 1 × 1 to 10 × 10 and related division facts)
""",
    keywords=["Halloween math", "multiplication mystery picture", "colour by number", "division facts",
              "Ontario math curriculum", "grade 4 math", "Halloween worksheets", "math centres", "fact fluency", "no prep"])

if __name__ == "__main__":
    b = Book("Halloween-Mystery-Pictures-Mult-Div-Grade-4-Ontario", "Halloween Mystery Math", "Multiplication & Division Facts",
             "Grade 4", "spooky", mystery_art("Pumpkin", "Bat Moon", "Witch Hat"), ribbon="ONTARIO CURRICULUM")
    run(build, b, inside=[3, 4, 6, 7, 8, 10], feature=3, feature_line=("144 facts per picture", "SOLVE • COLOUR • REVEAL"),
        key_page=10, preview=[1, 2, 3, 8], listing=LISTING)
