"""Christmas freebie: Canada passage + questions (Grades 2-4), countdown word search (Grades 1-3), coordinate tree (Grades 5-8),
keys and promo pages."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
from kit import Book, run, OUT
from kit.christmas import christmas_scene
import xmas_world as XW, xmas_countdown as XC, xmas_coordinates as XG


def build(b):
    b.cover(["reading", "word search", "coordinate graphing", "answer keys"])
    can = XW.P[0]
    b.page("a"); XW.passage_page(b, can)
    b.page("a"); XW.q_page(b, can)
    XC.search(b)
    XG.mystery(b, XG.PICS[0])
    b.text_key("Answer Key: Canada", [(can["t"], [f"{'ABCD'[a]}. {o[a]}" for q, o, a in can["mc"]] + [a for q, a in can["sa"]])])
    XC.search(b, key=True)
    XG.mystery(b, XG.PICS[0], key=True)
    b.promo_page(os.path.join(OUT, "Christmas-Around-the-World-Grades-2-4-Ontario.pdf"), "Christmas Around the World (Grades 2-4)",
                 "7 countries, each with a passage and questions, plus a passport with cut-out stamps, a continents page and a Venn diagram.")
    b.promo_page(os.path.join(OUT, "Christmas-Countdown-Winter-Break-Grades-1-3-Ontario.pdf"), "12-Day Christmas Countdown (Grades 1-3)",
                 "A different math or literacy activity for each of the last 12 days before winter break, plus a poster and certificate.")
    b.promo_page(os.path.join(OUT, "Christmas-Coordinate-Graphing-Grades-5-8-Ontario.pdf"), "Christmas Coordinates (Grades 5-8)",
                 "6 mystery pictures (first quadrant and all four quadrants), a translations warm-up and Design Your Own.")
    b.terms()


LISTING = dict(tpt_title="FREE Christmas Sampler | Reading Passage, Word Search, Coordinate Graphing | Grades 1-8 | Ontario", price="FREE",
               grades="1st to 8th", subjects="Reading, Math, Christmas", type="Worksheets, Activities, Freebies",
               description="Three free Christmas activities from North Star Resources:\n\n- **A Thank-You Tree** (Grades 2-4): "
                           "a Canadian nonfiction passage about Nova Scotia's yearly Christmas tree for Boston, with questions\n"
                           "- **Christmas Word Search** (Grades 1-3) from the 12-Day Countdown\n- **Coordinate Graphing Mystery "
                           "Picture** (Grades 5-8, first quadrant)\n\nAnswer keys included. Love it? The full packs are in my store.",
               keywords=["free christmas", "christmas freebie", "christmas around the world", "word search", "coordinate graphing", "Ontario"])

if __name__ == "__main__":
    b = Book("FREE-Christmas-Sampler", "Free Christmas Sampler", "Reading, Word Search & Coordinates", "Grades 1-8", "christmas",
             christmas_scene, badge_line="FREE  •  PRINT & GO  •  ANSWER KEYS", ribbon="FREE SAMPLE")
    b.freebie = True
    run(build, b, inside=[2, 3, 4, 5, 7, 8], feature=2, feature_line=("3 free Christmas activities", "GRADES 1-8"), key_page=8,
        preview=[1, 2, 4, 5], listing=LISTING)
