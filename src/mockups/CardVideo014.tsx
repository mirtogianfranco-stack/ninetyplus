import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { theme, applyBrand } from '../theme';
import { Stadium } from './Mockups';
import words from '../../video-projects/np-014/vo/words.json';

// NP-014: Best of the Rest, 24-25 Oct 2026: Hoffenheim v Leverkusen 3+, Inter win v Fiorentina, Atletico win v Deportivo.
// Sources: Understat 2026-27 league data (Hoffenheim 6/6 games 3+ goals; Inter 21 scored, Fiorentina 17 conceded in 7;
// Atletico last five WWWWW, Deportivo DLDLD). Kick-offs ESPN. Weekend Card look + original beat. Gate does not cover it.

const RED = '#FF2E4D';
const GOLD = '#FFD23F';
const GREEN = '#22C55E';
const W: { word: string; start: number; end: number }[] = words.words;
export const NP014_SEC = words.duration;
const FPS = 30;
const at = (i: number) => Math.round(W[i].start * FPS);
const crest = (k: string) => staticFile('np-014/logos/' + k + '.png');
const player = (k: string) => staticFile('mockups/' + k + '.png');
const sfx = (n: string) => staticFile('np-014/sfx/' + n);
const D = () => theme.fonts.display;
const HV = () => theme.fonts.heavy;
const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
type Cfg = { damping: number; stiffness: number; mass: number };
const useSpring = (from: number, cfg: Cfg = theme.spring.snappy) => spring({ frame: useCurrentFrame() - from, fps: FPS, config: cfg });

// Word indices: hook 0-9, Hoffenheim/Leverkusen 10-18, Inter 19-33, Atletico 34-48, outro 49-end.
const S1 = at(10), S2 = at(19), S3 = at(34), S4 = at(49), S5 = at(49);

const ROWS: [string, string, string, string][] = [['tsg', 'b04', '3+ GOALS', 'SUN 10:30 AM'], ['int', 'fio', 'INTER TO WIN', 'SUN 7:30 AM'], ['atm', 'dep', 'ATLÉTICO TO WIN', 'SAT 3 PM']];

const Row: React.FC<{ n: number; h: string; a: string; t: string; k: string; from: number }> = ({ n, h, a, t, k, from }) => {
  const s = useSpring(from);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(11,10,13,0.72)', borderRadius: 20, padding: '12px 18px', marginTop: n > 1 ? 10 : 0, border: '1px solid rgba(255,255,255,0.12)', opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [80, 0]) + 'px)' }}>
      <div style={{ fontFamily: D(), fontSize: 40, color: RED, width: 30 }}>{n}</div>
      <Img src={crest(h)} style={{ width: 58, height: 58, objectFit: 'contain', filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.9))' }} />
      <Img src={crest(a)} style={{ width: 58, height: 58, objectFit: 'contain', filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.9))' }} />
      <div style={{ fontFamily: D(), fontSize: 44, color: '#fff', flex: 1, whiteSpace: 'nowrap' }}>{t}</div>
      <div style={{ fontFamily: HV(), fontSize: 18, color: 'rgba(255,255,255,0.65)', letterSpacing: 1, whiteSpace: 'nowrap' }}>{k} ET</div>
    </div>
  );
};

const Card: React.FC<{ from: number; top: number }> = ({ from, top }) => {
  const s = useSpring(from, theme.spring.smooth);
  return (
    <div style={{ position: 'absolute', left: 90, right: 90, top, background: 'linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))', border: '2px solid rgba(255,255,255,0.28)', borderRadius: 34, padding: '24px 24px 20px', boxShadow: '0 30px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.4)', backdropFilter: 'blur(14px)', opacity: Math.min(1, s * 1.4), transform: 'translateY(' + interpolate(s, [0, 1], [120, 0]) + 'px) scale(' + interpolate(s, [0, 1], [0.92, 1]) + ')' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontFamily: D(), fontSize: 56, color: '#fff', letterSpacing: 2 }}>BEST OF THE <span style={{ color: RED }}>REST</span></div>
        <div style={{ fontFamily: HV(), fontSize: 20, color: 'rgba(255,255,255,0.75)', letterSpacing: 2 }}>GER · ITA · ESP</div>
      </div>
      {ROWS.map(([h, a, t, k], i) => <Row key={t} n={i + 1} h={h} a={a} t={t} k={k} from={from + 6 + i * 4} />)}
    </div>
  );
};

