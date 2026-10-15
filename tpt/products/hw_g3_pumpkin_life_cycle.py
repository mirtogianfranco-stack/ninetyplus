"""Pumpkin Life Cycle - Grade 3 Science (Ontario 2022, Growth and Changes in Plants). Passage, questions, sequencing,
labelling, hands-on pumpkin investigation, vocabulary, plants-and-people reflection, keys."""
import math, os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from kit import Book, run, style, W, H, M, INK, GREY, KEYRED
from kit.halloween import pumpkin, ORANGE, STEM, PUMPKIN_D
from reportlab.lib.colors import HexColor, white

ONT = ("Ontario Science and Technology Curriculum (2022), Grade 3, <b>Strand B Life Systems: Growth and Changes in "
       "Plants</b> (B1 relating science and technology to our changing world: the importance of plants to people and "
       "the environment; B2 exploring and understanding concepts: the life cycle of a flowering plant, plant parts and "
       "their functions, and how plants get energy from the Sun) and <b>Strand A STEM Skills and Connections</b> "
       "(A1 scientific research and experimentation: predicting, observing, measuring and recording).")

LEAF, SEED, YELLOW, SOIL = HexColor("#65A30D"), HexColor("#FEF3C7"), HexColor("#FACC15"), HexColor("#92400E")


def leaf(c, x, y, s, ang):
    c.saveState(); c.translate(x, y); c.rotate(ang); c.setFillColor(LEAF); c.setStrokeColor(HexColor("#3F6212")); c.setLineWidth(1)
    p = c.beginPath(); p.moveTo(0, 0); p.curveTo(s * 0.3, s * 0.45, s * 0.8, s * 0.4, s, 0); p.curveTo(s * 0.8, -s * 0.4, s * 0.3, -s * 0.45, 0, 0)
    c.drawPath(p, stroke=1, fill=1); c.restoreState()


def stage(c, k, x, y, s):
    """Draw life-cycle stage k (0-5) centred at (x, y) within size s."""
    c.saveState()
    if k in (1, 2):
        c.setFillColor(SOIL); c.rect(x - s * 0.45, y - s * 0.42, s * 0.9, s * 0.12, stroke=0, fill=1)
    if k == 0:
        for dx, dy, a in [(-0.18, 0.05, 20), (0.15, -0.08, -15), (0.02, 0.2, 60)]:
            c.saveState(); c.translate(x + dx * s, y + dy * s); c.rotate(a)
            c.setFillColor(SEED); c.setStrokeColor(HexColor("#B45309")); c.setLineWidth(1.2)
            c.ellipse(-s * 0.16, -s * 0.09, s * 0.16, s * 0.09, stroke=1, fill=1); c.restoreState()
    elif k == 1:
        c.setStrokeColor(HexColor("#3F6212")); c.setLineWidth(3); c.line(x, y - s * 0.3, x, y + s * 0.05)
        leaf(c, x, y + s * 0.05, s * 0.3, 25); leaf(c, x, y + s * 0.05, s * 0.3, 155)
    elif k == 2:
        c.setStrokeColor(HexColor("#3F6212")); c.setLineWidth(3)
        p = c.beginPath(); p.moveTo(x - s * 0.4, y - s * 0.28); p.curveTo(x - s * 0.1, y - s * 0.1, x + s * 0.1, y - s * 0.4, x + s * 0.42, y - s * 0.2)
        c.drawPath(p, stroke=1, fill=0)
        for t, a in [(-0.25, 70), (0.0, 110), (0.25, 60)]:
            leaf(c, x + t * s, y - s * 0.22, s * 0.32, a)
        c.setLineWidth(1.2); c.circle(x + s * 0.4, y - s * 0.12, s * 0.05)
    elif k == 3:
        leaf(c, x - s * 0.1, y - s * 0.25, s * 0.35, 200); leaf(c, x + s * 0.05, y - s * 0.25, s * 0.35, -20)
        c.setFillColor(YELLOW); c.setStrokeColor(HexColor("#A16207")); c.setLineWidth(1.2)
        p = c.beginPath()
        for i in range(10):
            a = math.radians(90 + 36 * i); r = s * 0.32 if i % 2 == 0 else s * 0.16
            (p.moveTo if i == 0 else p.lineTo)(x + r * math.cos(a), y + s * 0.05 + r * math.sin(a))
        p.close(); c.drawPath(p, stroke=1, fill=1)
        c.setFillColor(HexColor("#EA580C")); c.circle(x, y + s * 0.05, s * 0.06, stroke=0, fill=1)
    elif k == 4:
        leaf(c, x - s * 0.15, y + s * 0.05, s * 0.35, 160)
        c.setFillColor(HexColor("#4D7C0F")); c.setStrokeColor(HexColor("#365314")); c.setLineWidth(1.2)
        c.ellipse(x - s * 0.2, y - s * 0.3, x + s * 0.2, y + s * 0.0, stroke=1, fill=1)
        c.setFillColor(YELLOW); c.circle(x + s * 0.22, y - s * 0.12, s * 0.05, stroke=0, fill=1)
    elif k == 5:
        pumpkin(c, x, y - s * 0.08, s * 0.33, face=False)
    c.restoreState()


