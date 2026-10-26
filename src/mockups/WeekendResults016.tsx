import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { theme, applyBrand } from '../theme';
import { Stadium } from './Mockups';
import words from '../../video-projects/np-016/vo/words.json';

// NP-016: weekend results 24-25 Oct 2026, graded card by card: Pick of the Weekend LANDED, Premier League card BUST,
// Best of the Rest LANDED, El Clásico BUST. Weekend 5-3, season 21-8, Pick of the Weekend 1-0.
// Sources: ESPN full-time scoreboards + scoring plays (eng.1, ita.1, esp.1, ger.1), 24-25 Oct 2026. Gate does not cover it.

const RED = '#FF2E4D';
const GOLD = '#FFD23F';
const GREEN = '#22C55E';
const W: { word: string; start: number; end: number }[] = words.words;
export const NP016_SEC = words.duration;
const FPS = 30;
const at = (i: number) => Math.round(W[i].start * FPS);
const crest = (k: string) => staticFile('np-016/logos/' + k + '.png');
const sfx = (n: string) => staticFile('np-016/sfx/' + n);
const D = () => theme.fonts.display;
const HV = () => theme.fonts.heavy;
const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
type Cfg = { damping: number; stiffness: number; mass: number };
const useSpring = (from: number, cfg: Cfg = theme.spring.snappy) => spring({ frame: useCurrentFrame() - from, fps: FPS, config: cfg });

// Word indices: intro 0-5, Pick of the Weekend 6-12, Premier League 13-32, Best of the Rest 33-49, Clásico 50-58, record 59-end.
const S1 = at(6), S2 = at(13), S3 = at(33), S4 = at(50), S5 = at(59);

type R = { h: string; a: string; t: string; score: string; mark: number; win: boolean };

const Scene: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const f = useCurrentFrame();
  if (f < from - 1 || f >= to + 6) return null;
  return <AbsoluteFill style={{ opacity: interpolate(f, [to, to + 6], [1, 0], CL) }}>{children}</AbsoluteFill>;
};

const Row: React.FC<{ r: R; n: number; from: number }> = ({ r, n, from }) => {
  const f = useCurrentFrame();
  const s = useSpring(from);
  const m = useSpring(r.mark, theme.spring.slap);
  const done = f >= r.mark;
  const col = r.win ? GREEN : RED;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: done ? (r.win ? 'linear-gradient(90deg, rgba(34,197,94,0.28), rgba(11,10,13,0.8))' : 'linear-gradient(90deg, rgba(255,46,77,0.28), rgba(11,10,13,0.8))') : 'rgba(11,10,13,0.75)', borderRadius: 20, padding: '10px 16px', marginTop: n ? 10 : 0, border: done ? '2px solid ' + col : '1px solid rgba(255,255,255,0.12)', opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [80, 0]) + 'px)' }}>
      <Img src={crest(r.h)} style={{ width: 54, height: 54, objectFit: 'contain', filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.9))' }} />
      <Img src={crest(r.a)} style={{ width: 54, height: 54, objectFit: 'contain', filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.9))' }} />
      <div style={{ fontFamily: D(), fontSize: 40, color: '#fff', flex: 1, whiteSpace: 'nowrap' }}>{r.t}</div>
      {done ? <div style={{ fontFamily: D(), fontSize: 42, color: '#fff', opacity: Math.min(1, m * 2) }}>{r.score}</div> : null}
      <div style={{ width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? col : 'rgba(255,255,255,0.12)', transform: 'scale(' + (done ? interpolate(m, [0, 0.6, 1], [1.8, 0.9, 1], CL) : 1) + ')', boxShadow: done ? '0 0 22px ' + col : undefined }}>
        <div style={{ fontFamily: D(), fontSize: 34, color: '#0B0A0D' }}>{done ? (r.win ? '✓' : '✗') : '?'}</div>
      </div>
    </div>
  );
};

