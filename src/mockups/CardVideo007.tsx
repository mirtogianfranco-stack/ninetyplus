import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { theme, applyBrand } from '../theme';
import { Stadium } from './Mockups';
import words from '../../video-projects/np-007/vo/words.json';

// NP-007: weekend results for np-005 + np-006 in the Weekend Card look. Saturday 0/3 first (owned), Sunday 3/3, record 8-4.
// Sources: ESPN full-time scoreboards 17-18 Oct 2026. Voice: bm_george. Standalone composition (gate does not cover it).

const RED = '#FF2E4D';
const GOLD = '#FFD23F';
const GREEN = '#22C55E';
const W: { word: string; start: number; end: number }[] = words.words;
export const NP007_SEC = words.duration;
const FPS = 30;
const at = (i: number) => Math.round(W[i].start * FPS);
const crest = (k: string) => staticFile('np-007/logos/' + k + '.png');
const player = (k: string) => staticFile('mockups/' + k + '.png');
const sfx = (n: string) => staticFile('np-007/sfx/' + n);
const D = () => theme.fonts.display;
const HV = () => theme.fonts.heavy;
const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
type Cfg = { damping: number; stiffness: number; mass: number };
const useSpring = (from: number, cfg: Cfg = theme.spring.snappy) => spring({ frame: useCurrentFrame() - from, fps: FPS, config: cfg });

// Word indices: Saturday 0-17, Sunday 18-38, record + comment 39-end.
const S1 = at(18), S2 = at(39);

type R = { h: string; a: string; t: string; score: string; mark: number; win: boolean };
const SAT: R[] = [
  { h: 'eve', a: 'che', t: 'BOTH TEAMS SCORE', score: '0-2', mark: at(7), win: false },
  { h: 'fcu', a: 'bvb', t: 'DORTMUND TO WIN', score: '0-0', mark: at(11), win: false },
  { h: 'ven', a: 'nap', t: 'NAPOLI TO WIN', score: '1-0', mark: at(14), win: false },
];
const SUN: R[] = [
  { h: 'bha', a: 'cry', t: 'BRIGHTON TO WIN', score: '5-0', mark: at(24), win: true },
  { h: 'nfo', a: 'ars', t: 'ARSENAL TO WIN', score: '0-1', mark: at(29), win: true },
  { h: 'bmg', a: 'tsg', t: '3+ GOALS', score: '1-2', mark: at(34), win: true },
];

const Row: React.FC<{ r: R; n: number; from: number }> = ({ r, n, from }) => {
  const f = useCurrentFrame();
  const s = useSpring(from);
  const m = useSpring(r.mark, theme.spring.slap);
  const done = f >= r.mark;
  const col = r.win ? GREEN : RED;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: done ? (r.win ? 'linear-gradient(90deg, rgba(34,197,94,0.28), rgba(11,10,13,0.8))' : 'linear-gradient(90deg, rgba(255,46,77,0.25), rgba(11,10,13,0.8))') : 'rgba(11,10,13,0.75)', borderRadius: 20, padding: '14px 18px', marginTop: n ? 12 : 0, border: done ? '2px solid ' + col : '1px solid rgba(255,255,255,0.12)', opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [80, 0]) + 'px)' }}>
      <Img src={crest(r.h)} style={{ width: 60, height: 60, objectFit: 'contain' }} />
      <Img src={crest(r.a)} style={{ width: 60, height: 60, objectFit: 'contain' }} />
      <div style={{ fontFamily: D(), fontSize: 44, color: done && !r.win ? 'rgba(255,255,255,0.6)' : '#fff', flex: 1, whiteSpace: 'nowrap' }}>{r.t}</div>
      {done ? <div style={{ fontFamily: D(), fontSize: 46, color: '#fff', opacity: Math.min(1, m * 2) }}>{r.score}</div> : null}
      <div style={{ width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? col : 'rgba(255,255,255,0.12)', transform: 'scale(' + (done ? interpolate(m, [0, 0.6, 1], [1.8, 0.9, 1], CL) : 1) + ')', boxShadow: done ? '0 0 22px ' + col : undefined }}>
        <div style={{ fontFamily: D(), fontSize: 40, color: '#0B0A0D' }}>{done ? (r.win ? '✓' : '✗') : '?'}</div>
      </div>
    </div>
  );
};

