"""Kindergarten (Ontario 2026 curriculum): Phonics and Patterns. A2 Foundations for Reading and Writing (A2.1 letters, A2.3
phonemes, A2.4 grapheme-phoneme correspondences, A2.5 read and spell simple words, A2.6 read short sentences) and A7 Patterns
(A7.1-A7.4). Codes and wording from the Ministry's Curriculum and Resources site."""
import math, os, random, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
from kit import Book, Theme, run, style, W, H, M, INK, GREY, KEYRED
from kit.christmas import GOLD
from kit.halloween import bat
from kit.winter import mug
from reportlab.lib.colors import white, HexColor

T = Theme("#DB2777", "#831843", "#FACC15", "#FDF2F8", "Fredoka")
GREEN, BLUE, ORANGE, BROWN, RED, PURPLE = (HexColor(h) for h in ("#16A34A", "#2563EB", "#F97316", "#92400E", "#EF4444", "#7C3AED"))
ONT = ("The Ontario Curriculum: Kindergarten (2026), in effect September 2026. <b>A2 Foundations for Reading and Writing</b>: "
       "A2.1 name upper- and lowercase letters (both in and out of order); A2.3 isolate and blend phonemes, and segment simple "
       "words into phonemes; A2.4 identify simple grapheme-phoneme correspondences; A2.5 read and spell simple words using "
       "phonemic awareness and phonics knowledge; A2.6 read short sentences fluently. <b>A7 Patterns and Relationships</b>: "
       "A7.1 identify, describe, and create patterns; A7.2 identify the core of a repeating pattern; A7.3 show that patterns can be "
       "represented in different ways because the core remains the same; A7.4 extend patterns in both directions and identify "
       "any missing elements.")


def sun(c, x, y, s):
    c.saveState(); c.setFillColor(GOLD); c.setStrokeColor(GOLD); c.setLineWidth(max(1.5, s * .05)); cx, cy = x, y + s / 2
    for i in range(12):
        a = math.radians(i * 30); c.line(cx + s * .3 * math.cos(a), cy + s * .3 * math.sin(a), cx + s * .48 * math.cos(a), cy + s * .48 * math.sin(a))
    c.circle(cx, cy, s * .24, stroke=0, fill=1); c.restoreState()


def hat(c, x, y, s):
    c.saveState(); c.setFillColor(BLUE); c.roundRect(x - s * .25, y + s * .2, s * .5, s * .45, s * .08, stroke=0, fill=1)
    c.roundRect(x - s * .45, y + s * .12, s * .9, s * .12, s * .05, stroke=0, fill=1)
    c.setFillColor(RED); c.rect(x - s * .25, y + s * .26, s * .5, s * .08, stroke=0, fill=1); c.restoreState()


def log(c, x, y, s):
    c.saveState(); c.setFillColor(BROWN); c.roundRect(x - s * .45, y + s * .2, s * .8, s * .3, s * .1, stroke=0, fill=1)
    c.setFillColor(HexColor("#D6A36A")); c.ellipse(x + s * .25, y + s * .2, x + s * .45, y + s * .5, stroke=0, fill=1)
    c.setStrokeColor(BROWN); c.setLineWidth(1); c.circle(x + s * .35, y + s * .35, s * .05); c.restoreState()


def bug(c, x, y, s):
    c.saveState(); c.setFillColor(RED); c.circle(x, y + s * .38, s * .26, stroke=0, fill=1)
    c.setFillColor(INK); c.circle(x, y + s * .66, s * .1, stroke=0, fill=1); c.setStrokeColor(INK); c.setLineWidth(1.5)
    c.line(x, y + s * .12, x, y + s * .62)
    for dx, dy in [(-.12, .45), (.12, .45), (-.1, .28), (.1, .28)]: c.circle(x + s * dx, y + s * dy, s * .045, stroke=0, fill=1)
    c.restoreState()


def web(c, x, y, s):
    c.saveState(); c.setStrokeColor(HexColor("#64748B")); c.setLineWidth(1.2); cx, cy, r = x, y + s / 2, s * .42
    for i in range(8):
        a = math.radians(i * 45); c.line(cx, cy, cx + r * math.cos(a), cy + r * math.sin(a))
    for k in (0.35, 0.65, 0.95):
        p = c.beginPath()
        for i in range(9):
            a = math.radians(i * 45); (p.moveTo if i == 0 else p.lineTo)(cx + r * k * math.cos(a), cy + r * k * math.sin(a))
        c.drawPath(p)
    c.restoreState()


