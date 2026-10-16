import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { theme, applyBrand } from '../theme';

// Style mock-ups (16 Oct 2026) for the owner to pick a new look. Stills only, built from the NP-005 picks.
// A = player hero, B = 90+ stoppage board, C = weekend card. Player cut-outs: premierleague.com player images.

const RED = '#FF2E4D';
const GOLD = '#FFD23F';
const GREEN = '#22C55E';
const INK = '#0B0A0D';
const crest = (k: string) => staticFile('np-005/logos/' + k + '.png');
const player = (k: string) => staticFile('mockups/' + k + '.png');
const D = () => theme.fonts.display;
const H = () => theme.fonts.heavy;

// Night stadium: floodlight blooms, a stand silhouette, a pitch with perspective lines, tinted by the club colour.
export const Stadium: React.FC<{ tint: string; dim?: number }> = ({ tint, dim = 0 }) => (
  <AbsoluteFill style={{ background: INK, overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #050407 0%, #120a10 38%, ' + tint + '55 62%, #0b2a17 74%, #061a0e 100%)' }} />
    {[14, 86].map((x) => (
      <div key={x} style={{ position: 'absolute', left: x + '%', top: 150, width: 520, height: 520, marginLeft: -260, background: 'radial-gradient(circle, rgba(255,250,240,0.95) 0%, rgba(255,240,220,0.35) 12%, rgba(255,46,77,0.10) 35%, rgba(0,0,0,0) 62%)', filter: 'blur(4px)' }} />
    ))}
    {[14, 86].map((x) => (
      <div key={'b' + x} style={{ position: 'absolute', left: x + '%', top: 360, width: 900, height: 1500, marginLeft: -450, background: 'linear-gradient(180deg, rgba(255,245,230,0.16), rgba(255,245,230,0))', clipPath: 'polygon(46% 0, 54% 0, 100% 100%, 0 100%)' }} />
    ))}
    <div style={{ position: 'absolute', left: -100, right: -100, top: 900, height: 260, borderRadius: '50% 50% 0 0 / 40% 40% 0 0', background: 'radial-gradient(rgba(255,255,255,0.28) 1.3px, transparent 1.6px) 0 0 / 13px 11px, linear-gradient(180deg, #1c1820, #0c0a0e)' }} />
    <svg width={1080} height={800} style={{ position: 'absolute', left: 0, top: 1120 }} viewBox='0 0 1080 800'>
      <defs>
        <linearGradient id='pitch' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stopColor='#1f7a3c' /><stop offset='1' stopColor='#0a3a1b' /></linearGradient>
      </defs>
      <polygon points='-400,800 1480,800 820,0 260,0' fill='url(#pitch)' />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <polygon key={i} points={(-400 + i * 268.6) + ',800 ' + (-400 + (i + 0.5) * 268.6) + ',800 ' + (260 + (i + 0.5) * 80) + ',0 ' + (260 + i * 80) + ',0'} fill='rgba(255,255,255,0.035)' />)}
      <polygon points='540,0 540,0 540,800 540,800' stroke='rgba(255,255,255,0.35)' strokeWidth={3} />
      <ellipse cx={540} cy={330} rx={260} ry={70} fill='none' stroke='rgba(255,255,255,0.35)' strokeWidth={3} />
    </svg>
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.75) 100%)' }} />
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,' + dim + ')' }} />
  </AbsoluteFill>
);

