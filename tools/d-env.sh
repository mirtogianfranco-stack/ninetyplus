#!/usr/bin/env bash
# Run any pipeline command with every temp/cache on D: (C: is full). Usage: bash D:/ItzRockett/tools/d-env.sh <command...>
# Covers Remotion bundles/frames (os.tmpdir -> TEMP/TMP), ffmpeg/python tempfiles, Whisper models (XDG_CACHE_HOME), npm and pip caches.
export TEMP="D:\ItzRockett\tmp" TMP="D:\ItzRockett\tmp" TMPDIR="D:/ItzRockett/tmp"
export XDG_CACHE_HOME="D:/ItzRockett/cache" npm_config_cache="D:/ItzRockett/cache/npm" PIP_CACHE_DIR="D:/ItzRockett/cache/pip"
exec "$@"
