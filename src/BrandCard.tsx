import React from 'react';
import { AbsoluteFill } from 'remotion';
import { theme, applyBrand } from './theme';

// Ninety Plus brand sheet: wordmark, palette and the caption glow, for reference and profile art.
const SWATCHES: [string, string][] = [['#FF2E4D', 'STOPPAGE RED'], ['#FFD23F', 'EMPHASIS'], ['#FFFFFF', 'TEXT'], ['#0B0A0D', 'BACKGROUND']];

export const BrandCard: React.FC = () => {
  applyBrand('ninetyplus');
  return (
    <AbsoluteFill style={{ background: theme.colors.bg, alignItems: 'center', justifyContent: 'center', fontFamily: theme.fonts.display }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 40% at 50% 38%, rgba(255,46,77,0.28), rgba(0,0,0,0) 70%)' }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', transform: 'skewX(-7deg)', marginTop: -260 }}>
        <span style={{ fontSize: 520, lineHeight: 0.85, color: '#fff', letterSpacing: -6 }}>90</span>
        <span style={{ fontSize: 330, lineHeight: 0.85, color: theme.colors.primary, textShadow: '0 0 40px ' + theme.colors.glow }}>+</span>
      </div>
      <div style={{ fontSize: 120, color: '#fff', letterSpacing: 14, marginTop: 20 }}>NINETY PLUS</div>
      <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 34, color: theme.colors.textDim, letterSpacing: 8, marginTop: 8 }}>SOCCER PICKS · EVERY MATCHDAY</div>
      <div style={{ fontFamily: theme.fonts.heavy, fontSize: 92, color: '#fff', marginTop: 140, textShadow: '0 0 18px ' + theme.colors.primary + ', 0 0 36px ' + theme.colors.primary }}>LATE <span style={{ fontFamily: theme.fonts.display, color: theme.colors.gold, textShadow: theme.outline }}>WINNER</span></div>
      <div style={{ fontFamily: theme.fonts.body, fontSize: 26, color: theme.colors.textDim, marginTop: 12, letterSpacing: 4 }}>CAPTION STYLE · WHITE + RED GLOW</div>
      <div style={{ position: 'absolute', bottom: 220, display: 'flex', gap: 28 }}>
        {SWATCHES.map(([c, n]) => (
          <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 190, height: 190, borderRadius: 24, background: c, border: '3px solid rgba(255,255,255,0.25)' }} />
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 22, color: '#fff', letterSpacing: 2 }}>{n}</div>
            <div style={{ fontFamily: theme.fonts.body, fontSize: 22, color: theme.colors.textDim }}>{c}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
