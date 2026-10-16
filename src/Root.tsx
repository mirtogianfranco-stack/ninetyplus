import React from 'react';
import { Composition, Still } from 'remotion';
import './index.css';
import { BrandCard } from './BrandCard';
import { MockupA, MockupB, MockupC } from './mockups/Mockups';
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
