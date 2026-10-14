import React from 'react';
import { Still } from 'remotion';
import { SkyStadiumThumb } from './thumbs/SkyStadiumThumb';

// Video-041 cover (the Packers side, TNF). Love and Watson carry it - both legs of the payoff.
export const Thumbnail041: React.FC = () => (
  <SkyStadiumThumb top='PACKERS SIDE' bottom='LOVE FOR 2 TDS' player='video-041/headshots/jordanlove.png' player2='video-041/headshots/christianwatson.png'
    leftLogo='video-041/logos/packers_logo.webp' rightLogo='video-041/logos/falcons_logo.webp' field='video-034/graphics/thumb_field.jpg' topSize={130} />
);

export const Thumbnail041Composition: React.FC = () => <Still id='Thumbnail041' component={Thumbnail041} width={1080} height={1920} />;
