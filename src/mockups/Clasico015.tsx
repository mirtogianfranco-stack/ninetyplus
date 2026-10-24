import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { theme, applyBrand } from '../theme';
import { Stadium } from './Mockups';
import words from '../../video-projects/np-015/vo/words.json';

// NP-015: EL CLÁSICO special. Barcelona to win + both teams score v Real Madrid, Sun 25 Oct 2026, 4:00 PM ET, Camp Nou.
// Sources: Understat 2026-27 LaLiga (Barcelona 39 goals in 9; Madrid scored in 8 of 9); team news Sports Mole / Forbes 21-24 Oct
// (Eric García, Christensen out, Koundé highly unlikely; Vinícius suspended). Kick-off ESPN esp.1 (20:00 UTC). Gate does not cover it.

const RED = '#FF2E4D';
const GOLD = '#FFD23F';
const GREEN = '#22C55E';
const SKY = '#87D8F7';
const BLAU = '#A50044';
const W: { word: string; start: number; end: number }[] = words.words;
export const NP015_SEC = words.duration;
const FPS = 30;
const at = (i: number) => Math.round(W[i].start * FPS);
const crest = (k: string) => staticFile('np-015/logos/' + k + '.png');
const sfx = (n: string) => staticFile('np-015/sfx/' + n);
const D = () => theme.fonts.display;
const HV = () => theme.fonts.heavy;
const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
type Cfg = { damping: number; stiffness: number; mass: number };
const useSpring = (from: number, cfg: Cfg = theme.spring.snappy) => spring({ frame: useCurrentFrame() - from, fps: FPS, config: cfg });

// Word indices: open 0-10, Barcelona 11-24, Madrid 25-35, reveal 36-42, comment 43-end.
const S1 = at(11), S2 = at(25), S3 = at(36), S4 = at(43);

const Scene: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const f = useCurrentFrame();
  if (f < from - 1 || f >= to + 6) return null;
  return <AbsoluteFill style={{ opacity: interpolate(f, [to, to + 6], [1, 0], CL) }}>{children}</AbsoluteFill>;
};

// The Clásico mark: gold EL CLÁSICO with a SPECIAL seal.
const SeriesMark: React.FC<{ from: number; top: number; scale?: number }> = ({ from, top, scale = 1 }) => {
  const f = useCurrentFrame();
  const s = useSpring(from, theme.spring.slap);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'scale(' + scale * interpolate(s, [0, 0.6, 1], [1.4, 0.95, 1], CL) + ')', opacity: Math.min(1, s * 2) }}>
      <div style={{ fontFamily: HV(), fontSize: 40, letterSpacing: 14, color: '#fff' }}>NINETY PLUS SPECIAL</div>
      <div style={{ position: 'relative', fontFamily: D(), fontSize: 180, lineHeight: 0.95, letterSpacing: 4, backgroundImage: 'linear-gradient(180deg, #FFF3B0 0%, ' + GOLD + ' 45%, #D99A00 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 30px rgba(255,210,63,0.55)) drop-shadow(0 10px 0 rgba(0,0,0,0.5))' }}>
        EL CLÁSICO
      </div>
      <div style={{ marginTop: 6, height: 10, width: 640, borderRadius: 5, background: 'linear-gradient(90deg, ' + BLAU + ' 0%, #004D98 50%, #FFFFFF 50%, #FEBE10 100%)', transform: 'scaleX(' + interpolate(f - from, [4, 20], [0, 1], CL) + ')' }} />
    </div>
  );
};

const Chip: React.FC<{ at: number; children: React.ReactNode; tag: string; tagColor?: string }> = ({ at: a, children, tag, tagColor = RED }) => {
  const s = useSpring(a, theme.spring.slap);
  if (useCurrentFrame() < a) return null;
  return (
    <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(11,10,13,0.88)', border: '3px solid ' + tagColor, borderRadius: 14, padding: '10px 18px', fontFamily: D(), fontSize: 46, color: '#fff', transform: 'scale(' + interpolate(s, [0, 1], [0.5, 1]) + ')', opacity: Math.min(1, s * 2), whiteSpace: 'nowrap' }}>
      {children}
      <span style={{ fontFamily: HV(), fontSize: 18, letterSpacing: 2, background: tagColor, color: tagColor === GOLD ? '#0B0A0D' : '#fff', borderRadius: 6, padding: '4px 8px' }}>{tag}</span>
    </div>
  );
};

