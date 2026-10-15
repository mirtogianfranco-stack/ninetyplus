"""Soccer Stats Math pack (Grades 5-6) - TPT product builder.
All data is fictional. Answers are computed from the same data the worksheets print."""
import os
from statistics import mean, median, mode
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(HERE), "out")
os.makedirs(OUT, exist_ok=True)

STORE = "North Star Resources"          # change to your TPT store name
TITLE = "Soccer Stats Math"
SUB = "Decimals, Percents, Averages & Graphs"

pdfmetrics.registerFont(TTFont("Anton", os.path.join(os.path.dirname(HERE), "kit/fonts/anton-400.ttf")))
pdfmetrics.registerFont(TTFont("Body", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("BodyB", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))

GREEN, DARK, ORANGE = HexColor("#1F7A3A"), HexColor("#14213D"), HexColor("#F59E0B")
GRASS, GREY, RED = HexColor("#E8F5E9"), HexColor("#9CA3AF"), HexColor("#C0392B")
W, H = letter
M = 50

# ---------------- data (fictional league, 12 games each) ----------------
TEAMS = [  # name, W, D, L, GF, GA, shots, on target
    ("Riverside Rovers", 9, 2, 1, 28, 10, 160, 80),
    ("Harbor City FC", 7, 1, 4, 24, 14, 150, 60),
    ("Northgate United", 6, 4, 2, 20, 13, 140, 63),
    ("Iron Bridge Town", 4, 4, 4, 15, 16, 125, 50),
    ("Maple Valley Athletic", 4, 3, 5, 18, 17, 120, 42),
    ("Coastline Wanderers", 3, 3, 6, 13, 20, 110, 33),
    ("Summit Rangers", 2, 4, 6, 11, 21, 100, 32),
    ("Oakwood Albion", 1, 3, 8, 9, 27, 90, 27),
]
T = {t[0]: dict(zip("W D L GF GA SH ON".split(), t[1:])) for t in TEAMS}
for n, d in T.items():
    d["P"] = d["W"] * 3 + d["D"]
    d["GD"] = d["GF"] - d["GA"]
    assert d["W"] + d["D"] + d["L"] == 12, n
assert sum(d["W"] for d in T.values()) == sum(d["L"] for d in T.values())
assert sum(d["GF"] for d in T.values()) == sum(d["GA"] for d in T.values())
pts = [T[n]["P"] for n, *_ in TEAMS]
assert pts == sorted(pts, reverse=True), pts

PLAYERS = [("A. Silva", 8), ("J. Okafor", 5), ("M. Chen", 4), ("L. Rossi", 3), ("D. Novak", 3),
           ("S. Park", 2), ("T. Mensah", 1), ("R. Diaz", 1), ("K. Brooks", 1), ("E. Larsen", 0)]
PG = [g for _, g in PLAYERS]
assert sum(PG) == T["Riverside Rovers"]["GF"]


def fmt(x):
    return f"{x:g}" if abs(x - round(x, 2)) < 1e-9 else f"{x:.2f}"


def pct(a, b):
    return 100 * a / b

# ---------------- drawing helpers ----------------
STY = ParagraphStyle("b", fontName="Body", fontSize=11.5, leading=15.5, textColor=DARK)
STY_S = ParagraphStyle("s", parent=STY, fontSize=10, leading=13.5)


def para(c, text, x, y, w, style=STY):
    p = Paragraph(text, style)
    _, h = p.wrap(w, 1000)
    p.drawOn(c, x, y - h)
    return y - h


def footer(c, page):
    c.setFont("Body", 8); c.setFillColor(GREY)
    c.drawString(M, 24, f"© {STORE}  •  {TITLE}  •  For single-classroom use only")
    c.drawRightString(W - M, 24, str(page))


def header(c, title, kicker, name_line=True):
    c.setFillColor(GREEN); c.rect(0, H - 92, W, 92, stroke=0, fill=1)
    # pitch stripes
    c.setFillColor(HexColor("#23873F"))
    for i in range(0, int(W), 60):
        c.rect(i, H - 92, 30, 92, stroke=0, fill=1)
    c.setFillColor(ORANGE); c.rect(0, H - 96, W, 4, stroke=0, fill=1)
    c.setFillColor(white); c.setFont("BodyB", 9)
    c.drawString(M, H - 30, kicker.upper())
    c.setFont("Anton", 30); c.drawString(M, H - 70, title.upper())
    y = H - 125
    if name_line:
        c.setFillColor(DARK); c.setFont("Body", 10.5)
        c.drawString(M, y, "Name ______________________________"); c.drawRightString(W - M, y, "Date ______________")
        y -= 26
    return y


def question(c, n, text, y, lines=2, x=M, w=W - 2 * M):
    c.setFillColor(ORANGE); c.circle(x + 10, y - 8, 10, stroke=0, fill=1)
    c.setFillColor(white); c.setFont("BodyB", 10); c.drawCentredString(x + 10, y - 11.5, str(n))
    y = para(c, text, x + 28, y, w - 28) - 8
    c.setStrokeColor(GREY); c.setLineWidth(0.6)
    for _ in range(lines):
        y -= 20; c.line(x + 28, y, x + w, y)
    return y - 16


def table(c, cols, rows, x, y, widths, rh=22, head_fill=DARK, fs=10):
    c.setFillColor(head_fill); c.rect(x, y - rh, sum(widths), rh, stroke=0, fill=1)
    c.setFillColor(white); c.setFont("BodyB", fs)
    cx = x
    for col, w in zip(cols, widths):
        (c.drawString(cx + 6, y - rh + 7, col) if cx == x else c.drawCentredString(cx + w / 2, y - rh + 7, col))
        cx += w
    y -= rh
    c.setFont("Body", fs)
    for i, r in enumerate(rows):
        if i % 2 == 0:
            c.setFillColor(GRASS); c.rect(x, y - rh, sum(widths), rh, stroke=0, fill=1)
        c.setFillColor(DARK); cx = x
        for j, (v, w) in enumerate(zip(r, widths)):
            (c.drawString(cx + 6, y - rh + 7, str(v)) if j == 0 else c.drawCentredString(cx + w / 2, y - rh + 7, str(v)))
            cx += w
        y -= rh
    c.setStrokeColor(DARK); c.setLineWidth(1)
    c.rect(x, y, sum(widths), rh * (len(rows) + 1), stroke=1, fill=0)
    return y


def ball(c, x, y, r):
    c.setFillColor(white); c.setStrokeColor(DARK); c.setLineWidth(2); c.circle(x, y, r, stroke=1, fill=1)
    c.setFillColor(DARK)
    p = c.beginPath()
    import math
    for k in range(5):
        a = math.radians(90 + 72 * k)
        (p.moveTo if k == 0 else p.lineTo)(x + r * 0.38 * math.cos(a), y + r * 0.38 * math.sin(a))
    p.close(); c.drawPath(p, stroke=0, fill=1)
    for k in range(5):
        a = math.radians(90 + 72 * k)
        c.line(x + r * 0.38 * math.cos(a), y + r * 0.38 * math.sin(a), x + r * math.cos(a), y + r * math.sin(a))

# ---------------- pages ----------------
LEAGUE_COLS = ["Team", "GP", "W", "D", "L", "GF", "GA", "Pts"]
LEAGUE_W = [170, 40, 40, 40, 40, 50, 50, 82]


def cover(c):
    c.setFillColor(GREEN); c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(HexColor("#23873F"))
    for i in range(0, int(H), 80):
        c.rect(0, i, W, 40, stroke=0, fill=1)
    c.setStrokeColor(white); c.setLineWidth(3)
    c.circle(W / 2, H / 2 - 40, 90, stroke=1, fill=0); c.line(0, H / 2 - 40, W, H / 2 - 40)
    c.setFillColor(DARK); c.rect(0, H - 250, W, 190, stroke=0, fill=1)
    c.setFillColor(ORANGE); c.rect(0, H - 254, W, 4, stroke=0, fill=1); c.rect(0, H - 60, W, 4, stroke=0, fill=1)
    c.setFillColor(white); c.setFont("Anton", 62); c.drawCentredString(W / 2, H - 150, TITLE.upper())
    c.setFillColor(ORANGE); c.setFont("BodyB", 17); c.drawCentredString(W / 2, H - 190, SUB.upper())
    c.setFillColor(white); c.setFont("Body", 13); c.drawCentredString(W / 2, H - 222, "Real-world math with a soccer league data set")
    ball(c, W / 2, H / 2 - 40, 55)
    c.setFillColor(ORANGE); c.roundRect(W / 2 - 150, 150, 300, 70, 14, stroke=0, fill=1)
    c.setFillColor(DARK); c.setFont("Anton", 30); c.drawCentredString(W / 2, 185, "GRADES 5-6")
    c.setFont("BodyB", 12); c.drawCentredString(W / 2, 163, "NO PREP  •  PRINT & GO  •  ANSWER KEYS")
    c.setFillColor(white); c.setFont("Body", 10); c.drawCentredString(W / 2, 60, STORE)


def teacher_notes(c):
    y = header(c, "Teacher Guide", "Read me first", name_line=False)
    y = para(c, "<b>What's inside.</b> Students analyze one fictional soccer league, the <i>Valley League</i>, and use "
                "its real-looking data to practice operations with decimals, percents, mean/median/mode, and bar graphs. "
                "Every worksheet uses the same Data Sheet, so students build familiarity and focus on the math.", M, y, W - 2 * M) - 14
    rows = [("Page 3", "Valley League Data Sheet (print 1 per student or project it)"),
            ("Page 4", "Worksheet 1 - Reading the Table & Points"),
            ("Page 5", "Worksheet 2 - Goal Difference & Per-Game Averages"),
            ("Page 6", "Worksheet 3 - Shot Accuracy Percents"),
            ("Page 7", "Worksheet 4 - Mean, Median, Mode & Range (player goals)"),
            ("Page 8", "Worksheet 5 - Build a Bar Graph"),
            ("Page 9", "Challenge - Be the Coach (multi-step word problems)"),
            ("Page 10", "Exit Tickets (4 per page)"),
            ("Pages 11-13", "Answer Keys")]
    y = table(c, ["Page", "Activity"], rows, M, y, [100, W - 2 * M - 100], rh=21) - 22
    y = para(c, "<b>How soccer points work.</b> A win is worth 3 points, a draw (tie) is worth 1 point, and a loss is "
                "worth 0. GP = games played, GF = goals for (scored), GA = goals against (allowed), "
                "Goal Difference = GF - GA.", M, y, W - 2 * M) - 12
    y = para(c, "<b>Ideas for use.</b> Math centers, sub plans, early finishers, a World Cup or season-kickoff theme week, "
                "test prep, or homework. Worksheets 1-3 work well for 5th grade; Worksheets 4-5 and the Challenge stretch "
                "6th graders.", M, y, W - 2 * M) - 12
    y = para(c, "<b>Standards alignment.</b> CCSS 5.NBT.B.7 (decimal operations), 5.NBT.A.4 (rounding decimals), "
                "6.RP.A.3c (percent of a quantity), 6.SP.B.5c (measures of center and variability), "
                "6.SP.B.4 (displaying data), 5.OA / 6.EE (multi-step problem solving).", M, y, W - 2 * M)
    footer(c, 2)


def data_sheet(c):
    y = header(c, "Valley League Data Sheet", "Use this page for every worksheet", name_line=False)
    y = para(c, "Standings after <b>12 games</b>. Win = 3 points, Draw = 1 point, Loss = 0 points.", M, y, W - 2 * M) - 10
    rows = [(n, 12, d["W"], d["D"], d["L"], d["GF"], d["GA"], d["P"]) for n, d in T.items()]
    y = table(c, LEAGUE_COLS, rows, M, y, LEAGUE_W) - 26
    c.setFont("Anton", 16); c.setFillColor(GREEN); c.drawString(M, y, "SHOOTING STATS"); y -= 8
    rows = [(n, d["SH"], d["ON"]) for n, d in T.items()]
    y = table(c, ["Team", "Total Shots", "Shots on Target"], rows, M, y, [200, 156, 156]) - 26
    c.setFont("Anton", 16); c.setFillColor(GREEN); c.drawString(M, y, "RIVERSIDE ROVERS - GOALS BY PLAYER"); y -= 8
    half = [PLAYERS[:5], PLAYERS[5:]]
    for i, part in enumerate(half):
        table(c, ["Player", "Goals"], part, M + i * 262, y, [180, 70], rh=20)
    footer(c, 3)


def ws1(c):
    y = header(c, "Worksheet 1: Reading the Table", "Points & standings")
    y = question(c, 1, "Which team has the <b>most wins</b>? How many?", y, 1)
    y = question(c, 2, "Show how Northgate United earned its points. (Remember: Win = 3, Draw = 1.)", y, 2)
    y = question(c, 3, "How many <b>more points</b> does Riverside Rovers have than Oakwood Albion?", y, 1)
    y = question(c, 4, "Harbor City FC and Northgate United both have 22 points. If ties are broken by "
                       "<b>goal difference</b> (GF - GA), which team ranks higher? Show your work.", y, 2)
    y = question(c, 5, "How many games in the whole league ended in a <b>draw</b>? (Hint: every draw is counted "
                       "by two teams.)", y, 2)
    y = question(c, 6, "Maple Valley has a better goal difference than Iron Bridge, but fewer points. "
                       "Explain how that can happen.", y, 3)
    footer(c, 4)


def ws2(c):
    y = header(c, "Worksheet 2: Per-Game Averages", "Decimals & division")
    y = para(c, "<b>Goals per game</b> = goals ÷ games played. Every team has played <b>12</b> games. "
                "Round to the nearest hundredth when needed.", M, y, W - 2 * M) - 14
    y = question(c, 1, "Harbor City FC scored 24 goals. How many goals per game is that?", y, 1)
    y = question(c, 2, "Maple Valley Athletic scored 18 goals. Find its goals per game.", y, 1)
    y = question(c, 3, "Iron Bridge Town scored 15 goals. Find its goals per game.", y, 1)
    y = question(c, 4, "Oakwood Albion scored 9 goals. Find its goals per game. Is it more or less than 1?", y, 1)
    y = question(c, 5, "Riverside Rovers allowed only 10 goals. Find goals <b>allowed</b> per game, rounded to the "
                       "nearest hundredth.", y, 1)
    y = question(c, 6, "Find the goal difference for every team. Which team has the <b>lowest</b> goal difference?", y, 2)
    y = question(c, 7, "If Maple Valley keeps scoring at the same rate, how many goals will it have after "
                       "<b>20</b> games?", y, 2)
    footer(c, 5)


def ws3(c):
    y = header(c, "Worksheet 3: Shot Accuracy", "Percents")
    y = para(c, "<b>Shot accuracy</b> = shots on target ÷ total shots × 100. Use the Shooting Stats table.",
             M, y, W - 2 * M) - 14
    y = question(c, 1, "What percent of Riverside Rovers' shots were on target?", y, 1)
    y = question(c, 2, "What percent of Harbor City FC's shots were on target?", y, 1)
    y = question(c, 3, "Find the shot accuracy for Coastline Wanderers and Summit Rangers. Which is more accurate?", y, 2)
    y = question(c, 4, "Iron Bridge Town and Harbor City FC have the same shot accuracy. What is it, and how can two "
                       "teams with different numbers of shots have the same percent?", y, 3)
    y = question(c, 5, "Riverside Rovers scored on 28 of their 80 shots on target. What percent of shots on target "
                       "became goals?", y, 1)
    y = question(c, 6, "Rank all 8 teams from <b>most</b> to <b>least</b> accurate.", y, 3)
    footer(c, 6)


def ws4(c):
    y = header(c, "Worksheet 4: Player Goals", "Mean, median, mode & range")
    y = para(c, "Use the <b>Riverside Rovers - Goals by Player</b> table on the Data Sheet (10 players).", M, y, W - 2 * M) - 14
    y = question(c, 1, "List the 10 goal totals in order from least to greatest.", y, 1)
    y = question(c, 2, "Find the <b>mean</b> (average) number of goals per player.", y, 2)
    y = question(c, 3, "Find the <b>median</b>.", y, 1)
    y = question(c, 4, "Find the <b>mode</b>.", y, 1)
    y = question(c, 5, "Find the <b>range</b>.", y, 1)
    y = question(c, 6, "A. Silva's 8 goals is much higher than everyone else. Find the mean <b>without</b> A. Silva "
                       "(round to the nearest hundredth). Did the mean go up or down?", y, 2)
    y = question(c, 7, "Which measure, mean or median, better describes a 'typical' Rovers player? Explain.", y, 2)
    footer(c, 7)


def ws5(c):
    y = header(c, "Worksheet 5: Build a Bar Graph", "Displaying data")
    y = para(c, "Make a bar graph of <b>Goals For (GF)</b> for all 8 teams. Give your graph a title. "
                "The scale counts by 2s.", M, y, W - 2 * M) - 12
    gx, gy, gw, gh = M + 30, y - 330, W - 2 * M - 40, 310
    c.setStrokeColor(HexColor("#D1D5DB")); c.setLineWidth(0.5)
    for k in range(16):
        yy = gy + k * gh / 15; c.line(gx, yy, gx + gw, yy)
        c.setFillColor(DARK); c.setFont("Body", 8); c.drawRightString(gx - 5, yy - 3, str(k * 2))
    for k in range(9):
        c.line(gx + k * gw / 8, gy, gx + k * gw / 8, gy + gh)
    c.setStrokeColor(DARK); c.setLineWidth(1.5); c.line(gx, gy, gx + gw, gy); c.line(gx, gy, gx, gy + gh)
    c.setFont("Body", 7.5)
    for k, n in enumerate(T):
        for j, part in enumerate(n.split(" ", 1)):
            c.drawCentredString(gx + (k + 0.5) * gw / 8, gy - 12 - j * 9, part)
    c.saveState(); c.translate(M - 2, gy + gh / 2); c.rotate(90); c.setFont("BodyB", 9)
    c.drawCentredString(0, 0, "Goals For"); c.restoreState()
    c.setFont("Body", 10); c.drawString(M, gy + gh + 8, "Title: ___________________________________________")
    y = gy - 42
    y = question(c, 1, "How many more goals did the top-scoring team score than the lowest-scoring team?", y, 1)
    y = question(c, 2, "How many goals were scored in the whole league? What is the mean goals per team?", y, 1)
    footer(c, 8)


def challenge(c):
    y = header(c, "Challenge: Be the Coach", "Multi-step word problems")
    y = question(c, 1, "Riverside Rovers have 6 games left. If they win 4 and draw 2, how many total points will they have?", y, 2)
    y = question(c, 2, "Harbor City FC has 6 games left too. Suppose the Rovers win only 3 of their last 6 and lose the rest. "
                       "Could Harbor City still finish with more points than the Rovers? Show your thinking.", y, 3)
    y = question(c, 3, "Iron Bridge Town takes 25 more shots, and 60% of them are on target. What is its new number of "
                       "shots on target, and its new shot accuracy (nearest tenth of a percent)?", y, 2)
    y = question(c, 4, "The Rovers' stadium has 18,500 seats. At the last game it was 92% full. How many fans attended?", y, 1)
    y = question(c, 5, "A midfielder runs 10.4 km every game. How far has she run after all 12 games?", y, 1)
    y = question(c, 6, "The Rovers' goalkeeper faced 40 shots on target and allowed 10 goals. What percent of shots did she save?", y, 1)
    footer(c, 9)


def exit_tickets(c):
    footer(c, 10)
    qs = [("Points", "A team has 5 wins, 3 draws and 4 losses. How many points does it have?"),
          ("Decimals", "A team scored 21 goals in 12 games. Find goals per game."),
          ("Percents", "A team took 80 shots and 36 were on target. What is its shot accuracy?"),
          ("Data", "Find the mean and median: 2, 4, 4, 5, 10")]
    bw, bh = (W - 2 * M - 20) / 2, (H - 100 - 20) / 2
    for i, (k, q) in enumerate(qs):
        x = M + (i % 2) * (bw + 20); y = H - 50 - (i // 2) * (bh + 20)
        c.setDash(5, 4); c.setStrokeColor(GREY); c.rect(x, y - bh, bw, bh); c.setDash()
        c.setFillColor(GREEN); c.rect(x, y - 38, bw, 38, stroke=0, fill=1)
        c.setFillColor(white); c.setFont("Anton", 16); c.drawString(x + 12, y - 26, "EXIT TICKET")
        c.setFont("BodyB", 9); c.drawRightString(x + bw - 12, y - 24, k.upper())
        c.setFillColor(DARK); c.setFont("Body", 9.5); c.drawString(x + 12, y - 58, "Name ____________________")
        para(c, q, x + 12, y - 72, bw - 24, STY_S)
        c.setStrokeColor(GREY)
        for j in range(4):
            c.line(x + 12, y - 150 - j * 24, x + bw - 12, y - 150 - j * 24)


def key_page(c, title, items, page):
    y = header(c, title, "Answer key", name_line=False)
    for head, answers in items:
        c.setFont("Anton", 15); c.setFillColor(GREEN); c.drawString(M, y, head.upper()); y -= 6
        for i, a in enumerate(answers, 1):
            y = para(c, f"<b>{i}.</b> {a}", M + 8, y, W - 2 * M - 8, STY_S) - 5
        y -= 12
    footer(c, page)


def answers():
    r, h, n, mv, ib = (T[k] for k in ["Riverside Rovers", "Harbor City FC", "Northgate United",
                                       "Maple Valley Athletic", "Iron Bridge Town"])
    draws = sum(d["D"] for d in T.values()) // 2
    gd = ", ".join(f"{k.split()[0]} {d['GD']:+d}" for k, d in T.items())
    acc = {k: pct(d["ON"], d["SH"]) for k, d in T.items()}
    rank = ", ".join(f"{k} {fmt(v)}%" for k, v in sorted(acc.items(), key=lambda kv: -kv[1]))
    s = sorted(PG); m_wo = mean(PG[1:])
    gf = [d["GF"] for d in T.values()]
    ib_on, ib_sh = ib["ON"] + 15, ib["SH"] + 25
    k1 = [("Worksheet 1", [
        f"Riverside Rovers, {r['W']} wins.",
        f"{n['W']} wins × 3 = {n['W']*3}; {n['D']} draws × 1 = {n['D']}; {n['W']*3} + {n['D']} = {n['P']} points.",
        f"{r['P']} - {T['Oakwood Albion']['P']} = {r['P'] - T['Oakwood Albion']['P']} points.",
        f"Harbor City: {h['GF']} - {h['GA']} = +{h['GD']}. Northgate: {n['GF']} - {n['GA']} = +{n['GD']}. Harbor City ranks higher.",
        f"Draw column total = {sum(d['D'] for d in T.values())}; each draw is counted twice, so {draws} drawn games.",
        f"Points come only from results. Iron Bridge: {ib['W']}W {ib['D']}D = {ib['P']} pts; Maple Valley: "
        f"{mv['W']}W {mv['D']}D = {mv['P']} pts. Goal difference measures winning and losing margins, so a few big "
        f"wins raise it without adding extra points."]),
        ("Worksheet 2", [
            "24 ÷ 12 = 2 goals per game.", "18 ÷ 12 = 1.5 goals per game.", "15 ÷ 12 = 1.25 goals per game.",
            "9 ÷ 12 = 0.75 goals per game; less than 1.", f"10 ÷ 12 = 0.833... ≈ {10/12:.2f} goals allowed per game.",
            f"{gd}. Lowest: Oakwood Albion ({T['Oakwood Albion']['GD']:+d}).",
            f"1.5 × 20 = {fmt(1.5*20)} goals."])]
    k2 = [("Worksheet 3", [
        f"80 ÷ 160 = 0.5 = {fmt(acc['Riverside Rovers'])}%.",
        f"60 ÷ 150 = 0.4 = {fmt(acc['Harbor City FC'])}%.",
        f"Coastline 33 ÷ 110 = {fmt(acc['Coastline Wanderers'])}%; Summit 32 ÷ 100 = "
        f"{fmt(acc['Summit Rangers'])}%. Summit Rangers is more accurate.",
        f"Both are {fmt(acc['Iron Bridge Town'])}%. A percent compares a part to its whole, so 50 of 125 and 60 of 150 are "
        f"the same ratio (2 out of 5).",
        f"28 ÷ 80 = 0.35 = {fmt(pct(28, 80))}%.",
        f"{rank}. (Coastline and Oakwood tie at 30%.)"]),
        ("Worksheet 4", [
            ", ".join(map(str, s)) + ".", f"Total {sum(PG)} ÷ 10 = {fmt(mean(PG))} goals.",
            f"Middle values {s[4]} and {s[5]}: ({s[4]} + {s[5]}) ÷ 2 = {fmt(median(PG))}.",
            f"{mode(PG)} (appears {PG.count(mode(PG))} times).", f"{max(PG)} - {min(PG)} = {max(PG)-min(PG)}.",
            f"{sum(PG[1:])} ÷ 9 = {m_wo:.2f}. The mean went down (from {fmt(mean(PG))}).",
            f"The median ({fmt(median(PG))}), because the outlier (8) pulls the mean up. Accept well-reasoned answers."])]
    k3 = [("Worksheet 5", [
        f"Bars: " + ", ".join(f"{k.split()[0]} {d['GF']}" for k, d in T.items()) +
        f". Riverside 28 - Oakwood 9 = {max(gf) - min(gf)} more goals.",
        f"Total {sum(gf)} goals; {sum(gf)} ÷ 8 = {fmt(sum(gf)/8)} goals per team."]),
        ("Challenge: Be the Coach", [
            f"{r['P']} + (4 × 3) + (2 × 1) = {r['P'] + 14} points.",
            f"Rovers: {r['P']} + 9 = {r['P'] + 9}. If Harbor wins all 6: {h['P']} + 18 = {h['P'] + 18}, so yes. "
            f"(5 wins + 1 draw = {h['P'] + 16} only ties, so Harbor must win all 6.)",
            f"25 × 0.60 = 15 more on target. {ib['ON']} + 15 = {ib_on} on target out of {ib_sh} shots; "
            f"{ib_on} ÷ {ib_sh} ≈ {pct(ib_on, ib_sh):.1f}%.",
            f"18,500 × 0.92 = {18500*92//100:,} fans.", f"10.4 × 12 = {fmt(10.4*12)} km.",
            f"Saves = 40 - 10 = 30. 30 ÷ 40 = {fmt(pct(30, 40))}%."]),
        ("Exit Tickets", ["Points: 5×3 + 3 = 18 points.", f"Decimals: 21 ÷ 12 = {fmt(21/12)} goals per game.",
                          f"Percents: 36 ÷ 80 = {fmt(pct(36, 80))}%.",
                          f"Data: mean = 25 ÷ 5 = {fmt(mean([2,4,4,5,10]))}; median = {median([2,4,4,5,10])}."])]
    return k1, k2, k3


def terms(c):
    y = header(c, "Terms of Use & Thanks", STORE, name_line=False)
    y = para(c, "<b>Thank you</b> for purchasing this resource! If you and your students enjoyed it, please leave a review "
                "on TPT - you'll earn TPT credits toward future purchases, and it helps other teachers find it.", M, y, W - 2 * M) - 14
    y = para(c, "<b>You may:</b> use this resource in your own classroom; make copies for your students; share it on a "
                "password-protected class site (e.g. Google Classroom) accessible only to your students.", M, y, W - 2 * M) - 10
    y = para(c, "<b>You may not:</b> share it with other teachers or your whole school (please purchase additional "
                "licenses); post it on a public website; sell it or claim it as your own; upload it to AI tools or "
                "file-sharing sites.", M, y, W - 2 * M) - 10
    y = para(c, "All teams, players and statistics in this resource are fictional. Fonts: Anton (SIL Open Font License), "
                "DejaVu Sans (free license).", M, y, W - 2 * M) - 10
    para(c, f"© 2026 {STORE}. All rights reserved.", M, y, W - 2 * M)
    footer(c, 14)


def build():
    path = os.path.join(OUT, "Soccer-Stats-Math-Grades-5-6.pdf")
    c = canvas.Canvas(path, pagesize=letter)
    c.setTitle(f"{TITLE}: {SUB}"); c.setAuthor(STORE)
    k1, k2, k3 = answers()
    for fn in [cover, teacher_notes, data_sheet, ws1, ws2, ws3, ws4, ws5, challenge, exit_tickets,
               lambda c: key_page(c, "Answer Key 1", k1, 11), lambda c: key_page(c, "Answer Key 2", k2, 12),
               lambda c: key_page(c, "Answer Key 3", k3, 13), terms]:
        fn(c); c.showPage()
    c.save()
    print(path)


if __name__ == "__main__":
    build()
