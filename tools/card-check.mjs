// Gate for template card videos (src/cards/npNNN.ts -> CardSpec). Usage: node tools/card-check.mjs out/card.cjs npNNN
// Fails on: word index out of range or out of order, missing assets, banned words in any on-screen text,
// a hook that opens on a number / club / day, a stat shown for less than its readable minimum before the scene ends,
// a pill outside its own scene, an SFX file used more than twice.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const [bundle, id] = process.argv.slice(2);
const mod = require(path.resolve(bundle));
const spec = mod.spec ?? Object.values(mod).find((v) => v && v.words);
if (!spec) { console.log('FAIL no CardSpec export'); process.exit(1); }

const fails = [];
const warns = [];
const W = spec.words.words;
const N = W.length;
const t = (i) => W[i].start;
const pub = (p) => path.join('public', p);
const ok = (i, what) => { if (!(Number.isInteger(i) && i >= 0 && i < N)) { fails.push(`${what}: word index ${i} out of range 0-${N - 1}`); return false; } return true; };
const kind = spec.kind ?? 'card';
const crests = new Set();
const imgs = new Set();
const texts = [];
const beatsIdx = [0];
const BIG_MIN = 1.8, OTHER_MIN = 1.2;
const devCheck = (devs, from, end, where) => {
  for (const d of devs) {
    if (!ok(d.word, `${where} ${d.kind}`)) continue;
    beatsIdx.push(d.word);
    if (d.word < from || d.word >= end) { fails.push(`${where} ${d.kind} word ${d.word} outside its scene ${from}-${end - 1}`); continue; }
    const shown = t(end) - t(d.word);
    const min = d.kind === 'big' ? BIG_MIN : OTHER_MIN;
    if (shown < min) fails.push(`${where} ${d.kind} '${d.value ?? d.label ?? ''}' readable for ${shown.toFixed(2)}s (< ${min}s)`);
    texts.push(d.kind === 'big' ? d.value + ' ' + d.label : d.kind === 'form' ? (d.label ?? '') : d.items.map((c) => c.text + ' ' + (c.tag ?? '')).join(' '));
    if (d.kind === 'chips') for (const c of d.items) if (c.crest) crests.add(c.crest);
  }
};

