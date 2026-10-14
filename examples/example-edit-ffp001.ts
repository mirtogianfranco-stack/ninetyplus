// FFP-001: FourFigurePlays (client account). 3-leg slip, Giants at Rams MNF, +5644: Davante Adams ATD, Blake Corum ATD,
// Rams defense ATD (the bold prediction, named last). Client script tightened + fact-checked; voice Chatterbox/Kokoro am_onyx.
// Brand 'fourfigure' = the 4F logo's orange + white on black (rail, reveal, accents); white -> orange caption glow.
// Opener is a clip no other video starts on (gate enforces it now). Faceless: black placeholder facecam.
// Word indices into ffp001_final.json (116 words, voice ends ~38.9s).
import transcript from '../../../video-projects/fourfigure/ffp-001/voiceover/ffp001_final.json';
import corrections from '../../../video-projects/fourfigure/ffp-001/voiceover/caption-corrections.json';
import type { PicksEdit, Word } from '../picks/types';

const raw: Word[] = (transcript as any).segments.flatMap((s: any) => s.words).map((w: any) => ({ word: w.word.trim(), start: w.start, end: w.end }));
const CORR = corrections as Record<string, string>;
const words: Word[] = raw.map((w, i) => ({ ...w, word: CORR[String(i)] !== undefined ? CORR[String(i)] : w.word }));
const END_SEC = 40.20;
const clip = (n: string) => 'ffp-001/clips/' + n + '.mp4';
const hs = (n: string) => 'ffp-001/headshots/' + n + '.png';
const logo = (n: string) => 'ffp-001/logos/' + n;

