import Immutable from 'immutable';
import moment from 'moment';
/*eslint no-unused-vars:0 */
import util from 'util';
import { FETCHED_SITE_DATA, FILTER_TEXT_CHANGED, DECREMENT_WEEK_OFFSET, INCREMENT_WEEK_OFFSET } from '../actions/campsite-actions';

export const initialState = Immutable.fromJS({
    campsiteData: [],
    allDates: [],
    selectedDates: [],
    filterText: "",
    weekOffset: 0
});

export function getFilterText(state) {
    return state.get('filterText');
}

function grabWeek() {

}

export function getSiteAvailability(state) {
    const filteredSites = state.get('campsiteData').filter((site) => {
        return site.get('name').toUpperCase().includes(getFilterText(state).toUpperCase());
    });

    return filteredSites.map((site) => {
        const filteredStatus = site.get('status').skip(getWeekOffset(state) * 7).take(7);
        return site.set('status', filteredStatus);
    });
}

export function getDates(state) {
    return state.get('allDates').skip(getWeekOffset(state) * 7).take(7);
}

function getWeekOffset(state) {
    return state.get('weekOffset');
}

export function campSiteReducer(state = initialState, action = null) {
    switch (action.type) {
        case DECREMENT_WEEK_OFFSET:
            const current = state.get('weekOffset');
            if (current > 1) {
                return state.set('weekOffset', current - 1);
            } else {
                return state;
            }
        case INCREMENT_WEEK_OFFSET:
            return state.set('weekOffset', state.get('weekOffset') + 1);
        case FETCHED_SITE_DATA:
            /*
            normalize the dates to moment objects and sort them.
             */
            const allDates = action.payload.get('allDates')
                .map((date) => {
                    return moment(date,'M/D/YYYY')
                })
                .sort((a,b) => {
                    return a.isBefore(b) ? -1 : 1
                });
            const cgData = action.payload.get('cgSiteData')
                .map((site) => {
                    const status = site.get('status')
                        .map((status) => {
                            return status.set('date', moment(status.get('date'), 'M/D/YYYY'));
                        })
                        .sort((a,b) => {
                            return a.get('date').isBefore(b.get('date')) ? -1 : 1
                        });
                    return site.set('status',status);
                });
            return state.set('campsiteData',cgData).set('allDates',allDates);

        case FILTER_TEXT_CHANGED:
            return state.set('filterText', action.payload);

        default:
            return state;
    }
}