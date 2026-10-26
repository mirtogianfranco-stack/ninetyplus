"""Shared toolkit for TPT products: branding, page furniture, covers, keys, thumbnails, previews, listings.

A product module defines `build(b: Book)` that draws every page, plus LISTING metadata, and calls `run()`.
`Book.build` runs the draw function twice so the teacher guide can list real page numbers (b.mark / b.pages_of).
"""
import math
import os
import subprocess
import tempfile
from dataclasses import dataclass, field

from reportlab.lib.colors import HexColor, white, Color
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

STORE = "North Star Resources"  # <- your TPT store name; used on covers, footers, terms
STORE_URL = ""  # <- paste your TPT store link here to make it clickable on the follow page
YEAR = 2026

KIT = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(KIT)
OUT = os.path.join(ROOT, "out")
F = os.path.join(KIT, "fonts")
for name, file in [("Anton", "anton-400.ttf"), ("Fredoka", "Fredoka-Bold.ttf"),
                   ("Body", "Andika-Regular.ttf"), ("BodyB", "Andika-Bold.ttf")]:
    pdfmetrics.registerFont(TTFont(name, os.path.join(F, file)))
pdfmetrics.registerFontFamily("Body", normal="Body", bold="BodyB", italic="Body", boldItalic="BodyB")

W, H = letter
M = 48
GREY = HexColor("#9CA3AF")
INK = HexColor("#1F2937")
KEYRED = HexColor("#D62828")


@dataclass
class Theme:
    primary: str
    dark: str
    accent: str
    light: str
    display: str = "Anton"  # "Fredoka" for K-2

    def __post_init__(self):
        for k in ("primary", "dark", "accent", "light"):
            setattr(self, k, HexColor(getattr(self, k)))

    def stripe(self):
        p = self.primary
        return Color(min(p.red * 1.12, 1), min(p.green * 1.12, 1), min(p.blue * 1.12, 1))


THEMES = {
    "pitch": Theme("#1F7A3A", "#14213D", "#F59E0B", "#E8F5E9"),
    "berry": Theme("#7B2CBF", "#240046", "#FFB703", "#F3E8FF", "Fredoka"),
    "ocean": Theme("#0077B6", "#03045E", "#FFB703", "#E0F2FE"),
    "autumn": Theme("#C2410C", "#431407", "#FACC15", "#FFF1E6"),
    "sky": Theme("#2A9D8F", "#264653", "#F4A261", "#E6F6F4", "Fredoka"),
    "slate": Theme("#334155", "#0F172A", "#22D3EE", "#EEF2F7"),
    "cherry": Theme("#D62839", "#3D0C11", "#FFD166", "#FDECEE", "Fredoka"),
    "spooky": Theme("#EA580C", "#2E1065", "#A3E635", "#FFF1E6"),
    "spooky_kids": Theme("#F97316", "#3B0764", "#A3E635", "#FFF4EA", "Fredoka"),
    "potion": Theme("#6D28D9", "#1E1B4B", "#F97316", "#F1EAFE"),
    "hundred": Theme("#7C3AED", "#1E1B4B", "#FACC15", "#F3EEFF", "Fredoka"),
    "valentine": Theme("#DB2777", "#500724", "#FDE68A", "#FDF2F8", "Fredoka"),
    "heritage": Theme("#166534", "#111827", "#F59E0B", "#F0FDF4"),
    "lunar": Theme("#B91C1C", "#450A0A", "#FACC15", "#FEF2F2"),
    "frost": Theme("#0369A1", "#0C1E3A", "#F43F5E", "#E0F2FE"),
    "frost_kids": Theme("#0284C7", "#0C1E3A", "#F43F5E", "#E6F4FD", "Fredoka"),
    "evergreen": Theme("#15803D", "#0C1E3A", "#F43F5E", "#E8F5EC"),
    "remember": Theme("#9B1C1C", "#1E293B", "#D4AF37", "#FDF2F2"),
    "remember_kids": Theme("#B91C1C", "#1E293B", "#D4AF37", "#FEF2F2", "Fredoka"),
}


def style(size=11.5, lead=None, color=INK, font="Body", align=0):
    return ParagraphStyle("s", fontName=font, fontSize=size, leading=lead or size * 1.35, textColor=color, alignment=align)


