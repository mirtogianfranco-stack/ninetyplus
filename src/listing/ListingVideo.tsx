// Real estate listing reel (pitch demo). Standalone from the picks renderer: one LISTING object drives the whole video,
// so a new listing is new photos + new data, not new code. Media lives in public/demo-listing/.
import React from 'react';
import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { SAFE } from '../theme';

loadFont({ family: 'Playfair', url: staticFile('fonts/playfair-600.ttf'), weight: '600' });
loadFont({ family: 'Playfair', url: staticFile('fonts/playfair-500i.ttf'), weight: '500', style: 'italic' });
loadFont({ family: 'Inter', url: staticFile('fonts/inter-500.ttf'), weight: '500' });
loadFont({ family: 'Inter', url: staticFile('fonts/inter-700.ttf'), weight: '700' });

const C = { ink: '#0E1A24', cream: '#F6F1E9', gold: '#C9A96E', dim: 'rgba(246,241,233,0.78)' };
const SERIF = 'Playfair, Georgia, serif';
const SANS = 'Inter, Helvetica, Arial, sans-serif';
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const DIR = 'demo-listing/';

type Shot = { img: string; aspect: number; vo: string; voSec: number; label?: string; line?: string; pan: [number, number]; zoom?: [number, number] };

export const LISTING = {
  price: '$1,895,000',
  address: '1428 Palm Grove Lane',
  style: 'Coastal Modern',
  stats: [['4', 'BEDS'], ['3.5', 'BATHS'], ['3,240', 'SQ FT'], ['0.31', 'ACRES']],
  agent: { name: 'YOUR NAME', brokerage: 'Your Brokerage', phone: '(555) 010-2400', initials: 'YN' },
  cta: "DM 'TOUR' TO BOOK",
  // voSec = measured length of public/demo-listing/vo/N.wav; pan = start/end position across the photo (0 left, 1 right).
  shots: [
    { img: '1.jpg', aspect: 1.5, vo: 'vo/1.wav', voSec: 4.35, pan: [0.5, 0.5], zoom: [1.1, 1.0] },
    { img: '2.jpg', aspect: 1.471, vo: 'vo/2.wav', voSec: 3.48, label: 'THE LIVING ROOM', line: 'Soaring ceilings', pan: [0.15, 0.55] },
    { img: '3.jpg', aspect: 1.669, vo: 'vo/3.wav', voSec: 3.41, label: 'THE KITCHEN', line: "A chef's kitchen", pan: [0.62, 0.3] },
    { img: '4.jpg', aspect: 1.5, vo: 'vo/4.wav', voSec: 3.18, label: 'THE MAIN LEVEL', line: 'Floor-to-ceiling glass', pan: [0.2, 0.62] },
    { img: '5.jpg', aspect: 1.5, vo: 'vo/5.wav', voSec: 2.45, label: 'PRIMARY SUITE', line: 'Opens to the outdoors', pan: [0.6, 0.35] },
    { img: '6.jpg', aspect: 1.5, vo: 'vo/6.wav', voSec: 3.05, label: 'PRIMARY BATH', line: 'Spa-style, frameless glass', pan: [0.15, 0.45] },
    { img: '7.jpg', aspect: 1.5, vo: 'vo/7.wav', voSec: 3.33, label: 'INDOOR / OUTDOOR', line: 'The pool becomes the house', pan: [0.3, 0.7] },
    { img: '8.jpg', aspect: 1.499, vo: 'vo/8.wav', voSec: 5.14, pan: [0.5, 0.5], zoom: [1.0, 1.1] },
  ] as Shot[],
};

const FPS = 30;
const XFADE = 12;          // crossfade frames between photos
const VO_LEAD = 9;         // VO starts this many frames into its shot
const TAIL = 12;           // breath after each line before the next cut
const END_HOLD = 75;       // end card stays after the last line