// Hook/outro fan: the three home crests (no current player cut-outs for these clubs).
const Fan: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  const s = useSpring(from, theme.spring.smooth);
  const b = Math.sin(f / 40) * 8;
  const one = (k: string, left: number, top: number, w: number, rot: number, glow: string, dx: number) => (
    <Img src={crest(k)} style={{ position: 'absolute', left, top, width: w, height: w, objectFit: 'contain', opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [dx, 0]) + 'px) rotate(' + rot + 'deg)', filter: 'drop-shadow(0 0 40px ' + glow + ') drop-shadow(0 20px 30px rgba(0,0,0,0.6))' }} />
  );
  return (
    <>
      {one('tsg', 50, 320 + b, 260, -10, 'rgba(25,97,181,0.8)', -200)}
      {one('atm', 770, 320 - b, 260, 10, 'rgba(203,53,36,0.8)', 200)}
      {one('int', 380, 270, 320, 0, 'rgba(255,255,255,0.4)', 0)}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 500, height: 160, background: 'linear-gradient(180deg, rgba(11,10,13,0), rgba(11,10,13,0.85))' }} />
    </>
  );
};

const Form: React.FC<{ at: number; top: number; results: string[]; label: string }> = ({ at: a, top, results, label }) => {
  const f = useCurrentFrame();
  if (f < a) return null;
  return (
    <div style={{ position: 'absolute', left: 90, top, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontFamily: HV(), fontSize: 24, letterSpacing: 3, color: 'rgba(255,255,255,0.8)' }}>{label}</div>
      <div style={{ display: 'flex', gap: 10 }}>
        {results.map((r, i) => {
          const s = spring({ frame: f - a - i * 2, fps: FPS, config: theme.spring.snappy });
          const bg = r === 'W' || r === '✓' ? GREEN : r === 'D' ? '#8a8a8a' : RED;
          return <div key={i} style={{ width: 64, height: 64, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D(), fontSize: 38, color: '#0B0A0D', transform: 'scale(' + s + ')' }}>{r}</div>;
        })}
      </div>
    </div>
  );
};

