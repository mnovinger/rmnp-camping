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
  width: 2459px;
`;

const AvailableOverlayStyle = css`
  position: absolute;
  width: 0;
  height: 0;
  border-left: 22px solid transparent;
  border-right: 27px solid transparent;
  border-bottom: 47px solid SpringGreen;
`;

const UnAvailableOverlayStyle = css`
  position: absolute;
  width: 0;
  height: 0;
  border-left: 22px solid transparent;
  border-right: 27px solid transparent;
  border-bottom: 47px solid Red;
`;

const siteNumberStyle = css`
  position: relative;
  top: 18px;
  color: white;
  left: -10px;
`;

const siteCoords = {
  '001': { left: '2071px', top: '670px' },
  '006': {left:'1929px', top:'717px'},
  '007': {left:'1878px', top:'692px'},
  '008': {left:'1831px', top:'671px'},
  '009':{left:'1823px', top:'624px'},
  '010': { top: `554px`, left: `1763px` },
  '011': {left:'1735px', top:'671px'},
  '011GS': {left:'1735px', top:'671px'},
  '012': { left: '1685px', top: '660px' },
  '022': { left: '1542px', top: '977px' },
  '023': { left: '1563px', top: '860px' },
  '025': {left:'1382px', top:'1510px'},
  '026': { left: '1369px', top: '1580px' },
  '027': { left: '1332px', top: '1624px' },
  '028': { left: '1308px', top: '1682px' },
  '029': { left: '1297px', top: '1638px' },
  '030': { left: '1267px', top: '1721px' },
  '032': {left:'1528px', top:'1658px'},
  '033': {left:'1524px', top:'1717px'},
  '031': { left: '1367px', top: '1760px' },
  '034': {left:'1492px', top:'1746px'},
  '040': { left: '1440px', top: '1953px' },
  '073': { left: '913px', top: '1988px' },
  '080': { left: '1151px', top: '2114px' },
  '088': { left: '892px', top: '1826px' },
  '092': {left:'1006px', top:'1676px'},
  '093': {left:'961px', top:'1653px'},
  '101': { left: '777px', top: '1425px' },
  '116': { left: '1133px', top: '589px' },
  '117': {left:'1191px', top:'590px'},
  '120': { left: '1207px', top: '460px' },
  '118': { left: '1279px', top: '545px' },
  '119IS': {left:'1219px', top:'543px'},

};

const MapDisplay = ({ dates, siteAvailability }) => {
  const markers = siteAvailability.reduce((acc, campsite, idx) => {
    const siteId = campsite.get('id');
    const siteCoord = siteCoords[siteId];

    if (!siteCoord) {
      console.log(`'${siteId}': {},`);
    }
    else {
      const status = campsite.get('availability').get(0).get('status');
      let overlay;
      if (status !== 'NA' && status !== 'FULL') {
        overlay = AvailableOverlayStyle;
      }
      else {
        overlay = UnAvailableOverlayStyle;
      }

      const markerCoords = css(siteCoord);
      acc.push((
        <div key={siteId} css={[overlay, markerCoords]}>
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
