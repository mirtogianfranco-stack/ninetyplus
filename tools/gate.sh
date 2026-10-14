#!/usr/bin/env bash
# Pre-review gate: bundle the edit, run the overlap check AND the retention/TikTok gate. Usage: bash tools/gate.sh 024
# Both must print OK before a still, a Studio link or a review message goes to the owner. Never "skip" a FAIL; fix it or ask.
set -u
cd "$(dirname "$0")/.."
n="$1"; case "$n" in [0-9]*) v="video$n";; *) v="$n";; esac   # 036 -> video036; hls001 -> hls001 (High Limit Slips)
mkdir -p out
npx esbuild "src/edits/$v.ts" --bundle --platform=node --format=cjs --outfile=out/edit.cjs --loader:.json=json --log-level=error || exit 1
node tools/overlap-check.mjs out/edit.cjs "$v"; a=$?
node tools/retention-gate.mjs out/edit.cjs "$v"; b=$?
node tools/blackbars.mjs out/edit.cjs "$v"; c=$?
echo "----"; echo "overlap-check exit $a, retention-gate exit $b, black-bars exit $c"
if [ $a -eq 0 ] && [ $b -eq 0 ] && [ $c -eq 0 ]; then echo "GATE OK: safe to send for review"; else echo "GATE FAILED: do not send for review"; exit 1; fi
