// NP-000: pipeline demo, NOT a real video. Synthetic word timings over a silent voiceover, test-pattern clips and
// tone SFX from tools/make-demo-assets.sh. It exists so gate.sh, Studio and contact-sheet.sh can be proven on a fresh
// machine before a real build. Copy the SHAPE for real videos (src/edits/npNNN.ts), never the assets.
import type { PicksEdit, Word } from '../picks/types';

const words: Word[] = [
  { word: "Nobody", start: 0.10, end: 0.36 },
  { word: "is", start: 0.40, end: 0.66 },
  { word: "talking", start: 0.70, end: 0.96 },
  { word: "about", start: 1.00, end: 1.26 },
  { word: "the", start: 1.30, end: 1.56 },
  { word: "striker", start: 1.60, end: 1.86 },
  { word: "who", start: 1.90, end: 2.16 },
  { word: "scores", start: 2.20, end: 2.46 },
  { word: "late", start: 2.50, end: 2.76 },
  { word: "every", start: 2.80, end: 3.06 },
  { word: "single", start: 3.10, end: 3.36 },
  { word: "week.", start: 3.40, end: 3.66 },
  { word: "Haaland", start: 3.95, end: 4.21 },
  { word: "has", start: 4.25, end: 4.51 },
  { word: "eleven", start: 4.55, end: 4.81 },
  { word: "goals", start: 4.85, end: 5.11 },
  { word: "in", start: 5.15, end: 5.41 },
  { word: "nine", start: 5.45, end: 5.71 },
  { word: "games.", start: 5.75, end: 6.01 },
  { word: "Saka", start: 6.30, end: 6.56 },
  { word: "has", start: 6.60, end: 6.86 },
  { word: "scored", start: 6.90, end: 7.16 },
  { word: "in", start: 7.20, end: 7.46 },
  { word: "four", start: 7.50, end: 7.76 },
  { word: "straight.", start: 7.80, end: 8.06 },
  { word: "And", start: 8.35, end: 8.61 },
  { word: "Salah?", start: 8.65, end: 8.91 },
  { word: "Three", start: 9.20, end: 9.46 },
  { word: "goals", start: 9.50, end: 9.76 },
  { word: "after", start: 9.80, end: 10.06 },
  { word: "the", start: 10.10, end: 10.36 },
  { word: "ninetieth", start: 10.40, end: 10.66 },
  { word: "minute.", start: 10.70, end: 10.96 },
  { word: "Lock", start: 11.25, end: 11.51 },
  { word: "it", start: 11.55, end: 11.81 },
  { word: "in.", start: 11.85, end: 12.11 },
];
const END_SEC = 12.2;
const clip = (n: string) => 'np-000/clips/' + n + '.mp4';
const sfx = (n: string) => n + '.wav';
const crest = 'brand/crest_home.svg';

// 0 "Nobody" 0.10 | 12 "Haaland" 3.95 | 17 "nine" 5.45 | 19 "Saka" 6.30 | 26 "Salah?" 8.65 | 31 "ninetieth" 10.40 | 33 "Lock" 11.25
export const np000: PicksEdit = {
  id: 'NP000',
  fps: 30,
  endSec: END_SEC,
  words,
  voiceover: 'np-000/voiceover.wav',
  assetsBase: 'np-000',
  brand: 'ninetyplus',
  captionStyle: 'glow',
  captionGlow: ['#FFFFFF', '#FF2E4D'],
  clipSec: { [clip('demo_a')]: 13, [clip('demo_b')]: 13, [clip('demo_c')]: 13 },
  legs: [
    { name: 'haaland', label: 'ERLING HAALAND', team: 'mancity', anchor: 12, start: 0, end: 6.3, logo: crest, clips: [clip('demo_a') + '#1', clip('demo_b') + '#2', clip('demo_c') + '#1'], line: 'ANYTIME GOALSCORER', revealDur: 1.9 },
    { name: 'saka', label: 'BUKAYO SAKA', team: 'arsenal', anchor: 19, start: 6.3, end: 8.65, logo: crest, clips: [clip('demo_b') + '#5', clip('demo_c') + '#4'], line: 'TO SCORE', revealDur: 1.8 },
    { name: 'salah', label: 'MOHAMED SALAH', team: 'liverpool', anchor: 26, start: 8.65, end: END_SEC, logo: crest, clips: [clip('demo_c') + '#8', clip('demo_a') + '#7'], line: 'GOAL AFTER 90+', revealDur: 1.5,
      stats: [{ word: 31, value: '3 GOALS', label: 'AFTER THE 90TH MINUTE', dur: 1.75, sfx: sfx('bass'), vol: 0.4 }] },
  ],
  popups: [
    { word: 0, dur: 2.2, src: 'headline.png', label: 'LATE GOALS · THIS SEASON', team: 'liverpool', w: 900, h: 260, sfx: sfx('shutter'), vol: 0.45 },
  ],
  stamps: [
    { word: 8, text: 'LATE', dur: 1.0, tone: 'red', rot: -4, size: 130, sfx: sfx('punch'), vol: 0.45 },
    { word: 33, text: 'LOCKED IN', dur: 0.9, tone: 'gold', rot: 4, size: 120, sfx: sfx('swoosh'), vol: 0.45 },
  ],
  shots: [{ word: 0, shot: 'footage' }],
  hook: { endWord: 12, captions: true, style: 'none', phrases: [] },
  facecam: { file: 'np-000/facecam.mp4', srcW: 1920, srcH: 1080, head: { x: 960, y: 470 }, targetX: 540, zoom: 1.0, drift: 0, grade: 'none', wash: 'rgba(0,0,0,0)', keyLight: false },
  rail: { tile: 'logo' },
  revealLine: '',
  emphasisWords: ['HAALAND', 'ELEVEN', 'SAKA', 'FOUR', 'SALAH?', 'THREE', 'NINETIETH', 'LATE'],
};
