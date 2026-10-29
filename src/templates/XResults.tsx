import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { theme, applyBrand } from '../theme';
import { Stadium } from '../mockups/Mockups';
import type { ResultsSpec } from './ResultsTemplate';

// Still image of a graded card for X / Instagram, straight from a results video's ResultsSpec.
// card = which card to show (index into spec.cards). wide = 1200x675, tall = 1080x1350.

const RED = '#FF2E4D';
const GOLD = '#FFD23F';
const GREEN = '#22C55E';
const D = () => theme.fonts.display;
const HV = () => theme.fonts.heavy;
const OUTLINE = 'drop-shadow(0 0 3px rgba(255,255,255,0.9))';

export const XResults: React.FC<{ spec: ResultsSpec; card?: number; tall?: boolean; handle?: string }> = ({ spec, card = 0, tall, handle = 'NINETY PLUS' }) => {
  applyBrand('ninetyplus');
  const c = spec.cards[card];
  const crest = (k: string) => staticFile(spec.dir + '/logos/' + k + '.png');
  const n = c.rows.length;
  const rowH = tall ? Math.min(124, (560 - 18 * (n - 1)) / n) : Math.min(84, (360 - 10 * (n - 1)) / n);
  const fs = tall ? Math.min(54, rowH * 0.4) : Math.min(40, rowH * 0.48);
  const pad = tall ? 60 : 56;
  const win = c.stamp.win;
  const sc = win ? GREEN : RED;
  const tc = c.titleColor === 'gold' ? GOLD : c.titleColor === 'green' ? GREEN : RED;
  return (
    <AbsoluteFill style={{ background: '#0B0A0D', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, transform: tall ? 'scale(1.1)' : 'scale(1.6) translateY(8%)', transformOrigin: '50% 30%' }}>
        <Stadium tint={win ? '#0a5a2a' : '#5a0a1a'} dim={0.35} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,10,13,0.35), rgba(11,10,13,0.88))' }} />
      <div style={{ position: 'absolute', top: tall ? 70 : 36, left: pad, right: pad, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: tall ? 18 : 14, height: tall ? 54 : 42, background: RED, borderRadius: 4, boxShadow: '0 0 20px ' + RED }} />
          <div style={{ fontFamily: HV(), fontSize: tall ? 30 : 24, letterSpacing: 6, color: '#fff' }}>{handle}</div>
        </div>
        <div style={{ fontFamily: HV(), fontSize: tall ? 26 : 22, letterSpacing: 4, color: 'rgba(255,255,255,0.85)' }}>{spec.outro.record.label} <span style={{ color: GOLD }}>{spec.outro.record.value}</span></div>
      </div>
      <div style={{ position: 'absolute', top: tall ? 160 : 98, left: pad, right: pad, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: D(), fontSize: tall ? 110 : 76, lineHeight: 0.95, color: '#fff', letterSpacing: 2 }}>{c.title[0]} <span style={{ color: tc }}>{c.title[1]}</span></div>
        <div style={{ fontFamily: HV(), fontSize: tall ? 24 : 20, letterSpacing: 3, color: 'rgba(255,255,255,0.75)' }}>{c.rows.filter((r) => r.win).length}/{n} LEGS</div>
      </div>
      <div style={{ position: 'absolute', top: tall ? 320 : 196, left: pad, right: tall ? pad : 400, display: 'flex', flexDirection: 'column', gap: tall ? 18 : 10 }}>
        {c.rows.map((r, i) => {
          const col = r.win ? GREEN : RED;
          return (
            <div key={i} style={{ height: rowH, display: 'flex', alignItems: 'center', gap: 16, background: r.win ? 'linear-gradient(90deg, rgba(34,197,94,0.3), rgba(11,10,13,0.75))' : 'linear-gradient(90deg, rgba(255,46,77,0.3), rgba(11,10,13,0.75))', border: '2px solid ' + col, borderRadius: 20, padding: '0 18px' }}>
              <Img src={crest(r.h)} style={{ width: rowH * 0.56, height: rowH * 0.56, objectFit: 'contain', filter: OUTLINE }} />
              <Img src={crest(r.a)} style={{ width: rowH * 0.56, height: rowH * 0.56, objectFit: 'contain', filter: OUTLINE }} />
              <div style={{ fontFamily: D(), fontSize: fs, color: '#fff', flex: 1, whiteSpace: 'nowrap' }}>{r.t}</div>
              <div style={{ fontFamily: D(), fontSize: fs, color: '#fff', whiteSpace: 'nowrap' }}>{r.score}</div>
              <div style={{ width: rowH * 0.6, height: rowH * 0.6, borderRadius: '50%', background: col, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D(), fontSize: fs * 0.85, color: '#0B0A0D', boxShadow: '0 0 18px ' + col }}>{r.win ? '✓' : '✗'}</div>
            </div>
          );
        })}
      </div>
      {/* verdict stamp */}
      <div style={{ position: 'absolute', ...(tall ? { left: 0, right: 0, top: 320 + n * (rowH + 18) + 30, display: 'flex', justifyContent: 'center' } : { right: 30, top: 270 }) }}>
        <div style={{ border: (tall ? 12 : 9) + 'px solid ' + sc, color: sc, borderRadius: 20, padding: tall ? '6px 46px' : '4px 26px', fontFamily: D(), fontSize: tall ? 128 : 84, letterSpacing: 6, background: 'rgba(11,10,13,0.85)', transform: 'rotate(-8deg)', boxShadow: '0 0 50px ' + sc + '88', textShadow: '0 0 30px ' + sc + '99' }}>{win ? 'LANDED' : 'BUST'}</div>
      </div>
      <div style={{ position: 'absolute', bottom: tall ? 70 : 26, left: pad, right: pad, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: HV(), fontSize: tall ? 22 : 16, letterSpacing: 2, color: 'rgba(255,255,255,0.7)' }}>
        <div style={{ whiteSpace: 'nowrap' }}>BACKED BY xG · EVERY CARD GRADED</div>
        <div style={{ background: GOLD, color: '#0B0A0D', fontFamily: D(), fontSize: tall ? 30 : 24, letterSpacing: 1, padding: tall ? '8px 18px' : '6px 14px', borderRadius: 10, whiteSpace: 'nowrap' }}>{spec.outro.line}</div>
      </div>
      <div style={{ position: 'absolute', bottom: tall ? 26 : 8, left: 0, right: 0, textAlign: 'center', fontFamily: HV(), fontSize: tall ? 16 : 12, letterSpacing: 2, color: 'rgba(255,255,255,0.4)' }}>18+ · OPINIONS ONLY</div>
    </AbsoluteFill>
  );
};
