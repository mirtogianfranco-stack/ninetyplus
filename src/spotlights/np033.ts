import type { SpotlightSpec } from '../templates/SpotlightTemplate';
import words from '../../video-projects/np-033/vo/words.json';

// NP-033 Pick of the Weekend #4: Spain v England, 3+ GOALS. Nations League, Sun 15 Nov 2026, 2:45 PM ET (19:45Z).
// Sources: ESPN uefa.nations results through 13 Nov (tools/espn-form.py, video-projects/intl-1112/form_nations_1114.json):
// Spain 5-0-0, 14 scored; England 16 scored in 5; England 2-3 Spain at Wembley, 26 Sep 2026.
export const spec: SpotlightSpec = {
  kind: 'spotlight', dir: 'np-033', words,
  topline: 'NINETY PLUS · RECORD 43-16',
  mark: { small: 'PICK OF THE', big: 'WEEKEND', seal: '#4' },
  badge: 'PICK OF THE WEEKEND #4',
  matchup: { h: 'esp', a: 'eng', line: 'NATIONS LEAGUE · SUN 2:45 PM ET' },
  scenes: [
    { from: 11, crest: 'esp', glow: 'rgba(200,16,46,0.8)', label: 'SPAIN · 5 GAMES', claim: ['SPAIN', 'PERFECT', 'AND SCORING'],
      devices: [
        { kind: 'big', word: 15, value: '14', label: 'SPAIN GOALS IN 5 GAMES', top: 900 },
        { kind: 'form', word: 21, label: 'SPAIN · NATIONS LEAGUE', results: ['W', 'W', 'W', 'W', 'W'], top: 700 },
      ] },
    { from: 24, crest: 'eng', glow: 'rgba(255,255,255,0.6)', label: 'ENGLAND · 5 GAMES', claim: ['ENGLAND', 'SCORE', 'EVEN MORE'],
      devices: [
        { kind: 'big', word: 27, value: '16', label: 'ENGLAND GOALS IN 5 GAMES', top: 900 },
        { kind: 'chips', word: 35, items: [{ text: 'ENGLAND 2-3 SPAIN', tag: 'SEPT' }], top: 700 },
      ] },
  ],
  reveal: { from: 40, pills: [{ text: '3+ GOALS', word: 43 }] },
  outro: { from: 46, record: { word: 51, label: 'SERIES RECORD', value: '3-0' }, banners: [{ word: 54, text: 'RIDING WITH US? COMMENT' }] },
  emph: ['FOUR,', 'FOURTEEN', 'SIXTEEN.', 'THREE', 'PLUS', 'COMMENT'],
};