const Hero: React.FC<{ from: number; n: number; img?: string; big?: string; glow: string; h: string; a: string; time: string; claim: React.ReactNode; pill: string; pillAt: number; children?: React.ReactNode }> = ({ from, n, img, big, glow, h, a, time, claim, pill, pillAt, children }) => {
  const f = useCurrentFrame();
  const s = useSpring(from, theme.spring.smooth);
  const p = useSpring(pillAt, theme.spring.slap);
  return (
    <>
      {img ? (
        <Img src={player(img)} style={{ position: 'absolute', right: -170, top: 560, width: 900, opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [260, 0]) + 'px) scale(' + (1 + (f - from) * 0.0006) + ')', transformOrigin: '50% 100%', filter: 'drop-shadow(-16px 0 36px ' + glow + ') contrast(1.06)' }} />
      ) : (
        <>
          <div style={{ position: 'absolute', right: -260, top: 600, width: 720, height: 720, borderRadius: '50%', background: 'radial-gradient(circle, ' + glow + ' 0%, rgba(0,0,0,0) 65%)', opacity: s }} />
          <Img src={crest(big!)} style={{ position: 'absolute', right: -150, top: 680, width: 520, height: 520, objectFit: 'contain', opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [240, 0]) + 'px) rotate(' + (8 - (f - from) * 0.02) + 'deg) scale(' + (1 + (f - from) * 0.0008) + ')', filter: 'drop-shadow(0 0 50px ' + glow + ') drop-shadow(0 30px 40px rgba(0,0,0,0.7))' }} />
        </>
      )}
      <div style={{ position: 'absolute', top: 280, left: 90, right: 90, display: 'flex', alignItems: 'center', gap: 14, opacity: s }}>
        <div style={{ background: RED, color: '#fff', fontFamily: HV(), fontSize: 26, letterSpacing: 3, padding: '8px 16px', borderRadius: 8 }}>PICK {n} OF 3</div>
        <Img src={crest(h)} style={{ width: 60, height: 60, objectFit: 'contain', filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.9))' }} />
        <div style={{ fontFamily: D(), fontSize: 30, color: 'rgba(255,255,255,0.6)' }}>V</div>
        <Img src={crest(a)} style={{ width: 60, height: 60, objectFit: 'contain', filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.9))' }} />
        <div style={{ fontFamily: HV(), fontSize: 20, color: 'rgba(255,255,255,0.7)', letterSpacing: 2 }}>{time} ET</div>
      </div>
      <div style={{ position: 'absolute', top: 360, left: 86, width: 660, fontFamily: D(), fontSize: 96, lineHeight: 0.95, color: '#fff', textShadow: '0 8px 30px rgba(0,0,0,0.8)', transform: 'skewX(-6deg) translateY(' + interpolate(s, [0, 1], [40, 0]) + 'px)', opacity: s }}>{claim}</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1150, bottom: 0, background: 'linear-gradient(180deg, rgba(11,10,13,0), rgba(11,10,13,0.95) 35%)' }} />
      {children}
      {f >= pillAt ? (
        <div style={{ position: 'absolute', left: 90, top: 1120, display: 'flex', alignItems: 'center', background: 'linear-gradient(180deg, ' + GREEN + ', #15803d)', borderRadius: 22, padding: '14px 30px', boxShadow: '0 16px 40px rgba(34,197,94,0.45)', transform: 'scale(' + interpolate(p, [0, 0.6, 1], [1.6, 0.95, 1], CL) + ') rotate(-2deg)', opacity: Math.min(1, p * 2) }}>
          <div style={{ fontFamily: D(), fontSize: 76, color: '#0B0A0D', whiteSpace: 'nowrap' }}>{pill}</div>
        </div>
      ) : null}
    </>
  );
};

const Chip: React.FC<{ at: number; children: React.ReactNode; border?: string; tag?: string }> = ({ at: a, children, border = RED, tag }) => {
  const s = useSpring(a, theme.spring.slap);
  if (useCurrentFrame() < a) return null;
  return (
    <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(11,10,13,0.88)', border: '3px solid ' + border, borderRadius: 14, padding: '10px 18px', fontFamily: D(), fontSize: 48, color: '#fff', transform: 'scale(' + interpolate(s, [0, 1], [0.5, 1]) + ')', opacity: Math.min(1, s * 2), whiteSpace: 'nowrap' }}>
      {children}
      {tag ? <span style={{ fontFamily: HV(), fontSize: 18, letterSpacing: 2, background: GOLD, color: '#0B0A0D', borderRadius: 6, padding: '4px 8px' }}>{tag}</span> : null}
    </div>
  );
};

const Big: React.FC<{ at: number; value: string; label: string; top: number; color?: string }> = ({ at: a, value, label, top, color = GOLD }) => {
  const s = useSpring(a, theme.spring.slap);
  if (useCurrentFrame() < a) return null;
  return (
    <div style={{ position: 'absolute', left: 90, top, display: 'flex', alignItems: 'baseline', gap: 18, opacity: Math.min(1, s * 2), transform: 'scale(' + interpolate(s, [0, 0.6, 1], [1.5, 0.96, 1], CL) + ')', transformOrigin: '0 50%' }}>
      <div style={{ fontFamily: D(), fontSize: 190, lineHeight: 0.9, color, textShadow: '0 0 30px ' + color + '99, 0 8px 0 rgba(0,0,0,0.5)' }}>{value}</div>
      <div style={{ fontFamily: HV(), fontSize: 26, letterSpacing: 2, color: '#fff', maxWidth: 260, lineHeight: 1.15 }}>{label}</div>
    </div>
  );
};

