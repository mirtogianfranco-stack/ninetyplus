// Timeline overlap check for a PicksEdit. Run before every owner review:
//   npx esbuild src/edits/video008.ts --bundle --platform=node --format=cjs --outfile=out/edit.cjs --loader:.json=json && node tools/overlap-check.mjs out/edit.cjs video008
// Lists every big on-screen element with its time span and FAILS on: two big elements overlapping, a card sitting on a face shot,
// a face shot with no card while the owner reads down (not checkable here), or a pop-up whose file is missing.
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const [, , file, name] = process.argv;
const e = require('./../' + file)[name];
const w = (i) => (i >= e.words.length ? e.endSec : e.words[i].start);
const spans = [];
const problems0 = [];
const add = (kind, label, a, b) => spans.push({ kind, label, a: +a.toFixed(2), b: +b.toFixed(2) });
if (e.hook?.style === 'imessage' || e.hook?.style === 'text' || e.hook?.style === 'lineup') add('hook', 'hook ' + e.hook.style, e.hook.lineup ? w(e.hook.lineup.word) : 0, w(e.hook.endWord) + 0.3);
if (e.lineupHero) add('card', 'lineup hero', w(e.lineupHero.word), w(e.lineupHero.untilWord));
if (e.hook?.slip) add('card', 'hook.slip', w(e.hook.slip.fromWord), w(e.hook.slip.untilWord));
if (e.hook?.money) add('card', 'hook.money', w(e.hook.money.word), w(e.hook.money.untilWord));
for (const L of Array.isArray(e.ladder) ? e.ladder : e.ladder ? [e.ladder] : []) add('card', 'ladder "' + L.title + '"', w(L.word), w(L.untilWord));
if (e.table) add('card', 'table "' + e.table.title + '"', w(e.table.word), w(e.table.untilWord));
if (e.tally) add('card', 'tally', w(e.tally.word), w(e.tally.untilWord));
if (e.sponsor) add('card', 'sponsor block', w(e.sponsor.word), w(e.sponsor.untilWord));
if (e.chartFit) add('card', 'chart fit', w(e.chartFit.word), w(e.chartFit.untilWord));
if (e.heroCutout) add('card', 'hero cutout', w(e.heroCutout.word), w(e.heroCutout.untilWord));
if (e.sponsorDuo) add('card', 'sponsor duo', w(e.sponsorDuo.word), w(e.sponsorDuo.untilWord));
if (e.slipFan) add('hook', 'slip fan', w(e.slipFan.word), w(e.slipFan.untilWord));
// text stamps live in the lower-middle band (like memes): checked against each other and lower memes only, see the guard below
if (e.matchMath) add('card', 'match math', w(e.matchMath.word), w(e.matchMath.untilWord));
for (const cw of e.collab?.windows ?? []) add('card', 'collab window', cw.at, cw.at + cw.dur);
if (e.stamp) add('card', 'stamp "' + e.stamp.text + '"', w(e.stamp.word), e.endSec);
for (const n of e.news ?? []) add('news', 'news ' + n.outlet, w(n.word), w(n.word) + n.dur);   // stacked receipt cards may overlap each other by design
for (const sp of e.split ?? []) add('card', 'split ' + sp.before.value + ' -> ' + sp.after.value, w(sp.word), w(sp.untilWord));
for (const k of e.strike ?? []) add('card', 'strike ' + k.title, w(k.word), w(k.word) + k.dur);

// Video-022 guardrail: logo/emoji pops (memes with a visible size) must not overlap each other in time AND space.
{
  const vis = (e.memes ?? []).filter((m) => (m.size ?? 0) > 1 && m.x !== undefined && m.y !== undefined).map((m) => ({ m, a: w(m.word), b: w(m.word) + (m.dur ?? 1), x0: m.x, y0: m.y, x1: m.x + m.size, y1: m.y + m.size }));
  for (let i = 0; i < vis.length; i++) for (let j = i + 1; j < vis.length; j++) {
    const A = vis[i], B = vis[j];
    const t = Math.min(A.b, B.b) - Math.max(A.a, B.a);
    const sx = Math.min(A.x1, B.x1) - Math.max(A.x0, B.x0), sy = Math.min(A.y1, B.y1) - Math.max(A.y0, B.y0);
    if (t > 0.05 && sx > 20 && sy > 20) problems0.push('MEME OVERLAP ' + t.toFixed(2) + 's: ' + A.m.image + ' @' + A.a.toFixed(2) + ' vs ' + B.m.image + ' @' + B.a.toFixed(2));
  }
}

