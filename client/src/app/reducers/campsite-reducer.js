import Immutable from 'immutable';
/*eslint no-unused-vars:0 */
import util from 'util';
import {FETCHED_SITE_DATA} from '../actions/campsite-actions';

export const initialState = Immutable.fromJS({
    campsiteData: [],
    allDates: [],
    selectedDates: []
});

export function campSiteReducer(state = initialState, action = null) {
    switch (action.type) {
        case FETCHED_SITE_DATA:
            const cgData = action.payload.get('cgSiteData');
            const allDates = action.payload.get('allDates');

            return state.set('campsiteData',cgData).set('allDates',allDates);
        default:
            return state;
    }
}