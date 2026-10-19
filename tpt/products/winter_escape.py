"""Winter Break Escape Room (Grades 7-8, Ontario Math 2020): integers, ratios, percents, rates, order of operations.
Answers decode letters that spell each room's code word. Every problem is generated to hit its letter's value and checked."""
import os, random, string, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
from kit import Book, run, style, W, H, M, INK, GREY, KEYRED
from kit.winter import snowflake, snowman, tree, toque, mitten, winter_scene, NAVY, ICE
from reportlab.lib.colors import white, HexColor

R = random.Random(1231)
ONT = ("Ontario Mathematics Curriculum (2020), Grades 7 and 8, Strand B Number: <b>B2 Operations</b> (integer "
       "operations; order of operations; ratios, rates and percents in proportional reasoning problems). Strand A "
       "mathematical processes (problem solving, reasoning and proving, persevering) are central to the escape-room format.")

FIXED = {"S": 12, "O": 18, "T": 24, "E": 30, "Q": 6, "U": 36, "K": 42, "A": 48, "F": 54, "R": 60,
         "N": -8, "W": -15, "C": -21, "H": 27, "I": -4, "L": 9}
pool = [v for v in range(-40, 70) if v not in (0, 1, -1) and v not in FIXED.values()]
R.shuffle(pool)
VAL = dict(FIXED)
for Ltr in string.ascii_uppercase:
    if Ltr not in VAL:
        VAL[Ltr] = pool.pop()
assert len(set(VAL.values())) == 26
neg = lambda v: str(v).replace("-", "−")


def temp_p(v):
    """Integer change problems: Thunder Bay temperatures for realistic winter answers, hockey goal differential otherwise."""
    if -30 <= v <= 2:
        while True:
            d = R.choice([x for x in range(-14, 15) if abs(x) >= 3]); a = v - d
            if -32 <= a <= 2 and a: break
        verb = f"rose {d}" if d > 0 else f"dropped {-d}"
        q = f"At 7 a.m. in Thunder Bay it was {neg(a)}\u00b0C. By noon the temperature had {verb} degrees. What was the temperature at noon?"
    else:
        while True:
            d = R.choice([x for x in range(-12, 13) if abs(x) >= 3]); a = v - d
            if a and abs(a) <= 25: break
        change = f"improved by {d}" if d > 0 else f"got worse by {-d}"
        q = (f"The Polar Bears hockey team's goal differential was {neg(a)} in December. Over the winter break tournament it "
             f"{change}. What is the goal differential now?")
    op = "+" if d > 0 else "\u2212"
    return (q, f"{neg(a)} {op} {abs(d)} = {neg(v)}")


def ratio_p(v):
    a = R.choice([d for d in (2, 3, 6) if v % d == 0]); b = R.choice([x for x in (3, 4, 5, 7) if x != a]); k = v // a
    q = R.choice([
        f"A hot chocolate recipe uses {a} tablespoons of cocoa for every {b} cups of milk. How many tablespoons of cocoa are needed for {b * k} cups of milk?",
        f"A winter trail mix uses {a} cups of raisins for every {b} cups of nuts. How many cups of raisins are needed for {b * k} cups of nuts?",
        f"A bracelet pattern uses {a} red beads for every {b} white beads. How many red beads are needed for {b * k} white beads?"])
    return (q, f"{a}:{b} = ?:{b * k}; scale by {k}: {a} \u00d7 {k} = {v}")


def pct_p(v):
    p = R.choice([10, 20, 25, 50]); base = v * 100 // p; assert base * p == v * 100
    ctx = R.choice([f"A ski shop has {p}% off a ${base} jacket. How many dollars do you save?",
                    f"{base} students went skating, and {p}% of them rented skates. How many students rented skates?",
                    f"A rink sold {base} hot chocolates, and {p}% were extra large. How many were extra large?"])
    return (ctx, f"{p}% of {base} = {base} × {p / 100:g} = {v}")


def rate_p(v):
    h = R.choice([d for d in (2, 3, 4, 5, 6) if v % d == 0])
    if R.random() < .5:
        return (f"A snowplow clears {v * h} km of road in {h} hours. At that rate, how many kilometres does it clear in 1 hour?",
                f"{v * h} ÷ {h} = {v} km/h")
    r = v // h
    return (f"Snow falls at {r} cm per hour. How many centimetres fall in {h} hours?", f"{r} × {h} = {v} cm")


def ops_p(v):
    for _ in range(500):
        a, b = R.choice([x for x in range(-7, 8) if abs(x) > 1]), R.choice([x for x in range(-7, 8) if abs(x) > 1])
        c = v - a * b
        if c and abs(c) <= 40:
            f = lambda x: f"({neg(x)})" if x < 0 else str(x)
            return (f"{f(a)} × {f(b)} + {f(c)}", f"{a * b} + {f(c)} = {neg(v)}")
    raise RuntimeError(v)


