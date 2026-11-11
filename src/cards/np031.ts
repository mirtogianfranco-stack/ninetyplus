import type { CardSpec } from '../templates/CardTemplate';
import words from '../../video-projects/np-031/vo/words.json';

// NP-031 Nations League card, Thu 12 / Fri 13 Nov 2026. Sources: ESPN uefa.nations results Sep-Oct 2026 (tools/espn-form.py,
// video-projects/intl-1112/form_nations.json), 4 games each: Turkiye 0-0-4 (2-11); Croatia 14 conceded (lost 0-7 to England);
// Spain 4-0-0 (12-5); Netherlands BTTS in 4 of 4. Kick-offs ESPN (17:00Z, 19:45Z = 12:00 PM, 2:45 PM EST).
export const spec: CardSpec = {
  dir: 'np-031',
  words,
  title: ['NATIONS', 'LEAGUE'],
  tag: 'INTERNATIONAL BREAK',
  record: '40-15',
  fan: { left: { crest: 'eng' }, right: { crest: 'esp' }, centers: ['bel', 'ned'], glows: ['rgba(255,255,255,0.6)', 'rgba(200,16,46,0.75)'] },
  picks: [
    {
      from: 8, h: 'tur', a: 'bel', time: 'THU 12:00 PM', hero: { crest: 'bel', glow: 'rgba(227,6,19,0.75)' },
      claim: ['TÜRKIYE', 'LOST', 'ALL FOUR'], claimColor: 'red', pill: 'BELGIUM WIN OR DRAW', pillWord: 14,
      devices: [{ kind: 'form', word: 10, label: 'TÜRKIYE · NATIONS LEAGUE', results: ['L', 'L', 'L', 'L'] }],
    },
    {
      from: 18, h: 'eng', a: 'cro', time: 'THU 2:45 PM', hero: { crest: 'eng', glow: 'rgba(255,255,255,0.6)' },
      claim: ['CROATIA', 'LEAK', 'GOALS'], claimColor: 'red', pill: '3+ GOALS', pillWord: 27, row: 'ENGLAND v CROATIA 3+ GOALS',
      devices: [{ kind: 'big', word: 21, value: '14', label: 'GOALS CROATIA HAVE CONCEDED IN 4', color: 'red' }],
    },
    {
      from: 30, h: 'cze', a: 'esp', time: 'THU 2:45 PM', hero: { crest: 'esp', glow: 'rgba(200,16,46,0.75)' },
      claim: ['SPAIN', 'PERFECT', 'SO FAR'], pill: 'SPAIN TO WIN', pillWord: 36,
      devices: [{ kind: 'form', word: 32, label: 'SPAIN · NATIONS LEAGUE', results: ['W', 'W', 'W', 'W'] }],
    },
    {
      from: 39, h: 'ned', a: 'gre', time: 'FRI 2:45 PM', hero: { crest: 'ned', glow: 'rgba(255,121,0,0.75)' },
      claim: ['DUTCH GAMES', 'GOALS AT', 'BOTH ENDS'], pill: 'BOTH TEAMS SCORE', pillWord: 51, row: 'HOLLAND v GREECE BOTH SCORE',
      devices: [{ kind: 'form', word: 43, label: 'BOTH TEAMS SCORED · NETHERLANDS GAMES', results: ['✓', '✓', '✓', '✓'], top: 700 }],
    },
  ],
  outroWord: 54,
  commentWord: 58,
  tints: ['#1a2a6a', '#6a0a1a', '#1a2a7a', '#7a0a1a', '#7a3a0a', '#1a2a6a'],
  emph: ['INTERNATIONAL', 'FOUR', 'FOURTEEN', 'SPAIN', 'EVERY', 'COMMENT'],
};
