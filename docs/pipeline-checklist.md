1. Match + picks chosen (2-3 picks, one league per video). Kick-off time noted; publish 12-24h before.
2. Research in ONE browser visit: form, injuries/suspensions, the stat that justifies each pick. Screenshot every source.
3. Script: hook (no number / club / day first), one beat per pick, close. No banned words (SKILL.md section 10).
4. Voiceover recorded or generated -> public/np-NNN/voiceover.wav (loudnormed, -16 LUFS).
5. bash tools/voscan.sh NNN -> cut stutters -> fluidity pass -> APPROVAL. Wait.
6. Transcribe the approved cut -> video-projects/np-NNN/voiceover/npNNN_final.json, caption corrections file.
7. Assets: clips (close, sharp, never used before), headshots, crests, popups. All under public/np-NNN/.
8. Edit file src/edits/npNNN.ts; register in src/Root.tsx.
9. bash tools/gate.sh NNN -> GATE OK.
10. bash tools/contact-sheet.sh NNN 2 -> look at every frame.
11. Thumbnail: src/ThumbnailNPNNN.tsx with SkyStadiumThumb stoppage. No banned words.
12. Review in Studio. Render only on "render".
13. Publishing kit -> video-projects/np-NNN/publishing/kit.md (copy the last two kits' structure).
