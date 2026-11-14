import type { SpotlightSpec } from '../templates/SpotlightTemplate';
import words from '../../video-projects/np-033/vo/words.json';

// NP-033 Pick of the Weekend #4, a double: France to win v Turkiye + Spain v England 2+ GOALS. Nations League, both Sun 15 Nov
// 2026, 2:45 PM ET (19:45Z). Owner's picks. Sources: ESPN uefa.nations results through 13 Nov (tools/espn-form.py,
// video-projects/intl-1112/form_nations_1114.json): Turkiye 0-0-5, 13 conceded; Spain and England scored in all 5 games each;
// every Spain game (5,5,4,3,2 goals) and every England game (5,2,7,3,3) had 2+ goals.
export const spec: SpotlightSpec = {
  kind: 'spotlight', dir: 'np-033', words,
  topline: 'NINETY PLUS · RECORD 43-16',
  mark: { small: 'PICK OF THE', big: 'WEEKEND', seal: '#4' },
  badge: 'PICK OF THE WEEKEND #4',
  matchup: { h: 'fra', a: 'esp', sep: '+', line: 'NATIONS LEAGUE DOUBLE · SUN 2:45 PM ET' },
  scenes: [
    { from: 11, crest: 'fra', glow: 'rgba(0,35,149,0.85)', label: 'FRANCE v TÜRKIYE', claim: ['TÜRKIYE', 'LOST', 'ALL FIVE'], claimColor: 'red',
      devices: [
        { kind: 'form', word: 15, label: 'TÜRKIYE · NATIONS LEAGUE', results: ['L', 'L', 'L', 'L', 'L'], top: 700 },
        { kind: 'big', word: 19, value: '13', label: 'GOALS TÜRKIYE HAVE CONCEDED', color: 'red', top: 900 },
      ] },
    { from: 22, crest: 'esp', glow: 'rgba(200,16,46,0.8)', label: 'SPAIN v ENGLAND', claim: ['SPAIN + ENGLAND', 'GOALS IN', 'EVERY GAME'],
      devices: [
        { kind: 'form', word: 27, label: '2+ GOALS · SPAIN GAMES', results: ['✓', '✓', '✓', '✓', '✓'], top: 700 },
        { kind: 'form', word: 34, label: '2+ GOALS · ENGLAND GAMES', results: ['✓', '✓', '✓', '✓', '✓'], top: 880 },
      ] },
  ],
  reveal: { from: 44, pills: [{ text: 'FRANCE TO WIN', word: 44 }, { text: 'SPAIN v ENGLAND 2+ GOALS', word: 50 }] },
  outro: { from: 53, record: { word: 58, label: 'SERIES RECORD', value: '3-0' }, banners: [{ word: 61, text: 'RIDING WITH US? COMMENT' }] },
  emph: ['DOUBLE.', 'FIVE', 'THIRTEEN.', 'EVERY', 'PLUS', 'COMMENT'],
};