const timeline = () => {
  let at = 0;
  return LISTING.shots.map((s, i) => {
    const last = i === LISTING.shots.length - 1;
    const len = VO_LEAD + Math.round(s.voSec * FPS) + (last ? END_HOLD : TAIL + XFADE);
    const row = { from: at, len };
    at += len - XFADE;
    return row;
  });
};
export const LISTING_FRAMES = (() => { const t = timeline(); const l = t[t.length - 1]; return l.from + l.len; })();

const Photo: React.FC<{ s: Shot; len: number; blur?: number }> = ({ s, len, blur = 0 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, len], [0, 1], { extrapolateRight: 'clamp', easing: Easing.bezier(0.45, 0, 0.55, 1) });
  const [z0, z1] = s.zoom ?? [1.06, 1.06];
  const z = z0 + (z1 - z0) * p;
  const h = 1920 * z;
  const w = h * s.aspect;
  const x = -(w - 1080) * (s.pan[0] + (s.pan[1] - s.pan[0]) * p);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: C.ink }}>
      <Img src={staticFile(DIR + s.img)} style={{ position: 'absolute', maxWidth: 'none', height: h, width: w, left: x, top: (1920 - h) / 2, filter: blur ? `blur(${blur}px) brightness(0.55)` : undefined }} />
    </AbsoluteFill>
  );
};

const Shade: React.FC = () => (
  <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(14,26,36,0.55) 0%, rgba(14,26,36,0) 22%, rgba(14,26,36,0) 48%, rgba(14,26,36,0.82) 78%, rgba(14,26,36,0.9) 100%)' }} />
);

const rise = (f: number, at: number, fps: number) => spring({ frame: f - at, fps, config: { damping: 20, stiffness: 120, mass: 0.8 } });

const Hero: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = rise(f, 4, fps), b = rise(f, 14, fps), c = rise(f, 24, fps);
  const line = interpolate(f, [10, 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: OUT });
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', top: SAFE.top + 40, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: a, transform: `translateY(${(1 - a) * -30}px)` }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, letterSpacing: 14, color: C.ink, background: C.cream, padding: '18px 36px 18px 50px' }}>JUST LISTED</div>
      </div>
      <div style={{ position: 'absolute', left: SAFE.left, right: SAFE.right, bottom: SAFE.bottom + 10 }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: C.gold, opacity: a }}>{LISTING.style.toUpperCase()}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 132, lineHeight: 1.05, color: C.cream, opacity: b, transform: `translateY(${(1 - b) * 40}px)` }}>{LISTING.price}</div>
        <div style={{ height: 3, width: 300 * line, background: C.gold, margin: '18px 0 22px' }} />
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 42, color: C.cream, opacity: c }}>{LISTING.address}</div>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 34, color: C.dim, marginTop: 8, opacity: c }}>
          {LISTING.stats.slice(0, 3).map(([v, k]) => `${v} ${k.toLowerCase()}`).join('  ·  ')}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const RoomLabel: React.FC<{ label: string; line: string; idx: number; total: number }> = ({ label, line, idx, total }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = rise(f, XFADE - 2, fps), b = rise(f, XFADE + 6, fps);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: SAFE.left, right: SAFE.right, bottom: SAFE.bottom + 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, opacity: a, transform: `translateX(${(1 - a) * -40}px)` }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: C.gold, letterSpacing: 4 }}>{String(idx).padStart(2, '0')}/{String(total).padStart(2, '0')}</div>
          <div style={{ height: 2, width: 60, background: C.gold }} />
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 32, color: C.cream, letterSpacing: 8 }}>{label}</div>
        </div>
        <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 92, lineHeight: 1.08, color: C.cream, marginTop: 14, opacity: b, transform: `translateY(${(1 - b) * 30}px)` }}>{line}</div>
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = XFADE + 4;
  const s = (k: number) => rise(f, at + k * 6, fps);
  const pulse = 1 + 0.03 * Math.sin(Math.max(0, f - at - 60) / 6);
  return (
    <AbsoluteFill style={{ alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: SAFE.top + 30, left: SAFE.left, right: SAFE.right, textAlign: 'center' }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 10, color: C.gold, opacity: s(0) }}>PRIVATE TOURS</div>
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 104, color: C.cream, lineHeight: 1.05, marginTop: 10, opacity: s(1), transform: `translateY(${(1 - s(1)) * 30}px)` }}>This Weekend</div>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 38, color: C.dim, marginTop: 14, opacity: s(2) }}>{LISTING.address}</div>
      </div>
      <div style={{ position: 'absolute', top: 670, left: SAFE.left, right: SAFE.right, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {LISTING.stats.map(([v, k], i) => (
          <div key={k} style={{ border: `2px solid rgba(201,169,110,0.7)`, background: 'rgba(14,26,36,0.55)', padding: '26px 0', textAlign: 'center', opacity: s(3 + i), transform: `scale(${0.9 + 0.1 * s(3 + i)})` }}>
            <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 76, color: C.cream, lineHeight: 1 }}>{v}</div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 6, color: C.gold, marginTop: 10 }}>{k}</div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', top: 1060, left: SAFE.left, right: SAFE.right, textAlign: 'center', fontFamily: SERIF, fontWeight: 600, fontSize: 88, color: C.cream, opacity: s(7) }}>{LISTING.price}</div>
      <div style={{ position: 'absolute', top: 1205, left: SAFE.left, right: SAFE.right, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26, opacity: s(9) }}>
        <div style={{ width: 96, height: 96, borderRadius: 48, background: C.gold, color: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontWeight: 600, fontSize: 40 }}>{LISTING.agent.initials}</div>
        <div>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, color: C.cream, letterSpacing: 4 }}>{LISTING.agent.name}</div>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 28, color: C.dim }}>{LISTING.agent.brokerage}  ·  {LISTING.agent.phone}</div>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 1330, opacity: s(11), transform: `scale(${pulse})` }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, letterSpacing: 6, color: C.ink, background: C.cream, padding: '20px 44px' }}>{LISTING.cta}</div>
      </div>
    </AbsoluteFill>
  );
};

