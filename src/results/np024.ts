import type { ResultsSpec } from '../templates/ResultsTemplate';
import words from '../../video-projects/np-024/vo/words.json';

// NP-024 Champions League card review (np-023), matchday 4: 3/4 legs, BUST. Season 30-12 -> 33-13.
// Sources: ESPN uefa.champions scoreboards + scoring plays (video-projects/mw-1103/results.md): Feyenoord 0-3 Inter;
// Villarreal 0-6 PSG (goals 9', 12', 13'); Fenerbahce 3-2 Liverpool (Liverpool led 1-0 and 2-1); Lens 1-9 Como (Douvikas 7', 32', 57').
export const spec: ResultsSpec = {
  kind: 'results', dir: 'np-024', words,
  topline: 'NINETY PLUS · CHAMPIONS LEAGUE RESULTS',
  intro: { title: ['EVERY LEG', 'GRADED'], items: ['CHAMPIONS LEAGUE CARD · 4 LEGS'] },
  cards: [
    { from: 8, header: 'MATCHDAY 4', title: ['CHAMPIONS', 'LEAGUE'], titleColor: 'red', tag: '4 LEGS',
      rows: [
        { h: 'fey', a: 'int', t: 'INTER TO WIN', score: '0-3', word: 14, win: true },
        { h: 'vil', a: 'psg', t: '3+ GOALS', score: '0-6', word: 20, win: true },
        { h: 'fen', a: 'liv', t: 'LIVERPOOL TO WIN', score: '3-2', word: 37, win: false },
        { h: 'rcl', a: 'com', t: 'COMO WIN OR DRAW', score: '1-9', word: 42, win: true },
      ],
      note: { word: 27, text: "3 GOALS BY 13'" },
      goals: { word: 46, crest: 'com', times: ["7'", "32'", "57'"] },
      stamp: { word: 54, win: false } },
  ],
  outro: { from: 55, line: '3 OF 4 LEGS · CHAMPIONS LEAGUE', record: { word: 55, label: 'SEASON', value: '33-13' }, banner: { word: 77, text: 'FOLLOW SO YOU DON\'T MISS THEM' },
    next: [{ word: 62, day: 'FRI', text: 'PREMIER LEAGUE CARD' }, { word: 67, day: 'SAT', text: 'BEST OF THE REST' }, { word: 72, day: 'SAT', text: 'PICK OF THE WEEKEND #3' }] },
  emph: ['NINE', 'SIX', 'TWICE', 'HAT', 'BUST.', 'FOLLOW'],
};
