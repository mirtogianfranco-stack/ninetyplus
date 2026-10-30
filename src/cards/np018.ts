import type { CardSpec } from '../templates/CardTemplate';
import words from '../../video-projects/np-018/vo/words.json';

// NP-018 Premier League Weekend Card, 31 Oct - 1 Nov 2026. Sources: Understat 2026-27 EPL pulled 26 Oct: Haaland 9 goals
// in 8 (7.04 xG); Bournemouth 2.53 xG/g at home; Palace 9-19 goals in 8; Arsenal 1.02 xGA/g, 5 conceded (best in the league).
// Kick-offs ESPN eng.1 (Sat 15:00Z / 17:30Z = EDT; Sun 16:30Z = 11:30 AM EST after the clocks change).
export const spec: CardSpec = {
  dir: 'np-018',
  words,
  title: ['WEEKEND', 'CARD'],
  tag: 'PREMIER LEAGUE',
  record: '25-8',
  fan: { left: { img: 'haaland' }, right: { crest: 'ars' }, centers: ['bou', 'cry'], glows: ['rgba(108,171,221,0.8)', 'rgba(239,1,7,0.75)'] },
  picks: [
    {
      from: 9, h: 'mci', a: 'bha', time: 'SAT 11:00 AM', hero: { img: 'haaland', glow: 'rgba(108,171,221,0.85)' },
      claim: ['HAALAND', 'CAN\'T STOP', 'SCORING'], pill: 'HAALAND TO SCORE', pillWord: 16,
      devices: [{ kind: 'big', word: 11, value: '9', label: 'GOALS IN 8 PREMIER LEAGUE GAMES' }],
    },
    {
      from: 19, h: 'bou', a: 'lee', time: 'SAT 11:00 AM', hero: { crest: 'bou', glow: 'rgba(218,41,28,0.7)' },
      claim: ['BOURNEMOUTH', 'AT HOME', 'ATTACK'], pill: 'BOURNEMOUTH TO WIN', pillWord: 31,
      devices: [{ kind: 'big', word: 21, value: '2.53', label: 'EXPECTED GOALS A GAME AT HOME' }],
    },
    {
      from: 34, h: 'tot', a: 'cry', time: 'SAT 1:30 PM', hero: { crest: 'cry', glow: 'rgba(27,69,143,0.75)' },
      claim: ['PALACE', 'LEAK', 'GOALS'], claimColor: 'red', pill: '3+ GOALS', pillWord: 43,
      devices: [{ kind: 'big', word: 37, value: '19', label: 'GOALS PALACE HAVE CONCEDED IN 8', color: 'red' }],
    },
    {
      from: 46, h: 'liv', a: 'ars', time: 'SUN 11:30 AM', hero: { crest: 'ars', glow: 'rgba(239,1,7,0.75)' },
      claim: ['ARSENAL', 'BEST DEFENCE', 'IN THE LEAGUE'], pill: 'ARSENAL WIN OR DRAW', pillWord: 56, row: 'ARSENAL WIN OR DRAW',
      devices: [{ kind: 'big', word: 50, value: '1.02', label: 'EXPECTED GOALS CONCEDED A GAME · BEST IN THE LEAGUE', color: 'green' }],
    },
  ],
  outroWord: 61,
  commentWord: 65,
  tints: ['#1a2a8a', '#4a7aaa', '#7a0a1a', '#1b458f', '#7a0a0a', '#1a2a8a'],
  emph: ['BOLD', 'NINE', 'HALF', 'NINETEEN', 'BEST', 'COMMENT'],
};
