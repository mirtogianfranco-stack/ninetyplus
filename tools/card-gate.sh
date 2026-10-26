#!/usr/bin/env bash
# Gate for template videos: bash tools/card-gate.sh 017 -> finds src/{cards,spotlights,results}/np017.ts.
# Must print CARD GATE OK before any review.
set -u
cd "$(dirname "$0")/.."
n="$1"; case "$n" in [0-9]*) v="np$n";; *) v="$n";; esac
f=""; for d in cards spotlights results; do [ -f "src/$d/$v.ts" ] && f="src/$d/$v.ts"; done
[ -n "$f" ] || { echo "no src/{cards,spotlights,results}/$v.ts"; exit 1; }
mkdir -p out
npx esbuild "$f" --bundle --platform=node --format=cjs --outfile=out/card.cjs --loader:.json=json --log-level=error || exit 1
if node tools/card-check.mjs out/card.cjs "$v"; then echo "CARD GATE OK: safe to send for review"; else echo "CARD GATE FAILED: do not send for review"; exit 1; fi
