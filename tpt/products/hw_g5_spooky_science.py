"""Spooky Science: Physical & Chemical Changes - Grade 5 (Ontario Science 2022, Properties of and Changes in Matter).
Passage, questions, 16-card sort, Witch's Brew lab, quiz, keys."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from kit import Book, run, style, W, H, M, INK, GREY, KEYRED
from kit.halloween import pumpkin, ghost, bat, candy_corn, ORANGE, PURPLE, NIGHT, LIME
from reportlab.lib.colors import HexColor, white

ONT = ("Ontario Science and Technology Curriculum (2022), Grade 5, <b>Strand C Matter and Energy: Properties of and "
       "Changes in Matter</b> (C2 exploring and understanding concepts: distinguishing between physical and chemical "
       "changes and identifying evidence of chemical change, such as gas, colour change, new smell or heat; C1 relating "
       "science to everyday life) and <b>Strand A STEM Skills and Connections</b> (A1 scientific experimentation: "
       "predicting, observing, recording and drawing conclusions safely).")

PASSAGE = [
    "Halloween is full of changes. Pumpkins are carved, candles glow and treats are baked. Scientists sort changes in "
    "<b>matter</b> into two groups: <b>physical changes</b> and <b>chemical changes</b>.",
    "In a physical change, matter changes its size, shape or state, but it is still the same substance. When you carve "
    "a pumpkin, it is still pumpkin. When candle wax melts, it is still wax, and it becomes solid again as it cools. "
    "Dissolving sugar in water is also a physical change: the sugar is still there, even though you cannot see it. "
    "Many physical changes can be reversed.",
    "In a chemical change, the particles of a substance rearrange to make one or more <b>new substances</b> with new "
    "properties. A burning candle wick turns into ash, smoke and gases. A jack-o'-lantern left on the porch for weeks "
    "begins to rot as tiny living things break it down. Chemical changes are usually very hard or impossible to reverse.",
    "How can you tell that a chemical change happened? Look for evidence: <b>bubbles of gas</b> that were not there "
    "before, an unexpected <b>colour change</b>, a <b>new smell</b>, <b>heat or light</b> given off, or a new solid "
    "forming. Toasting pumpkin seeds turns them brown and gives them a new smell, so a chemical change has happened.",
    "Be careful: one clue alone is not always proof. Boiling water makes bubbles, but it is a physical change because the "
    "bubbles are just water in the gas state. Scientists look at all the evidence before they decide."]

MC = [("Which is the best definition of a chemical change?", ["Matter changes size or shape.", "A new substance with new properties is formed.", "A solid melts into a liquid.", "Something is cut into pieces."], 1),
      ("Carving a pumpkin is a physical change because...", ["the pumpkin rots.", "a new smell is produced.", "it is still pumpkin, just a new shape.", "it gives off light."], 2),
      ("Which is evidence of a chemical change?", ["Ice melting", "Gas bubbles forming when two substances are mixed", "Paper being folded", "Sugar dissolving in water"], 1),
      ("Why is boiling water NOT a chemical change, even though it makes bubbles?", ["The bubbles are a new substance.", "The bubbles are water in the gas state.", "Boiling water gives off light.", "Water cannot change state."], 1)]
SA = [("Explain why toasting pumpkin seeds is a chemical change. Use two pieces of evidence from the text.",
       "The seeds turn brown (colour change) and have a new smell, which shows a new substance formed (paragraph 4)."),
      ("Choose one physical change from the passage and explain how it could be reversed.",
       "Melted candle wax becomes solid again as it cools; or dissolved sugar can be recovered by evaporating the water.")]

CARDS = [("Carving a jack-o'-lantern", "P"), ("A pumpkin rotting on the porch", "C"), ("Candle wax melting", "P"),
         ("A candle wick burning", "C"), ("Dissolving sugar in warm water", "P"), ("Baking a pumpkin pie", "C"),
         ("Baking soda and vinegar fizzing", "C"), ("Crushing a candy cane", "P"), ("Freezing apple cider", "P"),
         ("A cut apple turning brown", "C"), ("Snapping a glow stick so it glows", "C"), ("Cutting fabric for a costume", "P"),
         ("Toasting a marshmallow", "C"), ("Mixing two colours of face paint", "P"), ("A rusty nail on a haunted gate", "C"),
         ("Water boiling in a kettle", "P")]
assert sum(1 for _, k in CARDS if k == "P") == 8

QUIZ = [("Melting chocolate is a chemical change.", False, "Physical: still chocolate, can be cooled and hardened again."),
        ("Rust forming on a nail is a chemical change.", True, "A new substance (rust) forms."),
        ("A colour change can be evidence of a chemical change.", True, "One of the signs, but check all the evidence."),
        ("Tearing a paper ghost is a chemical change.", False, "Physical: only the size and shape change."),
        ("Chemical changes are usually easy to reverse.", False, "They are usually very hard or impossible to reverse."),
        ("When baking soda and vinegar mix, the bubbles are a new gas.", True, "Carbon dioxide gas forms: a chemical change."),
        ("Dissolving salt in water makes a new substance.", False, "Physical: the salt is still there and can be recovered by evaporation."),
        ("Burning a candle wick produces new substances.", True, "Ash, smoke and gases are new substances.")]


def passage_page(b):
    y = b.header("Physical or Chemical?", "Read  •  Science")
    for i, para in enumerate(PASSAGE, 1):
        b.badge(M + 9, y - 9, i, r=9, fill=b.t.primary)
        y = b.para(para, M + 26, y, W - 2 * M - 26, style(12.6, 19)) - 11
    c = b.c; t = b.t
    c.setFillColor(t.light); c.setStrokeColor(t.primary); c.setLineWidth(1.5); c.roundRect(M, 48, W - 2 * M, 96, 12, fill=1)
    c.setFillColor(t.primary); c.setFont("BodyB", 12); c.drawString(M + 14, 124, "EVIDENCE OF A CHEMICAL CHANGE")
    b.para("• gas bubbles   • colour change   • new smell   • heat or light given off   • a new solid forms",
           M + 14, 112, W - 2 * M - 28, style(12, 16))
    b.para("<i>Remember: look at all the evidence!</i>", M + 14, 84, W - 2 * M - 28, style(11, 15))
    assert y > 150


def questions_page(b, key):
    y = b.header("Physical or Chemical? Questions", "Show what you know")
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


def sort_mat(b, key):
    y = b.header("Card Sort: Physical or Chemical?", "Sort and justify")
    if key: b.key_stamp()
    b.para("Cut out the 16 cards. Sort them into the correct column. Glue them down, then answer the question below.", M, y, W - 2 * M, style(12, 16))
    c = b.c; y -= 34; cw = (W - 2 * M - 16) / 2; ch = 430
    for i, (title, code) in enumerate([("PHYSICAL CHANGE", "P"), ("CHEMICAL CHANGE", "C")]):
        x = M + i * (cw + 16)
        c.setFillColor(b.t.dark); c.roundRect(x, y - 40, cw, 40, 10, stroke=0, fill=1)
        c.setFillColor(white); c.setFont("Anton", 18); c.drawCentredString(x + cw / 2, y - 28, title)
        c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); c.roundRect(x, y - 40 - ch, cw, ch, 10)
        sub = "same substance, new size, shape or state" if code == "P" else "new substance is formed"
        c.setFillColor(GREY); c.setFont("Body", 10); c.drawCentredString(x + cw / 2, y - 56, sub)
        if key:
            items = [t for t, k in CARDS if k == code]
            for j, t in enumerate(items):
                c.setFillColor(KEYRED); c.setFont("BodyB", 11.5); c.drawString(x + 14, y - 86 - j * 26, f"• {t}")
    y -= ch + 60
    b.question(1, "Choose one card from the chemical column. What evidence tells you a new substance formed?", y, 1,
               answer="Example: baking soda and vinegar give off gas bubbles (a new gas forms)." if key else None)


def cards_page(b):
    y = b.header("Card Sort Cards", "Cut along the dashed lines", name=False)
    c = b.c; cw, ch = 120, 100; x0 = (W - 4 * cw) / 2
    order = [0, 6, 3, 9, 13, 2, 15, 10, 4, 12, 7, 1, 11, 14, 5, 8]
    for j, i in enumerate(order):
        r, k = divmod(j, 4); x, yy = x0 + k * cw, y - r * ch
        c.setDash(5, 4); c.setStrokeColor(GREY); c.rect(x, yy - ch, cw, ch); c.setDash()
        c.setFillColor(b.t.light); c.roundRect(x + 8, yy - ch + 8, cw - 16, ch - 16, 10, stroke=0, fill=1)
        b.para(CARDS[i][0], x + 14, yy - 20, cw - 28, style(11.5, 15, align=1))
        c.setFillColor(GREY); c.setFont("Body", 7); c.drawRightString(x + cw - 14, yy - ch + 14, f"#{i + 1}")
    b.para("Cards are sized to fit two across and four down in each column of the sort mat.", M, y - 4 * ch - 20, W - 2 * M, style(10.5, 14, GREY, align=1))


def lab_page(b, key):
    y = b.header("Witch's Brew Lab", "Investigate a change")
    if key: b.key_stamp()
    c = b.c
    y = b.para("<b>Question:</b> When baking soda and vinegar are mixed, is it a physical or a chemical change?", M, y, W - 2 * M, style(12.5, 17)) - 8
    y = b.para("<b>Materials:</b> clear cup or small jar, 15 mL (1 tbsp) baking soda, 125 mL (1/2 cup) vinegar, a few drops of "
               "dish soap, green or purple food colouring, tray, safety goggles", M, y, W - 2 * M, style(11.5, 15.5)) - 8
    y = b.para("<b>Safety:</b> Wear goggles. Do the lab on a tray with an adult. Never taste lab materials. Wash your hands after.",
               M, y, W - 2 * M, style(11.5, 15.5, KEYRED)) - 8
    y = b.para("<b>Procedure:</b> (1) Put the baking soda in the cup. (2) Add dish soap and 3 drops of food colouring. "
               "(3) Make your prediction. (4) Pour in the vinegar and observe closely for 1 minute. (5) Feel the outside of the cup.",
               M, y, W - 2 * M, style(11.5, 15.5)) - 14
    ans = {1: "Predictions will vary.",
           2: "Fizzing and foaming; bubbles of gas; the foam rises and may overflow; the cup may feel slightly cooler.",
           3: "Bubbles of a new gas formed (carbon dioxide) that were not there before.",
           4: "Chemical change: a new substance (carbon dioxide gas) formed, and it cannot easily be reversed."}
    y = b.question(1, "<b>Prediction:</b> What do you think will happen when you add the vinegar?", y, 2, answer=ans[1] if key else None)
    y = b.question(2, "<b>Observations:</b> Describe what you see, hear and feel. (Draw a quick sketch on the back.)", y, 3, answer=ans[2] if key else None)
    y = b.question(3, "<b>Evidence:</b> What evidence of a chemical change did you observe?", y, 2, answer=ans[3] if key else None)
    y = b.question(4, "<b>Conclusion:</b> Was this a physical or a chemical change? Explain.", y, 2, answer=ans[4] if key else None)


def quiz_page(b, key):
    y = b.header("Spooky Science Check-Up", "True or false?")
    if key: b.key_stamp()
    c = b.c
    y = b.para("Circle <b>T</b> for true or <b>F</b> for false. If the statement is false, fix it to make it true.", M, y, W - 2 * M, style(12, 16)) - 10
    for i, (s, tf, why) in enumerate(QUIZ, 1):
        b.badge(M + 10, y - 8, i)
        b.para(s, M + 28, y, 400, style(12, 15))
        for j, l in enumerate("TF"):
            x = W - M - 70 + j * 40
            c.setFillColor(INK); c.setFont("BodyB", 16); c.drawCentredString(x, y - 14, l)
            if key and ((l == "T") == tf):
                c.setStrokeColor(KEYRED); c.setLineWidth(2.5); c.circle(x, y - 9, 13)
        c.setStrokeColor(GREY); c.setLineWidth(0.6); c.line(M + 28, y - 44, W - M, y - 44)
        if key:
            b.para(f'<font color="#D62828">{why}</font>', M + 30, y - 26, W - 2 * M - 40, style(10, 13))
        y -= 66


def art(b, x, y, w, h):
    c = b.c
    c.setFillColor(NIGHT); c.roundRect(x, y, w, h, 22, stroke=0, fill=1)
    # cauldron with bubbles
    cx, cy = x + w / 2, y + 70
    c.setFillColor(HexColor("#111827")); c.ellipse(cx - 110, cy - 60, cx + 110, cy + 60, stroke=0, fill=1)
    c.setFillColor(LIME); c.ellipse(cx - 96, cy + 34, cx + 96, cy + 62, stroke=0, fill=1)
    for bx, by, r in [(-40, 80, 16), (10, 100, 22), (55, 84, 12), (-5, 140, 10), (30, 150, 14), (-30, 170, 8)]:
        c.setStrokeColor(LIME); c.setLineWidth(3); c.setFillColor(HexColor("#BEF264")); c.circle(cx + bx, cy + by, r, stroke=1, fill=1)
    pumpkin(c, x + 80, y + 60, 44); ghost(c, x + w - 90, y + 30, 110); bat(c, x + 90, y + h - 50, 70)


def build(b):
    b.cover(["passage", "card sort", "Witch's Brew lab", "Ontario aligned"])
    b.guide("A Halloween-themed mini-unit on physical and chemical changes for Grade 5. Students read about the two "
            "types of change and the evidence of chemical change, sort 16 real-life Halloween examples, run a safe "
            "baking soda and vinegar investigation, and check their understanding.",
            [("pass", "Reading passage: Physical or Chemical?"), ("q", "Comprehension questions"), ("mat", "Card sort mat"),
             ("cards", "16 card sort cards"), ("lab", "Witch's Brew Lab (investigation)"), ("quiz", "Spooky Science Check-Up (true/false)"),
             ("keys", "Answer keys"), ("terms", "Terms of use")],
            [("Lab tips", "Groups of 3 or 4 work well. Adding dish soap makes the foam rise like a bubbling cauldron. The "
              "cup may feel slightly cooler because this reaction absorbs heat, which is a great discussion point."),
             ("Discussion", "Some cards spark debate (for example, mixing face paint or a glow stick). Ask students to "
              "justify their thinking with evidence.")], ONT)
    b.page("pass"); passage_page(b)
    b.page("q"); questions_page(b, False)
    b.page("mat"); sort_mat(b, False)
    b.page("cards"); cards_page(b)
    b.page("lab"); lab_page(b, False)
    b.page("quiz"); quiz_page(b, False)
    for fn in (questions_page, sort_mat, lab_page, quiz_page):
        b.page("keys"); fn(b, True)
    b.terms()


LISTING = dict(
    tpt_title="Halloween Science Physical and Chemical Changes Grade 5 | Ontario Science 2022",
    price="$4.50. Range $4 to $5.", grades="5th (also 4th and 6th)", subjects="Science, Chemistry, Halloween",
    type="Activities, Reading Passages, Lab",
    description="""
