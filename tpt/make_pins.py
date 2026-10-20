"""Pinterest pins (1000x1500): style A = headline + cover + interior page; style B = what's inside (3 pages + benefits).
Writes out/pins/*.png and out/pins/PINS-copy-paste.txt (title, description, board per pin)."""
import glob, os, subprocess, tempfile
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__)); F = os.path.join(HERE, "kit", "fonts"); OUT = os.path.join(HERE, "out"); PO = os.path.join(OUT, "pins")
anton = lambda n: ImageFont.truetype(f"{F}/anton-400.ttf", n)
bold = lambda n: ImageFont.truetype(f"{F}/Andika-Bold.ttf", n)
STAR = os.path.join(HERE, "brand", "store-icon-star-only.png")
SEASON = {"hw": ((46, 16, 101), (234, 88, 12), (163, 230, 53)), "rd": ((30, 41, 59), (155, 28, 28), (212, 175, 55)),
          "wi": ((12, 30, 58), (3, 105, 161), (244, 63, 94))}
# slug, season, headline (2 lines max), subhead, interior pages for A/B, board, keywords line, kind
P = [
 ("Halloween-Math-Literacy-Kindergarten-Ontario", "hw", "HALLOWEEN MATH & LITERACY", "Kindergarten  •  Ontario", [7, 3, 10], "Halloween Kindergarten", "counting, patterns, beginning sounds"),
 ("Halloween-Mystery-Pictures-Grade-1-Ontario", "hw", "HALLOWEEN MYSTERY PICTURES", "Grade 1 Addition & Subtraction", [3, 10, 7], "Halloween Math", "colour by number, facts to 10"),
 ("Halloween-Data-Management-Grade-2-Ontario", "hw", "HALLOWEEN DATA & GRAPHING", "Grade 2  •  Ontario Math", [6, 4, 7], "Halloween Math", "tally, pictograph, bar graph, probability"),
 ("Pumpkin-Life-Cycle-Grade-3-Science-Ontario", "hw", "PUMPKIN LIFE CYCLE", "Grade 3 Science  •  Ontario", [5, 7, 8], "Fall Science", "life cycle, plant parts, pumpkin investigation"),
 ("Halloween-Mystery-Pictures-Mult-Div-Grade-4-Ontario", "hw", "HALLOWEEN MULTIPLICATION MYSTERY PICTURES", "Grade 4  •  Ontario Math", [10, 3, 8], "Halloween Math", "multiplication and division facts"),
 ("Spooky-Science-Physical-Chemical-Changes-Grade-5-Ontario", "hw", "PHYSICAL & CHEMICAL CHANGES", "Grade 5 Halloween Science", [5, 6, 7], "Fall Science", "card sort, Witch's Brew lab"),
 ("Halloween-Narrative-Writing-Grades-4-6-Ontario", "hw", "HALLOWEEN NARRATIVE WRITING", "Grades 4-6  •  Ontario Language", [3, 5, 9], "Halloween Writing", "mentor text, story mountain, rubric"),
 ("Halloween-Escape-Room-Integers-Grades-7-8-Ontario", "hw", "HALLOWEEN ESCAPE ROOM", "Grades 7-8 Integers  •  Ontario", [4, 13, 9], "Middle School Math", "integer operations, self-checking"),
 ("Remembrance-Day-K-1-Ontario", "rd", "REMEMBRANCE DAY FOR LITTLE LEARNERS", "Kindergarten & Grade 1", [4, 3, 6], "Remembrance Day", "gentle, peace-focused activities"),
 ("Remembrance-Day-Grades-2-3-Ontario", "rd", "WHY WE REMEMBER", "Remembrance Day  •  Grades 2-3", [3, 7, 8], "Remembrance Day", "reading passage, vocabulary, writing"),
 ("Remembrance-Day-Grades-4-6-Ontario", "rd", "IN FLANDERS FIELDS POEM ANALYSIS", "Remembrance Day  •  Grades 4-6", [4, 5, 6], "Remembrance Day", "John McCrae, Indigenous veterans"),
 ("Remembrance-Day-Grades-7-8-Ontario", "rd", "VIMY RIDGE & IN FLANDERS FIELDS", "Remembrance Day  •  Grades 7-8", [3, 6, 7], "Remembrance Day", "history, primary source, opinion writing"),
 ("Winter-Math-Literacy-Kindergarten-Ontario", "wi", "WINTER MATH & LITERACY", "Kindergarten  •  Ontario", [7, 3, 10], "Winter Kindergarten", "counting, patterns, beginning sounds"),
 ("Winter-Mystery-Pictures-Grades-1-2-Ontario", "wi", "WINTER MYSTERY PICTURES", "Grades 1-2 Addition & Subtraction", [8, 3, 7], "Winter Math", "colour by number, facts to 20"),
 ("Winter-Science-Grades-1-2-Ontario", "wi", "WINTER SCIENCE", "Grades 1-2  •  Ontario Science", [8, 5, 6], "Winter Science", "seasons, states of water, ice experiment"),
 ("Winter-Mystery-Pictures-Grades-3-4-Ontario", "wi", "WINTER MULTIPLICATION MYSTERY PICTURES", "Grades 3-4  •  Ontario Math", [9, 3, 7], "Winter Math", "multiplication and division facts"),
 ("Winter-Reading-Comprehension-Grades-4-6-Ontario", "wi", "WINTER READING PASSAGES", "Grades 4-6  •  Science & Celebrations", [3, 7, 9], "Winter Reading", "solstice, snowflakes, celebrations in Canada"),
 ("Winter-Escape-Room-Grades-7-8-Ontario", "wi", "WINTER BREAK ESCAPE ROOM", "Grades 7-8 Math  •  Ontario", [4, 11, 9], "Middle School Math", "integers, ratios, percents, rates"),
]
FREE = [("FREE-Halloween-Kindergarten-Sampler", "hw", "FREE HALLOWEEN ACTIVITIES", "Kindergarten", [2, 3], "Halloween Kindergarten"),
        ("FREE-Halloween-Mystery-Picture-Sampler", "hw", "FREE HALLOWEEN MYSTERY PICTURES", "Grades 1 & 4", [4, 3], "Halloween Math"),
        ("FREE-Halloween-Escape-Room-Sampler", "hw", "FREE ESCAPE ROOM SAMPLER", "Grades 7-8 Integers", [3, 2], "Middle School Math"),
        ("FREE-Winter-Mystery-Picture-Sampler", "wi", "FREE WINTER MYSTERY PICTURES", "Grades 1-4", [4, 3], "Winter Math")]
