import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { theme, applyBrand } from '../theme';
import { Stadium } from './Mockups';
import words from '../../video-projects/np-008/vo/words.json';

// NP-008: UCL matchday 3, Tuesday 20 Oct 2026, five legs in the Weekend Card look. Voice: bm_george.
// Sources: Barcelona absences (Koundé, Eric García) ESPN + beIN previews; Villarreal 4.0 goals/game over last 6 UCL games,
// Sportytrader preview. Kick-offs ESPN scoreboard (all 19:00 UTC = 3:00 PM ET). Standalone composition: gate does not cover it.

const RED = '#FF2E4D';
const GOLD = '#FFD23F';
const GREEN = '#22C55E';
const W: { word: string; start: number; end: number }[] = words.words;
export const NP008_SEC = words.duration;
const FPS = 30;
const at = (i: number) => Math.round(W[i].start * FPS);
const crest = (k: string) => staticFile('np-008/logos/' + k + '.png');
const player = (k: string) => staticFile('mockups/' + k + '.png');
const sfx = (n: string) => staticFile('np-008/sfx/' + n);
const D = () => theme.fonts.display;
const HV = () => theme.fonts.heavy;
const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
type Cfg = { damping: number; stiffness: number; mass: number };
const useSpring = (from: number, cfg: Cfg = theme.spring.snappy) => spring({ frame: useCurrentFrame() - from, fps: FPS, config: cfg });

// Word indices: hook 0-6, PSG 7-16, City 17-22, Roma 23-27, Liverpool 28-42, Stuttgart 43-53, outro 54-end.
const S1 = at(7), S2 = at(17), S3 = at(23), S4 = at(28), S5 = at(43), S6 = at(54);

const ROWS: [string, string, string][] = [['psg', 'bar', '3+ GOALS'], ['mci', 'aek', 'CITY TO WIN'], ['rom', 'slo', 'ROMA TO WIN'], ['liv', 'vil', 'BOTH TEAMS SCORE'], ['stu', 'atm', 'BOTH TEAMS SCORE']];

const Row: React.FC<{ n: number; h: string; a: string; t: string; from: number }> = ({ n, h, a, t, from }) => {
  const s = useSpring(from);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(11,10,13,0.72)', borderRadius: 20, padding: '12px 18px', marginTop: n > 1 ? 10 : 0, border: '1px solid rgba(255,255,255,0.12)', opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [80, 0]) + 'px)' }}>
      <div style={{ fontFamily: D(), fontSize: 40, color: RED, width: 30 }}>{n}</div>
      <Img src={crest(h)} style={{ width: 58, height: 58, objectFit: 'contain' }} />
      <Img src={crest(a)} style={{ width: 58, height: 58, objectFit: 'contain' }} />
      <div style={{ fontFamily: D(), fontSize: 46, color: '#fff', flex: 1, whiteSpace: 'nowrap' }}>{t}</div>
    </div>
  );
};

const Card: React.FC<{ from: number; top: number }> = ({ from, top }) => {
  const s = useSpring(from, theme.spring.smooth);
  return (
    <div style={{ position: 'absolute', left: 90, right: 90, top, background: 'linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))', border: '2px solid rgba(255,255,255,0.28)', borderRadius: 34, padding: '24px 24px 20px', boxShadow: '0 30px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.4)', backdropFilter: 'blur(14px)', opacity: Math.min(1, s * 1.4), transform: 'translateY(' + interpolate(s, [0, 1], [120, 0]) + 'px) scale(' + interpolate(s, [0, 1], [0.92, 1]) + ')' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontFamily: D(), fontSize: 56, color: '#fff', letterSpacing: 2 }}>TUESDAY <span style={{ color: RED }}>CARD</span></div>
        <div style={{ fontFamily: HV(), fontSize: 20, color: 'rgba(255,255,255,0.75)', letterSpacing: 2, textAlign: 'right', lineHeight: 1.3 }}>CHAMPIONS LEAGUE<br />ALL 3:00 PM ET</div>
      </div>
      {ROWS.map(([h, a, t], i) => <Row key={h} n={i + 1} h={h} a={a} t={t} from={from + 6 + i * 4} />)}
    </div>
  );
};

