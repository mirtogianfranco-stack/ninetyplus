"""Grade 3 EQAO-Style Math Practice, Set 1 (Ontario Mathematics, Grade 3): 32 questions in four sections plus two open
responses. Each question is tagged with its exact Grade 3 expectation code (Ministry Curriculum and Resources site).
Formats mirror the online assessment on paper: multiple choice, multiple select, choose-the-word and short answer."""
import math, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
from kit import Book, Theme, run, style, W, H, M, INK, GREY, KEYRED
from reportlab.lib.colors import white, HexColor

T = Theme("#1D4ED8", "#1E3A8A", "#FACC15", "#EFF6FF", "Fredoka")
ONT = ("Ontario Mathematics, Grade 3 (current curriculum on the Ministry's Curriculum and Resources site). Every question is "
       "tagged with its specific expectation: <b>B1 Number Sense</b> (B1.1-B1.7), <b>B2 Operations</b> (B2.1-B2.9), "
       "<b>C1 Patterns</b>, <b>C2 Equations</b>, <b>C3 Coding</b>, <b>D1 Data Literacy</b>, <b>D2 Probability</b>, "
       "<b>E1 Geometric and Spatial Reasoning</b>, <b>E2 Measurement</b> and <b>F1 Money and Finances</b>.")

# (code, kind, question, options, answer index or list, explanation, drawing)
Q = [
 # Section 1: Number Sense
 ("B1.1", "mc", "Which number is the same as 400 + 60 + 7?", ["4067", "467", "476", "4607"], 1, "4 hundreds, 6 tens, 7 ones = 467", None),
 ("B1.2", "mc", "Which list is in order from <b>least</b> to <b>greatest</b>?", ["583, 538, 358", "358, 583, 538", "358, 538, 583", "538, 358, 583"], 2, "Compare hundreds, then tens: 358 < 538 < 583", None),
 ("B1.3", "mc", "Round 846 to the nearest <b>hundred</b>.", ["800", "840", "850", "900"], 0, "846 is closer to 800 than to 900 (46 < 50)", None),
 ("B1.4", "ms", "You count by 50s starting at 0. Which numbers will you say? <b>Select all that apply.</b>", ["150", "225", "300", "475", "500"], [0, 2, 4], "0, 50, 100, 150, ... 300, ... 500", None),
 ("B1.5", "mc", "In the number 729, what is the <b>value</b> of the digit 2?", ["2", "20", "200", "729"], 1, "The 2 is in the tens place: 2 tens = 20", None),
 ("B1.6", "mc", "8 cookies are shared equally among 3 friends. How much does each friend get?", ["2 cookies", "2 and 1/3 cookies", "2 and 2/3 cookies", "3 cookies"], 2, "Each gets 2 whole cookies; the 2 left over are cut into thirds: 2/3 each", None),
 ("B1.7", "mc", "Which fraction is equivalent to 1/2?", ["1/3", "2/4", "2/3", "3/5"], 1, "2 fourths = 1 half", None),
 ("B2.2", "mc", "5 × 7 = ?", ["12", "30", "35", "40"], 2, "Count by 5s seven times: 35", None),
 # Section 2: Operations
 ("B2.2", "mc", "40 ÷ 10 = ?", ["4", "10", "30", "400"], 0, "10 × 4 = 40, so 40 ÷ 10 = 4", None),
 ("B2.3", "mc", "<b>Estimate</b>. 298 + 405 is closest to...", ["500", "600", "700", "800"], 2, "About 300 + 400 = 700", None),
 ("B2.5", "mc", "A school library has 356 books. It buys 248 more. How many books does it have now?", ["504", "594", "604", "614"], 2, "356 + 248 = 604", None),
 ("B2.5", "mc", "Mia had 500 stickers. She gave away 165. How many stickers does she have left?", ["335", "345", "365", "445"], 0, "500 − 165 = 335", None),
 ("B2.6", "mc", "Which number sentence matches this array?", ["4 + 6 = 10", "4 × 6 = 24", "6 − 4 = 2", "24 ÷ 3 = 8"], 1, "4 rows of 6 = 24", "array"),
 ("B2.7", "mc", "Each pizza is cut in half. How many halves are there in 4 pizzas?", ["2", "4", "6", "8"], 3, "2 halves in each pizza × 4 pizzas = 8 halves", None),
 ("B2.8", "mc", "1/4 + 1/4 + 1/4 = ?", ["3/12", "1/4", "3/4", "4/3"], 2, "3 one-fourths = 3/4", None),
 ("B2.9", "mc", "One bag holds 5 apples. How many apples are in 10 bags?", ["15", "25", "50", "100"], 2, "Ratio 1 to 5: 10 bags × 5 = 50", None),
 # Section 3: Algebra and Data
 ("C1.3", "mc", "What is the missing number?   12, 24, 36, ____, 60", ["40", "46", "48", "50"], 2, "The rule is add 12: 36 + 12 = 48", None),
 ("C1.2", "mc", "A pattern goes  A  B  B  A  B  B  A ...  What comes next?", ["A", "B", "C", "A B"], 1, "The core is A B B, so after A comes B", None),
 ("C2.1", "mc", "7 + ____ = 15.  What number goes in the blank?", ["7", "8", "9", "22"], 1, "15 − 7 = 8", None),
 ("C2.2", "ms", "Which expressions are equal to 6 × 4? <b>Select all that apply.</b>", ["4 × 6", "6 + 4", "12 × 2", "20 + 4", "30 − 4"], [0, 2, 3], "6 × 4 = 24; 4 × 6, 12 × 2 and 20 + 4 also equal 24", None),
 ("C3.2", "mc", "Read the code. What number does it show at the end?", ["15", "20", "25", "30"], 2, "10, then add 5 three times: 15, 20, 25", "code"),
 ("C3.2", "ms", "Look at the code in question 21 again. Which changes would make it show <b>40</b>? <b>Select all that apply.</b>",
  ["Repeat 6 times instead of 3", "Add 10 instead of add 5", "Start at 20 instead of 10", "Repeat 4 times instead of 3"], [0, 1], "10 + 6 × 5 = 40; 10 + 3 × 10 = 40; (20 + 15 = 35; 10 + 20 = 30)", None),
 ("D1.4", "mc", "What is the <b>mean</b> of 4, 6 and 8?", ["4", "6", "8", "18"], 1, "4 + 6 + 8 = 18; 18 ÷ 3 = 6", None),
 ("D1.4", "mc", "What is the <b>mode</b> of 3, 5, 5, 7, 9?", ["3", "5", "7", "9"], 1, "5 appears most often", None),
 # Section 4: Data, Spatial Sense, Money
 ("D1.5", "mc", "Use the bar graph. How many more students chose crackers than yogurt?", ["3", "4", "5", "13"], 2, "Crackers 9 − yogurt 4 = 5", "graph"),
 ("D2.1", "word", "A bag has 9 red cubes and 1 blue cube. Picking a <b>red</b> cube is... (circle one)", ["impossible", "unlikely", "likely", "certain"], 2, "Most cubes are red, but not all, so it is likely", None),
 ("E1.1", "mc", "Which 3-D object has 6 faces, 12 edges and 8 vertices?", ["cone", "cylinder", "cube", "square-based pyramid"], 2, "A cube has 6 square faces, 12 edges and 8 vertices", None),
 ("E1.4", "mc", "You are facing <b>north</b>. You make a quarter-turn to the right. Which way are you facing now?", ["south", "east", "west", "north"], 1, "A quarter-turn right from north is east", None),
 ("E2.1", "mc", "A rectangle is 6 cm long and 4 cm wide. What is its <b>perimeter</b>?", ["10 cm", "14 cm", "20 cm", "24 cm"], 2, "6 + 4 + 6 + 4 = 20 cm", None),
 ("E2.2", "mc", "Which unit is best for measuring the distance from Toronto to Ottawa?", ["millimetres", "centimetres", "metres", "kilometres"], 3, "Long distances between cities are measured in kilometres", None),
 ("E2.6", "mc", "What time does the clock show?", ["3:45", "9:15", "4:45", "3:09"], 0, "The hour hand is between 3 and 4; the minute hand points to 9 (45 minutes)", "clock"),
 ("F1.1", "mc", "A pencil costs 65¢. You pay with a loonie ($1). How much change do you get?", ["25¢", "35¢", "45¢", "65¢"], 1, "100¢ − 65¢ = 35¢", None),
]
OPEN = [("B2.1", "Sam says 7 × 5 gives the same answer as 5 × 7. Is Sam correct? Show how you know with an array or a drawing, "
                 "and explain in words.", "Yes. 7 rows of 5 and 5 rows of 7 both make 35 (the order of factors does not change the product). Look for a correct array and explanation."),
        ("D1.5", "Use the bar graph from question 25. The class can order only <b>two</b> snacks. Which two should they choose? "
                 "Make a convincing argument using the data.", "Crackers (9) and grapes (7) were chosen most often, so they would please the most students (16 of 26). Accept other answers with a data-based argument.")]
