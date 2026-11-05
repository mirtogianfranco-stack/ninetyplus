import type { PreviewSpec } from '../templates/PreviewTemplate';
import words from '../../video-projects/np-025/vo/words.json';

// NP-025 DATA STORY #1 (long-form, 16:9): "Are Brighton for real?" Posted Thu 5 Nov 2026.
// Sources (ESPN, pulled 4-5 Nov; research in video-projects/np-025/research): results + table from tools/espn-form.py
// (Arsenal 24, City 21, Brighton 19, Chelsea 16, Liverpool 15; Brighton 24-7, +17, next best City +10; 6 clean sheets = Arsenal).
// Shots from ESPN match summaries, all 90 games (epl_shots_espn.json): league 32.2% of shots on target scored; Brighton 52%
// (46 on target, 24 goals), opponents 21% (33 on target, 7 goals); shots 16.6 v 12.1 a game; on target 5.1 a game (Chelsea 5.8,
// City 5.6 higher). "GD at average rates" = 46 x 0.322 - 33 x 0.322 = +4.2. Brighton results: 4-0 Villa, 5-0 at Coventry,
// 5-0 Palace (14 of 24 goals); beat Arsenal 3-0 (Arsenal's only loss), won 1-0 at City. Scorers: 11 players, max 3 (brighton_espn.json).
const ch = (from: number, label: string, topic: [string, string]) => ({ from, label, topic, league: 'PREMIER LEAGUE', h: 'bha', a: 'bha', hName: 'BRIGHTON', aName: 'BRIGHTON', time: '', glow: ['rgba(0,87,184,0.8)', 'rgba(0,87,184,0.8)'] as [string, string] });
export const spec: PreviewSpec = {
  kind: 'preview', dir: 'np-025', words,
  title: ['ARE BRIGHTON', 'FOR REAL?'],
  dates: 'DATA STORY · 5 NOV 2026',
  record: '33-13',
  intro: { listWord: 29 },
  chapters: [
    { ...ch(51, 'The hype', ['THE', 'HYPE']), panels: [
      { kind: 'table', word: 55, label: 'PREMIER LEAGUE · AFTER 9 GAMES', rows: [
        { pos: 1, crest: 'ars', team: 'ARSENAL', pts: 24 }, { pos: 2, crest: 'mci', team: 'MAN CITY', pts: 21 },
        { pos: 3, crest: 'bha', team: 'BRIGHTON', pts: 19, hl: true }, { pos: 4, crest: 'che', team: 'CHELSEA', pts: 16 }, { pos: 5, crest: 'liv', team: 'LIVERPOOL', pts: 15 }] },
      { kind: 'stat', word: 75, value: '24', label: 'GOALS · MOST IN THE LEAGUE' },
      { kind: 'stat', word: 87, value: '+17', label: 'GOAL DIFFERENCE · BEST IN THE LEAGUE BY 7', sub: '24 SCORED · 7 CONCEDED', color: 'green' },
      { kind: 'stat', word: 106, value: '6', label: 'CLEAN SHEETS · LEVEL WITH ARSENAL FOR THE MOST', color: 'green' },
    ] },
    { ...ch(122, 'The case for', ['THE CASE', 'FOR']), panels: [
      { kind: 'stat', word: 127, value: '3-0', label: "ARSENAL'S ONLY LEAGUE DEFEAT · AT BRIGHTON", focus: 'ars' },
      { kind: 'stat', word: 141, value: '1-0', label: 'WON AT MAN CITY · 31 OCT', focus: 'mci' },
      { kind: 'compare', word: 166, label: 'SHOTS PER GAME', names: ['BRIGHTON', 'OPPONENTS'], crests: ['bha', ''], h: 16.6, a: 12.1, better: 'high' },
      { kind: 'stat', word: 184, value: '5.1', label: 'SHOTS ON TARGET PER GAME · 3RD IN THE LEAGUE', sub: 'ONLY CHELSEA (5.8) AND MAN CITY (5.6) HIGHER' },
    ] },
    { ...ch(197, 'The catch', ['THE', 'CATCH']), panels: [
      { kind: 'stat', word: 204, value: '32%', label: 'OF SHOTS ON TARGET BECOME GOALS · LEAGUE AVERAGE' },
      { kind: 'compare', word: 219, label: 'SHOTS ON TARGET THAT GO IN', names: ['BRIGHTON', 'LEAGUE AVERAGE'], crests: ['bha', ''], h: 52, a: 32, fmt: '#%', better: 'high' },
      { kind: 'compare', word: 233, label: 'SHOTS ON TARGET THAT GO IN · AGAINST', names: ['V BRIGHTON', 'LEAGUE AVERAGE'], crests: ['bha', ''], h: 21, a: 32, fmt: '#%', better: 'low' },
      { kind: 'compare', word: 251, label: 'GOAL DIFFERENCE', names: ['ACTUAL', 'AT AVERAGE RATES'], crests: ['bha', ''], h: 17, a: 4, fmt: '+#', better: 'high' },
      { kind: 'stat', word: 271, value: '14/24', label: 'GOALS IN JUST THREE GAMES', sub: '4-0 VILLA · 5-0 AT COVENTRY · 5-0 PALACE', color: 'red', focus: 'bha' },
      { kind: 'point', word: 296, tag: 'SPREAD THIN', text: ['11 SCORERS', 'NOBODY HAS', 'MORE THAN 3'], color: 'gold' },
    ] },
    { ...ch(307, 'The verdict', ['THE', 'VERDICT']), panels: [
      { kind: 'point', word: 311, tag: 'FOR REAL', text: ['BEAT THE', 'TOP TWO', 'CONTROL GAMES'], color: 'green' },
      { kind: 'point', word: 324, tag: 'THE RISK', text: ['FINISHING', 'RUNNING HOT', 'USUALLY COOLS'], color: 'red' },
      { kind: 'point', word: 337, tag: 'OUR VERDICT', text: ['TOP SIX:', 'FOR REAL', 'TITLE: NOT YET'], color: 'gold' },
    ] },
  ],
  outro: { from: 349, lines: ['A NEW DATA STORY EVERY WEEK', 'SUBSCRIBE · BACKED BY THE NUMBERS'], banner: { word: 357, text: 'COMMENT: ARE BRIGHTON FOR REAL?' } },
  tints: ['#0a2a6a', '#0a2a7a', '#1a3a7a', '#5a0a1a', '#0a3a5a', '#0a2a6a'],
};
