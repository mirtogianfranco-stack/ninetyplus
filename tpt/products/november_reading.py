"""November Reading Comprehension Passages (Grades 3-5). Six original nonfiction passages, each with a question page
(4 multiple choice + 2 text-evidence short answers), a reusable graphic organizer and answer keys."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from kit import Book, run, style, W, H, M, INK, GREY, KEYRED
from reportlab.lib.colors import white, HexColor

P = [
 dict(slug="leaves", title="Why Leaves Change Color", tag="Science", paras=[
  "Every fall, many trees trade their green leaves for bright shades of yellow, orange and red. It looks like magic, but "
  "the real reason is science.",
  "All spring and summer, leaves are busy making food for the tree. They use sunlight, water and air to make sugar. To do "
  "this, leaves need a green substance called <b>chlorophyll</b>. There is so much chlorophyll in a leaf that its green "
  "color covers up every other color.",
  "As fall arrives, the days get shorter and the nights get cooler. With less sunlight, many trees slow down and stop "
  "making food. The chlorophyll begins to break down, and the green color fades away.",
  "Now the hidden colors can finally be seen. Yellow and orange were inside the leaf all along. They were just covered by "
  "the green. Red and purple are different. In some trees, such as many maples, the leaves make new red coloring in the "
  "fall when sugar gets trapped inside them.",
  "Weather affects how bright the colors become. Sunny days and cool (but not freezing) nights usually create the most "
  "brilliant reds. Soon, the tree seals off each leaf where it attaches to the branch, and the leaves drop. The tree rests "
  "through winter and grows new green leaves in spring."],
  mc=[("What is the main idea of this passage?", ["Maple trees are the most colorful trees.", "Leaves change color because of changes inside the leaf in fall.", "Trees need water to grow.", "Fall is the best season of the year."], 1),
      ("What does chlorophyll help leaves do?", ["Drop off the tree", "Turn red", "Make food from sunlight", "Stay warm in winter"], 2),
      ("In paragraph 4, the word <i>hidden</i> means:", ["very bright", "not able to be seen", "brand new", "broken"], 1),
      ("Which weather usually makes the brightest red leaves?", ["Rainy days and warm nights", "Cloudy days and freezing nights", "Sunny days and cool nights", "Snowy days and windy nights"], 2)],
  sa=[("Explain why yellow and orange appear in fall even though the leaf does not make them new. Use evidence from the text.",
       "Yellow and orange were in the leaf all along but were covered by green chlorophyll. When the chlorophyll breaks down in fall, these colors can be seen (paragraphs 2-4)."),
      ("How is the way red appears different from the way yellow appears?",
       "Yellow is already in the leaf and is uncovered. Red is newly made in the fall in some trees, such as maples, when sugar is trapped in the leaf (paragraph 4).")]),
 dict(slug="cranberry", title="The Cranberry Harvest", tag="Agriculture", paras=[
  "Cranberries are one of only a few fruits that are native to North America. They grow on low, trailing vines in sandy "
  "fields called <b>bogs</b>. Long ago, Native American people used cranberries for food, medicine and dye.",
  "Cranberry vines can live and produce fruit for many years. The berries grow during the summer and turn deep red by early "
  "fall. Most cranberries are harvested from September through November.",
  "Many farmers use a method called <b>wet harvesting</b>. First, they flood the bog with water. Then machines called "
  "beaters stir the water and shake the berries loose from the vines. Here is the surprising part: cranberries float! Each "
  "berry has tiny pockets of air inside it.",
  "Soon the whole bog is covered with a floating red carpet of berries. Workers use long floating barriers called booms "
  "to push the berries together. Then the berries are pumped or lifted onto trucks. Most of these cranberries become juice, "
  "sauce and dried fruit.",
  "Some farmers use <b>dry harvesting</b> instead. A machine that looks like a big lawn mower combs the berries off the "
  "vines without any water. Dry-harvested berries are usually sold fresh in stores. Wisconsin grows more cranberries than "
  "any other state, and Massachusetts is close behind."],
  mc=[("Why do cranberries float?", ["They are very small.", "They have pockets of air inside.", "The water is salty.", "Farmers add foam to the bog."], 1),
      ("What is the purpose of the beaters in wet harvesting?", ["To pump the berries onto trucks", "To shake the berries loose from the vines", "To dry the berries", "To plant new vines"], 1),
      ("What is a <i>bog</i>?", ["A machine for picking fruit", "A tall cranberry tree", "A sandy field where cranberries grow", "A type of juice"], 2),
      ("How is the text in paragraphs 3-5 mainly organized?", ["Compare and contrast two harvest methods", "A story told in time order about one farmer", "Problem and solution about pests", "Cause and effect of fall weather"], 0)],
  sa=[("How are wet harvesting and dry harvesting different? Give two differences.",
       "Wet harvesting floods the bog and uses beaters and booms; dry harvesting uses a machine to comb berries off with no water. Wet-harvested berries mostly become juice, sauce and dried fruit, while dry-harvested berries are usually sold fresh."),
      ("Why do you think the author calls the floating berries a \"red carpet\"?",
       "Because the berries cover the whole surface of the water, the way a carpet covers a floor, and they are red (paragraph 4).")]),
 dict(slug="veterans", title="Veterans Day", tag="Social Studies", paras=[
  "Every year on November 11, people across the United States pause to honor <b>veterans</b>. A veteran is someone who has "
  "served in the military, such as the Army, Navy, Air Force, Marine Corps or Coast Guard.",
  "The date has a special history. World War I was a huge war fought by many nations. On November 11, 1918, the fighting "
  "stopped. An agreement to stop fighting, called an <b>armistice</b>, began at the eleventh hour of the eleventh day of the "
  "eleventh month.",
  "The next year, the United States began remembering this day as Armistice Day. At first it honored the people who served "
  "in World War I. Later, many more Americans served in other wars. In 1954, the holiday was renamed Veterans Day so it "
  "would honor veterans from every war and every time of service.",
  "Veterans Day is sometimes confused with Memorial Day, which is in May. Memorial Day honors service members who died while "
  "serving. Veterans Day thanks all veterans, especially the many who are living today.",
  "There are many ways to show respect on Veterans Day. Some towns hold parades. Some schools invite veterans to visit and "
  "share their stories. Many people simply say, \"Thank you for your service.\""],
  mc=[("What is a veteran?", ["A soldier from another country", "Someone who has served in the military", "A person who plans parades", "A type of holiday"], 1),
      ("Why is Veterans Day on November 11?", ["It is the start of winter.", "World War I fighting stopped on that day in 1918.", "It was a president's birthday.", "The military was created that day."], 1),
      ("In paragraph 2, an <i>armistice</i> is:", ["a parade", "a medal", "an agreement to stop fighting", "a type of ship"], 2),
      ("How is Veterans Day different from Memorial Day?", ["Veterans Day is only for the Navy.", "Veterans Day honors all veterans, including living ones.", "Memorial Day is in November.", "They are exactly the same."], 1)],
  sa=[("Why was Armistice Day renamed Veterans Day in 1954? Use evidence from the text.",
       "Many more Americans had served in other wars, so the holiday was renamed to honor veterans from every war and time of service, not only World War I (paragraph 3)."),
      ("Name two ways people can show respect on Veterans Day.",
       "Any two: holding or attending parades, inviting veterans to share stories at school, saying \"Thank you for your service\" (paragraph 5).")]),
 dict(slug="hale", title="The Woman Who Saved Thanksgiving", tag="Biography", paras=[
  "Today, Thanksgiving is a national holiday celebrated on the same day all across the United States. But for a long time, "
  "that was not true. Each state chose its own day, and some states did not celebrate at all. One determined woman helped "
  "change that. Her name was <b>Sarah Josepha Hale</b>.",
  "Hale was a writer and editor in the 1800s. You might already know one of her poems: \"Mary Had a Little Lamb.\" For many "
  "years she was the editor of <i>Godey's Lady's Book</i>, one of the most popular magazines in the country.",
  "Hale believed a shared day of thanks could bring the country together. She wrote articles about it in her magazine. She "
  "also wrote letter after letter to governors and presidents, asking them to make Thanksgiving a national holiday. For "
  "about seventeen years, the answer was no.",
  "Hale did not give up. In 1863, during the Civil War, she wrote to President Abraham Lincoln. That year, Lincoln announced "
  "a national day of Thanksgiving to be held on the last Thursday of November. Presidents continued the tradition after him.",
  "In 1941, Congress made it official: Thanksgiving would be held on the fourth Thursday of November. So when you sit down "
  "to a Thanksgiving meal, you can thank a persistent writer who never stopped asking."],
  mc=[("What was the problem before Thanksgiving became a national holiday?", ["Nobody liked turkey.", "Each state chose its own day, and some did not celebrate.", "It was held in summer.", "Only presidents could celebrate."], 1),
      ("Which word best describes Sarah Josepha Hale?", ["Persistent", "Lazy", "Shy", "Forgetful"], 0),
      ("What happened in 1863?", ["Congress set the fourth Thursday.", "Hale wrote her first poem.", "President Lincoln announced a national day of Thanksgiving.", "The Civil War ended."], 2),
      ("In paragraph 5, <i>persistent</i> means:", ["giving up easily", "continuing even when it is hard", "very famous", "living long ago"], 1)],
  sa=[("How did Sarah Josepha Hale try to make Thanksgiving a national holiday? Give two examples.",
       "She wrote articles about it in her magazine and wrote many letters to governors and presidents, including President Lincoln in 1863 (paragraphs 3-4)."),
      ("Why do you think the author titled this passage \"The Woman Who Saved Thanksgiving\"?",
       "Because Hale's years of effort led to Thanksgiving becoming one shared national holiday; without her it might have stayed different in each state.")]),
 dict(slug="turkeys", title="Wild Turkeys", tag="Animals", paras=[
  "When you picture a turkey, you might imagine a slow bird on a farm. Wild turkeys are very different. They are fast, "
  "alert and full of surprises.",
  "Wild turkeys are native to North America. They live in forests and fields, where they eat seeds, nuts, berries and "
  "insects. A male turkey is called a <b>tom</b> or a gobbler. A female is called a <b>hen</b>, and a baby turkey is called "
  "a <b>poult</b>.",
  "Wild turkeys can run about 25 miles per hour. They can also fly! Farm turkeys are usually too heavy to fly, but wild "
  "turkeys can burst into the air and fly short distances very quickly. At night, they fly up into trees to sleep, where "
  "they are safer from predators such as foxes and coyotes.",
  "Toms are famous for their displays. To impress hens, a tom puffs up his feathers, fans out his tail and gobbles loudly. "
  "The skin on his head and neck can change color from red to white to blue when he is excited.",
  "About one hundred years ago, wild turkeys had almost disappeared from many parts of the country because of hunting and "
  "lost habitat. People worked to protect them and moved turkeys to new areas. Today there are millions of wild turkeys "
  "again, living in every state except Alaska."],
  mc=[("What is a baby turkey called?", ["A tom", "A hen", "A poult", "A gobbler"], 2),
      ("Why do wild turkeys sleep in trees?", ["To find food", "To be safer from predators", "To stay dry", "To watch the sunrise"], 1),
      ("Which detail shows that wild turkeys are fast?", ["They eat seeds and nuts.", "They can run about 25 miles per hour.", "Toms fan out their tails.", "They live in forests."], 1),
      ("What is the main idea of paragraph 5?", ["Turkeys live in Alaska.", "Turkeys almost disappeared but came back with people's help.", "Hunting is not allowed.", "Turkeys moved to new areas on their own."], 1)],
  sa=[("Compare wild turkeys and farm turkeys. Give one way they are different.",
       "Wild turkeys can fly short distances, but farm turkeys are usually too heavy to fly (paragraph 3). Accept: wild turkeys are fast and alert."),
      ("What caused wild turkeys to almost disappear, and what helped them come back?",
       "Hunting and lost habitat caused them to almost disappear. People protected them and moved turkeys to new areas (paragraph 5).")]),
 dict(slug="winter", title="Ready for Winter", tag="Science", paras=[
  "Winter can be a hard time for animals. Food is harder to find, and the weather is cold. Animals have three main ways to "
  "survive: they can <b>migrate</b>, <b>hibernate</b> or <b>adapt</b>.",
  "To migrate means to travel to a new place. Many birds fly south where it is warmer and food is easier to find. Monarch "
  "butterflies migrate too. Millions of monarchs from the eastern United States and Canada fly as far as 3,000 miles to "
  "the mountains of central Mexico, where they spend the winter in huge clusters on the trees.",
  "To hibernate means to go into a deep, long sleep. Groundhogs eat a lot in the fall to build up fat. Then they curl up in "
  "underground burrows. Their body temperature drops, and their heart beats very slowly. This saves energy, so they can "
  "live on their stored fat until spring.",
  "Other animals stay active and adapt to the cold. Squirrels spend the fall gathering nuts and hiding them to eat later. "
  "The snowshoe hare grows a white winter coat that helps it blend in with the snow. Its large furry feet work like "
  "snowshoes, helping it hop across deep snow without sinking.",
  "Whether they travel, sleep or change, animals have amazing ways to make it through the coldest months of the year."],
  mc=[("What does <i>migrate</i> mean?", ["To sleep all winter", "To travel to a new place", "To grow a new coat", "To hide food"], 1),
      ("Why do groundhogs eat a lot in the fall?", ["To build up fat to live on while hibernating", "To grow white fur", "To get ready to migrate", "To feed their young"], 0),
      ("How does a white coat help the snowshoe hare?", ["It keeps the hare cool.", "It helps the hare blend in with the snow.", "It helps the hare fly.", "It makes the hare faster."], 1),
      ("How is this passage mainly organized?", ["Time order", "Problem and solution", "Categories: three ways animals survive winter", "A story with characters"], 2)],
  sa=[("Choose one animal from the passage. Explain how it survives winter, using details from the text.",
       "Example: Groundhogs eat to build fat, then hibernate in burrows; their body temperature drops and heart slows, saving energy (paragraph 3). Accept any animal with text details."),
      ("Why are a snowshoe hare's feet a helpful adaptation?",
       "Its large furry feet work like snowshoes, so it can hop across deep snow without sinking (paragraph 4).")]),
]


def passage_page(b, p):
    y = b.header(p["title"], f"Read the passage  •  {p['tag']}")
    st = style(13.6, 21.5)
    for i, para in enumerate(p["paras"], 1):
        b.badge(M + 9, y - 9, i, r=9, fill=b.t.primary)
        y = b.para(para, M + 26, y, W - 2 * M - 26, st) - 14
    c, t = b.c, b.t
    c.setFillColor(t.light); c.setStrokeColor(t.primary); c.setLineWidth(1.5); c.roundRect(M, 48, W - 2 * M, 96, 12, fill=1)
    c.setFillColor(t.primary); c.setFont("BodyB", 12); c.drawString(M + 14, 124, "STOP AND THINK: What is the most interesting fact you learned? Why?")
    c.setStrokeColor(GREY); c.setLineWidth(0.6); c.line(M + 14, 96, W - M - 14, 96); c.line(M + 14, 70, W - M - 14, 70)
    assert y > 160, p["title"]


def mc(b, n, q, opts, y, ans=None):
    b.badge(M + 10, y - 8, n)
    y = b.para(q, M + 28, y, W - 2 * M - 28, style(11.5, 15)) - 4
    c = b.c
    for i, o in enumerate(opts):
        c.setStrokeColor(INK); c.setLineWidth(1)
        hit = ans is not None and i == ans
        c.setFillColor(KEYRED if hit else white); c.circle(M + 40, y - 9, 6.5, fill=1)
        c.setFillColor(white if hit else INK); c.setFont("BodyB", 8); c.drawCentredString(M + 40, y - 12, "ABCD"[i])
        y = b.para(o, M + 54, y, W - 2 * M - 60, style(11, 14.5, KEYRED if hit else INK)) - 3
    return y - 10


def questions_page(b, p, key=False):
    y = b.header(f"{p['title']}: Questions", "Show what you know")
    if key: b.key_stamp()
    for i, (q, opts, a) in enumerate(p["mc"], 1):
        y = mc(b, i, q, opts, y, a if key else None)
    for j, (q, a) in enumerate(p["sa"], 5):
        y = b.question(j, q, y, 4, answer=a if key else None)


def organizer(b):
    y = b.header("Main Idea & Details", "Use with any passage")
    c, t = b.c, b.t
    c.setFont("Body", 11); c.setFillColor(INK); c.drawString(M, y, "Passage title: _____________________________________________"); y -= 24
    c.setFillColor(t.light); c.setStrokeColor(t.primary); c.setLineWidth(2); c.roundRect(M, y - 120, W - 2 * M, 120, 14, fill=1)
    c.setFillColor(t.primary); c.setFont("BodyB", 13); c.drawString(M + 14, y - 22, "MAIN IDEA")
    y -= 150; bw = (W - 2 * M - 24) / 3
    for i in range(3):
        x = M + i * (bw + 12)
        c.setFillColor(white); c.roundRect(x, y - 240, bw, 240, 14, fill=1)
        c.setFillColor(t.primary); c.setFont("BodyB", 12); c.drawString(x + 12, y - 22, f"DETAIL {i + 1}")
        c.setFont("Body", 9); c.setFillColor(GREY); c.drawString(x + 12, y - 228, "Paragraph #: _____")
    y -= 270
    c.setFillColor(white); c.roundRect(M, y - 110, W - 2 * M, 110, 14, fill=1)
    c.setFillColor(t.primary); c.setFont("BodyB", 13); c.drawString(M + 14, y - 22, "SUMMARY (in 2 sentences)")


def art(b, x, y, w, h):
    c, t = b.c, b.t
    # open book
    cx, cy = x + 150, y + 40
    c.setFillColor(t.light); c.setStrokeColor(t.dark); c.setLineWidth(3)
    p = c.beginPath(); p.moveTo(cx, cy); p.curveTo(cx - 60, cy + 20, cx - 110, cy + 20, cx - 130, cy + 10); p.lineTo(cx - 130, cy + 160)
    p.curveTo(cx - 110, cy + 170, cx - 60, cy + 170, cx, cy + 150); p.close(); c.drawPath(p, fill=1)
    p = c.beginPath(); p.moveTo(cx, cy); p.curveTo(cx + 60, cy + 20, cx + 110, cy + 20, cx + 130, cy + 10); p.lineTo(cx + 130, cy + 160)
    p.curveTo(cx + 110, cy + 170, cx + 60, cy + 170, cx, cy + 150); p.close(); c.drawPath(p, fill=1)
    c.setLineWidth(1.5); c.setStrokeColor(GREY)
    for i in range(5):
        c.line(cx - 110, cy + 125 - i * 20, cx - 20, cy + 128 - i * 20); c.line(cx + 20, cy + 128 - i * 20, cx + 110, cy + 125 - i * 20)
    # leaves
    for i, (lx, ly, col) in enumerate([(x + w - 160, y + 150, "#C2410C"), (x + w - 90, y + 110, "#FACC15"), (x + w - 150, y + 60, "#B91C1C"), (x + w - 70, y + 190, "#EA580C")]):
        c.saveState(); c.translate(lx, ly); c.rotate(25 * i - 30); c.setFillColor(HexColor(col))
        q = c.beginPath(); q.moveTo(0, -38); q.curveTo(32, -18, 32, 18, 0, 38); q.curveTo(-32, 18, -32, -18, 0, -38); q.close(); c.drawPath(q, stroke=0, fill=1)
        c.setStrokeColor(HexColor("#431407")); c.setLineWidth(2); c.line(0, -46, 0, 34); c.restoreState()


def build(b):
    b.cover(["6 nonfiction passages", "text evidence", "organizer"])
    b.guide("Six original, high-interest nonfiction passages for November: science, history, biography and animals. "
            "Each passage has numbered paragraphs for easy citing, followed by four multiple-choice questions and two "
            "short-answer questions that require text evidence.",
            [("p_" + p["slug"], f"{p['title']} ({p['tag']})") for p in P] + [("org", "Main Idea & Details graphic organizer"), ("keys", "Answer keys"), ("terms", "Terms of use")],
            [("Skills covered", "Main idea, key details, vocabulary in context, text structure, compare and contrast, cause "
              "and effect, author's purpose and citing text evidence."),
             ("Ideas", "Small groups, literacy centers, homework, sub plans, test prep. Pair two passages (for example, "
              "Wild Turkeys and Ready for Winter) for a compare-and-contrast discussion.")],
            "CCSS RI.3.1, RI.3.2, RI.3.4, RI.3.8, RI.4.1, RI.4.2, RI.4.4, RI.4.5, RI.5.1, RI.5.2, RI.5.4, RI.5.5.")
    for p in P:
        b.page("p_" + p["slug"]); passage_page(b, p)
        b.page("p_" + p["slug"]); questions_page(b, p)
    b.page("org"); organizer(b)
    for p in P:
        b.page("keys"); questions_page(b, p, key=True)
    b.terms()


LISTING = dict(
    tpt_title="November Reading Comprehension Passages | Nonfiction | 3rd 4th 5th Grade",
    price="$4.50. Range $4 to $6. Sells best mid-October through November; refresh the cover and relist each fall.",
    grades="3rd, 4th, 5th", subjects="Reading, Informational Text, Thanksgiving, Autumn", type="Reading Passages, Worksheets",
    description="""
