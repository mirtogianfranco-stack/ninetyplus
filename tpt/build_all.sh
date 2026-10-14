#!/usr/bin/env bash
# Rebuild every product (PDF + listing kit) into tpt/out/. Usage: bash tpt/build_all.sh
set -euo pipefail
cd "$(dirname "$0")"
for p in products/*.py; do
  python3 "$p"
done
