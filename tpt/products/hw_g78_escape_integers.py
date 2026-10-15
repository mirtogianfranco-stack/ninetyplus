"""Haunted House Escape Room: Integer Operations - Grades 7-8 (Ontario Math 2020). Five rooms, decoder, keys."""
import os, random, string, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from kit import Book, run, style, W, H, M, INK, GREY, KEYRED, star
from kit.halloween import night_scene, bat, ghost, pumpkin, NIGHT, MOON
from reportlab.lib.colors import HexColor, white

R = random.Random(78)
ONT = ("Ontario Mathematics Curriculum (2020), Grades 7 and 8, Strand B Number: <b>B2 Operations</b> (adding and "
       "subtracting integers in Grade 7; multiplying and dividing integers in Grade 8; using the order of operations; "
       "solving problems involving integers). Strand A mathematical processes (problem solving, reasoning, persevering) "
       "are central to the escape-room format.")

# decoder: fixed values for the letters used in the word problems, the rest random and unique
FIXED = {"T": -12, "R": 15, "E": -7, "A": 23}
pool = [v for v in range(-36, 37) if v not in (0, 1, -1) and v not in FIXED.values()]
R.shuffle(pool)
DECODER = dict(FIXED)
for L in string.ascii_uppercase:
    if L not in DECODER:
        DECODER[L] = pool.pop()
assert len(set(DECODER.values())) == 26
VAL = DECODER


def fmt(v):
    return f"({v})".replace("-", "−") if v < 0 else str(v)


def add_p(v):
    while True:
        a = R.randint(-30, 30); b = v - a
        if a and b and abs(b) <= 45 and (a < 0 or b < 0): return f"{fmt(a).strip('()') if a < 0 else a} + {fmt(b)}".replace("-", "−")


def sub_p(v):
    while True:
        b = R.choice([x for x in range(-25, 26) if x]); a = v + b
        if a and abs(a) <= 45: return f"{str(a).replace('-', chr(0x2212))} − {fmt(b)}"


