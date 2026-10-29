import type { ResultsSpec } from '../templates/ResultsTemplate';
import words from '../../video-projects/np-021/vo/words.json';

// NP-021 Midweek results for np-017: 4/4 LANDED. Season 21-8 -> 25-8.
// Sources: ESPN scoreboards + scoring plays: Dortmund 3-2 Werder (Sabitzer 90+3', DFB-Pokal 27 Oct); Monza 1-4 Napoli (28 Oct);
// Liverpool 1-1 Chelsea after 90 (Rogers 40', Gakpo 43'; Chelsea won on penalties, Carabao Cup 28 Oct);
// Fiorentina v Atalanta 3 goals by 61' (De Ketelaere 41', Njie 53', João Mário 61'), 29 Oct.
export const spec: ResultsSpec = {
  kind: 'results', dir: 'np-021', words,
  topline: 'NINETY PLUS · MIDWEEK RESULTS',
  intro: { title: ['MIDWEEK CARD', 'GRADED'], items: ['MIDWEEK CARD · 4 LEGS'] },
  cards: [
    { from: 7, header: 'CUP · SERIE A', title: ['MIDWEEK', 'CARD'], titleColor: 'red', tag: '4 LEGS',
      rows: [
        { h: 'bvb', a: 'svw', t: 'DORTMUND TO WIN', score: '3-2', word: 9, win: true },
        { h: 'mon', a: 'nap', t: 'BOTH TEAMS SCORE', score: '1-4', word: 20, win: true },
        { h: 'liv', a: 'che', t: 'BOTH TEAMS SCORE', score: '1-1', word: 29, win: true },
        { h: 'fio', a: 'ata', t: '3+ GOALS', score: "3 BY 61'", word: 39, win: true },
      ],
      goals: { word: 13, crest: 'bvb', times: ["90+3'"] },
      stamp: { word: 46, win: true } },
  ],
  outro: { from: 50, line: '4 OF 4 LEGS · MIDWEEK CARD', record: { word: 50, label: 'SEASON', value: '25-8' }, banner: { word: 57, text: 'WEEKEND CARD DROPS FRIDAY · FOLLOW' } },
  emph: ['LANDED.', 'NINETY', 'FOUR', 'SIXTY', 'TWENTY', 'FOLLOW'],
};