const RecordBadge: React.FC<{ top?: number; right?: number; scale?: number }> = ({ top = 270, right = 120, scale = 1 }) => (
  <div style={{ position: 'absolute', top, right, transform: 'scale(' + scale + ')', transformOrigin: '100% 0', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(180deg, ' + RED + ', #b3122c)', borderRadius: 18, padding: '10px 22px 6px', boxShadow: '0 10px 30px rgba(255,46,77,0.45), inset 0 2px 0 rgba(255,255,255,0.35)' }}>
    <div style={{ fontFamily: H(), fontSize: 20, letterSpacing: 4, color: 'rgba(255,255,255,0.85)' }}>RECORD</div>
    <div style={{ fontFamily: D(), fontSize: 76, lineHeight: 1, color: '#fff' }}>5-1</div>
  </div>
);

const Caption: React.FC<{ text: string; top?: number }> = ({ text, top = 1300 }) => (
  <div style={{ position: 'absolute', top, left: 0, right: 0, textAlign: 'center', fontFamily: D(), fontSize: 120, color: '#fff', backgroundImage: 'linear-gradient(180deg, #FFFFFF 30%, ' + RED + ')', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 18px ' + RED + ') drop-shadow(0 6px 0 rgba(0,0,0,0.6))' }}>{text}</div>
);

// A: one player, huge, under the lights. The claim sits on top, the pick bar under the player's chest.
export const MockupA: React.FC = () => {
  applyBrand('ninetyplus');
  return (
    <AbsoluteFill>
      <Stadium tint='#EF0107' />
      <div style={{ position: 'absolute', top: 470, left: -40, right: -40, textAlign: 'center', fontFamily: D(), fontSize: 330, lineHeight: 0.9, color: 'transparent', WebkitTextStroke: '3px rgba(255,255,255,0.18)', letterSpacing: 6 }}>ARSENAL</div>
      <Img src={player('saka')} style={{ position: 'absolute', left: 40, top: 520, width: 1000, filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.6)) drop-shadow(-14px 0 28px rgba(239,1,7,0.55)) drop-shadow(14px 0 28px rgba(255,210,63,0.35)) contrast(1.08) saturate(1.1)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1060, bottom: 0, background: 'linear-gradient(180deg, rgba(11,10,13,0) 0%, rgba(11,10,13,0.92) 30%, #0B0A0D 60%)' }} />
      <div style={{ position: 'absolute', top: 280, left: 90, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ background: RED, color: '#fff', fontFamily: H(), fontSize: 26, letterSpacing: 3, padding: '8px 16px', borderRadius: 8 }}>PICK 1 OF 3</div>
        <div style={{ color: 'rgba(255,255,255,0.8)', fontFamily: H(), fontSize: 24, letterSpacing: 3 }}>SUN 11:30 AM ET</div>
      </div>
      <div style={{ position: 'absolute', top: 340, left: 86, right: 90, fontFamily: D(), fontSize: 112, lineHeight: 0.95, color: '#fff', textShadow: '0 8px 30px rgba(0,0,0,0.8)', transform: 'skewX(-6deg)' }}>
        FOREST: <span style={{ color: GOLD }}>0</span> HOME<br />GOALS ALL SEASON
      </div>
      <RecordBadge top={270} right={110} scale={0.85} />
      <div style={{ position: 'absolute', left: 90, right: 90, top: 1140, display: 'flex', alignItems: 'center', gap: 22, background: 'linear-gradient(90deg, rgba(255,255,255,0.14), rgba(255,255,255,0.05))', border: '2px solid rgba(255,255,255,0.25)', borderRadius: 26, padding: '18px 24px', backdropFilter: 'blur(10px)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
        <Img src={crest('nfo')} style={{ width: 86, height: 86, objectFit: 'contain', opacity: 0.55, filter: 'grayscale(0.6)' }} />
        <div style={{ fontFamily: D(), fontSize: 34, color: 'rgba(255,255,255,0.6)' }}>V</div>
        <Img src={crest('ars')} style={{ width: 100, height: 100, objectFit: 'contain', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.5))' }} />
        <div style={{ marginLeft: 8, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: D(), fontSize: 70, lineHeight: 1, color: '#fff' }}>ARSENAL <span style={{ color: GREEN }}>TO WIN</span></div>
          <div style={{ fontFamily: H(), fontSize: 22, letterSpacing: 2, color: 'rgba(255,255,255,0.7)', marginTop: 6 }}>ARSENAL: 5 WINS IN 6</div>
        </div>
      </div>
      <Caption text='ZERO' top={1290} />
    </AbsoluteFill>
  );
};

// B: the fourth official's board. LED dot type for the stat, a stadium ribbon ticker for the record.
const led = (color: string): React.CSSProperties => ({ fontFamily: D(), color: 'transparent', backgroundImage: 'radial-gradient(circle, ' + color + ' 46%, rgba(0,0,0,0) 52%)', backgroundSize: '6px 6px', WebkitBackgroundClip: 'text', backgroundClip: 'text', filter: 'drop-shadow(0 0 6px ' + color + ') drop-shadow(0 0 18px ' + color + '99)' });
export const MockupB: React.FC = () => {
  applyBrand('ninetyplus');
  return (
    <AbsoluteFill>
      <Stadium tint='#DD0000' dim={0.35} />
      <Img src={player('saka')} style={{ position: 'absolute', right: -60, top: 1010, width: 520, filter: 'drop-shadow(-12px 0 30px rgba(239,1,7,0.55)) contrast(1.05)' }} />
      <div style={{ position: 'absolute', top: 300, left: 110, right: 110, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 120, height: 34, background: 'linear-gradient(180deg,#444,#1a1a1a)', borderRadius: '10px 10px 0 0' }} />
        <div style={{ width: '100%', background: 'linear-gradient(180deg, #1b1b1f, #050506)', border: '10px solid #2b2b31', borderRadius: 28, boxShadow: '0 30px 70px rgba(0,0,0,0.8), inset 0 0 0 2px rgba(255,255,255,0.08)', padding: '26px 30px 30px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 40%, rgba(0,0,0,0) 46%)', backgroundSize: '9px 9px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            <div style={{ ...led(RED), fontSize: 76, letterSpacing: 4 }}>90+</div>
            <div style={{ ...led('#FFFFFF'), fontSize: 50, letterSpacing: 4 }}>PICK 1/3</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 34, marginTop: 18, position: 'relative' }}>
            <Img src={crest('nfo')} style={{ width: 130, height: 130, objectFit: 'contain' }} />
            <div style={{ ...led(GOLD), fontSize: 250, lineHeight: 0.9 }}>0</div>
            <Img src={crest('ars')} style={{ width: 130, height: 130, objectFit: 'contain' }} />
          </div>
          <div style={{ ...led(GOLD), fontSize: 70, letterSpacing: 4, textAlign: 'center', position: 'relative' }}>FOREST HOME GOALS</div>
          <div style={{ height: 2, background: 'rgba(255,255,255,0.12)', margin: '18px 0', position: 'relative' }} />
          <div style={{ ...led(GREEN), fontSize: 104, letterSpacing: 4, textAlign: 'center', position: 'relative' }}>ARSENAL TO WIN</div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 110, top: 1060, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontFamily: H(), fontSize: 24, letterSpacing: 3, color: 'rgba(255,255,255,0.75)' }}>FOREST AT HOME</div>
        {['0-1 COV', '0-0 TOT', '0-1 LEE'].map((t) => (
          <div key={t} style={{ background: 'rgba(11,10,13,0.85)', border: '2px solid ' + RED, borderRadius: 12, padding: '10px 18px', fontFamily: D(), fontSize: 40, color: '#fff' }}>{t}</div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1440, height: 92, background: 'linear-gradient(180deg, #16161a, #050506)', borderTop: '3px solid ' + RED, borderBottom: '3px solid ' + RED, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <div style={{ ...led('#FFFFFF'), fontSize: 56, letterSpacing: 8, whiteSpace: 'nowrap', marginLeft: -120 }}>RECORD 5-1 · NINETY PLUS · RECORD 5-1 · NINETY PLUS ·</div>
      </div>
      <Caption text='ZERO' top={1270} />
    </AbsoluteFill>
  );
};

// C: the weekend card as the hero. Three players fan out behind a glass slip; the record is the biggest number on screen.
export const MockupC: React.FC = () => {
  applyBrand('ninetyplus');
  const rows: [string, string, string, string][] = [['nfo', 'ars', 'ARSENAL TO WIN', 'SUN 11:30 AM'], ['eve', 'che', 'BOTH TEAMS SCORE', 'SAT 7:30 AM'], ['bha', 'cry', 'BRIGHTON TO WIN', 'SUN 9:00 AM']];
  return (
    <AbsoluteFill>
      <Stadium tint='#6a1a8a' dim={0.2} />
      <Img src={player('palmer')} style={{ position: 'absolute', left: -120, top: 330, width: 640, transform: 'rotate(-6deg)', filter: 'drop-shadow(0 0 24px rgba(3,70,148,0.7)) brightness(0.85)' }} />
      <Img src={player('mitoma')} style={{ position: 'absolute', right: -120, top: 330, width: 640, transform: 'rotate(6deg)', filter: 'drop-shadow(0 0 24px rgba(0,87,184,0.7)) brightness(0.85)' }} />
      <Img src={player('saka')} style={{ position: 'absolute', left: 190, top: 270, width: 700, filter: 'drop-shadow(0 0 30px rgba(239,1,7,0.65)) contrast(1.06)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 560, height: 300, background: 'linear-gradient(180deg, rgba(11,10,13,0), rgba(11,10,13,0.9))' }} />
      <div style={{ position: 'absolute', left: 90, right: 90, top: 700, background: 'linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))', border: '2px solid rgba(255,255,255,0.28)', borderRadius: 34, padding: '26px 26px 20px', boxShadow: '0 30px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.4)', backdropFilter: 'blur(14px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontFamily: D(), fontSize: 58, color: '#fff', letterSpacing: 2 }}>WEEKEND <span style={{ color: RED }}>CARD</span></div>
          <div style={{ fontFamily: H(), fontSize: 22, color: 'rgba(255,255,255,0.7)', letterSpacing: 3 }}>PREMIER LEAGUE</div>
        </div>
        {rows.map(([h, a, t, k], i) => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(11,10,13,0.72)', borderRadius: 20, padding: '14px 18px', marginTop: i ? 12 : 0, border: '1px solid rgba(255,255,255,0.12)' }}>
            <div style={{ fontFamily: D(), fontSize: 40, color: RED, width: 36 }}>{i + 1}</div>
            <Img src={crest(h)} style={{ width: 62, height: 62, objectFit: 'contain' }} />
            <Img src={crest(a)} style={{ width: 62, height: 62, objectFit: 'contain' }} />
            <div style={{ fontFamily: D(), fontSize: 46, color: '#fff', flex: 1, whiteSpace: 'nowrap' }}>{t}</div>
            <div style={{ fontFamily: H(), fontSize: 18, color: 'rgba(255,255,255,0.65)', letterSpacing: 1, textAlign: 'right', whiteSpace: 'nowrap' }}>{k} ET</div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1190, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 22 }}>
        <div style={{ fontFamily: H(), fontSize: 34, letterSpacing: 6, color: 'rgba(255,255,255,0.8)' }}>RECORD</div>
        <div style={{ fontFamily: D(), fontSize: 150, lineHeight: 1, color: GOLD, textShadow: '0 0 30px rgba(255,210,63,0.6), 0 8px 0 rgba(0,0,0,0.5)' }}>5-1</div>
      </div>
      <Caption text='WEEKEND' top={1360} />
    </AbsoluteFill>
  );
};
