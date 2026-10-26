import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { theme, applyBrand } from '../theme';
import { Stadium } from '../mockups/Mockups';
import type { Device } from './CardTemplate';

// One game, one pick: Pick of the Weekend (np-012 look) and big-game specials like El Clásico (np-015 look).
// Gold title mark + matchup on frame 0, two or three crest-hero scenes with stat devices, a slam reveal (1-2 pills),
// then a record and/or banners. A video = src/spotlights/npNNN.ts (SpotlightSpec) + NPNNN.tsx. Gate: tools/card-gate.sh NNN.

export type SpotlightSpec = {
  kind: 'spotlight';
  dir: string;
  words: { duration: number; words: { word: string; start: number; end: number }[] };
  topline: string;                                  // small line above everything, e.g. 'NINETY PLUS · RECORD 21-8'
  mark: { small: string; big: string; seal?: string; stripe?: [string, string] };  // PICK OF THE / WEEKEND / #2
  badge: string;                                    // chip on each scene header, e.g. 'PICK OF THE WEEKEND #2'
  matchup: { h: string; a: string; line: string };  // crest keys + 'SERIE A · SAT 2:45 PM ET'
  scenes: { from: number; crest: string; glow: string; label: string; claim: [string, string, string?]; claimColor?: 'gold' | 'red' | 'sky'; dim?: boolean; devices: Device[] }[];
  reveal: { from: number; pills: { text: string; word: number }[] };
  outro: { from: number; record?: { word: number; label: string; value: string }; banners: { word: number; text: string; highlight?: string; until?: number }[] };
  tints?: string[];
  emph?: string[];
  musicVolume?: number;
};

const RED = '#FF2E4D';
const GOLD = '#FFD23F';
const GREEN = '#22C55E';
const SKY = '#87D8F7';
const FPS = 30;
const COL = { gold: GOLD, red: RED, green: GREEN, sky: SKY };
const D = () => theme.fonts.display;
const HV = () => theme.fonts.heavy;
const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
type Cfg = { damping: number; stiffness: number; mass: number };
const useSpring = (from: number, cfg: Cfg = theme.spring.snappy) => spring({ frame: useCurrentFrame() - from, fps: FPS, config: cfg });

export const spotlightFrames = (s: SpotlightSpec) => Math.ceil(s.words.duration * FPS);

