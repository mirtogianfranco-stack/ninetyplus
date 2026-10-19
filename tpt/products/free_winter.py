"""Winter freebie: one Grades 1-2 and one Grades 3-4 mystery picture with keys and promo pages."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
from kit import Book, run, OUT
from kit.halloween import mystery, mystery_art
import winter_mystery as WM


def build(b):
    b.cover(["2 mystery pictures", "Grades 1-2 + 3-4", "answer keys"])
    n1, p1, l1, bg1 = WM.G12[1]; n3, p3, l3, bg3 = WM.G34[1]
    b.page("a"); mystery(b, n1, p1, l1, bg=bg1)
    b.page("a"); mystery(b, n3, p3, l3, bg=bg3)
    b.page("keys"); mystery(b, n1, p1, l1, key=True, bg=bg1)
    b.page("keys"); mystery(b, n3, p3, l3, key=True, bg=bg3)
    b.promo_page(os.path.join(OUT, "Winter-Mystery-Pictures-Grades-1-2-Ontario.pdf"), "Winter Mystery Math: Grades 1-2",
                 "4 mystery pictures (facts to 10 and to 20) plus winter story problems, with coloured answer keys. Ontario Math (2020) B2.")
    b.promo_page(os.path.join(OUT, "Winter-Mystery-Pictures-Grades-3-4-Ontario.pdf"), "Winter Mystery Math: Grades 3-4",
                 "5 mystery pictures with 144 facts each (Grade 3 facts of 2, 5 and 10; Grade 4 facts to 10 × 10) plus word problems. Ontario Math (2020) B2.2.")
    b.terms()


LISTING = dict(tpt_title="FREE Winter Math Mystery Pictures | Addition & Multiplication | Grades 1-4 | Ontario", price="FREE",
               grades="1st, 2nd, 3rd, 4th", subjects="Math, Winter", type="Worksheets, Activities, Freebies",
               description="Two free winter mystery pictures! Grades 1-2 solve subtraction facts to 10, and Grades 3-4 solve "
                           "multiplication facts of 2, 5 and 10. Then they colour by the code to reveal a winter tree. Coloured "
                           "answer keys included. Aligned to Ontario Math (2020) B2.\n\nLove it? The full Winter Mystery Math "
                           "packs have 4-5 pictures each plus word problems.",
               keywords=["free winter math", "mystery picture", "colour by number", "subtraction", "multiplication", "Ontario math"])

if __name__ == "__main__":
    b = Book("FREE-Winter-Mystery-Picture-Sampler", "Free Winter Mystery Math", "Colour-by-Answer Sampler", "Grades 1-4", "frost_kids",
             mystery_art("Tree8", "Tree", bg="b"), badge_line="FREE  •  PRINT & GO  •  ANSWER KEY", ribbon="FREE SAMPLE")
    b.freebie = True
    run(build, b, inside=[2, 3, 4, 5, 6], feature=3, feature_line=("Solve, colour, reveal!", "GRADES 1-2 + GRADES 3-4"), key_page=5,
        preview=[1, 2, 3], listing=LISTING)
