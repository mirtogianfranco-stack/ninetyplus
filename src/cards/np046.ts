import type { CardSpec } from '../templates/CardTemplate';
import words from '../../video-projects/np-046/vo/words.json';

// NP-046 Best of the Rest, 28-29 Nov 2026 (owner's picks). Sources: ESPN results through 24 Nov (video-projects/wk-1128):
// Inter home 6-0-0 (4-1, 3-2, 5-3, 3-0, 2-1, 2-0 = 19 scored); Fiorentina games 3+ goals in 11 of 12 (4-0, 0-3, 1-2, 2-4, 1-1, 2-1,
// 1-3, 2-1, 2-2, 2-4, 2-2, 3-0), Fiorentina conceded 28 in 12 (table_ita.1.txt); Nashville 77 pts, most in MLS 2026 regular season (table_usa.1.txt), lost R1 game 1 0-1 at home
// (22 Nov), ESPN note "CIN leads series 1-0". Kick-offs ESPN: Sat 19:45Z = 2:45 PM EST, Sat 23:30Z = 6:30 PM, Sun 11:30Z = 6:30 AM.
// MLS R1: a drawn game goes to penalties; the pick is graded on the 90-minute score.
export const spec: CardSpec = {
  dir: 'np-046',
  words,
  title: ['BEST OF', 'THE REST'],
  tag: 'ITA · MLS',
  record: '55-20',
  fan: { left: { crest: 'int' }, right: { crest: 'nsh' }, centers: ['fio', 'udi'], glows: ['rgba(0,82,165,0.8)', 'rgba(236,232,26,0.7)'] },
  picks: [
    {
      from: 9, h: 'int', a: 'gen', time: 'SAT 2:45 PM', hero: { crest: 'int', glow: 'rgba(0,82,165,0.85)' },
      claim: ['INTER', 'PERFECT', 'AT HOME'], pill: 'INTER TO WIN', pillWord: 19,
      devices: [{ kind: 'form', word: 12, label: 'INTER · HOME GAMES', results: ['W', 'W', 'W', 'W', 'W', 'W'] }],
    },
    {
      from: 22, h: 'udi', a: 'fio', time: 'SUN 6:30 AM', hero: { crest: 'fio', glow: 'rgba(80,45,127,0.85)' },
      claim: ['FIORENTINA', 'GAMES', 'GO OFF'], pill: '3+ GOALS', pillWord: 37, row: 'UDI v FIORENTINA 3+ GOALS',
      devices: [
        { kind: 'form', word: 26, label: '3+ GOALS · FIORENTINA GAMES', results: ['✓', '✓', '✓', '✓', '✗', '✓', '✓', '✓', '✓', '✓', '✓', '✓'], top: 1000 },
        { kind: 'big', word: 34, value: '28', label: 'FIORENTINA GOALS CONCEDED', color: 'red' },
      ],
    },
    {
      from: 40, h: 'cin', a: 'nsh', time: 'SAT 6:30 PM', hero: { crest: 'nsh', glow: 'rgba(236,232,26,0.75)' },
      claim: ['WIN', 'OR GO', 'HOME'], claimColor: 'red', pill: 'NASHVILLE TO WIN', pillWord: 61,
      devices: [
        { kind: 'big', word: 43, value: '77', label: 'POINTS · BEST RECORD IN MLS', color: 'gold', top: 680 },
        { kind: 'big', word: 48, value: '0-1', label: 'GAME 1 · AT HOME', color: 'red', top: 880 },
      ],
    },
  ],
  outroWord: 64,
  commentWord: 68,
  tints: ['#0a2a5a', '#0a2a6a', '#3a0a5a', '#4a4a0a', '#0a2a5a'],
  emph: ['MILAN.', 'SIX', 'ELEVEN', 'BEST', 'HOME', 'COMMENT'],
};
