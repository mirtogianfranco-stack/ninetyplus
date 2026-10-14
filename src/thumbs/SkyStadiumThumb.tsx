import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { theme } from '../theme';

// REUSABLE cover (Video-034, owner's reference account): bright sky + stadium, two stacked condensed lines at the top
// (white over a green gradient, heavy black stroke, slight italic lean), one big player cut-out in the middle, the two
// team logos low on either side. Everything is props so each video only passes words, a player and two logos.
// Headshot cut-outs are small (~600 px wide) - prefer the largest cut-out we have for the hero.
// SAFE ZONE (owner, 2026-09-21): TikTok's profile grid crops ~420 px off the top AND bottom of a 9:16 cover, so the title
// starts at y 440 and every face/logo sits inside y 420-1500. The strips above/below are sky and field only.
export type SkyStadiumThumbProps = {
  top: string;          // e.g. 'GIANTS vs RAMS'
  bottom: string;       // e.g. 'MNF PICKS'
  player: string;       // public path to a transparent cut-out
  leftLogo?: string;
  rightLogo?: string;
  field?: string;       // public path to a field frame for the lower third (blurred)
  topSize?: number;
  bottomSize?: number;
  player2?: string;     // optional second cut-out (two-pick covers), sits right of the first
  night?: boolean;      // High Limit Slips: neon night sky (purple -> hot pink) and a pink -> cyan title gradient
  stoppage?: boolean;   // Ninety Plus: black -> deep red night sky, white -> red title gradient, floodlit pitch
  ember?: boolean;      // FourFigurePlays: black -> burnt orange sky, white -> orange title gradient
  ice?: boolean;        // hockey (Video-039): arena dark blue -> ice white, rink photo low, cyan -> white title. A green field under a hockey cover reads wrong.
};

const STROKE = '0 10px 0 #05070B, 0 18px 30px rgba(0,0,0,0.55)';

// Owner, 2026-09-22 (Thumbnail038): "3 TOUCHDOWNS" ran off both edges because the size is fixed and the line is
// nowrap. Every title now auto-fits: the size shrinks to whatever keeps the longest line inside 1000px.
// Ratios are measured from the display face (the bottom line is the heavier cut).
const fit = (text: string, given: number, ratio: number) => Math.min(given, Math.floor(1000 / Math.max(1, text.length * ratio)));

