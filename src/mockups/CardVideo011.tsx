import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { theme, applyBrand } from '../theme';
import { Stadium } from './Mockups';
import words from '../../video-projects/np-011/vo/words.json';

// NP-011: results for np-010 (UCL Wednesday 21 Oct 2026), 3/4, record 16-5. Loss first. Weekend Card results look.
// Sources: ESPN uefa.champions full-time scoreboard 21 Oct 2026. Voice: bm_george. Standalone composition (gate does not cover it).

const RED = '#FF2E4D';
const GOLD = '#FFD23F';
const GREEN = '#22C55E';
const W: { word: string; start: number; end: number }[] = words.words;
export const NP011_SEC = words.duration;
const FPS = 30;
const at = (i: number) => Math.round(W[i].start * FPS);
const crest = (k: string) => staticFile('np-011/logos/' + k + '.png');
const player = (k: string) => staticFile('mockups/' + k + '.png');
const sfx = (n: string) => staticFile('np-011/sfx/' + n);
const D = () => theme.fonts.display;
const HV = () => theme.fonts.heavy;
const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
type Cfg = { damping: number; stiffness: number; mass: number };
const useSpring = (from: number, cfg: Cfg = theme.spring.snappy) => spring({ frame: useCurrentFrame() - from, fps: FPS, config: cfg });

// Word indices: hook + four results 0-33, record + follow 34-end. Each row marks on the word its score is spoken.
const S1 = at(34);

type R = { h: string; a: string; t: string; score: string; mark: number; win: boolean; tag?: string };
const ROWS: R[] = [
  { h: 'bay', a: 'ars', t: '3 GOALS OR FEWER', score: '2-2', mark: at(10), win: false },
  { h: 'com', a: 'mun', t: 'BOTH TEAMS SCORE', score: '4-1', mark: at(20), win: true },
  { h: 'rma', a: 'rbl', t: 'MADRID TO WIN', score: '4-1', mark: at(27), win: true },
  { h: 'avl', a: 'vik', t: 'VILLA TO WIN', score: '3-1', mark: at(32), win: true },
];

const Row: React.FC<{ r: R; n: number; from: number }> = ({ r, n, from }) => {
  const f = useCurrentFrame();
  const s = useSpring(from);
  const m = useSpring(r.mark, theme.spring.slap);
  const done = f >= r.mark;
  const tagOn = false;
  const col = r.win ? GREEN : RED;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: done ? (r.win ? 'linear-gradient(90deg, rgba(34,197,94,0.28), rgba(11,10,13,0.8))' : 'linear-gradient(90deg, rgba(255,46,77,0.28), rgba(11,10,13,0.8))') : 'rgba(11,10,13,0.75)', borderRadius: 20, padding: '10px 16px', marginTop: n ? 10 : 0, border: done ? '2px solid ' + col : tagOn ? '2px solid ' + GOLD : '1px solid rgba(255,255,255,0.12)', opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [80, 0]) + 'px)' }}>
      <Img src={crest(r.h)} style={{ width: 54, height: 54, objectFit: 'contain' }} />
      <Img src={crest(r.a)} style={{ width: 54, height: 54, objectFit: 'contain' }} />
      <div style={{ fontFamily: D(), fontSize: 40, color: '#fff', flex: 1, whiteSpace: 'nowrap' }}>{r.t}</div>
      {tagOn && !done ? <div style={{ fontFamily: HV(), fontSize: 18, letterSpacing: 2, color: '#0B0A0D', background: GOLD, borderRadius: 6, padding: '4px 8px' }}>{r.tag}</div> : null}
      {done ? <div style={{ fontFamily: D(), fontSize: 44, color: '#fff', opacity: Math.min(1, m * 2) }}>{r.score}</div> : null}
      <div style={{ width: 58, height: 58, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? col : 'rgba(255,255,255,0.12)', transform: 'scale(' + (done ? interpolate(m, [0, 0.6, 1], [1.8, 0.9, 1], CL) : 1) + ')', boxShadow: done ? '0 0 22px ' + col : undefined }}>
        <div style={{ fontFamily: D(), fontSize: 36, color: '#0B0A0D' }}>{done ? (r.win ? '✓' : '✗') : '?'}</div>
      </div>
    </div>
  );
};

