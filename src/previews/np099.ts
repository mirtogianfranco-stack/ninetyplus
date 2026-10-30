import type { PreviewSpec } from '../templates/PreviewTemplate';
import words from '../../video-projects/np-099/vo/words.json';

// NP-099 PILOT of the long-form Weekend Preview template (two games, ~66s; a real one runs 6-10 min with 5-8 games).
// Sources (pulled 30 Oct 2026): Understat 2026-27 Bundesliga: Bayern 3.70 xG/g (most in the league; Leipzig next 2.46),
// Dortmund 1.99 xG/g, 4 conceded in 7; Olise 6 goals in 7 (3.98 xG). ESPN ger.1 table: Bayern 17, Dortmund 17, Freiburg 13,
// Leverkusen 13. Understat Serie A: Inter WWWWDWWWW 25 scored, conceded in 6/9; Milan WWDDWDWWL 18 scored; both scored in 9/9.
export const spec: PreviewSpec = {
  kind: 'preview', dir: 'np-099', words,
  title: ['WEEKEND', 'PREVIEW'],
  dates: 'SAT 31 OCT - SUN 1 NOV',
  record: '25-8',
  intro: { listWord: 7 },
  chapters: [
    {
      from: 18, label: 'Bayern v Dortmund', league: 'BUNDESLIGA', h: 'bay', a: 'bvb', hName: 'BAYERN', aName: 'DORTMUND', time: 'SAT 1:30 PM', venue: 'ALLIANZ ARENA',
      glow: ['rgba(220,5,45,0.75)', 'rgba(253,225,0,0.6)'],
      panels: [
        { kind: 'table', word: 25, label: 'BUNDESLIGA · TOP FOUR', rows: [
          { pos: 1, crest: 'bay', team: 'BAYERN', pts: 17, hl: true }, { pos: 2, crest: 'bvb', team: 'DORTMUND', pts: 17, hl: true },
          { pos: 3, crest: 'scf', team: 'FREIBURG', pts: 13 }, { pos: 4, crest: 'b04', team: 'LEVERKUSEN', pts: 13 }] },
        { kind: 'compare', word: 38, label: 'EXPECTED GOALS A GAME', h: 3.7, a: 1.99, better: 'high', focus: 'bay' },
        { kind: 'player', word: 57, name: 'MICHAEL OLISE', crest: 'bay', lines: [['6', 'GOALS'], ['7', 'GAMES'], ['3.98', 'EXPECTED GOALS']] },
        { kind: 'point', word: 65, tag: 'THE RISK', text: ['DORTMUND HAVE', 'CONCEDED 4', 'IN 7 GAMES'], focus: 'bvb' },
        { kind: 'pick', word: 78, text: 'BAYERN TO WIN', note: 'SAT 1:30 PM ET · ALLIANZ ARENA', focus: 'bay' },
      ],
    },
    {
      from: 87, label: 'Milan v Inter', league: 'SERIE A', h: 'mil', a: 'int', hName: 'MILAN', aName: 'INTER', time: 'SAT 3:45 PM', venue: 'SAN SIRO',
      glow: ['rgba(251,9,11,0.7)', 'rgba(0,82,165,0.75)'],
      panels: [
        { kind: 'form', word: 91, label: 'LAST 9 SERIE A GAMES', rows: [{ crest: 'int', results: ['W', 'W', 'W', 'W', 'D', 'W', 'W', 'W', 'W'] }, { crest: 'mil', results: ['W', 'W', 'D', 'D', 'W', 'D', 'W', 'W', 'L'] }], focus: 'int' },
        { kind: 'compare', word: 103, label: 'GOALS SCORED · BOTH HAVE SCORED IN 9 OF 9', h: 18, a: 25, better: 'high', focus: 'mil' },
        { kind: 'stat', word: 119, value: '6/9', label: 'GAMES INTER HAVE CONCEDED IN', color: 'red', focus: 'int' },
        { kind: 'pick', word: 128, text: 'BOTH TEAMS SCORE', note: 'SAT 3:45 PM ET · SAN SIRO', focus: 'mil' },
      ],
    },
  ],
  recap: { from: 137, groups: [
    { title: ['BEST OF', 'THE REST'], tag: 'EUROPE', rows: [{ h: 'bay', a: 'bvb', t: 'BAYERN TO WIN', time: 'SAT 1:30 PM' }] },
    { title: ['PICK OF THE', 'WEEKEND'], tag: 'SERIE A', rows: [{ h: 'mil', a: 'int', t: 'BOTH TEAMS SCORE', time: 'SAT 3:45 PM' }] },
  ] },
  outro: { from: 152, lines: ['EVERY PICK DROPS AS A SHORT BEFORE KICK-OFF', 'SUBSCRIBE · 18+ · OPINIONS ONLY'], banner: { word: 163, text: 'COMMENT YOUR PICK' } },
};
