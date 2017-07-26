/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
/* eslint-enable no-unused-vars */
import './styles/site.css';
import FilterInput from './filter-input';
import SiteTable from './site-table';
import CalendarControl from './calendar-control';

export default class Site extends Component {
    render() {
        const filterProps = {
            filterTextFt: this.props.filterTextFt,
            filterText: this.props.filterText
        };
        const tableProps = {
            dates: this.props.dates,
            campSiteData: this.props.siteAvailability,
            showOnlyAvailable: this.props.showOnlyAvailable
        };
        const calendarControlProps = {
            dates: this.props.dates,
            incrementWeekOffset: this.props.incrementWeekOffset,
            decrementWeekOffset: this.props.decrementWeekOffset
        };
        return (
          <div>
              <div className="container-fluid header-container">
                  <div className="header"></div>
                  <div className="logo"></div>
                  <div className="controls">
                      <FilterInput { ...filterProps }/>
                      <CalendarControl { ...calendarControlProps }/>
                      <div className="filter-available">
                          <input type="checkbox" label="Filter Unavailable" onClick= { this.props.toggleAvailable } value={ this.props.showOnlyAvailable }/>
                          <p>Only sites with availability.</p>
                      </div>
                  </div>
              </div>
              <SiteTable { ...tableProps }/>
          </div>
        );
    }
}