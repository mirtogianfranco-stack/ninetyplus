#!/usr/bin/env bash
# Pre-build voiceover scan: Whisper hides stutters, these two blind passes do not. Usage: bash tools/voscan.sh 039
# Anything repeated in BOTH passes is real. Fix it, then send the cut to the owner and WAIT for his OK before building.
set -u
cd "$(dirname "$0")/.."
n="$1"; v="public/video-$n/voiceover.wav"
[ -f "$v" ] || { echo "no $v"; exit 1; }
echo "=== pass 1 (2.5s slices) ==="; python D:/ItzRockett/tools/slicescan.py "$v" 2.5
echo; echo "=== pass 2 (3.1s slices) ==="; python D:/ItzRockett/tools/slicescan.py "$v" 3.1
echo; echo "A repeat at an exact multiple of the slice length is a boundary artifact; a repeat in BOTH passes is real."
echo "NEXT: send the cut voiceover to the owner and wait for his OK. Never build on an unapproved cut."
