/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
/* eslint-enable no-unused-vars */
import { connect } from 'react-redux';

import Site from '../components/site';
import { fetchSiteData, updateFilterText, incrementWeekOffset, decrementWeekOffset, toggleAvailable } from '../actions/campsite-actions';
import { getFilterText, getSiteAvailability, getDates, getShouldShowOnlyAvailable } from '../reducers/campsite-reducer';
import { campSiteKey } from '../reducers/index';

export class SiteContainer extends Component {

    componentDidMount() {
        this.props.fetchSiteData();
    }

    render() {
        return <Site { ...this.props }/>;
    }
}

function mapStateToProps(state) {
    state = state[campSiteKey];

    return {
        state: state,
        filterText: getFilterText(state),
        dates: getDates(state),
        siteAvailability: getSiteAvailability(state),
        showOnlyAvailable: getShouldShowOnlyAvailable(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchSiteData: () => dispatch(fetchSiteData()),
        filterTextFt: (text) => dispatch(updateFilterText(text)),
        incrementWeekOffset: () => dispatch(incrementWeekOffset()),
        decrementWeekOffset: () => dispatch(decrementWeekOffset()),
        toggleAvailable: () => dispatch(toggleAvailable())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SiteContainer);