const Card: React.FC<{ from: number; title: string; tag: string; rows: R[]; top: number }> = ({ from, title, tag, rows, top }) => {
  const s = useSpring(from, theme.spring.smooth);
  return (
    <div style={{ position: 'absolute', left: 80, right: 80, top, background: 'linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))', border: '2px solid rgba(255,255,255,0.28)', borderRadius: 34, padding: '24px 24px 20px', boxShadow: '0 30px 80px rgba(0,0,0,0.7)', backdropFilter: 'blur(14px)', opacity: Math.min(1, s * 1.4), transform: 'translateY(' + interpolate(s, [0, 1], [120, 0]) + 'px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontFamily: D(), fontSize: 58, color: '#fff', letterSpacing: 2 }}>{title} <span style={{ color: RED }}>RESULTS</span></div>
        <div style={{ fontFamily: HV(), fontSize: 22, color: 'rgba(255,255,255,0.7)', letterSpacing: 3 }}>{tag}</div>
      </div>
      {rows.map((r, i) => <Row key={r.t} r={r} n={i} from={from + 6 + i * 5} />)}
    </div>
  );
};

const Big: React.FC<{ at: number; value: string; label: string; top: number; color: string }> = ({ at: a, value, label, top, color }) => {
  const f = useCurrentFrame();
  const s = useSpring(a, theme.spring.slap);
  if (f < a) return null;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 20, opacity: Math.min(1, s * 2), transform: 'scale(' + interpolate(s, [0, 0.6, 1], [1.5, 0.96, 1], CL) + ')' }}>
      <div style={{ fontFamily: HV(), fontSize: 32, letterSpacing: 5, color: 'rgba(255,255,255,0.85)' }}>{label}</div>
      <div style={{ fontFamily: D(), fontSize: 190, lineHeight: 0.9, color, textShadow: '0 0 30px ' + color + '99, 0 8px 0 rgba(0,0,0,0.5)' }}>{value}</div>
    </div>
  );
};

const EMPH = new Set(['HONESTY', 'ZERO', 'THREE', 'THREE.', 'FIVE', 'EIGHT', 'FOUR', 'COMMENT']);
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

const Players: React.FC<{ from: number; keys: [string, string, string]; glows: [string, string, string]; top: number; dim?: boolean }> = ({ from, keys, glows, top, dim }) => {
  const s = useSpring(from, theme.spring.smooth);
  const f = useCurrentFrame();
  const b = Math.sin(f / 40) * 6;
  const filt = (g: string) => 'drop-shadow(0 0 26px ' + g + ')' + (dim ? ' grayscale(0.7) brightness(0.55)' : ' contrast(1.05)');
  return (
    <>
      <Img src={player(keys[0])} style={{ position: 'absolute', left: -120, top: top + 60 + b, width: 600, opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [-200, 0]) + 'px) rotate(-6deg)', filter: filt(glows[0]) }} />
      <Img src={player(keys[2])} style={{ position: 'absolute', right: -120, top: top + 60 - b, width: 600, opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [200, 0]) + 'px) rotate(6deg)', filter: filt(glows[2]) }} />
      <Img src={player(keys[1])} style={{ position: 'absolute', left: 200, top, width: 680, opacity: s, transform: 'translateY(' + interpolate(s, [0, 1], [80, 0]) + 'px)', filter: filt(glows[1]) }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: top + 260, bottom: 0, background: 'linear-gradient(180deg, rgba(11,10,13,0) 0%, rgba(11,10,13,0.94) 32%, rgba(11,10,13,0.94) 100%)' }} />
    </>
  );
};

// Saturday's three losing picks as dimmed crests (no photo source for Dortmund / Napoli players).
const CrestFan: React.FC<{ from: number }> = ({ from }) => {
  const s = useSpring(from, theme.spring.smooth);
  const one = (k: string, left: number, top: number, w: number, rot: number) => (
    <Img src={crest(k)} style={{ position: 'absolute', left, top, width: w, height: w, objectFit: 'contain', opacity: s * 0.8, transform: 'rotate(' + rot + 'deg) scale(' + interpolate(s, [0, 1], [0.8, 1]) + ')', filter: 'grayscale(0.6) brightness(0.7) drop-shadow(0 20px 30px rgba(0,0,0,0.7))' }} />
  );
  return (<>{one('che', 50, 360, 280, -10)}{one('nap', 750, 360, 280, 10)}{one('bvb', 340, 300, 400, 0)}</>);
};