def pot(c, x, y, s):
    c.saveState(); c.setFillColor(HexColor("#64748B")); c.roundRect(x - s * .3, y + s * .1, s * .6, s * .42, s * .1, stroke=0, fill=1)
    c.rect(x - s * .38, y + s * .48, s * .76, s * .07, stroke=0, fill=1)
    c.setStrokeColor(HexColor("#64748B")); c.setLineWidth(s * .05); c.line(x - s * .45, y + s * .4, x - s * .3, y + s * .4); c.line(x + s * .3, y + s * .4, x + s * .45, y + s * .4)
    c.restoreState()


PICS = {"sun": sun, "bat": lambda c, x, y, s: bat(c, x, y + s * .45, s), "hat": hat, "mug": lambda c, x, y, s: mug(c, x, y, s * .9),
        "pot": pot, "log": log, "bug": bug, "web": web}
WORDS = ["sun", "bat", "hat", "mug", "pot", "log", "bug", "web"]
R = random.Random(2026)


def shape(c, kind, x, y, s, col):
    """Centre (x, y)."""
    c.saveState(); c.setFillColor(col); c.setStrokeColor(INK); c.setLineWidth(1)
    if kind == "circle": c.circle(x, y, s * .45, stroke=1, fill=1)
    elif kind == "square": c.rect(x - s * .4, y - s * .4, s * .8, s * .8, stroke=1, fill=1)
    elif kind == "triangle":
        p = c.beginPath(); p.moveTo(x, y + s * .45); p.lineTo(x + s * .45, y - s * .38); p.lineTo(x - s * .45, y - s * .38); p.close(); c.drawPath(p, stroke=1, fill=1)
    elif kind == "star":
        p = c.beginPath()
        for i in range(10):
            a = math.radians(90 + 36 * i); rr = s * .48 if i % 2 == 0 else s * .2
            (p.moveTo if i == 0 else p.lineTo)(x + rr * math.cos(a), y + rr * math.sin(a))
        p.close(); c.drawPath(p, stroke=1, fill=1)
    c.restoreState()


A = ("circle", RED); B = ("square", BLUE); C = ("triangle", GREEN); D = ("star", GOLD)


def letter_match(b, letters, key=False):
    b.page("keys" if key else "letters")
    y = b.header("Letter Match", "A2.1  •  Upper- and lowercase", name=not key)
    if key: b.key_stamp()
    y = b.para("Say each letter name. Draw a line from each uppercase letter to its lowercase partner.", M, y, W - 2 * M, style(13, 18)) - 10
    c = b.c; low = list(letters); R2 = random.Random(letters); R2.shuffle(low); row = (y - 60) / len(letters)
    for i, L in enumerate(letters):
        yy = y - 20 - i * row
        c.setFillColor(b.t.dark); c.setFont("Fredoka", 26); c.drawCentredString(M + 60, yy - 9, L)
        c.circle(M + 100, yy, 4.5, stroke=0, fill=1)
        c.setFillColor(b.t.dark); c.setFont("Fredoka", 26); c.drawCentredString(W - M - 60, yy - 9, low[i].lower()); c.circle(W - M - 100, yy, 4.5, stroke=0, fill=1)
    if key:
        c.setStrokeColor(KEYRED); c.setLineWidth(2)
        for i, L in enumerate(letters):
            j = low.index(L); c.line(M + 104, y - 20 - i * row, W - M - 104, y - 20 - j * row)


def sound_boxes(b, words, key=False):
    b.page("keys" if key else "boxes")
    y = b.header("Sound Boxes", "A2.3  •  A2.4  •  Segment and spell", name=not key)
    if key: b.key_stamp()
    y = b.para("Say the word slowly. Push a counter into a box for each sound. Then write the letter for each sound.", M, y, W - 2 * M, style(13, 18)) - 10
    c = b.c
    for i, w_ in enumerate(words):
        top = y - i * 140
        c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); c.roundRect(M, top - 128, W - 2 * M, 124, 14)
        PICS[w_](c, M + 70, top - 112, 96)
        for k in range(3):
            bx = M + 170 + k * 100
            c.setStrokeColor(INK); c.setLineWidth(2); c.rect(bx, top - 110, 86, 86)
            c.setFillColor(GREY); c.circle(bx + 43, top - 10, 5, stroke=0, fill=1)
            if key: c.setFillColor(KEYRED); c.setFont("Fredoka", 46); c.drawCentredString(bx + 43, top - 84, w_[k])


