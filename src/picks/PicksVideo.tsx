import React from 'react';
import { AbsoluteFill, Audio, Img, Loop, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, random, spring } from 'remotion';
import { Trail } from '@remotion/motion-blur';
import { theme, teamColors, SAFE, SAFE_H, SAFE_W, SAFE_CY, applyBrand } from '../theme';
import type { PicksEdit, Popup, LadderSpec, NewsCardSpec, SplitCardSpec, StrikeCardSpec, TextStampSpec } from './types';

// ---------------------------------------------------------------------------------------------------------------------
// Generic picks-video template. Everything video-specific lives in a PicksEdit (src/edits/videoNNN.ts). Rules implemented:
// vault "Best Practices/Video-002 Visual System" (rules 1-7) + "remotion-motion-graphics" skill (springs, stagger, exits, grain).
// ---------------------------------------------------------------------------------------------------------------------
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const LAYER: React.CSSProperties = { position: 'absolute', top: 0, left: 0, width: 1080, height: 1920, overflow: 'hidden' };
const fitFont = (text: string, max: number, width: number, pad = 0, em = 0.52) => Math.min(max, Math.floor((width - pad) / (Math.max(1, text.length) * em)));

type TType = 'glitch' | 'fade' | 'zoom' | 'whip';
const TYPES: TType[] = ['glitch', 'fade', 'zoom', 'whip'];
const CUT_SFX: Record<TType, { file: string; lead: number; dur: number; vol: number }> = {
  glitch: { file: 'glitch_sound.MP3', lead: 3, dur: 0.7, vol: 0.32 },
  fade: { file: 'classic_whoosh.MP3', lead: 2, dur: 0.5, vol: 0.35 },
  zoom: { file: 'bass_impact.MP3', lead: 0, dur: 1.2, vol: 0.28 },
  whip: { file: 'fast_swoosh.MP3', lead: 4, dur: 1.0, vol: 0.35 },
};
const T = 8; // transition frames

// Derived timeline (pure function of the edit; computed once per render process).
const buildTimeline = (e: PicksEdit) => {
  const sec = (s: number) => Math.round(s * e.fps);
  const wStart = (i: number) => (i >= e.words.length ? TOTAL : sec(e.words[i].start));
  const TOTAL = sec(e.endSec);
  const shotFrame = (i: number) => (i < e.shots.length ? Math.max(0, wStart(e.shots[i].word) + sec(e.shots[i].offset ?? 0)) : TOTAL);
  const faceCuts = new Set(e.shots.map((s, i) => (i > 0 && s.shot === 'face' ? shotFrame(i) : -1)).filter((x) => x >= 0));
  const faceShots = e.shots.map((s, i) => ({ ...s, from: shotFrame(i), to: shotFrame(i + 1) })).filter((s) => s.shot === 'face');
  const snapToWord = (target: number, lo: number, hi: number) => {
    let best = -1, bestScore = Infinity;
    for (let i = 1; i < e.words.length; i++) {
      const s = wStart(i); if (s <= lo || s >= hi) continue;
      const bonus = /[.,!?]$/.test(e.words[i - 1].word) ? sec(0.6) : 0;
      const score = Math.abs(s - target) - bonus;
      if (score < bestScore) { bestScore = score; best = s; }
    }
    return best;
  };
  const chunks: { from: number; to: number; clip: string; leg: string }[] = [];
  e.shots.forEach((s, i) => {
    if (s.shot !== 'footage') return;
    const a = shotFrame(i), b = shotFrame(i + 1);
    e.legs.forEach((leg) => {
      if (!leg.clips.length) return; // SGP partner legs share the block's footage via the leg that carries the clips
      const la = Math.max(a, sec(leg.start)), lb = Math.min(b, sec(leg.end));
      if (lb - la <= 0) return;
      const n = Math.min(leg.clips.length, Math.max(1, Math.round((lb - la) / sec(4)))); // never restart the same clip to fake variety
      const bounds = [la];
      for (let k = 1; k < n; k++) { const t = snapToWord(la + (k * (lb - la)) / n, bounds[bounds.length - 1] + sec(1.2), lb - sec(1.2)); if (t > 0) bounds.push(t); }
      bounds.push(lb);
      for (let k = 0; k < bounds.length - 1; k++) chunks.push({ from: bounds[k], to: bounds[k + 1], clip: leg.clips[k % leg.clips.length], leg: leg.name });
    });
  });
  const cuts = Array.from(new Set([...e.shots.slice(1).map((_, i) => shotFrame(i + 1)), ...chunks.map((c) => c.from)])).filter((c) => c > 0).sort((x, y) => x - y);
  const cutType = new Map<number, TType>(cuts.map((c, i) => [c, TYPES[i % TYPES.length]]));
  const typeAt = (c: number): TType => cutType.get(c) ?? 'fade';
  const glitchCuts = cuts.filter((c) => typeAt(c) === 'glitch');
  const glitchFaceCuts = glitchCuts.filter((c) => faceCuts.has(c));
  const hookEnd = wStart(e.hook.endWord);
  return { sec, wStart, TOTAL, faceCuts, faceShots, chunks, cuts, typeAt, glitchCuts, glitchFaceCuts, hookEnd };
};
type Timeline = ReturnType<typeof buildTimeline>;
const cache = new Map<string, Timeline>();
const timelineFor = (e: PicksEdit) => { let t = cache.get(e.id); if (!t) { t = buildTimeline(e); cache.set(e.id, t); } return t; };

// ---------------------------------------------------------------------------------------------------------------------
// Transitions (footage layers only; the facecam is the always-mounted base).
const prog = (f: number, at: number) => interpolate(f, [at, at + T], [0, 1], CLAMP);
const jitter = (f: number, amt: number) => 'translateX(' + ((f % 2 === 0 ? 1 : -1) * amt).toFixed(1) + 'px)';
const fxIn = (type: TType, p: number, f: number): React.CSSProperties => {
  if (type === 'fade') return { opacity: interpolate(p, [0, 1], [0, 1], { easing: theme.ease.out }) };
  if (type === 'zoom') return { transform: 'scale(' + interpolate(p, [0, 1], [1.12, 1], { easing: theme.ease.out }).toFixed(3) + ')', filter: 'blur(' + interpolate(p, [0, 1], [10, 0]).toFixed(1) + 'px)' };
  if (type === 'whip') return { transform: 'translateX(' + interpolate(p, [0, 1], [45, 0], { easing: theme.ease.out }).toFixed(1) + '%)', filter: 'blur(' + interpolate(p, [0, 0.5, 1], [0, 6, 0]).toFixed(1) + 'px)' };
  const g = 1 - p; return { transform: jitter(f, 10 * g), filter: 'saturate(' + (1 + 0.4 * g).toFixed(2) + ') contrast(' + (1 + 0.25 * g).toFixed(2) + ')' };
};
const fxOut = (type: TType, p: number): React.CSSProperties => {
  if (type === 'fade') return { opacity: interpolate(p, [0, 1], [1, 0], { easing: theme.ease.in }) };
  if (type === 'zoom') return { transform: 'scale(' + interpolate(p, [0, 1], [1, 1.1]).toFixed(3) + ')', filter: 'blur(' + interpolate(p, [0, 1], [0, 8]).toFixed(1) + 'px)', opacity: interpolate(p, [0, 0.5, 1], [1, 1, 0]) };
  if (type === 'whip') return { transform: 'translateX(' + interpolate(p, [0, 1], [0, -45], { easing: theme.ease.in }).toFixed(1) + '%)', filter: 'blur(' + interpolate(p, [0, 0.5, 1], [0, 6, 0]).toFixed(1) + 'px)', opacity: interpolate(p, [0.7, 1], [1, 0], CLAMP) };
  return { opacity: 0 };
};
const glitchAmount = (f: number, cuts: number[]) => { let g = 0; for (const c of cuts) if (f >= c && f < c + T) g = Math.max(g, 1 - (f - c) / T); return g; };
const GlitchBars: React.FC<{ f: number; g: number }> = ({ f, g }) => (g <= 0 ? null : (
  <>
    {Array.from({ length: 3 }, (_, i) => {
      const top = Math.round(random('gb-' + f + '-' + i) * 1900), h = Math.round(4 + random('gh-' + f + '-' + i) * 26);
      return <div key={i} style={{ position: 'absolute', left: 0, width: 1080, top, height: h, zIndex: 3, background: '#fff', mixBlendMode: 'difference', opacity: 0.45 * g }} />;
    })}
  </>
));

// ---------------------------------------------------------------------------------------------------------------------
// Texture layers (skill rule 5): grade -> grain -> vignette on top of the image, below type.
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
const Grain: React.FC<{ f: number }> = ({ f }) => <div style={{ ...LAYER, zIndex: 4, pointerEvents: 'none', backgroundImage: GRAIN, backgroundSize: '220px', backgroundPosition: ((f * 7) % 220) + 'px ' + ((f * 13) % 220) + 'px', opacity: 0.07, mixBlendMode: 'overlay' }} />;
const Vignette: React.FC = () => <div style={{ ...LAYER, zIndex: 4, pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.26) 100%)' }} />;

// ---------------------------------------------------------------------------------------------------------------------
// Popup: transparent cut-out slapped in with a spring (overshoot + squash), motion-blur trail on the entrance, staggered
// team-colour label, idle breathing while up, whip-out exit faster than the entrance.
const PopCard: React.FC<{ p: Popup; dur: number; base: string; fps: number; shift?: number; markAt?: number }> = ({ p, dur, base, fps, shift = 0, markAt }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f, fps, config: theme.spring.slap });
  const sl = spring({ frame: f - 4, fps, config: theme.spring.snappy });
  const left = p.x ?? (1080 - p.w) / 2 + shift;
  const fromRight = left + p.w / 2 > 540;
  const labelH = 64;
  const top = p.y === 'top' ? SAFE.top + 10 : SAFE_CY - (p.h + labelH) / 2;
  // entrance: rise + scale + rotate settle, squash on landing
  const rise = interpolate(s, [0, 1], [70, 0]);
  const rot = interpolate(s, [0, 1], [fromRight ? 10 : -10, 0]);
  const sx = interpolate(s, [0, 0.75, 1], [0.86, 1.06, 1], CLAMP);
  const sy = interpolate(s, [0, 0.75, 1], [1.14, 0.95, 1], CLAMP);
  // idle breathing after landing
  const breathe = f > 12 ? 1 + Math.sin(f / 22) * 0.012 : 1;
  const float = f > 12 ? Math.sin(f / 30) * 3 : 0;
  // exit: whip away from the frame centre, faster than the entrance
  const ex = interpolate(f, [dur - 9, dur - 1], [0, 1], { ...CLAMP, easing: theme.ease.in });
  const exitX = ex * (fromRight ? 160 : -160);
  const exitO = 1 - ex;
  const exitBlur = ex * 8;
  const [c1, c2] = teamColors(p.team);
  const fontSize = p.w >= 500 ? 44 : p.w >= 340 ? 34 : 27;
  const body = (
    <div style={{ position: 'absolute', left, top, width: p.w, zIndex: 7, opacity: Math.min(s * 1.6, 1) * exitO, transform: 'translate(' + exitX.toFixed(1) + 'px, ' + (rise + float).toFixed(1) + 'px) rotate(' + rot.toFixed(2) + 'deg) scale(' + (sx * breathe).toFixed(4) + ', ' + (sy * breathe).toFixed(4) + ')', transformOrigin: '50% 100%', filter: exitBlur > 0.2 ? 'blur(' + exitBlur.toFixed(1) + 'px)' : undefined, textAlign: 'center' }}>
      <div style={{ position: 'relative', width: p.w, height: p.h }}>
      <Img src={staticFile(base + '/popups/' + p.src)} style={{ width: p.w, height: p.h, maxWidth: 'none', objectFit: 'contain', display: 'block', filter: (p.blur ? 'blur(' + p.blur + 'px) ' : '') + 'drop-shadow(0 18px 26px rgba(0,0,0,0.65)) drop-shadow(0 0 2px rgba(255,255,255,0.35))' }} />
      {p.mark && markAt !== undefined && f >= markAt ? (() => { const r = p.mark.r ?? 50; const C = 2 * Math.PI * r; const d = interpolate(f, [markAt, markAt + 10], [C, 0], { ...CLAMP, easing: theme.ease.out }); const ls = spring({ frame: f - markAt - 6, fps, config: theme.spring.slap }); return (<>
        <svg width={p.w} height={p.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>{p.mark.rx ? <ellipse cx={p.mark.x} cy={p.mark.y} rx={p.mark.rx} ry={p.mark.ry ?? r} pathLength={100} fill='none' stroke={theme.colors.gold} strokeWidth={6} strokeLinecap='round' strokeDasharray={100} strokeDashoffset={interpolate(f, [markAt, markAt + 10], [100, 0], { ...CLAMP, easing: theme.ease.out })} transform={'rotate(-8 ' + p.mark.x + ' ' + p.mark.y + ')'} style={{ filter: 'drop-shadow(0 0 8px rgba(255,214,0,0.8))' }} /> : <circle cx={p.mark.x} cy={p.mark.y} r={r} fill='none' stroke={theme.colors.gold} strokeWidth={7} strokeLinecap='round' strokeDasharray={C} strokeDashoffset={d} transform={'rotate(-90 ' + p.mark.x + ' ' + p.mark.y + ')'} style={{ filter: 'drop-shadow(0 0 8px rgba(255,214,0,0.8))' }} />}</svg>
        {p.mark.label ? <div style={{ position: 'absolute', left: p.mark.x + (p.mark.rx ?? r) * 0.6, top: p.mark.y - (p.mark.ry ?? r) - 46, opacity: Math.min(ls * 1.5, 1), transform: 'scale(' + interpolate(ls, [0, 1], [0.4, 1]).toFixed(3) + ') rotate(-4deg)', background: theme.colors.gold, color: theme.colors.ink, fontFamily: theme.fonts.display, fontSize: 34, letterSpacing: 1, padding: '6px 14px 3px', borderRadius: 10, whiteSpace: 'nowrap', boxShadow: '0 8px 18px rgba(0,0,0,0.5)' }}>{p.mark.label}</div> : null}
      </>); })() : null}
      </div>
      <div style={{ display: 'inline-block', marginTop: -8, opacity: sl, transform: 'translateY(' + interpolate(sl, [0, 1], [18, 0]).toFixed(1) + 'px) scale(' + interpolate(sl, [0, 1], [0.8, 1]).toFixed(3) + ')', background: c1, color: '#fff', borderBottom: '5px solid ' + c2, borderRadius: 10, padding: '6px 18px 4px', fontSize, fontFamily: theme.fonts.display, letterSpacing: 1.5, whiteSpace: 'nowrap', boxShadow: '0 8px 18px rgba(0,0,0,0.5)' }}>{p.label}</div>
    </div>
  );
  // Trail only during the fast part of the entrance (first 8 frames); afterwards render once (cheaper, no ghosting on idle).
  return f < 8 ? <Trail layers={4} lagInFrames={0.5} trailOpacity={0.55}>{body}</Trail> : body;
};

// ---------------------------------------------------------------------------------------------------------------------
// Reveal (rule 3): logo or headshot in the hero ring, name, line; centred; spring in; exits faster than it entered.
const Reveal: React.FC<{ images: string[]; cover: boolean; label: string; line: string; odds?: string; dur: number; fps: number; shift?: number }> = ({ images, cover, label, line, odds, dur, fps, shift = 0 }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f, fps, config: theme.spring.bouncy });
  const st = spring({ frame: f - 4, fps, config: theme.spring.snappy });
  const so = spring({ frame: f - 8, fps, config: theme.spring.slap });
  const ex = interpolate(f, [dur - 9, dur - 1], [0, 1], { ...CLAMP, easing: theme.ease.in });
  const nameSize = fitFont(label, 84, 780, 0, 0.5);
  const ring = images.length > 1 ? 200 : 230;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', zIndex: 8, transform: shift ? 'translateX(' + shift + 'px)' : undefined }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: Math.min(s * 1.5, 1) * (1 - ex), transform: 'translateY(' + (interpolate(s, [0, 1], [40, 0]) - ex * 40).toFixed(1) + 'px) scale(' + interpolate(s, [0, 1], [0.8, 1]).toFixed(3) + ')', background: theme.colors.panel, borderRadius: 30, padding: '26px 56px 24px', boxShadow: '0 12px 32px rgba(0,0,0,0.6)' }}>
        <div style={{ display: 'flex', gap: 22 }}>
          {images.map((img, i) => {
            const si = spring({ frame: f - i * 4, fps, config: theme.spring.bouncy }); // second ring lands 4 frames later
            return (
              <div key={i} style={{ width: ring, height: ring, borderRadius: '50%', boxSizing: 'border-box', border: '7px solid ' + theme.colors.primary, background: theme.colors.ink, boxShadow: '0 0 60px ' + theme.colors.glow + ', 0 0 22px ' + theme.colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', transform: 'scale(' + interpolate(si, [0, 1], [0.4, 1]).toFixed(3) + ')' }}>
                <Img src={staticFile(img)} style={cover ? { width: '100%', height: '100%', maxWidth: 'none', objectFit: 'cover' } : { width: ring * 0.7, height: ring * 0.7, maxWidth: 'none', objectFit: 'contain' }} />
              </div>
            );
          })}
        </div>
        <div style={{ opacity: st, transform: 'translateY(' + interpolate(st, [0, 1], [18, 0]).toFixed(1) + 'px)', textAlign: 'center', marginTop: 18 }}>
          <div style={{ color: theme.colors.text, fontSize: nameSize, fontFamily: theme.fonts.display, lineHeight: 1, letterSpacing: 1, whiteSpace: 'nowrap' }}>{label}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 8 }}>
            <div style={{ color: theme.colors.primary, fontSize: 62, fontFamily: theme.fonts.display, lineHeight: 1, letterSpacing: 2 }}>{line}</div>
            {odds ? <div style={{ opacity: Math.min(so * 1.5, 1), transform: 'scale(' + interpolate(so, [0, 1], [0.5, 1]).toFixed(3) + ') rotate(' + interpolate(so, [0, 1], [-8, -3]).toFixed(1) + 'deg)', background: theme.colors.gold, color: theme.colors.ink, fontSize: 44, fontFamily: theme.fonts.display, lineHeight: 1, padding: '8px 14px 6px', borderRadius: 10, letterSpacing: 1 }}>{odds}</div> : null}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
// Reaction pop (Video-001 meme pattern): emoji/sticker slaps in on a trigger word with its own sound, breathes, whips out.

