"""Remembrance Day (Canada / Ontario) - four grade bands. Facts are real and were checked against Veterans Affairs
Canada and other reference sources (see FACTS). No poppy imagery (Royal Canadian Legion trademark): the poppy is only
mentioned in text as history."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from kit import Book, run, style, W, H, M, INK, GREY, KEYRED
from kit.remembrance import dove, maple_leaf, wreath, candle, cover_art, RED, GOLD, NAVY
from reportlab.lib.colors import white, HexColor

POEM = [["In Flanders fields the poppies blow", "Between the crosses, row on row,", "That mark our place; and in the sky",
         "The larks, still bravely singing, fly", "Scarce heard amid the guns below."],
        ["We are the Dead. Short days ago", "We lived, felt dawn, saw sunset glow,", "Loved and were loved, and now we lie,",
         "In Flanders fields."],
        ["Take up our quarrel with the foe:", "To you from failing hands we throw", "The torch; be yours to hold it high.",
         "If ye break faith with us who die", "We shall not sleep, though poppies grow", "In Flanders fields."]]
ARTNOTE = "No poppy images are used in this resource. The poppy is a registered trademark of the Royal Canadian Legion."


def mc_block(b, n, q, opts, y, ans=None):
    c = b.c; b.badge(M + 10, y - 8, n)
    y = b.para(q, M + 28, y, W - 2 * M - 28, style(12, 15)) - 4
    for j, o in enumerate(opts):
        hit = ans is not None and j == ans
        c.setStrokeColor(INK); c.setFillColor(KEYRED if hit else white); c.circle(M + 40, y - 9, 6.5, fill=1)
        c.setFillColor(white if hit else INK); c.setFont("BodyB", 8); c.drawCentredString(M + 40, y - 12, "ABCD"[j])
        y = b.para(o, M + 54, y, W - 2 * M - 60, style(11.5, 15, KEYRED if hit else INK)) - 3
    return y - 10


def passage(b, title, kicker, paras, size=12.8, lead=19.5):
    y = b.header(title, kicker)
    for i, p in enumerate(paras, 1):
        b.badge(M + 9, y - 9, i, r=9, fill=b.t.primary)
        y = b.para(p, M + 26, y, W - 2 * M - 26, style(size, lead)) - 11
    assert y > 60, title
    return y


def poem_page(b, title="In Flanders Fields", kicker="A poem by John McCrae, 1915", numbered=True):
    y = b.header(title, kicker, name=False)
    c = b.c; n = 1
    for stanza in POEM:
        for line in stanza:
            if numbered:
                c.setFillColor(GREY); c.setFont("Body", 9); c.drawRightString(M + 40, y - 14, str(n))
            c.setFillColor(INK); c.setFont("Body", 16); c.drawString(M + 56, y - 15, line)
            y -= 25; n += 1
        y -= 14
    b.para("John McCrae (1872-1918) was a Canadian doctor from Guelph, Ontario. He wrote this poem in May 1915, during the "
           "Second Battle of Ypres in Belgium, after the death of his friend Lieutenant Alexis Helmer. The poem is in the "
           "public domain.", M, y - 4, W - 2 * M, style(10.5, 14, GREY))
    dove(c, W - M - 90, H - 260, 150, None, HexColor("#CBD5E1"))


# =============================== K-1 ===============================
K_READ = ["On November 11, people in Canada stop to remember.", "We remember people who served to keep Canada safe.",
          "Some of them are called veterans.", "At 11 o'clock, we are quiet for two minutes.",
          "We think about peace and say thank you.", "Lest we forget."]


def k_read(b):
    y = b.header("We Remember", "Read together")
    c = b.c
    for i, line in enumerate(K_READ):
        c.setFillColor(b.t.light); c.roundRect(M, y - 70, W - 2 * M, 62, 14, stroke=0, fill=1)
        c.setFillColor(INK); c.setFont("Body", 21); c.drawString(M + 20, y - 46, line)
        y -= 76
    dove(c, W / 2, 80, 150, None, INK)


def k_symbols(b):
    y = b.header("Symbols of Remembrance", "Colour and talk")
    b.para("Colour each picture. Talk about what it means.", M, y, W - 2 * M, style(16, 20))
    c = b.c; y -= 40
    items = [("dove", "A dove means peace."), ("leaf", "The maple leaf means Canada."),
             ("wreath", "A wreath means we remember."), ("candle", "A candle means we keep the memory bright.")]
    cw, ch = (W - 2 * M) / 2, 270
    for i, (kind, text) in enumerate(items):
        r, k = divmod(i, 2); x, yy = M + k * cw, y - r * ch
        c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); c.roundRect(x + 6, yy - ch + 12, cw - 12, ch - 12, 14)
        cx, cy = x + cw / 2, yy - 115
        if kind == "dove": dove(c, cx, cy - 20, 170, None, INK, branch=True)
        if kind == "leaf": maple_leaf(c, cx, cy, 80, None, INK)
        if kind == "wreath":
            c.setStrokeColor(INK); c.setLineWidth(1.4)
            for rr in (62, 88): c.circle(cx, cy, rr)
        if kind == "candle":
            c.setStrokeColor(INK); c.setLineWidth(1.4); c.rect(cx - 18, cy - 80, 36, 120)
            p = c.beginPath(); p.moveTo(cx, cy + 80); p.curveTo(cx + 18, cy + 58, cx + 10, cy + 44, cx, cy + 44); p.curveTo(cx - 10, cy + 44, cx - 18, cy + 58, cx, cy + 80); c.drawPath(p)
        b.para(text, x + 20, yy - ch + 56, cw - 40, style(14, 18, align=1))


def k_trace(b):
    y = b.header("Trace the Words", "Early printing")
    c = b.c
    for word in ["peace", "remember", "thank you", "Canada"]:
        h = 42; base = b.primary_lines(M, y - 6, W - 2 * M, h); size = h / 0.86
        tw = c.stringWidth(word, "Body", size); n = max(1, min(3, int((W - 2 * M) // (tw + 40)))); gap = (W - 2 * M) / n
        for i in range(n):
            c.saveState(); t = c.beginText(); t.setTextOrigin(M + i * gap + (gap - tw) / 2, base); t.setFont("Body", size)
            t.setTextRenderMode(1); c.setStrokeColor(HexColor("#6B7280")); c.setLineWidth(1.5); c.setDash(3, 2.5)
            t.textOut(word); t.setTextRenderMode(0); c.drawText(t); c.restoreState()
        y = base - 36
        y = b.primary_lines(M, y, W - 2 * M, h) - 34


def k_peace(b):
    y = b.header("Peace Is...", "Draw and write")
    c = b.c
    c.setStrokeColor(b.t.primary); c.setLineWidth(2); c.roundRect(M, y - 330, W - 2 * M, 320, 16)
    dove(c, W - M - 70, y - 40, 90, None, HexColor("#CBD5E1"), branch=False)
    c.setFillColor(GREY); c.setFont("Body", 11); c.drawString(M + 14, y - 26, "Draw a picture of what peace means to you.")
    y -= 360
    c.setFillColor(INK); c.setFont("Body", 22); c.drawString(M, y, "Peace is")
    y = b.primary_lines(M + 100, y + 30, W - 2 * M - 100, 46) - 24
    b.primary_lines(M, y, W - 2 * M, 46)


def build_k(b):
    b.cover(["read together", "colour", "trace", "draw & write"])
    b.guide("A gentle, age-appropriate introduction to Remembrance Day for Kindergarten and Grade 1. Children read a short "
            "shared text, talk about symbols of remembrance, trace key words, and draw and write about peace. The focus "
            "is on peace, thankfulness and quiet reflection.",
            [("read", "We Remember: shared reading page"), ("sym", "Symbols of Remembrance colouring page"),
             ("trace", "Trace the Words: peace, remember, thank you, Canada"), ("peace", "Peace Is... draw and write"),
             ("terms", "Terms of use")],
            [("Talking about it gently", "Keep the conversation on peace, helping and remembering. Some children may have "
              "family members who serve or have served; invite them to share if they wish."),
             ("Moment of silence", "Practise sitting quietly for a short time before the school assembly, so children know "
              "what to expect."), ("Note", ARTNOTE)],
            "The Kindergarten Program (2016), Ontario: <b>Belonging and Contributing</b> (community, citizenship and "
            "traditions) and <b>Demonstrating Literacy and Mathematics Behaviours</b> (shared reading, early printing). "
            "Grade 1: Ontario Language (2023) Strands B and C (foundational reading and comprehension) and D (creating texts).")
    b.page("read"); k_read(b)
    b.page("sym"); k_symbols(b)
    b.page("trace"); k_trace(b)
    b.page("peace"); k_peace(b)
    b.terms()


# =============================== Grades 2-3 ===============================
P23 = ["Every year on <b>November 11</b>, Canadians pause to remember. Remembrance Day honours the people who have served "
       "Canada in times of war, conflict and peace, especially those who died.",
       "Why November 11? On November 11, 1918, the fighting of the First World War stopped. The agreement to stop "
       "fighting, called an <b>armistice</b>, began at 11 o'clock in the morning. That is why many Canadians observe "
       "<b>two minutes of silence</b> at 11:00 a.m.",
       "A person who has served in the military is called a <b>veteran</b>. Some veterans served long ago, and some are "
       "serving today. Canadians have also served as <b>peacekeepers</b>, helping people in other countries stay safe.",
       "Many people wear a red poppy in the days before Remembrance Day. The idea comes from a poem called \"In Flanders "
       "Fields,\" written in 1915 by John McCrae, a Canadian doctor. Poppies grew in the fields where soldiers were buried.",
       "Communities gather at a <b>cenotaph</b>, which is a monument that honours people who died in war. People lay "
       "<b>wreaths</b>, listen to music and stand quietly together. At the end, they often say, \"<b>Lest we forget.</b>\" "
       "It means: let us never forget."]
MC23 = [("Why is Remembrance Day on November 11?", ["It is the first day of winter.", "The fighting of the First World War stopped on that day in 1918.", "It is Canada's birthday.", "It is when school starts."], 1),
        ("What is a veteran?", ["A person who has served in the military", "A kind of monument", "A type of flower", "A song"], 0),
        ("What is a cenotaph?", ["A wreath of leaves", "A monument that honours people who died in war", "A poem", "A peacekeeper"], 1),
        ("What does \"Lest we forget\" mean?", ["Let us go home.", "Let us never forget.", "Let us be quiet.", "Let us sing."], 1)]
SA23 = [("Why do many people stay silent at 11:00 a.m. on November 11? Use the text.", "The armistice that stopped the fighting of the First World War began at 11 o'clock on November 11, 1918 (paragraph 2)."),
        ("Name two things people do at a Remembrance Day ceremony.", "Any two: gather at a cenotaph, lay wreaths, listen to music, stand quietly, say \"Lest we forget\" (paragraph 5).")]
VOC23 = [("veteran", "a person who has served in the military"), ("armistice", "an agreement to stop fighting"),
         ("cenotaph", "a monument to people who died in war"), ("peacekeeper", "someone who helps keep people safe in other countries"),
         ("wreath", "a ring of leaves or flowers laid to honour someone"), ("remember", "to keep someone in your thoughts")]
VORD23 = [2, 4, 0, 5, 1, 3]


def q23(b, key):
    y = b.header("Why We Remember: Questions", "Show what you know")
    if key: b.key_stamp()
    for i, (q, o, a) in enumerate(MC23, 1):
        y = mc_block(b, i, q, o, y, a if key else None)
    for j, (q, a) in enumerate(SA23, 5):
        y = b.question(j, q, y, 3, answer=a if key else None)


def vocab(b, words, order, key, title="Remembrance Words"):
    y = b.header(title, "Vocabulary match")
    if key: b.key_stamp()
    b.para("Draw a line from each word to its meaning.", M, y, W - 2 * M, style(12.5, 17))
    c = b.c; y -= 40
    for i, (w, _) in enumerate(words):
        yy = y - i * 76
        c.setFillColor(b.t.light); c.setStrokeColor(b.t.primary); c.roundRect(M, yy - 44, 160, 44, 10, fill=1)
        c.setFillColor(INK); c.setFont("BodyB", 15); c.drawCentredString(M + 80, yy - 28, w)
        c.circle(M + 172, yy - 22, 4, stroke=0, fill=1)
        c.setFillColor(white); c.roundRect(W - M - 270, yy - 44, 270, 44, 10, fill=1)
        c.setFillColor(INK); c.circle(W - M - 282, yy - 22, 4, stroke=0, fill=1)
        b.para(words[order[i]][1], W - M - 260, yy - 8, 250, style(11.5, 14))
    if key:
        c.setStrokeColor(KEYRED); c.setLineWidth(2)
        for i in range(len(words)):
            j = order.index(i); c.line(M + 172, y - i * 76 - 22, W - M - 282, y - j * 76 - 22)


def acrostic(b):
    y = b.header("Remember: Acrostic Poem", "Write")
    b.para("Write a word or phrase about Remembrance Day that starts with each letter.", M, y, W - 2 * M, style(12.5, 17))
    c = b.c; y -= 36
    for L in "REMEMBER":
        c.setFillColor(b.t.primary); c.setFont("Anton", 40); c.drawString(M, y - 42, L)
        c.setStrokeColor(GREY); c.setLineWidth(0.8); c.line(M + 50, y - 40, W - M, y - 40)
        y -= 66


def dove_wish(b):
    y = b.header("My Wish for Peace", "Write and colour")
    c = b.c
    b.para("Inside the dove, write your wish for peace. Then colour the border.", M, y, W - 2 * M, style(12.5, 17))
    ds, dx, dy = 420, W / 2 + 30, y - 330
    dove(c, dx, dy, ds, None, INK, branch=True)
    for i in range(4):
        c.setStrokeColor(GREY); c.setLineWidth(0.6); c.line(dx - ds * .3, dy + ds * .03 - i * 20, dx + ds * .18, dy + ds * .03 - i * 20)
    for k in range(8):
        maple_leaf(c, M + 20 + k * 74, 70, 22, None, INK)


def thank_card(b):
    y = b.header("Thank-You Card for a Veteran", "Cut, fold and write", name=False)
    c = b.c
    c.setDash(5, 4); c.setStrokeColor(GREY); c.rect(M, 60, W - 2 * M, y - 70); c.line(M, (y - 10 + 60) / 2 + 2, W - M, (y - 10 + 60) / 2 + 2); c.setDash()
    mid = (y - 10 + 60) / 2 + 2
    c.saveState(); c.translate(W / 2, mid + (y - 10 - mid) / 2); c.rotate(180)
    c.setFillColor(b.t.primary); c.setFont(b.t.display, 30); c.drawCentredString(0, 40, "Thank You")
    c.setFillColor(INK); c.setFont("Body", 14); c.drawCentredString(0, 14, "for your service")
    maple_leaf(c, 0, -50, 40); c.restoreState()
    yy = mid - 30
    c.setFont("Body", 13); c.setFillColor(INK); c.drawString(M + 30, yy, "Dear ______________________,")
    for i in range(5):
        c.setStrokeColor(GREY); c.line(M + 30, yy - 30 - i * 26, W - M - 30, yy - 30 - i * 26)
    c.drawString(W - M - 200, 84, "From, ______________")


def build_23(b):
    b.cover(["passage", "questions", "vocabulary", "writing"])
    b.guide("An informational Remembrance Day mini-unit for Grades 2-3. Students read an original passage about why "
            "Canadians remember on November 11, answer comprehension questions, learn key vocabulary, and write: an "
            "acrostic poem, a wish for peace and a thank-you card for a veteran.",
            [("read", "Why We Remember: reading passage"), ("q", "Comprehension questions"), ("voc", "Remembrance Words vocabulary match"),
             ("acro", "REMEMBER acrostic poem"), ("wish", "My Wish for Peace (dove)"), ("card", "Thank-You Card for a Veteran"),
             ("keys", "Answer keys"), ("terms", "Terms of use")],
            [("Facts", "All facts in this resource are real. They match information from Veterans Affairs Canada."),
             ("Cards for veterans", "Ask your local Royal Canadian Legion branch whether it would welcome student cards."),
             ("Note", ARTNOTE)],
            "Ontario Language Curriculum (2023), Grades 2-3: <b>Strand C Comprehension</b> (understanding informational "
            "texts, vocabulary) and <b>Strand D Composition</b> (creating texts, including poetry and letters). Connects to "
            "Ontario Social Studies themes of community, heritage and citizenship.")
    b.page("read"); passage(b, "Why We Remember", "Read  •  Remembrance Day", P23)
    b.page("q"); q23(b, False)
    b.page("voc"); vocab(b, VOC23, VORD23, False)
    b.page("acro"); acrostic(b)
    b.page("wish"); dove_wish(b)
    b.page("card"); thank_card(b)
    b.page("keys"); q23(b, True)
    b.page("keys"); vocab(b, VOC23, VORD23, True)
    b.terms()


# =============================== Grades 4-6 ===============================
P46_MCCRAE = [
    "John McCrae was born in 1872 in Guelph, Ontario. He became a doctor and also loved to write poetry. When the "
    "First World War began in 1914, he joined the Canadian army as a medical officer.",
    "In the spring of 1915, McCrae was caring for wounded soldiers during the <b>Second Battle of Ypres</b> in Belgium. "
    "The fighting was terrible. On May 2, his friend Lieutenant Alexis Helmer was killed. McCrae led the burial service "
    "himself.",
    "McCrae noticed wild red poppies growing among the graves. The next day, he wrote the poem \"In Flanders Fields.\" "
    "It was published in December 1915 and soon became one of the most famous poems of the war.",
    "McCrae continued to serve as a doctor. He became ill and died in France in January 1918, before the war ended. His "
    "poem lived on. It inspired the use of the poppy as a symbol of remembrance, and in 1921 the poppy was adopted in "
    "Canada as a symbol to remember those who died in war.",
    "Today, Canadians read \"In Flanders Fields\" at Remembrance Day ceremonies across the country. McCrae's childhood "
    "home in Guelph is now a museum."]
P46_PEG = [
    "Francis Pegahmagabow was an Ojibwe man from the Parry Island Band, now <b>Wasauksing First Nation</b>, near Parry "
    "Sound, Ontario. When the First World War began, he volunteered to serve, even though First Nations people faced "
    "unfair treatment in Canada at the time.",
    "Pegahmagabow served for almost the whole war. He became known as a skilled scout and sniper, and he carried messages "
    "across dangerous ground. He was wounded but returned to the front lines.",
    "For his bravery he was awarded the <b>Military Medal</b> three times: the medal and two \"bars.\" Very few "
    "Canadians earned this rare honour in the First World War. He is one of the most decorated Indigenous soldiers in "
    "Canadian history.",
    "After the war, Pegahmagabow returned home. He became chief of his community and worked for the rights of First "
    "Nations people for the rest of his life.",
    "Every year on <b>November 8</b>, Indigenous Veterans Day honours the First Nations, Inuit and Métis people who have "
    "served Canada."]
MCC46 = [("Who is speaking in the poem?", ["John McCrae", "The larks", "Soldiers who have died", "A teacher"], 2),
         ("What is the rhyme scheme of the first stanza (lines 1-5)?", ["ABABA", "AABBA", "ABCDE", "AAAAA"], 1),
         ("In line 12, \"the torch\" is a metaphor for...", ["a real flashlight", "the responsibility to remember and carry on", "a campfire", "the sun"], 1),
         ("Which line contrasts life and death in the same stanza?", ["\"We lived, felt dawn, saw sunset glow\" and \"now we lie\"", "\"The larks, still bravely singing, fly\"", "\"Between the crosses, row on row\"", "\"Take up our quarrel with the foe\""], 0)]
SA46 = [("Line 4 says the larks are \"still bravely singing.\" What feeling does this create next to \"the guns below\"? Explain.",
         "It contrasts hope and life (birds singing) with the danger of war; it creates a feeling of courage, or of sadness that life goes on beside the fighting."),
        ("What do the speakers ask the reader to do in the last stanza? Do you think the message is still important today? Explain.",
         "They ask the living to \"take up our quarrel\" and hold \"the torch\" high, to carry on and not break faith or forget them. Opinions vary; look for a reason.")]
PEGQ = [("Where was Francis Pegahmagabow from?", "The Parry Island Band, now Wasauksing First Nation, near Parry Sound, Ontario (paragraph 1)."),
        ("What honour did he earn three times, and why is it special?", "The Military Medal (with two bars); very few Canadians earned this rare honour in the First World War (paragraph 3)."),
        ("How did Pegahmagabow continue to serve his community after the war?", "He became chief and worked for the rights of First Nations people (paragraph 4)."),
        ("Why do you think Indigenous Veterans Day is important?", "Answers vary: it recognizes the service of First Nations, Inuit and Métis people, whose contributions were often overlooked.")]


def q46(b, key):
    y = b.header("In Flanders Fields: Poem Analysis", "Think like a poet")
    if key: b.key_stamp()
    for i, (q, o, a) in enumerate(MCC46, 1):
        y = mc_block(b, i, q, o, y, a if key else None)
    for j, (q, a) in enumerate(SA46, 5):
        y = b.question(j, q, y, 3, answer=a if key else None)


def peg_q(b, key):
    y = b.header("Francis Pegahmagabow: Questions", "Show what you know")
    if key: b.key_stamp()
    for i, (q, a) in enumerate(PEGQ, 1):
        y = b.question(i, q, y, 3, answer=a if key else None)


def letter46(b):
    y = b.header("A Letter of Thanks", "Write to a veteran or serving member")
    b.para("Write a friendly letter to a veteran or a member of the Canadian Armed Forces. Include what you learned about "
           "Remembrance Day and why it matters to you. Use the checklist before you finish.", M, y, W - 2 * M, style(12, 16))
    c = b.c; y -= 52
    c.setFont("Body", 12); c.setFillColor(INK); c.drawRightString(W - M, y, "Date: _______________"); y -= 26
    c.drawString(M, y, "Dear ________________________,"); y -= 8
    y = b.rule_lines(M, y, W - 2 * M, 14, 25) - 20
    c.drawString(W - M - 200, y, "Sincerely,"); c.drawString(W - M - 200, y - 26, "______________________")
    y -= 56
    for t in ["Greeting and closing", "At least two things I learned", "Why remembrance matters to me", "Capitals, punctuation and paragraphs"]:
        c.rect(M, y - 2, 12, 12); c.drawString(M + 20, y, t); y -= 20


def build_46(b):
    b.cover(["In Flanders Fields", "poem analysis", "Indigenous veterans", "letter writing"])
    b.guide("A Remembrance Day literacy mini-unit for Grades 4-6. Students learn about John McCrae, read and analyse "
            "\"In Flanders Fields\" (rhyme scheme, speaker, imagery, metaphor), read a biography of Ontario's Francis "
            "Pegahmagabow and learn about Indigenous Veterans Day, then write a letter of thanks.",
            [("mccrae", "John McCrae: biography passage"), ("poem", "\"In Flanders Fields\" (full text, numbered lines)"),
             ("pq", "Poem analysis questions"), ("peg", "Francis Pegahmagabow: biography passage"), ("pegq", "Pegahmagabow questions"),
             ("letter", "A Letter of Thanks (writing)"), ("keys", "Answer keys"), ("terms", "Terms of use")],
            [("Facts", "All facts are real. They were checked against Veterans Affairs Canada and other reference sources. The poem "
              "(1915) is in the public domain."),
             ("Sensitive topics", "War and loss can be hard for some students. Preview the material, and let students know "
              "they can step away or talk to you."), ("Note", ARTNOTE)],
            "Ontario Language Curriculum (2023), Grades 4-6: <b>Strand C Comprehension</b> (C1 knowledge about texts, "
            "including poetic forms and devices; C2 comprehension strategies; C3 critical thinking) and <b>Strand D "
            "Composition</b> (D2 creating texts: letters). Connects to <b>Strand A</b> (literacy connections, including "
            "First Nations, Métis and Inuit perspectives) and to Ontario Social Studies (heritage and citizenship).")
    b.page("mccrae"); passage(b, "John McCrae: Doctor and Poet", "Read  •  Biography", P46_MCCRAE)
    b.page("poem"); poem_page(b)
    b.page("pq"); q46(b, False)
    b.page("peg"); passage(b, "Francis Pegahmagabow", "Read  •  Biography", P46_PEG)
    b.page("pegq"); peg_q(b, False)
    b.page("letter"); letter46(b)
    b.page("keys"); q46(b, True)
    b.page("keys"); peg_q(b, True)
    b.terms()


# =============================== Grades 7-8 ===============================
P78 = [
    "When Britain declared war on Germany in August 1914, Canada was automatically at war as part of the British Empire. "
    "Over the next four years, <b>more than 650,000</b> men and women from Canada and Newfoundland served, and <b>more than "
    "66,000 gave their lives</b>. Newfoundland was a separate dominion at the time; it joined Canada in 1949.",
    "In April 1917, the Canadian Corps was ordered to capture <b>Vimy Ridge</b> in northern France, a high, heavily "
    "defended position that earlier Allied attacks had failed to take. For the first time, all four Canadian divisions "
    "attacked together. Months of planning, tunnelling, rehearsal and a carefully timed \"creeping barrage\" of artillery "
    "prepared the way.",
    "The attack began on April 9, 1917, and by April 12 the ridge was captured. The victory came at a terrible cost: more "
    "than 10,000 Canadians were killed or wounded, and nearly 3,600 of them died.",
    "Many Canadians came to see Vimy as a turning point, a moment when Canada stepped forward as a nation in its own right. "
    "Historians continue to debate how much Vimy changed Canada, and they point out that the war also divided Canadians, "
    "for example over conscription in 1917.",
    "In 1936, the <b>Canadian National Vimy Memorial</b> was unveiled on the ridge. It is carved with the names of more "
    "than 11,000 Canadian soldiers who died in France and have no known grave. Today, Remembrance Day honours everyone who "
    "has served Canada, in both world wars, in Korea, in peacekeeping missions, in Afghanistan, and today."]
MC78 = [("Why was Canada at war in August 1914?", ["Canada declared war first.", "As part of the British Empire, Canada was automatically at war when Britain declared war.", "Canada was attacked.", "Newfoundland asked Canada to join."], 1),
        ("What was new about the Canadian attack at Vimy Ridge?", ["It was the first battle of the war.", "All four Canadian divisions attacked together for the first time.", "No artillery was used.", "It happened in Belgium."], 1),
        ("Which detail best supports the idea that Vimy was carefully prepared?", ["\"The attack began on April 9, 1917.\"", "\"Months of planning, tunnelling, rehearsal and a carefully timed creeping barrage\"", "\"Newfoundland was a separate dominion\"", "\"It is carved with the names\""], 1),
        ("Why does the author include paragraph 4?", ["To list casualties", "To show that people still debate what Vimy meant for Canada", "To describe the memorial", "To explain artillery"], 1)]
SA78 = [("Explain the phrase \"a turning point\" as it is used in paragraph 4. Do you agree that Vimy was a turning point for Canada? Support your answer with evidence.",
         "A turning point is a moment of important change. Answers vary; strong answers cite evidence (all four divisions together, the national memorial) and acknowledge the historians' debate or the divisions caused by the war, such as conscription."),
        ("Read \"In Flanders Fields.\" How does the poem's message connect to the purpose of the Vimy Memorial?",
         "Both ask the living to remember the dead: the poem asks readers not to \"break faith,\" and the memorial preserves the names of soldiers with no known grave so they are not forgotten.")]


def q78(b, key):
    y = b.header("Canada and Vimy Ridge: Questions", "Analyse the text")
    if key: b.key_stamp()
    for i, (q, o, a) in enumerate(MC78, 1):
        y = mc_block(b, i, q, o, y, a if key else None)
    for j, (q, a) in enumerate(SA78, 5):
        y = b.question(j, q, y, 3, answer=a if key else None)


def poem78(b, key):
    y = b.header("Poetry as a Primary Source", "In Flanders Fields")
    if key: b.key_stamp()
    qs = [("<b>Form.</b> The poem is a <i>rondeau</i>: 15 lines, two rhymes, and a short refrain. Identify the refrain and explain its effect.",
           "\"In Flanders fields\" (lines 9 and 15); repeating it brings the reader back to the place of death and makes the ending feel solemn and final."),
          ("<b>Perspective.</b> Who is the speaker? Why might McCrae have chosen this point of view?",
           "The dead soldiers (\"We are the Dead\"); speaking as the dead makes the message personal and powerful, and the request to remember comes from those who sacrificed."),
          ("<b>Context.</b> The poem was written in 1915, during the war. How might it have been used at the time? How is it used today?",
           "At the time it was used to encourage support for the war and recruitment; today it is used to honour and remember those who died, especially at Remembrance Day ceremonies."),
          ("<b>Critical thinking.</b> Some readers see the last stanza as a call to keep fighting; others see it as a call to remember. Which reading do you find more convincing? Use lines from the poem.",
           "Answers vary. \"Take up our quarrel with the foe\" supports the call to fight; \"be yours to hold it high\" and \"we shall not sleep\" can support remembrance. Strong answers quote and explain.")]
    for i, (q, a) in enumerate(qs, 1):
        y = b.question(i, q, y, 3, answer=a if key else None)


def opinion78(b):
    y = b.header("Opinion Writing: A Statutory Holiday?", "Take a position")
    c = b.c
    y = b.para("In some provinces and territories, Remembrance Day is a statutory holiday. In Ontario, it is not, and "
               "schools stay open and many hold assemblies. <b>Should Remembrance Day be a statutory holiday in Ontario?</b> "
               "Plan a paragraph that states your position, gives reasons with evidence, and addresses the other side.",
               M, y, W - 2 * M, style(12, 16)) - 12
    rows = [("My position", 2), ("Reason 1 + evidence", 3), ("Reason 2 + evidence", 3), ("The other side says...", 2),
            ("My response to the other side", 2), ("Concluding sentence", 2)]
    for head, n in rows:
        c.setFillColor(b.t.primary); c.setFont("BodyB", 12); c.drawString(M, y - 12, head)
        y = b.rule_lines(M, y - 14, W - 2 * M, n, 22) - 16


def rubric78(b):
    y = b.header("Opinion Paragraph Rubric", "Ontario achievement chart", name=False)
    c = b.c; cats = [("Knowledge &\nUnderstanding", ["limited accuracy of facts about Remembrance Day", "some accurate facts", "considerable, accurate facts", "thorough, precise facts"]),
                     ("Thinking", ["position and reasons with limited effectiveness", "some effectiveness; counter-argument attempted", "considerable effectiveness; counter-argument addressed", "high effectiveness; counter-argument rebutted convincingly"]),
                     ("Communication", ["limited clarity and organization", "some clarity; transitions developing", "clear, organized, with transitions", "compelling, precise and well organized"]),
                     ("Application", ["limited use of evidence and conventions", "some evidence; some accuracy in conventions", "considerable evidence; considerable accuracy", "strong evidence; a high degree of accuracy"])]
    cw0 = 100; cw = (W - 2 * M - cw0) / 4
    c.setFillColor(b.t.dark); c.rect(M, y - 30, W - 2 * M, 30, stroke=0, fill=1)
    c.setFillColor(white); c.setFont("BodyB", 11); c.drawString(M + 6, y - 19, "Category")
    for i in range(4): c.drawCentredString(M + cw0 + i * cw + cw / 2, y - 19, f"Level {i + 1}")
    y -= 30; rh = 100
    for j, (cat, cells) in enumerate(cats):
        c.setFillColor(b.t.light if j % 2 == 0 else white); c.rect(M, y - rh, W - 2 * M, rh, stroke=0, fill=1)
        b.para(cat.replace("\n", "<br/>"), M + 6, y - 8, cw0 - 10, style(11, 14, b.t.primary, "BodyB"))
        for i, t in enumerate(cells): b.para(t, M + cw0 + i * cw + 6, y - 8, cw - 12, style(10, 13))
        y -= rh
    c.setStrokeColor(b.t.dark); c.rect(M, y, W - 2 * M, 30 + rh * 4)
    for i in range(5): c.line(M + cw0 + i * cw, y, M + cw0 + i * cw, y + 30 + rh * 4)
    b.para("Level 3 represents the provincial standard.", M, y - 14, W - 2 * M, style(10, 13, GREY))


def build_78(b):
    b.cover(["Vimy Ridge", "primary source poem", "opinion writing", "rubric"])
    b.guide("A Remembrance Day literacy and history mini-unit for Grades 7-8. Students read an informational text about "
            "Canada in the First World War and the Battle of Vimy Ridge, including the historians' debate over its meaning. "
            "They then analyse \"In Flanders Fields\" as a primary source and write an opinion paragraph on whether "
            "Remembrance Day should be a statutory holiday in Ontario.",
            [("read", "Canada and Vimy Ridge: informational text"), ("q", "Text analysis questions"),
             ("poem", "\"In Flanders Fields\" (full text)"), ("pq", "Poetry as a Primary Source questions"),
             ("op", "Opinion writing planner"), ("rub", "Opinion paragraph rubric (Levels 1-4)"), ("keys", "Answer keys"),
             ("terms", "Terms of use")],
            [("Facts", "Figures match Veterans Affairs Canada: more than 650,000 from Canada and Newfoundland served in the "
              "First World War and more than 66,000 died; at Vimy, more than 10,000 casualties, nearly 3,600 killed."),
             ("Discussion", "The text presents Vimy's meaning as a debate, not a settled fact. Encourage students to weigh "
              "evidence and perspectives, including those of people the war divided."), ("Note", ARTNOTE)],
            "Ontario Language Curriculum (2023), Grades 7-8: <b>Strand C Comprehension</b> (informational and literary texts, "
            "critical thinking about perspective and purpose) and <b>Strand D Composition</b> (D2 argument/opinion "
            "writing). Extends Ontario History (Grade 8: Canada to 1914) and the historical thinking concepts of "
            "significance, perspective and evidence.")
    b.page("read"); passage(b, "Canada and Vimy Ridge", "Read  •  History", P78, 12.2, 18.4)
    b.page("q"); q78(b, False)
    b.page("poem"); poem_page(b)
    b.page("pq"); poem78(b, False)
    b.page("op"); opinion78(b)
    b.page("rub"); rubric78(b)
    b.page("keys"); q78(b, True)
    b.page("keys"); poem78(b, True)
    b.terms()


def L(title, grades, subjects, price, desc, kw):
    return dict(tpt_title=title, price=price, grades=grades, subjects=subjects, type="Activities, Reading Passages, Writing",
                description=desc, keywords=kw)


COMMON = ("\n\nAll facts are real and checked against Veterans Affairs Canada. Canadian spelling throughout. The resource "
          "uses doves, maple leaves and wreaths; no poppy images are included.")
JOBS = [
    ("Remembrance-Day-K-1-Ontario", "Remembrance Day", "We Remember: Little Learners", "K - Grade 1", "remember_kids", build_k,
     dict(inside=[3, 4, 5, 6], feature=4, feature_line=("Gentle & age-appropriate", "READ • COLOUR • TRACE • DRAW"), key_page=6, preview=[1, 2, 3, 4],
          key_line=("Draw, write & reflect", "PEACE • THANKFULNESS • MEMORY")),
     L("Remembrance Day Kindergarten & Grade 1 | Gentle Activities | Ontario Canada", "Kindergarten, 1st", "Social Studies, Literacy",
       "$3.00. Range $2.50 to $3.50.",
       "A gentle, age-appropriate introduction to Remembrance Day for Kindergarten and Grade 1, with a focus on peace, "
       "thankfulness and quiet reflection.\n\nIncluded: We Remember shared reading page, Symbols of Remembrance colouring "
       "page (dove, maple leaf, wreath, candle), Trace the Words (peace, remember, thank you, Canada), Peace Is... draw and "
       "write, and a teacher guide with tips for talking about Remembrance Day gently.\n\nOntario: Kindergarten Program "
       "(2016) Belonging and Contributing; Grade 1 Language (2023)." + COMMON,
       ["Remembrance Day", "kindergarten", "grade 1", "Ontario", "Canada", "peace", "November 11", "Canadian"])),
    ("Remembrance-Day-Grades-2-3-Ontario", "Remembrance Day", "Why We Remember: Read & Write", "Grades 2-3", "remember", build_23,
     dict(inside=[3, 4, 5, 6, 7, 8], feature=3, feature_line=("Why we remember", "PASSAGE • VOCABULARY • WRITING"), key_page=9, preview=[1, 2, 3, 6, 8]),
     L("Remembrance Day Reading Passage & Writing | Grades 2-3 | Ontario Canada", "2nd, 3rd", "Reading, Writing, Social Studies",
       "$3.50. Range $3 to $4.",
       "Teach why Canadians remember on November 11 with an original informational passage and meaningful writing tasks.\n\n"
       "Included: Why We Remember passage (armistice, veterans, peacekeepers, cenotaphs, \"Lest we forget\"), comprehension "
       "questions, a vocabulary match, a REMEMBER acrostic poem, My Wish for Peace (dove writing), a Thank-You Card for a "
       "Veteran, and answer keys.\n\nOntario Language (2023) Strands C and D." + COMMON,
       ["Remembrance Day", "reading passage", "grade 2", "grade 3", "Ontario", "Canada", "veterans", "acrostic poem"])),
    ("Remembrance-Day-Grades-4-6-Ontario", "Remembrance Day", "In Flanders Fields & Indigenous Veterans", "Grades 4-6", "remember", build_46,
     dict(inside=[3, 4, 5, 6, 7, 8], feature=4, feature_line=("In Flanders Fields", "POEM ANALYSIS • BIOGRAPHIES • LETTER"), key_page=9, preview=[1, 2, 3, 4, 6]),
     L("Remembrance Day In Flanders Fields Poem Analysis & Francis Pegahmagabow | Grades 4-6 | Ontario", "4th, 5th, 6th",
       "Reading, Poetry, Social Studies", "$4.50. Range $4 to $5.",
       "A Remembrance Day literacy mini-unit for Grades 4-6 with real Canadian history.\n\nIncluded: John McCrae biography "
       "(Guelph, Ontario), the full text of \"In Flanders Fields\" with numbered lines, poem analysis (speaker, rhyme scheme, "
       "metaphor, imagery), a biography of Francis Pegahmagabow of Wasauksing First Nation, one of Canada's most decorated "
       "Indigenous soldiers, Indigenous Veterans Day (November 8), a letter-of-thanks writing task, and answer keys.\n\n"
       "Ontario Language (2023) Strands A, C and D." + COMMON,
       ["Remembrance Day", "In Flanders Fields", "poetry analysis", "Indigenous veterans", "grade 5", "Ontario", "Canada", "John McCrae"])),
    ("Remembrance-Day-Grades-7-8-Ontario", "Remembrance Day", "Vimy Ridge, Poetry & Opinion Writing", "Grades 7-8", "remember", build_78,
     dict(inside=[3, 4, 5, 6, 7, 8], feature=3, feature_line=("Canada and Vimy Ridge", "HISTORY • PRIMARY SOURCE • OPINION"), key_page=9, preview=[1, 2, 3, 5, 7]),
     L("Remembrance Day Vimy Ridge & In Flanders Fields | Opinion Writing | Grades 7-8 | Ontario", "7th, 8th",
       "History, Reading, Writing", "$4.50. Range $4 to $5.",
       "A Remembrance Day mini-unit for Grades 7-8 that builds historical thinking.\n\nIncluded: Canada and Vimy Ridge "
       "informational text (with the historians' debate about Vimy's meaning), text analysis questions, \"In Flanders "
       "Fields\" as a primary source (form, perspective, context, critical reading), an opinion writing planner (Should "
       "Remembrance Day be a statutory holiday in Ontario?), a rubric using the Ontario achievement chart, and answer "
       "keys.\n\nOntario Language (2023) Strands C and D; extends Grade 8 History." + COMMON,
       ["Remembrance Day", "Vimy Ridge", "In Flanders Fields", "opinion writing", "grade 7", "grade 8", "Ontario", "Canadian history"])),
]

if __name__ == "__main__":
    for slug, title, sub, grades, theme, fn, extras, lst in JOBS:
        b = Book(slug, title, sub, grades, theme, cover_art, ribbon="ONTARIO CURRICULUM",
                 badge_line="NO PREP  •  PRINT & GO  •  " + ("GENTLE & AGE-APPROPRIATE" if fn is build_k else "ANSWER KEYS"))
        run(fn, b, listing=lst, **extras)
