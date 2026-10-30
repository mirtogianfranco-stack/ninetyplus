import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { theme, applyBrand } from '../theme';
import { Stadium } from '../mockups/Mockups';
import type { SpotlightSpec } from './SpotlightTemplate';

// Still image of a spotlight pick (Pick of the Weekend etc.) for X / Instagram, straight from the video's SpotlightSpec:
// the mark (+ seal), the match-up, the pick pill(s), the case in one line per stat device, and the series record.
// wide = 1200x675, tall = 1080x1350.

const RED = '#FF2E4D';
const GOLD = '#FFD23F';
const GREEN = '#22C55E';
const D = () => theme.fonts.display;
const HV = () => theme.fonts.heavy;
const OUTLINE = 'drop-shadow(0 0 3px rgba(255,255,255,0.9))';

export const XSpotlight: React.FC<{ spec: SpotlightSpec; tall?: boolean; handle?: string }> = ({ spec, tall, handle = 'NINETY PLUS' }) => {
  applyBrand('ninetyplus');
  const crest = (k: string) => staticFile(spec.dir + '/logos/' + k + '.png');
  const season = spec.topline.match(/RECORD\s+(\S+)/)?.[1];
  const rec = spec.outro.record;
  const stats = spec.scenes.flatMap((s) => s.devices).flatMap((d) =>
    d.kind === 'form' ? [{ v: d.results.filter((r) => r === '✓' || r === 'W').length + '/' + d.results.length, l: d.label }]
      : d.kind === 'big' ? [{ v: d.value, l: d.label }] : []);
  const pad = tall ? 60 : 50;
  const cr = tall ? 160 : 130;
  return (
    <AbsoluteFill style={{ background: '#0B0A0D', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, transform: tall ? 'scale(1.1)' : 'scale(1.6) translateY(8%)', transformOrigin: '50% 30%' }}>
        <Stadium tint='#5a3a0a' dim={0.35} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,10,13,0.35), rgba(11,10,13,0.88))' }} />
      {/* header */}
      <div style={{ position: 'absolute', top: tall ? 60 : 30, left: pad, right: pad, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: tall ? 18 : 14, height: tall ? 54 : 42, background: RED, borderRadius: 4, boxShadow: '0 0 20px ' + RED }} />
          <div style={{ fontFamily: HV(), fontSize: tall ? 30 : 24, letterSpacing: 6, color: '#fff' }}>{handle}</div>
        </div>
        {season && <div style={{ fontFamily: HV(), fontSize: tall ? 26 : 22, letterSpacing: 4, color: 'rgba(255,255,255,0.85)' }}>SEASON <span style={{ color: GOLD }}>{season}</span></div>}
      </div>
      {/* left block (tall: stacked) */}
      <div style={{ position: 'absolute', top: tall ? 140 : 120, left: pad, right: tall ? pad : 560, display: 'flex', flexDirection: 'column', alignItems: tall ? 'center' : 'flex-start' }}>
        <div style={{ fontFamily: HV(), fontSize: tall ? 40 : 28, letterSpacing: 10, color: '#fff' }}>{spec.mark.small}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ fontFamily: D(), fontSize: tall ? 170 : 112, lineHeight: 0.95, color: GOLD, letterSpacing: 3, textShadow: '0 0 40px rgba(255,210,63,0.5)' }}>{spec.mark.big}</div>
          {spec.mark.seal && <div style={{ width: tall ? 110 : 76, height: tall ? 110 : 76, borderRadius: '50%', background: RED, border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D(), fontSize: tall ? 54 : 36, color: '#fff', transform: 'rotate(-10deg)', boxShadow: '0 0 30px ' + RED }}>{spec.mark.seal}</div>}
        </div>
        <div style={{ marginTop: tall ? 24 : 18, display: 'flex', alignItems: 'center', gap: tall ? 50 : 30 }}>
          <Img src={crest(spec.matchup.h)} style={{ width: cr, height: cr, objectFit: 'contain', filter: OUTLINE }} />
          <div style={{ fontFamily: D(), fontSize: tall ? 70 : 46, color: 'rgba(255,255,255,0.75)' }}>V</div>
          <Img src={crest(spec.matchup.a)} style={{ width: cr, height: cr, objectFit: 'contain', filter: OUTLINE }} />
        </div>
        <div style={{ marginTop: tall ? 22 : 12, fontFamily: HV(), fontSize: tall ? 26 : 17, letterSpacing: 3, color: '#fff', whiteSpace: 'nowrap' }}>{spec.matchup.line}</div>
      </div>
      {/* pick + case + record */}
      <div style={{ position: 'absolute', top: tall ? 660 : 130, left: tall ? pad : 680, right: pad, display: 'flex', flexDirection: 'column', alignItems: tall ? 'center' : 'stretch', gap: tall ? 14 : 14 }}>
        {spec.reveal.pills.map((p) => (
          <div key={p.text} style={{ background: GREEN, border: '4px solid ' + GOLD, borderRadius: 18, padding: tall ? '10px 40px' : '6px 18px', fontFamily: D(), fontSize: tall ? 76 : 44, color: '#0B0A0D', textAlign: 'center', whiteSpace: 'nowrap', transform: 'rotate(-2deg)', boxShadow: '0 0 40px rgba(34,197,94,0.5)' }}>{p.text}</div>
        ))}
        <div style={{ marginTop: tall ? 8 : 4, display: 'flex', flexDirection: 'column', gap: tall ? 10 : 6, width: '100%' }}>
          {stats.map((s) => (
            <div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(11,10,13,0.6)', border: '2px solid rgba(255,255,255,0.18)', borderRadius: 14, padding: tall ? '8px 18px' : '4px 12px' }}>
              <div style={{ fontFamily: D(), fontSize: tall ? 46 : 30, color: GOLD, minWidth: tall ? 100 : 66 }}>{s.v}</div>
              <div style={{ fontFamily: HV(), fontSize: tall ? 22 : 14, letterSpacing: 2, color: '#fff' }}>{s.l}</div>
            </div>
          ))}
        </div>
        {rec && (
          <div style={{ marginTop: tall ? 6 : 2, display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 16 }}>
            <div style={{ fontFamily: HV(), fontSize: tall ? 28 : 18, letterSpacing: 4, color: '#fff' }}>{rec.label}</div>
            <div style={{ fontFamily: D(), fontSize: tall ? 90 : 58, color: GOLD, textShadow: '0 0 30px rgba(255,210,63,0.5)' }}>{rec.value}</div>
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', bottom: tall ? 26 : 8, left: 0, right: 0, textAlign: 'center', fontFamily: HV(), fontSize: tall ? 16 : 12, letterSpacing: 2, color: 'rgba(255,255,255,0.4)' }}>18+ · OPINIONS ONLY · BACKED BY xG</div>
    </AbsoluteFill>
  );
};
