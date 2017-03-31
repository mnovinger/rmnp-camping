/*eslint no-unused-vars:0 */
import { combineReducers } from 'redux';
import { campSiteReducer, stateKey } from './campsite-reducer';
import { errorReducer } from './error-reducer';

export const campSiteKey = 'campsite';
export const errorKey = 'error';

const reducerConfig = {
    'campsite': campSiteReducer,
    'error': errorReducer,
};

export default combineReducers(reducerConfig);