// Hook/outro fan: PSG + Liverpool crests and Haaland (the only current-kit cut-out available for these sides).
const Fan: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  const s = useSpring(from, theme.spring.smooth);
  const b = Math.sin(f / 40) * 6;
  return (
    <>
      <Img src={crest('psg')} style={{ position: 'absolute', left: 40, top: 300 + b, width: 300, height: 300, objectFit: 'contain', opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [-200, 0]) + 'px) rotate(-8deg)', filter: 'drop-shadow(0 0 40px rgba(0,65,112,0.9)) drop-shadow(0 20px 30px rgba(0,0,0,0.6))' }} />
      <Img src={crest('liv')} style={{ position: 'absolute', left: 330, top: 250 - b, width: 260, height: 260, objectFit: 'contain', opacity: s, transform: 'translateY(' + interpolate(s, [0, 1], [-120, 0]) + 'px)', filter: 'drop-shadow(0 0 40px rgba(200,16,46,0.8)) drop-shadow(0 20px 30px rgba(0,0,0,0.6))' }} />
      <Img src={player('haaland')} style={{ position: 'absolute', right: -110, top: 250 - b, width: 600, opacity: s, transform: 'translateX(' + interpolate(s, [0, 1], [200, 0]) + 'px) rotate(5deg)', filter: 'drop-shadow(0 0 28px rgba(108,171,221,0.8)) contrast(1.05)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 480, height: 200, background: 'linear-gradient(180deg, rgba(11,10,13,0), rgba(11,10,13,0.85))' }} />
    </>
  );
};

