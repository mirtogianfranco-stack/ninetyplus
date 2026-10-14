"""Sight Words Practice - Dolch Pre-Primer (K-1). One page per word: read, trace, write, spell, find, read a sentence.
Plus a student checklist, flash cards and a key for every Find It grid."""
import os, random, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from kit import Book, run, style, W, H, M, INK, GREY, KEYRED
from reportlab.lib.colors import white, HexColor

WORDS = {
    "a": "I see a cat.", "and": "Mom and I play.", "away": "The bird flew away.", "big": "The dog is big.",
    "blue": "I see a blue car.", "can": "I can run.", "come": "Come and play with me.", "down": "Sit down here.",
    "find": "Can you find the ball?", "for": "This is for you.", "funny": "The clown is funny.", "go": "We go to school.",
    "help": "I can help you.", "here": "The cat is here.", "I": "I like to jump.", "in": "The fish is in the bowl.",
    "is": "It is a big tree.", "it": "I like it.", "jump": "I can jump up.", "little": "I see a little bug.",
    "look": "Look at the dog.", "make": "We make a cake.", "me": "Play with me.", "my": "This is my hat.",
    "not": "It is not red.", "one": "I have one apple.", "play": "We play ball.", "red": "I see a red bus.",
    "run": "I can run fast.", "said": "Mom said yes.", "see": "I see the sun.", "the": "The cat can jump.",
    "three": "I have three pets.", "to": "We go to the park.", "two": "I see two birds.", "up": "Look up at the sky.",
    "we": "We like to read.", "where": "Where is my cat?", "yellow": "The sun is yellow.", "you": "I like you.",
}
assert len(WORDS) == 40
for w, s in WORDS.items():
    assert w.lower() in s.lower().replace("?", "").replace(".", "").split(), (w, s)
R = random.Random(40)
LIST = list(WORDS)


def find_grid(word):
    """12 cells: 4 targets + 8 look-alike distractors (shared first letter or length first)."""
    others = [w for w in LIST if w != word]
    others.sort(key=lambda o: (o[0].lower() != word[0].lower(), abs(len(o) - len(word)), R.random()))
    cells = [word] * 4 + others[:8]; R.shuffle(cells); return cells
GRIDS = {w: find_grid(w) for w in LIST}


def trace_word(c, word, x, base, size, dashed=True):
    c.saveState()
    t = c.beginText(); t.setTextOrigin(x, base); t.setFont("Body", size)
    t.setTextRenderMode(1 if dashed else 0); c.setStrokeColor(HexColor("#6B7280")); c.setLineWidth(1.6)
    if dashed: c.setDash(3, 2.5)
    t.textOut(word); t.setTextRenderMode(0); c.drawText(t)
    c.restoreState()


def grid(b, x, y, cells, word, cw, ch, fs, key):
    c = b.c
    for i, w in enumerate(cells):
        r, k = divmod(i, 4); cx, cy = x + k * cw, y - r * ch
        c.setStrokeColor(b.t.primary); c.setLineWidth(1.2); c.setFillColor(white)
        c.roundRect(cx + 3, cy - ch + 3, cw - 6, ch - 6, 8, fill=1)
        c.setFillColor(INK); c.setFont("Body", fs); c.drawCentredString(cx + cw / 2, cy - ch / 2 - fs * 0.3, w)
        if key and w == word:
            c.setStrokeColor(KEYRED); c.setLineWidth(2.5); c.ellipse(cx + 8, cy - ch + 7, cx + cw - 8, cy - 7)


def word_page(b, word):
    c, t = b.c, b.t
    y = b.header(f"Sight Word: {word}", "Dolch pre-primer")
    # read it
    c.setFillColor(t.light); c.roundRect(M, y - 92, 200, 92, 14, stroke=0, fill=1)
    c.setFillColor(t.primary); c.setFont("BodyB", 11); c.drawString(M + 12, y - 18, "READ IT")
    c.setFillColor(INK); fs = 58
    while c.stringWidth(word, "BodyB", fs) > 176: fs -= 2
    c.setFont("BodyB", fs); c.drawCentredString(M + 100, y - 78, word)
    # spell it (letter boxes)
    x0 = M + 220; c.setFillColor(t.primary); c.setFont("BodyB", 11); c.drawString(x0, y - 18, "SPELL IT: one letter in each box")
    bw = min(48, (W - M - x0) / len(word) - 6)
    for i in range(len(word)):
        c.setStrokeColor(INK); c.setLineWidth(1.4); c.roundRect(x0 + i * (bw + 6), y - 88, bw, 56, 6)
    y -= 116
    # trace it
    c.setFillColor(t.primary); c.setFont("BodyB", 11); c.drawString(M, y, "TRACE IT"); y -= 10
    h = 52; size = h / 0.86
    base = b.primary_lines(M, y, W - 2 * M, h)
    gap = (W - 2 * M) / 3
    for i in range(3):
        ww = c.stringWidth(word, "Body", size); trace_word(c, word, M + i * gap + (gap - ww) / 2, base, size)
    y = base - 30
    # write it
    c.setFillColor(t.primary); c.setFont("BodyB", 11); c.drawString(M, y, "WRITE IT"); y -= 10
    y = b.primary_lines(M, y, W - 2 * M, h) - 22
    y = b.primary_lines(M, y, W - 2 * M, h) - 30
    # find it
    c.setFillColor(t.primary); c.setFont("BodyB", 11); c.drawString(M, y, f'FIND IT: circle every "{word}"'); y -= 8
    grid(b, M, y, GRIDS[word], word, (W - 2 * M) / 4, 40, 20, False); y -= 3 * 40 + 26
    # read the sentence
    c.setFillColor(t.primary); c.setFont("BodyB", 11); c.drawString(M, y, f'READ IT: underline "{word}"'); y -= 34
    c.setFillColor(INK); c.setFont("Body", 26); c.drawString(M + 8, y, WORDS[word])


