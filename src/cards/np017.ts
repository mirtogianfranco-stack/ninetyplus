import type { CardSpec } from '../templates/CardTemplate';
import words from '../../video-projects/np-017/vo/words.json';

// NP-017 Midweek Card, 27-29 Oct 2026 (first video on the reusable template). Sources: Understat 2026-27 league data
// pulled 26 Oct: Dortmund 0.78 xGA/g at home; Monza BTTS 7/8; Chelsea BTTS 5/8; Fiorentina 3+ goals 7/8, Atalanta 6/8. Kick-offs ESPN.
export const spec: CardSpec = {
  dir: 'np-017',
  words,
  title: ['MIDWEEK', 'CARD'],
  tag: 'CUP · SERIE A',
  record: '21-8',
  fan: { left: { img: 'palmer' }, right: { crest: 'bvb' }, centers: ['liv', 'nap'], glows: ['rgba(3,70,148,0.8)', 'rgba(253,225,0,0.6)'] },
  picks: [
    {
      from: 7, h: 'bvb', a: 'svw', time: 'TUE 3:45 PM', hero: { crest: 'bvb', glow: 'rgba(253,225,0,0.6)' },
      claim: ['DORTMUND', 'AT HOME', 'IN THE CUP'], pill: 'DORTMUND TO WIN', pillWord: 17,
      devices: [{ kind: 'big', word: 9, value: '0.78', label: 'EXPECTED GOALS CONCEDED A GAME · AT HOME' }],
    },
    {
      from: 20, h: 'mon', a: 'nap', time: 'WED 3:45 PM', hero: { crest: 'mon', glow: 'rgba(206,17,38,0.6)' },
      claim: ['MONZA', 'GAMES', 'GO BOTH WAYS'], pill: 'BOTH TEAMS SCORE', pillWord: 34,
      devices: [{ kind: 'form', word: 24, label: 'BOTH TEAMS SCORED · MONZA GAMES', results: ['✓', '✓', '✓', '✓', '✓', '✓', '✗', '✓'] }],
    },
    {
      from: 37, h: 'liv', a: 'che', time: 'WED 4:00 PM', hero: { img: 'palmer', glow: 'rgba(3,70,148,0.85)' },
      claim: ['CHELSEA', 'GAMES', 'GO BOTH WAYS'], pill: 'BOTH TEAMS SCORE', pillWord: 51, row: 'BOTH TEAMS SCORE',
      devices: [{ kind: 'form', word: 41, label: 'BOTH TEAMS SCORED · CHELSEA GAMES', results: ['✓', '✓', '✓', '✓', '✗', '✓', '✗', '✗'] }],
    },
    {
      from: 54, h: 'fio', a: 'ata', time: 'THU 3:45 PM', hero: { crest: 'fio', glow: 'rgba(72,44,140,0.75)' },
      claim: ['FIORENTINA', 'GAMES', 'EXPLODE'], pill: '3+ GOALS', pillWord: 69,
      devices: [
        { kind: 'form', word: 59, label: '3+ GOALS · FIORENTINA GAMES', results: ['✓', '✓', '✓', '✓', '✗', '✓', '✓', '✓'] },
        { kind: 'chips', word: 68, top: 920, items: [{ text: '6/8 TOO', crest: 'ata', tag: '3+ GOALS', border: '#1E71B8' }] },
      ],
    },
  ],
  outroWord: 72,
  commentWord: 76,
  tints: ['#1a2a8a', '#7a6a00', '#6a0a1a', '#034694', '#3a1a6a', '#1a2a8a'],
  emph: ['GOALS.', 'UNDER', 'SEVEN', 'FIVE', 'COMMENT'],
};
