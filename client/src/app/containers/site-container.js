import { Component } from 'react';
import {connect} from 'react-redux';
import {fetchSiteData, updateFilterText, incrementWeekOffset, decrementWeekOffset} from '../actions/campsite-actions';
import {getFilterText, getSiteAvailability, getDates} from '../reducers/campsite-reducer';
import {campSiteKey} from '../reducers/index';

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
    siteAvailability: getSiteAvailability(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSiteData: () => dispatch(fetchSiteData()),
    filterTextFt: (text) => dispatch(updateFilterText(text)),
    incrementWeekOffset: () => dispatch(incrementWeekOffset()),
    decrementWeekOffset: () => dispatch(decrementWeekOffset())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SiteContainer);
