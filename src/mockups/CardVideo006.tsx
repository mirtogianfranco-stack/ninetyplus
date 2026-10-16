import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { theme, applyBrand } from '../theme';
import { Stadium } from './Mockups';
import { np006 } from '../edits/np006';

// NP-006 in the "Weekend Card" look (owner picked mock-up C). Same approved voiceover + word timings as np006.
// No player-photo source for the Bundesliga / Serie A, so each pick's hero is the club crest, huge and lit.
// Standalone composition (not PicksVideo): tools/gate.sh does not cover it, review frame by frame.

const RED = '#FF2E4D';
const GOLD = '#FFD23F';
const GREEN = '#22C55E';
const W = np006.words;
const FPS = 30;
const at = (i: number) => Math.round(W[i].start * FPS);
const crest = (k: string) => staticFile('np-006/logos/' + k + '.png');
const sfx = (n: string) => staticFile('np-006/sfx/' + n);
const D = () => theme.fonts.display;
const HV = () => theme.fonts.heavy;
const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
type Cfg = { damping: number; stiffness: number; mass: number };
const useSpring = (from: number, cfg: Cfg = theme.spring.snappy) => spring({ frame: useCurrentFrame() - from, fps: FPS, config: cfg });

// Word indices: hook 0-8, goals pick 9-29, Dortmund 30-43, Napoli 44-53, outro 54-end.
const S1 = at(9), S2 = at(30), S3 = at(44), S4 = at(54);

const ROWS: [string, string, string, string][] = [['bmg', 'tsg', '3+ GOALS', 'SUN 11:30 AM'], ['fcu', 'bvb', 'DORTMUND TO WIN', 'SAT 9:30 AM'], ['ven', 'nap', 'NAPOLI TO WIN', 'SAT 9:00 AM']];

const Row: React.FC<{ n: number; h: string; a: string; t: string; k: string; from: number }> = ({ n, h, a, t, k, from }) => {
  const s = useSpring(from);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(11,10,13,0.72)', borderRadius: 20, padding: '14px 18px', marginTop: n > 1 ? 12 : 0, border: '1px solid rgba(255,255,255,0.12)', opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [80, 0]) + 'px)' }}>
      <div style={{ fontFamily: D(), fontSize: 40, color: RED, width: 36 }}>{n}</div>
      <Img src={crest(h)} style={{ width: 62, height: 62, objectFit: 'contain' }} />
      <Img src={crest(a)} style={{ width: 62, height: 62, objectFit: 'contain' }} />
      <div style={{ fontFamily: D(), fontSize: 46, color: '#fff', flex: 1, whiteSpace: 'nowrap' }}>{t}</div>
      <div style={{ fontFamily: HV(), fontSize: 18, color: 'rgba(255,255,255,0.65)', letterSpacing: 1, whiteSpace: 'nowrap' }}>{k} ET</div>
    </div>
  );
};

const Card: React.FC<{ from: number }> = ({ from }) => {
  const s = useSpring(from, theme.spring.smooth);
  return (
    <div style={{ position: 'absolute', left: 90, right: 90, top: 700, background: 'linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))', border: '2px solid rgba(255,255,255,0.28)', borderRadius: 34, padding: '26px 26px 20px', boxShadow: '0 30px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.4)', backdropFilter: 'blur(14px)', opacity: Math.min(1, s * 1.4), transform: 'translateY(' + interpolate(s, [0, 1], [120, 0]) + 'px) scale(' + interpolate(s, [0, 1], [0.92, 1]) + ')' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontFamily: D(), fontSize: 58, color: '#fff', letterSpacing: 2 }}>WEEKEND <span style={{ color: RED }}>CARD</span></div>
        <div style={{ fontFamily: HV(), fontSize: 22, color: 'rgba(255,255,255,0.7)', letterSpacing: 3 }}>BUNDESLIGA · SERIE A</div>
      </div>
      {ROWS.map(([h, a, t, k], i) => <Row key={t} n={i + 1} h={h} a={a} t={t} k={k} from={from + 6 + i * 5} />)}
    </div>
  );
};