SECTIONS = [("Section 1: Number Sense", 0), ("Section 2: Operations", 8), ("Section 3: Algebra and Data", 16), ("Section 4: Data, Spatial Sense and Money", 24)]


def draw_extra(b, kind, x, y):
    """Draws a small figure with top-left (x, y); returns its height."""
    c = b.c
    if kind == "array":
        for r in range(4):
            for k in range(6): c.setFillColor(b.t.primary); c.circle(x + 20 + k * 22, y - 12 - r * 22, 7, stroke=0, fill=1)
        return 92
    if kind == "code":
        c.setFillColor(HexColor("#F1F5F9")); c.setStrokeColor(b.t.dark); c.setLineWidth(1); c.roundRect(x, y - 82, 210, 80, 8, fill=1)
        c.setFillColor(INK); c.setFont("BodyB", 12)
        for i, ln in enumerate(["set number to 10", "repeat 3 times:", "      add 5 to number", "show number"]):
            c.drawString(x + 12, y - 20 - i * 18, ln)
        return 88
    if kind == "graph":
        data = [("apples", 6), ("crackers", 9), ("yogurt", 4), ("grapes", 7)]
        gx, gy, gh = x + 30, y - 120, 100; u = gh / 10
        c.setStrokeColor(GREY); c.setLineWidth(.5)
        for k in range(0, 11, 2):
            c.line(gx, gy + k * u, gx + 230, gy + k * u); c.setFillColor(INK); c.setFont("Body", 8); c.drawRightString(gx - 4, gy + k * u - 3, str(k))
        for i, (lab, v) in enumerate(data):
            c.setFillColor(b.t.primary); c.rect(gx + 12 + i * 56, gy, 34, v * u, stroke=0, fill=1)
            c.setFillColor(INK); c.setFont("Body", 8.5); c.drawCentredString(gx + 29 + i * 56, gy - 11, lab)
        c.setFont("BodyB", 9); c.drawCentredString(gx + 115, gy + gh + 6, "Our Favourite Snacks (scale: each line = 2)")
        return 140
    if kind == "clock":
        cx, cy, r = x + 50, y - 50, 44
        c.setStrokeColor(INK); c.setLineWidth(2); c.setFillColor(white); c.circle(cx, cy, r, fill=1)
        c.setFillColor(INK); c.setFont("BodyB", 9)
        for n in range(1, 13):
            a = math.radians(90 - n * 30); c.drawCentredString(cx + (r - 10) * math.cos(a), cy + (r - 10) * math.sin(a) - 3, str(n))
        ha = math.radians(90 - 3.75 * 30); ma = math.radians(90 - 45 * 6)
        c.setLineWidth(3); c.line(cx, cy, cx + r * .5 * math.cos(ha), cy + r * .5 * math.sin(ha))
        c.setLineWidth(2); c.line(cx, cy, cx + r * .8 * math.cos(ma), cy + r * .8 * math.sin(ma)); c.circle(cx, cy, 2.5, fill=1)
        return 102
    return 0


