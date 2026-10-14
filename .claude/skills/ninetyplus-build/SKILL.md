---
name: fourfigureplays-build
description: Build a FourFigurePlays picks short in Remotion (ffp-NNN). Use this skill EVERY time you cut a voiceover, place graphics on an edit file in src/edits/, or are about to run tools/gate.sh for this project. It holds the binding editorial rules - what earns a place on screen, how long it stays, what gets a sound - plus the voiceover-cut method that actually works. Read it BEFORE writing or patching any ffpNNN.ts.
---

# FourFigurePlays build rules

These are not style preferences. Each one is here because skipping it cost a rejected video or a re-render.

## 0. PRE-BUILD GATE (binding)

Four things before a single element is placed. Skipping them is what turns a 45-minute video into a three-hour one, because every one of them surfaces late as a re-render.

1. **Scan the voiceover, then get it approved.** `bash tools/voscan.sh NNN` runs slicescan at 2.5 and 3.1. Whisper hides stutters at every setting. Send the cut audio for approval and **wait** - no graphics on an unapproved cut. Fixing audio after the build means re-cutting the facecam, shifting every word time, and re-rendering.
2. **Read the preset list in `src/picks/types.ts` end to end** and pick which preset does each job. If a preset exists, use it. Never hand-build a card for a job a preset already does.
3. **Open the last two publishing kits before writing any caption.** Copy the structure exactly: hook line + question + 3 hashtags + a pinned comment; Facebook is one line + 3 hashtags. Never write copy from scratch.
4. **A new on-screen element type extends `tools/overlap-check.mjs` in the same pass.** A new element that no guard knows about will end up covering something.

**Nothing may look AI-generated.** Distant, wide, low-detail or stitched/banded footage reads as slop and gets the whole video rejected. Audit every clip for a close, sharp shot before building.

## 1. Every element must be ABOUT the word it lands on

Before placing ANY meme, stat, stamp or popup, answer out loud: **which word is this illustrating?**
- A team logo goes on the word where that team is named. Nowhere else.
- A stat card goes on the number spoken. No number in that leg = no stat card.
- A screenshot card goes where that player's record is referenced. If no rate is quoted, the card does not belong.
- If you cannot name the word, **delete the element.**

## 2. Nothing on screen shorter than a person can read it
- Value + label card: **1.8s minimum**. Value-only: 1.2s. Screenshot card: **2.0s** or it does not go in.
- Never shrink a card to dodge an overlap; move it or cut it.

## 3. Never pad to beat the dead-air rule
The gate fails >3s with no new element, and the lazy fix is a random logo. **A footage cut is a beat** - the gate counts clip-chunk boundaries. If a stretch is empty, give the leg another clip chunk.

## 4. One DIFFERENT device per leg
Rotate: screenshot/stat card, `news` receipt, `table`, `strike` list, `split` before/after, `faceRows`, matchup logos. If two legs in a row would look the same, change one. Vary size, corner, above vs below the card. **The same pop-up on every pick is a failed video.**

## 5. The hook
Three beats minimum in the first 9 seconds - a stamp at frame 0, a card, a graphic on the money word - plus fast cuts. Footage at frame 0, never an empty frame and never the face. The opener must be a clip+offset no other video has opened on (the gate enforces it).

## 6. Sound has to mean something
Riser under a badge landing - whoosh for something flying in - coin for money - camera shutter for a screenshot card - punch/bass for a slam - ding ONLY for a confirmed win or lock. **Never a ding on a logo.** Rotate SFX; the gate fails a file used more than twice.

## 7. Voiceover cutting - the only method that works

Whisper **hides stutters at every setting**, including `condition_on_previous_text False`.

1. `python tools/slicescan.py <raw16k.wav> 2.5` - short NON-overlapping blind slices. A repeat at an exact multiple of the slice length is a boundary artifact; a repeat anywhere else is real.
2. Run again at 3.1 (and 1.7 for a messy take) - the boundaries move, so anything in two passes is real.
3. `python tools/rmsmap.py <wav> <from> <to>` prints a 50ms RMS envelope. Use it wherever the scans disagree: it shows where speech actually starts and stops and proves whether a "repeat" is a hallucination over silence.
4. `python tools/bcheck.py <wav> <t...>` snaps every cut point to the quietest sample within +/-120ms. Aim under rms ~100 or the splice clicks.
5. Make EVERY removal in ONE pass off the loudnormed master with `cut2f.py` (12ms fades). Stacked splices glitch.
6. **Fluidity pass:** the pause tool only trims gaps over 0.45s, so every splice join keeps the breath between takes - 0.17-0.28s each, ten in a 60s read, and it sounds choppy. `ffmpeg -i final16k.wav -af silencedetect=noise=-35dB:d=0.16 -f null -` (never with `-v error`, it hides the output), then trim every gap to **0.10s** and re-cut.
7. Cutting after the edit file exists does NOT need a re-transcribe: shift the word times arithmetically (`new = old - removed_before_it`). Every word index and caption correction stays valid; only leg start/end and `END_SEC` change.
8. Re-verify at two slice lengths, and again on the audio pulled out of the rendered mp4.

## 8. Graphics geometry
Positions are the **TOP-LEFT** corner, not the centre. Safe box x 90-950, y 260-1420. To centre an image of size N: `x = (1080 - N) / 2`. Captions sit low - anything below y~1200 collides with them. The progress rail owns the left edge; nothing may cover it.

## 9. Brand
`brand: 'fourfigure'` (orange #FF7A00), `captionGlow: ['#FFFFFF', '#FF7A00']`, `captionStyle: 'glow'`, thumbnails use `SkyStadiumThumb` with `ember`. Faceless builds use a black placeholder facecam. One voice, forever.

## 10. Banned words + openers
Banned in voice, on-screen text, thumbnails, captions and hashtags: bet, betting, parlay, gamble, wager, bankroll, sportsbook, casino, dollar, free, ladder. No money symbols or payout math on screen. The gate fails all of them, thumbnail and publishing copy included.

## 11. Process
- `bash tools/newvideo.sh NNN` first - it creates the folders and prints the binding checklist.
- Research and capture in ONE browser visit; screenshot every stat card while you are there.
- `bash tools/gate.sh NNN` must print GATE OK.
- `bash tools/contact-sheet.sh NNN 2` and **look at it**. The gate cannot see a weak opening frame, practice footage where game footage belongs, or a name card that vanishes before the end.
- Reviews happen in Remotion Studio, never a rendered mp4. Render only on the word "render".
- `npx remotion bundle` after every edit, before any render. If a change refuses to appear, delete `build/` and bundle again.
- Scripts, asset lists, results and publishing copy go in the chat, never as a file link.
