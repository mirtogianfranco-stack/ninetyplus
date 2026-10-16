#!/usr/bin/env bash
# Rebuild every product (PDF + listing kit) into tpt/out/. Freebies last: their promo pages show the paid covers.
set -euo pipefail
cd "$(dirname "$0")"
for p in products/*.py; do
  case "$(basename "$p")" in free_*) continue;; esac
  python3 "$p"
done
for p in products/free_*.py; do python3 "$p"; done