def question(b, n, q, y, key):
    code, kind, text, opts, ans, expl, extra = q
    c = b.c
    b.badge(M + 12, y - 10, n, r=12)
    c.setFillColor(GREY); c.setFont("BodyB", 9); c.drawRightString(W - M, y - 6, code)
    y = b.para(text, M + 32, y, W - 2 * M - 80, style(12.5, 17)) - 6
    if extra in ("clock", "array"):
        draw_extra(b, extra, W - M - (110 if extra == "clock" else 160), y + 4)
    elif extra:
        y -= draw_extra(b, extra, M + 34, y) + 4
    hits = ans if isinstance(ans, list) else [ans]
    if kind == "word":
        x = M + 40
        for j, o in enumerate(opts):
            w = c.stringWidth(o, "BodyB", 13) + 22
            c.setStrokeColor(KEYRED if key and j in hits else b.t.primary); c.setLineWidth(2.5 if key and j in hits else 1.2)
            c.roundRect(x, y - 22, w, 24, 12); c.setFillColor(INK); c.setFont("BodyB", 13); c.drawString(x + 11, y - 15, o); x += w + 12
        return y - 40
    for j, o in enumerate(opts):
        hit = key and j in hits
        c.setStrokeColor(INK); c.setLineWidth(1.2); c.setFillColor(KEYRED if hit else white)
        if kind == "ms": c.rect(M + 34, y - 15, 13, 13, fill=1)
        else: c.circle(M + 41, y - 9, 7, fill=1)
        c.setFillColor(white if hit else INK); c.setFont("BodyB", 8)
        if kind != "ms": c.drawCentredString(M + 41, y - 12, "ABCDE"[j])
        y = b.para(o, M + 56, y - 1, W - 2 * M - 70, style(12, 15.5, KEYRED if hit else INK)) - 4
    if key: y = b.para(f"<i>{expl}</i>", M + 34, y, W - 2 * M - 40, style(10, 13, KEYRED)) - 2
    return y - 11