Teach **physical and chemical changes** with a Halloween twist! This Grade 5 mini-unit is aligned to the
**Ontario Science and Technology Curriculum (2022), Properties of and Changes in Matter**.

**What's included:**
- Physical or Chemical? Original reading passage with an evidence checklist
- Comprehension questions (multiple choice and written response)
- 16-card sort with Halloween examples: carving pumpkins, rotting jack-o'-lanterns, melting wax, glow sticks, rust and more
- Witch's Brew Lab: a safe baking soda and vinegar investigation (prediction, observations, evidence, conclusion)
- Spooky Science Check-Up: 8 true/false questions with "fix it" corrections
- Answer keys and a teacher guide with lab tips

**Ontario curriculum:** Grade 5 Strand C Matter and Energy (Properties of and Changes in Matter), Strand A STEM Skills

Metric units and Canadian spelling throughout.
""",
    keywords=["physical and chemical changes", "Ontario science", "grade 5 science", "Halloween science", "properties of matter",
              "card sort", "science lab", "baking soda and vinegar", "changes in matter", "no prep"])

if __name__ == "__main__":
    b = Book("Spooky-Science-Physical-Chemical-Changes-Grade-5-Ontario", "Spooky Science", "Physical & Chemical Changes",
             "Grade 5", "potion", art, ribbon="ONTARIO CURRICULUM")
    run(build, b, inside=[3, 5, 6, 7, 8, 9], feature=5, feature_line=("Sort, test & explain", "16 HALLOWEEN CARDS • SAFE LAB"),
        key_page=10, preview=[1, 2, 3, 5, 7], listing=LISTING)
