import React from 'react';
import { SkyStadiumThumb } from './thumbs/SkyStadiumThumb';

// NP-001 cover: no player cut-out available (graphics-led build), so the club roundels carry it.
export const ThumbnailNP001: React.FC = () => (
  <SkyStadiumThumb stoppage top='CHAMPIONS LEAGUE' bottom='3 PICKS' player='np-001/graphics/none.png' leftLogo='np-001/graphics/mci.png' rightLogo='np-001/graphics/rma.png' />
);
