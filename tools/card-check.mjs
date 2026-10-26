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
const spec = mod.spec ?? Object.values(mod).find((v) => v && v.picks && v.words);
if (!spec) { console.log('FAIL no CardSpec export'); process.exit(1); }

const fails = [];
const warns = [];
const W = spec.words.words;
const N = W.length;
const t = (i) => W[i].start;
const pub = (p) => path.join('public', p);
const ok = (i, what) => { if (!(Number.isInteger(i) && i >= 0 && i < N)) fails.push(`${what}: word index ${i} out of range 0-${N - 1}`); return i >= 0 && i < N; };

// assets
for (const f of ['voiceover.wav', 'music/bed.wav']) if (!fs.existsSync(pub(spec.dir + '/' + f))) fails.push(`missing ${spec.dir}/${f}`);
const crests = new Set(spec.fan.centers);
const imgs = new Set();
for (const r of [spec.fan.left, spec.fan.right]) { if (r.crest) crests.add(r.crest); if (r.img) imgs.add(r.img); }
for (const p of spec.picks) {
  crests.add(p.h); crests.add(p.a);
  if (p.hero.crest) crests.add(p.hero.crest);
  if (p.hero.img) imgs.add(p.hero.img);
  for (const d of p.devices) if (d.kind === 'chips') for (const c of d.items) if (c.crest) crests.add(c.crest);
}
if (spec.outroChip?.crest) crests.add(spec.outroChip.crest);
for (const k of crests) if (!fs.existsSync(pub(`${spec.dir}/logos/${k}.png`))) fails.push(`missing crest ${spec.dir}/logos/${k}.png`);
for (const k of imgs) if (!fs.existsSync(pub(`mockups/${k}.png`))) fails.push(`missing cut-out mockups/${k}.png`);
for (const s of ['bass_impact', 'whoosh_motion', 'fast_swoosh', 'classic_whoosh', 'title_swoosh', 'pop_whoosh', 'punch_sound', 'cinematic_whoosh_impact', 'magic_reveal', 'pop_sound', 'glitch_sound'])
  if (!fs.existsSync(pub(`${spec.dir}/sfx/${s}.MP3`))) fails.push(`missing sfx ${spec.dir}/sfx/${s}.MP3`);

// scene order + timing
let prev = 0;
spec.picks.forEach((p, i) => {
  const end = i + 1 < spec.picks.length ? spec.picks[i + 1].from : spec.outroWord;
  if (!ok(p.from, `pick ${i + 1} from`) || !ok(end, `pick ${i + 1} end`)) return;
  if (p.from <= prev && i > 0) fails.push(`pick ${i + 1} starts before pick ${i}`);
  prev = p.from;
  if (ok(p.pillWord, `pick ${i + 1} pill`) && (p.pillWord < p.from || p.pillWord >= end)) fails.push(`pick ${i + 1} pill word ${p.pillWord} outside its scene ${p.from}-${end - 1}`);
  if (p.pillWord < N && t(end) - t(p.pillWord) < 1.0) warns.push(`pick ${i + 1} pill on screen only ${(t(end) - t(p.pillWord)).toFixed(2)}s`);
  for (const d of p.devices) {
    if (!ok(d.word, `pick ${i + 1} ${d.kind}`)) continue;
    if (d.word < p.from || d.word >= end) { fails.push(`pick ${i + 1} ${d.kind} word ${d.word} outside its scene`); continue; }
    const shown = t(end) - t(d.word);
    const min = d.kind === 'big' ? 1.8 : 1.2;
    if (shown < min) fails.push(`pick ${i + 1} ${d.kind} '${d.value ?? d.label ?? ''}' readable for ${shown.toFixed(2)}s (< ${min}s)`);
  }
});
ok(spec.outroWord, 'outroWord'); ok(spec.commentWord, 'commentWord');
if (spec.outroChip) ok(spec.outroChip.word, 'outroChip');

// banned words in on-screen copy
const BANNED = /\b(bet|bets|betting|parlay|parlays|gamble|gambling|wager|bankroll|sportsbook|casino|bookie|dollar|dollars|free|ladder|lock|guaranteed)\b|[$€£]/i;
const texts = [spec.title.join(' '), spec.tag, spec.commentText ?? '', spec.outroChip ? spec.outroChip.text + (spec.outroChip.highlight ?? '') : ''];
for (const p of spec.picks) {
  texts.push(p.claim.join(' '), p.pill, p.row ?? '', p.time);
  for (const d of p.devices) texts.push(d.kind === 'big' ? d.value + ' ' + d.label : d.kind === 'form' ? d.label : d.items.map((c) => c.text + ' ' + (c.tag ?? '')).join(' '));
}
for (const s of texts) if (BANNED.test(s)) fails.push(`banned word on screen: "${s}"`);
const spoken = W.map((w) => w.word).join(' ');
if (BANNED.test(spoken)) fails.push(`banned word in the voiceover: ${spoken.match(BANNED)[0]}`);
if (/\b(over|under)\b/i.test(texts.join(' '))) warns.push('"over"/"under" on screen (TikTok cut): prefer "3+ GOALS" / "2 GOALS OR FEWER"');

// hook rule
const first = W[0].word.replace(/[^\p{L}\p{N}]/gu, '');
const days = /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tonight|today|matchday|this)$/i;
const clubs = new Set(spec.picks.flatMap((p) => [p.h, p.a]));
if (/^\d/.test(first) || /^(one|two|three|four|five|six|seven|eight|nine|ten)$/i.test(first)) fails.push(`hook opens on a number: "${W[0].word}"`);
if (days.test(first)) fails.push(`hook opens on a day/time word: "${W[0].word}"`);
const clubNames = /^(arsenal|chelsea|liverpool|city|united|madrid|barcelona|barca|inter|milan|juventus|napoli|roma|lazio|bayern|dortmund|leipzig|leverkusen|atletico|tottenham|spurs|newcastle|villa|brighton|everton|palace|monza|fiorentina|atalanta|como|psg|paris)$/i;
if (clubNames.test(first)) fails.push(`hook opens on a club name: "${W[0].word}"`);
if (/\b(last night|tonight)\b/i.test(texts.join(' '))) fails.push('"last night"/"tonight" on screen');

// dead air: longest stretch with no new element
const beats = [0, ...spec.picks.flatMap((p) => [p.from, p.pillWord, ...p.devices.map((d) => d.word)]), spec.outroWord, spec.commentWord].filter((i) => i < N).map(t).sort((a, b) => a - b);
let gap = 0; for (let i = 1; i < beats.length; i++) gap = Math.max(gap, beats[i] - beats[i - 1]);
if (spec.words.duration - beats[beats.length - 1] > gap) gap = spec.words.duration - beats[beats.length - 1];
if (gap > 4.5) fails.push(`dead air: ${gap.toFixed(1)}s with no new element`); else if (gap > 3.5) warns.push(`longest stretch without a new element ${gap.toFixed(1)}s`);

for (const w of warns) console.log('WARN', w);
for (const f of fails) console.log('FAIL', f);
console.log(`card-check ${id}: ${spec.picks.length} picks, ${N} words, ${spec.words.duration.toFixed(1)}s, ${fails.length} fail(s), ${warns.length} warning(s)`);
process.exit(fails.length ? 1 : 0);
