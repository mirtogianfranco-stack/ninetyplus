import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { theme, applyBrand } from '../theme';
import { Stadium } from './Mockups';
import { np005 } from '../edits/np005';

// "Weekend Card" look (owner picked mock-up C, 16 Oct 2026): NP-005 rebuilt on the same approved voiceover + word timings.
// Open on the whole card, one player-hero scene per pick with the stat building on its words, close on card + record.
// Standalone composition (not PicksVideo), so tools/gate.sh does not cover it; timings below are word indices into np005.words.

const RED = '#FF2E4D';
const GOLD = '#FFD23F';
const GREEN = '#22C55E';
const W = np005.words;
const FPS = 30;
const at = (i: number) => Math.round(W[i].start * FPS);
const crest = (k: string) => staticFile('np-005/logos/' + k + '.png');
const player = (k: string) => staticFile('mockups/' + k + '.png');
const sfx = (n: string) => staticFile('np-005/sfx/' + n);
const D = () => theme.fonts.display;
const HV = () => theme.fonts.heavy;
const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// Scene boundaries (word indices): hook card 0-12, Arsenal 13-22, Everton/Chelsea 23-42, Brighton 43-54, outro 55-end.
const S1 = at(13), S2 = at(23), S3 = at(43), S4 = at(55);

const useSpring = (from: number, cfg: { damping: number; stiffness: number; mass: number } = theme.spring.snappy) => {
  const f = useCurrentFrame();
  return spring({ frame: f - from, fps: FPS, config: cfg });
};

const Row: React.FC<{ n: number; h: string; a: string; t: string; k: string; from: number; hot?: boolean; dim?: boolean }> = ({ n, h, a, t, k, from, hot, dim }) => {
  const s = useSpring(from);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: hot ? 'linear-gradient(90deg, rgba(255,46,77,0.35), rgba(11,10,13,0.75))' : 'rgba(11,10,13,0.72)', borderRadius: 20, padding: '14px 18px', marginTop: n > 1 ? 12 : 0, border: hot ? '2px solid ' + RED : '1px solid rgba(255,255,255,0.12)', opacity: s * (dim ? 0.45 : 1), transform: 'translateX(' + interpolate(s, [0, 1], [80, 0]) + 'px)' }}>
      <div style={{ fontFamily: D(), fontSize: 40, color: RED, width: 36 }}>{n}</div>
      <Img src={crest(h)} style={{ width: 62, height: 62, objectFit: 'contain' }} />
      <Img src={crest(a)} style={{ width: 62, height: 62, objectFit: 'contain' }} />
      <div style={{ fontFamily: D(), fontSize: 46, color: '#fff', flex: 1, whiteSpace: 'nowrap' }}>{t}</div>
      <div style={{ fontFamily: HV(), fontSize: 18, color: 'rgba(255,255,255,0.65)', letterSpacing: 1, whiteSpace: 'nowrap' }}>{k} ET</div>
    </div>
  );
};

const ROWS: [string, string, string, string][] = [['nfo', 'ars', 'ARSENAL TO WIN', 'SUN 11:30 AM'], ['eve', 'che', 'BOTH TEAMS SCORE', 'SAT 7:30 AM'], ['bha', 'cry', 'BRIGHTON TO WIN', 'SUN 9:00 AM']];

const Card: React.FC<{ from: number; top?: number; hot?: number; title?: string }> = ({ from, top = 700, hot = -1, title = 'WEEKEND' }) => {
  const s = useSpring(from, theme.spring.smooth);
  return (
    <div style={{ position: 'absolute', left: 90, right: 90, top, background: 'linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))', border: '2px solid rgba(255,255,255,0.28)', borderRadius: 34, padding: '26px 26px 20px', boxShadow: '0 30px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.4)', backdropFilter: 'blur(14px)', opacity: Math.min(1, s * 1.4), transform: 'translateY(' + interpolate(s, [0, 1], [120, 0]) + 'px) scale(' + interpolate(s, [0, 1], [0.92, 1]) + ')' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontFamily: D(), fontSize: 58, color: '#fff', letterSpacing: 2 }}>{title} <span style={{ color: RED }}>CARD</span></div>
        <div style={{ fontFamily: HV(), fontSize: 22, color: 'rgba(255,255,255,0.7)', letterSpacing: 3 }}>PREMIER LEAGUE</div>
      </div>
      {ROWS.map(([h, a, t, k], i) => <Row key={t} n={i + 1} h={h} a={a} t={t} k={k} from={from + 6 + i * 5} hot={hot === i} dim={hot >= 0 && hot !== i} />)}
    </div>
  );
};

