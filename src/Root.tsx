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
import { NP018Card } from './cards/NP018';
import { spec as np018 } from './cards/np018';
import { NP099Preview } from './previews/NP099';
import { NP025Preview } from './previews/NP025';
import { StoryThumb } from './templates/StoryThumb';
import { VerticalStory } from './templates/VerticalStory';
import { spec as np030 } from './previews/np030';
import { PreviewTemplate } from './templates/PreviewTemplate';
import { spec as np025 } from './previews/np025';
import { spec as np099 } from './previews/np099';
import { previewFrames } from './templates/PreviewTemplate';
import { NP020Card } from './cards/NP020';
import { NP023Card } from './cards/NP023';
import { NP026Card } from './cards/NP026';
import { NP027Card } from './cards/NP027';
import { spec as np027 } from './cards/np027';
import { spec as np026 } from './cards/np026';
import { spec as np023 } from './cards/np023';
import { spec as np020 } from './cards/np020';
import { cardFrames } from './templates/CardTemplate';
import { spotlightFrames } from './templates/SpotlightTemplate';
import { resultsFrames } from './templates/ResultsTemplate';
import { XCard } from './templates/XCard';
import { XSpotlight } from './templates/XSpotlight';
import { XResults } from './templates/XResults';
import { NP012Spot } from './spotlights/NP012';
import { spec as np012s } from './spotlights/np012';
import { NP019Spot } from './spotlights/NP019';
import { NP028Spot } from './spotlights/NP028';
import { spec as np028 } from './spotlights/np028';
import { spec as np019 } from './spotlights/np019';
import { NP016Res } from './results/NP016';
import { spec as np016r } from './results/np016';
import { NP021Res } from './results/NP021';
import { NP022Res } from './results/NP022';
import { NP024Res } from './results/NP024';
import { NP029Res } from './results/NP029';
import { spec as np029 } from './results/np029';
import { spec as np024 } from './results/np024';
import { spec as np022 } from './results/np022';
import { spec as np021 } from './results/np021';
import { ProfileLogo } from './ProfileLogo';
import { XHeader } from './XHeader';
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
    <Still id='XHeader' component={XHeader} width={1500} height={500} />
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
    <Still id='NP021X' component={() => <XResults spec={np021} />} width={1200} height={675} />
    <Still id='NP021XT' component={() => <XResults spec={np021} tall />} width={1080} height={1350} />
    <Composition id='NP019' component={NP019Spot} durationInFrames={spotlightFrames(np019)} fps={30} width={1080} height={1920} />
    <Still id='NP019X' component={() => <XSpotlight spec={np019} />} width={1200} height={675} />
    <Still id='NP019XT' component={() => <XSpotlight spec={np019} tall />} width={1080} height={1350} />
    <Composition id='NP028' component={NP028Spot} durationInFrames={spotlightFrames(np028)} fps={30} width={1080} height={1920} />
    <Still id='NP028X' component={() => <XSpotlight spec={np028} />} width={1200} height={675} />
    <Still id='NP028XT' component={() => <XSpotlight spec={np028} tall />} width={1080} height={1350} />
    <Composition id='NP021' component={NP021Res} durationInFrames={resultsFrames(np021)} fps={30} width={1080} height={1920} />
    <Composition id='NP022' component={NP022Res} durationInFrames={resultsFrames(np022)} fps={30} width={1080} height={1920} />
    <Still id='NP022X0' component={() => <XResults spec={np022} card={0} tall />} width={1080} height={1350} />
    <Still id='NP022X1' component={() => <XResults spec={np022} card={1} tall />} width={1080} height={1350} />
    <Still id='NP022X2' component={() => <XResults spec={np022} card={2} tall />} width={1080} height={1350} />
    <Composition id='NP024' component={NP024Res} durationInFrames={resultsFrames(np024)} fps={30} width={1080} height={1920} />
    <Still id='NP024XT' component={() => <XResults spec={np024} tall />} width={1080} height={1350} />
    <Composition id='NP029' component={NP029Res} durationInFrames={resultsFrames(np029)} fps={30} width={1080} height={1920} />
    <Still id='NP029X0' component={() => <XResults spec={np029} card={0} tall />} width={1080} height={1350} />
    <Still id='NP029X1' component={() => <XResults spec={np029} card={1} tall />} width={1080} height={1350} />
    <Still id='NP029X2' component={() => <XResults spec={np029} card={2} tall />} width={1080} height={1350} />
    <Composition id='NP018' component={NP018Card} durationInFrames={cardFrames(np018)} fps={30} width={1080} height={1920} />
    <Still id='NP018X' component={() => <XCard spec={np018} />} width={1200} height={675} />
    <Still id='NP018XT' component={() => <XCard spec={np018} tall />} width={1080} height={1350} />
    <Composition id='NP099' component={NP099Preview} durationInFrames={previewFrames(np099)} fps={30} width={1920} height={1080} />
    <Composition id='NP025' component={NP025Preview} durationInFrames={previewFrames(np025)} fps={30} width={1920} height={1080} />
    <Still id='NP025T' component={() => <StoryThumb dir='np-025' crest='bha' lines={['ARE BRIGHTON', 'FOR REAL?']} stat='52%' statLabel='OF SHOTS ON TARGET SCORED · LEAGUE AVERAGE 32%' glow='rgba(0,87,184,0.9)' />} width={1280} height={720} />
    <Composition id='NP030' component={() => <PreviewTemplate spec={np030} />} durationInFrames={previewFrames(np030)} fps={30} width={1920} height={1080} />
    <Composition id='NP030V' component={() => <VerticalStory spec={np030} headline={['ARE BRIGHTON', 'FOR REAL?']} />} durationInFrames={previewFrames(np030)} fps={30} width={1080} height={1920} />
    <Still id='NP030T' component={() => <StoryThumb dir='np-030' crest='bha' lines={['ARE BRIGHTON', 'FOR REAL?']} stat='50%' statLabel='OF SHOTS ON TARGET SCORED · LEAGUE AVERAGE 32%' glow='rgba(0,87,184,0.9)' />} width={1280} height={720} />
    <Composition id='NP020' component={NP020Card} durationInFrames={cardFrames(np020)} fps={30} width={1080} height={1920} />
    <Still id='NP020X' component={() => <XCard spec={np020} />} width={1200} height={675} />
    <Still id='NP020XT' component={() => <XCard spec={np020} tall />} width={1080} height={1350} />
    <Composition id='NP023' component={NP023Card} durationInFrames={cardFrames(np023)} fps={30} width={1080} height={1920} />
    <Still id='NP023X' component={() => <XCard spec={np023} />} width={1200} height={675} />
    <Still id='NP023XT' component={() => <XCard spec={np023} tall />} width={1080} height={1350} />
    <Composition id='NP026' component={NP026Card} durationInFrames={cardFrames(np026)} fps={30} width={1080} height={1920} />
    <Still id='NP026X' component={() => <XCard spec={np026} />} width={1200} height={675} />
    <Still id='NP026XT' component={() => <XCard spec={np026} tall />} width={1080} height={1350} />
    <Composition id='NP027' component={NP027Card} durationInFrames={cardFrames(np027)} fps={30} width={1080} height={1920} />
    <Still id='NP027X' component={() => <XCard spec={np027} />} width={1200} height={675} />
    <Still id='NP027XT' component={() => <XCard spec={np027} tall />} width={1080} height={1350} />
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
