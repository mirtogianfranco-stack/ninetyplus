import React from 'react';
import { AbsoluteFill } from 'remotion';
import { theme, applyBrand } from './theme';
import { Stadium } from './mockups/Mockups';

// X (Twitter) profile header, 1500x500. The avatar covers the bottom-left (~0-420 px wide, lower ~200 px) and some apps
// crop ~60 px top and bottom, so all copy sits in the centre-right safe area.

const RED = '#FF2E4D';
const GOLD = '#FFD23F';
const D = () => theme.fonts.display;
const HV = () => theme.fonts.heavy;

export const XHeader: React.FC = () => {
  applyBrand('ninetyplus');
  return (
    <AbsoluteFill style={{ background: '#0B0A0D', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, transform: 'scale(1.9) translateY(14%)', transformOrigin: '50% 40%' }}>
        <Stadium tint='#5a0a1a' dim={0.3} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(11,10,13,0.92) 0%, rgba(11,10,13,0.55) 45%, rgba(11,10,13,0.75) 100%)' }} />
      {/* stoppage-time slash */}
      <div style={{ position: 'absolute', left: 300, top: -60, width: 70, height: 680, background: RED, transform: 'rotate(18deg)', boxShadow: '0 0 60px ' + RED, opacity: 0.9 }} />
      <div style={{ position: 'absolute', left: 395, top: -60, width: 18, height: 680, background: GOLD, transform: 'rotate(18deg)', opacity: 0.8 }} />
      {/* copy */}
      <div style={{ position: 'absolute', left: 500, right: 50, top: 72, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ fontFamily: HV(), fontSize: 26, letterSpacing: 10, color: 'rgba(255,255,255,0.8)' }}>FOOTBALL PICKS</div>
        <div style={{ fontFamily: D(), fontSize: 150, lineHeight: 0.9, color: '#fff', letterSpacing: 3, textShadow: '0 10px 30px rgba(0,0,0,0.7)' }}>NINETY <span style={{ color: RED }}>PLUS</span></div>
        <div style={{ marginTop: 10, fontFamily: D(), fontSize: 46, color: GOLD, letterSpacing: 2 }}>BACKED BY xG · EVERY CARD GRADED</div>
        <div style={{ marginTop: 18, display: 'flex', gap: 10, flexWrap: 'nowrap' }}>
          {['PREMIER LEAGUE', 'LALIGA', 'SERIE A', 'BUNDESLIGA'].map((t) => (
            <div key={t} style={{ fontFamily: HV(), fontSize: 17, letterSpacing: 2, color: '#fff', border: '2px solid rgba(255,255,255,0.35)', background: 'rgba(11,10,13,0.6)', borderRadius: 10, padding: '7px 12px', whiteSpace: 'nowrap' }}>{t}</div>
          ))}
          <div style={{ fontFamily: HV(), fontSize: 17, letterSpacing: 2, color: '#0B0A0D', background: GOLD, borderRadius: 10, padding: '7px 12px', whiteSpace: 'nowrap' }}>PICK OF THE WEEKEND</div>
        </div>
      </div>
      <div style={{ position: 'absolute', right: 50, bottom: 70, fontFamily: HV(), fontSize: 15, letterSpacing: 3, color: 'rgba(255,255,255,0.45)' }}>18+ · OPINIONS ONLY · ALL TIMES ET</div>
    </AbsoluteFill>
  );
};
