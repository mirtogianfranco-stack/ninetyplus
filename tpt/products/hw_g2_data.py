"""Halloween Data Management - Grade 2 (Ontario). Tally, pictograph, bar graph, reading graphs, probability language,
class survey template, keys."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from kit import Book, run, style, W, H, M, INK, GREY, KEYRED
from kit.halloween import night_scene, graph_art, pumpkin, bat, ghost, candy_corn, ORANGE, PURPLE
from reportlab.lib.colors import HexColor, white

ONT = ("Ontario Mathematics Curriculum (2020), Grade 2, Strand D Data: <b>D1 Data Literacy</b> (posing questions, "
       "collecting and organizing data in tally tables, displaying data in pictographs and bar graphs, and interpreting "
       "data to draw conclusions) and <b>D2 Probability</b> (using the language of likelihood). Strand A mathematical "
       "processes (reasoning and communicating) are built into every page.")

TREATS = ["chocolate"] * 8 + ["candy corn"] * 4 + ["chips"] * 5 + ["gummies"] * 7
ORDER = [0, 8, 12, 17, 1, 9, 13, 18, 2, 10, 14, 19, 3, 11, 15, 20, 4, 16, 21, 5, 22, 6, 23, 7]
assert sorted(ORDER) == list(range(24))
SURVEY = [TREATS[i] for i in ORDER]
TALLY = {t: SURVEY.count(t) for t in ["chocolate", "candy corn", "chips", "gummies"]}
COSTUMES = {"Witch": 6, "Ghost": 4, "Superhero": 7, "Pumpkin": 3}
PUMPKINS = {"Room 1": 12, "Room 2": 9, "Room 3": 15, "Room 4": 6}
BATS = {"Mon": 7, "Tue": 11, "Wed": 4, "Thu": 9, "Fri": 13}
PROB = [("Halloween will be on October 31 next year.", "certain"),
        ("Someone in our school will wear a costume on Halloween.", "likely"),
        ("It will snow in Ontario on Halloween night.", "unlikely"),
        ("A pumpkin will turn into a bus.", "impossible"),
        ("It will be dark outside at midnight.", "certain"),
        ("A bat will fly into our classroom today.", "unlikely"),
        ("You will see a jack-o'-lantern in October.", "likely"),
        ("A cat will bark like a dog.", "impossible")]
CHOICES = ["certain", "likely", "unlikely", "impossible"]


def tally_marks(c, x, y, n, h=18, col=KEYRED):
    c.setStrokeColor(col); c.setLineWidth(2)
    for g in range(0, n, 5):
        k = min(5, n - g); gx = x + (g // 5) * 46
        for i in range(min(k, 4)):
            c.line(gx + i * 8, y, gx + i * 8, y + h)
        if k == 5:
            c.line(gx - 4, y + 3, gx + 28, y + h - 3)


def survey_page(b, key):
    y = b.header("Tally the Treats", "Collect and organize data")
    if key: b.key_stamp()
    y = b.para("Ms. Patel asked her class, <b>\"What is your favourite Halloween treat?\"</b> Here are the 24 answers. "
               "Cross out each answer as you make a tally mark.", M, y, W - 2 * M, style(12.5, 17)) - 10
    c = b.c; cw, ch = (W - 2 * M) / 6, 30
    for i, t in enumerate(SURVEY):
        r, k = divmod(i, 6); x, yy = M + k * cw, y - r * ch
        c.setStrokeColor(b.t.primary); c.setLineWidth(1); c.setFillColor(b.t.light); c.roundRect(x + 3, yy - ch + 3, cw - 6, ch - 6, 6, fill=1)
        c.setFillColor(INK); c.setFont("Body", 11); c.drawCentredString(x + cw / 2, yy - ch / 2 - 4, t)
    y -= 4 * ch + 20
    rows = [(t, "", "") for t in TALLY]
    top = y; y = b.table(["Treat", "Tally", "Total"], rows, M, y, [150, 250, 116], rh=34, fs=12)
    if key:
        for i, (t, n) in enumerate(TALLY.items()):
            ry = top - 34 * (i + 2) + 8
            tally_marks(c, M + 170, ry, n)
            c.setFillColor(KEYRED); c.setFont("BodyB", 14); c.drawCentredString(M + 458, ry + 3, str(n))
    y -= 18
    qs = [("Which treat is the most popular?", "chocolate (8)"),
          ("How many more students chose gummies than candy corn?", "7 − 4 = 3 more"),
          ("Write one conclusion Ms. Patel could make from her data.", "Example: Chocolate is the class favourite, so she could bring chocolate for a party.")]
    for i, (q, a) in enumerate(qs, 1):
        y = b.question(i, q, y, 1, answer=a if key else None)


def pictograph_page(b, key):
    y = b.header("Make a Pictograph", "Display data")
    if key: b.key_stamp()
    y = b.para("The tally table shows the costumes students wore. Draw one pumpkin (or a circle) for each "
               "student to make a pictograph.", M, y, W - 2 * M, style(12.5, 17)) - 10
    c = b.c
    top = y; y = b.table(["Costume", "Tally", "Total"], [(k, "", v) for k, v in COSTUMES.items()], M, y, [150, 200, 166], rh=28, fs=12)
    for i, n in enumerate(COSTUMES.values()):
        tally_marks(c, M + 170, top - 28 * (i + 2) + 6, n, 14, INK)
    y -= 24
    c.setFillColor(INK); c.setFont("BodyB", 13); c.drawString(M, y, "Title: _________________________________________"); y -= 14
    cell = 44
    for i, (k, n) in enumerate(COSTUMES.items()):
        yy = y - (i + 1) * (cell + 6)
        c.setFillColor(b.t.light); c.rect(M, yy, 120, cell, stroke=0, fill=1)
        c.setFillColor(INK); c.setFont("BodyB", 12); c.drawString(M + 8, yy + cell / 2 - 4, k)
        for j in range(8):
            c.setStrokeColor(GREY); c.setLineWidth(0.8); c.rect(M + 126 + j * (cell + 4), yy, cell, cell)
            if key and j < n:
                pumpkin(c, M + 126 + j * (cell + 4) + cell / 2, yy + cell / 2 - 2, cell * 0.36, face=False)
    y -= 4 * (cell + 6) + 18
    c.setFont("Body", 11); c.setFillColor(INK); c.drawString(M, y, "Key: each pumpkin = 1 student")
    y -= 22
    y = b.question(1, "How many students wore costumes altogether?", y, 1, answer="6 + 4 + 7 + 3 = 20 students" if key else None)


def bar_graph(c, x, y, w, h, data, scale_max, step, fill=None, title=""):
    n = len(data); bw = w / n
    c.setStrokeColor(HexColor("#D1D5DB")); c.setLineWidth(0.6)
    for v in range(0, scale_max + 1, step):
        yy = y + v * h / scale_max; c.line(x, yy, x + w, yy)
        c.setFillColor(INK); c.setFont("Body", 9); c.drawRightString(x - 6, yy - 3, str(v))
    c.setStrokeColor(INK); c.setLineWidth(1.5); c.line(x, y, x + w, y); c.line(x, y, x, y + h)
    for i, (k, v) in enumerate(data.items()):
        if fill is not None:
            c.setFillColor(fill); c.rect(x + i * bw + bw * 0.2, y, bw * 0.6, v * h / scale_max, stroke=0, fill=1)
        c.setFillColor(INK); c.setFont("BodyB", 10); c.drawCentredString(x + i * bw + bw / 2, y - 14, k)


def bar_page(b, key):
    y = b.header("Make a Bar Graph", "Display data")
    if key: b.key_stamp()
    y = b.para("Four classes went to a pumpkin patch. Use the table to make a bar graph. Add a title and label the axes.",
               M, y, W - 2 * M, style(12.5, 17)) - 10
    y = b.table(["Class", "Pumpkins picked"], list(PUMPKINS.items()), M, y, [150, 150], rh=24, fs=11) - 30
    c = b.c
    c.setFont("BodyB", 12); c.setFillColor(INK); c.drawString(M + 40, y, "Title: ________________________________")
    gx, gy, gw, gh = M + 60, y - 330, W - 2 * M - 80, 300
    bar_graph(c, gx, gy, gw, gh, PUMPKINS, 16, 1, ORANGE if key else None)
    c.saveState(); c.translate(M + 14, gy + gh / 2); c.rotate(90); c.setFont("BodyB", 10); c.drawCentredString(0, 0, "Label: ______________"); c.restoreState()
    c.setFont("BodyB", 10); c.drawCentredString(gx + gw / 2, gy - 32, "Label: ______________")
    if key:
        c.setFillColor(KEYRED); c.setFont("BodyB", 10)
        c.drawString(M + 300, y + 0, "e.g. Pumpkins Picked by Each Class")
        c.drawString(M + 300, y - 13, "Axes: Class / Number of Pumpkins")


def read_page(b, key):
    y = b.header("Read the Graph", "Interpret data")
    if key: b.key_stamp()
    y = b.para("Leo counted bats flying near his house at dusk for one week.", M, y, W - 2 * M, style(12.5, 17)) - 8
    c = b.c
    c.setFont("BodyB", 13); c.setFillColor(INK); c.drawCentredString(W / 2, y - 6, "Bats Leo Counted at Dusk")
    gx, gy, gw, gh = M + 50, y - 250, W - 2 * M - 60, 220
    bar_graph(c, gx, gy, gw, gh, BATS, 14, 2, PURPLE)
    c.saveState(); c.translate(M + 12, gy + gh / 2); c.rotate(90); c.setFont("BodyB", 10); c.drawCentredString(0, 0, "Number of bats"); c.restoreState()
    y = gy - 40
    qs = [("On which night did Leo count the most bats? How many?", "Friday, 13 bats"),
          ("On which night did he count the fewest bats?", "Wednesday, 4 bats"),
          ("How many more bats did Leo count on Tuesday than on Monday?", "11 − 7 = 4 more"),
          ("How many bats did Leo count on Monday and Thursday together?", "7 + 9 = 16 bats"),
          ("Leo says, \"There were more bats at the end of the week.\" Do you agree? Use the graph to explain.",
           "Mostly yes: Thursday (9) and Friday (13) are higher than Monday (7) and Wednesday (4), but Tuesday (11) was also high. Accept reasoned answers.")]
    for i, (q, a) in enumerate(qs, 1):
        y = b.question(i, q, y, 1 if i < 5 else 2, answer=a if key else None)


def prob_page(b, key):
    y = b.header("How Likely Is It?", "Probability")
    if key: b.key_stamp()
    y = b.para("Read each event. Colour or tick the word that tells how likely it is.", M, y, W - 2 * M, style(12.5, 17)) - 12
    c = b.c; rh = 62
    for i, (ev, ans) in enumerate(PROB, 1):
        b.badge(M + 10, y - 8, i)
        b.para(ev, M + 28, y, W - 2 * M - 28, style(12.5, 16))
        for j, ch in enumerate(CHOICES):
            x = M + 28 + j * 124
            hit = key and ch == ans
            c.setStrokeColor(KEYRED if hit else b.t.primary); c.setLineWidth(2.5 if hit else 1.2)
            c.setFillColor(HexColor("#FDE2E2") if hit else white); c.roundRect(x, y - 52, 112, 26, 13, fill=1)
            c.setFillColor(KEYRED if hit else INK); c.setFont("BodyB", 11); c.drawCentredString(x + 56, y - 43, ch)
        y -= rh + 4
    if key:
        b.para("<i>Likely/unlikely answers can vary with good reasons. Ask students to explain their thinking.</i>", M, y + 6, W - 2 * M, style(10, 13, KEYRED))


def survey_template(b):
    y = b.header("My Halloween Survey", "Ask your own question")
    c = b.c
    c.setFont("BodyB", 12); c.setFillColor(INK)
    c.drawString(M, y, "My question: __________________________________________________"); y -= 24
    y = b.table(["Choice", "Tally", "Total"], [("", "", "")] * 4, M, y, [170, 240, 106], rh=34, fs=12) - 26
    c.setFont("BodyB", 12); c.setFillColor(INK); c.drawString(M, y, "My graph:  pictograph  or  bar graph (circle one)")
    bar_graph(c, M + 40, y - 290, W - 2 * M - 60, 250, {"": 0, " ": 0, "  ": 0, "   ": 0}, 12, 1)
    y -= 330
    c.setFont("BodyB", 12); c.drawString(M, y, "One thing my data shows: ______________________________________")


def build(b):
    b.cover(["tally", "pictograph", "bar graph", "probability"])
    b.guide("Halloween-themed data management for Grade 2. Students collect and organize survey data, build a pictograph "
            "and a bar graph, read and interpret a graph, use probability language, and finish by running their own "
            "class survey. Every task asks students to explain what the data shows.",
            [("tally", "Tally the Treats (organize data)"), ("picto", "Make a Pictograph"), ("bar", "Make a Bar Graph"),
             ("read", "Read the Graph (interpret data)"), ("prob", "How Likely Is It? (probability)"),
             ("own", "My Halloween Survey (open-ended template)"), ("keys", "Answer keys"), ("terms", "Terms of use")],
            [("Talk prompts", "What do you notice? What do you wonder? What conclusion can we make? How could we "
              "use this data?"),
             ("Extension", "Combine the class's \"My Halloween Survey\" results on chart paper and compare graphs.")], ONT)
    b.page("tally"); survey_page(b, False)
    b.page("picto"); pictograph_page(b, False)
    b.page("bar"); bar_page(b, False)
    b.page("read"); read_page(b, False)
    b.page("prob"); prob_page(b, False)
    b.page("own"); survey_template(b)
    for fn in (survey_page, pictograph_page, bar_page, read_page, prob_page):
        b.page("keys"); fn(b, True)
    b.terms()


LISTING = dict(
    tpt_title="Halloween Data Management Grade 2 | Tally, Pictograph, Bar Graph, Probability | Ontario Math",
    price="$3.50. Range $3 to $4.", grades="2nd (also 1st and 3rd)", subjects="Math, Graphing, Halloween",
    type="Worksheets, Activities, Printables",
    description="""
