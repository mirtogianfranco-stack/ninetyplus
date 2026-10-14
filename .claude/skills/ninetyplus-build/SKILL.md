---
name: ninetyplus-build
description: Build a Ninety Plus soccer picks short in Remotion (np-NNN). Use this skill EVERY time you cut a voiceover, place graphics on an edit file in src/edits/, or are about to run tools/gate.sh for this project. It holds the binding editorial rules - what earns a place on screen, how long it stays, what gets a sound - plus the voiceover-cut method that actually works. Read it BEFORE writing or patching any npNNN.ts.
---

# Ninety Plus build rules

These are not style preferences. They were inherited from the FourFigurePlays/ItzRockett system, where each one was
added because skipping it cost a rejected video or a re-render. Soccer-specific rules are marked (NP).

## 0. PRE-BUILD GATE (binding)

Four things before a single element is placed. Skipping them turns a 45-minute video into a three-hour one, because
every one of them surfaces late as a re-render.

1. **Scan the voiceover, then get it approved.** `bash tools/voscan.sh NNN` runs slicescan at 2.5 and 3.1. Whisper
   hides stutters at every setting. Send the cut audio for approval and **wait** - no graphics on an unapproved cut.
   Fixing audio after the build means shifting every word time and re-rendering.
2. **Read the preset list in `src/picks/types.ts` end to end** and pick which preset does each job. If a preset exists,
   use it. Never hand-build a card for a job a preset already does.
3. **Open the last two publishing kits (`video-projects/np-*/publishing/kit.md`) before writing any caption.** Copy the
   structure exactly: hook line + question + 3 hashtags + a pinned comment; Facebook is one line + 3 hashtags. Never
   write copy from scratch. (Until two kits exist, the structure above is the template.)
4. **A new on-screen element type extends `tools/overlap-check.mjs` in the same pass.** A new element no guard knows
   about will end up covering something.

**Nothing may look AI-generated.** Distant, wide, low-detail or stitched/banded footage reads as slop and gets the whole
video rejected. Audit every clip for a close, sharp shot before building.

**(NP) Footage rights.** League broadcast footage (Premier League, LaLiga, DFL, Serie A, MLS) is Content-ID'd fast.
Prefer: club/league official social clips used briefly and transformed, training/press footage, licensed stock, or
graphics-led legs (stat cards, table, headshots, crests). Never run more than a few seconds of one broadcast clip, and
never the same clip twice across videos (the gate enforces reuse for faceless brands).

## 1. Every element must be ABOUT the word it lands on

Before placing ANY meme, stat, stamp or popup, answer: **which word is this illustrating?**
- A club crest goes on the word where that club is named. Nowhere else.
- A stat card goes on the number spoken. No number in that leg = no stat card.
- A screenshot card (FBref, Opta, club site, news) goes where that record is referenced. If no rate is quoted, it does
  not belong.
- If you cannot name the word, **delete the element.**

## 2. Nothing on screen shorter than a person can read it
- Value + label card: **1.8s minimum**. Value-only: 1.2s. Screenshot card: **2.0s** or it does not go in.
- Never shrink a card to dodge an overlap; move it or cut it.

## 3. Never pad to beat the dead-air rule
The gate fails >3s with no new element, and the lazy fix is a random crest. **A footage cut is a beat** - the gate
counts clip-chunk boundaries. If a stretch is empty, give the leg another clip chunk.

## 4. One DIFFERENT device per leg
Rotate: screenshot/stat card, `news` receipt, `table` (league table / last-5 form), `strike` list (injuries,
suspensions, rotated XI), `split` before/after, `faceRows`, matchup crests. If two legs in a row would look the same,
change one. Vary size, corner, above vs below the card. **The same pop-up on every pick is a failed video.**

## 5. The hook
Three beats minimum in the first 9 seconds - a stamp at frame 0, a card, a graphic on the key word - plus fast cuts.
Footage at frame 0, never an empty frame. The opener must be a clip+offset no other video has opened on (the gate
enforces it). **The spoken hook never opens on a number, a club name or a day** ("Liverpool...", "This weekend...",
"Matchday 9...") - the gate fails it. Open on tension: "Nobody is talking about...", "This one is too easy...",
"Everyone is fading the wrong side...".

