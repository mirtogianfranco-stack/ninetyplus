import React from 'react';
import { SkyStadiumThumb } from './thumbs/SkyStadiumThumb';

// NP-002 cover: results for NP-001. No player cut-out (graphics-led), roundels carry it.
export const ThumbnailNP002: React.FC = () => (
  <SkyStadiumThumb stoppage top='LAST NIGHT' bottom='2 FROM 3' player='np-002/graphics/none.png' leftLogo='np-002/graphics/avl.png' rightLogo='np-002/graphics/rma.png' />
);
