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
  '001': { left: '2071px', top: '670px' },
  '010': { top: `554px`, left: `1763px` },
  '012': { left: '1685px', top: '660px' },
  '022': { left: '1542px', top: '977px' },
  '023': { left: '1563px', top: '860px' },
  '030': { left: '1267px', top: '1721px' },
  '040': { left: '1440px', top: '1953px' },
  '080': { left: '1151px', top: '2114px' },
  '088': { left: '892px', top: '1826px' },
  '101': { left: '777px', top: '1425px' },
  '120': { left: '1207px', top: '460px' },
  '118': { left: '1279px', top: '545px' },

};

const MapDisplay = ({ dates, siteAvailability }) => {
  const markers = siteAvailability.reduce((acc, campsite, idx) => {
    const siteId = campsite.get('id');
    const siteCoord = siteCoords[siteId];

    // else if availablity.get(0) !== 'NA'
    if (!siteCoord) {
      console.log(`'${siteId}': {},`);
    }
    else {
      const markerCoords = css(siteCoord);
      acc.push((
        <div key={siteId} css={[OverlayStyle, markerCoords]}>
          <div css={siteNumberStyle}>{siteId}</div>
        </div>
      ));
    }
    return acc;
  }, []);

  const moveMove = (e) => {
    console.log(`{left:'${e.pageX - 2}px', top:'${e.pageY - 46}px'},`);
  };

  return (
    <div css={MapContainerStyle} onClick={moveMove}>
      {
        markers
      }
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
