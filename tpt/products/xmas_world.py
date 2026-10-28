"""Christmas Around the World (Grades 2-4, Ontario): seven short nonfiction passages (Canada first), questions,
passport with cut-out stamps, continents page, Venn diagram, family-traditions writing, keys."""
import math, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
from kit import Book, run, style, W, H, M, INK, GREY, KEYRED
from kit.christmas import ornament, gift, candy_cane, stocking, bell, star, gingerbread, christmas_scene, RED, GREEN, GOLD
from kit.winter import tree
from reportlab.lib.colors import white, HexColor
from remembrance_day import mc_block

ONT = ("Ontario Language (2023), Grades 2-4: <b>Strand C Comprehension</b> (C1 informational texts and text features; "
       "C2 comprehension strategies: main idea, details, vocabulary) and <b>Strand A</b> (A3 exploring diverse cultures, "
       "perspectives and identities). Ontario Social Studies (2018/2023): <b>Grade 2 Heritage and Identity: Changes and "
       "Continuities</b> (traditions and celebrations in families and communities) and <b>Grade 2 People and Environments: "
       "Global Communities</b> (countries and continents of the world).")


def sun(c, x, y, s):
    c.saveState(); c.setFillColor(GOLD); c.setStrokeColor(GOLD); c.setLineWidth(max(1.5, s * .05))
    cx, cy = x, y + s / 2
    for i in range(12):
        a = math.radians(i * 30); c.line(cx + s * .3 * math.cos(a), cy + s * .3 * math.sin(a), cx + s * .48 * math.cos(a), cy + s * .48 * math.sin(a))
    c.circle(cx, cy, s * .24, stroke=0, fill=1); c.restoreState()


def lucia_crown(c, x, y, s):
    """Evergreen ring with five candles, front view."""
    c.saveState(); c.setFillColor(GREEN); c.ellipse(x - s * .48, y, x + s * .48, y + s * .26, stroke=0, fill=1)
    c.setFillColor(HexColor("#14532D"))
    for k in range(7): c.circle(x - s * .4 + k * s * .133, y + s * .13, s * .05, stroke=0, fill=1)
    for k in range(5):
        cx = x - s * .32 + k * s * .16; h = s * (.42 if k in (0, 4) else .5)
        c.setFillColor(white); c.setStrokeColor(HexColor("#94A3B8")); c.setLineWidth(.6); c.rect(cx - s * .04, y + s * .18, s * .08, h, fill=1)
        c.setFillColor(GOLD); p = c.beginPath(); fy = y + s * .18 + h
        p.moveTo(cx, fy + s * .16); p.curveTo(cx + s * .06, fy + s * .06, cx + s * .03, fy, cx, fy); p.curveTo(cx - s * .03, fy, cx - s * .06, fy + s * .06, cx, fy + s * .16)
        c.drawPath(p, stroke=0, fill=1)
    c.restoreState()


ART = {"tree": lambda c, x, y, s: tree(c, x, y, s), "star": lambda c, x, y, s: star(c, x, y + s * .45, s * .48),
       "candle": lambda c, x, y, s: lucia_crown(c, x, y, s), "gingerbread": lambda c, x, y, s: gingerbread(c, x, y, s),
       "sun": sun, "stocking": lambda c, x, y, s: stocking(c, x, y, s), "bell": lambda c, x, y, s: bell(c, x, y, s)}