def section(b, title, start, key):
    for half in (0, 1):
        b.page("keys" if key else f"s{start}")
        y = b.header(title + (" (continued)" if half else ""), "EQAO-style practice  •  Grade 3 Math", name=not key)
        if key: b.key_stamp()
        if not half and not key:
            y = b.para("Read each question carefully. Fill in the circle for <b>one</b> answer. When you see a square, select <b>all</b> "
                       "the answers that are correct.", M, y, W - 2 * M, style(11, 15, GREY)) - 8
        for i in range(start + half * 4, start + half * 4 + 4):
            y = question(b, i + 1, Q[i], y, key)
            assert y > 34, (title, i, y)


def open_page(b, key):
    b.page("keys" if key else "open")
    y = b.header("Open Response", "Show your thinking", name=not key)
    if key: b.key_stamp()
    for i, (code, q, a) in enumerate(OPEN, 33):
        b.c.setFillColor(GREY); b.c.setFont("BodyB", 9); b.c.drawRightString(W - M, y - 6, code)
        b.badge(M + 12, y - 10, i, r=12)
        y = b.para(q, M + 32, y, W - 2 * M - 80, style(12.5, 17)) - 8
        if key:
            y = b.para(f'<font color="#D62828"><b>{a}</b></font>', M + 32, y, W - 2 * M - 40, style(11.5, 15)) - 30
        else:
            b.c.setStrokeColor(b.t.primary); b.c.setLineWidth(1.2); b.c.roundRect(M + 32, y - 250, W - 2 * M - 32, 250, 10); y -= 270


def tracker(b):
    b.page("track")
    y = b.header("My Results Tracker", "Self-assessment")
    rows = [(str(i + 1), q[0], "") for i, q in enumerate(Q)] + [("33", OPEN[0][0], ""), ("34", OPEN[1][0], "")]
    half = (len(rows) + 1) // 2; cw = (W - 2 * M - 16) / 2
    for k, part in enumerate((rows[:half], rows[half:])):
        b.table(["Q", "Expectation", "Correct?"], part, M + k * (cw + 16), y, [40, 110, cw - 150], rh=17.5, fs=9.5)
    yy = y - (half + 1) * 17.5 - 22
    b.question(1, "Which expectation do I want to practise more? What will I do to get better?", yy, 2)


def expmap(b):
    b.page("map")
    y = b.header("Teacher Expectation Map", "Which questions assess which expectations", name=False)
    from collections import OrderedDict
    m = OrderedDict()
    for i, q in enumerate(Q, 1): m.setdefault(q[0], []).append(str(i))
    for code, _, a in OPEN: m.setdefault(code, []).append("33" if code == OPEN[0][0] else "34")
    rows = [(k, ", ".join(v)) for k, v in sorted(m.items(), key=lambda kv: (kv[0][0], [int(p) for p in kv[0][1:].split(".")]))]
    y = b.table(["Expectation", "Questions"], rows, M, y, [160, W - 2 * M - 160], rh=18, fs=10.5) - 14
    b.para("Use the map with the student trackers to spot class-wide next steps and to plan small-group practice.", M, y, W - 2 * M, style(11, 15, GREY))