BUNDLES = [("bundle/thumb1-bundle-cover.png", "hw", "ONTARIO HALLOWEEN BUNDLE K-8", "8 Resources  •  Save 25%+", "Halloween Math", "Ontario-Halloween-Bundle"),
           ("Remembrance-Day-BUNDLE/thumb1-bundle-cover.png", "rd", "REMEMBRANCE DAY BUNDLE K-8", "4 Resources  •  Save 23%", "Remembrance Day", "Remembrance-Day-Bundle"),
           ("Winter-BUNDLE/thumb1-bundle-cover.png", "wi", "ONTARIO WINTER BUNDLE K-8", "6 Resources  •  Save 22%", "Winter Math", "Winter-Bundle")]
TMP = tempfile.mkdtemp()


def page(slug, n):
    p = f"{TMP}/{slug}-{n}"
    subprocess.run(["pdftoppm", "-r", "90", "-png", "-f", str(n), "-l", str(n), f"{OUT}/{slug}.pdf", p], check=True)
    return Image.open(glob.glob(p + "*.png")[0]).convert("RGB")


def card(img, h, angle=0):
    im = img.resize((int(img.width * h / img.height), h)); sh = Image.new("RGBA", (im.width + 40, im.height + 40), (0, 0, 0, 0))
    ImageDraw.Draw(sh).rectangle([20, 26, im.width + 20, im.height + 26], fill=(0, 0, 0, 120)); sh = sh.filter(ImageFilter.GaussianBlur(10)); sh.paste(im, (20, 20))
    return sh.rotate(angle, expand=True, resample=Image.BICUBIC) if angle else sh


def wrap(d, text, font, maxw):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if d.textlength(t, font=font) <= maxw: cur = t
        else: lines.append(cur); cur = w
    return lines + [cur]


def frame(season, headline, sub, free=False):
    dark, prim, acc = SEASON[season]
    im = Image.new("RGB", (1000, 1500), prim); d = ImageDraw.Draw(im)
    for y in range(0, 1500, 110): d.rectangle([0, y, 1000, y + 55], fill=tuple(min(255, int(c * 1.1)) for c in prim))
    if free:
        d.rounded_rectangle([340, 22, 660, 92], radius=35, fill=acc); d.text((500, 57), "FREE", font=anton(52), fill=dark, anchor="mm")
    f = anton(108); lines = wrap(d, headline, f, 900)
    while len(lines) > 3 or max(d.textlength(l, font=f) for l in lines) > 920:
        f = anton(f.size - 6); lines = wrap(d, headline, f, 900)
    top = 110 if free else 60; lh = f.size * 1.05; hh = top + lh * len(lines) + 90
    d.rectangle([0, 0, 1000, hh], fill=dark)
    if free:
        d.rounded_rectangle([340, 22, 660, 92], radius=35, fill=acc); d.text((500, 57), "FREE", font=anton(52), fill=dark, anchor="mm")
    for i, l in enumerate(lines): d.text((500, top + i * lh + lh / 2), l, font=f, fill="white", anchor="mm")
    d.text((500, top + lh * len(lines) + 40), sub, font=bold(44), fill=acc, anchor="mm")
    d.rectangle([0, hh, 1000, hh + 10], fill=acc)
    d.rectangle([0, 1340, 1000, 1500], fill=dark)
    star = Image.open(STAR).resize((110, 110)); im.paste(star, (60, 1365))
    d.text((195, 1395), "North Star Resources", font=bold(48), fill="white", anchor="lm")
    d.text((195, 1455), "Ontario curriculum  •  No prep  •  Answer keys", font=bold(32), fill=acc, anchor="lm")
    return im, d, int(hh + 10)


