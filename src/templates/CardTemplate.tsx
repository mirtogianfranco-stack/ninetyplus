import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { theme, applyBrand } from '../theme';
import { Stadium } from '../mockups/Mockups';

// Reusable "Weekend Card" picks video (the look the owner picked, 16 Oct 2026; np-005..np-014 were hand-built from it).
// A video is now a data file in src/cards/npNNN.ts (a CardSpec) + this component. Word indices point into the
// George voiceover's words.json. Check every spec with `bash tools/card-gate.sh NNN` before review.

export type Ref = { img?: string; crest?: string };
export type Device =
  | { kind: 'big'; word: number; value: string; label: string; color?: 'gold' | 'red' | 'green'; top?: number }
  | { kind: 'chips'; word: number; items: { text: string; tag?: string; crest?: string; border?: string }[]; top?: number; row?: boolean }
  | { kind: 'form'; word: number; label: string; results: string[]; top?: number };
export type Pick = {
  from: number;            // first word of this pick's scene
  h: string; a: string;    // crest keys (public/<dir>/logos/<key>.png)
  time: string;            // e.g. 'TUE 3:45 PM' (ET is appended)
  hero: Ref & { glow: string };
  claim: [string, string, string?];   // three lines; line 2 is highlighted
  claimColor?: 'gold' | 'red';
  pill: string; pillWord: number;     // the pick, slammed on its word
  row?: string;                       // card-row text (defaults to pill)
  devices: Device[];
};
export type CardSpec = {
  dir: string;                                    // public/<dir> (voiceover.wav, music/bed.wav, logos/, sfx/)
  words: { duration: number; words: { word: string; start: number; end: number }[] };
  title: [string, string];                        // card header, second word in red
  tag: string;                                    // card header right (league)
  record: string;                                 // shown on the hook frame
  fan: { left: Ref; right: Ref; centers: string[]; glows?: [string, string] };
  picks: Pick[];
  outroWord: number;                              // first word of the outro
  outroChip?: { word: number; text: string; highlight?: string; crest?: string; until?: number };
  commentWord: number;                            // COMMENT YOUR PICK banner
  commentText?: string;
  tints?: string[];                               // hook, each pick, outro
  emph?: string[];                                // caption words (upper case, with punctuation) shown big
  musicVolume?: number;
};

const RED = '#FF2E4D';
const GOLD = '#FFD23F';
const GREEN = '#22C55E';
const FPS = 30;
const COLORS = { gold: GOLD, red: RED, green: GREEN };
const D = () => theme.fonts.display;
const HV = () => theme.fonts.heavy;
const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
type Cfg = { damping: number; stiffness: number; mass: number };
const useSpring = (from: number, cfg: Cfg = theme.spring.snappy) => spring({ frame: useCurrentFrame() - from, fps: FPS, config: cfg });
const OUTLINE = 'drop-shadow(0 0 3px rgba(255,255,255,0.9))';

// SFX rotation: each file at most twice (retention-gate rule), assigned in order.
const WHOOSH = ['whoosh_motion.MP3', 'fast_swoosh.MP3', 'classic_whoosh.MP3', 'title_swoosh.MP3', 'pop_whoosh.MP3', 'whoosh_motion.MP3'];
const SLAM = ['punch_sound.MP3', 'cinematic_whoosh_impact.MP3', 'punch_sound.MP3', 'cinematic_whoosh_impact.MP3', 'bass_impact.MP3'];
const STAT = ['magic_reveal.MP3', 'pop_sound.MP3', 'glitch_sound.MP3', 'pop_sound.MP3', 'magic_reveal.MP3', 'glitch_sound.MP3'];

export const cardFrames = (spec: CardSpec) => Math.ceil(spec.words.duration * FPS);