STAGES = ["seed", "sprout (seedling)", "vine with leaves", "flower", "green pumpkin", "ripe pumpkin"]

PASSAGE = [
    "Every pumpkin begins as a flat, cream-coloured <b>seed</b>. In Ontario, farmers and gardeners plant pumpkin seeds "
    "in late spring, after the danger of frost has passed. The seeds need warm soil, water and air to begin to grow.",
    "When a seed <b>germinates</b>, a tiny root pushes down into the soil and a shoot pushes up toward the light. The "
    "young plant is called a <b>seedling</b>. Its first two leaves, called seed leaves, are smooth. Soon, true leaves "
    "with jagged edges begin to grow.",
    "Pumpkin plants grow long stems called <b>vines</b> that spread across the ground. Big leaves catch sunlight. Plants "
    "use the energy from sunlight, along with water and air, to make their own food. Curly <b>tendrils</b> wrap around "
    "nearby things to hold the vine in place, and roots take in water and nutrients from the soil.",
    "In summer, bright yellow <b>flowers</b> open. Bees visit the flowers to collect nectar and pollen. As they move from "
    "flower to flower, they carry pollen with them. This is called <b>pollination</b>. A flower that has been pollinated "
    "can grow into a pumpkin.",
    "A small green pumpkin forms at the base of the flower. It grows bigger and bigger over many weeks. A pumpkin is "
    "a <b>fruit</b> because it holds the plant's seeds. By early fall, most pumpkins have turned orange and are ready to "
    "<b>harvest</b>. From seed to ripe pumpkin usually takes about three to four months.",
    "Inside each ripe pumpkin are hundreds of new seeds. If one of those seeds is planted next spring, the life cycle "
    "begins all over again!"]

MC = [("What does a seed need to begin to grow?", ["Snow, sand and darkness", "Warm soil, water and air", "Only sunlight", "Bees and flowers"], 1),
      ("What do tendrils do?", ["Make seeds", "Wrap around things to hold the vine in place", "Turn the pumpkin orange", "Collect pollen"], 1),
      ("Why is a pumpkin called a fruit?", ["It is sweet.", "It grows on a vine.", "It holds the plant's seeds.", "It is orange."], 2),
      ("Which happens first?", ["The pumpkin turns orange.", "Bees pollinate the flowers.", "The seed germinates.", "Farmers harvest the pumpkins."], 2)]
SA = [("Explain why bees are important to pumpkin plants. Use evidence from the text.",
       "Bees carry pollen from flower to flower (pollination). A pollinated flower can grow into a pumpkin (paragraph 4)."),
      ("How do pumpkin plants get the energy they need to grow?",
       "Their leaves catch sunlight; plants use energy from sunlight, with water and air, to make their own food (paragraph 3).")]

PARTS = [("roots", "take in water and nutrients"), ("vine (stem)", "carries water and holds up leaves"), ("leaf", "catches sunlight to make food"),
         ("tendril", "holds the vine in place"), ("flower", "makes pollen; becomes fruit"), ("fruit (pumpkin)", "holds the seeds")]
