import type { ResultsSpec } from '../templates/ResultsTemplate';
import words from '../../video-projects/np-040/vo/words.json';

// NP-040 Weekend Results, 21-22 Nov 2026: legs 6-3, cards 2 of 3 (POTW #5 landed, Best of the Rest 4/4 landed, PL 0/3 bust).
// Season 45-16 -> 51-19. Pick of the Weekend 5-0. Sources: ESPN scoreboards + scoring plays (tools/track.py,
// video-projects/wk-1121/results.md). "0 FOR 7": every graded City/Chelsea Premier League pick this season, from our own
// results videos: Everton 0-2 Chelsea BTTS, Chelsea 0-2 Spurs 3+, Haaland v Brighton 0-1, Forest 3-1 City (np029),
// Palmer at Sunderland 1-0 (np029), City 1-1 Fulham, Chelsea 1-4 Leeds. (Wins outside the PL: City 5-1 AEK, Liverpool-Chelsea BTTS Carabao.)
export const spec: ResultsSpec = {
  kind: 'results', dir: 'np-040', words,
  topline: 'NINETY PLUS · WEEKEND RESULTS',
  intro: { title: ['EVERY CARD', 'GRADED'], items: ['PICK OF THE WEEKEND', 'BEST OF THE REST', 'PREMIER LEAGUE CARD'] },
  cards: [
    { from: 9, header: 'PICK OF THE WEEKEND #5', title: ['PICK OF THE', 'WEEKEND'], titleColor: 'gold', tag: 'LALIGA', gold: true,
      rows: [{ h: 'bar', a: 'vil', t: '3+ GOALS', score: '3-2', word: 17, win: true }],
      note: { word: 21, text: "0-2 DOWN AFTER 7 MINUTES" },
      goals: { word: 28, crest: 'bar', times: ["57'", "61'", "67'"] },
      stamp: { word: 34, win: true } },
    { from: 38, header: 'GER · ITA · ESP', title: ['BEST OF THE', 'REST'], titleColor: 'green', tag: '4 LEGS',
      rows: [
        { h: 'gla', a: 'bvb', t: 'DORTMUND TO WIN', score: '0-1', word: 42, win: true },
        { h: 'par', a: 'rom', t: 'ROMA TO WIN', score: '1-5', word: 46, win: true },
        { h: 'rma', a: 'cel', t: 'BELLINGHAM TO SCORE', score: '2-1', word: 54, win: true },
        { h: 'juv', a: 'ven', t: 'JUVENTUS TO WIN', score: '4-0', word: 59, win: true },
      ],
      note: { word: 51, text: 'MALEN SCORED FOUR' },
      stamp: { word: 66, win: true } },
    { from: 67, header: 'SAT + SUN', title: ['PREMIER', 'LEAGUE'], tag: '3 LEGS',
      rows: [
        { h: 'mci', a: 'ful', t: 'CITY TO WIN', score: '1-1', word: 71, win: false },
        { h: 'che', a: 'lee', t: 'CHELSEA TO WIN', score: '1-4', word: 75, win: false },
        { h: 'avl', a: 'sun', t: 'JACKSON TO SCORE', score: '0-0', word: 82, win: false },
      ],
      stamp: { word: 89, win: false },
      note: { word: 100, text: 'CITY + CHELSEA PL PICKS: 0 FOR 7' } },
  ],
  outro: { from: 111, line: '6 OF 9 LEGS · 2 OF 3 CARDS', record: { word: 117, label: 'SEASON', value: '51-19' },
    banner: { word: 133, text: "FOLLOW SO YOU DON'T MISS THEM" },
    next: [{ word: 121, day: 'SERIES', text: 'PICK OF THE WEEKEND 5-0' }, { word: 124, day: 'TUE', text: 'CHAMPIONS LEAGUE PICKS' }, { word: 129, day: 'THU', text: 'DATA STORY' }] },
  emph: ['PERFECT.', 'DEAD', 'LANDED.', 'FOUR.', 'BUST.', 'ZERO', 'TRUST', 'FIFTY', 'FOLLOW'],
};
