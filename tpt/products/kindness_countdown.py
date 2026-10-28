"""Christmas Kindness Countdown, School Days (15) and Home (24) editions: rebrands the owner's puzzle packets as North Star.
The original interior pages (puzzles, colouring art, keys) are kept and their page numbers stay valid. This script swaps in a
North Star cover, guide and Kindness Pledge, fixes American spellings in place, adds a store footer, and appends the
follow and terms pages. Source PDFs: src/kindness/{school,home}.pdf."""
import os, re, sys, io
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
import pdfplumber
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import white, HexColor, Color
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from kit import Book, style, W, H, M, INK, GREY, OUT, F, STORE
from kit.christmas import gift, gingerbread, candy_cane, star, ornament, RED, GOLD, DKGREEN

SRC = os.path.join(os.path.dirname(HERE), "src", "kindness")
for name, path in [("DejaVuSans", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
                   ("DejaVuSans-Bold", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
                   ("Montserrat-Bold", os.path.join(F, "Montserrat-Bold.ttf"))]:
    pdfmetrics.registerFont(TTFont(name, path))
FONTMAP = {"DejaVuSans": "DejaVuSans", "DejaVuSans-Bold": "DejaVuSans-Bold", "Montserrat-Thin": "Montserrat-Bold"}
SPELL = [(r"\bCOLOR", "COLOUR"), (r"\bColor", "Colour"), (r"\bcolor", "colour"), (r"\bfavorite", "favourite"), (r"\bneighbor", "neighbour")]
NEEDS = re.compile(r"colo(?!u)r|favorite|neighbor", re.I)

ED = {
 "school": dict(slug="Christmas-Kindness-Countdown-School-Days-Edition", n=15, unit="school day", ribbon="SCHOOL DAYS EDITION",
                sub="School Days Edition: 15 Days of Puzzles & Kindness", price="$4.00. Range $3.50 to $4.50."),
 "home": dict(slug="Christmas-Kindness-Countdown-Home-Edition", n=24, unit="day", ribbon="24-DAY HOME EDITION",
              sub="Home Edition: December 1 to 24", price="$4.50. Range $4 to $5."),
}


def fix_overlay(pdf_path):
    """Returns {page_index: overlay PDF page} that whites out each line containing an American spelling and redraws it."""
    out = {}
    with pdfplumber.open(pdf_path) as pdf:
        for i, pg in enumerate(pdf.pages):
            words = pg.extract_words(extra_attrs=["fontname", "size", "non_stroking_color"], keep_blank_chars=False)
            hits = [w for w in words if NEEDS.search(w["text"])]
            if not hits or i == 0:  # page 1 (the old cover) is replaced
                continue
            buf = io.BytesIO(); c = canvas.Canvas(buf, pagesize=letter)
            done = set()
            for h in hits:
                key = (round(h["top"]), h["fontname"])
                if key in done: continue
                done.add(key)
                line = [w for w in words if abs(w["top"] - h["top"]) < 1.5 and w["fontname"] == h["fontname"]]
                line.sort(key=lambda w: w["x0"])
                text = " ".join(w["text"] for w in line)
                for a, b_ in SPELL: text = re.sub(a, b_, text)
                x0, x1 = line[0]["x0"], line[-1]["x1"]; top, bot = min(w["top"] for w in line), max(w["bottom"] for w in line)
                chars = [ch for ch in pg.chars if abs(ch["top"] - h["top"]) < 1.5 and ch["fontname"] == h["fontname"]]
                base = chars[0]["matrix"][5]
                font = FONTMAP[h["fontname"].split("+")[1]]; size = h["size"]
                col = h.get("non_stroking_color") or (0,)
                c.setFillColor(white); c.rect(x0 - 2, H - bot - 3, x1 - x0 + 4, bot - top + 5, stroke=0, fill=1)
                if len(col) == 1: c.setFillGray(col[0])
                elif len(col) == 3: c.setFillColorRGB(*col)
                c.setFont(font, size)
                if abs((x0 + x1) / 2 - W / 2) < 4: c.drawCentredString(W / 2, base, text)
                else: c.drawString(x0, base, text)
                assert pdfmetrics.stringWidth(text, font, size) < W - 60, text
            c.save(); out[i] = PdfReader(io.BytesIO(buf.getvalue())).pages[0]
    return out


def footer_overlay(title):
    buf = io.BytesIO(); c = canvas.Canvas(buf, pagesize=letter)
    c.setFont("Body", 6.8); c.setFillColor(GREY); c.drawString(M - 12, 14, f"© {STORE}  •  {title}  •  Licensed for single-classroom use")
    c.save(); return PdfReader(io.BytesIO(buf.getvalue())).pages[0]


def cover_art_from(pdf_path):
    """Crops the colourful calendar from the original cover for the North Star art panel."""
    import subprocess, tempfile
    tmp = tempfile.mkdtemp()
    subprocess.run(["pdftoppm", "-r", "220", "-png", "-f", "1", "-l", "1", pdf_path, os.path.join(tmp, "c")], check=True)
    from PIL import Image
    im = Image.open(os.path.join(tmp, sorted(os.listdir(tmp))[0])); s = 220 / 72
    crop = im.crop((int(26 * s), int(304 * s), int(586 * s), int(730 * s))); p = os.path.join(tmp, "cal.png"); crop.save(p)

    def art(b, x, y, w, h):
        c = b.c
        c.setFillColor(DKGREEN); c.roundRect(x, y, w, h, 22, stroke=0, fill=1)
        ih = h - 24; iw = ih * crop.width / crop.height
        c.drawImage(p, x + (w - iw) / 2, y + 12, iw, ih)
        gift(c, x + 34, y + 18, 44, RED, GOLD); candy_cane(c, x + w - 46, y + 20, 70)
        star(c, x + 32, y + h - 34, 14); star(c, x + w - 32, y + h - 34, 14)
    return art


def pledge(b, e):
    b.page("pledge")
    c = b.c
    c.setFillColor(INK); c.setFont("Anton", 40); c.drawCentredString(W / 2, H - 92, "MY KINDNESS PLEDGE")
    for sx in (M + 20, W - M - 20):
        c.setStrokeColor(INK); c.setLineWidth(2)
        for a in range(0, 180, 45):
            import math
            r = 14; dx, dy = r * math.cos(math.radians(a)), r * math.sin(math.radians(a))
            c.line(sx - dx, H - 78 - dy, sx + dx, H - 78 + dy)
    c.setFont("Body", 13); c.drawCentredString(W / 2, H - 120, f"Every {e['unit']} of this countdown has a kindness challenge. Kindness is the best gift!")
    y = H - 170
    c.setFont("BodyB", 15); c.drawString(M, y, "I promise to:")
    for t in ["be kind with my words", "help without being asked", "include others", "say thank you", "share and take turns"]:
        y -= 40
        c.setLineWidth(2); c.rect(M + 10, y - 3, 18, 18)
        c.setFont("Body", 15); c.drawString(M + 40, y, t)
    y -= 50
    c.setFont("BodyB", 15); c.drawString(M, y, "My own kindness idea:")
    c.setStrokeColor(GREY); c.setLineWidth(.8)
    for k in range(3): c.line(M, y - 32 - k * 32, W - M, y - 32 - k * 32)
    # colouring hearts
    c.setStrokeColor(INK); c.setLineWidth(2)
    for k, hx in enumerate((W / 2 - 150, W / 2, W / 2 + 150)):
        hy, r = 200, 30
        p = c.beginPath(); p.moveTo(hx, hy - r * 1.1)
        p.curveTo(hx - r * 1.6, hy, hx - r * 1.0, hy + r * 1.2, hx, hy + r * .5)
        p.curveTo(hx + r * 1.0, hy + r * 1.2, hx + r * 1.6, hy, hx, hy - r * 1.1); c.drawPath(p)
    c.setFillColor(INK); c.setFont("Body", 13)
    c.drawString(M, 110, "Signed: ______________________________"); c.drawRightString(W - M, 110, "Date: _______________")


def guide(b, e, pages):
    d, cert, ans, doodle, fol, terms = pages
    b.pages_of = lambda m: m
    if e["n"] == 15:
        intro = ("Fifteen school days of puzzles, colouring and kindness to count down to winter break. Each school day is two "
                 "pages: a puzzle (word search, maze, secret message, sudoku or word scramble) and a Daily Fun page with a joke, "
                 "a picture to colour and a kindness challenge.")
        when = ("If your last day before the break is <b>Friday, December 18, 2026</b>, start on <b>Monday, November 30</b>. "
                "Adjust to your school calendar: any 15 school days work.")
    else:
        intro = ("Twenty-four days of puzzles, colouring and kindness, one for each day from December 1 to 24. Each day is two "
                 "pages: a puzzle (word search, maze, secret message, sudoku or word scramble) and a Daily Fun page with a joke, "
                 "a picture to colour and a kindness challenge for home.")
        when = ("Start on <b>December 1</b> and finish on Christmas Eve. It makes a lovely take-home gift: you may print copies "
                "for the families of your own students.")
    b.guide(intro,
            [("3", "Student title page"), ("4", "My Kindness Pledge"), ("5", "How It Works (student directions)"),
             ("6", "My Countdown Calendar"), ("7", "My Christmas Wish List"), (d, f"Days 1 to {e['n']}: puzzle + Daily Fun pages"),
             (cert, "Certificate"), (ans, "Answer keys"), (doodle, "Holiday Doodles page"), (fol, "Thank you / follow"), (terms, "Terms of use")],
            [("When to start", when),
             ("Ways to use it", "Morning work, a calm start after lunch, an early-finisher folder, or a kindness wall where students add "
              "a sticker each time they complete a challenge."),
             ("Printing", "Print single-sided in black and white. Keep the answer keys for yourself, or put them out for self-checking."),
             ("Codes", "Secret messages use 1 = A, 2 = B and so on. Jokes have their answers printed upside down.")],
            "Supports Ontario social-emotional learning skills (Health and Physical Education, 2019, and Mathematics, 2020, "
            "Strand A): positive relationships, self-awareness and perseverance with puzzles. Builds vocabulary, spelling and "
            "logical reasoning.")


def make(ed):
    e = ED[ed]; src = os.path.join(SRC, f"{ed}.pdf"); rd = PdfReader(src); N = len(rd.pages)
    texts = [p.extract_text() or "" for p in rd.pages]
    cert = next(i for i, t in enumerate(texts, 1) if "THIS CERTIFICATE" in t.upper())
    ans0 = next(i for i, t in enumerate(texts, 1) if i > cert and "ANSWERS" in t.upper())
    doodle = next(i for i, t in enumerate(texts, 1) if "Doodles" in t)
    pages = (f"8-{cert - 1}", str(cert), f"{ans0}-{doodle - 1}", str(doodle), str(N + 1), str(N + 2))
    assert cert - 8 == 2 * e["n"], (cert, e["n"])
    title = "Christmas Kindness Countdown"
    b = Book(e["slug"] + "-NS", title, e["sub"], "Grades 1-4", "christmas", cover_art_from(src),
             badge_line="NO PREP  •  PUZZLES & COLOURING  •  ANSWER KEYS", ribbon=e["ribbon"])
    pos = {1: 1, 2: 2, 3: 4, 4: N + 1, 5: N + 2}
    base_footer = b.footer

    def footer():
        n = b.n; b.n = pos.get(n, n); base_footer(); b.n = n
    b.footer = footer

    def build(bk):
        bk.cover([f"{e['n']} days", "puzzles", "colouring", "kindness challenges"])
        guide(bk, e, pages); pledge(bk, e); bk.terms()
    ns = PdfReader(b.build(build))
    fixes = fix_overlay(src); foot = footer_overlay(title)
    w = PdfWriter()
    order = [("ns", 0), ("ns", 1), ("src", 2), ("ns", 2)] + [("src", i) for i in range(4, N)] + [("ns", 3), ("ns", 4)]
    for kind, i in order:
        if kind == "ns": w.add_page(ns.pages[i]); continue
        pg = rd.pages[i]
        if i in fixes: pg.merge_page(fixes[i])
        pg.merge_page(foot); w.add_page(pg)
    w.add_metadata({"/Title": f"{title}: {e['sub']}", "/Author": STORE})
    final = os.path.join(OUT, e["slug"] + ".pdf"); w.write(final); os.remove(b.path)
    b.slug, b.path, b.page_count = e["slug"], final, len(w.pages)
    return b, e, (cert, ans0)


LISTINGS = {
 "school": dict(
    tpt_title="Christmas Kindness Countdown to Winter Break | 15 Days of Puzzles & Colouring | Grades 1-4",
    grades="1st, 2nd, 3rd, 4th", subjects="Christmas, Character Education, Spelling", type="Activities, Printables, Centres",
    description="""
Count down the **last 15 school days before winter break** with puzzles, colouring and kindness! Each school day has
two pages: a puzzle and a Daily Fun page with a joke, a picture to colour and a **classroom kindness challenge**.

**What's included (46 pages):**
- Countdown calendar, wish list and a My Kindness Pledge page
- 15 days of puzzles: word searches, mazes, secret messages, snowflake sudoku and word scrambles
- 15 Daily Fun pages: joke of the day, colouring picture and a kindness challenge (compliment a classmate, thank the custodian, invite someone new to play...)
- Certificate, Holiday Doodles page and answer keys
- Teacher guide with a start date for a break that begins after Friday, December 18

Printer-friendly black and white. Perfect for morning work, early finishers and a classroom kindness wall.
"""),
 "home": dict(
    tpt_title="Christmas Kindness Countdown | 24 Days of Puzzles & Colouring | December 1-24 | Home Edition | Grades 1-4",
    grades="1st, 2nd, 3rd, 4th", subjects="Christmas, Character Education, Spelling", type="Activities, Printables, Homeschool Curricula",
    description="""
A **24-day Christmas countdown** for December 1 to 24, full of puzzles, colouring and kindness. Each day has two pages:
a puzzle and a Daily Fun page with a joke, a picture to colour and a **kindness challenge for home** (help set the table,
call a relative, make a card for a neighbour...).

**What's included (66 pages):**
- Countdown calendar, wish list and a My Kindness Pledge page
- 24 days of puzzles: word searches, mazes, secret messages, snowflake sudoku and word scrambles
- 24 Daily Fun pages: joke of the day, colouring picture and kindness challenge
- Certificate, Holiday Doodles page and answer keys

Perfect for families and homeschoolers, or as a **take-home gift** from a teacher to their class. Printer-friendly black and white.
"""),
}

if __name__ == "__main__":
    for ed in ("school", "home"):
        b, e, (cert, ans0) = make(ed)
        L = dict(LISTINGS[ed], price=e["price"],
                 keywords=["christmas countdown", "kindness countdown", "advent", "word search", "maze", "colouring pages",
                           "winter break", "kindness challenges", "December", "no prep"])
        d = b.extras(inside=[6, 8, 9, 10, 18, 20], feature=9, feature_line=("A puzzle + kindness every day", f"{e['n']} DAYS  •  PRINT & GO"),
                     key_page=ans0 + 1, preview=[1, 6, 8, 9, 10, 11], listing=L)
        print(b.path, b.page_count, d)
