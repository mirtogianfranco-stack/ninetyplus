"""Plan a Class Party on a Budget (Grades 4-6, Ontario financial literacy): price flyer, warm-ups, best-buy unit prices,
order form, 13% HST extension, pitch to the principal, exemplar plan, keys."""
import os, sys
from decimal import Decimal, ROUND_HALF_UP
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
from kit import Book, run, style, W, H, M, INK, GREY, KEYRED
from kit.christmas import ornament, gift, candy_cane, star, gingerbread, RED, GREEN, GOLD, DKGREEN
from reportlab.lib.colors import white, HexColor

ONT = ("Ontario Mathematics (2020): <b>Strand F Financial Literacy, F1 Money and Finances</b> (Grade 5 F1.2: estimate and "
       "calculate the cost of transactions involving multiple items priced in dollars and cents, including sales tax; "
       "Grades 4-6: budgets, unit prices and consumer awareness) and <b>Strand B Number</b> (adding, subtracting, "
       "multiplying and dividing decimals; percents in Grade 6). Language (2023) Strand D: persuasive writing.")

D = lambda v: Decimal(str(v))
money = lambda v: f"${D(v).quantize(D('0.01'), ROUND_HALF_UP):,.2f}"
cents = lambda v: D(v).quantize(D("0.01"), ROUND_HALF_UP)
CLASS, BUDGET, HST = 24, D("50.00"), D("0.13")

ITEMS = [  # (section, item, pack, price)
 ("Food", "Clementines", "bag of 12", "4.49"), ("Food", "Sugar cookies", "box of 12", "5.49"),
 ("Food", "Mini candy canes", "box of 24", "3.29"), ("Food", "Popcorn", "box of 6 bags (each bag serves 4)", "3.99"),
 ("Food", "Gingerbread cookie kit", "makes 12 cookies", "8.99"),
 ("Drinks", "Apple juice boxes", "8-pack", "3.49"), ("Drinks", "Water bottles", "24-pack", "3.99"),
 ("Drinks", "Hot chocolate mix", "10 packets", "4.79"),
 ("Supplies", "Paper cups", "pack of 50", "2.99"), ("Supplies", "Napkins", "pack of 100", "1.99"),
 ("Supplies", "Paper plates", "pack of 30", "3.29"),
 ("Fun", "Streamers", "2 rolls", "2.49"), ("Fun", "Balloons", "pack of 25", "3.99"),
 ("Fun", "Snowflake ornament craft kit", "makes 24", "12.99"), ("Fun", "Winter bingo game", "class set of 30 cards", "6.49")]
PRICE = {it: D(p) for _, it, _, p in ITEMS}

WARM = [
 ("Mia buys <b>2 bags of clementines</b>. How much does she spend?", f"2 × $4.49 = {money(2 * PRICE['Clementines'])}"),
 ("Juice boxes come in 8-packs. How many packs are needed so all <b>24 students</b> get one? What is the cost?",
  f"24 ÷ 8 = 3 packs; 3 × $3.49 = {money(3 * PRICE['Apple juice boxes'])}"),
 ("Sam buys napkins and paper cups and pays with a <b>$10 bill</b>. How much change does he get?",
  f"$1.99 + $2.99 = $4.98; $10.00 − $4.98 = {money(10 - PRICE['Napkins'] - PRICE['Paper cups'])}"),
 ("Is one box of popcorn enough for the class? Explain.", "Yes: 6 bags × 4 people = 24 servings, exactly one per student."),
 ("<b>Estimate</b> the cost of streamers, balloons and paper plates by rounding to the nearest dollar. Then find the exact cost.",
  f"Estimate: $2 + $4 + $3 = $9. Exact: {money(PRICE['Streamers'] + PRICE['Balloons'] + PRICE['Paper plates'])}"),
 ("The craft kit costs $12.99 and makes 24 ornaments. <b>About</b> how much is that per student?",
  f"$12.99 ÷ 24 = about {money(PRICE['Snowflake ornament craft kit'] / 24)} (about 54¢)")]

BEST = [("Sugar cookies", (12, "5.49"), (24, "9.98")), ("Mini candy canes", (24, "3.29"), (12, "1.79")),
        ("Water bottles", (24, "3.99"), (12, "2.29")), ("Hot chocolate packets", (10, "4.79"), (25, "10.99"))]

