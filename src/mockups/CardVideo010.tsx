import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { theme, applyBrand } from '../theme';
import { Stadium } from './Mockups';
import words from '../../video-projects/np-010/vo/words.json';

// NP-010: UCL matchday 3, Wednesday 21 Oct 2026, four legs in the Weekend Card look + original beat. Voice: bm_george.
// Sources: Understat 2026-27 league xG (Como 2.8 xG/g at home, Leipzig 2.77 xGA/g away, Bayern 0.95 / Arsenal 1.06 xGA/g);
// United defensive doubts (Martinez, Shaw) NBC Sports preview; Villa UCL results ESPN (6-0 Fenerbahce, 3-2 at Brugge).
// Kick-offs ESPN scoreboard: Como v United 16:45 UTC (12:45 PM ET), the rest 19:00 UTC (3:00 PM ET). Gate does not cover it.

const RED = '#FF2E4D';
const GOLD = '#FFD23F';
const GREEN = '#22C55E';
const W: { word: string; start: number; end: number }[] = words.words;
export const NP010_SEC = words.duration;
const FPS = 30;
const at = (i: number) => Math.round(W[i].start * FPS);
const crest = (k: string) => staticFile('np-010/logos/' + k + '.png');
const player = (k: string) => staticFile('mockups/' + k + '.png');
const sfx = (n: string) => staticFile('np-010/sfx/' + n);
const D = () => theme.fonts.display;
const HV = () => theme.fonts.heavy;
const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
type Cfg = { damping: number; stiffness: number; mass: number };
const useSpring = (from: number, cfg: Cfg = theme.spring.snappy) => spring({ frame: useCurrentFrame() - from, fps: FPS, config: cfg });

// Word indices: hook 0-8, Como/United 9-28, Madrid 29-41, Villa 42-51, Bayern/Arsenal 52-62, outro 63-end.
const S1 = at(9), S2 = at(29), S3 = at(42), S4 = at(52), S5 = at(63);

const ROWS: [string, string, string, string][] = [['com', 'mun', 'BOTH TEAMS SCORE', '12:45 PM'], ['rma', 'rbl', 'MADRID TO WIN', '3:00 PM'], ['avl', 'vik', 'VILLA TO WIN', '3:00 PM'], ['bay', 'ars', '3 GOALS OR FEWER', '3:00 PM']];

const Row: React.FC<{ n: number; h: string; a: string; t: string; k: string; from: number }> = ({ n, h, a, t, k, from }) => {
  const s = useSpring(from);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(11,10,13,0.72)', borderRadius: 20, padding: '12px 18px', marginTop: n > 1 ? 10 : 0, border: '1px solid rgba(255,255,255,0.12)', opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [80, 0]) + 'px)' }}>
      <div style={{ fontFamily: D(), fontSize: 40, color: RED, width: 30 }}>{n}</div>
      <Img src={crest(h)} style={{ width: 58, height: 58, objectFit: 'contain' }} />
      <Img src={crest(a)} style={{ width: 58, height: 58, objectFit: 'contain' }} />
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
        <div style={{ fontFamily: D(), fontSize: 56, color: '#fff', letterSpacing: 2 }}>WEDNESDAY <span style={{ color: RED }}>CARD</span></div>
        <div style={{ fontFamily: HV(), fontSize: 20, color: 'rgba(255,255,255,0.75)', letterSpacing: 2 }}>CHAMPIONS LEAGUE</div>
      </div>
      {ROWS.map(([h, a, t, k], i) => <Row key={h} n={i + 1} h={h} a={a} t={t} k={k} from={from + 6 + i * 4} />)}
    </div>
  );
};

