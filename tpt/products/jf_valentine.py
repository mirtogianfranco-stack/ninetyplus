"""Valentine's Day & Kindness (Grades 1-3, Ontario). 24 math task cards (Canadian coins, word problems, heart arrays),
recording sheet, roll & graph, kindness cards, friendly letter, keys."""
import os, random, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from kit import Book, run, style, W, H, M, INK, GREY, KEYRED
from kit.janfeb import heart, coin, confetti, PINK, RED, GOLD, PURPLE
from reportlab.lib.colors import white, HexColor

R = random.Random(214)
ONT = ("Ontario Mathematics Curriculum (2020), Grades 1-3: <b>Strand F Financial Literacy, F1 Money</b> (identifying "
       "Canadian coins and representing amounts of money), <b>Strand B Number, B2 Operations</b> (addition, subtraction, and "
       "early multiplication with arrays), <b>Strand D Data, D1</b> (collecting and displaying data) and <b>Strand A</b> "
       "(social-emotional learning skills). Ontario Language (2023) <b>Strand D</b> (writing a friendly letter).")


def money(c):
    return f"{c}¢" if c < 100 else f"${c / 100:.2f}"


CARDS = []
for _ in range(8):  # coins
    n = R.randint(3, 6); cs = sorted((R.choice([5, 10, 25, 25, 100, 200]) for _ in range(n)), reverse=True)
    while sum(cs) > 300: cs = cs[1:]
    CARDS.append(("Coins", "How much money is in the valentine envelope?", cs, money(sum(cs))))
WORDS = [("Mia made 24 valentines. She gave away 15. How many does she have left?", "9 valentines"),
         ("Our class has 18 heart stickers and 27 star stickers. How many stickers in all?", "45 stickers"),
         ("Leo baked 36 heart cookies. His family ate 12. How many cookies are left?", "24 cookies"),
         ("There are 45 pink hearts and 38 red hearts on the wall. How many more pink hearts are there?", "7 more"),
         ("Ava has 50 cents. A heart pencil costs 35 cents. How much will she have left?", "15¢"),
         ("The class wrote 29 kindness notes on Monday and 33 on Tuesday. How many notes in all?", "62 notes"),
         ("Sam needs 100 hearts for the hallway. He has cut out 64. How many more does he need?", "36 more"),
         ("A box holds 8 cupcakes. There are 3 boxes. How many cupcakes are there?", "24 cupcakes")]
CARDS += [("Word problem", q, None, a) for q, a in WORDS]
for _ in range(8):  # arrays
    r, k = R.randint(2, 5), R.randint(2, 5)
    CARDS.append(("Array", "How many hearts? Write a number sentence.", (r, k), f"{r} × {k} = {r * k}  (or {' + '.join([str(k)] * r)})"))
R.shuffle(CARDS)


