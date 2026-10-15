// NP-004: results for NP-003 (Europa League MD2, Thu 15 Oct 2026). 3 from 3, record 5-1. Voice: Kokoro bf_emma.
// Sources: ESPN full-time feed: Ferencvaros 2-1 Plzen, Benfica 4-1 Celtic, Hoffenheim 2-3 Besiktas.
import type { PicksEdit, Word } from '../picks/types';

const words: Word[] = [
  { word: "Boom!", start: 0.030, end: 0.440 },
  { word: "Three", start: 0.760, end: 1.047 },
  { word: "from", start: 1.067, end: 1.293 },
  { word: "three.", start: 1.313, end: 1.600 },
  { word: "Every", start: 1.800, end: 2.091 },
  { word: "single", start: 2.111, end: 2.526 },
  { word: "one", start: 2.546, end: 2.775 },
  { word: "landed.", start: 2.795, end: 3.210 },
  { word: "Ferencvaros", start: 3.530, end: 4.421 },
  { word: "won", start: 4.441, end: 4.664 },
  { word: "two-one.", start: 4.684, end: 5.150 },
  { word: "Benfica", start: 5.470, end: 5.947 },
  { word: "put", start: 5.967, end: 6.196 },
  { word: "four", start: 6.216, end: 6.444 },
  { word: "past", start: 6.464, end: 6.755 },
  { word: "Celtic.", start: 6.775, end: 7.190 },
  { word: "And", start: 7.510, end: 7.661 },
  { word: "Hoffenheim", start: 7.681, end: 8.232 },
  { word: "and", start: 8.252, end: 8.403 },
  { word: "Besiktas", start: 8.423, end: 8.916 },
  { word: "gave", start: 8.936, end: 9.201 },
  { word: "us", start: 9.221, end: 9.373 },
  { word: "five", start: 9.393, end: 9.658 },
  { word: "goals.", start: 9.678, end: 10.000 },
  { word: "That's", start: 10.320, end: 10.605 },
  { word: "five", start: 10.625, end: 10.910 },
  { word: "and", start: 10.930, end: 11.093 },
  { word: "one", start: 11.113, end: 11.338 },
  { word: "on", start: 11.358, end: 11.521 },
  { word: "the", start: 11.541, end: 11.643 },
  { word: "record.", start: 11.663, end: 12.070 },
  { word: "Follow,", start: 12.390, end: 12.830 },
  { word: "the", start: 13.030, end: 13.129 },
  { word: "weekend", start: 13.149, end: 13.606 },
  { word: "picks", start: 13.626, end: 13.905 },
  { word: "drop", start: 13.925, end: 14.203 },
  { word: "tomorrow.", start: 14.223, end: 14.680 },
];
const END_SEC = 14.90;
const clip = (n: string) => 'np-004/clips/' + n + '.mp4';
const crest = (n: string) => 'np-004/logos/' + n + '.png';

// 0 "Boom!" | 1 "Three from three" | 8 "Ferencvaros" | 11 "Benfica" | 17 "Hoffenheim" | 22 "five goals" | 25 "five and one" | 33 "weekend"
export const np004: PicksEdit = {
  id: 'NP004',
  fps: 30,
  endSec: END_SEC,
  words,
  voiceover: 'np-004/voiceover.wav',
  assetsBase: 'np-004',
  brand: 'ninetyplus',
  captionStyle: 'glow',
  captionGlow: ['#FFFFFF', '#FF2E4D'],
  clipSec: { [clip('boom')]: 10, [clip('r_fer')]: 10, [clip('r_ben')]: 10, [clip('r_tsg')]: 10, [clip('res_out')]: 10 },
  legs: [
    { name: 'fer', label: 'FERENCVAROS', team: 'ferencvaros', anchor: 8, start: 0, end: 5.47, logo: crest('fer'),
      clips: [clip('boom') + '#1', clip('r_fer') + '#0'], line: 'TO WIN · WON 2-1', revealDur: 1.6 },
    { name: 'ben', label: 'BENFICA', team: 'benfica', anchor: 11, start: 5.47, end: 7.51, logo: crest('ben'),
      clips: [clip('r_ben') + '#0'], line: 'TO WIN · WON 4-1', revealDur: 1.6 },
    { name: 'tsg', label: 'HOFFENHEIM V BESIKTAS', team: 'hoffenheim', anchor: 17, start: 7.51, end: END_SEC, logo: crest('tsg'),
      clips: [clip('r_tsg') + '#0', clip('res_out') + '#0'], line: '3+ GOALS · FINISHED 2-3', revealDur: 1.6 },
  ],
  popups: [
    { word: 1, dur: 2.6, src: 'receipt.png', label: '3 FROM 3', team: 'ferencvaros', w: 740, h: 500, x: 200, sfx: 'whoosh_motion.MP3', vol: 0.4 },
  ],
  stamps: [
    { word: 0, text: 'BOOM', dur: 0.7, tone: 'gold', rot: -6, size: 230, sfx: 'bass_impact.MP3', vol: 0.55 },
    { word: 22, text: '5 GOALS', dur: 0.9, tone: 'green', rot: 4, size: 140, sfx: 'ding_answer_correct.MP3', vol: 0.4 },
    { word: 25, text: 'RECORD 5-1', dur: 1.5, tone: 'gold', rot: -3, size: 150, sfx: 'cinematic_whoosh_impact.MP3', vol: 0.5 },
    { word: 33, text: 'WEEKEND PICKS · FRIDAY', dur: 1.7, tone: 'white', rot: 3, size: 90, sfx: 'title_swoosh.MP3', vol: 0.4 },
  ],
  shots: [{ word: 0, shot: 'footage' }],
  hook: { endWord: 1, captions: true, style: 'none', phrases: [] },
  facecam: { file: 'np-004/facecam.mp4', srcW: 1920, srcH: 1080, head: { x: 960, y: 470 }, targetX: 540, zoom: 1.0, drift: 0, grade: 'none', wash: 'rgba(0,0,0,0)', keyLight: false },
  rail: { tile: 'logo' },
  revealLine: '',
  brandTag: 'RECORD 5-1 · EUROPA LEAGUE MD2',
  emphasisWords: ['BOOM!', 'THREE', 'LANDED.', 'TWO-ONE.', 'FOUR', 'FIVE', 'RECORD.'],
};