P = [
 dict(t="Canada", sub="A Thank-You Tree", cont="North America", lang="English and French", hi="Merry Christmas! Joyeux Noël!", art="tree", paras=[
  "In December 1917, two ships crashed in the harbour of Halifax, Nova Scotia. One ship was carrying explosives. The "
  "huge explosion destroyed much of the city, and many people were hurt.",
  "People in Boston, a city in the United States, heard the news. They quickly sent a train full of doctors, nurses and "
  "supplies. A snowstorm slowed the train down, but the help still arrived.",
  "Nova Scotia never forgot this kindness. <b>Since 1971</b>, the province has sent a giant Christmas tree to Boston "
  "every year to say <b>thank you</b>. The tree is lit up at a big celebration in the city.",
  "Across Canada, families celebrate Christmas in many ways. Some go to church, some go skating or tobogganing, and many "
  "share a big meal with family and friends."],
  mc=[("Why does Nova Scotia send a tree to Boston?", ["To sell it", "To say thank you for Boston's help after the explosion", "Because Boston has no trees", "For a contest"], 1),
      ("What slowed down the train from Boston?", ["A snowstorm", "A flat tire", "A traffic jam", "A big hill"], 0),
      ("When did the yearly thank-you tree begin?", ["1917", "1950", "1971", "2001"], 2)],
  sa=[("What does this story teach us about kindness?", "Kindness is remembered for a long time. Boston helped, and Nova Scotia still says thank you every year (paragraphs 2-3)."),
      ("Name two ways families in Canada celebrate Christmas.", "Any two: going to church, skating, tobogganing, sharing a big meal (paragraph 4).")]),
 dict(t="Mexico", sub="Las Posadas", cont="North America", lang="Spanish", hi="¡Feliz Navidad!", art="star", paras=[
  "In Mexico, Christmas celebrations begin early. From <b>December 16 to December 24</b>, many families celebrate "
  "<b>Las Posadas</b>. That is nine nights in a row!",
  "<i>Posada</i> is a Spanish word that means <b>inn</b>, a place where travellers can stay. Las Posadas acts out the "
  "Christmas story of Mary and Joseph looking for a place to stay in Bethlehem.",
  "Each night, neighbours walk together from house to house, carrying candles and singing. At the first houses, they "
  "are told there is no room. At the last house, they are welcomed inside for a party.",
  "At the party, children take turns trying to break a <b>star-shaped piñata</b> filled with candy and fruit. When it "
  "breaks, everyone cheers!"],
  mc=[("How many nights does Las Posadas last?", ["Two", "Seven", "Nine", "Twelve"], 2),
      ("What does the word <i>posada</i> mean?", ["Party", "Inn", "Candle", "Star"], 1),
      ("What shape is the piñata in the text?", ["A star", "A donkey", "A heart", "A tree"], 0)],
  sa=[("Why do the neighbours walk from house to house?", "To act out Mary and Joseph looking for a place to stay (paragraphs 2-3)."),
      ("How is a posada party like a party you have been to? How is it different?", "Answers vary; look for one similarity and one difference.")]),
 dict(t="The Philippines", sub="Simbang Gabi and the Parol", cont="Asia", lang="Filipino and English", hi="Maligayang Pasko!", art="star", paras=[
  "The Philippines is a country in Asia made up of thousands of islands. For many people there, Christmas is the "
  "biggest celebration of the year. Some families start decorating as early as September!",
  "Starting on <b>December 16</b>, many people go to church very early in the morning, before the sun comes up, for "
  "nine days in a row. This is called <b>Simbang Gabi</b>.",
  "Homes and streets glow with <b>parols</b>. A parol is a lantern shaped like a star. It reminds people of the star of "
  "Bethlehem. Parols were first made of bamboo and paper. Today, many shine with coloured lights.",
  "On Christmas Eve, families gather for a big late-night meal called <b>Noche Buena</b>."],
  mc=[("What is a parol?", ["A kind of food", "A lantern shaped like a star", "A song", "A church"], 1),
      ("When does Simbang Gabi begin?", ["September 1", "December 16", "December 25", "January 5"], 1),
      ("What is Noche Buena?", ["A Christmas Eve meal", "A star lantern", "An island", "A morning church service"], 0)],
  sa=[("What were the first parols made of? What do many use today?", "Bamboo and paper; today many shine with coloured lights (paragraph 3)."),
      ("Why do you think some families start decorating in September?", "Answers vary, e.g., Christmas is the biggest celebration of the year, so they want it to last (paragraph 1).")]),
 dict(t="Sweden", sub="St. Lucia Day", cont="Europe", lang="Swedish", hi="God jul!", art="candle", paras=[
  "In Sweden, winter days are very short and dark. On <b>December 13</b>, people celebrate <b>St. Lucia Day</b>, a "
  "festival of light.",
  "In many schools and towns, a girl is chosen to be Lucia. She wears a white gown, a red sash and a <b>crown of "
  "candles</b> on her head. Today, the candles are often battery-powered to keep everyone safe.",
  "Lucia leads a line of children dressed in white. This is called a procession. They sing songs as they walk, and "
  "many carry candles.",
  "People enjoy saffron buns called <b>lussekatter</b>, which are often shaped like the letter S, and thin ginger "
  "cookies called <b>pepparkakor</b>."],
  mc=[("When is St. Lucia Day?", ["December 13", "December 24", "January 1", "June 21"], 0),
      ("Why are the candles often battery-powered today?", ["They are brighter", "To keep everyone safe", "They are cheaper", "Real candles are not allowed in Sweden"], 1),
      ("In paragraph 3, a <i>procession</i> is...", ["a kind of bun", "a line of people walking together", "a dark day", "a song"], 1)],
  sa=[("Why is light so important in Sweden in December?", "Winter days are very short and dark (paragraph 1)."),
      ("Describe what Lucia wears.", "A white gown, a red sash and a crown of candles (paragraph 2).")]),
 dict(t="Germany", sub="Advent and Christmas Markets", cont="Europe", lang="German", hi="Frohe Weihnachten!", art="gingerbread", paras=[
  "<b>Advent</b> is the four weeks before Christmas. Many families in Germany have an Advent wreath with <b>four "
  "candles</b>. They light one more candle each Sunday.",
  "Children may also have an Advent calendar. Each day, they open a little door to find a picture or a small treat.",
  "Germany is famous for its <b>Christmas markets</b>. Wooden huts fill the town squares, selling ornaments, toys, "
  "roasted nuts and gingerbread. One of the oldest known markets, in the city of Dresden, was first written about in "
  "<b>1434</b>. That is almost 600 years ago!",
  "A favourite holiday treat is <b>Stollen</b>, a fruit bread dusted with powdered sugar."],
  mc=[("How many candles are on an Advent wreath?", ["One", "Two", "Four", "Twelve"], 2),
      ("What can you buy at a German Christmas market?", ["Cars", "Ornaments, toys, roasted nuts and gingerbread", "Only trees", "Bikes"], 1),
      ("What is Stollen?", ["A candle", "A fruit bread", "A market", "A calendar"], 1)],
  sa=[("How do families use an Advent wreath to count down to Christmas?", "They light one more of its four candles each Sunday of Advent (paragraph 1)."),
      ("The Dresden market was first written about in 1434. About how long ago was that?", "Almost 600 years ago (paragraph 3).")]),
 dict(t="Australia", sub="Christmas in Summer", cont="Australia (Oceania)", lang="English", hi="Merry Christmas!", art="sun", paras=[
  "When it is winter in Canada, it is <b>summer</b> in Australia! Australia is in the <b>Southern Hemisphere</b>, so "
  "Christmas comes during one of the hottest times of the year.",
  "Many families celebrate outside. They might have a picnic or a barbecue, go to the beach or go for a swim.",
  "On Christmas Eve, people gather in parks to sing carols by candlelight. This tradition, called <b>Carols by "
  "Candlelight</b>, began in Melbourne in <b>1938</b>.",
  "In one fun Australian Christmas song, Santa's sleigh is pulled by six white kangaroos instead of reindeer!"],
  mc=[("Why is Christmas in summer in Australia?", ["Australia is in the Southern Hemisphere", "Australia has no winter", "Christmas is in July there", "It is always hot everywhere"], 0),
      ("Where did Carols by Candlelight begin?", ["Sydney", "Melbourne", "Toronto", "Halifax"], 1),
      ("In the song, what pulls Santa's sleigh?", ["Reindeer", "Horses", "Six white kangaroos", "Koalas"], 2)],
  sa=[("Name two ways families in Australia celebrate outside.", "Any two: a picnic, a barbecue, the beach, swimming, singing carols in parks (paragraphs 2-3)."),
      ("How would your Christmas or winter break be different if it were summer?", "Answers vary; look for a clear comparison.")]),
 dict(t="Italy", sub="La Befana", cont="Europe", lang="Italian", hi="Buon Natale!", art="stocking", paras=[
  "In Italy, many families set up a <b>presepe</b>, a small model of the Christmas story with figures of Mary, Joseph, "
  "the baby Jesus, shepherds and animals.",
  "In Italy, the holidays do not end on December 25. On the night of <b>January 5</b>, children wait for <b>La Befana</b>.",
  "In the story, La Befana is a kind old woman who flies on a broomstick. She fills children's stockings with candy "
  "and small gifts. Children who misbehaved might find a lump of \"coal\", which is often black candy!",
  "Some say La Befana sweeps the floor before she leaves. Families may leave her a small snack to thank her."],
  mc=[("What is a presepe?", ["A broomstick", "A model of the Christmas story", "A candy", "A stocking"], 1),
      ("When does La Befana visit?", ["The night of December 24", "The night of January 5", "December 13", "December 16"], 1),
      ("What do children who misbehaved find?", ["Nothing at all", "A lump of \"coal\", often black candy", "A new broom", "A presepe"], 1)],
  sa=[("How is La Befana like Santa Claus? How is she different?", "Alike: she brings gifts and candy and fills stockings at night. Different: she is an old woman on a broomstick and visits on January 5 (paragraphs 2-3)."),
      ("Why does the author put \"coal\" in quotation marks?", "Because it is not real coal; it is often black candy that looks like coal (paragraph 3).")]),
]


