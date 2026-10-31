#!/usr/bin/env bash
# Polls tools/track.py every 3 min; exits (printing the board) as soon as any pick is decided or any game goes final.
cd "$(dirname "$0")/.."
cfg="$1"
sig() { python3 tools/track.py "$cfg" --json 2>/dev/null | python3 -c "import json,sys; print(json.dumps([(r['label'], r['verdict'] if r['verdict'] in ('WON','LOST') else '', r['state']=='post') for r in json.load(sys.stdin)]))"; }
start="$(sig)"
until [ -n "$start" ] && now="$(sig)" && [ -n "$now" ] && [ "$now" != "$start" ]; do sleep 180; [ -z "$start" ] && start="$(sig)"; done
python3 tools/track.py "$cfg"
