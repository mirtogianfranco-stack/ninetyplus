"""Grade 6 EQAO-Style Math Practice, Set 1 (Ontario Mathematics, Grade 6). Reuses the Grade 3 engine (question layout,
open response, tracker, expectation map) with Grade 6 questions; every question tagged with its exact Grade 6 code."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
from kit import Book, Theme, run, style, W, H, M, INK, GREY, KEYRED
from reportlab.lib.colors import white, HexColor
import g3_eqao_math as E

T = Theme("#B45309", "#78350F", "#FACC15", "#FFFBEB")
ONT = ("Ontario Mathematics, Grade 6 (current curriculum on the Ministry's Curriculum and Resources site). Every question is tagged "
       "with its specific expectation: <b>B1 Number Sense</b>, <b>B2 Operations</b> (percents, fractions, decimals, divisibility, "
       "prime factorization, ratios and rates), <b>C1-C3 Algebra</b> (pattern rules, expressions, equations, inequalities, coding "
       "with conditionals), <b>D1-D2 Data and Probability</b>, <b>E1-E2 Spatial Sense</b> and <b>F1 Financial Literacy</b>.")

E.Q = [
 ("B1.1", "mc", "Which number has 3 hundred thousands, 4 ten thousands, 5 hundreds and 2 ones?", ["340 502", "345 002", "340 052", "304 502"], 0, "300 000 + 40 000 + 500 + 2 = 340 502", None),
 ("B1.3", "mc", "Which list is in order from <b>least</b> to <b>greatest</b>?", ["−5, −2, 0, 3", "−2, −5, 0, 3", "0, −2, −5, 3", "3, 0, −2, −5"], 0, "Negative numbers farther from zero are smaller: −5 < −2 < 0 < 3", None),
 ("B1.4", "mc", "Which decimal number is the <b>greatest</b>?", ["0.405", "0.45", "0.415", "0.045"], 1, "0.450 > 0.415 > 0.405 > 0.045", None),
 ("B1.5", "mc", "Round 7.649 to the nearest <b>tenth</b>.", ["7.6", "7.65", "7.7", "8"], 0, "The hundredths digit is 4, so round down: 7.6", None),
 ("B1.6", "mc", "Which decimal is equivalent to 3/8?", ["0.38", "0.375", "0.83", "3.8"], 1, "3 ÷ 8 = 0.375", None),
 ("B1.3", "ms", "Which numbers are <b>greater than 1/2</b>? <b>Select all that apply.</b>", ["0.6", "3/8", "0.48", "5/9", "0.5"], [0, 3], "0.6 > 0.5 and 5/9 is about 0.56; 3/8 = 0.375, 0.48 and 0.5 are not greater", None),
 ("B2.2", "ms", "Which numbers are divisible by 3? <b>Select all that apply.</b>", ["117", "245", "402", "1 000", "2 351"], [0, 2], "The digit sums of 117 (9) and 402 (6) are divisible by 3; 245 (11), 1 000 (1) and 2 351 (11) are not", None),
 ("B2.6", "mc", "Which is the <b>prime factorization</b> of 60?", ["2 × 30", "2 × 2 × 3 × 5", "4 × 15", "2 × 3 × 10"], 1, "Only 2, 3 and 5 are prime: 2 × 2 × 3 × 5 = 60", None),
 ("B2.3", "mc", "What is 15% of 80?", ["8", "12", "15", "20"], 1, "10% is 8 and 5% is 4, so 15% is 12", None),
 ("B2.4", "mc", "Liam had $50.00. He spent $18.75 and $9.60. How much money does he have left?", ["$21.65", "$22.35", "$28.35", "$31.25"], 0, "$18.75 + $9.60 = $28.35; $50.00 − $28.35 = $21.65", None),
 ("B2.5", "mc", "2/3 + 1/4 = ?", ["3/7", "3/12", "11/12", "5/6"], 2, "8/12 + 3/12 = 11/12", None),
 ("B2.7", "mc", "245 × 0.3 = ?", ["7.35", "73.5", "735", "24.8"], 1, "245 × 3 = 735, then ÷ 10 = 73.5", None),
 ("B2.8", "mc", "360 ÷ 0.4 = ?", ["9", "90", "900", "144"], 2, "How many 0.4s in 360? 3600 ÷ 4 = 900", None),
 ("B2.9", "mc", "3/4 of the 24 students in a class walk to school. How many students walk?", ["6", "12", "18", "20"], 2, "24 ÷ 4 = 6; 6 × 3 = 18", None),
 ("B2.10", "mc", "How many 1/3-cup servings are in 5 cups of trail mix?", ["3", "5/3", "8", "15"], 3, "5 ÷ 1/3 = 5 × 3 = 15", None),
 ("B2.12", "mc", "A car travels 240 km in 3 hours. At the same rate, how far will it travel in 5 hours?", ["320 km", "360 km", "400 km", "480 km"], 2, "240 ÷ 3 = 80 km/h; 80 × 5 = 400 km", None),
 ("C1.3", "mc", "A pattern has term 1 = 5, term 2 = 8, term 3 = 11. Which expression gives the value of term <i>n</i>?", ["n + 3", "3n + 2", "5n", "2n + 3"], 1, "It grows by 3 each term: 3(1) + 2 = 5, 3(2) + 2 = 8", None),
 ("C2.2", "mc", "Evaluate 4x + 1.5 when x = 3.", ["8.5", "12.5", "13.5", "43.5"], 2, "4(3) + 1.5 = 12 + 1.5 = 13.5", None),
 ("C2.3", "mc", "Solve:  3m + 7 = 31", ["m = 6", "m = 8", "m = 10", "m = 12.7"], 1, "3m = 24, so m = 8. Check: 3(8) + 7 = 31", None),
 ("C2.4", "ms", "Which values of x make  2x + 5 < 17  true? <b>Select all that apply.</b>", ["3", "5", "6", "7", "0"], [0, 1, 4], "2x < 12, so x < 6: 0, 3 and 5 work; 6 and 7 do not", None),
 ("C3.2", "mc", "Read the code. What does it show at the end?", ["14", "20", "34", "0"], 0, "Only the even numbers are added: 4 + 10 = 14", "code6"),
 ("C3.2", "ms", "Look at the code in question 19 again. Which changes would make it show <b>34</b>? <b>Select all that apply.</b>",
  ["Remove the if (add every number)", "Change \"even\" to \"odd\"", "Change \"is even\" to \"is greater than 3\"", "Start total at 20 instead of 0"], [0, 2, 3],
  "Adding all four gives 34; odd gives 7 + 13 = 20; all numbers are greater than 3, so 34; 20 + 14 = 34", None),
 ("D1.5", "mc", "Data: 12, 15, 15, 18, 25. What is the <b>range</b>?", ["10", "13", "15", "17"], 1, "25 − 12 = 13", None),
 ("D1.5", "mc", "Use the same data. What is the <b>mean</b>?", ["15", "16", "17", "18"], 2, "12 + 15 + 15 + 18 + 25 = 85; 85 ÷ 5 = 17", None),
 ("D1.1", "mc", "Which of these is <b>continuous</b> data?", ["Number of pets at home", "Number of students in a class", "Heights of bean plants", "Number of goals scored"], 2, "Height can take any value in a range (it is measured); the others are counted", None),
 ("D2.1", "mc", "A spinner has 8 equal sections. 2 are blue. What is the probability of spinning blue, as a percent?", ["2%", "20%", "25%", "75%"], 2, "2/8 = 1/4 = 25%", None),
 ("E1.3", "mc", "Point A is at (−3, 4). It moves 5 units right and 6 units down. What are its new coordinates?", ["(2, −2)", "(−8, −2)", "(2, 10)", "(−3, −2)"], 0, "x: −3 + 5 = 2; y: 4 − 6 = −2", None),
 ("E2.3", "mc", "Two angles are <b>supplementary</b>. One measures 65°. What does the other measure?", ["25°", "115°", "125°", "295°"], 1, "Supplementary angles add to 180°: 180 − 65 = 115°", None),
 ("E2.4", "mc", "A trapezoid has parallel sides of 8 cm and 12 cm and a height of 5 cm. What is its area?", ["40 cm²", "50 cm²", "100 cm²", "480 cm²"], 1, "(8 + 12) ÷ 2 × 5 = 50 cm²", None),
 ("E2.1", "mc", "2.5 L = ? mL", ["25 mL", "250 mL", "2 500 mL", "25 000 mL"], 2, "1 L = 1 000 mL, so 2.5 × 1 000 = 2 500 mL", None),
 ("E1.1", "ms", "Which quadrilaterals <b>always</b> have diagonals that are equal in length? <b>Select all that apply.</b>", ["square", "rectangle", "rhombus", "kite", "parallelogram"], [0, 1], "Squares and rectangles always have equal diagonals; the others do not in general", None),
 ("F1.4", "mc", "You put $200 in a savings account that pays 3% simple interest per year. How much interest do you earn in one year?", ["$3", "$6", "$60", "$206"], 1, "3% of $200 = 0.03 × 200 = $6", None),
]
E.Q[16:24] = [E.Q[i] for i in (16, 17, 20, 21, 18, 19, 22, 23)]
E.OPEN = [("B2.12", "Store A sells 2 L of juice for $3.60. Store B sells 3 L for $4.95. Which store has the better buy? Show your work using unit rates.",
           "Store A: $3.60 ÷ 2 = $1.80 per litre. Store B: $4.95 ÷ 3 = $1.65 per litre. Store B is the better buy."),
          ("D1.6", "A bar graph shows a company sold 98 units in May and 100 units in June. The vertical axis starts at 95, so the June bar "
                   "looks almost twice as tall as the May bar. Explain why this graph is <b>misleading</b> and how you would fix it.",
           "Starting the axis at 95 exaggerates a small difference (only 2 units). Start the vertical axis at 0 (or show a clear axis break) so the bars are proportional.")]
E.SECTIONS = [("Section 1: Number Sense", 0), ("Section 2: Operations", 8), ("Section 3: Algebra and Data", 16), ("Section 4: Data, Spatial Sense and Financial Literacy", 24)]
_base_extra = E.draw_extra


def draw_extra(b, kind, x, y):
    if kind == "code6":
        c = b.c
        c.setFillColor(HexColor("#F1F5F9")); c.setStrokeColor(b.t.dark); c.setLineWidth(1); c.roundRect(x, y - 100, 290, 98, 8, fill=1)
        c.setFillColor(INK); c.setFont("BodyB", 11.5)
        for i, ln in enumerate(["set total to 0", "for each number in [4, 7, 10, 13]:", "      if number is even:", "            add number to total", "show total"]):
            c.drawString(x + 12, y - 18 - i * 18, ln)
        return 106
    return _base_extra(b, kind, x, y)


E.draw_extra = draw_extra


GROUPS = {16: [(16, 17, 18), (19, 20, 21), (22, 23)]}


def section(b, title, start, key):
    groups = GROUPS.get(start, [tuple(range(start, start + 4)), tuple(range(start + 4, start + 8))])
    for half, grp in enumerate(groups):
        b.page("keys" if key else f"s{start}")
        y = b.header(title + (" (continued)" if half else ""), "EQAO-style practice  •  Grade 6 Math", name=not key)
        if key: b.key_stamp()
        if not half and not key:
            y = b.para("Read each question carefully. Fill in the circle for <b>one</b> answer. When you see a square, select <b>all</b> "
                       "the answers that are correct.", M, y, W - 2 * M, style(11, 15, GREY)) - 8
        for i in grp:
            y = E.question(b, i + 1, E.Q[i], y, key)
            assert y > 34, (title, i, y)


def art(b, x, y, w, h):
    c = b.c
    c.setFillColor(b.t.dark); c.roundRect(x, y, w, h, 22, stroke=0, fill=1)
    for i, t in enumerate(["15% of 80", "2/3 + 1/4", "3m + 7 = 31", "(−3, 4)"]):
        cx = x + 40 + (i % 2) * (w / 2 - 20); cy = y + h - 60 - (i // 2) * 90
        c.setFillColor(white); c.roundRect(cx, cy - 40, w / 2 - 60, 60, 12, stroke=0, fill=1)
        c.setFillColor(b.t.dark); c.setFont("Anton", 24); c.drawString(cx + 18, cy - 20, t)


def build(b):
    b.cover(["32 questions", "4 sections", "open response", "expectation codes"])
    b.guide("EQAO-style practice for Grade 6 math: 32 questions in four short sections plus two open-response questions. Every "
            "question is tagged with its exact Grade 6 expectation, so you can see at a glance what each student needs. Formats "
            "mirror the online assessment on paper: multiple choice, multiple select and open response.",
            [("s0", "Section 1: Number Sense (questions 1-8)"), ("s8", "Section 2: Operations (questions 9-16)"),
             ("s16", "Section 3: Algebra and Data (questions 17-24)"), ("s24", "Section 4: Data, Spatial Sense and Financial Literacy (questions 25-32)"),
             ("open", "Open Response (questions 33-34)"), ("track", "My Results Tracker"), ("map", "Teacher Expectation Map"),
             ("keys", "Answer keys with explanations"), ("terms", "Terms of use")],
            [("How to use", "Do one section a day (about 15-20 minutes) in the weeks before the assessment, or use the whole set as a "
              "January diagnostic. Take up the explanations in the key together."),
             ("Not an official EQAO test", "This is original practice written to the Ontario curriculum. For the official format, "
              "students can also try EQAO's free online sample test."),
             ("Tools", "Allow the same tools your students will have, such as a calculator where permitted, paper and pencil.")], ONT)
    for title, start in E.SECTIONS: section(b, title, start, False)
    E.open_page(b, False); E.tracker(b); E.expmap(b)
    for title, start in E.SECTIONS: section(b, title, start, True)
    E.open_page(b, True)
    b.terms()


LISTING = dict(
    tpt_title="Grade 6 EQAO Math Practice Test Prep | Ontario Math Curriculum | Set 1 | With Expectation Codes",
    price="$5.00. Range $4.50 to $5.50.", grades="6th", subjects="Math, Test Prep", type="Assessment, Test Prep, Printables",
    description="""
