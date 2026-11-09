import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { theme, applyBrand } from '../theme';
import { PreviewTemplate, type PreviewSpec } from './PreviewTemplate';

// 9:16 (1080x1920) edition of a long-form data story for TikTok / Reels: headline on top, the 16:9 video in the middle,
// big phrase captions underneath. Same audio and timing as the 16:9 render.
const RED = '#FF2E4D';
const GOLD = '#FFD23F';
const D = () => theme.fonts.display;
const HV = () => theme.fonts.heavy;
const FPS = 30;

export const VerticalStory: React.FC<{ spec: PreviewSpec; headline: [string, string]; tag?: string }> = ({ spec, headline, tag = 'DATA STORY' }) => {
  applyBrand('ninetyplus');
  const f = useCurrentFrame();
  const W = spec.words.words;
  const t = f / FPS;
  const lines = React.useMemo(() => {
    const out: { a: number; b: number }[] = [];
    let a = 0;
    W.forEach((w, i) => { if (i - a >= 4 || /[.?!,]$/.test(w.word) || i === W.length - 1) { out.push({ a, b: i }); a = i + 1; } });
    return out;
  }, [W]);
  const L = lines.find((l) => W[l.a].start <= t + 0.02 && t <= W[l.b].end + 0.3);
  const s = L ? spring({ frame: f - Math.round(W[L.a].start * FPS), fps: FPS, config: theme.spring.snappy }) : 0;
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #0B0A0D 0%, #111020 50%, #0B0A0D 100%)' }}>
      <div style={{ position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div style={{ width: 12, height: 38, background: RED, borderRadius: 4, boxShadow: '0 0 18px ' + RED }} />
          <div style={{ fontFamily: HV(), fontSize: 26, letterSpacing: 6, color: '#fff' }}>NINETY PLUS · {tag}</div>
        </div>
        <div style={{ fontFamily: D(), fontSize: 120, lineHeight: 0.95, color: '#fff' }}>{headline[0]}</div>
        <div style={{ fontFamily: D(), fontSize: 120, lineHeight: 0.95, color: RED, textShadow: '0 0 40px rgba(255,46,77,0.5)' }}>{headline[1]}</div>
      </div>
      <div style={{ position: 'absolute', top: 560, left: 0, width: 1920, height: 1080, transform: 'scale(0.5625)', transformOrigin: '0 0', boxShadow: '0 30px 80px rgba(0,0,0,0.7)' }}>
        <PreviewTemplate spec={spec} />
      </div>
      <div style={{ position: 'absolute', top: 560 + 608, left: 0, right: 0, height: 4, background: RED, opacity: 0.8 }} />
      {L ? (
        <div style={{ position: 'absolute', top: 1290, left: 60, right: 60, textAlign: 'center', fontFamily: D(), fontSize: 88, lineHeight: 1.05, color: '#fff', textShadow: '0 6px 0 rgba(0,0,0,0.6)', transform: 'scale(' + interpolate(s, [0, 1], [0.9, 1]) + ')' }}>
          {W.slice(L.a, L.b + 1).map((w, i) => {
            const on = W[L.a + i].start <= t + 0.02 && W[L.a + i].end >= t - 0.05;
            return <span key={i} style={{ color: on ? GOLD : '#fff' }}>{w.word.toUpperCase()} </span>;
          })}
        </div>
      ) : null}
      <div style={{ position: 'absolute', bottom: 120, left: 0, right: 0, textAlign: 'center', fontFamily: HV(), fontSize: 22, letterSpacing: 4, color: 'rgba(255,255,255,0.5)' }}>FULL VIDEO ON YOUTUBE · NINETY PLUS</div>
    </AbsoluteFill>
  );
};