export const SkyStadiumThumb: React.FC<SkyStadiumThumbProps> = ({ top, bottom, player, player2, leftLogo, rightLogo, field, topSize = 140, bottomSize = 210, night = false, ember = false, stoppage = false, ice = false }) => (
  <AbsoluteFill style={{ overflow: 'hidden', background: '#1d6fd8' }}>
    {/* sky + clouds */}
    <div style={{ position: 'absolute', inset: 0, background: ice ? 'linear-gradient(180deg, #05132b 0%, #0d3a72 32%, #2f8fd8 54%, #cfeaff 66%)' : stoppage ? 'linear-gradient(180deg, #050405 0%, #16080c 30%, #5a0a1a 52%, #FF2E4D 68%)' : ember ? 'linear-gradient(180deg, #050505 0%, #1a1a1a 30%, #5a2400 52%, #ff7a00 66%)' : night ? 'linear-gradient(180deg, #0b0616 0%, #2a0b45 30%, #7a1a7a 52%, #ff3fb4 66%)' : 'linear-gradient(180deg, #1a5fc9 0%, #3f93ee 34%, #9fd2ff 56%, #d9efff 64%)' }} />
    {/* soft haze, not cartoon cloud shapes; Ninety Plus swaps it for two floodlight glows */}
    {stoppage ? <div style={{ position: 'absolute', left: 0, right: 0, top: 80, height: 700, background: 'radial-gradient(ellipse 22% 16% at 12% 18%, rgba(255,240,235,0.9), rgba(255,46,77,0.18) 45%, rgba(0,0,0,0) 75%), radial-gradient(ellipse 22% 16% at 88% 18%, rgba(255,240,235,0.9), rgba(255,46,77,0.18) 45%, rgba(0,0,0,0) 75%)', filter: 'blur(10px)' }} /> : null}
    {stoppage ? null : <div style={{ position: 'absolute', left: -200, right: -200, top: 120, height: 360, background: 'radial-gradient(ellipse 45% 40% at 25% 55%, rgba(255,255,255,0.75), rgba(255,255,255,0) 70%), radial-gradient(ellipse 40% 35% at 75% 45%, rgba(255,255,255,0.7), rgba(255,255,255,0) 70%), radial-gradient(ellipse 60% 30% at 50% 80%, rgba(255,255,255,0.6), rgba(255,255,255,0) 75%)', filter: 'blur(28px)' }} />}
    {/* stadium bowl: dark ring with crowd speckle and a light rim */}
    <div style={{ position: 'absolute', left: -120, right: -120, top: 860, height: 520, borderRadius: '50% 50% 0 0 / 30% 30% 0 0', background: 'radial-gradient(rgba(255,255,255,0.35) 1.4px, transparent 1.6px) 0 0 / 14px 12px, linear-gradient(180deg, #2b3445 0%, #141a24 100%)', boxShadow: '0 -6px 0 rgba(255,255,255,0.5), 0 -40px 80px rgba(0,0,0,0.25)' }} />
    {/* field */}
    {field ? (
      <Img src={staticFile(field)} style={{ position: 'absolute', left: 0, top: 1300, width: 1080, height: 640, objectFit: 'cover', filter: 'blur(6px) saturate(1.2) brightness(0.95)' }} />
    ) : <div style={{ position: 'absolute', left: 0, right: 0, top: 1300, bottom: 0, background: ice ? 'linear-gradient(180deg, #e8f4ff, #b8d8ee)' : 'linear-gradient(180deg, #3f8f3a, #2c6b2a)' }} />}
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1260, height: 120, background: 'linear-gradient(180deg, rgba(20,26,36,1) 0%, rgba(20,26,36,0) 100%)' }} />

    {/* logos low left/right */}
    {leftLogo ? <Img src={staticFile(leftLogo)} style={{ position: 'absolute', left: ice ? 40 : 24, top: ice ? 780 : 860, width: ice ? 180 : 200, height: ice ? 180 : 200, objectFit: 'contain', filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.55))', transform: 'rotate(-8deg)' }} /> : null}
    {rightLogo ? <Img src={staticFile(rightLogo)} style={{ position: 'absolute', right: ice ? 40 : 24, top: ice ? 780 : 860, width: ice ? 180 : 200, height: ice ? 180 : 200, objectFit: 'contain', filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.55))', transform: 'rotate(8deg)' }} /> : null}

    {/* hero player */}
    {player2 ? <Img src={staticFile(player2)} style={{ position: 'absolute', left: '71%', bottom: 200, width: ice ? 820 : 980, transform: 'translateX(-50%)', maxWidth: 'none', filter: 'drop-shadow(0 0 30px rgba(0,0,0,0.45)) drop-shadow(0 24px 40px rgba(0,0,0,0.5)) contrast(1.06) saturate(1.1)' }} /> : null}
    <Img src={staticFile(player)} style={{ position: 'absolute', left: player2 ? '30%' : '50%', bottom: 130, width: player2 ? (ice ? 960 : 1100) : 1400, transform: 'translateX(-50%)', maxWidth: 'none', filter: 'drop-shadow(0 0 30px rgba(0,0,0,0.45)) drop-shadow(0 24px 40px rgba(0,0,0,0.5)) contrast(1.06) saturate(1.1)' }} />

    {/* the cut-outs end mid-chest; fade that edge into the field (below the TikTok grid window, full-feed view only) */}
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1560, bottom: 0, background: ice ? 'linear-gradient(180deg, rgba(200,226,245,0) 0%, rgba(176,208,232,0.92) 42%, #9dc4e0 100%)' : 'linear-gradient(180deg, rgba(18,40,22,0) 0%, rgba(18,40,22,0.92) 42%, #12281a 100%)' }} />
    {/* title */}
    <div style={{ position: 'absolute', top: 440, left: 0, width: 1080, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'skewX(-7deg)' }}>
      <div style={{ fontFamily: theme.fonts.display, fontSize: fit(top, topSize, 0.48), lineHeight: 0.95, color: '#fff', WebkitTextStroke: '12px #05070B', paintOrder: 'stroke fill', textShadow: STROKE, letterSpacing: 1, whiteSpace: 'nowrap' }}>{top}</div>
      <div style={{ fontFamily: theme.fonts.display, fontSize: fit(bottom, bottomSize, 0.56), lineHeight: 0.9, marginTop: 4, background: ice ? 'linear-gradient(180deg, #FFFFFF 8%, #8FE3FF 46%, #1FA8E0 92%)' : stoppage ? 'linear-gradient(180deg, #FFFFFF 8%, #FF8A9B 45%, #FF2E4D 92%)' : ember ? 'linear-gradient(180deg, #FFFFFF 8%, #FFB020 45%, #FF7A00 92%)' : night ? 'linear-gradient(180deg, #FFE14D 6%, #FF3FB4 50%, #8FF3FF 96%)' : 'linear-gradient(180deg, #E4FF6B 8%, #7BEA3A 48%, #22C55E 92%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextStroke: '14px #05070B', paintOrder: 'stroke fill', filter: 'drop-shadow(0 12px 0 #05070B) drop-shadow(0 22px 30px rgba(0,0,0,0.5))', whiteSpace: 'nowrap' }}>{bottom}</div>
    </div>
  </AbsoluteFill>
);
