#!/usr/bin/env bash
# Run any heavy pipeline command with temp files and caches inside the project (.cache/, .tmp/ - both gitignored),
# so Remotion frames, ffmpeg/python tempfiles, Whisper models and npm/pip caches never fill the system drive.
# Usage: bash tools/d-env.sh <command...>     Override the location with NP_SCRATCH=/some/big/disk.
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
S="${NP_SCRATCH:-$ROOT}"
mkdir -p "$S/.tmp" "$S/.cache"
export TEMP="$S/.tmp" TMP="$S/.tmp" TMPDIR="$S/.tmp"
export XDG_CACHE_HOME="$S/.cache" npm_config_cache="$S/.cache/npm" PIP_CACHE_DIR="$S/.cache/pip"
exec "$@"
