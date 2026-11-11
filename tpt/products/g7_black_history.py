"""Grade 7 History (Ontario 2026): Black History in Canada to 1850. Five lessons (passage + questions), vocabulary,
timeline sort, historical-significance ranking, source-analysis organizer, inquiry project with rubric, keys.
Expectation codes and wording come from the Ministry's Curriculum and Resources site (History, Grade 7, effective 2026-27)."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
from kit import Book, run, style, W, H, M, INK, GREY, KEYRED
from reportlab.lib.colors import white, HexColor
from remembrance_day import mc_block

ONT = ("The Ontario Curriculum, Social Studies Grades 1 to 6; History and Geography, Grades 7 and 8 (2026), "
       "<b>Grade 7 History</b>, effective 2026-27. <b>A3.7</b> describe some significant events and developments, including, "
       "but not limited to, enslavement, that had an impact on the lived experiences and settlement of various Black "
       "individuals and communities in Canada up to and including this time. <b>B3.5</b> describe various experiences, "
       "realities, challenges, and perspectives of members of Black settlements and communities across Canada and explore how "
       "the people in these settlements fostered a sense of belonging and pride in community. Also <b>A3.3</b> and <b>B3.3</b> "
       "(political and legal changes), <b>B3.7</b> (significant individuals), and the inquiry expectations <b>A2.1-A2.7</b> "
       "and <b>B2.1-B2.7</b>.")

CODES = [("A3.7", "Significant events and developments, including enslavement, that affected Black individuals and communities in Canada up to 1800"),
         ("A3.3", "Key political and legal changes, 1713-1800, and their impact (the 1793 Act)"),
         ("B3.5", "Experiences, realities, challenges and perspectives of Black settlements and communities; belonging and pride in community"),
         ("B3.3", "Key political and legal changes, 1800-1850, and their impact (abolition, 1834)"),
         ("B3.7", "Significant individuals and their contributions (Richard Pierpoint, Josiah Henson and others)"),
         ("A2 / B2", "Historical inquiry: questions, sources, credibility, evidence, conclusions, communication")]

VOCAB = [("enslavement", "Treating people as property: forcing them to work without pay or freedom, and buying or selling them."),
         ("freedom seeker", "A person who escaped enslavement to reach freedom (a more respectful term than \"fugitive\")."),
         ("Loyalist", "A person who stayed loyal to Britain during the American Revolution and often moved to British North America."),
         ("abolition", "The act of officially ending something, such as enslavement."),
         ("emancipation", "Being set free from enslavement."),
         ("settlement", "A community where people build homes, farms, schools and churches together."),
         ("primary source", "Evidence created at the time being studied, such as a law, a letter, a register or a diary."),
         ("secondary source", "An account created later by someone studying the past, such as an encyclopedia article."),
         ("historical significance", "How important a person or event was: how many people it affected, for how long, and how deeply."),
         ("perspective", "A point of view shaped by a person's experiences, identity and situation.")]

L = [
 dict(t="Enslavement in New France", code="A3.7", paras=[
  "Many people are surprised to learn that slavery existed in Canada. In New France, people were enslaved for about 200 "
  "years. Historians estimate that about 4,200 people were enslaved in New France at its peak. About 2,700 of them were "
  "Indigenous people, and at least 1,443 were Black people of African descent.",
  "One of the first recorded enslaved Africans in New France was a young African boy, brought to Québec "
  "as a child around 1629 and sold. He was baptized in 1633 and given the name Olivier Le Jeune. He lived in the colony "
  "until his death in 1654.",
  "On May 1, 1689, King Louis XIV of France officially allowed colonists in New France to bring in enslaved Black people. "
  "Most enslaved people in New France lived in towns such as Montréal and Québec, where they worked as servants in homes "
  "and businesses.",
  "In 1734, a fire destroyed much of Montréal's merchant district. Marie-Joseph Angélique, an enslaved Black woman, was "
  "accused of setting it. She was tortured and executed. Historians still debate whether she set the fire. Today she is "
  "remembered as a symbol of Black resistance and of the struggle for freedom in Canada.",
  "When Britain took control of New France in 1760, enslavement did not end. It continued under British rule."],
  mc=[("About how many people were enslaved in New France at its peak?", ["About 400", "About 4,200", "About 42,000", "No one"], 1),
      ("Which group made up the largest share of enslaved people in New France?", ["Black people of African descent", "Indigenous people", "French settlers", "British soldiers"], 1),
      ("What happened in 1689?", ["Enslavement ended", "Louis XIV allowed colonists to bring in enslaved Black people", "Montréal burned", "Britain took control"], 1)],
  sa=[("Why do you think many Canadians do not know that slavery existed in Canada? What problems could that cause?",
       "Answers vary: it is often left out of history lessons, and Canada is often described only as a place of freedom (the Underground Railroad). "
       "Not knowing can hide the experiences of Black and Indigenous people and make it harder to understand present-day inequality."),
      ("Why might Marie-Joseph Angélique be seen as a symbol of resistance, even though historians debate whether she set the fire?",
       "Her story shows the cruelty of enslavement and an enslaved woman challenging her situation; she had also tried to escape. "
       "Her story is now told to remember resistance and the struggle for freedom (paragraph 4).")]),
 dict(t="The Black Loyalists", code="A3.7", paras=[
  "During the American Revolution (1775-1783), Britain promised freedom to enslaved people who left American rebels and "
  "joined the British side. Thousands did. When the war ended, the British evacuated many of these Black Loyalists from "
  "New York.",
  "In 1783, British officials recorded the names of about 3,000 Black refugees who sailed from New York to Nova Scotia. "
  "This register is known as the <b>Book of Negroes</b>. For each person it lists a name, an age, a short description and "
  "how they gained their freedom. It is an important primary source, and it is the largest record of Black Loyalists.",
  "Many Black Loyalists settled at <b>Birchtown</b>, near Shelburne, Nova Scotia. Founded in 1783, it was the largest Black "
  "Loyalist settlement. Black Loyalists had been promised land, but many waited years for it or received small, rocky "
  "plots that were hard to farm. They faced discrimination and low wages, and in 1784 a mob of white settlers attacked "
  "Black homes in nearby Shelburne.",
  "Still, Black Loyalists built churches and schools and helped one another. In 1792, about 1,200 Black Loyalists left "
  "Nova Scotia and sailed to Sierra Leone in West Africa, where they helped found the city of Freetown.",
  "Today the Black Loyalist Heritage Centre in Birchtown tells their story."],
  mc=[("What did Britain promise enslaved people who joined the British side?", ["Money", "Freedom", "A house in London", "Nothing"], 1),
      ("What is the Book of Negroes?", ["A novel", "A 1783 register of Black refugees sailing to Nova Scotia", "A law", "A newspaper"], 1),
      ("Why did about 1,200 Black Loyalists leave Nova Scotia in 1792?", ["They were forced to join the army", "Broken promises and discrimination; they sought a better life in Sierra Leone", "Gold was found in Africa", "Nova Scotia ran out of fish"], 1)],
  sa=[("Is the Book of Negroes a primary or secondary source? What can historians learn from it, and what might it leave out?",
       "Primary source (created in 1783). It shows names, ages, descriptions and how people gained freedom. It leaves out people's own voices, feelings and experiences after arrival."),
      ("Compare the promise made to Black Loyalists with what they experienced. Use two details from the text.",
       "They were promised freedom and land, but many waited years for land or got poor, rocky plots; they faced discrimination, low wages and the 1784 Shelburne attack (paragraph 3).")]),
 dict(t="Chloe Cooley and the 1793 Act", code="A3.3 / A3.7", paras=[
  "On March 14, 1793, in the Niagara region of Upper Canada, a Black woman named Chloe Cooley was tied up and forced into a "
  "boat by the man who enslaved her, Adam Vrooman. He took her across the Niagara River to sell her in the United States. "
  "Chloe Cooley fought back: she screamed and resisted, and witnesses saw what happened.",
  "One witness, Peter Martin, a Black Loyalist, reported the incident to the government. Lieutenant-Governor John Graves "
  "Simcoe wanted to end slavery in Upper Canada. Many members of the Legislative Assembly enslaved people themselves, so "
  "they resisted.",
  "The result was a compromise. On July 9, 1793, the <b>Act to Limit Slavery in Upper Canada</b> became law. It stopped "
  "new enslaved people from being brought into the province. Children born to enslaved mothers after the Act would be "
  "freed at age 25.",
  "However, the Act did <b>not</b> free a single person who was already enslaved. Enslavement in Upper Canada continued "
  "until the British Parliament passed the Slavery Abolition Act in 1833. It took effect on <b>August 1, 1834</b>, ending "
  "slavery across the British Empire. In 2021, Canada's House of Commons voted to recognize August 1 as Emancipation Day.",
  "Chloe Cooley's resistance is remembered as a turning point. We do not know what happened to her after she was sold."],
  mc=[("What did the 1793 Act do?", ["Freed everyone enslaved in Upper Canada", "Stopped new enslaved people being brought in and freed children of enslaved mothers at 25", "Started enslavement", "Created Emancipation Day"], 1),
      ("Why was the Act a compromise?", ["Many Assembly members enslaved people and resisted full abolition", "Simcoe wanted more slavery", "Britain refused to sign", "Chloe Cooley asked for it"], 0),
      ("When did slavery end across the British Empire, including Upper Canada?", ["1793", "1812", "August 1, 1834", "1867"], 2)],
  sa=[("Was the 1793 Act progress? Give one argument for and one against.",
       "For: it was the first law in the British Empire to limit slavery and stopped new enslaved people being brought in. Against: it freed no one who was enslaved; enslavement continued for over 40 years."),
      ("How did Chloe Cooley and Peter Martin show agency (taking action to affect events)?",
       "Chloe Cooley resisted loudly so that others witnessed it; Peter Martin, a Black Loyalist, reported it to the government, which led to the Act (paragraphs 1-2).")]),
 dict(t="Richard Pierpoint and the Coloured Corps", code="B3.7", paras=[
  "Richard Pierpoint was born around 1744 in Bundu, in present-day Senegal, West Africa. At about 16 he was kidnapped, "
  "enslaved and taken to the American colonies. During the American Revolution he gained his freedom by fighting for the "
  "British with Butler's Rangers, and afterwards he settled in the Niagara region.",
  "When the War of 1812 began, Pierpoint, then in his late sixties, proposed raising a corps of Black soldiers to defend "
  "Upper Canada. His idea was turned down at first. Then, in October 1812, a small Black unit was formed, later known as "
  "the <b>Coloured Corps</b>. Pierpoint served as a private from 1812 to 1815.",
  "Black soldiers defended Upper Canada because the United States allowed slavery. A victory for the United States could "
  "have threatened their freedom. The Coloured Corps fought in battles in the Niagara region and later did "
  "construction and garrison work.",
  "After the war, veterans received land grants. Pierpoint received 100 acres near present-day Fergus, Ontario, in 1820. "
  "White veterans of the same war received 200 acres, twice as much.",
  "Late in life, Pierpoint asked to be sent home to Africa. His request was refused. In 2013, a federal building in "
  "London, Ontario, was named the Richard Pierpoint Building to honour him."],
  mc=[("Where was Richard Pierpoint born?", ["Nova Scotia", "Bundu, in present-day Senegal", "London, England", "Montréal"], 1),
      ("Why did Black soldiers have a special reason to defend Upper Canada in 1812?", ["They were paid more", "The United States allowed slavery, so a U.S. victory could threaten their freedom", "They were forced to", "They wanted to move to the U.S."], 1),
      ("How did Pierpoint's land grant compare with white veterans' grants?", ["The same", "He received half as much (100 acres vs 200)", "He received twice as much", "He received none"], 1)],
  sa=[("What does the difference in land grants tell us about Black veterans' experiences after the war?",
       "They faced discrimination: they served and risked their lives but were rewarded with half the land, showing unequal treatment (paragraph 4)."),
      ("Explain why Richard Pierpoint is historically significant. Use at least two details.",
       "He proposed and served in the Coloured Corps that defended Upper Canada; his life shows enslavement, the fight for freedom, Black military contributions and unequal treatment; he is honoured today (e.g., the 2013 building).")]),
 dict(t="Freedom, Settlements and Community", code="B3.5", paras=[
  "In the early 1800s, Black people from the United States travelled north to Upper Canada on the <b>Underground "
  "Railroad</b>, a secret network of people and safe houses. Historians estimate that 30,000 to 40,000 freedom seekers "
  "reached Canada. After slavery ended across the British Empire in 1834, and especially after the U.S. Fugitive Slave Act "
  "of 1850, Canada became an even more important place of refuge.",
  "Freedom seekers did not find a perfect welcome. Many faced racism, segregated schools and difficulty getting good land "
  "and jobs. In response, Black communities built settlements where they could support one another.",
  "In 1841, Josiah Henson, who had escaped enslavement in Kentucky, and his partners bought land near present-day Dresden, "
  "Ontario, for the <b>Dawn Settlement</b>. In 1842 they opened the British American Institute, a school that taught "
  "reading, writing and trades. Residents ran farms and a sawmill.",
  "In 1849, Reverend William King founded the <b>Elgin Settlement</b> (also called Buxton), near present-day Chatham, Ontario. "
  "Families bought their own land and built homes, churches and schools. Elgin became the largest and most successful of "
  "the Black settlements in southwestern Ontario. Its school was known for excellent teaching, and some white families "
  "chose to send their children there too.",
  "Settlements like Dawn and Elgin show how Black Canadians created belonging and pride in community through land "
  "ownership, education, faith and helping newcomers."],
  mc=[("What was the Underground Railroad?", ["A real railway under the ground", "A secret network of people and safe houses helping freedom seekers", "A Canadian army", "A school"], 1),
      ("What was the British American Institute?", ["A school at the Dawn Settlement", "A bank", "A railway", "A law"], 0),
      ("Which settlement became the largest and most successful in southwestern Ontario?", ["Birchtown", "Dawn", "Elgin (Buxton)", "Freetown"], 2)],
  sa=[("What challenges did freedom seekers face in Upper Canada?", "Racism, segregated schools, and difficulty getting good land and jobs (paragraph 2)."),
      ("Choose Dawn or Elgin. Describe two ways people there built belonging and pride in community.",
       "Dawn: the British American Institute school teaching reading, writing and trades; farms and a sawmill. Elgin: owning their own land; homes, churches and an excellent school (paragraphs 3-5).")]),
]

EVENTS = [(1629, "A young African boy, later named Olivier Le Jeune, is brought to Québec and sold"),
          (1689, "Louis XIV allows colonists in New France to bring in enslaved Black people"),
          (1734, "Fire in Montréal; Marie-Joseph Angélique is accused and executed"),
          (1783, "About 3,000 Black Loyalists sail to Nova Scotia; Birchtown is founded"),
          (1792, "About 1,200 Black Loyalists leave Nova Scotia for Sierra Leone"),
          (1793, "Chloe Cooley resists; the Act to Limit Slavery in Upper Canada becomes law"),
          (1812, "The Coloured Corps is formed to defend Upper Canada"),
          (1834, "Slavery ends across the British Empire (August 1)"),
          (1841, "Josiah Henson and partners buy land for the Dawn Settlement"),
          (1849, "Reverend William King founds the Elgin Settlement (Buxton)")]


def art(b, x, y, w, h):
    c = b.c; t = b.t
    c.setFillColor(t.dark); c.roundRect(x, y, w, h, 22, stroke=0, fill=1)
    ly = y + h / 2 - 6; c.setStrokeColor(t.accent); c.setLineWidth(4); c.line(x + 30, ly, x + w - 30, ly)
    yrs = [1629, 1734, 1783, 1793, 1812, 1834, 1849]
    for i, yr in enumerate(yrs):
        px = x + 40 + i * (w - 80) / (len(yrs) - 1)
        c.setFillColor(t.accent); c.circle(px, ly, 9, stroke=0, fill=1)
        c.setFillColor(white); c.setFont("Anton", 18); c.drawCentredString(px, ly + (22 if i % 2 == 0 else -38), str(yr))
    c.setFillColor(white); c.setFont("BodyB", 13); c.drawCentredString(x + w / 2, y + h - 34, "NEW FRANCE  •  BLACK LOYALISTS  •  UPPER CANADA")
    c.drawCentredString(x + w / 2, y + 24, "ENSLAVEMENT  •  RESISTANCE  •  FREEDOM  •  COMMUNITY")


def expectations_page(b):
    b.page("exp")
    y = b.header("Curriculum Connections", "Grade 7 History (2026)", name=False)
    y = b.para("This unit is built on the revised <b>Grade 7 History</b> curriculum, in effect beginning in the 2026-27 school year. "
               "Expectation codes and wording are from the Ontario Ministry of Education's Curriculum and Resources website.",
               M, y, W - 2 * M, style(11.5, 16)) - 12
    c = b.c
    c.setFillColor(b.t.dark); c.rect(M, y - 24, W - 2 * M, 24, stroke=0, fill=1)
    c.setFillColor(white); c.setFont("BodyB", 11); c.drawString(M + 8, y - 16, "Code"); c.drawString(M + 96, y - 16, "Focus in this unit")
    y -= 24
    for i, (cd, txt) in enumerate(CODES):
        if i % 2 == 0: c.setFillColor(b.t.light); c.rect(M, y - 40, W - 2 * M, 40, stroke=0, fill=1)
        c.setFillColor(b.t.primary); c.setFont("BodyB", 12); c.drawString(M + 8, y - 24, cd)
        b.para(txt, M + 96, y - 6, W - 2 * M - 104, style(10.5, 13.5)); y -= 40
    c.setStrokeColor(b.t.dark); c.setLineWidth(1); c.rect(M, y, W - 2 * M, 24 + 40 * len(CODES))
    y -= 20
    y = b.para("<b>Historical thinking concepts:</b> Historical Significance, Cause and Consequence, Continuity and Change, "
               "Historical Perspective.", M, y, W - 2 * M, style(11.5, 16)) - 8
    b.para("<b>Teaching with care.</b> These lessons describe enslavement honestly and at a Grade 7 level. Avoid role-plays or "
           "simulations of enslavement. Centre Black people's agency, resistance and community-building, invite questions, and "
           "let students know who they can talk to if a topic is upsetting.", M, y, W - 2 * M, style(11.5, 16))


def vocab(b):
    b.page("vocab")
    y = b.header("Key Vocabulary", "Words to know")
    for w_, d in VOCAB:
        y = b.para(f"<b>{w_}</b>: {d}", M, y, W - 2 * M, style(12, 16)) - 4
        y = b.rule_lines(M, y, W - 2 * M, 1, 18) - 8
    b.para("Under each definition, write the word in a sentence about this unit.", M, y, W - 2 * M, style(10.5, 14, GREY))


def lesson(b, i, p):
    b.page(f"l{i}")
    y = b.header(f"{i}. {p['t']}", f"Read  •  {p['code']}")
    for k, para in enumerate(p["paras"], 1):
        b.badge(M + 9, y - 9, k, r=9, fill=b.t.primary)
        y = b.para(para, M + 26, y, W - 2 * M - 26, style(12, 17.5)) - 9
    assert y > 50, p["t"]
    b.page(f"l{i}")
    y = b.header(f"{i}. {p['t']}: Questions", "Show what you know")
    for j, (q, o, a) in enumerate(p["mc"], 1):
        y = mc_block(b, j, q, o, y)
    for j, (q, a) in enumerate(p["sa"], 4):
        y = b.question(j, q, y, 4)


def timeline(b, key=False):
    b.page("keys" if key else "time")
    y = b.header("Timeline Sort", "Chronology  •  Cause and Consequence", name=not key)
    if key: b.key_stamp()
    y = b.para("Cut out the event cards (or number them). Put them in order from earliest to latest. Then circle the event you think "
               "was the most important turning point and explain why on the back.", M, y, W - 2 * M, style(11.5, 16)) - 10
    c = b.c; order = [3, 7, 0, 9, 5, 1, 8, 4, 2, 6]; cw = (W - 2 * M - 12) / 2; ch = 62
    for i, idx in enumerate(order):
        yr, ev = EVENTS[idx]; x = M + (i % 2) * (cw + 12); top = y - (i // 2) * (ch + 10)
        c.setDash(4, 3); c.setStrokeColor(GREY); c.roundRect(x, top - ch, cw, ch, 8); c.setDash()
        c.setFillColor(b.t.primary); c.roundRect(x + 8, top - ch / 2 - 14, 54, 28, 6, stroke=0, fill=1)
        c.setFillColor(white); c.setFont("Anton", 15); c.drawCentredString(x + 35, top - ch / 2 - 6, str(yr))
        b.para(ev, x + 70, top - 8, cw - 80, style(10.5, 13.5))
        if key:
            c.setFillColor(KEYRED); c.setFont("BodyB", 14); c.drawRightString(x + cw - 8, top - ch + 6, f"#{idx + 1}")


def significance(b):
    b.page("sig")
    y = b.header("Who or What Was Most Significant?", "Historical Significance")
    y = b.para("Rank these five from most (1) to least (5) historically significant. Use the criteria: <b>How many people were "
               "affected? How deeply? For how long? Does it help us understand today?</b>", M, y, W - 2 * M, style(11.5, 16)) - 10
    items = ["Marie-Joseph Angélique", "The Black Loyalists and the Book of Negroes", "Chloe Cooley and the 1793 Act",
             "Richard Pierpoint and the Coloured Corps", "The Dawn and Elgin Settlements"]
    y = b.table(["Rank", "Person or event", "My evidence (criteria)"], [("", it_, "") for it_ in items], M, y, [50, 210, W - 2 * M - 260], rh=64, fs=11) - 18
    b.question(1, "Explain your number 1 choice. Use at least two criteria and two details from the lessons.", y, 5)


def source_page(b):
    b.page("source")
    y = b.header("Analyzing a Source", "Inquiry  •  A2.2-A2.6 / B2.2-B2.6")
    y = b.para("Use this organizer with any source your teacher gives you or that you find. Good places to look: the Archives of "
               "Ontario online exhibits, Nova Scotia Archives (Black Loyalists), Library and Archives Canada, the Dictionary of "
               "Canadian Biography and The Canadian Encyclopedia.", M, y, W - 2 * M, style(11.5, 16)) - 10
    rows = ["Source title / description:", "Primary or secondary? How do you know?", "Who created it, when, and why (purpose)?",
            "Whose perspective does it show? Whose is missing?", "How credible is it? (Creator, evidence, bias, other sources agree?)",
            "What does it tell us about Black experiences in Canada?", "What questions does it raise?"]
    for r in rows:
        y = b.para(f"<b>{r}</b>", M, y, W - 2 * M, style(11.5, 15)) - 2
        y = b.rule_lines(M, y, W - 2 * M, 2, 20) - 10


def inquiry(b):
    b.page("inq")
    y = b.header("Inquiry Project", "A2 / B2  •  Historical inquiry process")
    steps = [("1. Formulate a question", "Choose a question about Black experiences or communities in Canada to 1850. Examples: How did "
              "the Black Loyalists' experiences differ from the promises they were given? How did the Elgin Settlement build pride "
              "in community? Was the 1793 Act a step forward?"),
             ("2. Gather and organize", "Find at least three sources, including at least one primary source. Record each on an "
              "Analyzing a Source organizer."),
             ("3. Check credibility", "Who created each source and why? Do other sources agree?"),
             ("4. Map it", "Locate the places in your inquiry on a map of present-day Canada (for example, Birchtown, Niagara, "
              "Dresden, Buxton)."),
             ("5. Interpret and conclude", "What does the evidence show? Consider different perspectives."),
             ("6. Communicate", "Share your findings for a specific audience: a museum panel, podcast script, slide show, letter "
              "to the editor or heritage plaque.")]
    for h, t in steps:
        y = b.para(f"<b>{h}.</b> {t}", M, y, W - 2 * M, style(11.5, 16)) - 8
    y -= 4
    b.question(1, "My inquiry question:", y, 2)
    b.question(2, "My audience and format:", y - 80, 2)


RUB = [("Knowledge and\nUnderstanding", ["limited knowledge of events, people and communities", "some knowledge", "considerable knowledge", "thorough knowledge"]),
       ("Thinking\n(inquiry)", ["uses sources and evaluates credibility with limited effectiveness", "with some effectiveness", "with considerable effectiveness", "with a high degree of effectiveness"]),
       ("Communication", ["expresses ideas and uses vocabulary with limited clarity for the audience", "with some clarity", "with considerable clarity", "with a high degree of clarity"]),
       ("Application", ["makes limited connections between the past and present-day Canada", "some connections", "considerable connections", "insightful connections"])]


def rubric(b):
    b.page("rub")
    y = b.header("Inquiry Project Rubric", "Ontario achievement chart", name=False)
    c = b.c; cw0 = 98; cw = (W - 2 * M - cw0) / 4
    c.setFillColor(b.t.dark); c.rect(M, y - 30, W - 2 * M, 30, stroke=0, fill=1)
    c.setFillColor(white); c.setFont("BodyB", 11); c.drawString(M + 6, y - 19, "Category")
    for i in range(4): c.drawCentredString(M + cw0 + i * cw + cw / 2, y - 19, f"Level {i + 1}")
    y -= 30; rh = 100
    for j, (cat, cells) in enumerate(RUB):
        c.setFillColor(b.t.light if j % 2 == 0 else white); c.rect(M, y - rh, W - 2 * M, rh, stroke=0, fill=1)
        b.para(cat.replace("\n", "<br/>"), M + 6, y - 8, cw0 - 10, style(11, 14, b.t.primary, "BodyB"))
        for i, t in enumerate(cells): b.para(t, M + cw0 + i * cw + 6, y - 8, cw - 12, style(10, 13))
        y -= rh
    c.setStrokeColor(b.t.dark); c.setLineWidth(1); c.rect(M, y, W - 2 * M, 30 + rh * 4)
    for i in range(5): c.line(M + cw0 + i * cw, y, M + cw0 + i * cw, y + 30 + rh * 4)
    b.para("<b>Teacher comments:</b> ______________________________________________________________", M, y - 26, W - 2 * M, style(11.5, 16))
    b.para("Level 3 represents the provincial standard.", M, y - 56, W - 2 * M, style(10, 13, GREY))


def sources_page(b):
    b.page("src")
    y = b.header("Teacher Notes: Sources", "Where these facts come from", name=False)
    y = b.para("Facts in this unit were checked against these reference sources. They are also excellent starting points for "
               "student inquiry.", M, y, W - 2 * M, style(11.5, 16)) - 10
    for s in ["The Canadian Encyclopedia: Black Enslavement; Olivier Le Jeune; Marie-Joseph Angélique; Black Loyalists in British "
              "North America; Chloe Cooley and the Act to Limit Slavery in Upper Canada; Richard Pierpoint; The Coloured Corps; "
              "Underground Railroad; Josiah Henson; Elgin Settlement",
              "Dictionary of Canadian Biography: Olivier Le Jeune; Richard Pierpoint; Josiah Henson; William King",
              "Ontario Heritage Trust: Chloe Cooley and the 1793 Act; The Dawn Settlement; Black Settlement in Ontario",
              "Archives of Ontario: Enslaved Africans in Upper Canada (online exhibit)",
              "Parks Canada: Richard Pierpoint; Josiah Henson",
              "Nova Scotia Archives: Black Loyalists and the Book of Negroes"]:
        y = b.para("• " + s, M + 6, y, W - 2 * M - 6, style(11, 15)) - 6
    y -= 6
    b.para("Where sources give slightly different dates or numbers (for example, when Olivier Le Jeune arrived, or the exact "
           "number of freedom seekers), the unit uses the most widely cited figure and words like \"about\" or \"around\".",
           M, y, W - 2 * M, style(11, 15, GREY))


def build(b):
    b.cover(["5 lessons", "primary sources", "inquiry project", "2026 curriculum"])
    b.guide("A ready-to-teach unit for the new Grade 7 History expectations on Black history in Canada (A3.7 and B3.5). Five "
            "short lessons move from enslavement in New France to the Black Loyalists, Chloe Cooley and the 1793 Act, Richard "
            "Pierpoint and the Coloured Corps, and the Dawn and Elgin settlements. Students then build a timeline, judge "
            "historical significance, analyze sources and complete an inquiry project.",
            [("exp", "Curriculum connections (exact 2026 codes)"), ("vocab", "Key vocabulary"),
             ("l1", "Lesson 1: Enslavement in New France"), ("l2", "Lesson 2: The Black Loyalists"),
             ("l3", "Lesson 3: Chloe Cooley and the 1793 Act"), ("l4", "Lesson 4: Richard Pierpoint and the Coloured Corps"),
             ("l5", "Lesson 5: Freedom, Settlements and Community"), ("time", "Timeline Sort"), ("sig", "Historical Significance ranking"),
             ("source", "Analyzing a Source organizer"), ("inq", "Inquiry Project"), ("rub", "Rubric"), ("src", "Teacher notes: sources"),
             ("keys", "Answer keys"), ("terms", "Terms of use")],
            [("Pacing", "About 8-10 periods: one per lesson, one for the timeline and significance ranking, and 2-4 for the inquiry. "
              "Works in Strand A (to 1800) and Strand B (1800-1850), and during Black History Month in February."),
             ("Differentiate", "Read lessons aloud or in pairs; use the vocabulary page first; allow oral or visual inquiry products.")], ONT)
    expectations_page(b); vocab(b)
    for i, p in enumerate(L, 1): lesson(b, i, p)
    timeline(b); significance(b); source_page(b); inquiry(b); rubric(b); sources_page(b)
    secs = [(f"Lesson {i}: {p['t']}", [f"{'ABCD'[a]}. {o[a]}" for q, o, a in p["mc"]] + [a for q, a in p["sa"]]) for i, p in enumerate(L, 1)]
    b.text_key("Answer Key", secs, size=10.3)
    timeline(b, key=True)
    b.terms()


LISTING = dict(
    tpt_title="Grade 7 History Ontario 2026 | Black History in Canada to 1850 | New Curriculum A3.7 B3.5",
    price="$7.00. Range $6 to $8.", grades="7th", subjects="Canadian History, Social Studies, Black History Month", type="Unit Plans, Reading Passages, Projects",
    description="""