export const CardTemplate: React.FC<{ spec: CardSpec }> = ({ spec }) => {
  applyBrand('ninetyplus');
  const f = useCurrentFrame();
  const W = spec.words.words;
  const at = (i: number) => Math.round(W[i].start * FPS);
  const crest = (k: string) => staticFile(spec.dir + '/logos/' + k + '.png');
  const pic = (k: string) => staticFile('mockups/' + k + '.png');
  const sfx = (n: string) => staticFile(spec.dir + '/sfx/' + n);
  const END = cardFrames(spec);
  const starts = spec.picks.map((p) => at(p.from));
  const outro = at(spec.outroWord);
  const sceneOf = (fr: number) => { let k = -1; starts.forEach((s, i) => { if (fr >= s) k = i; }); return fr >= outro ? spec.picks.length : k; };
  const cur = sceneOf(f);
  const n = spec.picks.length;
  const tints = spec.tints ?? ['#1a2a8a', ...spec.picks.map(() => '#3a1a6a'), '#1a2a8a'];

  const Scene: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
    if (f < from - 1 || f >= to + 6) return null;
    return <AbsoluteFill style={{ opacity: interpolate(f, [to, to + 6], [1, 0], CL) }}>{children}</AbsoluteFill>;
  };

  const Row: React.FC<{ i: number; p: Pick; from: number }> = ({ i, p, from }) => {
    const s = useSpring(from);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(11,10,13,0.72)', borderRadius: 20, padding: '12px 18px', marginTop: i ? 10 : 0, border: '1px solid rgba(255,255,255,0.12)', opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [80, 0]) + 'px)' }}>
        <div style={{ fontFamily: D(), fontSize: 40, color: RED, width: 30 }}>{i + 1}</div>
        <Img src={crest(p.h)} style={{ width: 58, height: 58, objectFit: 'contain', filter: OUTLINE }} />
        <Img src={crest(p.a)} style={{ width: 58, height: 58, objectFit: 'contain', filter: OUTLINE }} />
        <div style={{ fontFamily: D(), fontSize: 42, color: '#fff', flex: 1, whiteSpace: 'nowrap' }}>{p.row ?? p.pill}</div>
        <div style={{ fontFamily: HV(), fontSize: 17, color: 'rgba(255,255,255,0.65)', letterSpacing: 1, whiteSpace: 'nowrap' }}>{p.time} ET</div>
      </div>
    );
  };

  const Card: React.FC<{ from: number }> = ({ from }) => {
    const s = useSpring(from, theme.spring.smooth);
    return (
      <div style={{ position: 'absolute', left: 80, right: 80, top: 640, background: 'linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))', border: '2px solid rgba(255,255,255,0.28)', borderRadius: 34, padding: '24px 24px 20px', boxShadow: '0 30px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.4)', backdropFilter: 'blur(14px)', opacity: Math.min(1, s * 1.4), transform: 'translateY(' + interpolate(s, [0, 1], [120, 0]) + 'px) scale(' + interpolate(s, [0, 1], [0.92, 1]) + ')' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontFamily: D(), fontSize: 54, color: '#fff', letterSpacing: 2 }}>{spec.title[0]} <span style={{ color: RED }}>{spec.title[1]}</span></div>
          <div style={{ fontFamily: HV(), fontSize: 20, color: 'rgba(255,255,255,0.75)', letterSpacing: 2 }}>{spec.tag}</div>
        </div>
        {spec.picks.map((p, i) => <Row key={i} i={i} p={p} from={from + 6 + i * 4} />)}
      </div>
    );
  };

  const FanImg: React.FC<{ r: Ref; side: 'left' | 'right'; glow: string; s: number; b: number }> = ({ r, side, glow, s, b }) => {
    const dx = side === 'left' ? -200 : 200;
    const base: React.CSSProperties = { position: 'absolute', opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [dx, 0]) + 'px) rotate(' + (side === 'left' ? -5 : 5) + 'deg)' };
    if (r.img) return <Img src={pic(r.img)} style={{ ...base, [side]: -110, top: 250 + (side === 'left' ? b : -b), width: 560, filter: 'drop-shadow(0 0 28px ' + glow + ') contrast(1.05)' }} />;
    return <Img src={crest(r.crest!)} style={{ ...base, [side]: 50, top: 320 + (side === 'left' ? b : -b), width: 260, height: 260, objectFit: 'contain', filter: 'drop-shadow(0 0 40px ' + glow + ') drop-shadow(0 20px 30px rgba(0,0,0,0.6))' }} />;
  };
  const Fan: React.FC<{ from: number }> = ({ from }) => {
    const s = useSpring(from, theme.spring.smooth);
    const b = Math.sin(f / 40) * 6;
    const [gl, gr] = spec.fan.glows ?? ['rgba(255,46,77,0.7)', 'rgba(255,210,63,0.6)'];
    const cs = spec.fan.centers;
    return (
      <>
        <FanImg r={spec.fan.left} side='left' glow={gl} s={s} b={b} />
        <FanImg r={spec.fan.right} side='right' glow={gr} s={s} b={b} />
        {cs.map((k, i) => <Img key={k} src={crest(k)} style={{ position: 'absolute', left: cs.length === 1 ? 420 : 350 + i * 200, top: 300 + (i % 2 ? b : -b), width: cs.length === 1 ? 240 : 180, height: cs.length === 1 ? 240 : 180, objectFit: 'contain', opacity: s, filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.35))' }} />)}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 480, height: 200, background: 'linear-gradient(180deg, rgba(11,10,13,0), rgba(11,10,13,0.85))' }} />
      </>
    );
  };

  const Big: React.FC<{ d: Extract<Device, { kind: 'big' }> }> = ({ d }) => {
    const a = at(d.word);
    const s = useSpring(a, theme.spring.slap);
    if (f < a) return null;
    const color = COLORS[d.color ?? 'gold'];
    return (
      <div style={{ position: 'absolute', left: 90, top: d.top ?? 720, display: 'flex', alignItems: 'baseline', gap: 18, opacity: Math.min(1, s * 2), transform: 'scale(' + interpolate(s, [0, 0.6, 1], [1.5, 0.96, 1], CL) + ')', transformOrigin: '0 50%' }}>
        <div style={{ fontFamily: D(), fontSize: 190, lineHeight: 0.9, color, textShadow: '0 0 30px ' + color + '99, 0 8px 0 rgba(0,0,0,0.5)' }}>{d.value}</div>
        <div style={{ fontFamily: HV(), fontSize: 26, letterSpacing: 2, color: '#fff', maxWidth: 270, lineHeight: 1.15 }}>{d.label}</div>
      </div>
    );
  };
  const Chips: React.FC<{ d: Extract<Device, { kind: 'chips' }> }> = ({ d }) => (
    <div style={{ position: 'absolute', left: 90, top: d.top ?? 960, display: 'flex', flexDirection: d.row === false ? 'column' : 'row', flexWrap: 'wrap', gap: 12, maxWidth: 640 }}>
      {d.items.map((c, i) => {
        const a = at(d.word) + i * 4;
        const s = spring({ frame: f - a, fps: FPS, config: theme.spring.slap });
        if (f < a) return null;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(11,10,13,0.88)', border: '3px solid ' + (c.border ?? RED), borderRadius: 14, padding: '10px 18px', fontFamily: D(), fontSize: 46, color: '#fff', transform: 'scale(' + interpolate(s, [0, 1], [0.5, 1]) + ')', opacity: Math.min(1, s * 2), whiteSpace: 'nowrap' }}>
            {c.crest ? <Img src={crest(c.crest)} style={{ width: 48, height: 48, objectFit: 'contain' }} /> : null}
            {c.text}
            {c.tag ? <span style={{ fontFamily: HV(), fontSize: 18, letterSpacing: 2, background: GOLD, color: '#0B0A0D', borderRadius: 6, padding: '4px 8px' }}>{c.tag}</span> : null}
          </div>
        );
      })}
    </div>
  );
  const Form: React.FC<{ d: Extract<Device, { kind: 'form' }> }> = ({ d }) => {
    const a = at(d.word);
    if (f < a) return null;
    return (
      <div style={{ position: 'absolute', left: 90, top: d.top ?? 740, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontFamily: HV(), fontSize: 24, letterSpacing: 3, color: 'rgba(255,255,255,0.8)' }}>{d.label}</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {d.results.map((r, i) => {
            const s = spring({ frame: f - a - i * 2, fps: FPS, config: theme.spring.snappy });
            const bg = r === 'W' || r === '✓' ? GREEN : r === 'D' || r === '–' ? '#8a8a8a' : RED;
            return <div key={i} style={{ width: 62, height: 62, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D(), fontSize: 36, color: '#0B0A0D', transform: 'scale(' + s + ')' }}>{r}</div>;
          })}
        </div>
      </div>
    );
  };

  const Hero: React.FC<{ p: Pick; i: number }> = ({ p, i }) => {
    const from = starts[i];
    const s = useSpring(from, theme.spring.smooth);
    const pa = at(p.pillWord);
    const ps = useSpring(pa, theme.spring.slap);
    const hl = p.claimColor === 'red' ? RED : GOLD;
    return (
      <>
        {p.hero.img ? (
          <Img src={pic(p.hero.img)} style={{ position: 'absolute', right: -170, top: 560, width: 900, opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [260, 0]) + 'px) scale(' + (1 + (f - from) * 0.0006) + ')', transformOrigin: '50% 100%', filter: 'drop-shadow(-16px 0 36px ' + p.hero.glow + ') contrast(1.06)' }} />
        ) : (
          <>
            <div style={{ position: 'absolute', right: -260, top: 600, width: 720, height: 720, borderRadius: '50%', background: 'radial-gradient(circle, ' + p.hero.glow + ' 0%, rgba(0,0,0,0) 65%)', opacity: s }} />
            <Img src={crest(p.hero.crest ?? p.h)} style={{ position: 'absolute', right: -150, top: 680, width: 520, height: 520, objectFit: 'contain', opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [240, 0]) + 'px) rotate(' + (8 - (f - from) * 0.02) + 'deg) scale(' + (1 + (f - from) * 0.0008) + ')', filter: 'drop-shadow(0 0 50px ' + p.hero.glow + ') drop-shadow(0 30px 40px rgba(0,0,0,0.7))' }} />
          </>
        )}
        <div style={{ position: 'absolute', top: 280, left: 90, right: 90, display: 'flex', alignItems: 'center', gap: 14, opacity: s }}>
          <div style={{ background: RED, color: '#fff', fontFamily: HV(), fontSize: 26, letterSpacing: 3, padding: '8px 16px', borderRadius: 8 }}>PICK {i + 1} OF {n}</div>
          <Img src={crest(p.h)} style={{ width: 60, height: 60, objectFit: 'contain', filter: OUTLINE }} />
          <div style={{ fontFamily: D(), fontSize: 30, color: 'rgba(255,255,255,0.6)' }}>V</div>
          <Img src={crest(p.a)} style={{ width: 60, height: 60, objectFit: 'contain', filter: OUTLINE }} />
          <div style={{ fontFamily: HV(), fontSize: 20, color: 'rgba(255,255,255,0.7)', letterSpacing: 2 }}>{p.time} ET</div>
        </div>
        <div style={{ position: 'absolute', top: 360, left: 86, width: 680, fontFamily: D(), fontSize: 96, lineHeight: 0.95, color: '#fff', textShadow: '0 8px 30px rgba(0,0,0,0.8)', transform: 'skewX(-6deg) translateY(' + interpolate(s, [0, 1], [40, 0]) + 'px)', opacity: s }}>
          {p.claim[0]}<br /><span style={{ color: hl }}>{p.claim[1]}</span>{p.claim[2] ? <><br />{p.claim[2]}</> : null}
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 1150, bottom: 0, background: 'linear-gradient(180deg, rgba(11,10,13,0), rgba(11,10,13,0.95) 35%)' }} />
        {p.devices.map((d, k) => d.kind === 'big' ? <Big key={k} d={d} /> : d.kind === 'chips' ? <Chips key={k} d={d} /> : <Form key={k} d={d} />)}
        {f >= pa ? (
          <div style={{ position: 'absolute', left: 90, top: 1120, display: 'flex', alignItems: 'center', background: 'linear-gradient(180deg, ' + GREEN + ', #15803d)', borderRadius: 22, padding: '14px 30px', boxShadow: '0 16px 40px rgba(34,197,94,0.45)', transform: 'scale(' + interpolate(ps, [0, 0.6, 1], [1.6, 0.95, 1], CL) + ') rotate(-2deg)', opacity: Math.min(1, ps * 2) }}>
            <div style={{ fontFamily: D(), fontSize: 72, color: '#0B0A0D', whiteSpace: 'nowrap' }}>{p.pill}</div>
          </div>
        ) : null}
      </>
    );
  };

  const emph = new Set(spec.emph ?? []);
  const Captions: React.FC = () => {
    const t = f / FPS;
    let i = -1;
    for (let k = 0; k < W.length; k++) if (W[k].start <= t + 0.02) i = k;
    if (i < 0 || t > W[i].end + 0.25) return null;
    const w = W[i].word.toUpperCase();
    const s = spring({ frame: f - Math.round(W[i].start * FPS), fps: FPS, config: theme.spring.snappy });
    const em = emph.has(w);
    return (
      <div style={{ position: 'absolute', top: 1330, left: 0, right: 0, textAlign: 'center', fontFamily: em ? D() : HV(), fontSize: em ? 128 : 92, color: '#fff', transform: 'scale(' + interpolate(s, [0, 1], [0.85, 1]) + ')', ...(em ? { backgroundImage: 'linear-gradient(180deg, #FFFFFF 30%, ' + RED + ')', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 18px ' + RED + ')' } : { textShadow: '0 6px 0 rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.6)' }) }}>{w.replace(/[.,?!]$/, '')}</div>
    );
  };

  const hit = (from: number, name: string, vol = 0.4, dur = 1.2) => <Sequence key={name + from} from={Math.max(0, from - 1)} durationInFrames={Math.round(dur * FPS)} layout='none'><Audio src={sfx(name)} volume={vol} /></Sequence>;
  const sounds: React.ReactNode[] = [hit(0, 'bass_impact.MP3', 0.5)];
  let st = 0;
  spec.picks.forEach((p, i) => {
    sounds.push(hit(starts[i], WHOOSH[i % WHOOSH.length]));
    p.devices.forEach((d) => { sounds.push(hit(at(d.word), STAT[st % STAT.length], 0.35, 0.7)); st++; });
    sounds.push(hit(at(p.pillWord), SLAM[i % SLAM.length], 0.45));
  });
  sounds.push(hit(outro, 'title_swoosh.MP3'));
  sounds.push(hit(at(spec.commentWord), 'pop_whoosh.MP3', 0.4));

  const chip = spec.outroChip;
  return (
    <AbsoluteFill style={{ background: '#0B0A0D' }}>
      <Stadium tint={tints[Math.min(tints.length - 1, cur + 1)]} dim={0.15} />
      <Scene from={0} to={starts[0]}>
        <Fan from={-12} />
        <Card from={-14} />
        <div style={{ position: 'absolute', top: 260, left: 0, right: 0, textAlign: 'center', fontFamily: HV(), fontSize: 30, letterSpacing: 6, color: 'rgba(255,255,255,0.85)' }}>NINETY PLUS · RECORD <span style={{ color: GOLD }}>{spec.record}</span></div>
      </Scene>
      {spec.picks.map((p, i) => (
        <Scene key={i} from={starts[i]} to={i + 1 < n ? starts[i + 1] : outro}><Hero p={p} i={i} /></Scene>
      ))}
      <Scene from={outro} to={END + 10}>
        <Fan from={outro} />
        <Card from={outro + 2} />
        {chip && f >= at(chip.word) && f < at(chip.until ?? spec.commentWord) ? (
          <div style={{ position: 'absolute', top: 280, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(11,10,13,0.9)', border: '3px solid ' + GOLD, color: '#fff', fontFamily: D(), fontSize: 50, padding: '8px 24px', borderRadius: 16 }}>{chip.crest ? <Img src={crest(chip.crest)} style={{ width: 56, height: 56, objectFit: 'contain' }} /> : null}{chip.text}{chip.highlight ? <span style={{ color: GOLD }}>{chip.highlight}</span> : null}</div>
          </div>
        ) : null}
        {f >= at(spec.commentWord) ? (
          <div style={{ position: 'absolute', top: 280, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: GOLD, color: '#0B0A0D', fontFamily: D(), fontSize: 64, padding: '10px 30px', borderRadius: 16, boxShadow: '0 14px 40px rgba(255,210,63,0.45)', transform: 'translateY(' + Math.sin(f / 4) * 6 + 'px)', display: 'flex', alignItems: 'center', gap: 16 }}>{spec.commentText ?? 'COMMENT YOUR PICK'} <div style={{ width: 0, height: 0, borderLeft: '18px solid transparent', borderRight: '18px solid transparent', borderTop: '24px solid #0B0A0D' }} /></div>
          </div>
        ) : null}
      </Scene>
      <div style={{ position: 'absolute', top: 205, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 10 }}>
        {spec.picks.map((_, i) => <div key={i} style={{ width: Math.min(90, 360 / n), height: 8, borderRadius: 4, background: i < cur || cur >= n ? RED : i === cur ? RED : 'rgba(255,255,255,0.25)' }} />)}
      </div>
      <Captions />
      <Audio src={staticFile(spec.dir + '/voiceover.wav')} />
      <Audio src={staticFile(spec.dir + '/music/bed.wav')} volume={spec.musicVolume ?? 0.16} />
      {sounds}
    </AbsoluteFill>
  );
};
