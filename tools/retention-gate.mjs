// Retention + TikTok gate for a PicksEdit. Run after overlap-check, before EVERY owner review (tools/gate.sh runs both):
//   node tools/retention-gate.mjs out/edit.cjs videoNNN
// Added 2026-09-18 after the owner called Videos 019-024 "awful": the density/blur/SFX/transition rules lived in notes, not in code, so
// builds went to review without them. Every rule below is an owner rule. FAIL lines block the review; WARN lines must be answered in the review message.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const [, , file, name] = process.argv;
const e = require('./../' + file)[name];
const w = (i) => (i >= e.words.length ? e.endSec : e.words[i].start);
const fails = [], warns = [];
const F = (s) => fails.push(s), W = (s) => warns.push(s);

// 1. Frame 0: a real animated asset must be up in the first 0.5s (owner: "first three seconds", "gameplay at frame 0 + hook asset").
const events = [];  // { t, what, dur, sfx }
if (e.hook?.style && e.hook.style !== 'none') events.push({ t: e.hook.lineup ? w(e.hook.lineup.word) : 0, what: 'hook ' + e.hook.style, dur: w(e.hook.endWord) });
// a lineup stagger is motion: each chip landing and the stamp slam count as beats
if (e.hook?.lineup) { const L = e.hook.lineup; L.items.forEach((_, i) => events.push({ t: w(L.word) + (i * (L.stepFrames ?? 4)) / e.fps, what: 'lineup chip ' + (i + 1), dur: 0 })); events.push({ t: w(L.stampWord), what: 'lineup stamp ' + L.stampText, dur: 1.5 }); if (L.tagWord !== undefined) events.push({ t: w(L.tagWord), what: 'lineup tag', dur: 1.5 }); }
for (const k of ['lineupHero', 'sponsor', 'chartFit', 'heroCutout', 'sponsorDuo', 'slipFan', 'matchMath', 'table', 'tally']) if (e[k]) events.push({ t: w(e[k].word), what: k, dur: w(e[k].untilWord) - w(e[k].word) });
for (const L of Array.isArray(e.ladder) ? e.ladder : e.ladder ? [e.ladder] : []) events.push({ t: w(L.word), what: 'ladder', dur: w(L.untilWord) - w(L.word) });
for (const p of e.popups ?? []) events.push({ t: w(p.word), what: 'popup ' + p.src, dur: p.dur, sfx: p.sfx });
for (const s of e.stamps ?? []) events.push({ t: w(s.word), what: 'stamp "' + s.text + '"', dur: s.dur, sfx: s.sfx });
for (const m of e.memes ?? []) events.push({ t: w(m.word), what: 'meme ' + m.image.split('/').pop(), dur: m.dur ?? 1, sfx: m.sfx });
for (const n of e.news ?? []) events.push({ t: w(n.word), what: 'news ' + n.outlet, dur: n.dur });
// CodeBlast (Video-034): the block itself, each tile, the banner, the amounts and the code re-slam are all new elements
if (e.codeBlast) { const c = e.codeBlast; events.push({ t: w(c.word), what: 'codeBlast ' + c.code, dur: 0, sfx: 'cinematic_whoosh_impact.MP3' }); c.tiles.forEach((t, i) => { if (t.word !== undefined) events.push({ t: w(t.word), what: 'codeBlast tile', dur: 0, sfx: ['pop_sound.MP3', 'classic_whoosh.MP3', 'title_swoosh.MP3'][i % 3] }); }); if (c.banner) events.push({ t: w(c.banner.word), what: 'codeBlast banner', dur: 0, sfx: 'bass_impact.MP3' }); events.push({ t: w(c.amountWord), what: 'codeBlast amounts', dur: 0, sfx: 'amount_displayed_cash.MP3' }); events.push({ t: w(c.slamWord), what: 'codeBlast slam', dur: 0, sfx: c.sfx ?? 'punch_sound.MP3' }); }
// OPENER REUSE (owner, 2026-09-21: "we've been starting with the exact same clip... make sure that's never the case")
{
  const fs = await import('node:fs'); const pth = await import('node:path');
  const norm = (c) => { const m = String(c).match(/([^/]+)\.mp4(?:#([\d.]+))?/); return m ? { f: m[1], t: parseFloat(m[2] ?? '0') } : null; };
  const mine = norm(e.legs?.[0]?.clips?.[0]);
  if (mine) {
    const dir = pth.resolve('src/edits');
    for (const fn of fs.readdirSync(dir).filter((x) => x.endsWith('.ts'))) {
      const txt = fs.readFileSync(pth.join(dir, fn), 'utf8');
      if (txt.includes("id: '" + e.id + "'")) continue;
      const m = txt.match(/clips:\s*\[clip\('([^']+)'\)(?:\s*\+\s*'#([\d.]+)')?/);
      if (m && m[1] === mine.f && Math.abs(parseFloat(m[2] ?? '0') - mine.t) < 3) F('OPENER REUSED: ' + mine.f + ' #' + mine.t + ' already opens ' + fn + ' (pick a clip/offset no other video starts on)');
    }
  }
}
// FACELESS FOOTAGE REUSE (2026-09-21): HLS-001 + FFP-001 lost the FYP for "Unoriginal Content and IP" - every clip was a file ItzRockett had
// already posted (same md5, HLS-001 even opened on 034's exact hook). With no face/real voice, reused footage is the whole video. Faceless brands get fresh clips only.
if (e.brand === 'highlimit' || e.brand === 'fourfigure' || e.brand === 'ninetyplus') {   // Ninety Plus is faceless too
  const fs = await import('node:fs'); const pth = await import('node:path');
  const clipsOf = (s) => new Set([...String(s).matchAll(/([A-Za-z0-9_]+)\.mp4/g)].map((m) => m[1]).filter((n) => n !== 'facecam'));
  const mine = clipsOf(JSON.stringify(e.legs ?? []) + JSON.stringify(e.shots ?? []) + JSON.stringify(e.clipDurations ?? {}));
  const dir = pth.resolve('src/edits');
  for (const fn of fs.readdirSync(dir).filter((x) => x.endsWith('.ts'))) {
    const txt = fs.readFileSync(pth.join(dir, fn), 'utf8');
    if (txt.includes("id: '" + e.id + "'")) continue;
    const theirs = clipsOf(txt);
    for (const c of mine) if (theirs.has(c)) F('FACELESS FOOTAGE REUSED: ' + c + ' is already in ' + fn + ' (faceless brands need clips no other video has posted - TikTok "unoriginal content")');
  }
}
// THUMBNAIL + KIT scan (2026-09-21): banned words anywhere the audience reads them, not just inside the video
{
  const fs = await import('node:fs'); const pth = await import('node:path');
  const idTag = String(e.id).replace(/^Video/, '');
  const BAN = /\b(bet|bets|betting|parlay|parlays|wager|gamble|gambling|sportsbook|ladder|ladders|free|dollar|dollars)\b/gi;
  const thumb = pth.resolve('src/Thumbnail' + idTag + '.tsx');
  if (fs.existsSync(thumb)) {
    const props = [...fs.readFileSync(thumb, 'utf8').matchAll(/(?:top|bottom|text|label)=['"]([^'"]+)['"]/g)].map((m) => m[1]).join(' | ');
    for (const m of props.matchAll(BAN)) F('BANNED WORD on the thumbnail: "' + m[0] + '" (' + props + ')');
  }
  const want = idTag.toLowerCase().replace(/^(hls|ffp|np)(\d+)/, '$1-$2').replace(/^(\d+)$/, 'video-$1');
  const kits = [];
  const walk = (d, depth) => { if (depth > 3 || !fs.existsSync(d)) return; for (const n of fs.readdirSync(d)) { const q = pth.join(d, n); if (fs.statSync(q).isDirectory()) walk(q, depth + 1); else if (n === 'kit.md' && q.toLowerCase().includes(want)) kits.push(q); } };
  walk(pth.resolve('video-projects'), 0);   // Ninety Plus keeps video-projects/ inside the repo
  for (const k of kits) {
    const body = fs.readFileSync(k, 'utf8').split('\n').filter((l) => !/^#|No bet \/|^Files|^Account|^Post before|^CONDITIONAL|^Captions keep|^AI VOICE|^Tags:/i.test(l)).join('\n');
    for (const m of body.matchAll(BAN)) F('BANNED WORD in the publishing kit (' + want + '): "' + m[0] + '"');
  }
}
if (e.ladderStep) events.push({ t: w(e.ladderStep.word), what: 'ladderStep ' + e.ladderStep.from + ' -> ' + e.ladderStep.to, dur: e.ladderStep.dur, sfx: e.ladderStep.sfx });
if (e.codeDrop) events.push({ t: w(e.codeDrop.word), what: 'codeDrop ' + e.codeDrop.code, dur: e.codeDrop.dur, sfx: e.codeDrop.sfx });
if (e.mysteryGames) events.push({ t: w(e.mysteryGames.word), what: 'mysteryGames', dur: w(e.mysteryGames.untilWord) - w(e.mysteryGames.word), sfx: e.mysteryGames.sfx });
for (const sh of e.shots ?? []) events.push({ t: w(sh.word) + (sh.offset ?? 0), what: 'cut to ' + sh.shot, dur: 0, cut: true });
// the footage itself changes at every clip-chunk boundary inside a leg - those are real beats too
for (const lg of e.legs) { const n = (lg.clips ?? []).length; for (let i = 0; i < n; i++) events.push({ t: lg.start + (i * (lg.end - lg.start)) / n, what: 'clip chunk ' + (i + 1) + ' ' + lg.name, dur: 0, cut: true }); }
for (const k of e.strike ?? []) events.push({ t: w(k.word), what: 'strike', dur: k.dur });
for (const sp of e.split ?? []) events.push({ t: w(sp.word), what: 'split', dur: w(sp.untilWord) - w(sp.word) });
for (const leg of e.legs) {
  if (leg.anchor >= 0 && !leg.noReveal) events.push({ t: w(leg.anchor), what: 'reveal ' + leg.label, dur: leg.revealDur ?? 2.4 });
  for (const st of [...(leg.stats ?? []), ...(leg.stat ? [leg.stat] : [])]) {
    events.push({ t: w(st.word), what: 'stat "' + st.value + '"', dur: st.dur ?? 2.4 });
    const need = st.label ? 1.6 : 1.2;
    if ((st.dur ?? 2.4) < need) F('UNREADABLE stat "' + st.value + '" is ' + (st.dur ?? 2.4) + 's (needs ' + need + 's; a card nobody can read is worse than no card)');
  }
}
if (e.stamp) events.push({ t: w(e.stamp.word), what: 'ending slip', dur: e.endSec - w(e.stamp.word) });
const shots = [...(e.shots ?? [])].map((s) => ({ ...s, t: Math.max(0, w(s.word) + (s.offset ?? 0)) })).sort((a, b) => a.t - b.t);
for (const s of shots) events.push({ t: s.t, what: 'cut -> ' + s.shot, dur: 0 });
events.sort((a, b) => a.t - b.t);
if (!events.some((x) => x.t <= 0.5 && x.dur > 0)) F('FRAME 0: no asset up in the first 0.5s (hook lineup / slipFan / popup / stamp at word 0)');

// 2. Dead air: nothing new for > 3s (owner: "new element every 2-3s", "nothing static longer than 3s").
// Footage rotates clips in ~4s chunks inside a leg and a face cut starts a keyframe zoom, so every cut counts as a beat.
let last = 0;
for (const t of events.map((x) => x.t).concat([e.endSec])) { if (t - last > 3.0) F('DEAD AIR ' + (t - last).toFixed(1) + 's: nothing new from ' + last.toFixed(2) + ' to ' + t.toFixed(2)); last = Math.max(last, t); }
for (let i = 0; i < shots.length; i++) if (shots[i].shot === 'face') {
  const a = shots[i].t, b = i + 1 < shots.length ? shots[i + 1].t : e.endSec;
  if (b - a > 4 && !events.some((x) => x.dur > 0 && x.t >= a && x.t < b)) F('FACE ONLY ' + (b - a).toFixed(1) + 's: ' + a.toFixed(2) + '-' + b.toFixed(2) + ' with no asset (needs a stat/stamp/pop or a cut)');
}

// 3. Holds: no popup/stat/stamp/meme longer than 3s (animated set pieces get 8s).
for (const x of events) {
  const cap = /^(sponsor|matchMath|sponsorDuo|slipFan|heroCutout|chartFit|hook|ladder|lineupHero|ending slip|table|tally)/.test(x.what) ? 8 : 3.0;
  if (x.dur > cap) F('HOLD ' + x.dur.toFixed(1) + 's: ' + x.what + ' @' + x.t.toFixed(2) + ' (cap ' + cap + 's)');
}

// 4. SFX: no file more than twice in a video, never twice inside 8s; transitions need cutSfx (owner: "abusing the smack sfx", "SFX for transitions").
const sfxUse = {};
for (const x of events) if (x.sfx && !/silent/i.test(x.sfx)) (sfxUse[x.sfx.toLowerCase()] ??= []).push(x.t);
for (const [f, ts] of Object.entries(sfxUse)) {
  const isShutter = /shutter|canon|camera/.test(f);
  if (ts.length > 2 && !isShutter) F('SFX SPAM: ' + f + ' used ' + ts.length + 'x (max 2; rotate the library)');
  if (ts.length > 5 && isShutter) W('shutter used ' + ts.length + 'x; consider Stinger_camera_shut / canon_photo_click on some cards');
  const s = [...ts].sort((a, b) => a - b);
  for (let i = 1; i < s.length; i++) if (s[i] - s[i - 1] < 8 && !isShutter) F('SFX REPEAT: ' + f + ' at ' + s[i - 1].toFixed(1) + ' and ' + s[i].toFixed(1) + ' (< 8s apart)');
}
const cuts = shots.length;
const kinds = Object.keys(e.cutSfx ?? {});
if (cuts >= 4 && kinds.length < 2) F('TRANSITIONS: ' + cuts + ' shot changes but cutSfx has ' + kinds.length + ' kind(s); define at least glitch/whip/zoom');

// 5. Slip rules (TikTok, 2026-09-17): one slip, blurred at the open, unblurred only in the final reveal, no payout math.
const slips = [];
if (e.hook?.slip) slips.push({ what: 'hook.slip', t: w(e.hook.slip.fromWord), blur: !!e.hook.slip.blur });
if (e.hook?.lineup) slips.push({ what: 'hook.lineup', t: w(e.hook.lineup.word), blur: e.hook.lineup.blur !== false, lineup: true });
// a slip image saved with its names already blurred (Video-035/036: *_blur.jpg) counts as blurred
for (const p of e.popups ?? []) if (/slip|betslip|ticket/i.test(p.src)) slips.push({ what: 'popup ' + p.src, t: w(p.word), blur: (p.blur ?? 0) > 0 || /_blur/i.test(p.src) });
if (e.slipFan) slips.push({ what: 'slipFan', t: w(e.slipFan.word), blur: false, count: (e.slipFan.slips?.length ?? 1) + 1 });
if (e.stamp) slips.push({ what: 'ending slip', t: w(e.stamp.word), blur: false, ending: true });
for (const L of Array.isArray(e.ladder) ? e.ladder : e.ladder ? [e.ladder] : []) slips.push({ what: 'ladder', t: w(L.word), blur: !!L.blur, ending: L.big });
for (const s of slips) { if (s.t >= 0.8 * e.endSec) s.ending = true; if (!s.blur && !s.ending && !s.lineup) F('SLIP UNBLURRED before the ending: ' + s.what + ' @' + s.t.toFixed(2)); }
const realSlips = slips.filter((s) => !s.lineup).reduce((n, s) => n + (s.count ?? 1), 0);
if (realSlips > 2) F('SLIP COUNT: ' + realSlips + ' slip images (TikTok rule: one slip, tease blurred + final reveal only)');
if (e.stamp && w(e.stamp.word) < 0.8 * e.endSec) F('ENDING SLIP too early: ' + w(e.stamp.word).toFixed(1) + 's of ' + e.endSec + 's (must be in the last 20%)');
if (e.stamp?.payout || e.matchMath?.payout) W('PAYOUT TICKER on screen: not allowed in the TikTok cut (drop it or make the block droppable)');

// 6. Words: TikTok classifier list (speech + captions) and on-screen text (OCR reads our own overlays as much as the slip).
const text = e.words.map((x) => x.word).join(' ').toLowerCase();
const hard = /\b(bet|bets|betting|bettor|bettors|bankroll|parlay|parlays|wager|wagers|gamble|gambling|sportsbook|sportsbooks|casino|bookie|ladder|ladders|free|dollar|dollars)\b/g;   // 2026-09-21: "ladder" got High Limit Slips pulled from the FYP; free + dollar are owner-banned
const soft = /\b(odds|payout|payouts|cash out|units?|the books?|book it|money line|moneyline|spread|deposit|bonus|free money|dollar|dollars|free|over|under)\b/g;
for (const m of text.matchAll(hard)) F('BANNED WORD in voice/captions: "' + m[0] + '" (' + text.slice(Math.max(0, m.index - 25), m.index + 25) + ')');
const softHits = [...text.matchAll(soft)].map((m) => m[0]);
if (softHits.length) W('watch-list words spoken: ' + [...new Set(softHits)].join(', ') + ' (fine on YouTube/IG; cut or reword for the TikTok export if the block is droppable)');
// 5b. Graphics must sit inside the cross-platform safe box (theme.ts SAFE: x 90..950, y 260..1420).
// memes/popups are positioned by their TOP-LEFT corner, so x=540 on a 400px image runs to 940, not centred.
for (const m of e.memes ?? []) {
  const size = m.size ?? 320, w = m.w ?? size;
  const left = m.x ?? (1080 - size) / 2, top = m.y ?? 840 - size / 2;
  const bad = [];
  if (left < 90) bad.push('left ' + Math.round(left));
  if (left + w > 950) bad.push('right ' + Math.round(left + w));
  if (top < 260) bad.push('top ' + Math.round(top));
  if (top + size > 1420) bad.push('bottom ' + Math.round(top + size));
  if (bad.length) F('GRAPHIC OUT OF SAFE BOX: ' + m.image.split('/').pop() + ' at word ' + m.word + ' (' + bad.join(', ') + '; safe is x 90-950, y 260-1420, and x/y are the TOP-LEFT corner)');
}

const screen = [];
for (const leg of e.legs) { if (leg.line) screen.push(['leg line ' + leg.label, leg.line]); for (const st of [...(leg.stats ?? []), ...(leg.stat ? [leg.stat] : [])]) screen.push(['stat', st.value + ' ' + st.label]); }
for (const p of e.popups ?? []) screen.push(['popup label', p.label ?? '']);
for (const s of e.stamps ?? []) screen.push(['stamp', s.text]);
if (e.stamp) screen.push(['ending stamp', e.stamp.text]);
if (e.hook?.lineup) screen.push(['lineup', (e.hook.lineup.title ?? '') + ' ' + e.hook.lineup.stampText + ' ' + (e.hook.lineup.tagText ?? '')]);
for (const [where, s] of screen) {
  if (/parlay|bet|betting|bankroll|sportsbook|wager|ladder|dollar|free/i.test(s)) F('ON-SCREEN banned word (' + where + '): "' + s + '"');
  if (/\$\s?\d|pays?|payout|odds/i.test(s)) W('ON-SCREEN money text (' + where + '): "' + s + '" (TikTok OCR reads it; keep only if the owner asked for it)');
  if (/[+-]\d{3,}/.test(s)) W('on-screen odds format (' + where + '): "' + s + '" (OCR reads +NNN as a sportsbook price; prefer words)');
}

// 7. Hook: print the opener so the reviewer checks it against the owner's hook bank (never a stat, a matchup, or a scene-setter).
const opener = e.words.slice(0, 14).map((x) => x.word).join(' ');
if (/^(\d|(the )?(arsenal|villa|aston villa|bournemouth|brentford|brighton|burnley|chelsea|palace|crystal palace|everton|fulham|leeds|liverpool|city|man city|manchester city|united|man united|manchester united|newcastle|forest|sunderland|spurs|tottenham|west ham|wolves|real madrid|madrid|barcelona|barca|atletico|athletic|betis|sevilla|valencia|villarreal|sociedad|bayern|dortmund|leverkusen|leipzig|frankfurt|stuttgart|inter|milan|ac milan|juventus|juve|napoli|roma|lazio|atalanta|inter miami|miami|lafc|galaxy|la galaxy|seattle|columbus|cincinnati|orlando|nycfc|red bulls|toronto|vancouver|portland|atlanta)\b|this (week|weekend|game|match|matchday|saturday|sunday|midweek)|matchday|gameweek|saturday|sunday|midweek|tonight)/i.test(opener)) F('HOOK opens on a stat/team/day: "' + opener + '" (hook bank: tell your boys / your girl / no easier way / this is the official...)');
console.log('HOOK: "' + opener + '"');
console.log('beats: ' + events.filter((x) => x.dur > 0).length + ' assets, ' + cuts + ' cuts, ' + e.endSec + 's, sfx files: ' + Object.keys(sfxUse).length + ' (' + Object.keys(sfxUse).join(', ') + ')');
for (const s of warns) console.log('WARN ' + s);
for (const s of fails) console.log('FAIL ' + s);
console.log(fails.length ? 'RETENTION GATE: ' + fails.length + ' FAIL' : 'RETENTION GATE: OK' + (warns.length ? ' (' + warns.length + ' warn)' : ''));
process.exit(fails.length ? 1 : 0);