const Matchup: React.FC<{ from: number; top: number; size?: number }> = ({ from, top, size = 230 }) => {
  const f = useCurrentFrame();
  const s = useSpring(from, theme.spring.smooth);
  const b = Math.sin(f / 30) * 6;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: s }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
        <Img src={crest('bar')} style={{ width: size, height: size, objectFit: 'contain', transform: 'translateY(' + b + 'px) translateX(' + interpolate(s, [0, 1], [-160, 0]) + 'px)', filter: 'drop-shadow(0 0 40px rgba(165,0,68,0.8))' }} />
        <div style={{ fontFamily: D(), fontSize: 80, color: 'rgba(255,255,255,0.7)' }}>V</div>
        <Img src={crest('rma')} style={{ width: size, height: size, objectFit: 'contain', transform: 'translateY(' + -b + 'px) translateX(' + interpolate(s, [0, 1], [160, 0]) + 'px)', filter: 'drop-shadow(0 0 30px rgba(254,190,16,0.6))' }} />
      </div>
      <div style={{ fontFamily: HV(), fontSize: 30, letterSpacing: 5, color: 'rgba(255,255,255,0.85)' }}>LALIGA · SUN 4:00 PM ET · CAMP NOU</div>
    </div>
  );
};

// Giant lit crest on the right, label + claim on the left.
const CrestHero: React.FC<{ from: number; k: string; glow: string; dim?: boolean; label: string; claim: React.ReactNode; children?: React.ReactNode }> = ({ from, k, glow, dim, label, claim, children }) => {
  const f = useCurrentFrame();
  const s = useSpring(from, theme.spring.smooth);
  return (
    <>
      <div style={{ position: 'absolute', right: -260, top: 560, width: 760, height: 760, borderRadius: '50%', background: 'radial-gradient(circle, ' + glow + ' 0%, rgba(0,0,0,0) 65%)', opacity: s }} />
      <Img src={crest(k)} style={{ position: 'absolute', right: -140, top: 640, width: 560, height: 560, objectFit: 'contain', opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [240, 0]) + 'px) rotate(' + (8 - (f - from) * 0.02) + 'deg) scale(' + (1 + (f - from) * 0.0008) + ')', filter: 'drop-shadow(0 0 50px ' + glow + ') drop-shadow(0 30px 40px rgba(0,0,0,0.7))' + (dim ? ' grayscale(0.6) brightness(0.6)' : '') }} />
      <div style={{ position: 'absolute', top: 280, left: 90, right: 90, display: 'flex', alignItems: 'center', gap: 14, opacity: s }}>
        <div style={{ background: GOLD, color: '#0B0A0D', fontFamily: HV(), fontSize: 26, letterSpacing: 3, padding: '8px 16px', borderRadius: 8 }}>EL CLÁSICO</div>
        <div style={{ fontFamily: HV(), fontSize: 22, color: 'rgba(255,255,255,0.75)', letterSpacing: 3 }}>{label}</div>
      </div>
      <div style={{ position: 'absolute', top: 360, left: 86, width: 680, fontFamily: D(), fontSize: 100, lineHeight: 0.95, color: '#fff', textShadow: '0 8px 30px rgba(0,0,0,0.8)', transform: 'skewX(-6deg) translateY(' + interpolate(s, [0, 1], [40, 0]) + 'px)', opacity: s }}>{claim}</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1150, bottom: 0, background: 'linear-gradient(180deg, rgba(11,10,13,0), rgba(11,10,13,0.95) 35%)' }} />
      {children}
    </>
  );
};

const Big: React.FC<{ at: number; value: string; label: string; top: number; color?: string }> = ({ at: a, value, label, top, color = GOLD }) => {
  const s = useSpring(a, theme.spring.slap);
  if (useCurrentFrame() < a) return null;
  return (
    <div style={{ position: 'absolute', left: 90, top, display: 'flex', alignItems: 'center', gap: 22, opacity: Math.min(1, s * 2), transform: 'scale(' + interpolate(s, [0, 0.6, 1], [1.5, 0.96, 1], CL) + ')', transformOrigin: '0 50%' }}>
      <div style={{ fontFamily: D(), fontSize: 200, lineHeight: 0.9, color, textShadow: '0 0 30px ' + color + '99, 0 8px 0 rgba(0,0,0,0.5)' }}>{value}</div>
      <div style={{ fontFamily: HV(), fontSize: 30, letterSpacing: 2, color: '#fff', maxWidth: 300, lineHeight: 1.15 }}>{label}</div>
    </div>
  );
};

