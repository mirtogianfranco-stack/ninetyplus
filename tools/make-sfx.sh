#!/usr/bin/env bash
# Synthesizes the house SFX set into public/shared/sfx under the file names PicksVideo defaults to (no downloads,
# no licences). newvideo.sh copies them into each video. Usage: bash tools/make-sfx.sh
set -eu
cd "$(dirname "$0")/.."
D=public/shared/sfx; mkdir -p $D
a() { ffmpeg -y -v error -f lavfi -i "$1" ${2:+-af "$2"} -ar 48000 -ac 2 -b:a 192k "$D/$3"; }
N='anoisesrc=d=%s:c=pink:r=48000:a=0.9'
a "$(printf $N 0.7)" "bandpass=f=900:w=1400,afade=t=in:d=0.35:curve=exp,afade=t=out:st=0.35:d=0.35,volume=2.2" whoosh_motion.MP3
a "$(printf $N 0.45)" "highpass=f=1500,afade=t=in:d=0.12,afade=t=out:st=0.12:d=0.33,volume=2" fast_swoosh.MP3
a "$(printf $N 0.9)" "lowpass=f=2500,afade=t=in:d=0.6:curve=exp,afade=t=out:st=0.6:d=0.3,volume=2" classic_whoosh.MP3
a "$(printf $N 0.6)" "bandpass=f=2200:w=2000,afade=t=in:d=0.25,afade=t=out:st=0.25:d=0.35,volume=2" title_swoosh.MP3
a "aevalsrc='0.9*sin(2*PI*(45+120*exp(-t*25))*t)*exp(-t*5)':d=1.0:s=48000" "" bass_impact.MP3
a "aevalsrc='0.9*sin(2*PI*(70+200*exp(-t*40))*t)*exp(-t*12)+0.3*(random(0)-0.5)*exp(-t*60)':d=0.5:s=48000" "" punch_sound.MP3
a "aevalsrc='(random(0)-0.5)*(exp(-t*120)+0.8*exp(-(t-0.07)*120)*gt(t,0.07))':d=0.25:s=48000" "highpass=f=1200,volume=2.5" shutter_sound_camera.MP3
a "aevalsrc='0.8*sin(2*PI*(500+900*t*8)*t)*exp(-t*30)':d=0.18:s=48000" "" pop_sound.MP3
a "aevalsrc='0.6*sin(2*PI*(400+1400*t)*t)*exp(-t*9)':d=0.5:s=48000" "" pop_whoosh.MP3
a "aevalsrc='0.5*sin(2*PI*1318*t)*exp(-t*4)+0.3*sin(2*PI*1976*t)*exp(-t*5)':d=0.9:s=48000" "" ding_answer_correct.MP3
a "aevalsrc='0.4*sin(2*PI*(150+300*t/4)*t)*(t/4)+0.25*(random(0)-0.5)*(t/4)^2':d=4:s=48000" "afade=t=out:st=3.8:d=0.2" riser_sound_4sec.MP3
a "aevalsrc='0.6*sin(2*PI*(60+500*exp(-t*8))*t)*exp(-t*3)+0.3*(random(0)-0.5)*exp(-t*10)':d=1.3:s=48000" "" cinematic_whoosh_impact.MP3
a "aevalsrc='0.5*sgn(sin(2*PI*(200+800*random(1)*lt(mod(t,0.04),0.02))*t))*exp(-t*6)':d=0.35:s=48000" "" glitch_sound.MP3
a "aevalsrc='0.5*sin(2*PI*1568*t)*exp(-t*10)+0.4*sin(2*PI*2093*t)*exp(-(t-0.08)*10)*gt(t,0.08)':d=0.5:s=48000" "" coin_sound.MP3
a "aevalsrc='0.5*sin(2*PI*1046*t)*exp(-t*8)+0.4*sin(2*PI*1568*t)*exp(-(t-0.1)*8)*gt(t,0.1)':d=0.6:s=48000" "" amount_displayed_cash.MP3
a "aevalsrc='0.5*sin(2*PI*1760*t)*exp(-t*12)+0.4*sin(2*PI*1318*t)*exp(-(t-0.12)*12)*gt(t,0.12)':d=0.5:s=48000" "" iphone_message_tone.MP3
a "aevalsrc='0.35*sin(2*PI*(600+1800*t)*t)*sin(PI*t/1.2)':d=1.2:s=48000" "" magic_reveal.MP3
a "aevalsrc='0.5*sgn(sin(2*PI*180*t))*exp(-t*3)*lt(t,0.2)+0.5*sgn(sin(2*PI*140*t))*exp(-(t-0.25)*3)*gt(t,0.25)':d=0.6:s=48000" "lowpass=f=1800" wrong_answer.MP3
echo "sfx in $D: $(ls $D | grep -c MP3) files"