// One pick: hero (player cut-out or giant lit crest) on the right, header + claim left, stat area, pill on its word.
const Hero: React.FC<{ from: number; n: number; img?: string; big?: string; glow: string; h: string; a: string; claim: React.ReactNode; pill: string; pillAt: number; children?: React.ReactNode }> = ({ from, n, img, big, glow, h, a, claim, pill, pillAt, children }) => {
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
        <div style={{ background: RED, color: '#fff', fontFamily: HV(), fontSize: 26, letterSpacing: 3, padding: '8px 16px', borderRadius: 8 }}>PICK {n} OF 5</div>
        <Img src={crest(h)} style={{ width: 60, height: 60, objectFit: 'contain' }} />
        <div style={{ fontFamily: D(), fontSize: 30, color: 'rgba(255,255,255,0.6)' }}>V</div>
        <Img src={crest(a)} style={{ width: 60, height: 60, objectFit: 'contain' }} />
        <div style={{ fontFamily: HV(), fontSize: 20, color: 'rgba(255,255,255,0.7)', letterSpacing: 2 }}>TUE 3:00 PM ET</div>
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

const Chip: React.FC<{ at: number; children: React.ReactNode; border?: string; struck?: boolean }> = ({ at: a, children, border = RED, struck }) => {
  const f = useCurrentFrame();
  const s = useSpring(a, theme.spring.slap);
  if (f < a) return null;
  const line = interpolate(f, [a + 4, a + 12], [0, 100], CL);
  return (
    <div style={{ position: 'relative', alignSelf: 'flex-start', background: 'rgba(11,10,13,0.88)', border: '3px solid ' + border, borderRadius: 14, padding: '10px 18px', fontFamily: D(), fontSize: 50, color: struck ? 'rgba(255,255,255,0.6)' : '#fff', transform: 'scale(' + interpolate(s, [0, 1], [0.5, 1]) + ')', opacity: Math.min(1, s * 2), whiteSpace: 'nowrap' }}>
      {children}
      {struck ? <div style={{ position: 'absolute', left: 12, top: '52%', height: 6, width: 'calc((100% - 24px) * ' + line / 100 + ')', background: RED, borderRadius: 3, boxShadow: '0 0 10px ' + RED }} /> : null}
    </div>
  );
};

const Big: React.FC<{ at: number; value: string; label: string; top: number; color?: string }> = ({ at: a, value, label, top, color = GOLD }) => {
  const s = useSpring(a, theme.spring.slap);
  if (useCurrentFrame() < a) return null;
  return (
    <div style={{ position: 'absolute', left: 90, top, display: 'flex', alignItems: 'baseline', gap: 18, opacity: Math.min(1, s * 2), transform: 'scale(' + interpolate(s, [0, 0.6, 1], [1.5, 0.96, 1], CL) + ')', transformOrigin: '0 50%' }}>
      <div style={{ fontFamily: D(), fontSize: 190, lineHeight: 0.9, color, textShadow: '0 0 30px ' + color + '99, 0 8px 0 rgba(0,0,0,0.5)' }}>{value}</div>
      <div style={{ fontFamily: HV(), fontSize: 28, letterSpacing: 2, color: '#fff', maxWidth: 250, lineHeight: 1.15 }}>{label}</div>
    </div>
  );
};

// Stamp for the honest risk call on leg 5.
const Stamp: React.FC<{ at: number; text: string; top: number }> = ({ at: a, text, top }) => {
  const s = useSpring(a, theme.spring.slap);
  if (useCurrentFrame() < a) return null;
  return (
    <div style={{ position: 'absolute', left: 90, top, border: '6px solid ' + GOLD, color: GOLD, borderRadius: 14, padding: '6px 22px', fontFamily: D(), fontSize: 72, letterSpacing: 3, background: 'rgba(11,10,13,0.8)', transform: 'rotate(-6deg) scale(' + interpolate(s, [0, 0.6, 1], [2, 0.92, 1], CL) + ')', opacity: Math.min(1, s * 2), boxShadow: '0 0 30px rgba(255,210,63,0.4)' }}>{text}</div>
  );
};

const EMPH = new Set(['NOBODY', 'MISSING', 'THREE', 'FOUR', 'RISKIEST', 'WEDNESDAY.', 'COMMENT']);
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
  const cur = f < S1 ? 0 : f < S2 ? 1 : f < S3 ? 2 : f < S4 ? 3 : f < S5 ? 4 : f < S6 ? 5 : 5;
  return (
    <div style={{ position: 'absolute', top: 205, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 10 }}>
      {[1, 2, 3, 4, 5].map((n) => <div key={n} style={{ width: 72, height: 8, borderRadius: 4, background: n <= cur ? RED : 'rgba(255,255,255,0.25)' }} />)}
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
  const tint = f < S1 ? '#1a2a8a' : f < S2 ? '#004170' : f < S3 ? '#6CABDD' : f < S4 ? '#8E1F2F' : f < S5 ? '#C8102E' : f < S6 ? '#E32219' : '#1a2a8a';
  return <Stadium tint={tint} dim={0.15} />;
};

export const NP008Card: React.FC = () => {
  applyBrand('ninetyplus');
  const f = useCurrentFrame();
  const END = Math.ceil(NP008_SEC * FPS);
  const hit = (from: number, name: string, vol = 0.4, dur = 1.2) => <Sequence from={Math.max(0, from - 1)} durationInFrames={Math.round(dur * FPS)} layout='none'><Audio src={sfx(name)} volume={vol} /></Sequence>;
  return (
    <AbsoluteFill style={{ background: '#0B0A0D' }}>
      <Tint />
      {/* HOOK: whole Tuesday card on frame 0 */}
      <Scene from={0} to={S1}>
        <Fan from={-12} />
        <Card from={-14} top={620} />
        <div style={{ position: 'absolute', top: 260, left: 0, right: 0, textAlign: 'center', fontFamily: HV(), fontSize: 30, letterSpacing: 6, color: 'rgba(255,255,255,0.85)' }}>NINETY PLUS · RECORD <span style={{ color: GOLD }}>8-4</span></div>
      </Scene>
      {/* PICK 1: PSG v Barcelona, 3+ goals; Barcelona's missing defenders struck off */}
      <Scene from={S1} to={S2}>
        <Hero from={S1} n={1} big='bar' glow='rgba(165,0,68,0.75)' h='psg' a='bar' pill='3+ GOALS' pillAt={at(14)}
          claim={<>BARÇA&apos;S<br />BACK LINE<br /><span style={{ color: GOLD }}>IS GONE</span></>}>
          <div style={{ position: 'absolute', left: 90, top: 720, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontFamily: HV(), fontSize: 24, letterSpacing: 3, color: 'rgba(255,255,255,0.75)' }}>OUT IN PARIS</div>
            <Chip at={at(7)} struck>KOUNDÉ</Chip>
            <Chip at={at(9)} struck>ERIC GARCÍA</Chip>
          </div>
        </Hero>
      </Scene>
      {/* PICK 2: Man City v AEK, Haaland hero, big crest matchup */}
      <Scene from={S2} to={S3}>
        <Hero from={S2} n={2} img='haaland' glow='rgba(108,171,221,0.85)' h='mci' a='aek' pill='CITY TO WIN' pillAt={at(19)}
          claim={<>CITY<br />AT THE<br /><span style={{ color: GOLD }}>ETIHAD</span></>}>
          <div style={{ position: 'absolute', left: 90, top: 760, display: 'flex', alignItems: 'center', gap: 22 }}>
            <Img src={crest('mci')} style={{ width: 150, height: 150, objectFit: 'contain', filter: 'drop-shadow(0 0 24px rgba(108,171,221,0.8))' }} />
            <div style={{ fontFamily: D(), fontSize: 64, color: 'rgba(255,255,255,0.7)' }}>V</div>
            <Img src={crest('aek')} style={{ width: 130, height: 130, objectFit: 'contain', opacity: 0.75 }} />
          </div>
        </Hero>
      </Scene>
      {/* PICK 3: Roma v Slovan, crest hero */}
      <Scene from={S3} to={S4}>
        <Hero from={S3} n={3} big='rom' glow='rgba(240,188,66,0.7)' h='rom' a='slo' pill='ROMA TO WIN' pillAt={at(24)}
          claim={<>ROMA<br />AT THE<br /><span style={{ color: GOLD }}>OLIMPICO</span></>} />
      </Scene>
      {/* PICK 4: Liverpool v Villarreal, Isak hero, Villarreal 4.0 goals a game */}
      <Scene from={S4} to={S5}>
        <Hero from={S4} n={4} big='liv' glow='rgba(200,16,46,0.8)' h='liv' a='vil' pill='BOTH TEAMS SCORE' pillAt={at(40)}
          claim={<>VILLARREAL<br />GAMES<br /><span style={{ color: GOLD }}>EXPLODE</span></>}>
          <Big at={at(34)} value='4.0' label="GOALS A GAME · VILLARREAL'S LAST 6 IN THE UCL" top={760} />
        </Hero>
      </Scene>
      {/* PICK 5: Stuttgart v Atletico, the honest risk stamp */}
      <Scene from={S5} to={S6}>
        <Hero from={S5} n={5} big='stu' glow='rgba(227,34,25,0.75)' h='stu' a='atm' pill='BOTH TEAMS SCORE' pillAt={at(46)}
          claim={<>STUTTGART<br />V ATLÉTICO</>}>
          <Stamp at={at(50)} text='RISKIEST LEG' top={760} />
        </Hero>
      </Scene>
      {/* OUTRO: card back, Wednesday tease, comment banner */}
      <Scene from={S6} to={END + 10}>
        <Fan from={S6} />
        <Card from={S6 + 2} top={620} />
        {f >= at(54) && f < at(65) ? (
          <div style={{ position: 'absolute', top: 280, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(11,10,13,0.88)', border: '3px solid ' + GOLD, color: '#fff', fontFamily: D(), fontSize: 54, padding: '10px 26px', borderRadius: 16 }}>REAL MADRID · <span style={{ color: GOLD }}>WEDNESDAY</span></div>
          </div>
        ) : null}
        {f >= at(65) ? (
          <div style={{ position: 'absolute', top: 280, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: GOLD, color: '#0B0A0D', fontFamily: D(), fontSize: 64, padding: '10px 30px', borderRadius: 16, boxShadow: '0 14px 40px rgba(255,210,63,0.45)', transform: 'translateY(' + Math.sin(f / 4) * 6 + 'px)', display: 'flex', alignItems: 'center', gap: 16 }}>COMMENT YOUR PICK <div style={{ width: 0, height: 0, borderLeft: '18px solid transparent', borderRight: '18px solid transparent', borderTop: '24px solid #0B0A0D' }} /></div>
          </div>
        ) : null}
      </Scene>
      <Progress />
      <Captions />
      <Audio src={staticFile('np-008/voiceover.wav')} />
      {hit(0, 'bass_impact.MP3', 0.5)}
      {hit(S1, 'whoosh_motion.MP3')}
      {hit(at(7), 'punch_sound.MP3', 0.4, 0.6)}{hit(at(9), 'glitch_sound.MP3', 0.35, 0.6)}
      {hit(at(14), 'cinematic_whoosh_impact.MP3', 0.45)}
      {hit(S2, 'fast_swoosh.MP3')}
      {hit(at(19), 'punch_sound.MP3', 0.45)}
      {hit(S3, 'classic_whoosh.MP3')}
      {hit(at(24), 'pop_sound.MP3', 0.4, 0.6)}
      {hit(S4, 'title_swoosh.MP3')}
      {hit(at(34), 'magic_reveal.MP3', 0.35)}
      {hit(at(40), 'bass_impact.MP3', 0.45)}
      {hit(S5, 'pop_whoosh.MP3')}
      {hit(at(46), 'cinematic_whoosh_impact.MP3', 0.4)}
      {hit(at(50), 'glitch_sound.MP3', 0.4, 0.8)}
      {hit(S6, 'title_swoosh.MP3')}
      {hit(at(54), 'pop_sound.MP3', 0.4, 0.6)}
      {hit(at(65), 'classic_whoosh.MP3', 0.4)}
    </AbsoluteFill>
  );
};
export const NP008_CARD_FRAMES = Math.ceil(NP008_SEC * FPS);
