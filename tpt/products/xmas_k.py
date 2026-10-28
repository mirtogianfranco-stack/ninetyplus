"""Christmas Fun: Kindergarten Math & Literacy (Ontario). Reuses the Halloween K page layouts with Christmas pictures."""
import os, random, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
from kit import Book, run
from kit.christmas import ornament, gift, candy_cane, stocking, bell, star, gingerbread, christmas_scene
from kit.winter import tree
import hw_k_math_literacy as K

K.ICONS.update({"ornament": lambda c, x, y, s: ornament(c, x, y, s * .95), "gift": lambda c, x, y, s: gift(c, x, y, s * 1.05),
                "candy": lambda c, x, y, s: candy_cane(c, x - s * .2, y, s), "stocking": lambda c, x, y, s: stocking(c, x, y, s),
                "bell": lambda c, x, y, s: bell(c, x, y, s), "star": lambda c, x, y, s: star(c, x, y + s * .45, s * .48),
                "gingerbread": lambda c, x, y, s: gingerbread(c, x, y, s), "tree": lambda c, x, y, s: tree(c, x, y, s)})
R = random.Random(2512)
NAMES = ["ornament", "gift", "bell", "star", "stocking"]
CC = [[(ic, n, sorted(R.sample([v for v in range(1, 11) if v != n], 2) + [n])) for ic, n in zip(R.sample(NAMES, 4), R.sample(range(1, 11), 4))] for _ in range(2)]
CW = [[(R.choice(NAMES), n) for n in R.sample(range(1, 11), 6)] for _ in range(2)]
PAT = [[("AB", ["star", "bell"] * 3, "star"), ("AB", ["gift", "tree"] * 3, "gift"),
        ("AAB", ["ornament", "ornament", "candy"] * 2, "ornament"), ("ABB", ["stocking", "star", "star"] * 2, "stocking")],
       [("ABC", ["bell", "gift", "gingerbread"] * 2, "bell"), ("AB", ["candy", "ornament"] * 3, "candy"),
        ("AABB", ["tree", "tree", "star", "star", "tree"], "tree"), ("ABB", ["gingerbread", "bell", "bell"] * 2, "gingerbread")]]
CMP = [(R.choice(NAMES), p, q) for p, q in [(3, 8), (7, 4), (5, 9), (6, 2)]]
SND = [[("gift", "gift", ["g", "d", "b"]), ("bell", "bell", ["d", "b", "p"]), ("star", "star", ["t", "z", "s"]), ("tree", "tree", ["t", "f", "l"])],
       [("candy", "candy", ["k", "c", "s"]), ("stocking", "stocking", ["s", "t", "h"]), ("gingerbread", "gingerbread", ["j", "p", "g"]), ("ornament", "ornament", ["o", "a", "u"])]]
for page in SND:
    for _, w, ch in page: assert w[0] in ch
TR = [("gift", "gift"), ("bell", "bell"), ("star", "star"), ("tree", "tree"), ("joy", "gingerbread")]
K.CC, K.CW, K.PAT, K.CMP, K.SND, K.TR = CC, CW, PAT, CMP, SND, TR


def build(b):
    b.cover(["count", "patterns", "beginning sounds", "Ontario aligned"])
    b.guide("Festive, no-prep Christmas pages for Kindergarten. Directions are short, so they can be read aloud. Pictures: ornaments, "
            "gifts, bells, stars, stockings, candy canes, gingerbread and trees. (Need a non-holiday option? The North Star Winter "
            "Kindergarten pack uses the same layouts with snowmen and mittens.)",
            [("cc", "Count and Circle (2 pages)"), ("cw", "Count and Write (2 pages)"), ("pat", "What Comes Next? patterns (2 pages)"),
             ("cmp", "Which Has More? (1 page)"), ("snd", "Beginning Sounds (2 pages)"), ("tr", "Trace Christmas Words (1 page)"),
             ("keys", "Answer keys"), ("terms", "Terms of use")],
            [("Pedagogical documentation", "Note how children count (one-to-one, subitizing) and how they describe a pattern. "
              "These are quick evidence for Communication of Learning reports."),
             ("Sounds tip", "Candy starts with a hard c, so k is a fair 'sounds like' distractor: talk about it. "
              "Gingerbread starts with a soft g (it sounds like j), a great discussion point for SK."),
             ("Centres", "Use sheet protectors and dry-erase markers, or pair with mini erasers or jingle bells as counters.")], K.ONT)
    for p in CC: b.page("cc"); K.count_circle(b, p, False)
    for p in CW: b.page("cw"); K.count_write(b, p, False)
    for p in PAT: b.page("pat"); K.patterns(b, p, False)
    b.page("cmp"); K.compare(b, CMP, False)
    for p in SND: b.page("snd"); K.sounds(b, p, False)
    b.page("tr"); K.trace(b, TR, "Trace Christmas Words")
    for p in CC: b.page("keys"); K.count_circle(b, p, True)
    for p in CW: b.page("keys"); K.count_write(b, p, True)
    for p in PAT: b.page("keys"); K.patterns(b, p, True)
    b.page("keys"); K.compare(b, CMP, True)
    for p in SND: b.page("keys"); K.sounds(b, p, True)
    b.terms()


LISTING = dict(
    tpt_title="Christmas Kindergarten Math & Literacy | Counting Patterns Beginning Sounds | Ontario",
    price="$3.50. Range $3 to $4.", grades="Kindergarten (JK/SK), Pre-K", subjects="Math, Literacy, Christmas", type="Worksheets, Centres, Printables",
    description="""
No-prep **Christmas math and literacy** pages for Ontario Kindergarten (JK/SK)! Ornaments, gifts, bells, stars, stockings,
candy canes and gingerbread make December centres and morning work easy.

**What's included (10 activity pages):**
- Count and Circle to 10 (2)
- Count and Write to 10 (2)
- What Comes Next? AB, AAB, ABB, ABC and AABB patterns (2)
- Which Has More? (1)
- Beginning Sounds: g, b, s, t, c, o (2)
- Trace Christmas Words: gift, bell, star, tree, joy (1)
- Answer keys and a teacher guide

**Ontario curriculum:** The Kindergarten Program (2016), Demonstrating Literacy and Mathematics Behaviours, and Problem Solving and Innovating
""",
    keywords=["christmas kindergarten", "Ontario kindergarten", "counting to 10", "patterns", "beginning sounds", "JK SK",
              "christmas centres", "December math", "December", "no prep"])

if __name__ == "__main__":
    b = Book("Christmas-Math-Literacy-Kindergarten-Ontario", "Christmas Fun", "Kindergarten Math & Literacy", "Kindergarten", "christmas_kids",
             christmas_scene, ribbon="ONTARIO CURRICULUM")
    run(build, b, inside=[3, 5, 7, 9, 10, 12], feature=7, feature_line=("Patterns, counting & sounds", "FESTIVE PICTURES"),
        key_page=13, preview=[1, 2, 3, 7, 10], listing=LISTING)
