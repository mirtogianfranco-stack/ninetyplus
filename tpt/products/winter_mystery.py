"""Winter Mystery Math (Ontario): Grades 1-2 add/sub to 20, Grades 3-4 multiply/divide. Colour-by-answer pixel pictures
from kit.winter, word problems, keys."""
import os, random, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from kit import Book, run, style, W, H, M
from kit.halloween import mystery, assign, mystery_art
import kit.winter  # registers winter pictures and colours

R = random.Random(2412)


def pool(maker, answers, n=40):
    lst = [maker(R.choice(answers)) for _ in range(n)]; R.shuffle(lst); return lst


def add_p(a, top):
    x = R.randint(max(0, a - top), min(a, top)); return (f"{x} + {a - x}", a)


def sub_p(a, top):
    m = R.randint(a, top); return (f"{m} − {m - a}", a)


def build_set(pages):
    out = []
    for name, maker, sets in pages:
        pools = {code: pool(maker, answers) for code, answers in sets.items()}
        for code, answers in sets.items():
            assert all(a in answers for _, a in pools[code])
        legend = [(code, f"{a[0]}-{a[-1]}" if a == list(range(a[0], a[-1] + 1)) and len(a) > 1 else ", ".join(map(str, a)))
                  for code, a in sets.items()]
        bg = "d" if name == "Snowflake" else "b"
        out.append((name, assign(name, pools, bg=bg), legend, bg))
    return out


# ---------------- Grades 1-2 ----------------
G12 = build_set([
    ("Snowman8", lambda a: add_p(a, 10), {"k": [1, 2, 3], "w": [4, 5, 6], "o": [7, 8], "b": [9, 10]}),
    ("Tree8", lambda a: sub_p(a, 10), {"y": [0, 1], "g": [2, 3, 4, 5], "n": [6, 7], "b": [8, 9, 10]}),
    ("Mitten8", lambda a: add_p(a, 20), {"r": list(range(11, 15)), "w": list(range(15, 18)), "b": list(range(18, 21))}),
    ("Toque8", lambda a: sub_p(a, 20), {"w": list(range(1, 5)), "r": list(range(5, 9)), "b": list(range(9, 13))}),
])
STORY12 = [("Maya made 7 snowballs. Her brother made 6 more. How many snowballs did they make in all?", "7 + 6 = 13 snowballs"),
           ("There were 15 mittens in the lost-and-found box. 9 mittens were picked up. How many are left?", "15 − 9 = 6 mittens"),
           ("Leo saw 8 chickadees at the feeder and then 8 more. How many chickadees did he see?", "8 + 8 = 16 chickadees"),
           ("A class needs 20 toques for the winter drive. They have 12. How many more do they need?", "20 − 12 = 8 more toques"),
           ("Sam built a snow fort with 9 blocks on the bottom and 5 on top. How many blocks did he use?", "9 + 5 = 14 blocks"),
           ("There were 18 children skating. 10 went inside for hot chocolate. How many are still skating?", "18 − 10 = 8 children")]
ONT12 = ("Ontario Mathematics Curriculum (2020), Strand B Number: <b>B2 Operations</b>. Grade 1: <b>B2.2</b> (recall and "
         "demonstrate addition facts for numbers up to 10, and related subtraction facts). Grade 2: addition and subtraction "
         "facts and problems to 20 (B2). Strand A mathematical processes are supported through the self-checking pictures.")


def story_page(b, items, key):
    y = b.header("Winter Story Problems", "Write a number sentence")
    if key: b.key_stamp()
    for i, (q, a) in enumerate(items, 1):
        y = b.question(i, q, y, 2, answer=a if key else None, st=style(13, 18))


def build_12(b):
    b.cover(["4 mystery pictures", "story problems", "Ontario aligned"])
    b.guide("Students solve addition and subtraction facts, then colour each square by the code to reveal a winter picture. "
            "Pictures 1-2 practise facts to 10 (Grade 1); pictures 3-4 practise facts to 20 (Grade 2). The pictures are "
            "self-checking: a square that looks out of place means a fact needs a second look.",
            [("m1", "Mystery Picture 1: addition to 10"), ("m2", "Mystery Picture 2: subtraction to 10"),
             ("m3", "Mystery Picture 3: addition to 20"), ("m4", "Mystery Picture 4: subtraction to 20"),
             ("story", "Winter Story Problems (6)"), ("keys", "Answer keys"), ("terms", "Terms of use")],
            [("Differentiation", "Grade 1 students can stop after pictures 1-2; Grade 2 students can start at picture 3. "
              "Split classes can use one pack for both grades."),
             ("Secular winter", "Snowman, tree, mitten and toque pictures work in every classroom from December to February.")], ONT12)
    for i, (name, probs, legend, bg) in enumerate(G12, 1):
        b.page(f"m{i}"); mystery(b, name, probs, legend, bg=bg)
    b.page("story"); story_page(b, STORY12, False)
    for name, probs, legend, bg in G12:
        b.page("keys"); mystery(b, name, probs, legend, key=True, bg=bg)
    b.page("keys"); story_page(b, STORY12, True)
    b.terms()