// Video-039: a row of headshots along the bottom that fills in as he names players. Each face springs up from below
// and sits overlapping the previous one, so the group reads as one lineup rather than separate pop-ups.
const FaceRow: React.FC<{ images: string[]; starts: number[]; size: number; y: number; fps: number }> = ({ images, starts, size, y, fps }) => {
  const f = useCurrentFrame();
  const step = size * 0.68;
  const total = size + step * (images.length - 1);
  // centred on 600, not 540: the progress rail owns the left edge and a face may never sit on top of it
  const x0 = Math.max(200, 600 - total / 2);
  return (
    <AbsoluteFill style={LAYER}>
      {images.map((im, i) => {
        const local = f - starts[i];
        if (local < -1) return null;
        const p = spring({ frame: Math.max(0, local), fps, config: { damping: 16, mass: 0.7 } });
        const rise = interpolate(p, [0, 1], [size * 0.55, 0]);
        return (
          <div key={im + i} style={{ position: 'absolute', left: x0 + i * step, top: y + rise, width: size, height: size, opacity: Math.min(1, p * 1.6), zIndex: 10 + i }}>
            <Img src={staticFile(im)} style={{ width: size, height: size, objectFit: 'cover', objectPosition: 'top center', borderRadius: 18, filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.6))', WebkitMaskImage: 'linear-gradient(to bottom, #000 82%, transparent 100%)', maskImage: 'linear-gradient(to bottom, #000 82%, transparent 100%)', transform: `scale(${interpolate(p, [0, 1], [0.86, 1], CLAMP)})`, transformOrigin: 'bottom center' }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
const MemePop: React.FC<{ image: string; size: number; dur: number; fps: number; x?: number; y?: number; drive?: 'ltr' | 'rtl'; w?: number; shift?: number }> = ({ image, size, dur, fps, x, y, drive, w, shift = 0 }) => {
  const f = useCurrentFrame();
  if (drive) {
    // drive-through: in from one edge fast, brake at the centre (nose dips), hold, peel out the other side with a lean
    const W = w ?? size, dir = drive === 'ltr' ? 1 : -1;
    const inEnd = Math.round(dur * 0.32), outStart = Math.round(dur * 0.68);
    const cx = f < inEnd ? interpolate(f, [0, inEnd], [-dir * (W + 100), 0], { ...CLAMP, easing: theme.ease.out }) : f < outStart ? 0 : interpolate(f, [outStart, dur - 1], [0, dir * (W + 1180)], { ...CLAMP, easing: theme.ease.in });
    const brake = f >= inEnd && f < inEnd + 8 ? Math.sin(((f - inEnd) / 8) * Math.PI) * 3 : 0;
    const lean = f >= outStart ? -dir * interpolate(f, [outStart, outStart + 6], [0, 6], CLAMP) : 0;
    const bob = Math.sin(f / 2.2) * 1.5;
    const top = y ?? SAFE_CY - size / 2 + 120;
    return (
      <div style={{ position: 'absolute', left: (1080 - W) / 2 + cx, top: top + bob, width: W, height: size, zIndex: 7, transform: 'rotate(' + (brake * dir + lean).toFixed(2) + 'deg) scaleX(' + (dir) + ')', transformOrigin: '50% 90%', filter: 'drop-shadow(0 26px 30px rgba(0,0,0,0.6))' }}>
        <Img src={staticFile(image)} style={{ width: W, height: size, maxWidth: 'none', objectFit: 'contain', display: 'block' }} />
      </div>
    );
  }
  const s = spring({ frame: f, fps, config: theme.spring.slap });
  const ex = interpolate(f, [dur - 8, dur - 1], [0, 1], { ...CLAMP, easing: theme.ease.in });
  const left = x ?? (1080 - size) / 2 + shift, top = y ?? SAFE_CY - size / 2;
  return (
    <div style={{ position: 'absolute', left, top, width: size, height: size, zIndex: 7, opacity: Math.min(s * 1.6, 1) * (1 - ex), transform: 'translateY(' + (interpolate(s, [0, 1], [50, 0]) + (f > 10 ? Math.sin(f / 9) * 3 : 0)).toFixed(1) + 'px) rotate(' + (interpolate(s, [0, 1], [-18, 0]) + ex * 12).toFixed(1) + 'deg) scale(' + (interpolate(s, [0, 1], [0.3, 1]) * (1 - ex * 0.3)).toFixed(3) + ')', filter: 'drop-shadow(0 12px 22px rgba(0,0,0,0.55))' }}>
      <Img src={staticFile(image)} style={{ width: size, height: size, maxWidth: 'none', objectFit: 'contain', display: 'block' }} />
    </div>
  );
};

// Hook typography (rule 5): one phrase at a time in the band above the head; words spring in on their timestamps.
const HookText: React.FC<{ e: PicksEdit; f: number }> = ({ e, f }) => {
  const tl = timelineFor(e);
  if (f >= tl.hookEnd) return null;
  const idx = e.hook.phrases.reduce((acc, p, i) => (f >= tl.wStart(p.words[0]) ? i : acc), -1);
  if (idx < 0) return null;
  const phrase = e.hook.phrases[idx];
  const text = phrase.words.map((i) => e.words[i].word).join(' ');
  const fontSize = fitFont(text, 120, SAFE_W, 0, 0.5);
  return (
    <AbsoluteFill style={{ alignItems: 'center', paddingTop: SAFE.top + 20, zIndex: 9 }}>
      <div style={{ display: 'flex', justifyContent: 'center', columnGap: 24, width: SAFE_W }}>
        {phrase.words.map((i) => {
          const st = tl.wStart(i); if (f < st) return null;
          const s = spring({ frame: f - st, fps: e.fps, config: theme.spring.snappy });
          return <span key={i} style={{ display: 'inline-block', opacity: Math.min(s * 1.5, 1), transform: 'translateY(' + interpolate(s, [0, 1], [30, 0]).toFixed(1) + 'px) scale(' + interpolate(s, [0, 1], [0.7, 1]).toFixed(3) + ')', color: phrase.accent ? theme.colors.primary : theme.colors.text, fontSize, fontFamily: theme.fonts.display, lineHeight: 1.05, textShadow: theme.outline, letterSpacing: 1, whiteSpace: 'nowrap' }}>{e.words[i].word.toUpperCase()}</span>;
        })}
      </div>
    </AbsoluteFill>
  );
};

// Chat hook (Video-005): the hook as an iMessage thread. Bubbles land on their word; sent bubbles type in word by word.
const ChatHook: React.FC<{ e: PicksEdit; f: number }> = ({ e, f }) => {
  const tl = timelineFor(e);
  const chat = e.hook.chat;
  if (!chat || f >= tl.hookEnd) return null;
  const live = chat.bubbles.filter((b) => f >= tl.wStart(b.word));
  if (!live.length) return null;
  const cardS = spring({ frame: f - tl.wStart(chat.bubbles[0].word), fps: e.fps, config: theme.spring.smooth });
  return (
    <AbsoluteFill style={{ alignItems: 'center', paddingTop: SAFE.top + 10, zIndex: 9 }}>
      <div style={{ width: 860, background: 'rgba(18,18,22,0.94)', borderRadius: 34, border: '2px solid rgba(255,255,255,0.14)', boxShadow: '0 24px 60px rgba(0,0,0,0.6)', overflow: 'hidden', opacity: Math.min(cardS * 1.5, 1), transform: 'translateY(' + interpolate(cardS, [0, 1], [-40, 0]).toFixed(1) + 'px) scale(' + interpolate(cardS, [0, 1], [0.92, 1]).toFixed(3) + ')' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 28px', background: 'rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(180deg,#9aa0ad,#5e6472)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: theme.fonts.display, fontSize: 34, color: '#fff' }}>{chat.to.slice(0, 1)}</div>
          <div style={{ fontFamily: theme.fonts.display, fontSize: 40, color: '#fff', letterSpacing: 1 }}>{chat.to.toUpperCase()}</div>
          <div style={{ marginLeft: 'auto', fontFamily: theme.fonts.display, fontSize: 26, color: 'rgba(255,255,255,0.5)', letterSpacing: 2 }}>iMESSAGE</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '22px 26px 26px' }}>
          {live.map((b, i) => {
            const at = tl.wStart(b.word);
            const s = spring({ frame: f - at, fps: e.fps, config: theme.spring.slap });
            const me = b.from === 'me';
            const text = b.text ?? (b.words ?? []).filter((w) => f >= tl.wStart(w)).map((w) => e.words[w].word).join(' ');
            return (
              <div key={i} style={{ alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: 700, background: me ? '#0A84FF' : '#3A3A3C', color: '#fff', borderRadius: 30, padding: '14px 26px 12px', fontFamily: theme.fonts.display, fontSize: 46, lineHeight: 1.12, letterSpacing: 0.5, opacity: Math.min(s * 1.5, 1), transform: 'translateY(' + interpolate(s, [0, 1], [26, 0]).toFixed(1) + 'px) scale(' + interpolate(s, [0, 1], [0.85, 1]).toFixed(3) + ')', transformOrigin: me ? '100% 100%' : '0% 100%', boxShadow: '0 8px 20px rgba(0,0,0,0.35)' }}>{text || '...'}</div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Lineup hook (Video-009): the five props fire in as headshot chips (one every few frames, shutter each), a time tag pops,
// then a red rotated stamp slams across all of them on the trigger word with a frame shake. Faces + names stay BLURRED in the hook
// (owner 2026-09-12: suspense, do not give the five away); the ending hero shows them sharp.
// Video-032: the mystery matchup cards. Two cards land blacked-out behind a "?", then each flips open (rotateY)
// on the word where he names that game. Word-anchored, so nothing is on screen the voice is not talking about.
const MysteryGames: React.FC<{ e: PicksEdit; f: number }> = ({ e, f }) => {
  const M = e.mysteryGames; if (!M) return null;
  const tl = timelineFor(e);
  const from = tl.wStart(M.word), to = tl.wStart(M.untilWord);
  if (f < from || f >= to) return null;
  const s = spring({ frame: f - from, fps: e.fps, config: theme.spring.slap });
  const ex = interpolate(f, [to - 8, to - 1], [0, 1], CLAMP);
  const one = M.games.length === 1;
  // 4+ games wrap into a centred grid - a flat row of 5 runs off both edges (Video-039, the 5-team slip)
  const many = M.games.length >= 4;
  // 3 games: narrower cards, or the row (3 x 420 + gaps) runs off both edges of the 1080 frame (NP003)
  const three = M.games.length === 3;
  const CW = one ? 620 : many ? 300 : three ? 316 : 420, CH = one ? 400 : many ? 212 : three ? 250 : 300;
  return (
    <div style={{ position: 'absolute', left: many ? 60 : (1080 - (CW * M.games.length + 28 * (M.games.length - 1))) / 2, top: SAFE.top + (many ? 90 : 150), width: many ? 960 : CW * M.games.length + 28 * (M.games.length - 1), display: 'flex', flexWrap: many ? 'wrap' : 'nowrap', justifyContent: 'center', gap: many ? 18 : 28, zIndex: 9, opacity: Math.min(s * 1.6, 1) * (1 - ex), transform: 'translateY(' + (interpolate(s, [0, 1], [-70, 0]) - ex * 40).toFixed(1) + 'px)' }}>
      {M.games.map((g, i) => {
        const at = from + i * 5;
        const si = spring({ frame: Math.max(0, f - at), fps: e.fps, config: theme.spring.slap });
        const flipAt = g.flipWord !== undefined ? tl.wStart(g.flipWord) : -1;
        const fl = flipAt >= 0 ? spring({ frame: Math.max(0, f - flipAt), fps: e.fps, config: theme.spring.smooth }) : 0;
        const open = flipAt >= 0 && f >= flipAt;
        const rot = open ? interpolate(fl, [0, 1], [180, 360]) : 180;
        const showFront = open && fl > 0.5;
        const [c1, c2] = teamColors(g.team);
        return (
          <div key={i} style={{ width: CW, height: CH, perspective: 1200, opacity: Math.min(si * 1.6, 1), transform: 'scale(' + interpolate(si, [0, 0.7, 1], [0.6, 1.06, 1], CLAMP).toFixed(3) + ')' }}>
            <div style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', transform: 'rotateY(' + rot.toFixed(1) + 'deg)' }}>
              <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'linear-gradient(160deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0) 62%), linear-gradient(150deg, #3a4a6b 0%, #1e2940 100%)', borderRadius: 24, border: '3px solid rgba(255,255,255,0.45)', boxShadow: '0 22px 50px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: showFront ? 0 : 1 }}>
                <div style={{ fontFamily: theme.fonts.display, fontSize: many || three ? 120 : 190, color: 'rgba(255,255,255,0.9)', lineHeight: 1, textShadow: '0 0 30px rgba(0,0,0,0.8)' }}>?</div>
              </div>
              <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', background: 'linear-gradient(160deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.10) 38%, rgba(255,255,255,0) 60%), radial-gradient(ellipse 80% 70% at 50% 35%, rgba(255,255,255,0.35), rgba(255,255,255,0) 70%), linear-gradient(135deg,' + c1 + ' 0%, #3d6fd6 55%, ' + c2 + ' 140%)', borderRadius: 24, border: '4px solid rgba(255,255,255,0.85)', boxShadow: '0 22px 50px rgba(0,0,0,0.65)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: showFront ? 1 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: many ? 14 : 26 }}>
                  <Img src={staticFile(g.home)} style={{ width: one ? 170 : many || three ? 86 : 118, height: one ? 170 : many || three ? 86 : 118, filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.45))', maxWidth: 'none', objectFit: 'contain' }} />
                  {/* soccer order: home v away (Ninety Plus); was the NFL 'away AT home' */}
                  <div style={{ fontFamily: theme.fonts.display, fontSize: many || three ? 26 : 40, color: 'rgba(255,255,255,0.8)' }}>V</div>
                  <Img src={staticFile(g.away)} style={{ width: one ? 170 : many || three ? 86 : 118, height: one ? 170 : many || three ? 86 : 118, filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.45))', maxWidth: 'none', objectFit: 'contain' }} />
                </div>
                <div style={{ fontFamily: theme.fonts.display, fontSize: many || three ? 21 : 30, color: '#fff', letterSpacing: many || three ? 1 : 3, whiteSpace: 'nowrap' }}>{g.label}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Video-032, REUSABLE: the promo-code lockup. Sponsor logos slide in, the code chip slams with a light sweep and
// the letters stagger up. Every code the owner has is ROCKETT, so this is built once and reused every video.
// Video-034 REUSABLE: CodeBlast. The promo code is the biggest thing on screen for the whole sponsor block (the
// owner's FFAZ reference): USE CODE / ROCKETT giant at the top, the three book tiles pop on the words that name them,
// an optional banner (the reason to use it) lands on its word, the amounts drop under the tiles on amountWord, and the
// code re-slams with a light sweep on slamWord (when he actually says the code).
const CodeBlast: React.FC<{ c: NonNullable<PicksEdit['codeBlast']>; dur: number; fps: number; at: (w: number) => number }> = ({ c, dur, fps, at }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f, fps, config: theme.spring.slap });
  const ex = interpolate(f, [dur - 8, dur - 1], [0, 1], { ...CLAMP, easing: theme.ease.in });
  const slam = at(c.slamWord), amt = at(c.amountWord);
  const re = f >= slam ? spring({ frame: f - slam, fps, config: theme.spring.slap }) : 0;
  const pulse = f >= slam ? 1 + 0.14 * Math.max(0, 1 - (f - slam) / 9) : 1 + 0.015 * Math.sin(f / 5);
  const bAt = c.banner ? at(c.banner.word) : amt;
  const back = f < bAt ? 0 : f < slam ? spring({ frame: f - bAt, fps, config: theme.spring.smooth }) : 1 - spring({ frame: f - slam, fps, config: theme.spring.slap });
  const flash = f >= slam ? interpolate(f - slam, [0, 7], [0.55, 0], CLAMP) : 0;
  const count = (txt: string, i: number) => { const n = parseInt(txt.replace(/[^0-9]/g, ''), 10); if (!n) return txt; const p = interpolate(f - amt - i * 4, [0, 18], [0, 1], { ...CLAMP, easing: theme.ease.out }); return String(Math.round(n * p)); };
  const sweep = f >= slam ? interpolate(f - slam, [2, 18], [-40, 140], CLAMP) : interpolate(f, [6, 22], [-40, 140], CLAMP);
  const g1 = '#D9FF5C', g2 = theme.colors.primary;
  const letters = c.code.split('');
  return (
    <div style={{ position: 'absolute', left: 0, top: SAFE.top + 10, width: 1080, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: Math.min(s * 1.7, 1) * (1 - ex) }}>
      <div style={{ fontFamily: theme.fonts.heavy, fontWeight: 900, fontSize: 64, letterSpacing: 6, color: '#fff', textShadow: '0 5px 16px rgba(0,0,0,0.7)', transform: 'translateY(' + interpolate(s, [0, 1], [-50, 0]).toFixed(1) + 'px)' }}>{c.kicker ?? 'USE CODE'}</div>
      {flash > 0 ? <div style={{ position: 'absolute', left: 0, top: -(SAFE.top + 10), width: 1080, height: 1920, background: '#fff', opacity: flash, pointerEvents: 'none' }} /> : null}
      <div style={{ position: 'relative', marginTop: -6, transformOrigin: '50% 0%', transform: 'translateY(' + (-20 * back).toFixed(1) + 'px) scale(' + (interpolate(s, [0, 1], [1.6, 1]) * pulse * (1 - 0.45 * back)).toFixed(3) + ') rotate(' + (-3 + 3 * back).toFixed(2) + 'deg)', filter: 'drop-shadow(0 0 22px ' + theme.colors.glow + ') drop-shadow(0 10px 18px rgba(0,0,0,0.7))' }}>
        <div style={{ display: 'flex' }}>
          {letters.map((ch, i) => {
            const li = spring({ frame: Math.max(0, f - 2 - i * 2), fps, config: theme.spring.slap });
            return <span key={i} style={{ fontFamily: theme.fonts.display, fontSize: 230, lineHeight: 1, display: 'inline-block', background: 'linear-gradient(180deg,' + g1 + ' 10%,' + g2 + ' 90%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextStroke: '9px #0B0D12', paintOrder: 'stroke fill', opacity: Math.min(li * 1.8, 1), transform: 'translateY(' + interpolate(li, [0, 1], [-90, 0]).toFixed(1) + 'px)' }}>{ch}</span>;
          })}
        </div>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', mixBlendMode: 'screen' }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: sweep + '%', width: '18%', background: 'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0) 100%)', transform: 'skewX(-18deg)' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 34, marginTop: 26 - 110 * back, transform: 'translateY(' + (Math.sin(f / 9) * 4).toFixed(1) + 'px)' }}>
        {c.tiles.map((t, i) => {
          const tw = t.word !== undefined ? at(t.word) : 4 + i * 4;
          const ti = f >= tw ? spring({ frame: f - tw, fps, config: theme.spring.bouncy }) : 0;
          const ai = f >= amt ? spring({ frame: f - amt - i * 4, fps, config: theme.spring.slap }) : 0;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: Math.min(ti * 1.6, 1), transform: 'scale(' + interpolate(ti, [0, 0.7, 1], [0.4, 1.1, 1], CLAMP).toFixed(3) + ')' }}>
              <Img src={staticFile(t.image)} style={{ width: 210, height: 210, maxWidth: 'none', objectFit: 'contain', borderRadius: 34, boxShadow: '0 16px 34px rgba(0,0,0,0.6)' }} />
              <div style={{ marginTop: 12, minWidth: 170, textAlign: 'center', background: theme.colors.gold, color: theme.colors.ink, fontFamily: theme.fonts.display, fontSize: 58, lineHeight: 1, padding: '10px 18px 4px', borderRadius: 14, boxShadow: '0 10px 22px rgba(0,0,0,0.55)', opacity: Math.min(ai * 1.8, 1), transform: 'translateY(' + interpolate(ai, [0, 1], [30, 0]).toFixed(1) + 'px) scale(' + interpolate(ai, [0, 0.7, 1], [0.6, 1.12, 1], CLAMP).toFixed(3) + ')' }}>{count(t.amount, i)}</div>
            </div>
          );
        })}
      </div>
      {c.amountText && f >= amt ? (
        <div style={{ marginTop: 22, maxWidth: 940, textAlign: 'center', whiteSpace: 'nowrap', fontFamily: theme.fonts.heavy, fontWeight: 900, fontSize: 40, color: '#fff', letterSpacing: 1, textShadow: '0 5px 16px rgba(0,0,0,0.75)', opacity: Math.min(spring({ frame: f - amt, fps, config: theme.spring.snappy }) * 1.6, 1) }}>{c.amountText}</div>
      ) : null}
      {c.banner && f >= at(c.banner.word) && f < amt ? (() => { const b = c.banner!; const bi = spring({ frame: f - at(b.word), fps, config: theme.spring.slap }); return (
        <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: Math.min(bi * 1.7, 1), transform: 'scale(' + interpolate(bi, [0, 0.7, 1], [0.5, 1.08, 1], CLAMP).toFixed(3) + ') rotate(2deg)' }}>
          <div style={{ background: '#E0262F', color: '#fff', fontFamily: theme.fonts.display, fontSize: 64, lineHeight: 1, padding: '12px 26px 6px', borderRadius: 14, border: '5px solid #fff', boxShadow: '0 14px 30px rgba(0,0,0,0.6)', letterSpacing: 2, whiteSpace: 'nowrap' }}>{b.text}</div>
          {b.sub ? <div style={{ marginTop: 8, fontFamily: theme.fonts.heavy, fontWeight: 900, fontSize: 26, color: 'rgba(255,255,255,0.85)', letterSpacing: 2, textShadow: '0 3px 10px rgba(0,0,0,0.7)' }}>{b.sub}</div> : null}
        </div>
      ); })() : null}
      {c.foot ? <div style={{ marginTop: 20, fontFamily: theme.fonts.heavy, fontWeight: 900, fontSize: 34, color: theme.colors.gold, letterSpacing: 4, textShadow: '0 4px 12px rgba(0,0,0,0.75)', opacity: interpolate(re, [0, 1], [0.55, 1]) }}>{c.foot}</div> : null}
    </div>
  );
};

const CodeDrop: React.FC<{ c: NonNullable<PicksEdit['codeDrop']>; dur: number; fps: number }> = ({ c, dur, fps }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f, fps, config: theme.spring.slap });
  const ex = interpolate(f, [dur - 8, dur - 1], [0, 1], { ...CLAMP, easing: theme.ease.in });
  const letters = c.code.split('');
  const sweep = interpolate(f, [8, 26], [-40, 140], CLAMP);
  const W = 800;
  return (
    <div style={{ position: 'absolute', left: (1080 - W) / 2, top: SAFE.top + 330, width: W, zIndex: 10, opacity: Math.min(s * 1.6, 1) * (1 - ex), transform: 'translateY(' + (interpolate(s, [0, 1], [70, 0]) + ex * 40).toFixed(1) + 'px)' }}>
      {c.logos && c.logos.length ? (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 16 }}>
          {c.logos.map((l, i) => {
            const li = spring({ frame: Math.max(0, f - 3 - i * 3), fps, config: theme.spring.slap });
            return <Img key={i} src={staticFile(l)} style={{ width: 108, height: 108, maxWidth: 'none', objectFit: 'contain', borderRadius: 18, opacity: Math.min(li * 1.6, 1), transform: 'translateX(' + interpolate(li, [0, 1], [-70, 0]).toFixed(1) + 'px)' }} />;
          })}
        </div>
      ) : null}
      {c.label ? <div style={{ textAlign: 'center', fontFamily: theme.fonts.display, fontSize: 36, letterSpacing: 6, color: 'rgba(255,255,255,0.85)', marginBottom: 10 }}>{c.label}</div> : null}
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 22, background: theme.colors.primary, boxShadow: '0 20px 44px rgba(0,0,0,0.6)', padding: '14px 0 8px', display: 'flex', justifyContent: 'center', gap: 4 }}>
        {letters.map((ch, i) => {
          const ci = spring({ frame: Math.max(0, f - 6 - i * 2), fps, config: theme.spring.slap });
          return <span key={i} style={{ fontFamily: theme.fonts.display, fontSize: 108, lineHeight: 1, color: theme.colors.ink, display: 'inline-block', opacity: Math.min(ci * 1.8, 1), transform: 'translateY(' + interpolate(ci, [0, 1], [56, 0]).toFixed(1) + 'px)' }}>{ch}</span>;
        })}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: sweep + '%', width: '22%', background: 'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0) 100%)', transform: 'skewX(-18deg)' }} />
      </div>
      {c.sub ? <div style={{ textAlign: 'center', fontFamily: theme.fonts.display, fontSize: 30, letterSpacing: 3, color: '#fff', marginTop: 12, textShadow: '0 3px 10px rgba(0,0,0,0.6)' }}>{c.sub}</div> : null}
    </div>
  );
};

// Video-033: the ladder total, live. Deliberately NOT a designed card - a built graphic reads as stock filler.
// The raw number sits on the footage in the caption font, the digits roll on the word where he says the new
// number (blurred by their own rate of change, like an odometer), the block physically rises as it climbs,
// and the profit lands as a green chip underneath.
const LadderStep: React.FC<{ L: NonNullable<PicksEdit['ladderStep']>; dur: number; rollAt: number; fps: number; shift?: number }> = ({ L, dur, rollAt, fps, shift = 0 }) => {
  const f = useCurrentFrame();
  const ROLL = 26;
  const inS = spring({ frame: f, fps, config: theme.spring.slap });
  const ex = interpolate(f, [dur - 8, dur - 1], [0, 1], { ...CLAMP, easing: theme.ease.in });
  const money = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const at = (fr: number) => L.from + (L.to - L.from) * interpolate(fr, [rollAt, rollAt + ROLL], [0, 1], { ...CLAMP, easing: theme.ease.out });
  const v = at(f);
  // the digits blur in proportion to how fast they are actually moving - that is what sells it as a real counter
  const rate = Math.abs(v - at(f - 1));
  const blur = Math.min(7, rate / 130);
  const done = f >= rollAt + ROLL;
  const pop = done ? 1 + 0.1 * Math.max(0, 1 - (f - rollAt - ROLL) / 8) : 1;
  const rise = interpolate(f, [rollAt, rollAt + ROLL], [0, -46], CLAMP);   // it climbs as the number climbs
  const dS = done ? spring({ frame: f - rollAt - ROLL, fps, config: theme.spring.slap }) : 0;
  const bar = interpolate(f, [rollAt, rollAt + ROLL], [0, 1], { ...CLAMP, easing: theme.ease.out });
  return (
    <div style={{ position: 'absolute', left: shift, top: SAFE.top + 210, width: 1080, zIndex: 11, textAlign: 'center', opacity: Math.min(inS * 1.7, 1) * (1 - ex), transform: 'translateY(' + (interpolate(inS, [0, 1], [54, 0]) + rise + ex * 30).toFixed(1) + 'px)' }}>
      {L.label ? <div style={{ fontFamily: theme.fonts.display, fontSize: 40, letterSpacing: 7, color: 'rgba(255,255,255,0.8)', textShadow: theme.outline, marginBottom: 10 }}>{L.label}</div> : null}
      <div style={{ fontFamily: theme.fonts.display, fontSize: 138, lineHeight: 1, color: '#fff', textShadow: theme.outline, filter: blur > 0.15 ? 'blur(' + blur.toFixed(2) + 'px)' : undefined, transform: 'scale(' + pop.toFixed(3) + ')' }}>{money(v)}</div>
      <div style={{ margin: '14px auto 0', width: 620, height: 7, borderRadius: 4, background: 'rgba(255,255,255,0.16)', overflow: 'hidden' }}>
        <div style={{ width: (bar * 100).toFixed(1) + '%', height: '100%', background: theme.colors.primary, boxShadow: '0 0 18px ' + theme.colors.primary }} />
      </div>
      {done ? (
        <div style={{ display: 'inline-block', marginTop: 18, background: theme.colors.primary, color: theme.colors.ink, fontFamily: theme.fonts.display, fontSize: 46, letterSpacing: 2, padding: '8px 22px 3px', borderRadius: 10, opacity: Math.min(dS * 1.8, 1), transform: 'translateY(' + interpolate(dS, [0, 1], [26, 0]).toFixed(1) + 'px) scale(' + interpolate(dS, [0, 0.6, 1], [0.7, 1.08, 1], CLAMP).toFixed(3) + ')' }}>
          +{money(L.to - L.from)}{L.sub ? '  ' + L.sub : ''}
        </div>
      ) : null}
    </div>
  );
};

const LineupCard: React.FC<{ e: PicksEdit; f: number; from: number; to: number; stampAt: number; title?: string; hero?: boolean }> = ({ e, f, from, to, stampAt, title, hero }) => {
  const tl = timelineFor(e);
  const L = e.hook.lineup; if (!L) return null;
  if (f < from || f >= to) return null;
  const step = L.stepFrames ?? 4;
  const s = spring({ frame: f - from, fps: e.fps, config: theme.spring.smooth });
  const ex = interpolate(f, [to - 8, to - 1], [0, 1], CLAMP);
  const st = spring({ frame: f - stampAt, fps: e.fps, config: theme.spring.slap });
  const stamped = f >= stampAt;
  const shake = stamped && f < stampAt + 7 ? (f % 2 === 0 ? 1 : -1) * (7 - (f - stampAt)) * 2.2 : 0;
  const tagAt = L.tagWord !== undefined ? tl.wStart(L.tagWord) : -1;
  const ts = spring({ frame: f - tagAt, fps: e.fps, config: theme.spring.slap });
  const W = 940, chip = hero ? 150 : 138;
  const stampSize = fitFont(L.stampText, 132, 960, 0, 0.5);
  return (
    <div style={{ position: 'absolute', left: (1080 - W) / 2, top: SAFE.top + (hero ? 40 : 20), width: W, zIndex: 9, opacity: Math.min(s * 1.5, 1) * (1 - ex), transform: 'translate(' + shake.toFixed(1) + 'px,' + (interpolate(s, [0, 1], [-40, 0]) - ex * 40).toFixed(1) + 'px) scale(' + interpolate(s, [0, 1], [0.94, 1]).toFixed(3) + ')' }}>
      <div style={{ position: 'relative', background: CARD_BG, borderRadius: 20, border: '1px solid ' + CARD_LINE, boxShadow: '0 24px 60px rgba(0,0,0,0.65)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: '1px solid ' + CARD_LINE }}>
          <div style={{ fontFamily: theme.fonts.display, fontSize: 34, color: '#fff', letterSpacing: 3 }}>{title ?? 'MY 5 PROPS'}</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {L.chip ? <div style={{ fontFamily: theme.fonts.display, fontSize: 24, color: theme.colors.ink, background: theme.colors.primary, borderRadius: 8, padding: '6px 12px 4px', letterSpacing: 1.5, whiteSpace: 'nowrap' }}>{L.chip}</div> : null}
            {L.tagText && tagAt >= 0 && f >= tagAt ? <div style={{ fontFamily: theme.fonts.display, fontSize: 26, color: '#fff', border: '2px solid rgba(255,255,255,0.35)', borderRadius: 8, padding: '5px 12px 3px', letterSpacing: 2, whiteSpace: 'nowrap', opacity: Math.min(ts * 1.5, 1), transform: 'scale(' + interpolate(ts, [0, 1], [1.6, 1]).toFixed(3) + ')' }}>{L.tagText}</div> : null}
          </div>
        </div>
        <div style={{ display: 'flex', padding: '18px 14px 20px', gap: 8 }}>
          {L.items.map((it, i) => {
            const at = from + i * step;
            const live = f >= at;
            const si = spring({ frame: Math.max(0, f - at), fps: e.fps, config: theme.spring.slap });
            const [c1, c2] = teamColors(it.team);
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: live ? Math.min(si * 1.5, 1) : 0, transform: 'translateY(' + (live ? interpolate(si, [0, 1], [-60, 0]) : -60).toFixed(1) + 'px) scale(' + (live ? interpolate(si, [0, 0.7, 1], [0.6, 1.08, 1], CLAMP) : 0.6).toFixed(3) + ')' }}>
                <div style={{ width: chip, height: chip, borderRadius: '50%', overflow: 'hidden', border: '4px solid ' + c2, background: c1, boxShadow: '0 10px 22px rgba(0,0,0,0.55)' }}>
                  <Img src={staticFile(it.image)} style={L.contain ? { width: '72%', height: '72%', maxWidth: 'none', objectFit: 'contain', display: 'block', margin: '14%', filter: hero || L.blur === false ? undefined : 'blur(9px)' } : { width: '100%', height: '100%', maxWidth: 'none', objectFit: 'cover', display: 'block', transform: 'scale(1.08)', filter: hero || L.blur === false ? undefined : 'blur(9px)' }} />
                </div>
                <div style={{ fontFamily: theme.fonts.display, fontSize: hero ? 26 : 24, color: '#fff', letterSpacing: 1, whiteSpace: 'nowrap', lineHeight: 1, filter: hero || L.blur === false ? undefined : 'blur(7px)' }}>{it.label}</div>
                <div style={{ fontFamily: theme.fonts.display, fontSize: hero ? 26 : 23, color: theme.colors.primary, letterSpacing: 1, whiteSpace: 'nowrap', lineHeight: 1, filter: hero || L.blur === false ? undefined : 'blur(5px)' }}>{it.line}</div>
              </div>
            );
          })}
        </div>
        {stamped ? (
          <div style={{ position: 'absolute', left: '50%', top: '58%', zIndex: 10, transform: 'translate(-50%,-50%) rotate(-9deg) scale(' + interpolate(st, [0, 1], [3.2, 1]).toFixed(3) + ')', opacity: Math.min(st * 2.5, 1), color: '#ef4444', border: '12px solid #ef4444', borderRadius: 20, padding: '4px 30px 0', fontFamily: theme.fonts.display, fontSize: stampSize, letterSpacing: 5, whiteSpace: 'nowrap', textShadow: '0 0 20px rgba(0,0,0,0.7)', background: 'rgba(20,0,0,0.42)', boxShadow: '0 0 40px rgba(239,68,68,0.45), inset 0 0 30px rgba(0,0,0,0.45)' }}>{L.stampText}</div>
        ) : null}
      </div>
    </div>
  );
};
const LineupHook: React.FC<{ e: PicksEdit; f: number }> = ({ e, f }) => {
  const tl = timelineFor(e);
  const L = e.hook.lineup; if (!L) return null;
  return <LineupCard e={e} f={f} from={tl.wStart(L.word)} to={tl.hookEnd} stampAt={tl.wStart(L.stampWord)} title={L.title} />;
};
const LineupHero: React.FC<{ e: PicksEdit; f: number }> = ({ e, f }) => {
  const tl = timelineFor(e);
  const H = e.lineupHero; if (!H || !e.hook.lineup) return null;
  return <LineupCard e={e} f={f} from={tl.wStart(H.word)} to={tl.wStart(H.untilWord)} stampAt={tl.wStart(H.word) + 22} title={H.title} hero />;
};

// Sponsor block (Video-010, Outlier): the app showcase video inside a phone-style card that rises in on the sponsor's name, the
// partner logo above it, a one-line title, and a green CTA card that slams in on the CTA word ("link in my bio, first month on me").
const SponsorBlock: React.FC<{ e: PicksEdit; f: number }> = ({ e, f }) => {
  const tl = timelineFor(e);
  const S = e.sponsor; if (!S) return null;
  const from = tl.wStart(S.word), to = tl.wStart(S.untilWord), ctaAt = tl.wStart(S.ctaWord);
  if (f < from || f >= to) return null;
  const s = spring({ frame: f - from, fps: e.fps, config: theme.spring.smooth });
  const sl = spring({ frame: f - from - 6, fps: e.fps, config: theme.spring.snappy });
  const cs = spring({ frame: f - ctaAt, fps: e.fps, config: theme.spring.slap });
  const ex = interpolate(f, [to - 8, to - 1], [0, 1], CLAMP);
  const phoneH = 900, phoneW = Math.round(phoneH * S.videoW / S.videoH);
  const top = SAFE.top + 10;
  const cta = f >= ctaAt;
  return (
    <div style={{ position: 'absolute', left: 0, width: 1080, top, zIndex: 9, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: Math.min(s * 1.5, 1) * (1 - ex), transform: 'translateY(' + (interpolate(s, [0, 1], [40, 0]) - ex * 40).toFixed(1) + 'px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: sl, transform: 'scale(' + interpolate(sl, [0, 1], [0.8, 1]).toFixed(3) + ')' }}>
        <Img src={staticFile(S.logo)} style={{ height: 74, width: 'auto', maxWidth: 'none', display: 'block', filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.6))' }} />
      </div>
      <div style={{ marginTop: 10, fontFamily: theme.fonts.display, fontSize: 34, color: '#fff', letterSpacing: 3, textShadow: theme.outline, opacity: sl }}>{S.title}</div>
      <div style={{ position: 'relative', marginTop: 16, width: phoneW + 24, height: phoneH + 24, borderRadius: 40, background: '#0b0d12', border: '2px solid rgba(255,255,255,0.18)', boxShadow: '0 30px 70px rgba(0,0,0,0.7), 0 0 40px rgba(34,197,94,0.25)', overflow: 'hidden', transform: 'scale(' + interpolate(s, [0, 1], [0.9, 1]).toFixed(3) + ')' }}>
        <div style={{ position: 'absolute', left: 12, top: 12, width: phoneW, height: phoneH, borderRadius: 30, overflow: 'hidden' }}>
          <Loop durationInFrames={Math.max(1, Math.floor((e.clipSec[S.video] ?? 12) * e.fps) - 1)} layout='none'>
            <OffthreadVideo src={staticFile(S.video)} muted style={{ width: phoneW, height: phoneH, maxWidth: 'none', objectFit: 'cover', display: 'block' }} />
          </Loop>
        </div>
        {cta ? <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 120, background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0))' }} /> : null}
      </div>
      {cta ? (
        <div style={{ marginTop: -70, zIndex: 2, background: theme.colors.primary, color: theme.colors.ink, borderRadius: 18, padding: '14px 34px 10px', fontFamily: theme.fonts.display, fontSize: 46, letterSpacing: 2, whiteSpace: 'nowrap', boxShadow: '0 16px 36px rgba(0,0,0,0.55)', opacity: Math.min(cs * 1.6, 1), transform: 'rotate(-2deg) scale(' + interpolate(cs, [0, 0.7, 1], [0.5, 1.08, 1], CLAMP).toFixed(3) + ')' }}>{S.ctaUnderline && S.cta.includes(S.ctaUnderline) ? (<>{S.cta.split(S.ctaUnderline)[0]}<span style={{ position: 'relative', display: 'inline-block' }}>{S.ctaUnderline}<span style={{ position: 'absolute', left: -2, bottom: 2, height: 7, borderRadius: 4, background: theme.colors.ink, width: interpolate(f, [ctaAt + 8, ctaAt + 16], [0, 104], { ...CLAMP, easing: theme.ease.out }).toFixed(1) + '%' }} /></span>{S.cta.split(S.ctaUnderline).slice(1).join(S.ctaUnderline)}</>) : S.cta}</div>
      ) : null}
      {cta && S.sub ? <div style={{ marginTop: 8, fontFamily: theme.fonts.display, fontSize: 28, color: 'rgba(255,255,255,0.9)', letterSpacing: 3, textShadow: theme.outline, opacity: Math.min(cs * 1.6, 1) }}>{S.sub}</div> : null}
    </div>
  );
};

// ChartFit (Video-019, Outlier Passing Charts): the receiver's zone grid flies in from the left and the QB's from the right, tilted like
// puzzle pieces with their labels under them. On fitWord they slide to the centre and stack (the top piece goes see-through so both
// grids read at once), then snap: a shake, a white flash, a gold glow and a lock stamp. Pure CSS on the real screenshots.
const ChartFit: React.FC<{ e: PicksEdit; f: number }> = ({ e, f }) => {
  const tl = timelineFor(e);
  const C = e.chartFit; if (!C) return null;
  const from = tl.wStart(C.word), fitAt = tl.wStart(C.fitWord), to = tl.wStart(C.untilWord);
  if (f < from || f >= to) return null;
  const GW = 400, GH = Math.round(GW * 340 / 330), GAP = 44;
  const top = 560;
  const cx = (1080 - GW) / 2;
  const inL = spring({ frame: f - from, fps: e.fps, config: theme.spring.snappy });
  const inR = spring({ frame: f - from - 5, fps: e.fps, config: theme.spring.snappy });
  const fit = spring({ frame: f - fitAt, fps: e.fps, config: { damping: 16, stiffness: 170, mass: 0.9 } });
  const snapAt = fitAt + 11;
  const snapped = f >= snapAt;
  const shake = f >= snapAt && f < snapAt + 7 ? Math.sin((f - snapAt) * 2.6) * (7 - (f - snapAt)) * 2.2 : 0;
  const flash = interpolate(f, [snapAt, snapAt + 2, snapAt + 9], [0, 0.55, 0], CLAMP);
  const st = spring({ frame: f - snapAt - 2, fps: e.fps, config: theme.spring.slap });
  const tt = spring({ frame: f - from - 2, fps: e.fps, config: theme.spring.smooth });
  const ex = interpolate(f, [to - 8, to - 1], [0, 1], { ...CLAMP, easing: theme.ease.in });
  const lx = interpolate(fit, [0, 1], [(1080 - 2 * GW - GAP) / 2, cx]);
  const rx = interpolate(fit, [0, 1], [(1080 - 2 * GW - GAP) / 2 + GW + GAP, cx]);
  const piece = (img: string, x: number, sIn: number, dir: number, label: string, team: string | undefined, over: boolean) => {
    const [c1, c2] = teamColors(team);
    const offX = interpolate(sIn, [0, 1], [dir * 700, 0]);
    const rot = interpolate(sIn, [0, 1], [dir * 14, 0]) + (1 - fit) * dir * 2.5;
    const labelO = 1 - interpolate(fit, [0, 0.4], [0, 1], CLAMP);
    return (
      <div style={{ position: 'absolute', left: x + offX, top, width: GW, zIndex: over ? 2 : 1, transform: 'rotate(' + rot.toFixed(2) + 'deg)', transformOrigin: '50% 60%' }}>
        <div style={{ width: GW, height: GH, borderRadius: 18, overflow: 'hidden', border: '3px solid rgba(255,255,255,' + (snapped ? 0.9 : 0.22) + ')', boxShadow: snapped ? '0 0 0 4px ' + theme.colors.gold + ', 0 0 46px rgba(255,214,0,0.55)' : '0 24px 50px rgba(0,0,0,0.65)', opacity: over ? interpolate(fit, [0, 1], [1, 0.52]) : 1, background: '#0b0d12' }}>
          <Img src={staticFile(img)} style={{ width: GW, height: GH, maxWidth: 'none', display: 'block' }} />
        </div>
        <div style={{ textAlign: 'center', marginTop: 12, opacity: labelO }}>
          <span style={{ display: 'inline-block', background: c1, color: '#fff', borderBottom: '5px solid ' + c2, borderRadius: 10, padding: '6px 16px 3px', fontFamily: theme.fonts.display, fontSize: 32, letterSpacing: 1.5, whiteSpace: 'nowrap', boxShadow: '0 8px 18px rgba(0,0,0,0.5)' }}>{label}</span>
        </div>
      </div>
    );
  };
  return (
    <div style={{ ...LAYER, zIndex: 8, opacity: 1 - ex, transform: 'translate(' + shake.toFixed(1) + 'px,' + (ex * 30).toFixed(1) + 'px) scale(' + (1 - ex * 0.06).toFixed(3) + ')' }}>
      <div style={{ position: 'absolute', left: 0, width: 1080, top: top - 200, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: Math.min(tt * 1.5, 1), transform: 'translateY(' + interpolate(tt, [0, 1], [-24, 0]).toFixed(1) + 'px)' }}>
        {C.kicker ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(8,10,16,0.9)', border: '2px solid rgba(255,255,255,0.16)', borderRadius: 12, padding: '6px 18px 4px', boxShadow: '0 10px 22px rgba(0,0,0,0.5)' }}>
            {C.logo ? <Img src={staticFile(C.logo)} style={{ height: 34, width: 'auto', maxWidth: 'none', display: 'block' }} /> : null}
            <span style={{ fontFamily: theme.fonts.display, fontSize: 30, color: '#fff', letterSpacing: 2.5 }}>{C.kicker}</span>
          </div>
        ) : null}
        <div style={{ marginTop: 10, fontFamily: theme.fonts.display, fontSize: 64, color: '#fff', letterSpacing: 2, textShadow: theme.outline, whiteSpace: 'nowrap' }}>{C.title}</div>
      </div>
      {piece(C.left.image, lx, inL, -1, C.left.label, C.left.team, false)}
      {piece(C.right.image, rx, inR, 1, C.right.label, C.right.team, true)}
      {snapped ? (
        <div style={{ position: 'absolute', left: 0, width: 1080, top: top + GH + 18, display: 'flex', justifyContent: 'center', zIndex: 3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: theme.colors.gold, color: theme.colors.ink, borderRadius: 16, padding: '10px 28px 6px', fontFamily: theme.fonts.display, fontSize: 58, letterSpacing: 2, whiteSpace: 'nowrap', boxShadow: '0 16px 36px rgba(0,0,0,0.55)', opacity: Math.min(st * 1.6, 1), transform: 'rotate(-3deg) scale(' + interpolate(st, [0, 0.7, 1], [2.2, 0.94, 1], CLAMP).toFixed(3) + ')' }}>
            {C.stampIcon ? <Img src={staticFile(C.stampIcon)} style={{ height: 58, width: 'auto', maxWidth: 'none', display: 'block', marginTop: -6 }} /> : null}
            {C.stamp}
          </div>
        </div>
      ) : null}
      {flash > 0 ? <div style={{ ...LAYER, background: '#fff', opacity: flash, zIndex: 4 }} /> : null}
    </div>
  );
};

// HeroCutout (Video-020, "Amon-Ra the Sun God"): the frame dims, gold rays rotate behind a glowing sun disc, the full-body cutout
// (a 1080x1920 transparent PNG) springs up from below with a gold rim light, the player's name drops in on top and the nickname
// slams in on titleWord. Exits with a quick scale-down fade.
const HeroCutout: React.FC<{ e: PicksEdit; f: number }> = ({ e, f }) => {
  const tl = timelineFor(e);
  const H = e.heroCutout; if (!H) return null;
  const from = tl.wStart(H.word), titleAt = tl.wStart(H.titleWord), to = tl.wStart(H.untilWord);
  if (f < from || f >= to) return null;
  const k = f - from;
  const dim = interpolate(k, [0, 6], [0, 1], CLAMP);
  const rise = spring({ frame: k - 2, fps: e.fps, config: { damping: 14, stiffness: 120, mass: 0.9 } });
  const nm = spring({ frame: k - 6, fps: e.fps, config: theme.spring.snappy });
  const tt = spring({ frame: f - titleAt, fps: e.fps, config: theme.spring.slap });
  const ex = interpolate(f, [to - 7, to - 1], [0, 1], { ...CLAMP, easing: theme.ease.in });
  const headY = H.headY ?? 720;
  const pulse = 1 + Math.sin(k / 6) * 0.04;
  const titleOn = f >= titleAt;
  const flash = titleOn ? interpolate(f, [titleAt, titleAt + 2, titleAt + 8], [0, 0.35, 0], CLAMP) : 0;
  return (
    <div style={{ ...LAYER, zIndex: 8, opacity: 1 - ex, transform: 'scale(' + (1 - ex * 0.05).toFixed(3) + ')' }}>
      <div style={{ ...LAYER, background: 'radial-gradient(ellipse at 50% ' + headY + 'px, rgba(40,20,0,0.35) 0%, rgba(0,0,0,0.78) 70%)', opacity: dim }} />
      <div style={{ position: 'absolute', left: 540 - 1300, top: headY - 1300, width: 2600, height: 2600, opacity: dim * 0.9, transform: 'rotate(' + (k * 0.7).toFixed(2) + 'deg)', background: 'repeating-conic-gradient(from 0deg, rgba(255,196,60,0.42) 0deg 5deg, rgba(255,196,60,0) 5deg 15deg)', WebkitMaskImage: 'radial-gradient(circle at 50% 50%, #000 0%, rgba(0,0,0,0.6) 22%, rgba(0,0,0,0) 48%)', maskImage: 'radial-gradient(circle at 50% 50%, #000 0%, rgba(0,0,0,0.6) 22%, rgba(0,0,0,0) 48%)' } as React.CSSProperties} />
      <div style={{ position: 'absolute', left: 540 - 330, top: headY - 330, width: 660, height: 660, borderRadius: '50%', opacity: dim, transform: 'scale(' + (interpolate(rise, [0, 1], [0.4, 1]) * pulse).toFixed(3) + ')', background: 'radial-gradient(circle, rgba(255,250,215,1) 0%, rgba(255,215,90,0.95) 26%, rgba(255,160,30,0.55) 52%, rgba(255,140,0,0) 72%)' }} />
      <Img src={staticFile(H.image)} style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, maxWidth: 'none', transform: 'translateY(' + interpolate(rise, [0, 1], [700, 150]).toFixed(1) + 'px)', filter: 'drop-shadow(0 0 22px rgba(255,200,60,0.85)) drop-shadow(0 30px 40px rgba(0,0,0,0.6))' }} />
      <div style={{ position: 'absolute', left: 0, width: 1080, top: SAFE.top + 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontFamily: theme.fonts.display, fontSize: 66, color: '#fff', letterSpacing: 3, textShadow: theme.outline, opacity: Math.min(nm * 1.5, 1), transform: 'translateY(' + interpolate(nm, [0, 1], [-40, 0]).toFixed(1) + 'px)', whiteSpace: 'nowrap' }}>{H.name}</div>
        {titleOn ? <div style={{ marginTop: 4, fontFamily: theme.fonts.display, fontSize: 132, lineHeight: 1, color: theme.colors.gold, letterSpacing: 2, whiteSpace: 'nowrap', textShadow: '0 0 30px rgba(255,190,40,0.9), 5px 5px 0 #000, -5px 5px 0 #000, 5px -5px 0 #000, -5px -5px 0 #000', opacity: Math.min(tt * 1.6, 1), transform: 'rotate(-3deg) scale(' + interpolate(tt, [0, 0.7, 1], [2.4, 0.93, 1], CLAMP).toFixed(3) + ')' }}>{H.title}</div> : null}
      </div>
      {flash > 0 ? <div style={{ ...LAYER, background: '#fff3c4', opacity: flash }} /> : null}
    </div>
  );
};

// SponsorDuo (Video-021, Sleeper + Onyx): a header pill, then the two partner cards slide in from opposite sides on their names
// (Sleeper = its app logo on navy with the offer under it; Onyx = its own promo art), the shared code slams in as a green chip on
// codeWord and a 'links in bio' tag drops under it on bioWord. Real partner assets only, flat cards, no generated art.
const SponsorDuo: React.FC<{ e: PicksEdit; f: number }> = ({ e, f }) => {
  const tl = timelineFor(e);
  const S = e.sponsorDuo; if (!S) return null;
  const from = tl.wStart(S.word), to = tl.wStart(S.untilWord);
  if (f < from || f >= to) return null;
  const hs = spring({ frame: f - from, fps: e.fps, config: theme.spring.smooth });
  const ls = spring({ frame: f - tl.wStart(S.left.word), fps: e.fps, config: theme.spring.snappy });
  const rs = spring({ frame: f - tl.wStart(S.right.word), fps: e.fps, config: theme.spring.snappy });
  const codeAt = tl.wStart(S.codeWord), bioAt = tl.wStart(S.bioWord);
  const cs = spring({ frame: f - codeAt, fps: e.fps, config: theme.spring.slap });
  const bs = spring({ frame: f - bioAt, fps: e.fps, config: theme.spring.snappy });
  const ex = interpolate(f, [to - 8, to - 1], [0, 1], { ...CLAMP, easing: theme.ease.in });
  const CW = 430, CH = 540, top = SAFE.top + 90;
  const card = (sIn: number, dir: number, bg: string, body: React.ReactNode, name: string, offer: string) => (
    <div style={{ width: CW, height: CH, borderRadius: 26, overflow: 'hidden', background: bg, border: '2px solid rgba(255,255,255,0.16)', boxShadow: '0 26px 54px rgba(0,0,0,0.6)', opacity: Math.min(sIn * 1.6, 1), transform: 'translateX(' + interpolate(sIn, [0, 1], [dir * 600, 0]).toFixed(1) + 'px) rotate(' + interpolate(sIn, [0, 1], [dir * 8, dir * 1.5]).toFixed(2) + 'deg)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 370, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>{body}</div>
      <div style={{ flex: 1, background: 'rgba(0,0,0,0.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
        <div style={{ fontFamily: theme.fonts.display, fontSize: 40, color: '#fff', letterSpacing: 2 }}>{name}</div>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, lineHeight: 1.2, color: 'rgba(255,255,255,0.9)', letterSpacing: 0.5, textAlign: 'center', padding: '0 14px', whiteSpace: 'pre-line' }}>{offer}</div>
      </div>
    </div>
  );
  return (
    <div style={{ position: 'absolute', left: 0, width: 1080, top, zIndex: 9, opacity: 1 - ex, transform: 'translateY(' + (ex * 40).toFixed(1) + 'px)' }}>
      <div style={{ display: 'flex', justifyContent: 'center', opacity: Math.min(hs * 1.5, 1), transform: 'translateY(' + interpolate(hs, [0, 1], [-30, 0]).toFixed(1) + 'px)' }}>
        <div style={{ background: 'rgba(8,10,16,0.9)', border: '2px solid rgba(255,255,255,0.16)', borderRadius: 14, padding: '8px 24px 5px', fontFamily: theme.fonts.display, fontSize: 36, color: '#fff', letterSpacing: 3, boxShadow: '0 10px 24px rgba(0,0,0,0.5)' }}>{S.header}</div>
      </div>
      <div style={{ marginTop: 22, display: 'flex', justifyContent: 'center', gap: 26 }}>
        {card(ls, -1, S.left.bg, <Img src={staticFile(S.left.logo)} style={{ height: 300, width: 'auto', maxWidth: 'none', display: 'block' }} />, S.left.name, S.left.offer)}
        {card(rs, 1, S.right.bg, <Img src={staticFile(S.right.image)} style={{ width: CW + 70, height: CW + 70, maxWidth: 'none', objectFit: 'cover', display: 'block' }} />, S.right.name, S.right.offer)}
      </div>
      {f >= codeAt ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}>
          <div style={{ background: theme.colors.primary, color: theme.colors.ink, borderRadius: 18, padding: '12px 38px 7px', fontFamily: theme.fonts.display, fontSize: 64, letterSpacing: 3, whiteSpace: 'nowrap', boxShadow: '0 16px 36px rgba(0,0,0,0.55)', opacity: Math.min(cs * 1.6, 1), transform: 'rotate(-2deg) scale(' + interpolate(cs, [0, 0.7, 1], [2.0, 0.94, 1], CLAMP).toFixed(3) + ')' }}>CODE {S.code}</div>
        </div>
      ) : null}
      {f >= bioAt ? <div style={{ marginTop: 12, textAlign: 'center', fontFamily: theme.fonts.display, fontSize: 38, color: '#fff', letterSpacing: 3, textShadow: theme.outline, opacity: Math.min(bs * 1.5, 1), transform: 'translateY(' + interpolate(bs, [0, 1], [16, 0]).toFixed(1) + 'px)' }}>{S.sub}</div> : null}
    </div>
  );
};

// TextStamp (Video-023): a big rotated word that slams in on its word (slap spring, squash, white flash line), breathes, and whips out.
// Sits in the lower-middle band by default (y 1130), below pop-ups and above the captions. Optional icon (logo) on the left.
// a function, not a constant: the brand palette is applied per render (theme.applyBrand), so tones must read it live
// 'green' is always a real win-green, never the brand primary (Ninety Plus primary is red, so a win read as a loss).
const WIN_GREEN = '#22C55E';
const tones = (): Record<string, [string, string]> => ({ red: ['#e0262f', '#fff'], green: [WIN_GREEN, theme.colors.ink], gold: [theme.colors.gold, theme.colors.ink], white: ['#fff', theme.colors.ink], ink: ['rgba(8,10,16,0.92)', '#fff'] });
const TextStamp: React.FC<{ t: TextStampSpec; dur: number; fps: number; base: string }> = ({ t, dur, fps, base }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f, fps, config: theme.spring.slap });
  const ex = interpolate(f, [dur - 7, dur - 1], [0, 1], { ...CLAMP, easing: theme.ease.in });
  const [bg, fg] = tones()[t.tone ?? 'red'];
  const size = Math.min(t.size ?? 84, 100);   // the free band between the card bottom (~1100) and the captions (~1260) is 150px
  const rot = t.rot ?? -4;
  const breathe = f > 10 ? 1 + Math.sin(f / 9) * 0.015 : 1;
  const flash = interpolate(f, [2, 4, 9], [0, 0.6, 0], CLAMP);
  return (
    <div style={{ position: 'absolute', left: t.x ?? 0, width: t.x !== undefined ? undefined : 1080, top: t.y ?? 1112, display: 'flex', justifyContent: 'center', zIndex: 8, opacity: Math.min(s * 1.6, 1) * (1 - ex), transform: 'translateY(' + (ex * 40).toFixed(1) + 'px)' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 18, background: bg, color: fg, borderRadius: 18, padding: '10px 34px 5px', fontFamily: theme.fonts.display, fontSize: size, lineHeight: 1, letterSpacing: 2, whiteSpace: 'nowrap', boxShadow: '0 18px 40px rgba(0,0,0,0.6), 0 0 0 4px rgba(255,255,255,0.18)', transform: 'rotate(' + rot + 'deg) scale(' + (interpolate(s, [0, 0.7, 1], [2.4, 0.93, 1], CLAMP) * breathe).toFixed(3) + ')' }}>
        {t.icon ? <Img src={staticFile(base + '/popups/' + t.icon)} style={{ height: size * 0.95, width: 'auto', maxWidth: 'none', display: 'block', marginTop: -4 }} /> : null}
        {t.text}
        <div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: '#fff', opacity: flash, pointerEvents: 'none' }} />
      </div>
    </div>
  );
};

