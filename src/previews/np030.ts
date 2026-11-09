import type { PreviewSpec } from '../templates/PreviewTemplate';
import words from '../../video-projects/np-030/vo/words.json';

// NP-030 DATA STORY #1, remade after round 10 (9 Nov 2026): "Are Brighton for real?" 16:9 (NP030) + TikTok 9:16 (NP030V).
// Sources (ESPN, all 100 games through 8 Nov; video-projects/np-030/research/epl_shots_espn_1108.json + form_eng_1109.json):
// table Arsenal 27, Brighton 22, City 21, Liverpool 18, Chelsea 16; Brighton 26-7, +19 (next Arsenal +10), 7 clean sheets (= Arsenal);
// shots 16.9 v 11.4 a game; on target 5.2 a game (4th: Chelsea 5.6, United 5.4, City 5.4); league 32.0% of shots on target scored,
// Brighton 50% (26/52, highest), opponents 21% (7/33); GD at average rates = (52 - 33) x 0.320 = +6.1. 14 of 26 goals in 4-0 Villa,
// 5-0 at Coventry, 5-0 Palace; beat Arsenal 3-0, won 1-0 at City, beat Brentford 2-0 (Igor Thiago sent off 23'). 11 scorers, max 4 (Gross).
const ch = (from: number, label: string, topic: [string, string]) => ({ from, label, topic, league: 'PREMIER LEAGUE', h: 'bha', a: 'bha', hName: 'BRIGHTON', aName: 'BRIGHTON', time: '', glow: ['rgba(0,87,184,0.8)', 'rgba(0,87,184,0.8)'] as [string, string] });
export const spec: PreviewSpec = {
  kind: 'preview', dir: 'np-030', words,
  title: ['ARE BRIGHTON', 'FOR REAL?'],
  dates: 'DATA STORY · UPDATED 9 NOV',
  record: '40-15',
  intro: { listWord: 29 },
  chapters: [
    { ...ch(51, 'The hype', ['THE', 'HYPE']), panels: [
      { kind: 'table', word: 55, label: 'PREMIER LEAGUE · AFTER 10 GAMES', rows: [
        { pos: 1, crest: 'ars', team: 'ARSENAL', pts: 27 }, { pos: 2, crest: 'bha', team: 'BRIGHTON', pts: 22, hl: true },
        { pos: 3, crest: 'mci', team: 'MAN CITY', pts: 21 }, { pos: 4, crest: 'liv', team: 'LIVERPOOL', pts: 18 }, { pos: 5, crest: 'che', team: 'CHELSEA', pts: 16 }] },
      { kind: 'stat', word: 76, value: '26', label: 'GOALS · MOST IN THE LEAGUE' },
      { kind: 'stat', word: 88, value: '+19', label: 'GOAL DIFFERENCE · BEST IN THE LEAGUE BY 9', sub: '26 SCORED · 7 CONCEDED', color: 'green' },
      { kind: 'stat', word: 107, value: '7', label: 'CLEAN SHEETS · LEVEL WITH ARSENAL FOR THE MOST', color: 'green' },
    ] },
    { ...ch(123, 'The case for', ['THE CASE', 'FOR']), panels: [
      { kind: 'stat', word: 128, value: '3-0', label: "ARSENAL'S ONLY LEAGUE DEFEAT · AT BRIGHTON", focus: 'ars' },
      { kind: 'stat', word: 142, value: '1-0', label: 'WON AT MAN CITY · 31 OCT', focus: 'mci' },
      { kind: 'stat', word: 154, value: '2-0', label: 'BEAT BRENTFORD · 8 NOV', sub: "BRENTFORD DOWN TO 10 MEN FROM 23'", focus: 'bre' },
      { kind: 'compare', word: 175, label: 'SHOTS PER GAME', names: ['BRIGHTON', 'OPPONENTS'], crests: ['bha', ''], h: 16.9, a: 11.4, better: 'high' },
      { kind: 'stat', word: 193, value: '5.2', label: 'SHOTS ON TARGET PER GAME · 4TH IN THE LEAGUE' },
    ] },
    { ...ch(209, 'The catch', ['THE', 'CATCH']), panels: [
      { kind: 'stat', word: 216, value: '32%', label: 'OF SHOTS ON TARGET BECOME GOALS · LEAGUE AVERAGE' },
      { kind: 'compare', word: 231, label: 'SHOTS ON TARGET THAT GO IN', names: ['BRIGHTON', 'LEAGUE AVERAGE'], crests: ['bha', ''], h: 50, a: 32, fmt: '#%', better: 'high' },
      { kind: 'compare', word: 245, label: 'SHOTS ON TARGET THAT GO IN · AGAINST', names: ['V BRIGHTON', 'LEAGUE AVERAGE'], crests: ['bha', ''], h: 21, a: 32, fmt: '#%', better: 'low' },
      { kind: 'compare', word: 263, label: 'GOAL DIFFERENCE', names: ['ACTUAL', 'AT AVERAGE RATES'], crests: ['bha', ''], h: 19, a: 6, fmt: '+#', better: 'high' },
      { kind: 'stat', word: 283, value: '14/26', label: 'GOALS IN JUST THREE GAMES', sub: '4-0 VILLA · 5-0 AT COVENTRY · 5-0 PALACE', color: 'red', focus: 'bha' },
      { kind: 'point', word: 308, tag: 'SPREAD THIN', text: ['11 SCORERS', 'NOBODY HAS', 'MORE THAN 4'], color: 'gold' },
    ] },
    { ...ch(319, 'The verdict', ['THE', 'VERDICT']), panels: [
      { kind: 'point', word: 323, tag: 'FOR REAL', text: ['BEAT ARSENAL', 'AND CITY', 'CONTROL GAMES'], color: 'green' },
      { kind: 'point', word: 336, tag: 'THE RISK', text: ['FINISHING', 'RUNNING HOT', 'USUALLY COOLS'], color: 'red' },
      { kind: 'point', word: 349, tag: 'OUR VERDICT', text: ['TOP FOUR:', 'FOR REAL', 'TITLE: NOT YET'], color: 'gold' },
    ] },
  ],
  outro: { from: 361, lines: ['A NEW DATA STORY EVERY WEEK', 'FOLLOW · BACKED BY THE NUMBERS'], banner: { word: 369, text: 'COMMENT: ARE BRIGHTON FOR REAL?' } },
  tints: ['#0a2a6a', '#0a2a7a', '#1a3a7a', '#5a0a1a', '#0a3a5a', '#0a2a6a'],
};
