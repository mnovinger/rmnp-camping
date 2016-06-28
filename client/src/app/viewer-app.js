import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSiteData,updateFilterText, incrementWeekOffset, decrementWeekOffset } from './actions/campsite-actions';
import { getFilterText, getSiteAvailability, getDates, getWeekOffset } from './reducers/campsite-reducer';
import FilterInput from './components/filter-input';
import SiteTable from './components/site-table';
import CalendarControl from './components/calendar-control';


class ViewerApp extends Component {

    componentDidMount() {
        this.props.fetchSiteData();
    }

    render() {
        const filterProps = {
            filterTextFt: this.props.filterTextFt,
            filterText: this.props.filterText
        };
        const tableProps = {
            dates: this.props.dates,
            campSiteData: this.props.siteAvailability
        };
        const calendarControlProps = {
            dates: this.props.dates,
            incrementWeekOffset: this.props.incrementWeekOffset,
            decrementWeekOffset: this.props.decrementWeekOffset
        };
        return (
            <div>
                <div className="controls"><FilterInput { ...filterProps }/> <CalendarControl { ...calendarControlProps }/> </div>
                <SiteTable { ...tableProps }/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        state: state,
        filterText: getFilterText(state),
        dates: getDates(state),
        siteAvailability: getSiteAvailability(state)
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchSiteData: () => dispatch(fetchSiteData()),
        filterTextFt: (text) => dispatch(updateFilterText(text)),
        incrementWeekOffset: () => dispatch(incrementWeekOffset()),
        decrementWeekOffset: () => dispatch(decrementWeekOffset())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewerApp);