import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, spring } from 'remotion';
import { theme, SAFE } from '../theme';
import scripts from './ilcampo-scripts.json';
import vo001 from './vo/IC001.json';
import vo002 from './vo/IC002.json';
import vo003 from './vo/IC003.json';

// Client promo template (spec work for Il Campo Training Centre, Oakville). Graphics-only: no footage, no client
// photos. One renderer, scenes typed by `kind` in ilcampo-scripts.json; timing comes from the Kokoro word file.
export const FPS = 30;
const TAIL = 1.6; // CTA hold after the last word
const C = { bg: '#071510', pitch: '#0E2A1B', stripe: '#11311F', line: 'rgba(255,255,255,0.16)', cream: '#F5EEDC', red: '#E5392F', green: '#2BD27A', gold: '#F2C14E', ink: '#04100A', dim: 'rgba(245,238,220,0.7)' };
const D = theme.fonts.display;
const H = theme.fonts.heavy;
const HANDLE = '@ilcampotc';

type Word = { word: string; start: number; end: number };
type Vo = { words: Word[]; duration: number };
type SceneSpec = { kind: string; lines: string[]; [k: string]: unknown };
type VideoSpec = { id: string; title: string; scenes: SceneSpec[] };
type Scene = SceneSpec & { from: number; to: number; w0: number; words: Word[] };

const VO: Record<string, Vo> = { IC001: vo001, IC002: vo002, IC003: vo003 };
export const PROMOS = (scripts.videos as VideoSpec[]).map((v) => ({ ...v, vo: VO[v.id], frames: Math.ceil((VO[v.id].duration + TAIL) * FPS) }));

const capWords = (line: string) => line.split('||')[0].trim().split(/\s+/);

const buildScenes = (v: VideoSpec, vo: Vo): Scene[] => {
  let w = 0;
  const raw = v.scenes.map((s) => {
    const n = s.lines.reduce((a, l) => a + capWords(l).length, 0);
    const sc = { ...s, w0: w, words: vo.words.slice(w, w + n) };
    w += n;
    return sc;
  });
  return raw.map((s, i) => ({
    ...s,
    from: i === 0 ? 0 : Math.round((s.words[0].start - 0.12) * FPS),
    to: i === raw.length - 1 ? Math.ceil((vo.duration + TAIL) * FPS) : Math.round((raw[i + 1].words[0].start - 0.12) * FPS),
  }));
};

// ---------- shared bits ----------

const Pitch: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ background: `repeating-linear-gradient(90deg, ${C.pitch} 0 135px, ${C.stripe} 135px 270px)`, transform: `translateX(${-(f * 0.6) % 270}px) scale(1.3) rotate(8deg)`, opacity: 0.9 }} />
      <svg width={1080} height={1920} style={{ position: 'absolute', opacity: 0.55 }}>
        <circle cx={540} cy={960 + Math.sin(f / 60) * 20} r={300} fill='none' stroke={C.line} strokeWidth={6} />
        <line x1={0} y1={960 + Math.sin(f / 60) * 20} x2={1080} y2={960 + Math.sin(f / 60) * 20} stroke={C.line} strokeWidth={6} />
        <rect x={240} y={-10} width={600} height={300} fill='none' stroke={C.line} strokeWidth={6} />
        <rect x={240} y={1630} width={600} height={300} fill='none' stroke={C.line} strokeWidth={6} />
      </svg>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)' }} />
    </AbsoluteFill>
  );
};

const Ball: React.FC<{ size: number; spin?: number }> = ({ size, spin = 0 }) => (
  <svg width={size} height={size} viewBox='-50 -50 100 100' style={{ transform: `rotate(${spin}deg)`, filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.5))' }}>
    <circle r={48} fill='#fff' stroke='#111' strokeWidth={3} />
    <polygon points='0,-17 16,-5 10,14 -10,14 -16,-5' fill='#111' />
    {[0, 72, 144, 216, 288].map((a) => (
      <g key={a} transform={`rotate(${a})`}>
        <line x1={0} y1={-17} x2={0} y2={-34} stroke='#111' strokeWidth={3} />
        <path d='M -14 -40 L 0 -34 L 14 -40 L 10 -48 L -10 -48 Z' fill='#111' />
      </g>
    ))}
  </svg>
);