if (kind === 'card') {
  spec.fan.centers.forEach((k) => crests.add(k));
  for (const r of [spec.fan.left, spec.fan.right]) { if (r.crest) crests.add(r.crest); if (r.img) imgs.add(r.img); }
  if (spec.outroChip?.crest) crests.add(spec.outroChip.crest);
  texts.push(spec.title.join(' '), spec.tag, spec.commentText ?? '', spec.outroChip ? spec.outroChip.text + (spec.outroChip.highlight ?? '') : '');
  let prev = -1;
  spec.picks.forEach((p, i) => {
    crests.add(p.h); crests.add(p.a);
    if (p.hero.crest) crests.add(p.hero.crest);
    if (p.hero.img) imgs.add(p.hero.img);
    texts.push(p.claim.join(' '), p.pill, p.row ?? '', p.time);
    const end = i + 1 < spec.picks.length ? spec.picks[i + 1].from : spec.outroWord;
    if (!ok(p.from, `pick ${i + 1} from`) || !ok(end, `pick ${i + 1} end`)) return;
    if (p.from <= prev) fails.push(`pick ${i + 1} starts before pick ${i}`);
    prev = p.from; beatsIdx.push(p.from, p.pillWord);
    if (ok(p.pillWord, `pick ${i + 1} pill`) && (p.pillWord < p.from || p.pillWord >= end)) fails.push(`pick ${i + 1} pill word ${p.pillWord} outside its scene ${p.from}-${end - 1}`);
    if (p.pillWord < N && t(end) - t(p.pillWord) < 1.0) warns.push(`pick ${i + 1} pill on screen only ${(t(end) - t(p.pillWord)).toFixed(2)}s`);
    devCheck(p.devices, p.from, end, `pick ${i + 1}`);
  });
  ok(spec.outroWord, 'outroWord'); ok(spec.commentWord, 'commentWord'); beatsIdx.push(spec.outroWord, spec.commentWord);
  if (spec.outroChip) ok(spec.outroChip.word, 'outroChip');
} else if (kind === 'spotlight') {
  crests.add(spec.matchup.h); crests.add(spec.matchup.a);
  texts.push(spec.topline, spec.mark.small, spec.mark.big, spec.mark.seal ?? '', spec.badge, spec.matchup.line);
  spec.scenes.forEach((sc, i) => {
    crests.add(sc.crest);
    texts.push(sc.label, sc.claim.join(' '));
    const end = i + 1 < spec.scenes.length ? spec.scenes[i + 1].from : spec.reveal.from;
    if (!ok(sc.from, `scene ${i + 1}`) || !ok(end, `scene ${i + 1} end`)) return;
    beatsIdx.push(sc.from);
    devCheck(sc.devices, sc.from, end, `scene ${i + 1}`);
  });
  ok(spec.reveal.from, 'reveal'); ok(spec.outro.from, 'outro'); beatsIdx.push(spec.reveal.from, spec.outro.from);
  for (const p of spec.reveal.pills) { texts.push(p.text); if (ok(p.word, 'pill') && (p.word < spec.reveal.from || p.word >= spec.outro.from)) fails.push(`pill '${p.text}' outside the reveal`); beatsIdx.push(p.word); }
  if (spec.outro.record) { ok(spec.outro.record.word, 'record'); texts.push(spec.outro.record.label + ' ' + spec.outro.record.value); beatsIdx.push(spec.outro.record.word); }
  for (const b of spec.outro.banners) { ok(b.word, 'banner'); texts.push(b.text + ' ' + (b.highlight ?? '')); beatsIdx.push(b.word); }
} else if (kind === 'results') {
  texts.push(spec.topline, spec.intro.title.join(' '), ...spec.intro.items, spec.outro.line, spec.outro.banner.text, spec.outro.record.label + ' ' + spec.outro.record.value);
  if (spec.intro.items.length !== spec.cards.length) warns.push(`intro lists ${spec.intro.items.length} cards but there are ${spec.cards.length}`);
  spec.cards.forEach((c, i) => {
    texts.push(c.header, c.title.join(' '), c.tag, c.note?.text ?? '');
    const end = i + 1 < spec.cards.length ? spec.cards[i + 1].from : spec.outro.from;
    if (!ok(c.from, `card ${i + 1}`) || !ok(end, `card ${i + 1} end`)) return;
    beatsIdx.push(c.from, c.stamp.word);
    for (const r of c.rows) { crests.add(r.h); crests.add(r.a); texts.push(r.t); if (ok(r.word, `card ${i + 1} row`) && (r.word < c.from || r.word >= end)) fails.push(`card ${i + 1} row '${r.t}' marks outside its scene`); beatsIdx.push(r.word); }
    if (ok(c.stamp.word, `card ${i + 1} stamp`)) { if (c.stamp.word < c.from || c.stamp.word >= end) fails.push(`card ${i + 1} stamp outside its scene`); else if (t(end) - t(c.stamp.word) < 0.6) warns.push(`card ${i + 1} stamp on screen only ${(t(end) - t(c.stamp.word)).toFixed(2)}s`); }
    if (c.goals) { crests.add(c.goals.crest); ok(c.goals.word, 'goals'); beatsIdx.push(c.goals.word); }
    const stampWin = c.stamp.win, rowsWin = c.rows.every((r) => r.win);
    if (stampWin !== rowsWin) fails.push(`card ${i + 1} stamp says ${stampWin ? 'LANDED' : 'BUST'} but rows say ${rowsWin ? 'all won' : 'a leg lost'}`);
  });
  ok(spec.outro.from, 'outro'); ok(spec.outro.record.word, 'record'); ok(spec.outro.banner.word, 'banner');
  beatsIdx.push(spec.outro.from, spec.outro.record.word, spec.outro.banner.word);
} else fails.push(`unknown spec kind '${kind}'`);