export const SpotlightTemplate: React.FC<{ spec: SpotlightSpec }> = ({ spec }) => {
  applyBrand('ninetyplus');
  const f = useCurrentFrame();
  const W = spec.words.words;
  const at = (i: number) => Math.round(W[i].start * FPS);
  const crest = (k: string) => staticFile(spec.dir + '/logos/' + k + '.png');
  const sfx = (n: string) => staticFile(spec.dir + '/sfx/' + n);
  const END = spotlightFrames(spec);
  const starts = spec.scenes.map((s) => at(s.from));
  const R0 = at(spec.reveal.from);
  const O0 = at(spec.outro.from);
  const tints = spec.tints ?? ['#6a5200', ...spec.scenes.map(() => '#3a2a5a'), '#6a5200', '#6a5200'];
  const idx = f < starts[0] ? 0 : f >= O0 ? spec.scenes.length + 2 : f >= R0 ? spec.scenes.length + 1 : 1 + starts.filter((s) => f >= s).length - 1;
  const reveal0 = at(spec.reveal.pills[0].word);
  const shake = f >= reveal0 && f < reveal0 + 10 ? Math.sin(f * 2.5) * (10 - (f - reveal0)) : 0;

  const Scene: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
    if (f < from - 1 || f >= to + 6) return null;
    return <AbsoluteFill style={{ opacity: interpolate(f, [to, to + 6], [1, 0], CL) }}>{children}</AbsoluteFill>;
  };

  const Mark: React.FC<{ from: number; top: number; scale?: number }> = ({ from, top, scale = 1 }) => {
    const s = useSpring(from, theme.spring.slap);
    const m = spec.mark;
    return (
      <div style={{ position: 'absolute', left: 0, right: 0, top, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'scale(' + scale * interpolate(s, [0, 0.6, 1], [1.4, 0.95, 1], CL) + ')', opacity: Math.min(1, s * 2) }}>
        <div style={{ fontFamily: HV(), fontSize: 40, letterSpacing: 14, color: '#fff' }}>{m.small}</div>
        <div style={{ position: 'relative', fontFamily: D(), fontSize: m.big.length > 8 ? 170 : 190, lineHeight: 0.95, letterSpacing: 4, backgroundImage: 'linear-gradient(180deg, #FFF3B0 0%, ' + GOLD + ' 45%, #D99A00 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 30px rgba(255,210,63,0.55)) drop-shadow(0 10px 0 rgba(0,0,0,0.5))' }}>{m.big}</div>
        {m.stripe ? <div style={{ marginTop: 6, height: 10, width: 640, borderRadius: 5, background: 'linear-gradient(90deg, ' + m.stripe[0] + ' 0%, ' + m.stripe[0] + ' 50%, ' + m.stripe[1] + ' 50%, ' + m.stripe[1] + ' 100%)', transform: 'scaleX(' + interpolate(f - from, [4, 20], [0, 1], CL) + ')' }} /> : null}
        {m.seal ? (
          <div style={{ position: 'absolute', right: 70, top: -40, width: 150, height: 150, borderRadius: '50%', background: RED, border: '6px solid ' + GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(' + (-12 + Math.sin(f / 18) * 6) + 'deg)', boxShadow: '0 0 30px rgba(255,46,77,0.7)' }}>
            <div style={{ fontFamily: D(), fontSize: m.seal.length > 3 ? 56 : 84, color: '#fff' }}>{m.seal}</div>
          </div>
        ) : null}
      </div>
    );
  };

  const Matchup: React.FC<{ from: number; top: number; size?: number }> = ({ from, top, size = 300 }) => {
    const s = useSpring(from, theme.spring.smooth);
    const b = Math.sin(f / 30) * 6;
    return (
      <div style={{ position: 'absolute', left: 0, right: 0, top, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: s }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          <Img src={crest(spec.matchup.h)} style={{ width: size, height: size, objectFit: 'contain', transform: 'translateY(' + b + 'px) translateX(' + interpolate(s, [0, 1], [-160, 0]) + 'px)', filter: 'drop-shadow(0 0 40px rgba(255,255,255,0.35))' }} />
          <div style={{ fontFamily: D(), fontSize: 80, color: 'rgba(255,255,255,0.7)' }}>V</div>
          <Img src={crest(spec.matchup.a)} style={{ width: size, height: size, objectFit: 'contain', transform: 'translateY(' + -b + 'px) translateX(' + interpolate(s, [0, 1], [160, 0]) + 'px)', filter: 'drop-shadow(0 0 40px rgba(255,255,255,0.35))' }} />
        </div>
        <div style={{ fontFamily: HV(), fontSize: 30, letterSpacing: 5, color: 'rgba(255,255,255,0.85)' }}>{spec.matchup.line}</div>
      </div>
    );
  };

  const Big: React.FC<{ d: Extract<Device, { kind: 'big' }> }> = ({ d }) => {
    const a = at(d.word);
    const s = useSpring(a, theme.spring.slap);
    if (f < a) return null;
    const c = COL[d.color ?? 'gold'];
    return (
      <div style={{ position: 'absolute', left: 90, top: d.top ?? 700, display: 'flex', alignItems: 'center', gap: 22, opacity: Math.min(1, s * 2), transform: 'scale(' + interpolate(s, [0, 0.6, 1], [1.5, 0.96, 1], CL) + ')', transformOrigin: '0 50%' }}>
        <div style={{ fontFamily: D(), fontSize: 200, lineHeight: 0.9, color: c, textShadow: '0 0 30px ' + c + '99, 0 8px 0 rgba(0,0,0,0.5)' }}>{d.value}</div>
        <div style={{ fontFamily: HV(), fontSize: 30, letterSpacing: 2, color: '#fff', maxWidth: 300, lineHeight: 1.15 }}>{d.label}</div>
      </div>
    );
  };
  const Form: React.FC<{ d: Extract<Device, { kind: 'form' }> }> = ({ d }) => {
    const a = at(d.word);
    if (f < a) return null;
    return (
      <div style={{ position: 'absolute', left: 90, top: d.top ?? 620, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {d.label ? <div style={{ fontFamily: HV(), fontSize: 24, letterSpacing: 3, color: 'rgba(255,255,255,0.8)' }}>{d.label}</div> : null}
        <div style={{ display: 'flex', gap: 10 }}>
          {d.results.map((r, i) => {
            const s = spring({ frame: f - a - i * 2, fps: FPS, config: theme.spring.snappy });
            const bg = r === 'W' || r === '✓' ? GREEN : r === 'D' || r === '–' ? '#8a8a8a' : RED;
            return <div key={i} style={{ width: 62, height: 62, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D(), fontSize: 38, color: '#0B0A0D', transform: 'scale(' + s + ')' }}>{r}</div>;
          })}
        </div>
      </div>
    );
  };
  const Chips: React.FC<{ d: Extract<Device, { kind: 'chips' }> }> = ({ d }) => (
    <div style={{ position: 'absolute', left: 90, top: d.top ?? 900, display: 'flex', flexDirection: d.row ? 'row' : 'column', gap: 12 }}>
      {d.items.map((c, i) => {
        const a = at(d.word) + i * 4;
        const s = spring({ frame: f - a, fps: FPS, config: theme.spring.slap });
        if (f < a) return null;
        const tc = c.border ?? RED;
        return (
          <div key={i} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(11,10,13,0.88)', border: '3px solid ' + tc, borderRadius: 14, padding: '10px 18px', fontFamily: D(), fontSize: 46, color: '#fff', transform: 'scale(' + interpolate(s, [0, 1], [0.5, 1]) + ')', opacity: Math.min(1, s * 2), whiteSpace: 'nowrap' }}>
            {c.crest ? <Img src={crest(c.crest)} style={{ width: 48, height: 48, objectFit: 'contain' }} /> : null}
            {c.text}
            {c.tag ? <span style={{ fontFamily: HV(), fontSize: 18, letterSpacing: 2, background: tc, color: tc === GOLD ? '#0B0A0D' : '#fff', borderRadius: 6, padding: '4px 8px' }}>{c.tag}</span> : null}
          </div>
        );
      })}
    </div>
  );

  const CrestHero: React.FC<{ i: number }> = ({ i }) => {
    const sc = spec.scenes[i];
    const from = starts[i];
    const s = useSpring(from, theme.spring.smooth);
    const hl = COL[sc.claimColor ?? 'gold'];
    return (
      <>
        <div style={{ position: 'absolute', right: -260, top: 560, width: 760, height: 760, borderRadius: '50%', background: 'radial-gradient(circle, ' + sc.glow + ' 0%, rgba(0,0,0,0) 65%)', opacity: s }} />
        <Img src={crest(sc.crest)} style={{ position: 'absolute', right: -140, top: 640, width: 560, height: 560, objectFit: 'contain', opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [240, 0]) + 'px) rotate(' + (8 - (f - from) * 0.02) + 'deg) scale(' + (1 + (f - from) * 0.0008) + ')', filter: 'drop-shadow(0 0 50px ' + sc.glow + ') drop-shadow(0 30px 40px rgba(0,0,0,0.7))' + (sc.dim ? ' grayscale(0.6) brightness(0.6)' : '') }} />
        <div style={{ position: 'absolute', top: 280, left: 90, right: 90, display: 'flex', alignItems: 'center', gap: 14, opacity: s }}>
          <div style={{ background: GOLD, color: '#0B0A0D', fontFamily: HV(), fontSize: 26, letterSpacing: 3, padding: '8px 16px', borderRadius: 8 }}>{spec.badge}</div>
          <div style={{ fontFamily: HV(), fontSize: 22, color: 'rgba(255,255,255,0.75)', letterSpacing: 3 }}>{sc.label}</div>
        </div>
        <div style={{ position: 'absolute', top: 360, left: 86, width: 680, fontFamily: D(), fontSize: 100, lineHeight: 0.95, color: '#fff', textShadow: '0 8px 30px rgba(0,0,0,0.8)', transform: 'skewX(-6deg) translateY(' + interpolate(s, [0, 1], [40, 0]) + 'px)', opacity: s }}>
          {sc.claim[0]}<br /><span style={{ color: hl }}>{sc.claim[1]}</span>{sc.claim[2] ? <><br />{sc.claim[2]}</> : null}
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 1150, bottom: 0, background: 'linear-gradient(180deg, rgba(11,10,13,0), rgba(11,10,13,0.95) 35%)' }} />
        {sc.devices.map((d, k) => d.kind === 'big' ? <Big key={k} d={d} /> : d.kind === 'form' ? <Form key={k} d={d} /> : <Chips key={k} d={d} />)}
      </>
    );
  };

  const Pill: React.FC<{ text: string; word: number; top: number; first: boolean }> = ({ text, word, top, first }) => {
    const a = at(word);
    const s = useSpring(a, theme.spring.slap);
    if (f < a) return null;
    return (
      <div style={{ position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: 'linear-gradient(180deg, ' + GREEN + ', #15803d)', border: '6px solid ' + GOLD, borderRadius: 26, padding: first ? '18px 44px' : '12px 36px', boxShadow: '0 0 60px rgba(255,210,63,0.6)', transform: 'scale(' + interpolate(s, [0, 0.6, 1], [2, 0.92, 1], CL) + ') rotate(' + (first ? -2 : 2) + 'deg)', opacity: Math.min(1, s * 2) }}>
          <div style={{ fontFamily: D(), fontSize: first ? (text.length > 12 ? 100 : 120) : 84, color: '#0B0A0D', whiteSpace: 'nowrap' }}>{text}</div>
        </div>
      </div>
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
      <div style={{ position: 'absolute', top: 1330, left: 0, right: 0, textAlign: 'center', fontFamily: em ? D() : HV(), fontSize: em ? 128 : 92, color: '#fff', transform: 'scale(' + interpolate(s, [0, 1], [0.85, 1]) + ')', ...(em ? { backgroundImage: 'linear-gradient(180deg, #FFFFFF 30%, ' + GOLD + ')', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 18px rgba(255,210,63,0.8))' } : { textShadow: '0 6px 0 rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.6)' }) }}>{w.replace(/[.,?!]$/, '')}</div>
    );
  };

  const hit = (from: number, name: string, vol = 0.4, dur = 1.2) => <Sequence key={name + from} from={Math.max(0, from - 1)} durationInFrames={Math.round(dur * FPS)} layout='none'><Audio src={sfx(name)} volume={vol} /></Sequence>;
  const STAT = ['pop_whoosh.MP3', 'punch_sound.MP3', 'glitch_sound.MP3', 'magic_reveal.MP3', 'pop_sound.MP3', 'glitch_sound.MP3'];
  const WH = ['whoosh_motion.MP3', 'fast_swoosh.MP3', 'classic_whoosh.MP3'];
  const sounds: React.ReactNode[] = [hit(0, 'cinematic_whoosh_impact.MP3', 0.5)];
  let si = 0;
  spec.scenes.forEach((sc, i) => { sounds.push(hit(starts[i], WH[i % WH.length])); sc.devices.forEach((d) => { sounds.push(hit(at(d.word), STAT[si % STAT.length], 0.35, 0.7)); si++; }); });
  sounds.push(hit(reveal0 - 30, 'riser_sound_4sec.MP3', 0.3, 1));
  spec.reveal.pills.forEach((p, i) => sounds.push(hit(at(p.word), i ? 'bass_impact.MP3' : 'cinematic_whoosh_impact.MP3', 0.5)));
  sounds.push(hit(O0, 'title_swoosh.MP3'));
  if (spec.outro.record) sounds.push(hit(at(spec.outro.record.word), 'bass_impact.MP3', 0.45));
  spec.outro.banners.forEach((b, i) => sounds.push(hit(at(b.word), i ? 'pop_sound.MP3' : 'pop_whoosh.MP3', 0.4, 0.6)));

  return (
    <AbsoluteFill style={{ background: '#0B0A0D' }}>
      <AbsoluteFill style={{ transform: 'translate(' + shake + 'px,' + shake * 0.6 + 'px)' }}>
        <Stadium tint={tints[Math.min(tints.length - 1, idx)]} dim={0.2} />
        <div style={{ position: 'absolute', top: 205, left: 0, right: 0, textAlign: 'center', fontFamily: HV(), fontSize: 26, letterSpacing: 6, color: 'rgba(255,255,255,0.75)' }}>{spec.topline}</div>
        <Scene from={0} to={starts[0]}>
          <Mark from={-10} top={330} />
          <Matchup from={-8} top={720} />
        </Scene>
        {spec.scenes.map((_, i) => <Scene key={i} from={starts[i]} to={i + 1 < starts.length ? starts[i + 1] : R0}><CrestHero i={i} /></Scene>)}
        <Scene from={R0} to={O0}>
          <Matchup from={R0} top={spec.reveal.pills.length > 1 ? 430 : 470} size={260} />
          {spec.reveal.pills.map((p, i) => <Pill key={i} text={p.text} word={p.word} top={(spec.reveal.pills.length > 1 ? 840 : 900) + i * 190} first={i === 0} />)}
        </Scene>
        <Scene from={O0} to={END + 10}>
          <Mark from={O0} top={420} scale={0.8} />
          {spec.outro.record && f >= at(spec.outro.record.word) ? (
            <div style={{ position: 'absolute', left: 0, right: 0, top: 760, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 22 }}>
              <div style={{ fontFamily: HV(), fontSize: 34, letterSpacing: 6, color: '#fff' }}>{spec.outro.record.label}</div>
              <div style={{ fontFamily: D(), fontSize: 200, color: GOLD, textShadow: '0 0 30px rgba(255,210,63,0.6)' }}>{spec.outro.record.value}</div>
            </div>
          ) : !spec.outro.record ? <Matchup from={O0 + 4} top={780} size={220} /> : null}
          {spec.outro.banners.map((b, i) => {
            const next = spec.outro.banners[i + 1];
            const until = b.until ?? (next ? next.word : undefined);
            if (f < at(b.word) || (until !== undefined && f >= at(until))) return null;
            const last = !next;
            return (
              <div key={i} style={{ position: 'absolute', top: 280, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
                <div style={{ background: last ? GOLD : 'rgba(11,10,13,0.9)', border: '4px solid ' + GOLD, color: last ? '#0B0A0D' : '#fff', fontFamily: D(), fontSize: 54, padding: '10px 26px', borderRadius: 16, boxShadow: last ? '0 14px 40px rgba(255,210,63,0.45)' : undefined, transform: last ? 'translateY(' + Math.sin(f / 4) * 6 + 'px)' : undefined }}>
                  {b.text}{b.highlight ? <span style={{ color: last ? RED : GOLD }}> {b.highlight}</span> : null}
                </div>
              </div>
            );
          })}
        </Scene>
        <Captions />
      </AbsoluteFill>
      <Audio src={staticFile(spec.dir + '/voiceover.wav')} />
      <Audio src={staticFile(spec.dir + '/music/bed.wav')} volume={spec.musicVolume ?? 0.16} />
      {sounds}
    </AbsoluteFill>
  );
};
