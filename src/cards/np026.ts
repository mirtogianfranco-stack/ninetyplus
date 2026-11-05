import type { CardSpec } from '../templates/CardTemplate';
import words from '../../video-projects/np-026/vo/words.json';

// NP-026 Premier League card, 7-8 Nov 2026. Sources: ESPN results through 5 Nov (tools/espn-form.py, video-projects/wk-1107):
// Forest 0 home goals in 4 (H 0-1-3, 0-3); Palace 21 conceded (most); Sunderland LWDLLLLDL (6 defeats in 9); United 0 clean sheets
// in 9; City lost last 2 (1-2 at Liverpool, 0-1 v Brighton), Liverpool lost last 2 (0-1 v Arsenal, 2-3 at Fenerbahce).
// Palmer: Chelsea's penalty taker (3 goals, 1 pen). Kick-offs ESPN eng.1 (Sat 17:30Z, Sun 14:00Z / 16:30Z = EST).
export const spec: CardSpec = {
  dir: 'np-026',
  words,
  title: ['WEEKEND', 'CARD'],
  tag: 'PREMIER LEAGUE',
  record: '33-13',
  fan: { left: { img: 'palmer' }, right: { crest: 'liv' }, centers: ['mci', 'mun'], glows: ['rgba(3,70,148,0.8)', 'rgba(200,16,46,0.75)'] },
  picks: [
    {
      from: 3, h: 'nfo', a: 'mci', time: 'SAT 12:30 PM', hero: { crest: 'mci', glow: 'rgba(108,171,221,0.85)' },
      claim: ['FOREST', 'CAN\'T', 'SCORE'], claimColor: 'red', pill: 'CITY TO WIN', pillWord: 29,
      devices: [
        { kind: 'chips', word: 8, items: [{ text: 'LOST 2 STRAIGHT', crest: 'mci' }, { text: 'LOST 2 STRAIGHT', crest: 'liv' }], row: false },
        { kind: 'big', word: 21, value: '0', label: 'HOME GOALS FOR FOREST THIS SEASON', color: 'red' },
      ],
    },
    {
      from: 33, h: 'cry', a: 'liv', time: 'SUN 9:00 AM', hero: { crest: 'liv', glow: 'rgba(200,16,46,0.75)' },
      claim: ['PALACE', 'LEAK', 'GOALS'], claimColor: 'red', pill: 'LIVERPOOL TO WIN', pillWord: 43,
      devices: [{ kind: 'big', word: 36, value: '21', label: 'GOALS CONCEDED · MOST IN THE LEAGUE', color: 'red' }],
    },
    {
      from: 46, h: 'sun', a: 'che', time: 'SUN 9:00 AM', hero: { img: 'palmer', glow: 'rgba(3,70,148,0.85)' },
      claim: ['PALMER', 'ON THE', 'PENALTIES'], pill: 'PALMER TO SCORE', pillWord: 57,
      devices: [{ kind: 'form', word: 54, label: 'SUNDERLAND · 9 GAMES', results: ['L', 'W', 'D', 'L', 'L', 'L', 'L', 'D', 'L'], top: 700 }],
    },
    {
      from: 60, h: 'mun', a: 'avl', time: 'SUN 11:30 AM', hero: { crest: 'mun', glow: 'rgba(218,41,28,0.75)' },
      claim: ['UNITED', 'CAN\'T KEEP', 'ONE OUT'], claimColor: 'red', pill: 'BOTH TEAMS SCORE', pillWord: 73, row: 'UNITED v VILLA BOTH SCORE',
      devices: [{ kind: 'big', word: 63, value: '0', label: 'CLEAN SHEETS FOR UNITED IN 9', color: 'red' }],
    },
  ],
  outroWord: 76,
  commentWord: 80,
  tints: ['#1a2a8a', '#4a7aaa', '#7a0a1a', '#1a3a8a', '#7a0a0a', '#1a2a8a'],
  emph: ['BOUNCE', 'SINGLE', 'TWENTY', 'SIX', 'CLEAN', 'COMMENT'],
};
