"""Halloween Narrative Writing - Grades 4-6 (Ontario Language 2023). Mentor story, story elements, story mountain,
show-don't-tell, prompts, writing paper, checklist, achievement-chart rubric, keys."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from kit import Book, run, style, W, H, M, INK, GREY, KEYRED
from kit.halloween import night_scene, pumpkin, bat
from reportlab.lib.colors import HexColor, white

ONT = ("Ontario Language Curriculum (2023), Grades 4-6: <b>Strand D Composition</b> (D1 Developing Ideas and Organizing "
       "Content; D2 Creating Texts, including narrative elements, voice and word choice; D3 Publishing, Presenting and "
       "Reflecting, including revising and editing) and <b>Strand C Comprehension</b> (C1 Knowledge about Texts: "
       "analysing the elements of a narrative in a mentor text). The rubric uses the four categories of the Ontario "
       "achievement chart (Knowledge and Understanding, Thinking, Communication, Application) with Levels 1-4.")

STORY = [
    "Nadia had walked past the old house on Maple Street every day since September, but she had never seen a light in "
    "its windows. Not until Halloween night.",
    "\"Look,\" she whispered, tugging her little brother's sleeve. A small orange glow flickered in the attic window, "
    "then disappeared. Omar's paper crown slipped over one eye. \"Maybe it's a ghost,\" he said, but he didn't let go "
    "of her hand.",
    "The wind rattled the dry leaves along the sidewalk. Every other house on the street was busy with music and "
    "laughter, but this porch was dark and silent. Nadia's heart thumped like a drum. She wanted to keep walking. She "
    "also wanted to know.",
    "\"We'll just knock once,\" she decided.",
    "The steps creaked under their boots. Before Nadia could knock, the door swung open. A tall man with a grey beard "
    "and flour on his sweater peered down at them. Behind him, the hallway smelled of cinnamon and roasted pumpkin "
    "seeds.",
    "\"Trick or treat?\" Omar squeaked.",
    "The man's face broke into a wide smile. \"My first trick-or-treaters! I'm Mr. Abara. I just moved here, and I "
    "carved all these,\" he said, pointing to a row of jack-o'-lanterns lined up on the stairs, \"but no one has come.\"",
    "Nadia looked at the dark porch and understood. \"Nobody can see them from the street,\" she said. \"Can we help?\"",
    "Together they carried the pumpkins outside, one by one, and lit the candles. Soon the porch glowed with grinning "
    "faces. Within minutes, a group of superheroes came running up the path, then a dinosaur, then a whole family of "
    "witches.",
    "When Nadia and Omar finally headed home, their bags were heavy and their cheeks were cold. Nadia looked back. "
    "The old house on Maple Street was the brightest house on the block."]

ELEMENTS = [("Characters", "Nadia, her little brother Omar, Mr. Abara (new neighbour)"),
            ("Setting", "Halloween night, an old house on Maple Street"),
            ("Problem", "Nadia is curious and scared about the light; Mr. Abara has no trick-or-treaters because his porch is dark"),
            ("Key events", "They see a light, knock, meet Mr. Abara, carry the jack-o'-lanterns outside and light them"),
            ("Solution", "The glowing porch brings trick-or-treaters; the house becomes the brightest on the block"),
            ("Theme / message", "Courage and kindness can change things; don't judge something by how it looks")]

SDT = [("Nadia was scared.", "Nadia's heart thumped like a drum. (from the story)"),
       ("The house was creepy.", "Example: Paint peeled from the shutters, and a single window stared down at the street like an empty eye."),
       ("It was cold outside.", "Example: Our breath puffed out in little clouds, and I shoved my numb fingers deep into my pockets."),
       ("The jack-o'-lantern looked happy.", "Example: A crooked grin stretched across the pumpkin's face, glowing warm and orange."),
       ("Omar was excited.", "Example: Omar bounced on his toes and swung his treat bag so hard it nearly flew away."),
       ("The kitchen smelled good.", "Example: Cinnamon and toasted pumpkin seeds drifted down the hallway.")]

PROMPTS = ["You find a pumpkin on your doorstep with a note inside that says, \"Open me at midnight.\"",
           "Your costume starts to give you its powers. What happens next?",
           "The school's lost-and-found box begins to whisper on Halloween afternoon.",
           "A friendly ghost moves into your classroom and needs help with a problem.",
           "You and a friend take a wrong turn while trick-or-treating and end up somewhere surprising.",
           "A black cat follows you all day on October 31. At sunset, it speaks.",
           "Write the story of a jack-o'-lantern, from the pumpkin patch to Halloween night.",
           "The power goes out during your family's Halloween party.",
           "A new neighbour moves into the old house on your street. Tell the story from the neighbour's point of view.",
           "Your little sibling's stuffed bat flies out the window. You have to get it back.",
           "Everyone in town wakes up on November 1 and the candy has all disappeared.",
           "Write your own Halloween story idea, then have a partner approve it."]

RUBRIC = [("Knowledge &\nUnderstanding", ["limited use of narrative elements (characters, setting, problem, solution)",
                                          "some use of narrative elements", "considerable use of narrative elements",
                                          "thorough, purposeful use of narrative elements"]),
          ("Thinking", ["plans and develops ideas with limited effectiveness", "plans and develops ideas with some effectiveness",
                        "plans and develops ideas with considerable effectiveness", "plans and develops ideas with a high degree of effectiveness"]),
          ("Communication", ["descriptive language and voice used with limited effectiveness", "some descriptive language; voice developing",
                             "considerable descriptive language; clear voice", "vivid, precise word choice; strong, engaging voice"]),
          ("Application", ["applies spelling, grammar and punctuation conventions with limited accuracy", "some accuracy in conventions",
                           "considerable accuracy in conventions", "a high degree of accuracy; revises and edits independently"])]


def story_pages(b):
    st = style(12.2, 18.2)
    y = b.header("Mentor Text: The Lantern on Maple Street", "Read like a writer", name=False)
    for i, para in enumerate(STORY):
        p_h = len(para)
        if y < 120:
            b.page("story"); y = b.header("The Lantern on Maple Street (continued)", "Read like a writer", name=False)
        y = b.para(para, M, y, W - 2 * M, st) - 9


def elements_page(b, key):
    y = b.header("Story Elements", "Analyse the mentor text")
    if key: b.key_stamp()
    c = b.c
    for i, (name, ans) in enumerate(ELEMENTS):
        h = 86
        c.setFillColor(b.t.light); c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); c.roundRect(M, y - h, 140, h - 6, 10, fill=1)
        c.setFillColor(b.t.primary); c.setFont("BodyB", 14); c.drawCentredString(M + 70, y - h / 2 - 2, name)
        c.setStrokeColor(GREY); c.setLineWidth(0.6)
        for k in range(0 if key else 3): c.line(M + 156, y - 26 - k * 22, W - M, y - 26 - k * 22)
        if key: b.para(f'<font color="#D62828"><b>{ans}</b></font>', M + 158, y - 6, W - 2 * M - 160, style(11, 14.5))
        y -= h + 4


def mountain(b):
    y = b.header("Story Mountain Planner", "Plan your story")
    c = b.c
    c.setFont("BodyB", 12); c.setFillColor(INK)
    c.drawString(M, y, "Title: ____________________________________________________________")
    c.drawString(M, y - 24, "Point of view (circle):   first person (I)     third person (he / she / they)")
    c.drawString(M, y - 48, "Theme or message: _______________________________________________")
    base, peak = 50, (W / 2, y - 92)
    c.setStrokeColor(b.t.primary); c.setLineWidth(5)
    c.line(M + 10, base, peak[0], peak[1]); c.line(peak[0], peak[1], W - M - 10, base)
    bw, bh = 186, 120
    boxes = [("Beginning", "characters, setting", M, base + 150), ("Problem", "what goes wrong?", M + 30, base + 330),
             ("Climax", "most exciting part", W / 2 - bw / 2, peak[1]), ("Falling action", "how it starts to resolve", W - M - 30 - bw, base + 330),
             ("Ending", "solution, feelings", W - M - bw, base + 150)]
    for name, hint, x, top in boxes:
        c.setFillColor(white); c.setStrokeColor(INK); c.setLineWidth(1.2); c.roundRect(x, top - bh, bw, bh, 10, fill=1)
        c.setFillColor(b.t.primary); c.setFont("BodyB", 12); c.drawString(x + 10, top - 18, name)
        c.setFillColor(GREY); c.setFont("Body", 9); c.drawString(x + 10, top - 31, hint)


def senses_page(b):
    y = b.header("Spooky Senses Word Bank", "Descriptive language")
    c = b.c
    banks = [("See", "flickering, shadowy, glowing, crooked, misty, pale, gleaming, tattered"),
             ("Hear", "creaking, rustling, howling, whispering, thumping, crunching, hooting, rattling"),
             ("Smell", "smoky, musty, cinnamon, damp leaves, toasted seeds, candle wax, earthy"),
             ("Touch", "icy, sticky, prickly, slimy, velvety, brittle, clammy, scratchy"),
             ("Taste", "sugary, sour, buttery, spiced, tangy, chewy, crisp, bittersweet")]
    for name, words in banks:
        c.setFillColor(b.t.primary); c.roundRect(M, y - 64, 110, 58, 10, stroke=0, fill=1)
        c.setFillColor(white); c.setFont("Anton", 22); c.drawCentredString(M + 55, y - 44, name.upper())
        b.para(words, M + 124, y - 8, W - 2 * M - 124, style(13, 18))
        c.setStrokeColor(GREY); c.setLineWidth(0.6); c.line(M + 124, y - 56, W - M, y - 56)
        y -= 76
    y -= 4
    b.para("<b>Add your own words</b> on the lines above as you read and write.", M, y, W - 2 * M, style(11.5, 15))
    y -= 30
    b.question(1, "Write one sentence about a Halloween night that uses at least three senses.", y, 3)


def sdt_page(b, key):
    y = b.header("Show, Don't Tell", "Craft practice")
    if key: b.key_stamp()
    y = b.para("Writers <b>show</b> feelings and details instead of just <b>telling</b> them. Rewrite each sentence so the "
               "reader can see, hear or feel it. Number 1 is done for you.", M, y, W - 2 * M, style(12, 16)) - 10
    for i, (tell, show) in enumerate(SDT, 1):
        if i == 1:
            b.badge(M + 10, y - 8, 1)
            b.para(f"<b>Tell:</b> {tell}", M + 28, y, W - 2 * M - 28, style(12, 15))
            b.para(f"<b>Show:</b> <i>{show}</i>", M + 28, y - 20, W - 2 * M - 28, style(12, 15, b.t.primary))
            y -= 62; continue
        y = b.question(i, f"<b>Tell:</b> {tell}", y, 2, answer=show if key else None)


def prompts_page(b):
    y = b.header("Halloween Story Prompts", "Choose one")
    c = b.c; cw = (W - 2 * M - 12) / 2; ch = 98
    for i, p in enumerate(PROMPTS):
        r, k = divmod(i, 2); x, yy = M + k * (cw + 12), y - r * (ch + 6)
        c.setFillColor(b.t.light); c.setStrokeColor(b.t.primary); c.setLineWidth(1.2); c.roundRect(x, yy - ch, cw, ch, 12, fill=1)
        b.badge(x + 18, yy - 18, i + 1, r=11)
        b.para(p, x + 36, yy - 10, cw - 48, style(11.5, 15))


def paper(b, first):
    y = b.header("My Halloween Story", "Draft" if first else "Draft (continued)")
    c = b.c
    if first:
        c.setFont("BodyB", 12); c.setFillColor(INK); c.drawString(M, y, "Title: ________________________________________________"); y -= 14
    pumpkin(c, W - M - 30, 70, 22); bat(c, M + 40, 74, 50)
    b.rule_lines(M, y, W - 2 * M, int((y - 110) / 26), 26)


def checklist(b):
    y = b.header("Revise & Edit Checklist", "Self and peer check")
    c = b.c
    items = [("Revise (make it better)", ["My beginning hooks the reader.", "I introduce my characters and setting.",
                                           "My story has a clear problem and a solution.", "Events are in an order that makes sense, with transition words.",
                                           "I used descriptive language and at least three senses.", "I showed feelings instead of just telling them.",
                                           "My ending wraps up the problem."]),
             ("Edit (make it correct)", ["Every sentence starts with a capital and ends with punctuation.", "Dialogue uses quotation marks and a new paragraph for each speaker.",
                                          "I checked my spelling, including Canadian spellings (colour, neighbour).", "I used paragraphs."])]
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
    y = b.header("Narrative Writing Rubric", "Ontario achievement chart", name=False)
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
    b.cover(["mentor text", "planners", "prompts", "rubric", "Ontario aligned"])
    b.guide("Everything you need for a Halloween narrative writing unit in Grades 4-6: an original, not-too-scary mentor "
            "story, story analysis, a story mountain planner, a spooky senses word bank, show-don't-tell practice, 12 "
            "prompts, themed writing paper, a revise-and-edit checklist and a rubric built on the Ontario achievement chart.",
            [("story", "Mentor text: The Lantern on Maple Street"), ("elem", "Story Elements organizer"),
             ("mtn", "Story Mountain Planner"), ("senses", "Spooky Senses Word Bank"), ("sdt", "Show, Don't Tell practice"),
             ("prompts", "12 Halloween story prompts"), ("paper", "Writing paper (2 pages)"), ("check", "Revise & Edit Checklist"),
             ("rubric", "Narrative rubric (Levels 1-4)"), ("keys", "Answer keys"), ("terms", "Terms of use")],
            [("Suggested sequence", "Day 1: read and analyse the mentor text. Day 2: word bank and show-don't-tell. "
              "Day 3: choose a prompt and plan. Days 4-5: draft. Day 6: revise, edit and conference."),
             ("Inclusive note", "The mentor text and prompts are spooky-fun rather than frightening, so they work in most "
              "classrooms. Students who do not celebrate Halloween can write an autumn or \"mystery\" story instead.")], ONT)
    b.page("story"); story_pages(b)
    b.page("elem"); elements_page(b, False)
    b.page("mtn"); mountain(b)
    b.page("senses"); senses_page(b)
    b.page("sdt"); sdt_page(b, False)
    b.page("prompts"); prompts_page(b)
    b.page("paper"); paper(b, True)
    b.page("paper"); paper(b, False)
    b.page("check"); checklist(b)
    b.page("rubric"); rubric(b)
    b.page("keys"); elements_page(b, True)
    b.page("keys"); sdt_page(b, True)
    b.terms()


LISTING = dict(
    tpt_title="Halloween Narrative Writing Grades 4-6 | Mentor Text, Prompts, Rubric | Ontario Language",
    price="$5.00. Range $4.50 to $6 (full mini-unit).", grades="4th, 5th, 6th", subjects="Writing, Creative Writing, Halloween",
    type="Unit Plans, Writing Prompts, Rubrics",
    description="""
