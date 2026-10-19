"""Winter Reading (Grades 4-6, Ontario Language 2023): five original nonfiction passages, questions, Venn organizer, keys.
Celebrations are described factually and respectfully; many families celebrate in different ways or not at all."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
from kit import Book, run, style, W, H, M, INK, GREY, KEYRED
from kit.winter import snowflake, winter_scene, NAVY
from reportlab.lib.colors import white
from remembrance_day import mc_block

ONT = ("Ontario Language Curriculum (2023), Grades 4-6: <b>Strand C Comprehension</b> (C1 knowledge about informational "
       "texts and text features; C2 comprehension strategies: main idea, details, vocabulary in context; C3 critical "
       "thinking) and <b>Strand A Literacy Connections and Applications</b> (A2 transferable skills; A3 exploring diverse "
       "cultures, perspectives and identities, including First Nations, Métis and Inuit). Connects to Grade 6 Science "
       "(Earth and Space Systems).")

P = [
 dict(t="The Winter Solstice", tag="Science", paras=[
  "In the Northern Hemisphere, the <b>winter solstice</b> happens on December 21 or 22. It is the day with the fewest "
  "hours of daylight in the whole year, and it marks the official start of winter.",
  "Why are winter days so short? Earth is tilted on its axis by about 23.5 degrees. In December, the northern half of "
  "Earth is tilted away from the Sun. Sunlight reaches us at a low angle, so the days are shorter and the light is weaker.",
  "How short? On the solstice, Ottawa gets fewer than nine hours of daylight. In Iqaluit, Nunavut, the Sun is up for only "
  "about four hours. Even farther north, in places such as Alert, Nunavut, the Sun does not rise at all for weeks. This "
  "is called <b>polar night</b>.",
  "The good news is that the solstice is a turning point. After it, each day gets a little longer, until the summer "
  "solstice in June.",
  "People have marked the winter solstice for thousands of years. At Newgrange, an ancient stone monument in Ireland, "
  "sunlight shines down a long passage into the inner chamber only around the winter solstice sunrise."],
  mc=[("When is the winter solstice in the Northern Hemisphere?", ["June 21 or 22", "December 21 or 22", "January 1", "March 20"], 1),
      ("What causes short winter days?", ["Earth moving farther from the Sun", "The northern half of Earth tilting away from the Sun", "Clouds blocking the Sun", "The Moon"], 1),
      ("In paragraph 3, <i>polar night</i> means...", ["a very cold night", "a time when the Sun does not rise for weeks", "a night with northern lights", "the longest night of summer"], 1)],
  sa=[("Why does the author call the solstice \"a turning point\"? Use the text.", "After the solstice, each day gets a little longer until June (paragraph 4)."),
      ("Compare the daylight in Ottawa and Iqaluit on the solstice. Why is it different?", "Ottawa has fewer than 9 hours and Iqaluit about 4 hours. Iqaluit is farther north, so it is tilted farther from the Sun's light.")]),
 dict(t="How a Snowflake Forms", tag="Science", paras=[
  "Every snowflake begins high in a cloud. When the air is below freezing, a tiny droplet of water freezes onto a speck "
  "of dust or pollen. This tiny piece of ice is the start of a snow crystal.",
  "As the crystal falls through the cloud, water vapour from the air freezes onto it, and it grows. Snow crystals almost "
  "always have <b>six sides or six arms</b>. That is because of the way water molecules fit together when they freeze.",
  "The shape of a snowflake depends on the temperature and the amount of moisture in the air. Some crystals grow into "
  "flat plates, some into long needles or columns, and some into lacy stars with branching arms.",
  "Wilson Bentley, a farmer in Vermont, was the first person to photograph a single snowflake, in 1885. Over his life he "
  "photographed more than 5,000 of them.",
  "Are two snowflakes ever exactly alike? Each complex snowflake takes its own path through the cloud, meeting slightly "
  "different temperatures and moisture along the way. Scientists say it is extremely unlikely that two complex snowflakes "
  "would ever be exactly the same."],
  mc=[("What does a snowflake form around?", ["A raindrop", "A speck of dust or pollen", "A hailstone", "A feather"], 1),
      ("Why do snow crystals have six sides or arms?", ["Because of the wind", "Because of how water molecules fit together when they freeze", "Because clouds have six layers", "Because of the Sun"], 1),
      ("How is this passage mainly organized?", ["Compare and contrast", "Sequence: the steps of how a snowflake forms and grows", "Problem and solution", "A story with characters"], 1)],
  sa=[("What two conditions decide a snowflake's shape?", "The temperature and the amount of moisture in the air (paragraph 3)."),
      ("Explain why no two complex snowflakes are likely to be the same.", "Each one takes its own path through the cloud and meets slightly different temperatures and moisture, so it grows differently (paragraph 5).")]),
 dict(t="Festivals of Light", tag="Culture", paras=[
  "During the darkest time of year, many people celebrate festivals of light. Two of them are Hanukkah and Kwanzaa. "
  "Families celebrate in their own ways, and not every family celebrates these holidays.",
  "<b>Hanukkah</b> is a Jewish festival that lasts eight nights. Its dates change each year because they follow the Hebrew "
  "calendar, but it usually falls in December. Hanukkah remembers the rededication of the Temple in Jerusalem more than "
  "2,000 years ago, and the story of a small amount of oil that burned for eight days.",
  "Each night of Hanukkah, families light candles on a <b>menorah</b> (also called a hanukkiah), which has nine branches. "
  "One candle, the <i>shamash</i> or helper, is used to light the others. People often eat foods fried in oil, such as "
  "potato latkes, and play a spinning-top game with a <b>dreidel</b>.",
  "<b>Kwanzaa</b> takes place from December 26 to January 1. It was created in 1966 by Dr. Maulana Karenga to celebrate "
  "African heritage and culture, and it is celebrated by families in the United States, Canada and other countries.",
  "Kwanzaa is built around seven principles, such as <i>Umoja</i> (unity) and <i>Kuumba</i> (creativity). Each day, families "
  "light one candle on a <b>kinara</b>, which holds seven candles: three red, three green and one black."],
  mc=[("How many nights does Hanukkah last?", ["Seven", "Eight", "Nine", "Twelve"], 1),
      ("What is the shamash used for?", ["To light the other candles", "To spin like a top", "To cook latkes", "To count the days"], 0),
      ("When is Kwanzaa celebrated?", ["December 21 to 25", "December 26 to January 1", "In October", "In late January"], 1)],
  sa=[("How are Hanukkah and Kwanzaa similar? Give two details.", "Both are winter festivals that light candles over several days/nights (Hanukkah: menorah with 9 branches; Kwanzaa: kinara with 7 candles)."),
      ("Why do Hanukkah's dates change each year?", "Because they follow the Hebrew calendar (paragraph 2).")]),
 dict(t="Winter Celebrations Across Canada", tag="Culture", paras=[
  "Canada is home to people from many cultures, so winter is full of different celebrations. Here are three of them. "
  "Families celebrate in their own ways, and some do not celebrate these days at all.",
  "<b>Christmas</b>, on December 25, is a Christian holiday that celebrates the birth of Jesus. Many families, Christian or "
  "not, also enjoy traditions such as decorating a tree and sharing a big meal. In Newfoundland and Labrador, some "
  "communities keep the tradition of <b>mummering</b>: people dress in disguises and visit their neighbours' homes, and the "
  "hosts try to guess who they are.",
  "<b>Lunar New Year</b> falls in late January or February, at the start of the lunar calendar. It is celebrated by Chinese, "
  "Vietnamese (Tết) and Korean (Seollal) communities across Canada. Families gather for a reunion meal, children may "
  "receive red envelopes for good luck, and some cities hold parades with lion dances.",
  "In the far North, the return of the Sun is a reason to celebrate. In Igloolik, Nunavut, the community holds a festival "
  "in January when the Sun rises again after weeks of darkness. Traditionally, the <b>qulliq</b>, a stone oil lamp, is lit "
  "as part of the celebration.",
  "Learning about each other's traditions helps us understand our classmates and neighbours, and see how much we share."],
  mc=[("What happens during mummering?", ["People skate on a frozen lake.", "People in disguise visit homes and the hosts guess who they are.", "People light seven candles.", "People watch the solstice sunrise."], 1),
      ("Which communities celebrate Lunar New Year, according to the text?", ["Only Chinese communities", "Chinese, Vietnamese and Korean communities", "Inuit communities", "Newfoundland communities"], 1),
      ("Why does Igloolik celebrate in January?", ["It is the start of the school year.", "The Sun rises again after weeks of darkness.", "It is the longest day of the year.", "It is Canada's birthday."], 1)],
  sa=[("What is the author's main message in the last paragraph? Do you agree? Explain.", "Learning about others' traditions helps us understand each other and see what we share. Opinions vary; look for a reason."),
      ("Choose one celebration. Describe two of its traditions using details from the text.", "Example: Lunar New Year: a family reunion meal and red envelopes for good luck (paragraph 3). Accept any two text-based traditions.")]),
 dict(t="Surviving a Canadian Winter", tag="Science", paras=[
  "Canadian winters can be harsh, with freezing temperatures, deep snow and little food. Animals that stay for the winter "
  "have amazing ways to survive.",
  "The <b>black-capped chickadee</b> weighs about as much as two loonies, yet it stays all winter. It fluffs up its feathers "
  "to trap warm air and shivers to make heat. In the fall it hides seeds in hundreds of places, and it remembers where "
  "many of them are.",
  "The <b>wood frog</b> has an even stranger trick: it freezes! In winter, up to about two-thirds of the water in its body "
  "can turn to ice, and its heart stops beating. Sugar in its cells works like antifreeze to protect them. In spring, the "
  "frog thaws and hops away.",
  "<b>Beavers</b> prepare all fall. They push branches into the mud at the bottom of their pond, near their lodge. In winter, "
  "when the pond is covered with ice, they swim out under the ice to eat their stored food. Inside the thick lodge, it "
  "stays well above the freezing temperature outside.",
  "The <b>snowshoe hare</b> changes from brown to white so it can hide in the snow, and its big, furry feet work like "
  "snowshoes. Each of these animals shows a different <b>adaptation</b>: a feature or behaviour that helps it survive."],
  mc=[("How does the chickadee stay warm?", ["It hibernates.", "It fluffs its feathers and shivers.", "It migrates south.", "It freezes."], 1),
      ("What protects the wood frog's cells when it freezes?", ["Fur", "Sugar that works like antifreeze", "Mud", "Its lodge"], 1),
      ("In paragraph 5, an <i>adaptation</i> is...", ["a kind of food", "a feature or behaviour that helps an animal survive", "a type of snowshoe", "a winter storm"], 1)],
  sa=[("How do beavers get food when the pond is frozen?", "They stored branches in the mud near their lodge in the fall and swim under the ice to eat them (paragraph 4)."),
      ("Which animal's adaptation do you think is most surprising? Explain using the text.", "Answers vary; look for a text-based reason (e.g., the wood frog can freeze and thaw in spring).")]),
]


def passage_page(b, p):
    y = b.header(p["t"], f"Read  •  {p['tag']}")
    for i, para in enumerate(p["paras"], 1):
        b.badge(M + 9, y - 9, i, r=9, fill=b.t.primary)
        y = b.para(para, M + 26, y, W - 2 * M - 26, style(12.6, 19)) - 11
    assert y > 60, p["t"]
    if y > 160:
        snowflake(b.c, W - M - 50, 90, 34, b.t.light, 3)


def q_page(b, p, key):
    y = b.header(f"{p['t']}: Questions", "Show what you know")
    if key: b.key_stamp()
    for i, (q, o, a) in enumerate(p["mc"], 1):
        y = mc_block(b, i, q, o, y, a if key else None)
    for j, (q, a) in enumerate(p["sa"], 4):
        y = b.question(j, q, y, 3, answer=a if key else None)


def venn(b):
    y = b.header("Compare Two Celebrations", "Venn diagram")
    c = b.c
    c.setFont("Body", 12); c.setFillColor(INK)
    c.drawString(M, y, "Celebration 1: ____________________"); c.drawRightString(W - M, y, "Celebration 2: ____________________")
    cy = y - 250; r = 175
    c.setStrokeColor(b.t.primary); c.setLineWidth(2.5)
    c.circle(W / 2 - 95, cy, r); c.circle(W / 2 + 95, cy, r)
    c.setFillColor(b.t.primary); c.setFont("BodyB", 12); c.drawCentredString(W / 2, cy + r - 30, "Both")
    y = cy - r - 30
    b.question(1, "Write two sentences that compare the celebrations. Use <i>both</i>, <i>but</i> or <i>while</i>.", y, 3)


def build(b):
    b.cover(["5 passages", "questions", "Venn diagram", "Ontario aligned"])
    b.guide("Five original nonfiction passages for winter, mixing science and culture: the winter solstice, how snowflakes "
            "form, festivals of light (Hanukkah and Kwanzaa), winter celebrations across Canada (including mummering, Lunar "
            "New Year and Igloolik's return-of-the-sun festival), and how Canadian animals survive winter. Each passage has "
            "numbered paragraphs and a question page.",
            [(None, "Passage 1: The Winter Solstice + questions"), (None, "Passage 2: How a Snowflake Forms + questions"),
             (None, "Passage 3: Festivals of Light + questions"), (None, "Passage 4: Winter Celebrations Across Canada + questions"),
             (None, "Passage 5: Surviving a Canadian Winter + questions"), ("venn", "Compare Two Celebrations Venn diagram"),
             ("keys", "Answer keys"), ("terms", "Terms of use")],
            [("Inclusive approach", "Celebrations are described factually and respectfully, with a reminder that families "
              "celebrate in different ways, or not at all. The science passages work for every classroom."),
             ("Facts", "Facts were checked against reference sources; daylight times are approximate.")], ONT)
    for p in P:
        b.page("p"); passage_page(b, p)
        b.page("q"); q_page(b, p, False)
    b.page("venn"); venn(b)
    for p in P:
        b.page("keys"); q_page(b, p, True)
    b.terms()


LISTING = dict(
    tpt_title="Winter Reading Comprehension Passages | Solstice, Snowflakes, Celebrations in Canada | Grades 4-6 | Ontario",
    price="$4.50. Range $4 to $5.", grades="4th, 5th, 6th", subjects="Reading, Informational Text, Winter", type="Reading Passages, Worksheets",
    description="Five original nonfiction winter passages for Grades 4-6, each with numbered paragraphs and a question page "
                "(multiple choice and text-evidence questions).\n\nPassages: The Winter Solstice; How a Snowflake Forms; "
                "Festivals of Light (Hanukkah and Kwanzaa); Winter Celebrations Across Canada (Christmas mummering in "
                "Newfoundland and Labrador, Lunar New Year, and Igloolik's return-of-the-sun festival); and Surviving a "
                "Canadian Winter (chickadees, wood frogs, beavers, snowshoe hares).\n\nAlso included: a Compare Two "
                "Celebrations Venn diagram, answer keys, and a teacher guide.\n\nOntario Language (2023) Strands A and C. "
                "Canadian content and spelling; celebrations presented respectfully and inclusively.",
    keywords=["winter reading", "reading comprehension", "winter solstice", "holidays around the world", "Hanukkah", "Kwanzaa",
              "Lunar New Year", "Ontario", "grade 5 reading", "Canadian"])

if __name__ == "__main__":
    b = Book("Winter-Reading-Comprehension-Grades-4-6-Ontario", "Winter Reading", "Nonfiction Passages: Science & Celebrations",
             "Grades 4-6", "evergreen", winter_scene, ribbon="ONTARIO CURRICULUM")
    run(build, b, inside=[3, 5, 7, 9, 11, 13], feature=7, feature_line=("5 original passages", "SCIENCE • CULTURE • CANADA"),
        key_page=15, preview=[1, 2, 3, 4, 9], listing=LISTING)
