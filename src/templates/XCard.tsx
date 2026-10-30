import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { theme, applyBrand } from '../theme';
import { Stadium } from '../mockups/Mockups';
import type { CardSpec } from './CardTemplate';

// Still image of a card for X / Instagram posts, straight from the video's CardSpec (no extra work per video).
// wide = 1200x675 (X timeline, 16:9), tall = 1080x1350 (4:5, Instagram feed / X tall).

const RED = '#FF2E4D';
const GOLD = '#FFD23F';
const D = () => theme.fonts.display;
const HV = () => theme.fonts.heavy;
const OUTLINE = 'drop-shadow(0 0 3px rgba(255,255,255,0.9))';

export const XCard: React.FC<{ spec: CardSpec; tall?: boolean; handle?: string }> = ({ spec, tall, handle = 'NINETY PLUS' }) => {
  applyBrand('ninetyplus');
  const crest = (k: string) => staticFile(spec.dir + '/logos/' + k + '.png');
  const n = spec.picks.length;
  const rowH = tall ? Math.min(170, (700 - 22 * (n - 1)) / n) : Math.min(96, (382 - 12 * (n - 1)) / n);
  const fs = tall ? Math.min(64, rowH * 0.42) : Math.min(44, rowH * 0.5);
  const W = tall ? 1080 : 1200;
  const pad = tall ? 60 : 56;
  return (
    <AbsoluteFill style={{ background: '#0B0A0D', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, transform: tall ? 'scale(1.1)' : 'scale(1.6) translateY(8%)', transformOrigin: '50% 30%' }}>
        <Stadium tint='#2a1a5a' dim={0.35} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,10,13,0.35), rgba(11,10,13,0.85))' }} />
      {/* header */}
      <div style={{ position: 'absolute', top: tall ? 70 : 36, left: pad, right: pad, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: tall ? 18 : 14, height: tall ? 54 : 42, background: RED, borderRadius: 4, boxShadow: '0 0 20px ' + RED }} />
          <div style={{ fontFamily: HV(), fontSize: tall ? 30 : 24, letterSpacing: 6, color: '#fff' }}>{handle}</div>
        </div>
        <div style={{ fontFamily: HV(), fontSize: tall ? 26 : 22, letterSpacing: 4, color: 'rgba(255,255,255,0.85)' }}>SEASON <span style={{ color: GOLD }}>{spec.record}</span></div>
      </div>
      <div style={{ position: 'absolute', top: tall ? 160 : 100, left: pad, right: pad, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: D(), fontSize: Math.min(tall ? 120 : 84, Math.floor((tall ? 1350 : 1500) / (spec.title.join(' ').length + 4))), lineHeight: 0.95, color: '#fff', letterSpacing: 2, whiteSpace: 'nowrap' }}>{spec.title[0]} <span style={{ color: RED }}>{spec.title[1]}</span></div>
        <div style={{ fontFamily: HV(), fontSize: tall ? 24 : 20, letterSpacing: 3, color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap', marginLeft: 20 }}>{spec.tag}</div>
      </div>
      {/* rows */}
      <div style={{ position: 'absolute', top: tall ? 330 : 205, left: pad, right: pad, display: 'flex', flexDirection: 'column', gap: tall ? 22 : 12 }}>
        {spec.picks.map((p, i) => (
          <div key={i} style={{ height: rowH, display: 'flex', alignItems: 'center', gap: 18, background: 'linear-gradient(90deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))', border: '2px solid rgba(255,255,255,0.18)', borderRadius: 22, padding: '0 22px', boxShadow: '0 12px 30px rgba(0,0,0,0.5)' }}>
            <div style={{ fontFamily: D(), fontSize: fs, color: RED, width: fs * 0.7 }}>{i + 1}</div>
            <Img src={crest(p.h)} style={{ width: rowH * 0.6, height: rowH * 0.6, objectFit: 'contain', filter: OUTLINE }} />
            <Img src={crest(p.a)} style={{ width: rowH * 0.6, height: rowH * 0.6, objectFit: 'contain', filter: OUTLINE }} />
            <div style={{ fontFamily: D(), fontSize: Math.min(fs, Math.floor(((tall ? 1080 : 1200) - 2 * pad - 44 - fs * 0.7 - 2 * rowH * 0.6 - 3 * 18 - (tall ? 125 : 110)) / ((p.row ?? p.pill).length * 0.5))), color: '#fff', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}>{p.row ?? p.pill}</div>
            <div style={{ fontFamily: HV(), fontSize: tall ? 19 : 16, color: 'rgba(255,255,255,0.75)', letterSpacing: 1, whiteSpace: 'nowrap', textAlign: 'right', flexShrink: 0 }}>{p.time}<br />ET</div>
          </div>
        ))}
      </div>
      {/* footer */}
      <div style={{ position: 'absolute', bottom: tall ? 70 : 26, left: pad, right: pad, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: HV(), fontSize: tall ? 22 : 16, letterSpacing: 2, color: 'rgba(255,255,255,0.7)' }}>
        <div style={{ whiteSpace: 'nowrap' }}>BACKED BY xG · EVERY CARD GRADED</div>
        <div style={{ background: GOLD, color: '#0B0A0D', fontFamily: D(), fontSize: tall ? 30 : 24, letterSpacing: 1, padding: tall ? '8px 18px' : '6px 14px', borderRadius: 10, whiteSpace: 'nowrap' }}>WHICH LEG BREAKS FIRST?</div>
      </div>
      <div style={{ position: 'absolute', bottom: tall ? 26 : 8, left: 0, right: 0, textAlign: 'center', fontFamily: HV(), fontSize: tall ? 16 : 12, letterSpacing: 2, color: 'rgba(255,255,255,0.4)' }}>18+ · OPINIONS ONLY</div>
      <div style={{ position: 'absolute', width: W }} />
    </AbsoluteFill>
  );
};
