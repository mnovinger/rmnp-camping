import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSiteData,updateFilterText } from './actions/campsite-actions';
import { getFilterText, getSiteAvailability, getDates } from './reducers/campsite-reducer';
import FilterInput from './components/filter-input';
import SiteTable from './components/site-table';


class ViewerApp extends Component {

    componentDidMount() {
        this.props.fetchSiteData();
    }

    render() {
        const filterProps = {filterTextFt: this.props.filterTextFt, filterText: this.props.filterText};
        const tableProps = {dates: this.props.dates, campSiteData: this.props.siteAvailability};
        return (
            <div>
                <FilterInput { ...filterProps }/>
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
        filterTextFt: (text) => dispatch(updateFilterText(text))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewerApp);