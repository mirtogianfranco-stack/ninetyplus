"""Dear Santa Persuasive Letter (Grades 3-6, Ontario Language 2023): OREO anchor, annotated mentor letter, questions,
parts of a friendly letter, word bank, prompts (with non-Santa options), planners, letter paper, checklist, rubric, keys."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
from kit import Book, run, style, W, H, M, INK, GREY, KEYRED
from kit.christmas import ornament, gift, candy_cane, stocking, bell, star, santa_hat, gingerbread, RED, GREEN, GOLD, DKGREEN, BROWN
from kit.janfeb import envelope
from reportlab.lib.colors import white, HexColor

ONT = ("Ontario Language Curriculum (2023), Grades 3-6: <b>Strand D Composition</b> (D1 developing ideas and organizing "
       "content for a specific purpose and audience; D2 creating texts using persuasive forms, voice, word choice and "
       "transitions; D3 publishing and reflecting) and <b>Strand C Comprehension</b> (analysing the structure of a mentor "
       "text). The rubric uses the four categories of the Ontario achievement chart.")

OREO = [("O", "Opinion", "Say what you want or what you think.", DKGREEN),
        ("R", "Reasons", "Give reasons why the reader should agree.", RED),
        ("E", "Examples", "Back up each reason with an example, a fact or a detail.", BROWN),
        ("O", "Opinion again", "Restate your opinion in a new way, then end politely.", DKGREEN)]

MENTOR = [  # (label or None, text)
 ("O", "I think the best gift you could bring me this year is a pair of <b>snowshoes</b>."),
 ("R", "<b>First</b>, snowshoes would help me get outside more."),
 ("E", "Every winter, our backyard fills with deep snow, and I sink to my knees when I try to walk through it. With "
       "snowshoes, I could explore the trail behind our house all winter long."),
 ("R", "<b>Second</b>, snowshoes would be good for my health."),
 ("E", "My gym teacher says kids should be active for at least 60 minutes every day. Snowshoeing is great exercise, and it "
       "is so much fun that it doesn't even feel like exercise."),
 ("R", "<b>Most importantly</b>, I would share them."),
 ("E", "My little brother could borrow them, and my dad says he would teach us both how to snowshoe on the weekends."),
 ("O", "<b>That is why</b> snowshoes are the perfect gift for me. Thank you for reading my letter, and please say hello "
       "to the reindeer!")]

MQ = [("What is Maya's opinion?", "The best gift Santa could bring her is a pair of snowshoes."),
      ("List Maya's three reasons.", "1) Snowshoes would help her get outside more. 2) They would be good for her health. 3) She would share them."),
      ("Which example supports her second reason?", "Her gym teacher says kids should be active for at least 60 minutes every day, and snowshoeing is great exercise that is fun."),
      ("Find four transition words or phrases Maya uses.", "First, Second, Most importantly, That is why."),
      ("How does Maya restate her opinion at the end?", "\"That is why snowshoes are the perfect gift for me.\""),
      ("Which reason do you think is the most convincing? Why?", "Answers vary; look for a reason supported by the letter.")]

PARTS = ["date", "greeting", "body", "closing", "signature"]

WORDS = [("Start strong", ["I think", "I believe", "In my opinion", "I strongly feel", "I would love"]),
         ("Add reasons", ["First,", "Second,", "Next,", "Also,", "In addition,", "Plus,"]),
         ("Give examples", ["For example,", "For instance,", "This means", "Such as", "Because"]),
         ("Save the best", ["Most importantly,", "Best of all,", "The main reason", "Above all,"]),
         ("Wrap it up", ["That is why", "In conclusion,", "As you can see,", "For all these reasons,"]),
         ("Power words", ["perfect", "important", "helpful", "amazing", "fair", "responsible", "deserve", "share"])]

PROMPTS = ["<b>Dear Santa:</b> Persuade Santa to bring you one special gift. Explain why it is the perfect gift for you.",
           "<b>Dear Santa:</b> Persuade Santa to bring a gift for <b>someone else</b>: a family member, a friend or your community.",
           "<b>Dear Principal:</b> Persuade your principal to add a winter event at school, such as an outdoor skating or snow day.",
           "<b>Dear Family:</b> Persuade your family to start a new winter tradition together.",
           "<b>Dear Mayor:</b> Persuade your mayor to build something for winter fun in your community, like a rink or a toboggan hill.",
           "<b>Dear Teacher:</b> Persuade your teacher that your class should have a cozy pyjama and book day before the break."]

RUBRIC = [("Knowledge and\nUnderstanding", ["limited understanding of persuasive structure (opinion, reasons, examples)",
                                             "some understanding of persuasive structure", "considerable understanding of persuasive structure",
                                             "thorough understanding of persuasive structure"]),
          ("Thinking", ["reasons are seldom relevant or supported", "some reasons are relevant and supported with examples",
                        "reasons are relevant and supported with clear examples", "reasons are convincing and well supported with strong examples"]),
          ("Communication", ["limited organization; few transitions; letter format missing", "some organization and transitions; some letter parts",
                             "clear organization, transitions and letter format; voice suits the reader",
                             "highly effective organization, transitions and voice; complete letter format"]),
          ("Application", ["conventions (spelling, grammar, punctuation) used with limited accuracy",
                           "conventions used with some accuracy", "conventions used with considerable accuracy",
                           "conventions used with a high degree of accuracy; persuasive word choice"])]


def letter_art(b, x, y, w, h):
    c = b.c
    c.setFillColor(DKGREEN); c.roundRect(x, y, w, h, 22, stroke=0, fill=1)
    c.setFillColor(white); c.saveState(); c.translate(x + 150, y + 30); c.rotate(-6)
    c.rect(0, 0, 150, 185, stroke=0, fill=1)
    c.setFillColor(INK); c.setFont("BodyB", 12); c.drawString(14, 160, "Dear Santa,")
    c.setStrokeColor(HexColor("#CBD5E1")); c.setLineWidth(1)
    for k in range(7): c.line(14, 140 - k * 18, 136, 140 - k * 18)
    c.restoreState()
    envelope(c, x + 30, y + 30, 120, 80)
    santa_hat(c, x + w - 150, y + 120, 100); stocking(c, x + w - 90, y + 20, 90)
    gift(c, x + w - 200, y + 24, 70, RED, GOLD); candy_cane(c, x + 330, y + 30, 80)
    star(c, x + 50, y + h - 50, 18); star(c, x + w - 50, y + h - 40, 12)


def anchor(b):
    b.page("anchor")
    y = b.header("What Makes Writing Persuasive?", "Anchor chart: OREO", name=False)
    y = b.para("<b>Persuasive writing</b> tries to get the reader to agree with you or to do something. A strong persuasive "
               "letter is built like an <b>OREO</b> cookie: your opinion is on the outside, and your reasons and examples are the "
               "filling in the middle.", M, y, W - 2 * M, style(13.5, 19)) - 16
    c = b.c; bh = 104
    for i, (L, name, desc, col) in enumerate(OREO):
        top = y - i * (bh + 12)
        c.setFillColor(b.t.light); c.setStrokeColor(col); c.setLineWidth(2); c.roundRect(M, top - bh, W - 2 * M, bh, 14, fill=1)
        c.setFillColor(col); c.circle(M + 58, top - bh / 2, 40, stroke=0, fill=1)
        c.setFillColor(white); c.setFont("Anton", 40); c.drawCentredString(M + 58, top - bh / 2 - 14, L)
        c.setFillColor(col); c.setFont("Anton", 24); c.drawString(M + 118, top - 40, name.upper())
        b.para(desc, M + 118, top - 50, W - 2 * M - 136, style(13.5, 18))
    y -= 4 * (bh + 12) + 6
    b.para("<b>Remember your reader!</b> Be polite, use transition words, and choose reasons that matter to the person you "
           "are writing to.", M, y, W - 2 * M, style(13, 18, b.t.primary))


def mentor(b):
    b.page("mentor")
    y = b.header("Mentor Letter: Dear Santa", "Read and notice", name=False)
    c = b.c; col = {L: cl for L, _, _, cl in OREO}
    c.setFillColor(INK); c.setFont("Body", 12.5); c.drawRightString(W - M, y - 4, "December 1, 2026")
    c.setFont("BodyB", 13); c.drawString(M + 40, y - 30, "Dear Santa,"); y -= 46
    for L, t in MENTOR:
        c.setFillColor(col[L]); c.circle(M + 14, y - 10, 12, stroke=0, fill=1)
        c.setFillColor(white); c.setFont("Anton", 14); c.drawCentredString(M + 14, y - 15, L)
        y = b.para(t, M + 40, y, W - 2 * M - 40, style(13, 19)) - 10
    c.setFillColor(INK); c.setFont("Body", 13); c.drawString(M + 40, y - 10, "Your friend,")
    c.setFont("BodyB", 13); c.drawString(M + 40, y - 30, "Maya")
    y -= 56
    x = M
    for L, name, _, cl in OREO[:3]:
        c.setFillColor(cl); c.circle(x + 10, y, 9, stroke=0, fill=1); c.setFillColor(white); c.setFont("Anton", 11); c.drawCentredString(x + 10, y - 4, L)
        c.setFillColor(INK); c.setFont("Body", 11); c.drawString(x + 24, y - 4, name); x += 120


def mentor_q(b, key=False):
    b.page("keys" if key else "mq")
    y = b.header("Mentor Letter Questions", "Look closely", name=not key)
    if key: b.key_stamp()
    for i, (q, a) in enumerate(MQ, 1):
        y = b.question(i, q, y, 3 if i in (2, 6) else 2, answer=a if key else None)


def parts(b, key=False):
    b.page("keys" if key else "parts")
    y = b.header("Parts of a Friendly Letter", "Label it", name=not key)
    if key: b.key_stamp()
    c = b.c
    c.setFillColor(b.t.light); c.roundRect(M, y - 34, W - 2 * M, 34, 8, stroke=0, fill=1)
    c.setFillColor(INK); c.setFont("BodyB", 12.5); c.drawCentredString(W / 2, y - 22, "Word bank:   " + "   •   ".join(PARTS))
    y -= 54
    lx, lw = M, 330
    c.setStrokeColor(GREY); c.setLineWidth(1.2); c.rect(lx, y - 420, lw, 420)
    spots = {"date": (y - 30, "December 10, 2026", "R"), "greeting": (y - 70, "Dear Santa,", "L"),
             "body": (y - 130, None, None), "closing": (y - 340, "Your friend,", "L"), "signature": (y - 378, "Jordan", "L")}
    c.setFillColor(INK)
    for part, (sy, txt, al) in spots.items():
        if txt:
            c.setFont("BodyB" if part == "signature" else "Body", 13)
            (c.drawRightString(lx + lw - 16, sy, txt) if al == "R" else c.drawString(lx + 20, sy, txt))
        else:
            b.para("I think you should bring our family a new sled. First, our old sled cracked last winter. Second, my "
                   "cousins visit every December and we could all ride together. Most importantly, sledding gets everyone "
                   "outside. That is why a sled is the perfect gift!", lx + 20, y - 92, lw - 40, style(12, 17))
        c.setStrokeColor(b.t.primary); c.setLineWidth(1.2); c.line(lx + lw + 4, sy + 4, lx + lw + 40, sy + 4)
        c.roundRect(lx + lw + 44, sy - 10, W - M - (lx + lw + 44), 30, 8)
        if key: c.setFillColor(KEYRED); c.setFont("BodyB", 14); c.drawCentredString((lx + lw + 44 + W - M) / 2, sy, part); c.setFillColor(INK)
    y -= 446
    b.question(1, "Why do you think the closing and signature go at the end of the letter?", y, 2,
               answer="They show the letter is finished and tell the reader who wrote it." if key else None)


def wordbank(b):
    b.page("words")
    y = b.header("Persuasive Word Bank", "Transitions and power words", name=False)
    c = b.c; cw = (W - 2 * M - 16) / 2; ch = 168
    for i, (head, ws) in enumerate(WORDS):
        x = M + (i % 2) * (cw + 16); top = y - (i // 2) * (ch + 12)
        c.setFillColor(b.t.light); c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); c.roundRect(x, top - ch, cw, ch, 12, fill=1)
        c.setFillColor(b.t.primary); c.setFont("Anton", 17); c.drawString(x + 14, top - 26, head.upper())
        c.setFillColor(INK); c.setFont("Body", 13)
        per = 5 if len(ws) <= 5 else -(-len(ws) // 2)
        for k, w in enumerate(ws):
            c.drawString(x + 18 + (k // per) * (cw / 2 - 6), top - 52 - (k % per) * 22, "• " + w)


def prompts(b):
    b.page("prompts")
    y = b.header("Choose a Prompt", "Santa and non-Santa options", name=False)
    c = b.c; cw = (W - 2 * M - 12) / 2; ch = 150
    for i, p in enumerate(PROMPTS):
        r, k = divmod(i, 2); x, yy = M + k * (cw + 12), y - r * (ch + 12)
        c.setFillColor(b.t.light); c.setStrokeColor(b.t.primary); c.setLineWidth(1.2); c.roundRect(x, yy - ch, cw, ch, 12, fill=1)
        b.badge(x + 20, yy - 20, i + 1, r=12)
        b.para(p, x + 40, yy - 12, cw - 54, style(13, 18))
    b.para("Every prompt uses the same OREO plan, so students who don't celebrate Christmas can choose prompts 3 to 6 and "
           "do exactly the same learning.", M, y - 3 * (ch + 12) - 4, W - 2 * M, style(11.5, 16, GREY))


def brainstorm(b):
    b.page("plan")
    y = b.header("Brainstorm", "Plan before you write")
    c = b.c
    for lab in ["Who am I writing to?", "What do I want them to do or give?"]:
        c.setFillColor(INK); c.setFont("BodyB", 13); c.drawString(M, y - 6, lab)
        c.setStrokeColor(INK); c.setLineWidth(1); c.line(M + 250, y - 8, W - M, y - 8); y -= 38
    y = b.para("<b>Why should they say yes?</b> List as many reasons as you can. Then put a star beside your <b>three best</b> reasons.",
               M, y, W - 2 * M, style(13, 18)) - 8
    for k in range(7):
        c.setStrokeColor(b.t.primary); c.setLineWidth(1.2); c.roundRect(M, y - 38, W - 2 * M, 34, 8)
        c.setStrokeColor(GREY); c.setLineWidth(1); c.circle(W - M - 22, y - 21, 10)
        y -= 42
    y -= 4
    y = b.para("<b>Think like your reader:</b> What might they worry about? How can you answer that worry?",
               M, y, W - 2 * M, style(13, 18)) - 6
    b.rule_lines(M, y, W - 2 * M, 3, 26)


def organizer(b):
    b.page("oreo")
    y = b.header("OREO Planner", "Organize your letter")
    c = b.c
    rows = [("O", "Opinion", 70, DKGREEN), ("R", "Reason 1", 54, RED), ("E", "Example", 54, BROWN), ("R", "Reason 2", 54, RED),
            ("E", "Example", 54, BROWN), ("R", "Reason 3 (save your best for last!)", 54, RED), ("E", "Example", 54, BROWN),
            ("O", "Opinion again", 70, DKGREEN)]
    for L, name, h, col in rows:
        c.setStrokeColor(col); c.setLineWidth(1.5); c.roundRect(M + 44, y - h, W - 2 * M - 44, h, 10)
        c.setFillColor(col); c.circle(M + 18, y - h / 2, 16, stroke=0, fill=1)
        c.setFillColor(white); c.setFont("Anton", 18); c.drawCentredString(M + 18, y - h / 2 - 6, L)
        c.setFillColor(col); c.setFont("BodyB", 10.5); c.drawString(M + 54, y - 15, name)
        y -= h + 8


def paper(b, first):
    b.page("paper")
    y = b.header("My Persuasive Letter", "Good copy" if first else "Good copy (continued)")
    c = b.c
    if first:
        c.setFont("Body", 12.5); c.setFillColor(INK); c.drawRightString(W - M, y, "____________________")
        c.setFont("Body", 9); c.setFillColor(GREY); c.drawRightString(W - M, y - 12, "date")
        c.setFont("Body", 12.5); c.setFillColor(INK); c.drawString(M, y - 34, "Dear ______________________,"); y -= 44
    for k, f in enumerate([lambda: ornament(c, M + 18, 50, 32), lambda: candy_cane(c, W - M - 30, 48, 40)]): f()
    y = b.rule_lines(M, y, W - 2 * M, int((y - 130) / 28), 28)
    if not first:
        c.setFont("Body", 12.5); c.setFillColor(INK)
        c.drawString(W / 2, y - 26, "______________________,"); c.drawString(W / 2, y - 56, "______________________")
        c.setFont("Body", 9); c.setFillColor(GREY); c.drawString(W / 2, y - 40, "closing"); c.drawString(W / 2, y - 70, "signature")


def checklist(b):
    b.page("check")
    y = b.header("Revise & Edit Checklist", "Self and peer check")
    c = b.c
    items = [("Revise (make it better)", ["My opinion is clear in the first sentence.", "I gave three reasons.",
                                           "Each reason has an example, a fact or a detail.", "I saved my best reason for last.",
                                           "I used transition words (first, also, most importantly).", "I restated my opinion at the end.",
                                           "My voice is polite and fits my reader."]),
             ("Edit (make it correct)", ["My letter has a date, greeting, body, closing and signature.",
                                          "Every sentence starts with a capital and ends with punctuation.",
                                          "I used commas after the greeting and the closing.",
                                          "I checked my spelling, including Canadian spellings (favourite, colour)."])]
    for head, lst in items:
        c.setFillColor(b.t.primary); c.setFont("Anton", 18); c.drawString(M, y, head.upper()); y -= 10
        c.setFillColor(b.t.dark); c.setFont("BodyB", 10); c.drawCentredString(W - M - 95, y + 12, "Me"); c.drawCentredString(W - M - 35, y + 12, "Peer")
        for it in lst:
            y -= 30
            c.setFillColor(INK); c.setFont("Body", 12); c.drawString(M + 4, y + 6, it)
            c.setStrokeColor(INK); c.setLineWidth(1.2); c.rect(W - M - 105, y, 20, 20); c.rect(W - M - 45, y, 20, 20)
        y -= 30
    b.question(1, "<b>Peer feedback:</b> One star (something that works well) and one wish (something to improve).", y, 3)


def rubric(b):
    b.page("rubric")
    y = b.header("Persuasive Letter Rubric", "Ontario achievement chart", name=False)
    c = b.c; cw0 = 98; cw = (W - 2 * M - cw0) / 4
    c.setFillColor(b.t.dark); c.rect(M, y - 30, W - 2 * M, 30, stroke=0, fill=1)
    c.setFillColor(white); c.setFont("BodyB", 11); c.drawString(M + 6, y - 19, "Category")
    for i in range(4): c.drawCentredString(M + cw0 + i * cw + cw / 2, y - 19, f"Level {i + 1}")
    y -= 30; rh = 112
    for j, (cat, cells) in enumerate(RUBRIC):
        c.setFillColor(b.t.light if j % 2 == 0 else white); c.rect(M, y - rh, W - 2 * M, rh, stroke=0, fill=1)
        b.para(cat.replace("\n", "<br/>"), M + 6, y - 8, cw0 - 10, style(11, 14, b.t.primary, "BodyB"))
        for i, t in enumerate(cells):
            b.para(t, M + cw0 + i * cw + 6, y - 8, cw - 12, style(10, 13))
        y -= rh
    c.setStrokeColor(b.t.dark); c.setLineWidth(1); c.rect(M, y, W - 2 * M, 30 + rh * 4)
    for i in range(5): c.line(M + cw0 + i * cw, y, M + cw0 + i * cw, y + 30 + rh * 4)
    y -= 26
    b.para("<b>Teacher comments:</b> ______________________________________________________________", M, y, W - 2 * M, style(11.5, 16))
    b.para("Level 3 represents the provincial standard.", M, y - 30, W - 2 * M, style(10, 13, GREY))


def build(b):
    b.cover(["OREO planner", "mentor letter", "rubric", "Ontario aligned"])
    b.guide("Everything you need to teach a persuasive letter in December: an OREO anchor chart, an annotated mentor letter "
            "with questions, a parts-of-a-letter page, a word bank, six prompts (two for Santa and four non-Santa options), "
            "planners, good-copy paper, a checklist and a rubric based on the Ontario achievement chart.",
            [("anchor", "What Makes Writing Persuasive? OREO anchor chart"), ("mentor", "Mentor letter (colour-coded)"),
             ("mq", "Mentor letter questions"), ("parts", "Parts of a Friendly Letter"), ("words", "Persuasive word bank"),
             ("prompts", "Choose a Prompt (6 options)"), ("plan", "Brainstorm"), ("oreo", "OREO Planner"),
             ("paper", "Good-copy letter paper (2 pages)"), ("check", "Revise & Edit Checklist"), ("rubric", "Rubric (Levels 1-4)"),
             ("keys", "Answer keys"), ("terms", "Terms of use")],
            [("Suggested sequence", "Day 1: anchor chart and mentor letter. Day 2: questions and parts of a letter. Day 3: "
              "choose a prompt, brainstorm and plan. Days 4-5: draft, revise with the checklist, publish on the letter paper."),
             ("Inclusive options", "Prompts 3 to 6 are not about Santa, so every student does the same learning in a way that "
              "fits their family."),
             ("Differentiate", "Grade 3: two reasons instead of three, and use the word bank. Grades 5-6: add a counter-argument "
              "(\"You might think... but...\") using the brainstorm's last question.")], ONT)
    anchor(b); mentor(b); mentor_q(b); parts(b); wordbank(b); prompts(b); brainstorm(b); organizer(b)
    paper(b, True); paper(b, False); checklist(b); rubric(b)
    mentor_q(b, True); parts(b, True)
    b.terms()


LISTING = dict(
    tpt_title="Dear Santa Persuasive Letter Writing | OREO Organizer, Mentor Text, Rubric | Grades 3-6 | Ontario",
    price="$4.00. Range $3.50 to $4.50.", grades="3rd, 4th, 5th, 6th", subjects="Writing, Writing-Persuasive, Christmas", type="Graphic Organizers, Printables",
    description="""
