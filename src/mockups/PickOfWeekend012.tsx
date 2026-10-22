import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { theme, applyBrand } from '../theme';
import { Stadium } from './Mockups';
import words from '../../video-projects/np-012/vo/words.json';

// NP-012: PICK OF THE WEEKEND #1 (new series, its own record). Lazio to win v Parma, Sat 24 Oct 2026, 2:45 PM ET, Olimpico.
// Sources: Understat 2026-27 Serie A match history (Lazio W6 D1, 14-4; Parma 4-13, away 0-2, 1-2, 0-3, five defeats in seven).
// Kick-off ESPN ita.1 scoreboard (18:45 UTC). Voice: bm_george. Original bed from tools/make-beat.py. Gate does not cover it.

const RED = '#FF2E4D';
const GOLD = '#FFD23F';
const GREEN = '#22C55E';
const SKY = '#87D8F7';
const W: { word: string; start: number; end: number }[] = words.words;
export const NP012_SEC = words.duration;
const FPS = 30;
const at = (i: number) => Math.round(W[i].start * FPS);
const crest = (k: string) => staticFile('np-012/logos/' + k + '.png');
const sfx = (n: string) => staticFile('np-012/sfx/' + n);
const D = () => theme.fonts.display;
const HV = () => theme.fonts.heavy;
const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
type Cfg = { damping: number; stiffness: number; mass: number };
const useSpring = (from: number, cfg: Cfg = theme.spring.snappy) => spring({ frame: useCurrentFrame() - from, fps: FPS, config: cfg });

// Word indices: series open 0-6, Lazio 7-20, Parma 21-34, reveal 35-37, record + comment 38-end.
const S1 = at(7), S2 = at(21), S3 = at(35), S4 = at(38);

const Scene: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const f = useCurrentFrame();
  if (f < from - 1 || f >= to + 6) return null;
  return <AbsoluteFill style={{ opacity: interpolate(f, [to, to + 6], [1, 0], CL) }}>{children}</AbsoluteFill>;
};

