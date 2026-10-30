import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { theme, applyBrand } from '../theme';
import { Stadium } from '../mockups/Mockups';

// Long-form (16:9, 6-10 min) "Weekend Preview" for YouTube, posted Thursdays once the weekend's picks are set.
// A video is a PreviewSpec in src/previews/npNNN.ts + this component; word indices point into the George voiceover's
// words.json. Structure: intro (title + rundown) -> one chapter per game (title card, then panels that swap on their
// word) -> recap (every card) -> outro. Phrase subtitles run along the bottom, a chapter bar along the very bottom.
// Gate: bash tools/card-gate.sh NNN. YouTube chapters: node tools/preview-chapters.mjs NNN.

export type Panel =
  | { kind: 'stat'; word: number; value: string; label: string; sub?: string; color?: 'gold' | 'red' | 'green'; focus?: string }
  | { kind: 'compare'; word: number; label: string; h: number; a: number; fmt?: string; better?: 'high' | 'low'; focus?: string }
  | { kind: 'form'; word: number; label: string; rows: { crest: string; results: string[] }[]; focus?: string }
  | { kind: 'player'; word: number; name: string; img?: string; crest?: string; lines: [string, string][]; focus?: string }
  | { kind: 'point'; word: number; tag: string; text: string[]; color?: 'gold' | 'red' | 'green'; focus?: string }
  | { kind: 'table'; word: number; label: string; rows: { pos: number; crest: string; team: string; pts: number; hl?: boolean }[]; focus?: string }
  | { kind: 'pick'; word: number; text: string; note?: string; focus?: string };
export type Chapter = {
  from: number;                     // first word of the chapter (title card shows until the first panel)
  label: string;                    // chapter name for the bar + YouTube chapters, e.g. 'Milan v Inter'
  league: string;                   // 'SERIE A'
  h: string; a: string;             // crest keys
  hName: string; aName: string;     // 'MILAN', 'INTER'
  time: string;                     // 'SAT 3:45 PM' (ET appended)
  venue?: string;
  glow?: [string, string];          // home / away glow colours
  panels: Panel[];
};
export type PreviewSpec = {
  kind: 'preview';
  dir: string;
  words: { duration: number; words: { word: string; start: number; end: number }[] };
  title: [string, string];          // ['WEEKEND', 'PREVIEW']
  dates: string;                    // 'SAT 31 OCT - SUN 1 NOV'
  record: string;                   // season record
  intro: { listWord: number };      // word the rundown starts appearing on
  chapters: Chapter[];
  recap: { from: number; groups: { title: [string, string]; tag: string; rows: { h: string; a: string; t: string; time: string }[] }[] };
  outro: { from: number; lines: string[]; banner: { word: number; text: string } };
  tints?: string[];
  musicVolume?: number;
};

const RED = '#FF2E4D';
const GOLD = '#FFD23F';
const GREEN = '#22C55E';
const FPS = 30;
const COL = { gold: GOLD, red: RED, green: GREEN };
const D = () => theme.fonts.display;
const HV = () => theme.fonts.heavy;
const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const OUTLINE = 'drop-shadow(0 0 3px rgba(255,255,255,0.9))';
const STAT = ['magic_reveal.MP3', 'pop_sound.MP3', 'glitch_sound.MP3', 'pop_sound.MP3'];
const WHOOSH = ['whoosh_motion.MP3', 'fast_swoosh.MP3', 'classic_whoosh.MP3', 'title_swoosh.MP3'];

export const previewFrames = (s: PreviewSpec) => Math.ceil(s.words.duration * FPS);

// Chapter start times in seconds (intro, each chapter, recap, outro) - shared with tools/preview-chapters.mjs.
export const previewSections = (s: PreviewSpec) => {
  const t = (i: number) => s.words.words[i].start;
  return [{ label: 'Intro', start: 0 }, ...s.chapters.map((c) => ({ label: c.label, start: t(c.from) })), { label: 'The full card', start: t(s.recap.from) }, { label: 'Outro', start: t(s.outro.from) }];
};

