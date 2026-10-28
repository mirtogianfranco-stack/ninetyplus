"""Christmas Coordinate Graphing Mystery Pictures (Grades 5-8, Ontario): read-and-translate warm-up, 3 first-quadrant and
3 four-quadrant mystery pictures, design-your-own, keys."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
from kit import Book, run, style, W, H, M, INK, GREY, KEYRED
from kit.christmas import ornament, gift, candy_cane, bell, star, gingerbread, RED, GREEN, GOLD, DKGREEN
from reportlab.lib.colors import white, HexColor

ONT = ("Ontario Mathematics (2020), <b>Strand E Spatial Sense, E1 Location and Movement</b>: Grade 5 plotting and reading "
       "coordinates in the first quadrant; Grade 6 <b>E1.3</b> plotting and reading coordinates in all four quadrants and "
       "describing the translations that move a point from one coordinate to another. Grades 7-8: review and extension of "
       "the Cartesian plane and transformations.")

# Each picture: list of lines; a line is a list of points (one point = a dot to plot).
PICS = [
 dict(name="Mystery Picture A", ans="Christmas tree", q1=True, lines=[
  [(10, 18), (14, 13), (12, 13), (16, 8), (13, 8), (18, 3), (11, 3), (11, 0), (9, 0), (9, 3), (2, 3), (7, 8), (4, 8), (8, 13), (6, 13), (10, 18)],
  [(10, 20)], [(7, 6)], [(13, 6)], [(10, 10)], [(8, 15)]]),
 dict(name="Mystery Picture B", ans="Wrapped gift", q1=True, lines=[
  [(4, 2), (16, 2), (16, 12), (4, 12), (4, 2)], [(10, 2), (10, 12)], [(4, 7), (16, 7)],
  [(10, 12), (7, 15), (6, 13), (10, 12), (13, 15), (14, 13), (10, 12)]]),
 dict(name="Mystery Picture C", ans="Candy cane", q1=True, lines=[
  [(6, 1), (6, 14), (7, 16), (9, 17), (11, 17), (13, 16), (14, 14), (14, 12), (12, 12), (12, 14), (11, 15), (9, 15), (8, 14), (8, 1), (6, 1)],
  [(6, 3), (8, 5)], [(6, 7), (8, 9)], [(6, 11), (8, 13)], [(10, 15), (10, 17)], [(12, 13), (14, 13)]]),
 dict(name="Mystery Picture D", ans="Star", q1=False, lines=[
  [(0, 10), (2, 4), (9, 3), (4, -1), (6, -8), (0, -4), (-6, -8), (-4, -1), (-9, 3), (-2, 4), (0, 10)],
  [(0, 5), (2, 1), (0, -2), (-2, 1), (0, 5)]]),
 dict(name="Mystery Picture E", ans="Gingerbread person", q1=False, lines=[
  [(-2, 5), (-3, 6), (-3, 8), (-2, 9), (2, 9), (3, 8), (3, 6), (2, 5), (5, 5), (6, 4), (5, 3), (2, 3), (2, -2), (4, -8), (2, -9),
   (0, -4), (-2, -9), (-4, -8), (-2, -2), (-2, 3), (-5, 3), (-6, 4), (-5, 5), (-2, 5)],
  [(-1, 7)], [(1, 7)], [(-1, 6), (1, 6)], [(0, 2)], [(0, 0)]]),
 dict(name="Mystery Picture F", ans="Bell", q1=False, lines=[
  [(-1, 9), (1, 9), (1, 8), (3, 7), (4, 5), (4, 1), (5, -1), (7, -3), (7, -4), (-7, -4), (-7, -3), (-5, -1), (-4, 1), (-4, 5), (-3, 7), (-1, 8), (-1, 9)],
  [(-1, -4), (-1, -6), (1, -6), (1, -4)], [(-5, -1), (5, -1)]]),
]

PTS = {"A": (3, 4), "B": (-5, 2), "C": (-7, -6), "D": (6, -3), "E": (0, 8), "F": (-2, 0), "G": (8, 7), "H": (4, -9)}
TRANS = [("Point A (3, 4) moves 5 units left and 2 units up. Where does it land?", "(−2, 6)"),
         ("Point C (−7, −6) moves 9 units right. Where does it land? Which quadrant is it in now?", "(2, −6), Quadrant IV"),
         ("Describe the translation that moves point B (−5, 2) to point G (8, 7).", "13 units right and 5 units up"),
         ("A point moves 4 units down and 6 units right and lands on D (6, −3). Where did it start?", "(0, 1)")]


def fmt(p):
    return "(" + ", ".join(str(v).replace("-", "−") for v in p) + ")"


def grid(b, x, y, size, q1, key_lines=None, dots=None):
    """Top-left (x, y), square side size."""
    c = b.c; lo, hi = (0, 20) if q1 else (-10, 10); n = hi - lo; u = size / n
    X = lambda v: x + (v - lo) * u
    Y = lambda v: y - size + (v - lo) * u
    c.setStrokeColor(HexColor("#CBD5E1")); c.setLineWidth(.5)
    for k in range(n + 1):
        c.line(x + k * u, y, x + k * u, y - size); c.line(x, y - k * u, x + size, y - k * u)
    c.setStrokeColor(INK); c.setLineWidth(1.4)
    ax, ay = (lo, lo) if q1 else (0, 0)
    c.line(X(lo), Y(ay), X(hi), Y(ay)); c.line(X(ax), Y(lo), X(ax), Y(hi))
    c.setFont("Body", 7.5); c.setFillColor(INK)
    for v in range(lo, hi + 1):
        if v == 0 and not q1: continue
        if q1 or v % 2 == 0:
            c.drawCentredString(X(v), Y(ay) - 10, str(v).replace("-", "−"))
            if v != lo or not q1: c.drawRightString(X(ax) - 3, Y(v) - 2.5, str(v).replace("-", "−"))
    if q1: c.drawRightString(X(0) - 3, Y(0) - 10, "0")
    c.setFont("BodyB", 10); c.drawString(X(hi) + 4, Y(ay) - 3, "x"); c.drawCentredString(X(ax), Y(hi) + 5, "y")
    if not q1:
        c.setFont("BodyB", 9); c.setFillColor(GREY)
        for lab, (qx, qy) in [("II", (-9, 9)), ("I", (9, 9)), ("III", (-9, -9)), ("IV", (9, -9))]:
            c.drawCentredString(X(qx), Y(qy) - 3, lab)
    if key_lines:
        c.setStrokeColor(KEYRED); c.setFillColor(KEYRED); c.setLineWidth(2.2); c.setLineJoin(1); c.setLineCap(1)
        for ln in key_lines:
            if len(ln) == 1: c.circle(X(ln[0][0]), Y(ln[0][1]), 3.2, stroke=0, fill=1); continue
            p = c.beginPath(); p.moveTo(X(ln[0][0]), Y(ln[0][1]))
            for px, py in ln[1:]: p.lineTo(X(px), Y(py))
            c.drawPath(p)
    if dots:
        for lab, (px, py) in dots.items():
            c.setFillColor(RED); c.circle(X(px), Y(py), 3.5, stroke=0, fill=1)
            c.setFillColor(INK); c.setFont("BodyB", 10); c.drawString(X(px) + 5, Y(py) + 4, lab)
    return X, Y


def point_list(b, lines, x, y, w):
    c = b.c; row = 14.2; yy = y
    c.setFillColor(b.t.light); c.setStrokeColor(b.t.primary); c.setLineWidth(1.2)
    for i, ln in enumerate(lines, 1):
        label = f"Line {i}" if len(ln) > 1 else f"Dot {i}"
        c.setFillColor(b.t.primary); c.setFont("BodyB", 10); c.drawString(x, yy, label + (": start" if len(ln) > 1 else ": plot one point")); yy -= row
        c.setFillColor(INK); c.setFont("Body", 10.5)
        for k in range(0, len(ln), 2):
            c.drawString(x + 8, yy, "   ".join(fmt(p) for p in ln[k:k + 2])); yy -= row
        if len(ln) > 1:
            c.setFillColor(GREY); c.setFont("Body", 8.5); c.drawString(x + 8, yy + 2, "lift your pencil"); yy -= row * .8
        yy -= 3
    assert yy > 46, ("point list too long", yy)


def mystery(b, pic, key=False):
    b.page("keys" if key else ("q1" if pic["q1"] else "q4"))
    title = pic["name"] + (f": {pic['ans']}" if key else "")
    y = b.header(title, ("First quadrant" if pic["q1"] else "All four quadrants") + "  •  Plot, connect, colour", name=not key)
    if key: b.key_stamp()
    y = b.para("Plot the points in order and connect them with a ruler. When you see <b>lift your pencil</b>, start a new line. "
               "Plot each <b>dot</b> on its own. Then colour your picture!", M, y, W - 2 * M, style(11.5, 15)) - 8
    size = 396; gx = W - M - size - 4
    grid(b, gx, y - 10, size, pic["q1"], pic["lines"] if key else None)
    point_list(b, pic["lines"], M, y - 10, gx - M - 30)
    c = b.c; c.setFillColor(INK); c.setFont("BodyB", 13)
    c.drawString(gx, y - size - 40, "My picture is a: " + ("" if key else "_______________________"))
    if key: c.setFillColor(KEYRED); c.drawString(gx + 116, y - size - 40, pic["ans"]); c.setFillColor(INK)


def warmup(b, key=False):
    b.page("keys" if key else "warm")
    y = b.header("Ornament Coordinates", "Warm-up: read and translate", name=not key)
    if key: b.key_stamp()
    y = b.para("Write the coordinates of each ornament. Then answer the translation questions. Remember: (x, y) means "
               "across first, then up or down.", M, y, W - 2 * M, style(11.5, 15)) - 8
    size = 300; c = b.c
    grid(b, M + 16, y - 6, size, False, dots=PTS)
    tx = M + size + 50; ty = y - 6
    c.setFillColor(b.t.dark); c.setFont("BodyB", 11)
    for i, (lab, p) in enumerate(PTS.items()):
        yy = ty - i * 36
        c.setFillColor(INK); c.setFont("BodyB", 13); c.drawString(tx, yy - 16, f"{lab}  ( ______ , ______ )")
        if key: c.setFillColor(KEYRED); c.drawString(tx + 34, yy - 14, str(p[0]).replace("-", "−")); c.drawString(tx + 96, yy - 14, str(p[1]).replace("-", "−"))
    y -= size + 36
    for i, (q, a) in enumerate(TRANS, 1):
        y = b.question(i, q, y, 1, answer=a if key else None, st=style(11.5, 15)) + 2


def design(b):
    b.page("design")
    y = b.header("Design Your Own", "Create a coordinate mystery picture")
    y = b.para("Draw a simple winter or holiday picture on the grid using only straight lines. Then write the coordinates "
               "in order so a classmate can recreate it. Challenge: use all four quadrants!", M, y, W - 2 * M, style(11.5, 15)) - 8
    size = 396; gx = W - M - size - 4
    grid(b, gx, y - 10, size, False)
    b.rule_lines(M, y - 10, gx - M - 30, 22, 20)
    b.c.setFillColor(INK); b.c.setFont("BodyB", 13); b.c.drawString(gx, y - size - 40, "Title: _______________________")


def cover_art(b, x, y, w, h):
    c = b.c
    c.setFillColor(DKGREEN); c.roundRect(x, y, w, h, 22, stroke=0, fill=1)
    gx, gy, s = x + 30, y + h - 22, h - 44
    c.setFillColor(white); c.rect(gx, gy - s, s, s, stroke=0, fill=1)
    u = s / 20; c.setStrokeColor(HexColor("#CBD5E1")); c.setLineWidth(.4)
    for k in range(21): c.line(gx + k * u, gy, gx + k * u, gy - s); c.line(gx, gy - k * u, gx + s, gy - k * u)
    c.setStrokeColor(RED); c.setLineWidth(2)
    pts = PICS[0]["lines"][0]; p = c.beginPath(); p.moveTo(gx + pts[0][0] * u, gy - s + pts[0][1] * u)
    for px, py in pts[1:]: p.lineTo(gx + px * u, gy - s + py * u)
    c.drawPath(p)
    star(c, x + w - 170, y + 130, 60); gingerbread(c, x + w - 70, y + 24, 110); gift(c, x + w - 210, y + 22, 60, RED, GOLD)


def build(b):
    b.cover(["6 mystery pictures", "4 quadrants", "keys", "Ontario aligned"])
    b.guide("Six Christmas mystery pictures on the Cartesian plane: three in the first quadrant (Grade 5 and review) and three "
            "across all four quadrants (Grade 6 and up). A read-and-translate warm-up comes first, and students finish by "
            "designing their own picture for a classmate.",
            [("warm", "Warm-up: Ornament Coordinates (reading and translations)"), ("q1", "Mystery Pictures A-C (first quadrant)"),
             ("q4", "Mystery Pictures D-F (four quadrants)"), ("design", "Design Your Own"), ("keys", "Answer keys"), ("terms", "Terms of use")],
            [("Tips", "Students should use a sharp pencil and a ruler, and check each point before connecting it. "
              "Picture answers are in the keys, so keep them out of sight until students finish!"),
             ("Differentiate", "Grade 5: pictures A-C. Grade 6: the warm-up plus D-F. Grades 7-8: all six, then Design Your Own "
              "with a translation or reflection of their picture."),
             ("Early finishers", "Swap Design Your Own pages with a partner.")], ONT)
    warmup(b)
    for p in PICS: mystery(b, p)
    design(b)
    warmup(b, True)
    for p in PICS: mystery(b, p, True)
    b.terms()


LISTING = dict(
    tpt_title="Christmas Coordinate Graphing Mystery Pictures | 1st & 4 Quadrants | Grades 5-8 | Ontario",
    price="$4.00. Range $3.50 to $4.50.", grades="5th, 6th, 7th, 8th", subjects="Math, Geometry, Christmas", type="Worksheets, Activities",
    description="""