def muldiv_p(v):
    divs = [d for d in range(2, 10) if v % d == 0 and abs(v // d) > 1]
    if divs and R.random() < 0.6:
        d = R.choice(divs) * R.choice([1, -1]); return f"{fmt(d)} × {fmt(v // d)}"
    k = R.choice([x for x in range(-9, 10) if abs(x) > 1]); return f"{fmt(v * k)} ÷ {fmt(k)}"


def ops_p(v):
    for _ in range(500):
        a, b = R.choice([x for x in range(-7, 8) if abs(x) > 1]), R.choice([x for x in range(-7, 8) if abs(x) > 1])
        c = v - a * b
        if c and abs(c) <= 40 and R.random() < 0.5:
            return f"{fmt(a)} × {fmt(b)} + {fmt(c)}"
        p = R.choice([x for x in range(-20, 21) if x]); r = R.choice([x for x in range(-6, 7) if abs(x) > 1]); q = p - v * r
        if q and abs(q) <= 40:
            return f"({str(p).replace('-', chr(0x2212))} − {fmt(q)}) ÷ {fmt(r)}"
    raise RuntimeError(v)


def check(expr, v):
    e = expr.replace("−", "-").replace("×", "*").replace("÷", "/")
    assert abs(eval(e) - v) < 1e-9, (expr, v)


WORDS_PROBS = [
    ("At 7 p.m. on Halloween, the temperature in Thunder Bay was 3°C. By midnight it had dropped 15 degrees. What was the temperature at midnight?", "3 − 15 = −12"),
    ("A bat colony roosts in a cave 9 m below the entrance (−9 m). One bat flies up 24 m. What is its position now, compared with the entrance?", "−9 + 24 = 15"),
    ("A haunted elevator starts at floor 5 and goes down 12 floors. Ground level is 0 and floors below ground are negative. Where does it stop?", "5 − 12 = −7"),
    ("In a costume contest, a team's score was −17. They earned 40 points in the final round. What is their final score?", "−17 + 40 = 23"),
    ("The temperature fell 3 degrees every hour for 4 hours. What integer shows the total change?", "4 × (−3) = −12"),
]
ROOMS = [("Room 1: The Front Gate", "Add integers", "GHOST", add_p),
         ("Room 2: The Dusty Hallway", "Subtract integers", "BATS", sub_p),
         ("Room 3: The Library", "Multiply and divide integers", "MOON", muldiv_p),
         ("Room 4: The Attic", "Order of operations", "WITCH", ops_p),
         ("Room 5: The Basement", "Integer word problems", "TREAT", None)]
PROBS = []
for title, skill, word, maker in ROOMS:
    if maker:
        lst = []
        for L in word:
            e = maker(VAL[L]); check(e, VAL[L]); lst.append((e, VAL[L], L))
    else:
        lst = [(q, VAL[L], L) for (q, _), L in zip(WORDS_PROBS, word)]
        for (q, work), L in zip(WORDS_PROBS, word):
            assert work.replace("−", "-").split("= ")[-1] == str(VAL[L]), (work, L)
    PROBS.append(lst)


def decoder(b, x, y, w, fs=10):
    c = b.c; cols = 13; cw = w / cols; ch = 34
    for i, L in enumerate(string.ascii_uppercase):
        r, k = divmod(i, cols); cx, cy = x + k * cw, y - r * ch * 1.0
        c.setFillColor(b.t.dark); c.rect(cx, cy - 16, cw, 16, stroke=0, fill=1)
        c.setFillColor(white); c.setFont("BodyB", fs); c.drawCentredString(cx + cw / 2, cy - 12, L)
        c.setFillColor(b.t.light); c.rect(cx, cy - ch, cw, ch - 16, stroke=0, fill=1)
        c.setFillColor(INK); c.setFont("BodyB", fs); c.drawCentredString(cx + cw / 2, cy - ch + 5, str(VAL[L]).replace("-", "−"))
        c.setStrokeColor(white); c.setLineWidth(1); c.rect(cx, cy - ch, cw, ch)
    return y - 2 * ch


def room_page(b, i, key):
    title, skill, word, _ = ROOMS[i]
    y = b.header(title, skill)
    if key: b.key_stamp()
    c = b.c
    y = b.para("Solve each problem. Find your answer in the decoder and write its letter below. The letters spell the "
               "code word that unlocks the next room.", M, y, W - 2 * M, style(11.5, 15.5)) - 8
    y = decoder(b, M, y, W - 2 * M, 9.5) - 16
    step = (y - 120) / len(PROBS[i])
    for j, (q, v, L) in enumerate(PROBS[i], 1):
        b.badge(M + 10, y - 8, j)
        if ROOMS[i][3] is not None:
            c.setFillColor(GREY); c.setFont("Body", 8); c.drawString(M + 30, y - 40, "show your work")
        if ROOMS[i][3] is None:
            yy = b.para(q, M + 28, y, 330, style(11.5, 15))
            bottom = min(yy - 10, y - step)
        else:
            c.setFillColor(INK); c.setFont("BodyB", 18); c.drawString(M + 30, y - 22, q + " =")
            bottom = y - step
        c.setStrokeColor(INK); c.setLineWidth(1.2)
        c.roundRect(W - M - 150, y - 40, 80, 34, 6); c.roundRect(W - M - 52, y - 40, 52, 34, 6)
        c.setFillColor(GREY); c.setFont("Body", 8); c.drawString(W - M - 148, y - 4, "answer"); c.drawString(W - M - 50, y - 4, "letter")
        if key:
            c.setFillColor(KEYRED); c.setFont("BodyB", 15)
            c.drawCentredString(W - M - 110, y - 29, str(v).replace("-", "−")); c.drawCentredString(W - M - 26, y - 29, L)
        c.setStrokeColor(HexColor("#E5E7EB")); c.setLineWidth(0.6); c.line(M, bottom + 4, W - M, bottom + 4)
        y = bottom
    c.setFillColor(b.t.primary); c.setFont("BodyB", 13); c.drawString(M, 82, "CODE WORD:")
    for k in range(len(word)):
        c.setStrokeColor(INK); c.setLineWidth(1.5); c.roundRect(M + 100 + k * 46, 66, 38, 40, 6)
        if key:
            c.setFillColor(KEYRED); c.setFont("BodyB", 22); c.drawCentredString(M + 119 + k * 46, 78, word[k])


def intro(b):
    y = b.header("Escape the Haunted House", "Read this first", name=False)
    c = b.c
    y = b.para("It's Halloween night, and your team has wandered into the old house at the end of the street. The door has "
               "slammed shut behind you! Every room is locked with a code word. To escape, you must solve the integer "
               "puzzles in all five rooms before the clock strikes midnight.", M, y, W - 2 * M, style(13, 19)) - 16
    rules = ["Work with your team. Every member records the work on their own sheet.",
             "Show your work for every problem. The decoder only helps if your answer is correct!",
             "When you finish a room, bring the code word to the Gatekeeper (your teacher) to get the next room.",
             "If a letter doesn't fit, check your signs first. Most mistakes hide there.",
             "Escape all five rooms to earn your Escape Certificate."]
    y = b.section_title("How to play", y) - 8
    for i, r in enumerate(rules, 1):
        b.badge(M + 10, y - 8, i)
        y = b.para(r, M + 28, y, W - 2 * M - 28, style(12.5, 17)) - 10
    y -= 10
    b.table(["Room", "Skill", "Letters"], [(t.split(": ")[1], s, len(w)) for t, s, w, _ in ROOMS], M, y, [200, 230, 86], rh=26, fs=11)
    ghost(c, W - M - 60, 70, 90); bat(c, M + 60, 110, 90); pumpkin(c, M + 160, 92, 34)


def certificate(b):
    c = b.c; t = b.t
    c.setFillColor(NIGHT); c.rect(30, 30, W - 60, H - 60, stroke=0, fill=1)
    c.setStrokeColor(t.primary); c.setLineWidth(6); c.rect(44, 44, W - 88, H - 88)
    c.setFillColor(MOON); c.circle(W - 130, H - 140, 50, stroke=0, fill=1)
    bat(c, 150, H - 130, 110, HexColor("#000000"))
    c.setFillColor(white); c.setFont("Anton", 60); c.drawCentredString(W / 2, H - 290, "YOU ESCAPED!")
    c.setFillColor(t.accent); c.setFont("BodyB", 18); c.drawCentredString(W / 2, H - 330, "Haunted House Integer Escape Room")
    c.setFillColor(white); c.setFont("Body", 16); c.drawCentredString(W / 2, H - 400, "This certifies that")
    c.setStrokeColor(white); c.setLineWidth(1); c.line(140, H - 460, W - 140, H - 460)
    c.drawCentredString(W / 2, H - 500, "solved every integer puzzle and escaped before midnight.")
    for x in (180, W - 180):
        pumpkin(c, x, 170, 40)
    c.line(220, 110, 390, 110); c.setFont("Body", 11); c.drawCentredString(305, 94, "Gatekeeper")


def build(b):
    b.cover(["5 rooms", "decoder", "certificate", "Ontario aligned"])
    b.guide("A no-tech, print-and-play escape room for Grades 7-8. Teams move through five haunted rooms by solving integer "
            "problems. Each answer matches a letter in the decoder, and the letters spell a code word. Only correct work "
            "produces a real word, so the activity is self-checking and keeps every group accountable.",
            [("intro", "Story and rules (project or print one per team)"), ("rooms", "Rooms 1-5 (print one set per student or team)"),
             ("cert", "Escape certificate"), ("keys", "Answer keys for every room"), ("terms", "Terms of use")],
            [("Code words", "Room 1 GHOST, Room 2 BATS, Room 3 MOON, Room 4 WITCH, Room 5 TREAT. Keep this page "
              "out of students' sight!"),
             ("Running it", "Hand out Room 1 to every team. When a team shows you the correct code word, give them the next "
              "room. Set a 40-50 minute timer, play spooky music, and dim the lights for atmosphere."),
             ("Differentiation", "Grade 7 classes can skip Room 3 or do it together. Grade 8 classes can do all five rooms "
              "independently.")], ONT)
    b.page("intro"); intro(b)
    for i in range(5):
        b.page("rooms"); room_page(b, i, False)
    b.page("cert", footer=False); certificate(b)
    for i in range(5):
        b.page("keys"); room_page(b, i, True)
    b.terms()


LISTING = dict(
    tpt_title="Halloween Escape Room Integer Operations | Grade 7 8 Math | Ontario Curriculum",
    price="$5.00. Range $4.50 to $6 (escape rooms sell at a premium).", grades="7th, 8th (also 6th enrichment)",
    subjects="Math, Halloween", type="Escape Rooms, Activities, Games",
    description="""
Turn integer practice into a **Halloween escape room**! Teams solve integer puzzles to decode secret words and escape
five haunted rooms before midnight. This is a no-tech, print-and-play activity.

**What's included:**
- Story and rules page
- 5 rooms:
  - Room 1, adding integers
  - Room 2, subtracting integers
  - Room 3, multiplying and dividing integers
  - Room 4, order of operations
  - Room 5, real-world integer word problems
- A built-in decoder on every page, so answers spell code words and the activity checks itself
- "You Escaped!" certificate
- Complete answer keys and a teacher guide with setup tips

**Ontario curriculum:** Grades 7-8, Strand B Number, B2 Operations (integer operations, order of operations)

Metric units and Canadian place names throughout.
""",
    keywords=["Halloween escape room", "integers", "integer operations", "grade 7 math", "grade 8 math", "Ontario math curriculum",
              "order of operations", "math escape room", "Halloween math", "no prep"])

if __name__ == "__main__":
    b = Book("Halloween-Escape-Room-Integers-Grades-7-8-Ontario", "Haunted House Escape", "Integer Operations Escape Room",
             "Grades 7-8", "potion", night_scene, ribbon="ONTARIO CURRICULUM")
    run(build, b, inside=[3, 4, 6, 7, 8, 9], feature=4, feature_line=("Solve, decode, escape!", "5 ROOMS • SELF-CHECKING CODES"),
        key_page=13, preview=[1, 2, 3, 4, 9], listing=LISTING)
