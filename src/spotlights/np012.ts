import type { SpotlightSpec } from '../templates/SpotlightTemplate';
import words from '../../video-projects/np-012/vo/words.json';

// NP-012 Pick of the Weekend #1 rebuilt on the Spotlight template (proof; the posted video is mockups/PickOfWeekend012).
export const spec: SpotlightSpec = {
  kind: 'spotlight', dir: 'np-012', words,
  topline: 'NINETY PLUS · NEW SERIES',
  mark: { small: 'PICK OF THE', big: 'WEEKEND', seal: '#1' },
  badge: 'PICK OF THE WEEKEND #1',
  matchup: { h: 'laz', a: 'par', line: 'SERIE A · SAT 2:45 PM ET' },
  scenes: [
    { from: 7, crest: 'laz', glow: 'rgba(135,216,247,0.75)', label: 'LAZIO AT HOME', claim: ['LAZIO', 'UNBEATEN'], claimColor: 'sky',
      devices: [{ kind: 'form', word: 9, label: '', results: ['W', 'W', 'W', 'D', 'W', 'W', 'W'], top: 620 }, { kind: 'big', word: 16, value: '4', label: 'GOALS CONCEDED IN 7 SERIE A GAMES', top: 760 }] },
    { from: 21, crest: 'par', glow: 'rgba(255,214,0,0.35)', dim: true, label: 'PARMA AWAY', claim: ['PARMA', "CAN'T SCORE"], claimColor: 'red',
      devices: [{ kind: 'big', word: 24, value: '1', label: 'GOAL IN 3 AWAY GAMES', color: 'red', top: 620 }, { kind: 'form', word: 31, label: '', results: ['L', 'L', 'D', 'L', 'W', 'L', 'L'], top: 880 }] },
  ],
  reveal: { from: 35, pills: [{ text: 'LAZIO TO WIN', word: 35 }] },
  outro: { from: 38, record: { word: 43, label: 'RECORD', value: '0-0' }, banners: [{ word: 46, text: 'RIDING WITH US? COMMENT' }] },
  emph: ['FIRST', 'UNBEATEN', 'FOUR', 'ONCE', 'FIVE', 'WIN.', 'NOW.', 'COMMENT'],
};