// The series mark: gold "PICK OF THE WEEKEND" with a rotating #1 seal.
const SeriesMark: React.FC<{ from: number; top: number; scale?: number; n?: number }> = ({ from, top, scale = 1, n = 1 }) => {
  const f = useCurrentFrame();
  const s = useSpring(from, theme.spring.slap);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'scale(' + scale * interpolate(s, [0, 0.6, 1], [1.4, 0.95, 1], CL) + ')', opacity: Math.min(1, s * 2) }}>
      <div style={{ fontFamily: HV(), fontSize: 40, letterSpacing: 14, color: '#fff' }}>PICK OF THE</div>
      <div style={{ position: 'relative', fontFamily: D(), fontSize: 190, lineHeight: 0.95, letterSpacing: 4, backgroundImage: 'linear-gradient(180deg, #FFF3B0 0%, ' + GOLD + ' 45%, #D99A00 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 30px rgba(255,210,63,0.55)) drop-shadow(0 10px 0 rgba(0,0,0,0.5))' }}>
        WEEKEND
      </div>
      <div style={{ position: 'absolute', right: 70, top: -40, width: 150, height: 150, borderRadius: '50%', background: RED, border: '6px solid ' + GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(' + (-12 + Math.sin(f / 18) * 6) + 'deg)', boxShadow: '0 0 30px rgba(255,46,77,0.7)' }}>
        <div style={{ fontFamily: D(), fontSize: 84, color: '#fff' }}>#{n}</div>
      </div>
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
        <Img src={crest('laz')} style={{ width: size, height: size, objectFit: 'contain', transform: 'translateY(' + b + 'px) translateX(' + interpolate(s, [0, 1], [-160, 0]) + 'px)', filter: 'drop-shadow(0 0 40px rgba(135,216,247,0.8))' }} />
        <div style={{ fontFamily: D(), fontSize: 80, color: 'rgba(255,255,255,0.7)' }}>V</div>
        <Img src={crest('par')} style={{ width: size * 0.85, height: size * 0.85, objectFit: 'contain', transform: 'translateY(' + -b + 'px) translateX(' + interpolate(s, [0, 1], [160, 0]) + 'px)', filter: 'drop-shadow(0 0 30px rgba(255,214,0,0.5))' }} />
      </div>
      <div style={{ fontFamily: HV(), fontSize: 30, letterSpacing: 5, color: 'rgba(255,255,255,0.85)' }}>SERIE A · SAT 2:45 PM ET</div>
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
        <div style={{ background: GOLD, color: '#0B0A0D', fontFamily: HV(), fontSize: 26, letterSpacing: 3, padding: '8px 16px', borderRadius: 8 }}>PICK OF THE WEEKEND #1</div>
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

const EMPH = new Set(['FIRST', 'UNBEATEN', 'FOUR', 'ONCE', 'FIVE', 'WIN.', 'NOW.', 'COMMENT']);
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

export const NP012POTW: React.FC = () => {
  applyBrand('ninetyplus');
  const f = useCurrentFrame();
  const END = Math.ceil(NP012_SEC * FPS);
  const tint = f < S1 ? '#6a5200' : f < S2 ? '#1f6f9a' : f < S3 ? '#3a3a3a' : '#6a5200';
  const p = useSpring(at(35), theme.spring.slap);
  const shake = f >= at(35) && f < at(35) + 10 ? Math.sin(f * 2.5) * (10 - (f - at(35))) : 0;
  const hit = (from: number, name: string, vol = 0.4, dur = 1.2) => <Sequence from={Math.max(0, from - 1)} durationInFrames={Math.round(dur * FPS)} layout='none'><Audio src={sfx(name)} volume={vol} /></Sequence>;
  return (
    <AbsoluteFill style={{ background: '#0B0A0D' }}>
      <AbsoluteFill style={{ transform: 'translate(' + shake + 'px,' + shake * 0.6 + 'px)' }}>
        <Stadium tint={tint} dim={0.2} />
        <div style={{ position: 'absolute', top: 205, left: 0, right: 0, textAlign: 'center', fontFamily: HV(), fontSize: 26, letterSpacing: 6, color: 'rgba(255,255,255,0.75)' }}>NINETY PLUS · NEW SERIES</div>
        {/* OPEN: series mark + matchup on frame 0 */}
        <Scene from={0} to={S1}>
          <SeriesMark from={-10} top={330} />
          <Matchup from={-8} top={720} size={300} />
        </Scene>
        {/* LAZIO: unbeaten, 4 conceded in 7 */}
        <Scene from={S1} to={S2}>
          <CrestHero from={S1} k='laz' glow='rgba(135,216,247,0.75)' label='LAZIO AT HOME'
            claim={<>LAZIO<br /><span style={{ color: SKY }}>UNBEATEN</span></>}>
            <Form at={at(9)} top={620} results={['W', 'W', 'W', 'D', 'W', 'W', 'W']} />
            <Big at={at(16)} value='4' label='GOALS CONCEDED IN 7 SERIE A GAMES' top={760} />
          </CrestHero>
        </Scene>
        {/* PARMA: 1 goal in 3 away games, lost 5 of 7 */}
        <Scene from={S2} to={S3}>
          <CrestHero from={S2} k='par' glow='rgba(255,214,0,0.35)' dim label='PARMA AWAY'
            claim={<>PARMA<br /><span style={{ color: RED }}>CAN&apos;T SCORE</span></>}>
            <Big at={at(24)} value='1' label='GOAL IN 3 AWAY GAMES' top={620} color={RED} />
            <Form at={at(31)} top={880} results={['L', 'L', 'D', 'L', 'W', 'L', 'L']} />
          </CrestHero>
        </Scene>
        {/* REVEAL */}
        <Scene from={S3} to={S4}>
          <Matchup from={S3} top={470} size={260} />
          {f >= at(35) ? (
            <div style={{ position: 'absolute', left: 0, right: 0, top: 900, display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: 'linear-gradient(180deg, ' + GREEN + ', #15803d)', border: '6px solid ' + GOLD, borderRadius: 26, padding: '18px 44px', boxShadow: '0 0 60px rgba(255,210,63,0.6)', transform: 'scale(' + interpolate(p, [0, 0.6, 1], [2, 0.92, 1], CL) + ') rotate(-2deg)', opacity: Math.min(1, p * 2) }}>
                <div style={{ fontFamily: D(), fontSize: 120, color: '#0B0A0D', whiteSpace: 'nowrap' }}>LAZIO TO WIN</div>
              </div>
            </div>
          ) : null}
        </Scene>
        {/* RECORD + COMMENT */}
        <Scene from={S4} to={END + 10}>
          <SeriesMark from={S4} top={420} scale={0.8} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 760, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 22 }}>
            {f >= at(43) ? <>
              <div style={{ fontFamily: HV(), fontSize: 34, letterSpacing: 6, color: '#fff' }}>RECORD</div>
              <div style={{ fontFamily: D(), fontSize: 200, color: GOLD, textShadow: '0 0 30px rgba(255,210,63,0.6)' }}>0-0</div>
            </> : null}
          </div>
          {f >= at(46) ? (
            <div style={{ position: 'absolute', top: 280, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: GOLD, color: '#0B0A0D', fontFamily: D(), fontSize: 56, padding: '10px 28px', borderRadius: 16, boxShadow: '0 14px 40px rgba(255,210,63,0.45)', transform: 'translateY(' + Math.sin(f / 4) * 6 + 'px)', display: 'flex', alignItems: 'center', gap: 16 }}>RIDING WITH US? COMMENT <div style={{ width: 0, height: 0, borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderTop: '22px solid #0B0A0D' }} /></div>
            </div>
          ) : null}
        </Scene>
        <Captions />
      </AbsoluteFill>
      <Audio src={staticFile('np-012/voiceover.wav')} />
      <Audio src={staticFile('np-012/music/bed.wav')} volume={0.16} />
      {hit(0, 'cinematic_whoosh_impact.MP3', 0.5)}
      {hit(at(6), 'bass_impact.MP3', 0.5)}
      {hit(S1, 'whoosh_motion.MP3')}
      {hit(at(9), 'pop_whoosh.MP3', 0.35, 0.8)}
      {hit(at(16), 'punch_sound.MP3', 0.4, 0.6)}
      {hit(S2, 'fast_swoosh.MP3')}
      {hit(at(24), 'glitch_sound.MP3', 0.35, 0.6)}
      {hit(at(31), 'wrong_answer.MP3', 0.3)}
      {hit(at(35) - 30, 'riser_sound_4sec.MP3', 0.3, 1)}
      {hit(at(35), 'cinematic_whoosh_impact.MP3', 0.55)}
      {hit(S4, 'title_swoosh.MP3')}
      {hit(at(43), 'bass_impact.MP3', 0.45)}
      {hit(at(46), 'pop_sound.MP3', 0.4, 0.6)}
    </AbsoluteFill>
  );
};
export const NP012_FRAMES = Math.ceil(NP012_SEC * FPS);
