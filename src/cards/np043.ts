import type { CardSpec } from '../templates/CardTemplate';
import words from '../../video-projects/np-043/vo/words.json';

// NP-043 Premier League card, Sat 28 / Sun 29 Nov 2026 (owner's picks). Sources: ESPN eng.1 through 24 Nov
// (video-projects/wk-1128/form_eng.1.json, table_eng.1.txt): United 0 clean sheets in 11; Brentford away 1-1 Leeds, 2-2 Bournemouth,
// 2-2 Villa, 1-1 Hull, 0-2 Brighton (scored in 4 of 5); Liverpool away D W W W W (4-1-0), Liverpool 4-0 United 22 Nov;
// Coventry away 0-3, 0-1, 1-0, 1-3, 1-3 (lost 4 of 5); Evanilson scored in each of Bournemouth's last 6 league games
// (ESPN scoring plays 10 Oct - 21 Nov). Kick-offs ESPN (Sat 15:00Z = 10:00 AM EST, Sun 12:00Z = 7:00 AM, 14:05Z = 9:05 AM).
// record 55-20 after Champions League MD5 + Europa bonus.
export const spec: CardSpec = {
  dir: 'np-043',
  words,
  title: ['WEEKEND', 'CARD'],
  tag: 'PREMIER LEAGUE',
  record: '55-20',
  fan: { left: { crest: 'liv' }, right: { crest: 'bou' }, centers: ['mun', 'lee'], glows: ['rgba(200,16,46,0.8)', 'rgba(218,41,28,0.75)'] },
  picks: [
    {
      from: 10, h: 'mun', a: 'bre', time: 'SAT 10:00 AM', hero: { crest: 'mun', glow: 'rgba(218,41,28,0.85)' },
      claim: ['UNITED', 'CAN\'T KEEP', 'A CLEAN SHEET'], claimColor: 'red', pill: 'BOTH TEAMS SCORE', pillWord: 33, row: 'UTD v BRENTFORD BOTH SCORE',
      devices: [
        { kind: 'big', word: 14, value: '0', label: 'UNITED CLEAN SHEETS IN 11 GAMES', color: 'red' },
        { kind: 'form', word: 25, label: 'BRENTFORD SCORED · LAST 5 AWAY', results: ['✓', '✓', '✓', '✓', '✗'], top: 960 },
      ],
    },
    {
      from: 36, h: 'eve', a: 'liv', time: 'SUN 7:00 AM', hero: { crest: 'liv', glow: 'rgba(200,16,46,0.85)' },
      claim: ['LIVERPOOL', 'UNBEATEN', 'AWAY'], pill: 'LIVERPOOL WIN OR DRAW', pillWord: 50,
      devices: [
        { kind: 'form', word: 38, label: 'LIVERPOOL · AWAY GAMES', results: ['D', 'W', 'W', 'W', 'W'], top: 960 },
        { kind: 'big', word: 46, value: '4-0', label: 'LIVERPOOL v UNITED · LAST WEEKEND', color: 'green' },
      ],
    },
    {
      from: 54, h: 'lee', a: 'cov', time: 'SAT 10:00 AM', hero: { crest: 'lee', glow: 'rgba(255,205,0,0.75)' },
      claim: ['COVENTRY', 'LOSE', 'AWAY'], claimColor: 'red', pill: 'LEEDS TO WIN', pillWord: 63,
      devices: [{ kind: 'big', word: 57, value: '4/5', label: 'AWAY GAMES COVENTRY HAVE LOST', color: 'red' }],
    },
    {
      from: 66, h: 'ful', a: 'bou', time: 'SUN 9:05 AM', hero: { crest: 'bou', glow: 'rgba(218,41,28,0.85)' },
      claim: ['EVANILSON', 'CAN\'T STOP', 'SCORING'], pill: 'EVANILSON TO SCORE', pillWord: 74,
      devices: [{ kind: 'form', word: 71, label: 'EVANILSON · LAST 6 LEAGUE GAMES', results: ['✓', '✓', '✓', '✓', '✓', '✓'] }],
    },
  ],
  outroWord: 77,
  commentWord: 81,
  tints: ['#5a0a0a', '#5a0a1a', '#5a0a0a', '#4a3a0a', '#5a0a0a'],
  emph: ['SCORING.', 'CLEAN', 'UNBEATEN', 'FOUR', 'SIX', 'COMMENT'],
};