VOCAB = [("germinate", "when a seed begins to grow"), ("seedling", "a young plant"), ("pollination", "moving pollen from flower to flower"),
         ("tendril", "a curly part that wraps around things"), ("fruit", "the part of a plant that holds seeds"), ("harvest", "to pick crops when they are ripe")]
VORDER = [3, 0, 5, 1, 4, 2]  # shuffled definitions; VOCAB[i] matches letter of VORDER.index(i)


def passage_page(b):
    y = b.header("From Seed to Pumpkin", "Read  •  Science")
    st = style(13, 19.5)
    for i, para in enumerate(PASSAGE, 1):
        b.badge(M + 9, y - 9, i, r=9, fill=b.t.primary)
        y = b.para(para, M + 26, y, W - 2 * M - 26, st) - 11
    assert y > 60


def questions_page(b, key):
    y = b.header("From Seed to Pumpkin: Questions", "Show what you know")
    if key: b.key_stamp()
    c = b.c
    for i, (q, opts, a) in enumerate(MC, 1):
        b.badge(M + 10, y - 8, i)
        y = b.para(q, M + 28, y, W - 2 * M - 28, style(12, 15)) - 4
        for j, o in enumerate(opts):
            hit = key and j == a
            c.setStrokeColor(INK); c.setFillColor(KEYRED if hit else white); c.circle(M + 40, y - 9, 6.5, fill=1)
            c.setFillColor(white if hit else INK); c.setFont("BodyB", 8); c.drawCentredString(M + 40, y - 12, "ABCD"[j])
            y = b.para(o, M + 54, y, W - 2 * M - 60, style(11.5, 15, KEYRED if hit else INK)) - 3
        y -= 10
    for j, (q, a) in enumerate(SA, 5):
        y = b.question(j, q, y, 3, answer=a if key else None)


def cycle_page(b, key):
    y = b.header("Pumpkin Life Cycle", "Sequence the stages")
    if key: b.key_stamp()
    b.para("Cut out the stage cards. Glue them in order, starting at the seed. Write the name of each stage.", M, y, W - 2 * M, style(12.5, 17))
    c = b.c; cx, cy, R = W / 2, y - 300, 205
    for i in range(6):
        a = math.radians(90 - i * 60); x, yy = cx + R * math.cos(a), cy + R * math.sin(a)
        c.setStrokeColor(b.t.primary); c.setLineWidth(2); c.setFillColor(white); c.circle(x, yy, 62, fill=1)
        b.badge(x - 50, yy + 46, i + 1, r=11)
        c.setStrokeColor(GREY); c.setLineWidth(0.6); c.line(x - 46, yy - 74, x + 46, yy - 74)
        if key:
            stage(c, i, x, yy, 100)
            c.setFillColor(KEYRED); c.setFont("BodyB", 10); c.drawCentredString(x, yy - 71, STAGES[i])
        a2 = math.radians(90 - i * 60 - 30)  # arrow between stages
        ax, ay = cx + (R - 6) * math.cos(a2), cy + (R - 6) * math.sin(a2)
        c.saveState(); c.translate(ax, ay); c.rotate(-i * 60 - 30)
        c.setFillColor(b.t.accent); p = c.beginPath(); p.moveTo(-10, -7); p.lineTo(10, 0); p.lineTo(-10, 7); p.close(); c.drawPath(p, stroke=0, fill=1)
        c.restoreState()
    c.setFillColor(b.t.primary); c.setFont(b.t.display, 22); c.drawCentredString(cx, cy - 8, "PUMPKIN" if b.t.display == "Anton" else "Pumpkin")
    c.setFont(b.t.display, 16); c.drawCentredString(cx, cy - 30, "LIFE CYCLE" if b.t.display == "Anton" else "Life Cycle")