def passage_page(b, p):
    y = b.header(f"{p['t']}: {p['sub']}", "Christmas Around the World  •  Read")
    c = b.c
    c.setFillColor(b.t.light); c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); c.roundRect(M, y - 92, W - 2 * M, 92, 12, fill=1)
    ART[p["art"]](c, M + 52, y - 82, 70)
    for i, (k, v) in enumerate([("Continent", p["cont"]), ("Language", p["lang"]), ("Say it!", p["hi"])]):
        c.setFillColor(b.t.primary); c.setFont("BodyB", 12.5); c.drawString(M + 108, y - 26 - i * 24, k + ":")
        c.setFillColor(INK); c.setFont("BodyB" if k == "Say it!" else "Body", 13); c.drawString(M + 188, y - 26 - i * 24, v)
    y -= 112
    for i, para in enumerate(p["paras"], 1):
        b.badge(M + 10, y - 10, i, r=10, fill=b.t.primary)
        y = b.para(para, M + 28, y, W - 2 * M - 28, style(14.5, 22)) - 14
    assert y > 60, p["t"]
    if y > 150:
        for k, f in enumerate((ornament, bell, ornament)):
            f(c, W / 2 + (k - 1) * 70, 64, 44)


def q_page(b, p):
    y = b.header(f"{p['t']}: Questions", "Show what you know")
    for i, (q, o, a) in enumerate(p["mc"], 1):
        y = mc_block(b, i, q, o, y)
    for j, (q, a) in enumerate(p["sa"], 4):
        y = b.question(j, q, y, 3)


