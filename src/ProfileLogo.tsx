import React from 'react';
import { AbsoluteFill } from 'remotion';
import { theme, applyBrand } from './theme';

// Ninety Plus profile picture (TikTok / IG / YouTube avatar). 1080x1080, everything inside the centre circle crop.
export const ProfileLogo: React.FC = () => {
  applyBrand('ninetyplus');
  return (
    <AbsoluteFill style={{ background: theme.colors.bg, alignItems: 'center', justifyContent: 'center', fontFamily: theme.fonts.display }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 46%, rgba(255,46,77,0.45), rgba(255,46,77,0.08) 45%, rgba(0,0,0,0) 70%)' }} />
      <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', border: '14px solid ' + theme.colors.primary, boxShadow: '0 0 40px ' + theme.colors.glow + ', inset 0 0 40px ' + theme.colors.glow }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', transform: 'skewX(-7deg)', marginTop: -40 }}>
        <span style={{ fontSize: 470, lineHeight: 0.85, color: '#fff', letterSpacing: -6 }}>90</span>
        <span style={{ fontSize: 300, lineHeight: 0.85, color: theme.colors.primary, textShadow: '0 0 40px ' + theme.colors.glow }}>+</span>
      </div>
    </AbsoluteFill>
  );
};
