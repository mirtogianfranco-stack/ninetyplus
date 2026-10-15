"""Halloween Math Mystery Pictures - Grade 1 (Ontario). Addition and subtraction facts to 10 + story problems to 20."""
import os, random, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from kit import Book, run, style, W, H, M, INK
from kit.halloween import mystery, assign, night_scene, mystery_art, pumpkin, ghost, bat, candy_corn, spider

R = random.Random(2026)
ONT = ("Ontario Mathematics Curriculum (2020), Grade 1, Strand B Number: <b>B2 Operations</b>, including <b>B2.2</b> "
       "(recall and demonstrate addition facts for numbers up to 10, and related subtraction facts) and solving addition "
       "and subtraction problems (B2). Strand A (social-emotional learning skills and mathematical processes) is "
       "supported through self-checking pictures and talk prompts.")


def add_prob(a):
    x = R.randint(0, a); return (f"{x} + {a - x}", a)


def sub_prob(a):
    m = R.randint(a, 10); return (f"{m} − {m - a}", a)


def pools(sets, maker):
    out = {}
    for code, answers in sets.items():
        lst = [maker(R.choice(answers)) for _ in range(40)]; R.shuffle(lst); out[code] = lst
    return out


PAGES = [  # picture, operation, {code: answers}, bg code
    ("Pumpkin8", "add", {"o": [5, 6, 7], "g": [1, 2], "k": [3, 4], "p": [8, 9, 10]}),
    ("Ghost8", "add", {"e": [7, 8, 9, 10], "k": [2, 3], "p": [4, 5, 6]}),
    ("CandyCorn8", "sub", {"w": [0, 1], "o": [2, 3, 4], "y": [5, 6, 7], "p": [8, 9, 10]}),
    ("WitchHat8", "sub", {"k": [1, 2, 3], "o": [4, 5], "p": [6, 7, 8]}),
]
SETS = []
for name, op, sets in PAGES:
    probs = assign(name, pools(sets, add_prob if op == "add" else sub_prob))
    legend = [(code, f"{a[0]}" if len(a) == 1 else f"{a[0]}-{a[-1]}" if a == list(range(a[0], a[-1] + 1)) else ", ".join(map(str, a)))
              for code, a in sets.items()]
    SETS.append((name, probs, legend))

STORIES = [
    ("There are 6 pumpkins on the porch. Dad brings 3 more. How many pumpkins are there now?", "6 + 3 = 9 pumpkins", "pumpkin", 6),
    ("Mia has 10 candies. She gives 4 to her brother. How many candies does Mia have left?", "10 − 4 = 6 candies", "candy", 10),
    ("7 bats fly in the sky. 5 more bats join them. How many bats are there?", "7 + 5 = 12 bats", "bat", 7),
    ("There are 12 ghosts in the house. 8 ghosts float away. How many ghosts are still in the house?", "12 − 8 = 4 ghosts", "ghost", 12),
    ("Sam sees 9 spiders on a web and 9 spiders on the wall. How many spiders does Sam see?", "9 + 9 = 18 spiders", "spider", 9),
    ("Ava has 15 stickers. Leo has 11 stickers. How many more stickers does Ava have than Leo?", "15 − 11 = 4 more stickers", "candy", 0),
]
ICON = {"pumpkin": lambda c, x, y: pumpkin(c, x, y + 9, 9, face=False), "candy": lambda c, x, y: candy_corn(c, x, y, 20),
        "bat": lambda c, x, y: bat(c, x, y + 8, 26), "ghost": lambda c, x, y: ghost(c, x, y, 20), "spider": lambda c, x, y: spider(c, x, y + 6, 22)}


