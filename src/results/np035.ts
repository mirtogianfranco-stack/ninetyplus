import type { ResultsSpec } from '../templates/ResultsTemplate';
import words from '../../video-projects/np-035/vo/words.json';

// NP-035 Pick of the Weekend #4 results (np-033 double): both legs won, LANDED. Series 3-0 -> 4-0. Season 43-16 -> 45-16.
// Sources: ESPN uefa.nations scoreboards + scoring plays, Sun 15 Nov 2026 (video-projects/intl-1112/results.md):
// France 2-1 Turkiye; Spain 2-3 England (5 goals).
export const spec: ResultsSpec = {
  kind: 'results', dir: 'np-035', words,
  topline: 'NINETY PLUS · PICK OF THE WEEKEND RESULTS',
  intro: { title: ['THE DOUBLE', 'GRADED'], items: ['PICK OF THE WEEKEND #4'] },
  cards: [
    { from: 7, header: 'PICK OF THE WEEKEND #4', title: ['PICK OF THE', 'WEEKEND'], titleColor: 'gold', tag: 'THE DOUBLE', gold: true,
      rows: [
        { h: 'fra', a: 'tur', t: 'FRANCE TO WIN', score: '2-1', word: 14, win: true },
        { h: 'esp', a: 'eng', t: '2+ GOALS', score: '2-3', word: 24, win: true },
      ],
      note: { word: 22, text: '5 GOALS · NEEDED 2' },
      stamp: { word: 31, win: true } },
  ],
  outro: { from: 32, line: 'PICK OF THE WEEKEND · 4 FROM 4', record: { word: 40, label: 'SEASON', value: '45-16' },
    banner: { word: 53, text: "FOLLOW SO YOU DON'T MISS THEM" },
    next: [{ word: 37, day: 'SERIES', text: 'PICK OF THE WEEKEND 4-0' }, { word: 47, day: 'FRI', text: 'PREMIER LEAGUE PICKS' }] },
  emph: ['PERFECT.', 'FIVE.', 'LANDED.', 'FOUR', 'FORTY', 'FOLLOW'],
};
