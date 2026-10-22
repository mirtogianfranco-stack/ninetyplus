import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { theme, applyBrand } from '../theme';
import { Stadium } from './Mockups';
import words from '../../video-projects/np-013/vo/words.json';

// NP-013: Premier League Weekend Card, 24-25 Oct 2026, four legs incl. an anytime scorer. Weekend Card look + original beat. Voice: bm_george.
// Sources: Understat 2026-27 EPL data (Chelsea 6/7 games 3+ goals; Palace 2.79 xGA/g at home; Brighton 23 goals; Isak 5 goals in 6 games);
// Liverpool absences (Frimpong, Bradley) Sports Mole / Liverpool.com, 22 Oct. Kick-offs ESPN eng.1. Standalone composition: gate does not cover it.

const RED = '#FF2E4D';
const GOLD = '#FFD23F';
const GREEN = '#22C55E';
const W: { word: string; start: number; end: number }[] = words.words;
export const NP013_SEC = words.duration;
const FPS = 30;
const at = (i: number) => Math.round(W[i].start * FPS);
const crest = (k: string) => staticFile('np-013/logos/' + k + '.png');
const player = (k: string) => staticFile('mockups/' + k + '.png');
const sfx = (n: string) => staticFile('np-013/sfx/' + n);
const D = () => theme.fonts.display;
const HV = () => theme.fonts.heavy;
const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
type Cfg = { damping: number; stiffness: number; mass: number };
const useSpring = (from: number, cfg: Cfg = theme.spring.snappy) => spring({ frame: useCurrentFrame() - from, fps: FPS, config: cfg });

// Word indices: hook 0-5, Chelsea/Spurs 6-22, Palace/Newcastle 23-35, Liverpool/Brighton 36-51, Isak 52-62, outro 63-end.
const S1 = at(6), S2 = at(23), S3 = at(36), S4 = at(52), S5 = at(63);

const ROWS: [string, string, string, string][] = [['che', 'tot', '3+ GOALS', 'SAT 12:30 PM'], ['cry', 'new', 'NEWCASTLE TO WIN', 'SUN 10 AM'], ['liv', 'bha', 'BOTH TEAMS SCORE', 'SUN 10 AM'], ['liv', 'bha', 'ISAK TO SCORE', 'SUN 10 AM']];

const Row: React.FC<{ n: number; h: string; a: string; t: string; k: string; from: number }> = ({ n, h, a, t, k, from }) => {
  const s = useSpring(from);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(11,10,13,0.72)', borderRadius: 20, padding: '12px 18px', marginTop: n > 1 ? 10 : 0, border: '1px solid rgba(255,255,255,0.12)', opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [80, 0]) + 'px)' }}>
      <div style={{ fontFamily: D(), fontSize: 40, color: RED, width: 30 }}>{n}</div>
      <Img src={crest(h)} style={{ width: 58, height: 58, objectFit: 'contain', filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.9))' }} />
      <Img src={crest(a)} style={{ width: 58, height: 58, objectFit: 'contain', filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.9))' }} />
      <div style={{ fontFamily: D(), fontSize: 44, color: '#fff', flex: 1, whiteSpace: 'nowrap' }}>{t}</div>
      <div style={{ fontFamily: HV(), fontSize: 18, color: 'rgba(255,255,255,0.65)', letterSpacing: 1, whiteSpace: 'nowrap' }}>{k} ET</div>
    </div>
  );
};