def cards_page(b):
    y = b.header("Life Cycle Cards", "Cut and glue", name=False)
    c = b.c; order = [3, 0, 5, 2, 4, 1]  # mixed up on purpose
    cw, ch = (W - 2 * M) / 3, 170
    for j, k in enumerate(order):
        r, col = divmod(j, 3); x, yy = M + col * cw, y - 20 - r * (ch + 20)
        c.setDash(5, 4); c.setStrokeColor(GREY); c.circle(x + cw / 2, yy - ch / 2, 64); c.setDash()
        stage(c, k, x + cw / 2, yy - ch / 2, 100)
    y -= 2 * (ch + 20) + 40
    b.para("<b>Word bank:</b> seed  •  sprout (seedling)  •  vine with leaves  •  flower  •  green pumpkin  •  ripe pumpkin",
           M, y, W - 2 * M, style(13, 18))


def plant_diagram(b, key):
    y = b.header("Parts of a Pumpkin Plant", "Label and explain")
    if key: b.key_stamp()
    c = b.c
    b.para("Use the word bank to label the parts of the plant. Then write what each part does.", M, y, W - 2 * M, style(12.5, 17))
    gy = y - 260; gx = M + 40
    c.setFillColor(SOIL); c.rect(gx - 20, gy - 40, 430, 40, stroke=0, fill=1)
    c.setStrokeColor(HexColor("#78350F")); c.setLineWidth(2)
    for dx in (-30, -10, 15, 30):  # roots
        c.line(gx + 60, gy, gx + 60 + dx, gy - 34)
    c.setStrokeColor(HexColor("#3F6212")); c.setLineWidth(5)
    p = c.beginPath(); p.moveTo(gx + 60, gy); p.curveTo(gx + 140, gy + 30, gx + 260, gy - 10, gx + 400, gy + 20); c.drawPath(p, stroke=1, fill=0)
    for t, a in [(130, 80), (200, 100), (280, 70)]:
        leaf(c, gx + t, gy + 12, 90, a)
    c.setLineWidth(1.5); c.circle(gx + 160, gy + 30, 10); c.circle(gx + 172, gy + 34, 6)  # tendril
    c.setFillColor(YELLOW); c.setStrokeColor(HexColor("#A16207"))
    p = c.beginPath()
    for i in range(10):
        a = math.radians(90 + 36 * i); r = 30 if i % 2 == 0 else 14
        (p.moveTo if i == 0 else p.lineTo)(gx + 255 + r * math.cos(a), gy + 110 + r * math.sin(a))
    p.close(); c.drawPath(p, stroke=1, fill=1)
    c.setStrokeColor(HexColor("#3F6212")); c.setLineWidth(3); c.line(gx + 255, gy + 80, gx + 255, gy + 5)
    pumpkin(c, gx + 380, gy + 52, 48, face=False)
    targets = [(gx + 60, gy - 30), (gx + 99, gy + 9), (gx + 192, gy + 56), (gx + 172, gy + 40), (gx + 255, gy + 135), (gx + 400, gy + 90)]
    labels = [(M, gy - 70), (M + 150, gy - 70), (M, gy + 170), (M + 30, gy + 120), (W / 2 - 40, gy + 190), (W - M - 120, gy + 170)]
    for i, ((tx, ty), (lx, ly)) in enumerate(zip(targets, labels)):
        c.setStrokeColor(INK); c.setLineWidth(1); c.line(tx, ty, lx + 60, ly + 18)
        c.setFillColor(white); c.roundRect(lx, ly, 120, 26, 6, fill=1)
        if key:
            c.setFillColor(KEYRED); c.setFont("BodyB", 10.5); c.drawCentredString(lx + 60, ly + 9, PARTS[i][0])
    y = gy - 100
    rows = [(p[0] if key else "", p[1] if key else "") for p in PARTS]
    c.setFont("BodyB", 11); c.setFillColor(INK)
    b.para("<b>Word bank:</b> roots • vine (stem) • leaf • tendril • flower • fruit (pumpkin)", M, y, W - 2 * M, style(12, 16))
    y -= 26
    top = y; b.table(["Part", "What does it do?"], [("", "")] * 6, M, y, [140, W - 2 * M - 140], rh=26, fs=11)
    if key:
        for i, (part, job) in enumerate(PARTS):
            c.setFillColor(KEYRED); c.setFont("BodyB", 10.5)
            c.drawString(M + 6, top - 26 * (i + 2) + 9, part); c.drawString(M + 146, top - 26 * (i + 2) + 9, job)


