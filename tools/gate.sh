#!/usr/bin/env bash
# Pre-review gate: bundle the edit, run the overlap check, the retention/TikTok gate and the black-bar check.
# Usage: bash tools/gate.sh 001   (-> src/edits/np001.ts). All three must pass before a still, a Studio link or a
# review message goes out. Never "skip" a FAIL; fix it or ask.
set -u
cd "$(dirname "$0")/.."
n="$1"; case "$n" in [0-9]*) v="np$n";; *) v="$n";; esac   # 001 -> np001
[ -f "src/edits/$v.ts" ] || { echo "no src/edits/$v.ts"; exit 1; }
mkdir -p out
npx esbuild "src/edits/$v.ts" --bundle --platform=node --format=cjs --outfile=out/edit.cjs --loader:.json=json --log-level=error || exit 1
node tools/overlap-check.mjs out/edit.cjs "$v"; a=$?
node tools/retention-gate.mjs out/edit.cjs "$v"; b=$?
node tools/blackbars.mjs out/edit.cjs "$v"; c=$?
echo "----"; echo "overlap-check exit $a, retention-gate exit $b, black-bars exit $c"
if [ $a -eq 0 ] && [ $b -eq 0 ] && [ $c -eq 0 ]; then echo "GATE OK: safe to send for review"; else echo "GATE FAILED: do not send for review"; exit 1; fi
