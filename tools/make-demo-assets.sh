#!/usr/bin/env bash
# Generates the throwaway media for the np000 pipeline demo (src/edits/np000.ts): silent voiceover, test-pattern
# clips, a black facecam and short tone "SFX". Real videos never use these. Usage: bash tools/make-demo-assets.sh
set -eu
cd "$(dirname "$0")/.."
P=public/np-000; mkdir -p $P/clips $P/sfx $P/popups $P/graphics
ff() { ffmpeg -y -v error "$@"; }
ff -f lavfi -i anullsrc=r=48000:cl=mono -t 13 $P/voiceover.wav
ff -f lavfi -i color=c=black:s=1920x1080:r=30 -t 13 -c:v libx264 -pix_fmt yuv420p $P/facecam.mp4
ff -f lavfi -i testsrc2=s=1920x1080:r=30 -t 13 -vf "hue=s=0.4" -c:v libx264 -pix_fmt yuv420p $P/clips/demo_a.mp4
ff -f lavfi -i "smptehdbars=s=1920x1080:r=30" -t 13 -c:v libx264 -pix_fmt yuv420p $P/clips/demo_b.mp4
ff -f lavfi -i "mandelbrot=s=1920x1080:r=30" -t 13 -c:v libx264 -pix_fmt yuv420p $P/clips/demo_c.mp4
i=0; for n in whoosh shutter riser punch swoosh bass; do i=$((i+1)); ff -f lavfi -i "sine=f=$((200*i)):d=0.3" $P/sfx/$n.wav; done
ff -f lavfi -i "color=c=0x1d2230:s=900x260" -frames:v 1 -vf "drawbox=x=0:y=0:w=900:h=260:color=0xFF2E4D@1:t=8" $P/popups/headline.png
echo "demo assets in $P"
