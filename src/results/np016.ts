import type { ResultsSpec } from '../templates/ResultsTemplate';
import words from '../../video-projects/np-016/vo/words.json';

// NP-016 weekend results rebuilt on the Results template (proof; the posted video is mockups/WeekendResults016).
export const spec: ResultsSpec = {
  kind: 'results', dir: 'np-016', words,
  topline: 'NINETY PLUS · WEEKEND RESULTS',
  intro: { title: ['EVERY CARD', 'GRADED'], items: ['PICK OF THE WEEKEND', 'PREMIER LEAGUE CARD', 'BEST OF THE REST', 'EL CLÁSICO'] },
  cards: [
    { from: 6, header: 'PICK OF THE WEEKEND #1', title: ['PICK OF THE', 'WEEKEND'], titleColor: 'gold', tag: 'SERIE A', gold: true,
      rows: [{ h: 'laz', a: 'par', t: 'LAZIO TO WIN', score: '2-1', word: 11, win: true }], stamp: { word: 12, win: true }, note: { word: 12, text: 'SERIES RECORD 1-0' } },
    { from: 13, header: 'SAT + SUN', title: ['PREMIER', 'LEAGUE'], tag: '4 LEGS',
      rows: [
        { h: 'cry', a: 'new', t: 'NEWCASTLE TO WIN', score: '0-2', word: 17, win: true },
        { h: 'liv', a: 'bha', t: 'ISAK TO SCORE', score: "21'", word: 20, win: true },
        { h: 'che', a: 'tot', t: '3+ GOALS', score: '0-2', word: 27, win: false },
        { h: 'liv', a: 'bha', t: 'BOTH TEAMS SCORE', score: '2-0', word: 31, win: false },
      ], stamp: { word: 32, win: false } },
    { from: 33, header: 'GER · ITA · ESP', title: ['BEST OF THE', 'REST'], titleColor: 'green', tag: '3 LEGS',
      rows: [
        { h: 'atm', a: 'dep', t: 'ATLÉTICO TO WIN', score: '1-0', word: 37, win: true },
        { h: 'int', a: 'fio', t: 'INTER TO WIN', score: '2-1', word: 38, win: true },
        { h: 'tsg', a: 'b04', t: '3+ GOALS', score: '3-0', word: 40, win: true },
      ], stamp: { word: 49, win: true }, goals: { word: 44, crest: 'tsg', times: ["79'", "89'", "90+5'"] } },
    { from: 50, header: 'LALIGA · CAMP NOU', title: ['EL', 'CLÁSICO'], titleColor: 'gold', tag: 'BARÇA 1-2 MADRID', gold: true,
      rows: [
        { h: 'bar', a: 'rma', t: 'BOTH TEAMS SCORE', score: '1-2', word: 54, win: true },
        { h: 'bar', a: 'rma', t: 'BARÇA TO WIN', score: '1-2', word: 57, win: false },
      ], stamp: { word: 58, win: false } },
  ],
  outro: { from: 59, line: '2 OF 4 CARDS · WEEKEND 5-3', record: { word: 59, label: 'SEASON', value: '21-8' }, banner: { word: 66, text: "FOLLOW FOR NEXT WEEKEND'S PICKS" } },
  emph: ['GRADED.', 'LANDED.', 'BUST.', 'SEVENTY', 'TWENTY', 'FOLLOW'],
};
