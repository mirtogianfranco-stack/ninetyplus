// Edit-decision types for a picks video. One PicksEdit per video (src/edits/npNNN.ts); PicksVideo renders it.
// Every timing is a WORD INDEX into `words` (transcript order), never a guessed second. Frames are derived at render time.

export type Word = { word: string; start: number; end: number };

export type Leg = {
  name: string;          // key, e.g. 'rams'
  label: string;         // on-screen name, e.g. 'RAMS' or 'SAQUON BARKLEY'
  team: string;          // key into TEAM_COLORS
  anchor: number;        // word index where the name is spoken: reveal, ding, rail state fire here
  start: number;         // seconds (leg span, used for footage chunking and rail order)
  end: number;
  clips: string[];       // public paths, rotated through ~4s chunks
  logo?: string;         // public path, for logo rails/reveals
  headshot?: string;     // public path, for headshot rails/reveals
  stat?: Stat;   // optional stat card on the key number
  stats?: Stat[]; // or several per leg
  odds?: string;        // price shown on the reveal, e.g. '+246' or '-135'
  pairWith?: string;    // SGP partner leg name: this leg's reveal shows both headshots as one card
  pairLabel?: string;   // label for that pair card, e.g. 'ACHANE + JEANTY'
  noReveal?: boolean;   // partner leg: rail tile + ding only, no separate reveal
  revealDur?: number;
  revealImage?: string; // Video-028: show a headshot on the reveal while the rail runs on logos   // seconds the reveal card stays (default 2.4; rapid-fire videos use 1.6-2.0)
  noRail?: boolean;     // partner of an either-or slip leg: no rail tile (the slip counts it as one leg)
  line?: string;        // per-leg reveal line, overrides revealLine (e.g. '5+ RECEPTIONS')
};
export type LadderSpec = { word: number; untilWord: number; title: string; items: { image: string; badge: string; sub: string; word: number }[]; top?: number; big?: boolean };   // top: y px (default safe top); big: 600px slip thumbs for a hero card
export type Stat = { word: number; value: string; label?: string; dur?: number; sfx?: string; vol?: number };   // label optional (a value-only card needs 1.2s, value+label needs 1.8s); sfx overrides the rotating default
export type Meme = { word: number; image: string; sfx: string; vol?: number; size?: number; dur?: number; x?: number; y?: number; drive?: 'ltr' | 'rtl'; w?: number };   // drive (Video-010): the image drives across the frame, brakes at the centre, then peels out; w = drawn width for non-square images

export type Shot = { word: number; shot: 'face' | 'footage'; offset?: number };   // offset: seconds added to the word start (negative = cut early, so footage is already up when the word lands)

export type Popup = {
  word: number; dur: number; src: string; label: string; team?: string;
  w: number; h: number; x?: number; y?: 'center' | 'top'; sfx: string; vol: number;
  mark?: { word: number; x: number; y: number; r?: number; rx?: number; ry?: number; label?: string };   // rx/ry (Video-034): ellipse, measured tight around the text   // Video-016: draw a circle (x,y,r in DRAWN image px) on the popup at `word`, with an optional label chip
  blur?: number;   // px blur on the image (slip tease: hide the players until the picks are spoken)
};