export const NP007Card: React.FC = () => {
  applyBrand('ninetyplus');
  const f = useCurrentFrame();
  const END = Math.ceil(NP007_SEC * FPS);
  const tint = f < S1 ? '#5a0a1a' : f < S2 ? '#0a6a2a' : '#6a1a8a';
  const hit = (from: number, name: string, vol = 0.4, dur = 1.2) => <Sequence from={Math.max(0, from - 1)} durationInFrames={Math.round(dur * FPS)} layout='none'><Audio src={sfx(name)} volume={vol} /></Sequence>;
  return (
    <AbsoluteFill style={{ background: '#0B0A0D' }}>
      <Stadium tint={tint} dim={0.2} />
      <div style={{ position: 'absolute', top: 205, left: 0, right: 0, textAlign: 'center', fontFamily: HV(), fontSize: 28, letterSpacing: 6, color: 'rgba(255,255,255,0.8)' }}>NINETY PLUS · WEEKEND RESULTS</div>
      <Scene from={0} to={S1}>
        <CrestFan from={0} />
        <Card from={2} title='SATURDAY' tag='EPL · BUNDESLIGA · SERIE A' rows={SAT} top={720} />
        <Big at={at(4)} value='0/3' label='SATURDAY' top={1195} color={RED} />
      </Scene>
      <Scene from={S1} to={S2}>
        <Players from={S1} keys={['mitoma', 'saka', 'rice']} glows={['rgba(0,87,184,0.7)', 'rgba(239,1,7,0.7)', 'rgba(239,1,7,0.5)']} top={300} />
        <Card from={S1 + 2} title='SUNDAY' tag='EPL · BUNDESLIGA' rows={SUN} top={720} />
        <Big at={at(21)} value='3/3' label='SUNDAY' top={1195} color={GREEN} />
      </Scene>
      <Scene from={S2} to={END + 10}>
        <Players from={S2} keys={['palmer', 'saka', 'mitoma']} glows={['rgba(3,70,148,0.7)', 'rgba(239,1,7,0.7)', 'rgba(0,87,184,0.7)']} top={330} />
        <Big at={at(39)} value='8-4' label='SEASON' top={1020} color={GOLD} />
        <div style={{ position: 'absolute', top: 1250, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 16 }}>
          {['L', 'W', 'W', 'W', 'W', 'W', 'L', 'L', 'L', 'W', 'W', 'W'].map((r, i) => {
            const s = spring({ frame: f - at(41) - i * 2, fps: FPS, config: theme.spring.snappy });
            return <div key={i} style={{ width: 52, height: 52, borderRadius: 12, background: r === 'W' ? GREEN : RED, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D(), fontSize: 32, color: '#0B0A0D', opacity: f >= at(41) ? s : 0, transform: 'scale(' + s + ')' }}>{r}</div>;
          })}
        </div>
        {f >= at(45) ? (
          <div style={{ position: 'absolute', top: 280, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: GOLD, color: '#0B0A0D', fontFamily: D(), fontSize: 60, padding: '10px 30px', borderRadius: 16, boxShadow: '0 14px 40px rgba(255,210,63,0.45)', transform: 'translateY(' + Math.sin(f / 4) * 6 + 'px)', display: 'flex', alignItems: 'center', gap: 16 }}>WHO SHOULD WE PICK NEXT? <div style={{ width: 0, height: 0, borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderTop: '22px solid #0B0A0D' }} /></div>
          </div>
        ) : null}
      </Scene>
      <Captions />
      <Audio src={staticFile('np-007/voiceover.wav')} />
      {hit(0, 'bass_impact.MP3', 0.5)}
      {hit(at(4), 'wrong_answer.MP3', 0.35)}
      {hit(at(7), 'punch_sound.MP3', 0.35, 0.6)}{hit(at(11), 'punch_sound.MP3', 0.35, 0.6)}{hit(at(14), 'glitch_sound.MP3', 0.35, 0.6)}
      {hit(S1, 'whoosh_motion.MP3')}
      {hit(at(21), 'cinematic_whoosh_impact.MP3', 0.45)}
      {hit(at(24), 'ding_answer_correct.MP3', 0.35, 0.8)}{hit(at(29), 'pop_whoosh.MP3', 0.4, 0.8)}{hit(at(34), 'ding_answer_correct.MP3', 0.35, 0.8)}
      {hit(S2, 'title_swoosh.MP3')}
      {hit(at(39), 'bass_impact.MP3', 0.5)}
      {hit(at(45), 'pop_sound.MP3', 0.4, 0.6)}
    </AbsoluteFill>
  );
};
export const NP007_CARD_FRAMES = Math.ceil(NP007_SEC * FPS);
