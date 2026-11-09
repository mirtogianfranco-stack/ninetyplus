import type { PreviewSpec } from '../templates/PreviewTemplate';
import words from '../../video-projects/np-030/vo/words.json';
import { spec as base } from './np025';

// NP-030: TikTok edition of Data Story #1 (np-025) with an update chapter after Brighton 2-0 Brentford (Sun 8 Nov).
// The voiceover is np-025's script word for word up to word 348 (same timings), then the update + a TikTok outro.
// Sources: ESPN eng.1 (video-projects/np-030/research/form_eng_1109.json): Brighton 2-0 Brentford (Gomez 15', Gross pen 42';
// Igor Thiago sent off 23'); table after 10: Arsenal 27, Brighton 22, City 21, Liverpool 18, Chelsea 16; Brighton 26-7 (+19,
// next best Arsenal +10); 7 clean sheets = Arsenal 7.
const bha = { league: 'PREMIER LEAGUE', h: 'bha', a: 'bha', hName: 'BRIGHTON', aName: 'BRIGHTON', time: '', glow: ['rgba(0,87,184,0.8)', 'rgba(0,87,184,0.8)'] as [string, string] };
export const spec: PreviewSpec = {
  ...base, dir: 'np-030', words,
  dates: 'DATA STORY · UPDATED 9 NOV',
  chapters: [
    ...base.chapters,
    { ...bha, from: 349, label: 'Update', topic: ['THE', 'UPDATE'], panels: [
      { kind: 'table', word: 355, label: 'PREMIER LEAGUE · AFTER 10 GAMES', rows: [
        { pos: 1, crest: 'ars', team: 'ARSENAL', pts: 27 }, { pos: 2, crest: 'bha', team: 'BRIGHTON', pts: 22, hl: true },
        { pos: 3, crest: 'mci', team: 'MAN CITY', pts: 21 }, { pos: 4, crest: 'liv', team: 'LIVERPOOL', pts: 18 }, { pos: 5, crest: 'che', team: 'CHELSEA', pts: 16 }] },
      { kind: 'stat', word: 365, value: '2-0', label: 'BEAT BRENTFORD · UP TO 2ND', sub: "BRENTFORD DOWN TO 10 MEN FROM 23'", focus: 'bre' },
      { kind: 'stat', word: 379, value: '7', label: 'CLEAN SHEETS · LEVEL WITH ARSENAL', color: 'green' },
      { kind: 'stat', word: 386, value: '+19', label: 'GOAL DIFFERENCE · BEST IN THE LEAGUE', color: 'green' },
    ] },
  ],
  outro: { from: 395, lines: ['A NEW DATA STORY EVERY WEEK', 'FOLLOW · BACKED BY THE NUMBERS'], banner: { word: 403, text: 'COMMENT: ARE BRIGHTON FOR REAL?' } },
  tints: [...(base.tints ?? []).slice(0, 5), '#0a2a7a', '#0a2a6a'],
};