// Crest fan for the card scenes (stands in for the player fan).
const Fan: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  const s = useSpring(from, theme.spring.smooth);
  const b = Math.sin(f / 40) * 8;
  const one = (k: string, left: number, top: number, w: number, rot: number, glow: string, dx: number) => (
    <Img src={crest(k)} style={{ position: 'absolute', left, top, width: w, height: w, objectFit: 'contain', opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [dx, 0]) + 'px) rotate(' + rot + 'deg)', filter: 'drop-shadow(0 0 40px ' + glow + ') drop-shadow(0 20px 30px rgba(0,0,0,0.6))' }} />
  );
  return (
    <>
      {one('bmg', 40, 330 + b, 300, -10, 'rgba(255,255,255,0.35)', -200)}
      {one('nap', 740, 330 - b, 300, 10, 'rgba(18,160,215,0.7)', 200)}
      {one('bvb', 330, 270, 420, 0, 'rgba(253,225,0,0.6)', 0)}
    </>
  );
};

// One pick: giant lit crest on the right, numbered pick header and claim on the left, stats under, pill on its word.
const Hero: React.FC<{ from: number; n: number; big: string; glow: string; h: string; a: string; claim: React.ReactNode; pill: string; pillAt: number; children?: React.ReactNode }> = ({ from, n, big, glow, h, a, claim, pill, pillAt, children }) => {
  const f = useCurrentFrame();
  const s = useSpring(from, theme.spring.smooth);
  const p = useSpring(pillAt, theme.spring.slap);
  return (
    <>
      <div style={{ position: 'absolute', right: -260, top: 600, width: 720, height: 720, borderRadius: '50%', background: 'radial-gradient(circle, ' + glow + ' 0%, rgba(0,0,0,0) 65%)', opacity: s }} />
      <Img src={crest(big)} style={{ position: 'absolute', right: -150, top: 680, width: 520, height: 520, objectFit: 'contain', opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [240, 0]) + 'px) rotate(' + (8 - (f - from) * 0.02) + 'deg) scale(' + (1 + (f - from) * 0.0008) + ')', filter: 'drop-shadow(0 0 50px ' + glow + ') drop-shadow(0 30px 40px rgba(0,0,0,0.7))' }} />
      <div style={{ position: 'absolute', top: 280, left: 90, right: 90, display: 'flex', alignItems: 'center', gap: 14, opacity: s }}>
        <div style={{ background: RED, color: '#fff', fontFamily: HV(), fontSize: 26, letterSpacing: 3, padding: '8px 16px', borderRadius: 8 }}>PICK {n} OF 3</div>
        <Img src={crest(h)} style={{ width: 60, height: 60, objectFit: 'contain' }} />
        <div style={{ fontFamily: D(), fontSize: 30, color: 'rgba(255,255,255,0.6)' }}>V</div>
        <Img src={crest(a)} style={{ width: 60, height: 60, objectFit: 'contain' }} />
      </div>
      <div style={{ position: 'absolute', top: 360, left: 86, width: 640, fontFamily: D(), fontSize: 96, lineHeight: 0.95, color: '#fff', textShadow: '0 8px 30px rgba(0,0,0,0.8)', transform: 'skewX(-6deg) translateY(' + interpolate(s, [0, 1], [40, 0]) + 'px)', opacity: s }}>{claim}</div>
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

const Chip: React.FC<{ at: number; children: React.ReactNode; border?: string; struck?: boolean }> = ({ at: a, children, border = RED, struck }) => {
  const f = useCurrentFrame();
  const s = useSpring(a, theme.spring.slap);
  if (f < a) return null;
  const line = interpolate(f, [a + 4, a + 12], [0, 100], CL);
  return (
    <div style={{ position: 'relative', background: 'rgba(11,10,13,0.88)', border: '3px solid ' + border, borderRadius: 14, padding: '10px 18px', fontFamily: D(), fontSize: 44, color: struck ? 'rgba(255,255,255,0.55)' : '#fff', transform: 'scale(' + interpolate(s, [0, 1], [0.5, 1]) + ')', opacity: Math.min(1, s * 2), whiteSpace: 'nowrap' }}>
      {children}
      {struck ? <div style={{ position: 'absolute', left: 12, top: '52%', height: 6, width: line + '%', maxWidth: 'calc(100% - 24px)', background: RED, borderRadius: 3, boxShadow: '0 0 10px ' + RED }} /> : null}
    </div>
  );
};

const Big: React.FC<{ at: number; value: string; label: string; top: number; color?: string; roll?: number }> = ({ at: a, value, label, top, color = GOLD, roll }) => {
  const f = useCurrentFrame();
  const s = useSpring(a, theme.spring.slap);
  if (f < a) return null;
  const shown = roll !== undefined ? String(Math.round(interpolate(f, [a, a + 18], [0, roll], CL))) : value;
  return (
    <div style={{ position: 'absolute', left: 90, top, display: 'flex', alignItems: 'baseline', gap: 18, opacity: Math.min(1, s * 2), transform: 'scale(' + interpolate(s, [0, 0.6, 1], [1.5, 0.96, 1], CL) + ')', transformOrigin: '0 50%' }}>
      <div style={{ fontFamily: D(), fontSize: 170, lineHeight: 0.9, color, textShadow: '0 0 30px ' + color + '99, 0 8px 0 rgba(0,0,0,0.5)' }}>{shown}</div>
      <div style={{ fontFamily: HV(), fontSize: 28, letterSpacing: 2, color: '#fff', maxWidth: 230, lineHeight: 1.15 }}>{label}</div>
    </div>
  );
};

const EMPH = new Set(['EASIEST', 'EVERY', 'THREE', 'SEVENTEEN,', 'OUT.', 'SIX', 'COMMENT']);
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
    <div style={{ position: 'absolute', top: 1330, left: 0, right: 0, textAlign: 'center', fontFamily: em ? D() : HV(), fontSize: em ? 128 : 92, color: '#fff', transform: 'scale(' + interpolate(s, [0, 1], [0.85, 1]) + ')', ...(em ? { backgroundImage: 'linear-gradient(180deg, #FFFFFF 30%, ' + RED + ')', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 18px ' + RED + ')' } : { textShadow: '0 6px 0 rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.6)' }) }}>{w.replace(/[.,]$/, '')}</div>
  );
};

const Progress: React.FC = () => {
  const f = useCurrentFrame();
  const cur = f < S1 ? 0 : f < S2 ? 1 : f < S3 ? 2 : 3;
  return (
    <div style={{ position: 'absolute', top: 205, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 10 }}>
      {[1, 2, 3].map((n) => <div key={n} style={{ width: 90, height: 8, borderRadius: 4, background: n <= cur ? RED : 'rgba(255,255,255,0.25)' }} />)}
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
  const tint = f < S1 ? '#2a6a3a' : f < S2 ? '#0a5a2a' : f < S3 ? '#8a7a00' : f < S4 ? '#12A0D7' : '#2a6a3a';
  return <Stadium tint={tint} dim={0.15} />;
};

export const NP006Card: React.FC = () => {
  applyBrand('ninetyplus');
  const f = useCurrentFrame();
  const END = Math.ceil(np006.endSec * FPS);
  const hit = (from: number, name: string, vol = 0.4, dur = 1.2) => <Sequence from={Math.max(0, from - 1)} durationInFrames={Math.round(dur * FPS)} layout='none'><Audio src={sfx(name)} volume={vol} /></Sequence>;
  return (
    <AbsoluteFill style={{ background: '#0B0A0D' }}>
      <Tint />
      <Scene from={0} to={S1}>
        <Fan from={0} />
        <Card from={2} />
        <div style={{ position: 'absolute', top: 280, left: 0, right: 0, textAlign: 'center', fontFamily: HV(), fontSize: 30, letterSpacing: 6, color: 'rgba(255,255,255,0.85)' }}>NINETY PLUS · RECORD <span style={{ color: GOLD }}>5-1</span></div>
      </Scene>
      <Scene from={S1} to={S2}>
        <Hero from={S1} n={1} big='tsg' glow='rgba(28,99,183,0.75)' h='bmg' a='tsg' pill='3+ GOALS' pillAt={at(27)}
          claim={<>10 GAMES.<br /><span style={{ color: GOLD }}>ALL 3+</span><br />GOALS.</>}>
          <div style={{ position: 'absolute', left: 90, top: 700, width: 600, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontFamily: HV(), fontSize: 24, letterSpacing: 3, color: 'rgba(255,255,255,0.75)' }}>GLADBACH THIS SEASON</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {['1-2 KOE', '3-4 M05', '0-5 SCF', '3-4 ELV', '0-3 RBL'].map((t, i) => <Chip key={t} at={at(13) + i * 4} border='#0a5a2a'>{t}</Chip>)}
            </div>
          </div>
          <Big at={at(21)} value='10/10' label='GAMES WITH 3+ GOALS' top={930} />
        </Hero>
      </Scene>
      <Scene from={S2} to={S3}>
        <Hero from={S2} n={2} big='bvb' glow='rgba(253,225,0,0.6)' h='fcu' a='bvb' pill='DORTMUND TO WIN' pillAt={at(41)}
          claim={<>UNION:<br /><span style={{ color: GOLD }}>LEAKING</span><br />GOALS</>}>
          <Big at={at(35)} value='17' roll={17} label='CONCEDED IN 5 GAMES' top={700} />
          <div style={{ position: 'absolute', left: 90, top: 880, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontFamily: HV(), fontSize: 24, letterSpacing: 3, color: 'rgba(255,255,255,0.75)' }}>UNION STRIKERS</div>
            <Chip at={at(38)} struck>ANDREJ ILIC</Chip>
            <Chip at={at(39)} struck>LATTE LATH</Chip>
          </div>
        </Hero>
      </Scene>
      <Scene from={S3} to={S4}>
        <Hero from={S3} n={3} big='nap' glow='rgba(18,160,215,0.75)' h='ven' a='nap' pill='NAPOLI TO WIN' pillAt={at(51)}
          claim={<>VENEZIA:<br /><span style={{ color: GOLD }}>0 WINS</span><br />ALL SEASON</>}>
          <div style={{ position: 'absolute', left: 90, top: 700, width: 600, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {['1-3 ATA', '0-2 LAZ', '2-4 FIO', '2-3 FRO', '0-2 MIL', '0-2 LEC'].map((t, i) => <Chip key={t} at={at(45) + i * 3}>{t}</Chip>)}
          </div>
          <Big at={at(48)} value='0/6' label='VENEZIA LEAGUE WINS' top={930} color={RED} />
        </Hero>
      </Scene>
      <Scene from={S4} to={END + 10}>
        <Fan from={S4} />
        <Card from={S4 + 2} />
        <Big at={S4 + 4} value='5-1' label='RECORD' top={1160} />
        <div style={{ position: 'absolute', top: 280, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: GOLD, color: '#0B0A0D', fontFamily: D(), fontSize: 64, padding: '10px 30px', borderRadius: 16, boxShadow: '0 14px 40px rgba(255,210,63,0.45)', transform: 'translateY(' + Math.sin(f / 4) * 6 + 'px)', display: 'flex', alignItems: 'center', gap: 16 }}>COMMENT YOUR PICK <div style={{ width: 0, height: 0, borderLeft: '18px solid transparent', borderRight: '18px solid transparent', borderTop: '24px solid #0B0A0D' }} /></div>
        </div>
      </Scene>
      <Progress />
      <Captions />
      <Audio src={staticFile(np006.voiceover)} />
      {hit(0, 'bass_impact.MP3', 0.5)}
      {hit(S1, 'whoosh_motion.MP3')}
      {hit(at(21), 'cinematic_whoosh_impact.MP3', 0.45)}
      {hit(at(27), 'punch_sound.MP3', 0.45)}
      {hit(S2, 'fast_swoosh.MP3')}
      {hit(at(35), 'bass_impact.MP3', 0.45)}
      {hit(at(38), 'glitch_sound.MP3', 0.35, 0.5)}
      {hit(at(41), 'punch_sound.MP3', 0.45)}
      {hit(S3, 'classic_whoosh.MP3')}
      {hit(at(48), 'wrong_answer.MP3', 0.35)}
      {hit(at(51), 'pop_whoosh.MP3', 0.45)}
      {hit(S4, 'title_swoosh.MP3')}
    </AbsoluteFill>
  );
};
export const NP006_CARD_FRAMES = Math.ceil(np006.endSec * FPS);