PLAN = [("Clementines", 2), ("Sugar cookies", 2), ("Apple juice boxes", 3), ("Napkins", 1), ("Streamers", 1), ("Snowflake ornament craft kit", 1)]
SUB = sum(PRICE[i] * q for i, q in PLAN)
TAX = cents(SUB * HST)
PLAN2 = [p for p in PLAN if p[0] not in ("Snowflake ornament craft kit",)]
SUB2 = sum(PRICE[i] * q for i, q in PLAN2); TAX2 = cents(SUB2 * HST)
HSTQ = [("20.00", None), ("35.00", None), ("47.90", None), ("44.50", "Is a $44.50 order still within a $50 budget after HST?")]


def party_art(b, x, y, w, h):
    c = b.c
    c.setFillColor(DKGREEN); c.roundRect(x, y, w, h, 22, stroke=0, fill=1)
    rx, ry, rw, rh = x + 40, y + 22, 170, h - 44
    c.setFillColor(white); c.rect(rx, ry, rw, rh, stroke=0, fill=1)
    c.setFillColor(INK); c.setFont("Anton", 15); c.drawCentredString(rx + rw / 2, ry + rh - 26, "PARTY SHOP")
    c.setFont("Body", 9.5)
    for k, (i, q) in enumerate(PLAN[:5]):
        ty = ry + rh - 50 - k * 18
        c.drawString(rx + 12, ty, f"{q} × {i[:16]}"); c.drawRightString(rx + rw - 12, ty, money(PRICE[i] * q))
    c.setStrokeColor(INK); c.setDash(2, 2); c.line(rx + 10, ry + 62, rx + rw - 10, ry + 62); c.setDash()
    c.setFont("BodyB", 12); c.drawString(rx + 12, ry + 42, "BUDGET"); c.drawRightString(rx + rw - 12, ry + 42, "$50.00")
    c.setFillColor(RED); c.drawString(rx + 12, ry + 22, "HST 13%"); c.drawRightString(rx + rw - 12, ry + 22, "?")
    gift(c, x + w - 200, y + 24, 90); gift(c, x + w - 110, y + 24, 66, RED, GOLD)
    gingerbread(c, x + w - 70, y + 104, 90); candy_cane(c, x + w - 260, y + 30, 90)
    for ox, oy, col in [(-170, 150, RED), (-120, 170, GOLD), (-200, 120, HexColor("#2563EB"))]:
        ornament(c, x + w + ox, y + oy, 30, col)
    star(c, x + w - 40, y + h - 40, 18)


def mission(b):
    b.page("mission")
    y = b.header("Your Mission", "Plan a class party on a budget", name=False)
    c = b.c
    c.setFillColor(HexColor("#FFFBEB")); c.setStrokeColor(b.t.dark); c.setLineWidth(1.5); c.roundRect(M, y - 300, W - 2 * M, 300, 14, fill=1)
    yy = b.para("<b>To:</b> The Party Planning Committee (that's you!)<br/><b>From:</b> The Principal<br/><b>Re:</b> Our winter class party",
                M + 20, y - 18, W - 2 * M - 40, style(12.5, 18)) - 12
    yy = b.para(f"Great news! Your class has a budget of <b>{money(BUDGET)}</b> for a party on the last day before winter break. "
                f"There are <b>{CLASS} students</b> in your class. Your job is to plan a party that everyone will enjoy, without "
                "going over budget.", M + 20, yy, W - 2 * M - 40, style(12.5, 18)) - 10
    yy = b.para("Use the North Pole Party Shop price list to choose your items. Fill in the order form, check your math, and "
                "send me a short pitch explaining your plan. I can't wait to see what you come up with!", M + 20, yy, W - 2 * M - 40, style(12.5, 18))
    y -= 330
    y = b.section_title("Party rules", y) - 10
    for i, r in enumerate([f"Spend no more than {money(BUDGET)} in total.",
                           f"Every one of the {CLASS} students must get at least <b>one food</b> and <b>one drink</b>.",
                           "If you buy a drink that needs a cup (hot chocolate), buy cups too.",
                           "Include at least <b>one</b> item from the Fun section (a decoration or an activity).",
                           "Show all of your calculations. Round money to the nearest cent.",
                           "<b>Grades 5-6:</b> add 13% Ontario HST to your order. Are you still within budget?"], 1):
        b.badge(M + 10, y - 8, i)
        y = b.para(r, M + 28, y, W - 2 * M - 28, style(12.5, 17)) - 8


