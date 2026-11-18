"""Grade 8 History (Ontario 2026): Black History in Canada, 1850-1914. Companion to the Grade 7 unit; reuses its page
layouts (lessons, vocabulary, timeline, source organizer, rubric, keys) with Grade 8 content. Codes and wording from the
Ministry's Curriculum and Resources site (History, Grade 8, effective 2026-27)."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
from kit import Book, run, style, W, H, M, INK, GREY, KEYRED
from reportlab.lib.colors import white
import g7_black_history as G

ONT = ("The Ontario Curriculum, Social Studies Grades 1 to 6; History and Geography, Grades 7 and 8 (2026), <b>Grade 8 History</b>, "
       "effective 2026-27: <b>A3.2</b> (key events, 1850-1890, that shaped the experiences of Black people in Canada) and "
       "<b>B3.2</b> (issues and events affecting Black communities, 1890-1914), plus A1.3, A3.8, B1.3, B3.7 and the inquiry "
       "expectations A2 and B2. Full wording is on the Curriculum Connections page.")

G.CODES = [("A3.2", "Key events, 1850-1890, that shaped the experiences of Black people in Canada, and their impact"),
           ("B3.2", "Factors behind key issues and events affecting Black communities, 1890-1914, and their significance"),
           ("A1.3", "Impact of differences in legal status, rights and privileges (segregated schools)"),
           ("A3.8 / B3.7", "Significant individuals and their contributions (Shadd, Hall, Abbott, Ware and others)"),
           ("B1.3", "Challenges then compared with challenges facing Canadians today"),
           ("A2 / B2", "Historical inquiry: questions, sources, credibility, evidence, conclusions, communication")]

G.VOCAB = [("abolitionist", "A person who worked to end slavery."),
           ("segregation", "Separating people by race, for example in schools, churches or public places."),
           ("discrimination", "Treating people unfairly because of who they are, such as their race."),
           ("Fugitive Slave Act", "An 1850 U.S. law that let people who escaped slavery be captured in free states and returned."),
           ("homestead", "Land the government granted to settlers who farmed it and built on it."),
           ("Order-in-Council", "A decision made by the federal Cabinet that has the force of law."),
           ("militia", "A group of volunteer citizen soldiers."),
           ("integration", "Bringing people of different backgrounds together in the same schools and communities."),
           ("historical significance", "How important a person or event was: how many people it affected, how deeply and for how long."),
           ("perspective", "A point of view shaped by a person's experiences, identity and situation.")]

G.L = [
 dict(t="Freedom Seekers and a Free Press", code="A3.2", paras=[
  "In 1850, the United States passed the <b>Fugitive Slave Act</b>. It allowed people who had escaped slavery to be captured "
  "even in free northern states and returned to enslavement. Free Black Americans were also at risk of being kidnapped. "
  "Between 1850 and 1860, historians estimate that 15,000 to 20,000 Black people came to the Province of Canada.",
  "Black communities in Canada West (Ontario) used newspapers to share news, fight slavery and welcome newcomers. In 1851, "
  "Henry and Mary Bibb began the <b>Voice of the Fugitive</b> in Sandwich, near Windsor.",
  "In 1853, <b>Mary Ann Shadd</b> launched the <b>Provincial Freeman</b>. She was the first Black woman in North America to "
  "publish and edit a newspaper. Shadd argued that Black and white children should attend school together and that Black "
  "settlers should become full members of Canadian society. The Bibbs supported separate Black communities and schools, "
  "so the two newspapers often disagreed.",
  "In 1858, the American abolitionist John Brown held a convention in Chatham, Canada West, to plan an armed raid against "
  "slavery. Members of Chatham's Black community attended.",
  "After the U.S. Civil War (1861-1865) ended slavery in the United States, many Black families returned south to reunite "
  "with relatives. Others stayed and continued to build communities in Canada."],
  mc=[("What did the Fugitive Slave Act of 1850 allow?", ["Freedom for all enslaved people", "Capturing freedom seekers in free states and returning them to slavery", "Black Americans to vote", "Canada to end slavery"], 1),
      ("What was special about Mary Ann Shadd?", ["She was Canada's first prime minister", "She was the first Black woman in North America to publish and edit a newspaper", "She founded Amber Valley", "She won the Victoria Cross"], 1),
      ("What did Shadd and the Bibbs disagree about?", ["Whether slavery was wrong", "Whether Black and white children should go to school together", "Which city to live in", "The price of newspapers"], 1)],
  sa=[("Explain how the Fugitive Slave Act affected Black communities in Canada.", "It made the U.S. North unsafe, so 15,000-20,000 Black people came to the Province of Canada in the 1850s, growing communities and newspapers (paragraph 1)."),
      ("Why were Black newspapers like the Provincial Freeman historically significant?", "They gave Black people a public voice, spread news and anti-slavery arguments, helped newcomers, and showed debates within the community (paragraphs 2-3).")]),
 dict(t="Separate and Unequal: Segregated Schools", code="A3.2 / A1.3", paras=[
  "The <b>Common Schools Act of 1850</b> gave local school boards in Canada West the power to create separate schools for "
  "Black children. White parents in some communities, especially in southwestern Ontario, pushed Black children out of "
  "the common (public) schools.",
  "Separate schools for Black children often had less money, fewer supplies and fewer teachers. Some communities had no "
  "school for Black children at all.",
  "Black parents fought back. Some went to court to get their children into the common schools, but the courts usually "
  "upheld segregation. Mary Ann Shadd opened a school in Windsor that welcomed both Black and white students.",
  "Segregation in Ontario schools lasted a very long time. Ontario removed the last references to segregated schools from "
  "its laws in 1964, and the last segregated school in Ontario closed in <b>1965</b>. In Nova Scotia, the last segregated "
  "school closed in <b>1983</b>.",
  "Today, Ontario's human rights laws protect students from discrimination. Many educators work to make sure every student "
  "sees themselves in what they learn."],
  mc=[("What did the Common Schools Act of 1850 allow?", ["Free university", "Local boards to create separate schools for Black children", "Schools to close in winter", "French-language schools"], 1),
      ("When did the last segregated school in Ontario close?", ["1850", "1914", "1965", "2000"], 2),
      ("How did many Black parents respond to segregation?", ["They did nothing", "They went to court and opened integrated schools", "They moved to Europe", "They supported it"], 1)],
  sa=[("How did unequal rights and privileges (A1.3) affect Black students in this period? Use two details.",
       "They could be forced into separate schools with less money, fewer supplies and teachers, or have no school; the courts usually upheld it (paragraphs 1-3)."),
      ("Segregated schools lasted until 1965 in Ontario and 1983 in Nova Scotia. What does this tell us about continuity and change?",
       "Change was slow: an 1850 law shaped schooling for over a century; laws changed before practice did; it shows why equity work in schools still matters today.")]),
 dict(t="Black Pioneers in British Columbia", code="A3.2", paras=[
  "In the 1850s, Black residents of San Francisco faced harsh, unfair laws in California. In <b>April 1858</b>, a group of "
  "about 35 Black Californians sailed to Victoria on Vancouver Island to see whether it could become a new home. Hundreds "
  "more followed.",
  "The newcomers became merchants, farmers, barbers and builders. <b>Mifflin Gibbs</b>, a merchant from Philadelphia, "
  "built a successful general store that supplied gold miners. Some families farmed on Salt Spring Island.",
  "Around 1860-1861, Black men in Victoria formed the <b>Victoria Pioneer Rifle Corps</b>, an all-Black volunteer militia "
  "of about 40 to 50 members, to help defend the colony. They had been refused entry to the town's volunteer fire "
  "department. It was the first volunteer military unit on Vancouver Island.",
  "Despite their contributions, Black pioneers faced discrimination, including being refused service and segregated "
  "seating. Over time, many returned to the United States after the Civil War.",
  "In 1997, the Government of Canada recognized the arrival of these Black pioneers in 1858 as a National Historic Event."],
  mc=[("Why did Black Californians move to Victoria in 1858?", ["To find gold only", "To escape harsh, unfair laws in California", "They were sent by Britain", "To join the navy"], 1),
      ("What was the Victoria Pioneer Rifle Corps?", ["A sports team", "An all-Black volunteer militia", "A newspaper", "A school"], 1),
      ("Why is the 1858 arrival nationally significant today?", ["It was the first ship to Victoria", "Canada recognized it as a National Historic Event in 1997", "It started the Gold Rush", "It created British Columbia"], 1)],
  sa=[("Describe one contribution and one challenge of Black pioneers in Victoria.", "Contribution: businesses (Gibbs's store), farming, the Pioneer Rifle Corps. Challenge: discrimination, refused entry to the fire department, refused service, segregated seating."),
      ("Why do you think the Pioneer Rifle Corps volunteered to defend a colony that discriminated against them?", "Answers vary: to show loyalty and belonging, to protect their own homes and freedom, to earn respect and rights.")]),
 dict(t="Courage and Achievement, 1850-1890", code="A3.8", paras=[
  "<b>William Hall</b> was born in 1827 at Horton's Bluff, Nova Scotia, to parents who had escaped slavery. He served in "
  "Britain's Royal Navy. On November 16, 1857, during the siege of Lucknow in India, Hall kept firing his ship's gun after "
  "most of his crew were killed or wounded. He was awarded the <b>Victoria Cross</b>, the highest award for bravery, "
  "becoming the first Black person and the first Nova Scotian to receive it.",
  "<b>Anderson Ruffin Abbott</b> was born in Toronto in 1837. In 1861 he was licensed to practise medicine, becoming the "
  "<b>first Canadian-born Black doctor</b>. During the U.S. Civil War he served as a surgeon for the Union army. Later he "
  "returned to Ontario, where he practised medicine and wrote about Black history.",
  "<b>John Ware</b> was born into slavery in the United States. After he was freed, he became a skilled cowboy. In 1882 he "
  "helped drive a large herd of cattle into what is now southern Alberta. He became a successful rancher near Calgary and "
  "was known for his strength and his skill with horses.",
  "Each of these people faced racism, yet they made important contributions to Canada's heritage in the military, medicine "
  "and ranching."],
  mc=[("Why did William Hall receive the Victoria Cross?", ["For winning a race", "For bravery firing his ship's gun during the siege of Lucknow in 1857", "For building a school", "For writing a newspaper"], 1),
      ("Who was the first Canadian-born Black doctor?", ["John Ware", "Anderson Ruffin Abbott", "Mifflin Gibbs", "Henry Bibb"], 1),
      ("What was John Ware known for?", ["Medicine", "Ranching, strength and skill with horses", "The navy", "Newspapers"], 1)],
  sa=[("Choose one person. Explain their contribution to heritage and identities in Canada (A3.8).", "Answers vary: Hall (first Black VC recipient; Nova Scotia's Black military heritage); Abbott (medicine, Black history writing); Ware (Alberta ranching heritage)."),
      ("What do these three stories have in common?", "Each person faced racism but achieved something important in a different field (military, medicine, ranching) (paragraph 4).")]),
 dict(t="Prairie Pioneers and a Closed Door", code="B3.2", paras=[
  "In the early 1900s, Canada advertised free homestead land on the Prairies to attract farmers. At the same time, Black "
  "families in Oklahoma and nearby states faced new segregation laws and violence.",
  "Between about 1905 and 1912, roughly 1,000 to 1,500 Black Americans moved to Alberta and Saskatchewan. They founded "
  "farming communities such as <b>Amber Valley</b>, Alberta (settled around 1910), and settled near <b>Maidstone</b>, "
  "Saskatchewan. They cleared land, built homes, churches and schools, and supported each other through hard winters.",
  "Many white Canadians did not welcome them. Boards of trade and newspapers in places such as Edmonton called on the "
  "government to stop Black immigration.",
  "On August 12, 1911, Prime Minister Wilfrid Laurier's Cabinet approved <b>Order-in-Council P.C. 1911-1324</b>, a one-year "
  "ban on Black immigrants, calling them \"unsuitable to the climate and requirements of Canada.\" Cabinet repealed it on "
  "October 5, 1911, but the government used other methods to discourage Black immigrants, such as sending agents to "
  "Oklahoma to persuade people not to come and making border inspections stricter.",
  "Amber Valley's descendants and community are still remembered today, and Canada now recognizes Black pioneers' "
  "contributions to the Prairies."],
  mc=[("Why did many Black families leave Oklahoma for Canada?", ["To find gold", "New segregation laws and violence, and the offer of homestead land", "They were forced by Canada", "To join the army"], 1),
      ("What did Order-in-Council P.C. 1911-1324 try to do?", ["Give Black settlers free land", "Ban Black immigrants for one year", "End segregated schools", "Create Amber Valley"], 1),
      ("After the order was repealed, how did the government still discourage Black immigrants?", ["It didn't", "Agents in Oklahoma and stricter border inspections", "It built a wall", "It raised taxes"], 1)],
  sa=[("Identify two factors that contributed to Black migration to the Prairies (B3.2).", "Push: segregation laws and violence in Oklahoma. Pull: free homestead land advertised by Canada (paragraph 1)."),
      ("The government said Black immigrants were \"unsuitable to the climate.\" What evidence from the text challenges that claim?",
       "Black settlers built farms, homes, churches and schools in Amber Valley and Maidstone and survived hard winters; the claim was racism, not fact (paragraphs 2 and 4).")]),
]

G.EVENTS = [(1850, "The U.S. Fugitive Slave Act; Canada West's Common Schools Act allows segregated schools"),
            (1851, "Henry and Mary Bibb start the Voice of the Fugitive"),
            (1853, "Mary Ann Shadd launches the Provincial Freeman"),
            (1857, "William Hall's bravery at Lucknow earns the Victoria Cross"),
            (1858, "Black pioneers from San Francisco arrive in Victoria"),
            (1861, "Anderson Ruffin Abbott becomes the first Canadian-born Black doctor"),
            (1882, "John Ware helps drive cattle into present-day Alberta"),
            (1910, "Black settlers from Oklahoma found Amber Valley, Alberta"),
            (1911, "Order-in-Council P.C. 1911-1324 is approved, then repealed"),
            (1965, "The last segregated school in Ontario closes")]


def art(b, x, y, w, h):
    c = b.c; t = b.t
    c.setFillColor(t.dark); c.roundRect(x, y, w, h, 22, stroke=0, fill=1)
    ly = y + h / 2 - 6; c.setStrokeColor(t.accent); c.setLineWidth(4); c.line(x + 30, ly, x + w - 30, ly)
    yrs = [1850, 1853, 1857, 1858, 1861, 1882, 1910]
    for i, yr in enumerate(yrs):
        px = x + 40 + i * (w - 80) / (len(yrs) - 1)
        c.setFillColor(t.accent); c.circle(px, ly, 9, stroke=0, fill=1)
        c.setFillColor(white); c.setFont("Anton", 18); c.drawCentredString(px, ly + (22 if i % 2 == 0 else -38), str(yr))
    c.setFillColor(white); c.setFont("BodyB", 13); c.drawCentredString(x + w / 2, y + h - 34, "CANADA WEST  •  BRITISH COLUMBIA  •  THE PRAIRIES")
    c.drawCentredString(x + w / 2, y + 24, "FREEDOM  •  SEGREGATION  •  ACHIEVEMENT  •  PIONEERS")


def expectations_page(b):
    b.page("exp")
    y = b.header("Curriculum Connections", "Grade 8 History (2026)", name=False)
    y = b.para("This unit is built on the revised <b>Grade 8 History</b> curriculum, in effect beginning in the 2026-27 school year. "
               "Expectation codes and wording are from the Ontario Ministry of Education's Curriculum and Resources website.",
               M, y, W - 2 * M, style(11.5, 16)) - 12
    c = b.c
    c.setFillColor(b.t.dark); c.rect(M, y - 24, W - 2 * M, 24, stroke=0, fill=1)
    c.setFillColor(white); c.setFont("BodyB", 11); c.drawString(M + 8, y - 16, "Code"); c.drawString(M + 96, y - 16, "Focus in this unit")
    y -= 24
    for i, (cd, txt) in enumerate(G.CODES):
        if i % 2 == 0: c.setFillColor(b.t.light); c.rect(M, y - 40, W - 2 * M, 40, stroke=0, fill=1)
        c.setFillColor(b.t.primary); c.setFont("BodyB", 11); c.drawString(M + 8, y - 24, cd)
        b.para(txt, M + 96, y - 6, W - 2 * M - 104, style(10.5, 13.5)); y -= 40
    c.setStrokeColor(b.t.dark); c.setLineWidth(1); c.rect(M, y, W - 2 * M, 24 + 40 * len(G.CODES))
    y -= 20
    y = b.para("<b>Historical thinking concepts:</b> Historical Significance, Cause and Consequence, Continuity and Change, "
               "Historical Perspective.", M, y, W - 2 * M, style(11.5, 16)) - 8
    y = b.para("<b>Teaching with care.</b> These lessons describe racism and segregation honestly at a Grade 8 level. Centre Black "
               "people's agency, achievements and community-building, invite questions, and let students know who they can talk "
               "to if a topic is upsetting.", M, y, W - 2 * M, style(11.5, 16)) - 8
    b.para("<b>Pairs with:</b> Black History in Canada to 1850 (Grade 7 History, 2026), also from North Star Resources.",
           M, y, W - 2 * M, style(11.5, 16))


def significance(b):
    b.page("sig")
    y = b.header("Who or What Was Most Significant?", "Historical Significance")
    y = b.para("Rank these five from most (1) to least (5) historically significant. Use the criteria: <b>How many people were "
               "affected? How deeply? For how long? Does it help us understand today?</b>", M, y, W - 2 * M, style(11.5, 16)) - 10
    items = ["Mary Ann Shadd and the Provincial Freeman", "The Common Schools Act and segregated schools", "Black pioneers in Victoria",
             "William Hall, Anderson Abbott and John Ware", "Amber Valley and P.C. 1911-1324"]
    y = b.table(["Rank", "Person or event", "My evidence (criteria)"], [("", it_, "") for it_ in items], M, y, [50, 230, W - 2 * M - 280], rh=64, fs=10.5) - 18
    b.question(1, "Explain your number 1 choice. Use at least two criteria and two details from the lessons.", y, 5)


def inquiry(b):
    b.page("inq")
    y = b.header("Inquiry Project", "A2 / B2  •  Historical inquiry process")
    steps = [("1. Formulate a question", "Choose a question about Black experiences or communities in Canada, 1850-1914. Examples: "
              "How did Black newspapers shape debates about freedom and schooling? Why did segregated schools last so long? Why "
              "did the government try to stop Black immigration in 1911, and how did settlers respond?"),
             ("2. Gather and organize", "Find at least three sources, including at least one primary source (a newspaper page, a "
              "petition, a government order, a photograph). Record each on an Analyzing a Source organizer."),
             ("3. Check credibility", "Who created each source and why? Do other sources agree?"),
             ("4. Map it", "Locate the places in your inquiry: Chatham, Windsor, Victoria, Salt Spring Island, Amber Valley, Maidstone."),
             ("5. Interpret and conclude", "What does the evidence show? Compare perspectives, then and now (B1.3)."),
             ("6. Communicate", "Share your findings for a specific audience: a museum panel, podcast script, newspaper front page "
              "in the style of the Provincial Freeman, slide show or heritage plaque.")]
    for h_, t in steps:
        y = b.para(f"<b>{h_}.</b> {t}", M, y, W - 2 * M, style(11.5, 16)) - 8
    y -= 4
    b.question(1, "My inquiry question:", y, 2)
    b.question(2, "My audience and format:", y - 80, 2)


def sources_page(b):
    b.page("src")
    y = b.header("Teacher Notes: Sources", "Where these facts come from", name=False)
    y = b.para("Facts in this unit were checked against these reference sources. They are also excellent starting points for "
               "student inquiry.", M, y, W - 2 * M, style(11.5, 16)) - 10
    for s in ["The Canadian Encyclopedia: Racial Segregation of Black Students in Canadian Schools; Order-in-Council P.C. 1911-1324: "
              "the Proposed Ban on Black Immigration to Canada; Deemed Unsuitable: Black Pioneers in Western Canada; Amber Valley; "
              "William Neilson Hall; Anderson Abbott; John Ware: the Legend of Canada's \"First\" Black Cowboy; Underground Railroad",
              "Dictionary of Canadian Biography: Mary Ann Shadd; Anderson Ruffin Abbott; Mifflin Wistar Gibbs",
              "Ontario Heritage Trust: Provincial Freeman",
              "Parks Canada: Black Pioneer Immigration to Alberta and Saskatchewan",
              "Veterans Affairs Canada: William Neilson Edward Hall, VC",
              "BC Black History Awareness Society: Black pioneers in Victoria (National Historic Event, 1997)",
              "Library and Archives Canada: Amber Valley; Black history collections"]:
        y = b.para("• " + s, M + 6, y, W - 2 * M - 6, style(11, 15)) - 6
    y -= 6
    b.para("Where sources give slightly different dates or numbers (for example, the exact number of Prairie settlers or the year "
           "the Pioneer Rifle Corps formed), the unit uses ranges and words like \"about\" or \"around\".", M, y, W - 2 * M, style(11, 15, GREY))


def build(b):
    b.cover(["5 lessons", "primary sources", "inquiry project", "2026 curriculum"])
    b.guide("A ready-to-teach unit for the new Grade 8 History expectations on Black history in Canada (A3.2 for 1850-1890 and "
            "B3.2 for 1890-1914). Five short lessons cover Black newspapers and freedom seekers, segregated schools, Black pioneers "
            "in British Columbia, William Hall, Anderson Ruffin Abbott and John Ware, and Black Prairie settlers and the 1911 "
            "Order-in-Council. Students then build a timeline, judge historical significance, analyze sources and complete an inquiry project.",
            [("exp", "Curriculum connections (exact 2026 codes)"), ("vocab", "Key vocabulary"),
             ("l1", "Lesson 1: Freedom Seekers and a Free Press"), ("l2", "Lesson 2: Separate and Unequal: Segregated Schools"),
             ("l3", "Lesson 3: Black Pioneers in British Columbia"), ("l4", "Lesson 4: Courage and Achievement, 1850-1890"),
             ("l5", "Lesson 5: Prairie Pioneers and a Closed Door"), ("time", "Timeline Sort"), ("sig", "Historical Significance ranking"),
             ("source", "Analyzing a Source organizer"), ("inq", "Inquiry Project"), ("rub", "Rubric"), ("src", "Teacher notes: sources"),
             ("keys", "Answer keys"), ("terms", "Terms of use")],
            [("Pacing", "About 8-10 periods: one per lesson, one for the timeline and ranking, and 2-4 for the inquiry. Lessons 1-4 fit "
              "Strand A (1850-1890); Lesson 5 fits Strand B (1890-1914). Great for Black History Month in February."),
             ("Differentiate", "Read lessons in pairs; preview vocabulary first; allow oral, visual or digital inquiry products.")], ONT)
    expectations_page(b); G.vocab(b)
    for i, p in enumerate(G.L, 1): G.lesson(b, i, p)
    G.timeline(b); significance(b); G.source_page(b); inquiry(b); G.rubric(b); sources_page(b)
    secs = [(f"Lesson {i}: {p['t']}", [f"{'ABCD'[a]}. {o[a]}" for q, o, a in p["mc"]] + [a for q, a in p["sa"]]) for i, p in enumerate(G.L, 1)]
    b.text_key("Answer Key", secs, size=10.3)
    G.timeline(b, key=True)
    b.terms()


LISTING = dict(
    tpt_title="Grade 8 History Ontario 2026 | Black History in Canada 1850-1914 | New Curriculum A3.2 B3.2",
    price="$7.00. Range $6 to $8.", grades="8th", subjects="Canadian History, Social Studies, Black History Month", type="Unit Plans, Reading Passages, Projects",
    description="""