const EMPH = new Set(['EVERY', 'SIX', 'TWENTY', 'SEVENTEEN.', 'FIVE', 'LAZIO.', 'COMMENT']);
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
    <div style={{ position: 'absolute', top: 1330, left: 0, right: 0, textAlign: 'center', fontFamily: em ? D() : HV(), fontSize: em ? 128 : 92, color: '#fff', transform: 'scale(' + interpolate(s, [0, 1], [0.85, 1]) + ')', ...(em ? { backgroundImage: 'linear-gradient(180deg, #FFFFFF 30%, ' + RED + ')', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 18px ' + RED + ')' } : { textShadow: '0 6px 0 rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.6)' }) }}>{w.replace(/[.,?]$/, '')}</div>
  );
};

const Progress: React.FC = () => {
  const f = useCurrentFrame();
  const cur = f < S1 ? 0 : f < S2 ? 1 : f < S3 ? 2 : 3;
  return (
    <div style={{ position: 'absolute', top: 205, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 10 }}>
      {[1, 2, 3].map((n) => <div key={n} style={{ width: 84, height: 8, borderRadius: 4, background: n <= cur ? RED : 'rgba(255,255,255,0.25)' }} />)}
    </div>
  );
};

const Scene: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const f = useCurrentFrame();
  if (f < from - 1 || f >= to + 6) return null;
  return <AbsoluteFill style={{ opacity: interpolate(f, [to, to + 6], [1, 0], CL) }}>{children}</AbsoluteFill>;
};

const Tint: React.FC = () => {
  const f = useCurrentFrame();
  const tint = f < S1 ? '#1a2a8a' : f < S2 ? '#1961B5' : f < S3 ? '#0A1E5C' : f < S4 ? '#CB3524' : '#1a2a8a';
  return <Stadium tint={tint} dim={0.15} />;
};

