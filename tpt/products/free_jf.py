"""Jan-Feb freebie: 100th Day puzzle, mat and crown, with a promo page for the full pack."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
from kit import Book, run, OUT
import jf_100day as D


def build(b):
    b.cover(["100 chart puzzle", "puzzle mat", "crown"])
    b.page("a"); D.puzzle(b)
    b.page("a"); D.puzzle_mat(b)
    b.page("a", footer=False); D.crown(b)
    b.promo_page(os.path.join(OUT, "100th-Day-of-School-K-3-Ontario.pdf"), "100th Day of School (K-3)",
                 "Hundreds charts at 2 levels, skip-counting trains, a 10 groups of 10 mat, the 100-Second Challenge, "
                 "When I Am 100 writing, keys and a stations plan. Ontario Math (2020) B1 Number Sense.")
    b.terms()


LISTING = dict(tpt_title="FREE 100th Day of School Hundreds Chart Puzzle & Crown | K-3 | Ontario", price="FREE",
               grades="Kindergarten, 1st, 2nd, 3rd", subjects="Math, Holidays", type="Activities, Freebies",
               description="Free 100th Day of School activities: a cut-apart 100 Chart Puzzle with a puzzle mat and a 100 Days "
                           "Smarter crown. No prep! Aligned to Ontario Math (2020) B1 Number Sense.\n\nLove it? The full 100th Day "
                           "pack has hundreds charts, skip counting, a sorting mat, the 100-Second Challenge, writing and more.",
               keywords=["free 100th day", "100th day of school", "hundreds chart puzzle", "crown", "kindergarten", "Ontario"])

if __name__ == "__main__":
    b = Book("FREE-100th-Day-Puzzle-and-Crown", "Free 100th Day Fun", "Hundreds Chart Puzzle & Crown", "K - Grade 3", "hundred", D.art,
             badge_line="FREE  •  PRINT & GO  •  NO PREP", ribbon="FREE SAMPLE")
    b.freebie = True
    run(build, b, inside=[2, 3, 4, 5], feature=2, feature_line=("Free for your class!", "PUZZLE • MAT • CROWN"), key_page=4,
        preview=[1, 2, 4], listing=LISTING, key_line=("Celebrate 100 days!", "CUT • BUILD • WEAR"))