// Hook/outro fan: Bruno (United) and Saka (Arsenal) flanking the Madrid + Bayern crests.
const Fan: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  const s = useSpring(from, theme.spring.smooth);
  const b = Math.sin(f / 40) * 6;
  return (
    <>
      <Img src={player('bruno')} style={{ position: 'absolute', left: -110, top: 250 + b, width: 560, opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [-200, 0]) + 'px) rotate(-5deg)', filter: 'drop-shadow(0 0 28px rgba(218,41,28,0.75)) contrast(1.05)' }} />
      <Img src={player('saka')} style={{ position: 'absolute', right: -110, top: 250 - b, width: 560, opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [200, 0]) + 'px) rotate(5deg)', filter: 'drop-shadow(0 0 28px rgba(239,1,7,0.75)) contrast(1.05)' }} />
      <Img src={crest('rma')} style={{ position: 'absolute', left: 350, top: 300 - b, width: 180, height: 180, objectFit: 'contain', opacity: s, filter: 'drop-shadow(0 0 30px rgba(254,190,16,0.6))' }} />
      <Img src={crest('bay')} style={{ position: 'absolute', left: 550, top: 300 + b, width: 180, height: 180, objectFit: 'contain', opacity: s, filter: 'drop-shadow(0 0 30px rgba(220,5,45,0.6))' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 480, height: 200, background: 'linear-gradient(180deg, rgba(11,10,13,0), rgba(11,10,13,0.85))' }} />
    </>
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
        <div style={{ background: RED, color: '#fff', fontFamily: HV(), fontSize: 26, letterSpacing: 3, padding: '8px 16px', borderRadius: 8 }}>PICK {n} OF 4</div>
        <Img src={crest(h)} style={{ width: 60, height: 60, objectFit: 'contain' }} />
        <div style={{ fontFamily: D(), fontSize: 30, color: 'rgba(255,255,255,0.6)' }}>V</div>
        <Img src={crest(a)} style={{ width: 60, height: 60, objectFit: 'contain' }} />
        <div style={{ fontFamily: HV(), fontSize: 20, color: 'rgba(255,255,255,0.7)', letterSpacing: 2 }}>WED {time} ET</div>
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

const EMPH = new Set(['PERFECT', 'THREE', 'BANGED', 'UNBEATEN', 'BARELY', 'FEWER.', 'COMMENT']);
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
  const cur = f < S1 ? 0 : f < S2 ? 1 : f < S3 ? 2 : f < S4 ? 3 : 4;
  return (
    <div style={{ position: 'absolute', top: 205, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 10 }}>
      {[1, 2, 3, 4].map((n) => <div key={n} style={{ width: 84, height: 8, borderRadius: 4, background: n <= cur ? RED : 'rgba(255,255,255,0.25)' }} />)}
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
  const tint = f < S1 ? '#1a2a8a' : f < S2 ? '#DA291C' : f < S3 ? '#6a5a1a' : f < S4 ? '#670E36' : f < S5 ? '#DC052D' : '#1a2a8a';
  return <Stadium tint={tint} dim={0.15} />;
};