def story_page(b, items, start, key):
    y = b.header("Halloween Story Problems", "Draw, write a number sentence, answer")
    if key: b.key_stamp()
    c = b.c
    for i, (q, a, icon, cnt) in enumerate(items):
        n = start + i
        b.badge(M + 10, y - 8, n)
        yy = b.para(q, M + 28, y, W - 2 * M - 28, style(13.5, 19)) - 8
        for j in range(cnt):  # small picture row to support counting
            ICON[icon](c, M + 40 + j * 26, yy - 26)
        box_top = yy - 40
        c.setStrokeColor(INK); c.setLineWidth(1); c.roundRect(M + 28, box_top - 84, 250, 84, 10)
        c.setFont("Body", 9); c.setFillColor(INK); c.drawString(M + 36, box_top - 14, "Draw it")
        c.drawString(M + 296, box_top - 14, "Number sentence:"); c.line(M + 296, box_top - 42, W - M, box_top - 42)
        c.drawString(M + 296, box_top - 76, "Answer:"); c.line(M + 340, box_top - 78, W - M, box_top - 78)
        if key:
            c.setFillColor(KEYRED); c.setFont("BodyB", 13); c.drawString(M + 300, box_top - 38, a)
        y = box_top - 104


from kit import KEYRED


def build(b):
    b.cover(["4 mystery pictures", "story problems", "Ontario aligned"])
    b.guide("Students solve addition and subtraction facts to 10, then colour each square using the colour code to reveal "
            "a hidden Halloween picture. The pictures are self-checking: if a square looks out of place, students "
            "re-check that fact. Story problems extend to 20 with a draw-it box and a number sentence.",
            [("m1", "Mystery Picture 1: addition to 10"), ("m2", "Mystery Picture 2: addition to 10"),
             ("m3", "Mystery Picture 3: subtraction to 10"), ("m4", "Mystery Picture 4: subtraction to 10"),
             ("story", "Halloween Story Problems (6 problems)"), ("keys", "Answer keys (coloured pictures + story answers)"),
             ("terms", "Terms of use")],
            [("Tips", "Model how to find a fact and colour its square. Students who finish early can write their own "
              "Halloween story problem on the back."),
             ("Assessment", "Look for students who count on, use doubles or use known facts to 10. Use the story problems "
              "as an observation or conversation opportunity.")], ONT)
    for i, (name, probs, legend) in enumerate(SETS, 1):
        b.page(f"m{i}"); mystery(b, name, probs, legend)
    b.page("story"); story_page(b, STORIES[:3], 1, False)
    b.page("story"); story_page(b, STORIES[3:], 4, False)
    for name, probs, legend in SETS:
        b.page("keys"); mystery(b, name, probs, legend, key=True)
    b.page("keys"); story_page(b, STORIES[:3], 1, True)
    b.page("keys"); story_page(b, STORIES[3:], 4, True)
    b.terms()


LISTING = dict(
    tpt_title="Halloween Math Mystery Pictures Grade 1 | Addition Subtraction to 10 | Ontario Math",
    price="$3.50. Range $3 to $4.", grades="1st (also SK enrichment, 2nd review)", subjects="Math, Halloween",
    type="Worksheets, Activities, Printables",
    description="""
Your Grade 1 students will love solving facts to reveal a **hidden Halloween picture**! Each page has addition or
subtraction facts to 10. Students solve each square and colour it by the code. The finished picture is self-checking.

**What's included:**
- 4 mystery pictures (pumpkin, ghost, candy corn, witch hat): 2 addition, 2 subtraction
- 6 Halloween story problems to 20, with a draw-it box and a number sentence
- Coloured answer keys for every picture, plus story problem answers
- Teacher guide with **Ontario Mathematics Curriculum (2020)** alignment

**Ontario curriculum:** Grade 1, Strand B Number, B2 Operations (B2.2 addition facts to 10 and related subtraction facts)

Canadian spelling throughout (colour, favourite).
""",
    keywords=["Halloween math", "mystery picture", "colour by number", "addition to 10", "subtraction to 10",
              "Ontario math curriculum", "grade 1 math", "Halloween worksheets", "math centres", "no prep"])

if __name__ == "__main__":
    b = Book("Halloween-Mystery-Pictures-Grade-1-Ontario", "Halloween Mystery Math", "Addition & Subtraction to 10",
             "Grade 1", "spooky_kids", mystery_art("Pumpkin8", "Ghost8", "CandyCorn8"), ribbon="ONTARIO CURRICULUM")
    run(build, b, inside=[3, 4, 5, 7, 8, 10], feature=3, feature_line=("Solve, colour, reveal!", "SELF-CHECKING MYSTERY PICTURES"),
        key_page=10, preview=[1, 2, 3, 7], listing=LISTING)
