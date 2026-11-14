import type { ResultsSpec } from '../templates/ResultsTemplate';
import words from '../../video-projects/np-032/vo/words.json';

// NP-032 Nations League card review (np-031): 3/4, BUST. Season 40-15 -> 43-16.
// Sources: ESPN uefa.nations scoreboards + scoring plays + commentary (video-projects/intl-1112/results.md): Turkiye 1-2 Belgium;
// England 2-1 Croatia (Kane pen 64' = 3rd goal); Czechia 0-2 Spain; Netherlands 7-0 Greece (ESPN commentary 24': Ioannidis goal
// overturned by VAR, handball, at 3-0).
export const spec: ResultsSpec = {
  kind: 'results', dir: 'np-032', words,
  topline: 'NINETY PLUS · NATIONS LEAGUE RESULTS',
  intro: { title: ['EVERY LEG', 'GRADED'], items: ['NATIONS LEAGUE CARD · 4 LEGS'] },
  cards: [
    { from: 10, header: 'INTERNATIONAL BREAK', title: ['NATIONS', 'LEAGUE'], titleColor: 'red', tag: '4 LEGS',
      rows: [
        { h: 'tur', a: 'bel', t: 'BELGIUM WIN OR DRAW', score: '1-2', word: 19, win: true },
        { h: 'eng', a: 'cro', t: '3+ GOALS', score: '2-1', word: 28, win: true },
        { h: 'cze', a: 'esp', t: 'SPAIN TO WIN', score: '0-2', word: 34, win: true },
        { h: 'ned', a: 'gre', t: 'BOTH TEAMS SCORE', score: '7-0', word: 59, win: false },
      ],
      goals: { word: 41, crest: 'ned', times: ["6'", "12'", "18'"] },
      note: { word: 51, text: "GREECE GOAL RULED OUT · VAR 24'" },
      stamp: { word: 65, win: false } },
  ],
  outro: { from: 66, line: '3 OF 4 LEGS · NATIONS LEAGUE', record: { word: 66, label: 'SEASON', value: '43-16' },
    banner: { word: 86, text: "FOLLOW SO YOU DON'T MISS THEM" },
    next: [{ word: 73, day: 'SUN', text: 'UNITED + POCHETTINO' }, { word: 80, day: 'NOV 20', text: 'PICKS ARE BACK' }] },
  emph: ['CLOSE.', 'BEHIND', "KANE'S", 'VAR', 'BUST.', 'FOLLOW'],
};