export const PreviewTemplate: React.FC<{ spec: PreviewSpec }> = ({ spec }) => {
  applyBrand('ninetyplus');
  const f = useCurrentFrame();
  const W = spec.words.words;
  const at = (i: number) => Math.round(W[i].start * FPS);
  const crest = (k: string) => staticFile(spec.dir + '/logos/' + k + '.png');
  const pic = (k: string) => staticFile('mockups/' + k + '.png');
  const sfx = (n: string) => staticFile(spec.dir + '/sfx/' + n);
  const END = previewFrames(spec);
  const C = spec.chapters;
  const cs = C.map((c) => at(c.from));
  const recap = at(spec.recap.from);
  const outro = at(spec.outro.from);
  let cur = -1; cs.forEach((s, i) => { if (f >= s) cur = i; });
  const sec = f >= outro ? C.length + 1 : f >= recap ? C.length : cur;   // -1 intro, 0..n-1 chapters, n recap, n+1 outro
  const tints = spec.tints ?? ['#5a0a1a', ...C.map((_, i) => (i % 2 ? '#1a2a6a' : '#3a1a5a')), '#5a0a1a', '#5a0a1a'];
  const sp = (from: number, cfg: { damping: number; stiffness: number; mass: number } = theme.spring.smooth) => spring({ frame: f - from, fps: FPS, config: cfg });

  const Fade: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
    if (f < from - 1 || f >= to + 6) return null;
    return <AbsoluteFill style={{ opacity: interpolate(f, [from, from + 6, to, to + 6], [0, 1, 1, 0], CL) }}>{children}</AbsoluteFill>;
  };

  const Header: React.FC = () => (
    <div style={{ position: 'absolute', top: 36, left: 70, right: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 14, height: 44, background: RED, borderRadius: 4, boxShadow: '0 0 20px ' + RED }} />
        <div style={{ fontFamily: HV(), fontSize: 26, letterSpacing: 6, color: '#fff' }}>NINETY PLUS</div>
        <div style={{ fontFamily: HV(), fontSize: 20, letterSpacing: 3, color: 'rgba(255,255,255,0.55)', marginLeft: 16 }}>{spec.title.join(' ')} · {spec.dates}</div>
      </div>
      <div style={{ fontFamily: HV(), fontSize: 22, letterSpacing: 4, color: 'rgba(255,255,255,0.85)' }}>SEASON <span style={{ color: GOLD }}>{spec.record}</span></div>
    </div>
  );

  // ---------- intro ----------
  const Intro: React.FC = () => {
    const s = sp(-10);
    const lw = at(spec.intro.listWord);
    return (
      <>
        <div style={{ position: 'absolute', left: 120, top: 200, opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [-120, 0]) + 'px)' }}>
          <div style={{ fontFamily: D(), fontSize: 190, lineHeight: 0.9, color: '#fff' }}>{spec.title[0]}</div>
          <div style={{ fontFamily: D(), fontSize: 190, lineHeight: 0.9, color: RED, textShadow: '0 0 40px rgba(255,46,77,0.5)' }}>{spec.title[1]}</div>
          <div style={{ marginTop: 20, fontFamily: HV(), fontSize: 30, letterSpacing: 6, color: GOLD }}>{spec.dates}</div>
        </div>
        <div style={{ position: 'absolute', right: 110, top: 190, width: 760, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {C.map((c, i) => {
            const a = lw + i * 8;
            const r = sp(a, theme.spring.snappy);
            if (f < a) return null;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(11,10,13,0.75)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 16, padding: '10px 18px', opacity: r, transform: 'translateX(' + interpolate(r, [0, 1], [80, 0]) + 'px)' }}>
                <div style={{ fontFamily: D(), fontSize: 36, color: RED, width: 34 }}>{i + 1}</div>
                <Img src={crest(c.h)} style={{ width: 50, height: 50, objectFit: 'contain', filter: OUTLINE }} />
                <Img src={crest(c.a)} style={{ width: 50, height: 50, objectFit: 'contain', filter: OUTLINE }} />
                <div style={{ fontFamily: D(), fontSize: 38, color: '#fff', flex: 1, whiteSpace: 'nowrap' }}>{c.hName} v {c.aName}</div>
                <div style={{ fontFamily: HV(), fontSize: 16, letterSpacing: 1, color: 'rgba(255,255,255,0.65)', textAlign: 'right', whiteSpace: 'nowrap' }}>{c.league}<br />{c.time} ET</div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  // ---------- chapter ----------
  const TitleCard: React.FC<{ c: Chapter; i: number }> = ({ c, i }) => {
    const from = cs[i];
    const s = sp(from, theme.spring.bouncy);
    const [gh, ga] = c.glow ?? ['rgba(255,46,77,0.6)', 'rgba(255,210,63,0.5)'];
    const side = (k: string, g: string, left: boolean) => (
      <Img src={crest(k)} style={{ position: 'absolute', [left ? 'left' : 'right']: 230, top: 250, width: 360, height: 360, objectFit: 'contain', opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [left ? -300 : 300, 0]) + 'px) scale(' + (1 + (f - from) * 0.0007) + ')', filter: 'drop-shadow(0 0 50px ' + g + ') drop-shadow(0 20px 30px rgba(0,0,0,0.6))' }} />
    );
    return (
      <>
        {side(c.h, gh, true)}
        {side(c.a, ga, false)}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 210, textAlign: 'center', opacity: s }}>
          <div style={{ display: 'inline-block', background: RED, color: '#fff', fontFamily: HV(), fontSize: 26, letterSpacing: 4, padding: '8px 18px', borderRadius: 8 }}>GAME {i + 1} OF {C.length}</div>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', fontFamily: D(), fontSize: 110, color: 'rgba(255,255,255,0.85)', opacity: s }}>V</div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 660, textAlign: 'center', opacity: s }}>
          <div style={{ fontFamily: D(), fontSize: 96, color: '#fff', letterSpacing: 2 }}>{c.hName} <span style={{ color: 'rgba(255,255,255,0.5)' }}>v</span> {c.aName}</div>
          <div style={{ fontFamily: HV(), fontSize: 28, letterSpacing: 5, color: GOLD, marginTop: 6 }}>{c.league} · {c.time} ET{c.venue ? ' · ' + c.venue : ''}</div>
        </div>
      </>
    );
  };

  const Strip: React.FC<{ c: Chapter; from: number }> = ({ c, from }) => {
    const s = sp(from, theme.spring.snappy);
    return (
      <div style={{ position: 'absolute', top: 110, left: 70, display: 'flex', alignItems: 'center', gap: 14, opacity: s }}>
        <Img src={crest(c.h)} style={{ width: 52, height: 52, objectFit: 'contain', filter: OUTLINE }} />
        <div style={{ fontFamily: D(), fontSize: 36, color: '#fff' }}>{c.hName} <span style={{ color: 'rgba(255,255,255,0.5)' }}>v</span> {c.aName}</div>
        <Img src={crest(c.a)} style={{ width: 52, height: 52, objectFit: 'contain', filter: OUTLINE }} />
        <div style={{ fontFamily: HV(), fontSize: 18, letterSpacing: 2, color: 'rgba(255,255,255,0.7)', marginLeft: 8 }}>{c.league} · {c.time} ET</div>
      </div>
    );
  };

  const Hero: React.FC<{ c: Chapter; p: Panel; from: number; k: number }> = ({ c, p, from, k }) => {
    const s = sp(from);
    const key = p.focus ?? (k % 2 ? c.a : c.h);
    const glow = c.glow ? (key === c.a ? c.glow[1] : c.glow[0]) : 'rgba(255,46,77,0.6)';
    if (p.kind === 'player' && p.img) {
      return <Img src={pic(p.img)} style={{ position: 'absolute', right: 40, bottom: 150, height: 760, opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [200, 0]) + 'px)', filter: 'drop-shadow(-12px 0 30px ' + glow + ')' }} />;
    }
    const k2 = p.kind === 'player' && p.crest ? p.crest : key;
    return (
      <>
        <div style={{ position: 'absolute', right: -120, top: 160, width: 820, height: 820, borderRadius: '50%', background: 'radial-gradient(circle, ' + glow + ' 0%, rgba(0,0,0,0) 62%)', opacity: s * 0.9 }} />
        <Img src={crest(k2)} style={{ position: 'absolute', right: 130, top: 300, width: 460, height: 460, objectFit: 'contain', opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [220, 0]) + 'px) rotate(' + (6 - (f - from) * 0.015) + 'deg)', filter: 'drop-shadow(0 0 40px ' + glow + ') drop-shadow(0 24px 34px rgba(0,0,0,0.7))' }} />
      </>
    );
  };

  const Body: React.FC<{ c: Chapter; p: Panel; from: number }> = ({ c, p, from }) => {
    const s = sp(from, theme.spring.slap);
    const base: React.CSSProperties = { position: 'absolute', left: 120, top: 230, width: 1080, opacity: Math.min(1, s * 2), transform: 'translateY(' + interpolate(s, [0, 1], [40, 0], CL) + 'px)' };
    const label = (t: string) => <div style={{ fontFamily: HV(), fontSize: 30, letterSpacing: 4, color: 'rgba(255,255,255,0.85)', marginBottom: 22 }}>{t}</div>;
    if (p.kind === 'stat') {
      const col = COL[p.color ?? 'gold'];
      return (
        <div style={{ ...base, top: 260 }}>
          <div style={{ fontFamily: D(), fontSize: 300, lineHeight: 0.9, color: col, textShadow: '0 0 40px ' + col + '88, 0 10px 0 rgba(0,0,0,0.5)', transform: 'scale(' + interpolate(s, [0, 0.6, 1], [1.4, 0.97, 1], CL) + ')', transformOrigin: '0 50%' }}>{p.value}</div>
          <div style={{ fontFamily: D(), fontSize: 64, color: '#fff', maxWidth: 1000, lineHeight: 1.05, marginTop: 14 }}>{p.label}</div>
          {p.sub ? <div style={{ fontFamily: HV(), fontSize: 22, letterSpacing: 2, color: 'rgba(255,255,255,0.6)', marginTop: 16 }}>{p.sub}</div> : null}
        </div>
      );
    }
    if (p.kind === 'compare') {
      const max = Math.max(p.h, p.a) * 1.15 || 1;
      const best = p.better === 'low' ? Math.min(p.h, p.a) : Math.max(p.h, p.a);
      const fmt = (v: number) => (p.fmt ? p.fmt.replace('#', String(v)) : String(v));
      return (
        <div style={{ ...base, top: 280 }}>
          {label(p.label)}
          {[[c.h, c.hName, p.h], [c.a, c.aName, p.a]].map(([k, n, v], i) => {
            const g = sp(from + 6 + i * 6);
            const col = v === best ? GOLD : 'rgba(255,255,255,0.55)';
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 26 }}>
                <Img src={crest(k as string)} style={{ width: 90, height: 90, objectFit: 'contain', filter: OUTLINE }} />
                <div style={{ width: 230, fontFamily: D(), fontSize: 46, color: '#fff' }}>{n}</div>
                <div style={{ flex: 1, height: 64, background: 'rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
                  <div style={{ width: ((v as number) / max) * 100 * g + '%', height: '100%', background: col, borderRadius: 14, boxShadow: v === best ? '0 0 30px ' + GOLD : 'none' }} />
                </div>
                <div style={{ width: 150, fontFamily: D(), fontSize: 60, color: col, textAlign: 'right' }}>{fmt(v as number)}</div>
              </div>
            );
          })}
        </div>
      );
    }
    if (p.kind === 'form') {
      return (
        <div style={{ ...base, top: 280 }}>
          {label(p.label)}
          {p.rows.map((r, j) => (
            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <Img src={crest(r.crest)} style={{ width: 86, height: 86, objectFit: 'contain', filter: OUTLINE, marginRight: 10 }} />
              {r.results.map((x, i) => {
                const g = spring({ frame: f - from - j * 8 - i * 2, fps: FPS, config: theme.spring.snappy });
                const bg = x === 'W' || x === '✓' ? GREEN : x === 'D' || x === '–' ? '#8a8a8a' : RED;
                return <div key={i} style={{ width: 82, height: 82, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D(), fontSize: 46, color: '#0B0A0D', transform: 'scale(' + g + ')' }}>{x}</div>;
              })}
            </div>
          ))}
        </div>
      );
    }
    if (p.kind === 'player') {
      return (
        <div style={{ ...base, top: 270 }}>
          <div style={{ fontFamily: D(), fontSize: 130, lineHeight: 0.95, color: '#fff' }}>{p.name}</div>
          <div style={{ display: 'flex', gap: 18, marginTop: 30, flexWrap: 'wrap' }}>
            {p.lines.map(([v, l], i) => {
              const g = sp(from + 6 + i * 5, theme.spring.slap);
              return (
                <div key={i} style={{ background: 'rgba(11,10,13,0.85)', border: '3px solid ' + GOLD, borderRadius: 18, padding: '14px 24px', transform: 'scale(' + interpolate(g, [0, 1], [0.6, 1]) + ')', opacity: Math.min(1, g * 2) }}>
                  <div style={{ fontFamily: D(), fontSize: 76, color: GOLD, lineHeight: 1 }}>{v}</div>
                  <div style={{ fontFamily: HV(), fontSize: 20, letterSpacing: 2, color: '#fff', marginTop: 6 }}>{l}</div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    if (p.kind === 'point') {
      const col = COL[p.color ?? 'red'];
      return (
        <div style={{ ...base, top: 280 }}>
          <div style={{ display: 'inline-block', background: col, color: p.color === 'gold' || p.color === 'green' ? '#0B0A0D' : '#fff', fontFamily: HV(), fontSize: 28, letterSpacing: 4, padding: '8px 18px', borderRadius: 8, marginBottom: 26 }}>{p.tag}</div>
          {p.text.map((l, i) => <div key={i} style={{ fontFamily: D(), fontSize: 92, lineHeight: 1.02, color: i === 1 ? col : '#fff', transform: 'skewX(-5deg)' }}>{l}</div>)}
        </div>
      );
    }
    if (p.kind === 'table') {
      return (
        <div style={{ ...base, top: 250, width: 980 }}>
          {label(p.label)}
          {p.rows.map((r, i) => {
            const g = sp(from + i * 3, theme.spring.snappy);
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '10px 18px', marginBottom: 8, borderRadius: 14, background: r.hl ? 'rgba(255,210,63,0.16)' : 'rgba(11,10,13,0.7)', border: '2px solid ' + (r.hl ? GOLD : 'rgba(255,255,255,0.12)'), opacity: g, transform: 'translateX(' + interpolate(g, [0, 1], [60, 0]) + 'px)' }}>
                <div style={{ width: 50, fontFamily: D(), fontSize: 40, color: r.hl ? GOLD : 'rgba(255,255,255,0.6)' }}>{r.pos}</div>
                <Img src={crest(r.crest)} style={{ width: 56, height: 56, objectFit: 'contain', filter: OUTLINE }} />
                <div style={{ flex: 1, fontFamily: D(), fontSize: 44, color: '#fff' }}>{r.team}</div>
                <div style={{ fontFamily: D(), fontSize: 44, color: r.hl ? GOLD : '#fff' }}>{r.pts} <span style={{ fontFamily: HV(), fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>PTS</span></div>
              </div>
            );
          })}
        </div>
      );
    }
    // pick
    return (
      <div style={{ ...base, top: 320 }}>
        <div style={{ fontFamily: HV(), fontSize: 34, letterSpacing: 8, color: GOLD, marginBottom: 20 }}>THE PICK</div>
        <div style={{ display: 'inline-block', background: 'linear-gradient(180deg, ' + GREEN + ', #15803d)', border: '5px solid ' + GOLD, borderRadius: 26, padding: '18px 40px', boxShadow: '0 20px 60px rgba(34,197,94,0.5)', transform: 'scale(' + interpolate(s, [0, 0.6, 1], [1.6, 0.95, 1], CL) + ') rotate(-2deg)', transformOrigin: '0 50%' }}>
          <div style={{ fontFamily: D(), fontSize: 110, color: '#0B0A0D', whiteSpace: 'nowrap' }}>{p.text}</div>
        </div>
        {p.note ? <div style={{ fontFamily: HV(), fontSize: 26, letterSpacing: 3, color: '#fff', marginTop: 34 }}>{p.note}</div> : null}
      </div>
    );
  };

  const ChapterScene: React.FC<{ c: Chapter; i: number }> = ({ c, i }) => {
    const end = i + 1 < C.length ? cs[i + 1] : recap;
    const ps = c.panels.map((p) => at(p.word));
    const first = ps[0] ?? end;
    return (
      <>
        <Fade from={cs[i]} to={first}><TitleCard c={c} i={i} /></Fade>
        {f >= first ? <Strip c={c} from={first} /> : null}
        {c.panels.map((p, k) => {
          const to = k + 1 < ps.length ? ps[k + 1] : end;
          return (
            <Fade key={k} from={ps[k]} to={to}>
              <Hero c={c} p={p} from={ps[k]} k={k} />
              <Body c={c} p={p} from={ps[k]} />
            </Fade>
          );
        })}
      </>
    );
  };

  // ---------- recap + outro ----------
  const Recap: React.FC = () => {
    const G = spec.recap.groups;
    const w = G.length === 1 ? 1100 : G.length === 2 ? 840 : 560;
    return (
      <div style={{ position: 'absolute', left: 0, right: 0, top: 280, display: 'flex', justifyContent: 'center', gap: 26 }}>
        {G.map((g, j) => {
          const s = sp(recap + j * 8);
          const n = g.rows.length;
          return (
            <div key={j} style={{ width: w, background: 'linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))', border: '2px solid rgba(255,255,255,0.28)', borderRadius: 28, padding: '20px 20px 16px', boxShadow: '0 30px 80px rgba(0,0,0,0.7)', opacity: Math.min(1, s * 1.4), transform: 'translateY(' + interpolate(s, [0, 1], [100, 0]) + 'px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                <div style={{ fontFamily: D(), fontSize: G.length > 2 ? 44 : 52, color: '#fff', whiteSpace: 'nowrap' }}>{g.title[0]} <span style={{ color: RED }}>{g.title[1]}</span></div>
                <div style={{ fontFamily: HV(), fontSize: 16, letterSpacing: 2, color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>{g.tag}</div>
              </div>
              {g.rows.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(11,10,13,0.72)', borderRadius: 14, padding: '8px 12px', marginTop: 8, border: '1px solid rgba(255,255,255,0.12)' }}>
                  <Img src={crest(r.h)} style={{ width: 42, height: 42, objectFit: 'contain', filter: OUTLINE }} />
                  <Img src={crest(r.a)} style={{ width: 42, height: 42, objectFit: 'contain', filter: OUTLINE }} />
                  <div style={{ fontFamily: D(), fontSize: n > 4 || G.length > 2 ? 28 : 34, color: '#fff', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}>{r.t}</div>
                  <div style={{ fontFamily: HV(), fontSize: 13, color: 'rgba(255,255,255,0.65)', whiteSpace: 'nowrap', textAlign: 'right' }}>{r.time}<br />ET</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  const Outro: React.FC = () => {
    const s = sp(outro, theme.spring.bouncy);
    const b = at(spec.outro.banner.word);
    return (
      <>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 230, textAlign: 'center', opacity: s, transform: 'scale(' + interpolate(s, [0, 1], [0.85, 1]) + ')' }}>
          <div style={{ fontFamily: D(), fontSize: 170, lineHeight: 0.95, color: '#fff' }}>NINETY <span style={{ color: RED }}>PLUS</span></div>
          {spec.outro.lines.map((l, i) => <div key={i} style={{ fontFamily: HV(), fontSize: 32, letterSpacing: 5, color: i ? 'rgba(255,255,255,0.8)' : GOLD, marginTop: i ? 10 : 26 }}>{l}</div>)}
        </div>
        {f >= b ? (
          <div style={{ position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: GOLD, color: '#0B0A0D', fontFamily: D(), fontSize: 70, padding: '10px 36px', borderRadius: 18, boxShadow: '0 14px 40px rgba(255,210,63,0.45)', transform: 'scale(' + interpolate(sp(b, theme.spring.slap), [0, 1], [0.6, 1]) + ') translateY(' + Math.sin(f / 5) * 5 + 'px)' }}>{spec.outro.banner.text}</div>
          </div>
        ) : null}
      </>
    );
  };

  // ---------- subtitles + chapter bar ----------
  const lines = React.useMemo(() => {
    const out: { a: number; b: number }[] = [];
    let a = 0;
    W.forEach((w, i) => { if (i - a >= 6 || /[.?!,]$/.test(w.word) || i === W.length - 1) { out.push({ a, b: i }); a = i + 1; } });
    return out;
  }, [W]);
  const Subs: React.FC = () => {
    const t = f / FPS;
    const L = lines.find((l) => W[l.a].start <= t + 0.02 && t <= W[l.b].end + 0.3);
    if (!L) return null;
    return (
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 74, display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: 'rgba(11,10,13,0.78)', borderRadius: 14, padding: '10px 26px', fontFamily: HV(), fontSize: 40, letterSpacing: 1, color: '#fff', whiteSpace: 'nowrap' }}>
          {W.slice(L.a, L.b + 1).map((w, i) => <span key={i} style={{ color: W[L.a + i].start <= t + 0.02 ? (W[L.a + i].end >= t ? GOLD : '#fff') : 'rgba(255,255,255,0.55)' }}>{w.word.toUpperCase()} </span>)}
        </div>
      </div>
    );
  };
  const S = previewSections(spec);
  const Bar: React.FC = () => {
    const t = f / FPS;
    const total = spec.words.duration;
    return (
      <div style={{ position: 'absolute', left: 70, right: 70, bottom: 30, display: 'flex', gap: 6 }}>
        {S.map((x, i) => {
          const e = i + 1 < S.length ? S[i + 1].start : total;
          const fill = Math.max(0, Math.min(1, (t - x.start) / (e - x.start)));
          const on = t >= x.start && t < e;
          return (
            <div key={i} style={{ flex: e - x.start, position: 'relative' }}>
              <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.18)', overflow: 'hidden' }}><div style={{ width: fill * 100 + '%', height: '100%', background: RED }} /></div>
              {on ? <div style={{ position: 'absolute', bottom: 14, left: 0, fontFamily: HV(), fontSize: 15, letterSpacing: 2, color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap' }}>{x.label.toUpperCase()}</div> : null}
            </div>
          );
        })}
      </div>
    );
  };

  // ---------- sound ----------
  const hit = (from: number, name: string, vol = 0.3, dur = 1.2) => <Sequence key={name + from} from={Math.max(0, from - 1)} durationInFrames={Math.round(dur * FPS)} layout='none'><Audio src={sfx(name)} volume={vol} /></Sequence>;
  const sounds: React.ReactNode[] = [hit(0, 'bass_impact.MP3', 0.45), hit(at(spec.intro.listWord), 'pop_whoosh.MP3', 0.3)];
  let st = 0;
  C.forEach((c, i) => {
    sounds.push(hit(cs[i], WHOOSH[i % WHOOSH.length], 0.35));
    c.panels.forEach((p) => {
      if (p.kind === 'pick') sounds.push(hit(at(p.word), i % 2 ? 'cinematic_whoosh_impact.MP3' : 'punch_sound.MP3', 0.4));
      else { sounds.push(hit(at(p.word), STAT[st % STAT.length], 0.22, 0.7)); st++; }
    });
  });
  sounds.push(hit(recap, 'title_swoosh.MP3', 0.35), hit(outro, 'whoosh_motion.MP3', 0.3), hit(at(spec.outro.banner.word), 'pop_whoosh.MP3', 0.35));

  return (
    <AbsoluteFill style={{ background: '#0B0A0D', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, transform: 'scale(1.25) translateY(-4%)', transformOrigin: '50% 50%' }}>
        <Stadium tint={tints[Math.min(tints.length - 1, sec + 1)]} dim={0.2} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(11,10,13,0.8) 0%, rgba(11,10,13,0.35) 60%, rgba(11,10,13,0.15) 100%)' }} />
      <Fade from={0} to={cs[0]}><Intro /></Fade>
      {C.map((c, i) => (f >= cs[i] - 1 && f < (i + 1 < C.length ? cs[i + 1] : recap) + 6 ? <ChapterScene key={i} c={c} i={i} /> : null))}
      <Fade from={recap} to={outro}><Recap /></Fade>
      <Fade from={outro} to={END + 10}><Outro /></Fade>
      <Header />
      <Subs />
      <Bar />
      <div style={{ position: 'absolute', right: 70, bottom: 74, fontFamily: HV(), fontSize: 13, letterSpacing: 2, color: 'rgba(255,255,255,0.35)' }}>18+ · OPINIONS ONLY</div>
      <Audio src={staticFile(spec.dir + '/voiceover.wav')} />
      <Audio src={staticFile(spec.dir + '/music/bed.wav')} volume={spec.musicVolume ?? 0.07} />
      {sounds}
    </AbsoluteFill>
  );
};
