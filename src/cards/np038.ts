import type { CardSpec } from '../templates/CardTemplate';
import words from '../../video-projects/np-038/vo/words.json';

// NP-038 Best of the Rest, 21-22 Nov 2026 (owner's picks). Sources: ESPN results through 17 Nov (video-projects/wk-1121):
// Gladbach 1-1-7 (LLLLLLWDL); Roma 8-3-0 unbeaten in 11; Real Madrid home 5-0-0, 17 scored; Bellingham 4 goals in 12;
// Venezia away 0-0-5. Kick-offs ESPN: 14:30Z, 17:00Z, 20:00Z Sat; 11:30Z Sun = 9:30 AM, 12:00 PM, 3:00 PM Sat; 6:30 AM Sun EST.
export const spec: CardSpec = {
  dir: 'np-038',
  words,
  title: ['BEST OF', 'THE REST'],
  tag: 'GER · ITA · ESP',
  record: '45-16',
  fan: { left: { crest: 'bvb' }, right: { crest: 'rma' }, centers: ['rom', 'juv'], glows: ['rgba(253,225,0,0.7)', 'rgba(254,190,16,0.7)'] },
  picks: [
    {
      from: 9, h: 'gla', a: 'bvb', time: 'SAT 9:30 AM', hero: { crest: 'bvb', glow: 'rgba(253,225,0,0.7)' },
      claim: ['GLADBACH', 'LOSE', 'EVERY WEEK'], claimColor: 'red', pill: 'DORTMUND TO WIN', pillWord: 15,
      devices: [{ kind: 'form', word: 11, label: 'GLADBACH · 9 BUNDESLIGA GAMES', results: ['L', 'L', 'L', 'L', 'L', 'L', 'W', 'D', 'L'] }],
    },
    {
      from: 18, h: 'par', a: 'rom', time: 'SAT 12:00 PM', hero: { crest: 'rom', glow: 'rgba(142,31,47,0.85)' },
      claim: ['ROMA', 'STILL', 'UNBEATEN'], pill: 'ROMA TO WIN', pillWord: 27,
      devices: [{ kind: 'big', word: 20, value: '0', label: 'LEAGUE DEFEATS FOR ROMA IN 11', color: 'green' }],
    },
    {
      from: 30, h: 'rma', a: 'cel', time: 'SAT 3:00 PM', hero: { crest: 'rma', glow: 'rgba(254,190,16,0.7)' },
      claim: ['MADRID', 'SCORE AT', 'HOME'], pill: 'BELLINGHAM TO SCORE', pillWord: 39, row: 'JUDE BELLINGHAM TO SCORE',
      devices: [{ kind: 'big', word: 34, value: '17', label: 'MADRID GOALS IN 5 HOME GAMES' }],
    },
    {
      from: 43, h: 'juv', a: 'ven', time: 'SUN 6:30 AM', hero: { crest: 'juv', glow: 'rgba(255,255,255,0.55)' },
      claim: ['VENEZIA', 'LOSE ON', 'THE ROAD'], claimColor: 'red', pill: 'JUVENTUS TO WIN', pillWord: 51,
      devices: [{ kind: 'form', word: 46, label: 'VENEZIA · 5 AWAY GAMES', results: ['L', 'L', 'L', 'L', 'L'] }],
    },
  ],
  outroWord: 54,
  commentWord: 58,
  tints: ['#5a4a0a', '#5a4a0a', '#5a0a1a', '#5a4a0a', '#2a2a2a', '#5a4a0a'],
  emph: ['GERMANY.', 'SEVEN', 'LOST', 'SEVENTEEN', 'FIVE', 'COMMENT'],
};