def art(b, x, y, w, h):
    c = b.c
    c.setFillColor(b.t.dark); c.roundRect(x, y, w, h, 22, stroke=0, fill=1)
    items = [("7 × 5 = ?", 0), ("Round 846", 1), ("mean & mode", 2), ("3:45", 3)]
    for i, (t, _) in enumerate(items):
        cx = x + 40 + (i % 2) * (w / 2 - 20); cy = y + h - 60 - (i // 2) * 90
        c.setFillColor(white); c.roundRect(cx, cy - 40, w / 2 - 60, 60, 12, stroke=0, fill=1)
        c.setFillColor(b.t.dark); c.setFont("Fredoka", 22); c.drawString(cx + 18, cy - 18, t)


def build(b):
    b.cover(["32 questions", "4 sections", "open response", "expectation codes"])
    b.guide("EQAO-style practice for Grade 3 math: 32 questions in four short sections plus two open-response questions. "
            "Every question is tagged with its exact Grade 3 expectation, so you can see at a glance what each student needs. "
            "Formats mirror the online assessment on paper: multiple choice, multiple select, choose-the-word and open response.",
            [("s0", "Section 1: Number Sense (questions 1-8)"), ("s8", "Section 2: Operations (questions 9-16)"),
             ("s16", "Section 3: Algebra and Data (questions 17-24)"), ("s24", "Section 4: Data, Spatial Sense and Money (questions 25-32)"),
             ("open", "Open Response (questions 33-34)"), ("track", "My Results Tracker"), ("map", "Teacher Expectation Map"),
             ("keys", "Answer keys with explanations"), ("terms", "Terms of use")],
            [("How to use", "Do one section a day (about 15 minutes each) in the weeks before the assessment, or use the whole set as a "
              "diagnostic in January. Go over the explanations in the key together."),
             ("Not an official EQAO test", "This is original practice written to the Ontario curriculum. For the official format, "
              "students can also try EQAO's free online sample test."),
             ("Calculators and tools", "Allow the same tools your students will have, such as manipulatives, paper and pencil.")], ONT)
    for title, start in SECTIONS: section(b, title, start, False)
    open_page(b, False); tracker(b); expmap(b)
    for title, start in SECTIONS: section(b, title, start, True)
    open_page(b, True)
    b.terms()


LISTING = dict(
    tpt_title="Grade 3 EQAO Math Practice Test Prep | Ontario Math Curriculum | Set 1 | With Expectation Codes",
    price="$5.00. Range $4.50 to $5.50.", grades="3rd", subjects="Math, Test Prep", type="Assessment, Test Prep, Printables",
    description="""
**EQAO-style math practice for Ontario Grade 3**: 32 questions in four short sections plus two open-response
questions. Every question is tagged with its **exact Grade 3 expectation code**, so you know exactly what each
student needs to work on.

**What's included:**
- Section 1: Number Sense (B1)
- Section 2: Operations (B2)
- Section 3: Algebra (patterns, equations, coding) and Data (mean and mode)
- Section 4: Data, Spatial Sense (3-D objects, turns, perimeter, metric units, time) and Money (making change)
- 2 open-response questions
- My Results Tracker for students and a Teacher Expectation Map
- Answer keys with a short explanation for every question

Formats mirror the online assessment on paper: multiple choice, multiple select, choose-the-word and open response.
Original practice written to the Ontario Mathematics curriculum; not an official EQAO test.
""",
    keywords=["EQAO grade 3", "EQAO math", "Ontario math grade 3", "test prep", "math review", "Ontario curriculum",
              "grade 3 math", "spiral review", "diagnostic", "EQAO practice"])

if __name__ == "__main__":
    b = Book("Grade-3-EQAO-Style-Math-Practice-Set-1-Ontario", "Grade 3 EQAO-Style Math", "Practice Set 1 with Expectation Codes",
             "Grade 3", T, art, ribbon="ONTARIO CURRICULUM")
    run(build, b, inside=[3, 5, 7, 9, 11, 12], feature=5, feature_line=("Every question coded", "B1  •  B2  •  C  •  D  •  E  •  F"),
        key_page=14, preview=[1, 3, 5, 9, 11, 12], listing=LISTING)