{
  const st = (e.stamps ?? []).map((t) => ({ t, a: w(t.word), b: w(t.word) + t.dur }));
  for (let i = 0; i < st.length; i++) for (let j = i + 1; j < st.length; j++) { const o = Math.min(st[i].b, st[j].b) - Math.max(st[i].a, st[j].a); if (o > 0.05) problems0.push('STAMP OVERLAP ' + o.toFixed(2) + 's: "' + st[i].t.text + '" vs "' + st[j].t.text + '"'); }
  const centre = [];
  for (const leg of e.legs) if (leg.anchor >= 0 && !leg.noReveal) centre.push({ label: 'reveal ' + leg.label, a: w(leg.anchor), b: w(leg.anchor) + (leg.revealDur ?? 2.4) });
  for (const p of e.popups) if (p.y !== 'top') centre.push({ label: 'popup ' + p.src, a: w(p.word), b: w(p.word) + p.dur });
  for (const S of st) for (const c of centre) { const o = Math.min(S.b, c.b) - Math.max(S.a, c.a); if (o > 0.05) problems0.push('STAMP ON CARD ' + o.toFixed(2) + 's: "' + S.t.text + '" vs ' + c.label); }
  {
    const shots = [...(e.shots ?? [])].sort((x, y) => x.word - y.word);
    for (let i = 0; i < shots.length; i++) if (shots[i].shot === 'face') { const a = w(shots[i].word) + (shots[i].offset ?? 0); const b = i + 1 < shots.length ? w(shots[i + 1].word) + (shots[i + 1].offset ?? 0) : e.endSec; for (const S of st) { const o = Math.min(S.b, b) - Math.max(S.a, a); if (o > 0.05) problems0.push('STAMP ON FACE ' + o.toFixed(2) + 's: "' + S.t.text + '"'); } }
  }
  const vis = (e.memes ?? []).filter((m) => (m.size ?? 0) > 1 && m.y !== undefined && m.y > 1000);
  for (const S of st) for (const m of vis) { const a = w(m.word), b = a + (m.dur ?? 1); const o = Math.min(S.b, b) - Math.max(S.a, a); if (o > 0.05) problems0.push('STAMP/MEME OVERLAP ' + o.toFixed(2) + 's: "' + S.t.text + '" vs ' + m.image); }
}
// Owner, 2026-09-22 (Video-039): team logos landed behind the reveal cards. A meme must never sit under a card.
// Reveal, stat and news cards occupy known bands; popups carry their own box. Time overlap + box overlap = FAIL.
{
  const boxes = [];
  for (const leg of e.legs) if (leg.anchor >= 0 && !leg.noReveal) boxes.push({ label: 'reveal ' + leg.label, a: w(leg.anchor), b: w(leg.anchor) + (leg.revealDur ?? 2.4), x0: 120, x1: 960, y0: 600, y1: 1040 });
  for (const leg of e.legs) for (const st of (leg.stats ?? (leg.stat ? [leg.stat] : []))) boxes.push({ label: 'stat "' + st.value + '"', a: w(st.word), b: w(st.word) + (st.dur ?? 1.8), x0: 120, x1: 960, y0: 280, y1: 560 });
  for (const n of e.news ?? []) boxes.push({ label: 'news ' + n.outlet, a: w(n.word), b: w(n.word) + n.dur, x0: 90, x1: 800, y0: n.top ?? 300, y1: (n.top ?? 300) + 300 });
  for (const p of e.popups ?? []) { const x0 = p.x ?? (1080 - p.w) / 2, y0 = p.y === 'top' ? 300 : 840 - p.h / 2; boxes.push({ label: 'popup ' + p.src, a: w(p.word), b: w(p.word) + p.dur, x0, x1: x0 + p.w, y0, y1: y0 + p.h }); }
  // face rows count too: a logo under a stack of headshots is just as covered as one under a card (Video-039)
  for (const fr of e.faceRows ?? []) {
    const size = fr.size ?? 260, step = size * 0.68, total = size + step * (fr.items.length - 1), x0 = Math.max(200, 600 - total / 2), y0 = fr.y ?? 1080;
    boxes.push({ label: 'face row (' + fr.items.length + ')', a: w(fr.items[0].word), b: w(fr.untilWord), x0, x1: x0 + total, y0, y1: y0 + size });
  }
  const vis = (e.memes ?? []).filter((m) => (m.size ?? 0) > 1 && m.x !== undefined && m.y !== undefined);
  for (const m of vis) {
    const a = w(m.word), b = a + (m.dur ?? 1), mx1 = m.x + (m.w ?? m.size), my1 = m.y + m.size;
    for (const c of boxes) {
      const t = Math.min(b, c.b) - Math.max(a, c.a);
      const sx = Math.min(mx1, c.x1) - Math.max(m.x, c.x0), sy = Math.min(my1, c.y1) - Math.max(m.y, c.y0);
      if (t > 0.05 && sx > 20 && sy > 20) problems0.push('MEME UNDER CARD ' + t.toFixed(2) + 's: ' + m.image + ' @' + a.toFixed(2) + ' vs ' + c.label);
    }
  }
}
for (const im of [e.stamp?.image].filter(Boolean)) if (!fs.existsSync('public/' + im)) problems0.push('MISSING public/' + im);
for (const p of e.popups) spans.push({ kind: 'card', label: 'popup ' + p.src, a: +w(p.word).toFixed(2), b: +(w(p.word) + p.dur).toFixed(2), x0: p.x ?? (1080 - p.w) / 2, x1: (p.x ?? (1080 - p.w) / 2) + p.w });
for (const leg of e.legs) for (const st of [...(leg.stats ?? []), ...(leg.stat ? [leg.stat] : [])]) add('stat', 'stat "' + st.value + '"', w(st.word), w(st.word) + (st.dur ?? 2.4));
for (const leg of e.legs) if (leg.anchor >= 0 && !leg.noReveal) add('card', 'reveal ' + leg.label, w(leg.anchor), w(leg.anchor) + (leg.revealDur ?? 2.4));
// face shots
const shots = e.shots.map((s, i) => ({ ...s, t: Math.max(0, w(s.word) + (s.offset ?? 0)), end: i + 1 < e.shots.length ? Math.max(0, w(e.shots[i + 1].word) + (e.shots[i + 1].offset ?? 0)) : e.endSec }));
for (const s of shots) if (s.shot === 'face') add('face', 'FACE', s.t, s.end);
spans.sort((x, y) => x.a - y.a);
console.log('Element timeline (' + name + ', ' + e.endSec + 's):');
for (const s of spans) console.log('  ' + s.a.toFixed(2).padStart(6) + ' - ' + s.b.toFixed(2).padStart(6) + '  ' + s.kind.padEnd(5) + ' ' + s.label);
const big = spans.filter((s) => s.kind !== 'face');
const problems = [...problems0];
for (let i = 0; i < big.length; i++) for (let j = i + 1; j < big.length; j++) {
  const A = big[i], B = big[j]; const ov = Math.min(A.b, B.b) - Math.max(A.a, B.a);
  const sideBySide = A.x0 !== undefined && B.x0 !== undefined && (A.x1 <= B.x0 || B.x1 <= A.x0); // two popups placed left/right of each other (Sauce + Quinnen) are not stacked
  if (ov > 0.05 && !(A.kind === B.kind && (A.kind === 'stat' || A.kind === 'news')) && !sideBySide) problems.push('OVERLAP ' + ov.toFixed(2) + 's: ' + A.label + ' (' + A.a + '-' + A.b + ') vs ' + B.label + ' (' + B.a + '-' + B.b + ')');
}
for (const F of spans.filter((s) => s.kind === 'face')) for (const C of big) { const ov = Math.min(F.b, C.b) - Math.max(F.a, C.a); if (ov > 0.05) problems.push('ON FACE ' + ov.toFixed(2) + 's: ' + C.label + ' over the face shot ' + F.a + '-' + F.b); }
for (const p of e.popups) { const f = 'public/' + e.assetsBase + '/popups/' + p.src; if (!fs.existsSync(f)) problems.push('MISSING ' + f); }
for (const m of e.memes ?? []) if (!fs.existsSync('public/' + m.image)) problems.push('MISSING public/' + m.image);
for (const L of Array.isArray(e.ladder) ? e.ladder : e.ladder ? [e.ladder] : []) for (const it of L.items) if (!fs.existsSync('public/' + it.image)) problems.push('MISSING public/' + it.image);
if (problems.length) { console.log('\nPROBLEMS:'); for (const p of problems) console.log('  ' + p); process.exit(1); }
console.log('\nOK: no overlaps, nothing on a face shot, all files present.');
