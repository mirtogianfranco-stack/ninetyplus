import type { CardSpec } from '../templates/CardTemplate';
import words from '../../video-projects/np-037/vo/words.json';

// NP-037 Premier League card, Sat 21 Nov 2026 (owner's picks). Sources: ESPN eng.1 through 17 Nov (video-projects/wk-1121):
// Fulham away 1-2-2, 3 scored in 5 away; Chelsea home 3-1-1, 13 scored in 5; Nicolas Jackson 6 goals, scored in 4 of Villa's last 5
// (scorers_eng.1.txt). Kick-offs ESPN (12:30Z, 15:00Z = 7:30 AM, 10:00 AM EST).
export const spec: CardSpec = {
  dir: 'np-037',
  words,
  title: ['WEEKEND', 'CARD'],
  tag: 'PREMIER LEAGUE',
  record: '45-16',
  fan: { left: { crest: 'mci' }, right: { crest: 'che' }, centers: ['avl'], glows: ['rgba(108,171,221,0.8)', 'rgba(3,70,148,0.8)'] },
  picks: [
    {
      from: 8, h: 'mci', a: 'ful', time: 'SAT 7:30 AM', hero: { crest: 'mci', glow: 'rgba(108,171,221,0.85)' },
      claim: ['FULHAM', 'CAN\'T SCORE', 'AWAY'], claimColor: 'red', pill: 'CITY TO WIN', pillWord: 17,
      devices: [{ kind: 'big', word: 11, value: '3', label: 'GOALS FULHAM HAVE SCORED IN 5 AWAY GAMES', color: 'red' }],
    },
    {
      from: 21, h: 'che', a: 'lee', time: 'SAT 10:00 AM', hero: { crest: 'che', glow: 'rgba(3,70,148,0.85)' },
      claim: ['CHELSEA', 'SCORE AT', 'HOME'], pill: 'CHELSEA TO WIN', pillWord: 29,
      devices: [{ kind: 'big', word: 24, value: '13', label: 'CHELSEA GOALS IN 5 HOME GAMES' }],
    },
    {
      from: 32, h: 'avl', a: 'sun', time: 'SAT 10:00 AM', hero: { crest: 'avl', glow: 'rgba(103,14,54,0.85)' },
      claim: ['NICOLAS JACKSON', 'RED', 'HOT'], pill: 'JACKSON TO SCORE', pillWord: 43, row: 'NICOLAS JACKSON TO SCORE',
      devices: [{ kind: 'big', word: 36, value: '6', label: "GOALS · SCORED IN 4 OF VILLA'S LAST 5" }],
    },
  ],
  outroWord: 47,
  commentWord: 51,
  tints: ['#1a2a8a', '#4a7aaa', '#1a3a8a', '#5a0a2a', '#1a2a8a'],
  emph: ['RESPONSE.', 'THREE', 'THIRTEEN', 'FOUR', 'COMMENT'],
};
