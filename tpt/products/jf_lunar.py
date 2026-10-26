"""Lunar New Year (K-6, Ontario). Two reading levels, questions, zodiac patterning (12-year cycle), red-envelope Canadian
money math, lantern craft, keys. 2027 Lunar New Year: Saturday, February 6 (Year of the Goat)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from kit import Book, run, style, W, H, M, INK, GREY, KEYRED
from kit.janfeb import lantern, envelope, coin, GOLD, RED
from reportlab.lib.colors import white, HexColor
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from remembrance_day import mc_block, passage

ONT = ("Ontario Language Curriculum (2023): <b>Strand A</b> (A3 exploring diverse cultures, perspectives and identities) "
       "and <b>Strand C Comprehension</b> (informational texts). Ontario Mathematics Curriculum (2020): <b>Strand C Algebra, "
       "C1 Patterns and Relationships</b> (repeating and growing patterns: the 12-year zodiac cycle) and, for Grades 1-3, "
       "<b>Strand F Financial Literacy, F1 Money</b> (Canadian coins). Connects to Social Studies (communities and heritage).")

ANIMALS = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"]
animal = lambda yr: ANIMALS[(yr - 2020) % 12]
assert animal(2027) == "Goat" and animal(2028) == "Monkey" and animal(2024) == "Dragon"

PA = ["Lunar New Year is a big celebration for many families.", "It starts with a new moon in January or February.",
      "Families clean their homes to sweep away bad luck.", "They hang red decorations. Red means good luck!",
      "Children may get red envelopes with money inside.", "There are parades with lion dances and bright lanterns.",
      "Families share a special meal together."]
PB = ["Lunar New Year is one of the most important celebrations for many families in Canada and around the world. It follows "
      "the <b>lunar calendar</b>, which is based on the cycles of the Moon, so its date changes every year. It always falls in "
      "late January or February. In 2027, Lunar New Year is on Saturday, February 6.",
      "It is celebrated by many communities, including Chinese families, who call it the Spring Festival; Vietnamese families, "
      "who call it <b>Tết</b>; and Korean families, who call it <b>Seollal</b>. Each culture has its own foods and "
      "customs.",
      "Before the new year, families clean their homes to sweep away bad luck and make room for good luck. On New Year's Eve, "
      "relatives gather for a big <b>reunion dinner</b>. Red decorations are everywhere, because red stands for good luck and "
      "happiness. Children and young people often receive red envelopes with money inside.",
      "Many cities in Canada, including Toronto and Vancouver, hold parades with drums, firecrackers and colourful lion and "
      "dragon dances. The celebration traditionally lasts 15 days and ends with the <b>Lantern Festival</b>.",
      "In the Chinese zodiac, each year is linked to one of <b>12 animals</b>, in a cycle that repeats every 12 years. 2027 is "
      "the Year of the Goat. In Vietnam, the zodiac is a little different: the Cat takes the place of the Rabbit."]
MCB = [("Why does the date of Lunar New Year change every year?", ["It follows the lunar calendar.", "It is always on January 1.", "It depends on the weather.", "It is chosen by vote."], 0),
       ("What does the colour red stand for?", ["Danger", "Good luck and happiness", "Winter", "Sadness"], 1),
       ("What do Vietnamese families call Lunar New Year?", ["Seollal", "Tết", "Spring Festival", "Lantern Festival"], 1),
       ("How often does the zodiac cycle repeat?", ["Every 7 years", "Every 10 years", "Every 12 years", "Every year"], 2)]
SAB = [("Why do families clean their homes before the new year? Use the text.", "To sweep away bad luck and make room for good luck (paragraph 3)."),
       ("Name two ways Lunar New Year is celebrated in Canada.", "Any two: reunion dinner, red decorations, red envelopes, parades with lion and dragon dances in cities like Toronto and Vancouver, the Lantern Festival.")]
SAA = [("What colour means good luck?", "Red"), ("Draw and write one way families celebrate.", "Answers vary: cleaning, red decorations, red envelopes, lion dances, lanterns, a special meal.")]

ZROWS = list(range(2016, 2032))
ZGIVEN = {2016, 2017, 2018, 2020, 2022, 2024, 2025, 2027, 2028}
ENVS = [[25, 25, 10, 5], [100, 25, 25], [200, 10, 10, 5], [100, 100, 25, 10, 5], [25, 10, 10, 10, 5, 5]]


def read_a(b):
    y = b.header("Happy Lunar New Year!", "Read together  •  K-2")
    c = b.c
    for line in PA:
        c.setFillColor(b.t.light); c.roundRect(M, y - 64, W - 2 * M - 120, 56, 12, stroke=0, fill=1)
        fs = min(19, *[(W - 2 * M - 150) / c.stringWidth(l, "Body", 1) for l in PA])
        c.setFillColor(INK); c.setFont("Body", fs); c.drawString(M + 16, y - 42, line); y -= 70
    lantern(c, W - M - 55, H - 330, 110); lantern(c, W - M - 55, H - 520, 80)
    envelope(c, W - M - 90, 90, 70, 100)


def q_a(b, key):
    y = b.header("Happy Lunar New Year! Questions", "K-2")
    if key: b.key_stamp()
    y = b.question(1, SAA[0][0], y, 1, answer=SAA[0][1] if key else None, st=style(15, 19))
    c = b.c; c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); b.badge(M + 10, y - 8, 2)
    b.para(SAA[1][0], M + 28, y, W - 2 * M - 28, style(15, 19))
    c.roundRect(M, y - 330, W - 2 * M, 300, 14)
    if key: b.para(f'<font color="#D62828">{SAA[1][1]}</font>', M + 14, y - 40, W - 2 * M - 28, style(11, 14))
    b.primary_lines(M, y - 360, W - 2 * M, 40); b.primary_lines(M, y - 430, W - 2 * M, 40)


def q_b(b, key):
    y = b.header("Lunar New Year: Questions", "Grades 3-6")
    if key: b.key_stamp()
    for i, (q, o, a) in enumerate(MCB, 1):
        y = mc_block(b, i, q, o, y, a if key else None)
    for j, (q, a) in enumerate(SAB, 5):
        y = b.question(j, q, y, 3, answer=a if key else None)


def zodiac(b, key):
    y = b.header("The Zodiac Cycle", "Patterns  •  Grades 2-6")
    if key: b.key_stamp()
    c = b.c
    y = b.para("The 12 animals always come in the same order: " + ", ".join(ANIMALS) + ". Fill in the missing animals.",
               M, y, W - 2 * M, style(12, 16)) - 10
    cw, ch = (W - 2 * M) / 4, 40
    for i, yr in enumerate(ZROWS):
        r, k = divmod(i, 4); x, yy = M + k * cw, y - r * (ch + 8)
        c.setFillColor(b.t.primary); c.roundRect(x + 4, yy - ch, 54, ch, 6, stroke=0, fill=1)
        c.setFillColor(white); c.setFont("BodyB", 13); c.drawCentredString(x + 31, yy - ch / 2 - 5, str(yr))
        c.setStrokeColor(b.t.primary); c.setFillColor(white); c.roundRect(x + 60, yy - ch, cw - 68, ch, 6, fill=1)
        if yr in ZGIVEN or key:
            c.setFillColor(INK if yr in ZGIVEN else KEYRED); c.setFont("BodyB", 13); c.drawCentredString(x + 60 + (cw - 68) / 2, yy - ch / 2 - 5, animal(yr))
    y -= 4 * (ch + 8) + 16
    qs = [("2027 is the Year of the Goat. What animal will 2039 be? Explain how you know.", "Goat: the cycle repeats every 12 years, and 2027 + 12 = 2039."),
          ("What year after 2024 will be the next Year of the Dragon?", "2036 (2024 + 12)."),
          ("Find the animal for the year you were born. (Remember: if your birthday is in January or early February, check the exact Lunar New Year date for that year!)", "Answers vary."),
          ("Describe the pattern rule for the zodiac cycle.", "It is a repeating pattern of 12 animals; each animal returns every 12 years.")]
    for i, (q, a) in enumerate(qs, 1):
        y = b.question(i, q, y, 2, answer=a if key else None)


def money(cents):
    return f"{cents}¢" if cents < 100 else f"${cents / 100:.2f}"


def envelopes(b, key):
    y = b.header("Red Envelope Math", "Canadian coins  •  Grades 1-3")
    if key: b.key_stamp()
    c = b.c
    b.para("Count the coins in each red envelope. Write the total.", M, y, W - 2 * M, style(13, 17))
    y -= 34
    for i, coins in enumerate(ENVS):
        yy = y - i * 92
        envelope(c, M, yy - 80, 58, 78)
        for j, v in enumerate(coins): coin(c, M + 96 + j * min(64, 300 / len(coins)), yy - 40, v, 24)
        c.setStrokeColor(INK); c.setLineWidth(1.2); c.roundRect(W - M - 110, yy - 60, 110, 40, 8)
        c.setFillColor(GREY); c.setFont("Body", 9); c.drawString(W - M - 106, yy - 16, "total")
        if key: c.setFillColor(KEYRED); c.setFont("BodyB", 16); c.drawCentredString(W - M - 55, yy - 46, money(sum(coins)))
    y -= 5 * 92 + 10
    b.question(6, "Which envelope has the most money? How much more does it have than envelope 1?", y, 1,
               answer=f"Envelope 4 ({money(sum(ENVS[3]))}); {money(sum(ENVS[3]) - sum(ENVS[0]))} more than envelope 1 ({money(sum(ENVS[0]))})." if key else None)


def lantern_craft(b):
    y = b.header("Paper Lantern Craft", "Colour, cut, fold and roll", name=False)
    c = b.c
    steps = ["Colour and decorate the lantern sheet below.", "Cut off the handle strip along the dashed line.",
             "Fold the sheet in half the long way (decorated side out).", "Cut along each line from the fold, stopping at the top border.",
             "Unfold, roll into a tube and tape the edges. Tape the handle strip to the top."]
    for i, s in enumerate(steps, 1):
        b.badge(M + 10, y - 8, i, r=9); y = b.para(s, M + 26, y, W - 2 * M - 26, style(11.5, 15)) - 4
    y -= 10; x0, w = M, W - 2 * M
    c.setDash(5, 4); c.setStrokeColor(GREY); c.rect(x0, y - 36, w, 30); c.setDash()
    c.setFillColor(GREY); c.setFont("Body", 9); c.drawString(x0 + 8, y - 24, "handle strip")
    top = y - 50; hgt = top - 70
    c.setStrokeColor(RED); c.setLineWidth(3); c.rect(x0, 70, w, hgt)
    c.setStrokeColor(GOLD); c.setLineWidth(10); c.line(x0, top - 20, x0 + w, top - 20); c.line(x0, 90, x0 + w, 90)
    c.setStrokeColor(INK); c.setLineWidth(1)
    for k in range(1, 16):
        xx = x0 + k * w / 16; c.line(xx, 110, xx, top - 40)
    c.setFillColor(GREY); c.setFont("Body", 9); c.drawCentredString(W / 2, (top + 70) / 2, "")


def art(b, x, y, w, h):
    c = b.c
    c.setFillColor(HexColor("#450A0A")); c.roundRect(x, y, w, h, 22, stroke=0, fill=1)
    lantern(c, x + 80, y + 30, 170); lantern(c, x + w - 80, y + 30, 170); lantern(c, x + w / 2, y + 90, 110)
    envelope(c, x + w / 2 - 60, y + 22, 50, 66); envelope(c, x + w / 2 + 10, y + 22, 50, 66)


def build(b):
    b.cover(["2 reading levels", "zodiac patterns", "red envelope math", "Ontario aligned"])
    b.guide("Explore Lunar New Year with activities for every level: a shared reading page for K-2, an informational passage "
            "for Grades 3-6 (including Tết and Seollal), zodiac patterning, red-envelope money math with Canadian coins, "
            "and a paper lantern craft.",
            [("ra", "Happy Lunar New Year! (K-2 shared reading)"), ("qa", "K-2 questions (draw and write)"),
             ("rb", "Lunar New Year (Grades 3-6 passage)"), ("qb", "Grades 3-6 questions"), ("zod", "The Zodiac Cycle (patterns)"),
             ("env", "Red Envelope Math (Canadian coins)"), ("lan", "Paper Lantern Craft"), ("keys", "Answer keys"), ("terms", "Terms of use")],
            [("Respectful teaching", "Lunar New Year is celebrated in many cultures in different ways. Invite students who "
              "celebrate to share their family's traditions if they wish."),
             ("2027 date", "Lunar New Year 2027 is on Saturday, February 6 (Year of the Goat). Celebrations traditionally "
              "last 15 days, ending with the Lantern Festival.")], ONT)
    b.page("ra"); read_a(b)
    b.page("qa"); q_a(b, False)
    b.page("rb"); passage(b, "Lunar New Year", "Read  •  Grades 3-6", PB, 12.4, 18.6)
    b.page("qb"); q_b(b, False)
    b.page("zod"); zodiac(b, False)
    b.page("env"); envelopes(b, False)
    b.page("lan", footer=False); lantern_craft(b)
    b.page("keys"); q_a(b, True)
    b.page("keys"); q_b(b, True)
    b.page("keys"); zodiac(b, True)
    b.page("keys"); envelopes(b, True)
    b.terms()


LISTING = dict(
    tpt_title="Lunar New Year 2027 Activities | Reading, Zodiac Patterns, Red Envelope Money Math | K-6 | Ontario",
    price="$4.00. Range $3.50 to $4.50.", grades="Kindergarten-6th", subjects="Reading, Math, Social Studies", type="Activities, Reading Passages, Crafts",
    description="Lunar New Year activities for K-6, aligned to the Ontario curriculum and updated for 2027 (Saturday, February "
                "6: Year of the Goat).\n\nIncluded: Happy Lunar New Year! shared reading for K-2 with draw-and-write "
                "questions; an informational passage for Grades 3-6 (Spring Festival, Tết, Seollal, reunion dinner, red "
                "envelopes, Lantern Festival, celebrations in Toronto and Vancouver) with questions; The Zodiac Cycle "
                "patterning activity; Red Envelope Math with Canadian coins; a Paper Lantern Craft; answer keys; and a teacher "
                "guide.\n\nOntario Language (2023) Strands A and C; Math (2020) C1 Patterns and F1 Money.",
    keywords=["Lunar New Year", "Chinese New Year", "Year of the Goat", "Tet", "zodiac", "patterns", "Canadian money", "Ontario",
              "February", "no prep"])

if __name__ == "__main__":
    b = Book("Lunar-New-Year-K-6-Ontario", "Lunar New Year", "Reading, Patterns & Red Envelope Math", "K - Grade 6", "lunar", art,
             ribbon="ONTARIO CURRICULUM")
    run(build, b, inside=[3, 5, 7, 8, 9, 6], feature=7, feature_line=("Year of the Goat 2027", "READING • PATTERNS • MONEY"),
        key_page=13, preview=[1, 2, 3, 5, 7, 8], listing=LISTING)