Teach **persuasive letter writing** this December with a fun, purposeful audience: Santa! Includes **non-Santa prompts**
too, so every student can do the same learning.

**What's included:**
- OREO anchor chart (Opinion, Reasons, Examples, Opinion)
- Colour-coded mentor letter ("Dear Santa, please bring me snowshoes") plus 6 questions
- Parts of a Friendly Letter labelling page
- Persuasive word bank: transitions and power words
- 6 prompts: 2 for Santa, plus letters to the principal, family, mayor and teacher
- Brainstorm page and OREO planner
- Good-copy letter paper (2 pages)
- Revise & edit checklist (self and peer)
- Rubric with the four Ontario achievement chart categories (Levels 1-4)
- Answer keys and a teacher guide

**Ontario curriculum:** Language (2023) Strand D Composition (D1, D2, D3) and Strand C Comprehension.
""",
    keywords=["persuasive writing", "dear santa letter", "letter to santa", "OREO writing", "opinion writing", "friendly letter",
              "Ontario language", "grade 4 writing", "December writing", "rubric"])

if __name__ == "__main__":
    b = Book("Dear-Santa-Persuasive-Letter-Grades-3-6-Ontario", "Dear Santa", "Persuasive Letter Writing",
             "Grades 3-6", "christmas", letter_art, ribbon="ONTARIO CURRICULUM")
    run(build, b, inside=[3, 4, 6, 8, 10, 14], feature=4, feature_line=("Colour-coded mentor letter", "OREO • PROMPTS • RUBRIC"),
        key_page=17, preview=[1, 3, 4, 8, 10, 14], listing=LISTING)