// assets
for (const f of ['voiceover.wav', 'music/bed.wav']) if (!fs.existsSync(pub(spec.dir + '/' + f))) fails.push(`missing ${spec.dir}/${f}`);
for (const k of crests) if (!fs.existsSync(pub(`${spec.dir}/logos/${k}.png`))) fails.push(`missing crest ${spec.dir}/logos/${k}.png`);
for (const k of imgs) if (!fs.existsSync(pub(`mockups/${k}.png`))) fails.push(`missing cut-out mockups/${k}.png`);
for (const s of ['bass_impact', 'whoosh_motion', 'fast_swoosh', 'classic_whoosh', 'title_swoosh', 'pop_whoosh', 'punch_sound', 'cinematic_whoosh_impact', 'magic_reveal', 'pop_sound', 'glitch_sound', 'riser_sound_4sec', 'ding_answer_correct', 'wrong_answer'])
  if (!fs.existsSync(pub(`${spec.dir}/sfx/${s}.MP3`))) fails.push(`missing sfx ${spec.dir}/sfx/${s}.MP3`);

// banned words in on-screen copy and in the voiceover
const BANNED = /\b(bet|bets|betting|parlay|parlays|gamble|gambling|wager|bankroll|sportsbook|casino|bookie|dollar|dollars|free|ladder|lock|guaranteed)\b|[$€£]/i;
for (const s of texts) if (s && BANNED.test(s)) fails.push(`banned word on screen: "${s}"`);
const spoken = W.map((w) => w.word).join(' ');
if (BANNED.test(spoken)) fails.push(`banned word in the voiceover: ${spoken.match(BANNED)[0]}`);
if (/\b(over|under)\b/i.test(texts.join(' '))) warns.push('"over"/"under" on screen (TikTok cut): prefer "3+ GOALS" / "2 GOALS OR FEWER"');
if (/\b(last night|tonight)\b/i.test(texts.join(' ') + ' ' + spoken)) fails.push('"last night"/"tonight" in the copy (viewers are in many time zones)');

// hook rule
const first = W[0].word.replace(/[^\p{L}\p{N}]/gu, '');
if (/^\d/.test(first) || /^(one|two|three|four|five|six|seven|eight|nine|ten)$/i.test(first)) fails.push(`hook opens on a number: "${W[0].word}"`);
if (/^(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tonight|today|matchday|this)$/i.test(first)) fails.push(`hook opens on a day/time word: "${W[0].word}"`);
if (/^(arsenal|chelsea|liverpool|city|united|madrid|barcelona|barca|inter|milan|juventus|napoli|roma|lazio|bayern|dortmund|leipzig|leverkusen|atletico|tottenham|spurs|newcastle|villa|brighton|everton|palace|monza|fiorentina|atalanta|como|psg|paris|parma|hoffenheim)$/i.test(first)) fails.push(`hook opens on a club name: "${W[0].word}"`);

// dead air: longest stretch with no new element
const beats = [...new Set(beatsIdx.filter((i) => Number.isInteger(i) && i < N))].map(t).sort((a, b) => a - b);
let gap = 0; for (let i = 1; i < beats.length; i++) gap = Math.max(gap, beats[i] - beats[i - 1]);
gap = Math.max(gap, spec.words.duration - beats[beats.length - 1]);
if (gap > 4.5) fails.push(`dead air: ${gap.toFixed(1)}s with no new element`); else if (gap > 3.5) warns.push(`longest stretch without a new element ${gap.toFixed(1)}s`);

for (const w of warns) console.log('WARN', w);
for (const f of fails) console.log('FAIL', f);
console.log(`card-check ${id} (${kind}): ${N} words, ${spec.words.duration.toFixed(1)}s, ${fails.length} fail(s), ${warns.length} warning(s)`);
process.exit(fails.length ? 1 : 0);
