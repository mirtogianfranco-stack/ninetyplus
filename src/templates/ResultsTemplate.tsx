import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { theme, applyBrand } from '../theme';
import { Stadium } from '../mockups/Mockups';

// Results video, graded card by card (np-016 look; a one-card results video like np-009/np-011 is just cards.length = 1).
// Intro (title + one '?' chip per card), one scene per card: rows tick ✓/✗ on the word their score is spoken, then a
// LANDED / BUST stamp; outro: verdict strip, weekend + season record, follow banner.
// A video = src/results/npNNN.ts (ResultsSpec) + NPNNN.tsx. Gate: tools/card-gate.sh NNN.

export type ResultRow = { h: string; a: string; t: string; score: string; word: number; win: boolean };
export type ResultsSpec = {
  kind: 'results';
  dir: string;
  words: { duration: number; words: { word: string; start: number; end: number }[] };
  topline: string;                                    // 'NINETY PLUS · WEEKEND RESULTS'
  intro: { title: [string, string]; items: string[] };  // 'EVERY CARD' / 'GRADED' + one chip per card
  cards: {
    from: number; header: string; title: [string, string]; titleColor?: 'red' | 'gold' | 'green'; tag: string; gold?: boolean;
    rows: ResultRow[]; stamp: { word: number; win: boolean }; note?: { word: number; text: string };
    goals?: { word: number; crest: string; times: string[] };
  }[];
  outro: { from: number; line: string; record: { word: number; label: string; value: string }; banner: { word: number; text: string } };
  tints?: string[];
  emph?: string[];
  musicVolume?: number;
};

const RED = '#FF2E4D';
const GOLD = '#FFD23F';
const GREEN = '#22C55E';
const FPS = 30;
const D = () => theme.fonts.display;
const HV = () => theme.fonts.heavy;
const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
type Cfg = { damping: number; stiffness: number; mass: number };
const useSpring = (from: number, cfg: Cfg = theme.spring.snappy) => spring({ frame: useCurrentFrame() - from, fps: FPS, config: cfg });
const OUTLINE = 'drop-shadow(0 0 3px rgba(255,255,255,0.9))';

export const resultsFrames = (s: ResultsSpec) => Math.ceil(s.words.duration * FPS);

