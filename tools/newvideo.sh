#!/usr/bin/env bash
# Start a new video: folders, cutter scripts (with join fades), and the binding checklist printed so it is in context. Usage: bash tools/newvideo.sh 028
set -u
n="$1"; V="D:/ItzRockett/video-projects/video-$n"; P="D:/ItzRockett/projects/public/video-$n"
mkdir -p "$V"/{research,script,vo/transcript,vo/probe,voiceover,publishing,propsmadness,outlier} "$P"/{clips,popups,headshots,logos,sfx,music,graphics}
last=$(ls -d D:/ItzRockett/video-projects/video-0*/vo 2>/dev/null | grep -v "video-$n" | sort | tail -1)
for f in regions.py probe.py cut2f.py pause_rms48.py words.py; do [ -f "$last/$f" ] && sed "s#video-[0-9]\{3\}#video-$n#g" "$last/$f" > "$V/vo/$f"; done
cp D:/ItzRockett/projects/public/video-024/sfx/* "$P/sfx/" 2>/dev/null; cp D:/ItzRockett/projects/public/video-024/music/industry_baby_long.wav "$P/music/" 2>/dev/null
echo "video-$n ready: $V and $P (cutter scripts copied from $last)"
echo "================ PIPELINE CHECKLIST (binding) ================"
cat "D:/ItzRockett/best-practices/ItzRockett-Knowledge/Best Practices/Pipeline Checklist.md"