## 6. Sound has to mean something
Riser under a badge landing - whoosh for something flying in - shutter for a screenshot card - punch/bass for a slam -
whistle or crowd swell for a goal moment - ding ONLY for a confirmed win or lock. **Never a ding on a crest.** Rotate
SFX; the gate fails a file used more than twice.

## 7. Voiceover cutting - the only method that works

Whisper **hides stutters at every setting**, including `condition_on_previous_text False`.

1. `python3 tools/slicescan.py <raw16k.wav> 2.5` - short NON-overlapping blind slices. A repeat at an exact multiple of
   the slice length is a boundary artifact; a repeat anywhere else is real.
2. Run again at 3.1 (and 1.7 for a messy take) - the boundaries move, so anything in two passes is real.
3. `python3 tools/rmsmap.py <wav> <from> <to>` prints a 50ms RMS envelope. Use it wherever the scans disagree.
4. `python3 tools/bcheck.py <wav> <t...>` snaps every cut point to the quietest sample within +/-120ms. Aim under rms
   ~100 or the splice clicks.
5. Make EVERY removal in ONE pass off the loudnormed master with `cut2f.py` (12ms fades). Stacked splices glitch.
6. **Fluidity pass:** `ffmpeg -i final16k.wav -af silencedetect=noise=-35dB:d=0.16 -f null -` (never with `-v error`),
   then trim every gap to **0.10s** and re-cut.
7. Cutting after the edit file exists does NOT need a re-transcribe: shift word times arithmetically
   (`new = old - removed_before_it`). Only leg start/end and `END_SEC` change.
8. Re-verify at two slice lengths, and again on the audio pulled out of the rendered mp4.

## 8. Graphics geometry
Positions are the **TOP-LEFT** corner, not the centre. Safe box x 90-950, y 260-1420. To centre an image of size N:
`x = (1080 - N) / 2`. Captions sit low - anything below y~1200 collides with them. The progress rail owns the left
edge; nothing may cover it.

## 9. Brand
`brand: 'ninetyplus'` (stoppage red #FF2E4D, yellow #FFD23F for emphasis, white on #0B0A0D),
`captionGlow: ['#FFFFFF', '#FF2E4D']`, `captionStyle: 'glow'`. Thumbnails use `SkyStadiumThumb` with `stoppage`.
Club colours: `team: '<key>'` from `src/clubs.ts` (EPL, LaLiga, Bundesliga, Serie A, MLS). Faceless builds use a black
placeholder facecam. One voice, forever.

## 10. Banned words + openers
Banned in voice, on-screen text, thumbnails, captions and hashtags: bet, betting, parlay, gamble, wager, bankroll,
sportsbook, casino, bookie, dollar, free, ladder. No money symbols, no odds prices (+250) and no payout math on screen.
The gate fails all of them, thumbnail and publishing copy included.

(NP) Soccer markets, said the safe way:
| Market | Say / show |
|---|---|
| Anytime goalscorer | "TO SCORE", "ANYTIME GOALSCORER" |
| Both teams to score | "BOTH TEAMS SCORE" |
| Over 2.5 goals | "3+ GOALS" (the gate warns on "over"/"under" for the TikTok cut) |
| Corners / cards | "10+ CORNERS", "PLAYER CARDED" |
| Match result | "TO WIN", "DRAW", "WIN OR DRAW" |
| Clean sheet | "CLEAN SHEET" |

## 11. Process
- `bash tools/newvideo.sh NNN` first - it creates the folders and prints the binding checklist.
- Research and capture in ONE browser visit; screenshot every stat card while you are there. Stats must be checkable:
  FBref, the league site, the club site, or a named outlet.
- Edit file: `src/edits/npNNN.ts`, `export const npNNN`, `id: 'NPNNN'`; add it to `VIDEOS` in `src/Root.tsx`.
- `bash tools/gate.sh NNN` must print GATE OK.
- `bash tools/contact-sheet.sh NNN 2` and **look at it**. The gate cannot see a weak opening frame or a name card that
  vanishes before the end.
- Reviews happen in Remotion Studio (`npm run dev`), never a rendered mp4. Render only on the word "render":
  `npx remotion render src/index.ts NPNNN out/npNNN.mp4`.
- `npx remotion bundle` after every edit, before any render. If a change refuses to appear, delete `build/` and bundle
  again.
- Scripts, asset lists, results and publishing copy go in the chat, never as a file link.
