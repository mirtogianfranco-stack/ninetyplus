"""Black History Month: Black Canadians Who Shaped Our History (Grades 3-8, Ontario). Biography trading cards, timeline
cut-and-order, Who Am I? quiz, research organizer, reflection, keys. Facts checked against reference sources."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from kit import Book, run, style, W, H, M, INK, GREY, KEYRED
from kit.remembrance import maple_leaf
from reportlab.lib.colors import white, HexColor

ONT = ("Ontario Language Curriculum (2023), Grades 3-8: <b>Strand A Literacy Connections and Applications</b> (A3 "
       "exploring diverse cultures, perspectives and identities, including Black Canadian voices), <b>Strand C "
       "Comprehension</b> (informational texts) and <b>Strand D Composition</b> (research and reflective writing). Connects "
       "to Ontario Social Studies (heritage and identity, and Canadian communities past and present) and History "
       "(Grades 7-8: perspectives and significance).")

PEOPLE = [
 dict(n="Josiah Henson", y="1789-1883", p="Dresden, Ontario", k="Freedom seeker and community builder", f=[
  "Escaped slavery in the United States and reached Upper Canada (now Ontario) in 1830.",
  "Helped found the Dawn Settlement near Dresden, a community and school for formerly enslaved people.",
  "His life story helped inspire the famous novel Uncle Tom's Cabin (1852)."], w="He built a place where freedom seekers could learn, work and thrive."),
 dict(n="Harriet Tubman", y="c. 1822-1913", p="St. Catharines, Ontario", k="Underground Railroad conductor", f=[
  "Escaped slavery and then returned again and again to guide others to freedom.",
  "Lived in St. Catharines, Ontario, in the 1850s, and led freedom seekers there.",
  "Worshipped at Salem Chapel (BME Church) in St. Catharines, which still stands today."], w="Her courage helped many people reach freedom, some of them in Ontario."),
 dict(n="Mary Ann Shadd", y="1823-1893", p="Windsor and Chatham, Ontario", k="Journalist, teacher and activist", f=[
  "Moved to Canada West (now Ontario) in 1851 and opened a school.",
  "Founded The Provincial Freeman newspaper in 1853.",
  "Was the first Black woman in North America to publish and edit a newspaper."], w="She used writing to fight for equality and education."),
 dict(n="Viola Desmond", y="1914-1965", p="Halifax, Nova Scotia", k="Businesswoman and civil rights pioneer", f=[
  "In 1946, she refused to leave the whites-only section of a movie theatre in New Glasgow, Nova Scotia.",
  "She was arrested and convicted. Nova Scotia granted her a free pardon in 2010.",
  "In 2018, she appeared on Canada's $10 bank note."], w="Her stand against segregation helped spark change in Canada."),
 dict(n="Willie O'Ree", y="born 1935", p="Fredericton, New Brunswick", k="Hockey pioneer", f=[
  "On January 18, 1958, he became the first Black player in the National Hockey League.",
  "He played for the Boston Bruins, even though he was nearly blind in one eye.",
  "He was inducted into the Hockey Hall of Fame in 2018."], w="He broke a barrier in Canada's game and has helped young players everywhere."),
 dict(n="Lincoln Alexander", y="1922-2012", p="Hamilton, Ontario", k="Politician and public servant", f=[
  "Served in the Royal Canadian Air Force during the Second World War.",
  "In 1968, he became the first Black member of Canada's House of Commons.",
  "Served as Lieutenant Governor of Ontario from 1985 to 1991."], w="He opened doors in Canadian government for others to follow."),
 dict(n="Jean Augustine", y="born 1937", p="Toronto, Ontario", k="Teacher, principal and politician", f=[
  "Moved to Canada from Grenada in 1960 and became a teacher and principal in Toronto.",
  "In 1993, she became the first Black woman elected to Canada's Parliament.",
  "In 1995, she introduced the motion that made February Black History Month across Canada."], w="Because of her, all of Canada celebrates Black History Month."),
 dict(n="Michaëlle Jean", y="born 1957", p="Born in Haiti", k="Journalist and Governor General", f=[
  "Came to Canada from Haiti with her family in 1968.",
  "Became a well-known journalist and broadcaster.",
  "From 2005 to 2010, she served as Canada's first Black Governor General."], w="She represented Canada at the highest level and championed young people and the arts."),
]
TIMELINE = [(1830, "Josiah Henson reaches Upper Canada"), (1853, "Mary Ann Shadd founds The Provincial Freeman"),
            (1946, "Viola Desmond refuses to leave a whites-only theatre section"), (1958, "Willie O'Ree plays his first NHL game"),
            (1968, "Lincoln Alexander elected to the House of Commons"), (1993, "Jean Augustine elected to Parliament"),
            (1995, "February declared Black History Month in Canada"), (2005, "Michaëlle Jean becomes Governor General")]
TORDER = [5, 2, 7, 0, 4, 1, 6, 3]
CLUES = [("I founded a newspaper called The Provincial Freeman in 1853.", "Mary Ann Shadd"),
         ("I was the first Black player in the NHL.", "Willie O'Ree"),
         ("I helped found the Dawn Settlement near Dresden, Ontario.", "Josiah Henson"),
         ("I appeared on Canada's $10 bank note in 2018.", "Viola Desmond"),
         ("I introduced the motion to make February Black History Month in Canada.", "Jean Augustine"),
         ("I was Canada's first Black Governor General.", "Michaëlle Jean"),
         ("I lived in St. Catharines and led people to freedom on the Underground Railroad.", "Harriet Tubman"),
         ("I was the first Black member of the House of Commons and later Lieutenant Governor of Ontario.", "Lincoln Alexander")]
MORE = ["Chloe Cooley", "Anderson Ruffin Abbott", "Elijah McCoy", "Portia White", "Rosemary Brown", "Daurene Lewis", "Oscar Peterson", "Donovan Bailey"]


def trading_cards(b):
    for i in range(0, 8, 2):
        b.page("cards")
        y = b.header("Black Canadian Trading Cards", "Read, cut and collect", name=False)
        c = b.c; ch = (y - 50) / 2
        for j in range(2):
            p = PEOPLE[i + j]; top = y - j * ch; x0, w = M, W - 2 * M
            c.setDash(5, 4); c.setStrokeColor(GREY); c.rect(x0, top - ch + 6, w, ch - 6); c.setDash()
            c.setFillColor(b.t.primary); c.roundRect(x0 + 10, top - 70, w - 20, 60, 12, stroke=0, fill=1)
            initials = "".join(t[0] for t in p["n"].replace("'", "").split()[:2])
            c.setFillColor(b.t.accent); c.circle(x0 + 48, top - 40, 24, stroke=0, fill=1)
            c.setFillColor(b.t.dark); c.setFont("Anton", 20); c.drawCentredString(x0 + 48, top - 47, initials)
            c.setFillColor(white); c.setFont("Anton", 24); c.drawString(x0 + 82, top - 40, p["n"].upper())
            c.setFont("BodyB", 11); c.drawString(x0 + 82, top - 58, f"{p['y']}  •  {p['p']}")
            yy = b.para(f"<b>Known for:</b> {p['k']}", x0 + 20, top - 82, w - 40, style(12, 16, b.t.primary, "BodyB")) - 6
            for fct in p["f"]:
                yy = b.para(f"• {fct}", x0 + 20, yy, w - 40, style(12.2, 16.5)) - 4
            c.setFillColor(b.t.light); c.roundRect(x0 + 14, top - ch + 18, w - 28, 44, 8, stroke=0, fill=1)
            b.para(f"<b>Why it matters:</b> {p['w']}", x0 + 24, top - ch + 56, w - 48, style(11.5, 15))


def timeline(b, key):
    y = b.header("Timeline of Firsts", "Cut and order")
    if key: b.key_stamp()
    c = b.c
    b.para("Cut out the event cards. Glue them on the timeline in order, from oldest to newest.", M, y, W - 2 * M, style(12.5, 16))
    y -= 36; c.setStrokeColor(b.t.primary); c.setLineWidth(4); c.line(M + 20, y - 4, M + 20, y - 8 * 44)
    for i in range(8):
        yy = y - i * 44
        c.setFillColor(b.t.accent); c.circle(M + 20, yy - 20, 7, stroke=0, fill=1)
        c.setStrokeColor(GREY); c.setLineWidth(1); c.roundRect(M + 40, yy - 38, W - 2 * M - 40, 36, 6)
        if key:
            yr, ev = TIMELINE[i]; c.setFillColor(KEYRED); c.setFont("BodyB", 12); c.drawString(M + 52, yy - 25, f"{yr}  {ev}")
    y -= 8 * 44 + 26
    if not key:
        cw, chh = (W - 2 * M) / 2, 40
        for j, idx in enumerate(TORDER):
            r, k = divmod(j, 2); x, yy = M + k * cw, y - r * chh
            c.setDash(4, 3); c.setStrokeColor(GREY); c.rect(x, yy - chh, cw, chh); c.setDash()
            yr, ev = TIMELINE[idx]; b.para(f"<b>{yr}</b>  {ev}", x + 8, yy - 6, cw - 16, style(10.5, 13))


def who_am_i(b, key):
    y = b.header("Who Am I?", "Use your trading cards")
    if key: b.key_stamp()
    b.para("<b>Word bank:</b> " + "  •  ".join(p["n"] for p in PEOPLE), M, y, W - 2 * M, style(11.5, 15.5))
    y -= 44
    for i, (clue, ans) in enumerate(CLUES, 1):
        y = b.question(i, clue, y, 1, answer=ans if key else None)


def research(b):
    y = b.header("Research a Black Canadian", "Organizer")
    c = b.c
    b.para("Choose someone from the trading cards or this list: " + ", ".join(MORE) + ".", M, y, W - 2 * M, style(11.5, 15.5))
    y -= 40
    for head, n in [("Name, years and where they lived", 1), ("Three important facts", 4), ("A challenge they faced", 2),
                    ("How they made a difference", 2), ("A question I still have", 1), ("My sources", 2)]:
        c.setFillColor(b.t.primary); c.setFont("BodyB", 12.5); c.drawString(M, y - 12, head)
        y = b.rule_lines(M, y - 14, W - 2 * M, n, 22) - 16


def reflect(b):
    y = b.header("Reflection", "Why does this history matter?")
    y = b.question(1, "Which person from the trading cards inspires you most? Explain why, using at least two facts.", y, 5)
    y = b.question(2, "Many of these people were \"the first\" to do something. Why can being first be both hard and important?", y, 5)
    y = b.question(3, "Why is it important for all Canadians to learn about Black Canadian history?", y, 5)


def art(b, x, y, w, h):
    c = b.c
    c.setFillColor(HexColor("#111827")); c.roundRect(x, y, w, h, 22, stroke=0, fill=1)
    for i, p in enumerate(PEOPLE[:6]):
        cx, cy = x + 70 + (i % 3) * (w - 140) / 2, y + h - 70 - (i // 3) * 95
        c.setFillColor(HexColor("#F59E0B")); c.circle(cx, cy, 30, stroke=0, fill=1)
        c.setFillColor(HexColor("#111827")); c.setFont("Anton", 22)
        c.drawCentredString(cx, cy - 8, "".join(t[0] for t in p["n"].replace("'", "").split()[:2]))
    maple_leaf(c, x + w - 36, y + 34, 20, HexColor("#DC2626"))


def build(b):
    b.cover(["8 trading cards", "timeline", "Who Am I?", "Ontario aligned"])
    b.guide("Celebrate Black History Month with eight Black Canadians who shaped our history, including four with strong "
            "Ontario connections. Students read and collect biography trading cards, put key \"firsts\" on a timeline, solve "
            "Who Am I? clues, research another Black Canadian, and reflect in writing.",
            [("cards", "8 biography trading cards (2 per page)"), ("tl", "Timeline of Firsts: cut and order"), ("who", "Who Am I? quiz"),
             ("res", "Research organizer (with a list of more Black Canadians)"), ("ref", "Reflection writing"),
             ("keys", "Answer keys"), ("terms", "Terms of use")],
            [("Background", "Jean Augustine, the first Black woman elected to Parliament, introduced the 1995 motion that "
              "made February Black History Month across Canada."),
             ("Facts", "Facts were checked against reference sources such as The Canadian Encyclopedia and Government of Canada "
              "pages. Please preview before teaching."),
             ("Differentiation", "Grades 3-4 can use the cards with a partner; Grades 7-8 can extend the research organizer "
              "into a presentation.")], ONT)
    trading_cards(b)
    b.page("tl"); timeline(b, False)
    b.page("who"); who_am_i(b, False)
    b.page("res"); research(b)
    b.page("ref"); reflect(b)
    b.page("keys"); timeline(b, True)
    b.page("keys"); who_am_i(b, True)
    b.terms()


LISTING = dict(
    tpt_title="Black History Month Canada | Black Canadians Trading Cards, Timeline & Research | Grades 3-8 | Ontario",
    price="$4.50. Range $4 to $5.", grades="3rd-8th", subjects="Social Studies, History, Reading", type="Activities, Biographies, Research",
    description="Celebrate Black History Month with eight Black Canadians who shaped our history: Josiah Henson, Harriet "
                "Tubman (in St. Catharines), Mary Ann Shadd, Viola Desmond, Willie O'Ree, Lincoln Alexander, Jean Augustine "
                "and Michaëlle Jean.\n\nIncluded: 8 biography trading cards (known for, key facts, why it matters), a "
                "Timeline of Firsts cut-and-order activity, a Who Am I? quiz, a research organizer with more Black Canadians "
                "to explore, reflection writing, answer keys and a teacher guide.\n\nOntario Language (2023) Strands A, C and "
                "D; connects to Social Studies and History. Facts checked against reference sources.",
    keywords=["Black History Month", "Black Canadians", "Canadian history", "Viola Desmond", "biography", "Ontario", "grade 5",
              "grade 7", "February", "research"])

if __name__ == "__main__":
    b = Book("Black-History-Month-Black-Canadians-Grades-3-8-Ontario", "Black History Month", "Black Canadians Who Shaped Our History",
             "Grades 3-8", "heritage", art, ribbon="ONTARIO CURRICULUM")
    run(build, b, inside=[3, 4, 7, 8, 9, 10], feature=3, feature_line=("8 Black Canadians", "TRADING CARDS • TIMELINE • RESEARCH"),
        key_page=12, preview=[1, 2, 3, 7, 8], listing=LISTING)