class Book:
    def __init__(self, slug, title, sub, grades, theme, cover_art=None, badge_line="NO PREP  •  PRINT & GO  •  ANSWER KEYS", ribbon=None):
        self.slug, self.title, self.sub, self.grades = slug, title, sub, grades
        self.t = THEMES[theme] if isinstance(theme, str) else theme
        self.cover_art, self.badge_line = cover_art, badge_line
        self.ribbon = ribbon
        self.marks, self._prev_marks = {}, {}

    # ---------- lifecycle ----------
    def build(self, draw):
        os.makedirs(OUT, exist_ok=True)
        self.path = os.path.join(OUT, f"{self.slug}.pdf")
        for _ in range(2):
            self._prev_marks, self.marks = self.marks, {}
            self.c = canvas.Canvas(self.path, pagesize=letter)
            self.c.setTitle(f"{self.title}: {self.sub}"); self.c.setAuthor(STORE)
            self.n = 0; self._open = False
            draw(self)
            self._close_page()
            self.c.save()
        self.page_count = self.n
        return self.path

    def page(self, mark=None, footer=True):
        self._close_page()
        self.n += 1; self._open = True; self._footer = footer
        if mark:
            self.marks.setdefault(mark, []).append(self.n)
        return self.c

    def _close_page(self):
        if self._open:
            if self._footer:
                self.footer()
            self.c.showPage(); self._open = False

    def pages_of(self, mark):
        p = self._prev_marks.get(mark) or ["?"]
        return str(p[0]) if len(p) == 1 else f"{p[0]}-{p[-1]}"

    # ---------- furniture ----------
    def footer(self):
        c = self.c
        c.setFont("Body", 7.5); c.setFillColor(GREY)
        c.drawString(M, 22, f"© {STORE}  •  {self.title}  •  Licensed for single-classroom use")
        c.drawRightString(W - M, 22, str(self.n))

    def band(self, y0, h):
        c, t = self.c, self.t
        c.setFillColor(t.primary); c.rect(0, y0, W, h, stroke=0, fill=1)
        c.setFillColor(t.stripe())
        for i in range(0, int(W) + 60, 60):
            c.rect(i, y0, 30, h, stroke=0, fill=1)
        c.setFillColor(t.accent); c.rect(0, y0 - 4, W, 4, stroke=0, fill=1)

    def header(self, title, kicker="", name=True, size=28):
        c, t = self.c, self.t
        self.band(H - 88, 88)
        c.setFillColor(white)
        if kicker:
            c.setFont("BodyB", 9); c.drawString(M, H - 30, kicker.upper())
        fs = size
        while pdfmetrics.stringWidth(title.upper() if t.display == "Anton" else title, t.display, fs) > W - 2 * M - 130 and fs > 14:
            fs -= 1
        c.setFont(t.display, fs); c.drawString(M, H - 68, title.upper() if t.display == "Anton" else title)
        y = H - 120
        if name:
            c.setFillColor(INK); c.setFont("Body", 11)
            c.drawString(M, y, "Name ________________________________"); c.drawRightString(W - M, y, "Date _______________")
            y -= 26
        return y

    def para(self, text, x, y, w, st=None):
        p = Paragraph(text, st or style())
        _, h = p.wrap(w, 2000); p.drawOn(self.c, x, y - h)
        return y - h

    def badge(self, x, y, label, r=11, fill=None):
        c = self.c
        c.setFillColor(fill or self.t.accent); c.circle(x, y, r, stroke=0, fill=1)
        c.setFillColor(self.t.dark if fill is None else white); c.setFont("BodyB", r * 0.95)
        c.drawCentredString(x, y - r * 0.33, str(label))

    def rule_lines(self, x, y, w, n, gap=22):
        c = self.c; c.setStrokeColor(GREY); c.setLineWidth(0.6)
        for _ in range(n):
            y -= gap; c.line(x, y, x + w, y)
        return y

    def primary_lines(self, x, y, w, h=40):
        """K-2 handwriting lines: solid top, dashed midline, solid baseline. y is the top line. Returns baseline y."""
        c = self.c
        c.setStrokeColor(HexColor("#60A5FA")); c.setLineWidth(0.9); c.line(x, y, x + w, y)
        c.setStrokeColor(HexColor("#F87171")); c.setDash(4, 3); c.setLineWidth(0.8); c.line(x, y - h / 2, x + w, y - h / 2); c.setDash()
        c.setStrokeColor(HexColor("#60A5FA")); c.setLineWidth(1.2); c.line(x, y - h, x + w, y - h)
        return y - h

    def question(self, n, text, y, lines=2, x=M, w=W - 2 * M, answer=None, st=None):
        """Numbered question with write-on lines. answer (str) is printed in red on the first line for keys."""
        self.badge(x + 10, y - 8, n)
        y = self.para(text, x + 28, y, w - 28, st) - 6
        if answer:  # keys: answer text in the writing space, no rules under it
            self.para(f'<font color="#D62828"><b>{answer}</b></font>', x + 32, y - 4, w - 36, style(10.5, 14))
            return y - lines * 22 - 14
        y = self.rule_lines(x + 28, y, w - 28, lines)
        return y - 14

    def table(self, cols, rows, x, y, widths, rh=22, fs=10, first_left=True):
        c, t = self.c, self.t
        tw = sum(widths)
        c.setFillColor(t.dark); c.rect(x, y - rh, tw, rh, stroke=0, fill=1)
        c.setFillColor(white); c.setFont("BodyB", fs)
        cx = x
        for j, (col, w) in enumerate(zip(cols, widths)):
            (c.drawString(cx + 6, y - rh + 7, col) if (j == 0 and first_left) else c.drawCentredString(cx + w / 2, y - rh + 7, col))
            cx += w
        y -= rh; c.setFont("Body", fs)
        for i, r in enumerate(rows):
            if i % 2 == 0:
                c.setFillColor(t.light); c.rect(x, y - rh, tw, rh, stroke=0, fill=1)
            c.setFillColor(INK); cx = x
            for j, (v, w) in enumerate(zip(r, widths)):
                (c.drawString(cx + 6, y - rh + 7, str(v)) if (j == 0 and first_left) else c.drawCentredString(cx + w / 2, y - rh + 7, str(v)))
                cx += w
            y -= rh
        c.setStrokeColor(t.dark); c.setLineWidth(1); c.rect(x, y, tw, rh * (len(rows) + 1))
        return y

    def section_title(self, text, y, x=M, size=15):
        self.c.setFont(self.t.display, size); self.c.setFillColor(self.t.primary)
        self.c.drawString(x, y, text.upper() if self.t.display == "Anton" else text)
        return y - size * 0.6

    def key_stamp(self):
        c = self.c
        c.saveState(); c.setFillColor(KEYRED); c.roundRect(W - M - 116, H - 62, 116, 28, 6, stroke=0, fill=1)
        c.setFillColor(white); c.setFont("BodyB", 11); c.setFont("BodyB", 12); c.drawCentredString(W - M - 58, H - 52, "ANSWER KEY"); c.restoreState()

    # ---------- standard pages ----------
    def cover(self, bullets=()):
        c, t = self.page(footer=False), self.t
        c.setFillColor(t.primary); c.rect(0, 0, W, H, stroke=0, fill=1)
        c.setFillColor(t.stripe())
        for i in range(0, int(H), 80):
            c.rect(0, i, W, 40, stroke=0, fill=1)
        c.setFillColor(t.dark); c.rect(0, H - 262, W, 200, stroke=0, fill=1)
        c.setFillColor(t.accent); c.rect(0, H - 266, W, 4, stroke=0, fill=1); c.rect(0, H - 62, W, 4, stroke=0, fill=1)
        title = self.title.upper() if t.display == "Anton" else self.title
        fs = 64
        while pdfmetrics.stringWidth(title, t.display, fs) > W - 70:
            fs -= 2
        c.setFillColor(white); c.setFont(t.display, fs); c.drawCentredString(W / 2, H - 150, title)
        c.setFillColor(t.accent); fs2 = 18
        while pdfmetrics.stringWidth(self.sub.upper(), "BodyB", fs2) > W - 80:
            fs2 -= 1
        c.setFont("BodyB", fs2); c.drawCentredString(W / 2, H - 192, self.sub.upper())
        if bullets:
            c.setFillColor(white); c.setFont("Body", 13); c.drawCentredString(W / 2, H - 228, "  •  ".join(bullets))
        # art panel
        c.setFillColor(white); c.roundRect(M + 20, 250, W - 2 * M - 40, 240, 22, stroke=0, fill=1)
        if self.cover_art:
            c.saveState(); self.cover_art(self, M + 20, 250, W - 2 * M - 40, 240); c.restoreState()
        c.setFillColor(t.accent); c.roundRect(W / 2 - 170, 120, 340, 84, 16, stroke=0, fill=1)
        c.setFillColor(t.dark); c.setFont(t.display, 34); c.drawCentredString(W / 2, 162, self.grades.upper() if t.display == "Anton" else self.grades)
        c.setFont("BodyB", 11.5); c.drawCentredString(W / 2, 136, self.badge_line)
        c.setFillColor(white); c.setFont("Body", 10); c.drawCentredString(W / 2, 56, STORE)
        if self.ribbon:  # corner ribbon, e.g. "ONTARIO CURRICULUM"
            c.saveState(); c.translate(W - 58, H - 58); c.rotate(-45)
            c.setFillColor(HexColor("#D62828")); c.rect(-160, -15, 320, 30, stroke=0, fill=1)
            c.setFillColor(white); c.setFont("BodyB", 10.5); c.drawCentredString(0, -4, self.ribbon); c.restoreState()

    def guide(self, intro, contents, notes=(), standards=""):
        """contents: list of (mark_or_None, label). Page numbers resolve on the second build pass."""
        self.page("guide")
        y = self.header("Teacher Guide", "Read me first", name=False)
        y = self.para(intro, M, y, W - 2 * M) - 14
        rows = [(self.pages_of(m) if m else "", label) for m, label in contents]
        y = self.table(["Page", "What it is"], rows, M, y, [80, W - 2 * M - 80], rh=20, fs=9.5) - 18
        for head, body in notes:
            y = self.para(f"<b>{head}.</b> {body}", M, y, W - 2 * M) - 10
        if standards:
            self.para(f"<b>Standards alignment.</b> {standards}", M, y, W - 2 * M)

    def text_key(self, title, sections, size=10.5):
        """sections: list of (heading, [answers]). Flows onto extra pages as needed."""
        st = style(size, size * 1.38)

        def fresh():
            self.page("keys"); y = self.header(title, "Answer key", name=False); self.key_stamp(); return y
        y = fresh()
        for head, answers in sections:
            if y < 140:
                y = fresh()
            y = self.section_title(head, y) - 6
            for i, a in enumerate(answers, 1):
                p = Paragraph(f"<b>{i}.</b> {a}", st); _, h = p.wrap(W - 2 * M - 8, 2000)
                if y - h < 50:
                    y = fresh()
                p.drawOn(self.c, M + 8, y - h); y -= h + 4
            y -= 12

    def follow_page(self):
        """'Thank you / follow me' page with the store star. Added to every product before the terms."""
        self.page("follow")
        c, t = self.c, self.t
        y = self.header("Thank You!", STORE, name=False)
        icon = os.path.join(ROOT, "brand", "store-icon-star-only.png")
        if os.path.exists(icon):
            c.drawImage(icon, W / 2 - 75, y - 160, 150, 150, mask="auto")
        y -= 204
        c.setFillColor(t.dark); c.setFont("Anton", 30)
        c.drawCentredString(W / 2, y, "THANK YOU FOR CHOOSING NORTH STAR!" if STORE == "North Star Resources" else f"THANK YOU FROM {STORE.upper()}!")
        y -= 34
        boxes = [("Follow my store", "Click the green <b>Follow</b> button on my TPT store page. You'll get an email every time I "
                  "post a new resource or freebie, including new Ontario-aligned seasonal packs."),
                 ("Leave a review", "Go to <b>My Purchases</b> on TPT and click <b>Leave a Review</b>. You earn TPT credits toward "
                  "future purchases, and your feedback helps me make even better resources."),
                 ("Questions or ideas?", "Use the <b>Q&amp;A</b> tab on any of my products. I read every question and love hearing "
                  "what you'd like to see next.")]
        for head, body in boxes:
            c.setFillColor(t.light); c.setStrokeColor(t.primary); c.setLineWidth(2); c.roundRect(M, y - 120, W - 2 * M, 112, 14, fill=1)
            c.setFillColor(t.primary); c.setFont("BodyB", 16); c.drawString(M + 18, y - 32, head)
            self.para(body, M + 18, y - 42, W - 2 * M - 36, style(12.5, 17))
            y -= 132
        if STORE_URL:
            c.setFillColor(t.primary); c.setFont("BodyB", 13); c.drawCentredString(W / 2, y - 14, STORE_URL)
            c.linkURL(STORE_URL, (M, y - 22, W - M, y), relative=0)

    def promo_page(self, product_pdf, name, blurb):
        """Freebie upsell page: the paid product's cover plus a pitch."""
        self.page("promo")
        c, t = self.c, self.t
        y = self.header("Want More?", "The full resource", name=False)
        tmp = tempfile.mkdtemp()
        subprocess.run(["pdftoppm", "-r", "70", "-png", "-f", "1", "-l", "1", product_pdf, os.path.join(tmp, "c")], check=True)
        img = os.path.join(tmp, sorted(os.listdir(tmp))[0])
        cw, ch = 250, 250 * 11 / 8.5
        c.saveState(); c.setFillColor(Color(0, 0, 0, alpha=0.25)); c.rect(M + 6, y - ch - 6, cw, ch, stroke=0, fill=1); c.restoreState()
        c.drawImage(img, M, y - ch, cw, ch)
        x = M + cw + 24
        yy = self.para(f"<b>Loved this sample?</b>", x, y - 4, W - M - x, style(18, 24, t.primary, "BodyB")) - 8
        yy = self.para(f"Get the complete <b>{name}</b> in my TPT store.", x, yy, W - M - x, style(13.5, 19)) - 10
        self.para(blurb, x, yy, W - M - x, style(12, 17))
        y -= ch + 30
        self.para(f"Search <b>{STORE}</b> on Teachers Pay Teachers, or find it in my store. Follow me to hear about new "
                  "freebies first!", M, y, W - 2 * M, style(13, 18))

    def terms(self):
        self.follow_page()
        self.page("terms")
        y = self.header("Terms of Use", STORE, name=False)
        first = ("<b>Thank you</b> for downloading this free resource! If you enjoy it, please leave a review on TPT. It "
                 "helps other teachers find it.") if getattr(self, "freebie", False) else (
                 "<b>Thank you</b> for your purchase! If this resource helped your class, please leave a review on TPT. "
                 "You earn TPT credits toward future purchases, and it helps other teachers find it.")
        for txt in [
            first,
            "<b>You may:</b> use this resource with your own students; make copies for your class; post it to a "
            "password-protected class page (such as Google Classroom) that only your students can access.",
            "<b>You may not:</b> share it with other teachers, a grade-level team or a whole school (additional licenses are "
            "available at a discount on TPT); post it on a public website; resell it or claim it as your own; upload it to "
            "file-sharing sites or AI tools.",
            "Fonts: Anton, Fredoka and Andika (SIL Open Font License). All names, data and stories in this resource are "
            "fictional unless stated otherwise.",
            f"© {YEAR} {STORE}. All rights reserved."]:
            y = self.para(txt, M, y, W - 2 * M) - 12

    # ---------- marketing ----------
    def extras(self, inside, feature, feature_line, key_page, preview, listing, key_line=("Answer keys included", "EASY CHECKING  •  SUB-FRIENDLY")):
        """inside: up to 6 page numbers for the 'What's inside' thumb; feature: hero interior page;
        key_page: answer-key page for thumb 4; preview: page numbers for the watermarked preview PDF."""
        from PIL import Image, ImageDraw, ImageFont, ImageFilter
        from pypdf import PdfReader, PdfWriter
        d = os.path.join(OUT, self.slug + "_listing"); os.makedirs(d, exist_ok=True)
        tmp = tempfile.mkdtemp()
        subprocess.run(["pdftoppm", "-r", "110", "-png", self.path, os.path.join(tmp, "p")], check=True)
        files = sorted(f for f in os.listdir(tmp) if f.endswith(".png"))
        pages = [Image.open(os.path.join(tmp, f)).convert("RGB") for f in files]
        S, t = 1600, self.t
        rgb = lambda col: tuple(int(v * 255) for v in (col.red, col.green, col.blue))
        disp = ImageFont.truetype(os.path.join(F, "anton-400.ttf" if t.display == "Anton" else "Fredoka-Bold.ttf"), 112)
        bold = lambda s: ImageFont.truetype(os.path.join(F, "Andika-Bold.ttf"), s)

        def card(img, h):
            im = img.resize((int(img.width * h / img.height), h)); sh = Image.new("RGBA", (im.width + 40, im.height + 40), (0, 0, 0, 0))
            ImageDraw.Draw(sh).rectangle([20, 26, im.width + 20, im.height + 26], fill=(0, 0, 0, 110))
            sh = sh.filter(ImageFilter.GaussianBlur(10)); sh.paste(im, (20, 20)); return sh

        def base(title, sub):
            im = Image.new("RGB", (S, S), rgb(t.primary)); dr = ImageDraw.Draw(im)
            for yy in range(0, S, 120):
                dr.rectangle([0, yy, S, yy + 60], fill=rgb(t.stripe()))
            dr.rectangle([0, 0, S, 270], fill=rgb(t.dark)); dr.rectangle([0, 270, S, 282], fill=rgb(t.accent))
            f = disp
            while dr.textlength(title, font=f) > S - 80:
                f = ImageFont.truetype(f.path, f.size - 6)
            dr.text((S // 2, 110), title, font=f, fill="white", anchor="mm")
            fb = bold(46)
            while dr.textlength(sub, font=fb) > S - 80:
                fb = bold(fb.size - 2)
            dr.text((S // 2, 215), sub, font=fb, fill=rgb(t.accent), anchor="mm")
            return im

        up = lambda s: s.upper() if t.display == "Anton" else s
        im = base(up(self.title), f"{self.grades.upper()}  •  NO PREP")
        cc = card(pages[0], 1200); im.paste(cc, ((S - cc.width) // 2, 340), cc); im.save(os.path.join(d, "thumb1-cover.png"))
        im = base(up("What's inside"), f"{self.page_count} PAGES  •  ANSWER KEYS INCLUDED")
        pos = [(60, 360), (560, 330), (1060, 360), (60, 930), (560, 900), (1060, 930)]
        for p, (x, y) in zip(inside[:6], pos):
            cc = card(pages[p - 1], 520); im.paste(cc, (x, y), cc)
        im.save(os.path.join(d, "thumb2-inside.png"))
        im = base(up(feature_line[0]), feature_line[1].upper())
        cc = card(pages[feature - 1], 1200); im.paste(cc, ((S - cc.width) // 2, 340), cc); im.save(os.path.join(d, "thumb3-feature.png"))
        im = base(up(key_line[0]), key_line[1])
        cc = card(pages[key_page - 1], 1200); im.paste(cc, ((S - cc.width) // 2, 340), cc); im.save(os.path.join(d, "thumb4-keys.png"))
        # watermarked preview
        wm_path = os.path.join(tmp, "wm.pdf"); wc = canvas.Canvas(wm_path, pagesize=letter)
        wc.setFont("Anton", 90); wc.setFillColor(Color(0.8, 0.15, 0.15, alpha=0.2)); wc.translate(W / 2, H / 2); wc.rotate(40)
        wc.drawCentredString(0, -30, "PREVIEW"); wc.save()
        wm = PdfReader(wm_path).pages[0]; rd = PdfReader(self.path); out = PdfWriter()
        for p in preview:
            pg = rd.pages[p - 1]
            if p != 1:
                pg.merge_page(wm)
            out.add_page(pg)
        out.write(os.path.join(d, f"{self.slug}-PREVIEW.pdf"))
        # listing copy
        L = listing
        md = [f"# TPT listing: {self.title}", "",
              f"**Title:** {L['tpt_title']}", f"**Price:** {L['price']}", f"**Grades:** {L['grades']}  **Subjects:** {L['subjects']}",
              f"**Resource type:** {L['type']}  **Format:** PDF  **Pages:** {self.page_count}  **Answer key:** Included", "",
              "**Upload:** product file `" + os.path.basename(self.path) + f"`; preview `{self.slug}-PREVIEW.pdf`; "
              "thumbnails thumb1 to thumb4 in order.", "", "---", "", "## Description", "", L["description"].strip(), "",
              "---", "", "**Keywords:** " + ", ".join(L["keywords"])]
        open(os.path.join(d, "listing.md"), "w").write("\n".join(md) + "\n")
        return d


# ---------- small drawing helpers shared by products ----------
def star(c, x, y, r, fill):
    p = c.beginPath()
    for k in range(10):
        a = math.radians(90 + 36 * k); rr = r if k % 2 == 0 else r * 0.45
        (p.moveTo if k == 0 else p.lineTo)(x + rr * math.cos(a), y + rr * math.sin(a))
    p.close(); c.setFillColor(fill); c.drawPath(p, stroke=0, fill=1)


def run(build, book, **extras):
    path = book.build(build)
    d = book.extras(**extras)
    print(f"{path}  ({book.page_count} pages)\n{d}")