const Card: React.FC<{ from: number; title: React.ReactNode; tag: string; rows: R[]; top: number; gold?: boolean }> = ({ from, title, tag, rows, top, gold }) => {
  const s = useSpring(from, theme.spring.smooth);
  return (
    <div style={{ position: 'absolute', left: 70, right: 70, top, background: 'linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))', border: '2px solid ' + (gold ? GOLD : 'rgba(255,255,255,0.28)'), borderRadius: 34, padding: '22px 22px 18px', boxShadow: '0 30px 80px rgba(0,0,0,0.7)' + (gold ? ', 0 0 40px rgba(255,210,63,0.35)' : ''), backdropFilter: 'blur(14px)', opacity: Math.min(1, s * 1.4), transform: 'translateY(' + interpolate(s, [0, 1], [120, 0]) + 'px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontFamily: D(), fontSize: 52, color: '#fff', letterSpacing: 2 }}>{title}</div>
        <div style={{ fontFamily: HV(), fontSize: 18, color: 'rgba(255,255,255,0.7)', letterSpacing: 2 }}>{tag}</div>
      </div>
      {rows.map((r, i) => <Row key={r.t + i} r={r} n={i} from={from + 6 + i * 4} />)}
    </div>
  );
};

// The verdict stamp: LANDED (green) or BUST (red), slammed on its word.
const Stamp: React.FC<{ at: number; win: boolean; top: number }> = ({ at: a, win, top }) => {
  const f = useCurrentFrame();
  const s = useSpring(a, theme.spring.slap);
  if (f < a) return null;
  const col = win ? GREEN : RED;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center' }}>
      <div style={{ border: '10px solid ' + col, color: col, borderRadius: 20, padding: '4px 40px', fontFamily: D(), fontSize: 150, letterSpacing: 8, background: 'rgba(11,10,13,0.85)', transform: 'rotate(-8deg) scale(' + interpolate(s, [0, 0.6, 1], [2.4, 0.9, 1], CL) + ')', opacity: Math.min(1, s * 2), boxShadow: '0 0 50px ' + col + '88', textShadow: '0 0 30px ' + col + '99' }}>{win ? 'LANDED' : 'BUST'}</div>
    </div>
  );
};

const Header: React.FC<{ n: number; label: string }> = ({ n, label }) => (
  <div style={{ position: 'absolute', top: 270, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 14, alignItems: 'center' }}>
    <div style={{ background: RED, color: '#fff', fontFamily: HV(), fontSize: 26, letterSpacing: 3, padding: '8px 16px', borderRadius: 8 }}>CARD {n} OF 4</div>
    <div style={{ fontFamily: HV(), fontSize: 26, letterSpacing: 4, color: 'rgba(255,255,255,0.85)' }}>{label}</div>
  </div>
);

const EMPH = new Set(['GRADED.', 'LANDED.', 'BUST.', 'SEVENTY', 'TWENTY', 'FOLLOW']);
const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  let i = -1;
  for (let k = 0; k < W.length; k++) if (W[k].start <= t + 0.02) i = k;
  if (i < 0 || t > W[i].end + 0.25) return null;
  const w = W[i].word.toUpperCase();
  const s = spring({ frame: f - Math.round(W[i].start * FPS), fps: FPS, config: theme.spring.snappy });
  const em = EMPH.has(w);
  const col = w === 'BUST.' ? RED : w === 'LANDED.' ? GREEN : RED;
  return (
    <div style={{ position: 'absolute', top: 1400, left: 0, right: 0, textAlign: 'center', fontFamily: em ? D() : HV(), fontSize: em ? 128 : 92, color: '#fff', transform: 'scale(' + interpolate(s, [0, 1], [0.85, 1]) + ')', ...(em ? { backgroundImage: 'linear-gradient(180deg, #FFFFFF 30%, ' + col + ')', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 18px ' + col + ')' } : { textShadow: '0 6px 0 rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.6)' }) }}>{w.replace(/[.,]$/, '')}</div>
  );
};

// Intro: the four cards as chips with a question mark each (resolved one scene at a time).
const Preview: React.FC = () => {
  const f = useCurrentFrame();
  const items = ['PICK OF THE WEEKEND', 'PREMIER LEAGUE CARD', 'BEST OF THE REST', 'EL CLÁSICO'];
  return (
    <div style={{ position: 'absolute', left: 110, right: 110, top: 620, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {items.map((t, i) => {
        const s = spring({ frame: f + 14 - i * 3, fps: FPS, config: theme.spring.snappy });
        return (
          <div key={t} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(11,10,13,0.8)', border: '2px solid ' + (i === 0 ? GOLD : 'rgba(255,255,255,0.25)'), borderRadius: 18, padding: '14px 24px', opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [i % 2 ? 120 : -120, 0]) + 'px)' }}>
            <div style={{ fontFamily: D(), fontSize: 50, color: '#fff' }}>{t}</div>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D(), fontSize: 40, color: GOLD }}>?</div>
          </div>
        );
      })}
    </div>
  );
};

const POTW: R[] = [{ h: 'laz', a: 'par', t: 'LAZIO TO WIN', score: '2-1', mark: at(11), win: true }];
const EPL: R[] = [
  { h: 'cry', a: 'new', t: 'NEWCASTLE TO WIN', score: '0-2', mark: at(17), win: true },
  { h: 'liv', a: 'bha', t: 'ISAK TO SCORE', score: "21'", mark: at(20), win: true },
  { h: 'che', a: 'tot', t: '3+ GOALS', score: '0-2', mark: at(27), win: false },
  { h: 'liv', a: 'bha', t: 'BOTH TEAMS SCORE', score: '2-0', mark: at(31), win: false },
];
const REST: R[] = [
  { h: 'atm', a: 'dep', t: 'ATLÉTICO TO WIN', score: '1-0', mark: at(37), win: true },
  { h: 'int', a: 'fio', t: 'INTER TO WIN', score: '2-1', mark: at(38), win: true },
  { h: 'tsg', a: 'b04', t: '3+ GOALS', score: '3-0', mark: at(40), win: true },
];
const CLASICO: R[] = [
  { h: 'bar', a: 'rma', t: 'BOTH TEAMS SCORE', score: '1-2', mark: at(54), win: true },
  { h: 'bar', a: 'rma', t: 'BARÇA TO WIN', score: '1-2', mark: at(57), win: false },
];

export const NP016Results: React.FC = () => {
  applyBrand('ninetyplus');
  const f = useCurrentFrame();
  const END = Math.ceil(NP016_SEC * FPS);
  const tint = f < S1 ? '#3a2a6a' : f < S2 ? '#6a5200' : f < S3 ? '#5a0a1a' : f < S4 ? '#0a6a2a' : f < S5 ? '#5a0a1a' : '#6a1a8a';
  const hit = (from: number, name: string, vol = 0.4, dur = 1.2) => <Sequence from={Math.max(0, from - 1)} durationInFrames={Math.round(dur * FPS)} layout='none'><Audio src={sfx(name)} volume={vol} /></Sequence>;
  const goalTimes = ["79'", "89'", "90+5'"];
  const recS = useSpring(at(59), theme.spring.slap);
  return (
    <AbsoluteFill style={{ background: '#0B0A0D' }}>
      <Stadium tint={tint} dim={0.2} />
      <div style={{ position: 'absolute', top: 205, left: 0, right: 0, textAlign: 'center', fontFamily: HV(), fontSize: 28, letterSpacing: 6, color: 'rgba(255,255,255,0.8)' }}>NINETY PLUS · WEEKEND RESULTS</div>
      <Scene from={0} to={S1}>
        <div style={{ position: 'absolute', top: 300, left: 0, right: 0, textAlign: 'center', fontFamily: D(), fontSize: 150, lineHeight: 0.95, color: '#fff', textShadow: '0 10px 30px rgba(0,0,0,0.7)' }}>EVERY CARD<br /><span style={{ color: GOLD }}>GRADED</span></div>
        <Preview />
      </Scene>
      <Scene from={S1} to={S2}>
        <Header n={1} label='PICK OF THE WEEKEND #1' />
        <Card from={S1} gold title={<>PICK OF THE <span style={{ color: GOLD }}>WEEKEND</span></>} tag='SERIE A' rows={POTW} top={420} />
        <Stamp at={at(12)} win top={720} />
        {f >= at(12) ? <div style={{ position: 'absolute', top: 1000, left: 0, right: 0, textAlign: 'center', fontFamily: D(), fontSize: 64, color: GOLD }}>SERIES RECORD 1-0</div> : null}
      </Scene>
      <Scene from={S2} to={S3}>
        <Header n={2} label='SAT + SUN' />
        <Card from={S2} title={<>PREMIER <span style={{ color: RED }}>LEAGUE</span></>} tag='4 LEGS' rows={EPL} top={380} />
        <Stamp at={at(32)} win={false} top={930} />
      </Scene>
      <Scene from={S3} to={S4}>
        <Header n={3} label='GER · ITA · ESP' />
        <Card from={S3} title={<>BEST OF THE <span style={{ color: GREEN }}>REST</span></>} tag='3 LEGS' rows={REST} top={380} />
        {f >= at(44) ? (
          <div style={{ position: 'absolute', top: 820, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 14, alignItems: 'center' }}>
            <Img src={crest('tsg')} style={{ width: 70, height: 70, objectFit: 'contain' }} />
            {goalTimes.map((g, i) => {
              const s = spring({ frame: f - at(44) - i * 4, fps: FPS, config: theme.spring.slap });
              return <div key={g} style={{ background: GREEN, color: '#0B0A0D', fontFamily: D(), fontSize: 50, padding: '6px 18px', borderRadius: 12, transform: 'scale(' + s + ')' }}>⚽ {g}</div>;
            })}
          </div>
        ) : null}
        <Stamp at={at(49)} win top={930} />
      </Scene>
      <Scene from={S4} to={S5}>
        <Header n={4} label='LALIGA · CAMP NOU' />
        <Card from={S4} gold title={<>EL <span style={{ color: GOLD }}>CLÁSICO</span></>} tag='BARÇA 1-2 MADRID' rows={CLASICO} top={420} />
        <Stamp at={at(58)} win={false} top={800} />
      </Scene>
      <Scene from={S5} to={END + 10}>
        <div style={{ position: 'absolute', top: 330, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 18 }}>
          {[true, false, true, false].map((w, i) => {
            const s = spring({ frame: f - S5 - i * 3, fps: FPS, config: theme.spring.snappy });
            return <div key={i} style={{ width: 150, height: 90, borderRadius: 16, background: w ? GREEN : RED, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D(), fontSize: 34, color: '#0B0A0D', transform: 'scale(' + s + ')' }}>{w ? 'LANDED' : 'BUST'}</div>;
          })}
        </div>
        <div style={{ position: 'absolute', top: 470, left: 0, right: 0, textAlign: 'center', fontFamily: HV(), fontSize: 32, letterSpacing: 5, color: 'rgba(255,255,255,0.85)' }}>2 OF 4 CARDS · WEEKEND 5-3</div>
        {f >= at(59) ? (
          <div style={{ position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 22 }}>
            <div style={{ fontFamily: HV(), fontSize: 34, letterSpacing: 6, color: '#fff' }}>SEASON</div>
            <div style={{ fontFamily: D(), fontSize: 240, color: GOLD, textShadow: '0 0 30px rgba(255,210,63,0.6)', transform: 'scale(' + interpolate(recS, [0, 0.6, 1], [1.6, 0.95, 1], CL) + ')' }}>21-8</div>
          </div>
        ) : null}
        {f >= at(66) ? (
          <div style={{ position: 'absolute', top: 960, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: GOLD, color: '#0B0A0D', fontFamily: D(), fontSize: 58, padding: '10px 28px', borderRadius: 16, boxShadow: '0 14px 40px rgba(255,210,63,0.45)', transform: 'translateY(' + Math.sin(f / 4) * 6 + 'px)' }}>FOLLOW FOR NEXT WEEKEND&apos;S PICKS</div>
          </div>
        ) : null}
      </Scene>
      <Captions />
      <Audio src={staticFile('np-016/voiceover.wav')} />
      <Audio src={staticFile('np-016/music/bed.wav')} volume={0.16} />
      {hit(0, 'bass_impact.MP3', 0.5)}
      {hit(S1, 'whoosh_motion.MP3')}
      {hit(at(11), 'ding_answer_correct.MP3', 0.35, 0.8)}
      {hit(at(12), 'cinematic_whoosh_impact.MP3', 0.5)}
      {hit(S2, 'fast_swoosh.MP3')}
      {hit(at(17), 'pop_sound.MP3', 0.35, 0.5)}
      {hit(at(27), 'glitch_sound.MP3', 0.3, 0.5)}
      {hit(at(32), 'wrong_answer.MP3', 0.4)}
      {hit(S3, 'classic_whoosh.MP3')}
      {hit(at(44), 'pop_whoosh.MP3', 0.35, 0.8)}
      {hit(at(49), 'ding_answer_correct.MP3', 0.4, 0.8)}
      {hit(S4, 'title_swoosh.MP3')}
      {hit(at(58), 'punch_sound.MP3', 0.45)}
      {hit(S5, 'title_swoosh.MP3')}
      {hit(at(59), 'bass_impact.MP3', 0.5)}
      {hit(at(66), 'pop_sound.MP3', 0.4, 0.6)}
    </AbsoluteFill>
  );
};
export const NP016_FRAMES = Math.ceil(NP016_SEC * FPS);
