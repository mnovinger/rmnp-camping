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
  justify-content: flex-start;
  width: 80%;
`;

const FilterFlexItem = css`
  margin-right: 1rem;
`;

const FilterLabels = css`
  display: inline-block;
`;

const ControlsStyles = css`
  background-color: rgba(0, 0, 0, 0.43);
  position: fixed;
  top: 199px;
  margin-left: 1rem;
  color: white;
  width: 66rem;
  padding-top: 1rem;
  border: 2px solid white;
`;

const HeaderStyle = css`
  background-image: url(/hallet-peak-at-dream-lake.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: 0% 65%; 
  min-height: 300px;
  margin-top: 1rem;
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
    siteAvailability: siteAvailability,
  };

  return (
    <div>
      <div className="container-fluid header-container">
        <div css={HeaderStyle}/>
        <div className="logo"/>
        <div css={ControlsStyles}>
          <div css={FilterContainer}>
            <FilterInput {...filterProps}/>
            <CalendarControl {...calendarControlProps}/>
          </div>
          <div css={FilterContainer}>
            <div css={FilterFlexItem}>
              <input type="checkbox" label="Filter Unavailable" onClick={toggleAvailable} checked={showOnlyAvailable}/>
              <p css={FilterLabels} onClick={toggleAvailable} >Only show sites with availability.</p>
            </div>
            <div css={FilterFlexItem}>
              <input type="checkbox" label="Show Map" onClick={toggleMapFt} checked={showMap}/>
              <p css={FilterLabels} onClick={toggleMapFt} >Show map.</p>
            </div>
            {
              showMap && dates.get(0) && <div css={FilterFlexItem}><p css={FilterLabels}>Availability for {dates.get(0).format('ddd MM/DD')}</p></div>
            }
          </div>
        </div>
      </div>
      {!showMap && <SiteTable {...tableProps}/>}
      {showMap && <MapDisplay {...mapDisplayProps}/>}
    </div>
  );
};

export default Site;