const Card: React.FC<{ from: number; top: number }> = ({ from, top }) => {
  const s = useSpring(from, theme.spring.smooth);
  return (
    <div style={{ position: 'absolute', left: 80, right: 80, top, background: 'linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))', border: '2px solid rgba(255,255,255,0.28)', borderRadius: 34, padding: '22px 22px 18px', boxShadow: '0 30px 80px rgba(0,0,0,0.7)', backdropFilter: 'blur(14px)', opacity: Math.min(1, s * 1.4), transform: 'translateY(' + interpolate(s, [0, 1], [120, 0]) + 'px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontFamily: D(), fontSize: 54, color: '#fff', letterSpacing: 2 }}>WEDNESDAY <span style={{ color: GREEN }}>RESULTS</span></div>
        <div style={{ fontFamily: HV(), fontSize: 20, color: 'rgba(255,255,255,0.7)', letterSpacing: 3 }}>CHAMPIONS LEAGUE</div>
      </div>
      {ROWS.map((r, i) => <Row key={r.h} r={r} n={i} from={from + 6 + i * 4} />)}
    </div>
  );
};

const Big: React.FC<{ at: number; value: string; label: string; top: number; color: string; size?: number }> = ({ at: a, value, label, top, color, size = 190 }) => {
  const s = useSpring(a, theme.spring.slap);
  if (useCurrentFrame() < a) return null;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 20, opacity: Math.min(1, s * 2), transform: 'scale(' + interpolate(s, [0, 0.6, 1], [1.5, 0.96, 1], CL) + ')' }}>
      <div style={{ fontFamily: HV(), fontSize: 32, letterSpacing: 5, color: 'rgba(255,255,255,0.85)' }}>{label}</div>
      <div style={{ fontFamily: D(), fontSize: size, lineHeight: 0.9, color, textShadow: '0 0 30px ' + color + '99, 0 8px 0 rgba(0,0,0,0.5)' }}>{value}</div>
    </div>
  );
};

const EMPH = new Set(['CLOSE', 'PERFECT', 'MANY.', 'FOUR.', 'SIXTEEN', 'FOLLOW', 'FIRST']);
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
    <div style={{ position: 'absolute', top: 1400, left: 0, right: 0, textAlign: 'center', fontFamily: em ? D() : HV(), fontSize: em ? 128 : 92, color: '#fff', transform: 'scale(' + interpolate(s, [0, 1], [0.85, 1]) + ')', ...(em ? { backgroundImage: 'linear-gradient(180deg, #FFFFFF 30%, ' + RED + ')', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 18px ' + RED + ')' } : { textShadow: '0 6px 0 rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.6)' }) }}>{w.replace(/[.,]$/, '')}</div>
  );
};

const Scene: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const f = useCurrentFrame();
  if (f < from - 1 || f >= to + 6) return null;
  return <AbsoluteFill style={{ opacity: interpolate(f, [to, to + 6], [1, 0], CL) }}>{children}</AbsoluteFill>;
};

// Madrid + Como crests (two of the wins) and the Villa crest.
const Fan: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  const s = useSpring(from, theme.spring.smooth);
  const b = Math.sin(f / 40) * 6;
  const one = (k: string, left: number, top: number, w: number, rot: number, glow: string, dx: number) => (
    <Img src={crest(k)} style={{ position: 'absolute', left, top, width: w, height: w, objectFit: 'contain', opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [dx, 0]) + 'px) rotate(' + rot + 'deg)', filter: 'drop-shadow(0 0 40px ' + glow + ') drop-shadow(0 20px 30px rgba(0,0,0,0.6))' }} />
  );
  return (
    <>
      {one('com', 50, 300 + b, 260, -10, 'rgba(0,90,170,0.8)', -200)}
      {one('avl', 770, 300 - b, 260, 10, 'rgba(149,191,229,0.7)', 200)}
      {one('rma', 380, 250, 320, 0, 'rgba(254,190,16,0.6)', 0)}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 480, height: 200, background: 'linear-gradient(180deg, rgba(11,10,13,0), rgba(11,10,13,0.85))' }} />
    </>
  );
};

