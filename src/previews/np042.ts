import type { PreviewSpec } from '../templates/PreviewTemplate';
import words from '../../video-projects/np-042/vo/words.json';

// NP-042 DATA STORY #4: "How is Como doing this?" 16:9 (NP042) + TikTok 9:16 (NP042V). Wed 25 Nov 2026.
// Sources (video-projects/np-042/research): ESPN summaries of all 120 Serie A games through 23 Nov (seriea_summaries.json ->
// seriea_possession_age.json): Como 61.8% possession (1st; Inter 60.6), 628 passes/game (1st; Inter 605), 18.1 shots/game (4th),
// opponents 12.3; average age of starting line-ups 25.2 (ages from ESPN team rosters, Nov 2026) - youngest of the top six
// (Lazio 25.5, Milan 26.8, Roma 26.9, Juventus 27.0, Inter 27.7). Table: ESPN ita.1 standings (table_ita_now.txt): Como 5th, 26 pts,
// 10 conceded (Lazio 9). Como's 17 games (como_summaries.json): starts - Ramon 15, Paz 15, Baturina 13, Valle 12, Perrone 11, Diao 7
// (ages 21/22/23/22/23/21); goals - Douvikas 5 + 6 UCL = 11, Paz 3 + 3 = 6, Diao 2 + 2 = 4, Ramon 3. UCL: 4-1 Leipzig, 2-3 Feyenoord,
// 4-1 Man United, 9-1 at Lens, 1-0 AEK = 20 goals. Fàbregas: interim Nov 2023 without the licence, assistant to Osian Roberts
// for promotion (2nd, Serie B 2023-24); head coach July 2024 (ESPN, Reuters/The Star); 10th 2024-25; 4th 2025-26 with 71 points,
// first Champions League place (AP via Fox Sports/TSN, 25 May 2026); "like going to a football university every day" (beIN, 25 May 2026).
// Born 4 May 1987 (39). World Cup winner 2010. Verdict is opinion.
const ch = (from: number, label: string, topic: [string, string]) => ({ from, label, topic, league: 'SERIE A', h: 'com', a: 'com', hName: 'COMO', aName: 'COMO', time: '', glow: ['rgba(0,90,170,0.85)', 'rgba(0,90,170,0.85)'] as [string, string] });
export const spec: PreviewSpec = {
  kind: 'preview', dir: 'np-042', words,
  title: ['HOW IS COMO', 'DOING THIS?'],
  dates: 'DATA STORY · 25 NOV 2026',
  record: '53-20',
  intro: { listWord: 2 },
  chapters: [
    { ...ch(4, 'The run', ['THE', 'RUN']), panels: [
      { kind: 'stat', word: 17, value: '20', label: 'CHAMPIONS LEAGUE GOALS IN 5 GAMES', color: 'green' },
      { kind: 'form', word: 26, label: 'COMO · CHAMPIONS LEAGUE', rows: [{ crest: 'com', results: ['W', 'L', 'W', 'W', 'W'] }] },
      { kind: 'stat', word: 35, value: '9-1', label: 'AWAY AT LENS', color: 'gold' },
      { kind: 'point', word: 50, tag: 'FOUR PARTS', text: ['THE COACH', 'THE STYLE', 'THE KIDS', 'THE VERDICT'], color: 'gold' },
    ] },
    { ...ch(61, 'The coach', ['THE', 'COACH']), panels: [
      { kind: 'player', word: 66, name: 'CESC FÀBREGAS', crest: 'com', lines: [['39', 'YEARS OLD'], ['2010', 'WORLD CUP WINNER AS A PLAYER']] },
      { kind: 'point', word: 86, tag: 'NOVEMBER 2023', text: ['IN CHARGE', 'WITHOUT THE', 'LICENCE'], color: 'red' },
      { kind: 'stat', word: 103, value: '2ND', label: 'SERIE B 2023-24 · PROMOTED', sub: 'FÀBREGAS AS ASSISTANT' },
      { kind: 'stat', word: 118, value: '10TH', label: 'SERIE A 2024-25 · FIRST SEASON IN CHARGE' },
      { kind: 'stat', word: 126, value: '4TH', label: 'SERIE A 2025-26 · 71 POINTS', sub: 'FIRST CHAMPIONS LEAGUE PLACE IN CLUB HISTORY', color: 'gold' },
      { kind: 'point', word: 144, tag: 'FÀBREGAS', text: ['"LIKE GOING TO', 'A FOOTBALL', 'UNIVERSITY"'], color: 'gold' },
    ] },
    { ...ch(152, 'The style', ['THE', 'STYLE']), panels: [
      { kind: 'stat', word: 166, value: '61.8%', label: 'POSSESSION PER GAME · MOST IN SERIE A', color: 'gold' },
      { kind: 'compare', word: 175, label: 'PASSES PER GAME · SERIE A', names: ['COMO', 'INTER'], crests: ['com', 'int'], h: 628, a: 605, better: 'high' },
      { kind: 'compare', word: 200, label: 'SHOTS PER GAME · SERIE A', names: ['COMO', 'OPPONENTS'], crests: ['com', ''], h: 18.1, a: 12.3, better: 'high' },
      { kind: 'stat', word: 209, value: '10', label: 'GOALS CONCEDED IN 12 LEAGUE GAMES', sub: 'ONLY LAZIO HAVE CONCEDED FEWER (9)', color: 'green' },
      { kind: 'player', word: 224, name: 'TASOS DOUVIKAS', crest: 'com', lines: [['11', 'GOALS · ALL COMPETITIONS'], ['6', 'IN THE CHAMPIONS LEAGUE']] },
    ] },
    { ...ch(232, 'The kids', ['THE', 'KIDS']), panels: [
      { kind: 'stat', word: 243, value: '25.2', label: 'AVERAGE AGE OF COMO STARTING LINE-UPS', sub: 'YOUNGEST OF THE SERIE A TOP SIX · INTER 27.7', color: 'green' },
      { kind: 'point', word: 258, tag: 'THE KIDS', text: ['SIX STARTERS', 'AGED 23', 'AND YOUNGER'], color: 'green' },
      { kind: 'player', word: 271, name: 'NICO PAZ', crest: 'com', lines: [['22', 'YEARS OLD'], ['6', 'GOALS THIS SEASON']] },
      { kind: 'player', word: 282, name: 'JACOBO RAMÓN', crest: 'com', lines: [['21', 'YEARS OLD · CENTRE BACK'], ['15', 'STARTS IN 17 GAMES · 3 GOALS']] },
      { kind: 'player', word: 303, name: 'ASSANE DIAO', crest: 'com', lines: [['21', 'YEARS OLD'], ['4', 'GOALS THIS SEASON']] },
    ] },
    { ...ch(310, 'The verdict', ['THE', 'VERDICT']), panels: [
      { kind: 'table', word: 314, label: 'SERIE A · TOP FIVE', rows: [
        { pos: 1, crest: 'laz', team: 'LAZIO', pts: 32 }, { pos: 2, crest: 'rom', team: 'ROMA', pts: 30 }, { pos: 3, crest: 'int', team: 'INTER', pts: 29 },
        { pos: 4, crest: 'mil', team: 'MILAN', pts: 27 }, { pos: 5, crest: 'com', team: 'COMO', pts: 26, hl: true }] },
      { kind: 'stat', word: 327, value: '20', label: 'CHAMPIONS LEAGUE GOALS IN 5 GAMES', color: 'green' },
      { kind: 'point', word: 338, tag: 'THE PLAN', text: ['KEEP THE BALL', 'TRUST THE KIDS', 'LET CESC COACH'], color: 'gold' },
      { kind: 'point', word: 352, tag: 'OUR VERDICT', text: ['TOP FOUR', 'AGAIN'], color: 'green' },
    ] },
  ],
  outro: { from: 361, lines: ['A NEW DATA STORY EVERY WEEK', 'FOLLOW · BACKED BY THE NUMBERS'], banner: { word: 375, text: 'COMMENT: WHO SHOULD HIRE FÀBREGAS NEXT?' } },
  tints: ['#0a2a5a', '#0a3a6a', '#0a2a5a', '#0a3a5a', '#0a4a3a', '#0a2a5a'],
};