const Card: React.FC<{ from: number; top: number }> = ({ from, top }) => {
  const s = useSpring(from, theme.spring.smooth);
  return (
    <div style={{ position: 'absolute', left: 90, right: 90, top, background: 'linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))', border: '2px solid rgba(255,255,255,0.28)', borderRadius: 34, padding: '24px 24px 20px', boxShadow: '0 30px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.4)', backdropFilter: 'blur(14px)', opacity: Math.min(1, s * 1.4), transform: 'translateY(' + interpolate(s, [0, 1], [120, 0]) + 'px) scale(' + interpolate(s, [0, 1], [0.92, 1]) + ')' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontFamily: D(), fontSize: 56, color: '#fff', letterSpacing: 2 }}>WEEKEND <span style={{ color: RED }}>CARD</span></div>
        <div style={{ fontFamily: HV(), fontSize: 20, color: 'rgba(255,255,255,0.75)', letterSpacing: 2 }}>PREMIER LEAGUE</div>
      </div>
      {ROWS.map(([h, a, t, k], i) => <Row key={t} n={i + 1} h={h} a={a} t={t} k={k} from={from + 6 + i * 4} />)}
    </div>
  );
};

// Hook/outro fan: Palmer (Chelsea) and Mitoma (Brighton) flanking the Liverpool + Newcastle crests.
const Fan: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  const s = useSpring(from, theme.spring.smooth);
  const b = Math.sin(f / 40) * 6;
  return (
    <>
      <Img src={player('palmer')} style={{ position: 'absolute', left: -110, top: 250 + b, width: 560, opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [-200, 0]) + 'px) rotate(-5deg)', filter: 'drop-shadow(0 0 28px rgba(3,70,148,0.8)) contrast(1.05)' }} />
      <Img src={player('mitoma')} style={{ position: 'absolute', right: -110, top: 250 - b, width: 560, opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [200, 0]) + 'px) rotate(5deg)', filter: 'drop-shadow(0 0 28px rgba(0,87,184,0.8)) contrast(1.05)' }} />
      <Img src={crest('liv')} style={{ position: 'absolute', left: 350, top: 300 - b, width: 180, height: 180, objectFit: 'contain', opacity: s, filter: 'drop-shadow(0 0 30px rgba(254,190,16,0.6))' }} />
      <Img src={crest('new')} style={{ position: 'absolute', left: 550, top: 300 + b, width: 180, height: 180, objectFit: 'contain', opacity: s, filter: 'drop-shadow(0 0 30px rgba(220,5,45,0.6))' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 480, height: 200, background: 'linear-gradient(180deg, rgba(11,10,13,0), rgba(11,10,13,0.85))' }} />
    </>
  );
};

const Hero: React.FC<{ from: number; n: number; img?: string; big?: string; glow: string; h: string; a: string; time: string; claim: React.ReactNode; pill: string; pillAt: number; children?: React.ReactNode }> = ({ from, n, img, big, glow, h, a, time, claim, pill, pillAt, children }) => {
  const f = useCurrentFrame();
  const s = useSpring(from, theme.spring.smooth);
  const p = useSpring(pillAt, theme.spring.slap);
  return (
    <>
      {img ? (
        <Img src={player(img)} style={{ position: 'absolute', right: -170, top: 560, width: 900, opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [260, 0]) + 'px) scale(' + (1 + (f - from) * 0.0006) + ')', transformOrigin: '50% 100%', filter: 'drop-shadow(-16px 0 36px ' + glow + ') contrast(1.06)' }} />
      ) : (
        <>
          <div style={{ position: 'absolute', right: -260, top: 600, width: 720, height: 720, borderRadius: '50%', background: 'radial-gradient(circle, ' + glow + ' 0%, rgba(0,0,0,0) 65%)', opacity: s }} />
          <Img src={crest(big!)} style={{ position: 'absolute', right: -150, top: 680, width: 520, height: 520, objectFit: 'contain', opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [240, 0]) + 'px) rotate(' + (8 - (f - from) * 0.02) + 'deg) scale(' + (1 + (f - from) * 0.0008) + ')', filter: 'drop-shadow(0 0 50px ' + glow + ') drop-shadow(0 30px 40px rgba(0,0,0,0.7))' }} />
        </>
      )}
      <div style={{ position: 'absolute', top: 280, left: 90, right: 90, display: 'flex', alignItems: 'center', gap: 14, opacity: s }}>
        <div style={{ background: RED, color: '#fff', fontFamily: HV(), fontSize: 26, letterSpacing: 3, padding: '8px 16px', borderRadius: 8 }}>PICK {n} OF 4</div>
        <Img src={crest(h)} style={{ width: 60, height: 60, objectFit: 'contain', filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.9))' }} />
        <div style={{ fontFamily: D(), fontSize: 30, color: 'rgba(255,255,255,0.6)' }}>V</div>
        <Img src={crest(a)} style={{ width: 60, height: 60, objectFit: 'contain', filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.9))' }} />
        <div style={{ fontFamily: HV(), fontSize: 20, color: 'rgba(255,255,255,0.7)', letterSpacing: 2 }}>{time} ET</div>
      </div>
      <div style={{ position: 'absolute', top: 360, left: 86, width: 660, fontFamily: D(), fontSize: 96, lineHeight: 0.95, color: '#fff', textShadow: '0 8px 30px rgba(0,0,0,0.8)', transform: 'skewX(-6deg) translateY(' + interpolate(s, [0, 1], [40, 0]) + 'px)', opacity: s }}>{claim}</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1150, bottom: 0, background: 'linear-gradient(180deg, rgba(11,10,13,0), rgba(11,10,13,0.95) 35%)' }} />
      {children}
      {f >= pillAt ? (
        <div style={{ position: 'absolute', left: 90, top: 1120, display: 'flex', alignItems: 'center', background: 'linear-gradient(180deg, ' + GREEN + ', #15803d)', borderRadius: 22, padding: '14px 30px', boxShadow: '0 16px 40px rgba(34,197,94,0.45)', transform: 'scale(' + interpolate(p, [0, 0.6, 1], [1.6, 0.95, 1], CL) + ') rotate(-2deg)', opacity: Math.min(1, p * 2) }}>
          <div style={{ fontFamily: D(), fontSize: 76, color: '#0B0A0D', whiteSpace: 'nowrap' }}>{pill}</div>
        </div>
      ) : null}
    </>
  );
};

const Chip: React.FC<{ at: number; children: React.ReactNode; border?: string; tag?: string }> = ({ at: a, children, border = RED, tag }) => {
  const s = useSpring(a, theme.spring.slap);
  if (useCurrentFrame() < a) return null;
  return (
    <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(11,10,13,0.88)', border: '3px solid ' + border, borderRadius: 14, padding: '10px 18px', fontFamily: D(), fontSize: 48, color: '#fff', transform: 'scale(' + interpolate(s, [0, 1], [0.5, 1]) + ')', opacity: Math.min(1, s * 2), whiteSpace: 'nowrap' }}>
      {children}
      {tag ? <span style={{ fontFamily: HV(), fontSize: 18, letterSpacing: 2, background: GOLD, color: '#0B0A0D', borderRadius: 6, padding: '4px 8px' }}>{tag}</span> : null}
    </div>
  );
};

const Big: React.FC<{ at: number; value: string; label: string; top: number; color?: string }> = ({ at: a, value, label, top, color = GOLD }) => {
  const s = useSpring(a, theme.spring.slap);
  if (useCurrentFrame() < a) return null;
  return (
    <div style={{ position: 'absolute', left: 90, top, display: 'flex', alignItems: 'baseline', gap: 18, opacity: Math.min(1, s * 2), transform: 'scale(' + interpolate(s, [0, 0.6, 1], [1.5, 0.96, 1], CL) + ')', transformOrigin: '0 50%' }}>
      <div style={{ fontFamily: D(), fontSize: 190, lineHeight: 0.9, color, textShadow: '0 0 30px ' + color + '99, 0 8px 0 rgba(0,0,0,0.5)' }}>{value}</div>
      <div style={{ fontFamily: HV(), fontSize: 26, letterSpacing: 2, color: '#fff', maxWidth: 260, lineHeight: 1.15 }}>{label}</div>
    </div>
  );
};

