import type { SpotlightSpec } from '../templates/SpotlightTemplate';
import words from '../../video-projects/np-045/vo/words.json';

// NP-045 Pick of the Weekend #6: Columbus Crew v Inter Miami, MESSI TO SCORE. MLS playoffs round one, game 2.
// Fri 27 Nov 2026, 8:00 PM ET (Sat 01:00Z). Owner's pick. Sources: ESPN usa.1 scoreboards + scoring plays, 22 Feb - 21 Nov 2026
// (video-projects/wk-1128/messi_games.json): Messi 26 goals, scored in 18 of Miami's 35 games; scored 33' in Columbus 2-1 Miami
// (27 Sep), Miami's last visit to Columbus. Game 1: Inter Miami 0-3 Columbus (21 Nov), ESPN note "CLB leads series 1-0".
// Best of three: a Miami defeat ends their season. Season record 55-20, Pick of the Weekend 5-0.
export const spec: SpotlightSpec = {
  kind: 'spotlight', dir: 'np-045', words,
  topline: 'NINETY PLUS · RECORD 55-20',
  mark: { small: 'PICK OF THE', big: 'WEEKEND', seal: '#6' },
  badge: 'PICK OF THE WEEKEND #6',
  matchup: { h: 'clb', a: 'mia', line: 'MLS PLAYOFFS · FRI 8:00 PM ET' },
  scenes: [
    { from: 12, crest: 'mia', glow: 'rgba(247,181,205,0.8)', label: 'GAME 1 · AT HOME', claim: ['WIN', 'OR GO', 'HOME'],
      devices: [
        { kind: 'big', word: 18, value: '0-3', label: 'MIAMI v COLUMBUS · GAME 1', color: 'red', top: 900 },
        { kind: 'big', word: 24, value: '1-0', label: 'COLUMBUS LEAD · BEST OF THREE', color: 'gold', top: 700 },
      ] },
    { from: 30, crest: 'mia', glow: 'rgba(247,181,205,0.8)', label: 'LIONEL MESSI · THIS SEASON', claim: ['LIONEL', 'MESSI', 'DELIVERS'],
      devices: [
        { kind: 'big', word: 33, value: '26', label: 'GOALS THIS SEASON', top: 900 },
        { kind: 'big', word: 42, value: '18/35', label: 'GAMES WITH A MESSI GOAL', top: 700 },
      ] },
    { from: 47, crest: 'clb', glow: 'rgba(254,240,0,0.7)', label: 'LAST TRIP TO COLUMBUS', claim: ['HE SCORED', 'IN', 'COLUMBUS'],
      devices: [{ kind: 'big', word: 49, value: "33'", label: 'MESSI GOAL · COLUMBUS 2-1 MIAMI, 27 SEP', top: 900 }] },
  ],
  reveal: { from: 57, pills: [{ text: 'MESSI TO SCORE', word: 61 }] },
  outro: { from: 65, record: { word: 70, label: 'SERIES RECORD', value: '5-0' }, banners: [{ word: 76, text: 'RIDING WITH US? COMMENT' }] },
  emph: ['SIX,', 'OVER.', 'TWENTY', 'EIGHTEEN', 'SCORED.', 'HOME.', 'COMMENT'],
};