Six **Christmas coordinate graphing mystery pictures**: plot the points, connect the lines, and reveal the picture!

**What's included:**
- Warm-up: Ornament Coordinates (read 8 points in four quadrants, plus 4 translation questions)
- 3 first-quadrant mystery pictures (Grade 5 and review)
- 3 four-quadrant mystery pictures (Grade 6 and up)
- Design Your Own coordinate picture
- Answer keys with each completed picture, and a teacher guide

**Ontario curriculum:** Mathematics (2020) Strand E Spatial Sense, E1 Location and Movement (including Grade 6 E1.3: all
four quadrants and translations).
""",
    keywords=["coordinate graphing", "mystery picture", "christmas math", "four quadrants", "cartesian plane", "grade 6 math",
              "grade 5", "Ontario math", "December math", "early finishers"])

if __name__ == "__main__":
    b = Book("Christmas-Coordinate-Graphing-Grades-5-8-Ontario", "Christmas Coordinates", "Coordinate Graphing Mystery Pictures",
             "Grades 5-8", "elf", cover_art, ribbon="ONTARIO CURRICULUM")
    run(build, b, inside=[3, 4, 5, 7, 9, 10], feature=7, feature_line=("6 mystery pictures", "1st QUADRANT • ALL 4 QUADRANTS"),
        key_page=13, preview=[1, 3, 4, 7, 10], listing=LISTING)