Engage your readers this fall with **six original nonfiction passages** perfect for November! Each passage has numbered
paragraphs for easy citing, followed by a question page with multiple-choice and text-evidence questions.

**Passages:**
- Why Leaves Change Color (science)
- The Cranberry Harvest (agriculture)
- Veterans Day (social studies)
- The Woman Who Saved Thanksgiving: Sarah Josepha Hale (biography)
- Wild Turkeys (animals)
- Ready for Winter: migrate, hibernate, adapt (science)

**Each passage includes:** 4 multiple-choice questions (main idea, details, vocabulary, text structure) and 2
short-answer questions with text evidence.

**Also included:** a reusable Main Idea and Details graphic organizer and full answer keys.

**Standards:** RI.3.1-RI.5.5 (key ideas, vocabulary, text structure)
""",
    keywords=["reading comprehension", "November reading", "Thanksgiving reading", "nonfiction passages", "Veterans Day",
              "fall reading passages", "text evidence", "3rd grade reading", "4th grade reading", "5th grade reading"])

if __name__ == "__main__":
    b = Book("November-Reading-Comprehension-3-5", "November Reading", "Nonfiction Comprehension Passages", "Grades 3-5", "autumn", art)
    run(build, b, inside=[3, 4, 7, 9, 13, 15], feature=3, feature_line=("6 original passages", "NUMBERED PARAGRAPHS • TEXT EVIDENCE"),
        key_page=16, preview=[1, 2, 3, 4, 15], listing=LISTING)