# ---------------- Grades 3-4 ----------------
F3 = [(a, f) for f in (2, 5, 10) for a in range(1, 11)]
F4 = [(a, b) for a in range(1, 11) for b in range(1, 11)]


def mul3(lo, hi):
    lst = [(f"{a}×{f}" if R.random() < .5 else f"{f}×{a}", a * f) for a, f in F3 if lo <= a * f <= hi]; R.shuffle(lst); return lst


def div3(lo, hi):
    lst = [(f"{a * f}÷{f}", a) for a, f in F3 if lo <= a <= hi]; R.shuffle(lst); return lst


def mul4(lo, hi):
    lst = [(f"{a}×{b}", a * b) for a, b in F4 if lo <= a * b <= hi]; R.shuffle(lst); return lst


def div4(lo, hi):
    lst = [(f"{a * b}÷{b}", a) for a, b in F4 if lo <= a <= hi]; R.shuffle(lst); return lst


def build_ranges(pages):
    out = []
    for name, maker, rng, bg in pages:
        pools = {code: maker(lo, hi) for code, (lo, hi) in rng.items()}
        for code, (lo, hi) in rng.items():
            assert pools[code] and all(lo <= a <= hi for _, a in pools[code]), (name, code)
        out.append((name, assign(name, pools, bg=bg), [(c, f"{lo}-{hi}") for c, (lo, hi) in rng.items()], bg))
    return out


G34 = build_ranges([
    ("Snowman", mul3, {"k": (1, 10), "w": (12, 20), "o": (25, 35), "r": (40, 50), "b": (60, 100)}, "b"),
    ("Tree", mul3, {"y": (1, 10), "g": (12, 20), "r": (25, 35), "n": (40, 50), "b": (60, 100)}, "b"),
    ("Mitten", div3, {"r": (1, 3), "w": (4, 6), "b": (7, 10)}, "b"),
    ("Snowflake", mul4, {"w": (1, 36), "d": (40, 100)}, "d"),
    ("Toque", div4, {"w": (1, 3), "r": (4, 7), "b": (8, 10)}, "b"),
])
WORD34 = [("Each snowman needs 3 buttons. How many buttons are needed for 8 snowmen?", "8 × 3 = 24 buttons"),
          ("40 students are going skating. Each van holds 5 students. How many vans are needed?", "40 ÷ 5 = 8 vans"),
          ("A class collected 6 boxes of mittens with 10 pairs in each box. They gave away 25 pairs. How many pairs are left?", "6 × 10 = 60; 60 − 25 = 35 pairs"),
          ("Snow fell 4 cm each hour for 7 hours. How much snow fell in all?", "7 × 4 = 28 cm"),
          ("Ava has 36 cookies to share equally on 9 plates. How many cookies go on each plate?", "36 ÷ 9 = 4 cookies"),
          ("A toque costs $9. How much do 6 toques cost? Is $50 enough? Explain.", "6 × 9 = $54; $50 is not enough (short $4)")]
ONT34 = ("Ontario Mathematics Curriculum (2020), Strand B Number: <b>B2 Operations</b>. Grade 3: <b>B2.2</b> (recall and "
         "demonstrate multiplication facts of 2, 5 and 10, and related division facts). Grade 4: <b>B2.2</b> (recall and "
         "demonstrate multiplication facts from 1 × 1 to 10 × 10, and related division facts). Strand A mathematical "
         "processes are built into the word problems.")


def word34(b, key):
    y = b.header("Winter Word Problems", "Multiply and divide  •  show your thinking")
    if key: b.key_stamp()
    for i, (q, a) in enumerate(WORD34, 1):
        y = b.question(i, q, y, 2, answer=a if key else None)


