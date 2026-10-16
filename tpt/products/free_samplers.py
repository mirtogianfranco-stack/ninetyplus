"""Three freebies that sample the paid Halloween products and point back to them (follower magnets).
Run after the paid products are built: the promo pages show their covers."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
from kit import Book, run, OUT
from kit.halloween import night_scene, mystery_art, count_art
import hw_k_math_literacy as K
import hw_g1_mystery_add_sub as G1
import hw_g4_mystery_mult_div as G4
import hw_g78_escape_integers as E

FREE = "FREE  •  PRINT & GO  •  ANSWER KEY"
pdf = lambda slug: os.path.join(OUT, slug + ".pdf")


def listing(title, grades, subjects, desc, kw):
    return dict(tpt_title=title, price="FREE", grades=grades, subjects=subjects, type="Worksheets, Activities, Freebies",
                description=desc, keywords=kw)


def k_free(b):
    b.cover(["2 activity pages", "answer key", "Ontario aligned"])
    b.page("a"); K.count_circle(b, K.CC[0], False)
    b.page("a"); K.sounds(b, K.SND[0], False)
    b.page("keys"); K.count_circle(b, K.CC[0], True)
    b.page("keys"); K.sounds(b, K.SND[0], True)
    b.promo_page(pdf("Halloween-Math-Literacy-Kindergarten-Ontario"), "Halloween Fun: Kindergarten Math & Literacy",
                 "10 activity pages: counting to 10, patterns, comparing, beginning sounds and tracing Halloween words, "
                 "with answer keys. Aligned to the Ontario Kindergarten Program (2016).")
    b.terms()


def mystery_free(b):
    b.cover(["2 mystery pictures", "Grade 1 + Grade 4", "answer keys"])
    n1, p1, l1 = G1.SETS[0]; n4, k4, p4, l4 = G4.SETS[0]
    b.page("a"); G1.mystery(b, n1, p1, l1)
    b.page("a"); G4.mystery(b, n4, p4, l4)
    b.page("keys"); G1.mystery(b, n1, p1, l1, key=True)
    b.page("keys"); G4.mystery(b, n4, p4, l4, key=True)
    b.promo_page(pdf("Halloween-Mystery-Pictures-Grade-1-Ontario"), "Grade 1 Halloween Mystery Math (Addition & Subtraction to 10)",
                 "4 mystery pictures plus Halloween story problems to 20, with coloured answer keys. Ontario Math (2020) B2.2.")
    b.promo_page(pdf("Halloween-Mystery-Pictures-Mult-Div-Grade-4-Ontario"), "Grade 4 Halloween Mystery Math (Multiplication & Division)",
                 "5 mystery pictures with 144 facts each (to 10 × 10) plus multi-step word problems. Ontario Math (2020) B2.2.")
    b.terms()


def escape_free(b):
    b.cover(["story + rules", "Room 1", "answer key"])
    b.page("a"); E.intro(b)
    b.page("a"); E.room_page(b, 0, False)
    b.page("keys"); E.room_page(b, 0, True)
    b.promo_page(pdf("Halloween-Escape-Room-Integers-Grades-7-8-Ontario"), "Haunted House Escape Room: Integer Operations",
                 "All 5 rooms (add, subtract, multiply/divide, order of operations, word problems), an escape certificate, "
                 "full answer keys and teacher setup tips. Ontario Math (2020) B2.")
    b.terms()


JOBS = [
    ("FREE-Halloween-Kindergarten-Sampler", "Free Halloween Sampler", "Kindergarten Counting & Sounds", "Kindergarten", "spooky_kids", count_art, k_free,
     dict(inside=[2, 3, 4, 6], feature=2, feature_line=("Free for your class!", "COUNTING • BEGINNING SOUNDS"), key_page=4, preview=[1, 2, 3]),
     listing("FREE Halloween Kindergarten Math & Literacy Sampler | Counting & Beginning Sounds | Ontario",
             "Kindergarten, Pre-K", "Math, Literacy, Halloween",
             "A free taste of my Halloween Kindergarten pack! Includes Count and Circle (numbers to 10) and Beginning Sounds, with answer keys. Friendly, not-scary pictures. Aligned to the Ontario Kindergarten Program (2016).\n\nLove it? The full Halloween Fun pack has 10 activity pages: counting, patterns, comparing, sounds and tracing.",
             ["free Halloween", "kindergarten freebie", "counting to 10", "beginning sounds", "Ontario kindergarten", "Halloween centres"])),
    ("FREE-Halloween-Mystery-Picture-Sampler", "Free Mystery Pictures", "Halloween Colour-by-Answer Sampler", "Grades 1 & 4", "spooky",
     mystery_art("Pumpkin8", "Pumpkin"), mystery_free,
     dict(inside=[2, 3, 4, 5, 6], feature=3, feature_line=("Solve, colour, reveal!", "GRADE 1 + GRADE 4 SAMPLES"), key_page=5, preview=[1, 2, 3]),
     listing("FREE Halloween Math Mystery Pictures | Addition & Multiplication | Grade 1 & 4 | Ontario",
             "1st, 2nd, 3rd, 4th", "Math, Halloween",
             "Two free Halloween mystery pictures! Grade 1 students solve addition facts to 10, and Grade 4 students solve multiplication facts to 10 x 10. Then they colour by the code to reveal a pumpkin. Coloured answer keys included. Aligned to Ontario Math (2020) B2.2.\n\nLove it? The full Grade 1 and Grade 4 packs each have 4-5 mystery pictures plus word problems.",
             ["free Halloween math", "mystery picture", "colour by number", "addition facts", "multiplication facts", "Ontario math"])),
    ("FREE-Halloween-Escape-Room-Sampler", "Free Escape Room Sampler", "Haunted House: Integer Room 1", "Grades 7-8", "potion", night_scene, escape_free,
     dict(inside=[2, 3, 4, 5], feature=3, feature_line=("Try Room 1 free!", "INTEGER PUZZLES • SELF-CHECKING"), key_page=4, preview=[1, 2, 3]),
     listing("FREE Halloween Escape Room Sampler | Integer Operations | Grade 7 8 Math | Ontario",
             "7th, 8th", "Math, Halloween",
             "Try the first room of my Haunted House Escape Room free! Students add integers to decode a secret word that unlocks the next room. Includes the story, rules, Room 1 and the answer key. Aligned to Ontario Math (2020) B2.\n\nLove it? The full escape room has 5 rooms, a certificate and setup tips.",
             ["free escape room", "Halloween math", "integers", "grade 7 math", "grade 8 math", "Ontario math"])),
]

if __name__ == "__main__":
    for slug, title, sub, grades, theme, art, fn, extras, lst in JOBS:
        b = Book(slug, title, sub, grades, theme, art, badge_line=FREE, ribbon="FREE SAMPLE")
        b.freebie = True
        run(fn, b, listing=lst, **extras)