// SlipFan (Video-022 hook): frame 0 = the owner's real older slips flying in fanned like a hand of lottery tickets (shutter per slip),
// a tag chip over them, a gold money counter that ticks up on moneyWord; on sweepWord a red X slams and the stack whips off left while the
// hero slip (tonight's) slams in centre with its tag, then a price stamp on stampWord. Real slip images only.
const fmtInt = (n: number) => Math.round(n).toLocaleString('en-US');
const SlipFan: React.FC<{ e: PicksEdit; f: number }> = ({ e, f }) => {
  const tl = timelineFor(e);
  const S = e.slipFan; if (!S) return null;
  const from = tl.wStart(S.word), sweepAt = tl.wStart(S.sweepWord), to = tl.wStart(S.untilWord), moneyAt = tl.wStart(S.moneyWord), stampAt = tl.wStart(S.stampWord);
  if (f < from || f >= to) return null;
  const ex = interpolate(f, [to - 8, to - 1], [0, 1], { ...CLAMP, easing: theme.ease.in });
  const sweep = interpolate(f, [sweepAt + 4, sweepAt + 14], [0, 1], { ...CLAMP, easing: theme.ease.in });
  const xs = spring({ frame: f - sweepAt, fps: e.fps, config: theme.spring.slap });
  const hs = spring({ frame: f - sweepAt - 10, fps: e.fps, config: theme.spring.slap });
  const ms = spring({ frame: f - moneyAt, fps: e.fps, config: theme.spring.slap });
  const ss = spring({ frame: f - stampAt, fps: e.fps, config: theme.spring.slap });
  const money = interpolate(f, [moneyAt, moneyAt + 14], [0, S.moneyTo], { ...CLAMP, easing: theme.ease.out });
  const W = 430, top = 520;
  const n = S.stack.length;
  return (
    <div style={{ ...LAYER, zIndex: 8, opacity: 1 - ex }}>
      {f < sweepAt + 16 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: 'translateX(' + (sweep * -1200).toFixed(1) + 'px) rotate(' + (sweep * -10).toFixed(2) + 'deg)', transformOrigin: '50% 60%' }}>
          {S.stack.map((img, i) => {
            const si = spring({ frame: f - from - i * 4, fps: e.fps, config: theme.spring.snappy });
            const rot = (i - (n - 1) / 2) * 11;
            const dx = (i - (n - 1) / 2) * 190;
            return (
              <div key={img} style={{ position: 'absolute', left: 540 - W / 2 + dx, top: top + Math.abs(i - (n - 1) / 2) * 40, width: W, opacity: Math.min(si * 1.6, 1), transform: 'translateY(' + interpolate(si, [0, 1], [900, 0]).toFixed(1) + 'px) rotate(' + (rot * si).toFixed(2) + 'deg)', transformOrigin: '50% 100%', zIndex: i === Math.floor(n / 2) ? 3 : 1 }}>
                <Img src={staticFile(img)} style={{ width: W, height: 'auto', maxWidth: 'none', display: 'block', borderRadius: 16, border: '3px solid #fff', boxShadow: '0 24px 50px rgba(0,0,0,0.65)' }} />
              </div>
            );
          })}
          <div style={{ position: 'absolute', left: 0, width: 1080, top: top - 110, display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(8,10,16,0.92)', border: '2px solid rgba(255,255,255,0.18)', borderRadius: 14, padding: '8px 24px 5px', fontFamily: theme.fonts.display, fontSize: 44, color: '#fff', letterSpacing: 3, boxShadow: '0 12px 26px rgba(0,0,0,0.55)', opacity: Math.min(spring({ frame: f - from - 6, fps: e.fps, config: theme.spring.snappy }) * 1.5, 1) }}>{S.stackTag}</div>
          </div>
          {f >= moneyAt ? (
            <div style={{ position: 'absolute', left: 0, width: 1080, top: top + 250, display: 'flex', justifyContent: 'center', zIndex: 5 }}>
              <div style={{ fontFamily: theme.fonts.display, fontSize: 150, lineHeight: 1, color: theme.colors.gold, letterSpacing: 2, textShadow: '0 0 26px rgba(255,200,40,0.7), 6px 6px 0 #000, -6px 6px 0 #000, 6px -6px 0 #000, -6px -6px 0 #000', transform: 'rotate(-4deg) scale(' + interpolate(ms, [0, 0.7, 1], [2.2, 0.94, 1], CLAMP).toFixed(3) + ')', opacity: Math.min(ms * 1.6, 1), whiteSpace: 'nowrap' }}>{fmtInt(money)}<span style={{ fontSize: 60, marginLeft: 14, color: '#fff' }}>{S.moneyLabel}</span></div>
            </div>
          ) : null}
        </div>
      ) : null}
      {f >= sweepAt && f < sweepAt + 14 ? (
        <div style={{ position: 'absolute', left: 0, width: 1080, top: top + 80, display: 'flex', justifyContent: 'center', zIndex: 9 }}>
          <div style={{ fontFamily: theme.fonts.display, fontSize: 520, lineHeight: 1, color: '#e0262f', textShadow: '0 12px 40px rgba(0,0,0,0.6)', opacity: Math.min(xs * 1.6, 1) * (1 - interpolate(f, [sweepAt + 9, sweepAt + 13], [0, 1], CLAMP)), transform: 'scale(' + interpolate(xs, [0, 0.7, 1], [2.4, 0.9, 1], CLAMP).toFixed(3) + ') rotate(-6deg)' }}>X</div>
        </div>
      ) : null}
      {f >= sweepAt + 10 ? (
        <div style={{ position: 'absolute', left: 0, width: 1080, top: top - 20, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 6 }}>
          <div style={{ marginBottom: 14, background: theme.colors.primary, color: theme.colors.ink, borderRadius: 14, padding: '8px 26px 4px', fontFamily: theme.fonts.display, fontSize: 48, letterSpacing: 3, opacity: Math.min(hs * 1.6, 1), transform: 'translateY(' + interpolate(hs, [0, 1], [-30, 0]).toFixed(1) + 'px)' }}>{S.heroTag}</div>
          <div style={{ position: 'relative', opacity: Math.min(hs * 1.6, 1), transform: 'scale(' + interpolate(hs, [0, 0.7, 1], [1.5, 0.96, 1], CLAMP).toFixed(3) + ')' }}>
            <Img src={staticFile(S.hero)} style={{ width: 560, height: 'auto', maxWidth: 'none', display: 'block', borderRadius: 18, border: '4px solid #fff', boxShadow: '0 0 0 5px ' + theme.colors.primary + ', 0 30px 60px rgba(0,0,0,0.7)' }} />
            {f >= stampAt ? (
              <div style={{ position: 'absolute', left: 0, right: 0, top: 170, display: 'flex', justifyContent: 'center' }}>
                <div style={{ fontFamily: theme.fonts.display, fontSize: 150, color: '#e0262f', border: '12px solid #e0262f', borderRadius: 22, padding: '0 34px', background: 'rgba(255,255,255,0.82)', transform: 'rotate(-12deg) scale(' + interpolate(ss, [0, 0.7, 1], [2.6, 0.92, 1], CLAMP).toFixed(3) + ')', opacity: Math.min(ss * 1.6, 1), whiteSpace: 'nowrap' }}>{S.stampText}</div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

// MatchMath (Video-022 sponsor): the real sponsor logo drops in, an offer counter ticks up on offerWord, the code chip slams on codeWord,
// "your 100" slides in on stakeWord, the sponsor's matching 100 slides in on matchWord and both merge into the doubled stake, the owner's
// real slip swings in on slipWord and a payout ticker counts from the doubled stake to payTo on payWord, then a 'link in bio' tag.
const MatchMath: React.FC<{ e: PicksEdit; f: number }> = ({ e, f }) => {
  const tl = timelineFor(e);
  const M = e.matchMath; if (!M) return null;
  const from = tl.wStart(M.word), to = tl.wStart(M.untilWord);
  if (f < from || f >= to) return null;
  const at = (w: number) => tl.wStart(w);
  const sp = (w: number, cfg: { damping: number; stiffness: number; mass: number } = theme.spring.slap, d = 0) => spring({ frame: f - at(w) - d, fps: e.fps, config: cfg });
  const ex = interpolate(f, [to - 8, to - 1], [0, 1], { ...CLAMP, easing: theme.ease.in });
  const ls = sp(M.word, theme.spring.snappy);
  const offer = interpolate(f, [at(M.offerWord), at(M.offerWord) + 16], [0, M.offerTo], { ...CLAMP, easing: theme.ease.out });
  const merge = interpolate(f, [at(M.matchWord) + 16, at(M.matchWord) + 26], [0, 1], { ...CLAMP, easing: theme.ease.inOut });
  const pay = interpolate(f, [at(M.payWord), at(M.payWord) + 22], [M.stake * 2, M.payTo], { ...CLAMP, easing: theme.ease.out });
  const phase2 = f >= at(M.stakeWord);
  const chip = (txt: string, sub: string, bg: string, fg: string, s: number, dir: number, x: number) => (
    <div style={{ position: 'absolute', left: x, top: 0, width: 300, textAlign: 'center', opacity: Math.min(s * 1.6, 1), transform: 'translateX(' + interpolate(s, [0, 1], [dir * 500, 0]).toFixed(1) + 'px)' }}>
      <div style={{ background: bg, color: fg, borderRadius: 20, padding: '14px 0 6px', fontFamily: theme.fonts.display, fontSize: 110, lineHeight: 1, boxShadow: '0 18px 36px rgba(0,0,0,0.55)', border: '3px solid rgba(255,255,255,0.3)' }}>{txt}</div>
      <div style={{ marginTop: 10, fontFamily: theme.fonts.display, fontSize: 32, color: '#fff', letterSpacing: 2, textShadow: theme.outline }}>{sub}</div>
    </div>
  );
  return (
    <div style={{ position: 'absolute', left: 0, top: SAFE.top + 10, width: 1080, height: 960, zIndex: 9, opacity: 1 - ex }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: Math.min(ls * 1.5, 1), transform: 'translateY(' + interpolate(ls, [0, 1], [-80, 0]).toFixed(1) + 'px)' }}>
        <Img src={staticFile(M.logo)} style={{ width: 620, height: 'auto', maxWidth: 'none', display: 'block', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.7))' }} />
        {!phase2 && f >= at(M.offerWord) ? (
          <div style={{ marginTop: 30, fontFamily: theme.fonts.display, fontSize: 190, lineHeight: 1, color: '#FFD200', textShadow: '6px 6px 0 #000, -6px 6px 0 #000, 6px -6px 0 #000, -6px -6px 0 #000', transform: 'scale(' + interpolate(sp(M.offerWord), [0, 0.7, 1], [1.8, 0.95, 1], CLAMP).toFixed(3) + ')' }}>{fmtInt(offer)}<div style={{ fontSize: 46, color: '#fff', textAlign: 'center', letterSpacing: 3 }}>{M.offerLabel}</div></div>
        ) : null}
      </div>
      {f >= at(M.codeWord) ? (
        <div style={{ position: 'absolute', left: 0, width: 1080, top: phase2 ? 150 : 470, display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: theme.colors.primary, color: theme.colors.ink, borderRadius: 18, padding: '12px 38px 7px', fontFamily: theme.fonts.display, fontSize: phase2 ? 52 : 76, letterSpacing: 3, whiteSpace: 'nowrap', boxShadow: '0 16px 36px rgba(0,0,0,0.55)', transform: 'rotate(-2deg) scale(' + interpolate(sp(M.codeWord), [0, 0.7, 1], [2.0, 0.94, 1], CLAMP).toFixed(3) + ')' }}>CODE {M.code}</div>
        </div>
      ) : null}
      {phase2 && f < at(M.slipWord) + 4 ? (
        <div style={{ position: 'absolute', left: 0, top: 290, width: 1080, height: 300 }}>
          {merge < 1 ? chip(String(M.stake), 'YOU PUT DOWN', '#ffffff', theme.colors.ink, sp(M.stakeWord, theme.spring.snappy), -1, interpolate(merge, [0, 1], [150, 390])) : null}
          {f >= at(M.matchWord) && merge < 1 ? chip(String(M.stake), M.matchLabel, '#FFD200', theme.colors.ink, sp(M.matchWord, theme.spring.snappy), 1, interpolate(merge, [0, 1], [630, 390])) : null}
          {f >= at(M.matchWord) && merge < 1 ? <div style={{ position: 'absolute', left: 500, top: 30, fontFamily: theme.fonts.display, fontSize: 120, color: '#fff', textShadow: theme.outline, opacity: 1 - merge }}>+</div> : null}
          {merge >= 1 ? chip(String(M.stake * 2), 'READY TO PLAY', theme.colors.primary, theme.colors.ink, spring({ frame: f - at(M.matchWord) - 26, fps: e.fps, config: theme.spring.slap }), 0, 390) : null}
        </div>
      ) : null}
      {f >= at(M.slipWord) ? (() => {
        const s = sp(M.slipWord, theme.spring.snappy);
        return (
          <div style={{ position: 'absolute', left: 0, width: 1080, top: 250, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ transform: 'translateX(' + interpolate(s, [0, 1], [900, 0]).toFixed(1) + 'px) rotate(' + interpolate(s, [0, 1], [18, 2]).toFixed(2) + 'deg)', opacity: Math.min(s * 1.6, 1) }}>
              <Img src={staticFile(M.slip)} style={{ width: 520, height: 'auto', maxWidth: 'none', display: 'block', borderRadius: 16, border: '4px solid #fff', boxShadow: '0 28px 56px rgba(0,0,0,0.7)' }} />
            </div>
            {f >= at(M.payWord) ? (
              <div style={{ marginTop: -40, display: 'flex', alignItems: 'baseline', gap: 18, background: 'rgba(8,10,16,0.92)', border: '3px solid ' + theme.colors.primary, borderRadius: 18, padding: '8px 30px 2px', boxShadow: '0 16px 36px rgba(0,0,0,0.6)', transform: 'scale(' + interpolate(sp(M.payWord), [0, 0.7, 1], [1.6, 0.96, 1], CLAMP).toFixed(3) + ')' }}>
                <span style={{ fontFamily: theme.fonts.display, fontSize: 60, color: 'rgba(255,255,255,0.8)' }}>{M.stake * 2} →</span>
                <span style={{ fontFamily: theme.fonts.display, fontSize: 110, color: theme.colors.primary }}>{fmtInt(pay)}</span>
              </div>
            ) : null}
          </div>
        );
      })() : null}
      {f >= at(M.bioWord) ? (
        <div style={{ position: 'absolute', left: 0, width: 1080, top: 880, textAlign: 'center', fontFamily: theme.fonts.display, fontSize: 50, color: '#fff', letterSpacing: 3, textShadow: theme.outline, transform: 'translateY(' + interpolate(sp(M.bioWord, theme.spring.snappy), [0, 1], [20, 0]).toFixed(1) + 'px)' }}>{M.bio}</div>
      ) : null}
    </div>
  );
};

// Collab block (Video-011, Bigfoot VIP): the partner's horizontal clip plays inside a widescreen card mid-frame over gameplay, a collab
// header pill above it, and a four-row slip card below it with every leg blurred; a row unblurs (spring + check) the moment the partner
// says that name. Each window maps a stretch of the timeline to a start point inside the partner clip. A stamp can slam on the slip at the end.
const CollabBlock: React.FC<{ e: PicksEdit; f: number }> = ({ e, f }) => {
  const tl = timelineFor(e);
  const C = e.collab; if (!C) return null;
  const win = C.windows.find((w) => f >= tl.sec(w.at) && f < tl.sec(w.at + w.dur));
  if (!win) return null;
  const from = tl.sec(win.at), to = tl.sec(win.at + win.dur);
  const s = spring({ frame: f - from, fps: e.fps, config: theme.spring.snappy });
  const ex = win.hold ? 0 : interpolate(f, [to - 6, to - 1], [0, 1], CLAMP);
  const vidW = 853, vidH = Math.round(vidW * C.videoH / C.videoW);
  const top = SAFE.top + 10;
  const stampAt = C.stampWord !== undefined ? tl.wStart(C.stampWord) : -1;
  const st = spring({ frame: f - stampAt, fps: e.fps, config: theme.spring.slap });
  return (
    <div style={{ position: 'absolute', left: 0, width: 1080, top, zIndex: 9, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: Math.min(s * 1.5, 1) * (1 - ex), transform: 'translateY(' + (interpolate(s, [0, 1], [30, 0]) - ex * 30).toFixed(1) + 'px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(8,10,16,0.88)', border: '2px solid rgba(255,255,255,0.18)', borderRadius: 14, padding: '8px 22px 6px', fontFamily: theme.fonts.display, fontSize: 30, color: '#fff', letterSpacing: 3, boxShadow: '0 10px 24px rgba(0,0,0,0.5)' }}>
        <span style={{ color: theme.colors.primary }}>●</span>{C.header}
      </div>
      <div style={{ marginTop: 14, width: vidW + 16, height: vidH + 16, borderRadius: 24, background: '#0b0d12', border: '2px solid rgba(255,255,255,0.18)', boxShadow: '0 26px 60px rgba(0,0,0,0.7)', overflow: 'hidden', transform: 'scale(' + interpolate(s, [0, 1], [0.94, 1]).toFixed(3) + ')' }}>
        <div style={{ position: 'absolute', left: 8, top: 8, width: vidW, height: vidH, borderRadius: 18, overflow: 'hidden' }}>
          <Sequence from={from} durationInFrames={Math.max(1, to - from + 30)} layout='none'>
            <OffthreadVideo src={staticFile(C.video)} muted startFrom={tl.sec(win.clipStart)} style={{ width: vidW, height: vidH, maxWidth: 'none', objectFit: 'cover', display: 'block' }} />
          </Sequence>
        </div>
      </div>
      <div style={{ position: 'relative', marginTop: 14, width: 900, background: CARD_BG, borderRadius: 18, border: '1px solid ' + CARD_LINE, boxShadow: '0 20px 50px rgba(0,0,0,0.6)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 22px', borderBottom: '1px solid ' + CARD_LINE }}>
          <div style={{ fontFamily: theme.fonts.display, fontSize: 28, color: '#fff', letterSpacing: 3 }}>{C.slipTitle}</div>
          <div style={{ fontFamily: theme.fonts.display, fontSize: 26, color: theme.colors.primary, letterSpacing: 2 }}>{C.slipRight}</div>
        </div>
        {C.rows.map((r, i) => {
          const at = tl.wStart(r.revealWord);
          const on = f >= at;
          const rs = spring({ frame: Math.max(0, f - at), fps: e.fps, config: theme.spring.slap });
          const blur = on ? interpolate(rs, [0, 1], [9, 0]) : 9;
          const [c1, c2] = teamColors(r.team);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 22px', borderBottom: i < C.rows.length - 1 ? '1px solid ' + CARD_LINE : undefined, background: on ? 'rgba(34,197,94,0.08)' : undefined, transform: on ? 'scale(' + interpolate(rs, [0, 0.6, 1], [1, 1.04, 1], CLAMP).toFixed(3) + ')' : undefined }}>
              <div style={{ width: 70, height: 70, borderRadius: '50%', overflow: 'hidden', border: '3px solid ' + (on ? c2 : 'rgba(255,255,255,0.25)'), background: c1, flex: 'none' }}>
                <Img src={staticFile(r.image)} style={{ width: '100%', height: '100%', maxWidth: 'none', objectFit: 'cover', display: 'block', filter: blur > 0.3 ? 'blur(' + blur.toFixed(1) + 'px)' : undefined, transform: 'scale(1.08)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, filter: blur > 0.3 ? 'blur(' + (blur * 0.8).toFixed(1) + 'px)' : undefined }}>
                <div style={{ fontFamily: theme.fonts.display, fontSize: 34, color: '#fff', letterSpacing: 1, lineHeight: 1 }}>{r.name}</div>
                <div style={{ fontFamily: theme.fonts.display, fontSize: 22, color: 'rgba(255,255,255,0.7)', letterSpacing: 2, lineHeight: 1 }}>{r.line}</div>
              </div>
              <div style={{ fontFamily: theme.fonts.display, fontSize: 36, color: on ? theme.colors.primary : 'rgba(255,255,255,0.5)', letterSpacing: 1, filter: blur > 0.3 ? 'blur(' + (blur * 0.6).toFixed(1) + 'px)' : undefined, fontVariantNumeric: 'tabular-nums' }}>{r.price}</div>
              <div style={{ width: 36, textAlign: 'center', fontFamily: theme.fonts.display, fontSize: 32, color: theme.colors.primary, opacity: on ? Math.min(rs * 1.5, 1) : 0, transform: 'scale(' + (on ? interpolate(rs, [0, 1], [0.4, 1]) : 0.4).toFixed(3) + ')' }}>✓</div>
            </div>
          );
        })}
        {stampAt >= 0 && f >= stampAt && C.stampText ? (
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%) rotate(-10deg) scale(' + interpolate(st, [0, 1], [3, 1]).toFixed(3) + ')', opacity: Math.min(st * 2.5, 1), color: theme.colors.primary, border: '10px solid ' + theme.colors.primary, borderRadius: 18, padding: '2px 24px 0', fontFamily: theme.fonts.display, fontSize: 116, letterSpacing: 4, whiteSpace: 'nowrap', textShadow: '0 0 18px rgba(0,0,0,0.7)', background: 'rgba(0,20,8,0.45)', boxShadow: '0 0 36px rgba(34,197,94,0.45), inset 0 0 26px rgba(0,0,0,0.45)' }}>{C.stampText}</div>
        ) : null}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// Education cards (Video-006). Styled after broadcast/betting-network graphics: flat navy card, hairline dividers, one accent,
// condensed caps, numbers in tabular figures. Motion is restrained: slide + settle, no bounce, no glow.
const CARD_BG = '#0f172a';
const CARD_LINE = 'rgba(255,255,255,0.12)';
const ladders = (e: PicksEdit) => (Array.isArray(e.ladder) ? e.ladder : e.ladder ? [e.ladder] : []);
const Ladder: React.FC<{ e: PicksEdit; f: number }> = ({ e, f }) => <>{ladders(e).map((L, i) => <LadderCard key={'ladder' + i} e={e} f={f} L={L} />)}</>;
const LadderCard: React.FC<{ e: PicksEdit; f: number; L: LadderSpec }> = ({ e, f, L }) => {
  const tl = timelineFor(e);
  const from = tl.wStart(L.word), to = tl.wStart(L.untilWord);
  if (f < from || f >= to) return null;
  const s = spring({ frame: f - from, fps: e.fps, config: theme.spring.smooth });
  const ex = interpolate(f, [to - 8, to - 1], [0, 1], CLAMP);
  const W = 900, thumbW = L.big ? 520 : 400, thumbH = L.big ? 311 : 225;
  return (
    <div style={{ position: 'absolute', left: (1080 - W) / 2, top: L.top ?? SAFE.top + 20, width: W, zIndex: 8, opacity: Math.min(s * 1.5, 1) * (1 - ex), transform: 'translateY(' + (interpolate(s, [0, 1], [30, 0]) - ex * 40).toFixed(1) + 'px)' }}>
      <div style={{ background: CARD_BG, borderRadius: 18, border: '1px solid ' + CARD_LINE, boxShadow: '0 20px 50px rgba(0,0,0,0.6)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 26px', borderBottom: '1px solid ' + CARD_LINE }}>
          <div style={{ fontFamily: theme.fonts.display, fontSize: 36, color: '#fff', letterSpacing: 2 }}>{L.title}</div>
          <div style={{ fontFamily: theme.fonts.display, fontSize: 26, color: theme.colors.primary, letterSpacing: 2 }}>1 UNIT TOTAL</div>
        </div>
        {L.items.map((it, i) => {
          const at = tl.wStart(it.word); if (f < at) return null;
          const si = spring({ frame: f - at, fps: e.fps, config: theme.spring.snappy });
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '12px 26px', borderBottom: i < L.items.length - 1 ? '1px solid ' + CARD_LINE : undefined, opacity: si, transform: 'translateX(' + interpolate(si, [0, 1], [60, 0]).toFixed(1) + 'px)' }}>
              <Img src={staticFile(it.image)} style={{ width: thumbW, height: thumbH, maxWidth: 'none', objectFit: 'cover', objectPosition: 'left top', borderRadius: 10, display: 'block', border: '1px solid rgba(255,255,255,0.18)', flex: 'none' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontFamily: theme.fonts.display, fontSize: 84, color: theme.colors.primary, lineHeight: 1, letterSpacing: 1, fontVariantNumeric: 'tabular-nums' }}>{it.badge}</div>
                <div style={{ fontFamily: theme.fonts.display, fontSize: 30, color: 'rgba(255,255,255,0.85)', letterSpacing: 2 }}>{it.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
const PayoutTable: React.FC<{ e: PicksEdit; f: number }> = ({ e, f }) => {
  const tl = timelineFor(e);
  const T = e.table; if (!T) return null;
  const from = tl.wStart(T.word), to = tl.wStart(T.untilWord);
  if (f < from || f >= to) return null;
  const s = spring({ frame: f - from, fps: e.fps, config: theme.spring.smooth });
  const ex = interpolate(f, [to - 8, to - 1], [0, 1], CLAMP);
  const W = 940;
  const [c1, c2] = teamColors((T as any).team);
  const tone = (t: string) => (t === 'green' ? WIN_GREEN : t === 'red' ? '#ff4d4d' : '#e5e7eb');
  // Owner, 2026-09-23: the old flat panel "looks like AI". This is a broadcast stat bar - a team-coloured
  // header with a lean, rows that slide in behind a filling accent bar, and the number big enough to read at a glance.
  return (
    <div style={{ position: 'absolute', left: (1080 - W) / 2, top: SAFE.top + 10, width: W, zIndex: 8, opacity: Math.min(s * 1.6, 1) * (1 - ex), transform: 'translateY(' + (interpolate(s, [0, 1], [46, 0]) - ex * 46).toFixed(1) + 'px) skewX(-1.6deg)' }}>
      {/* header */}
      <div style={{ position: 'relative', height: 96, borderRadius: '22px 22px 0 0', overflow: 'hidden', background: 'linear-gradient(105deg, ' + c1 + ' 0%, ' + c2 + ' 78%)', boxShadow: '0 18px 44px rgba(0,0,0,0.55)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.28), rgba(255,255,255,0) 58%)' }} />
        <div style={{ position: 'absolute', left: -40, top: 0, width: 150, height: '100%', background: 'rgba(255,255,255,0.14)', transform: 'skewX(-18deg)' }} />
        <div style={{ position: 'absolute', left: 34, top: 0, height: '100%', display: 'flex', alignItems: 'center', fontFamily: theme.fonts.display, fontSize: 44, color: '#fff', letterSpacing: 2.5, textShadow: '0 4px 0 rgba(0,0,0,0.35)' }}>{T.title}</div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 6, background: theme.colors.primary }} />
      </div>
      {/* rows */}
      <div style={{ background: 'linear-gradient(180deg, #111c31 0%, #0a1120 100%)', borderRadius: '0 0 22px 22px', border: '2px solid rgba(255,255,255,0.10)', borderTop: 'none', boxShadow: '0 26px 60px rgba(0,0,0,0.65)', overflow: 'hidden' }}>
        {T.rows.map((r, i) => {
          const at = tl.wStart(r.word); if (f < at) return null;
          const si = spring({ frame: f - at, fps: e.fps, config: theme.spring.snappy });
          const bar = interpolate(f, [at, at + 10], [0, 1], { ...CLAMP, easing: theme.ease.out });
          const flash = interpolate(f, [at, at + 6], [0.5, 0], CLAMP);
          // ordinals never count up: rolling 24TH through "22TH" reads as a typo (owner, 2026-09-23)
          const vUp = String(r.value).trim().toUpperCase(); const ordinal = ['TH', 'ST', 'ND', 'RD'].some((x) => vUp.endsWith(x));
          const m = ordinal ? null : /^([+-]?)(\d+(?:\.\d+)?)(.*)$/.exec(r.value);
          let shown = r.value;
          if (m) { const p = interpolate(f, [at + 2, at + 14], [0, 1], { ...CLAMP, easing: theme.ease.out }); const dec = (m[2].split('.')[1] || '').length; shown = m[1] + (parseFloat(m[2]) * p).toFixed(dec) + m[3]; }
          return (
            <div key={i} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 116, padding: '0 30px 0 34px', borderTop: i ? '1px solid rgba(255,255,255,0.08)' : undefined, opacity: Math.min(si * 1.6, 1), transform: 'translateX(' + interpolate(si, [0, 1], [-64, 0]).toFixed(1) + 'px)' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: (bar * 100).toFixed(1) + '%', background: 'linear-gradient(90deg, ' + tone(r.tone) + '22, transparent 70%)' }} />
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 10, background: tone(r.tone), boxShadow: '0 0 18px ' + tone(r.tone) }} />
              <div style={{ position: 'absolute', inset: 0, background: '#fff', opacity: flash }} />
              <div style={{ fontFamily: theme.fonts.display, fontSize: 40, color: 'rgba(255,255,255,0.92)', letterSpacing: 2, zIndex: 1 }}>{r.label}</div>
              <div style={{ fontFamily: theme.fonts.display, fontSize: 74, color: tone(r.tone), letterSpacing: 0.5, fontVariantNumeric: 'tabular-nums', textShadow: '0 0 26px ' + tone(r.tone) + '66, 0 5px 0 rgba(0,0,0,0.4)', zIndex: 1, transform: 'scale(' + interpolate(si, [0, 0.6, 1], [0.7, 1.12, 1], CLAMP).toFixed(3) + ')' }}>{shown}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// TD tally (Video-007 hook): four player chips with last season's TD count stamping in, then the total rolls up and slams.
// Broadcast-scoreboard look: dark plate, hairlines, one accent, tabular numerals. Restrained motion.
const Tally: React.FC<{ e: PicksEdit; f: number }> = ({ e, f }) => {
  const tl = timelineFor(e);
  const T = e.tally; if (!T) return null;
  const from = tl.wStart(T.word), to = tl.wStart(T.untilWord), totalAt = tl.wStart(T.totalWord);
  if (f < from || f >= to) return null;
  const step = T.stepFrames ?? 9;
  const s = spring({ frame: f - from, fps: e.fps, config: theme.spring.smooth });
  const ex = interpolate(f, [to - 8, to - 1], [0, 1], CLAMP);
  const total = T.items.reduce((a, it) => a + it.value, 0);
  const shownSum = T.items.reduce((a, it, i) => (f >= from + i * step ? a + it.value : a), 0);
  const ts = spring({ frame: f - totalAt, fps: e.fps, config: theme.spring.slap });
  const rolled = f >= totalAt ? Math.round(interpolate(f, [totalAt, totalAt + 12], [shownSum, total], { ...CLAMP, easing: theme.ease.out })) : shownSum;
  const W = 940;
  return (
    <div style={{ position: 'absolute', left: (1080 - W) / 2, top: SAFE.top + 30, width: W, zIndex: 8, opacity: Math.min(s * 1.5, 1) * (1 - ex), transform: 'translateY(' + (interpolate(s, [0, 1], [30, 0]) - ex * 40).toFixed(1) + 'px)' }}>
      <div style={{ background: CARD_BG, borderRadius: 18, border: '1px solid ' + CARD_LINE, boxShadow: '0 20px 50px rgba(0,0,0,0.6)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 26px', borderBottom: '1px solid ' + CARD_LINE }}>
          <div style={{ fontFamily: theme.fonts.display, fontSize: 32, color: 'rgba(255,255,255,0.85)', letterSpacing: 3 }}>{T.totalLabel}</div>
          <div style={{ fontFamily: theme.fonts.display, fontSize: 96, lineHeight: 1, color: f >= totalAt ? theme.colors.primary : '#fff', fontVariantNumeric: 'tabular-nums', transform: 'scale(' + (f >= totalAt ? interpolate(ts, [0, 0.6, 1], [1.5, 0.96, 1], CLAMP) : 1).toFixed(3) + ')', transformOrigin: '100% 50%', textShadow: f >= totalAt ? '0 0 26px ' + theme.colors.primary + '88' : undefined }}>{rolled}</div>
        </div>
        <div style={{ display: 'flex', padding: '16px 18px 20px', gap: 12 }}>
          {T.items.map((it, i) => {
            const at = from + i * step;
            const stamped = f >= at;
            const si = spring({ frame: Math.max(0, f - at), fps: e.fps, config: theme.spring.snappy });
            const blur = T.blurUntilStamped ? (stamped ? interpolate(si, [0, 1], [14, 0]) : 14) : 0;
            const [c1, c2] = teamColors(it.team);
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: T.blurUntilStamped ? Math.max(0.55, si) : si, transform: 'translateY(' + (stamped ? interpolate(si, [0, 1], [24, 0]) : 0).toFixed(1) + 'px) scale(' + (stamped ? interpolate(si, [0, 1], [0.92, 1]) : 0.92).toFixed(3) + ')' }}>
                <div style={{ width: 150, height: 150, borderRadius: '50%', overflow: 'hidden', border: '4px solid ' + (stamped ? c2 : 'rgba(255,255,255,0.25)'), background: c1, boxShadow: '0 8px 18px rgba(0,0,0,0.5)' }}>
                  <Img src={staticFile(it.image)} style={{ width: '100%', height: '100%', maxWidth: 'none', objectFit: 'cover', display: 'block', filter: blur > 0.3 ? 'blur(' + blur.toFixed(1) + 'px)' : undefined, transform: 'scale(1.08)' }} />
                </div>
                <div style={{ fontFamily: theme.fonts.display, fontSize: 72, lineHeight: 1, color: '#fff', fontVariantNumeric: 'tabular-nums', opacity: stamped ? si : 0 }}>{it.value}</div>
                <div style={{ fontFamily: theme.fonts.display, fontSize: 24, color: 'rgba(255,255,255,0.7)', letterSpacing: 2, whiteSpace: 'nowrap', opacity: stamped ? si : 0.35 }}>{stamped ? it.label : '?'}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
// Closing stamp (Video-005): the slip comes back sharp and a rotated stamp slams onto it.
const SlipStamp: React.FC<{ image: string; text: string; fps: number; textAt?: number; shift?: number; width?: number; center?: boolean; payout?: { from: number; to: number; at: number; label?: string } }> = ({ image, text, fps, textAt = 6, shift = 0, width = 640, center = false, payout }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f, fps, config: theme.spring.smooth });
  const st = spring({ frame: f - textAt, fps, config: theme.spring.slap });
  return (
    <div style={{ position: 'absolute', left: shift, width: 1080, top: center ? SAFE.top : SAFE.top + 30, height: center ? SAFE_H : undefined, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: center ? 'center' : 'flex-start', zIndex: 9, opacity: Math.min(s * 1.5, 1), transform: 'translateY(' + interpolate(s, [0, 1], [40, 0]).toFixed(1) + 'px) scale(' + interpolate(s, [0, 1], [0.85, 1]).toFixed(3) + ')' }}>
      <div style={{ position: 'relative' }}>
        <Img src={staticFile(image)} style={{ width, maxWidth: 'none', maxHeight: SAFE_H - 80, objectFit: 'contain', borderRadius: 16, boxShadow: '0 16px 40px rgba(0,0,0,0.65)' + (center ? ', 0 0 60px ' + theme.colors.glow : ''), border: center ? '4px solid ' + theme.colors.primary : '3px solid rgba(255,255,255,0.25)' }} />
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%) rotate(-12deg) scale(' + interpolate(st, [0, 1], [2.4, 1]).toFixed(3) + ')', opacity: Math.min(st * 2, 1), color: theme.colors.primary, border: '10px solid ' + theme.colors.primary, borderRadius: 18, padding: '6px 28px 0', fontFamily: theme.fonts.display, fontSize: 118, letterSpacing: 4, whiteSpace: 'nowrap', textShadow: '0 0 18px rgba(0,0,0,0.6)', boxShadow: '0 0 30px rgba(0,0,0,0.5), inset 0 0 30px rgba(0,0,0,0.4)', background: 'rgba(0,0,0,0.35)' }}>{text}</div>
      </div>
      {payout && f >= payout.at ? (() => { const p = interpolate(f, [payout.at, payout.at + 22], [0, 1], { ...CLAMP, easing: theme.ease.out }); const v = payout.from + (payout.to - payout.from) * p; const ps = spring({ frame: f - payout.at, fps, config: theme.spring.slap }); const landed = f >= payout.at + 22; return (
        <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 18, opacity: Math.min(ps * 1.5, 1), transform: 'translateY(' + interpolate(ps, [0, 1], [30, 0]).toFixed(1) + 'px) scale(' + (landed ? 1 + 0.12 * Math.max(0, 1 - (f - payout.at - 22) / 7) : 1).toFixed(3) + ')' }}>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontFamily: theme.fonts.display, fontSize: 64, textShadow: theme.outline }}>{payout.from.toLocaleString('en-US')}</div>
          <div style={{ color: theme.colors.gold, fontFamily: theme.fonts.display, fontSize: 64, textShadow: theme.outline }}>→</div>
          <div style={{ color: theme.colors.primary, fontFamily: theme.fonts.display, fontSize: 96, textShadow: theme.outline + ', 0 0 24px ' + theme.colors.glow, fontVariantNumeric: 'tabular-nums' }}>{v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>); })() : null}
    </div>
  );
};
const MoneyPop: React.FC<{ image: string; label: string; dur: number; fps: number }> = ({ image, label, dur, fps }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f, fps, config: theme.spring.bouncy });
  const ex = interpolate(f, [dur - 8, dur - 1], [0, 1], { ...CLAMP, easing: theme.ease.in });
  return (
    <div style={{ position: 'absolute', left: 0, width: 1080, top: SAFE_CY - 200, textAlign: 'center', zIndex: 9, opacity: Math.min(s * 1.5, 1) * (1 - ex), transform: 'translateY(' + (interpolate(s, [0, 1], [50, 0]) - ex * 30).toFixed(1) + 'px) scale(' + interpolate(s, [0, 1], [0.5, 1]).toFixed(3) + ')' }}>
      <Img src={staticFile(image)} style={{ width: 300, maxWidth: 'none', display: 'block', margin: '0 auto', filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.6))' }} />
      <div style={{ color: theme.colors.gold, fontSize: 84, fontFamily: theme.fonts.display, textShadow: theme.outline, marginTop: 4, letterSpacing: 2 }}>{label}</div>
    </div>
  );
};
const BetSlipTease: React.FC<{ image: string; dur: number; fps: number }> = ({ image, dur, fps }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f, fps, config: theme.spring.smooth });
  const ex = interpolate(f, [dur - 8, dur - 1], [0, 1], { ...CLAMP, easing: theme.ease.in });
  return (
    <div style={{ position: 'absolute', left: 0, width: 1080, top: SAFE.top + 40, display: 'flex', justifyContent: 'center', zIndex: 8, opacity: Math.min(s * 1.5, 1) * (1 - ex), transform: 'translateY(' + (interpolate(s, [0, 1], [40, 0]) + Math.sin(f / 30) * 3).toFixed(1) + 'px) scale(' + interpolate(s, [0, 1], [0.8, 1]).toFixed(3) + ')' }}>
      <Img src={staticFile(image)} style={{ width: 600, maxWidth: 'none', maxHeight: SAFE_H - 80, objectFit: 'contain', filter: 'blur(9px)', borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.6)', border: '3px solid rgba(255,255,255,0.22)' }} />
    </div>
  );
};
// Stat card v2 (owner 2026-09-09: "they can be animated better, kinda ugly"): glass card with a team-colour glow, the number
// counts up and pops on landing, the label wipes in under it, one light sweep, whip-out exit with blur.
const StatCard: React.FC<{ value: string; label?: string; team: string; dur: number; fps: number; shift?: number }> = ({ value, label, team, dur, fps, shift = 0 }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f, fps, config: theme.spring.slap });
  const sl = spring({ frame: f - 5, fps, config: theme.spring.snappy });
  const ex = interpolate(f, [dur - 9, dur - 1], [0, 1], { ...CLAMP, easing: theme.ease.in });
  const [c1, c2] = teamColors(team);
  // count-up on the leading number ("19 OF 20" -> 19, "121.8 YDS" -> 121.8); non-numeric values just land.
  const m = /^(\d+(?:\.\d+)?)(.*)$/.exec(value);
  const COUNT = 14;
  let shown = value;
  if (m) {
    const target = parseFloat(m[1]);
    const dec = (m[1].split('.')[1] || '').length;
    const p = interpolate(f, [2, 2 + COUNT], [0, 1], { ...CLAMP, easing: theme.ease.out });
    shown = (target * p).toFixed(dec) + m[2];
  }
  const landed = m ? f >= 2 + COUNT : true;
  const pop = landed && m ? 1 + 0.14 * Math.max(0, 1 - (f - (2 + COUNT)) / 7) : 1;
  const sweep = interpolate(f, [8, 30], [-60, 160], CLAMP);
  return (
    <div style={{ position: 'absolute', left: shift, width: 1080, top: SAFE.top + 30, display: 'flex', justifyContent: 'center', zIndex: 7, opacity: Math.min(s * 1.5, 1) * (1 - ex), transform: 'translateY(' + (interpolate(s, [0, 1], [-70, 0]) - ex * 90).toFixed(1) + 'px) rotate(' + interpolate(s, [0, 1], [-4, 0]).toFixed(2) + 'deg) scale(' + interpolate(s, [0, 0.7, 1], [0.7, 1.05, 1], CLAMP).toFixed(3) + ')', filter: ex > 0.1 ? 'blur(' + (ex * 10).toFixed(1) + 'px)' : undefined }}>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', inset: -30, borderRadius: 40, background: c1, filter: 'blur(34px)', opacity: 0.55 }} />
        <div style={{ position: 'relative', background: 'linear-gradient(160deg, rgba(14,16,22,0.96), rgba(22,26,36,0.92))', border: '2px solid rgba(255,255,255,0.14)', borderTop: '8px solid ' + c2, borderRadius: 22, padding: '14px 40px 14px', textAlign: 'center', boxShadow: '0 22px 50px rgba(0,0,0,0.6)', overflow: 'hidden', minWidth: 420, maxWidth: shift ? 700 : undefined }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, width: 120, left: sweep + '%', background: 'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0) 100%)', transform: 'skewX(-18deg)', pointerEvents: 'none' }} />
          <div style={{ color: '#fff', fontSize: 104, fontFamily: theme.fonts.display, lineHeight: 1, letterSpacing: 1, transform: 'scale(' + pop.toFixed(3) + ')', textShadow: '0 0 24px ' + c2 + '88, 0 4px 0 rgba(0,0,0,0.5)', fontVariantNumeric: 'tabular-nums' }}>{shown}</div>
          <div style={{ margin: '10px auto 0', height: 5, width: interpolate(sl, [0, 1], [0, 100]).toFixed(1) + '%', background: 'linear-gradient(90deg,' + c2 + ',' + c1 + ')', borderRadius: 3 }} />
          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 30, fontFamily: theme.fonts.display, letterSpacing: 3, marginTop: 8, transform: 'translateY(' + interpolate(sl, [0, 1], [40, 0]).toFixed(1) + 'px)', opacity: sl }}>{label}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Rail (rules 1 + 2): full-frame overlay, bottom to top, tile size fits the safe height for any leg count; state on anchor word.
const LegRail: React.FC<{ e: PicksEdit; f: number }> = ({ e, f }) => {
  const tl = timelineFor(e);
  const rail = e.legs.filter((l) => (e.rail.tile === 'logo' ? l.logo : l.headshot) && !l.noRail);
  const n = rail.length;
  if (n === 0) return null;
  const gap = n > 6 ? 14 : 24;
  const size = Math.min(140, Math.floor((SAFE_H - 100 - gap * (n - 1)) / n));
  const pad = Math.round(size * 0.13), step = size + gap;
  const height = n * size + (n - 1) * gap;
  const bottom = 1920 - (SAFE_CY + height / 2);
  const starts = rail.map((l) => tl.wStart(l.anchor));
  const centers = rail.map((_, i) => i * step + size / 2);
  const fill = interpolate(f, [0, ...starts], [0, ...centers], CLAMP);
  return (
    <div style={{ position: 'absolute', left: 50, bottom, width: size, height, zIndex: 5 }}>
      <div style={{ position: 'absolute', left: size / 2 - 3, bottom: 0, width: 6, height, background: 'rgba(255,255,255,0.22)' }} />
      <div style={{ position: 'absolute', left: size / 2 - 3, bottom: 0, width: 6, height: fill, background: theme.colors.primary, boxShadow: '0 0 10px ' + theme.colors.primary }} />
      {rail.map((leg, i) => {
        const startF = starts[i];
        const endF = tl.sec(leg.end); // current for the whole block, so SGP partners stay lit together
        const state = f < startF ? 'upcoming' : f < endF ? 'current' : 'past';
        const pulse = state === 'current' ? interpolate(spring({ frame: f - startF, fps: e.fps, config: theme.spring.slap }), [0, 1], [1.35, 1]) : 1;
        const opacity = state === 'current' ? 1 : state === 'past' ? 0.45 : 0.35;
        const blur = state === 'upcoming' ? 6 : 0;
        const border = state === 'current' ? '5px solid ' + theme.colors.primary : '2px solid rgba(255,255,255,0.4)';
        const shadow = state === 'current' ? '0 0 20px ' + theme.colors.primary + ', 0 4px 12px rgba(0,0,0,0.6)' : '0 4px 12px rgba(0,0,0,0.6)';
        const img = e.rail.tile === 'logo' ? leg.logo! : leg.headshot!;
        return (
          <div key={leg.name} style={{ position: 'absolute', bottom: i * step, width: size, height: size, borderRadius: '50%', boxSizing: 'border-box', border, background: theme.colors.ink, opacity, transform: 'scale(' + pulse.toFixed(3) + ')', boxShadow: shadow, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <Img src={staticFile(img)} style={e.rail.tile === 'logo' ? { width: size - pad * 2, height: size - pad * 2, maxWidth: 'none', objectFit: 'contain', filter: 'blur(' + blur + 'px)' } : { width: '100%', height: '100%', maxWidth: 'none', objectFit: 'cover', filter: 'blur(' + blur + 'px)' }} />
          </div>
        );
      })}
    </div>
  );
};



// ---------------------------------------------------------------------------------------------------------------------
// Video-016 engagement cards. Real receipts instead of emoji: a headline card per quote, a before/after card, a depth
// chart with names struck through. All sit in the top band (same slot as StatCard) and honour the ladder shift.
const cardShell = (f: number, fps: number, dur: number) => {
  const s = spring({ frame: f, fps, config: theme.spring.slap });
  const ex = interpolate(f, [dur - 9, dur - 1], [0, 1], { ...CLAMP, easing: theme.ease.in });
  return { s, ex, style: { opacity: Math.min(s * 1.5, 1) * (1 - ex), transform: 'translateY(' + (interpolate(s, [0, 1], [-60, 0]) - ex * 80).toFixed(1) + 'px) rotate(' + interpolate(s, [0, 1], [-3, 0]).toFixed(2) + 'deg) scale(' + interpolate(s, [0, 0.7, 1], [0.8, 1.04, 1], CLAMP).toFixed(3) + ')', filter: ex > 0.1 ? 'blur(' + (ex * 10).toFixed(1) + 'px)' : undefined } as React.CSSProperties };
};
const NewsCard: React.FC<{ n: NewsCardSpec; dur: number; fps: number; shift?: number }> = ({ n, dur, fps, shift = 0 }) => {
  const f = useCurrentFrame();
  const { style } = cardShell(f, fps, dur);
  // quote types on fast (8 frames), then a marker highlight sweeps behind the words themselves
  const TYPE = 8;
  const typed = Math.round(interpolate(f, [4, 4 + TYPE], [0, n.quote.length], CLAMP));
  const hl = interpolate(f, [4 + TYPE, 4 + TYPE + 12], [0, 100], { ...CLAMP, easing: theme.ease.out });
  return (
    <div style={{ position: 'absolute', left: shift, width: 1080, top: n.top ?? SAFE.top + 20, display: 'flex', justifyContent: 'center', zIndex: 7, ...style }}>
      <div style={{ width: 700, background: '#fbfbfa', borderRadius: 20, boxShadow: '0 20px 50px rgba(0,0,0,0.6)', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 22px 8px', borderBottom: '1px solid #e6e6e3' }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: '#d32f2f' }} />
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 21, color: '#111', letterSpacing: 1.5 }}>{n.outlet}</div>
          {n.date ? <div style={{ fontFamily: theme.fonts.body, fontSize: 20, color: '#777' }}>· {n.date}</div> : null}
        </div>
        <div style={{ padding: '10px 22px 14px' }}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 25, lineHeight: 1.2, color: '#333' }}>{n.headline}</div>
          <div style={{ marginTop: 8, paddingLeft: 14, borderLeft: '6px solid ' + theme.colors.primary }}>
            <span style={{ fontFamily: theme.fonts.display, fontSize: 52, lineHeight: 1.12, color: '#0b0d12', letterSpacing: 0.5, backgroundImage: 'linear-gradient(rgba(255,214,0,0.75), rgba(255,214,0,0.75))', backgroundRepeat: 'no-repeat', backgroundSize: hl.toFixed(1) + '% 100%', backgroundPosition: '0 0', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone', padding: '0 6px', borderRadius: 4 } as React.CSSProperties}>{n.quote.slice(0, typed)}</span>
          </div>
          {n.by ? <div style={{ marginTop: 6, fontFamily: theme.fonts.body, fontSize: 20, color: '#555', fontWeight: 600 }}>{n.by}</div> : null}
        </div>
      </div>
    </div>
  );
};
const SplitCard: React.FC<{ sp: SplitCardSpec; dur: number; afterAt: number; fps: number; shift?: number }> = ({ sp, dur, afterAt, fps, shift = 0 }) => {
  const f = useCurrentFrame();
  const { style } = cardShell(f, fps, dur);
  const as = spring({ frame: f - afterAt, fps, config: theme.spring.slap });
  const after = f >= afterAt;
  // two-row grid: the values and the arrow share one row so the arrow sits dead centre on the numbers; labels sit underneath
  const VALUE = 78;
  const cell: React.CSSProperties = { textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', height: VALUE + 6 };
  return (
    <div style={{ position: 'absolute', left: shift, width: 1080, top: SAFE.top + 20, display: 'flex', justifyContent: 'center', zIndex: 7, ...style }}>
      <div style={{ width: 720, background: 'linear-gradient(160deg, rgba(14,16,22,0.96), rgba(22,26,36,0.93))', borderRadius: 22, border: '2px solid rgba(255,255,255,0.14)', boxShadow: '0 22px 50px rgba(0,0,0,0.6)', padding: '14px 22px 18px' }}>
        {sp.title ? <div style={{ textAlign: 'center', color: theme.colors.gold, fontFamily: theme.fonts.display, fontSize: 28, letterSpacing: 3, marginBottom: 8 }}>{sp.title}</div> : null}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 1fr', alignItems: 'center' }}>
          <div style={{ ...cell, opacity: after ? 0.5 : 1 }}><span style={{ color: '#ff5a5a', fontFamily: theme.fonts.display, fontSize: VALUE, lineHeight: 1, textShadow: '0 4px 0 rgba(0,0,0,0.5)', marginTop: 6 }}>{sp.before.value}</span></div>
          <div style={cell}>
            <svg width={64} height={40} viewBox='0 0 64 40' style={{ opacity: after ? 1 : 0.35, transform: 'translateX(' + (after ? interpolate(as, [0, 1], [-20, 0]) : 0).toFixed(1) + 'px)', overflow: 'visible' }}>
              <path d='M4 20 H50 M36 6 L54 20 L36 34' fill='none' stroke={theme.colors.gold} strokeWidth={8} strokeLinecap='round' strokeLinejoin='round' />
            </svg>
          </div>
          <div style={cell}>{after
            ? <span style={{ display: 'inline-block', color: theme.colors.primary, fontFamily: theme.fonts.display, fontSize: VALUE, lineHeight: 1, textShadow: '0 4px 0 rgba(0,0,0,0.5)', marginTop: 6, opacity: Math.min(as * 1.5, 1), transform: 'scale(' + interpolate(as, [0, 0.6, 1], [1.8, 0.95, 1], CLAMP).toFixed(3) + ')' }}>{sp.after.value}</span>
            : <span style={{ color: 'rgba(255,255,255,0.25)', fontFamily: theme.fonts.display, fontSize: VALUE, lineHeight: 1, marginTop: 6 }}>?</span>}</div>
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.88)', fontFamily: theme.fonts.display, fontSize: 26, letterSpacing: 2, opacity: after ? 0.5 : 1 }}>{sp.before.label}</div>
          <div />
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.88)', fontFamily: theme.fonts.display, fontSize: 26, letterSpacing: 2, opacity: after ? Math.min(as * 1.5, 1) : 0 }}>{sp.after.label}</div>
        </div>
      </div>
    </div>
  );
};
const StrikeCard: React.FC<{ k: StrikeCardSpec; dur: number; rowAts: number[]; fps: number; shift?: number }> = ({ k, dur, rowAts, fps, shift = 0 }) => {
  const f = useCurrentFrame();
  const { style } = cardShell(f, fps, dur);
  const [c1, c2] = teamColors(k.team);
  return (
    <div style={{ position: 'absolute', left: shift, width: 1080, top: SAFE.top + 20, display: 'flex', justifyContent: 'center', zIndex: 7, ...style }}>
      <div style={{ width: 700, background: 'rgba(12,14,20,0.95)', borderRadius: 22, overflow: 'hidden', boxShadow: '0 22px 50px rgba(0,0,0,0.6)', border: '2px solid rgba(255,255,255,0.12)' }}>
        <div style={{ background: c1, borderBottom: '6px solid ' + c2, padding: '10px 24px 6px', color: '#fff', fontFamily: theme.fonts.display, fontSize: 38, letterSpacing: 3 }}>{k.title}</div>
        <div style={{ padding: '10px 24px 16px' }}>
          {k.rows.map((r, i) => {
            const at = rowAts[i];
            const rs = spring({ frame: f - i * 4, fps, config: theme.spring.snappy });
            const hit = f >= at;
            const line = interpolate(f, [at, at + 7], [0, 100], { ...CLAMP, easing: theme.ease.out });
            const ts = spring({ frame: f - at, fps, config: theme.spring.slap });
            const out = r.tone === 'out';
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: i ? '1px solid rgba(255,255,255,0.1)' : undefined, opacity: Math.min(rs * 1.5, 1), transform: 'translateX(' + interpolate(rs, [0, 1], [-40, 0]).toFixed(1) + 'px)' }}>
                <div style={{ position: 'relative', color: hit && out ? 'rgba(255,255,255,0.45)' : '#fff', fontFamily: theme.fonts.display, fontSize: 46, letterSpacing: 1 }}>
                  {r.name}
                  {out ? <div style={{ position: 'absolute', left: -6, top: '52%', height: 7, width: 'calc(' + line + '% + 12px)', background: '#ff3b3b', borderRadius: 4, boxShadow: '0 0 10px rgba(255,59,59,0.8)' }} /> : null}
                </div>
                {hit ? <div style={{ opacity: Math.min(ts * 1.5, 1), transform: 'scale(' + interpolate(ts, [0, 1], [1.8, 1]).toFixed(3) + ') rotate(-3deg)', background: out ? '#ff3b3b' : theme.colors.gold, color: out ? '#fff' : theme.colors.ink, fontFamily: theme.fonts.display, fontSize: 32, letterSpacing: 1.5, padding: '6px 14px 3px', borderRadius: 10, whiteSpace: 'nowrap' }}>{r.tag}</div> : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Money ladder (Video-016 ladder challenge): the rung column up the right side for the whole video. Rungs cascade in from the
// bottom at frame 0; completed rungs are solid green, today's target rung pulses until lockWord then locks green with a burst
// and the rail fill climbs to it; the top rung glows gold (and kicks on topWord). Sits inside SAFE.right so TikTok's buttons
// never cover it; every other card shifts LADDER_SHIFT px left to clear the column.
const LADDER_SHIFT = -100;
const MoneyLadder: React.FC<{ e: PicksEdit; f: number }> = ({ e, f }) => {
  const L = e.moneyLadder; if (!L) return null;
  const tl = timelineFor(e);
  const n = L.rungs.length;
  const cx = 888, pillW = 128, pillH = 56;
  const topY = 372, botY = 1384, step = (botY - topY) / Math.max(1, n - 1);
  const yOf = (i: number) => botY - i * step;
  const lockAt = tl.wStart(L.lockWord);
  const locked = f >= lockAt;
  const lockS = spring({ frame: f - lockAt, fps: e.fps, config: theme.spring.slap });
  const topAt = L.topWord !== undefined ? tl.wStart(L.topWord) : -999;
  const topKick = f >= topAt ? interpolate(spring({ frame: f - topAt, fps: e.fps, config: theme.spring.slap }), [0, 1], [1.45, 1]) : 1;
  const fillTo = locked ? interpolate(lockS, [0, 1], [yOf(L.current - 1), yOf(L.current)]) : yOf(Math.max(0, L.current - 1));
  const railIn = interpolate(f, [0, 16], [botY, fillTo], { ...CLAMP, easing: theme.ease.out });
  const fillTop = f < 16 ? railIn : fillTo;
  const titleS = spring({ frame: f - 2, fps: e.fps, config: theme.spring.slap });
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 6, pointerEvents: 'none' }}>
      {/* title chip */}
      <div style={{ position: 'absolute', left: cx - 78, width: 156, top: topY - 112, textAlign: 'center', opacity: Math.min(titleS * 1.5, 1), transform: 'translateY(' + interpolate(titleS, [0, 1], [-30, 0]).toFixed(1) + 'px) scale(' + interpolate(titleS, [0, 1], [0.6, 1]).toFixed(3) + ')' }}>
        <div style={{ display: 'inline-block', background: theme.colors.primary, color: theme.colors.ink, fontFamily: theme.fonts.display, fontSize: 38, letterSpacing: 2, lineHeight: 1, padding: '8px 14px 5px', borderRadius: 10, boxShadow: '0 0 22px ' + theme.colors.glow + ', 0 6px 14px rgba(0,0,0,0.6)', transform: 'rotate(-3deg)' }}>{L.dayLabel}</div>
        {L.title ? <div style={{ color: '#fff', fontFamily: theme.fonts.display, fontSize: 24, letterSpacing: 1.5, marginTop: 8, textShadow: theme.outline, whiteSpace: 'nowrap' }}>{L.title}</div> : null}
      </div>
      {/* rail */}
      <div style={{ position: 'absolute', left: cx - 4, top: topY, width: 8, height: botY - topY, borderRadius: 4, background: 'rgba(255,255,255,0.18)' }} />
      <div style={{ position: 'absolute', left: cx - 4, top: fillTop, width: 8, height: Math.max(0, botY - fillTop), borderRadius: 4, background: theme.colors.primary, boxShadow: '0 0 12px ' + theme.colors.primary }} />
      {L.rungs.map((label, i) => {
        const inS = spring({ frame: f - i * 2, fps: e.fps, config: theme.spring.snappy });
        const isTop = i === n - 1;
        const done = i < L.current || (i === L.current && locked);
        const isCur = i === L.current && !locked;
        const pulse = isCur ? 1 + 0.06 * (0.5 + 0.5 * Math.sin(f / 6)) : i === L.current && locked ? interpolate(lockS, [0, 1], [1.5, 1]) : isTop ? topKick * (1 + 0.03 * Math.sin(f / 10)) : 1;
        const bg = done ? theme.colors.primary : isCur ? 'rgba(10,12,18,0.92)' : 'rgba(10,12,18,0.62)';
        const border = done ? '3px solid #fff' : isCur ? '4px solid ' + theme.colors.primary : isTop ? '3px solid ' + theme.colors.gold : '2px solid rgba(255,255,255,0.22)';
        const color = done ? theme.colors.ink : isTop ? theme.colors.gold : isCur ? '#fff' : 'rgba(255,255,255,0.55)';
        const glow = isCur ? '0 0 ' + (16 + 10 * Math.sin(f / 6)).toFixed(1) + 'px ' + theme.colors.primary : done ? '0 0 18px ' + theme.colors.glow : isTop ? '0 0 22px rgba(255,214,0,0.55)' : 'none';
        return (
          <div key={'rung' + i} style={{ position: 'absolute', left: cx - pillW / 2, top: yOf(i) - pillH / 2, width: pillW, height: pillH, boxSizing: 'border-box', borderRadius: 14, background: bg, border, boxShadow: glow + ', 0 6px 14px rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: Math.min(inS * 1.4, 1), transform: 'translateX(' + interpolate(inS, [0, 1], [180, 0]).toFixed(1) + 'px) scale(' + pulse.toFixed(3) + ')' }}>
            <span style={{ color, fontFamily: theme.fonts.display, fontSize: isTop ? 40 : 34, letterSpacing: 1, lineHeight: 1, marginTop: 3 }}>{label}</span>
          </div>
        );
      })}
      {/* lock burst */}
      {locked && f < lockAt + 18 ? (
        <div style={{ position: 'absolute', left: cx - 110, top: yOf(L.current) - 110, width: 220, height: 220, borderRadius: '50%', border: '6px solid ' + theme.colors.primary, opacity: interpolate(f, [lockAt, lockAt + 18], [0.9, 0], CLAMP), transform: 'scale(' + interpolate(f, [lockAt, lockAt + 18], [0.3, 1.2], CLAMP).toFixed(3) + ')' }} />
      ) : null}
    </div>
  );
};

// Captions: single-word karaoke in the display face; numbers, money and listed words get the hero colour and a size bump.
const Captions: React.FC<{ e: PicksEdit; above?: boolean }> = ({ e, above }) => {
  const shift = e.moneyLadder ? LADDER_SHIFT : 0;
  const f = useCurrentFrame(); const t = f / e.fps;
  let i = e.words.findIndex((w) => t >= w.start && t < w.end); if (i === -1) return null;
  while (i > 0 && e.words[i].word === '') i--; // blanked (merged) words hold the previous caption instead of flashing empty
  const w = e.words[i]; const text = w.word.toUpperCase(); if (!text) return null;
  const emphasis = /[0-9$%]/.test(text) || (e.emphasisWords ?? []).some((x) => text.replace(/[^A-Z0-9']/g, '') === x.toUpperCase());
  const s = spring({ frame: f - Math.round(w.start * e.fps), fps: e.fps, config: theme.spring.snappy });
  const glow = e.captionStyle === 'glow';
  const [g1, g2] = e.captionGlow ?? ['#D9FF5C', theme.colors.primary];
  // Video-034 'glow' look (owner's reference): white heavy geometric words with a soft shadow; key words switch to the
  // condensed face with a vertical gradient fill and a glow in their own colour. Still one word at a time.
  const glowStyle: React.CSSProperties = emphasis
    ? { fontFamily: theme.fonts.display, fontSize: 124, lineHeight: 1, letterSpacing: 1, background: 'linear-gradient(180deg,' + g1 + ' 5%,' + g2 + ' 95%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 0 16px ' + g2 + ') drop-shadow(0 6px 12px rgba(0,0,0,0.65))' }
    : { fontFamily: theme.fonts.heavy, fontWeight: 900, fontSize: 86, lineHeight: 1, letterSpacing: 1, color: '#fff', textShadow: '0 0 18px rgba(255,255,255,0.25), 0 6px 14px rgba(0,0,0,0.7), 0 2px 3px rgba(0,0,0,0.8)' };
  return (
    <AbsoluteFill style={above ? { justifyContent: 'flex-start', alignItems: 'center', paddingTop: SAFE.top + 30, zIndex: 9 } : { justifyContent: 'flex-end', alignItems: 'center', paddingBottom: SAFE.bottom + 60 - (e.sponsor?.captionsDrop && t >= e.words[e.sponsor.word].start - 0.2 && e.sponsor.untilWord < e.words.length && t < e.words[e.sponsor.untilWord].start ? e.sponsor.captionsDrop : 0), zIndex: 9 }}>
      <div style={glow ? { ...glowStyle, textAlign: 'center', opacity: Math.min(s * 2, 1), transform: 'translateX(' + shift + 'px) scale(' + interpolate(s, [0, 1], [0.7, 1]).toFixed(3) + ') translateY(' + interpolate(s, [0, 1], [14, 0]).toFixed(1) + 'px)' } : { transform: 'translateX(' + shift + 'px) scale(' + interpolate(s, [0, 1], [0.7, 1]).toFixed(3) + ') translateY(' + interpolate(s, [0, 1], [14, 0]).toFixed(1) + 'px)', color: emphasis ? theme.colors.primary : theme.colors.text, fontSize: emphasis ? 100 : 82, fontFamily: theme.fonts.display, textShadow: theme.outline, textAlign: 'center', letterSpacing: 2, lineHeight: 1 }}>{text}</div>
    </AbsoluteFill>
  );
};
// Persistent branding tag (retrospective backlog 3), bottom-left inside the safe zone, below the captions row.
const BrandTag: React.FC<{ tag: string; handle?: string }> = ({ tag, handle }) => (
  <div style={{ position: 'absolute', left: SAFE.left, top: 1920 - SAFE.bottom - 44, zIndex: 6, display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(8,10,16,0.7)', borderLeft: '4px solid ' + theme.colors.primary, borderRadius: 8, padding: '4px 14px 3px 10px' }}>
    <span style={{ color: theme.colors.text, fontSize: 26, fontFamily: theme.fonts.display, letterSpacing: 2 }}>{tag}</span>
    {handle ? <span style={{ color: theme.colors.textDim, fontSize: 22, fontFamily: theme.fonts.display, letterSpacing: 1 }}>{handle}</span> : null}
  </div>
);

// ---------------------------------------------------------------------------------------------------------------------
export const PicksVideo: React.FC<{ edit: PicksEdit }> = ({ edit: e }) => {
  applyBrand(e.brand);
  const f = useCurrentFrame();
  const tl = timelineFor(e);
  const { sec, wStart, TOTAL } = tl;
  const sfx = (name: string) => staticFile(e.assetsBase + '/sfx/' + name);
  const gAll = glitchAmount(f, tl.glitchCuts);
  const gFace = glitchAmount(f, tl.glitchFaceCuts);
  // facecam framing + Ken Burns
  const fc = e.facecam;
  const scale = (1920 / fc.srcH) * (fc.zoom ?? 1);
  const fcW = Math.round(fc.srcW * scale), fcH = Math.round(fc.srcH * scale);
  // clamp so the video always covers the frame: no black edges when the head is recentred
  const fcML = Math.max(1080 - fcW, Math.min(0, Math.round(fc.targetX - fc.head.x * scale)));
  const fcMT = Math.max(1920 - fcH, Math.min(0, Math.round(960 - fc.head.y * scale)));
  const k = tl.faceShots.findIndex((s) => f >= s.from && f < s.to);
  const zp = k < 0 ? 0 : interpolate(f, [tl.faceShots[k].from, tl.faceShots[k].to], [0, 1], { ...CLAMP, easing: theme.ease.inOut });
  // punch-in kick on listed words while on a face shot: +6% that settles over 9 frames
  const punch = k < 0 ? 0 : (e.punchWords ?? []).reduce((acc, w) => { const at = wStart(w); return f >= at && f < at + 9 ? Math.max(acc, 0.06 * (1 - (f - at) / 9)) : acc; }, 0);
  // quick zoom-in / zoom-out on a phrase: 6 frames in, hold, 10 frames out ending on the last word's end
  const kick = k < 0 ? 0 : (e.zoomKicks ?? []).reduce((acc, z) => {
    const a = wStart(z.word), b = sec(e.words[z.untilWord].end), amt = z.amount ?? 0.18;
    if (f < a || f > b) return acc;
    const v = f < a + 6 ? interpolate(f, [a, a + 6], [0, amt], { ...CLAMP, easing: theme.ease.out }) : f > b - 10 ? interpolate(f, [b - 10, b], [amt, 0], { ...CLAMP, easing: theme.ease.inOut }) : amt;
    return Math.max(acc, v);
  }, 0);
  const faceZoom = (k < 0 ? 1 : k % 2 === 0 ? 1 + 0.08 * zp : 1 + 0.08 * (1 - zp)) + punch + kick;
  const drift = k < 0 || !fc.drift ? 0 : (k % 2 === 0 ? 1 : -1) * interpolate(zp, [0, 1], [-fc.drift, fc.drift]);
  const revealLegs = e.legs.filter((l) => (e.rail.tile === 'logo' ? l.logo : l.headshot) && l.anchor >= 0);
  const clipFrames = (clip: string) => Math.max(1, Math.floor((e.clipSec[clip] ?? 5) * e.fps) - 1);
  const SH = e.moneyLadder ? LADDER_SHIFT : 0;
  // Video-028 hook test: facecam in a box on top, footage in the box below, until hook.stack.untilWord
  const stackOn = !!e.hook.stack && f < wStart(e.hook.stack.untilWord);
  const stackH = e.hook.stack?.faceH ?? 760;
  const stScale = stackH / fc.srcH, stW = Math.round(fc.srcW * stScale);
  const stML = Math.max(1080 - stW, Math.min(0, Math.round(540 - fc.head.x * stScale)));
  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
      <Audio src={staticFile(e.voiceover)} />
      {e.music ? <Audio src={staticFile(e.music.file)} volume={(fr) => {
        const m = e.music!; const fi = sec(m.fadeInSec ?? 0.8), fo = sec(m.fadeOutSec ?? 1.0);
        const a = fi > 0 ? interpolate(fr, [0, fi], [0, 1], CLAMP) : 1;
        const b = fo > 0 ? interpolate(fr, [TOTAL - fo, TOTAL - 1], [1, 0], CLAMP) : 1;
        return m.volume * a * b;
      }} /> : null}
      {/* z0 facecam, always mounted */}
      {fc.inset ? (
        <div style={{ ...LAYER, zIndex: 0, transform: 'scale(1.12)', filter: 'blur(38px) brightness(0.6)' }}>
          <OffthreadVideo src={staticFile(fc.file)} muted style={{ width: fcW, height: fcH, maxWidth: 'none', marginLeft: fcML, marginTop: fcMT }} />
        </div>
      ) : null}
      <div style={{ ...LAYER, zIndex: 0, transform: (gFace > 0 ? jitter(f, 10 * gFace) + ' ' : '') + 'translateX(' + drift.toFixed(1) + 'px) ' + (fc.inset ? 'translateY(' + (fc.insetY ?? 0) + 'px) scale(' + (fc.inset * faceZoom).toFixed(4) + ')' : 'scale(' + faceZoom.toFixed(4) + ')'), transformOrigin: fc.targetX + 'px ' + (fc.inset ? '960px' : '900px'), borderRadius: fc.inset ? 36 : 0, overflow: 'hidden', boxShadow: fc.inset ? '0 30px 80px rgba(0,0,0,0.6)' : undefined }}>
        <OffthreadVideo src={staticFile(fc.file)} muted style={{ width: fcW, height: fcH, maxWidth: 'none', marginLeft: fcML, marginTop: fcMT, filter: fc.grade }} />
        <div style={{ ...LAYER, background: fc.wash, mixBlendMode: 'soft-light' }} />
        {/* soft key light from the upper left (screen blend lifts the face without blowing the wall) */}
        {fc.keyLight ? <div style={{ ...LAYER, background: 'radial-gradient(ellipse 55% 45% at 38% 34%, rgba(255,238,210,0.34) 0%, rgba(255,225,190,0.14) 45%, rgba(0,0,0,0) 72%)', mixBlendMode: 'screen' }} /> : null}
        <div style={{ ...LAYER, background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) ' + (fc.keyLight ? '54%' : '46%') + ', rgba(0,0,0,' + (fc.keyLight ? '0.42' : '0.58') + ') 100%)' }} />
      </div>
      {/* z1 footage chunks with transitions */}
      {tl.chunks.map((c) => {
        const inType = tl.typeAt(c.from), toFace = tl.faceCuts.has(c.to), outType = tl.typeAt(c.to);
        const ext = toFace && outType === 'glitch' ? 0 : T;
        const dur = Math.min(TOTAL, c.to + ext) - c.from;
        const style = f < c.to ? (c.from === 0 ? {} : fxIn(inType, prog(f, c.from), f)) : toFace ? fxOut(outType, prog(f, c.to)) : {};
        return (
          <Sequence key={'chunk_' + c.from} from={c.from} durationInFrames={dur} layout='none'>
            <div style={{ ...LAYER, zIndex: 1, ...style, ...(stackOn ? { top: stackH, bottom: 'auto', height: 1920 - stackH } : {}) }}>
              {/* "path.mp4#7.5" starts the clip 7.5s in (Video-016: one clip reused across beats without replaying its opening) */}
              <Loop durationInFrames={Math.max(1, clipFrames(c.clip.split('#')[0]) - (c.clip.includes('#') ? sec(parseFloat(c.clip.split('#')[1])) : 0))} layout='none'>
                <OffthreadVideo src={staticFile(c.clip.split('#')[0])} startFrom={c.clip.includes('#') ? sec(parseFloat(c.clip.split('#')[1])) : 0} muted style={{ width: 1080, height: stackOn ? 1920 - stackH : 1920, maxWidth: 'none', objectFit: 'cover' }} />
              </Loop>
            </div>
          </Sequence>
        );
      })}
      {stackOn ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: stackH, overflow: 'hidden', zIndex: 2, borderBottom: '6px solid ' + theme.colors.primary, boxShadow: '0 12px 30px rgba(0,0,0,0.6)' }}>
          <OffthreadVideo src={staticFile(fc.file)} muted style={{ width: stW, height: stackH, maxWidth: 'none', marginLeft: stML, filter: fc.grade }} />
          <div style={{ position: 'absolute', inset: 0, background: fc.wash, mixBlendMode: 'soft-light' }} />
        </div>
      ) : null}
      <GlitchBars f={f} g={gAll} />
      <Grain f={f} />
      <Vignette />
      {/* hook */}
      {e.hook.style === 'imessage' ? <ChatHook e={e} f={f} /> : e.hook.style === 'lineup' ? <LineupHook e={e} f={f} /> : e.hook.style === 'none' ? null : <HookText e={e} f={f} />}
      <LineupHero e={e} f={f} />
      <SponsorBlock e={e} f={f} />
      <ChartFit e={e} f={f} />
      <HeroCutout e={e} f={f} />
      <SponsorDuo e={e} f={f} />
      <SlipFan e={e} f={f} />
      {(e.stamps ?? []).map((t, i) => (
        <Sequence key={'tstamp_' + i} from={wStart(t.word)} durationInFrames={sec(t.dur)} layout='none'>
          <TextStamp t={t} dur={sec(t.dur)} fps={e.fps} base={e.assetsBase} />
          <Audio src={sfx(t.sfx ?? 'punch_sound.MP3')} volume={t.vol ?? 0.5} />
        </Sequence>
      ))}
      {e.slipFan ? (<>
        {e.slipFan.stack.map((_, i) => <Sequence key={'fan_' + i} from={wStart(e.slipFan!.word) + i * 4} durationInFrames={sec(0.5)} layout='none'><Audio src={sfx('shutter_sound_camera.MP3')} volume={0.45} /></Sequence>)}
        <Sequence from={wStart(e.slipFan.moneyWord)} durationInFrames={sec(1.2)} layout='none'><Audio src={sfx('amount_displayed_cash.MP3')} volume={0.45} /></Sequence>
        <Sequence from={wStart(e.slipFan.sweepWord)} durationInFrames={sec(1.0)} layout='none'><Audio src={sfx('wrong_answer.MP3')} volume={0.4} /></Sequence>
        <Sequence from={wStart(e.slipFan.sweepWord) + 4} durationInFrames={sec(0.8)} layout='none'><Audio src={sfx('fast_swoosh.MP3')} volume={0.45} /></Sequence>
        <Sequence from={wStart(e.slipFan.sweepWord) + 10} durationInFrames={sec(1.2)} layout='none'><Audio src={sfx('punch_sound.MP3')} volume={0.5} /></Sequence>
        <Sequence from={wStart(e.slipFan.stampWord)} durationInFrames={sec(1.4)} layout='none'><Audio src={sfx('bass_impact.MP3')} volume={0.5} /></Sequence>
      </>) : null}
      <MatchMath e={e} f={f} />
      {e.matchMath ? (<>
        <Sequence from={wStart(e.matchMath.word)} durationInFrames={sec(0.8)} layout='none'><Audio src={sfx('whoosh_motion.MP3')} volume={0.45} /></Sequence>
        <Sequence from={wStart(e.matchMath.offerWord)} durationInFrames={sec(1.2)} layout='none'><Audio src={sfx('amount_displayed_cash.MP3')} volume={0.45} /></Sequence>
        <Sequence from={wStart(e.matchMath.codeWord)} durationInFrames={sec(1.2)} layout='none'><Audio src={sfx('punch_sound.MP3')} volume={0.5} /></Sequence>
        <Sequence from={wStart(e.matchMath.stakeWord)} durationInFrames={sec(0.8)} layout='none'><Audio src={sfx('pop_whoosh.MP3')} volume={0.4} /></Sequence>
        <Sequence from={wStart(e.matchMath.matchWord)} durationInFrames={sec(0.8)} layout='none'><Audio src={sfx('pop_whoosh.MP3')} volume={0.4} /></Sequence>
        <Sequence from={wStart(e.matchMath.matchWord) + 24} durationInFrames={sec(1.0)} layout='none'><Audio src={sfx('coin_sound.MP3')} volume={0.45} /></Sequence>
        <Sequence from={wStart(e.matchMath.slipWord)} durationInFrames={sec(0.8)} layout='none'><Audio src={sfx('fast_swoosh.MP3')} volume={0.45} /></Sequence>
        <Sequence from={wStart(e.matchMath.payWord)} durationInFrames={sec(1.4)} layout='none'><Audio src={sfx('amount_displayed_cash.MP3')} volume={0.5} /></Sequence>
        <Sequence from={wStart(e.matchMath.bioWord)} durationInFrames={sec(1.0)} layout='none'><Audio src={sfx('ding_answer_correct.MP3')} volume={0.4} /></Sequence>
      </>) : null}
      {e.sponsorDuo ? (<>
        <Sequence from={wStart(e.sponsorDuo.word)} durationInFrames={sec(0.8)} layout='none'><Audio src={sfx('pop_whoosh.MP3')} volume={0.4} /></Sequence>
        <Sequence from={wStart(e.sponsorDuo.left.word)} durationInFrames={sec(0.8)} layout='none'><Audio src={sfx('whoosh_motion.MP3')} volume={0.4} /></Sequence>
        <Sequence from={wStart(e.sponsorDuo.right.word)} durationInFrames={sec(0.8)} layout='none'><Audio src={sfx('whoosh_motion.MP3')} volume={0.4} /></Sequence>
        <Sequence from={wStart(e.sponsorDuo.codeWord)} durationInFrames={sec(1.2)} layout='none'><Audio src={sfx('punch_sound.MP3')} volume={0.5} /></Sequence>
        <Sequence from={wStart(e.sponsorDuo.bioWord)} durationInFrames={sec(1.0)} layout='none'><Audio src={sfx('ding_answer_correct.MP3')} volume={0.4} /></Sequence>
      </>) : null}
      {e.heroCutout ? (<>
        <Sequence from={wStart(e.heroCutout.word)} durationInFrames={sec(1.5)} layout='none'><Audio src={sfx('magic_reveal.MP3')} volume={0.45} /></Sequence>
        <Sequence from={wStart(e.heroCutout.titleWord)} durationInFrames={sec(1.4)} layout='none'><Audio src={sfx('bass_impact.MP3')} volume={0.5} /></Sequence>
      </>) : null}
      {e.chartFit ? (<>
        <Sequence from={wStart(e.chartFit.word)} durationInFrames={sec(0.8)} layout='none'><Audio src={sfx('whoosh_motion.MP3')} volume={0.4} /></Sequence>
        <Sequence from={wStart(e.chartFit.word) + 5} durationInFrames={sec(0.8)} layout='none'><Audio src={sfx('whoosh_motion.MP3')} volume={0.35} /></Sequence>
        <Sequence from={wStart(e.chartFit.fitWord)} durationInFrames={sec(0.8)} layout='none'><Audio src={sfx('fast_swoosh.MP3')} volume={0.35} /></Sequence>
        <Sequence from={wStart(e.chartFit.fitWord) + 10} durationInFrames={sec(1.4)} layout='none'><Audio src={sfx('bass_impact.MP3')} volume={0.5} /></Sequence>
        <Sequence from={wStart(e.chartFit.fitWord) + 12} durationInFrames={sec(1.2)} layout='none'><Audio src={sfx('ding_answer_correct.MP3')} volume={0.4} /></Sequence>
      </>) : null}
      <CollabBlock e={e} f={f} />
      {e.collab ? (<>
        {e.collab.windows.map((w, i) => <Sequence key={'collab_in_' + i} from={sec(w.at)} durationInFrames={sec(0.6)} layout='none'><Audio src={sfx('pop_whoosh.MP3')} volume={0.35} /></Sequence>)}
        {e.collab.rows.map((r, i) => <Sequence key={'collab_row_' + i} from={wStart(r.revealWord)} durationInFrames={sec(1.0)} layout='none'><Audio src={sfx('ding_answer_correct.MP3')} volume={0.45} /></Sequence>)}
        {e.collab.stampWord !== undefined ? <Sequence from={wStart(e.collab.stampWord)} durationInFrames={sec(1.2)} layout='none'><Audio src={sfx('punch_sound.MP3')} volume={0.5} /></Sequence> : null}
      </>) : null}
      {e.sponsor ? (<>
        <Sequence from={wStart(e.sponsor.word)} durationInFrames={sec(1.0)} layout='none'><Audio src={sfx('pop_whoosh.MP3')} volume={0.4} /></Sequence>
        <Sequence from={wStart(e.sponsor.ctaWord)} durationInFrames={sec(1.2)} layout='none'><Audio src={sfx('ding_answer_correct.MP3')} volume={0.45} /></Sequence>
      </>) : null}
      {e.hook.style === 'lineup' && e.hook.lineup ? (<>
        {e.hook.lineup.items.map((_, i) => <Sequence key={'lineup_sfx_' + i} from={wStart(e.hook.lineup!.word) + i * (e.hook.lineup!.stepFrames ?? 4)} durationInFrames={sec(0.5)} layout='none'><Audio src={sfx('shutter_sound_camera.MP3')} volume={0.4} /></Sequence>)}
        {e.hook.lineup.tagWord !== undefined ? <Sequence from={wStart(e.hook.lineup.tagWord)} durationInFrames={sec(0.6)} layout='none'><Audio src={sfx('pop_sound.MP3')} volume={0.4} /></Sequence> : null}
        <Sequence from={Math.max(0, wStart(e.hook.lineup.stampWord) - 2)} durationInFrames={sec(1.2)} layout='none'><Audio src={sfx('punch_sound.MP3')} volume={0.55} /></Sequence>
        <Sequence from={wStart(e.hook.lineup.stampWord)} durationInFrames={sec(1.4)} layout='none'><Audio src={sfx('bass_impact.MP3')} volume={0.4} /></Sequence>
      </>) : null}
      {e.lineupHero && e.hook.lineup ? (<>
        {e.hook.lineup.items.map((_, i) => <Sequence key={'hero_sfx_' + i} from={wStart(e.lineupHero!.word) + i * (e.hook.lineup!.stepFrames ?? 4)} durationInFrames={sec(0.5)} layout='none'><Audio src={sfx('shutter_sound_camera.MP3')} volume={0.4} /></Sequence>)}
        <Sequence from={wStart(e.lineupHero.word) + 20} durationInFrames={sec(1.2)} layout='none'><Audio src={sfx('punch_sound.MP3')} volume={0.5} /></Sequence>
      </>) : null}
      {e.hook.style === 'imessage' && e.hook.chat ? e.hook.chat.bubbles.map((b, i) => (
        <Sequence key={'chat_sfx_' + i} from={wStart(b.word)} durationInFrames={sec(1.2)} layout='none'><Audio src={sfx('iphone_message_tone.MP3')} volume={0.4} /></Sequence>
      )) : null}
      <Tally e={e} f={f} />
      {e.tally ? (<>
        {e.tally.items.map((_, i) => <Sequence key={'tally_sfx_' + i} from={wStart(e.tally!.word) + i * (e.tally!.stepFrames ?? 9)} durationInFrames={sec(0.6)} layout='none'><Audio src={sfx('pop_sound.MP3')} volume={0.4} /></Sequence>)}
        <Sequence from={wStart(e.tally.totalWord)} durationInFrames={sec(1.4)} layout='none'><Audio src={sfx('bass_impact.MP3')} volume={0.5} /></Sequence>
      </>) : null}
      <Ladder e={e} f={f} />
      <PayoutTable e={e} f={f} />
      {ladders(e).flatMap((L, li) => L.items.map((it, i) => <Sequence key={'ladder_sfx_' + li + '_' + i} from={wStart(it.word)} durationInFrames={sec(0.8)} layout='none'><Audio src={sfx('shutter_sound_camera.MP3')} volume={0.45} /></Sequence>))}
      {e.table ? e.table.rows.map((r, i) => <Sequence key={'table_sfx_' + i} from={wStart(r.word)} durationInFrames={sec(0.8)} layout='none'><Audio src={sfx(r.tone === 'red' ? 'wrong_answer.MP3' : 'coin_sound.MP3')} volume={0.4} /></Sequence>) : null}
      {e.stamp ? (<>
        <Sequence from={wStart(e.stamp.word)} durationInFrames={Math.max(1, TOTAL - wStart(e.stamp.word))} layout='none'><SlipStamp image={e.stamp.image} text={e.stamp.text} fps={e.fps} textAt={e.stamp.textWord !== undefined ? wStart(e.stamp.textWord) - wStart(e.stamp.word) : 6} shift={SH} width={e.stamp.width} center={e.stamp.center} payout={e.stamp.payout ? { from: e.stamp.payout.from, to: e.stamp.payout.to, at: wStart(e.stamp.payout.word) - wStart(e.stamp.word), label: e.stamp.payout.label } : undefined} /></Sequence>
        <Sequence from={(e.stamp.textWord !== undefined ? wStart(e.stamp.textWord) : wStart(e.stamp.word)) + 4} durationInFrames={sec(1.5)} layout='none'><Audio src={sfx(e.stamp.sfx)} volume={e.stamp.vol ?? 0.45} /></Sequence>
      </>) : null}
      {e.hook.money ? (
        <>
          <Sequence from={wStart(e.hook.money.word)} durationInFrames={wStart(e.hook.money.untilWord) - wStart(e.hook.money.word)} layout='none'><MoneyPop image={e.hook.money.image} label={e.hook.money.label} dur={wStart(e.hook.money.untilWord) - wStart(e.hook.money.word)} fps={e.fps} /></Sequence>
          <Sequence from={wStart(e.hook.money.word)} durationInFrames={sec(2)} layout='none'><Audio src={sfx(e.hook.money.sfx)} volume={0.4} /></Sequence>
        </>
      ) : null}
      {e.hook.slip ? (
        <>
          <Sequence from={wStart(e.hook.slip.fromWord)} durationInFrames={wStart(e.hook.slip.untilWord) - wStart(e.hook.slip.fromWord)} layout='none'><BetSlipTease image={e.hook.slip.image} dur={wStart(e.hook.slip.untilWord) - wStart(e.hook.slip.fromWord)} fps={e.fps} /></Sequence>
          <Sequence from={wStart(e.hook.slip.fromWord)} durationInFrames={sec(1.3)} layout='none'><Audio src={sfx(e.hook.slip.sfx)} volume={0.35} /></Sequence>
        </>
      ) : null}
      <MoneyLadder e={e} f={f} />
      {e.moneyLadder ? (<>
        <Sequence from={0} durationInFrames={sec(1.0)} layout='none'><Audio src={sfx('fast_swoosh.MP3')} volume={0.4} /></Sequence>
        {e.moneyLadder.topWord !== undefined ? <Sequence from={wStart(e.moneyLadder.topWord)} durationInFrames={sec(1.2)} layout='none'><Audio src={sfx('coin_sound.MP3')} volume={0.45} /></Sequence> : null}
        <Sequence from={wStart(e.moneyLadder.lockWord)} durationInFrames={sec(1.4)} layout='none'><Audio src={sfx('bass_impact.MP3')} volume={0.5} /></Sequence>
        <Sequence from={wStart(e.moneyLadder.lockWord) + 3} durationInFrames={sec(1.2)} layout='none'><Audio src={sfx('ding_answer_correct.MP3')} volume={0.45} /></Sequence>
      </>) : null}
      {(e.news ?? []).map((n) => (
        <React.Fragment key={'news_' + n.word}>
          <Sequence from={wStart(n.word)} durationInFrames={sec(n.dur)} layout='none'><NewsCard n={n} dur={sec(n.dur)} fps={e.fps} shift={SH} /></Sequence>
          {/* Video-017: the owner did not like the notification + typing pair on Video-016; one shutter per receipt card (overridable per card) */}
          <Sequence from={Math.max(0, wStart(n.word) - 2)} durationInFrames={sec(0.8)} layout='none'><Audio src={sfx(n.sfx ?? 'shutter_sound_camera.MP3')} volume={n.vol ?? 0.45} /></Sequence>
        </React.Fragment>
      ))}
      {(e.split ?? []).map((sp) => (
        <React.Fragment key={'split_' + sp.word}>
          <Sequence from={wStart(sp.word)} durationInFrames={wStart(sp.untilWord) - wStart(sp.word)} layout='none'><SplitCard sp={sp} dur={wStart(sp.untilWord) - wStart(sp.word)} afterAt={wStart(sp.afterWord) - wStart(sp.word)} fps={e.fps} shift={SH} /></Sequence>
          <Sequence from={Math.max(0, wStart(sp.word) - 2)} durationInFrames={sec(0.6)} layout='none'><Audio src={sfx('pop_sound.MP3')} volume={0.42} /></Sequence>
          <Sequence from={wStart(sp.afterWord)} durationInFrames={sec(1.4)} layout='none'><Audio src={sfx('bass_impact.MP3')} volume={0.5} /></Sequence>
        </React.Fragment>
      ))}
      {(e.strike ?? []).map((k) => (
        <React.Fragment key={'strike_' + k.word}>
          <Sequence from={wStart(k.word)} durationInFrames={sec(k.dur)} layout='none'><StrikeCard k={k} dur={sec(k.dur)} rowAts={k.rows.map((r) => wStart(r.word) - wStart(k.word))} fps={e.fps} shift={SH} /></Sequence>
          <Sequence from={Math.max(0, wStart(k.word) - 2)} durationInFrames={sec(0.6)} layout='none'><Audio src={sfx('pop_whoosh.MP3')} volume={0.4} /></Sequence>
          {k.rows.map((r, i) => <Sequence key={'strike_sfx_' + i} from={wStart(r.word)} durationInFrames={sec(0.8)} layout='none'><Audio src={sfx(r.tone === 'out' ? 'punch_sound.MP3' : 'ding_answer_correct.MP3')} volume={0.4} /></Sequence>)}
        </React.Fragment>
      ))}
      {e.stamp?.payout ? <Sequence from={wStart(e.stamp.payout.word)} durationInFrames={sec(1.6)} layout='none'><Audio src={sfx('amount_displayed_cash.MP3')} volume={0.5} /></Sequence> : null}
      {/* popups */}
      {e.popups.map((p) => (
        <React.Fragment key={'pop_' + p.word + p.src}>
          <Sequence from={wStart(p.word)} durationInFrames={sec(p.dur)} layout='none'><PopCard p={p} dur={sec(p.dur)} base={e.assetsBase} fps={e.fps} shift={SH} markAt={p.mark ? wStart(p.mark.word) - wStart(p.word) : undefined} /></Sequence>
          <Sequence from={wStart(p.word)} durationInFrames={sec(1.2)} layout='none'><Audio src={sfx(p.sfx)} volume={p.vol} /></Sequence>
          {p.mark ? <Sequence from={wStart(p.mark.word)} durationInFrames={sec(0.8)} layout='none'><Audio src={sfx('pop_whoosh.MP3')} volume={0.45} /></Sequence> : null}
        </React.Fragment>
      ))}
      {/* stat cards */}
      {e.legs.flatMap((l) => [...(l.stat ? [l.stat] : []), ...(l.stats ?? [])]).sort((a, b) => a.word - b.word).map((st, si) => {
        const leg = e.legs.find((l) => [...(l.stat ? [l.stat] : []), ...(l.stats ?? [])].includes(st))!;
        const STAT_SFX = ['pop_sound.MP3', 'whoosh_motion.MP3', 'title_swoosh.MP3', 'fast_swoosh.MP3'];
        return (
        <React.Fragment key={'stat_' + leg.name + '_' + st.word}>
          <Sequence from={wStart(st.word)} durationInFrames={sec(st.dur ?? 2.2)} layout='none'><StatCard value={st.value} label={st.label} team={leg.team} dur={sec(st.dur ?? 2.2)} fps={e.fps} shift={SH} /></Sequence>
          <Sequence from={Math.max(0, wStart(st.word) - 2)} durationInFrames={sec(0.6)} layout='none'><Audio src={sfx((st as any).sfx ?? STAT_SFX[si % STAT_SFX.length])} volume={(st as any).vol ?? 0.42} /></Sequence>
        </React.Fragment>
      ); })}
      {/* reveals + ding on the spoken name; SGP pairs show both faces on one card */}
      {revealLegs.filter((l) => !l.noReveal).map((leg) => {
        const img = (l: typeof leg) => (l.revealImage ?? (e.rail.tile === 'logo' ? l.logo : l.headshot))!;
        const partner = leg.pairWith ? e.legs.find((l) => l.name === leg.pairWith) : undefined;
        const images = partner ? [img(leg), img(partner)] : [img(leg)];
        const label = partner ? (leg.pairLabel ?? leg.label + ' + ' + partner.label) : leg.label;
        const dur = sec(leg.revealDur ?? (partner ? 2.8 : 2.4));
        return (
          <React.Fragment key={'reveal_' + leg.name}>
            <Sequence from={wStart(leg.anchor)} durationInFrames={dur} layout='none'><Reveal images={images} cover={e.rail.tile === 'headshot' || !!leg.revealImage} label={label} line={leg.line ?? e.revealLine} odds={leg.odds} dur={dur} fps={e.fps} shift={SH} /></Sequence>
            <Sequence from={wStart(leg.anchor)} durationInFrames={sec(1.3)} layout='none'><Audio src={sfx('ding_answer_correct.MP3')} volume={0.45} /></Sequence>
            {leg.odds ? <Sequence from={wStart(leg.anchor) + 8} durationInFrames={sec(0.6)} layout='none'><Audio src={sfx('pop_sound.MP3')} volume={0.4} /></Sequence> : null}
          </React.Fragment>
        );
      })}
      {/* partner legs still ding on their own name so both names get a hit */}
      {revealLegs.filter((l) => l.noReveal).map((leg) => (
        <Sequence key={'ding2_' + leg.name} from={wStart(leg.anchor)} durationInFrames={sec(0.6)} layout='none'><Audio src={sfx('pop_sound.MP3')} volume={0.45} /></Sequence>
      ))}
      {/* reaction pops */}
      {e.mysteryGames ? (<>
        <MysteryGames e={e} f={f} />
        <Sequence from={Math.max(0, wStart(e.mysteryGames.word) - 2)} durationInFrames={sec(1.2)} layout='none'><Audio src={sfx(e.mysteryGames.sfx ?? 'riser_sound_4sec.MP3')} volume={e.mysteryGames.vol ?? 0.45} /></Sequence>
        {e.mysteryGames.games.map((g, i) => (g.flipWord === undefined ? null : (
          <Sequence key={'flip' + i} from={Math.max(0, wStart(g.flipWord) - 2)} durationInFrames={sec(1.0)} layout='none'><Audio src={sfx(e.mysteryGames?.flipSfx ?? 'fast_swoosh.MP3')} volume={0.45} /></Sequence>
        )))}
      </>) : null}
      {e.ladderStep ? (<>
        <Sequence from={wStart(e.ladderStep.word)} durationInFrames={sec(e.ladderStep.dur)} layout='none'><LadderStep L={e.ladderStep} dur={sec(e.ladderStep.dur)} rollAt={wStart(e.ladderStep.rollWord) - wStart(e.ladderStep.word)} fps={e.fps} shift={SH} /></Sequence>
        <Sequence from={Math.max(0, wStart(e.ladderStep.rollWord) - 2)} durationInFrames={sec(1.6)} layout='none'><Audio src={sfx(e.ladderStep.sfx ?? 'amount_displayed_cash.MP3')} volume={e.ladderStep.vol ?? 0.5} /></Sequence>
      </>) : null}
      {e.codeBlast ? (<>
        <Sequence from={wStart(e.codeBlast.word)} durationInFrames={Math.max(1, wStart(e.codeBlast.untilWord) - wStart(e.codeBlast.word))} layout='none'><CodeBlast c={e.codeBlast} dur={Math.max(1, wStart(e.codeBlast.untilWord) - wStart(e.codeBlast.word))} fps={e.fps} at={(w) => wStart(w) - wStart(e.codeBlast!.word)} /></Sequence>
        <Sequence from={Math.max(0, wStart(e.codeBlast.word) - 2)} durationInFrames={sec(1.2)} layout='none'><Audio src={sfx('cinematic_whoosh_impact.MP3')} volume={0.45} /></Sequence>
        <Sequence from={Math.max(0, wStart(e.codeBlast.amountWord) - 1)} durationInFrames={sec(1.6)} layout='none'><Audio src={sfx('amount_displayed_cash.MP3')} volume={0.45} /></Sequence>
        <Sequence from={Math.max(0, wStart(e.codeBlast.slamWord) - 2)} durationInFrames={sec(1.2)} layout='none'><Audio src={sfx(e.codeBlast.sfx ?? 'punch_sound.MP3')} volume={e.codeBlast.vol ?? 0.5} /></Sequence>
        {e.codeBlast.tiles.map((t, i) => (t.word === undefined ? null : <Sequence key={'cbt' + i} from={Math.max(0, wStart(t.word) - 1)} durationInFrames={sec(0.8)} layout='none'><Audio src={sfx(['pop_sound.MP3', 'classic_whoosh.MP3', 'title_swoosh.MP3'][i % 3])} volume={0.4} /></Sequence>))}
        {e.codeBlast.banner ? <Sequence from={Math.max(0, wStart(e.codeBlast.banner.word) - 1)} durationInFrames={sec(1.0)} layout='none'><Audio src={sfx('bass_impact.MP3')} volume={0.45} /></Sequence> : null}
      </>) : null}
      {e.codeDrop ? (<>
        <Sequence from={wStart(e.codeDrop.word)} durationInFrames={sec(e.codeDrop.dur)} layout='none'><CodeDrop c={e.codeDrop} dur={sec(e.codeDrop.dur)} fps={e.fps} /></Sequence>
        <Sequence from={Math.max(0, wStart(e.codeDrop.word) - 2)} durationInFrames={sec(1.2)} layout='none'><Audio src={sfx(e.codeDrop.sfx ?? 'coin_sound.MP3')} volume={e.codeDrop.vol ?? 0.5} /></Sequence>
      </>) : null}
      {(e.faceRows ?? []).map((fr, i) => {
        const from = wStart(fr.items[0].word), to = wStart(fr.untilWord);
        const size = fr.size ?? 300;
        return (
          <React.Fragment key={'facerow_' + i}>
            <Sequence from={from} durationInFrames={Math.max(1, to - from)} layout='none'>
              <FaceRow images={fr.items.map((it) => it.image)} starts={fr.items.map((it) => wStart(it.word) - from)} size={size} y={fr.y ?? 1080} fps={e.fps} />
            </Sequence>
            {fr.items.map((it, j) => (
              <Sequence key={'facesfx_' + i + '_' + j} from={Math.max(0, wStart(it.word) - 2)} durationInFrames={sec(0.8)} layout='none'><Audio src={sfx(fr.sfx ?? 'pop_sound.MP3')} volume={fr.vol ?? 0.35} /></Sequence>
            ))}
          </React.Fragment>
        );
      })}
      {(e.memes ?? []).map((m) => (
        <React.Fragment key={'meme_' + m.word}>
          <Sequence from={wStart(m.word)} durationInFrames={sec(m.dur ?? 1.0)} layout='none'><MemePop image={m.image} size={m.size ?? 320} dur={sec(m.dur ?? 1.0)} fps={e.fps} x={m.x} y={m.y} drive={m.drive} w={m.w} shift={SH} /></Sequence>
          <Sequence from={Math.max(0, wStart(m.word) - 2)} durationInFrames={sec(1.2)} layout='none'><Audio src={sfx(m.sfx)} volume={m.vol ?? 0.4} /></Sequence>
        </React.Fragment>
      ))}
      {/* cut SFX */}
      {tl.cuts.map((c) => { const s = e.cutSfx?.[tl.typeAt(c)] ?? CUT_SFX[tl.typeAt(c)]; return (
        <Sequence key={'cutsfx_' + c} from={Math.max(0, c - s.lead)} durationInFrames={sec(s.dur)} layout='none'><Audio src={sfx(s.file)} volume={s.vol} /></Sequence>
      ); })}
      <LegRail e={e} f={f} />
      {e.brandTag ? <BrandTag tag={e.brandTag} handle={e.handle} /> : null}
      {f >= tl.hookEnd || e.hook.captions ? <Captions e={e} above={!!fc.captionsAbove && k >= 0} /> : null}
    </AbsoluteFill>
  );
};
