import type { SpotlightSpec } from '../templates/SpotlightTemplate';
import words from '../../video-projects/np-028/vo/words.json';

// NP-028 Pick of the Weekend #3: Atletico v Barcelona, 3+ GOALS. Sun 8 Nov 2026, 3:00 PM ET (20:00Z), Metropolitano.
// Sources: ESPN esp.1 results through 5 Nov (tools/espn-form.py, video-projects/wk-1107/form_esp.1.json): Barcelona 46 scored in 11;
// 3+ goals in 10 of 11 (only 2-0 v Athletic under), all 5 away games 3+; Atletico won last 5 (WWWWW).
export const spec: SpotlightSpec = {
  kind: 'spotlight', dir: 'np-028', words,
  topline: 'NINETY PLUS · RECORD 33-13',
  mark: { small: 'PICK OF THE', big: 'WEEKEND', seal: '#3' },
  badge: 'PICK OF THE WEEKEND #3',
  matchup: { h: 'atm', a: 'bar', line: 'LALIGA · SUN 3:00 PM ET · METROPOLITANO' },
  scenes: [
    { from: 11, crest: 'bar', glow: 'rgba(165,0,68,0.8)', label: 'BARÇA · 11 GAMES', claim: ['BARÇA', 'GOALS', 'EVERYWHERE'],
      devices: [
        { kind: 'big', word: 15, value: '46', label: 'GOALS IN 11 GAMES', top: 900 },
        { kind: 'form', word: 28, label: '3+ GOALS · BARÇA GAMES', results: ['✓', '✗', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓'], top: 700 },
      ] },
    { from: 36, crest: 'atm', glow: 'rgba(203,53,36,0.8)', label: 'ATLÉTICO · LAST 5', claim: ['ATLÉTICO', 'WON FIVE', 'STRAIGHT'], claimColor: 'red',
      devices: [{ kind: 'form', word: 38, label: 'ATLÉTICO · LAST 5 LALIGA GAMES', results: ['W', 'W', 'W', 'W', 'W'], top: 700 }] },
  ],
  reveal: { from: 50, pills: [{ text: '3+ GOALS', word: 53 }] },
  outro: { from: 56, record: { word: 61, label: 'SERIES RECORD', value: '2-0' }, banners: [{ word: 64, text: 'RIDING WITH US? COMMENT' }] },
  emph: ['THREE,', 'FORTY', 'TEN', 'FIVE', 'PLUS', 'COMMENT'],
};
