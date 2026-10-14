#!/usr/bin/env bash
# Pre-build voiceover scan: Whisper hides stutters, these two blind passes do not. Usage: bash tools/voscan.sh 001
# Anything repeated in BOTH passes is real. Fix it, then send the cut for approval and WAIT before building.
set -u
cd "$(dirname "$0")/.."
n="$1"; v="public/np-$n/voiceover.wav"
[ -f "$v" ] || { echo "no $v"; exit 1; }
echo "=== pass 1 (2.5s slices) ==="; python3 tools/slicescan.py "$v" 2.5
echo; echo "=== pass 2 (3.1s slices) ==="; python3 tools/slicescan.py "$v" 3.1
echo; echo "A repeat at an exact multiple of the slice length is a boundary artifact; a repeat in BOTH passes is real."
echo "NEXT: send the cut voiceover for approval and wait. Never build on an unapproved cut."