ROOMS = [("Room 1: The Frozen Pond", "Integers: changes", "SNOW", temp_p, True),
         ("Room 2: The Hot Chocolate Hut", "Ratios", "TOQUE", ratio_p, True),
         ("Room 3: The Skating Rink", "Percents", "SKATE", pct_p, True),
         ("Room 4: The Snowplow Garage", "Rates", "FROST", rate_p, True),
         ("Room 5: The Ice Castle", "Order of operations with integers", "CHILL", ops_p, False)]
PROBS = [[(maker(VAL[L]), VAL[L], L) for L in word] for _, _, word, maker, _ in ROOMS]
for room in PROBS:  # verify every generated problem
    for (q, work), v, L in room:
        assert work.endswith(neg(v)) or work.split("= ")[-1].split(" ")[0] == neg(v) or f"= {v}" in work, (q, work, v)


def decoder(b, x, y, w):
    c = b.c; cw = w / 13; ch = 34
    for i, L in enumerate(string.ascii_uppercase):
        r, k = divmod(i, 13); cx, cy = x + k * cw, y - r * ch
        c.setFillColor(b.t.dark); c.rect(cx, cy - 16, cw, 16, stroke=0, fill=1)
        c.setFillColor(white); c.setFont("BodyB", 9.5); c.drawCentredString(cx + cw / 2, cy - 12, L)
        c.setFillColor(b.t.light); c.rect(cx, cy - ch, cw, ch - 16, stroke=0, fill=1)
        c.setFillColor(INK); c.drawCentredString(cx + cw / 2, cy - ch + 5, neg(VAL[L]))
        c.setStrokeColor(white); c.rect(cx, cy - ch, cw, ch)
    return y - 2 * ch


def room_page(b, i, key):
    title, skill, word, _, wordy = ROOMS[i]
    y = b.header(title, skill)
    if key: b.key_stamp()
    c = b.c
    y = b.para("Solve each problem. Find your answer in the decoder and write its letter. The letters spell the code word "
               "that unlocks the next room.", M, y, W - 2 * M, style(11.5, 15.5)) - 8
    y = decoder(b, M, y, W - 2 * M) - 14
    step = (y - 120) / len(PROBS[i])
    for j, ((q, work), v, L) in enumerate(PROBS[i], 1):
        b.badge(M + 10, y - 8, j)
        if wordy:
            b.para(q, M + 28, y, 318, style(11.5, 15))
        else:
            c.setFillColor(INK); c.setFont("BodyB", 18); c.drawString(M + 30, y - 22, q + " =")
        if key:
            b.para(f'<font color="#D62828">{work}</font>', M + 28, y - step + 30, 360, style(10, 12))
        c.setStrokeColor(INK); c.setLineWidth(1.2)
        c.roundRect(W - M - 150, y - 40, 80, 34, 6); c.roundRect(W - M - 52, y - 40, 52, 34, 6)
        c.setFillColor(GREY); c.setFont("Body", 8); c.drawString(W - M - 148, y - 4, "answer"); c.drawString(W - M - 50, y - 4, "letter")
        if key:
            c.setFillColor(KEYRED); c.setFont("BodyB", 15); c.drawCentredString(W - M - 110, y - 29, neg(v)); c.drawCentredString(W - M - 26, y - 29, L)
        c.setStrokeColor(HexColor("#E5E7EB")); c.setLineWidth(.6); c.line(M, y - step + 4, W - M, y - step + 4)
        y -= step
    c.setFillColor(b.t.primary); c.setFont("BodyB", 13); c.drawString(M, 82, "CODE WORD:")
    for k in range(len(word)):
        c.setStrokeColor(INK); c.setLineWidth(1.5); c.roundRect(M + 100 + k * 46, 66, 38, 40, 6)
        if key: c.setFillColor(KEYRED); c.setFont("BodyB", 22); c.drawCentredString(M + 119 + k * 46, 78, word[k])


def intro(b):
    y = b.header("Escape Before the Snow Day Ends!", "Read this first", name=False)
    y = b.para("A huge storm has shut down the town, and your team is stuck at the Winter Carnival! Every building is locked "
               "with a code word. Solve the math in all five locations to find the codes and get home before the snow day ends.",
               M, y, W - 2 * M, style(13, 19)) - 14
    y = b.section_title("How to play", y) - 8
    for i, r in enumerate(["Work as a team, but everyone records the work on their own sheet.",
                           "Show your work. The decoder only helps if your answer is correct!",
                           "Bring each code word to the Gatekeeper (your teacher) to unlock the next room.",
                           "If a letter doesn't fit, check your signs and your scale factors first.",
                           "Escape all five rooms to earn your certificate."], 1):
        b.badge(M + 10, y - 8, i); y = b.para(r, M + 28, y, W - 2 * M - 28, style(12.5, 17)) - 10
    b.table(["Room", "Skill", "Letters"], [(t.split(": ")[1], s, len(w)) for t, s, w, _, _ in ROOMS], M, y - 10, [200, 230, 86], rh=26, fs=11)
    c = b.c; snowman(c, W - M - 60, 60, 130); tree(c, M + 50, 60, 120); tree(c, M + 120, 60, 90)


