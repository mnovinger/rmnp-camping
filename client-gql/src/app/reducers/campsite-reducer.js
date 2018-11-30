import Immutable from 'immutable';
import moment from 'moment';
import {
  FETCHED_SITE_DATA,
  FILTER_TEXT_CHANGED,
  DECREMENT_WEEK_OFFSET,
  INCREMENT_WEEK_OFFSET,
  TOGGLE_AVAILABLE,
  TOGGLE_MAP
} from '../actions/campsite-actions';

export const initialState = Immutable.fromJS({
  campsiteData: [],
  allDates: [],
  selectedDates: [],
  filterText: '',
  weekOffset: 0,
  showOnlyAvailable: false,
  showMap: false
});

export function getFilterText(state) {
  return state.get('filterText');
}

export function getSiteAvailability(state) {
  const filteredSites = state.get('campsiteData').filter((site) => {
    return site.get('name').toUpperCase().includes(getFilterText(state).toUpperCase());
  });

  return filteredSites.map((site) => {
    const numOfDays = state.get("showMap") ? 1 : 7;
    const filteredStatus = site.get('availability').skip(getWeekOffset(state) * numOfDays).take(7);
    return site.set('availability', filteredStatus);
  });
}

export function getDates(state) {
  const numOfDays = state.get("showMap") ? 1 : 7;
  return state.get('allDates').skip(getWeekOffset(state) * numOfDays).take(7);
}

export function getWeekOffset(state) {
  return state.get('weekOffset');
}

export function getShouldShowOnlyAvailable(state) {
  return state.get('showOnlyAvailable');
}

export function getShouldShowMap(state) {
  return state.get('showMap');
}

export function campSiteReducer(state = initialState, action = null) {
  switch (action.type) {
    case TOGGLE_MAP: {
      return state.set('showMap', !state.get('showMap'));
    }
    case TOGGLE_AVAILABLE: {
      return state.set('showOnlyAvailable', !state.get('showOnlyAvailable'));
    }
    case DECREMENT_WEEK_OFFSET: {
      const current = state.get('weekOffset');
      if (current >= 1) {
        return state.set('weekOffset', current - 1);
      } else {
        return state;
      }
    }
    case INCREMENT_WEEK_OFFSET:
      return state.set('weekOffset', state.get('weekOffset') + 1);
    case FETCHED_SITE_DATA: {
      const sites = action.payload.get('sites');
      const lastUpdated = action.payload.get('lastUpdated');
      /*
       normalize the dates to moment objects and sort them.
       */
      const allDates = sites.get(0).get('availability')
        .map((date) => {
          return moment(date, 'M/D/YYYY');
        });
      const campSiteData = sites.sort();
      return state.set('campsiteData', campSiteData)
        .set('allDates', allDates)
        .set('lastUpdated', lastUpdated);
    }
    case FILTER_TEXT_CHANGED:
      return state.set('filterText', action.payload);

    default:
      return state;
  }
}
