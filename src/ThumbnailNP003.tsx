import React from 'react';
import { SkyStadiumThumb } from './thumbs/SkyStadiumThumb';

// NP-003 cover: Europa League MD2, graphics-led (crests carry it, no player cut-out).
export const ThumbnailNP003: React.FC = () => (
  <SkyStadiumThumb stoppage top='EUROPA LEAGUE' bottom='3 PICKS' player='np-003/logos/none.png' leftLogo='np-003/logos/ben.png' rightLogo='np-003/logos/fer.png' />
);