// 0 "Puka" 0.00 | 12 "35" 3.72 | 19 "three" 6.22 | 21 "Puka" 7.50 | 23 "trending" 7.96 | 25 "missing" 8.50 | 28 "Davante" 9.96
// 33 "Blake" 12.32 | 36 "Kyren" 12.96 | 39 "splitting" 13.74 | 48 "5.4" 16.74 | 56 "goal" 19.50 | 63 "Blake" 21.40 | 68 "And" 23.64
// 70 "bold" 24.00 | 82 "11" 27.10 | 96 "seven" 31.66 | 102 "Myles" 34.08 | 111 "Rams" 36.98 | 115 "touchdown" 38.58 | end 40.20
export const ffp001: PicksEdit = {
  id: 'FFP001',
  fps: 30,
  endSec: END_SEC,
  words,
  voiceover: 'ffp-001/voiceover.wav',
  assetsBase: 'ffp-001',
  brand: 'fourfigure',
  captionStyle: 'glow',
  captionGlow: ['#FFFFFF', '#FF7A00'],
  clipSec: {
    'ffp-001/clips/rams_davante_high.mp4': 7.80, 'ffp-001/clips/rams_davante_high2.mp4': 16.53,
    'ffp-001/clips/rams_blakecorum_high.mp4': 13.47, 'ffp-001/clips/michigan_blakecorum_high.mp4': 39.20,
    'ffp-001/clips/rams_kyrenwilliams_high.mp4': 9.82, 'ffp-001/clips/rams_kyrenwilliams_high2.mp4': 6.76,
  },
  legs: [
    { name: 'adams', label: 'DAVANTE ADAMS', team: 'rams', anchor: 28, start: 0, end: 12.32, clips: [clip('rams_davante_high2') + '#7.5', clip('rams_davante_high') + '#4', clip('rams_davante_high2') + '#12'], headshot: hs('davanteadams'), line: 'ANYTIME TD', revealDur: 2.1,
      stats: [
        { word: 12, value: 'RAMS 35 · JAGUARS 7', label: 'WEEK 7, 2025 · THE GAME PUKA MISSED', dur: 1.9 },
        { word: 19, value: '3 TOUCHDOWNS', label: 'DAVANTE ADAMS · WITH PUKA OUT', dur: 1.65 },
      ] },
    { name: 'corum', label: 'BLAKE CORUM', team: 'rams', anchor: 63, start: 12.32, end: 23.64, clips: [clip('michigan_blakecorum_high') + '#18', clip('rams_blakecorum_high') + '#2', clip('michigan_blakecorum_high') + '#30'], headshot: hs('blakecorum'), line: 'ANYTIME TD', revealDur: 2.1,
      stats: [
        { word: 39, value: '14 TOUCHES VS 10', label: 'KYREN VS CORUM · WEEK 1', dur: 1.8 },
        { word: 48, value: '5.4 YARDS A CARRY', label: 'CORUM · 54 YARDS ON 10 CARRIES', dur: 1.8 },
      ] },
    { name: 'defense', label: 'RAMS DEFENSE', team: 'rams', anchor: 111, start: 23.64, end: END_SEC, clips: [clip('rams_kyrenwilliams_high2') + '#1', clip('rams_davante_high2') + '#3', clip('rams_kyrenwilliams_high') + '#5'], headshot: logo('rams_logo.webp'), line: 'ANYTIME TD', revealDur: 1.55,
      stats: [
        { word: 82, value: '11 DAYS TO PREPARE', label: 'SINCE WEEK 1 IN MELBOURNE', dur: 1.7 },
        { word: 96, value: '7 SACKS', label: 'VS JACKSONVILLE · THE LAST GAME PUKA MISSED', dur: 1.8 },
      ] },
  ],
  popups: [
    // frame 0: the slip, every leg blurred; +5644 and the matchup stay readable
    { word: 0, dur: 2.3, src: 'slip_blur.jpg', label: '3 PLAYS · ONE SLIP', team: 'rams', w: 700, h: 589, sfx: 'shutter_sound_camera.MP3', vol: 0.5 },
    // "Puka is trending toward missing again tonight": the SI headline, key phrase circled
    { word: 23, dur: 2.0, src: 'si_puka_article_c.png', label: 'SPORTS ILLUSTRATED · SEP 20', team: 'rams', w: 900, h: 251, sfx: 'canon_photo_click.MP3', vol: 0.5, mark: { word: 25, x: 469, y: 38, rx: 232, ry: 30 } },
  ],
  news: [
    { word: 102, dur: 2.0, outlet: 'THERAMS.COM', date: 'WEEK 2', headline: 'Myles Garrett placed on Injured Reserve', quote: '"KNEE SURGERY"', by: 'Out at least 4 games', sfx: 'shutter_sound_camera.MP3', vol: 0.45 },
  ],
  stamps: [
    { word: 56, text: 'GOAL LINE', dur: 1.0, tone: 'gold', rot: -4, size: 130, sfx: 'stinger_flash_whoosh.MP3', vol: 0.45 },          // "the goal line work goes to Corum"
    { word: 75, text: 'EMBARRASSED', dur: 1.0, tone: 'red', rot: -4, size: 120, sfx: 'wrong_answer.MP3', vol: 0.45 },                   // "the Rams got embarrassed in Week 1"
    { word: 70, text: 'BOLD PREDICTION', dur: 1.1, tone: 'green', rot: 4, size: 104, sfx: 'bass_impact.MP3', vol: 0.5 },              // "and my bold prediction" (brand primary = orange)
  ],
  memes: [
    { word: 8, image: logo('rams_logo.webp'), sfx: 'whoosh_motion.MP3', vol: 0.4, size: 230, dur: 1.0, x: 150, y: 1040 },           // "the Rams" (low: the stat cards own the top)
    { word: 11, image: logo('jacksonvillejags_logo.webp'), sfx: 'classic_whoosh.MP3', vol: 0.4, size: 230, dur: 0.9, x: 700, y: 1040 }, // "beat the Jaguars"
    { word: 36, image: hs('kyrenwilliams'), sfx: 'whoosh_motion.MP3', vol: 0.4, size: 220, dur: 1.0, x: 720, y: 1040 }, // "Kyren Williams" (low, clear of the touches card)
  ],
  // the ending: the unblurred slip as the hero on the last word (no payout ticker: TikTok money rule)
  stamp: { word: 115, image: 'ffp-001/graphics/slip.jpeg', text: 'LOCKED IN', sfx: 'punch_sound.MP3', vol: 0.5, textWord: 115, width: 700, center: true },
  punchWords: [12, 19, 28, 48, 63, 82, 96, 111],
  zoomKicks: [{ word: 0, untilWord: 7, amount: 0.12 }, { word: 68, untilWord: 72, amount: 0.1 }],
  shots: [{ word: 0, shot: 'footage' }],
  hook: { endWord: 12, captions: true, style: 'none', phrases: [] },
  cutSfx: { zoom: { file: 'reverse_riser.MP3', lead: 36, dur: 1.5, vol: 0.4 }, fade: { file: 'reverse_whoosh.MP3', lead: 8, dur: 0.5, vol: 0.4 }, glitch: { file: 'glitch_sound.MP3', lead: 3, dur: 0.5, vol: 0.32 }, whip: { file: 'fast_swoosh.MP3', lead: 4, dur: 0.5, vol: 0.35 } },
  music: { file: 'ffp-001/music/knocked_out.mp3', volume: 0.1, fadeInSec: 0.6, fadeOutSec: 0.8 },
  facecam: { file: 'ffp-001/facecam.mp4', srcW: 1920, srcH: 1080, head: { x: 960, y: 470 }, targetX: 540, zoom: 1.0, drift: 0, grade: 'none', wash: 'rgba(0,0,0,0)', keyLight: false },
  rail: { tile: 'headshot' },
  revealLine: '',
  emphasisWords: ['PUKA', 'NACUA', 'RAMS', 'JAGUARS', '35', '7', 'DAVANTE', 'ADAMS', '3', 'TOUCHDOWNS', 'MISSING', 'TOUCHDOWN', 'BLAKE', 'CORUM', 'KYREN', '5.4', 'GOAL', 'LINE', 'BOLD', 'PREDICTION', 'EMBARRASSED', '11', 'DAYS', 'SACKED', 'MYLES', 'GARRETT', 'BLOWOUT', 'DEFENSE'],
};