def read_match(b, key=False):
    b.page("keys" if key else "read")
    y = b.header("Read and Match", "A2.5  •  Read simple words", name=not key)
    if key: b.key_stamp()
    y = b.para("Tap and blend each sound to read the word. Draw a line to its picture.", M, y, W - 2 * M, style(13, 18)) - 10
    c = b.c; order = WORDS[:]; R.shuffle(order); row = (y - 60) / len(WORDS)
    for i, w_ in enumerate(WORDS):
        yy = y - 30 - i * row
        c.setFillColor(INK); c.setFont("Fredoka", 30); c.drawString(M + 30, yy - 10, w_)
        for k in range(3): c.setFillColor(b.t.primary); c.circle(M + 38 + k * 22, yy - 22, 3.5, stroke=0, fill=1)
        c.setFillColor(b.t.dark); c.circle(M + 150, yy, 5, stroke=0, fill=1)
        PICS[order[i]](c, W - M - 80, yy - 30, 60); c.circle(W - M - 140, yy, 5, stroke=0, fill=1)
    if key:
        c.setStrokeColor(KEYRED); c.setLineWidth(2)
        for i, w_ in enumerate(WORDS):
            j = order.index(w_); c.line(M + 155, y - 30 - i * row, W - M - 145, y - 30 - j * row)


SENT = [("The bug is on the log.", ["bug", "sun"], 0), ("I see a big pot.", ["web", "pot"], 1),
        ("The sun is hot.", ["sun", "hat"], 0), ("A bat is in the web.", ["mug", "bat"], 1), ("I can see a red hat.", ["hat", "log"], 0)]


def sentences(b, key=False):
    b.page("keys" if key else "sent")
    y = b.header("Read the Sentence", "A2.6  •  Read short sentences", name=not key)
    if key: b.key_stamp()
    y = b.para("Read the sentence. Circle the picture that matches.", M, y, W - 2 * M, style(13, 18)) - 10
    c = b.c
    for i, (s_, pics, ans) in enumerate(SENT):
        top = y - i * 116
        c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); c.roundRect(M, top - 106, W - 2 * M, 102, 14)
        c.setFillColor(INK); c.setFont("Fredoka", 22); c.drawString(M + 18, top - 60, s_)
        for k, p in enumerate(pics):
            px = W - M - 170 + k * 100; PICS[p](c, px, top - 92, 70)
            if key and k == ans: c.setStrokeColor(KEYRED); c.setLineWidth(3); c.circle(px, top - 56, 44)


CORE = [[A, B] * 4, [A, A, B] * 3, [C, D, B] * 3, [D, C, C] * 3]


def core_page(b, key=False):
    b.page("keys" if key else "core")
    y = b.header("Find the Core", "A7.2  •  Repeating patterns", name=not key)
    if key: b.key_stamp()
    y = b.para("The <b>core</b> is the part that repeats. Say the pattern. Circle the core one time.", M, y, W - 2 * M, style(13, 18)) - 14
    c = b.c
    for i, pat in enumerate(CORE):
        yy = y - 50 - i * 130; n = len(pat); step = (W - 2 * M - 40) / n
        c.setStrokeColor(b.t.primary); c.setLineWidth(1.2); c.roundRect(M, yy - 52, W - 2 * M, 104, 14)
        for k, (kind, col) in enumerate(pat): shape(c, kind, M + 20 + step * (k + .5), yy, min(44, step * .85), col)
        if key:
            core = next(q for q in range(1, n) if all(pat[k] == pat[k % q] for k in range(n)))
            c.setStrokeColor(KEYRED); c.setLineWidth(3); c.roundRect(M + 22, yy - 32, step * core - 4, 64, 20)


NEWWAY = [[A, B] * 4, [C, C, D] * 3, [B, D, A] * 3]