Teach the **new 2026 Ontario Grade 8 History expectations on Black history in Canada** (A3.2 and B3.2) with this
ready-to-go unit. It's built from the official revised curriculum, in effect beginning in 2026-27.

**5 lessons (passage + questions):**
1. Freedom Seekers and a Free Press (the Fugitive Slave Act, Mary Ann Shadd, the Provincial Freeman)
2. Separate and Unequal: Segregated Schools (the 1850 Common Schools Act to 1965)
3. Black Pioneers in British Columbia (Victoria, 1858; the Pioneer Rifle Corps)
4. Courage and Achievement (William Hall VC, Dr. Anderson Ruffin Abbott, John Ware)
5. Prairie Pioneers and a Closed Door (Amber Valley and Order-in-Council P.C. 1911-1324)

**Also included:** a curriculum connections page with exact 2026 codes, key vocabulary, a timeline sort, a historical
significance ranking, an Analyzing a Source organizer, an inquiry project (A2/B2) with an achievement-chart rubric,
teacher notes on sources, and answer keys.

Pairs with the **Grade 7** unit, Black History in Canada to 1850. Perfect for Black History Month too.
""",
    keywords=["grade 8 history", "Ontario history 2026", "Black history Canada", "Mary Ann Shadd", "Amber Valley",
              "segregated schools", "Black History Month", "Ontario curriculum", "inquiry", "new curriculum"])

if __name__ == "__main__":
    b = Book("Grade-8-History-Black-History-in-Canada-1850-1914-Ontario-2026", "Black History in Canada 1850-1914",
             "Grade 8 History Unit (New 2026 Curriculum)", "Grade 8", "heritage", art, ribbon="NEW 2026 CURRICULUM")
    run(build, b, inside=[3, 5, 6, 15, 16, 18], feature=5, feature_line=("5 lessons + inquiry project", "NEW 2026 GRADE 8 HISTORY"),
        key_page=22, preview=[1, 3, 5, 6, 15, 16], listing=LISTING)