def flyer(b):
    b.page("flyer")
    y = b.header("North Pole Party Shop", "Price list", name=False)
    c = b.c; colw = (W - 2 * M - 16) / 2
    secs = ["Food", "Drinks", "Supplies", "Fun"]
    cols = [["Food", "Drinks"], ["Supplies", "Fun"]]
    for j, group in enumerate(cols):
        x = M + j * (colw + 16); yy = y
        for sname in group:
            c.setFillColor(b.t.dark); c.roundRect(x, yy - 28, colw, 28, 8, stroke=0, fill=1)
            c.setFillColor(white); c.setFont("Anton", 16); c.drawString(x + 12, yy - 21, sname.upper())
            yy -= 36
            for sec, it, pack, p in ITEMS:
                if sec != sname: continue
                c.setFillColor(b.t.light); c.setStrokeColor(b.t.primary); c.setLineWidth(1); c.roundRect(x, yy - 48, colw, 46, 8, fill=1)
                c.setFillColor(INK); c.setFont("BodyB", 12); c.drawString(x + 12, yy - 20, it)
                c.setFont("Body", 9.5); c.drawString(x + 12, yy - 36, pack)
                c.setFillColor(RED); c.setFont("Anton", 18); c.drawRightString(x + colw - 12, yy - 31, f"${p}")
                yy -= 52
            yy -= 10
    c.setFillColor(INK); c.setFont("Body", 9.5)
    c.drawCentredString(W / 2, 46, "Prices are before tax. Prices are made up for this activity.")


def warmups(b, key=False):
    b.page("keys" if key else "warm")
    y = b.header("Shopping Warm-Ups", "Use the price list", name=not key)
    if key: b.key_stamp()
    for i, (q, a) in enumerate(WARM, 1):
        y = b.question(i, q, y, 3, answer=a if key else None)


def bestbuy(b, key=False):
    b.page("keys" if key else "best")
    y = b.header("Which Is the Better Buy?", "Unit prices", name=not key)
    if key: b.key_stamp()
    y = b.para("Find the <b>unit price</b> (the cost of one item) for each choice: price ÷ number of items. Round to the nearest "
               "tenth of a cent, or compare in cents. Circle the better buy.", M, y, W - 2 * M, style(12.5, 17)) - 12
    c = b.c
    for i, (name, a, bb) in enumerate(BEST, 1):
        b.badge(M + 10, y - 8, i); c.setFillColor(INK); c.setFont("BodyB", 13); c.drawString(M + 28, y - 13, name)
        y -= 26; cw = (W - 2 * M - 28 - 12) / 2
        ua, ub = D(a[1]) / a[0] * 100, D(bb[1]) / bb[0] * 100
        for k, (lab, (n, p), u) in enumerate([("Shop A", a, ua), ("Shop B", bb, ub)]):
            x = M + 28 + k * (cw + 12)
            hit = key and u == min(ua, ub)
            c.setStrokeColor(KEYRED if hit else b.t.primary); c.setLineWidth(3 if hit else 1.2); c.roundRect(x, y - 80, cw, 80, 10)
            c.setFillColor(b.t.primary); c.setFont("BodyB", 12); c.drawString(x + 12, y - 20, f"{lab}: {n} for ${p}")
            c.setFillColor(INK); c.setFont("Body", 11); c.drawString(x + 12, y - 44, "Work:")
            c.drawString(x + 12, y - 68, "Unit price: ____________ ¢ each")
            if key:
                c.setFillColor(KEYRED); c.setFont("BodyB", 11); c.drawString(x + 50, y - 44, f"{p} ÷ {n} = {D(p) / n:.4f}")
                c.drawString(x + 80, y - 64, f"{u.quantize(D('0.1'), ROUND_HALF_UP)}")
        y -= 94
    q = "Shop B's hot chocolate is the better buy. Is it always the best choice for a class party? Explain."
    b.question(5, q, y, 2, answer=("Not always: you might only need 10 packets, so Shop A costs less in total ($4.79 vs $10.99), "
                                   "even though Shop B's unit price is lower.") if key else None)


