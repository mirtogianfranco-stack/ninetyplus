import type { CardSpec } from '../templates/CardTemplate';
import words from '../../video-projects/np-041/vo/words.json';

// NP-041 Champions League card, matchday 5 (Tue 24 / Wed 25 Nov 2026) + Europa League Thursday bonus (owner's picks).
// Sources: ESPN uefa.champions MD1-4 (video-projects/ucl-md5/table_ucl.txt, form_ucl.json): PSG 20-5, 3+ goals in 4 of 4;
// Como 19-6; AEK away 0-0-2 (2-8); Lens 4-16 incl. 1-9 v Como at home; Douvikas (Como) 6 UCL goals, most in the competition, scored in 4 of 4 (espn-scorers uefa.champions to 23 Nov). Milan Serie A away 3-3-0 through 17 Nov (wk-1121/form_ita.1.json: Torino W, Juve D, Lazio D,
// Sassuolo D, Udinese W, Genoa W). Kick-offs ESPN (Tue/Wed 20:00Z = 3:00 PM EST; Thu 17:45Z = 12:45 PM EST).
// Owner swapped Kane (subbed off v Koln 20 Nov) for Douvikas.
export const spec: CardSpec = {
  dir: 'np-041',
  words,
  title: ['CHAMPIONS', 'LEAGUE'],
  tag: 'MATCHDAY 5',
  record: '51-19',
  fan: { left: { crest: 'psg' }, right: { crest: 'mil' }, centers: ['com', 'rbl'], glows: ['rgba(0,65,112,0.8)', 'rgba(251,9,11,0.75)'] },
  picks: [
    {
      from: 9, h: 'psg', a: 'rom', time: 'WED 3:00 PM', hero: { crest: 'psg', glow: 'rgba(0,65,112,0.85)' },
      claim: ['PARIS', 'GOALS', 'EVERYWHERE'], pill: '3+ GOALS', pillWord: 29, row: 'PSG v ROMA 3+ GOALS',
      devices: [
        { kind: 'big', word: 12, value: '20', label: 'PSG GOALS IN 4 CHAMPIONS LEAGUE GAMES' },
        { kind: 'form', word: 19, label: '3+ GOALS · EVERY PSG GAME', results: ['✓', '✓', '✓', '✓'], top: 960 },
      ],
    },
    {
      from: 32, h: 'com', a: 'aek', time: 'TUE 3:00 PM', hero: { crest: 'com', glow: 'rgba(0,90,170,0.85)' },
      claim: ['COMO', 'CAN\'T STOP', 'SCORING'], pill: 'COMO TO WIN', pillWord: 45,
      devices: [{ kind: 'big', word: 35, value: '19', label: 'COMO GOALS IN 4 GAMES', color: 'green' }],
    },
    {
      from: 48, h: 'rbl', a: 'rcl', time: 'TUE 3:00 PM', hero: { crest: 'rbl', glow: 'rgba(221,1,63,0.85)' },
      claim: ['LENS', 'CAN\'T', 'DEFEND'], claimColor: 'red', pill: 'LEIPZIG TO WIN', pillWord: 60,
      devices: [{ kind: 'big', word: 51, value: '16', label: 'GOALS LENS HAVE CONCEDED IN 4', color: 'red' }],
    },
    {
      from: 63, h: 'com', a: 'aek', time: 'TUE 3:00 PM', hero: { crest: 'com', glow: 'rgba(0,90,170,0.85)' },
      claim: ['DOUVIKAS', 'SCORES', 'EVERY GAME'], pill: 'DOUVIKAS TO SCORE', pillWord: 78, row: 'TASOS DOUVIKAS TO SCORE',
      devices: [
        { kind: 'form', word: 68, label: 'DOUVIKAS · SCORED IN EVERY GAME', results: ['✓', '✓', '✓', '✓'], top: 960 },
        { kind: 'big', word: 72, value: '6', label: 'GOALS · TOP SCORER', color: 'gold' },
      ],
    },
    {
      from: 81, h: 'oly', a: 'mil', time: 'THU 12:45 PM', hero: { crest: 'mil', glow: 'rgba(251,9,11,0.8)' },
      claim: ['THURSDAY', 'BONUS', 'EUROPA LEAGUE'], pill: 'MILAN WIN OR DRAW', pillWord: 95,
      devices: [{ kind: 'form', word: 87, label: 'MILAN SERIE A AWAY GAMES', results: ['W', 'D', 'D', 'D', 'W', 'W'] }],
    },
  ],
  outroWord: 100,
  commentWord: 104,
  tints: ['#0a2a5a', '#0a3a7a', '#5a0a1a', '#6a0a1a', '#5a0a0a', '#0a2a5a'],
  emph: ['CITY.', 'CHELSEA.', 'TWENTY', 'NINETEEN', 'SIXTEEN', 'NOBODY', 'UNBEATEN', 'COMMENT'],
};
