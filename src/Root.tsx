import React from 'react';
import { Composition, Still } from 'remotion';
import './index.css';
import { BrandCard } from './BrandCard';
import { PicksVideo } from './picks/PicksVideo';
import type { PicksEdit } from './picks/types';
import { SkyStadiumThumb } from './thumbs/SkyStadiumThumb';
import { np000 } from './edits/np000';
import { np001 } from './edits/np001';

// Every video: import its edit (src/edits/npNNN.ts) and add it here. Composition id = edit id (NP001).
const VIDEOS: PicksEdit[] = [np000, np001];

export const ThumbnailDemo: React.FC = () => (
  <SkyStadiumThumb stoppage top='LIVERPOOL vs CHELSEA' bottom='LATE GOAL' player='brand/player.svg' leftLogo='brand/crest_home.svg' rightLogo='brand/crest_away.svg' />
);

export const RemotionRoot: React.FC = () => (
  <>
    {VIDEOS.map((e) => (
      <Composition key={e.id} id={e.id} component={PicksVideo} durationInFrames={Math.ceil(e.endSec * e.fps)} fps={e.fps} width={1080} height={1920} defaultProps={{ edit: e }} />
    ))}
    <Still id='BrandCard' component={BrandCard} width={1080} height={1920} />
    <Still id='ThumbnailDemo' component={ThumbnailDemo} width={1080} height={1920} />
  </>
);