def checklist(b):
    y = b.header("My Sight Words", "Color each word you can read") - 6
    c = b.c; cw, ch = (W - 2 * M) / 5, 58
    for i, w in enumerate(LIST):
        r, k = divmod(i, 5); x, yy = M + k * cw, y - r * ch
        c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); c.roundRect(x + 4, yy - ch + 4, cw - 8, ch - 8, 10)
        c.setFillColor(INK); c.setFont("BodyB", 22); c.drawCentredString(x + cw / 2, yy - ch / 2 - 7, w)


def flashcards(b, words):
    c = b.c; cw, ch = (W - 2 * M) / 2, (H - 90) / 5
    for i, w in enumerate(words):
        r, k = divmod(i, 2); x, y = M + k * cw, H - 40 - r * ch
        c.setDash(5, 4); c.setStrokeColor(GREY); c.setLineWidth(1); c.rect(x, y - ch, cw, ch); c.setDash()
        c.setFillColor(b.t.primary); c.rect(x + 8, y - 16, cw - 16, 8, stroke=0, fill=1)
        c.setFillColor(INK); c.setFont("BodyB", 56); c.drawCentredString(x + cw / 2, y - ch / 2 - 20, w)


def keys(b):
    for i in range(0, 40, 8):
        b.page("keys"); y = b.header("Find It - Answer Key", f"Words {i + 1}-{i + 8}", name=False); b.key_stamp()
        for j, w in enumerate(LIST[i:i + 8]):
            col, row = divmod(j, 4); x = M + col * 262; yy = y - row * 152
            b.c.setFillColor(b.t.primary); b.c.setFont("BodyB", 12); b.c.drawString(x, yy, w); yy -= 8
            grid(b, x, yy, GRIDS[w], w, 63, 38, 13, True)


def art(b, x, y, w, h):
    c, t = b.c, b.t
    for i, (wd, col) in enumerate([("the", t.primary), ("and", HexColor("#E63946")), ("you", HexColor("#2A9D8F")), ("look", t.accent)]):
        cx = x + 30 + i * 118; cy = y + 60 + (i % 2) * 70
        c.setFillColor(col); c.roundRect(cx, cy, 104, 84, 14, stroke=0, fill=1)
        c.setFillColor(white); c.setFont("BodyB", 40); c.drawCentredString(cx + 52, cy + 28, wd)


def build(b):
    b.cover(["40 words", "trace • write • spell • find", "flash cards"])
    b.guide("One page for each of the 40 Dolch pre-primer sight words. Every page follows the same routine, so students "
            "work independently: read it, spell it, trace it, write it, find it in a grid, and read it in a simple sentence.",
            [("check", "My Sight Words checklist"), ("words", "40 sight word practice pages (A-Z order)"),
             ("cards", "Flash cards (10 per page)"), ("keys", "Find It answer keys"), ("terms", "Terms of use")],
            [("Routine", "Model the first page together. After that, students can complete one page per day as morning "
              "work or in a literacy center."), ("Flash cards", "Print on card stock, cut apart, and use for games such "
              "as Memory or Go Fish, or send home a ring of mastered words."),
             ("Word list", ", ".join(LIST))],
            "CCSS RF.K.3c (read common high-frequency words by sight), RF.1.3g, L.K.1a (print letters).")
    b.page("check"); checklist(b)
    for w in LIST:
        b.page("words"); word_page(b, w)
    for i in range(0, 40, 10):
        b.page("cards"); flashcards(b, LIST[i:i + 10])
    keys(b)
    b.terms()


LISTING = dict(
    tpt_title="Sight Word Worksheets | Dolch Pre-Primer | 40 Words | Kindergarten 1st Grade",
    price="$4.00. Range $3 to $5. Follow up with Primer, First and Second Grade lists and bundle them.",
    grades="Pre-K, Kindergarten, 1st", subjects="English Language Arts, Phonics, Reading", type="Worksheets, Printables, Flash Cards",
    description="""
Make sight word practice simple and routine! This no-prep pack has one page for each of the **40 Dolch pre-primer
sight words**. Every page follows the same predictable steps, so young learners can work independently.

**Each word page includes:**
- Read It
- Spell It (letter boxes)
- Trace It on handwriting lines
- Write It
- Find It: circle the word in a grid
- Read It in a simple sentence

**Also included:** a student checklist, 40 flash cards (10 per page) and answer keys for every Find It grid.

**Words:** a, and, away, big, blue, can, come, down, find, for, funny, go, help, here, I, in, is, it, jump, little,
look, make, me, my, not, one, play, red, run, said, see, the, three, to, two, up, we, where, yellow, you

**Standards:** RF.K.3c, RF.1.3g
""",
    keywords=["sight words", "Dolch sight words", "pre-primer", "high frequency words", "kindergarten reading",
              "sight word worksheets", "morning work", "literacy centers", "flash cards", "no prep"])

if __name__ == "__main__":
    b = Book("Sight-Words-Dolch-PrePrimer", "Sight Words", "Dolch Pre-Primer Practice Pages", "Pre-K - Grade 1", "sky", art,
             badge_line="NO PREP  •  40 WORDS  •  FLASH CARDS")
    run(build, b, inside=[3, 4, 21, 35, 44, 48], feature=4, feature_line=("One page per word", "READ • SPELL • TRACE • WRITE • FIND"),
        key_page=48, preview=[1, 2, 3, 4, 21, 44], listing=LISTING)