const STRIP = ['L', 'W', 'W', 'W', 'W', 'W', 'L', 'L', 'L', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'L'];

export const NP011Card: React.FC = () => {
  applyBrand('ninetyplus');
  const f = useCurrentFrame();
  const END = Math.ceil(NP011_SEC * FPS);
  const hit = (from: number, name: string, vol = 0.4, dur = 1.2) => <Sequence from={Math.max(0, from - 1)} durationInFrames={Math.round(dur * FPS)} layout='none'><Audio src={sfx(name)} volume={vol} /></Sequence>;
  return (
    <AbsoluteFill style={{ background: '#0B0A0D' }}>
      <Stadium tint={f < S1 ? '#0a6a2a' : '#6a1a8a'} dim={0.2} />
      <div style={{ position: 'absolute', top: 205, left: 0, right: 0, textAlign: 'center', fontFamily: HV(), fontSize: 28, letterSpacing: 6, color: 'rgba(255,255,255,0.8)' }}>NINETY PLUS · CHAMPIONS LEAGUE RESULTS</div>
      <Scene from={0} to={S1}>
        <Fan from={-12} />
        <Card from={-14} top={620} />
      </Scene>
      <Scene from={S1} to={END + 10}>
        <Big at={at(34)} value='3/4' label='WEDNESDAY' top={560} color={GOLD} size={230} />
        <Big at={at(37)} value='16-5' label='SEASON' top={850} color={GREEN} size={230} />
        <div style={{ position: 'absolute', top: 1150, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
          {STRIP.map((r, i) => {
            const s = spring({ frame: f - at(39) - i * 2, fps: FPS, config: theme.spring.snappy });
            return <div key={i} style={{ width: 40, height: 40, borderRadius: 8, background: r === 'W' ? GREEN : RED, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D(), fontSize: 24, color: '#0B0A0D', opacity: f >= at(39) ? s : 0, transform: 'scale(' + s + ')', boxShadow: i >= 17 ? '0 0 14px ' + (r === 'W' ? GREEN : RED) : undefined }}>{r}</div>;
          })}
        </div>
        {f >= at(43) ? (
          <div style={{ position: 'absolute', top: 280, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: GOLD, color: '#0B0A0D', fontFamily: D(), fontSize: 56, padding: '10px 28px', borderRadius: 16, boxShadow: '0 14px 40px rgba(255,210,63,0.45)', transform: 'translateY(' + Math.sin(f / 4) * 6 + 'px)' }}>FOLLOW FOR THE PICK OF THE WEEKEND</div>
          </div>
        ) : null}
      </Scene>
      <Captions />
      <Audio src={staticFile('np-011/voiceover.wav')} />
      <Audio src={staticFile('np-011/music/bed.wav')} volume={0.16} />
      {hit(0, 'bass_impact.MP3', 0.5)}
      {hit(at(10), 'wrong_answer.MP3', 0.35)}
      {hit(at(12), 'glitch_sound.MP3', 0.35, 0.6)}
      {hit(at(17), 'whoosh_motion.MP3', 0.35)}
      {hit(at(20), 'ding_answer_correct.MP3', 0.35, 0.8)}
      {hit(at(27), 'pop_sound.MP3', 0.4, 0.6)}
      {hit(at(32), 'ding_answer_correct.MP3', 0.35, 0.8)}
      {hit(S1, 'title_swoosh.MP3')}
      {hit(at(37), 'bass_impact.MP3', 0.5)}
      {hit(at(39), 'pop_whoosh.MP3', 0.35, 0.8)}
      {hit(at(43), 'cinematic_whoosh_impact.MP3', 0.4)}
    </AbsoluteFill>
  );
};
export const NP011_CARD_FRAMES = Math.ceil(NP011_SEC * FPS);
