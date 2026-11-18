import type { SpotlightSpec } from '../templates/SpotlightTemplate';
import words from '../../video-projects/np-039/vo/words.json';

// NP-039 Pick of the Weekend #5: Barcelona v Villarreal, 3+ GOALS. Sun 22 Nov 2026, 8:00 AM ET (13:00Z). Owner's pick.
// Sources: ESPN esp.1 results through 17 Nov (video-projects/wk-1121/form_esp.1.json): Barcelona 48 scored in 12, 3+ goals in 11 of 12
// (only 2-0 v Athletic under); Villarreal games 3+ goals in 7 of 12.
export const spec: SpotlightSpec = {
  kind: 'spotlight', dir: 'np-039', words,
  topline: 'NINETY PLUS · RECORD 45-16',
  mark: { small: 'PICK OF THE', big: 'WEEKEND', seal: '#5' },
  badge: 'PICK OF THE WEEKEND #5',
  matchup: { h: 'bar', a: 'vil', line: 'LALIGA · SUN 8:00 AM ET' },
  scenes: [
    { from: 12, crest: 'bar', glow: 'rgba(165,0,68,0.8)', label: 'BARÇA · 12 GAMES', claim: ['BARÇA', 'GOALS', 'EVERYWHERE'],
      devices: [
        { kind: 'big', word: 15, value: '48', label: 'GOALS IN 12 GAMES', top: 900 },
        { kind: 'form', word: 21, label: '3+ GOALS · BARÇA GAMES', results: ['✓', '✗', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓'], top: 700 },
      ] },
    { from: 32, crest: 'vil', glow: 'rgba(255,230,0,0.7)', label: 'VILLARREAL · 12 GAMES', claim: ['VILLARREAL', 'GAMES', 'OPEN UP'],
      devices: [{ kind: 'form', word: 37, label: '3+ GOALS · VILLARREAL GAMES', results: ['✓', '✓', '✗', '✓', '✓', '✓', '✓', '✗', '✗', '✓', '✗', '✗'], top: 700 }] },
  ],
  reveal: { from: 44, pills: [{ text: '3+ GOALS', word: 47 }] },
  outro: { from: 50, record: { word: 55, label: 'SERIES RECORD', value: '4-0' }, banners: [{ word: 58, text: 'RIDING WITH US? COMMENT' }] },
  emph: ['FIVE,', 'FORTY', 'ELEVEN', 'SEVEN', 'PLUS', 'COMMENT'],
};