Make data management meaningful this Halloween! Grade 2 students collect, organize, display and interpret
Halloween data, then run their own survey.

**What's included:**
- Tally the Treats: organize 24 survey answers in a tally table
- Make a Pictograph (costumes)
- Make a Bar Graph (pumpkin patch), with title and axis labels
- Read the Graph: 5 interpretation questions, including a reasoning question
- How Likely Is It? certain, likely, unlikely, impossible
- My Halloween Survey: open-ended template
- Answer keys and a teacher guide with talk prompts

**Ontario curriculum:** Grade 2, Strand D Data, D1 Data Literacy and D2 Probability (Ontario Mathematics Curriculum 2020)
""",
    keywords=["Halloween math", "data management", "pictograph", "bar graph", "tally chart", "probability",
              "Ontario math curriculum", "grade 2 math", "graphing", "no prep"])

if __name__ == "__main__":
    b = Book("Halloween-Data-Management-Grade-2-Ontario", "Halloween Data", "Tally, Graph & Probability",
             "Grade 2", "spooky_kids", graph_art, ribbon="ONTARIO CURRICULUM")
    run(build, b, inside=[3, 4, 5, 6, 7, 8], feature=6, feature_line=("Read, graph & explain", "REAL-WORLD HALLOWEEN DATA"),
        key_page=9, preview=[1, 2, 3, 6, 7], listing=LISTING)