export type PicksEdit = {
  id: string;
  fps: number;
  endSec: number;                 // exact voiceover length
  words: Word[];                  // corrected transcript words
  voiceover: string;              // public path
  assetsBase: string;             // e.g. 'np-002' -> public/np-002/{sfx,graphics,popups,clips}
  clipSec: Record<string, number>;
  legs: Leg[];
  shots: Shot[];
  hook: {
    endWord: number;              // captions hidden before this word's start; hook typography shown
    phrases: { words: number[]; accent: boolean }[];
    money?: { word: number; untilWord: number; image: string; label: string; sfx: string };
    slip?: { fromWord: number; untilWord: number; image: string; sfx: string };
    captions?: boolean;            // keep the word captions running under the hook (default: hidden until endWord)
    stack?: { untilWord: number; faceH?: number };   // Video-028 test: facecam box on top (faceH px), footage box below, until untilWord
    style?: 'text' | 'imessage' | 'none' | 'lineup';   // 'imessage' (Video-005): chat thread instead of big type; 'none' (Video-007): another card (tally) carries the hook; 'lineup' (Video-009): player chips fire in, a stamp slams over them
    lineup?: { word: number; stepFrames?: number; items: { image: string; label: string; line: string; team?: string }[]; tagWord?: number; tagText?: string; stampWord: number; stampText: string; chip?: string; contain?: boolean; blur?: boolean; title?: string };   // contain: logos (padded, not cropped); blur: hide faces + names in the hook (default true)   // Video-009 opener: chips stagger from `word`, tag pill on `tagWord`, red stamp on `stampWord`; `chip` = small green header chip (receipts)
    chat?: { to: string; bubbles: { word: number; from: 'me' | 'them'; words?: number[]; text?: string }[] };
  };
  stamp?: { word: number; image: string; text: string; sfx: string; vol?: number; textWord?: number; width?: number; center?: boolean; payout?: { from: number; to: number; word: number; label?: string } };   // width/center (Video-016): the slip as the hero of the ending; payout ticks from -> to under it on `word`   // image from `word`, text slams on `textWord` (default: same word)
  // Video-006 education graphics (Action-Network-style dark cards, no glow, no gradients on the type):
  ladder?: LadderSpec | LadderSpec[];
  lineupHero?: { word: number; untilWord: number; title: string };
  collab?: { video: string; videoW: number; videoH: number; header: string; slipTitle: string; slipRight: string; windows: { at: number; dur: number; clipStart: number; hold?: boolean }[]; rows: { image: string; name: string; line: string; price: string; team?: string; revealWord: number }[]; stampWord?: number; stampText?: string };   // Video-011 collab block: partner clip in a widescreen card + slip rows that unblur on their reveal words; windows in seconds, clipStart = seconds into the partner clip; hold = no exit (last window)
  stamps?: TextStampSpec[];  // Video-023: big rotated word stamps that slam in on a word (OFFICIAL, FRAUD, CODE ROCKETT), whip out after dur
  slipFan?: SlipFanSpec;     // Video-022 hook: real old slips fan in as 'lottery tickets', a money counter ticks, a red X sweeps them, the hero slip slams in
  matchMath?: MatchMathSpec; // Video-022 sponsor: logo drops, offer counter ticks, code chip slams, 100 + 100 match merge, real slip swings in and its payout ticks
  sponsorDuo?: SponsorDuoSpec;   // Video-021: two partner apps side by side (Sleeper + Onyx), one shared code chip, 'links in bio' tag
  heroCutout?: HeroCutoutSpec;   // Video-020: full-frame player cutout rising in front of rotating sun rays, name + nickname slam (Amon-Ra, 'the Sun God')
  chartFit?: ChartFitSpec;   // Video-019: two Outlier zone grids fly in side by side, slide together so the zones stack, snap with a lock stamp
  sponsor?: { word: number; untilWord: number; video: string; videoW: number; videoH: number; logo: string; title: string; ctaWord: number; cta: string; sub?: string; ctaUnderline?: string; captionsDrop?: number };   // Video-010 Outlier block: app showcase video in a phone card + logo, CTA card slams on ctaWord   // Video-009 ending: the hook lineup comes back as the hero card (all five props) over footage
   // slips stacking up with stake badges (one card, or several at different words)
  // Video-007 hook: a TD tally over footage. Chips stagger in from `word` (one every `stepFrames`), the sum slams on `totalWord`.
  tally?: { word: number; untilWord: number; totalWord: number; stepFrames?: number; blurUntilStamped?: boolean; items: { image: string; value: number; label: string; team?: string }[]; totalLabel: string };
  table?: { word: number; untilWord: number; title: string; team?: string; rows: { word: number; label: string; value: string; tone: 'green' | 'red' | 'neutral' }[] };   // payout rows landing on their words   // closing stamp slammed onto the slip (Video-005 'FREE MONEY')
  ladderStep?: { word: number; rollWord: number; dur: number; from: number; to: number; label?: string; sub?: string; sfx?: string; vol?: number };   // Video-033: the running ladder total, live. No card - the raw number sits on the footage, then the digits roll from `from` to `to` on rollWord with motion blur and a green delta chip lands under it.
  moneyLadder?: { rungs: string[]; current: number; lockWord: number; dayLabel: string; title?: string; topWord?: number };   // Video-016 ladder challenge: rung column up the right side for the whole video (index 0 = bottom). `current` = today's target rung, it pulses until lockWord then locks green; topWord pulses the top rung gold. Cards, popups, reveals and captions shift left to clear it.
  news?: NewsCardSpec[];      // Video-016: headline-style receipt cards (outlet, date, headline, the quote typed on)
  split?: SplitCardSpec[];    // Video-016: before -> after card; BEFORE lands on word, AFTER slams in on afterWord
  strike?: StrikeCardSpec[];  // Video-016: depth-chart list with names struck through on their words
  popups: Popup[];
  memes?: Meme[];               // reaction pops on trigger words (Video-001 pattern), each with its own SFX
  // Video-032 hook: two matchup cards land blacked-out behind a big "?", then each flips open on the word where
  // he names that game. Sells "these two games" without saying which, and gives the first 5s something to watch.
  mysteryGames?: { word: number; untilWord: number; sfx?: string; vol?: number; flipSfx?: string; title?: string;
    games: { flipWord?: number; away: string; home: string; label: string; team?: string }[] };
  // Video-032, REUSABLE: the promo-code lockup. Sponsor logos slide in, the code chip slams with a light sweep and
  // the letters stagger. Every one of the owner's codes is ROCKETT, so this is built once and reused every video.
  brand?: 'ninetyplus' | 'itzrockett' | 'highlimit' | 'fourfigure';   // palette switch (theme.applyBrand); default ninetyplus
  captionStyle?: 'classic' | 'glow';   // Video-034: 'glow' = white Montserrat Black words, emphasis words in Anton with a gradient fill + colour glow
  captionGlow?: [string, string];      // glow gradient [top, bottom] for emphasis words (default lime -> hero green)
  codeBlast?: { word: number; untilWord: number; code: string; slamWord: number; kicker?: string; tiles: { image: string; amount: string; word?: number }[]; amountWord: number; amountText?: string; banner?: { word: number; text: string; sub?: string }; foot?: string; sfx?: string; vol?: number };   // Video-034 REUSABLE: the code is the biggest thing on screen for the whole sponsor block (FFAZ-style); tiles pop on their names, amounts land on amountWord, the code re-slams on slamWord
  codeDrop?: { word: number; dur: number; code: string; label?: string; sub?: string; logos?: string[]; sfx?: string; vol?: number };
  // Video-039 (owner's reference clip): named players stack along the bottom, one at a time, each overlapping the
  // last. One entry per leg; each face lands on the word where he says that name.
  faceRows?: { items: { image: string; word: number }[]; untilWord: number; size?: number; y?: number; sfx?: string; vol?: number }[];
  punchWords?: number[];        // facecam punch-in kicks on these words (face shots only)
  zoomKicks?: { word: number; untilWord: number; amount?: number }[]; // quick facecam zoom IN on `word`, back OUT by the end of `untilWord` (face shots only)
  facecam: { file: string; srcW: number; srcH: number; head: { x: number; y: number }; targetX: number; grade: string; wash: string; keyLight?: boolean; zoom?: number; drift?: number; inset?: number; insetY?: number; captionsAbove?: boolean };   // captionsAbove (Video-012): on face shots the captions sit above the head instead of over the chin (close-up takes)   // inset (Video-012): draw the sharp facecam at this scale over a blurred copy of itself (a close-up take that would fill the frame); insetY = px shift of the inset   // drift: px of slow sideways travel across each face shot (keyframed pan, alternates direction)   // zoom > 1 oversizes the facecam so recentring never exposes black edges
  rail: { tile: 'logo' | 'headshot' };
  revealLine: string;             // 'ML' or 'ANYTIME TD'
  emphasisWords?: string[];       // extra caption words to colour (team names, MONEYLINE, ...)
  brandTag?: string;              // 'NFL WEEK 1 · 6-LEG ML'
  handle?: string;                // '@itzrockett'
  music?: { file: string; volume: number; fadeInSec?: number; fadeOutSec?: number };   // bed under the voice; volume is the steady level (0.10 = about -20 dB under a -16 LUFS voice)
  cutSfx?: Partial<Record<'glitch' | 'fade' | 'zoom' | 'whip', { file: string; lead: number; dur: number; vol: number }>>; // per-video transition sound overrides
};

