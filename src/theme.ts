// Single source of truth for colours, fonts, easings and springs. Never inline a hex colour or easing in a component.
// Brand: Ninety Plus soccer picks. applyBrand() swaps the palette below; the ninetyplus entry is the default.
import { Easing } from 'remotion';
import { staticFile } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { CLUB_COLORS } from './clubs';

// Condensed impact face for every piece of on-screen type. Loaded once at module scope; Remotion waits for it before rendering.
// Fonts ship in public/fonts so renders never depend on reaching Google Fonts.
const anton = { fontFamily: 'Anton' };
loadFont({ family: 'Anton', url: staticFile('fonts/anton-400.woff2'), weight: '400' });
// Heavy geometric face for the Video-034 'glow' captions (white words); Anton stays for the emphasis words.
const montserrat = { fontFamily: 'Montserrat' };
loadFont({ family: 'Montserrat', url: staticFile('fonts/montserrat-900.woff2'), weight: '900' });

export const theme = {
  colors: {
    bg: '#07090F',
    ink: '#0B0D12',
    primary: '#22C55E', // hero green
    gold: '#FFD600',    // money / emphasis
    text: '#FFFFFF',
    textDim: 'rgba(255,255,255,0.72)',
    glow: 'rgba(34,197,94,0.45)',
    panel: 'rgba(10,10,15,0.88)',
  },
  fonts: {
    display: anton.fontFamily + ', Impact, "Arial Narrow", sans-serif',
    body: 'Helvetica, Arial, sans-serif',
    heavy: montserrat.fontFamily + ', "Arial Black", sans-serif',
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),     // entrances (expo out)
    inOut: Easing.bezier(0.83, 0, 0.17, 1),  // moves, Ken Burns
    in: Easing.bezier(0.7, 0, 0.84, 0),      // exits only
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },  // labels, words
    smooth: { damping: 20, stiffness: 90, mass: 1 },     // big panels
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },  // cut-outs, logos
    slap: { damping: 9, stiffness: 210, mass: 0.6 },     // sticker slap (more overshoot)
  },
  outline: '0 0 6px rgba(0,0,0,0.6), 3px 3px 0 #000, -3px 3px 0 #000, 3px -3px 0 #000, -3px -3px 0 #000',
} as const;

// [primary, secondary] per team key. Used for popup label pills and stat cards so graphics carry the player's colours.
export const TEAM_COLORS: Record<string, [string, string]> = {
  ...CLUB_COLORS,
  cash: ['#0B0D12', '#FF2E4D'],   // not a club - the brand-red frame for the winning slip
};
export const teamColors = (team?: string): [string, string] => (team && TEAM_COLORS[team]) || [theme.colors.ink, theme.colors.primary];

// Cross-platform safe zone for 1080x1920 (Reels/Shorts UI top ~260, Instagram bottom ~500, right buttons ~120). Binding rule 7.
export const SAFE = { top: 260, bottom: 500, left: 90, right: 130 } as const;
export const SAFE_H = 1920 - SAFE.top - SAFE.bottom; // 1160
export const SAFE_W = 1080 - SAFE.left - SAFE.right; // 860
export const SAFE_CY = SAFE.top + SAFE_H / 2;        // 840

// BRANDS (2026-09-21): one template, two accounts. PicksVideo calls applyBrand(edit.brand) at the top of every render, so
// every component that reads theme.colors picks up the account's palette (rail, ladder, reveal, stat accents, captions).
// ItzRockett = hero green; High Limit Slips = the logo's neon: hot pink + neon yellow, cyan in the caption glow.
const BRAND_COLORS: Record<string, Record<string, string>> = {
  itzrockett: { primary: '#22C55E', gold: '#FFD600', glow: 'rgba(34,197,94,0.45)', bg: '#07090F' },
  highlimit: { primary: '#FF3FB4', gold: '#FFE14D', glow: 'rgba(255,63,180,0.5)', bg: '#0B0616' },
  fourfigure: { primary: '#FF7A00', gold: '#FFB020', glow: 'rgba(255,122,0,0.5)', bg: '#0A0A0A' },   // FourFigurePlays: the 4F logo's orange + white on black
  ninetyplus: { primary: '#FF2E4D', gold: '#FFD23F', glow: 'rgba(255,46,77,0.5)', bg: '#0B0A0D' },   // Ninety Plus: stoppage-time red + white on near-black, warm yellow for emphasis
};
export const applyBrand = (brand?: string) => { Object.assign(theme.colors as unknown as Record<string, string>, BRAND_COLORS[brand ?? 'ninetyplus'] ?? BRAND_COLORS.ninetyplus); };
