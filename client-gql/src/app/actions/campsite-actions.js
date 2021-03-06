import agent from 'superagent';
import Immutable from 'immutable';
import { fetchError } from './error-actions';

export const FETCHED_SITE_DATA = 'FETCHED_SITE_DATA';
export const FILTER_TEXT_CHANGED = 'FILTER_TEXT_CHANGED';
export const INCREMENT_WEEK_OFFSET = 'INCREMENT_WEEK_OFFSET';
export const DECREMENT_WEEK_OFFSET = 'DECREMENT_WEEK_OFFSET';
export const TOGGLE_AVAILABLE = 'TOGGLE_AVAILABLE';
export const TOGGLE_MAP = 'TOGGLE_MAP';

const fetchedSiteData = (payload) => {
    return {
        type: FETCHED_SITE_DATA,
        payload: payload
    };
};

export function updateFilterText(text) {
    return {
        type: FILTER_TEXT_CHANGED,
        payload: text
    };
}

export function incrementWeekOffset() {
    return {
        type: INCREMENT_WEEK_OFFSET
    };
}

export function decrementWeekOffset() {
    return {
        type: DECREMENT_WEEK_OFFSET
    };
}

export function toggleAvailable() {
    return {
        type: TOGGLE_AVAILABLE
    };
}

export function toggleMap() {
  return {
    type: TOGGLE_MAP
  };
}

export function fetchSiteData() {
    return (dispatch) => {
        agent.get('http://localhost:8080/api/availability').end(
            (err, res) => {
                if (res && res.ok) {
                    /*
                    validate that we have the same number of dates here?
                     */
                    dispatch(fetchedSiteData(Immutable.fromJS(res.body)));
                } else {
                    dispatch(fetchError());
                }
            }
        );
    };
}