export const ResultsTemplate: React.FC<{ spec: ResultsSpec }> = ({ spec }) => {
  applyBrand('ninetyplus');
  const f = useCurrentFrame();
  const W = spec.words.words;
  const at = (i: number) => Math.round(W[i].start * FPS);
  const crest = (k: string) => staticFile(spec.dir + '/logos/' + k + '.png');
  const sfx = (n: string) => staticFile(spec.dir + '/sfx/' + n);
  const END = resultsFrames(spec);
  const starts = spec.cards.map((c) => at(c.from));
  const O0 = at(spec.outro.from);
  const nC = spec.cards.length;
  const cur = f >= O0 ? nC + 1 : starts.filter((s) => f >= s).length;
  const tints = spec.tints ?? ['#3a2a6a', ...spec.cards.map((c) => (c.stamp.win ? '#0a6a2a' : '#5a0a1a')), '#6a1a8a'];
  const recS = useSpring(at(spec.outro.record.word), theme.spring.slap);

  const Scene: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
    if (f < from - 1 || f >= to + 6) return null;
    return <AbsoluteFill style={{ opacity: interpolate(f, [to, to + 6], [1, 0], CL) }}>{children}</AbsoluteFill>;
  };

  const Row: React.FC<{ r: ResultRow; n: number; from: number }> = ({ r, n, from }) => {
    const s = useSpring(from);
    const mk = at(r.word);
    const m = useSpring(mk, theme.spring.slap);
    const done = f >= mk;
    const col = r.win ? GREEN : RED;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: done ? (r.win ? 'linear-gradient(90deg, rgba(34,197,94,0.28), rgba(11,10,13,0.8))' : 'linear-gradient(90deg, rgba(255,46,77,0.28), rgba(11,10,13,0.8))') : 'rgba(11,10,13,0.75)', borderRadius: 20, padding: '10px 16px', marginTop: n ? 10 : 0, border: done ? '2px solid ' + col : '1px solid rgba(255,255,255,0.12)', opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [80, 0]) + 'px)' }}>
        <Img src={crest(r.h)} style={{ width: 54, height: 54, objectFit: 'contain', filter: OUTLINE }} />
        <Img src={crest(r.a)} style={{ width: 54, height: 54, objectFit: 'contain', filter: OUTLINE }} />
        <div style={{ fontFamily: D(), fontSize: 40, color: '#fff', flex: 1, whiteSpace: 'nowrap' }}>{r.t}</div>
        {done ? <div style={{ fontFamily: D(), fontSize: 42, color: '#fff', opacity: Math.min(1, m * 2) }}>{r.score}</div> : null}
        <div style={{ width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? col : 'rgba(255,255,255,0.12)', transform: 'scale(' + (done ? interpolate(m, [0, 0.6, 1], [1.8, 0.9, 1], CL) : 1) + ')', boxShadow: done ? '0 0 22px ' + col : undefined }}>
          <div style={{ fontFamily: D(), fontSize: 34, color: '#0B0A0D' }}>{done ? (r.win ? '✓' : '✗') : '?'}</div>
        </div>
      </div>
    );
  };

  const Card: React.FC<{ i: number }> = ({ i }) => {
    const c = spec.cards[i];
    const from = starts[i];
    const s = useSpring(from, theme.spring.smooth);
    const tc = c.titleColor === 'gold' ? GOLD : c.titleColor === 'green' ? GREEN : RED;
    const top = c.rows.length >= 4 ? 380 : 420;
    const rowsEnd = top + 110 + c.rows.length * 76;
    const st = useSpring(at(c.stamp.word), theme.spring.slap);
    const sc = c.stamp.win ? GREEN : RED;
    return (
      <>
        <div style={{ position: 'absolute', top: 270, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 14, alignItems: 'center' }}>
          <div style={{ background: RED, color: '#fff', fontFamily: HV(), fontSize: 26, letterSpacing: 3, padding: '8px 16px', borderRadius: 8 }}>CARD {i + 1} OF {nC}</div>
          <div style={{ fontFamily: HV(), fontSize: 26, letterSpacing: 4, color: 'rgba(255,255,255,0.85)' }}>{c.header}</div>
        </div>
        <div style={{ position: 'absolute', left: 70, right: 70, top, background: 'linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))', border: '2px solid ' + (c.gold ? GOLD : 'rgba(255,255,255,0.28)'), borderRadius: 34, padding: '22px 22px 18px', boxShadow: '0 30px 80px rgba(0,0,0,0.7)' + (c.gold ? ', 0 0 40px rgba(255,210,63,0.35)' : ''), opacity: Math.min(1, s * 1.4), transform: 'translateY(' + interpolate(s, [0, 1], [120, 0]) + 'px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontFamily: D(), fontSize: 52, color: '#fff', letterSpacing: 2 }}>{c.title[0]} <span style={{ color: tc }}>{c.title[1]}</span></div>
            <div style={{ fontFamily: HV(), fontSize: 18, color: 'rgba(255,255,255,0.7)', letterSpacing: 2 }}>{c.tag}</div>
          </div>
          {c.rows.map((r, k) => <Row key={k} r={r} n={k} from={from + 6 + k * 4} />)}
        </div>
        {c.goals && f >= at(c.goals.word) ? (
          <div style={{ position: 'absolute', top: rowsEnd + 50, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 14, alignItems: 'center' }}>
            <Img src={crest(c.goals.crest)} style={{ width: 70, height: 70, objectFit: 'contain' }} />
            {c.goals.times.map((g, k) => {
              const gs = spring({ frame: f - at(c.goals!.word) - k * 4, fps: FPS, config: theme.spring.slap });
              return <div key={g} style={{ background: GREEN, color: '#0B0A0D', fontFamily: D(), fontSize: 50, padding: '6px 18px', borderRadius: 12, transform: 'scale(' + gs + ')' }}>⚽ {g}</div>;
            })}
          </div>
        ) : null}
        {c.note && f >= at(c.note.word) ? <div style={{ position: 'absolute', top: rowsEnd + 50, left: 0, right: 0, textAlign: 'center', fontFamily: D(), fontSize: 60, color: GOLD }}>{c.note.text}</div> : null}
        {f >= at(c.stamp.word) ? (
          <div style={{ position: 'absolute', left: 0, right: 0, top: Math.max(720, rowsEnd + (c.goals || c.note ? 170 : 60)), display: 'flex', justifyContent: 'center' }}>
            <div style={{ border: '10px solid ' + sc, color: sc, borderRadius: 20, padding: '4px 40px', fontFamily: D(), fontSize: 150, letterSpacing: 8, background: 'rgba(11,10,13,0.85)', transform: 'rotate(-8deg) scale(' + interpolate(st, [0, 0.6, 1], [2.4, 0.9, 1], CL) + ')', opacity: Math.min(1, st * 2), boxShadow: '0 0 50px ' + sc + '88', textShadow: '0 0 30px ' + sc + '99' }}>{c.stamp.win ? 'LANDED' : 'BUST'}</div>
          </div>
        ) : null}
      </>
    );
  };

  const emph = new Set(spec.emph ?? ['LANDED.', 'BUST.']);
  const Captions: React.FC = () => {
    const t = f / FPS;
    let i = -1;
    for (let k = 0; k < W.length; k++) if (W[k].start <= t + 0.02) i = k;
    if (i < 0 || t > W[i].end + 0.25) return null;
    const w = W[i].word.toUpperCase();
    const s = spring({ frame: f - Math.round(W[i].start * FPS), fps: FPS, config: theme.spring.snappy });
    const em = emph.has(w);
    const col = w.startsWith('LANDED') ? GREEN : RED;
    return (
      <div style={{ position: 'absolute', top: 1400, left: 0, right: 0, textAlign: 'center', fontFamily: em ? D() : HV(), fontSize: em ? 128 : 92, color: '#fff', transform: 'scale(' + interpolate(s, [0, 1], [0.85, 1]) + ')', ...(em ? { backgroundImage: 'linear-gradient(180deg, #FFFFFF 30%, ' + col + ')', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 18px ' + col + ')' } : { textShadow: '0 6px 0 rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.6)' }) }}>{w.replace(/[.,?!]$/, '')}</div>
    );
  };

  const hit = (from: number, name: string, vol = 0.4, dur = 1.2) => <Sequence key={name + from} from={Math.max(0, from - 1)} durationInFrames={Math.round(dur * FPS)} layout='none'><Audio src={sfx(name)} volume={vol} /></Sequence>;
  const WH = ['whoosh_motion.MP3', 'fast_swoosh.MP3', 'classic_whoosh.MP3', 'title_swoosh.MP3'];
  const sounds: React.ReactNode[] = [hit(0, 'bass_impact.MP3', 0.5)];
  let ding = 0, miss = 0;
  spec.cards.forEach((c, i) => {
    sounds.push(hit(starts[i], WH[i % WH.length]));
    const firstLoss = c.rows.find((r) => !r.win);
    if (firstLoss && miss < 2) { sounds.push(hit(at(firstLoss.word), 'glitch_sound.MP3', 0.3, 0.5)); miss++; }
    if (c.goals) sounds.push(hit(at(c.goals.word), 'pop_whoosh.MP3', 0.35, 0.8));
    if (c.stamp.win && ding < 2) { sounds.push(hit(at(c.stamp.word), 'ding_answer_correct.MP3', 0.4, 0.8)); ding++; }
    else sounds.push(hit(at(c.stamp.word), c.stamp.win ? 'cinematic_whoosh_impact.MP3' : (i % 2 ? 'punch_sound.MP3' : 'wrong_answer.MP3'), 0.45));
  });
  sounds.push(hit(O0, 'title_swoosh.MP3'));
  sounds.push(hit(at(spec.outro.record.word), 'bass_impact.MP3', 0.5));
  sounds.push(hit(at(spec.outro.banner.word), 'pop_sound.MP3', 0.4, 0.6));

  return (
    <AbsoluteFill style={{ background: '#0B0A0D' }}>
      <Stadium tint={tints[Math.min(tints.length - 1, cur)]} dim={0.2} />
      <div style={{ position: 'absolute', top: 205, left: 0, right: 0, textAlign: 'center', fontFamily: HV(), fontSize: 28, letterSpacing: 6, color: 'rgba(255,255,255,0.8)' }}>{spec.topline}</div>
      <Scene from={0} to={starts[0]}>
        <div style={{ position: 'absolute', top: 300, left: 0, right: 0, textAlign: 'center', fontFamily: D(), fontSize: 150, lineHeight: 0.95, color: '#fff', textShadow: '0 10px 30px rgba(0,0,0,0.7)' }}>{spec.intro.title[0]}<br /><span style={{ color: GOLD }}>{spec.intro.title[1]}</span></div>
        <div style={{ position: 'absolute', left: 110, right: 110, top: 620, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {spec.intro.items.map((t, i) => {
            const s = spring({ frame: f + 14 - i * 3, fps: FPS, config: theme.spring.snappy });
            return (
              <div key={t} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(11,10,13,0.8)', border: '2px solid ' + (i === 0 ? GOLD : 'rgba(255,255,255,0.25)'), borderRadius: 18, padding: '14px 24px', opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [i % 2 ? 120 : -120, 0]) + 'px)' }}>
                <div style={{ fontFamily: D(), fontSize: 50, color: '#fff' }}>{t}</div>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D(), fontSize: 40, color: GOLD }}>?</div>
              </div>
            );
          })}
        </div>
      </Scene>
      {spec.cards.map((_, i) => <Scene key={i} from={starts[i]} to={i + 1 < nC ? starts[i + 1] : O0}><Card i={i} /></Scene>)}
      <Scene from={O0} to={END + 10}>
        <div style={{ position: 'absolute', top: 330, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 18 }}>
          {spec.cards.map((c, i) => {
            const s = spring({ frame: f - O0 - i * 3, fps: FPS, config: theme.spring.snappy });
            return <div key={i} style={{ width: 150, height: 90, borderRadius: 16, background: c.stamp.win ? GREEN : RED, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D(), fontSize: 34, color: '#0B0A0D', transform: 'scale(' + s + ')' }}>{c.stamp.win ? 'LANDED' : 'BUST'}</div>;
          })}
        </div>
        <div style={{ position: 'absolute', top: 470, left: 0, right: 0, textAlign: 'center', fontFamily: HV(), fontSize: 32, letterSpacing: 5, color: 'rgba(255,255,255,0.85)' }}>{spec.outro.line}</div>
        {f >= at(spec.outro.record.word) ? (
          <div style={{ position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 22 }}>
            <div style={{ fontFamily: HV(), fontSize: 34, letterSpacing: 6, color: '#fff' }}>{spec.outro.record.label}</div>
            <div style={{ fontFamily: D(), fontSize: 240, color: GOLD, textShadow: '0 0 30px rgba(255,210,63,0.6)', transform: 'scale(' + interpolate(recS, [0, 0.6, 1], [1.6, 0.95, 1], CL) + ')' }}>{spec.outro.record.value}</div>
          </div>
        ) : null}
        {f >= at(spec.outro.banner.word) ? (
          <div style={{ position: 'absolute', top: 960, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: GOLD, color: '#0B0A0D', fontFamily: D(), fontSize: 58, padding: '10px 28px', borderRadius: 16, boxShadow: '0 14px 40px rgba(255,210,63,0.45)', transform: 'translateY(' + Math.sin(f / 4) * 6 + 'px)' }}>{spec.outro.banner.text}</div>
          </div>
        ) : null}
      </Scene>
      <Captions />
      <Audio src={staticFile(spec.dir + '/voiceover.wav')} />
      <Audio src={staticFile(spec.dir + '/music/bed.wav')} volume={spec.musicVolume ?? 0.16} />
      {sounds}
    </AbsoluteFill>
  );
};
