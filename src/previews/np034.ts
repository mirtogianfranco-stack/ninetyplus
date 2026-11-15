import type { PreviewSpec } from '../templates/PreviewTemplate';
import words from '../../video-projects/np-034/vo/words.json';

// NP-034 DATA STORY #2: "Can Pochettino fix Manchester United?" 16:9 (NP034) + TikTok 9:16 (NP034V). Sun 15 Nov 2026.
// News (Sky Sports / ESPN / Goal, 12-13 Nov 2026): Carrick sacked Thu 12 Nov; Pochettino confirmed head coach from 18 Nov.
// Numbers: ESPN, all 100 games through 8 Nov (video-projects/np-034/research): United 18th, 8 pts, 1-5-4, 14-19, 0 clean sheets
// (only Ipswich also 0); 19 conceded (Palace 24, Ipswich 20 more; Coventry also 19); shots 19.3 a game (most; Brighton 16.9) v 11.7
// against, gap +7.6 = biggest (Forest +6.2, Brighton +5.5, City +4.4); 26% of shots on target scored (14/54; league 32%);
// opponents 38% (19/50); at league rate 54 x 0.32 = 17.3 for, 50 x 0.32 = 16.0 against. Fixtures ESPN eng.1: at Liverpool 22 Nov,
// Brentford (h) 28 Nov, Coventry (h) 5 Dec, at Palace 13 Dec. The verdict is opinion.
const ch = (from: number, label: string, topic: [string, string]) => ({ from, label, topic, league: 'PREMIER LEAGUE', h: 'mun', a: 'mun', hName: 'UNITED', aName: 'UNITED', time: '', glow: ['rgba(218,41,28,0.8)', 'rgba(218,41,28,0.8)'] as [string, string] });
export const spec: PreviewSpec = {
  kind: 'preview', dir: 'np-034', words,
  title: ['CAN POCH', 'FIX UNITED?'],
  dates: 'DATA STORY · 15 NOV 2026',
  record: '43-16',
  intro: { listWord: 20 },
  chapters: [
    { ...ch(43, 'The mess', ['THE', 'MESS']), panels: [
      { kind: 'table', word: 47, label: 'PREMIER LEAGUE · BOTTOM FIVE AFTER 10 GAMES', rows: [
        { pos: 16, crest: 'nfo', team: 'FOREST', pts: 9 }, { pos: 17, crest: 'cov', team: 'COVENTRY', pts: 9 },
        { pos: 18, crest: 'mun', team: 'MAN UNITED', pts: 8, hl: true }, { pos: 19, crest: 'sun', team: 'SUNDERLAND', pts: 8 }, { pos: 20, crest: 'cry', team: 'PALACE', pts: 7 }] },
      { kind: 'stat', word: 57, value: '0', label: 'CLEAN SHEETS IN 10 GAMES', color: 'red' },
      { kind: 'stat', word: 67, value: '19', label: 'GOALS CONCEDED · ONLY TWO TEAMS HAVE LET IN MORE', color: 'red' },
      { kind: 'point', word: 80, tag: '12 NOV', text: ['CARRICK', 'SACKED', 'POCHETTINO IN'], color: 'red' },
    ] },
    { ...ch(86, 'The surprise', ['THE', 'SURPRISE']), panels: [
      { kind: 'stat', word: 98, value: '19.3', label: 'SHOTS PER GAME · MOST IN THE LEAGUE' },
      { kind: 'compare', word: 111, label: 'SHOTS PER GAME', names: ['UNITED', 'OPPONENTS'], crests: ['mun', ''], h: 19.3, a: 11.7, better: 'high' },
      { kind: 'compare', word: 126, label: 'SHOT GAP PER GAME · BIGGEST IN THE LEAGUE', names: ['UNITED', 'BRIGHTON'], crests: ['mun', 'bha'], h: 7.6, a: 5.5, fmt: '+#', better: 'high' },
    ] },
    { ...ch(133, 'The real problem', ['THE REAL', 'PROBLEM']), panels: [
      { kind: 'compare', word: 138, label: 'SHOTS ON TARGET THAT GO IN', names: ['UNITED', 'LEAGUE AVERAGE'], crests: ['mun', ''], h: 26, a: 32, fmt: '#%', better: 'high' },
      { kind: 'compare', word: 156, label: 'SHOTS ON TARGET THAT GO IN · AGAINST', names: ['V UNITED', 'LEAGUE AVERAGE'], crests: ['mun', ''], h: 38, a: 32, fmt: '#%', better: 'low' },
      { kind: 'point', word: 168, tag: 'BOTH ENDS', text: ['WASTE CHANCES', 'GET PUNISHED', 'EVERY WEEK'], color: 'red' },
      { kind: 'compare', word: 181, label: 'GOALS SCORED · AT AVERAGE FINISHING v ACTUAL', names: ['SHOULD BE', 'ACTUAL'], crests: ['', 'mun'], h: 17, a: 14, better: 'high' },
      { kind: 'stat', word: 192, value: '14-19', label: 'ACTUAL GOALS FOR AND AGAINST', sub: 'AT AVERAGE RATES: 17-16', color: 'red' },
    ] },
    { ...ch(198, 'The verdict', ['THE', 'VERDICT']), panels: [
      { kind: 'point', word: 202, tag: 'FIRST FOUR GAMES', text: ['LIVERPOOL (A)', 'BRENTFORD + COVENTRY (H)', 'PALACE (A)'], color: 'gold', focus: 'liv' },
      { kind: 'point', word: 222, tag: 'THE GOOD NEWS', text: ['THE CHANCES', 'ARE ALREADY', 'THERE'], color: 'green' },
      { kind: 'point', word: 239, tag: 'OUR VERDICT', text: ['OUT OF THE', 'BOTTOM THREE', 'BY CHRISTMAS'], color: 'gold' },
    ] },
  ],
  outro: { from: 257, lines: ['A NEW DATA STORY EVERY WEEK', 'FOLLOW · BACKED BY THE NUMBERS'], banner: { word: 265, text: 'COMMENT: CAN POCH FIX UNITED?' } },
  tints: ['#6a0a1a', '#7a0a1a', '#5a1a0a', '#6a0a2a', '#5a0a1a', '#6a0a1a'],
};