const Form: React.FC<{ at: number; top: number; results: string[] }> = ({ at: a, top, results }) => {
  const f = useCurrentFrame();
  if (f < a) return null;
  return (
    <div style={{ position: 'absolute', left: 90, top, display: 'flex', gap: 10 }}>
      {results.map((r, i) => {
        const s = spring({ frame: f - a - i * 2, fps: FPS, config: theme.spring.snappy });
        const bg = r === 'W' ? GREEN : r === 'D' ? '#8a8a8a' : RED;
        return <div key={i} style={{ width: 62, height: 62, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D(), fontSize: 38, color: '#0B0A0D', transform: 'scale(' + s + ')' }}>{r}</div>;
      })}
    </div>
  );
};

const EMPH = new Set(['BIGGEST', 'TROUBLE.', 'THIRTY', 'PATCHED', 'EIGHT', 'VINÍCIUS.', 'WIN,', 'SCORE.', 'COMMENT']);
const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  let i = -1;
  for (let k = 0; k < W.length; k++) if (W[k].start <= t + 0.02) i = k;
  if (i < 0 || t > W[i].end + 0.25) return null;
  const w = W[i].word.toUpperCase();
  const s = spring({ frame: f - Math.round(W[i].start * FPS), fps: FPS, config: theme.spring.snappy });
  const em = EMPH.has(w);
  return (
    <div style={{ position: 'absolute', top: 1330, left: 0, right: 0, textAlign: 'center', fontFamily: em ? D() : HV(), fontSize: em ? 128 : 92, color: '#fff', transform: 'scale(' + interpolate(s, [0, 1], [0.85, 1]) + ')', ...(em ? { backgroundImage: 'linear-gradient(180deg, #FFFFFF 30%, ' + GOLD + ')', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 18px rgba(255,210,63,0.8))' } : { textShadow: '0 6px 0 rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.6)' }) }}>{w.replace(/[.,?]$/, '')}</div>
  );
};

export const NP015Clasico: React.FC = () => {
  applyBrand('ninetyplus');
  const f = useCurrentFrame();
  const END = Math.ceil(NP015_SEC * FPS);
  const tint = f < S1 ? '#6a5200' : f < S2 ? '#7a0033' : f < S3 ? '#6a5a20' : '#6a5200';
  const p = useSpring(at(36), theme.spring.slap);
  const p2 = useSpring(at(40), theme.spring.slap);
  const shake = f >= at(36) && f < at(36) + 10 ? Math.sin(f * 2.5) * (10 - (f - at(36))) : 0;
  const hit = (from: number, name: string, vol = 0.4, dur = 1.2) => <Sequence from={Math.max(0, from - 1)} durationInFrames={Math.round(dur * FPS)} layout='none'><Audio src={sfx(name)} volume={vol} /></Sequence>;
  return (
    <AbsoluteFill style={{ background: '#0B0A0D' }}>
      <AbsoluteFill style={{ transform: 'translate(' + shake + 'px,' + shake * 0.6 + 'px)' }}>
        <Stadium tint={tint} dim={0.2} />
        <div style={{ position: 'absolute', top: 205, left: 0, right: 0, textAlign: 'center', fontFamily: HV(), fontSize: 26, letterSpacing: 6, color: 'rgba(255,255,255,0.75)' }}>NINETY PLUS · RECORD 17-6</div>
        {/* OPEN: Clásico mark + matchup on frame 0 */}
        <Scene from={0} to={S1}>
          <SeriesMark from={-10} top={330} />
          <Matchup from={-8} top={720} size={300} />
        </Scene>
        {/* BARCELONA: 39 in 9, patched back line */}
        <Scene from={S1} to={S2}>
          <CrestHero from={S1} k='bar' glow='rgba(165,0,68,0.75)' label='BARÇA AT HOME'
            claim={<>BARÇA<br /><span style={{ color: GOLD }}>SCORE</span><br />FOR FUN</>}>
            <Big at={at(14)} value='39' label='GOALS IN 9 LALIGA GAMES' top={680} />
            <div style={{ position: 'absolute', left: 90, top: 900, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Chip at={at(20)} tag='OUT'>ERIC GARCÍA</Chip>
              <Chip at={at(21)} tag='OUT'>CHRISTENSEN</Chip>
              <Chip at={at(23)} tag='DOUBT' tagColor={GOLD}>KOUNDÉ</Chip>
            </div>
          </CrestHero>
        </Scene>
        {/* MADRID: scored in 8 of 9, Vinícius suspended */}
        <Scene from={S2} to={S3}>
          <CrestHero from={S2} k='rma' glow='rgba(254,190,16,0.55)' label='MADRID AWAY'
            claim={<>MADRID<br /><span style={{ color: GOLD }}>ALWAYS</span><br />SCORE</>}>
            <Big at={at(30)} value='8/9' label='LALIGA GAMES WITH A MADRID GOAL' top={680} />
            <div style={{ position: 'absolute', left: 90, top: 900, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Chip at={at(35)} tag='SUSPENDED'>VINÍCIUS</Chip>
            </div>
          </CrestHero>
        </Scene>
        {/* REVEAL: two pills */}
        <Scene from={S3} to={S4}>
          <Matchup from={S3} top={430} size={260} />
          {f >= at(36) ? (
            <div style={{ position: 'absolute', left: 0, right: 0, top: 840, display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: 'linear-gradient(180deg, ' + GREEN + ', #15803d)', border: '6px solid ' + GOLD, borderRadius: 26, padding: '14px 40px', boxShadow: '0 0 60px rgba(255,210,63,0.6)', transform: 'scale(' + interpolate(p, [0, 0.6, 1], [2, 0.92, 1], CL) + ') rotate(-2deg)', opacity: Math.min(1, p * 2) }}>
                <div style={{ fontFamily: D(), fontSize: 104, color: '#0B0A0D', whiteSpace: 'nowrap' }}>BARÇA TO WIN</div>
              </div>
            </div>
          ) : null}
          {f >= at(40) ? (
            <div style={{ position: 'absolute', left: 0, right: 0, top: 1030, display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: 'linear-gradient(180deg, ' + GREEN + ', #15803d)', border: '6px solid ' + GOLD, borderRadius: 26, padding: '12px 36px', boxShadow: '0 0 60px rgba(255,210,63,0.6)', transform: 'scale(' + interpolate(p2, [0, 0.6, 1], [2, 0.92, 1], CL) + ') rotate(2deg)', opacity: Math.min(1, p2 * 2) }}>
                <div style={{ fontFamily: D(), fontSize: 84, color: '#0B0A0D', whiteSpace: 'nowrap' }}>+ BOTH TEAMS SCORE</div>
              </div>
            </div>
          ) : null}
        </Scene>
        {/* COMMENT */}
        <Scene from={S4} to={END + 10}>
          <SeriesMark from={S4} top={420} scale={0.8} />
          <Matchup from={S4 + 4} top={780} size={220} />
          {f >= at(47) ? (
            <div style={{ position: 'absolute', top: 280, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: GOLD, color: '#0B0A0D', fontFamily: D(), fontSize: 60, padding: '10px 28px', borderRadius: 16, boxShadow: '0 14px 40px rgba(255,210,63,0.45)', transform: 'translateY(' + Math.sin(f / 4) * 6 + 'px)', display: 'flex', alignItems: 'center', gap: 16 }}>WHO WINS? COMMENT <div style={{ width: 0, height: 0, borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderTop: '22px solid #0B0A0D' }} /></div>
            </div>
          ) : null}
        </Scene>
        <Captions />
      </AbsoluteFill>
      <Audio src={staticFile('np-015/voiceover.wav')} />
      <Audio src={staticFile('np-015/music/bed.wav')} volume={0.16} />
      {hit(0, 'cinematic_whoosh_impact.MP3', 0.5)}
      {hit(at(5), 'bass_impact.MP3', 0.5)}
      {hit(S1, 'whoosh_motion.MP3')}
      {hit(at(14), 'magic_reveal.MP3', 0.35)}
      {hit(at(20), 'pop_sound.MP3', 0.35, 0.5)}
      {hit(at(23), 'glitch_sound.MP3', 0.3, 0.5)}
      {hit(S2, 'fast_swoosh.MP3')}
      {hit(at(30), 'punch_sound.MP3', 0.4, 0.6)}
      {hit(at(35), 'wrong_answer.MP3', 0.25)}
      {hit(at(36) - 30, 'riser_sound_4sec.MP3', 0.3, 1)}
      {hit(at(36), 'cinematic_whoosh_impact.MP3', 0.55)}
      {hit(at(40), 'bass_impact.MP3', 0.5)}
      {hit(S4, 'title_swoosh.MP3')}
      {hit(at(47), 'pop_whoosh.MP3', 0.4, 0.6)}
    </AbsoluteFill>
  );
};
export const NP015_FRAMES = Math.ceil(NP015_SEC * FPS);
