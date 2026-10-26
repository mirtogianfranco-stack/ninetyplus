#!/usr/bin/env bash
# Original beat for a template card video, drops placed from the spec: the hook's last word, every later pick's scene start,
# and the outro. Style rotates with the video number unless given. Usage: bash tools/card-beat.sh 017 [trap|drill|house|phonk|edm]
set -eu
cd "$(dirname "$0")/.."
n="$1"; v="np$n"; style="${2:-}"
npx esbuild "src/cards/$v.ts" --bundle --platform=node --format=cjs --outfile=out/card.cjs --loader:.json=json --log-level=error
read -r secs drops < <(node -e '
const s=require("./out/card.cjs").spec, W=s.words.words, p=s.picks;
const d=[W[p[0].from-1].start, ...p.slice(1).map(x=>W[x.from].start), W[s.outroWord].start];
console.log((s.words.duration+1.2).toFixed(2), d.map(x=>x.toFixed(2)).join(","))')
first="${drops%%,*}"; rest="${drops#*,}"
python3 tools/make-beat.py "public/np-$n/music/bed.wav" "$secs" --drop "$first" --drops "$rest" --seed "$((10#$n))" ${style:+--style "$style"}