def passport(b):
    b.page("passport")
    y = b.header("My Christmas Passport", "Collect a stamp for every country")
    c = b.c; bw, bh = (W - 2 * M - 14) / 2, 128
    for i, p in enumerate(P + [dict(t="Bonus: ______________")]):
        x = M + (i % 2) * (bw + 14); top = y - (i // 2) * (bh + 10)
        c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); c.roundRect(x, top - bh, bw, bh, 12)
        c.setFillColor(b.t.primary); c.setFont("Anton", 15); c.drawString(x + 12, top - 22, p["t"].upper())
        c.setFillColor(INK); c.setFont("Body", 10.5)
        c.drawString(x + 12, top - 46, "Greeting: ____________________")
        c.drawString(x + 12, top - 70, "I learned: ____________________")
        c.drawString(x + 12, top - 92, "_______________________________")
        c.drawString(x + 12, top - 114, "_______________________________")
        c.setDash(3, 3); c.setStrokeColor(GREY); c.circle(x + bw - 42, top - bh / 2 - 6, 32); c.setDash()
        c.setFillColor(GREY); c.setFont("Body", 7.5); c.drawCentredString(x + bw - 42, top - bh / 2 - 9, "stamp here")


def stamps(b):
    b.page("stamps")
    y = b.header("Passport Stamps", "Cut out a stamp after you read each passage", name=False)
    c = b.c; cols = 3; cw = (W - 2 * M) / cols; ch = 172
    for i, p in enumerate(P):
        cx = M + cw * (i % cols) + cw / 2; cy = y - 20 - ch * (i // cols) - ch / 2
        c.setDash(4, 3); c.setStrokeColor(GREY); c.setLineWidth(1); c.rect(cx - cw / 2 + 6, cy - ch / 2 + 6, cw - 12, ch - 12); c.setDash()
        c.setStrokeColor([RED, GREEN][i % 2]); c.setLineWidth(3); c.circle(cx, cy, 62); c.setLineWidth(1); c.circle(cx, cy, 55)
        ART[p["art"]](c, cx, cy - 18, 46)
        c.setFillColor([RED, GREEN][i % 2]); c.setFont("Anton", 13 if len(p["t"]) < 12 else 10.5); c.drawCentredString(cx, cy + 34, p["t"].upper())
        c.setFont("BodyB", 8.5); c.drawCentredString(cx, cy - 36, p["hi"].split("!")[0] + "!")
    c.setFillColor(INK); c.setFont("Body", 10); c.drawCentredString(W / 2, 54, "Tip: print on cardstock or coloured paper. Colour each stamp before you glue it in!")


CONTS = ["North America", "Asia", "Europe", "Australia (Oceania)"]


def continents(b):
    b.page("map")
    y = b.header("Where in the World?", "Countries and continents")
    y = b.para("Use the <b>Fast Facts</b> box on each passage. Write the continent for each country. Then answer the "
               "questions.", M, y, W - 2 * M, style(13, 17)) - 10
    c = b.c; c.setFillColor(b.t.light); c.roundRect(M, y - 34, W - 2 * M, 34, 8, stroke=0, fill=1)
    c.setFillColor(INK); c.setFont("BodyB", 12); c.drawCentredString(W / 2, y - 22, "Word bank:   " + "   •   ".join(CONTS))
    y -= 50
    y = b.table(["Country", "Continent", "Hemisphere (N or S)"], [(p["t"], "", "") for p in P], M, y, [140, 190, 186], rh=30, fs=12) - 22
    for i, q in enumerate(["Which continent has the most countries from this resource?",
                           "Which country celebrates Christmas in summer? Why?",
                           "Which two countries are in North America?"], 1):
        y = b.question(i, q, y, 2)


def venn(b):
    b.page("venn")
    y = b.header("Compare Two Countries", "Venn diagram")
    c = b.c
    c.setFont("Body", 12); c.setFillColor(INK)
    c.drawString(M, y, "Country 1: ______________________"); c.drawRightString(W - M, y, "Country 2: ______________________")
    cy = y - 240; r = 168
    c.setStrokeColor(b.t.primary); c.setLineWidth(2.5); c.circle(W / 2 - 92, cy, r); c.circle(W / 2 + 92, cy, r)
    c.setFillColor(b.t.primary); c.setFont("BodyB", 13); c.drawCentredString(W / 2, cy + 105, "Both")
    y = cy - r - 30
    b.question(1, "Write two sentences that compare the countries. Use <i>both</i> and <i>but</i>.", y, 3)


def family(b):
    b.page("family")
    y = b.header("Our Family Traditions", "Writing")
    y = b.para("Every family celebrates in its own way. Some families celebrate Christmas, some celebrate other holidays, and "
               "some have special winter traditions. Write about <b>a tradition your family enjoys</b>. Draw a picture too!",
               M, y, W - 2 * M, style(13, 18)) - 12
    c = b.c; c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); c.roundRect(M, y - 200, W - 2 * M, 200, 12)
    y -= 216
    for k, prompt in enumerate(["Our tradition is ...", "We celebrate by ...", "My favourite part is ... because ..."]):
        c.setFillColor(b.t.primary); c.setFont("BodyB", 12.5); c.drawString(M, y - 10, prompt)
        y = b.rule_lines(M, y - 12, W - 2 * M, 3, gap=27) - 18


