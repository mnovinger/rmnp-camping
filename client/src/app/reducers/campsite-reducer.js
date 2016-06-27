import Immutable from 'immutable';
/*eslint no-unused-vars:0 */
import util from 'util';
import { FETCHED_SITE_DATA, FILTER_TEXT_CHANGED } from '../actions/campsite-actions';

export const initialState = Immutable.fromJS({
    campsiteData: [],
    allDates: [],
    selectedDates: [],
    filterText: ""
});

export function getFilterText(state) {
    return state.get('filterText');
}

export function getSiteAvailability(state) {
    return state.get('campsiteData');
}

export function getDates(state) {
    return state.get('allDates');
}

export function campSiteReducer(state = initialState, action = null) {
    switch (action.type) {
        case FETCHED_SITE_DATA:
            const cgData = action.payload.get('cgSiteData');
            const allDates = action.payload.get('allDates');
            return state.set('campsiteData',cgData).set('allDates',allDates);

        case FILTER_TEXT_CHANGED:
            return state.set('filterText', action.payload);

        default:
            return state;
    }
}