def order(b):
    b.page("order")
    y = b.header("Party Order Form", "Plan your party")
    c = b.c
    y = b.table(["Item", "Qty", "Price each", "Total"], [("", "", "", "")] * 12, M, y, [250, 70, 98, 98], rh=27, fs=12) - 16
    rows = [("Subtotal", ""), (f"Budget", money(BUDGET)), ("Money left over (budget − subtotal)", ""),
            (f"Cost per student (subtotal ÷ {CLASS})", "")]
    for lab, v in rows:
        c.setFillColor(INK); c.setFont("BodyB", 12.5); c.drawRightString(W - M - 110, y - 14, lab)
        c.setStrokeColor(INK); c.setLineWidth(1); c.rect(W - M - 98, y - 22, 98, 24)
        if v: c.setFont("Body", 12.5); c.drawCentredString(W - M - 49, y - 14, v)
        y -= 32
    y -= 6
    c.setFont("BodyB", 12); c.drawString(M, y - 12, "Check:")
    for k, t in enumerate(["every student gets a food", "every student gets a drink", "cups (if needed)", "one Fun item", "within budget"]):
        x = M + 60 + (k % 3) * 156; yy = y - 12 - (k // 3) * 22
        c.setStrokeColor(INK); c.setLineWidth(1); c.rect(x, yy - 2, 11, 11); c.setFont("Body", 11); c.drawString(x + 16, yy, t)


def hst(b, key=False):
    b.page("keys" if key else "hst")
    y = b.header("Add the HST", "Grades 5-6 extension", name=not key)
    if key: b.key_stamp()
    c = b.c
    c.setFillColor(b.t.light); c.setStrokeColor(b.t.primary); c.setLineWidth(1.5); c.roundRect(M, y - 128, W - 2 * M, 128, 12, fill=1)
    b.para("In Ontario, most purchases have a <b>13% HST</b> (Harmonized Sales Tax) added at the checkout. "
           "(In real life, some basic groceries, such as fresh fruit, are not taxed. In this activity, add HST to the whole order.)<br/><br/>"
           "<b>Mental math strategy:</b> find 10%, then find 1% and multiply by 3, then add.<br/>"
           "Example: 13% of $30.00 = $3.00 (10%) + $0.90 (3%) = <b>$3.90</b>. Total: $30.00 + $3.90 = <b>$33.90</b>.",
           M + 16, y - 14, W - 2 * M - 32, style(12, 16.5))
    y -= 148
    rows = []
    for amt, _ in HSTQ:
        t = cents(D(amt) * HST)
        rows.append((money(amt), money(t) if key else "", money(D(amt) + t) if key else ""))
    y = b.table(["Subtotal", "13% HST", "Total with HST"], rows, M, y, [172, 172, 172], rh=34, fs=13, first_left=False) - 20
    if key:
        c.setFillColor(KEYRED)
    y = b.question(1, HSTQ[3][1], y, 2, answer=f"No! $44.50 + {money(cents(D('44.50') * HST))} = {money(D('44.50') + cents(D('44.50') * HST))}, which is 29¢ over budget." if key else None)
    y = b.question(2, "Now add HST to <b>your</b> party order. What is your total? Are you still within budget? If not, what will you change?",
                   y, 4, answer="Answers vary. Check: subtotal × 0.13, rounded to the nearest cent, added to the subtotal." if key else None)
    b.question(3, "Why is it smart to plan for tax <b>before</b> you go shopping?", y, 2,
               answer="So you don't go over budget at the checkout; the price tags don't include tax." if key else None)


def pitch(b):
    b.page("pitch")
    y = b.header("Pitch Your Party", "Persuasive writing")
    y = b.para("Write a short letter to the principal. Persuade them to choose <b>your</b> party plan. Include: what you are "
               "buying, how it follows the rules, your total cost, and why your classmates will love it.", M, y, W - 2 * M, style(12.5, 17)) - 10
    c = b.c; c.setFillColor(INK); c.setFont("Body", 13); c.drawString(M, y - 10, "Dear Principal,")
    y = b.rule_lines(M, y - 16, W - 2 * M, 15, gap=28) - 20
    c.drawString(M, y, "Sincerely,  ________________________")


def exemplar(b):
    b.page("keys")
    y = b.header("Sample Party Plan", "Teacher exemplar", name=False); b.key_stamp()
    rows = [(i, q, money(PRICE[i]), money(PRICE[i] * q)) for i, q in PLAN]
    y = b.table(["Item", "Qty", "Price each", "Total"], rows, M, y, [250, 70, 98, 98], rh=26, fs=12) - 14
    lines = [f"<b>Subtotal:</b> {money(SUB)}   •   <b>Left over:</b> {money(BUDGET - SUB)}   •   <b>Cost per student:</b> "
             f"{money(SUB)} ÷ {CLASS} = about {money(SUB / CLASS)}",
             "<b>Rules check:</b> food for everyone (2 bags of clementines = 24, 2 boxes of cookies = 24); drinks for everyone "
             "(3 eight-packs of juice = 24, no cups needed); Fun items: streamers and the craft kit.",
             f"<b>Grades 5-6, add HST:</b> 13% of {money(SUB)} = {money(TAX)}. Total {money(SUB + TAX)}. That is "
             f"<b>{money(SUB + TAX - BUDGET)} over budget!</b>",
             f"<b>One fix:</b> drop the craft kit and make paper snowflakes with classroom paper instead. New subtotal "
             f"{money(SUB2)}; HST {money(TAX2)}; total <b>{money(SUB2 + TAX2)}</b>, within budget with "
             f"{money(BUDGET - SUB2 - TAX2)} to spare.",
             "Use this exemplar to model the task, or as a success-criteria anchor. Student plans will vary: check that each "
             "plan follows the rules and that the math is correct."]
    for t in lines:
        y = b.para(t, M, y, W - 2 * M, style(12.5, 18)) - 12


def build(b):
    b.cover(["$50 budget", "unit prices", "13% HST", "Ontario aligned"])
    b.guide("A real-world financial literacy project for the last week before winter break. Students get a $50 budget to plan "
            "a party for a class of 24, shop from a price list, compare unit prices, complete an order form, and (Grades 5-6) "
            "add 13% Ontario HST. They finish by pitching their plan to the principal.",
            [("mission", "Your Mission: memo from the principal and party rules"), ("flyer", "North Pole Party Shop price list"),
             ("warm", "Shopping Warm-Ups (6 problems)"), ("best", "Which Is the Better Buy? (unit prices)"),
             ("order", "Party Order Form"), ("hst", "Add the HST (Grades 5-6 extension)"), ("pitch", "Pitch Your Party (persuasive letter)"),
             ("keys", "Answer keys and a sample party plan"), ("terms", "Terms of use")],
            [("Timing", "About 3 to 4 periods: mission and warm-ups; best buys; order form; HST and pitch. Works well in pairs."),
             ("Differentiate", "Grade 4: skip HST and allow calculators for the order form. Grade 6: require two plans and "
              "compare cost per student, or change the budget to $40."),
             ("Make it real", "If your school allows it, let the winning plan become the actual class party."),
             ("Prices", "Prices are made up for the activity but close to typical Canadian grocery prices.")], ONT)
    mission(b); flyer(b); warmups(b); bestbuy(b); order(b); hst(b); pitch(b)
    warmups(b, True); bestbuy(b, True); hst(b, True); exemplar(b)
    b.terms()


LISTING = dict(
    tpt_title="Christmas Math Project: Plan a Class Party on a Budget | Financial Literacy | Grades 4-6 | Ontario",
    price="$4.50. Range $4 to $5.", grades="4th, 5th, 6th", subjects="Math, Financial Literacy, Christmas", type="Projects, Activities, Math Centres",
    description="""
A **real-world money project** for the last week before winter break! Students get a **$50 budget** to plan a winter
class party for 24 students, shop from a price list, find the better buy, and fill in an order form.
Grades 5-6 add **13% Ontario HST** and find out whether they're still within budget.

**What's included:**
- Your Mission: a memo from the principal plus party rules
- North Pole Party Shop price list (15 items in dollars and cents)
- Shopping Warm-Ups: 6 problems (decimals, change, estimating, cost per student)
- Which Is the Better Buy? Unit price comparisons
- Party Order Form with subtotal, money left over and cost per student
- Add the HST: Grades 5-6 extension with a mental math strategy (10% + 3%)
- Pitch Your Party: persuasive letter to the principal
- Answer keys and a worked sample party plan (teacher exemplar)

**Ontario curriculum:** Mathematics (2020) Strand F Financial Literacy (including Grade 5 F1.2, transactions with sales
tax) and Strand B Number (decimal operations); Language (2023) Strand D.
""",
    keywords=["christmas math project", "financial literacy", "budget project", "Ontario math", "HST", "grade 5 math",
              "grade 4", "grade 6", "unit price", "December math"])

if __name__ == "__main__":
    b = Book("Plan-a-Class-Party-on-a-Budget-Grades-4-6-Ontario", "Plan a Party on a Budget", "Christmas Financial Literacy Project",
             "Grades 4-6", "elf", party_art, ribbon="ONTARIO CURRICULUM")
    run(build, b, inside=[3, 4, 5, 6, 7, 8], feature=4, feature_line=("A $50 budget for 24 students", "REAL-WORLD MONEY MATH"),
        key_page=15, preview=[1, 3, 4, 6, 7, 8], listing=LISTING)
