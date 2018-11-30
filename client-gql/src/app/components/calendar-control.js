import React from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const CalendarControlStyle = css`
  display: flex;
  justify-content: space-between;
`;

const CalendarTextStyle = css`
  margin: 0 2rem 0 2rem;
  font-size: large;
  display: inline-block;
`;

const CalendarArrowStyles = css({
  ':hover': {'fill': 'yellow'},
  ':active': {'transform': 'translateY(4px)'},
  'transform': 'scale(2)',
});

const CalendarControl = ({ decrementWeekOffset, incrementWeekOffset }) => {
  return (
    <div css={CalendarControlStyle}>
      <ArrowLeftIcon css={CalendarArrowStyles} onClick={decrementWeekOffset}/>
      <div css={CalendarTextStyle}>Move calendar</div>
      <ArrowRightIcon css={CalendarArrowStyles} onClick={incrementWeekOffset}/>
    </div>
  );
};

export default CalendarControl;
