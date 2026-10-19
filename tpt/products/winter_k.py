"""Winter Fun: Kindergarten Math & Literacy (Ontario). Reuses the Halloween K page layouts with winter pictures."""
import os, random, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
from kit import Book, run
from kit.winter import snowflake, snowman, mitten, toque, tree, mug, winter_scene, NAVY
import hw_k_math_literacy as K

K.ICONS.update({"snowflake": lambda c, x, y, s: snowflake(c, x, y + s * .45, s * .38, NAVY, max(1, s * .05)),
                "snowman": lambda c, x, y, s: snowman(c, x, y, s * 1.3), "mitten": lambda c, x, y, s: mitten(c, x, y, s * 1.1),
                "toque": lambda c, x, y, s: toque(c, x, y, s * 1.15), "tree": lambda c, x, y, s: tree(c, x, y, s),
                "mug": lambda c, x, y, s: mug(c, x, y, s * .8)})
R = random.Random(1225)
NAMES = ["snowflake", "snowman", "mitten", "toque", "tree"]
CC = [[(ic, n, sorted(R.sample([v for v in range(1, 11) if v != n], 2) + [n])) for ic, n in zip(R.sample(NAMES, 4), R.sample(range(1, 11), 4))] for _ in range(2)]
CW = [[(R.choice(NAMES), n) for n in R.sample(range(1, 11), 6)] for _ in range(2)]
PAT = [[("AB", ["snowflake", "mitten"] * 3, "snowflake"), ("AB", ["tree", "snowman"] * 3, "tree"),
        ("AAB", ["toque", "toque", "mug"] * 2, "toque"), ("ABB", ["snowman", "snowflake", "snowflake"] * 2, "snowman")],
       [("ABC", ["mitten", "toque", "tree"] * 2, "mitten"), ("AB", ["mug", "snowflake"] * 3, "mug"),
        ("AABB", ["tree", "tree", "mitten", "mitten", "tree"], "tree"), ("ABB", ["toque", "snowman", "snowman"] * 2, "toque")]]
CMP = [(R.choice(NAMES), p, q) for p, q in [(6, 2), (4, 9), (7, 3), (5, 8)]]
SND = [[("snowman", "snowman", ["b", "s", "m"]), ("mitten", "mitten", ["n", "m", "t"]), ("tree", "tree", ["t", "f", "p"]), ("mug", "mug", ["g", "h", "m"])],
       [("toque", "toque", ["d", "k", "t"]), ("snowflake", "snowflake", ["s", "c", "w"]), ("mitten", "mitten", ["m", "w", "b"]), ("tree", "tree", ["l", "t", "r"])]]
for page in SND:
    for _, w, ch in page: assert w[0] in ch
TR = [("snow", "snowflake"), ("cold", "mitten"), ("tree", "tree"), ("hat", "toque"), ("mug", "mug")]
K.CC, K.CW, K.PAT, K.CMP, K.SND, K.TR = CC, CW, PAT, CMP, SND, TR


def build(b):
    b.cover(["count", "patterns", "beginning sounds", "Ontario aligned"])
    b.guide("Cozy, no-prep winter pages for Kindergarten. Directions are short, so they can be read aloud. The pictures are "
            "secular winter images (snowflakes, snowmen, mittens, toques, trees, hot chocolate), so the pages work in every classroom.",
            [("cc", "Count and Circle (2 pages)"), ("cw", "Count and Write (2 pages)"), ("pat", "What Comes Next? patterns (2 pages)"),
             ("cmp", "Which Has More? (1 page)"), ("snd", "Beginning Sounds (2 pages)"), ("tr", "Trace Winter Words (1 page)"),
             ("keys", "Answer keys"), ("terms", "Terms of use")],
            [("Pedagogical documentation", "Note how children count (one-to-one, subitizing) and how they describe a pattern. "
              "These are quick evidence for Communication of Learning reports."),
             ("Centres", "Use sheet protectors and dry-erase markers, or pair with real mittens and counters.")], K.ONT)
    for p in CC: b.page("cc"); K.count_circle(b, p, False)
    for p in CW: b.page("cw"); K.count_write(b, p, False)
    for p in PAT: b.page("pat"); K.patterns(b, p, False)
    b.page("cmp"); K.compare(b, CMP, False)
    for p in SND: b.page("snd"); K.sounds(b, p, False)
    b.page("tr"); K.trace(b, TR, "Trace Winter Words")
    for p in CC: b.page("keys"); K.count_circle(b, p, True)
    for p in CW: b.page("keys"); K.count_write(b, p, True)
    for p in PAT: b.page("keys"); K.patterns(b, p, True)
    b.page("keys"); K.compare(b, CMP, True)
    for p in SND: b.page("keys"); K.sounds(b, p, True)
    b.terms()


LISTING = dict(
    tpt_title="Winter Kindergarten Math & Literacy | Counting Patterns Beginning Sounds | Ontario",
    price="$3.50. Range $3 to $4.", grades="Kindergarten (JK/SK), Pre-K", subjects="Math, Literacy, Winter", type="Worksheets, Centres, Printables",
    description="""
No-prep **winter math and literacy** pages for Ontario Kindergarten (JK/SK)! Cozy, secular winter pictures (snowflakes,
snowmen, mittens, toques, trees and hot chocolate) make these perfect for December through February in every classroom.

**What's included (10 activity pages):**
- Count and Circle to 10 (2)
- Count and Write to 10 (2)
- What Comes Next? AB, AAB, ABB, ABC and AABB patterns (2)
- Which Has More? (1)
- Beginning Sounds: s, m, t, and more (2)
- Trace Winter Words: snow, cold, tree, hat, mug (1)
- Answer keys and a teacher guide

**Ontario curriculum:** The Kindergarten Program (2016), Demonstrating Literacy and Mathematics Behaviours, and Problem Solving and Innovating
""",
    keywords=["winter kindergarten", "Ontario kindergarten", "counting to 10", "patterns", "beginning sounds", "JK SK",
              "winter centres", "January math", "December", "no prep"])

if __name__ == "__main__":
    b = Book("Winter-Math-Literacy-Kindergarten-Ontario", "Winter Fun", "Kindergarten Math & Literacy", "Kindergarten", "frost_kids",
             winter_scene, ribbon="ONTARIO CURRICULUM")
    run(build, b, inside=[3, 5, 7, 9, 10, 12], feature=7, feature_line=("Patterns, counting & sounds", "COZY WINTER PICTURES"),
        key_page=13, preview=[1, 2, 3, 7, 10], listing=LISTING)
