import React from 'react';
import { Composition, Still } from 'remotion';
import './index.css';
import { BrandCard } from './BrandCard';
import { MockupA, MockupB, MockupC } from './mockups/Mockups';
import { NP005Card, NP005_CARD_FRAMES } from './mockups/CardVideo';
import { NP006Card, NP006_CARD_FRAMES } from './mockups/CardVideo006';
import { NP007Card, NP007_CARD_FRAMES } from './mockups/CardVideo007';
import { NP008Card, NP008_CARD_FRAMES } from './mockups/CardVideo008';
import { NP009Card, NP009_CARD_FRAMES } from './mockups/CardVideo009';
import { NP010Card, NP010_CARD_FRAMES } from './mockups/CardVideo010';
import { NP011Card, NP011_CARD_FRAMES } from './mockups/CardVideo011';
import { NP012POTW, NP012_FRAMES } from './mockups/PickOfWeekend012';
import { NP013Card, NP013_CARD_FRAMES } from './mockups/CardVideo013';
import { NP014Card, NP014_CARD_FRAMES } from './mockups/CardVideo014';
import { NP015Clasico, NP015_FRAMES } from './mockups/Clasico015';
import { NP016Results, NP016_FRAMES } from './mockups/WeekendResults016';
import { NP017Card } from './cards/NP017';
import { spec as np017 } from './cards/np017';
import { cardFrames } from './templates/CardTemplate';
import { spotlightFrames } from './templates/SpotlightTemplate';
import { resultsFrames } from './templates/ResultsTemplate';
import { XCard } from './templates/XCard';
import { NP012Spot } from './spotlights/NP012';
import { spec as np012s } from './spotlights/np012';
import { NP016Res } from './results/NP016';
import { spec as np016r } from './results/np016';
import { ProfileLogo } from './ProfileLogo';
import { PicksVideo } from './picks/PicksVideo';
import type { PicksEdit } from './picks/types';
import { SkyStadiumThumb } from './thumbs/SkyStadiumThumb';
import { np000 } from './edits/np000';
import { np001 } from './edits/np001';
import { np002 } from './edits/np002';
import { np003 } from './edits/np003';
import { np004 } from './edits/np004';
import { np005 } from './edits/np005';
import { np006 } from './edits/np006';
import { ThumbnailNP001 } from './ThumbnailNP001';
import { ThumbnailNP002 } from './ThumbnailNP002';
import { ThumbnailNP003 } from './ThumbnailNP003';
import { ThumbnailNP004 } from './ThumbnailNP004';
import { ThumbnailNP005 } from './ThumbnailNP005';
import { ThumbnailNP006 } from './ThumbnailNP006';

// Every video: import its edit (src/edits/npNNN.ts) and add it here. Composition id = edit id (NP001).
const VIDEOS: PicksEdit[] = [np000, np001, np002, np003, np004, np005, np006];

export const ThumbnailDemo: React.FC = () => (
  <SkyStadiumThumb stoppage top='LIVERPOOL vs CHELSEA' bottom='LATE GOAL' player='brand/player.svg' leftLogo='brand/crest_home.svg' rightLogo='brand/crest_away.svg' />
);

export const RemotionRoot: React.FC = () => (
  <>
    {VIDEOS.map((e) => (
      <Composition key={e.id} id={e.id} component={PicksVideo} durationInFrames={Math.ceil(e.endSec * e.fps)} fps={e.fps} width={1080} height={1920} defaultProps={{ edit: e }} />
    ))}
    <Still id='ProfileLogo' component={ProfileLogo} width={1080} height={1080} />
    <Composition id='NP005C' component={NP005Card} durationInFrames={NP005_CARD_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id='NP006C' component={NP006Card} durationInFrames={NP006_CARD_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id='NP007C' component={NP007Card} durationInFrames={NP007_CARD_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id='NP008C' component={NP008Card} durationInFrames={NP008_CARD_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id='NP009C' component={NP009Card} durationInFrames={NP009_CARD_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id='NP010C' component={NP010Card} durationInFrames={NP010_CARD_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id='NP011C' component={NP011Card} durationInFrames={NP011_CARD_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id='NP012P' component={NP012POTW} durationInFrames={NP012_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id='NP013C' component={NP013Card} durationInFrames={NP013_CARD_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id='NP014C' component={NP014Card} durationInFrames={NP014_CARD_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id='NP015K' component={NP015Clasico} durationInFrames={NP015_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id='NP016R' component={NP016Results} durationInFrames={NP016_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id='NP012T' component={NP012Spot} durationInFrames={spotlightFrames(np012s)} fps={30} width={1080} height={1920} />
    <Composition id='NP016T' component={NP016Res} durationInFrames={resultsFrames(np016r)} fps={30} width={1080} height={1920} />
    <Still id='NP017X' component={() => <XCard spec={np017} />} width={1200} height={675} />
    <Still id='NP017XT' component={() => <XCard spec={np017} tall />} width={1080} height={1350} />
    <Composition id='NP017' component={NP017Card} durationInFrames={cardFrames(np017)} fps={30} width={1080} height={1920} />
    <Still id='MockupA' component={MockupA} width={1080} height={1920} />
    <Still id='MockupB' component={MockupB} width={1080} height={1920} />
    <Still id='MockupC' component={MockupC} width={1080} height={1920} />
    <Still id='BrandCard' component={BrandCard} width={1080} height={1920} />
    <Still id='ThumbnailNP001' component={ThumbnailNP001} width={1080} height={1920} />
    <Still id='ThumbnailNP002' component={ThumbnailNP002} width={1080} height={1920} />
    <Still id='ThumbnailNP003' component={ThumbnailNP003} width={1080} height={1920} />
    <Still id='ThumbnailNP004' component={ThumbnailNP004} width={1080} height={1920} />
    <Still id='ThumbnailNP005' component={ThumbnailNP005} width={1080} height={1920} />
    <Still id='ThumbnailNP006' component={ThumbnailNP006} width={1080} height={1920} />
    <Still id='ThumbnailDemo' component={ThumbnailDemo} width={1080} height={1920} />
  </>
);
