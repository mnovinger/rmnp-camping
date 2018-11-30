import React from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
/* eslint-enable no-unused-vars */
import './styles/site.css';
import FilterInput from './filter-input';
import SiteTable from './site-table';
import CalendarControl from './calendar-control';
import MapDisplay from './map-display';

const FilterContainer = css`
  display: inline-block;
  margin-left: 1rem;
  display: flex;
  justify-content: space-around;
  width: 50%;
`;

const FilterLabels = css`
  display: inline-block;
`;

const Site = ({ filterTextFt, filterText, dates, siteAvailability, showOnlyAvailable, incrementWeekOffset, decrementWeekOffset, toggleAvailable, showMap, toggleMapFt }) => {
  const filterProps = {
    filterTextFt: filterTextFt,
    filterText: filterText
  };

  const tableProps = {
    dates: dates,
    campSiteData: siteAvailability,
    showOnlyAvailable: showOnlyAvailable
  };

  const calendarControlProps = {
    dates: dates,
    incrementWeekOffset: incrementWeekOffset,
    decrementWeekOffset: decrementWeekOffset
  };

  const mapDisplayProps = {
    dates: dates,
  };

  return (
    <div>
      <div className="container-fluid header-container">
        <div className="header"></div>
        <div className="logo"></div>
        <div className="controls">
          <FilterInput {...filterProps}/>
          <CalendarControl {...calendarControlProps}/>
          <div css={FilterContainer}>
            <div>
              <input type="checkbox" label="Filter Unavailable" onClick={toggleAvailable} value={showOnlyAvailable}/>
              <p css={FilterLabels}>Only show sites with availability.</p>
            </div>
            <div>
              <input type="checkbox" label="Show Map" onClick={toggleMapFt} value={showMap}/>
              <p css={FilterLabels}>Show Map.</p>
              {showMap && <p css={FilterLabels}>Availability for {dates.get(0).format('ddd MM/DD')}</p>}
            </div>
          </div>
        </div>
      </div>
      {!showMap && <SiteTable {...tableProps}/>}
      {showMap && <MapDisplay {...mapDisplayProps}/>}
    </div>
  );
};

export default Site;