// Player fan for the card scenes.
const Fan: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  const s = useSpring(from, theme.spring.smooth);
  const drift = Math.sin(f / 40) * 6;
  return (
    <>
      <Img src={player('palmer')} style={{ position: 'absolute', left: -120, top: 330 + drift, width: 640, opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [-200, 0]) + 'px) rotate(-6deg)', filter: 'drop-shadow(0 0 24px rgba(3,70,148,0.7)) brightness(0.85)' }} />
      <Img src={player('mitoma')} style={{ position: 'absolute', right: -120, top: 330 - drift, width: 640, opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [200, 0]) + 'px) rotate(6deg)', filter: 'drop-shadow(0 0 24px rgba(0,87,184,0.7)) brightness(0.85)' }} />
      <Img src={player('saka')} style={{ position: 'absolute', left: 190, top: 270, width: 700, opacity: s, transform: 'translateY(' + interpolate(s, [0, 1], [80, 0]) + 'px)', filter: 'drop-shadow(0 0 30px rgba(239,1,7,0.65)) contrast(1.06)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 560, height: 300, background: 'linear-gradient(180deg, rgba(11,10,13,0), rgba(11,10,13,0.9))' }} />
    </>
  );
};

// One pick: big player on the right, numbered pick header, stat area on the left, pick pill slams on its word.
const Hero: React.FC<{ from: number; n: number; img: string; glow: string; h: string; a: string; claim: React.ReactNode; pill: string; pillAt: number; children?: React.ReactNode }> = ({ from, n, img, glow, h, a, claim, pill, pillAt, children }) => {
  const f = useCurrentFrame();
  const s = useSpring(from, theme.spring.smooth);
  const p = useSpring(pillAt, theme.spring.slap);
  return (
    <>
      <Img src={player(img)} style={{ position: 'absolute', right: -170, top: 600, width: 920, opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [260, 0]) + 'px) scale(' + (1 + (f - from) * 0.0006) + ')', transformOrigin: '50% 100%', filter: 'drop-shadow(-16px 0 36px ' + glow + ') contrast(1.06)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1150, bottom: 0, background: 'linear-gradient(180deg, rgba(11,10,13,0), rgba(11,10,13,0.95) 35%)' }} />
      <div style={{ position: 'absolute', top: 280, left: 90, right: 90, display: 'flex', alignItems: 'center', gap: 14, opacity: s }}>
        <div style={{ background: RED, color: '#fff', fontFamily: HV(), fontSize: 26, letterSpacing: 3, padding: '8px 16px', borderRadius: 8 }}>PICK {n} OF 3</div>
        <Img src={crest(h)} style={{ width: 60, height: 60, objectFit: 'contain' }} />
        <div style={{ fontFamily: D(), fontSize: 30, color: 'rgba(255,255,255,0.6)' }}>V</div>
        <Img src={crest(a)} style={{ width: 60, height: 60, objectFit: 'contain' }} />
      </div>
      <div style={{ position: 'absolute', top: 360, left: 86, width: 620, fontFamily: D(), fontSize: 96, lineHeight: 0.95, color: '#fff', textShadow: '0 8px 30px rgba(0,0,0,0.8)', transform: 'skewX(-6deg) translateY(' + interpolate(s, [0, 1], [40, 0]) + 'px)', opacity: s }}>{claim}</div>
      {children}
      {f >= pillAt ? (
        <div style={{ position: 'absolute', left: 90, top: 1120, display: 'flex', alignItems: 'center', gap: 16, background: 'linear-gradient(180deg, ' + GREEN + ', #15803d)', borderRadius: 22, padding: '14px 30px', boxShadow: '0 16px 40px rgba(34,197,94,0.45)', transform: 'scale(' + interpolate(p, [0, 0.6, 1], [1.6, 0.95, 1], CL) + ') rotate(-2deg)', opacity: Math.min(1, p * 2) }}>
          <div style={{ fontFamily: D(), fontSize: 76, color: '#0B0A0D', whiteSpace: 'nowrap' }}>{pill}</div>
        </div>
      ) : null}
    </>
  );
};

const Chip: React.FC<{ at: number; children: React.ReactNode; border?: string }> = ({ at: a, children, border = RED }) => {
  const s = useSpring(a, theme.spring.slap);
  return useCurrentFrame() < a ? null : (
    <div style={{ background: 'rgba(11,10,13,0.88)', border: '3px solid ' + border, borderRadius: 14, padding: '10px 18px', fontFamily: D(), fontSize: 46, color: '#fff', transform: 'scale(' + interpolate(s, [0, 1], [0.5, 1]) + ')', opacity: Math.min(1, s * 2), whiteSpace: 'nowrap' }}>{children}</div>
  );
};

const Big: React.FC<{ at: number; value: string; label: string; top: number; color?: string; roll?: number }> = ({ at: a, value, label, top, color = GOLD, roll }) => {
  const f = useCurrentFrame();
  const s = useSpring(a, theme.spring.slap);
  if (f < a) return null;
  const shown = roll !== undefined ? String(Math.round(interpolate(f, [a, a + 18], [0, roll], CL))) : value;
  return (
    <div style={{ position: 'absolute', left: 90, top, display: 'flex', alignItems: 'baseline', gap: 18, opacity: Math.min(1, s * 2), transform: 'scale(' + interpolate(s, [0, 0.6, 1], [1.5, 0.96, 1], CL) + ')', transformOrigin: '0 50%' }}>
      <div style={{ fontFamily: D(), fontSize: 210, lineHeight: 0.9, color, textShadow: '0 0 30px ' + color + '99, 0 8px 0 rgba(0,0,0,0.5)' }}>{shown}</div>
      <div style={{ fontFamily: HV(), fontSize: 30, letterSpacing: 2, color: '#fff', maxWidth: 300, lineHeight: 1.15 }}>{label}</div>
    </div>
  );
};

// Word captions: current word, glow style, emphasis words in gold.
const EMPH = new Set(['HOME', 'ZERO', 'EVERY', 'FIVE', 'EIGHTEEN,', 'MOST', 'COMMENT', 'ONE.']);
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
    <div style={{ position: 'absolute', top: 1330, left: 0, right: 0, textAlign: 'center', fontFamily: em ? D() : HV(), fontSize: em ? 128 : 92, color: '#fff', transform: 'scale(' + interpolate(s, [0, 1], [0.85, 1]) + ')', ...(em ? { backgroundImage: 'linear-gradient(180deg, #FFFFFF 30%, ' + RED + ')', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 18px ' + RED + ')' } : { textShadow: '0 6px 0 rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.6)' }) }}>{w.replace(/[.,]$/, '')}</div>
  );
};

const Progress: React.FC = () => {
  const f = useCurrentFrame();
  const cur = f < S1 ? 0 : f < S2 ? 1 : f < S3 ? 2 : f < S4 ? 3 : 0;
  return (
    <div style={{ position: 'absolute', top: 205, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 10 }}>
      {[1, 2, 3].map((n) => <div key={n} style={{ width: 90, height: 8, borderRadius: 4, background: n <= cur || f >= S4 ? RED : 'rgba(255,255,255,0.25)' }} />)}
    </div>
  );
};

const Scene: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const f = useCurrentFrame();
  if (f < from - 1 || f >= to + 6) return null;
  const o = interpolate(f, [to, to + 6], [1, 0], CL);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const Tint: React.FC = () => {
  const f = useCurrentFrame();
  const tint = f < S1 ? '#6a1a8a' : f < S2 ? '#EF0107' : f < S3 ? '#034694' : f < S4 ? '#0057B8' : '#6a1a8a';
  return <Stadium tint={tint} dim={0.15} />;
};

export const NP005Card: React.FC = () => {
  applyBrand('ninetyplus');
  const f = useCurrentFrame();
  const END = Math.ceil(np005.endSec * FPS);
  const hit = (from: number, name: string, vol = 0.4, dur = 1.2) => <Sequence from={Math.max(0, from - 1)} durationInFrames={Math.round(dur * FPS)} layout='none'><Audio src={sfx(name)} volume={vol} /></Sequence>;
  return (
    <AbsoluteFill style={{ background: '#0B0A0D' }}>
      <Tint />
      {/* HOOK: whole card on frame 0 */}
      <Scene from={0} to={S1}>
        <Fan from={0} />
        <Card from={2} />
        <div style={{ position: 'absolute', top: 280, left: 0, right: 0, textAlign: 'center', fontFamily: HV(), fontSize: 30, letterSpacing: 6, color: 'rgba(255,255,255,0.85)' }}>NINETY PLUS · RECORD <span style={{ color: GOLD }}>5-1</span></div>
      </Scene>
      {/* PICK 1: Arsenal at Forest */}
      <Scene from={S1} to={S2}>
        <Hero from={S1} n={1} img='saka' glow='rgba(239,1,7,0.6)' h='nfo' a='ars' pill='ARSENAL TO WIN' pillAt={at(20)}
          claim={<>FOREST:<br /><span style={{ color: GOLD }}>0</span> HOME<br />GOALS</>}>
          <div style={{ position: 'absolute', left: 90, top: 720, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontFamily: HV(), fontSize: 24, letterSpacing: 3, color: 'rgba(255,255,255,0.75)' }}>FOREST AT HOME</div>
            <Chip at={at(15)}>0-1 COV</Chip>
            <Chip at={at(16)}>0-0 TOT</Chip>
            <Chip at={at(17)}>0-1 LEE</Chip>
          </div>
        </Hero>
      </Scene>
      {/* PICK 2: Everton v Chelsea, both teams score */}
      <Scene from={S2} to={S3}>
        <Hero from={S2} n={2} img='palmer' glow='rgba(3,70,148,0.8)' h='eve' a='che' pill='BOTH TEAMS SCORE' pillAt={at(39)}
          claim={<>CHELSEA<br />CONCEDE<br /><span style={{ color: GOLD }}>EVERY</span> GAME</>}>
          <div style={{ position: 'absolute', left: 90, top: 720, width: 560, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {[['bou', '1'], ['bre', '3'], ['hul', '2'], ['ars', '2'], ['bha', '3'], ['ful', '2']].map(([k, v], i) => (
              <Chip key={k} at={at(24) + i * 4} border='#034694'><span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}><Img src={crest(k)} style={{ width: 44, height: 44, objectFit: 'contain' }} />{v}</span></Chip>
            ))}
          </div>
          <Big at={at(36)} value='5/6' label='EVERTON HAVE SCORED IN' top={890} color={GOLD} />
        </Hero>
      </Scene>
      {/* PICK 3: Brighton v Palace */}
      <Scene from={S3} to={S4}>
        <Hero from={S3} n={3} img='mitoma' glow='rgba(0,87,184,0.8)' h='bha' a='cry' pill='BRIGHTON TO WIN' pillAt={at(52)}
          claim={<>BRIGHTON<br />SCORE<br /><span style={{ color: GOLD }}>FOR FUN</span></>}>
          <Big at={at(46)} value='18' roll={18} label='GOALS · MOST IN THE PREMIER LEAGUE' top={760} />
        </Hero>
      </Scene>
      {/* OUTRO: card back, record, comment */}
      <Scene from={S4} to={END + 10}>
        <Fan from={S4} />
        <Card from={S4 + 2} />
        <Big at={at(56)} value='5-1' label='RECORD' top={1160} />
        {f >= at(59) ? (
          <div style={{ position: 'absolute', top: 280, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: GOLD, color: '#0B0A0D', fontFamily: D(), fontSize: 64, padding: '10px 30px', borderRadius: 16, boxShadow: '0 14px 40px rgba(255,210,63,0.45)', transform: 'translateY(' + Math.sin(f / 4) * 6 + 'px)', display: 'flex', alignItems: 'center', gap: 16 }}>COMMENT YOUR PICK <div style={{ width: 0, height: 0, borderLeft: '18px solid transparent', borderRight: '18px solid transparent', borderTop: '24px solid #0B0A0D' }} /></div>
          </div>
        ) : null}
      </Scene>
      <Progress />
      <Captions />
      <Audio src={staticFile(np005.voiceover)} />
      {hit(0, 'bass_impact.MP3', 0.5)}
      {hit(S1, 'whoosh_motion.MP3')}
      {hit(at(15), 'pop_sound.MP3', 0.35, 0.5)}{hit(at(16), 'pop_sound.MP3', 0.35, 0.5)}{hit(at(17), 'pop_sound.MP3', 0.35, 0.5)}
      {hit(at(20), 'punch_sound.MP3', 0.45)}
      {hit(S2, 'fast_swoosh.MP3')}
      {hit(at(36), 'bass_impact.MP3', 0.45)}
      {hit(at(39), 'punch_sound.MP3', 0.45)}
      {hit(S3, 'classic_whoosh.MP3')}
      {hit(at(46), 'magic_reveal.MP3', 0.35)}
      {hit(at(52), 'punch_sound.MP3', 0.45)}
      {hit(S4, 'title_swoosh.MP3')}
      {hit(at(56), 'cinematic_whoosh_impact.MP3', 0.5)}
      {hit(at(59), 'pop_whoosh.MP3', 0.4)}
    </AbsoluteFill>
  );
};
export const NP005_CARD_FRAMES = Math.ceil(np005.endSec * FPS);
