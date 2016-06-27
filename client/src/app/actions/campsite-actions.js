import agent from 'superagent';
import Immutable from 'immutable';
export const FETCHED_SITE_DATA = 'FETCHED_SITE_DATA';
export const FILTER_TEXT_CHANGED = 'FILTER_TEXT_CHANGED';

var fetchedSiteData = (payload) => {
    return {
        type: FETCHED_SITE_DATA,
        payload: payload
    }
};

export function updateFilterText(text) {
    return {
        type: FILTER_TEXT_CHANGED,
        payload: text
    }
}

export function fetchSiteData() {
    return (dispatch) => {

        agent.get('/campsite-status.json').end(
            (err, res) => {
                if (res && res.ok) {
                    /*
                    validate that we have the same number of dates here?
                     */
                    dispatch(fetchedSiteData(Immutable.fromJS(res.body)));
                }
            }
        );
    }
}