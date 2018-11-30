import React from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const CalendarControlStyle = css`
  margin-left: 3rem;
  display: inline-block;
`;

const CalendarTextStyle = css`
  margin: 0 2rem 0 2rem;
  font-size: large;
  display: inline-block;
`;

const CalendarArrowStyles = css({
  'max-width': '3rem',
  'height': 'auto',
  ':hover': {'box-shadow': '0 5px #666'},
  ':active': {'transform': 'translateY(4px)'},
});

const CalendarControl = ({ decrementWeekOffset, incrementWeekOffset }) => {
  return (
    <div css={CalendarControlStyle}>
      <img css={CalendarArrowStyles} src="kuba_arrow_back.png" onClick={decrementWeekOffset}/>
      <div css={CalendarTextStyle}>Move calendar</div>
      <img css={CalendarArrowStyles}  src="kuba_arrow_forward.png" onClick={incrementWeekOffset}/>
    </div>
  );
};

export default CalendarControl;