const useEnter = (delay = 0, cfg: { damping: number; stiffness: number; mass: number } = theme.spring.snappy) => {
  const f = useCurrentFrame();
  return spring({ frame: f - delay, fps: FPS, config: cfg });
};

const Pill: React.FC<{ children: React.ReactNode; bg?: string; color?: string; size?: number; delay?: number }> = ({ children, bg = C.red, color = '#fff', size = 40, delay = 0 }) => {
  const s = useEnter(delay, theme.spring.bouncy);
  return (
    <div style={{ display: 'inline-block', background: bg, color, fontFamily: H, fontSize: size, padding: `${size * 0.28}px ${size * 0.7}px`, borderRadius: 999, letterSpacing: 2, transform: `scale(${s})`, boxShadow: '0 10px 30px rgba(0,0,0,0.35)' }}>{children}</div>
  );
};

const Rise: React.FC<{ children: React.ReactNode; delay?: number; style?: React.CSSProperties }> = ({ children, delay = 0, style }) => {
  const s = useEnter(delay);
  return <div style={{ ...style, opacity: s, transform: `translateY(${(1 - s) * 60}px)` }}>{children}</div>;
};

const BrandTag: React.FC = () => (
  <div style={{ position: 'absolute', top: 1340, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(4,16,10,0.7)', border: `2px solid ${C.line}`, borderRadius: 999, padding: '10px 26px' }}>
      <Tricolor w={54} h={8} />
      <span style={{ fontFamily: D, fontSize: 36, color: C.cream, letterSpacing: 4 }}>IL CAMPO</span>
      <span style={{ fontFamily: H, fontSize: 22, color: C.dim, letterSpacing: 3 }}>TRAINING CENTRE</span>
    </div>
  </div>
);

const Tricolor: React.FC<{ w: number; h: number; p?: number }> = ({ w, h, p = 1 }) => (
  <div style={{ display: 'flex', width: w * p, height: h, borderRadius: h, overflow: 'hidden' }}>
    <div style={{ flex: 1, background: C.green }} /><div style={{ flex: 1, background: C.cream }} /><div style={{ flex: 1, background: C.red }} />
  </div>
);

const Lockup: React.FC<{ scale?: number; delay?: number }> = ({ scale = 1, delay = 0 }) => {
  const f = useCurrentFrame();
  const s = useEnter(delay, theme.spring.smooth);
  const bar = interpolate(f - delay, [6, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: theme.ease.out });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${scale * (0.85 + 0.15 * s)})`, opacity: s }}>
      <div style={{ fontFamily: D, fontSize: 250, lineHeight: 0.95, color: C.cream, letterSpacing: 6, textShadow: '0 12px 40px rgba(0,0,0,0.5)' }}>IL CAMPO</div>
      <div style={{ marginTop: 18 }}><Tricolor w={520} h={16} p={bar} /></div>
      <div style={{ fontFamily: H, fontSize: 50, color: C.cream, letterSpacing: 12, marginTop: 30, opacity: bar }}>TRAINING CENTRE</div>
      <div style={{ fontFamily: H, fontSize: 38, color: C.green, letterSpacing: 10, marginTop: 10, opacity: bar }}>OAKVILLE · ON</div>
    </div>
  );
};

// Word-by-word captions in chunks of up to 3 words, broken at punctuation.
const Captions: React.FC<{ words: Word[] }> = ({ words }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const chunks: Word[][] = [];
  let cur: Word[] = [];
  words.forEach((w) => {
    cur.push(w);
    if (cur.length === 3 || /[,.?!]$/.test(w.word)) { chunks.push(cur); cur = []; }
  });
  if (cur.length) chunks.push(cur);
  const idx = chunks.findIndex((c, i) => t >= c[0].start - 0.05 && (i === chunks.length - 1 ? t <= c[c.length - 1].end + 0.6 : t < chunks[i + 1][0].start - 0.05));
  if (idx < 0) return null;
  const c = chunks[idx];
  const pop = spring({ frame: f - Math.round((c[0].start - 0.05) * FPS), fps: FPS, config: theme.spring.snappy });
  const chars = c.reduce((a, w) => a + w.word.length + 1, 0);
  const size = Math.min(64, 860 / (chars * 0.78)); // one line, always
  return (
    <div style={{ position: 'absolute', top: 1222, left: SAFE.left, right: SAFE.right, display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap', gap: '0 20px', transform: `scale(${0.9 + 0.1 * pop})` }}>
      {c.map((w, i) => {
        const on = t >= w.start - 0.03;
        return (
          <span key={i} style={{ fontFamily: H, fontSize: size, color: on ? (t <= w.end + 0.05 ? C.green : C.cream) : 'rgba(245,238,220,0.35)', textShadow: theme.outline, textTransform: 'uppercase' }}>{w.word.replace(/[.,]$/, '')}</span>
        );
      })}
    </div>
  );
};

// ---------- scenes ----------

type SP = { s: Scene; dur: number; t0: number }; // t0 = scene start in seconds (to place word-timed beats)

const Hook: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const big = s.big as string[];
  const roll = interpolate(f, [0, 18], [-500, 0], { extrapolateRight: 'clamp', easing: theme.ease.out });
  return (
    <AbsoluteFill style={{ alignItems: 'center', paddingTop: 370 }}>
      <Pill size={46}>{s.badge as string}</Pill>
      <div style={{ marginTop: 50, textAlign: 'center' }}>
        {big.map((l, i) => (
          <Rise key={l} delay={4 + i * 6}>
            <div style={{ fontFamily: D, fontSize: l.length > 10 ? 170 : 210, lineHeight: 1.02, color: i === big.length - 1 ? C.green : C.cream, textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>{l}</div>
          </Rise>
        ))}
      </div>
      <div style={{ marginTop: 40, transform: `translateX(${roll}px)` }}><Ball size={170} spin={roll * 0.8 + f * 4} /></div>
    </AbsoluteFill>
  );
};

// Top-down drill diagrams, 860x520.
const tri = (p: number) => theme.ease.inOut(p < 0.5 ? p * 2 : 2 - p * 2);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

const Player: React.FC<{ x: number; y: number; label: string; color?: string; up?: boolean }> = ({ x, y, label, color = C.red, up }) => (
  <g>
    <circle cx={x} cy={y} r={30} fill={color} stroke='#fff' strokeWidth={5} />
    <text x={x} y={up ? y - 46 : y + 64} textAnchor='middle' fontFamily={H} fontSize={24} fill={C.cream} letterSpacing={2}>{label}</text>
  </g>
);
const Cone: React.FC<{ x: number; y: number; color?: string; glow?: number }> = ({ x, y, color = '#FF8A1F', glow = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${1 + glow * 0.35})`} style={{ filter: glow ? `drop-shadow(0 0 ${18 * glow}px ${color})` : undefined }}>
    <polygon points='0,-26 20,16 -20,16' fill={color} stroke='#fff' strokeWidth={3} />
  </g>
);
const BallAt: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 16 }) => (
  <g><circle cx={x} cy={y} r={r} fill='#fff' stroke='#111' strokeWidth={3} /><circle cx={x} cy={y} r={r * 0.35} fill='#111' /></g>
);
const Diagram: React.FC<{ variant: string }> = ({ variant }) => {
  const f = useCurrentFrame();
  let body: React.ReactNode = null;
  let hud = '';
  if (variant === 'wall') {
    const P = 26; const rep = Math.floor(f / P); const p = (f % P) / P;
    const fx = rep % 2 ? 470 : 390;
    const y = lerp(400, 92, tri(p));
    hud = `REPS ${rep}  ·  ${rep % 2 ? 'LEFT' : 'RIGHT'} FOOT`;
    body = (
      <>
        <rect x={180} y={40} width={500} height={36} rx={6} fill={C.cream} />
        {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={230 + i * 100} y1={40} x2={230 + i * 100} y2={76} stroke='#9c9480' strokeWidth={4} />)}
        <text x={700} y={66} fontFamily={H} fontSize={22} fill={C.dim} letterSpacing={3}>WALL</text>
        <line x1={fx} y1={400} x2={fx} y2={92} stroke={C.cream} strokeWidth={4} strokeDasharray='12 12' opacity={0.5} />
        <Player x={430} y={430} label='YOU' />
        <BallAt x={fx} y={y} />
      </>
    );
  } else if (variant === 'gate') {
    const P = 66; const p = (f % P) / P;
    const coach = [110, 400], me = [400, 300], out = [790, 110];
    let b: number[];
    if (p < 0.32) { const q = theme.ease.out(p / 0.32); b = [lerp(coach[0], me[0] - 30, q), lerp(coach[1], me[1] + 10, q)]; }
    else if (p < 0.42) b = [me[0] - 30, me[1] + 10];
    else if (p < 0.8) { const q = theme.ease.out((p - 0.42) / 0.38); b = [lerp(me[0] - 30, out[0], q), lerp(me[1] + 10, out[1], q)]; }
    else b = out;
    const flash = p >= 0.32 && p < 0.5 ? 1 - (p - 0.32) / 0.18 : 0;
    hud = p < 0.32 ? 'RECEIVE' : p < 0.8 ? 'TOUCH THROUGH THE GATE' : 'GO';
    body = (
      <>
        <path d={`M ${coach[0] + 40} ${coach[1] - 12} L ${me[0] - 50} ${me[1] + 14}`} stroke={C.cream} strokeWidth={4} strokeDasharray='12 12' opacity={0.5} />
        <path d={`M ${me[0] + 40} ${me[1] - 16} L ${out[0] - 30} ${out[1] + 18}`} stroke={C.green} strokeWidth={5} strokeDasharray='12 12' opacity={0.8} />
        <Cone x={640} y={150} /><Cone x={730} y={250} />
        <Player x={coach[0]} y={coach[1]} label='COACH' color={C.ink} />
        <Player x={me[0]} y={me[1]} label='YOU' />
        <circle cx={me[0]} cy={me[1]} r={30 + flash * 40} fill='none' stroke={C.green} strokeWidth={6} opacity={flash} />
        <BallAt x={b[0]} y={b[1]} />
      </>
    );
  } else {
    const P = 48; const k = Math.floor(f / P); const p = (f % P) / P;
    const cones: [number, number, string, string][] = [[150, 110, C.red, 'RED'], [710, 110, C.gold, 'YELLOW'], [150, 430, '#3B82F6', 'BLUE'], [710, 430, C.cream, 'WHITE']];
    const target = cones[k % 4];
    const look = target[0] < 430 ? -1 : 1;
    const ang = (target[1] < 270 ? -90 : 90) + look * (target[1] < 270 ? -38 : 38) * -1;
    const sweep = interpolate(p, [0, 0.25], [0, 1], { extrapolateRight: 'clamp', easing: theme.ease.out });
    const a = (lerp(-90, ang, sweep) * Math.PI) / 180;
    const glow = p > 0.2 && p < 0.7 ? 1 : 0;
    const by = lerp(560, 330, theme.ease.out(interpolate(p, [0.25, 0.85], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));
    const wedge = (r: number) => { const a1 = a - 0.42, a2 = a + 0.42; return `M 430 270 L ${430 + Math.cos(a1) * r} ${270 + Math.sin(a1) * r} A ${r} ${r} 0 0 1 ${430 + Math.cos(a2) * r} ${270 + Math.sin(a2) * r} Z`; };
    hud = p < 0.25 ? 'CHECK YOUR SHOULDER' : `CALL IT: ${target[3]}`;
    body = (
      <>
        <path d={wedge(380)} fill={C.cream} opacity={0.14} />
        {cones.map((c, i) => <Cone key={i} x={c[0]} y={c[1]} color={c[2]} glow={c === target ? glow : 0} />)}
        <Player x={430} y={270} label='YOU' up />
        <BallAt x={430} y={by} />
      </>
    );
  }
  return (
    <div style={{ position: 'relative', width: 860, height: 560, borderRadius: 36, background: 'rgba(4,16,10,0.78)', border: `3px solid ${C.line}`, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.45)' }}>
      <svg width={860} height={520} viewBox='0 0 860 520' style={{ position: 'absolute', top: 40 }}>{body}</svg>
      <div style={{ position: 'absolute', top: 22, left: 30, fontFamily: H, fontSize: 26, color: C.green, letterSpacing: 3 }}>{hud}</div>
    </div>
  );
};

const Drill: React.FC<SP> = ({ s }) => {
  const chips = s.chips as string[];
  return (
    <AbsoluteFill style={{ alignItems: 'center', paddingTop: 300 }}>
      <Pill size={36}>DRILL 0{s.n as number}</Pill>
      <Rise delay={3}><div style={{ fontFamily: D, fontSize: 140, color: C.cream, lineHeight: 1.1, marginTop: 14 }}>{s.title as string}</div></Rise>
      <div style={{ display: 'flex', gap: 18, marginTop: 8, marginBottom: 30 }}>
        {chips.map((c, i) => <Pill key={c} size={30} bg='rgba(245,238,220,0.12)' color={C.cream} delay={8 + i * 5}>{c}</Pill>)}
      </div>
      <Rise delay={6}><Diagram variant={s.variant as string} /></Rise>
    </AbsoluteFill>
  );
};

const Calendar: React.FC<SP> = ({ s, dur }) => {
  const f = useCurrentFrame();
  const big = s.big as string[];
  const filled = Math.floor(interpolate(f, [10, dur * 0.7], [0, 30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  return (
    <AbsoluteFill style={{ alignItems: 'center', paddingTop: 350 }}>
      {big.map((l, i) => <Rise key={l} delay={i * 6}><div style={{ fontFamily: D, fontSize: 150, lineHeight: 1.0, color: i ? C.green : C.cream }}>{l}</div></Rise>)}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 90px)', gap: 14, marginTop: 40 }}>
        {Array.from({ length: 30 }, (_, i) => {
          const on = i < filled;
          return (
            <div key={i} style={{ width: 90, height: 90, borderRadius: 18, background: on ? C.green : 'rgba(245,238,220,0.08)', border: `2px solid ${on ? C.green : C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: H, fontSize: on ? 44 : 26, color: on ? C.ink : C.dim, transform: `scale(${on && i === filled - 1 ? 1.12 : 1})` }}>
              {on ? '✓' : i + 1}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SEGS = [{ min: 10, c: C.green }, { min: 20, c: C.gold }, { min: 20, c: C.red }, { min: 10, c: C.cream }];
const Clock: React.FC<SP> = ({ s, dur }) => {
  const f = useCurrentFrame();
  const seg = s.seg as number;
  const R = 250, SW = 54, CIRC = 2 * Math.PI * R;
  const p = interpolate(f, [4, Math.min(dur * 0.55, 45)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: theme.ease.out });
  let acc = 0;
  return (
    <AbsoluteFill style={{ alignItems: 'center', paddingTop: 300 }}>
      <Pill size={32} bg='rgba(245,238,220,0.12)' color={C.cream}>{`0${seg + 1} / 04`}</Pill>
      <Rise delay={2}><div style={{ fontFamily: D, fontSize: s.title && (s.title as string).length > 12 ? 112 : 140, color: SEGS[seg].c, lineHeight: 1.1, marginTop: 10 }}>{s.title as string}</div></Rise>
      <div style={{ position: 'relative', width: 620, height: 620, marginTop: 6 }}>
        <svg width={620} height={620} viewBox='-310 -310 620 620' style={{ transform: 'rotate(-90deg)' }}>
          <circle r={R} fill='rgba(4,16,10,0.75)' stroke='rgba(245,238,220,0.1)' strokeWidth={SW} />
          {SEGS.map((g, i) => {
            const len = (g.min / 60) * CIRC;
            const show = i < seg ? 1 : i === seg ? p : 0;
            const el = <circle key={i} r={R} fill='none' stroke={g.c} strokeWidth={SW} strokeDasharray={`${Math.max(0, len * show - 6)} ${CIRC}`} strokeDashoffset={-acc} opacity={i === seg ? 1 : 0.45} />;
            acc += len;
            return el;
          })}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: D, fontSize: 230, color: C.cream, lineHeight: 0.9 }}>{Math.round(SEGS[seg].min * p)}</div>
          <div style={{ fontFamily: H, fontSize: 42, color: C.dim, letterSpacing: 8 }}>MINUTES</div>
        </div>
      </div>
      <Rise delay={10}><div style={{ fontFamily: H, fontSize: 32, color: C.cream, letterSpacing: 3, marginTop: 14, textAlign: 'center', maxWidth: 860 }}>{s.sub as string}</div></Rise>
    </AbsoluteFill>
  );
};

// Word groups slam in on their own voiced word.
const groupTimes = (s: Scene, groups: string[], t0: number) => {
  let w = 0;
  return groups.map((g) => { const at = s.words[w].start - t0; w += g.split(/\s+/).length; return Math.max(0, Math.round(at * FPS)); });
};

const Kinetic: React.FC<SP> = ({ s, t0 }) => {
  const f = useCurrentFrame();
  const groups = s.groups as string[];
  const at = groupTimes(s, groups, t0);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 260 }}>
      {groups.map((g, i) => {
        const sp = spring({ frame: f - at[i], fps: FPS, config: theme.spring.slap });
        if (f < at[i]) return <div key={i} style={{ height: 230 }} />;
        const last = i === groups.length - 1;
        return (
          <div key={i} style={{ fontFamily: D, fontSize: Math.min(last ? 260 : 210, 900 / (g.length * 0.56)), lineHeight: 1.05, color: last ? (s.accent ? C.green : C.red) : C.cream, transform: `scale(${2 - sp})`, opacity: Math.min(1, sp * 1.5), textShadow: '0 12px 40px rgba(0,0,0,0.55)' }}>{g}</div>
        );
      })}
    </AbsoluteFill>
  );
};

const Triple: React.FC<SP> = ({ s, t0 }) => {
  const f = useCurrentFrame();
  const groups = s.groups as string[];
  const at = groupTimes(s, groups, t0);
  const cur = at.filter((a) => f >= a).length - 1;
  return (
    <AbsoluteFill style={{ alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 110, paddingBottom: 260 }}>
      {groups.map((g, i) => {
        const sp = spring({ frame: f - at[i], fps: FPS, config: theme.spring.snappy });
        const [a, b] = g.split(' ');
        return (
          <div key={i} style={{ display: 'flex', gap: 26, alignItems: 'baseline', opacity: f < at[i] ? 0 : i === cur ? 1 : 0.35, transform: `translateX(${(1 - sp) * -200}px)` }}>
            <span style={{ fontFamily: H, fontSize: 70, color: C.dim }}>{a}</span>
            <span style={{ fontFamily: D, fontSize: 200, lineHeight: 1.08, color: i === cur ? C.green : C.cream }}>{b}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Brand: React.FC<SP> = () => {
  const f = useCurrentFrame();
  const drop = spring({ frame: f - 2, fps: FPS, config: theme.spring.bouncy });
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 260 }}>
      <div style={{ transform: `translateY(${(1 - drop) * -700}px)`, marginBottom: 40 }}><Ball size={190} spin={f * 3} /></div>
      <Lockup delay={6} />
    </AbsoluteFill>
  );
};

const Cta: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const pulse = 1 + 0.04 * Math.sin(f / 5);
  return (
    <AbsoluteFill style={{ alignItems: 'center', paddingTop: 350 }}>
      <Rise><div style={{ fontFamily: D, fontSize: 104, color: C.cream, textAlign: 'center', lineHeight: 1.05, maxWidth: 880 }}>{s.ask as string}</div></Rise>
      <div style={{ marginTop: 40 }}><Lockup scale={0.72} delay={10} /></div>
      <div style={{ marginTop: 10, transform: `scale(${pulse})` }}><Pill size={50} delay={22}>{s.button as string}</Pill></div>
      <Rise delay={28} style={{ marginTop: 34 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <svg width={54} height={54} viewBox='0 0 24 24'><rect x={2} y={2} width={20} height={20} rx={6} fill='none' stroke={C.cream} strokeWidth={2.2} /><circle cx={12} cy={12} r={4.5} fill='none' stroke={C.cream} strokeWidth={2.2} /><circle cx={17.5} cy={6.5} r={1.3} fill={C.cream} /></svg>
          <span style={{ fontFamily: H, fontSize: 52, color: C.cream, letterSpacing: 2 }}>{HANDLE}</span>
        </div>
      </Rise>
    </AbsoluteFill>
  );
};

const SCENES: Record<string, React.FC<SP>> = { hook: Hook, drill: Drill, calendar: Calendar, clock: Clock, kinetic: Kinetic, triple: Triple, brand: Brand, cta: Cta };
const NO_CAPTIONS = new Set(['kinetic', 'triple', 'brand', 'cta']);
const NO_TAG = new Set(['brand', 'cta']);
const WHOOSH = ['classic_whoosh.MP3', 'fast_swoosh.MP3', 'title_swoosh.MP3', 'whoosh_motion.MP3'];
const sfx = (n: string) => staticFile('shared/sfx/' + n);

export const PromoVideo: React.FC<{ id: string }> = ({ id }) => {
  const f = useCurrentFrame();
  const v = PROMOS.find((p) => p.id === id)!;
  const scenes = buildScenes(v, v.vo);
  const cur = scenes.find((s) => f >= s.from && f < s.to) ?? scenes[scenes.length - 1];
  const capWordsShown = v.vo.words.filter((w) => !NO_CAPTIONS.has(scenes.find((s) => s.words.includes(w))!.kind));
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Pitch />
      {scenes.map((s, i) => {
        const Comp = SCENES[s.kind];
        return (
          <Sequence key={i} from={s.from} durationInFrames={s.to - s.from} layout='none'>
            <AbsoluteFill><Comp s={s} dur={s.to - s.from} t0={s.from / FPS} /></AbsoluteFill>
          </Sequence>
        );
      })}
      {!NO_TAG.has(cur.kind) ? <BrandTag /> : null}
      <Captions words={capWordsShown} />
      <Audio src={staticFile('promo/ilcampo/' + id + '.wav')} />
      <Audio src={staticFile('promo/ilcampo/bed.wav')} volume={(fr) => 0.14 * interpolate(fr, [v.frames - 30, v.frames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
      {scenes.map((s, i) => (
        <Sequence key={'sx' + i} from={Math.max(0, s.from - 3)} durationInFrames={30} layout='none'>
          <Audio src={sfx(s.kind === 'kinetic' || s.kind === 'brand' ? 'bass_impact.MP3' : WHOOSH[i % WHOOSH.length])} volume={0.35} />
        </Sequence>
      ))}
      {scenes.filter((s) => s.kind === 'cta').map((s) => (
        <Sequence key='ding' from={s.from + 22} durationInFrames={40} layout='none'><Audio src={sfx('ding_answer_correct.MP3')} volume={0.3} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
