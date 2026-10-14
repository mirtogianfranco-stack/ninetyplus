#!/usr/bin/env bash
# Start a new video: folders, cutter scripts carried over from the last video, shared SFX/music, and the binding
# checklist printed so it is in context. Usage: bash tools/newvideo.sh 001
set -u
cd "$(dirname "$0")/.."
n="$1"; V="video-projects/np-$n"; P="public/np-$n"
mkdir -p "$V"/{research,script,vo/transcript,vo/probe,voiceover,publishing} "$P"/{clips,popups,headshots,logos,sfx,music,graphics}
last=$(ls -d video-projects/np-*/vo 2>/dev/null | grep -v "np-$n/" | sort | tail -1)
if [ -n "$last" ]; then for f in regions.py probe.py cut2f.py pause_rms48.py words.py; do [ -f "$last/$f" ] && sed "s#np-[0-9]\{3\}#np-$n#g" "$last/$f" > "$V/vo/$f"; done; fi
cp public/shared/sfx/* "$P/sfx/" 2>/dev/null; cp public/shared/music/* "$P/music/" 2>/dev/null
echo "np-$n ready: $V and $P (cutter scripts from: ${last:-none yet})"
echo "Edit file goes in src/edits/np$n.ts (export const np$n), register it in src/Root.tsx as NP$n."
echo "================ PIPELINE CHECKLIST (binding) ================"
cat docs/pipeline-checklist.md
