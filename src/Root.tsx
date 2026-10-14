import React from 'react';
import { Composition, Still } from 'remotion';
import './index.css';
import { BrandCard } from './BrandCard';
import { SkyStadiumThumb } from './thumbs/SkyStadiumThumb';

// Register every video and cover here. Each video = one edit file in src/edits/ rendered through PicksVideo.
export const ThumbnailDemo: React.FC = () => (
  <SkyStadiumThumb stoppage top='LIVERPOOL vs CHELSEA' bottom='LATE GOAL' player='brand/player.svg' leftLogo='brand/crest_home.svg' rightLogo='brand/crest_away.svg' />
);

export const RemotionRoot: React.FC = () => (
  <>
    <Still id='BrandCard' component={BrandCard} width={1080} height={1920} />
    <Still id='ThumbnailDemo' component={ThumbnailDemo} width={1080} height={1920} />
  </>
);
// Composition is imported for the video entries that get added per edit file.
void Composition;