def build(b):
    b.cover(["7 countries", "passport", "questions", "Ontario aligned"])
    b.guide("Travel the world this December! Seven short, original nonfiction passages (one per country, starting with a "
            "Canadian story) each have a Fast Facts box (continent, language and a greeting to say aloud), numbered "
            "paragraphs and a question page. Students collect a passport stamp after each country.",
            [(f"c{i}", f"{p['t']}: {p['sub']} (passage + questions)") for i, p in enumerate(P)] + [
             ("passport", "My Christmas Passport"), ("stamps", "Passport stamps to cut out"),
             ("map", "Where in the World? (continents and hemispheres)"), ("venn", "Compare Two Countries Venn diagram"),
             ("family", "Our Family Traditions writing page"), ("keys", "Answer keys"), ("terms", "Terms of use")],
            [("How to use", "Read one country a day, or set up seven stations. Model the first passage together. Grade 2: "
              "read aloud and answer orally; Grade 4: independent reading plus the Venn diagram."),
             ("Inclusive approach", "Traditions are described factually and respectfully. Not every family celebrates "
              "Christmas, and the family-traditions page lets every student share a tradition of their own."),
             ("Facts", "Facts were checked against reference sources. The Halifax passage mentions the 1917 explosion "
              "gently and focuses on kindness; preview it for your class.")], ONT)
    for i, p in enumerate(P):
        b.page(f"c{i}"); passage_page(b, p)
        b.page(f"c{i}"); q_page(b, p)
    passport(b); stamps(b); continents(b); venn(b); family(b)
    sections = []
    for p in P:
        sections.append((p["t"], [f"{'ABCD'[a]}. {o[a]}" for q, o, a in p["mc"]] + [a for q, a in p["sa"]]))
    hemi = {"Australia": "Southern"}
    sections.append(("Where in the World?", [f"{p['t']}: {p['cont']}, {hemi.get(p['t'], 'Northern')} Hemisphere" for p in P] +
                     ["Europe (Sweden, Germany, Italy)", "Australia, because it is in the Southern Hemisphere", "Canada and Mexico"]))
    b.text_key("Answer Key", sections, size=10.5)
    b.terms()