export type NewsCardSpec = { word: number; dur: number; outlet: string; date?: string; headline: string; quote: string; by?: string; top?: number; sfx?: string; vol?: number };   // sfx (Video-017): one sound per card, default shutter (the typing sound was rejected)   // top: px from the frame top, so several cards can stack and stay up together
export type SplitCardSpec = { word: number; afterWord: number; untilWord: number; title?: string; before: { value: string; label: string }; after: { value: string; label: string } };
export type StrikeCardSpec = { word: number; dur: number; title: string; team?: string; rows: { name: string; tag: string; word: number; tone: 'out' | 'weak' }[] };
export type ChartFitSpec = { word: number; fitWord: number; untilWord: number; title: string; kicker?: string; logo?: string; stamp: string; stampIcon?: string; left: { image: string; label: string; team?: string }; right: { image: string; label: string; team?: string } };
export type HeroCutoutSpec = { word: number; titleWord: number; untilWord: number; image: string; name: string; title: string; headY?: number };
export type SponsorDuoSpec = { word: number; untilWord: number; codeWord: number; bioWord: number; header: string; code: string; sub: string; left: { word: number; logo: string; name: string; offer: string; bg: string }; right: { word: number; image: string; name: string; offer: string; bg: string } };
export type SlipFanSpec = { word: number; moneyWord: number; moneyTo: number; moneyLabel: string; sweepWord: number; untilWord: number; stack: string[]; stackTag: string; hero: string; heroTag: string; stampWord: number; stampText: string };
export type MatchMathSpec = { word: number; untilWord: number; logo: string; offerWord: number; offerTo: number; offerLabel: string; codeWord: number; code: string; stakeWord: number; stake: number; matchWord: number; matchLabel: string; slipWord: number; slip: string; payWord: number; payTo: number; bioWord: number; bio: string };
export type TextStampSpec = { word: number; text: string; dur: number; tone?: 'red' | 'green' | 'gold' | 'white' | 'ink'; x?: number; y?: number; size?: number; rot?: number; sfx?: string; vol?: number; icon?: string };