export const NP014Card: React.FC = () => {
  applyBrand('ninetyplus');
  const f = useCurrentFrame();
  const END = Math.ceil(NP014_SEC * FPS);
  const hit = (from: number, name: string, vol = 0.4, dur = 1.2) => <Sequence from={Math.max(0, from - 1)} durationInFrames={Math.round(dur * FPS)} layout='none'><Audio src={sfx(name)} volume={vol} /></Sequence>;
  return (
    <AbsoluteFill style={{ background: '#0B0A0D' }}>
      <Tint />
      {/* HOOK: whole card on frame 0 */}
      <Scene from={0} to={S1}>
        <Fan from={-12} />
        <Card from={-14} top={640} />
        <div style={{ position: 'absolute', top: 260, left: 0, right: 0, textAlign: 'center', fontFamily: HV(), fontSize: 30, letterSpacing: 6, color: 'rgba(255,255,255,0.85)' }}>NINETY PLUS · RECORD <span style={{ color: GOLD }}>16-5</span></div>
      </Scene>
      {/* PICK 1: Hoffenheim v Leverkusen, 3+ goals */}
      <Scene from={S1} to={S2}>
        <Hero from={S1} n={1} big='tsg' glow='rgba(25,97,181,0.8)' h='tsg' a='b04' time='SUN 10:30 AM' pill='3+ GOALS' pillAt={at(16)}
          claim={<>HOFFENHEIM<br />GAMES<br /><span style={{ color: GOLD }}>EXPLODE</span></>}>
          <Form at={at(10)} top={740} label='3+ GOALS IN EVERY GAME' results={['✓', '✓', '✓', '✓', '✓', '✓']} />
        </Hero>
      </Scene>
      {/* PICK 2: Inter v Fiorentina */}
      <Scene from={S2} to={S3}>
        <Hero from={S2} n={2} big='int' glow='rgba(255,255,255,0.4)' h='int' a='fio' time='SUN 7:30 AM' pill='INTER TO WIN' pillAt={at(31)}
          claim={<>INTER<br /><span style={{ color: GOLD }}>SCORE</span><br />FIORENTINA LEAK</>}>
          <Big at={at(22)} value='21' label='INTER GOALS IN 7' top={760} />
          <Big at={at(30)} value='17' label='FIORENTINA CONCEDED IN 7' top={990} color={RED} />
        </Hero>
      </Scene>
      {/* PICK 3: Atletico v Deportivo */}
      <Scene from={S3} to={S4}>
        <Hero from={S3} n={3} big='atm' glow='rgba(203,53,36,0.8)' h='atm' a='dep' time='SAT 3 PM' pill='ATLÉTICO TO WIN' pillAt={at(46)}
          claim={<>ATLÉTICO<br /><span style={{ color: GOLD }}>ON FIRE</span></>}>
          <Form at={at(37)} top={660} label='ATLÉTICO · LAST 5' results={['W', 'W', 'W', 'W', 'W']} />
          <Form at={at(41)} top={860} label='DEPORTIVO · LAST 5' results={['D', 'L', 'D', 'L', 'D']} />
        </Hero>
      </Scene>
      {/* OUTRO: card back + comment */}
      <Scene from={S5} to={END + 10}>
        <Fan from={S5} />
        <Card from={S5 + 2} top={640} />
        {f >= at(49) && f < at(59) ? (
          <div style={{ position: 'absolute', top: 280, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(11,10,13,0.9)', border: '3px solid ' + GOLD, color: '#fff', fontFamily: D(), fontSize: 50, padding: '8px 24px', borderRadius: 16 }}><Img src={crest('laz')} style={{ width: 56, height: 56, objectFit: 'contain' }} />PICK OF THE WEEKEND · <span style={{ color: GOLD }}>LAZIO</span></div>
          </div>
        ) : null}
        {f >= at(59) ? (
          <div style={{ position: 'absolute', top: 280, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: GOLD, color: '#0B0A0D', fontFamily: D(), fontSize: 64, padding: '10px 30px', borderRadius: 16, boxShadow: '0 14px 40px rgba(255,210,63,0.45)', transform: 'translateY(' + Math.sin(f / 4) * 6 + 'px)', display: 'flex', alignItems: 'center', gap: 16 }}>COMMENT YOUR PICK <div style={{ width: 0, height: 0, borderLeft: '18px solid transparent', borderRight: '18px solid transparent', borderTop: '24px solid #0B0A0D' }} /></div>
          </div>
        ) : null}
      </Scene>
      <Progress />
      <Captions />
      <Audio src={staticFile('np-014/voiceover.wav')} />
      <Audio src={staticFile('np-014/music/bed.wav')} volume={0.16} />
      {hit(0, 'bass_impact.MP3', 0.5)}
      {hit(S1, 'whoosh_motion.MP3')}
      {hit(at(10), 'pop_whoosh.MP3', 0.35, 0.8)}
      {hit(at(16), 'punch_sound.MP3', 0.45)}
      {hit(S2, 'fast_swoosh.MP3')}
      {hit(at(22), 'magic_reveal.MP3', 0.35)}
      {hit(at(30), 'glitch_sound.MP3', 0.35, 0.6)}
      {hit(at(31), 'cinematic_whoosh_impact.MP3', 0.45)}
      {hit(S3, 'classic_whoosh.MP3')}
      {hit(at(37), 'pop_sound.MP3', 0.35, 0.5)}
      {hit(at(41), 'wrong_answer.MP3', 0.25)}
      {hit(at(46), 'punch_sound.MP3', 0.45)}
      {hit(S4, 'title_swoosh.MP3')}
      {hit(at(59), 'pop_sound.MP3', 0.4)}
    </AbsoluteFill>
  );
};
export const NP014_CARD_FRAMES = Math.ceil(NP014_SEC * FPS);
