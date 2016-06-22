import agent from 'superagent';
import Immutable from 'immutable';
export const FETCHED_SITE_DATA = 'FETCHED_SITE_DATA';

var fetchedSiteData = (payload) => {
    return {
        type: FETCHED_SITE_DATA,
        payload: payload
    }
};

export function fetchSiteData() {
    return (dispatch) => {

        agent.get('/campsite-status.json').end(
            (err, res) => {
                if (res && res.ok) {
                    dispatch(fetchedSiteData(Immutable.fromJS(res.body)));
                }
            }
        );
    }
}