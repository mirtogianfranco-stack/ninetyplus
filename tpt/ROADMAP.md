# TPT catalog roadmap (K-8, all subjects)

Strategy: build **series**, not one-offs. Each series uses one format, so every new product is mostly content,
buyers who like one buy the next, and 4+ related products become a discounted **bundle** (bundles are where the
volume is). Seasonal products need to be listed **4-6 weeks early**.

## Done (batch 1)

| # | Product | Grades | Subject | Series |
|---|---|---|---|---|
| 1 | Soccer Stats Math | 5-6 | Math | Sports Math |
| 2 | Multiplication Fact Fluency 0-12 | 3-4 | Math | Fact Fluency |
| 3 | Ten Frames Number Sense 0-20 | K-1 | Math | Number Sense |
| 4 | Sight Words: Dolch Pre-Primer | PreK-1 | ELA | Sight Words |
| 5 | November Reading Comprehension | 3-5 | ELA | Monthly Reading Passages |
| 6 | Integer Operations Task Cards | 6-7 | Math | Task Cards |

## Next, in priority order

**Seasonal, list now (Nov-Jan sales window)**
1. December Reading Comprehension 3-5 (holidays around the world, hibernation, the winter solstice)
2. January Reading Comprehension 3-5 (MLK Jr., New Year traditions, snowflakes)
3. Winter Math Mystery Picture / Color by Code for grades 1-2 (addition and subtraction within 20)
4. Thanksgiving and Winter Writing Prompts for grades 2-5 (opinion, narrative and informative, with rubrics)

**Finish series (each one turns into a bundle)**
5. Sight Words: Primer (52), First Grade (41), Second Grade (46) -> **Dolch Sight Words Bundle**
6. Fact Fluency: Addition 0-10 (gr 1), Subtraction (gr 1-2), Division 0-12 (gr 3-4) -> **Fact Fluency Bundle**
7. Task Cards: Fractions (gr 4-5), Ratios (gr 6), Solving Equations (gr 7-8), Exponents (gr 8)
8. Monthly Reading Passages Sept-June for grades 3-5 -> **Year-Long Reading Bundle**; then a grades 1-2 version

**Fill subject gaps**
9. Science: Weather and Water Cycle (gr 2-4), Ecosystems (gr 5-6), Cells (gr 6-8). Reading + diagram labeling + vocab cards
10. Social Studies: Map Skills (gr 2-3), Branches of Government (gr 4-5), U.S. Regions (gr 4-5)
11. Grammar Task Cards: Parts of Speech (gr 2-4), Commas (gr 4-6)
12. CVC Words and Phonics: short vowels (K-1)

## Pricing rules of thumb
- 10-20 pages: $3-4; 30-50 pages: $4-6; bundles: about 20-30% off the sum of the products
- Make one small product **free** in each series. It's the biggest driver of followers and store traffic.

## Making a new product
Copy the closest file in `products/`, change the content and `LISTING`, then run `python3 products/<file>.py`.
Output goes to `out/<slug>.pdf` plus `out/<slug>_listing/` (preview PDF, 4 thumbnails, listing.md).
Set the store name once in `kit/__init__.py` (`STORE`).
