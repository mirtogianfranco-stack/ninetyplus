import type { SpotlightSpec } from '../templates/SpotlightTemplate';
import words from '../../video-projects/np-019/vo/words.json';

// NP-019 Pick of the Weekend #2: Milan v Inter, both teams score. Sat 31 Oct 2026, 3:45 PM ET, San Siro.
// Sources: Understat 2026-27 Serie A match history (pulled 26 Oct): Inter scored in 8/8 (23 goals), conceded in 6/8;
// Milan scored in 8/8 (16 goals). Kick-off ESPN ita.1 (19:45 UTC).
export const spec: SpotlightSpec = {
  kind: 'spotlight', dir: 'np-019', words,
  topline: 'NINETY PLUS · RECORD 25-8',
  mark: { small: 'PICK OF THE', big: 'WEEKEND', seal: '#2' },
  badge: 'PICK OF THE WEEKEND #2',
  matchup: { h: 'mil', a: 'int', line: 'SERIE A · SAT 3:45 PM ET · SAN SIRO' },
  scenes: [
    { from: 11, crest: 'int', glow: 'rgba(0,82,165,0.75)', label: 'INTER · 8 SERIE A GAMES', claim: ['INTER', 'ALWAYS', 'SCORE'],
      devices: [{ kind: 'form', word: 15, label: 'INTER SCORED IN EVERY GAME', results: ['✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓'], top: 700 }] },
    { from: 21, crest: 'mil', glow: 'rgba(251,9,11,0.7)', label: 'MILAN · 8 SERIE A GAMES', claim: ['MILAN', 'SCORE TOO', 'INTER LEAK'], claimColor: 'red',
      devices: [
        { kind: 'form', word: 21, label: 'MILAN SCORED IN EVERY GAME', results: ['✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓'], top: 700 },
        { kind: 'big', word: 29, value: '6/8', label: 'GAMES INTER HAVE CONCEDED IN', color: 'red', top: 900 },
      ] },
  ],
  reveal: { from: 35, pills: [{ text: 'BOTH TEAMS SCORE', word: 35 }] },
  outro: { from: 38, record: { word: 43, label: 'SERIES RECORD', value: '1-0' }, banners: [{ word: 46, text: 'RIDING WITH US? COMMENT' }] },
  emph: ['DERBY.', 'EVERY', 'MILAN.', 'SIX', 'SCORE.', 'COMMENT'],
};