def investigation(b):
    y = b.header("Pumpkin Investigation", "Predict  •  observe  •  measure")
    b.para("You will need: a real pumpkin, string, a metre stick or ruler, a tub of water, and a spoon.", M, y, W - 2 * M, style(12, 16))
    y -= 30
    rows = [("How many centimetres around is the pumpkin? (Wrap string around the widest part, then measure the string.)", "cm"),
            ("How many lines (ribs) run from top to bottom?", "lines"),
            ("Will the pumpkin sink or float in water?", "sink / float"),
            ("How many seeds are inside? (Count by 10s: make groups of 10.)", "seeds"),
            ("What colour is the pumpkin inside? What does it smell like?", "")]
    c = b.c
    c.setFillColor(b.t.dark); c.rect(M, y - 26, W - 2 * M, 26, stroke=0, fill=1)
    c.setFillColor(white); c.setFont("BodyB", 11)
    c.drawString(M + 8, y - 17, "Question"); c.drawCentredString(M + 350, y - 17, "My prediction"); c.drawCentredString(M + 460, y - 17, "Result")
    y -= 26
    for i, (q, unit) in enumerate(rows):
        rh = 74
        c.setFillColor(b.t.light if i % 2 == 0 else white); c.rect(M, y - rh, W - 2 * M, rh, stroke=0, fill=1)
        b.para(q, M + 8, y - 6, 280, style(11, 14.5))
        c.setFillColor(GREY); c.setFont("Body", 9)
        c.drawRightString(M + 400, y - rh + 10, unit); c.drawRightString(W - M - 6, y - rh + 10, unit)
        y -= rh
    c.setStrokeColor(b.t.dark); c.setLineWidth(1); c.rect(M, y, W - 2 * M, 26 + 5 * 74)
    c.line(M + 296, y, M + 296, y + 5 * 74 + 26); c.line(M + 408, y, M + 408, y + 5 * 74 + 26)
    y -= 26
    y = b.question(1, "Which prediction was closest? What surprised you?", y, 2)


def vocab_page(b, key):
    y = b.header("Plant Words", "Vocabulary match")
    if key: b.key_stamp()
    b.para("Draw a line from each word to its meaning.", M, y, W - 2 * M, style(12.5, 17))
    c = b.c; y -= 40
    for i, (w, _) in enumerate(VOCAB):
        yy = y - i * 70
        c.setFillColor(b.t.light); c.setStrokeColor(b.t.primary); c.roundRect(M, yy - 40, 170, 40, 10, fill=1)
        c.setFillColor(INK); c.setFont("BodyB", 15); c.drawCentredString(M + 85, yy - 26, w)
        c.setFillColor(INK); c.circle(M + 182, yy - 20, 4, stroke=0, fill=1)
        d = VOCAB[VORDER[i]][1]
        c.setFillColor(white); c.roundRect(W - M - 250, yy - 40, 250, 40, 10, fill=1)
        c.circle(W - M - 262, yy - 20, 4, stroke=0, fill=1)
        b.para(d, W - M - 240, yy - 8, 230, style(11.5, 14))
    if key:
        c.setStrokeColor(KEYRED); c.setLineWidth(2)
        for i in range(6):
            j = VORDER.index(i)
            c.line(M + 182, y - i * 70 - 20, W - M - 262, y - j * 70 - 20)
    y -= 6 * 70 + 10
    b.question(7, "Choose two words. Use them together in one sentence about pumpkins.", y, 2,
               answer="Example: After bees help with pollination, the farmer will harvest the fruit." if key else None)


def reflect(b):
    y = b.header("Pumpkins, People & Animals", "Science and our world")
    for i, q in enumerate(["Name three ways people use pumpkins.",
                           "Pumpkins and their flowers are food for animals and insects. Name one animal or insect that might use a pumpkin plant.",
                           "Many pumpkins are thrown away after Halloween. Describe one way to reduce this waste.",
                           "Design a sign for your school garden that explains what pumpkin plants need to grow."], 1):
        y = b.question(i, q, y, 4 if i < 4 else 6)


