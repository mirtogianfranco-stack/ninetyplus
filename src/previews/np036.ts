import type { PreviewSpec } from '../templates/PreviewTemplate';
import words from '../../video-projects/np-036/vo/words.json';

// NP-036 DATA STORY #3: "What's wrong with Man City?" 16:9 (NP036) + TikTok 9:16 (NP036V). Wed 18 Nov 2026.
// Sources: ESPN eng.1 match summaries for City's 10 games (video-projects/np-036/research/city_games_espn.json) and table
// (form_eng.1.json, through 17 Nov). First 7 (all W): 19-7, shots 102 (14.6/g), allowed 80 (11.4/g), on target 37 -> 19 goals (51%),
// against 29 on target -> 7 (24%). Last 3 (L Villa 1-2, Brighton 0-1, Forest 1-3): 2-6, shots 48 (16.0/g), allowed 26 (8.7/g),
// on target 17 -> 2 (12%), against 10 -> 6 (60%). Season: 150 shots v 106 (15.0 v 10.6). League average 32% (100 games).
// Haaland 8 goals in the first 7, 1 in the last 3. City top after 7 games, now 3rd on 21, Arsenal 27. Verdict is opinion.
const ch = (from: number, label: string, topic: [string, string]) => ({ from, label, topic, league: 'PREMIER LEAGUE', h: 'mci', a: 'mci', hName: 'CITY', aName: 'CITY', time: '', glow: ['rgba(108,171,221,0.85)', 'rgba(108,171,221,0.85)'] as [string, string] });
export const spec: PreviewSpec = {
  kind: 'preview', dir: 'np-036', words,
  title: ["WHAT'S WRONG", 'WITH CITY?'],
  dates: 'DATA STORY · 18 NOV 2026',
  record: '45-16',
  intro: { listWord: 24 },
  chapters: [
    { ...ch(47, 'The collapse', ['THE', 'COLLAPSE']), panels: [
      { kind: 'form', word: 51, label: 'MAN CITY · 10 LEAGUE GAMES', rows: [{ crest: 'mci', results: ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'L', 'L', 'L'] }] },
      { kind: 'stat', word: 63, value: '2-6', label: 'GOALS FOR AND AGAINST · LAST 3 GAMES', sub: 'FIRST 7 GAMES: 19-7', color: 'red' },
      { kind: 'table', word: 73, label: 'PREMIER LEAGUE · TOP FOUR', rows: [
        { pos: 1, crest: 'ars', team: 'ARSENAL', pts: 27 }, { pos: 2, crest: 'bha', team: 'BRIGHTON', pts: 22 },
        { pos: 3, crest: 'mci', team: 'MAN CITY', pts: 21, hl: true }, { pos: 4, crest: 'liv', team: 'LIVERPOOL', pts: 18 }] },
    ] },
    { ...ch(87, 'The surprise', ['THE', 'SURPRISE']), panels: [
      { kind: 'point', word: 95, tag: 'THE SURPRISE', text: ['CITY DID NOT', 'GET WORSE', 'AT CREATING'], color: 'gold' },
      { kind: 'compare', word: 103, label: 'SHOTS PER GAME', names: ['WINNING RUN', 'LOSING RUN'], crests: ['mci', 'mci'], h: 14.6, a: 16, better: 'high' },
      { kind: 'compare', word: 120, label: 'SHOTS ALLOWED PER GAME', names: ['WINNING RUN', 'LOSING RUN'], crests: ['mci', 'mci'], h: 11.4, a: 8.7, better: 'low' },
    ] },
    { ...ch(141, 'The real problem', ['THE REAL', 'PROBLEM']), panels: [
      { kind: 'point', word: 146, tag: 'THE REAL PROBLEM', text: ['FINISHING', 'AT BOTH', 'ENDS'], color: 'red' },
      { kind: 'compare', word: 152, label: "CITY'S SHOTS ON TARGET THAT GO IN", names: ['WINNING RUN', 'LOSING RUN'], crests: ['mci', 'mci'], h: 51, a: 12, fmt: '#%', better: 'high' },
      { kind: 'stat', word: 170, value: '32%', label: 'LEAGUE AVERAGE · CITY IN THE LOSING RUN: 12%' },
      { kind: 'compare', word: 178, label: "OPPONENTS' SHOTS ON TARGET THAT GO IN", names: ['WINNING RUN', 'LOSING RUN'], crests: ['', ''], h: 24, a: 60, fmt: '#%', better: 'low' },
      { kind: 'player', word: 202, name: 'ERLING HAALAND', crest: 'mci', lines: [['8', 'GOALS · FIRST 7 GAMES'], ['1', 'GOAL · LAST 3 GAMES']] },
    ] },
    { ...ch(218, 'The verdict', ['THE', 'VERDICT']), panels: [
      { kind: 'compare', word: 222, label: 'SHOTS PER GAME · ALL SEASON', names: ['CITY', 'OPPONENTS'], crests: ['mci', ''], h: 15, a: 10.6, better: 'high' },
      { kind: 'point', word: 231, tag: 'NOT BROKEN', text: ['A BAD RUN', 'OF', 'FINISHING'], color: 'gold' },
      { kind: 'point', word: 244, tag: 'OUR VERDICT', text: ['BACK IN THE', 'TITLE RACE', 'BY CHRISTMAS'], color: 'green' },
    ] },
  ],
  outro: { from: 255, lines: ['A NEW DATA STORY EVERY WEEK', 'FOLLOW · BACKED BY THE NUMBERS'], banner: { word: 263, text: "COMMENT: WHAT'S WRONG WITH CITY?" } },
  tints: ['#0a2a5a', '#0a3a6a', '#0a2a5a', '#3a0a1a', '#0a3a5a', '#0a2a5a'],
};
