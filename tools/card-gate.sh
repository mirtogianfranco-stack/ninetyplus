#!/usr/bin/env bash
# Gate for template card videos: bash tools/card-gate.sh 017  (-> src/cards/np017.ts). Must print CARD GATE OK before review.
set -u
cd "$(dirname "$0")/.."
n="$1"; case "$n" in [0-9]*) v="np$n";; *) v="$n";; esac
[ -f "src/cards/$v.ts" ] || { echo "no src/cards/$v.ts"; exit 1; }
mkdir -p out
npx esbuild "src/cards/$v.ts" --bundle --platform=node --format=cjs --outfile=out/card.cjs --loader:.json=json --log-level=error || exit 1
if node tools/card-check.mjs out/card.cjs "$v"; then echo "CARD GATE OK: safe to send for review"; else echo "CARD GATE FAILED: do not send for review"; exit 1; fi