const EMPH = new Set(['BOLD', 'SIX', 'THREE', 'TWENTY', 'THIN.', 'FIVE', 'COMMENT']);
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
    <div style={{ position: 'absolute', top: 1330, left: 0, right: 0, textAlign: 'center', fontFamily: em ? D() : HV(), fontSize: em ? 128 : 92, color: '#fff', transform: 'scale(' + interpolate(s, [0, 1], [0.85, 1]) + ')', ...(em ? { backgroundImage: 'linear-gradient(180deg, #FFFFFF 30%, ' + RED + ')', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 18px ' + RED + ')' } : { textShadow: '0 6px 0 rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.6)' }) }}>{w.replace(/[.,?]$/, '')}</div>
  );
};

const Progress: React.FC = () => {
  const f = useCurrentFrame();
  const cur = f < S1 ? 0 : f < S2 ? 1 : f < S3 ? 2 : f < S4 ? 3 : 4;
  return (
    <div style={{ position: 'absolute', top: 205, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 10 }}>
      {[1, 2, 3, 4].map((n) => <div key={n} style={{ width: 84, height: 8, borderRadius: 4, background: n <= cur ? RED : 'rgba(255,255,255,0.25)' }} />)}
    </div>
  );
};

const Scene: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const f = useCurrentFrame();
  if (f < from - 1 || f >= to + 6) return null;
  return <AbsoluteFill style={{ opacity: interpolate(f, [to, to + 6], [1, 0], CL) }}>{children}</AbsoluteFill>;
};

const Tint: React.FC = () => {
  const f = useCurrentFrame();
  const tint = f < S1 ? '#1a2a8a' : f < S2 ? '#034694' : f < S3 ? '#3a3a3a' : f < S4 ? '#0057B8' : f < S5 ? '#C8102E' : '#1a2a8a';
  return <Stadium tint={tint} dim={0.15} />;
};

