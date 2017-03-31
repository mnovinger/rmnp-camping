import Immutable from 'immutable';
import { FETCH_ERROR, CLEAR_ERROR } from '../actions/error-actions';

export const initialState = Immutable.fromJS({
  hasError: false,
  errorMessage: ""
});

export function errorReducer(state = initialState, action = null) {
  switch (action.type) {
    case FETCH_ERROR:
      return state.set('errorMessage', action.payload).set('hasError', true);
    case CLEAR_ERROR:
      return state.set('errorMessage', "").set('hasError', false);
    default:
      return state;
  }
}