**EQAO-style math practice for Ontario Grade 6**: 32 questions in four short sections plus two open-response
questions. Every question is tagged with its **exact Grade 6 expectation code**, so you know exactly what each
student needs to work on.

**What's included:**
- Section 1: Number Sense (large numbers, integers, decimals, fractions, divisibility, prime factorization)
- Section 2: Operations (percents, decimals, fractions, multiplying and dividing by tenths, rates)
- Section 3: Algebra (pattern rules, expressions, equations, inequalities, coding with conditionals) and Data (range, mean)
- Section 4: Data and probability, Spatial Sense (coordinates, angles, area, units, quadrilaterals) and Financial Literacy (interest)
- 2 open-response questions (unit rates; misleading graphs)
- My Results Tracker for students and a Teacher Expectation Map
- Answer keys with a short explanation for every question

Formats mirror the online assessment on paper: multiple choice, multiple select and open response. Original practice
written to the Ontario Mathematics curriculum; not an official EQAO test.
""",
    keywords=["EQAO grade 6", "EQAO math", "Ontario math grade 6", "test prep", "math review", "Ontario curriculum",
              "grade 6 math", "junior division", "diagnostic", "EQAO practice"])

if __name__ == "__main__":
    b = Book("Grade-6-EQAO-Style-Math-Practice-Set-1-Ontario", "Grade 6 EQAO-Style Math", "Practice Set 1 with Expectation Codes",
             "Grade 6", T, art, ribbon="ONTARIO CURRICULUM")
    run(build, b, inside=[3, 5, 7, 9, 12, 13], feature=7, feature_line=("Every question coded", "B  •  C  •  D  •  E  •  F"),
        key_page=15, preview=[1, 3, 5, 9, 12, 13], listing=LISTING)