def certificate(b):
    c = b.c; t = b.t
    c.setFillColor(NAVY); c.rect(30, 30, W - 60, H - 60, stroke=0, fill=1)
    c.setStrokeColor(t.primary); c.setLineWidth(6); c.rect(44, 44, W - 88, H - 88)
    for fx, fy, fr in [(120, H - 120, 30), (W - 120, H - 140, 24), (160, 170, 22), (W - 150, 180, 28), (W / 2, H - 90, 16)]:
        snowflake(c, fx, fy, fr, ICE)
    c.setFillColor(white); c.setFont("Anton", 60); c.drawCentredString(W / 2, H - 290, "YOU ESCAPED!")
    c.setFillColor(t.accent); c.setFont("BodyB", 18); c.drawCentredString(W / 2, H - 330, "Winter Break Escape Room")
    c.setFillColor(white); c.setFont("Body", 16); c.drawCentredString(W / 2, H - 400, "This certifies that")
    c.setStrokeColor(white); c.setLineWidth(1); c.line(140, H - 460, W - 140, H - 460)
    c.drawCentredString(W / 2, H - 500, "solved every puzzle and made it home before the snow day ended.")
    c.line(220, 110, 390, 110); c.setFont("Body", 11); c.drawCentredString(305, 94, "Gatekeeper")


def build(b):
    b.cover(["5 rooms", "decoder", "certificate", "Ontario aligned"])
    b.guide("A no-tech, print-and-play winter escape room for Grades 7-8. Teams move through five Winter Carnival locations "
            "by solving integer, ratio, percent, rate and order-of-operations problems. Each answer matches a letter in the "
            "decoder, and only correct work spells a real word, so the activity checks itself.",
            [("intro", "Story and rules"), ("rooms", "Rooms 1-5"), ("cert", "Escape certificate"), ("keys", "Answer keys with worked solutions"),
             ("terms", "Terms of use")],
            [("Code words", "Room 1 SNOW, Room 2 TOQUE, Room 3 SKATE, Room 4 FROST, Room 5 CHILL. Keep this page out of sight!"),
             ("Timing", "Plan for 45-60 minutes. It's a great last-day-before-break or first-week-back activity."),
             ("Differentiation", "Grade 7 classes may want calculators for Room 3; Grade 8 classes can work without them.")], ONT)
    b.page("intro"); intro(b)
    for i in range(5):
        b.page("rooms"); room_page(b, i, False)
    b.page("cert", footer=False); certificate(b)
    for i in range(5):
        b.page("keys"); room_page(b, i, True)
    b.terms()


LISTING = dict(
    tpt_title="Winter Escape Room Math | Integers, Ratios, Percents, Rates | Grade 7 8 | Ontario",
    price="$5.00. Range $4.50 to $6.", grades="7th, 8th", subjects="Math, Winter", type="Escape Rooms, Activities, Games",
    description="A no-tech, print-and-play **winter escape room** for Grades 7-8! Teams are stuck at the Winter Carnival during "
                "a snowstorm and must solve math in five locations to escape.\n\nRooms: The Frozen Pond (integers: "
                "temperature changes); The Hot Chocolate Hut (ratios); The Skating Rink (percents); The Snowplow Garage "
                "(rates); The Ice Castle (order of operations with integers).\n\nIncluded: story and rules, a built-in "
                "decoder on every page (only correct answers spell the code word), an escape certificate, answer keys "
                "with worked solutions, and a teacher guide.\n\nOntario Math (2020) Strand B Number. Canadian context "
                "(Thunder Bay, toques, kilometres).",
    keywords=["winter escape room", "math escape room", "integers", "ratios", "percents", "rates", "grade 7 math", "grade 8 math", "Ontario math", "December"])

if __name__ == "__main__":
    b = Book("Winter-Escape-Room-Grades-7-8-Ontario", "Winter Break Escape", "Integers, Ratios, Percents & Rates", "Grades 7-8",
             "frost", winter_scene, ribbon="ONTARIO CURRICULUM")
    run(build, b, inside=[3, 4, 6, 7, 8, 9], feature=5, feature_line=("Escape the snow day!", "5 ROOMS • SELF-CHECKING CODES"),
        key_page=11, preview=[1, 2, 3, 4, 9], listing=LISTING)
