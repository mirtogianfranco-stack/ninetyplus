import type { ResultsSpec } from '../templates/ResultsTemplate';
import words from '../../video-projects/np-022/vo/words.json';

// NP-022 Weekend results, 31 Oct - 1 Nov 2026: legs 5-4, cards 1 of 3. Season 25-8 -> 30-12. Pick of the Weekend 2-0.
// Sources: ESPN scoreboards + scoring plays (tools/track.py, video-projects/wk-1031/track.json): Milan 3-1 Inter (Bastoni 22'
// made it both teams scored); City 0-1 Brighton (Haaland blank); Bournemouth 2-0 Leeds; Spurs 2-0 Palace (Mateta red 13');
// Liverpool 0-1 Arsenal (Havertz 16'); Leverkusen 2-4 Stuttgart; Bayern 2-2 Dortmund; Racing 0-3 Real Madrid; Juventus 2-0 Napoli.
// Kudus miss = owner's observation, voiced as opinion only.
export const spec: ResultsSpec = {
  kind: 'results', dir: 'np-022', words,
  topline: 'NINETY PLUS · WEEKEND RESULTS',
  intro: { title: ['EVERY CARD', 'GRADED'], items: ['PICK OF THE WEEKEND', 'PREMIER LEAGUE CARD', 'BEST OF THE REST'] },
  cards: [
    { from: 9, header: 'PICK OF THE WEEKEND #2', title: ['PICK OF THE', 'WEEKEND'], titleColor: 'gold', tag: 'SERIE A', gold: true,
      rows: [{ h: 'mil', a: 'int', t: 'BOTH TEAMS SCORE', score: '3-1', word: 16, win: true }],
      stamp: { word: 26, win: true }, note: { word: 19, text: "BOTH SCORED BY 22'" } },
    { from: 27, header: 'SAT + SUN', title: ['PREMIER', 'LEAGUE'], tag: '4 LEGS',
      rows: [
        { h: 'mci', a: 'bha', t: 'HAALAND TO SCORE', score: '0-1', word: 31, win: false },
        { h: 'bou', a: 'lee', t: 'BOURNEMOUTH TO WIN', score: '2-0', word: 39, win: true },
        { h: 'tot', a: 'cry', t: '3+ GOALS', score: '2-0', word: 42, win: false },
        { h: 'liv', a: 'ars', t: 'ARSENAL WIN OR DRAW', score: '0-1', word: 65, win: true },
      ],
      stamp: { word: 72, win: false }, note: { word: 52, text: "PALACE RED CARD 13'" } },
    { from: 73, header: 'GER · ESP · ITA', title: ['BEST OF THE', 'REST'], titleColor: 'green', tag: '4 LEGS',
      rows: [
        { h: 'b04', a: 'vfb', t: 'LEVERKUSEN TO WIN', score: '2-4', word: 77, win: false },
        { h: 'bay', a: 'bvb', t: 'BAYERN TO WIN', score: '2-2', word: 81, win: false },
        { h: 'rac', a: 'rma', t: 'REAL MADRID TO WIN', score: '0-3', word: 86, win: true },
        { h: 'juv', a: 'nap', t: '2 GOALS OR FEWER', score: '2-0', word: 93, win: true },
      ],
      stamp: { word: 101, win: false } },
  ],
  outro: { from: 102, line: '5 OF 9 LEGS · PICK OF THE WEEKEND 2-0', record: { word: 108, label: 'SEASON', value: '30-12' }, banner: { word: 122, text: 'FOLLOW FOR THE NEXT CARD' } },
  emph: ['SWEEP', 'LANDED.', 'BUST.', 'THIRTEENTH', 'THIRTY', 'FOLLOW'],
};