def build_34(b):
    b.cover(["5 mystery pictures", "word problems", "Ontario aligned"])
    b.guide("Five 12 × 12 mystery pictures (144 facts each). Pictures 1-3 use Grade 3 facts (2, 5 and 10, and related "
            "division); pictures 4-5 use Grade 4 facts (to 10 × 10, and related division). Students colour each square by "
            "the answer's range to reveal a winter picture.",
            [("m1", "Mystery Picture 1: ×2, ×5, ×10 (Grade 3)"), ("m2", "Mystery Picture 2: ×2, ×5, ×10 (Grade 3)"),
             ("m3", "Mystery Picture 3: related division (Grade 3)"), ("m4", "Mystery Picture 4: facts to 10 × 10 (Grade 4)"),
             ("m5", "Mystery Picture 5: related division (Grade 4)"), ("word", "Winter Word Problems (6)"),
             ("keys", "Answer keys"), ("terms", "Terms of use")],
            [("Colour code", "Each colour covers a range of answers. Remind students to solve first, then find the range."),
             ("Split classes", "Grade 3 and Grade 4 students can work side by side on their own pictures.")], ONT34)
    for i, (name, probs, legend, bg) in enumerate(G34, 1):
        b.page(f"m{i}"); mystery(b, name, probs, legend, bg=bg)
    b.page("word"); word34(b, False)
    for name, probs, legend, bg in G34:
        b.page("keys"); mystery(b, name, probs, legend, key=True, bg=bg)
    b.page("keys"); word34(b, True)
    b.terms()


L12 = dict(tpt_title="Winter Math Mystery Pictures | Addition & Subtraction to 20 | Grade 1 2 | Ontario",
           price="$3.50. Range $3 to $4.", grades="1st, 2nd", subjects="Math, Winter", type="Worksheets, Activities",
           description="Students solve addition and subtraction facts, then colour by the code to reveal a hidden winter picture. "
                       "The pictures are self-checking!\n\nIncluded: 4 mystery pictures (snowman, tree, mitten, toque), with "
                       "facts to 10 for Grade 1 and facts to 20 for Grade 2; 6 winter story problems; coloured answer keys; and a "
                       "teacher guide.\n\nOntario Math (2020) B2 Operations (Grade 1 B2.2). Secular winter theme for "
                       "December to February.",
           keywords=["winter math", "mystery picture", "colour by number", "addition to 20", "subtraction", "grade 1", "grade 2", "Ontario math", "January", "no prep"])
L34 = dict(tpt_title="Winter Multiplication & Division Mystery Pictures | Grade 3 4 | Ontario Math",
           price="$4.00. Range $3.50 to $5.", grades="3rd, 4th", subjects="Math, Winter", type="Worksheets, Activities",
           description="Practise multiplication and division facts with 5 winter mystery pictures (144 facts each)!\n\n"
                       "Included: 3 Grade 3 pictures (facts of 2, 5 and 10, and related division) and 2 Grade 4 pictures (facts to "
                       "10 x 10, and related division); 6 winter word problems; coloured answer keys; and a teacher guide.\n\n"
                       "Ontario Math (2020) B2.2 for Grades 3 and 4. Secular winter theme.",
           keywords=["winter math", "multiplication mystery picture", "division facts", "grade 3", "grade 4", "Ontario math", "colour by number", "fact fluency", "January", "no prep"])

if __name__ == "__main__":
    b = Book("Winter-Mystery-Pictures-Grades-1-2-Ontario", "Winter Mystery Math", "Addition & Subtraction to 20", "Grades 1-2",
             "frost_kids", mystery_art("Snowman8", "Tree8", "Toque8", bg="b"), ribbon="ONTARIO CURRICULUM")
    run(build_12, b, inside=[3, 4, 5, 7, 8, 10], feature=3, feature_line=("Solve, colour, reveal!", "SELF-CHECKING WINTER PICTURES"),
        key_page=8, preview=[1, 2, 3, 7], listing=L12)
    b = Book("Winter-Mystery-Pictures-Grades-3-4-Ontario", "Winter Mystery Math", "Multiplication & Division Facts", "Grades 3-4",
             "frost", mystery_art("Snowman", "Tree", "Toque", bg="b"), ribbon="ONTARIO CURRICULUM")
    run(build_34, b, inside=[3, 4, 6, 7, 8, 9], feature=3, feature_line=("144 facts per picture", "SOLVE • COLOUR • REVEAL"),
        key_page=9, preview=[1, 2, 3, 8], listing=L34)
