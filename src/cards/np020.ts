import type { CardSpec } from '../templates/CardTemplate';
import words from '../../video-projects/np-020/vo/words.json';

// NP-020 Best of the Rest, 31 Oct - 1 Nov 2026. Sources (pulled 30 Oct): Understat 2026-27 Bundesliga: Bayern 4.37 xG/g
// at home; Stuttgart LWLLWLL (lost 5 of 7). ESPN esp.1 standings: Racing Santander 26 conceded in 10. Understat Serie A:
// Juventus 0.60 xGA/g, fewest in the league; 3+ goals in 2 of 9. Kick-offs ESPN (Sat 14:30Z/17:30Z = EDT; Sun 15:15Z/19:45Z = EST).
export const spec: CardSpec = {
  dir: 'np-020',
  words,
  title: ['BEST OF', 'THE REST'],
  tag: 'EUROPE',
  record: '25-8',
  fan: { left: { crest: 'bay' }, right: { crest: 'rma' }, centers: ['b04', 'juv'], glows: ['rgba(220,5,45,0.8)', 'rgba(254,190,16,0.7)'] },
  picks: [
    {
      from: 7, h: 'bay', a: 'bvb', time: 'SAT 1:30 PM', hero: { crest: 'bay', glow: 'rgba(220,5,45,0.8)' },
      claim: ['BAYERN', 'AT HOME', 'ARE RELENTLESS'], pill: 'BAYERN TO WIN', pillWord: 17,
      devices: [{ kind: 'big', word: 10, value: '4.37', label: 'EXPECTED GOALS A GAME AT HOME' }],
    },
    {
      from: 20, h: 'b04', a: 'vfb', time: 'SAT 10:30 AM', hero: { crest: 'vfb', glow: 'rgba(227,34,25,0.7)' },
      claim: ['STUTTGART', 'KEEP', 'LOSING'], claimColor: 'red', pill: 'LEVERKUSEN TO WIN', pillWord: 26,
      devices: [{ kind: 'form', word: 22, label: 'STUTTGART · LAST 7 BUNDESLIGA GAMES', results: ['L', 'W', 'L', 'L', 'W', 'L', 'L'] }],
    },
    {
      from: 29, h: 'rac', a: 'rma', time: 'SUN 10:15 AM', hero: { crest: 'rac', glow: 'rgba(0,128,80,0.7)' },
      claim: ['RACING', 'SHIP', 'GOALS'], claimColor: 'red', pill: 'REAL MADRID TO WIN', pillWord: 36,
      devices: [{ kind: 'big', word: 32, value: '26', label: 'GOALS RACING HAVE CONCEDED IN 10', color: 'red' }],
    },
    {
      from: 40, h: 'juv', a: 'nap', time: 'SUN 2:45 PM', hero: { crest: 'juv', glow: 'rgba(255,255,255,0.55)' },
      claim: ['JUVENTUS', 'GIVE UP', 'NOTHING'], pill: '2 GOALS OR FEWER', pillWord: 52, row: 'JUVE v NAPOLI 2 OR FEWER',
      devices: [{ kind: 'big', word: 44, value: '0.60', label: 'EXPECTED GOALS CONCEDED A GAME · FEWEST IN SERIE A', color: 'green' }],
    },
  ],
  outroWord: 56,
  commentWord: 60,
  tints: ['#7a0a1a', '#8a0a1a', '#7a1a0a', '#0a5a3a', '#2a2a2a', '#7a0a1a'],
  emph: ['KLASSIKER', 'FOUR', 'FIVE', 'TWENTY', 'FEWEST', 'COMMENT'],
};
