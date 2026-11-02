import type { CardSpec } from '../templates/CardTemplate';
import words from '../../video-projects/np-023/vo/words.json';

// NP-023 Champions League card, matchday 4 (Tue 3 / Wed 4 Nov 2026). Sources: ESPN uefa.champions standings pulled 2 Nov
// (after 3 games): Feyenoord 4-8, Villarreal 8-8 (16 goals in their games), Fenerbahce 3-9, Lens 3-7. Kick-offs ESPN
// (Tue 20:00Z, Wed 17:45Z / 20:00Z = 3:00 PM / 12:45 PM / 3:00 PM EST).
export const spec: CardSpec = {
  dir: 'np-023',
  words,
  title: ['CHAMPIONS', 'LEAGUE'],
  tag: 'MATCHDAY 4',
  record: '30-12',
  fan: { left: { crest: 'int' }, right: { crest: 'liv' }, centers: ['psg', 'com'], glows: ['rgba(0,82,165,0.8)', 'rgba(200,16,46,0.75)'] },
  picks: [
    {
      from: 8, h: 'fey', a: 'int', time: 'TUE 3:00 PM', hero: { crest: 'int', glow: 'rgba(0,82,165,0.8)' },
      claim: ['FEYENOORD', 'CAN\'T', 'DEFEND'], claimColor: 'red', pill: 'INTER TO WIN', pillWord: 16,
      devices: [{ kind: 'big', word: 11, value: '8', label: 'GOALS FEYENOORD HAVE CONCEDED IN 3', color: 'red' }],
    },
    {
      from: 19, h: 'vil', a: 'psg', time: 'TUE 3:00 PM', hero: { crest: 'psg', glow: 'rgba(0,65,112,0.85)' },
      claim: ['VILLARREAL', 'GAMES', 'EXPLODE'], pill: '3+ GOALS', pillWord: 30, row: 'VILLARREAL v PSG 3+ GOALS',
      devices: [{ kind: 'big', word: 23, value: '16', label: 'GOALS IN VILLARREAL\'S 3 GAMES' }],
    },
    {
      from: 33, h: 'fen', a: 'liv', time: 'WED 12:45 PM', hero: { crest: 'liv', glow: 'rgba(200,16,46,0.75)' },
      claim: ['FENERBAHÇE', 'LEAK', 'GOALS'], claimColor: 'red', pill: 'LIVERPOOL TO WIN', pillWord: 39,
      devices: [{ kind: 'big', word: 36, value: '9', label: 'GOALS FENERBAHÇE HAVE CONCEDED IN 3', color: 'red' }],
    },
    {
      from: 42, h: 'rcl', a: 'com', time: 'WED 3:00 PM', hero: { crest: 'com', glow: 'rgba(0,92,169,0.8)' },
      claim: ['LENS', 'CAN\'T', 'SCORE'], claimColor: 'red', pill: 'COMO WIN OR DRAW', pillWord: 49,
      devices: [{ kind: 'big', word: 47, value: '3', label: 'GOALS LENS HAVE SCORED IN 3 GAMES', color: 'red' }],
    },
  ],
  outroWord: 53,
  commentWord: 57,
  tints: ['#0a1a5a', '#0a2a7a', '#0a2a5a', '#7a0a1a', '#0a3a6a', '#0a1a5a'],
  emph: ['ROTTERDAM.', 'EIGHT', 'SIXTEEN', 'NINE', 'JUST', 'COMMENT'],
};
