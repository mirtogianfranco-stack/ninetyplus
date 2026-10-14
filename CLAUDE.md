# Ninety Plus - soccer picks shorts

Faceless 9:16 picks videos (Shorts / TikTok / Reels) for the Premier League, LaLiga, Bundesliga, Serie A and MLS,
built in Remotion from one edit file per video. Owner: mirtogianfranco. Brand: **Ninety Plus**, stoppage-time red.

**Before touching any edit file, voiceover or gate: load the `ninetyplus-build` skill** (`.claude/skills/`). It holds
the binding editorial rules. This file is the map; the skill is the law.

## Layout

```
src/
  Root.tsx              registers every video (VIDEOS list) + BrandCard + ThumbnailDemo stills
  picks/PicksVideo.tsx  the whole renderer (brand-agnostic, ~1.6k lines) - change it rarely and deliberately
  picks/types.ts        the edit-file API: READ IT before writing a video; every preset is documented there
  theme.ts              palette, fonts, easings, SAFE zone, brands (applyBrand), TEAM_COLORS = clubs + 'cash'
  clubs.ts              club colours by league (epl, laliga, bundesliga, seriea, mls) - add promoted clubs here
  thumbs/SkyStadiumThumb.tsx   cover template; Ninety Plus uses the `stoppage` variant
  edits/npNNN.ts        one per video; np000 is the pipeline demo (synthetic assets)
  BrandCard.tsx         brand sheet still
public/
  fonts/                Anton + Montserrat Black, loaded locally (renders never hit Google Fonts)
  brand/                placeholder crest/player art for demos
  shared/{sfx,music}/   house SFX + music beds, copied into each video by newvideo.sh
  np-NNN/               per-video media: clips, headshots, logos, popups, sfx, music, graphics, voiceover.wav
video-projects/np-NNN/  research, script, vo work files, transcript JSON, publishing/kit.md
tools/                  guardrails + audio pipeline (below)
docs/pipeline-checklist.md   printed by newvideo.sh
examples/               the FourFigurePlays reference edit + thumbnail (NFL; copy the shape, not the content)
```

## IDs

Video 1 = `np-001` folders, `src/edits/np001.ts` exporting `np001` with `id: 'NP001'`, composition `NP001`,
thumbnail `src/ThumbnailNP001.tsx`. Every tool takes the bare number: `bash tools/gate.sh 001`.

## Setup (fresh machine / fresh cloud session)

```
bash tools/setup.sh            # npm install, Whisper venv in tools/whisper-env, ffmpeg check, Pillow/numpy
bash tools/make-demo-assets.sh # synthetic media for np000
bash tools/gate.sh 000         # must print GATE OK
bash tools/contact-sheet.sh 000 1
```

`remotion.config.ts` picks up the cloud container's Playwright headless shell automatically. On a desktop, Remotion
downloads its own browser. Fonts are local because the cloud proxy's certificate is not trusted by headless Chrome.

## Workflow (per video)

1. `bash tools/newvideo.sh NNN` - folders + checklist.
2. Research, script, voiceover -> `bash tools/voscan.sh NNN` -> cut -> **approval**.
3. Transcribe the approved cut, write `src/edits/npNNN.ts`, add to `VIDEOS` in `src/Root.tsx`.
4. `bash tools/gate.sh NNN` -> GATE OK, then `bash tools/contact-sheet.sh NNN 2` and look at it.
5. Review in Studio (`npm run dev`). Render only when the owner says "render":
   `npx remotion render src/index.ts NPNNN out/npNNN.mp4`.
6. Thumbnail + publishing kit.

## Tools

| Tool | What it does |
|---|---|
| `gate.sh NNN` | bundles the edit, runs the three checkers; must print GATE OK before any review |
| `overlap-check.mjs` | cards/stats/popups/memes colliding in time+space, missing files |
| `retention-gate.mjs` | frame-0 asset, dead air >3s, SFX reuse, readable durations, banned words (voice, screen, thumbnail, kit), hook rule, opener/footage reuse |
| `blackbars.mjs` | letterboxed clips |
| `contact-sheet.sh NNN [step]` | one frame every N seconds -> `.tmp/csNNN/sheet.png` |
| `newvideo.sh NNN` | folders, carries cutter scripts from the last video, prints checklist |
| `voscan.sh NNN` | two blind slicescan passes over `public/np-NNN/voiceover.wav` |
| `slicescan.py rmsmap.py bcheck.py mindip.py cut2f.py pause_rms48.py` | voiceover cutting (method in the skill, section 7) |
| `d-env.sh <cmd>` | runs a heavy command with temp/caches in `.tmp/` and `.cache/` (override with `NP_SCRATCH`) |
| `setup.sh`, `make-demo-assets.sh` | machine setup; np000 demo media |
| `setup-kokoro.sh`, `tts.py` | local Kokoro AI voice (model from the kokoro-onnx GitHub release, not Hugging Face) |

## Guardrails

- Banned words (voice, captions, screen, thumbnail, hashtags): bet, betting, parlay, gamble, wager, bankroll,
  sportsbook, casino, bookie, dollar, free, ladder. No odds prices, money symbols or payout math on screen.
- Faceless brand: footage must never repeat across videos; the gate checks every clip against all other edits.
- Footage rights: league broadcast clips get claimed. Short, transformed, rotated; graphics-led legs when in doubt.
- Gambling-adjacent content: 18+ in the bio, no "guaranteed"/"lock of the century" claims, follow each platform's rules.
- Never claim a stat you did not capture a source for.

## Media and git

Large media (`*.mp4 *.mov *.wav *.mp3 *.m4a`) under `public/np-*/` and `video-projects/` is gitignored - it lives on
the machine that builds the video. Images, transcripts (JSON), edit files and publishing kits are committed, so any
session can read and gate a past video; re-rendering it needs the media back in place.