def build(b):
    b.cover(["passage", "life cycle", "investigation", "Ontario aligned"])
    b.guide("A complete pumpkin plant mini-unit for Grade 3 science. Students read about the life cycle of a pumpkin, "
            "sequence and label the stages, learn plant parts and their functions, investigate a real pumpkin, build "
            "vocabulary, and connect plants to people and the environment.",
            [("pass", "Reading passage: From Seed to Pumpkin"), ("q", "Comprehension questions"),
             ("cycle", "Pumpkin Life Cycle sequencing mat"), ("cards", "Life Cycle cut-and-glue cards"),
             ("parts", "Parts of a Pumpkin Plant (label + functions)"), ("inv", "Pumpkin Investigation (hands-on)"),
             ("vocab", "Plant Words vocabulary match"), ("refl", "Pumpkins, People & Animals reflection"),
             ("keys", "Answer keys"), ("terms", "Terms of use")],
            [("Investigation tips", "One pumpkin per group works well. Most pumpkins float because they are hollow and "
              "full of air. Students are often surprised! Count seeds in groups of 10 to practise skip counting."),
             ("Safety", "An adult should do all cutting. Check for food allergies and wash hands after handling seeds.")], ONT)
    b.page("pass"); passage_page(b)
    b.page("q"); questions_page(b, False)
    b.page("cycle"); cycle_page(b, False)
    b.page("cards"); cards_page(b)
    b.page("parts"); plant_diagram(b, False)
    b.page("inv"); investigation(b)
    b.page("vocab"); vocab_page(b, False)
    b.page("refl"); reflect(b)
    b.page("keys"); questions_page(b, True)
    b.page("keys"); cycle_page(b, True)
    b.page("keys"); plant_diagram(b, True)
    b.page("keys"); vocab_page(b, True)
    b.terms()


LISTING = dict(
    tpt_title="Pumpkin Life Cycle Grade 3 Science | Growth and Changes in Plants | Ontario 2022",
    price="$4.50. Range $4 to $5.", grades="3rd (also 2nd)", subjects="Science, Halloween, Autumn",
    type="Unit Plans, Reading Passages, Activities",
    description="""
Bring Grade 3 **Growth and Changes in Plants** to life this fall with a no-prep pumpkin mini-unit aligned to the
**Ontario Science and Technology Curriculum (2022)**.

**What's included:**
- From Seed to Pumpkin: original nonfiction passage with numbered paragraphs
- Comprehension questions (multiple choice and text evidence)
- Pumpkin Life Cycle sequencing mat, plus cut-and-glue stage cards
- Parts of a Pumpkin Plant: label the diagram and explain each part's function
- Hands-on Pumpkin Investigation: predict, measure in centimetres, sink or float, count seeds by 10s
- Plant Words vocabulary match
- Pumpkins, People & Animals reflection (importance of plants, reducing waste)
- Answer keys and a teacher guide with safety tips

**Ontario curriculum:** Grade 3 Strand B Life Systems, Growth and Changes in Plants, and Strand A STEM Skills and Connections
""",
    keywords=["pumpkin life cycle", "Ontario science", "growth and changes in plants", "grade 3 science", "plant life cycle",
              "Halloween science", "fall science", "pumpkin investigation", "plant parts", "no prep"])

if __name__ == "__main__":
    b = Book("Pumpkin-Life-Cycle-Grade-3-Science-Ontario", "Pumpkin Life Cycle", "Growth & Changes in Plants",
             "Grade 3", "spooky", lambda b, x, y, w, h: [stage(b.c, k, x + 60 + k * (w - 120) / 5, y + h / 2, 90) for k in range(6)],
             ribbon="ONTARIO CURRICULUM")
    run(build, b, inside=[3, 5, 7, 8, 9, 10], feature=5, feature_line=("Seed to pumpkin", "SEQUENCE • LABEL • INVESTIGATE"),
        key_page=12, preview=[1, 2, 3, 5, 7, 8], listing=LISTING)