def pin_a(slug, season, headline, sub, pages, free=False):
    im, d, top = frame(season, headline, sub, free)
    cover = page(slug, 1); inner = page(slug, pages[0])
    avail = 1340 - top - 40; h = int(min(avail, 900))
    h = int(h * .9)
    c2 = card(inner, int(h * .9), -5); im.paste(c2, (1000 - c2.width - 10, top + 70), c2)
    c1 = card(cover, int(h * .9), 4); im.paste(c1, (10, top + 20), c1)
    return im


def pin_b(slug, season, headline, sub, pages, bullets):
    im, d, top = frame(season, "WHAT'S INSIDE: " + headline, sub)
    imgs = [page(slug, n) for n in pages[:3]]; h = 500
    for i, (img, (x, ang)) in enumerate(zip(imgs, [(0, 5), (290, 0), (560, -5)])):
        c = card(img, h, ang); im.paste(c, (x, top + 30 + (0 if i == 1 else 40)), c)
    y = top + h + 130
    for t in bullets:
        tw = d.textlength(t, font=bold(46)); x0 = 500 - tw / 2 + 30
        d.line([(x0 - 70, y), (x0 - 52, y + 20), (x0 - 20, y - 22)], fill=SEASON[season][2], width=12)
        d.text((x0, y), t, font=bold(46), fill="white", anchor="lm"); y += 72
    return im


def bundle_pin(path, season, headline, sub):
    im, d, top = frame(season, headline, sub)
    b = Image.open(os.path.join(OUT, path)).convert("RGB"); s = min(1340 - top - 40, 900)
    c = card(b.crop((0, 300, 1600, 1440)).resize((s, int(s * 1140 / 1600))), int(s * 1140 / 1600)); im.paste(c, ((1000 - c.width) // 2, top + 30), c)
    y = top + 30 + c.height + 40
    for t in ["One resource for every grade", "No prep  \u2022  Answer keys", "Ontario curriculum aligned"]:
        tw = d.textlength(t, font=bold(46)); x0 = 500 - tw / 2 + 30
        d.line([(x0 - 70, y), (x0 - 52, y + 20), (x0 - 20, y - 22)], fill=SEASON[season][2], width=12)
        d.text((x0, y), t, font=bold(46), fill="white", anchor="lm"); y += 72
    return im


if __name__ == "__main__":
    os.makedirs(PO, exist_ok=True); txt = []
    for slug, season, head, sub, pages, board, kw in P:
        pin_a(slug, season, head, sub, pages).save(f"{PO}/{slug}-pinA.png")
        pin_b(slug, season, head, sub, pages, ["No prep: print & go", "Answer keys included", "Ontario curriculum aligned"]).save(f"{PO}/{slug}-pinB.png")
        title = f"{head.title()} | {sub.replace(chr(0x2022), '|')}"
        for k in "AB":
            txt.append(f"--- {slug}-pin{k}.png ---\nBOARD: {board}\nTITLE: {title}\nLINK: [paste this product's TPT link]\n"
                       f"DESCRIPTION: No-prep {head.lower()} for {sub.split(chr(0x2022))[0].strip()}: {kw}. Aligned to the Ontario curriculum, "
                       f"with answer keys and Canadian spelling. Print and go! #ontarioteachers #canadianteachers #teacherspayteachers\n")
    for slug, season, head, sub, pages, board in FREE:
        pin_a(slug, season, head, sub, pages, free=True).save(f"{PO}/{slug}-pin.png")
        txt.append(f"--- {slug}-pin.png ---\nBOARD: {board}\nTITLE: {head.title()} | {sub}\nLINK: [paste this freebie's TPT link]\n"
                   f"DESCRIPTION: A free, no-prep sample for {sub}, aligned to the Ontario curriculum with an answer key. Download it free "
                   f"on TPT! #freebie #ontarioteachers #teacherspayteachers\n")
    for path, season, head, sub, board, name in BUNDLES:
        bundle_pin(path, season, head, sub).save(f"{PO}/{name}-pin.png")
        txt.append(f"--- {name}-pin.png ---\nBOARD: {board}\nTITLE: {head.title()} | {sub}\nLINK: [paste the bundle's TPT link]\n"
                   f"DESCRIPTION: {head.title()}: a no-prep resource for every grade, aligned to the Ontario curriculum, with answer "
                   f"keys. {sub}! #ontarioteachers #canadianteachers #teacherspayteachers\n")
    open(f"{PO}/PINS-copy-paste.txt", "w").write("\n".join(txt))
    print(len(glob.glob(f"{PO}/*.png")), "pins")
