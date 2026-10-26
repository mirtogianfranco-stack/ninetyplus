#!/usr/bin/env bash
# Original beat for a template video, drops placed from its spec (hook end, every scene/card start, reveal, outro).
# Style rotates with the video number unless given. Usage: bash tools/card-beat.sh 017 [trap|drill|house|phonk|edm]
set -eu
cd "$(dirname "$0")/.."
n="$1"; v="np$n"; style="${2:-}"
f=""; for d in cards spotlights results; do [ -f "src/$d/$v.ts" ] && f="src/$d/$v.ts"; done
[ -n "$f" ] || { echo "no spec for $v"; exit 1; }
npx esbuild "$f" --bundle --platform=node --format=cjs --outfile=out/card.cjs --loader:.json=json --log-level=error
read -r secs drops < <(node -e '
const s=require("./out/card.cjs").spec, W=s.words.words, k=s.kind||"card";
const st=(i)=>W[i].start;
let d;
if (k==="card") d=[st(s.picks[0].from-1), ...s.picks.slice(1).map(x=>st(x.from)), st(s.outroWord)];
else if (k==="spotlight") d=[st(s.scenes[0].from-1), ...s.scenes.slice(1).map(x=>st(x.from)), st(s.reveal.pills[0].word), st(s.outro.from)];
else d=[st(s.cards[0].from-1), ...s.cards.slice(1).map(x=>st(x.from)), st(s.outro.from)];
console.log((s.words.duration+1.2).toFixed(2), d.map(x=>x.toFixed(2)).join(","))')
first="${drops%%,*}"; rest="${drops#*,}"
python3 tools/make-beat.py "public/np-$n/music/bed.wav" "$secs" --drop "$first" --drops "$rest" --seed "$((10#$n))" ${style:+--style "$style"}
