import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { theme, applyBrand } from '../theme';
import { Stadium } from '../mockups/Mockups';

// YouTube thumbnail (1280x720) for a long-form data story: question on the left, crest + one big stat on the right.
const RED = '#FF2E4D';
const GOLD = '#FFD23F';
const D = () => theme.fonts.display;
const HV = () => theme.fonts.heavy;

export const StoryThumb: React.FC<{ dir: string; crest: string; lines: [string, string]; stat: string; statLabel: string; glow: string }> = ({ dir, crest, lines, stat, statLabel, glow }) => {
  applyBrand('ninetyplus');
  return (
    <AbsoluteFill style={{ background: '#0B0A0D', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, transform: 'scale(1.3)', transformOrigin: '50% 40%' }}><Stadium tint='#0a2a6a' dim={0.2} /></div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(11,10,13,0.92) 0%, rgba(11,10,13,0.55) 55%, rgba(11,10,13,0.2) 100%)' }} />
      <div style={{ position: 'absolute', right: -60, top: 40, width: 640, height: 640, borderRadius: '50%', background: 'radial-gradient(circle, ' + glow + ' 0%, rgba(0,0,0,0) 62%)' }} />
      <Img src={staticFile(dir + '/logos/' + crest + '.png')} style={{ position: 'absolute', right: 70, top: 110, width: 440, height: 440, objectFit: 'contain', transform: 'rotate(8deg)', filter: 'drop-shadow(0 0 40px ' + glow + ') drop-shadow(0 20px 30px rgba(0,0,0,0.7))' }} />
      <div style={{ position: 'absolute', left: 50, top: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 14, height: 44, background: RED, borderRadius: 4, boxShadow: '0 0 20px ' + RED }} />
        <div style={{ fontFamily: HV(), fontSize: 26, letterSpacing: 6, color: '#fff' }}>NINETY PLUS · DATA STORY</div>
      </div>
      <div style={{ position: 'absolute', left: 50, top: 120, width: 760 }}>
        <div style={{ fontFamily: D(), fontSize: 150, lineHeight: 0.9, color: '#fff', textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>{lines[0]}</div>
        <div style={{ fontFamily: D(), fontSize: 150, lineHeight: 0.9, color: RED, textShadow: '0 0 40px rgba(255,46,77,0.5), 0 10px 30px rgba(0,0,0,0.8)' }}>{lines[1]}</div>
      </div>
      <div style={{ position: 'absolute', left: 50, bottom: 50, display: 'flex', alignItems: 'center', gap: 20, background: 'rgba(11,10,13,0.85)', border: '4px solid ' + GOLD, borderRadius: 20, padding: '8px 26px', transform: 'rotate(-2deg)' }}>
        <div style={{ fontFamily: D(), fontSize: 110, color: GOLD, lineHeight: 1 }}>{stat}</div>
        <div style={{ fontFamily: HV(), fontSize: 24, letterSpacing: 2, color: '#fff', maxWidth: 330, lineHeight: 1.2 }}>{statLabel}</div>
      </div>
    </AbsoluteFill>
  );
};