def new_way(b, key=False):
    b.page("keys" if key else "newway")
    y = b.header("Same Pattern, New Way", "A7.3  •  Represent patterns", name=not key)
    if key: b.key_stamp()
    y = b.para("Write a letter under each shape to show the pattern a new way (A, B, C). Then clap, snap or stomp it!", M, y, W - 2 * M, style(13, 18)) - 14
    c = b.c
    for i, pat in enumerate(NEWWAY):
        yy = y - 50 - i * 170; n = len(pat); step = (W - 2 * M - 40) / n
        c.setStrokeColor(b.t.primary); c.setLineWidth(1.2); c.roundRect(M, yy - 110, W - 2 * M, 160, 14)
        letters = {}
        for k, sh in enumerate(pat):
            if sh not in letters: letters[sh] = "ABC"[len(letters)]
            x = M + 20 + step * (k + .5); shape(c, sh[0], x, yy, min(44, step * .85), sh[1])
            c.setStrokeColor(INK); c.setLineWidth(1); c.line(x - 18, yy - 70, x + 18, yy - 70)
            if key: c.setFillColor(KEYRED); c.setFont("Fredoka", 22); c.drawCentredString(x, yy - 66, letters[sh])
        c.setFillColor(GREY); c.setFont("Body", 11); c.drawString(M + 14, yy - 100, "My actions:  ______________________________________________")


MISS = [([A, B, A, B, None, B, A, B], 4, A), ([None, C, D, C, D, C, D, None], (0, 7), (D, C)),
        ([A, A, B, A, A, None, A, A, B], 5, B), ([D, B, C, D, None, C, D, B, None], (4, 8), (B, C))]


def missing(b, key=False):
    b.page("keys" if key else "miss")
    y = b.header("What Is Missing?", "A7.4  •  Extend both ways", name=not key)
    if key: b.key_stamp()
    y = b.para("Find the missing shapes. Some are in the middle, at the start or at the end! Draw them in the empty boxes.", M, y, W - 2 * M, style(13, 18)) - 14
    c = b.c
    for i, (pat, pos, ans) in enumerate(MISS):
        yy = y - 50 - i * 130; n = len(pat); step = (W - 2 * M - 40) / n
        c.setStrokeColor(b.t.primary); c.setLineWidth(1.2); c.roundRect(M, yy - 52, W - 2 * M, 104, 14)
        poss = pos if isinstance(pos, tuple) else (pos,); answers = ans if isinstance(pos, tuple) else (ans,)
        for k, sh in enumerate(pat):
            x = M + 20 + step * (k + .5); sz = min(44, step * .85)
            if sh is None:
                c.setDash(4, 3); c.setStrokeColor(INK); c.rect(x - sz / 2, yy - sz / 2, sz, sz); c.setDash()
                if key: shape(c, answers[poss.index(k)][0], x, yy, sz * .8, answers[poss.index(k)][1])
            else: shape(c, sh[0], x, yy, sz, sh[1])


def make_own(b):
    b.page("own")
    y = b.header("Make Your Own Pattern", "A7.1  •  Create patterns")
    y = b.para("Colour or draw your own repeating patterns. Tell a friend your core!", M, y, W - 2 * M, style(13, 18)) - 14
    c = b.c
    for i, lab in enumerate(["An AB pattern", "An AAB pattern", "An ABC pattern", "My own idea!"]):
        yy = y - 30 - i * 140
        c.setFillColor(b.t.primary); c.setFont("Fredoka", 16); c.drawString(M, yy, lab)
        for k in range(8):
            c.setStrokeColor(INK); c.setLineWidth(1.4); c.circle(M + 34 + k * 64, yy - 56, 26)
        c.setFillColor(GREY); c.setFont("Body", 11); c.drawString(M, yy - 100, "My core is: ____________")


def art(b, x, y, w, h):
    c = b.c
    c.setFillColor(b.t.dark); c.roundRect(x, y, w, h, 22, stroke=0, fill=1)
    for k, L in enumerate(["s", "u", "n"]):
        c.setFillColor(white); c.rect(x + 40 + k * 64, y + h - 100, 56, 56, stroke=0, fill=1)
        c.setFillColor(b.t.dark); c.setFont("Fredoka", 36); c.drawCentredString(x + 68 + k * 64, y + h - 88, L)
    sun(c, x + 290, y + h - 110, 80)
    for k, (kind, col) in enumerate([A, B, A, B, A, B]): shape(c, kind, x + 50 + k * 56, y + 60, 40, col)
    for k, (wd, pic) in enumerate([("bug", "bug"), ("hat", "hat")]):
        c.setFillColor(white); c.roundRect(x + w - 150, y + h - 90 - k * 80, 120, 64, 12, stroke=0, fill=1)
        PICS[pic](c, x + w - 120, y + h - 84 - k * 80, 50)
        c.setFillColor(b.t.dark); c.setFont("Fredoka", 22); c.drawString(x + w - 92, y + h - 64 - k * 80, wd)