Teach the **new 2026 Ontario Grade 7 History expectations on Black history in Canada** (A3.7 and B3.5) with this
ready-to-go unit. It's built from the official revised curriculum, in effect beginning in 2026-27.

**5 lessons (passage + questions):**
1. Enslavement in New France (including Olivier Le Jeune and Marie-Joseph Angélique)
2. The Black Loyalists (the Book of Negroes, Birchtown and Freetown)
3. Chloe Cooley and the 1793 Act to Limit Slavery in Upper Canada
4. Richard Pierpoint and the Coloured Corps in the War of 1812
5. Freedom, Settlements and Community (the Underground Railroad and the Dawn and Elgin settlements)

**Also included:** a curriculum connections page with exact 2026 codes, key vocabulary, a timeline sort, a historical
significance ranking, an Analyzing a Source organizer, an inquiry project (A2/B2) with an achievement-chart rubric,
teacher notes on sources, and answer keys.

Facts are checked against The Canadian Encyclopedia, the Dictionary of Canadian Biography, the Ontario Heritage Trust,
the Archives of Ontario and Parks Canada. Written with care, centring Black resistance, agency and community.
Perfect for Black History Month too.
""",
    keywords=["grade 7 history", "Ontario history 2026", "new France", "Black history Canada", "Black Loyalists",
              "Underground Railroad", "Chloe Cooley", "Black History Month", "Ontario curriculum", "inquiry"])

if __name__ == "__main__":
    b = Book("Grade-7-History-Black-History-in-Canada-to-1850-Ontario-2026", "Black History in Canada to 1850",
             "Grade 7 History Unit (New 2026 Curriculum)", "Grade 7", "heritage", art, ribbon="NEW 2026 CURRICULUM")
    run(build, b, inside=[3, 5, 6, 15, 16, 18], feature=5, feature_line=("5 lessons + inquiry project", "NEW 2026 GRADE 7 HISTORY"),
        key_page=22, preview=[1, 3, 5, 6, 15, 16], listing=LISTING)
