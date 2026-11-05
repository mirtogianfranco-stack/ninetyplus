import type { CardSpec } from '../templates/CardTemplate';
import words from '../../video-projects/np-027/vo/words.json';

// NP-027 Best of the Rest, 7 Nov 2026 (all Saturday). Sources: ESPN results through 5 Nov (tools/espn-form.py, video-projects/wk-1107):
// Leipzig home 4-0-0, 18-0; Sassuolo 0 clean sheets in 10; Valencia home 3-11 in 6 (0-2-4); Columbus Crew won last 5 (MLS,
// usa.1), at Chicago Fire. Kick-offs ESPN: 14:30Z, 19:45Z, 20:00Z, 21:00Z = 9:30 AM, 2:45 PM, 3:00 PM, 4:00 PM EST.
export const spec: CardSpec = {
  dir: 'np-027',
  words,
  title: ['BEST OF', 'THE REST'],
  tag: 'EUROPE + MLS',
  record: '33-13',
  fan: { left: { crest: 'rbl' }, right: { crest: 'rma' }, centers: ['rom', 'clb'], glows: ['rgba(221,1,63,0.8)', 'rgba(254,190,16,0.7)'] },
  picks: [
    {
      from: 11, h: 'rbl', a: 'fca', time: 'SAT 9:30 AM', hero: { crest: 'rbl', glow: 'rgba(221,1,63,0.8)' },
      claim: ['LEIPZIG', 'FORTRESS', 'AT HOME'], pill: 'LEIPZIG TO WIN', pillWord: 22,
      devices: [{ kind: 'big', word: 18, value: '18-0', label: 'HOME GOALS · 4 WINS FROM 4', color: 'green' }],
    },
    {
      from: 25, h: 'rom', a: 'sas', time: 'SAT 2:45 PM', hero: { crest: 'rom', glow: 'rgba(142,31,47,0.85)' },
      claim: ['SASSUOLO', 'NO CLEAN', 'SHEETS'], claimColor: 'red', pill: 'ROMA TO WIN', pillWord: 34,
      devices: [{ kind: 'big', word: 27, value: '0', label: 'CLEAN SHEETS FOR SASSUOLO IN 10', color: 'red' }],
    },
    {
      from: 37, h: 'val', a: 'rma', time: 'SAT 3:00 PM', hero: { crest: 'rma', glow: 'rgba(254,190,16,0.7)' },
      claim: ['VALENCIA', 'CAN\'T SCORE', 'AT HOME'], claimColor: 'red', pill: 'MADRID TO WIN BY 2+', pillWord: 46, row: 'REAL MADRID WIN BY 2+',
      devices: [{ kind: 'big', word: 40, value: '3', label: 'HOME GOALS FOR VALENCIA IN 6 GAMES', color: 'red' }],
    },
    {
      from: 54, h: 'chi', a: 'clb', time: 'SAT 4:00 PM', hero: { crest: 'clb', glow: 'rgba(254,240,0,0.65)' },
      claim: ['COLUMBUS', 'RED', 'HOT'], pill: 'COLUMBUS WIN OR DRAW', pillWord: 62,
      devices: [{ kind: 'form', word: 57, label: 'COLUMBUS CREW · LAST 5 GAMES', results: ['W', 'W', 'W', 'W', 'W'] }],
    },
  ],
  outroWord: 67,
  commentWord: 71,
  tints: ['#7a0a1a', '#8a0a2a', '#5a0a1a', '#5a4a0a', '#5a5a0a', '#7a0a1a'],
  emph: ['ATLANTIC.', 'EIGHTEEN', 'CLEAN', 'THREE', 'FIVE', 'COMMENT'],
};