def build(b):
    b.cover(["letters", "sound boxes", "decodable sentences", "patterns"])
    b.guide("Hands-on phonics and patterns pages for the revised Ontario Kindergarten curriculum (2026). The phonics pages follow a "
            "clear sequence: name letters, segment sounds in sound boxes, read and spell CVC words, and read short sentences with "
            "explicitly taught words (the, is, a, I, see, can). The pattern pages target the new A7 expectations, including the "
            "core, representing a pattern in a new way, and extending patterns in both directions.",
            [("letters", "Letter Match A-M and N-Z, A2.1"), ("boxes", "Sound Boxes (8 CVC words), A2.3 and A2.4"),
             ("read", "Read and Match, A2.5"), ("sent", "Read the Sentence, A2.6"), ("core", "Find the Core, A7.2"),
             ("newway", "Same Pattern, New Way, A7.3"), ("miss", "What Is Missing?, A7.4"), ("own", "Make Your Own Pattern, A7.1"),
             ("keys", "Answer keys"), ("terms", "Terms of use")],
            [("Words used", "CVC words: sun, bat, hat, mug, pot, log, bug, web. Explicitly taught words in the sentences: the, is, a, "
              "I, see, can, on, in, big, red, hot."),
             ("Sound boxes", "Model first: say the word, push one counter per sound while saying it, then blend. Children write the "
              "letters when ready; tracing over teacher dots is fine."),
             ("Patterns", "Build each pattern with real objects or children first. Ask: What is the core? How do you know? What "
              "comes before the first shape?")], ONT)
    letter_match(b, "ABCDEFGHIJKLM"); letter_match(b, "NOPQRSTUVWXYZ")
    sound_boxes(b, WORDS[:4]); sound_boxes(b, WORDS[4:]); read_match(b); sentences(b)
    core_page(b); new_way(b); missing(b); make_own(b)
    letter_match(b, "ABCDEFGHIJKLM", True); letter_match(b, "NOPQRSTUVWXYZ", True)
    sound_boxes(b, WORDS[:4], True); sound_boxes(b, WORDS[4:], True); read_match(b, True); sentences(b, True)
    core_page(b, True); new_way(b, True); missing(b, True)
    b.terms()


LISTING = dict(
    tpt_title="Kindergarten Phonics & Patterns | Sound Boxes, CVC Words, Pattern Core | NEW Ontario Kindergarten 2026",
    price="$4.50. Range $4 to $5.", grades="Kindergarten (JK/SK)", subjects="Phonics, Math, Literacy", type="Centres, Worksheets, Printables",
    description="""
Phonics and patterns pages for the **revised Ontario Kindergarten curriculum (2026)**, now in effect.

**Phonics (A2 Foundations for Reading and Writing):**
- Letter Match A-M and N-Z, uppercase to lowercase (A2.1)
- Sound Boxes: segment and spell 8 CVC words (A2.3, A2.4)
- Read and Match: blend and read CVC words (A2.5)
- Read the Sentence: short decodable sentences with explicitly taught words (A2.6)

**Patterns (A7 Patterns and Relationships):**
- Find the Core (A7.2)
- Same Pattern, New Way: shapes to letters to actions (A7.3)
- What Is Missing?: extend patterns in both directions and fill gaps (A7.4)
- Make Your Own Pattern (A7.1)

Teacher guide with the exact 2026 expectation codes, plus answer keys.
""",
    keywords=["kindergarten phonics", "Ontario kindergarten 2026", "sound boxes", "CVC words", "repeating patterns", "pattern core",
              "JK SK", "science of reading", "kindergarten math", "new kindergarten curriculum"])

if __name__ == "__main__":
    b = Book("Kindergarten-Phonics-Patterns-Ontario-2026", "Phonics & Patterns", "Kindergarten (New 2026 Curriculum)",
             "Kindergarten", T, art, ribbon="NEW 2026 CURRICULUM")
    run(build, b, inside=[3, 5, 7, 8, 9, 11], feature=5, feature_line=("Sound boxes + pattern core", "A2  •  A7"),
        key_page=15, preview=[1, 3, 5, 7, 9, 11], listing=LISTING)