export const NP013Card: React.FC = () => {
  applyBrand('ninetyplus');
  const f = useCurrentFrame();
  const END = Math.ceil(NP013_SEC * FPS);
  const hit = (from: number, name: string, vol = 0.4, dur = 1.2) => <Sequence from={Math.max(0, from - 1)} durationInFrames={Math.round(dur * FPS)} layout='none'><Audio src={sfx(name)} volume={vol} /></Sequence>;
  return (
    <AbsoluteFill style={{ background: '#0B0A0D' }}>
      <Tint />
      {/* HOOK: whole weekend card on frame 0 */}
      <Scene from={0} to={S1}>
        <Fan from={-12} />
        <Card from={-14} top={640} />
        <div style={{ position: 'absolute', top: 260, left: 0, right: 0, textAlign: 'center', fontFamily: HV(), fontSize: 30, letterSpacing: 6, color: 'rgba(255,255,255,0.85)' }}>NINETY PLUS · RECORD <span style={{ color: GOLD }}>16-5</span></div>
      </Scene>
      {/* PICK 1: Chelsea v Spurs, 3+ goals */}
      <Scene from={S1} to={S2}>
        <Hero from={S1} n={1} img='palmer' glow='rgba(3,70,148,0.85)' h='che' a='tot' time='SAT 12:30 PM' pill='3+ GOALS' pillAt={at(20)}
          claim={<>CHELSEA<br />GAMES<br /><span style={{ color: GOLD }}>EXPLODE</span></>}>
          <Big at={at(14)} value='6/7' label='CHELSEA GAMES WITH 3+ GOALS' top={720} />
        </Hero>
      </Scene>
      {/* PICK 2: Newcastle to win at Palace */}
      <Scene from={S2} to={S3}>
        <Hero from={S2} n={2} big='new' glow='rgba(255,255,255,0.45)' h='cry' a='new' time='SUN 10 AM' pill='NEWCASTLE TO WIN' pillAt={at(33)}
          claim={<>PALACE<br />LEAK<br /><span style={{ color: RED }}>AT HOME</span></>}>
          <Big at={at(26)} value='2.79' label='EXPECTED GOALS CONCEDED A GAME · PALACE AT HOME' top={720} color={RED} />
        </Hero>
      </Scene>
      {/* PICK 3: Liverpool v Brighton, both teams score */}
      <Scene from={S3} to={S4}>
        <Hero from={S3} n={3} img='mitoma' glow='rgba(0,87,184,0.85)' h='liv' a='bha' time='SUN 10 AM' pill='BOTH TEAMS SCORE' pillAt={at(49)}
          claim={<>BRIGHTON<br />SCORE<br /><span style={{ color: GOLD }}>FOR FUN</span></>}>
          <Big at={at(39)} value='23' label='BRIGHTON GOALS ALREADY' top={700} />
          <div style={{ position: 'absolute', left: 90, top: 960, display: 'flex', flexDirection: 'row', gap: 12 }}>
            <Chip at={at(44)} tag='OUT'>FRIMPONG</Chip>
            <Chip at={at(45)} tag='OUT'>BRADLEY</Chip>
          </div>
        </Hero>
      </Scene>
      {/* PICK 4: Isak to score */}
      <Scene from={S4} to={S5}>
        <Hero from={S4} n={4} big='liv' glow='rgba(200,16,46,0.8)' h='liv' a='bha' time='SUN 10 AM' pill='ISAK TO SCORE' pillAt={at(60)}
          claim={<>ISAK<br /><span style={{ color: GOLD }}>CAN&apos;T STOP</span><br />SCORING</>}>
          <Big at={at(55)} value='5' label='GOALS IN 6 PREMIER LEAGUE GAMES' top={720} />
        </Hero>
      </Scene>
      {/* OUTRO: card back + comment */}
      <Scene from={S5} to={END + 10}>
        <Fan from={S5} />
        <Card from={S5 + 2} top={640} />
        {f >= at(67) ? (
          <div style={{ position: 'absolute', top: 280, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: GOLD, color: '#0B0A0D', fontFamily: D(), fontSize: 64, padding: '10px 30px', borderRadius: 16, boxShadow: '0 14px 40px rgba(255,210,63,0.45)', transform: 'translateY(' + Math.sin(f / 4) * 6 + 'px)', display: 'flex', alignItems: 'center', gap: 16 }}>COMMENT YOUR PICK <div style={{ width: 0, height: 0, borderLeft: '18px solid transparent', borderRight: '18px solid transparent', borderTop: '24px solid #0B0A0D' }} /></div>
          </div>
        ) : null}
      </Scene>
      <Progress />
      <Captions />
      <Audio src={staticFile('np-013/voiceover.wav')} />
      <Audio src={staticFile('np-013/music/bed.wav')} volume={0.16} />
      {hit(0, 'bass_impact.MP3', 0.5)}
      {hit(S1, 'whoosh_motion.MP3')}
      {hit(at(14), 'magic_reveal.MP3', 0.35)}
      {hit(at(20), 'punch_sound.MP3', 0.45)}
      {hit(S2, 'fast_swoosh.MP3')}
      {hit(at(26), 'bass_impact.MP3', 0.45)}
      {hit(at(33), 'cinematic_whoosh_impact.MP3', 0.45)}
      {hit(S3, 'classic_whoosh.MP3')}
      {hit(at(39), 'pop_whoosh.MP3', 0.35, 0.6)}
      {hit(at(44), 'pop_sound.MP3', 0.35, 0.5)}
      {hit(at(49), 'punch_sound.MP3', 0.45)}
      {hit(S4, 'title_swoosh.MP3')}
      {hit(at(55), 'glitch_sound.MP3', 0.35, 0.6)}
      {hit(at(60), 'cinematic_whoosh_impact.MP3', 0.45)}
      {hit(S5, 'title_swoosh.MP3')}
      {hit(at(67), 'pop_sound.MP3', 0.4)}
    </AbsoluteFill>
  );
};
export const NP013_CARD_FRAMES = Math.ceil(NP013_SEC * FPS);
