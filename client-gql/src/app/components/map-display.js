import React from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const MapDivStyle = css`
  background-image: url(/campsite_map_small-2016.jpg);
  min-height: 2883px;
  background-repeat: no-repeat;
  background-size: auto;
  margin-top: 1rem;
  margin-left: 2rem;
  width: 100%;
`;

const MapContainerStyle = css`
  display: flex;
  justify-content: center;
`;

const OverlayStyle = css`
  position: absolute;
  width: 0;
  height: 0;
  border-left: 22px solid transparent;
  border-right: 27px solid transparent;
  border-bottom: 47px solid SpringGreen;
`;

const siteNumberStyle = css`
  position: relative;
  top: 18px;
  color: white;
  left: -10px;
`;

const siteCoords = {
  10: { top: `554px`, left: `1763px`},
  22: {left:'1542px', top:'977px'},
  23: {left:'1563px', top:'860px'},
  120: {left:'1207px', top:'460px'},
  118: {left:'1279px', top:'545px'},
};

const MapDisplay = ({dates}) => {
  const siteNumber = 22;
  let markerCoords = css(siteCoords[siteNumber]);

  const moveMove = (e) => {
    console.log(`{left:'${e.pageX - 2}px', top:'${e.pageY -46}px'},`);
    markerCoords = css({left: `${e.pageX - 2}px`, top: `${e.pageY + 26}px`})
  };

  return (
    <div css={MapContainerStyle} onClick={moveMove}>
      <div css={[OverlayStyle, markerCoords]}>
        <div css={siteNumberStyle}>{siteNumber}</div>
      </div>
      <div css={MapDivStyle}>
      </div>
    </div>
  );
};

export default MapDisplay;

/*
https://inkplant.com/code/get-image-coordinates-with-jquery
https://www.quackit.com/css/css_color_codes.cfm
 */