export const ListingVideo: React.FC = () => {
  const t = timeline();
  const n = LISTING.shots.length;
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      {LISTING.shots.map((s, i) => {
        const { from, len } = t[i];
        const last = i === n - 1;
        return (
          <Sequence key={i} from={from} durationInFrames={len}>
            <FadeIn first={i === 0}>
              <Photo s={s} len={len} />
              {last ? <EndShade /> : <Shade />}
              {i === 0 && <Hero />}
              {s.label && <RoomLabel label={s.label} line={s.line ?? ''} idx={i} total={n - 2} />}
              {last && <EndCard />}
            </FadeIn>
            <Sequence from={VO_LEAD}><Audio src={staticFile(DIR + s.vo)} /></Sequence>
          </Sequence>
        );
      })}
      <Audio src={staticFile(DIR + 'music.wav')} volume={(f) => interpolate(f, [0, t[n - 1].from + XFADE + VO_LEAD + Math.round(LISTING.shots[n - 1].voSec * FPS), LISTING_FRAMES], [0.2, 0.2, 0.45], { extrapolateRight: 'clamp' })} />
      <Sequence from={2}><Audio src={staticFile(DIR + 'swoosh.mp3')} volume={0.35} /></Sequence>
      <Sequence from={t[n - 1].from + XFADE}><Audio src={staticFile(DIR + 'reveal.mp3')} volume={0.3} /></Sequence>
    </AbsoluteFill>
  );
};

const FadeIn: React.FC<{ first: boolean; children: React.ReactNode }> = ({ first, children }) => {
  const f = useCurrentFrame();
  const o = first ? 1 : interpolate(f, [0, XFADE], [0, 1], { extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const EndShade: React.FC = () => <AbsoluteFill style={{ background: 'rgba(14,26,36,0.62)' }} />;