export const NP010Card: React.FC = () => {
  applyBrand('ninetyplus');
  const f = useCurrentFrame();
  const END = Math.ceil(NP010_SEC * FPS);
  const hit = (from: number, name: string, vol = 0.4, dur = 1.2) => <Sequence from={Math.max(0, from - 1)} durationInFrames={Math.round(dur * FPS)} layout='none'><Audio src={sfx(name)} volume={vol} /></Sequence>;
  return (
    <AbsoluteFill style={{ background: '#0B0A0D' }}>
      <Tint />
      {/* HOOK: whole Wednesday card on frame 0 */}
      <Scene from={0} to={S1}>
        <Fan from={-12} />
        <Card from={-14} top={640} />
        <div style={{ position: 'absolute', top: 260, left: 0, right: 0, textAlign: 'center', fontFamily: HV(), fontSize: 30, letterSpacing: 6, color: 'rgba(255,255,255,0.85)' }}>NINETY PLUS · RECORD <span style={{ color: GOLD }}>13-4</span></div>
      </Scene>
      {/* PICK 1: Como v United, both teams score */}
      <Scene from={S1} to={S2}>
        <Hero from={S1} n={1} img='bruno' glow='rgba(218,41,28,0.85)' h='com' a='mun' time='12:45 PM' pill='BOTH TEAMS SCORE' pillAt={at(26)}
          claim={<>COMO<br />CREATE<br /><span style={{ color: GOLD }}>CHANCES</span></>}>
          <Big at={at(12)} value='2.8' label='EXPECTED GOALS A GAME · COMO AT HOME' top={700} />
          <div style={{ position: 'absolute', left: 90, top: 960, display: 'flex', flexDirection: 'row', gap: 12 }}>
            <Chip at={at(21)} tag='DOUBT'>MARTÍNEZ</Chip>
            <Chip at={at(22)} tag='DOUBT'>SHAW</Chip>
          </div>
        </Hero>
      </Scene>
      {/* PICK 2: Real Madrid v Leipzig, Leipzig's away numbers */}
      <Scene from={S2} to={S3}>
        <Hero from={S2} n={2} big='rma' glow='rgba(254,190,16,0.6)' h='rma' a='rbl' time='3:00 PM' pill='MADRID TO WIN' pillAt={at(38)}
          claim={<>LEIPZIG<br />ON THE<br /><span style={{ color: GOLD }}>ROAD</span></>}>
          <Big at={at(32)} value='2.77' label='EXPECTED GOALS CONCEDED A GAME · AWAY' top={720} color={RED} />
        </Hero>
      </Scene>
      {/* PICK 3: Villa v Viking, UCL results chips */}
      <Scene from={S3} to={S4}>
        <Hero from={S3} n={3} big='avl' glow='rgba(149,191,229,0.7)' h='avl' a='vik' time='3:00 PM' pill='VILLA TO WIN' pillAt={at(48)}
          claim={<>VILLA<br /><span style={{ color: GOLD }}>UNBEATEN</span><br />IN EUROPE</>}>
          <div style={{ position: 'absolute', left: 90, top: 740, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontFamily: HV(), fontSize: 24, letterSpacing: 3, color: 'rgba(255,255,255,0.75)' }}>CHAMPIONS LEAGUE</div>
            <Chip at={at(44)} border={GREEN}>6-0 FENERBAHÇE</Chip>
            <Chip at={at(45)} border={GREEN}>3-2 AT BRUGGE</Chip>
          </div>
        </Hero>
      </Scene>
      {/* PICK 4: Bayern v Arsenal, 3 goals or fewer */}
      <Scene from={S4} to={S5}>
        <Hero from={S4} n={4} img='saka' glow='rgba(239,1,7,0.8)' h='bay' a='ars' time='3:00 PM' pill='3 GOALS OR FEWER' pillAt={at(59)}
          claim={<>TWO<br /><span style={{ color: GOLD }}>ELITE</span><br />DEFENCES</>}>
          <div style={{ position: 'absolute', left: 90, top: 720, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontFamily: HV(), fontSize: 22, letterSpacing: 2, color: 'rgba(255,255,255,0.75)', maxWidth: 420 }}>EXPECTED GOALS CONCEDED A GAME</div>
            <Chip at={at(55)} border='#DC052D'><Img src={crest('bay')} style={{ width: 52, height: 52, objectFit: 'contain' }} />0.95</Chip>
            <Chip at={at(56)} border='#EF0107'><Img src={crest('ars')} style={{ width: 52, height: 52, objectFit: 'contain' }} />1.06</Chip>
          </div>
        </Hero>
      </Scene>
      {/* OUTRO: card back + comment */}
      <Scene from={S5} to={END + 10}>
        <Fan from={S5} />
        <Card from={S5 + 2} top={640} />
        {f >= at(67) ? (
          <div style={{ position: 'absolute', top: 280, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: GOLD, color: '#0B0A0D', fontFamily: D(), fontSize: 64, padding: '10px 30px', borderRadius: 16, boxShadow: '0 14px 40px rgba(255,210,63,0.45)', transform: 'translateY(' + Math.sin(f / 4) * 6 + 'px)', display: 'flex', alignItems: 'center', gap: 16 }}>COMMENT YOUR PICK <div style={{ width: 0, height: 0, borderLeft: '18px solid transparent', borderRight: '18px solid transparent', borderTop: '24px solid #0B0A0D' }} /></div>
          </div>
        ) : null}
      </Scene>
      <Progress />
      <Captions />
      <Audio src={staticFile('np-010/voiceover.wav')} />
      <Audio src={staticFile('np-010/music/bed.wav')} volume={0.16} />
      {hit(0, 'bass_impact.MP3', 0.5)}
      {hit(S1, 'whoosh_motion.MP3')}
      {hit(at(12), 'magic_reveal.MP3', 0.35)}
      {hit(at(21), 'pop_sound.MP3', 0.35, 0.5)}
      {hit(at(26), 'punch_sound.MP3', 0.45)}
      {hit(S2, 'fast_swoosh.MP3')}
      {hit(at(32), 'bass_impact.MP3', 0.45)}
      {hit(at(38), 'cinematic_whoosh_impact.MP3', 0.45)}
      {hit(S3, 'classic_whoosh.MP3')}
      {hit(at(44), 'pop_whoosh.MP3', 0.35, 0.6)}
      {hit(at(48), 'punch_sound.MP3', 0.45)}
      {hit(S4, 'title_swoosh.MP3')}
      {hit(at(55), 'pop_sound.MP3', 0.35, 0.5)}
      {hit(at(59), 'cinematic_whoosh_impact.MP3', 0.45)}
      {hit(S5, 'title_swoosh.MP3')}
      {hit(at(67), 'pop_whoosh.MP3', 0.4)}
    </AbsoluteFill>
  );
};
export const NP010_CARD_FRAMES = Math.ceil(NP010_SEC * FPS);