LISTING = dict(
    tpt_title="Christmas Around the World Reading Passages & Passport | Grades 2-4 | Canada | Ontario",
    price="$5.00. Range $4.50 to $5.50.", grades="2nd, 3rd, 4th", subjects="Reading, Social Studies, Christmas", type="Reading Passages, Activities",
    description="""
Take your class **around the world this December**! Seven short, original nonfiction passages, starting with a
Canadian story, each with a Fast Facts box (continent, language and a greeting to say aloud) and a question page.
Students collect a **passport stamp** for every country.

**Countries:**
- Canada: A Thank-You Tree (Nova Scotia's yearly gift to Boston)
- Mexico: Las Posadas
- The Philippines: Simbang Gabi and the parol
- Sweden: St. Lucia Day
- Germany: Advent and Christmas markets
- Australia: Christmas in summer
- Italy: La Befana

**Also included:** My Christmas Passport, cut-out stamps, Where in the World? continents and hemispheres page,
Compare Two Countries Venn diagram, Our Family Traditions writing page (inclusive for every family), answer keys
and a teacher guide.

**Ontario curriculum:** Language (2023) Strands A and C; Social Studies Grade 2 Changes and Continuities (traditions
and celebrations) and Global Communities.
""",
    keywords=["christmas around the world", "holidays around the world", "reading passages", "passport", "grade 2", "grade 3",
              "grade 4", "Ontario", "Canadian", "December reading"])

if __name__ == "__main__":
    b = Book("Christmas-Around-the-World-Grades-2-4-Ontario", "Christmas Around the World", "Reading Passages & Passport",
             "Grades 2-4", "christmas", christmas_scene, ribbon="ONTARIO CURRICULUM")
    run(build, b, inside=[3, 4, 5, 17, 18, 19], feature=3, feature_line=("7 countries + a passport", "CANADA • MEXICO • SWEDEN & MORE"),
        key_page=22, preview=[1, 3, 4, 17, 18, 19], listing=LISTING)