A complete **Halloween narrative writing mini-unit** for Grades 4-6, aligned to the **Ontario Language Curriculum (2023)**.

**What's included:**
- The Lantern on Maple Street: an original mentor text that is spooky-fun, not scary
- Story Elements organizer with answer key
- Story Mountain planner
- Spooky Senses word bank
- Show, Don't Tell craft practice with exemplars
- 12 Halloween story prompts
- Themed writing paper (2 pages)
- Revise and Edit checklist (self and peer)
- Rubric using the Ontario achievement chart categories, Levels 1-4
- Teacher guide with a 6-day sequence

**Ontario curriculum:** Language (2023), Strand D Composition (D1, D2, D3) and Strand C Comprehension (C1)

Canadian spelling throughout.
""",
    keywords=["Halloween writing", "narrative writing", "Ontario language", "writing prompts", "mentor text", "story mountain",
              "show don't tell", "grade 5 writing", "writing rubric", "creative writing"])

if __name__ == "__main__":
    b = Book("Halloween-Narrative-Writing-Grades-4-6-Ontario", "Halloween Writing", "Narrative Writing Mini-Unit",
             "Grades 4-6", "spooky", night_scene, ribbon="ONTARIO CURRICULUM")
    run(build, b, inside=[3, 5, 6, 8, 9, 14], feature=6, feature_line=("Plan it, write it, revise it", "MENTOR TEXT • PLANNERS • RUBRIC"),
        key_page=15, preview=[1, 2, 3, 6, 9, 14], listing=LISTING)
