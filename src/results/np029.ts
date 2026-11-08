import type { ResultsSpec } from '../templates/ResultsTemplate';
import words from '../../video-projects/np-029/vo/words.json';

// NP-029 Weekend Results, 7-8 Nov 2026: legs 7-2, cards 2 of 3 (POTW landed, Best of the Rest 4/4 landed, PL 2/4 bust).
// Season 33-13 -> 40-15. Pick of the Weekend 3-0. Sources: ESPN scoreboards + scoring plays (tools/track.py,
// video-projects/wk-1107/results.md). International break follows: no league games until 21 Nov (ESPN eng.1/esp.1 schedule).
export const spec: ResultsSpec = {
  kind: 'results', dir: 'np-029', words,
  topline: 'NINETY PLUS · WEEKEND RESULTS',
  intro: { title: ['EVERY CARD', 'GRADED'], items: ['PICK OF THE WEEKEND', 'BEST OF THE REST', 'PREMIER LEAGUE CARD'] },
  cards: [
    { from: 9, header: 'PICK OF THE WEEKEND #3', title: ['PICK OF THE', 'WEEKEND'], titleColor: 'gold', tag: 'LALIGA', gold: true,
      rows: [{ h: 'atm', a: 'bar', t: '3+ GOALS', score: '1-2', word: 17, win: true }],
      stamp: { word: 28, win: true }, note: { word: 21, text: "FERMÍN LÓPEZ 45' + 66'" } },
    { from: 29, header: 'GER · ITA · ESP · MLS', title: ['BEST OF THE', 'REST'], titleColor: 'green', tag: '4 LEGS',
      rows: [
        { h: 'rbl', a: 'fca', t: 'LEIPZIG TO WIN', score: '5-2', word: 34, win: true },
        { h: 'rom', a: 'sas', t: 'ROMA TO WIN', score: '3-0', word: 38, win: true },
        { h: 'val', a: 'rma', t: 'MADRID WIN BY 2+', score: '0-3', word: 43, win: true },
        { h: 'chi', a: 'clb', t: 'COLUMBUS WIN OR DRAW', score: '3-4', word: 50, win: true },
      ],
      goals: { word: 54, crest: 'clb', times: ["90+3'"] },
      stamp: { word: 62, win: true } },
    { from: 63, header: 'SAT + SUN', title: ['PREMIER', 'LEAGUE'], tag: '4 LEGS',
      rows: [
        { h: 'nfo', a: 'mci', t: 'CITY TO WIN', score: '3-1', word: 76, win: false },
        { h: 'cry', a: 'liv', t: 'LIVERPOOL TO WIN', score: '1-3', word: 81, win: true },
        { h: 'sun', a: 'che', t: 'PALMER TO SCORE', score: '1-0', word: 85, win: false },
        { h: 'mun', a: 'avl', t: 'BOTH TEAMS SCORE', score: '4-4', word: 92, win: true },
      ],
      note: { word: 68, text: "FOREST'S FIRST HOME GOALS" },
      stamp: { word: 98, win: false } },
  ],
  outro: { from: 99, line: '7 OF 9 LEGS · 2 OF 3 CARDS', record: { word: 105, label: 'SEASON', value: '40-15' },
    banner: { word: 136, text: "FOLLOW SO YOU DON'T MISS THEM" },
    next: [{ word: 115, day: 'POTW', text: 'PICK OF THE WEEKEND 3-0' }, { word: 125, day: 'THU', text: 'DATA STORY' }, { word: 130, day: 'NOV 20', text: 'PICKS ARE BACK' }] },
  emph: ['WEEKEND.', 'LANDED.', 'NINETY', 'BUST.', 'FORTY', 'FOLLOW'],
};
