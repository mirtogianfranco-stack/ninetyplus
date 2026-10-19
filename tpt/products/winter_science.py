"""Winter Science (Grades 1-2, Ontario Science 2022): Grade 1 Daily and Seasonal Changes; Grade 2 Air and Water in the
Environment. Two passages, questions, a winter/summer sort, a melting-ice investigation, vocabulary, keys."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
from kit import Book, run, style, W, H, M, INK, GREY, KEYRED
from kit.winter import snowflake, snowman, mitten, toque, tree, mug, winter_scene, NAVY
from reportlab.lib.colors import white
from remembrance_day import mc_block, passage, vocab

ONT = ("Ontario Science and Technology Curriculum (2022): Grade 1 <b>Strand E Earth and Space Systems: Daily and Seasonal "
       "Changes</b> (how seasonal changes affect living things, including people, plants and animals); Grade 2 <b>Strand E "
       "Earth and Space Systems: Air and Water in the Environment</b> (states of water, freezing and melting, water in the "
       "environment); and <b>Strand A STEM Skills and Connections</b> (A1 predicting, observing and recording in a "
       "scientific investigation).")

PA = ["Winter is the coldest season in Canada. It begins in December. The days are short and the nights are long.",
      "In many places, snow covers the ground. Ponds and lakes freeze into ice.",
      "Some trees lose their leaves in the fall, so their branches are bare all winter. <b>Evergreen</b> trees keep their "
      "needles all year.",
      "Animals get ready for winter in different ways. Many Canada geese <b>migrate</b>, or fly south, where it is warmer. "
      "Groundhogs <b>hibernate</b>: they sleep deeply through the winter. The snowshoe hare grows a white coat to hide in "
      "the snow.",
      "People change too! We wear warm coats, toques, mittens and boots. We go skating and sledding, and we build snow forts."]
MCA = [("Which season is the coldest in Canada?", ["Summer", "Winter", "Spring", "Fall"], 1),
       ("What do evergreen trees keep all year?", ["Their flowers", "Their needles", "Their fruit", "Their nests"], 1),
       ("Why does the snowshoe hare grow a white coat?", ["To stay cool", "To hide in the snow", "To fly south", "To find food"], 1)]
SAA = [("Name two things people wear to stay warm in winter.", "Any two: coats, toques, mittens, boots (paragraph 5)."),
       ("Choose one animal. How does it get ready for winter?", "Canada geese migrate south; groundhogs hibernate; snowshoe hares grow a white coat (paragraph 4).")]

PB = ["Water can be a <b>solid</b>, a <b>liquid</b> or a <b>gas</b>. Ice and snow are solid water. The water in a glass is "
      "liquid. <b>Water vapour</b> is water as a gas. It is in the air all around us, but we cannot see it.",
      "When liquid water gets cold enough, it <b>freezes</b> and becomes ice. Fresh water freezes at 0 degrees Celsius "
      "(0°C). That is why puddles turn to ice on cold winter days.",
      "Snow forms high up in the clouds. When it is very cold, water vapour freezes into tiny ice crystals. The crystals "
      "join together to make snowflakes, which fall to the ground.",
      "When the temperature rises above 0°C, ice and snow <b>melt</b> and become liquid water again. In spring, melting "
      "snow fills rivers and soaks into the ground.",
      "In winter, people spread salt on icy sidewalks and roads. Salt helps ice melt even when it is a little colder than "
      "0°C. This keeps people from slipping."]
MCB = [("Which one is solid water?", ["Rain", "Ice", "Water vapour", "Juice"], 1),
       ("At what temperature does fresh water freeze?", ["10°C", "100°C", "0°C", "50°C"], 2),
       ("Why do people put salt on icy sidewalks?", ["To make them sparkle", "To help the ice melt so people don't slip", "To feed the birds", "To make more snow"], 1)]
SAB = [("What happens to a snowman when the temperature rises above 0°C? Use the word <i>melt</i>.", "The snow melts and becomes liquid water, so the snowman gets smaller (paragraph 4)."),
       ("Explain how snow is made.", "High in the clouds, water vapour freezes into tiny ice crystals that join together into snowflakes and fall (paragraph 3).")]

SORT = [("toque", "W"), ("sandals", "S"), ("mittens", "W"), ("sunscreen", "S"), ("snow pants", "W"), ("swimming in a lake", "S"),
        ("skating on a pond", "W"), ("picking strawberries", "S"), ("shovelling snow", "W"), ("long, sunny evenings", "S"),
        ("building a snowman", "W"), ("leaves on every tree", "S")]
VOC = [("season", "one of the four parts of the year"), ("migrate", "to travel to a new place for the season"),
       ("hibernate", "to sleep deeply through the winter"), ("freeze", "to change from a liquid to a solid"),
       ("melt", "to change from a solid to a liquid"), ("water vapour", "water as a gas in the air")]
VORD = [3, 5, 0, 2, 4, 1]


def questions(b, title, mcs, sas, key):
    y = b.header(title, "Show what you know")
    if key: b.key_stamp()
    for i, (q, o, a) in enumerate(mcs, 1):
        y = mc_block(b, i, q, o, y, a if key else None)
    for j, (q, a) in enumerate(sas, len(mcs) + 1):
        y = b.question(j, q, y, 3, answer=a if key else None)


def sort_mat(b, key):
    y = b.header("Winter or Summer?", "Cut and sort")
    if key: b.key_stamp()
    b.para("Cut out the cards at the bottom. Glue each card under <b>Winter</b> or <b>Summer</b>.", M, y, W - 2 * M, style(13, 17))
    c = b.c; y -= 34; cw = (W - 2 * M - 16) / 2; ch = 280
    for i, (title, code) in enumerate([("WINTER", "W"), ("SUMMER", "S")]):
        x = M + i * (cw + 16)
        c.setFillColor(b.t.dark if code == "W" else b.t.accent); c.roundRect(x, y - 40, cw, 40, 10, stroke=0, fill=1)
        c.setFillColor(white); c.setFont(b.t.display, 22); c.drawCentredString(x + cw / 2, y - 29, title.title())
        c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); c.roundRect(x, y - 40 - ch, cw, ch, 10)
        if key:
            for j, t in enumerate([t for t, k in SORT if k == code]):
                c.setFillColor(KEYRED); c.setFont("BodyB", 13); c.drawString(x + 14, y - 66 - j * 26, f"• {t}")
    y -= ch + 56
    cw2, ch2 = (W - 2 * M) / 4, 52
    for j, (t, _) in enumerate(SORT):
        r, k = divmod(j, 4); x, yy = M + k * cw2, y - r * ch2
        c.setDash(4, 3); c.setStrokeColor(GREY); c.rect(x, yy - ch2, cw2, ch2); c.setDash()
        b.para(t, x + 6, yy - 10, cw2 - 12, style(12, 15, align=1))


def investigation(b, key):
    y = b.header("Melting Ice Investigation", "Predict  •  observe  •  record")
    if key: b.key_stamp()
    c = b.c
    y = b.para("<b>Question:</b> What makes ice melt faster?", M, y, W - 2 * M, style(13, 17)) - 6
    y = b.para("<b>You need:</b> 3 ice cubes the same size, 3 small plates, salt, sand, a spoon and a timer.", M, y, W - 2 * M, style(12, 16)) - 6
    y = b.para("<b>Do:</b> Put one ice cube on each plate. Sprinkle a spoonful of salt on cube A and a spoonful of sand on cube B. "
               "Leave cube C plain. Check every 5 minutes. <b>Safety:</b> do not taste anything, and wash your hands after.",
               M, y, W - 2 * M, style(12, 16)) - 12
    y = b.question(1, "<b>Predict:</b> Which ice cube will melt first? Why?", y, 2,
                   answer="Predictions vary." if key else None)
    cols = ["Time", "A: salt", "B: sand", "C: plain"]; rows = [("5 min", "", "", ""), ("10 min", "", "", ""), ("15 min", "", "", ""), ("20 min", "", "", "")]
    c.setFillColor(INK); c.setFont("BodyB", 12); c.drawString(M, y, "Observe: draw or write what each ice cube looks like."); y -= 8
    y = b.table(cols, rows, M, y, [90, 142, 142, 142], rh=38, fs=11) - 18
    y = b.question(2, "<b>Conclude:</b> Which ice cube melted fastest? Was your prediction correct?", y, 2,
                   answer="Usually A (salt) melts fastest; salt helps ice melt at a lower temperature. Sand and plain ice are often similar." if key else None)


def build(b):
    b.cover(["2 passages", "sort", "ice investigation", "Ontario aligned"])
    b.guide("Winter science for Grades 1 and 2. Grade 1 students read about how winter changes plants, animals and people, "
            "then sort winter and summer cards. Grade 2 students read about water as a solid, liquid and gas, then run a "
            "melting-ice investigation. Split classes can use both parts.",
            [("pa", "Passage: Winter Is Here! (Grade 1)"), ("qa", "Questions: Winter Is Here!"), ("sort", "Winter or Summer? cut-and-sort"),
             ("pb", "Passage: Water in Winter (Grade 2)"), ("qb", "Questions: Water in Winter"), ("inv", "Melting Ice Investigation"),
             ("voc", "Winter Science Words vocabulary match"), ("keys", "Answer keys"), ("terms", "Terms of use")],
            [("Investigation tip", "Salt usually melts ice fastest because it lowers the temperature at which ice melts. "
              "In bright sunlight, dark sand can also speed up melting. That's a great discussion point!"),
             ("Facts", "Science content was written to match Ontario Science and Technology (2022) Grade 1 and Grade 2 expectations.")], ONT)
    b.page("pa"); passage(b, "Winter Is Here!", "Read  •  Grade 1 science", PA, 15, 22)
    b.page("qa"); questions(b, "Winter Is Here! Questions", MCA, SAA, False)
    b.page("sort"); sort_mat(b, False)
    b.page("pb"); passage(b, "Water in Winter", "Read  •  Grade 2 science", PB, 13.5, 20.5)
    b.page("qb"); questions(b, "Water in Winter: Questions", MCB, SAB, False)
    b.page("inv"); investigation(b, False)
    b.page("voc"); vocab(b, VOC, VORD, False, "Winter Science Words")
    b.page("keys"); questions(b, "Winter Is Here! Questions", MCA, SAA, True)
    b.page("keys"); sort_mat(b, True)
    b.page("keys"); questions(b, "Water in Winter: Questions", MCB, SAB, True)
    b.page("keys"); investigation(b, True)
    b.page("keys"); vocab(b, VOC, VORD, True, "Winter Science Words")
    b.terms()


LISTING = dict(
    tpt_title="Winter Science Grade 1 2 | Seasonal Changes & States of Water | Ontario Science 2022",
    price="$4.00. Range $3.50 to $4.50.", grades="1st, 2nd", subjects="Science, Winter", type="Reading Passages, Activities, Lab",
    description="Winter science aligned to the Ontario Science and Technology Curriculum (2022).\n\n"
                "Grade 1 (Daily and Seasonal Changes): Winter Is Here! passage about plants, animals and people in winter, "
                "comprehension questions, and a Winter or Summer? cut-and-sort.\n\nGrade 2 (Air and Water in the Environment): "
                "Water in Winter passage about solids, liquids, gases, freezing, melting and road salt, comprehension questions, "
                "and a Melting Ice Investigation (predict, observe, record, conclude).\n\nAlso included: a vocabulary match, "
                "answer keys, and a teacher guide. Metric units and Canadian spelling.",
    keywords=["winter science", "seasonal changes", "states of water", "Ontario science", "grade 1 science", "grade 2 science",
              "melting ice experiment", "air and water", "January", "no prep"])

if __name__ == "__main__":
    def art(b, x, y, w, h):
        winter_scene(b, x, y, w, h)
    b = Book("Winter-Science-Grades-1-2-Ontario", "Winter Science", "Seasonal Changes & Water in Winter", "Grades 1-2", "frost_kids",
             art, ribbon="ONTARIO CURRICULUM")
    run(build, b, inside=[3, 5, 6, 8, 9], feature=8, feature_line=("Hands-on winter science", "PASSAGES • SORT • ICE INVESTIGATION"),
        key_page=13, preview=[1, 2, 3, 5, 8], listing=LISTING)