def card(b, i, x, y, w, h):
    c = b.c; kind, q, data, _ = CARDS[i]
    c.setDash(5, 4); c.setStrokeColor(GREY); c.rect(x, y - h, w, h); c.setDash()
    c.setFillColor(b.t.light); c.roundRect(x + 10, y - h + 10, w - 20, h - 20, 14, stroke=0, fill=1)
    heart(c, x + 38, y - 38, 40, b.t.primary); c.setFillColor(white); c.setFont("BodyB", 13); c.drawCentredString(x + 38, y - 42, str(i + 1))
    c.setFillColor(b.t.primary); c.setFont("BodyB", 10.5); c.drawRightString(x + w - 22, y - 36, kind.upper())
    b.para(q, x + 24, y - 66, w - 48, style(13.5, 18))
    if kind == "Word problem":
        c.setStrokeColor(GREY); c.setLineWidth(1); c.setDash(4, 3); c.roundRect(x + 24, y - h + 70, w - 48, h - 200, 10); c.setDash()
        c.setFillColor(GREY); c.setFont("Body", 9.5); c.drawString(x + 32, y - 146, "Show your thinking")
        c.setFillColor(INK); c.setFont("BodyB", 12); c.drawString(x + 24, y - h + 36, "Answer: ____________________")
    if kind == "Coins":
        for j, v in enumerate(data):
            coin(c, x + 60 + (j % 3) * 88, y - 160 - (j // 3) * 84, v, 36)
    elif kind == "Array":
        rr, kk = data; s = min(36, (w - 60) / kk, 150 / rr)
        for a in range(rr):
            for bb in range(kk):
                heart(c, x + w / 2 - (kk - 1) * s / 2 + bb * s, y - 130 - a * s, s * .8, RED)


def cards_pages(b):
    w, h = (W - 60) / 2, (H - 60) / 2
    for s in range(0, 24, 4):
        b.page("cards", footer=False)
        for k in range(4):
            r, col = divmod(k, 2); card(b, s + k, 30 + col * w, H - 30 - r * h, w, h)


def recording(b, key):
    y = b.header("Task Card Recording Sheet", "Valentine's math")
    if key: b.key_stamp()
    c = b.c; cw, ch = (W - 2 * M) / 3, 74
    for i in range(24):
        r, k = divmod(i, 3); x, yy = M + k * cw, y - r * ch
        c.setStrokeColor(b.t.primary); c.setLineWidth(1.2); c.roundRect(x + 3, yy - ch + 3, cw - 6, ch - 6, 8)
        b.badge(x + 18, yy - 18, i + 1, r=10, fill=b.t.primary)
        if key:
            b.para(f'<font color="#D62828"><b>{CARDS[i][3]}</b></font>', x + 34, yy - 30, cw - 44, style(10.5, 13))


def roll_graph(b):
    y = b.header("Roll & Graph", "Collect data")
    b.para("Roll a die 20 times. Each time, colour one box in the column for the number you rolled. Then answer the questions.",
           M, y, W - 2 * M, style(13, 17))
    c = b.c; gx, gw, rows, top = M + 20, W - 2 * M - 40, 10, y - 50
    cw, ch = gw / 6, 34; cols = [RED, PINK, PURPLE, GOLD, HexColor("#F97316"), HexColor("#14B8A6")]
    for k in range(6):
        for r in range(rows):
            c.setStrokeColor(INK); c.setLineWidth(.8); c.setFillColor(white); c.rect(gx + k * cw, top - (r + 1) * ch, cw, ch, fill=1)
        heart(c, gx + k * cw + cw / 2, top - rows * ch - 30, 40, cols[k])
        c.setFillColor(white); c.setFont("BodyB", 16); c.drawCentredString(gx + k * cw + cw / 2, top - rows * ch - 36, str(k + 1))
    y = top - rows * ch - 70
    for i, q in enumerate(["Which number did you roll the most? How many times?", "Which number did you roll the least?",
                           "Write a sentence comparing two of the numbers."], 1):
        y = b.question(i, q, y, 1)


KIND = ["You make me smile because...", "Thank you for...", "You are a great friend because...", "I like it when you...",
        "You are really good at...", "You helped me when...", "I'm glad you're in our class!", "You are kind because..."]


def kindness(b):
    y = b.header("Kindness Cards", "Cut, write and share", name=False)
    c = b.c; cw, ch = (W - 2 * M) / 2, (y - 60) / 4
    for i, t in enumerate(KIND):
        r, k = divmod(i, 2); x, yy = M + k * cw, y - r * ch
        c.setDash(5, 4); c.setStrokeColor(GREY); c.rect(x, yy - ch, cw, ch); c.setDash()
        heart(c, x + 28, yy - 26, 26, b.t.primary)
        c.setFillColor(INK); c.setFont("BodyB", 12.5); c.drawString(x + 48, yy - 30, t)
        c.setStrokeColor(GREY); c.setLineWidth(.6)
        for j in range(3): c.line(x + 14, yy - 60 - j * 24, x + cw - 14, yy - 60 - j * 24)
        c.setFillColor(GREY); c.setFont("Body", 9); c.drawString(x + 14, yy - ch + 10, "To: ____________   From: ____________")


def letter(b):
    y = b.header("A Friendly Letter", "Write to someone you appreciate")
    c = b.c
    parts = [("date", W - M - 150, 26), ("greeting", M, 26), ("body", M, 180), ("closing", W - M - 200, 26), ("signature", W - M - 200, 26)]
    labels = {"date": "Date: ______________", "greeting": "Dear _______________________,", "closing": "Your friend,", "signature": "______________________"}
    y -= 6
    for name, x, hgt in parts:
        c.setFillColor(b.t.primary); c.setFont("BodyB", 9); c.drawString(x, y + 4, name.upper())
        if name == "body":
            y = b.rule_lines(M, y, W - 2 * M, 9, 28) - 22
        else:
            c.setFillColor(INK); c.setFont("Body", 14); c.drawString(x, y - 18, labels[name]); y -= hgt + 22
    heart(c, M + 20, 70, 30, b.t.primary); heart(c, W - M - 20, 70, 30, b.t.primary)


def art(b, x, y, w, h):
    c = b.c
    c.setFillColor(HexColor("#500724")); c.roundRect(x, y, w, h, 22, stroke=0, fill=1)
    for hx, hy, s, col in [(x + 90, y + 140, 110, RED), (x + 190, y + 80, 70, PINK), (x + w - 100, y + 130, 100, PINK), (x + w - 200, y + 70, 60, GOLD)]:
        heart(c, hx, hy, s, col)
    for j, v in enumerate([25, 100, 200, 10]): coin(c, x + w / 2 - 75 + j * 50, y + h / 2 + 10, v, 22)
    c.setFillColor(white); c.setFont("Fredoka", 24); c.drawCentredString(x + w / 2, y + h - 42, "Kindness counts!")


def build(b):
    b.cover(["24 task cards", "Canadian coins", "kindness cards", "Ontario aligned"])
    b.guide("Valentine's Day activities that put kindness first. Students practise Canadian money, addition and subtraction, and "
            "early multiplication with 24 task cards. They also collect data with Roll & Graph, write kindness cards for "
            "classmates, and write a friendly letter. The theme is friendship and kindness, so it works for every classroom.",
            [("cards", "24 task cards (coins, word problems, heart arrays)"), ("rec", "Recording sheet"), ("roll", "Roll & Graph"),
             ("kind", "Kindness Cards (8)"), ("let", "A Friendly Letter"), ("keys", "Answer key"), ("terms", "Terms of use")],
            [("Task card ideas", "Scoot, centres, a hallway hunt, or partner check. Cards 1-24 mix three skills, so every set "
              "of 4 practises more than one skill."),
             ("Canadian coins", "Coins shown are 5¢, 10¢, 25¢, $1 and $2 (no pennies, which Canada stopped "
              "distributing in 2013). Amounts are written to match Ontario's Financial Literacy expectations.")], ONT)
    cards_pages(b)
    b.page("rec"); recording(b, False)
    b.page("roll"); roll_graph(b)
    b.page("kind", footer=False); kindness(b)
    b.page("let"); letter(b)
    b.page("keys"); recording(b, True)
    b.terms()


LISTING = dict(
    tpt_title="Valentine's Day Math Task Cards & Kindness Activities | Canadian Money | Grades 1-3 | Ontario",
    price="$3.50. Range $3 to $4.", grades="1st, 2nd, 3rd", subjects="Math, Writing, Valentine's Day", type="Task Cards, Activities",
    description="Valentine's Day activities that put kindness first, aligned to the Ontario curriculum.\n\nIncluded: 24 math "
                "task cards (counting Canadian coins, addition and subtraction word problems, and heart arrays for early "
                "multiplication), a recording sheet and answer key, Roll & Graph data collection, 8 Kindness Cards to write "
                "and share, a Friendly Letter template, and a teacher guide.\n\nOntario Math (2020) F1 Money, B2 Operations, "
                "D1 Data and Strand A; Language (2023) Strand D. Canadian coins only (5¢, 10¢, 25¢, $1, $2).",
    keywords=["Valentine's Day math", "task cards", "Canadian money", "counting coins", "kindness", "grade 2 math", "Ontario math",
              "friendly letter", "February", "no prep"])

if __name__ == "__main__":
    b = Book("Valentines-Day-Kindness-Grades-1-3-Ontario", "Valentine's & Kindness", "Math Task Cards, Graphing & Writing", "Grades 1-3",
             "valentine", art, ribbon="ONTARIO CURRICULUM")
    run(build, b, inside=[3, 4, 9, 10, 11, 12], feature=3, feature_line=("Kindness counts!", "TASK CARDS • CANADIAN COINS"),
        key_page=13, preview=[1, 2, 3, 9, 11], listing=LISTING)
