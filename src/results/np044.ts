import type { ResultsSpec } from '../templates/ResultsTemplate';
import words from '../../video-projects/np-044/vo/words.json';

// NP-044 Champions League MD5 results + Thursday Europa League bonus (np-041 card). Legs 4-1, card BUST (Douvikas blank).
// Season 51-19 -> 55-20. Sources: ESPN uefa.champions / uefa.europa scoreboards + scoring plays (tools/track.py,
// video-projects/ucl-md5/results.md): Como 1-0 AEK (Milla 57'); Leipzig 3-1 Lens; PSG 2-2 Roma (Malen pen 78' = 4th goal);
// Olympiacos 2-4 Milan (Hutchinson 56', Cisse 63', Pulisic 71', Moreira 90+5'; Milan 0-2 down after 49').
export const spec: ResultsSpec = {
  kind: 'results', dir: 'np-044', words,
  topline: 'NINETY PLUS · CHAMPIONS LEAGUE RESULTS',
  intro: { title: ['EVERY PICK', 'GRADED'], items: ['CHAMPIONS LEAGUE CARD', 'THURSDAY BONUS'] },
  cards: [
    { from: 11, header: 'MATCHDAY 5', title: ['CHAMPIONS', 'LEAGUE'], tag: '4 LEGS',
      rows: [
        { h: 'com', a: 'aek', t: 'COMO TO WIN', score: '1-0', word: 15, win: true },
        { h: 'rbl', a: 'rcl', t: 'LEIPZIG TO WIN', score: '3-1', word: 20, win: true },
        { h: 'psg', a: 'rom', t: 'PSG v ROMA 3+ GOALS', score: '2-2', word: 25, win: true },
        { h: 'com', a: 'aek', t: 'DOUVIKAS TO SCORE', score: '1-0', word: 39, win: false },
      ],
      note: { word: 32, text: "MALEN PEN 78' · GOAL NUMBER 4" },
      stamp: { word: 43, win: false } },
    { from: 54, header: 'EUROPA LEAGUE', title: ['THURSDAY', 'BONUS'], titleColor: 'gold', tag: 'BONUS', gold: true,
      rows: [{ h: 'oly', a: 'mil', t: 'MILAN WIN OR DRAW', score: '2-4', word: 58, win: true }],
      note: { word: 60, text: '0-2 DOWN AFTER 49 MINUTES' },
      goals: { word: 64, crest: 'mil', times: ["56'", "63'", "71'", "90+5'"] },
      stamp: { word: 70, win: true } },
  ],
  outro: { from: 71, line: '4 OF 5 LEGS', record: { word: 77, label: 'SEASON', value: '55-20' },
    banner: { word: 97, text: "FOLLOW SO YOU DON'T MISS THEM" },
    next: [{ word: 84, day: 'FRI', text: 'PREMIER LEAGUE PICKS' }, { word: 89, day: 'SAT', text: 'PICK OF THE WEEKEND #6' }] },
  emph: ['CLOSE.', 'BUST.', 'FOUR.', 'LANDED.', 'FIFTY', 'FOLLOW'],
};
